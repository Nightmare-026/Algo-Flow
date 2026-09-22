# Part 03: Hashing — Module 01: Foundations, Hash Functions & Load Factor

> **Topics Covered:**  
> 35. Hashing Principles & Direct Address Table Comparison &bull; 36. Hash Functions & Uniform Distribution &bull; 37. Collisions, The Birthday Paradox & Load Factor ($\alpha$)

---

Direct address tables offer constant-time retrieval by assigning every possible key a distinct physical array index, but demand catastrophic memory allocations when key universes are sparse. Hashing bridges this efficiency gap by compressing vast key spaces into compact array bounds through deterministic mathematical transformations. This chapter examines the Direct Address Dilemma, Simple Uniform Hashing Assumptions (SUHA), division and multiplication hash generators, polynomial rolling hashes for strings, the mathematical inevitability of collisions under the Birthday Paradox, and load factor ($\alpha$) thresholds for dynamic rehashing.

### Learning Objectives
- Contrast direct addressing with compact hash tables and quantify the memory savings achieved across sparse key spaces.
- Formalize the Simple Uniform Hashing Assumption (SUHA) and evaluate the mathematical properties of division, multiplication, and polynomial rolling hash functions.
- Prove why hash collisions are mathematically unavoidable using Dirichlet's Pigeonhole Principle.
- Derive the Birthday Paradox collision threshold $n \approx 1.177\sqrt{m}$ and explain why collisions occur far earlier than intuition suggests.
- Calculate the load factor $\alpha = n/m$ and define dynamic table resizing (rehashing) triggers to preserve $O(1)$ expected amortized bounds.

---

## Topic 35: Hashing Principles & Direct Addressing

### 1. Conceptual Architecture: The Direct Address Dilemma

In an ideal computational model, data retrieval executes in $\Theta(1)$ time by using the search key directly as an array index. This pattern is known as **Direct Addressing**.

#### The Direct Addressing Dilemma
Suppose an enterprise needs to store employee profiles indexed by a 9-digit Social Security Number (SSN: `000-00-0000` to `999-99-9999`):
- **Universe of Keys ($\mathcal{U}$)**: Contains $10^9$ possible keys ($|\mathcal{U}| = 1,000,000,000$).
- **Direct Address Table**: Requires allocating a contiguous array of $10^9$ pointers. At 8 bytes per pointer, this demands **$8\text{ Gigabytes}$ of RAM**!
- **Sparsity Reality**: If the company employs only $500$ workers, **$99.99995\%$ of the allocated memory sits permanently empty and wasted**.

#### The Hashing Resolution
Rather than allocating memory for every conceivable key in universe $\mathcal{U}$, allocate a compact table of size $m \ll |\mathcal{U}|$ (e.g., $m = 1,000$ slots, requiring mere kilobytes of RAM). A deterministic mathematical function $h(k)$, called a **Hash Function**, maps keys into table index slots:

$$h: \mathcal{U} \to \{0, 1, \dots, m - 1\}$$

| Key Category | Example Raw Key | Hash Transformation $h(k) = k \pmod{1000}$ | Assigned Slot | Allocation Impact |
| :--- | :---: | :---: | :---: | :--- |
| **Active Employee 1** | `248-10-8914` | $248108914 \pmod{1000}$ | `Slot 914` | Mapped to valid index |
| **Active Employee 2** | `512-40-1002` | $512401002 \pmod{1000}$ | `Slot 2` | Mapped to valid index |
| **Active Employee 3** | `881-99-8914` | $881998914 \pmod{1000}$ | `Slot 914` | **Collision with Employee 1!** |

Because $|\mathcal{U}| > m$, multiple keys will occasionally map to the same slot. Handling this gracefully is the core focus of hashing architecture.

---

## Topic 36: Hash Functions & Uniform Distribution

### 1. Desirable Properties of Production Hash Functions

1. **Strict Determinism**: For any identical key $k$, $h(k)$ must evaluate to the exact same integer every time across the process lifecycle.
2. **Simple Uniform Hashing Assumption (SUHA)**: Every key is equally likely to hash into any of the $m$ slots, independently of where any other key has hashed:
   $$\Pr(h(k_1) = j) = \frac{1}{m} \quad \text{for all } j \in \{0, \dots, m - 1\}$$
3. **Computational Efficiency**: Evaluates in $O(1)$ time for fixed-width numeric keys and $O(L)$ time for strings of length $L$.
4. **The Avalanche Effect**: Flipping a single bit in the input key should alter roughly $50\%$ of the bits in the output hash code, preventing clustered hash values for sequential keys.

---

### 2. Classic Hash Function Algorithms

#### A. The Division Method
$$h(k) = k \pmod m$$
- **Rule for Table Size $m$**: Choose $m$ to be a **prime number** not close to powers of 2 or 10.
- *Why Avoid Powers of Two ($m = 2^p$)?*  
  Computing $k \pmod{2^p}$ simply isolates the lowest $p$ bits of $k$ (equivalent to a bitwise mask `k & (m - 1)`). All higher-order bits are completely ignored! If keys share common suffixes, all keys collide into the exact same buckets. Choosing a prime number forces the hash value to depend on all bits of $k$.

#### B. The Multiplication Method (Knuth's Golden Ratio Method)
$$h(k) = \lfloor m \cdot (k \cdot A \pmod 1) \rfloor$$
Where $0 < A < 1$ is a fractional constant, and $k \cdot A \pmod 1$ represents the fractional part of $k \cdot A$.  
Donald Knuth recommends the conjugate of the Golden Ratio ($\phi \approx 1.6180339887$):

$$A = \frac{\sqrt{5} - 1}{2} \approx 0.6180339887\dots$$

- **Advantage**: The choice of table size $m$ is not critical; it functions effectively even when $m$ is chosen as an efficient power of two ($m = 2^p$).

#### C. Polynomial Rolling Hash for Strings
A string $S = s_0 s_1 \dots s_{L-1}$ is treated as a polynomial where character code units are coefficients evaluated at base $p$:

$$h(S) = \left( \sum_{i=0}^{L-1} s_i \cdot p^i \right) \pmod m$$

Where:
- $p$: A prime roughly equal to alphabet size (e.g., $p = 31$ for lowercase English; $p = 53$ for mixed-case ASCII).
- $m$: A large prime modulus (e.g., $10^9 + 7$ or $10^9 + 9$) to bound integer values and prevent overflow.

```text
FUNCTION PolynomialStringHash(S: String, p: Integer = 31, m: Integer = 1000000007) -> Integer:
    hashVal <- 0
    pPower <- 1
    for each char c in S:
        // Convert char to 1-based index ('a' -> 1, 'b' -> 2, ...)
        charVal <- ASCII(c) - ASCII('a') + 1
        hashVal <- (hashVal + charVal * pPower) mod m
        pPower <- (pPower * p) mod m
    return hashVal
```

---

## Topic 37: Collisions, The Birthday Paradox & Load Factor ($\alpha$)

### 1. The Inevitability of Collisions: The Pigeonhole Principle

By Dirichlet's **Pigeonhole Principle**, if $n$ items are placed into $m$ containers and $n > m$, at least one container must hold more than one item.  
Because any realistic universe of keys $|\mathcal{U}|$ vastly exceeds the physical table capacity $m$ ($|\mathcal{U}| \gg m$), **collisions are mathematically guaranteed to occur**. A collision occurs whenever:

$$k_1 \ne k_2 \quad \text{and} \quad h(k_1) = h(k_2)$$

---

### 2. The Birthday Paradox & Collision Likelihood

How many randomly chosen people must gather in a room before the probability that at least two share a birthday exceeds $50\%$?  
While common intuition guesses $\approx 180$ people (half of 365 days), the mathematical answer is **just 23 people**!

#### Formal Mathematical Derivation:
Let $n$ be the number of inserted keys and $m$ be the number of hash table slots. The probability that all $n$ keys hash into distinct slots (zero collisions) is:

$$P(\text{No Collision}) = 1 \cdot \left(1 - \frac{1}{m}\right) \cdot \left(1 - \frac{2}{m}\right) \cdots \left(1 - \frac{n-1}{m}\right) = \prod_{i=1}^{n-1} \left(1 - \frac{i}{m}\right)$$

Applying the standard Taylor series approximation $1 - x \approx e^{-x}$ for small $x$:

$$P(\text{No Collision}) \approx \prod_{i=1}^{n-1} e^{-i/m} = e^{-\sum_{i=1}^{n-1} \frac{i}{m}} = e^{-\frac{n(n-1)}{2m}} \approx e^{-\frac{n^2}{2m}}$$

To find the number of keys $n$ where the collision probability reaches $50\%$ ($P(\text{At least one collision}) \ge 0.5$):

$$e^{-\frac{n^2}{2m}} \le 0.5 \implies -\frac{n^2}{2m} \le \ln(0.5) \approx -0.6931$$

$$n^2 \ge 2 \ln(2) \cdot m \implies n \approx \sqrt{2 \ln(2)} \cdot \sqrt{m} \approx 1.1774\sqrt{m}$$

#### Collision Threshold by Table Size

| Table Capacity ($m$) | 50% Collision Threshold ($n \approx 1.177\sqrt{m}$) | Percentage of Table Utilized |
| :---: | :---: | :---: |
| **$365$** (Days in Year) | **$23\text{ keys}$** | $6.3\%$ |
| **$1,000$** | **$38\text{ keys}$** | $3.8\%$ |
| **$10,000$** | **$118\text{ keys}$** | $1.18\%$ |
| **$1,000,000$** | **$1,177\text{ keys}$** | $0.12\%$ |

> 📌 **Architectural Lesson**:  
> In any hash table of size $m$, collisions begin to occur after roughly $\sqrt{m}$ insertions! Collision resolution is not an exceptional edge case; it is the central operational reality of every hash table.

---

### 3. The Load Factor ($\alpha$) & Rehashing Dynamics

The **Load Factor $\alpha$** measures the average occupancy density of the hash table:

$$\alpha = \frac{n}{m} = \frac{\text{Number of elements stored}}{\text{Total number of allocated slots}}$$

#### Impact of $\alpha$ on Collision Resolution Paradigms

| Property | Separate Chaining | Open Addressing (Probing) |
| :--- | :--- | :--- |
| **Theoretical Range** | $0 \le \alpha < \infty$ ($\alpha$ can exceed 1.0) | $0 \le \alpha \le 1.0$ (Strictly bounded by $m$) |
| **Average Bucket Length** | Exactly $\alpha$ | Not applicable (all elements stored in array) |
| **Expected Search Time** | $\Theta(1 + \alpha)$ | Unsuccessful: $\frac{1}{1 - \alpha}$, Successful: $\frac{1}{\alpha} \ln \frac{1}{1 - \alpha}$ |
| **Standard Resize Trigger** | $\alpha > 0.75\text{ to } 1.0$ | $\alpha > 0.5\text{ to } 0.7$ |

#### Dynamic Rehashing
When $\alpha$ exceeds the predefined threshold:
1. Allocate a new backing array with approximately double capacity ($m_{\text{new}} \approx 2m$, ideally the next prime number).
2. Re-compute $h_{\text{new}}(k) = k \pmod{m_{\text{new}}}$ for every existing element and insert into the new table.
3. Deallocate the old table.

Because dynamic doubling occurs geometrically, dynamic rehashing runs in **amortized $O(1)$ time** per insertion, preserving the constant-time performance contract.

---

### 4. Key Takeaways

1. **Direct Addressing vs. Hashing**: Direct addressing trades infinite memory for $O(1)$ lookups; hashing achieves expected $O(1)$ performance in compact memory by mapping keys into $[0, m-1]$.
2. **Prime Moduli (classical division-method guidance)**: The classical division method is often taught with prime table sizes $m$ to reduce clustering; modern implementations may instead use power-of-two capacities with hash mixing.
3. **The Birthday Paradox**: Collisions occur with $50\%$ probability after only $O(\sqrt{m})$ insertions ($23$ keys for $m = 365$).
4. **Load Factor Governance**: With a suitable hash function and appropriate collision-resolution strategy, operations are typically expected $O(1)$ at controlled load factors (e.g. $\alpha \le 0.75$ as a common threshold). Expected cost also depends on hash quality, key distribution, resizing strategy, and implementation details.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 11: *Hash Tables*. MIT Press.
2. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 6.4: *Hashing*. Addison-Wesley.
3. **Mitzenmacher, M., & Upfal, E.** (2017). *Probability and Computing: Randomization and Probabilistic Techniques in Algorithms* (2nd ed.), Chapter 5: *Balls, Bins, and Random Graphs*. Cambridge University Press.
