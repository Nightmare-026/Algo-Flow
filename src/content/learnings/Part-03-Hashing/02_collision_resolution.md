# 💥 Part 03: Hashing — Module 02: Collision Resolution Techniques

> **Topics Covered:**  
> 35. Separate Chaining (Open Hashing) &bull; 36. Open Addressing (Closed Hashing) & The Deletion Dilemma &bull; 37. Linear Probing & Primary Clustering &bull; 38. Quadratic Probing & Secondary Clustering &bull; 39. Double Hashing & Permutation Uniformity

---

# TOPIC 35: SEPARATE CHAINING (OPEN HASHING)

### 1. Definition & Architecture
In **Separate Chaining**, the hash table is an array of pointers to linked lists (or self-balancing BSTs / Red-Black trees if chains exceed a threshold like 8, as in Java 8+ `HashMap`). Every slot in the table is an independent bucket. When a collision occurs ($h(k_1) = h(k_2)$), both elements are linked into the chain associated with that slot.

---

### 2. Structural Diagram (ASCII)

```text
SLOT INDEX        BUCKET HEAD            LINKED NODES IN BUCKET
─────────────────────────────────────────────────────────────────────────────
  [ 0 ]  ──────►  [ NULL ]
  [ 1 ]  ──────►  [ "Apple", $2 │ ● ] ──► [ "Peach", $4 │ NULL ]  (Collision!)
  [ 2 ]  ──────►  [ NULL ]
  [ 3 ]  ──────►  [ "Banana", $1│ ● ] ──► [ "Grape", $5 │ ● ] ──► [ "Berry", $6 │ NULL ]
  [ 4 ]  ──────►  [ "Mango", $3 │ NULL ]
```

---

### 3. Complexity Under Simple Uniform Hashing Assumption (SUHA)
With $n$ keys distributed uniformly across $m$ slots, the average length of any chain is exactly the load factor:
$$\alpha = \frac{n}{m}$$

- **Unsuccessful Search**: Must scan the entire chain at slot $h(k)$ $\implies 1 + \alpha$ probes.
- **Successful Search**: Searches on average half the chain $\implies 1 + \frac{\alpha}{2}$ probes.
- **Worst Case**: If all $n$ keys hash to the same bucket $\implies O(n)$ time!
- **Mitigation**: Java 8 converts the linked list into a Red-Black tree when chain length $\ge 8$, guaranteeing worst-case search in $O(\log n)$.

---
---

# TOPIC 36: OPEN ADDRESSING (CLOSED HASHING)

### 1. General Concept
In **Open Addressing**, all keys reside directly inside the hash table array itself without external pointers or linked lists.
- Each array slot holds either a single key or is empty.
- When a collision occurs, the algorithm systematically probes an ordered sequence of alternative slots until an empty slot is discovered:

$$\text{Probe Sequence for key } k: \quad \langle h(k, 0), \, h(k, 1), \, h(k, 2), \, \dots, \, h(k, m-1) \rangle$$

---

### 2. The Deletion Dilemma: The TOMBSTONE Sentinel
In Open Addressing, simply setting a slot back to `EMPTY` upon deletion breaks subsequent searches!

```text
SCENARIO: Table size m = 5, Linear Probing.
1. Insert Key A: h(A) = 2. Placed in slot 2.
2. Insert Key B: h(B) = 2. Collision! Probes slot 3. Placed in slot 3.
3. Delete Key A: If slot 2 is set to EMPTY:
4. Search Key B:
   - Evaluates h(B) = 2.
   - Slot 2 is EMPTY.
   - Search terminates and falsely reports "Key B not found!" ❌
```

#### The Solution: The `DELETED` (TOMBSTONE) Marker
When deleting a key:
- Overwrite the slot with a special sentinel value: `TOMBSTONE`.
- **Search Rule**: Continue probing through `TOMBSTONE` markers (do not halt).
- **Insertion Rule**: An insertion can overwrite a `TOMBSTONE` slot!

---
---

# TOPIC 37: LINEAR PROBING

### 1. Definition
Probes sequentially one slot at a time:
$$h(k, i) = (h(k) + i) \pmod m \quad \text{for } i = 0, 1, 2, \dots, m-1$$

---

### 2. The Achilles Heel: Primary Clustering
Keys tend to clump together into long contiguous blocks of occupied slots called **clusters**. Once a cluster forms, the probability that the next insertion hits the cluster grows proportionally to its size, causing the cluster to grow even faster!

```text
SLOTS:     [ 0 ]  [ 1 ]  [ 2 ]  [ 3 ]  [ 4 ]  [ 5 ]  [ 6 ]  [ 7 ]
CONTENT:   EMPTY  [K1]   [K2]   [K3]   [K4]   [K5]   EMPTY  EMPTY
                  └───────── PRIMARY CLUSTER ─────────┘
```
Any new key hashing to slots 1, 2, 3, 4, or 5 will all probe all the way to slot 6, extending the cluster!

---

### 3. Step-by-Step Worked Dry Run: Linear Probing
Table size $m = 7$. Hash function $h(k) = k \pmod 7$.  
Insert sequence: $10, 17, 24, 31$

| Key | $h(k)$ | Probe 0 ($i=0$) | Probe 1 ($i=1$) | Probe 2 ($i=2$) | Final Slot Assigned | Resulting Table State |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **10** | $10 \pmod 7 = 3$ | Slot 3 (Free) | — | — | **Slot 3** | `[_, _, _, 10, _, _, _]` |
| **17** | $17 \pmod 7 = 3$ | Slot 3 (Taken) | Slot 4 (Free) | — | **Slot 4** | `[_, _, _, 10, 17, _, _]` |
| **24** | $24 \pmod 7 = 3$ | Slot 3 (Taken) | Slot 4 (Taken) | Slot 5 (Free) | **Slot 5** | `[_, _, _, 10, 17, 24, _]` |
| **31** | $31 \pmod 7 = 3$ | Slot 3 (Taken) | Slot 4 (Taken) | Slot 5 (Taken) | **Slot 6** | `[_, _, _, 10, 17, 24, 31]` |

*(Notice how every key collided at 3 and produced a massive cluster from slot 3 to 6!)*

---
---

# TOPIC 38: QUADRATIC PROBING

### 1. Definition
Probes using a quadratic polynomial in $i$:
$$h(k, i) = (h(k) + c_1 i + c_2 i^2) \pmod m$$
Common formulation: $h(k, i) = (h(k) + i^2) \pmod m$  
The step size increases by $1, 4, 9, 16, \dots$, jumping over primary clusters.

---

### 2. Secondary Clustering
Although Quadratic Probing eliminates primary clusters, keys that share the exact same initial hash $h(k_1) = h(k_2)$ follow the identical quadratic probe path. This milder phenomenon is called **Secondary Clustering**.

### 3. Theorem on Table Coverage
If $m$ is a prime number and $c_1 = 0, c_2 = 1$, Quadratic Probing is guaranteed to find an empty slot as long as the load factor satisfies:
$$\alpha < 0.5$$

---
---

# TOPIC 39: DOUBLE HASHING

### 1. Definition
Uses two independent hash functions $h_1(k)$ and $h_2(k)$:
$$h(k, i) = (h_1(k) + i \cdot h_2(k)) \pmod m$$

- $h_1(k)$ determines the **starting slot**.
- $h_2(k)$ determines the **step size (stride)**.

Because the step size depends on the key itself, even if two keys collide at the starting slot ($h_1(k_1) = h_1(k_2)$), they will almost certainly have different step sizes ($h_2(k_1) \ne h_2(k_2)$), eliminating both primary and secondary clustering!

---

### 2. Inviolable Rule for $h_2(k)$
To ensure the probe sequence visits all $m$ slots without getting stuck in a cycle:
1. $h_2(k)$ must **never** evaluate to $0$ ($h_2(k) \ne 0$).
2. $h_2(k)$ and $m$ must be **coprime** ($\gcd(h_2(k), m) = 1$).
- **Standard Formula**: Choose $m$ as prime, and:
$$h_1(k) = k \pmod m$$
$$h_2(k) = 1 + (k \pmod{m - 1})$$
*(Since $m-1$ is evaluated and 1 is added, $1 \le h_2(k) \le m-1$, guaranteeing non-zero and coprimality!)*

---

### 3. Comprehensive Collision Resolution Comparison

| Strategy | Primary Clustering? | Secondary Clustering? | Cache Performance | Max Viable Load Factor ($\alpha$) | Requires Pointer Memory? |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Separate Chaining** | None | None | Poor (scattered nodes) | $\alpha > 1.0$ (Unlimited) | Yes (8B / node) |
| **Linear Probing** | **Severe** | None | **Outstanding** (contiguous) | $\alpha \le 0.5$ | No |
| **Quadratic Probing** | None | Mild | Moderate | $\alpha \le 0.5$ | No |
| **Double Hashing** | None | None | Good | $\alpha \le 0.7$ | No |

---

## 🔁 Module 02 Summary & Key Takeaways

1. **Separate Chaining** stores collisions in linked lists; memory can grow arbitrarily without resizing, but suffers from cache misses.
2. **Open Addressing** stores all keys in the table array; requires a `TOMBSTONE` marker during deletion to prevent breaking probe chains.
3. **Linear Probing** suffers from severe primary clustering; **Quadratic Probing** uses $i^2$ step size; **Double Hashing** uses a second key-dependent step size $h_2(k)$ and achieves optimal pseudo-random probing.

---
[⬅️ Previous: Module 01 — Hashing Foundations](file:///d:/DSA/Part-03-Hashing/01_hashing_foundations.md) | [Next: Module 03 — Hash Table, Hash Map & Hash Set ➡️](file:///d:/DSA/Part-03-Hashing/03_hash_table_hash_map_hash_set.md)
