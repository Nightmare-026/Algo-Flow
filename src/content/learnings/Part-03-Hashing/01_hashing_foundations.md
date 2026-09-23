# Part 03: Hashing — Module 01: Foundations, Hash Functions & Load Factor

> **Topics Covered:**  
> 35. Hashing Principles & Direct Address Table Comparison &bull; 36. Hash Functions & Uniform Distribution (SUHA, Division, Multiplication, Polynomial Rolling Hash) &bull; 37. Collisions, The Birthday Paradox & Load Factor ($\alpha$) &bull; Production Implementations & Formal Derivations

---

Direct address tables offer constant-time retrieval by assigning every possible key a distinct physical array index, but demand catastrophic memory allocations when key universes are sparse. Hashing bridges this efficiency gap by compressing vast key spaces into compact array bounds through deterministic mathematical transformations. This chapter examines the Direct Address Dilemma, Simple Uniform Hashing Assumptions (SUHA), division and multiplication hash generators, polynomial rolling hashes for strings, the mathematical inevitability of collisions under the Birthday Paradox, and load factor ($\alpha$) thresholds for dynamic rehashing.

### Learning Objectives
- Contrast direct addressing with compact hash tables and quantify the memory savings achieved across sparse key spaces.
- Formalize the Simple Uniform Hashing Assumption (SUHA) and evaluate the mathematical properties of division, multiplication, and polynomial rolling hash functions.
- Prove why hash collisions are mathematically unavoidable using Dirichlet's Pigeonhole Principle.
- Derive the Birthday Paradox collision threshold $n \approx 1.177\sqrt{m}$ and explain why collisions occur far earlier than intuition suggests.
- Calculate the load factor $\alpha = n/m$ and define dynamic table resizing (rehashing) triggers to preserve $O(1)$ expected amortized bounds.
- Implement production-grade polynomial string hashing and universal hash generators across C++, Python, and Java.

---

## Topic 35: Hashing Principles & Direct Addressing

### 1. Conceptual Architecture: The Direct Address Dilemma

In an ideal computational model, data retrieval executes in $\Theta(1)$ time by using the search key directly as an array index. This pattern is known as **Direct Addressing**.

#### The Direct Addressing Dilemma:
Suppose an enterprise needs to store employee profiles indexed by a 9-digit Social Security Number (SSN: `000-00-0000` to `999-99-9999`):
- **Universe of Keys ($\mathcal{U}$)**: Contains $10^9$ possible keys ($|\mathcal{U}| = 1,000,000,000$).
- **Direct Address Table**: Requires allocating a contiguous array of $10^9$ pointers. At 8 bytes per pointer, this demands **$8\text{ Gigabytes}$ of RAM**!
- **Sparsity Reality**: If the company employs only $500$ workers, **$99.99995\%$ of the allocated memory sits permanently empty and wasted**.

#### The Hashing Resolution:
Rather than allocating memory for every conceivable key in universe $\mathcal{U}$, allocate a compact table of size $m \ll |\mathcal{U}|$ (e.g., $m = 1,000$ slots, requiring mere kilobytes of RAM). A deterministic mathematical function $h(k)$, called a **Hash Function**, maps keys into table index slots:

$$h: \mathcal{U} \to \{0, 1, \dots, m - 1\}$$

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Architecture Comparison: Direct Addressing Space Waste vs. Hash Modulo Compression
  </div>
  <svg viewBox="0 0 850 360" class="w-full h-auto text-xs" style="max-height: 360px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="hArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="320" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Key Universe U on Left -->
    <g transform="translate(45, 45)">
      <rect x="0" y="0" width="180" height="260" rx="10" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.2"/>
      <text x="90" y="25" font-weight="700" fill="currentColor" text-anchor="middle" font-size="12">Key Universe |U| = 10^9</text>
      <!-- Sparse Keys -->
      <rect x="20" y="50" width="140" height="36" rx="6" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="90" y="72" text-anchor="middle" font-family="monospace" font-weight="700">k1: 248-10-8914</text>
      <rect x="20" y="110" width="140" height="36" rx="6" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1.5"/>
      <text x="90" y="132" text-anchor="middle" font-family="monospace" font-weight="700">k2: 512-40-1002</text>
      <rect x="20" y="170" width="140" height="36" rx="6" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="90" y="192" text-anchor="middle" font-family="monospace" font-weight="700">k3: 881-99-8914</text>
      <text x="90" y="240" font-style="italic" fill="currentColor" fill-opacity="0.6" text-anchor="middle">Only n = 500 keys used</text>
    </g>
    <!-- Center: Hash Transformation Engine -->
    <g transform="translate(270, 100)">
      <rect x="0" y="0" width="170" height="130" rx="8" fill="#8b5cf6" fill-opacity="0.1" stroke="#8b5cf6" stroke-width="2"/>
      <text x="85" y="30" font-weight="700" fill="#8b5cf6" text-anchor="middle" font-size="13">Hash Function h(k)</text>
      <text x="85" y="55" font-family="monospace" fill="currentColor" text-anchor="middle" font-size="12">k mod 1000</text>
      <text x="85" y="85" fill="currentColor" fill-opacity="0.75" text-anchor="middle" font-size="10">Deterministic Mapping</text>
      <text x="85" y="105" fill="currentColor" fill-opacity="0.75" text-anchor="middle" font-size="10">|U| &rarr; [0, m - 1]</text>
    </g>
    <!-- Arrows from Keys to Hash Function -->
    <path d="M 205 118 L 270 140" stroke="#3b82f6" stroke-width="2" marker-end="url(#hArrow)"/>
    <path d="M 205 178 L 270 165" stroke="#10b981" stroke-width="2" marker-end="url(#hArrow)"/>
    <path d="M 205 238 L 270 190" stroke="#f59e0b" stroke-width="2" marker-end="url(#hArrow)"/>
    <!-- Right: Compact Hash Table (m = 1000) -->
    <g transform="translate(500, 45)">
      <rect x="0" y="0" width="280" height="260" rx="10" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.2"/>
      <text x="140" y="25" font-weight="700" fill="currentColor" text-anchor="middle" font-size="12">Compact Hash Table (m = 1000 slots)</text>
      <!-- Slots -->
      <g transform="translate(25, 45)">
        <rect x="0" y="0" width="230" height="32" rx="4" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1.5"/>
        <text x="15" y="20" font-family="monospace" font-weight="700" fill="#10b981">Slot 002:</text>
        <text x="110" y="20" font-family="monospace">Key k2 (512...)</text>
        <rect x="0" y="42" width="230" height="26" rx="4" fill="none" stroke="currentColor" stroke-opacity="0.15" stroke-dasharray="3,3"/>
        <text x="115" y="58" text-anchor="middle" fill="currentColor" fill-opacity="0.4">Slots 003..913 [Empty]</text>
        <!-- Collision Slot 914 -->
        <rect x="0" y="78" width="230" height="60" rx="4" fill="#ef4444" fill-opacity="0.12" stroke="#ef4444" stroke-width="2"/>
        <text x="15" y="98" font-family="monospace" font-weight="700" fill="#ef4444">Slot 914 (COLLISION!):</text>
        <text x="25" y="116" font-family="monospace" font-size="10">&bull; Key k1 (248-10-8914)</text>
        <text x="25" y="130" font-family="monospace" font-size="10">&bull; Key k3 (881-99-8914)</text>
        <rect x="0" y="148" width="230" height="26" rx="4" fill="none" stroke="currentColor" stroke-opacity="0.15" stroke-dasharray="3,3"/>
        <text x="115" y="164" text-anchor="middle" fill="currentColor" fill-opacity="0.4">Slots 915..999 [Empty]</text>
      </g>
    </g>
    <!-- Arrow from Hash Function to Slots -->
    <path d="M 440 145 L 520 110" stroke="#10b981" stroke-width="2" marker-end="url(#hArrow)"/>
    <path d="M 440 175 L 520 170" stroke="#ef4444" stroke-width="2" marker-end="url(#hArrow)"/>
  </svg>
</div>

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
- *Why Avoid Powers of Two ($m = 2^p$)?* Computing $k \pmod{2^p}$ simply isolates the lowest $p$ bits of $k$ (equivalent to a bitwise mask `k & (m - 1)`). All higher-order bits are completely ignored!

#### B. The Multiplication Method (Knuth's Golden Ratio Method)
$$h(k) = \lfloor m \cdot (k \cdot A \pmod 1) \rfloor$$
Where $0 < A < 1$ is a fractional constant. Donald Knuth recommends the conjugate of the Golden Ratio ($\phi \approx 1.6180339887$):
$$A = \frac{\sqrt{5} - 1}{2} \approx 0.6180339887\dots$$

#### C. Polynomial Rolling Hash for Strings
A string $S = s_0 s_1 \dots s_{L-1}$ is treated as a polynomial where character code units are coefficients evaluated at base $p$:
$$h(S) = \left( \sum_{i=0}^{L-1} s_i \cdot p^i \right) \pmod m$$
Where $p$ is a prime roughly equal to alphabet size (e.g., $p = 31$ for lowercase English; $p = 53$ for mixed-case ASCII) and $m$ is a large prime modulus ($10^9 + 7$).

---

## Topic 37: Collisions, The Birthday Paradox & Load Factor ($\alpha$)

### 1. The Inevitability of Collisions: The Pigeonhole Principle

By Dirichlet's **Pigeonhole Principle**, if $n$ items are placed into $m$ containers and $n > m$, at least one container must hold more than one item. Because $|\mathcal{U}| \gg m$, **collisions are mathematically guaranteed to occur**:
$$k_1 \ne k_2 \quad \text{and} \quad h(k_1) = h(k_2)$$

---

### 2. The Birthday Paradox & Collision Likelihood

How many randomly chosen people must gather in a room before the probability that at least two share a birthday exceeds $50\%$? The mathematical answer is **just 23 people**!

#### Formal Mathematical Derivation:
Let $n$ be the number of inserted keys and $m$ be the number of hash table slots. The probability that all $n$ keys hash into distinct slots (zero collisions) is:
$$P(\text{No Collision}) = \prod_{i=1}^{n-1} \left(1 - \frac{i}{m}\right)$$
Using $1 - x \approx e^{-x}$:
$$P(\text{No Collision}) \approx \prod_{i=1}^{n-1} e^{-i/m} = e^{-\sum_{i=1}^{n-1} \frac{i}{m}} = e^{-\frac{n(n-1)}{2m}} \approx e^{-\frac{n^2}{2m}}$$
To find the threshold where collision probability reaches $50\%$ ($P(\text{Collision}) \ge 0.5$):
$$e^{-\frac{n^2}{2m}} \le 0.5 \implies n \approx \sqrt{2 \ln(2)} \cdot \sqrt{m} \approx 1.1774\sqrt{m}$$

| Table Capacity ($m$) | 50% Collision Threshold ($n \approx 1.177\sqrt{m}$) | Percentage of Table Utilized |
| :---: | :---: | :---: |
| **$365$** (Days in Year) | **$23\text{ keys}$** | $6.3\%$ |
| **$1,000$** | **$38\text{ keys}$** | $3.8\%$ |
| **$10,000$** | **$118\text{ keys}$** | $1.18\%$ |
| **$1,000,000$** | **$1,177\text{ keys}$** | $0.12\%$ |

---

### 3. Production Implementations

#### A. C++20 Polynomial String Hash with Avalanche Bit-Mixer
```cpp
#include <string_view>
#include <cstdint>

class HashUtil {
public:
    // Polynomial Rolling Hash for Strings
    static uint64_t polynomial_string_hash(std::string_view s, uint64_t p = 53, uint64_t m = 1'000'000'007) {
        uint64_t hash_val = 0;
        uint64_t p_power = 1;
        for (char c : s) {
            uint64_t char_val = static_cast<unsigned char>(c) + 1;
            hash_val = (hash_val + char_val * p_power) % m;
            p_power = (p_power * p) % m;
        }
        return hash_val;
    }

    // SplitMix64 64-bit Integer Avalanche Hash (Used in fast hashtables)
    static uint64_t splitmix64(uint64_t x) {
        x += 0x9e3779b97f4a7c15ULL;
        x = (x ^ (x >> 30)) * 0xbf58476d1ce4e5b9ULL;
        x = (x ^ (x >> 27)) * 0x94d049bb133111ebULL;
        return x ^ (x >> 31);
    }
};
```

#### B. Python 3 Rolling Hash with Substring Slice O(1) Equality
```python
class RollingHash:
    """Computes polynomial string hash and prefix hash powers for O(1) substring queries."""
    def __init__(self, s: str, base: int = 53, mod: int = 1_000_000_007):
        self.s = s
        self.base = base
        self.mod = mod
        n = len(s)
        self.prefix_hash = [0] * (n + 1)
        self.power = [1] * (n + 1)
        
        for i in range(n):
            val = ord(s[i]) + 1
            self.prefix_hash[i + 1] = (self.prefix_hash[i] * base + val) % mod
            self.power[i + 1] = (self.power[i] * base) % mod

    def query(self, left: int, right: int) -> int:
        """Returns the polynomial hash of substring s[left:right+1] in O(1) time."""
        total = self.prefix_hash[right + 1]
        subtract = (self.prefix_hash[left] * self.power[right - left + 1]) % self.mod
        return (total - subtract + self.mod) % self.mod
```

---

### 4. Key Takeaways

1. **Direct Addressing vs. Hashing**: Direct addressing trades infinite memory for $O(1)$ lookups; hashing achieves expected $O(1)$ performance in compact memory by mapping keys into $[0, m-1]$.
2. **Prime Moduli**: The classical division method utilizes prime table sizes $m$ to avoid harmonic bit-clustering.
3. **The Birthday Paradox**: Collisions occur with $50\%$ probability after only $O(\sqrt{m})$ insertions ($23$ keys for $m = 365$).
4. **Load Factor Governance**: Maintaining $\alpha \le 0.75$ guarantees expected $O(1)$ operations across practical workloads.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 11: *Hash Tables*. MIT Press.
2. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 6.4: *Hashing*. Addison-Wesley.
3. **Mitzenmacher, M., & Upfal, E.** (2017). *Probability and Computing: Randomization and Probabilistic Techniques in Algorithms* (2nd ed.), Chapter 5: *Balls, Bins, and Random Graphs*. Cambridge University Press.
