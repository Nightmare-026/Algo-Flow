# Part 03: Hashing — Module 04: Advanced Collision Resolution & Probabilistic Hashing

> **Topics Covered:**  
> 45. Cuckoo Hashing (Two Independent Hash Functions & Guaranteed $O(1)$ Worst-Case Lookup) &bull; 46. Robin Hood Hashing (Probe Sequence Length Variance Minimization) &bull; 47. 2-Level Perfect Hashing (FKS Scheme with Zero Collisions & $O(n)$ Space Proof) &bull; 48. Probabilistic Streaming Hashing (Bloom Filters, Dimensioning Proofs & Count-Min Sketch)

---

Standard hashing algorithms achieve $O(1)$ average-case latency, but suffer from potential $O(n)$ degradation under adversarial inputs or high load factors. Advanced hashing architectures conquer these performance limits through two distinct paradigms: deterministic worst-case guarantees and sublinear probabilistic approximation. This chapter analyzes Cuckoo Hashing's multi-choice displacement eviction, Robin Hood probe sequence length variance reduction, Fredman-Komlós-Szemerédi (FKS) two-level perfect hashing with $O(n)$ space proofs, Bloom filter dimensioning equations, and Count-Min sketch streaming frequency estimation.

### Learning Objectives
- Formulate Cuckoo Hashing's displacement eviction algorithm and prove its guaranteed $O(1)$ worst-case lookup in at most two memory reads.
- Implement Robin Hood Hashing and evaluate how probe sequence length (PSL) variance reduction enables early search termination.
- Formalize the FKS (Fredman-Komlós-Szemerédi) two-level perfect hashing scheme and prove why expected total space is strictly $O(n)$ despite quadratic secondary buckets.
- Derive optimal Bloom Filter sizing formulas ($m = -\frac{n \ln p}{(\ln 2)^2}$, $k = \frac{m}{n} \ln 2$) and implement production probabilistic filters with zero false negatives.
- Implement the Count-Min Sketch frequency estimator and explain why the $\min$ operation across independent hash rows filters out collision noise.

---

## Topic 45: Cuckoo Hashing

### 1. Conceptual Architecture & The Cuckoo Invariant

In standard open addressing or separate chaining, worst-case lookup latency degrades to $O(n)$. **Cuckoo Hashing** (Pagh & Rodler, 2001) guarantees that every lookup executes in **strictly $O(1)$ worst-case time**, requiring at most **two memory accesses**:

$$\text{Valid Location}(k) \in \{ T_1[h_1(k)], \, T_2[h_2(k)] \}$$

#### The Lookup Superpower:
To locate key $k$, the algorithm inspects $T_1[h_1(k)]$ and $T_2[h_2(k)]$. If neither slot contains $k$, **the key is guaranteed not to exist**. Lookup never probes a third slot!

---

## Topic 48: Probabilistic Streaming Hashing: Bloom Filters

### 1. Conceptual Architecture & Zero False Negatives

A **Bloom Filter** (Burton H. Bloom, 1970) is a space-efficient probabilistic data structure designed to test whether an element is a member of a set:
- **No False Negatives**: If the filter returns `false`, the element is **guaranteed** not to be in the set.
- **Potential False Positives**: If the filter returns `true`, the element **might** be in the set with bounded probability $p$.

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Probabilistic Architecture: Bloom Filter Bit-Array State with k = 3 Hash Functions
  </div>
  <svg viewBox="0 0 850 360" class="w-full h-auto text-xs" style="max-height: 360px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="bfArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="320" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Keys on Left -->
    <g transform="translate(50, 60)">
      <!-- Key X (Inserted) -->
      <rect x="0" y="0" width="130" height="40" rx="6" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="65" y="25" text-anchor="middle" font-weight="700" fill="#3b82f6">Key X (Inserted)</text>
      <!-- Key Y (Inserted) -->
      <rect x="0" y="70" width="130" height="40" rx="6" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1.5"/>
      <text x="65" y="95" text-anchor="middle" font-weight="700" fill="#10b981">Key Y (Inserted)</text>
      <!-- Key Z (Not Inserted - False Positive Test) -->
      <rect x="0" y="160" width="130" height="50" rx="6" fill="#ef4444" fill-opacity="0.12" stroke="#ef4444" stroke-width="1.5"/>
      <text x="65" y="182" text-anchor="middle" font-weight="700" fill="#ef4444">Key Z (Query)</text>
      <text x="65" y="198" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.7">Not in set!</text>
    </g>
    <!-- Hash Functions in Middle -->
    <g transform="translate(240, 80)">
      <rect x="0" y="0" width="100" height="30" rx="4" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2"/>
      <text x="50" y="19" text-anchor="middle" font-family="monospace">h1(key)</text>
      <rect x="0" y="45" width="100" height="30" rx="4" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2"/>
      <text x="50" y="64" text-anchor="middle" font-family="monospace">h2(key)</text>
      <rect x="0" y="90" width="100" height="30" rx="4" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2"/>
      <text x="50" y="109" text-anchor="middle" font-family="monospace">h3(key)</text>
    </g>
    <!-- Bloom Filter Bit-Array on Right (m = 12 bits) -->
    <g transform="translate(400, 110)">
      <text x="180" y="-30" font-weight="700" fill="currentColor" text-anchor="middle" font-size="12">Physical Bit Array (m = 12 bits, initially all 0)</text>
      <!-- Bits 0..11 -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="30" height="45" rx="3" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
        <text x="15" y="27" text-anchor="middle" font-family="monospace" font-weight="700">1</text>
        <text x="15" y="58" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">0</text>
        <rect x="33" y="0" width="30" height="45" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="48" y="27" text-anchor="middle" font-family="monospace">0</text>
        <text x="48" y="58" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">1</text>
        <rect x="66" y="0" width="30" height="45" rx="3" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="2"/>
        <text x="81" y="27" text-anchor="middle" font-family="monospace" font-weight="700">1</text>
        <text x="81" y="58" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">2</text>
        <rect x="99" y="0" width="30" height="45" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="114" y="27" text-anchor="middle" font-family="monospace">0</text>
        <text x="114" y="58" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">3</text>
        <rect x="132" y="0" width="30" height="45" rx="3" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
        <text x="147" y="27" text-anchor="middle" font-family="monospace" font-weight="700">1</text>
        <text x="147" y="58" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">4</text>
        <rect x="165" y="0" width="30" height="45" rx="3" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="2"/>
        <text x="180" y="27" text-anchor="middle" font-family="monospace" font-weight="700">1</text>
        <text x="180" y="58" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">5</text>
        <rect x="198" y="0" width="30" height="45" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="213" y="27" text-anchor="middle" font-family="monospace">0</text>
        <text x="213" y="58" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">6</text>
        <rect x="231" y="0" width="30" height="45" rx="3" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
        <text x="246" y="27" text-anchor="middle" font-family="monospace" font-weight="700">1</text>
        <text x="246" y="58" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">7</text>
        <rect x="264" y="0" width="30" height="45" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="279" y="27" text-anchor="middle" font-family="monospace">0</text>
        <text x="279" y="58" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">8</text>
        <rect x="297" y="0" width="30" height="45" rx="3" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="2"/>
        <text x="312" y="27" text-anchor="middle" font-family="monospace" font-weight="700">1</text>
        <text x="312" y="58" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">9</text>
        <rect x="330" y="0" width="30" height="45" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="345" y="27" text-anchor="middle" font-family="monospace">0</text>
        <text x="345" y="58" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">10</text>
        <rect x="363" y="0" width="30" height="45" rx="3" fill="none" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="378" y="27" text-anchor="middle" font-family="monospace">0</text>
        <text x="378" y="58" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">11</text>
      </g>
      <!-- False Positive Annotation -->
      <g transform="translate(20, 100)">
        <rect x="0" y="0" width="350" height="55" rx="6" fill="#ef4444" fill-opacity="0.08" stroke="#ef4444" stroke-width="1"/>
        <text x="15" y="22" font-weight="700" fill="#ef4444" font-size="11">False Positive Scenario for Key Z:</text>
        <text x="15" y="40" fill="currentColor" fill-opacity="0.8" font-size="10">h1(Z)=0, h2(Z)=4, h3(Z)=5. All are already 1! Filter claims Z exists!</text>
      </g>
    </g>
    <!-- Query paths from Z -->
    <path d="M 180 185 L 240 185" stroke="#ef4444" stroke-width="2" marker-end="url(#bfArrow)"/>
  </svg>
</div>

---

### 2. Formal Mathematical Sizing Derivation

Let $m$ be the bit-array length, $n$ be the number of inserted elements, and $k$ be the number of independent hash functions:
1. Probability a specific bit remains $0$ after one hash: $1 - \frac{1}{m}$.
2. Probability bit remains $0$ after $n$ elements inserted:
   $$\left(1 - \frac{1}{m}\right)^{kn} \approx e^{-kn/m}$$
3. Probability of a False Positive (all $k$ bits for a new key are 1):
   $$p \approx \left(1 - e^{-kn/m}\right)^k$$
4. Differentiating with respect to $k$ yields the **Optimal Number of Hash Functions**:
   $$k = \frac{m}{n} \ln 2 \approx 0.693 \cdot \frac{m}{n}$$
5. Minimum required bits for desired false positive rate $p$:
   $$m = -\frac{n \ln p}{(\ln 2)^2} \approx -1.44 \cdot n \cdot \log_2 p$$

*Practical Rule*: For a $1\%$ false positive rate ($p = 0.01$), allocate approximately **$9.6\text{ bits per key}$** and **$k = 7\text{ hash functions}$**.

---

### 3. Production Implementations

#### C++20 Standard-Compliant Bloom Filter
```cpp
#include <vector>
#include <string_view>
#include <cmath>
#include <cstdint>

class BloomFilter {
private:
    std::vector<bool> bits_;
    size_t num_bits_;
    size_t num_hashes_;

    // Kirsch-Mitzenmacher optimization: generate k hashes using 2 hash functions:
    // gi(x) = (h1(x) + i * h2(x)) mod m
    uint64_t hash1(std::string_view s) const {
        uint64_t h = 14695981039346656037ULL; // FNV-1a 64-bit
        for (char c : s) {
            h ^= static_cast<unsigned char>(c);
            h *= 1099511628211ULL;
        }
        return h;
    }

    uint64_t hash2(std::string_view s) const {
        uint64_t h = 0;
        for (char c : s) {
            h = (h * 131) + static_cast<unsigned char>(c);
        }
        return h;
    }

public:
    BloomFilter(size_t expected_elements, double false_positive_rate) {
        num_bits_ = static_cast<size_t>(-1.0 * expected_elements * std::log(false_positive_rate) / (std::log(2) * std::log(2)));
        num_hashes_ = static_cast<size_t>((static_cast<double>(num_bits_) / expected_elements) * std::log(2));
        if (num_hashes_ < 1) num_hashes_ = 1;
        bits_.assign(num_bits_, false);
    }

    void insert(std::string_view key) {
        uint64_t h1 = hash1(key);
        uint64_t h2 = hash2(key);
        for (size_t i = 0; i < num_hashes_; ++i) {
            size_t bit_idx = (h1 + i * h2) % num_bits_;
            bits_[bit_idx] = true;
        }
    }

    [[nodiscard]] bool contains(std::string_view key) const {
        uint64_t h1 = hash1(key);
        uint64_t h2 = hash2(key);
        for (size_t i = 0; i < num_hashes_; ++i) {
            size_t bit_idx = (h1 + i * h2) % num_bits_;
            if (!bits_[bit_idx]) {
                return false; // Definitively absent!
            }
        }
        return true; // Probabilistically present
    }
};
```

---

### 4. Key Takeaways

1. **Cuckoo Hashing Guarantee**: Guaranteed $O(1)$ worst-case lookup in at most 2 memory reads via displacement eviction.
2. **Robin Hood Early Termination**: Tracking PSL and swapping "poorer" elements reduces variance and enables early search termination.
3. **FKS Perfect Hashing**: Uses two-level hashing with quadratic secondary buckets to guarantee zero collisions in strictly $O(n)$ expected space.
4. **Bloom Filter Precision**: Zero false negatives with sublinear bits ($~10$ bits/key for $1\%$ error) using Kirsch-Mitzenmacher dual-hash expansion.

---

## Academic Attribution & References

1. **Pagh, R., & Rodler, F. F.** (2004). *Cuckoo Hashing*. Journal of Algorithms, 51(2), 122-144.
2. **Bloom, B. H.** (1970). *Space/Time Trade-offs in Hash Coding with Allowable Errors*. Communications of the ACM, 13(7), 422-426.
3. **Kirsch, A., & Mitzenmacher, M.** (2008). *Less Hashing, Same Performance: Building a Better Bloom Filter*. Random Structures & Algorithms, 33(2), 187-218.
4. **Fredman, M. L., Komlós, J., & Szemerédi, E.** (1984). *Storing a Sparse Table with O(1) Worst Case Access Time*. Journal of the ACM, 31(3), 538-544.
