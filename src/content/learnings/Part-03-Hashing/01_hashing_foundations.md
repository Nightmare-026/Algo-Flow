# 🗝️ Part 03: Hashing — Module 01: Foundations, Hash Functions & Load Factor

> **Topics Covered:**  
> 32. Hashing Principles & Direct Address Table Comparison &bull; 33. Hash Functions & Uniform Distribution &bull; 34. Collisions, The Birthday Paradox & Load Factor ($\alpha$)

---

# TOPIC 32: HASHING PRINCIPLES

### 1. Topic Title
**Hashing (Constant-Time Key-to-Index Mapping & The Direct Addressing Dilemma)**

### 2. Category
Hashing & Associative Containers.

### 3. Difficulty
Beginner to Intermediate.

### 4. Prerequisites
Static Arrays, Modulo Arithmetic, Probability Basics.

### 5. Definition
**Hashing** is a computational technique that transforms an arbitrarily large search key $k$ (such as an integer, string, or complex object) into a small, fixed-range integer index $h(k)$ within the bounds $[0, m-1]$ of an underlying array (called the **Hash Table**), enabling expected $O(1)$ constant-time search, insertion, and deletion.

---

### 6. The Direct Address Table Dilemma: Why Do We Need Hashing?
Suppose we want to store employee records keyed by their 9-digit Social Security Number (SSN: $000000000$ to $999999999$):
- **Direct Addressing**: Allocate an array of size $10^9$.  
  - Lookup is instant: `Array[ssn]`.
  - **Fatal Flaw**: Requires $10^9 \times 8 \text{ bytes} \approx 8 \text{ Gigabytes}$ of RAM! If the company only has 500 employees, **99.99995% of the memory is completely wasted**.
- **Hashing Solution**: Map the universe of keys $\mathcal{U}$ (size $10^9$) to a compact table of size $m = 1,000$ using a hash function $h(k) = k \pmod{1000}$. Memory consumption drops from 8 GB to 8 KB!

```text
       UNIVERSE OF KEYS (U)           HASH FUNCTION h(k)         HASH TABLE (m slots)
     ┌──────────────────────┐                                   ┌────────────────────┐
     │ Key: 248-10-8914     │ ─────────┐                        │ Slot 0             │
     │                      │          │                        ├────────────────────┤
     │ Key: 512-40-1002     │ ─────────┼──► [ h(k) = k mod m ]─►│ Slot 2: [Rec 1002] │
     │                      │          │                        ├────────────────────┤
     │ Key: 881-99-8914     │ ─────────┘                        │ ...                │
     └──────────────────────┘                                   ├────────────────────┤
      (Gigantic Key Space)                                      │ Slot 914: COLLISION│
                                                                └────────────────────┘
```

---
---

# TOPIC 33: HASH FUNCTIONS

### 1. Desirable Characteristics of a Good Hash Function
1. **Deterministic**: For any identical key $k$, $h(k)$ must yield the exact same integer value every single time.
2. **Uniform Distribution (SUHA - Simple Uniform Hashing Assumption)**: Every key is equally likely to hash into any of the $m$ slots, independently of where other keys hash.
3. **High Efficiency**: Computable in $O(1)$ or $O(|key|)$ time.
4. **Avalanche Effect**: A single bit change in the input key should radically change the resulting hash value to minimize clustering.

---

### 2. Classic Hash Function Algorithms

#### A. The Division Method
$$h(k) = k \pmod m$$
- **Rule for Table Size $m$**: Choose $m$ to be a **prime number** not close to powers of 2 or 10.
- *Why Prime?* If $m = 2^p$, $h(k)$ simply extracts the lowest $p$ bits of $k$, ignoring higher bits and causing catastrophic collisions if keys share common suffixes.

#### B. The Multiplication Method (Knuth's Method)
$$h(k) = \lfloor m \cdot (k \cdot A \pmod 1) \rfloor$$
Where $A$ is a constant fraction $0 < A < 1$.  
Knuth suggests the Golden Ratio conjugate:
$$A = \frac{\sqrt{5} - 1}{2} \approx 0.6180339887\dots$$
- **Advantage**: The value of $m$ is not critical; it works well even when $m$ is a power of 2 ($m = 2^p$).

#### C. Polynomial Rolling Hash for Strings
To hash a string $S = s_0 s_1 s_2 \dots s_{L-1}$:
$$h(S) = \left( \sum_{i=0}^{L-1} s_i \cdot p^i \right) \pmod m$$
Where:
- $p$: A small prime roughly equal to alphabet size (e.g., $p = 31$ for lowercase English letters, $p = 53$ for mixed case).
- $m$: A large prime (e.g., $10^9 + 7$ or $10^9 + 9$) to avoid arithmetic overflow.

```text
ALGORITHM PolynomialStringHash(S, p ← 31, m ← 10⁹ + 7)
    Input: String S
    Output: Integer hash code in range [0, m - 1]

1.  hashVal ← 0
2.  pPower ← 1
3.  for each char c in S:
4.      charVal ← ascii(c) - ascii('a') + 1
5.      hashVal ← (hashVal + charVal * pPower) mod m
6.      pPower ← (pPower * p) mod m
7.  return hashVal
```

---
---

# TOPIC 34: COLLISIONS & THE LOAD FACTOR

### 1. The Inevitability of Collisions: The Pigeonhole Principle
If $| \mathcal{U} | > m$ (the number of possible keys exceeds the number of slots in the table), by Dirichlet's **Pigeonhole Principle**, it is mathematically impossible to construct a hash function that never produces a collision. At least two distinct keys $k_1 \ne k_2$ *must* evaluate to $h(k_1) = h(k_2)$.

---

### 2. The Birthday Paradox & Hash Collisions
How many random keys must we insert into a hash table of size $m = 365$ before the probability of at least one collision exceeds $50\%$?

$$\text{Intuitive Guess}: \approx 180 \text{ keys (half the table)}$$
$$\mathbf{Mathematical \ Truth}: \mathbf{Just \ 23 \ keys!}$$

#### Mathematical Derivation:
The probability $P(\text{No Collision})$ after inserting $n$ keys into $m$ slots is:
$$P(\text{No Collision}) = 1 \cdot \left(1 - \frac{1}{m}\right) \cdot \left(1 - \frac{2}{m}\right) \dots \left(1 - \frac{n-1}{m}\right) = \prod_{i=1}^{n-1} \left(1 - \frac{i}{m}\right)$$
Using the Taylor approximation $e^{-x} \approx 1 - x$ for small $x$:
$$P(\text{No Collision}) \approx \prod_{i=1}^{n-1} e^{-i/m} = e^{-\sum_{i=1}^{n-1} i/m} = e^{-\frac{n(n-1)}{2m}} \approx e^{-\frac{n^2}{2m}}$$
Setting $P(\text{At least one collision}) = 1 - e^{-\frac{n^2}{2m}} \ge 0.5$:
$$e^{-\frac{n^2}{2m}} \le 0.5 \implies -\frac{n^2}{2m} \le \ln(0.5) \approx -0.693$$
$$n \approx \sqrt{2 \ln(2) \cdot m} \approx 1.177 \sqrt{m}$$
For $m = 365$: $n \approx 1.177 \sqrt{365} \approx \mathbf{22.49} \implies \mathbf{23 \ keys!}$

> 📌 **KEY TAKEAWAY**: In any hash table of size $m$, collisions begin to occur after roughly $\sqrt{m}$ insertions! A collision-resolution strategy is not optional; it is fundamental.

---

### 3. The Load Factor ($\alpha$)

### 💡 CONCEPT
The **Load Factor $\alpha$** measures how densely occupied the hash table is:

$$\alpha = \frac{n}{m} = \frac{\text{Total number of stored keys}}{\text{Total number of available slots in table}}$$

- **In Separate Chaining**: $\alpha$ can exceed $1.0$ (chains grow longer). Average chain length equals $\alpha$. Typical threshold: $\alpha \approx 0.75$ to $1.0$.
- **In Open Addressing**: $\alpha$ can **never** exceed $1.0$ (slots are physically limited to $m$). As $\alpha \to 1.0$, probing sequences degrade catastrophically. Typical threshold: $\alpha \le 0.5$ to $0.7$.

When $\alpha$ crosses the threshold, the hash table must perform **Rehashing** (allocate a new table of size $\approx 2m$ and re-index all elements).

---

## 🔁 Module 01 Summary & Key Takeaways

1. **Hashing** compresses a huge key universe into a small table index $[0, m-1]$ in expected $O(1)$ time.
2. A good hash function is deterministic, uniformly distributed, and computationally fast.
3. By the **Birthday Paradox**, collisions occur with high probability after only $O(\sqrt{m})$ insertions.
4. **Load factor $\alpha = n/m$** dictates hash table performance; keeping $\alpha \le 0.75$ guarantees expected $O(1)$ operations.

---
[⬅️ Previous: Part 02 Linear Structures](file:///d:/DSA/Part-02-Linear-Data-Structures/08_deques_and_priority_queues.md) | [Next: Module 02 — Collision Resolution ➡️](file:///d:/DSA/Part-03-Hashing/02_collision_resolution.md)
