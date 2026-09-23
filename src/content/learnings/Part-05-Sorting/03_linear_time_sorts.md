# Part 05: Sorting — Module 03: Non-Comparison Linear Time Sorts

> **Topics Covered:**  
> 56. Counting Sort (Frequency Hashing & Stable Reconstruction) &bull; 57. Radix Sort (LSD vs MSD Positional Sorting) &bull; 58. Bucket Sort (Uniform Distribution & Scatter-Gather)

---

Comparison-based sorting algorithms are fundamentally bound by the $\Omega(n \log n)$ decision tree lower bound. Non-comparison sorting algorithms—Counting Sort, Radix Sort, and Bucket Sort—bypass this mathematical barrier by exploiting algebraic and structural properties of the input keys rather than comparing relative magnitudes. By leveraging bounded integer ranges, positional digit decompositions, and continuous probability distributions, these algorithms achieve linear $\Theta(n)$ execution time. This chapter explores frequency histograms, prefix sum address calculation, multi-pass positional stability, bitwise radix extraction, and probabilistic scatter-gather architectures.

### Learning Objectives
- Formulate how frequency histograms and cumulative prefix sums establish exact target indices in Counting Sort.
- Implement backward stable array reconstruction in Counting Sort and prove why backward traversal is mandatory for stability.
- Differentiate Least Significant Digit (LSD) from Most Significant Digit (MSD) Radix Sort, proving why LSD requires a stable sub-sorter.
- Analyze Radix Sort base selection trade-offs ($b = 10$ vs $b = 2^8 = 256$) for high-throughput 32-bit and 64-bit integer sorting.
- Formulate the scatter-sort-gather pipeline of Bucket Sort and prove its expected linear runtime under a continuous uniform distribution $U[0, 1)$.

---

## Topic 56: Counting Sort (Frequency Hashing & Cumulative Prefix Sums)

### 1. The Direct-Indexing Paradigm

Counting Sort assumes that each of the $n$ input elements is an integer in the bounded range $[0, k]$. Rather than performing comparisons, it determines for each input element $x$ how many elements in the input are strictly smaller than $x$. With this count in hand, $x$ can be placed directly into its final position in the output array.

The algorithm operates in three distinct phases:
1. **Histogram Construction:** Compute a frequency histogram array $C[0 \dots k]$ where $C[v]$ records the occurrences of value $v$ in input array $A$.
2. **Cumulative Prefix Sums:** Transform $C$ in place such that each cell $C[v]$ stores $\sum_{j=0}^{v} C[j]$. The value $C[v]$ indicates the total count of elements $\le v$, which defines the upper boundary of index positions where value $v$ belongs in the output.
3. **Backward Stable Placement:** Traverse the original array $A$ backwards from index $n - 1$ down to $0$. For each element $A[i]$, place it at index $C[A[i]] - 1$ in output buffer $B$, and decrement $C[A[i]]$.

---

### 2. Frequency & Cumulative Prefix Trace

Consider sorting the array $A = [4, 2, 2, 8, 3, 3, 1]$ of size $n = 7$ with maximum key $k = 8$:

| Key Value ($v$) | Raw Frequency ($C[v]$) | Cumulative Count ($\sum_{j=0}^v C[j]$) | Reserved Output Indices in $B$ | Algorithmic Significance |
| :---: | :---: | :---: | :---: | :--- |
| **`0`** | `0` | `0` | None | No zero elements |
| **`1`** | `1` | `1` | Index `0` | Single instance of 1 |
| **`2`** | `2` | `3` | Indices `1, 2` | Two instances of 2 |
| **`3`** | `2` | `5` | Indices `3, 4` | Two instances of 3 |
| **`4`** | `1` | `6` | Index `5` | Single instance of 4 |
| **`5`** | `0` | `6` | None | Value absent |
| **`6`** | `0` | `6` | None | Value absent |
| **`7`** | `0` | `6` | None | Value absent |
| **`8`** | `1` | `7` | Index `6` | Single instance of 8 |

---

### 3. Backward Stable Placement Trace

Traversing $A = [4, 2_a, 2_b, 8, 3_a, 3_b, 1]$ from right to left ($i = 6$ down to $0$):

| Step $i$ | Inspected Value $A[i]$ | Current $C[A[i]]$ | Output Index ($C[A[i]] - 1$) | Updated $C[A[i]]$ | Output Array State $B$ |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **`6`** | `1` | `1` | $1 - 1 = \mathbf{0}$ | $0$ | $[1, \_, \_, \_, \_, \_, \_]$ |
| **`5`** | $3_b$ | `5` | $5 - 1 = \mathbf{4}$ | $4$ | $[1, \_, \_, \_, 3_b, \_, \_]$ |
| **`4`** | $3_a$ | `4` | $4 - 1 = \mathbf{3}$ | $3$ | $[1, \_, \_, 3_a, 3_b, \_, \_]$ |
| **`3`** | `8` | `7` | $7 - 1 = \mathbf{6}$ | $6$ | $[1, \_, \_, 3_a, 3_b, \_, 8]$ |
| **`2`** | $2_b$ | `3` | $3 - 1 = \mathbf{2}$ | $2$ | $[1, \_, 2_b, 3_a, 3_b, \_, 8]$ |
| **`1`** | $2_a$ | `2` | $2 - 1 = \mathbf{1}$ | $1$ | $[1, 2_a, 2_b, 3_a, 3_b, \_, 8]$ |
| **`0`** | `4` | `6` | $6 - 1 = \mathbf{5}$ | $5$ | $[1, 2_a, 2_b, 3_a, 3_b, 4, 8]$ |

> **Why Backward Traversal is Mandatory for Stability:**  
> In step 5, duplicate $3_b$ (appearing later in $A$) was assigned output index 4. In step 4, duplicate $3_a$ (appearing earlier in $A$) was assigned output index 3. Because $3_a$ occupies a smaller index than $3_b$, their relative original order is strictly preserved. Traversing forward would place $3_a$ at 4 and $3_b$ at 3, inverting their order and destroying stability.

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Algorithm Pipelines: Non-Comparison Linear-Time Sorting Mechanics
  </div>
  <svg viewBox="0 0 850 360" class="w-full h-auto text-xs" style="max-height: 360px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="linArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="320" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Left: Counting Sort Pipeline -->
    <g transform="translate(45, 45)">
      <text x="175" y="20" font-weight="700" fill="#3b82f6" text-anchor="middle" font-size="13">Counting Sort: Frequency &amp; Prefix Address</text>
      <!-- Phase 1: Raw Histogram -->
      <g transform="translate(10, 45)">
        <rect x="0" y="0" width="330" height="40" rx="6" fill="#3b82f6" fill-opacity="0.1" stroke="#3b82f6"/>
        <text x="15" y="25" font-family="monospace" font-size="11">C[v]: Raw Frequencies of values 0..k</text>
      </g>
      <!-- Phase 2 Arrow -->
      <path d="M 175 90 L 175 125" stroke="#3b82f6" stroke-width="2" marker-end="url(#linArrow)"/>
      <text x="185" y="110" font-size="10" fill="#3b82f6" font-weight="600">Prefix Sums: C[v] += C[v-1]</text>
      <!-- Phase 2: Cumulative Sums -->
      <g transform="translate(10, 130)">
        <rect x="0" y="0" width="330" height="40" rx="6" fill="#10b981" fill-opacity="0.15" stroke="#10b981"/>
        <text x="15" y="25" font-family="monospace" font-size="11">C[v]: Exact boundary indices in output</text>
      </g>
      <!-- Phase 3 Arrow -->
      <path d="M 175 175 L 175 210" stroke="#10b981" stroke-width="2" marker-end="url(#linArrow)"/>
      <text x="185" y="195" font-size="10" fill="#10b981" font-weight="600">Backward Scan: i = n-1 down to 0</text>
      <!-- Phase 3: Output Array -->
      <g transform="translate(10, 215)">
        <rect x="0" y="0" width="330" height="40" rx="6" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="15" y="25" font-family="monospace" font-size="11" font-weight="700">Output B: Stable in &Theta;(n + k) Time!</text>
      </g>
    </g>
    <!-- Divider -->
    <line x1="420" y1="40" x2="420" y2="340" stroke="currentColor" stroke-opacity="0.15" stroke-width="1.5"/>
    <!-- Right: Radix & Bucket Sort Overview -->
    <g transform="translate(450, 45)">
      <text x="180" y="20" font-weight="700" fill="#10b981" text-anchor="middle" font-size="13">Radix &amp; Bucket Sort Architectures</text>
      <!-- Radix Sort LSD Multi-Pass -->
      <g transform="translate(10, 45)">
        <rect x="0" y="0" width="340" height="85" rx="6" fill="#10b981" fill-opacity="0.08" stroke="#10b981"/>
        <text x="15" y="22" font-weight="700" fill="#10b981" font-size="11">Radix Sort (LSD - Least Significant Digit):</text>
        <text x="15" y="42" fill="currentColor" fill-opacity="0.8" font-size="10">Pass 1: Sort by Units digit (10^0)</text>
        <text x="15" y="58" fill="currentColor" fill-opacity="0.8" font-size="10">Pass 2: Sort by Tens digit (10^1) using STABLE sub-sort</text>
        <text x="15" y="74" font-size="10" font-weight="600" fill="#10b981">Total Time: &Theta;(d &middot; (n + b)) &rarr; Strict O(n) for fixed bitwidth!</text>
      </g>
      <!-- Bucket Sort Scatter-Gather -->
      <g transform="translate(10, 145)">
        <rect x="0" y="0" width="340" height="95" rx="6" fill="#f59e0b" fill-opacity="0.08" stroke="#f59e0b"/>
        <text x="15" y="22" font-weight="700" fill="#f59e0b" font-size="11">Bucket Sort (Continuous Uniform U[0, 1)):</text>
        <text x="15" y="42" fill="currentColor" fill-opacity="0.8" font-size="10">1. Scatter: Hash elements into n interval buckets [0, 1/n), [1/n, 2/n)...</text>
        <text x="15" y="60" fill="currentColor" fill-opacity="0.8" font-size="10">2. Sort: Insertion sort individual small buckets</text>
        <text x="15" y="78" font-size="10" font-weight="600" fill="#f59e0b">3. Gather: Concatenate buckets &rarr; Expected O(n) time!</text>
      </g>
      <text x="180" y="265" text-anchor="middle" font-size="10" fill="currentColor" fill-opacity="0.75">&bull; Bypasses &Omega;(n log n) comparison lower bound</text>
    </g>
  </svg>
</div>

---

### 4. Canonical Algorithm: Stable Counting Sort

```text
FUNCTION CountingSort(A: Array of Integer, n: Integer, k: Integer) -> Array of Integer:
    // Allocate count buffer of size k + 1 and output buffer of size n
    count <- Array of size (k + 1) initialized to 0
    output <- Array of size n

    // Phase 1: Build frequency histogram
    FOR i <- 0 TO n - 1 DO
        count[A[i]] <- count[A[i]] + 1
    END FOR

    // Phase 2: Compute cumulative prefix sums
    FOR j <- 1 TO k DO
        count[j] <- count[j] + count[j - 1]
    END FOR

    // Phase 3: Place elements backwards into output buffer
    FOR i <- n - 1 DOWNTO 0 DO
        val <- A[i]
        targetIdx <- count[val] - 1
        output[targetIdx] <- val
        count[val] <- count[val] - 1
    END FOR

    RETURN output
```

#### Complexity & Domain Constraints:
- **Time Complexity:** $\Theta(n + k)$ across all cases (best, average, worst). Building histogram takes $\Theta(n)$, prefix sums take $\Theta(k)$, and output placement takes $\Theta(n)$.
- **Auxiliary Space:** $\Theta(n + k)$ for the count array of size $k + 1$ and output buffer of size $n$.
- **Operational Boundary:** Counting Sort is asymptotically optimal when $k = O(n)$, yielding $\Theta(n)$ time. If $k = \Omega(n^2)$ (e.g., sorting 10 integers where maximum value is $10^9$), the $\Theta(k)$ memory and runtime overhead makes it far worse than standard $O(n \log n)$ algorithms.

---

## Topic 57: Radix Sort (Positional Digit Sorting)

### 1. Positional Decomposition & The Stability Invariant

When integer keys span a wide numerical range $[0, k]$ where $k \gg n$, Counting Sort becomes impractical. **Radix Sort** overcomes this by decomposing each key into $d$ digits evaluated in a specific positional numerical base $b$:

$$x = \sum_{j=0}^{d-1} \text{digit}_j(x) \cdot b^j, \quad \text{where } 0 \le \text{digit}_j(x) < b$$

- **LSD (Least Significant Digit) Radix Sort:** Sorts keys starting from the least significant digit (units position) toward the most significant digit (highest power of $b$).
- **MSD (Most Significant Digit) Radix Sort:** Sorts keys starting from the highest power of $b$ toward the units digit, recursively partitioning elements into sub-buckets (similar to a Trie or QuickSort).

> **The Fundamental LSD Theorem:**  
> If an array is sorted by digit $j$ using an **unconditionally stable** sorting subroutine, then for any two keys whose digits at positions $\ge j$ are identical, their relative sorted order from previous digit passes $< j$ is strictly preserved. Therefore, sorting passes from least significant digit ($j = 0$) to most significant digit ($j = d - 1$) yields a globally sorted array.

---

### 2. Multi-Pass LSD State Progression

Consider sorting eight 3-digit decimal numbers ($b = 10, d = 3$):  
$A = [170, 045, 075, 090, 002, 024, 802, 066]$

| Key Identifier | Pass 1: Units Digit ($d_0 = x \bmod 10$) | Pass 1 Sorted State | Pass 2: Tens Digit ($d_1 = \lfloor x/10 \rfloor \bmod 10$) | Pass 2 Sorted State | Pass 3: Hundreds ($d_2 = \lfloor x/100 \rfloor \bmod 10$) | Final Globally Sorted State |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **$170$** | `0` | `170` | `7` | `002` | `1` | **`002` (2)** |
| **$045$** | `5` | `090` | `4` | `802` | `0` | **`024` (24)** |
| **$075$** | `5` | `002` | `7` | `024` | `0` | **`045` (45)** |
| **$090$** | `0` | `802` | `9` | `045` | `0` | **`066` (66)** |
| **$002$** | `2` | `024` | `0` | `066` | `0` | **`075` (75)** |
| **$024$** | `4` | `045` | `2` | `170` | `0` | **`090` (90)** |
| **$802$** | `2` | `075` | `0` | `075` | `8` | **`170`** |
| **$066$** | `6` | `066` | `6` | `090` | `0` | **`802`** |

Notice that in Pass 2, $002$ and $802$ both have tens digit $0$. Because the digit sort is stable, $002$ remains before $802$ as established in Pass 1. In Pass 3, sorting by the hundreds digit places all numbers beginning with $0$ in front, perfectly ordered by their lower digits.

---

### 3. Canonical Algorithm: LSD Radix Sort

```text
FUNCTION RadixSort(A: Array of Integer, n: Integer):
    maxVal <- FindMaximum(A, n)

    // Execute stable counting sort for each digit position: 1, 10, 100...
    exp <- 1
    WHILE FLOOR(maxVal / exp) > 0 DO
        CountingSortByDigit(A, n, exp)
        exp <- exp * 10
    END WHILE

FUNCTION CountingSortByDigit(A: Array of Integer, n: Integer, exp: Integer):
    output <- Array of size n
    count <- Array of size 10 initialized to 0

    // Count occurrences of current digit: (A[i] / exp) % 10
    FOR i <- 0 TO n - 1 DO
        digit <- FLOOR(A[i] / exp) MOD 10
        count[digit] <- count[digit] + 1
    END FOR

    // Prefix sums
    FOR j <- 1 TO 9 DO
        count[j] <- count[j] + count[j - 1]
    END FOR

    // Build output array backwards to guarantee stability
    FOR i <- n - 1 DOWNTO 0 DO
        digit <- FLOOR(A[i] / exp) MOD 10
        output[count[digit] - 1] <- A[i]
        count[digit] <- count[digit] - 1
    END FOR

    // Copy sorted output back to array A
    FOR i <- 0 TO n - 1 DO
        A[i] <- output[i]
    END FOR
```

---

### 4. Asymptotic Complexity & High-Performance Radix Choice

The total runtime of LSD Radix Sort across $n$ keys with maximum value $k$ in base $b$ is:

$$T(n) = \Theta(d \cdot (n + b)), \quad \text{where } d = \left\lceil \log_b(k + 1) \right\rceil$$

#### Hardware-Optimized Base Selection:
When sorting 32-bit unsigned integers:
- Choosing decimal base $b = 10$ requires $d = 10$ passes, and integer division/modulo instructions (`/` and `%`) which are computationally expensive on CPUs.
- Choosing base $b = 2^8 = 256$ (1 byte per digit) allows digits to be extracted using instant bitwise shifts and bitmasks:
  $$\text{digit}_j(x) = (x \gg (8 \cdot j)) \ \& \ \text{0xFF}$$
- Number of passes: $d = 32 / 8 = 4$ passes.
- Frequency buffer size per pass: $b = 256$ integers (fits effortlessly into L1 CPU cache).
- Total runtime: $4 \times (n + 256) = \mathbf{\Theta(n)}$.

On modern hardware, a 4-pass 8-bit Radix Sort routinely outperforms Quicksort by a factor of $2\times$ to $3\times$ when sorting millions of 32-bit integers.

---

## Topic 58: Bucket Sort (Uniform Scatter-Gather Partitioning)

### 1. The Scatter-Gather Architecture

Bucket Sort assumes that the input data is generated by a random process that distributes elements **uniformly and independently** over the continuous real interval $[0.0, 1.0)$.

The algorithm proceeds through three phases:
1. **Scatter:** Divide $[0.0, 1.0)$ into $n$ equal-width sub-intervals (buckets) of size $1/n$. For each element $A[i]$, map it to bucket index $b = \lfloor n \cdot A[i] \rfloor$ and insert it into a dynamic linked list or resizable array at `buckets[b]`.
2. **Sort:** Sort each individual bucket independently using Insertion Sort.
3. **Gather:** Concatenate all sorted buckets in order from bucket $0$ to $n - 1$ to form the final sorted array.

---

### 2. State Progression: Distributing Keys into Buckets

Consider sorting $n = 10$ floating-point values:  
$A = [0.78, 0.17, 0.39, 0.26, 0.72, 0.94, 0.21, 0.12, 0.23, 0.68]$

| Bucket Index ($b$) | Continuous Range | Raw Scattered Elements ($A[i]$) | Sorted Bucket State (Insertion Sort) | Gather Order |
| :---: | :---: | :---: | :---: | :---: |
| **`0`** | $[0.0, 0.1)$ | $\emptyset$ | $\emptyset$ | — |
| **`1`** | $[0.1, 0.2)$ | $[0.17, 0.12]$ | $[0.12, 0.17]$ | Indices `0, 1` |
| **`2`** | $[0.2, 0.3)$ | $[0.26, 0.21, 0.23]$ | $[0.21, 0.23, 0.26]$ | Indices `2, 3, 4` |
| **`3`** | $[0.3, 0.4)$ | $[0.39]$ | $[0.39]$ | Index `5` |
| **`4`** | $[0.4, 0.5)$ | $\emptyset$ | $\emptyset$ | — |
| **`5`** | $[0.5, 0.6)$ | $\emptyset$ | $\emptyset$ | — |
| **`6`** | $[0.6, 0.7)$ | $[0.68]$ | $[0.68]$ | Index `6` |
| **`7`** | $[0.7, 0.8)$ | $[0.78, 0.72]$ | $[0.72, 0.78]$ | Indices `7, 8` |
| **`8`** | $[0.8, 0.9)$ | $\emptyset$ | $\emptyset$ | — |
| **`9`** | $[0.9, 1.0)$ | $[0.94]$ | $[0.94]$ | Index `9` |

Final concatenated array: $[0.12, 0.17, 0.21, 0.23, 0.26, 0.39, 0.68, 0.72, 0.78, 0.94]$.

---

### 3. Mathematical Proof: Expected Linear Runtime

Let $n_i$ be a random variable denoting the number of elements placed into bucket $i$. Since each element has an equal probability $p = 1/n$ of landing in any given bucket, $n_i$ follows a Binomial distribution $B(n, 1/n)$.

The time required to sort bucket $i$ via Insertion Sort is $O(n_i^2)$. The total time across all buckets is:

$$E[T(n)] = \Theta(n) + \sum_{i=0}^{n-1} O(E[n_i^2])$$

For a Binomial random variable $n_i \sim B(n, p)$ with $p = 1/n$:
- Mean: $E[n_i] = n \cdot p = n \cdot (1/n) = 1$
- Variance: $\text{Var}(n_i) = n p (1 - p) = 1 - 1/n$
- Second Moment:
  $$E[n_i^2] = \text{Var}(n_i) + (E[n_i])^2 = \left(1 - \frac{1}{n}\right) + 1^2 = 2 - \frac{1}{n}$$

Substituting this into the total expected time summation:

$$E[T(n)] = \Theta(n) + \sum_{i=0}^{n-1} O\left(2 - \frac{1}{n}\right) = \Theta(n) + n \cdot O(1) = \mathbf{\Theta(n)} \quad \blacksquare$$

Under the assumption of uniform distribution, the expected runtime of Bucket Sort is strictly **linear $\Theta(n)$**.

#### Failure Mode & Degeneracy:
If the input data is severely skewed (e.g., all $n$ elements share identical values and collapse into a single bucket), Insertion Sort must process all $n$ elements in that single bucket, degrading total runtime to $\Theta(n^2)$.

---

## Master Comparison Matrix: Non-Comparison Linear Sorts

| Metric | Counting Sort | Radix Sort (LSD) | Bucket Sort |
| :--- | :---: | :---: | :---: |
| **Domain Constraint** | Small bounded integers $[0, k]$ | Integers / fixed-length strings | Uniform floating-point numbers $[0, 1)$ |
| **Best-Case Time** | $\Theta(n + k)$ | $\Theta(d(n + b))$ | $\Theta(n)$ |
| **Average-Case Time** | $\Theta(n + k)$ | $\Theta(d(n + b))$ | $\mathbf{\Theta(n)}$ (under uniform distribution) |
| **Worst-Case Time** | $\Theta(n + k)$ | $\Theta(d(n + b))$ | $\Theta(n^2)$ (skewed inputs) |
| **Auxiliary Space** | $\Theta(n + k)$ | $\Theta(n + b)$ | $\Theta(n)$ |
| **Stability** | **Stable** (backward pass) | **Stable** (mandatory) | **Stable** (if bucket sorter is stable) |
| **Comparison-Based?** | No | No | Hybrid (Insertion Sort within buckets) |
| **Primary Industry Role** | Small key alphabets, sub-sorter | 32/64-bit integers, suffix arrays | Geospatial coordinates, probability floats |

---

## Module 03 Summary & Key Takeaways

1. **Circumventing Comparison Bounds:** Non-comparison sorts bypass the $\Omega(n \log n)$ information-theoretic lower bound by using direct address indexing, digit extraction, or statistical partitioning.
2. **Counting Sort Invariant:** Cumulative prefix sums translate element frequencies into exact output array address bounds. Backward traversal from $n - 1$ down to $0$ is strictly required to preserve stability.
3. **Radix Sort Multi-Pass Stability:** LSD Radix Sort requires an unconditionally stable sub-sorter so that decisions made on lower-significance digits remain intact during higher-significance passes.
4. **Byte-Level Radix Efficiency:** Configuring Radix Sort with base $b = 256$ processes 32-bit integers in exactly 4 passes using efficient bitwise shifts and bitmasks without floating-point division.
5. **Bucket Sort Distribution Dependence:** Bucket Sort achieves average-case linear time only when keys follow a uniform probability distribution over continuous intervals; clustering or skewed distributions degrades performance to quadratic $O(n^2)$.

---

## References & Academic Attribution

1. **Seward, H. H.** (1954). *Information sorting in the application of electronic digital computers to business operations* (First formal description of Counting Sort and Radix Sort). Master's thesis, Massachusetts Institute of Technology.
2. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 5.2.5: Sorting by Distribution. Addison-Wesley.
3. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 8: Sorting in Linear Time (Counting Sort, Radix Sort, Bucket Sort). MIT Press.
4. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 5.1: String Sorts (LSD and MSD Radix Sorting). Addison-Wesley.

