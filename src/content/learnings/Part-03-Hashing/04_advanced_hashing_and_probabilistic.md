# Part 03: Hashing — Module 04: Advanced Collision Resolution & Probabilistic Hashing

> **Topics Covered:**  
> 45. Cuckoo Hashing (Two Independent Hash Functions & Guaranteed $O(1)$ Worst-Case Lookup) &bull; 46. Robin Hood Hashing (Probe Sequence Length Variance Minimization) &bull; 47. 2-Level Perfect Hashing (FKS Scheme with Zero Collisions & $O(n)$ Space Proof) &bull; 48. Probabilistic Streaming Hashing (Bloom Filters & Count-Min Sketch)

---

Standard hashing algorithms achieve $O(1)$ average-case latency, but suffer from potential $O(n)$ degradation under adversarial inputs or high load factors. Advanced hashing architectures conquer these performance limits through two distinct paradigms: deterministic worst-case guarantees and sublinear probabilistic approximation. This chapter analyzes Cuckoo Hashing's multi-choice displacement eviction, Robin Hood probe sequence length variance reduction, Fredman-Komlós-Szemerédi (FKS) two-level perfect hashing with $O(n)$ space proofs, Bloom filter dimensioning equations, and Count-Min sketch streaming frequency estimation.

### Learning Objectives
- Formulate Cuckoo Hashing's displacement eviction algorithm and prove its guaranteed $O(1)$ worst-case lookup in at most two memory reads.
- Implement Robin Hood Hashing and evaluate how probe sequence length (PSL) variance reduction enables early search termination.
- Formalize the FKS (Fredman-Komlós-Szemerédi) two-level perfect hashing scheme and prove why expected total space is strictly $O(n)$ despite quadratic secondary buckets.
- Size and dimension Bloom Filters using optimal bit-array size ($m \approx -1.44 n \log_2 p$) and hash function count ($k \approx 0.7 m/n$) formulas to achieve zero false negatives.
- Implement the Count-Min Sketch frequency estimator and explain why the $\min$ operation across independent hash rows filters out collision noise.

---

## Topic 45: Cuckoo Hashing

### 1. Conceptual Architecture & The Cuckoo Invariant

In standard open addressing or separate chaining, worst-case lookup latency degrades to $O(n)$. **Cuckoo Hashing** (Pagh & Rodler, 2001) guarantees that every lookup executes in **strictly $O(1)$ worst-case time**, requiring at most **two memory accesses**.

#### The Core Invariant:
Cuckoo Hashing utilizes two independent hash functions $h_1(k)$ and $h_2(k)$ operating over two distinct tables $T_1$ and $T_2$ (or two partitions of a single table). A key $k$ is permitted to reside **only** in one of two specific locations:

$$\text{Valid Location}(k) \in \{ T_1[h_1(k)], \, T_2[h_2(k)] \}$$

#### The Lookup Superpower:
To locate key $k$, the algorithm inspects $T_1[h_1(k)]$ and $T_2[h_2(k)]$. If neither slot contains $k$, **the key is guaranteed not to exist**. Lookup never probes a third slot!

$$\text{Worst-Case Lookup Time} = \Theta(1) \quad (\le 2\text{ memory reads})$$

---

### 2. Insertion Mechanics & The Displacement Cascade

Like the European cuckoo bird that evicts eggs from other nests to claim territory, when an incoming key $X$ hashes to an occupied slot, it **evicts the resident key** and steals its position:

```text
Cuckoo Displacement Cascade:
Insert X ---> [ T1: Slot h1(X) ]
                    | (Evicts Y)
                    v
              [ T2: Slot h2(Y) ]
                    | (Evicts Z)
                    v
              [ T1: Slot h1(Z) ] (Lands in empty slot -> Cascade halts!)
```

#### Step-by-Step Displacement Trace: Inserting Key $X$

| Cascade Step | Active Key | Target Table & Slot | Prior Slot Occupant | Resolution Action |
| :---: | :---: | :---: | :---: | :--- |
| **1** | Key $X$ | $T_1[h_1(X)]$ | Key $Y$ | $X$ claims slot; $Y$ is evicted from $T_1$ |
| **2** | Key $Y$ | $T_2[h_2(Y)]$ | Key $Z$ | $Y$ claims slot; $Z$ is evicted from $T_2$ |
| **3** | Key $Z$ | $T_1[h_1(Z)]$ | `EMPTY` | $Z$ claims empty slot; **Cascade successfully halts!** |

#### Cycle Detection & Full Table Rehashing
If keys form a closed dependency loop ($A \to B \to C \to A$), the displacement cascade could cycle indefinitely. The algorithm detects loops when displacement steps exceed a threshold:
$$\text{MaxDisplacements} \approx \lceil 2 \log n \rceil$$
If the threshold is exceeded, the table halts the insertion, allocates fresh tables with two newly drawn hash functions from a universal family, and rehashes all elements.

---

## Topic 46: Robin Hood Hashing

### 1. The Curse of Probe Sequence Variance

In classical Linear Probing, some keys land in their home slot on the first attempt (Probe Sequence Length $\text{PSL} = 0$), while other keys inserted later are pushed down the table, suffering $\text{PSL} \ge 30$. This high variance degrades worst-case search latency and causes cache thrashing.

### 2. The Robin Hood Invariant: "Steal from the Rich to Give to the Poor"

Every occupied slot records both the key-value pair and its **Probe Sequence Length (PSL)**—the distance in slots that the key has traveled away from its ideal home bucket $h(k)$.

#### The Stealing Rule:
When probing to insert key $X$:
1. If an empty slot is encountered, store $X$ with its current PSL.
2. If an occupied slot holding key $Y$ is encountered:
   - Compare $X$'s current PSL against $Y$'s stored PSL:
   - **If $\text{PSL}(X) > \text{PSL}(Y)$**: $X$ has traveled further from home than $Y$ ($X$ is "poorer" than $Y$). **$X$ evicts $Y$ and takes the slot!**
   - $Y$ becomes the new displaced key and continues probing with its PSL incremented by 1.

#### State Transition Table: Robin Hood Slot Dispute

| Evaluated Slot | Resident Key & PSL | Incoming Key & PSL | PSL Comparison | Execution Outcome |
| :---: | :---: | :---: | :---: | :--- |
| **Slot 5** | `("Alpha", PSL = 1)` | `("Delta", PSL = 4)` | $4 > 1$ (Incoming is poorer!) | `"Delta"` steals Slot 5; `"Alpha"` evicted with $\text{PSL} \leftarrow 2$ |
| **Slot 6** | `("Beta", PSL = 3)` | `("Alpha", PSL = 2)` | $2 < 3$ (Resident is poorer!) | `"Beta"` retains Slot 6; `"Alpha"` continues probing with $\text{PSL} \leftarrow 3$ |
| **Slot 7** | `EMPTY` | `("Alpha", PSL = 3)` | Vacant slot | `"Alpha"` stored at Slot 7 with $\text{PSL} = 3$ |

---

### 3. Early Search Termination Superpower

In standard open addressing, searching for an absent key must continue until an `EMPTY` slot is reached. In Robin Hood Hashing, the search terminates significantly earlier:

> 💡 **Early Termination Theorem**:  
> While searching for key $k$, track the search probe length `searchPSL`. If you encounter an occupied slot whose resident key has $\text{residentPSL} < \text{searchPSL}$, **immediately halt and return "Not Found"!**  
> *Proof*: If key $k$ existed in the table, the Robin Hood stealing rule would have displaced that resident key because $k$ was poorer at that slot!

---

## Topic 47: FKS Two-Level Perfect Hashing

### 1. Conceptual Architecture & The Quadratic Dilemma

For static datasets (where all $n$ keys are known in advance, such as dictionary lookups, compiler keyword tables, and CD-ROM search indices), Fredman, Komlós, and Szemerédi (1984) developed a scheme achieving **guaranteed zero collisions** in **$O(1)$ worst-case lookup time** using **$O(n)$ linear total memory**.

By the Birthday Paradox, guaranteeing zero collisions in a single table requires quadratic memory:
$$m = \Theta(n^2)$$
Storing $10^6$ keys in a single collision-free table would require $10^{12}$ slots (terabytes of RAM), which is impossible.

#### The FKS Two-Level Solution
1. **Level 1 (Primary Table)**: Allocate an array of size $M = n$ using a primary hash function $h(k)$. Collisions are allowed at Level 1!
2. **Level 2 (Secondary Tables)**: If $c_i$ keys collide at Level 1 slot $i$, allocate a dedicated secondary hash table $S_i$ of **quadratic size**:
   $$m_i = c_i^2$$
   Because $m_i = c_i^2$, a secondary hash function $h_i(k)$ chosen from a universal family has zero collisions with probability $\ge 0.5$.

#### Structural Hierarchy

| Level 1 Slot Index | Colliding Keys Count ($c_i$) | Secondary Table Allocation Size ($m_i = c_i^2$) | Secondary Collision Rate | Worst-Case Lookup Cost |
| :---: | :---: | :---: | :---: | :---: |
| **`Slot 0`** | $c_0 = 1$ | $1^2 = 1\text{ slot}$ | Zero collisions | 2 memory reads |
| **`Slot 1`** | $c_1 = 0$ | $0\text{ slots}$ (`NULL`) | No keys | 1 memory read |
| **`Slot 2`** | $c_2 = 3$ | $3^2 = 9\text{ slots}$ | Zero collisions | 2 memory reads |
| **`Slot 3`** | $c_3 = 2$ | $2^2 = 4\text{ slots}$ | Zero collisions | 2 memory reads |

---

### 2. Mathematical Proof of $O(n)$ Linear Total Space

#### Theorem:
If the Level 1 hash function $h$ is chosen from a 2-universal hash family, the expected sum of secondary table sizes is strictly bounded:

$$\mathbb{E}\left[ \sum_{i=0}^{n-1} c_i^2 \right] < 2n$$

#### Proof:
1. For any pair of distinct keys $x, y \in S$, define indicator random variable $I_{x, y} = 1$ if $h(x) = h(y)$, and $0$ otherwise.
2. By the definition of a 2-universal hash family:
   $$\Pr[h(x) = h(y)] \le \frac{1}{M} = \frac{1}{n}$$
3. The number of colliding pairs in bucket $i$ containing $c_i$ elements is $\binom{c_i}{2} = \frac{c_i(c_i - 1)}{2}$.
4. Rewriting the sum of squares:
   $$\sum_{i=0}^{n-1} c_i^2 = \sum_{i=0}^{n-1} \left( c_i + 2 \binom{c_i}{2} \right) = \sum_{i=0}^{n-1} c_i + 2 \sum_{x < y} I_{x, y} = n + 2 \sum_{x < y} I_{x, y}$$
5. Taking the mathematical expectation:
   $$\mathbb{E}\left[ \sum_{i=0}^{n-1} c_i^2 \right] = n + 2 \sum_{x < y} \mathbb{E}[I_{x, y}] \le n + 2 \binom{n}{2} \frac{1}{n} = n + 2 \frac{n(n - 1)}{2n} = n + n - 1 < 2n \quad \blacksquare$$

**Result**: Even though individual secondary tables allocate quadratic capacity $c_i^2$, their total sum across all buckets is strictly bounded by $2n$, proving that 2-level perfect hashing achieves **zero collisions and guaranteed $O(1)$ search in $O(n)$ space**!

---

## Topic 48: Probabilistic Streaming Hashing: Bloom Filters & Count-Min Sketch

### 1. The Bloom Filter: Probabilistic Membership

A **Bloom Filter** (Bloom, 1970) is a space-efficient bit-array data structure used to test set membership:
- **"Definitely NOT in the set"**: $100\%$ guaranteed correct (**Zero False Negatives**).
- **"Possibly in the set"**: Correct with a small, tunable **False Positive probability ($p$)**.

#### Physical Layout: Bit-Array of $m = 10$ bits with $k = 3$ Hash Functions

| Bit Index | `0` | `1` | `2` | `3` | `4` | `5` | `6` | `7` | `8` | `9` |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Bit State** | `0` | **`1`** | `0` | **`1`** | `0` | `0` | **`1`** | `0` | **`1`** | `0` |
| **Mapped Hash Bits** | — | $h_1(x)$ | — | $h_2(x)$ | — | — | $h_3(x)$ | — | $h_1(y)$ | — |

- **Insert($x$)**: Compute $h_1(x), h_2(x), \dots, h_k(x)$ and set all corresponding bit indices to `1`.
- **Query($y$)**: Compute $h_1(y), \dots, h_k(y)$. If **any** bit is `0`, $y$ was definitively never added! If all bits are `1`, $y$ is probably in the set.

#### Optimal Dimensioning Formulas:
Given $n$ expected keys and desired false positive tolerance $p$:
1. **Optimal Bit-Array Size ($m$)**:
   $$m = - \frac{n \ln p}{(\ln 2)^2} \approx -1.44 \cdot n \log_2 p$$
   *(Achieving $p = 0.01$ ($1\%$ false positive rate) requires only **$9.6\text{ bits per element}$**, regardless of whether the stored keys are 10-byte strings or 100-kilobyte documents!)*
2. **Optimal Hash Function Count ($k$)**:
   $$k = \frac{m}{n} \ln 2 \approx 0.693 \cdot \frac{m}{n}$$

---

### 2. Count-Min Sketch: Frequency Estimation in High-Volume Streams

In massive streaming architectures (e.g., tracking DDoS attack packet signatures or trending hashtags), maintaining exact counters in a hash map consumes gigabytes of memory.

A **Count-Min Sketch** is a 2D array of counters of dimension $d \times w$ with $d$ pairwise independent hash functions:
- **Update($x, c$)**: For each row $i \in [0, d-1]$, compute column $j = h_i(x)$ and increment:
  $$\text{table}[i][j] \leftarrow \text{table}[i][j] + c$$
- **Estimate($x$)**: Return the **minimum** across all rows:
  $$\hat{f}(x) = \min_{0 \le i < d} \text{table}[i][h_i(x)]$$

#### Why the Minimum Operator Filters Noise:
Because hash collisions can only **inflate** counter values (by adding unrelated counts into the same slot) and can never decrease them, every slot represents an upper bound on true frequency:
$$\text{table}[i][h_i(x)] \ge f(x)$$
Taking the minimum across $d$ independent hash functions filters out collision noise, yielding estimates with provable $(\epsilon, \delta)$ mathematical accuracy bounds.

---

### 3. Key Takeaways

1. **Cuckoo Hashing**: Guarantees $O(1)$ worst-case lookup in $\le 2$ memory reads by allowing incoming keys to displace resident occupants.
2. **Robin Hood Hashing**: Enforces the invariant that "poor" keys steal slots from "rich" keys, minimizing probe sequence length variance and enabling early search termination.
3. **FKS Perfect Hashing**: Combines an $O(n)$ primary table with quadratic secondary buckets $c_i^2$, achieving zero collisions in $O(n)$ total expected memory.
4. **Bloom Filters**: Provide massive space compression ($< 10\text{ bits}$/item for $1\%$ error) with guaranteed zero false negatives.
5. **Count-Min Sketches**: Enable sublinear memory frequency tracking over high-volume data streams using the minimum estimator to neutralize collision noise.

---

## Academic Attribution & References

1. **Pagh, R., & Rodler, F. F.** (2004). *Cuckoo Hashing*. Journal of Algorithms, 51(2), 122-144.
2. **Fredman, M. L., Komlós, J., & Szemerédi, E.** (1984). *Storing a Sparse Table with O(1) Worst Case Access Time*. Journal of the ACM, 31(3), 538-544.
3. **Bloom, B. H.** (1970). *Space/Time Trade-offs in Hash Coding with Allowable Errors*. Communications of the ACM, 13(7), 422-426.
4. **Cormode, G., & Muthukrishnan, S.** (2005). *An Improved Data Stream Summary: The Count-Min Sketch and its Applications*. Journal of Algorithms, 55(1), 58-75.
