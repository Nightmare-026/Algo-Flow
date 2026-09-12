# 🔬 Part 03: Hashing — Module 04: Advanced Collision Resolution & Probabilistic Hashing

> **Topics Covered:**  
> Cuckoo Hashing (Two Independent Hash Functions & Guaranteed $O(1)$ Worst-Case Lookup) &bull; Robin Hood Hashing (Probe Sequence Length Variance Minimization) &bull; 2-Level Perfect Hashing (FKS Scheme with Zero Collisions & $O(n)$ Space Proof) &bull; Bloom Filters (Zero False Negatives Probabilistic Membership) &bull; Count-Min Sketch & Merkle Trees

---

# TOPIC 01: CUCKOO HASHING

### 1. Topic Title
**Cuckoo Hashing (Worst-Case Constant Time Lookup via Displacement Eviction)**

### 2. Category
Advanced Collision Resolution — Multiple-Choice Hashing.

### 3. Difficulty
Advanced.

### 4. Prerequisites
- Module 02: Open Addressing & Separate Chaining.
- Part 01: Universal Hash Families.

---

### 5. Motivation: Escaping the $O(n)$ Worst-Case Lookup

In standard open addressing or separate chaining:
- Average lookup time is $O(1)$.
- **Worst-case lookup time is $O(n)$** (or $O(\log n)$ with treeification). If multiple keys collide, you must step through a chain or probe sequence.

### 💡 THE CUCKOO PRINCIPLE (Pagh & Rodler, 2001):
Named after the European cuckoo bird, which lays its eggs in the nests of other birds, kicking out existing eggs to make room.

In Cuckoo Hashing:
- We use **two independent hash functions**, $h_1(k)$ and $h_2(k)$, and either two separate tables $T_1, T_2$ or two possible locations in a single table.
- A key $k$ can **ONLY EVER RESIDE** in one of two exact locations:
$$\text{Location 1} = h_1(k) \quad \text{OR} \quad \text{Location 2} = h_2(k)$$
- **Lookup Superpower**: To find key $k$, we check slot $h_1(k)$ and slot $h_2(k)$. If neither slot contains $k$, **it does not exist!**
$$\text{Worst-Case Lookup Time} = \mathbf{O(1)} \text{ (At most 2 memory reads, strictly!)}$$

---

### 6. Insertion Mechanics & Displacement Loops

```text
INSERTION ALGORITHM:
1. Attempt to place new key X at h₁(X) in Table 1.
2. If slot h₁(X) is EMPTY:
     Place X there. Done!
3. If slot h₁(X) is OCCUPIED by existing key Y:
     - KICK Y OUT of Table 1!
     - Place X into Table 1.
     - Move displaced key Y to its alternative location h₂(Y) in Table 2!
4. If Table 2's slot h₂(Y) was occupied by Z:
     - KICK Z OUT of Table 2!
     - Move Z back to its alternative slot in Table 1!
5. Continue this chain of displacements until an empty slot is found.
```

```text
CUCKOO DISPLACEMENT CASCADE:
  Insert X ──► [ Table 1: Slot h₁(X) ]
                     │ (Kicks out Y)
                     ▼
               [ Table 2: Slot h₂(Y) ]
                     │ (Kicks out Z)
                     ▼
               [ Table 1: Slot h₁(Z) ]  (Lands in empty slot: Cascade terminates!)
```

#### Cycle Detection & Rehashing:
If a displacement chain enters an infinite loop (e.g., $X \to Y \to Z \to X$), we detect the cycle (when displacement count exceeds a threshold $\text{MAX\_DISPLACEMENTS} \approx 2 \log n$). If a cycle occurs, we allocate new tables with fresh hash functions and **Rehash** the entire dataset.

---
---

# TOPIC 02: ROBIN HOOD HASHING

### 1. Topic Title
**Robin Hood Hashing (Probe Sequence Length Variance Minimization)**

### 2. Category
High-Performance Open Addressing Optimization.

### 3. Difficulty
Intermediate to Advanced.

### 4. Motivation: The Curse of Long Probe Chains
In standard Linear Probing, some lucky keys land directly in their home slot (Probe Sequence Length $\text{PSL} = 0$), while unlucky keys that arrived later get pushed $20$ or $30$ slots down the table ($\text{PSL} = 30$). This huge variance causes sluggish worst-case queries and cache thrashing.

### 💡 THE ROBIN HOOD MOTTO:
*"Take from the rich (keys with small PSL) and give to the poor (keys with large PSL)!"*

---

### 5. Architectural Invariant & Stealing Rule

Every stored slot records two items: the key-value pair and its **Probe Sequence Length (PSL)** — the number of steps it has traveled away from its ideal home slot $h(k)$.

#### The Insertion Steal Invariant:
When probing to insert a key:
- Track the current key's `currentPSL`.
- If we encounter an occupied slot storing key $Y$ with `existingPSL`:
  - If `currentPSL > existingPSL`:
    - The incoming key is **poorer** (has traveled further) than the resident key!
    - **SWAP THEM!** The incoming key steals the slot.
    - We now continue probing down the table with key $Y$, incrementing its PSL!

```text
SLOT INSPECTION:
Incoming Key: [ Key: "Delta", PSL: 4 ] (Very poor!)
Resident Key: [ Key: "Alpha", PSL: 1 ] (Rich! Close to home)

ACTION:
"Delta" takes the slot!
"Alpha" is evicted and continues probing with PSL = 2!
```

---

### 6. Why Robin Hood Hashing Outperforms Classical Probing

1. **Drastic Variance Reduction**: Instead of a few keys suffering catastrophic probe lengths, all keys cluster around a very tight, predictable average PSL (typically $1$ to $3$).
2. **Early Search Termination**: When searching for a key $k$, we track our search PSL. If we reach an occupied slot whose `residentPSL < searchPSL`, we can **INSTANTLY STOP AND RETURN NOT FOUND**!
   - Why? Because if $k$ were in the table, the Robin Hood stealing rule would have swapped it into this slot or an earlier one!

---
---

# TOPIC 03: 2-LEVEL PERFECT HASHING (FKS SCHEME)

### 1. Topic Title
**Fredman-Komlós-Szemerédi (FKS) Perfect Hashing (Guaranteed Zero Collisions in $O(n)$ Space)**

### 2. Category
Deterministic Search Structures for Static Dictionaries.

### 3. Difficulty
Advanced.

### 4. Prerequisites
- The Birthday Paradox (Collision probability in hash tables).
- Universal Hash Function Families.

---

### 5. The Birthday Paradox Dilemma
If you hash $n$ keys into a single hash table of size $m$:
- To guarantee **zero collisions** with probability $\ge 0.5$, the table size must be quadratic:
$$m = \Theta(n^2)$$
- Storing $1,000,000$ keys would require a table of size $1,000,000^2 = 10^{12}$ slots (Terabytes of RAM!), which is completely impractical.

### 💡 THE FKS 2-LEVEL SOLUTION (Fredman, Komlós, Szemerédi, 1984):
Achieves **guaranteed zero collisions** and **$O(1)$ worst-case lookup** using only **$O(n)$ total linear memory**!

---

### 6. Architectural Topology

```text
LEVEL 1 (Primary Hash Table):
Size M = n slots. Uses primary hash function h(k).
Key collisions ARE allowed at Level 1!
Slot i stores a pointer to a dedicated secondary hash table S_i.

LEVEL 2 (Secondary Hash Tables):
If slot i has c_i keys colliding into it:
Allocate secondary table S_i of QUADRATIC size:
  Size(S_i) = (c_i)² slots!
Use a dedicated secondary hash function h_i(k) that has ZERO COLLISIONS!

LEVEL 1 TABLE (Size = n):
Index 0: [ Pointer ──► Secondary Table S₀ of size 1² = 1 (Zero collisions!) ]
Index 1: [ Pointer ──► NULL (0 items) ]
Index 2: [ Pointer ──► Secondary Table S₂ of size 3² = 9 (Zero collisions!) ]
```

---

### 7. Mathematical Proof of $O(n)$ Linear Total Space

#### Theorem:
If the primary hash function $h$ is chosen uniformly at random from a 2-universal hash family, the expected sum of squares of collisions across all buckets is strictly bounded:
$$\mathbb{E}\left[ \sum_{i=0}^{n-1} c_i^2 \right] < 2n$$

#### Proof:
1. For any pair of distinct keys $x, y \in S$, let indicator variable $I_{x, y} = 1$ if $h(x) = h(y)$, else $0$.
2. By the definition of a universal hash family:
$$\Pr[h(x) = h(y)] \le \frac{1}{m} = \frac{1}{n}$$
3. The number of keys in bucket $i$ is $c_i$. The number of colliding pairs in bucket $i$ is $\binom{c_i}{2} = \frac{c_i(c_i - 1)}{2}$.
4. Expanding the sum of squares:
$$\sum_{i=0}^{n-1} c_i^2 = \sum_{i=0}^{n-1} \left( c_i + 2 \binom{c_i}{2} \right) = n + 2 \sum_{x < y} I_{x, y}$$
5. Taking the expectation:
$$\mathbb{E}\left[ \sum_{i=0}^{n-1} c_i^2 \right] = n + 2 \sum_{x < y} \mathbb{E}[I_{x, y}] \le n + 2 \binom{n}{2} \frac{1}{n} = n + 2 \frac{n(n - 1)}{2n} = n + (n - 1) < 2n$$

$\blacksquare$

**Conclusion**: The total memory consumed across all secondary tables $\sum c_i^2$ is less than $2n$, proving that 2-level perfect hashing achieves **zero collisions** and **$O(1)$ guaranteed worst-case search in $O(n)$ space**!

---
---

# TOPIC 04: PROBABILISTIC HASHING STRUCTURES

### 1. The Bloom Filter: Probabilistic Membership

A **Bloom Filter** (Burton Howard Bloom, 1970) is an exceptionally space-efficient bit-array data structure used to test set membership:
- **Possible Query Answers**:
  1. *"Definitely NOT in the set"* $\implies$ **100% Guaranteed Correct (Zero False Negatives)**.
  2. *"Possibly in the set"* $\implies$ **Small, mathematically controllable False Positive probability ($p$)**.

```text
Bit Array of m = 10 bits:
Index:   0   1   2   3   4   5   6   7   8   9
Bits:  [ 0 │ 1 │ 0 │ 1 │ 0 │ 0 │ 1 │ 0 │ 1 │ 0 ]
             ▲       ▲           ▲       ▲
             │       │           │       │
          h₁(x)    h₂(x)       h₃(x)   h₄(x)
```

#### Mathematical Formulas for Optimal Tuning:
Given $n$ expected items and desired false positive probability $p$:
1. **Optimal Bit-Array Size ($m$)**:
$$m = - \frac{n \ln p}{(\ln 2)^2} \approx -1.44 \cdot n \log_2 p$$
*(To achieve a 1% false positive rate ($p = 0.01$), you need only **9.6 bits per element**, regardless of how large the elements are!)*
2. **Optimal Number of Hash Functions ($k$)**:
$$k = \frac{m}{n} \ln 2 \approx 0.7 \cdot \frac{m}{n}$$

---

### 2. Count-Min Sketch: Frequency Estimation in High-Speed Data Streams

In big data streaming (e.g., network packet analysis, trending hashtags on Twitter/X), data arrives at millions of events per second. Storing exact counters for every key in a hash map would consume gigabytes of RAM.

A **Count-Min Sketch** is a 2D array of counters of size $d \times w$ with $d$ independent hash functions:
- **Update($x, c$)**: For each row $i \in [0, d-1]$, compute column $j = h_i(x)$ and increment counter:
$$\text{table}[i][j] \leftarrow \text{table}[i][j] + c$$
- **Estimate($x$)**: To estimate the frequency of $x$, return the **minimum** across all rows:
$$\hat{f}(x) = \min_{0 \le i < d} \text{table}[i][h_i(x)]$$

**Why Minimum?** Because hash collisions can only *inflate* counter values, never reduce them! Taking the minimum across independent rows filters out collision noise with provable mathematical error bounds $(\epsilon, \delta)$.

---

## 🔁 Module 04 Summary & Key Takeaways

1. **Cuckoo Hashing** guarantees **$O(1)$ worst-case lookup** with at most 2 memory probes by using displacement eviction and cycle-detecting rehashing.
2. **Robin Hood Hashing** balances probe sequence lengths by letting "poor" keys steal slots from "rich" keys, slashing variance and enabling early search termination.
3. **FKS 2-Level Perfect Hashing** guarantees zero collisions in $O(n)$ space by pairing an $O(n)$ primary table with quadratic secondary tables of size $c_i^2$.
4. **Bloom Filters** achieve massive RAM savings ($< 10$ bits/item) with guaranteed zero false negatives; **Count-Min Sketches** provide sublinear frequency estimation for massive data streams.

---
[⬅️ Previous: Module 03 — Hash Table, Hash Map & Hash Set](file:///d:/DSA/Part-03-Hashing/03_hash_table_hash_map_hash_set.md) | [Next: Part 04 — Searching ➡️](file:///d:/DSA/Part-04-Searching/01_linear_and_binary_search.md)
