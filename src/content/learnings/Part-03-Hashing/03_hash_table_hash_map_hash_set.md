# Part 03: Hashing — Module 03: Hash Table, Hash Map & Hash Set Architectures

> **Topics Covered:**  
> 40. Hash Table Architecture & Dynamic Rehashing &bull; Hash Map (Key-Value Associative Dictionaries, Invariants & Entry Sets) &bull; Production Collision Optimizations (Java 8+ Bucket Treeification & Python Compact Hash Tables) &bull; Hash Set (Deduplication Engine, Backing Mechanics & Mathematical Set Operations) &bull; Master Comparison: Hash Table vs Hash Map vs Hash Set vs Tree Structures

---

# TOPIC 40: HASH TABLE ARCHITECTURE & REHASHING

### 1. Topic Title
**Hash Table (Associative Key-Value Map Container & Dynamic Rehashing Mechanics)**

### 2. Category
Associative Key-Value Containers — Bucket-Indexed Hash Storage.

### 3. Difficulty
Intermediate.

### 4. Prerequisites
- Module 01: Hashing Foundations (Hash functions, Uniform distribution).
- Module 02: Collision Resolution (Chaining vs Open Addressing).

---

### 5. The Three Associative Archetypes: Table, Map, and Set

In everyday software engineering, the terms **Hash Table**, **Hash Map**, and **Hash Set** are frequently confused. Yet their mathematical definitions, API contracts, and memory models have distinct identities:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ASSOCIATIVE HASHING TAXONOMY                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
  ┌───────────────┐            ┌───────────────┐            ┌───────────────┐
  │  HASH TABLE   │            │   HASH MAP    │            │   HASH SET    │
  │ (Low-Level /  │            │ (Key-Value    │            │ (Unique Value │
  │ Classic Base) │            │  Dictionary)  │            │  Collection)  │
  └───────┬───────┘            └───────┬───────┘            └───────┬───────┘
          │                            │                            │
   Direct address               Maps Key (K)                 Stores unique
   bucket array of              to Value (V).                elements (E).
   (key, val) slots.            Unique keys.                 No duplicates.
```

---

### 6. The Necessity of Dynamic Rehashing

### Concept
As insertions increase, the load factor $\alpha = n / m$ increases. If the table capacity $m$ remains static:
- In **Separate Chaining**, chains grow to average length $\alpha$. When $\alpha \gg 1$, search degrades to a disastrous **$\Theta(n)$ linear scan**!
- In **Open Addressing**, probe sequences become extremely long. As $\alpha \to 1.0$, insertion time explodes towards infinity and open addressing fails completely.

### The Rehashing Invariant ($\alpha \ge 0.75$):
To preserve expected $O(1)$ performance, whenever $\alpha \ge 0.75$:
1. Allocate a new bucket array of roughly double capacity ($m_{new} \ge 2m_{old}$, ideally the next prime number to prevent clustering).
2. **Rehash all existing keys**: Recompute the new bucket index for every single active key:
$$\text{New Index} = h(k) \pmod{m_{new}}$$
3. Free the old bucket array.

> ⚠️ **CRITICAL MISTAKE**: You **cannot** simply copy or `memcpy` buckets from old indices to the new array! Because the modulus $m$ changed ($k \pmod m \ne k \pmod{2m}$), almost every single key moves to a completely different bucket index!

---

### 7. Complete Hash Table Pseudocode (Separate Chaining with Dynamic Rehashing)

```text
STRUCTURE HashNode
    key: KeyType
    val: ValueType
    next: HashNode pointer ← NULL

DATA STRUCTURE HashTable
    Fields:
        buckets: array of HashNode pointers
        capacity: integer ← 7      // Starting prime capacity
        size: integer ← 0          // Number of stored key-value pairs
        MAX_LOAD_FACTOR: float ← 0.75

    OPERATION Initialize(cap ← 7):
        capacity ← cap
        size ← 0
        buckets ← allocate array of size capacity, initialized to NULL

    OPERATION Hash(key):
        return (PolynomialHash(key) mod capacity + capacity) mod capacity

    OPERATION Put(key, value):
        idx ← Hash(key)
        curr ← buckets[idx]
        // 1. Check if key already exists (Update existing value)
        while curr ≠ NULL:
            if curr.key = key:
                curr.val ← value
                return
            curr ← curr.next
        // 2. Key does not exist: Insert new node at Head of chain
        newNode ← allocate HashNode
        newNode.key ← key
        newNode.val ← value
        newNode.next ← buckets[idx]
        buckets[idx] ← newNode
        size ← size + 1
        // 3. Dynamic Resize Trigger
        if (size / capacity) ≥ MAX_LOAD_FACTOR:
            Rehash(NextPrime(capacity * 2))

    OPERATION Get(key):
        idx ← Hash(key)
        curr ← buckets[idx]
        while curr ≠ NULL:
            if curr.key = key:
                return curr.val
            curr ← curr.next
        error "Key not found"

    OPERATION Remove(key):
        idx ← Hash(key)
        curr ← buckets[idx]
        prev ← NULL
        while curr ≠ NULL:
            if curr.key = key:
                if prev = NULL:
                    buckets[idx] ← curr.next
                else:
                    prev.next ← curr.next
                val ← curr.val
                deallocate curr
                size ← size - 1
                return val
            prev ← curr
            curr ← curr.next
        error "Key not found"

    OPERATION Rehash(newCapacity):
        oldBuckets ← buckets
        oldCapacity ← capacity
        capacity ← newCapacity
        buckets ← allocate array of size newCapacity, initialized to NULL
        size ← 0
        for i ← 0 to oldCapacity - 1:
            curr ← oldBuckets[i]
            while curr ≠ NULL:
                Put(curr.key, curr.val)
                temp ← curr
                curr ← curr.next
                deallocate temp
        deallocate oldBuckets
```

---
---

# TOPIC 40B: HASH MAP (ASSOCIATIVE KEY-VALUE DICTIONARY)

### 1. The Key-Value Contract & Unique Key Invariant

A **Hash Map** is an associative dictionary that establishes a functional mapping from a set of **Keys** to a set of **Values**:
$$f : K \to V$$

#### Core Invariants:
1. **Unique Key Invariant**: A given key $k$ can appear at most once in the map. Attempting to insert an existing key overwrites its associated value.
2. **Value Duplication Allowed**: Multiple distinct keys may map to identical values ($f(k_1) = f(k_2) = v$).
3. **Primary Collection Views**:
   - `KeySet()`: The set of all unique keys ($O(n)$ space).
   - `Values()`: The collection of all values (may contain duplicates).
   - `EntrySet()`: The set of all $(k, v)$ pairs.

---

### 2. Production Optimizations: How Modern Runtimes Prevent $O(n)$ Worst-Case Disasters

#### A. Java 8+ Bucket Treeification:
In classical separate chaining, if an adversary feeds a hash map millions of keys engineered to collide into the same bucket (a **Hash DoS Attack**), the chain degrades to length $n$, crippling server CPU.
- **Java's Solution**: When a bucket chain length reaches **8 (TREEIFY_THRESHOLD)** and total table capacity is at least 64, the linked list chain is dynamically transformed into a **Red-Black Tree**!
- Search time in the saturated bucket instantly drops from **$O(n)$ down to $O(\log n)$**! If items are deleted and bucket size drops to **6 (UNTREEIFY_THRESHOLD)**, the tree is flattened back into a simple linked list to save memory.

```text
NORMAL BUCKET (Chain length < 8):
Bucket[idx] ──► [ Node A ] ──► [ Node B ] ──► [ Node C │ NULL ]

TREEIFIED BUCKET (Chain length ≥ 8):
Bucket[idx] ──►       (Root Node)
                     /           \
             [ Red Child ]   [ Black Child ]
              /         \     /           \
```

#### B. Python 3.6+ Compact Hash Table Layout:
Traditional open-addressing tables store arrays of sparse 24-byte structs `(hash, key, value)` containing massive empty gaps ($\ge 33\%$ empty slots), wasting precious CPU RAM.
- **Python's Solution**: Split the table into two separate arrays:
  1. A small sparse **Indices Array** (containing 1-byte integer offsets).
  2. A dense, contiguous **Entries Array** storing `(hash, key, value)` in exact insertion order!
- **Benefits**:
  - Slashes memory consumption by **$30\%$ to $40\%$**!
  - Makes dictionaries **strictly insertion-ordered** by default!

```text
SPARSE INDICES ARRAY:  [ -1 │  0 │ -1 │  1 │ -1 │  2 │ -1 ]
                              │         │         │
                              ▼         ▼         ▼
DENSE ENTRIES ARRAY:   [ Entry 0 │ Entry 1 │ Entry 2 ]  (No empty gaps!)
```

---
---

# TOPIC 40C: HASH SET (UNIQUE VALUE DEDUPLICATION ENGINE)

### 1. Definition & Underlying Architecture

### Concept
A **Hash Set** is an Abstract Data Type that models the mathematical concept of a **finite set**: a collection of distinct, unique elements with no inherent ordering and no duplicate items allowed.

### THE UNDERLYING ENGINE: Backed by a Hash Map!
In high-performance systems (including Java's `java.util.HashSet`, Python's `set`, and C++'s `std::unordered_set`), a Hash Set is almost never written from scratch. Instead, it is **internally implemented by wrapping a Hash Map**:
- Every element added to the set is stored as a **Key** in the internal map.
- The associated **Value** is a shared, static, 0-byte dummy sentinel constant (e.g., `PRESENT = new Object()`).

```text
HASH SET: Set.Add("Apple")
   │
   ▼
INTERNAL HASH MAP:
   Key: "Apple"  ──►  Value: DUMMY_SENTINEL (ignored)
```

Because the underlying Hash Map guarantees that keys must be unique, the Hash Set automatically inherits:
- Guaranteed deduplication!
- Expected $O(1)$ insertion (`Add`).
- Expected $O(1)$ membership testing (`Contains`).
- Expected $O(1)$ removal (`Remove`).

---

### 2. Mathematical Set Operations & Algorithmic Complexities

Let Set $A$ have size $n = |A|$ and Set $B$ have size $m = |B|$:

| Mathematical Operation | Notation | Algorithm | Time Complexity | Auxiliary Space |
| :--- | :---: | :--- | :---: | :---: |
| **Membership Query** | $x \in A$ | Hash $x$, probe internal map | $\Theta(1)$ | $O(1)$ |
| **Union** | $A \cup B$ | Copy larger set into result, insert all elements of smaller set | $O(n + m)$ | $O(n + m)$ |
| **Intersection** | $A \cap B$ | Iterate through smaller set; if element exists in larger set, append to result | $O(\min(n, m))$ | $O(\min(n, m))$ |
| **Difference** | $A \setminus B$ | Iterate through $A$; if element does NOT exist in $B$, append to result | $O(n)$ | $O(n)$ |
| **Symmetric Difference** | $A \Delta B$ | $(A \setminus B) \cup (B \setminus A)$ | $O(n + m)$ | $O(n + m)$ |
| **Subset Check** | $A \subseteq B$ | If $n > m$ return false. Iterate through $A$; check if all exist in $B$ | $O(n)$ | $O(1)$ |

---

### 3. Complete Hash Set Pseudocode

```text
DATA STRUCTURE HashSet
    Fields:
        internalMap: HashTable / HashMap
        DUMMY_CONSTANT: 1

    OPERATION Initialize():
        internalMap ← new HashTable()

    OPERATION Add(element):
        // Returns true if added, false if already present
        if internalMap.Contains(element):
            return false
        internalMap.Put(element, DUMMY_CONSTANT)
        return true

    OPERATION Contains(element):
        return internalMap.Contains(element)

    OPERATION Remove(element):
        if not internalMap.Contains(element):
            return false
        internalMap.Remove(element)
        return true

    OPERATION Intersection(SetB):
        resultSet ← new HashSet()
        // Optimization: always iterate over the smaller set!
        smallSet ← this
        largeSet ← SetB
        if this.Size() > SetB.Size():
            smallSet ← SetB
            largeSet ← this
        
        for each item in smallSet.Elements():
            if largeSet.Contains(item):
                resultSet.Add(item)
        return resultSet
```

---
---

# TOPIC 40D: MASTER COMPARISON MATRIX

| Dimension | Hash Table (Classic) | Hash Map | Hash Set | Tree Map / Tree Set (Red-Black) |
| :--- | :--- | :--- | :--- | :--- |
| **Data Stored** | Key-Value pairs $(K, V)$ | Key-Value pairs $(K, V)$ | Unique Elements only ($E$) | Key-Value or Set Elements |
| **Ordering** | Unordered | Unordered (or insertion-ordered in Python) | Unordered | **Strictly Sorted (In-Order BST)** |
| **Lookup Time** | Expected $O(1)$, Worst $O(n)$ | Expected $O(1)$, Worst $O(\log n)$ (with treeify) | Expected $O(1)$, Worst $O(\log n)$ | **Guaranteed Worst-Case $O(\log n)$** |
| **Insert Time** | Expected $O(1)$ amortized | Expected $O(1)$ amortized | Expected $O(1)$ amortized | **Guaranteed $O(\log n)$** |
| **Range Queries ($[L, R]$)**| Impossible ($O(n)$ scan) | Impossible ($O(n)$ scan) | Impossible ($O(n)$ scan) | **Optimal $O(\log n + k)$** |
| **Null Key Support** | Disallowed in legacy tables | Allowed (typically 1 null key) | Allowed (at most 1 null element)| Disallowed (requires comparable keys) |
| **Thread Safety** | Synchronized (legacy) | Unsynchronized (fast) | Unsynchronized | Unsynchronized |
| **Underlying Engine** | Array of buckets | Array of buckets (lists $\to$ trees) | Backed by Hash Map | Self-Balancing Red-Black Tree |

---

## Module 03 Summary & Key Takeaways

1. **Hash Tables** map keys to bucket indices using modular arithmetic; when load factor $\alpha \ge 0.75$, **dynamic rehashing** must recompute all key indices in a doubled capacity array.
2. A **Hash Map** associates unique keys with values; production implementations like Java 8+ convert degraded bucket chains into **Red-Black Trees** ($O(\log n)$) to foil Hash DoS attacks.
3. A **Hash Set** is an Abstract Data Type for unique element deduplication, internally implemented by wrapping a Hash Map with dummy value sentinels.
4. Use **Hash structures** for raw average $O(1)$ speed; use **Tree structures** when data must remain sorted or when range queries ($[L, R]$) are required.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 11: Hash Tables. MIT Press.
2. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 6.4: Hashing. Addison-Wesley.
3. **Mitzenmacher, M., & Upfal, E.** (2017). *Probability and Computing: Randomization and Probabilistic Techniques in Algorithms* (2nd ed.). Cambridge University Press.
