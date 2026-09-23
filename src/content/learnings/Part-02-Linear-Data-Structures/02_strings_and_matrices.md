# Part 02: Linear Data Structures — Module 02: Strings & Matrices

> **Topics Covered:**  
> 22. Strings & Character Sequence Architecture &bull; 23. Matrices, 2D Arrays & Memory Orderings (Row-Major vs Column-Major)

---

Character sequences and multi-dimensional matrices represent two vital linear abstractions mapped directly onto hardware memory buses. While strings translate binary code points into structured text with significant mutability and encoding considerations, matrices flatten multi-dimensional Cartesian coordinates into linear RAM addresses. This chapter explores character memory architectures, UTF-8 variable-width encodings, row-major versus column-major address calculations, cache line stride penalties, in-place matrix rotations, and staircase search paradigms.

### Learning Objectives
- Compute byte offsets and memory layouts for C-style null-terminated strings and modern length-prefixed string slice headers.
- Contrast ASCII, UTF-8, and UTF-16 encoding trade-offs and evaluate memory overheads of string immutability in runtime garbage collectors.
- Derive physical memory address equations for multi-dimensional arrays in row-major and column-major orderings.
- Quantify CPU cache line miss penalties caused by non-contiguous matrix traversals and design cache-optimal algorithms.
- Implement in-place matrix transpose, $90^\circ$ clockwise rotation, spiral traversal, and $O(R + C)$ Young tableau staircase search.

---

## Topic 22: Strings & Character Sequence Architecture

### 1. Conceptual & Physical Memory Representation

Abstractly, a string is a sequence of characters (or code units). One common implementation stores code units contiguously, where the address of unit $S[i]$ can be computed as:

$$\text{Address}(S[i]) = \alpha + (i \times \text{sizeof}(\text{Code Unit}))$$

Actual string internals depend on the language and runtime (and may involve small-string optimization, ropes, views, or other representations).

Two primary architectural models govern how strings are demarcated in memory:

#### A. C-Style Null-Terminated Strings
C-style strings (`char*`) are unbroken arrays of 1-byte ASCII values terminated by a special sentinel byte: the null terminator (`'\0'`, numerical value `0x00`).
- **Memory Footprint**: A string of length $n$ requires $n + 1$ physical bytes.
- **Length Calculation**: Determining string length requires scanning every byte until `'\0'` is encountered, executing in $\Theta(n)$ time.

#### B. Length-Prefixed Strings (One Common Implementation Pattern)
Some implementations (for example, certain Rust/Go/C++ string types) use a small descriptor referencing a backing buffer, often with pointer, length, and (where applicable) capacity fields. Sizes depend on ABI and implementation.
- **Typical Descriptor (example on a 64-bit ABI)**: pointer (`8 bytes`), length $n$ (`8 bytes`), and where present capacity $C$ (`8 bytes`). Java `String` internals are JVM-implementation details, Go `string` is not a generic pointer+length+capacity triple, and C++ `std::string` commonly uses small-string optimization.
- **Length Calculation**: Reading a stored length field is typically $O(1)$ where such a field exists.

#### Memory Layout Comparison: Storing `"DSA"`

| Architectural Model | Location | Offset / Address | Value | Hex / Encoding | Semantic Role |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **C-Style String** | Stack / Static | $\alpha + 0$ | `'D'` | `0x44` | Character byte 0 |
| | | $\alpha + 1$ | `'S'` | `0x53` | Character byte 1 |
| | | $\alpha + 2$ | `'A'` | `0x41` | Character byte 2 |
| | | $\alpha + 3$ | `'\0'` | `0x00` | Sentinel Null Terminator |
| **Length-Prefixed** | Stack Frame | Offset $+0$ | `ptr` | `0x7ffee0` | Pointer to heap storage |
| | | Offset $+8$ | `len` | `3` | Explicit length counter ($O(1)$ access) |
| | | Offset $+16$ | `cap` | `4` | Allocated buffer capacity |
| | Heap Buffer | `ptr + 0..2` | `"DSA"` | `0x44 0x53 0x41` | Contiguous character code units |

---

### 2. Character Encodings & Mutability Semantics

#### Encoding Standards
1. **ASCII (7-bit)**: Maps integers $0\text{--}127$ to Latin characters, digits, and punctuation. Exactly 1 byte per character (highest bit unused).
2. **UTF-8 (Variable-Width, 1 to 4 bytes)**:
   - ASCII characters ($0\text{--}127$) occupy exactly 1 byte (fully backward-compatible).
   - Accented Latin, Greek, Arabic occupy 2 bytes.
   - East Asian scripts (CJK), Indic scripts occupy 3 bytes.
   - Emojis and historical symbols occupy 4 bytes.
   - *Implication*: In UTF-8, string byte length does not equal character count! Random indexing $S[i]$ is $O(n)$ without an index translation table.
3. **UTF-16**: Uses 2 bytes (or 4 bytes via surrogate pairs). Standard in Java and JavaScript runtimes.

#### Mutability vs. Immutability
- **Mutable Strings (C++, C)**: In-place modification ($S[i] \leftarrow \text{'X'}$) is $O(1)$.
- **Immutable Strings (Python, Java, JavaScript)**: Strings cannot be modified after allocation. Any transformation creates a new string object in heap memory ($O(n)$ time and space).

> ⚠️ **The Repeated Concatenation Trap**:  
> In immutable languages, concatenating characters in a loop (`s = s + ch`) copies the entire prefix at each step:  
> $$\sum_{i=1}^n i = \frac{n(n+1)}{2} = \Theta(n^2)$$  
> **Remediation**: Always use a mutable `StringBuilder` or list of characters, then join once in $O(n)$ time.

---

### 3. Core String Operations & Invariants

| Operation | Description | Time Complexity | Auxiliary Space |
| :--- | :--- | :---: | :---: |
| **Length($S$)** | Length-prefixed header read | $O(1)$ | $O(1)$ |
| **Length($S$)** | C-style null-sentinel scan | $O(n)$ | $O(1)$ |
| **CharAccess($i$)** | Fixed-width code unit lookup | $O(1)$ | $O(1)$ |
| **Concatenate($S_1, S_2$)** | Allocate new buffer of size $\|S_1\| + \|S_2\|$ | $O(\|S_1\| + \|S_2\|)$ | $O(\|S_1\| + \|S_2\|)$ |
| **Substring($i, j$)** | Extract range $[i \dots j]$ | $O(j - i + 1)$ | $O(j - i + 1)$ |
| **In-Place Reverse($S$)** | Two-pointer symmetric swap | $O(n)$ | $O(1)$ |

#### Two-Pointer Reversal & Palindrome Verification
```text
FUNCTION ReverseString(S: Array of Char, n: Integer) -> Void:
    left <- 0
    right <- n - 1
    while left < right:
        swap(S[left], S[right])
        left <- left + 1
        right <- right - 1

FUNCTION IsPalindrome(S: Array of Char, n: Integer) -> Boolean:
    left <- 0
    right <- n - 1
    while left < right:
        if S[left] != S[right]:
            return False
        left <- left + 1
        right <- right - 1
    return True
```

#### Step-by-Step Two-Pointer Trace: Reversing `"RADAR"` ($n = 5$)

| Iteration | `left` | `right` | `S[left]` | `S[right]` | Action | Array State |
| :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **0** | 0 | 4 | `'R'` | `'R'` | Swap indices 0 and 4 | `['R', 'A', 'D', 'A', 'R']` |
| **1** | 1 | 3 | `'A'` | `'A'` | Swap indices 1 and 3 | `['R', 'A', 'D', 'A', 'R']` |
| **2** | 2 | 2 | `'D'` | `'D'` | `left >= right` $\implies$ Terminate | `['R', 'A', 'D', 'A', 'R']` |

---

## Topic 23: Matrices, 2D Arrays & Memory Orderings

### 1. Conceptual Foundations & Physical Address Linearization

A **Matrix** is a two-dimensional grid of $R$ rows and $C$ columns containing $R \times C$ elements. Because physical computer RAM is strictly linear (one-dimensional byte addresses), a multi-dimensional array must be flattened into a 1D sequence using a deterministic mapping scheme.

```
Logical 2D View:
               Col 0    Col 1    Col 2
     Row 0:  [   10  ,   20   ,   30   ]
     Row 1:  [   40  ,   50   ,   60   ]
```

#### Mapping Equations: Row-Major vs. Column-Major

| Mapping Scheme | Language Ecosystem | Physical Storage Sequence | Addressing Formula for Element $M[i][j]$ |
| :--- | :--- | :--- | :--- |
| **Row-Major Order** | e.g. C/C++ rectangular arrays; many C#, Python/NumPy defaults | Row 0 followed by Row 1: `[10, 20, 30, 40, 50, 60]` | $\text{Address}(M[i][j]) = \alpha + (i \times C + j) \times S$ |
| **Column-Major Order** | e.g. Fortran, MATLAB, Julia, R defaults | Col 0, Col 1, Col 2: `[10, 40, 20, 50, 30, 60]` | $\text{Address}(M[i][j]) = \alpha + (j \times R + i) \times S$ |

Row-major vs column-major describes how a multidimensional dataset is laid out in memory. Languages and libraries can use different representations: Java `int[][]` is an array of arrays (not one flat C-style block), Python nested lists are lists of object references, and numerical libraries may choose either layout.

---

### 2. CPU Cache Locality & Stride Penalty Analysis

The physical storage ordering dictates how the memory hierarchy behaves during matrix traversals:

```text
Row-Major Storage: [ Row 0 (10, 20, 30) | Row 1 (40, 50, 60) ]

Traversal Pattern A: Row-by-Row (Outer loop i, Inner loop j)
Address Sequence: α+0, α+4, α+8, α+12, α+16, α+20
Hardware Behavior: Contiguous streaming access. L1 cache prefetcher saturates line buffer.
Result: high cache-hit rate in this illustrative example (exact hit rates depend on CPU, cache levels, and workload).

Traversal Pattern B: Column-by-Column (Outer loop j, Inner loop i)
Address Sequence: α+0, α+12, α+4, α+16, α+8, α+20
Hardware Behavior: Strided jumps of C * sizeof(Element). Cache lines evicted before reuse.
<svg viewBox="0 0 880 270" width="100%" height="auto" class="rounded-xl border border-border shadow-sm my-6 bg-surface">
  <defs>
    <linearGradient id="row0Grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#10b981" stop-opacity="0.05" />
    </linearGradient>
    <linearGradient id="row1Grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.05" />
    </linearGradient>
    <linearGradient id="row2Grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.05" />
    </linearGradient>
  </defs>
  <!-- 2D Logical Grid on Left -->
  <rect x="25" y="20" width="280" height="230" rx="8" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.15" />
  <text x="40" y="45" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="currentColor">Logical 2D Matrix M[3][4]</text>
  <!-- Row 0 Cells -->
  <rect x="40" y="65" width="55" height="35" rx="4" fill="url(#row0Grad)" stroke="#10b981" />
  <text x="67" y="87" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#10b981">0,0</text>
  <rect x="100" y="65" width="55" height="35" rx="4" fill="url(#row0Grad)" stroke="#10b981" />
  <text x="127" y="87" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#10b981">0,1</text>
  <rect x="160" y="65" width="55" height="35" rx="4" fill="url(#row0Grad)" stroke="#10b981" />
  <text x="187" y="87" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#10b981">0,2</text>
  <rect x="220" y="65" width="55" height="35" rx="4" fill="url(#row0Grad)" stroke="#10b981" />
  <text x="247" y="87" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#10b981">0,3</text>
  <!-- Row 1 Cells -->
  <rect x="40" y="110" width="55" height="35" rx="4" fill="url(#row1Grad)" stroke="#3b82f6" />
  <text x="67" y="132" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#3b82f6">1,0</text>
  <rect x="100" y="110" width="55" height="35" rx="4" fill="url(#row1Grad)" stroke="#3b82f6" />
  <text x="127" y="132" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#3b82f6">1,1</text>
  <rect x="160" y="110" width="55" height="35" rx="4" fill="url(#row1Grad)" stroke="#3b82f6" />
  <text x="187" y="132" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#3b82f6">1,2</text>
  <rect x="220" y="110" width="55" height="35" rx="4" fill="url(#row1Grad)" stroke="#3b82f6" />
  <text x="247" y="132" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#3b82f6">1,3</text>
  <!-- Row 2 Cells -->
  <rect x="40" y="155" width="55" height="35" rx="4" fill="url(#row2Grad)" stroke="#8b5cf6" />
  <text x="67" y="177" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#8b5cf6">2,0</text>
  <rect x="100" y="155" width="55" height="35" rx="4" fill="url(#row2Grad)" stroke="#8b5cf6" />
  <text x="127" y="177" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#8b5cf6">2,1</text>
  <rect x="160" y="155" width="55" height="35" rx="4" fill="url(#row2Grad)" stroke="#8b5cf6" />
  <text x="187" y="177" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#8b5cf6">2,2</text>
  <rect x="220" y="155" width="55" height="35" rx="4" fill="url(#row2Grad)" stroke="#8b5cf6" />
  <text x="247" y="177" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" fill="#8b5cf6">2,3</text>
  <text x="40" y="225" font-family="system-ui, sans-serif" font-size="11" fill="currentColor" fill-opacity="0.7">Memory Offset: α + (i · C + j) · S</text>

  <!-- Physical 1D RAM Linearization on Right -->
  <rect x="330" y="20" width="525" height="230" rx="8" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.15" />
  <text x="345" y="45" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="currentColor">Physical 1D RAM Layout (Row-Major Order)</text>
  
  <!-- Linear array representation -->
  <g font-family="system-ui, sans-serif" font-size="10" font-weight="bold">
    <!-- Row 0 Block -->
    <rect x="345" y="70" width="160" height="45" rx="4" fill="url(#row0Grad)" stroke="#10b981" stroke-width="1.5" />
    <text x="425" y="97" text-anchor="middle" fill="#10b981">Row 0: [0,0] [0,1] [0,2] [0,3]</text>
    <!-- Row 1 Block -->
    <rect x="515" y="70" width="160" height="45" rx="4" fill="url(#row1Grad)" stroke="#3b82f6" stroke-width="1.5" />
    <text x="595" y="97" text-anchor="middle" fill="#3b82f6">Row 1: [1,0] [1,1] [1,2] [1,3]</text>
    <!-- Row 2 Block -->
    <rect x="685" y="70" width="160" height="45" rx="4" fill="url(#row2Grad)" stroke="#8b5cf6" stroke-width="1.5" />
    <text x="765" y="97" text-anchor="middle" fill="#8b5cf6">Row 2: [2,0] [2,1] [2,2] [2,3]</text>
  </g>

  <!-- Cache Stride Analysis Boxes -->
  <rect x="345" y="135" width="245" height="95" rx="6" fill="#10b981" fill-opacity="0.08" stroke="#10b981" stroke-opacity="0.25" />
  <text x="355" y="155" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#10b981">Row-Wise Traversal (Stride = 1)</text>
  <text x="355" y="175" font-family="system-ui, sans-serif" font-size="10" fill="currentColor" fill-opacity="0.8">`for i: for j: sum += M[i][j]`</text>
  <text x="355" y="195" font-family="system-ui, sans-serif" font-size="10" fill="currentColor" fill-opacity="0.8">Continuous sequential address access.</text>
  <text x="355" y="215" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#10b981">100% L1/L2 Cache Prefetch Efficiency!</text>

  <rect x="600" y="135" width="245" height="95" rx="6" fill="#ef4444" fill-opacity="0.08" stroke="#ef4444" stroke-opacity="0.25" />
  <text x="610" y="155" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#ef4444">Column-Wise Traversal (Stride = C)</text>
  <text x="610" y="175" font-family="system-ui, sans-serif" font-size="10" fill="currentColor" fill-opacity="0.8">`for j: for i: sum += M[i][j]`</text>
  <text x="610" y="195" font-family="system-ui, sans-serif" font-size="10" fill="currentColor" fill-opacity="0.8">Each read jumps by C * 4 bytes.</text>
  <text x="610" y="215" font-family="system-ui, sans-serif" font-size="10" font-weight="600" fill="#ef4444">Frequent L1 Cache Misses &amp; Stalls!</text>
</svg>

> 💡 **Architectural Principle**:  
> In Row-Major languages (C, C++, Rust, Python NumPy defaults), always structure nested loops with row indices outer and column indices inner:  
> `for (int i = 0; i < R; i++) for (int j = 0; j < C; j++)`. Inverting the loop nest to `for j: for i:` forces a stride of $C$ bytes between successive reads, evicting cache lines prematurely and causing severe CPU stalls.

---

### 3. Comprehensive Taxonomy of Special Matrices

| Matrix Type | Structural / Mathematical Invariant | Memory Optimization Strategy |
| :--- | :--- | :--- |
| **Square Matrix** | Number of rows equals columns: $R = C$ | Standard 2D grid or symmetric 1D compression |
| **Diagonal Matrix** | All non-diagonal elements are zero: $M[i][j] = 0 \text{ for } i \ne j$ | Store only the diagonal elements as a 1D array of size $N$ |
| **Identity Matrix ($I_n$)**| Diagonal elements are 1, all others 0: $M[i][j] = \delta_{ij}$ | Compute on the fly ($i == j \implies 1 \text{ else } 0$); zero memory overhead |
| **Upper Triangular** | $M[i][j] = 0 \text{ for all } i > j$ | Store $N(N+1)/2$ elements in a compressed 1D array |
| **Lower Triangular** | $M[i][j] = 0 \text{ for all } i < j$ | Store $N(N+1)/2$ elements in a compressed 1D array |
| **Symmetric Matrix** | Equal to its transpose: $M[i][j] = M[j][i]$ | Store only lower or upper triangle, saving nearly $50\%$ RAM |
| **Toeplitz Matrix** | Every descending diagonal has identical values: $M[i][j] = M[i-1][j-1]$ | Store top row and left column ($R + C - 1$ elements total) |
| **Sparse Matrix** | Vast majority ($> 90\%$) of cells are zero | Compressed Sparse Row (CSR) or Coordinate List (COO) |

---

### 4. Algorithmic Transformations

#### A. In-Place Transpose (Square Matrix $N \times N$)
To transpose a matrix in-place without auxiliary memory, swap elements across the main diagonal ($M[i][j] \leftrightarrow M[j][i]$) strictly for $j > i$:

```text
FUNCTION TransposeInPlace(M: 2D Array of Type, N: Integer) -> Void:
    for i from 0 to N - 1:
        for j from i + 1 to N - 1:
            swap(M[i][j], M[j][i])
```

#### B. Rotate Matrix $90^\circ$ Clockwise In-Place
A $90^\circ$ clockwise rotation can be decomposed into two distinct, symmetric elementary transformations:
1. **Transpose** the matrix ($M[i][j] \leftrightarrow M[j][i]$).
2. **Reverse each row** horizontally ($M[i][j] \leftrightarrow M[i][N - 1 - j]$).

#### Rotation State Progression ($3 \times 3$ Matrix)

$$\text{Initial Matrix } M = \begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{pmatrix}$$

$$\text{Step 1: Transpose } M^T = \begin{pmatrix} 1 & 4 & 7 \\ 2 & 5 & 8 \\ 3 & 6 & 9 \end{pmatrix}$$

$$\text{Step 2: Reverse Rows } = \begin{pmatrix} 7 & 4 & 1 \\ 8 & 5 & 2 \\ 9 & 6 & 3 \end{pmatrix}$$

**Complexity**: $\Theta(N^2)$ time, strictly $O(1)$ auxiliary space.

---

### 5. Search Paradigms in 2D Grids

#### Paradigm 1: Monotonically Sorted Matrix (Virtual 1D Binary Search)
- **Structure**: Each row is sorted left-to-right; the first integer of each row is strictly greater than the last integer of the previous row.
- **Algorithm**: Treat the $R \times C$ matrix as a flattened 1D array of size $N = R \cdot C$.
- **Index Translation**:
  $$\text{row} = \lfloor \text{mid} / C \rfloor, \quad \text{col} = \text{mid} \pmod C$$
- **Complexity**: $O(\log(R \cdot C))$ time, $O(1)$ auxiliary space.

#### Paradigm 2: Row-Wise & Column-Wise Sorted Matrix (Young Tableau / Staircase Search)
- **Structure**: Integers in each row are sorted left-to-right; integers in each column are sorted top-to-bottom.
- **Algorithm**: Start at the **Top-Right corner** $(r = 0, c = C - 1)$:
  - If $M[r][c] == \text{target} \implies$ Found!
  - If $M[r][c] > \text{target} \implies$ All elements below are larger; eliminate column: $c \leftarrow c - 1$.
  - If $M[r][c] < \text{target} \implies$ All elements to the left are smaller; eliminate row: $r \leftarrow r + 1$.

#### Staircase Search Step-by-Step Trace (Target $= 23$)

Precondition: each row sorted left-to-right AND each column sorted top-to-bottom.

Given matrix:
$$\begin{pmatrix} 10 & 15 & 20 & 30 \\ 12 & 18 & 23 & 35 \\ 14 & 22 & 28 & 40 \end{pmatrix}$$

| Step | Current Position $(r, c)$ | Value $M[r][c]$ | Comparison vs Target ($23$) | Decision & Movement | Remaining Search Window |
| :---: | :---: | :---: | :---: | :--- | :--- |
| **0** | $(0, 3)$ | `30` | $30 > 23$ | Value too high $\implies c \leftarrow c - 1$ | Columns $[0 \dots 2]$, Rows $[0 \dots 2]$ |
| **1** | $(0, 2)$ | `20` | $20 < 23$ | Value too low $\implies r \leftarrow r + 1$ | Columns $[0 \dots 2]$, Rows $[1 \dots 2]$ |
| **2** | $(1, 2)$ | `23` | $23 = 23$ | Found at $(1, 2)$! | Target located |

```text
FUNCTION StaircaseSearch(M: 2D Array, R: Integer, C: Integer, target: Integer) -> Boolean:
    row <- 0
    col <- C - 1
    while row < R and col >= 0:
        if M[row][col] == target:
            return True
        else if M[row][col] > target:
            col <- col - 1
        else:
            row <- row + 1
    return False
```

**Complexity**: At each step, either `row` increases or `col` decreases. Maximum steps $= R + C \implies O(R + C)$ time, $O(1)$ auxiliary space.

---

### 6. Key Takeaways

1. **String Architectures**: C-style strings trade memory overhead ($+1$ byte) for $O(n)$ length scans; length-prefixed implementations typically provide $O(1)$ length operations (descriptor size varies by language, ABI, and implementation).
2. **Avoid Repeated Concatenations**: In immutable languages, `s = s + ch` creates an $O(n^2)$ quadratic allocation cascade; accumulate in a mutable buffer.
3. **Hardware Stride Alignment**: Row-major languages require row-outer column-inner loop orderings to exploit CPU cache-line prefetching.
4. **Symmetric Decomposition**: Rotating a square matrix $90^\circ$ clockwise equals `Transpose + ReverseRows`, executable in-place in $O(N^2)$ time and $O(1)$ space.
5. **Staircase Elimination**: Searching a 2D grid sorted along both axes from the top-right corner achieves $O(R + C)$ time by pruning a complete row or column per comparison.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 10: Elementary Data Structures, Chapter 32: String Matching. MIT Press.
2. **Hennessy, J. L., & Patterson, D. A.** (2019). *Computer Architecture: A Quantitative Approach* (6th ed.), Chapter 2: Memory Hierarchy Design. Morgan Kaufmann.
3. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Chapter 5: Strings. Addison-Wesley.
4. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.2: Linear Lists. Addison-Wesley.
