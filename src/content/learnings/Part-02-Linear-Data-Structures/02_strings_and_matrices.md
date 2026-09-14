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

At the physical hardware layer, a string is a specialized contiguous array of numeric integers representing character code points. The memory address of any character $S[i]$ is calculated via pointer arithmetic:

$$\text{Address}(S[i]) = \alpha + (i \times \text{sizeof}(\text{Code Unit}))$$

Two primary architectural models govern how strings are demarcated in memory:

#### A. C-Style Null-Terminated Strings
C-style strings (`char*`) are unbroken arrays of 1-byte ASCII values terminated by a special sentinel byte: the null terminator (`'\0'`, numerical value `0x00`).
- **Memory Footprint**: A string of length $n$ requires $n + 1$ physical bytes.
- **Length Calculation**: Determining string length requires scanning every byte until `'\0'` is encountered, executing in $\Theta(n)$ time.

#### B. Modern Length-Prefixed Strings
Modern systems (Rust `String`, Go `string`, Java `String`, C++ `std::string`) store strings as a compact stack-allocated descriptor referencing a heap-allocated buffer.
- **Descriptor Layout**: Contains a pointer to the backing buffer (`8 bytes`), explicit length $n$ (`8 bytes`), and capacity $C$ (`8 bytes`).
- **Length Calculation**: Reading the length is an instant $O(1)$ header inspection.

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
| **Row-Major Order** | C, C++, Java, Python, C# | Row 0 followed by Row 1: `[10, 20, 30, 40, 50, 60]` | $\text{Address}(M[i][j]) = \alpha + (i \times C + j) \times S$ |
| **Column-Major Order** | Fortran, MATLAB, Julia, R | Col 0, Col 1, Col 2: `[10, 40, 20, 50, 30, 60]` | $\text{Address}(M[i][j]) = \alpha + (j \times R + i) \times S$ |

---

### 2. CPU Cache Locality & Stride Penalty Analysis

The physical storage ordering dictates how the memory hierarchy behaves during matrix traversals:

```text
Row-Major Storage: [ Row 0 (10, 20, 30) | Row 1 (40, 50, 60) ]

Traversal Pattern A: Row-by-Row (Outer loop i, Inner loop j)
Address Sequence: α+0, α+4, α+8, α+12, α+16, α+20
Hardware Behavior: Contiguous streaming access. L1 cache prefetcher saturates line buffer.
Result: 93%+ Cache Hit Rate (~1 ns per read).

Traversal Pattern B: Column-by-Column (Outer loop j, Inner loop i)
Address Sequence: α+0, α+12, α+4, α+16, α+8, α+20
Hardware Behavior: Strided jumps of C * sizeof(Element). Cache lines evicted before reuse.
Result: Repeated Cache Misses (~50-100 ns latency per read). 10x-50x slower!
```

> 💡 **Architectural Principle**:  
> In Row-Major languages, always structure nested loops with row indices outer and column indices inner:  
> `for (int i = 0; i < R; i++) for (int j = 0; j < C; j++)`.

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

Given matrix:
$$\begin{pmatrix} 10 & 15 & 25 & 30 \\ 12 & 18 & 23 & 35 \\ 14 & 20 & 28 & 40 \end{pmatrix}$$

| Step | Current Position $(r, c)$ | Value $M[r][c]$ | Comparison vs Target ($23$) | Decision & Movement | Remaining Search Window |
| :---: | :---: | :---: | :---: | :--- | :--- |
| **0** | $(0, 3)$ | `30` | $30 > 23$ | Value too high $\implies c \leftarrow c - 1$ | Columns $[0 \dots 2]$, Rows $[0 \dots 2]$ |
| **1** | $(0, 2)$ | `25` | $25 > 23$ | Value too high $\implies c \leftarrow c - 1$ | Columns $[0 \dots 1]$, Rows $[0 \dots 2]$ |
| **2** | $(0, 1)$ | `15` | $15 < 23$ | Value too low $\implies r \leftarrow r + 1$ | Columns $[0 \dots 1]$, Rows $[1 \dots 2]$ |
| **3** | $(1, 1)$ | `18` | $18 < 23$ | Value too low $\implies r \leftarrow r + 1$ | Columns $[0 \dots 1]$, Rows $[2 \dots 2]$ |
| **4** | $(2, 1)$ | `20` | $20 < 23$ | Value too low $\implies$ No rows left, but check col 2: backtrack or re-evaluate | Found in col 2 at $(1, 2)$! |

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

1. **String Architectures**: C-style strings trade memory overhead ($+1$ byte) for $O(n)$ length scans; modern length-prefixed strings provide $O(1)$ length operations at the cost of a 24-byte stack descriptor.
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
