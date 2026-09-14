# Part 03: Hashing — Module 02: Collision Resolution Techniques

> **Topics Covered:**  
> 38. Separate Chaining (Open Hashing) &bull; 39. Open Addressing (Closed Hashing) & The Deletion Dilemma &bull; 40. Linear Probing & Primary Clustering &bull; Quadratic Probing & Secondary Clustering &bull; Double Hashing & Permutation Uniformity

---

Because the universe of possible search keys vastly exceeds the physical capacity of any hash table, collisions are mathematically unavoidable. An effective hash table is therefore defined by the resilience and efficiency of its collision resolution mechanism. This chapter explores the two dominant architectural paradigms: **Separate Chaining** (storing colliding elements in external node structures) and **Open Addressing** (probing for open slots directly within the primary array). We analyze probe sequence mechanics, the `TOMBSTONE` deletion state machine, primary and secondary clustering phenomena, and coprimality constraints in double hashing.

### Learning Objectives
- Contrast the physical memory layouts, cache performance, and load factor tolerances of Separate Chaining versus Open Addressing.
- Formulate the Open Addressing deletion dilemma and implement the `TOMBSTONE` sentinel protocol to preserve probe continuity.
- Diagnose the physical causes of Primary Clustering in Linear Probing and Secondary Clustering in Quadratic Probing.
- Implement Double Hashing and prove why the step function $h_2(k)$ must be coprime to table capacity $m$ to guarantee a complete permutation of slots.
- Determine optimal collision resolution strategies based on payload size, memory constraints, and hardware cache considerations.

---

## Topic 38: Separate Chaining (Open Hashing)

### 1. Conceptual Architecture & Bucket Chains

In **Separate Chaining**, the hash table is an array of pointers (or bucket heads). Each slot $j$ points to an external linked list (or self-balancing binary search tree) containing all key-value entries that hashed to $j$ ($h(k) = j$).

```
+-----------------------------------------------------------------------------------+
|                         SEPARATE CHAINING BUCKET LAYOUT                           |
|                                                                                   |
|  Slot 0 ----> NULL                                                                |
|  Slot 1 ----> [ "Apple", $2 | * ] ----> [ "Peach", $4 | NULL ] (Collision chain)  |
|  Slot 2 ----> NULL                                                                |
|  Slot 3 ----> [ "Banana", $1 | * ] ---> [ "Grape", $5 | * ] ---> [ "Berry", $6 ]  |
|  Slot 4 ----> [ "Mango", $3 | NULL ]                                              |
+-----------------------------------------------------------------------------------+
```

> **Interactive Simulations**:  
> Observe bucket node insertions live in the [Interactive Separate Chaining Visualizer](/visualizer/chaining-insert).

#### Bucket Allocation Mapping

| Slot Index | Head Pointer State | Chain Length | Stored Keys in Bucket Chain | Traversal Cost |
| :---: | :---: | :---: | :--- | :---: |
| **`0`** | `NULL` | $0$ | None (Vacant slot) | $O(1)$ (Immediate miss) |
| **`1`** | `0x10A0` | $2$ | `("Apple", $2) -> ("Peach", $4)` | $O(2)$ hops |
| **`2`** | `NULL` | $0$ | None (Vacant slot) | $O(1)$ (Immediate miss) |
| **`3`** | `0x2500` | $3$ | `("Banana", $1) -> ("Grape", $5) -> ("Berry", $6)` | $O(3)$ hops |
| **`4`** | `0x3800` | $1$ | `("Mango", $3)` | $O(1)$ hop |

---

### 2. Asymptotic Bounds Under SUHA

Under the Simple Uniform Hashing Assumption (SUHA), $n$ keys are distributed uniformly across $m$ slots. The expected number of keys in any chain is exactly the load factor:

$$\alpha = \frac{n}{m}$$

1. **Unsuccessful Search Cost**:  
   The algorithm hashes key $k$ to slot $h(k)$ and scans the entire chain to the end (`NULL`):
   $$\mathbb{E}[\text{Time}] = \Theta(1 + \alpha)$$
2. **Successful Search Cost**:  
   The target key is equally likely to be anywhere in the chain. On average, the search scans half the chain plus the initial slot access:
   $$\mathbb{E}[\text{Time}] = \Theta\left(1 + \frac{\alpha}{2}\right)$$
3. **Worst-Case Degradation**:  
   If an adversarial workload hashes all $n$ keys to the same bucket, the table degrades to a single linked list with $O(n)$ search time.
   - **Production Defense (Treeification)**: In Java 8+, if a single bucket chain exceeds $8$ nodes and table size $m \ge 64$, the linked list is converted into a Red-Black tree, guaranteeing worst-case search in $O(\log n)$.

---

## Topic 39: Open Addressing & The Deletion Dilemma

### 1. Conceptual Architecture & In-Place Storage

In **Open Addressing**, all keys reside directly inside the primary table array. No external pointers or heap nodes are allocated.
- Every slot holds either a single key-value entry or is vacant.
- The load factor $\alpha = n / m$ can **never exceed $1.0$**.
- When a collision occurs at initial slot $h(k)$, the algorithm probes a deterministic sequence of alternative slots until an empty slot is discovered:

$$\text{Probe Sequence for key } k: \quad \langle h(k, 0), \, h(k, 1), \, h(k, 2), \, \dots, \, h(k, m - 1) \rangle$$

---

### 2. The Deletion Dilemma: The TOMBSTONE State Machine

In open addressing, simply setting a deleted slot to `EMPTY` corrupts subsequent search operations by prematurely terminating valid probe chains.

#### Failure Scenario (Linear Probing, $m = 5$):
1. Insert Key A: $h(A) = 2 \implies$ Stored at `Slot 2`.
2. Insert Key B: $h(B) = 2 \implies$ Collision at `Slot 2`! Probes `Slot 3` (free). Stored at `Slot 3`.
3. Delete Key A: If `Slot 2` is reset to `EMPTY`:
4. Search for Key B:
   - Compute $h(B) = 2$.
   - Inspect `Slot 2`. It is `EMPTY`!
   - Standard open addressing terminates search on the first `EMPTY` slot.
   - **False Negative**: The table incorrectly reports that Key B does not exist, even though it sits at `Slot 3`!

```
Search Path Severed:
[ Slot 2: EMPTY ]  <--- Search halts here! Does not check Slot 3!
[ Slot 3: Key B ]  <--- Key B is orphaned and unreachable!
```

#### The `TOMBSTONE` (DELETED) Solution
Instead of clearing the slot to `EMPTY`, mark it with a permanent sentinel state: **`TOMBSTONE`**.

| Table Operation | Behavior Upon Encountering `EMPTY` | Behavior Upon Encountering `TOMBSTONE` |
| :--- | :--- | :--- |
| **Search($k$)** | **Halt and return "Not Found"** (Chain ends) | **Continue probing** forward to next slot |
| **Insert($k, v$)** | **Claim slot** and store entry | **Claim slot** (overwrites tombstone) |
| **Delete($k$)** | Key does not exist; return false | Continue probing until key is found |

---

## Topic 40: Probing Strategies: Linear, Quadratic & Double Hashing

### 1. Linear Probing & Primary Clustering

Linear Probing checks consecutive array slots one-by-one:

$$h(k, i) = (h(k) + i) \pmod m \quad \text{for } i = 0, 1, \dots, m - 1$$

> **Interactive Simulation**:  
> Step through sequential probe collision checks in the [Interactive Linear Probing Visualizer](/visualizer/linear-probing).

#### The Primary Clustering Failure Mode:
Occupied slots merge into long unbroken contiguous chains called **primary clusters**. Once a cluster forms, any key whose initial hash falls anywhere within the cluster must traverse to the very end of the cluster to find a free slot, expanding the cluster further.

#### Linear Probing Step-by-Step Trace ($m = 7$, $h(k) = k \pmod 7$, Keys: $10, 17, 24, 31$)

| Key Inserted | Initial $h(k)$ | Probe 0 ($i=0$) | Probe 1 ($i=1$) | Probe 2 ($i=2$) | Probe 3 ($i=3$) | Slot Assigned | Resulting Table State $[0 \dots 6]$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **`10`** | $10 \pmod 7 = 3$ | Slot 3 (Free) | — | — | — | **Slot 3** | `[_, _, _, 10, _, _, _]` |
| **`17`** | $17 \pmod 7 = 3$ | Slot 3 (Taken) | Slot 4 (Free) | — | — | **Slot 4** | `[_, _, _, 10, 17, _, _]` |
| **`24`** | $24 \pmod 7 = 3$ | Slot 3 (Taken) | Slot 4 (Taken) | Slot 5 (Free) | — | **Slot 5** | `[_, _, _, 10, 17, 24, _]` |
| **`31`** | $31 \pmod 7 = 3$ | Slot 3 (Taken) | Slot 4 (Taken) | Slot 5 (Taken) | Slot 6 (Free) | **Slot 6** | `[_, _, _, 10, 17, 24, 31]` |

Every single key collided at slot 3, creating a massive 4-element cluster spanning slots 3 through 6!

---

### 2. Quadratic Probing & Secondary Clustering

Quadratic Probing replaces the linear step with a quadratic polynomial in $i$:

$$h(k, i) = (h(k) + c_1 \cdot i + c_2 \cdot i^2) \pmod m$$

A standard formulation is $h(k, i) = (h(k) + i^2) \pmod m$, yielding offsets $+0, +1, +4, +9, +16, \dots$. This allows the probe sequence to jump rapidly over contiguous clusters.

#### Secondary Clustering:
While Quadratic Probing eliminates primary clusters, keys that share the exact same initial hash ($h(k_1) = h(k_2)$) will trace identical quadratic probe sequences. This milder phenomenon is called **Secondary Clustering**.

#### Table Coverage Theorem:
If $m$ is a prime number and the load factor satisfies:
$$\alpha < 0.5$$
Quadratic probing using $h(k, i) = (h(k) + i^2) \pmod m$ is mathematically guaranteed to inspect at least $\lceil m / 2 \rceil$ distinct slots before repeating, guaranteeing an open slot will be found.

---

### 3. Double Hashing & Permutation Uniformity

Double Hashing uses two independent hash functions $h_1(k)$ and $h_2(k)$ to generate a pseudo-random probe sequence unique to each individual key:

$$h(k, i) = (h_1(k) + i \cdot h_2(k)) \pmod m$$

- $h_1(k)$ determines the **Starting Slot**.
- $h_2(k)$ determines the **Step Stride**.

Because the step size depends on the key value $k$, two keys that collide at $h_1(k_1) = h_1(k_2)$ will almost certainly have different step strides ($h_2(k_1) \ne h_2(k_2)$), completely eliminating both primary and secondary clustering!

#### Crucial Invariants for $h_2(k)$:
1. $h_2(k)$ must **never evaluate to 0** ($h_2(k) \ne 0$). If it were zero, the probe sequence would loop endlessly at $h_1(k)$.
2. $h_2(k)$ must be **coprime to $m$** ($\gcd(h_2(k), m) = 1$). If they share a common factor $g > 1$, the sequence visits only $m / g$ slots rather than the entire table.

#### Canonical Double Hashing Equations (Prime $m$):
$$h_1(k) = k \pmod m$$
$$h_2(k) = 1 + (k \pmod{m - 1})$$
Since $m - 1$ is used in modulo and $1$ is added, $1 \le h_2(k) \le m - 1$. Because $m$ is prime, every integer in this range is guaranteed coprime to $m$.

---

### 4. Comprehensive Architectural Comparison

| Strategy | Primary Clustering | Secondary Clustering | Cache Line Performance | Max Viable Load Factor ($\alpha$) | Pointer Memory Overhead |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Separate Chaining** | None | None | Poor (chasing heap pointers) | $\alpha > 1.0$ (Unlimited) | Yes ($8\text{ bytes}$ / node) |
| **Linear Probing** | **Severe** | None | **Optimal** (sequential reads) | $\alpha \le 0.5$ | None ($0\text{ bytes}$) |
| **Quadratic Probing** | None | Mild | Moderate | $\alpha \le 0.5$ | None ($0\text{ bytes}$) |
| **Double Hashing** | None | None | Good | $\alpha \le 0.7$ | None ($0\text{ bytes}$) |

---

### 5. Key Takeaways

1. **Chaining vs. Open Addressing**: Chaining uses external linked lists with memory overhead; Open Addressing stores all keys inside the primary array and requires $\alpha < 1.0$.
2. **TOMBSTONE Necessity**: Open Addressing must mark deleted slots with `TOMBSTONE` to prevent search chains from severing prematurely.
3. **Primary Clustering**: Linear probing produces contiguous clumps of occupied slots, degrading average search time.
4. **Double Hashing Superiority**: Using a key-dependent step size $h_2(k)$ coprime to prime $m$ yields independent probe permutations, eliminating clustering.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 11: *Hash Tables*. MIT Press.
2. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 6.4: *Hashing*. Addison-Wesley.
3. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 3.4: *Hash Tables*. Addison-Wesley.
