# Part 03: Hashing — Module 03: Hash Table, Hash Map & Hash Set Architectures

> **Topics Covered:**  
> 41. Hash Table Architecture & Dynamic Rehashing &bull; 42. Hash Map (Key-Value Associative Dictionaries, Invariants & Entry Sets) &bull; Production Collision Optimizations (Java 8+ Bucket Treeification & Python Compact Hash Tables) &bull; 43. Hash Set (Deduplication Engine, Backing Mechanics & Mathematical Set Operations) &bull; 44. Master Comparison: Hash Table vs Hash Map vs Hash Set vs Tree Structures

---

Associative data structures represent the backbone of practical software engineering, powering database primary keys, symbol tables, routing caches, and in-memory key-value stores. While Hash Tables, Hash Maps, and Hash Sets are often used interchangeably in colloquial discussion, they embody distinct mathematical contracts, memory representations, and concurrency profiles. This chapter examines the core mechanics of associative arrays, dynamic rehashing invariants, modern runtime defenses against Hash-DoS attacks (such as Java 8+ bucket treeification and Python 3.6+ compact sparse/dense layouts), mathematical set algebra algorithms, and trade-offs against tree-based structures.

### Learning Objectives
- Differentiate Hash Tables, Hash Maps, and Hash Sets by their formal mathematical invariants, interface contracts, and physical memory configurations.
- Implement dynamic table rehashing and prove why existing elements must be recomputed via $h(k) \pmod{m_{\text{new}}}$ rather than copied verbatim.
- Analyze production engine optimizations that foil Hash DoS attacks, including Java 8+ Red-Black tree bucket treeification and Python 3.6+ compact indices.
- Construct a Hash Set as an abstraction over an internal Hash Map with sentinel constants and determine optimal time complexities for set operations ($\cap, \cup, \setminus$).
- Evaluate the asymptotic and practical performance trade-offs between hash-based associative containers and self-balancing binary search trees.

---

## Topic 41: Hash Table Architecture & Dynamic Rehashing

### 1. Conceptual Architecture & Associative Taxonomy

The associative family spans three distinct container archetypes:

| Associative Archetype | Mathematical Contract | Key Invariant | Value Payload | Primary Systems Role |
| :--- | :--- | :--- | :--- | :--- |
| **Hash Table** | Low-level bucket-indexed array | Keys must support hashing & equality | Directly stores key-value pairs in buckets | Foundational runtime building block |
| **Hash Map** | Functional mapping $f: K \to V$ | Keys are strictly unique ($K \to V$) | Stores arbitrary client value $V$ per key | General-purpose dictionary / cache |
| **Hash Set** | Mathematical finite set $S \subset \mathcal{U}$ | Elements are strictly unique ($E$) | Zero payload (value replaced by 0-byte sentinel) | High-speed deduplication & membership query |

---

### 2. The Necessity of Dynamic Rehashing

As elements are inserted, the load factor $\alpha = n / m$ increases:
- In **Separate Chaining**, chains grow to average depth $\alpha$. When $\alpha \gg 1$, search latency degenerates to an unacceptably slow $\Theta(n)$ linear traversal.
- In **Open Addressing**, probe lengths increase rapidly. As $\alpha \to 1.0$, insertion time explodes toward infinity.

#### The Rehashing Threshold (commonly $\alpha \ge 0.75$)
With a suitable hash function and collision-resolution strategy, keeping the load factor controlled typically preserves expected $O(1)$ operations. A common threshold is $\alpha \ge 0.75$, at which point implementations often:
1. Allocate a new backing array with approximately double capacity ($m_{\text{new}} \approx 2m_{\text{old}}$, chosen as the next prime number to mitigate modulo harmonic clustering).
2. **Recompute all element indices**: Every single active key must be passed through the hash function modulo the new capacity:
   $$\text{New Index} = h(k) \pmod{m_{\text{new}}}$$
3. Deallocate the old backing array.

> ⚠️ **The Rehashing Anti-Pattern**:  
> One cannot simply block-copy (`memcpy`) buckets to the new table! Because the divisor $m$ changes ($k \pmod m \ne k \pmod{2m}$), virtually every existing key relocates to a completely different array index in the expanded memory block.

---

### 3. Production Specification: Separate Chaining Hash Table with Dynamic Rehashing

```text
CLASS HashNode:
    field key: KeyType
    field val: ValueType
    field next: HashNode Pointer <- NULL

    CONSTRUCTOR(k: KeyType, v: ValueType):
        this.key <- k
        this.val <- v

CLASS HashTable:
    field buckets: Array of HashNode Pointers
    field capacity: Integer
    field size: Integer <- 0
    field MAX_LOAD_FACTOR: Float <- 0.75

    CONSTRUCTOR(initialCapacity: Integer = 7):
        this.capacity <- initialCapacity
        this.size <- 0
        this.buckets <- allocate_memory(initialCapacity * sizeof(HashNode Pointer))
        for i from 0 to initialCapacity - 1:
            this.buckets[i] <- NULL

    FUNCTION Put(k: KeyType, v: ValueType) -> Void:
        idx <- (Hash(k) mod this.capacity + this.capacity) mod this.capacity
        curr <- this.buckets[idx]

        // 1. Check for key update
        while curr != NULL:
            if curr.key == k:
                curr.val <- v
                return
            curr <- curr.next

        // 2. Insert new node at bucket head
        newNode <- new HashNode(k, v)
        newNode.next <- this.buckets[idx]
        this.buckets[idx] <- newNode
        this.size <- this.size + 1

        // 3. Evaluate dynamic resize
        if (this.size / this.capacity) >= this.MAX_LOAD_FACTOR:
            this.Rehash(NextPrime(2 * this.capacity))

    FUNCTION Get(k: KeyType) -> ValueType:
        idx <- (Hash(k) mod this.capacity + this.capacity) mod this.capacity
        curr <- this.buckets[idx]
        while curr != NULL:
            if curr.key == k:
                return curr.val
            curr <- curr.next
        raise KeyNotFoundException("Key does not exist in table")

    PRIVATE FUNCTION Rehash(newCapacity: Integer) -> Void:
        oldBuckets <- this.buckets
        oldCap <- this.capacity
        this.capacity <- newCapacity
        this.buckets <- allocate_memory(newCapacity * sizeof(HashNode Pointer))
        for i from 0 to newCapacity - 1:
            this.buckets[i] <- NULL
        this.size <- 0

        for i from 0 to oldCap - 1:
            curr <- oldBuckets[i]
            while curr != NULL:
                this.Put(curr.key, curr.val)
                temp <- curr
                curr <- curr.next
                free(temp)
        free(oldBuckets)
```

---

## Topic 42: Hash Map (Key-Value Dictionary) & Production Optimizations

### 1. Functional Invariants & Collection Views

A **Hash Map** establishes an associative dictionary $f: K \to V$:
1. **Key Uniqueness**: Keys are unique. Inserting with an existing key replaces the previous value payload.
2. **Value Multiplicity**: Multiple keys may reference identical value payloads.
3. **Canonical Collection Views**:
   - `KeySet()`: An iterable collection containing all unique keys ($O(n)$ space).
   - `Values()`: An iterable collection containing all stored values (with potential duplicates).
   - `EntrySet()`: An iterable collection of $(k, v)$ pairs, enabling single-pass traversals without re-hashing keys.

---

### 2. Runtime Engineering: Neutralizing Hash-DoS Attacks

In high-concurrency cloud environments, if malicious users identify the hash function used by an application, they can transmit thousands of inputs designed to produce identical hash values (a **Hash Denial of Service / Hash DoS Attack**). This collapses all entries into a single bucket, converting $O(1)$ operations into $O(n)$ bottlenecks that exhaust server CPU resources.

#### Optimization A: Java 8+ Bucket Treeification

| Bucket State | Trigger Condition | Backing Data Structure | Search Time | Memory Profile |
| :--- | :--- | :--- | :---: | :--- |
| **Standard Bucket** | Chain length $< 8$ | Singly Linked List | $O(1 + \alpha)$ | Minimal ($8\text{ bytes}$ pointer / node) |
| **Treeified Bucket** | Chain length $\ge 8$ and $m \ge 64$ | **Red-Black Tree** | **$O(\log n)$** | Slightly higher node footprint; strictly foils Hash-DoS |
| **Untreeified Bucket**| Chain shrinks to $\le 6$ nodes | Singly Linked List | $O(1 + \alpha)$ | Reclaimed tree pointer overhead |

#### Optimization B: Python 3.6+ Compact Hash Tables
Traditional open-addressing hash tables store an array of large 24-byte structs `(hash, key, value)`. Because open addressing requires $\alpha \le 0.67$, at least $33\%$ of the array consists of empty slots, wasting megabytes of memory.

Python resolves this by decoupling the hash index from data storage:
1. **Sparse Indices Array**: A compact array of small integer offsets (e.g., 1-byte `int8`).
2. **Dense Entries Array**: A contiguous, tightly packed array storing `(hash, key, value)` structs in exact insertion order.

| Structural Array | Element Type | Density | Architectural Benefit |
| :--- | :--- | :--- | :--- |
| **Indices Array** | `int8` / `int16` array index | Sparse ($33\%$ empty) | Tiny memory footprint (e.g., 1 byte per slot) |
| **Entries Array** | `(hash, key, value)` struct | **100% Dense** | Zero wasted memory; preserves insertion order! |

This layout reduces Python dictionary memory consumption by **$30\%\text{--}40\%$** while making dictionary iteration strictly deterministic.

---

## Topic 43: Hash Set (Deduplication Engine) & Set Theory Operations

### 1. Underlying Architecture: The Hash Map Wrapper

A **Hash Set** is an Abstract Data Type modeling mathematical finite sets. In production runtime libraries (such as Java `HashSet`, Python `set`, and C++ `std::unordered_set`), a Hash Set is implemented internally by wrapping a **Hash Map**:

```text
HashSet.Add("Omega")
       |
       v
Internal HashMap Storage:
       Key: "Omega"  ------->  Value: DUMMY_SENTINEL (Zero-byte static token)
```

Because the internal Hash Map enforces key uniqueness, the Hash Set inherits:
- Automatic deduplication with zero custom code.
- Expected $O(1)$ membership checks (`Contains`).
- Expected $O(1)$ removals (`Remove`).

---

### 2. Mathematical Set Operations & Algorithmic Complexities

Let $|A| = n$ and $|B| = m$:

| Set Operation | Mathematical Symbol | Algorithmic Implementation Strategy | Optimal Time | Auxiliary Space |
| :--- | :---: | :--- | :---: | :---: |
| **Membership** | $x \in A$ | Hash $x$, inspect internal map bucket | $\Theta(1)$ | $O(1)$ |
| **Intersection** | $A \cap B$ | Iterate through **smaller set**; query presence in larger set | $O(\min(n, m))$ | $O(\min(n, m))$ |
| **Union** | $A \cup B$ | Copy larger set into result, insert all elements of smaller set | $O(n + m)$ | $O(n + m)$ |
| **Difference** | $A \setminus B$ | Iterate through $A$; add elements that do not exist in $B$ | $O(n)$ | $O(n)$ |
| **Subset Test** | $A \subseteq B$ | If $n > m$ return false. Check if every element of $A$ is in $B$ | $O(n)$ | $O(1)$ |

> 💡 **Intersection Optimization**:  
> Always iterate through the set with fewer elements ($\min(n, m)$) and perform lookups into the larger set. Inverting this order when $n = 10$ and $m = 1,000,000$ wastes $999,990$ unnecessary hash queries!

---

## Topic 44: Master Architectural Comparison: Hash vs. Tree Containers

| Evaluation Axis | Classic Hash Table | Production Hash Map | Hash Set | Self-Balancing Tree (Red-Black / AVL) |
| :--- | :--- | :--- | :--- | :--- |
| **Data Stored** | Key-Value pairs | Key-Value pairs | Unique Keys only | Key-Value pairs or Unique Elements |
| **Element Ordering**| Arbitrary | Arbitrary (or insertion-ordered) | Arbitrary | **Strictly Sorted (In-Order Traversal)** |
| **Lookup Latency** | Expected $O(1)$, Worst $O(n)$ | Expected $O(1)$, Worst $O(\log n)^*$ | Expected $O(1)$, Worst $O(\log n)^*$ | **Guaranteed Worst-Case $O(\log n)$** |
| **Insert Latency** | Expected $O(1)$ amortized | Expected $O(1)$ amortized | Expected $O(1)$ amortized | **Guaranteed $O(\log n)$** |
| **Range Queries** | Unsupported ($O(n)$ scan) | Unsupported ($O(n)$ scan) | Unsupported ($O(n)$ scan) | **Optimal $O(\log n + k)$** |
| **Minimum / Maximum**| $O(n)$ full scan | $O(n)$ full scan | $O(n)$ full scan | **$O(\log n)$ (or $O(1)$ cached)** |
| **Key Requirement** | Must provide `hashCode` and `equals` | Must provide `hashCode` and `equals` | Must provide `hashCode` and `equals` | Must provide strict weak ordering (`<`) |
| **Primary Trade-off** | Raw constant-time access speed | High throughput with collision treeification | Fast deduplication and set algebra | Deterministic bounds & sorted range traversal |

---

### 5. Key Takeaways

1. **Rehashing Mechanics**: Dynamic rehashing requires recomputing new index slots for all existing elements via $h(k) \pmod{m_{\text{new}}}$; simple memory copying is invalid.
2. **Treeification (Java HashMap implementation strategy)**: One particular Java `HashMap` implementation converts long bucket chains toward balanced-tree bins around chain length 8 (subject to additional capacity/treeification/untreeification conditions). This is an implementation strategy, not an inherent property of hash tables.
3. **Compact Hash Tables**: Decoupling sparse indices from dense entries (as in Python 3.6+) eliminates empty gap memory waste and preserves insertion order.
4. **Set Optimization**: Hash Sets reuse Hash Map key machinery with dummy sentinels; set intersection achieves optimal $O(\min(n, m))$ time by driving lookups from the smaller set.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 11: *Hash Tables*, Chapter 13: *Red-Black Trees*. MIT Press.
2. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 6.4: *Hashing*. Addison-Wesley.
3. **Hettinger, R.** (2012). *Modern Dictionaries by More Compact Means*. Python Developers Conference (PyCon).
