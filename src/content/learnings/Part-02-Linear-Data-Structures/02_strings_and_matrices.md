# 🧵 Part 02: Linear Data Structures — Module 02: Strings & Matrices

> **Topics Covered:**  
> 22. Strings & Character Sequence Architecture &bull; 23. Matrices, 2D Arrays & Memory Orderings (Row-Major vs Column-Major)

---

# TOPIC 22: STRINGS

### 1. Topic Title
**Strings (Character Sequence Memory Structures & String Internals)**

### 2. Category
Linear Data Structures — Sequential Character Encodings.

### 3. Difficulty
Beginner to Intermediate.

### 4. Prerequisites
Static Arrays, ASCII and UTF-8 encoding standards.

### 5. Definition
A **String** is a contiguous sequence of characters encoded as numeric code points, terminated either by a sentinel null character (`'\0'` in C-style strings) or managed as an explicit length-prefixed slice/buffer (Pascal/modern language strings).

### 6. Simple Explanation
Think of a bead necklace where each bead is stamped with a letter. In a C-string, the necklace ends with a special black bead (`'\0'`). In modern strings, a tag at the clasp tells you exactly how many beads are on the chain.

### 7. Why Do We Need It?
Human communication is textual. Computers process only binary numbers ($0$ and $1$). Strings provide the translation layer mapping numerical sequences to readable text, symbols, and protocols.

### 8. Real-World Analogy
A ticker tape displaying characters sequentially, printed onto an unbroken paper ribbon.

### 9. Core Intuition
Under the hood, a string is a specialized array of 1-byte (ASCII / UTF-8 code unit) or 2/4-byte (UTF-16 / UTF-32) integers.
$$\text{Memory Address of Char at index } i = \text{Base Address} + (i \times \text{sizeof}(\text{char}))$$

---

### 10. Key Properties
1. **Character Encodings**:
   - **ASCII**: 7-bit standard (values 0–127). Fits in 1 byte.
   - **UTF-8**: Variable-length encoding (1 to 4 bytes per character). Backward-compatible with ASCII.
2. **Mutability vs Immutability**:
   - **Mutable** (C++, C): Can mutate individual characters in-place ($S[i] \leftarrow \text{'X'}$) in $O(1)$ time.
   - **Immutable** (Java, Python): Any modification creates an entirely new string in memory in $O(n)$ time.
3. **Null-Terminated vs Length-Prefixed**:
   - Null-terminated (`\0`): Length calculation takes $O(n)$ time.
   - Length-prefixed: Length is stored in header; access takes $O(1)$ time.

---

### 11. Terminology
- **Code Point**: The numerical identifier assigned to an abstract character in Unicode.
- **Substring ($S[i \dots j]$)**: Contiguous sequence of characters from index $i$ to $j$.
- **Prefix / Suffix**: Substring starting at index 0 / ending at index $n-1$.
- **Subsequence**: Characters maintaining relative order but not necessarily contiguous.

---

### 12. Structural Diagram (ASCII)

```text
C-STYLE NULL-TERMINATED STRING: "DSA" (Requires 4 bytes in RAM)
┌──────────┬──────────┬──────────┬──────────┐
│   'D'    │   'S'    │   'A'    │   '\0'   │
│ (0x44)   │ (0x53)   │ (0x41)   │  (0x00)  │
└──────────┴──────────┴──────────┴──────────┘
  idx 0      idx 1      idx 2      idx 3 (Sentinel)

MODERN LENGTH-PREFIXED STRING (Header + Buffer):
Stack:                        Heap Buffer:
┌──────────────────────────┐  ┌──────────┬──────────┬──────────┐
│ ptr_to_buffer ───────────┼─►│   'D'    │   'S'    │   'A'    │
│ length: 3                │  └──────────┴──────────┴──────────┘
│ capacity: 4              │    idx 0      idx 1      idx 2
└──────────────────────────┘
```

---

### 13. Supported Operations

| Operation | Description | Time Complexity | Auxiliary Space |
| :--- | :--- | :---: | :---: |
| **Length($S$)** | Count characters (length-prefixed) | $O(1)$ | $O(1)$ |
| **CharAccess($i$)** | Access character at index $i$ | $O(1)$ | $O(1)$ |
| **Concatenate($S_1, S_2$)** | Append $S_2$ to $S_1$ | $O(|S_1| + |S_2|)$ | $O(|S_1| + |S_2|)$ |
| **Substring($i, j$)** | Extract slice from $i$ to $j$ | $O(j - i + 1)$ | $O(j - i + 1)$ |
| **Reverse($S$)** | Reverse characters in-place | $O(n)$ | $O(1)$ |

---

### 14. Operation Pseudocode: In-Place Reversal & Palindrome Check

```text
ALGORITHM ReverseString(S, n)
    Input: Mutable character array S of length n
    Output: S reversed in-place

1.  left ← 0
2.  right ← n - 1
3.  while left < right:
4.      temp ← S[left]
5.      S[left] ← S[right]
6.      S[right] ← temp
7.      left ← left + 1
8.      right ← right - 1
9.  return S

ALGORITHM IsPalindrome(S, n)
    Input: Character array S of length n
    Output: true if S reads same forwards and backwards, else false

1.  left ← 0
2.  right ← n - 1
3.  while left < right:
4.      if S[left] ≠ S[right]:
5.          return false
6.      left ← left + 1
7.      right ← right - 1
8.  return true
```

---

### 15. Step-by-Step Dry Run: Reversing "LEVEL"

$S = ['L', 'E', 'V', 'E', 'L']$, $n = 5$:

| Iteration | `left` | `right` | `S[left]` | `S[right]` | Action | Array State |
| :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| 0 | 0 | 4 | 'L' | 'L' | Swap(S[0], S[4]) | `['L', 'E', 'V', 'E', 'L']` |
| 1 | 1 | 3 | 'E' | 'E' | Swap(S[1], S[3]) | `['L', 'E', 'V', 'E', 'L']` |
| 2 | 2 | 2 | 'V' | 'V' | `left < right` false $\implies$ Terminate | `['L', 'E', 'V', 'E', 'L']` |

---

### 16. Common Mistakes with Strings
1. **Accidental $O(n^2)$ Concatenation in Loops**:
   ```text
   // ⚠️ ANTI-PATTERN (in immutable languages):
   result ← ""
   for i ← 1 to n:
       result ← result + "a"   // Creates new string copy of size i each step! Total = O(n²)
   // ✅ FIX: Use a StringBuilder / dynamic character array (O(n) total).
   ```
2. **Off-by-One with Sentinel `\0`**: Forgetting to allocate space for the null terminator ($N+1$ bytes needed for $N$ characters).

---
---

# TOPIC 23: MATRICES & 2D ARRAYS

### 1. Topic Title
**Matrices & Multi-Dimensional Arrays (Physical Memory Mapping & Cache Tiling)**

### 2. Category
Linear Data Structures — Multi-Dimensional Contiguous Storage.

### 3. Difficulty
Intermediate.

### 4. Prerequisites
Topic 20: Static Arrays, CPU Cache lines.

### 5. Definition
A **Matrix (2D Array)** is a mathematical grid of elements arranged in $R$ rows and $C$ columns. Because physical computer memory (RAM) is strictly linear (1-dimensional), a multi-dimensional array must be flattened into 1D space using either **Row-Major Order** or **Column-Major Order**.

---

### 6. Memory Mappings: Row-Major vs Column-Major

```text
2D LOGICAL MATRIX M (2 rows, 3 columns):
              Col 0    Col 1    Col 2
    Row 0:  [   10  │   20   │   30   ]
    Row 1:  [   40  │   50   │   60   ]

1. ROW-MAJOR ORDER (C, C++, Java, Python): Consecutive elements of a ROW are adjacent in RAM.
   RAM: [ 10 │ 20 │ 30 │ 40 │ 50 │ 60 ]
          Row 0         Row 1
   Mapping Formula:
   Address(M[i][j]) = BaseAddress + (i × C + j) × sizeof(Element)

2. COLUMN-MAJOR ORDER (Fortran, MATLAB, Julia, R): Consecutive elements of a COLUMN are adjacent.
   RAM: [ 10 │ 40 │ 20 │ 50 │ 30 │ 60 ]
          Col 0   Col 1   Col 2
   Mapping Formula:
   Address(M[i][j]) = BaseAddress + (j × R + i) × sizeof(Element)
```

---

### 7. Cache Locality & Loop Order Performance

The choice of loop order when traversing a matrix in a row-major language makes a massive real-world performance difference ($\approx 10\times$ to $50\times$ speedup):

```text
✅ CACHE-FRIENDLY (Row-by-Row traversal in Row-Major language):
for i ← 0 to R - 1:
    for j ← 0 to C - 1:
        sum ← sum + M[i][j]     // Contiguous memory reads ──► High L1 Cache Hit Rate!

❌ CACHE-CATASTROPHIC (Col-by-Col traversal in Row-Major language):
for j ← 0 to C - 1:
    for i ← 0 to R - 1:
        sum ← sum + M[i][j]     // Strided jumps of C*sizeof(Element) ──► Cache Miss on every step!
```

---

### 8. Comprehensive Taxonomy of Special Matrices

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SPECIAL MATRIX ARCHETYPES                          │
└─────────────────────────────────────────────────────────────────────────────┘

1. SQUARE MATRIX:          2. DIAGONAL MATRIX:        3. IDENTITY MATRIX (I):
   R = C                      M[i][j] = 0 for i ≠ j      Diagonal = 1, all else = 0
   [ 1  2 ]                   [ 5  0  0 ]                [ 1  0  0 ]
   [ 3  4 ]                   [ 0  8  0 ]                [ 0  1  0 ]
                              [ 0  0  3 ]                [ 0  0  1 ]

4. UPPER TRIANGULAR:       5. LOWER TRIANGULAR:       6. SYMMETRIC MATRIX:
   M[i][j] = 0 for i > j      M[i][j] = 0 for i < j      M[i][j] = M[j][i]  (M = Mᵀ)
   [ 1  4  9 ]                [ 1  0  0 ]                [ 1  7  3 ]
   [ 0  2  5 ]                [ 6  2  0 ]                [ 7  4  8 ]
   [ 0  0  3 ]                [ 4  9  3 ]                [ 3  8  5 ]

7. TOEPLITZ MATRIX:        8. SPARSE MATRIX:
   Every diagonal has identical elements                 > 90% elements are Zero (0)
   M[i][j] = M[i-1][j-1]                                 Stored via CSR or COO to
   [ 1  2  3  4 ]                                        prevent wasting Gigabytes!
   [ 5  1  2  3 ]
   [ 6  5  1  2 ]
```

---

### 9. Core Matrix Operations & Pseudocode

#### A. Matrix Transpose In-Place (Square $N \times N$ Matrix)
Swap $M[i][j]$ with $M[j][i]$ for all $i < j$:

```text
ALGORITHM TransposeSquareMatrix(M, N)
    Input: N x N square matrix M
    Output: Transposed matrix M in-place

1.  for i ← 0 to N - 1:
2.      for j ← i + 1 to N - 1:
3.          temp ← M[i][j]
4.          M[i][j] ← M[j][i]
5.          M[j][i] ← temp
6.  return M
```

#### B. Rotate Matrix $90^\circ$ Clockwise In-Place:
1. Transpose the matrix ($M[i][j] \leftrightarrow M[j][i]$).
2. Reverse every row horizontally.

```text
ALGORITHM RotateMatrixClockwise(M, N)
    Input: N x N square matrix M
    Output: M rotated 90 degrees clockwise in-place

1.  TransposeSquareMatrix(M, N)
2.  for i ← 0 to N - 1:
3.      left ← 0
4.      right ← N - 1
5.      while left < right:
6.          temp ← M[i][left]
7.          M[i][left] ← M[i][right]
8.          M[i][right] ← temp
9.          left ← left + 1
10.         right ← right - 1
11. return M
```

#### C. Spiral Order Traversal ($O(R \cdot C)$ Time, $O(1)$ Auxiliary Space)
Uses 4 boundary pointers (`top`, `bottom`, `left`, `right`) that shrink inward:

```text
ALGORITHM SpiralOrder(M, R, C)
    Input: R x C Matrix M
    Output: List of elements in spiral order

1.  top ← 0, bottom ← R - 1
2.  left ← 0, right ← C - 1
3.  result ← empty list
4.  
5.  while top ≤ bottom and left ≤ right:
6.      // 1. Traverse Right across Top row
7.      for col ← left to right:
8.          result.Append(M[top][col])
9.      top ← top + 1
10.     
11.     // 2. Traverse Down along Right column
12.     for row ← top to bottom:
13.         result.Append(M[row][right])
14.     right ← right - 1
15.     
16.     // 3. Traverse Left across Bottom row (if valid)
17.     if top ≤ bottom:
18.         for col ← right down to left:
19.             result.Append(M[bottom][col])
20.         bottom ← bottom - 1
21.     
22.     // 4. Traverse Up along Left column (if valid)
23.     if left ≤ right:
24.         for row ← bottom down to top:
25.             result.Append(M[row][left])
26.         left ← left + 1
27. 
28. return result
```

#### D. Search in a 2D Matrix: Two Fundamental Paradigms

##### Paradigm 1: Fully Sorted Monotonic Matrix (Virtual 1D Binary Search)
If the first element of each row is greater than the last of the previous row:
- Treat the $R \times C$ matrix as a virtual 1D array of size $N = R \cdot C$.
- Map 1D index `mid` to 2D coordinates:
$$\text{row} = \lfloor \text{mid} / C \rfloor, \quad \text{col} = \text{mid} \pmod C$$
- **Time Complexity**: $\mathbf{O(\log(R \cdot C))}$.

##### Paradigm 2: Row-Wise & Column-Wise Sorted Matrix (Young Tableau / Staircase Search)
Rows are sorted left-to-right; columns are sorted top-to-bottom.
- **Algorithm**: Start at the **Top-Right corner** $(r = 0, c = C - 1)$:
  - If $M[r][c] == \text{target} \implies$ Found!
  - If $M[r][c] > \text{target} \implies$ Eliminate column $c$! (`c ← c - 1`)
  - If $M[r][c] < \text{target} \implies$ Eliminate row $r$! (`r ← r + 1`)
- **Time Complexity**: $\mathbf{O(R + C)}$ (Eliminates a full row or column on every single step!).

```text
STAIRCASE SEARCH PATH:
Target = 23
[ 10   15   25   30 ] ──► Start at 30: 30 > 23 ──► Move Left!
[ 12   18   23   35 ] ──► At 25: 25 > 23 ──► Move Left!
[ 14   20   28   40 ] ──► At 15: 15 < 23 ──► Move Down!
                          At 18: 18 < 23 ──► Move Down!
                          At 20: 20 < 23 ──► Move Down!
                          (Steps directly to 23 in O(R+C) time!)
```

#### E. Set Matrix Zeroes In-Place ($O(1)$ Auxiliary Space)
If an element $M[i][j]$ is $0$, set its entire row and column to $0$.
- **Naïve approach**: Use auxiliary row/col boolean arrays $\implies O(R + C)$ memory.
- **Optimal In-Place approach**: Repurpose **Row 0** and **Column 0** of the matrix itself as the storage markers! Use two single boolean flags `rowZeroHasZero` and `colZeroHasZero` to record if the original first row/col had zeros. Time: $O(R \cdot C)$, Auxiliary Space: strictly $\mathbf{O(1)}$.

---

### 10. Step-by-Step Dry Run: Rotate $3 \times 3$ Matrix Clockwise

Initial Matrix $M$:
```text
[ 1  2  3 ]
[ 4  5  6 ]
[ 7  8  9 ]
```

1. **Step 1: Transpose** (Swap across main diagonal):
   - Swap (0,1) & (1,0): 2 and 4
   - Swap (0,2) & (2,0): 3 and 7
   - Swap (1,2) & (2,1): 6 and 8
   ```text
   [ 1  4  7 ]
   [ 2  5  8 ]
   [ 3  6  9 ]
   ```
2. **Step 2: Reverse Each Row**:
   - Row 0 `[1, 4, 7]` $\to$ `[7, 4, 1]`
   - Row 1 `[2, 5, 8]` $\to$ `[8, 5, 2]`
   - Row 2 `[3, 6, 9]` $\to$ `[9, 6, 3]`

**Final Result**:
```text
[ 7  4  1 ]
[ 8  5  2 ]
[ 9  6  3 ]
```
*(Exact $90^\circ$ clockwise rotation achieved in $O(N^2)$ time and $O(1)$ auxiliary space!)*

---

### 11. Sparse Matrix Representations

When a matrix of size $R \times C$ contains mostly zeros ($> 95\%$ zeros), storing it as a 2D array wastes enormous memory ($O(R \cdot C)$):
1. **Coordinate List (COO)**: Stores triplets `(row, col, value)` for non-zero elements only. Space: $O(3 \times \text{NonZeros})$.
2. **Compressed Sparse Row (CSR)**: Three 1D arrays: `values`, `col_indices`, and `row_pointers`. Reduces space from $O(R \cdot C)$ to $O(\text{NonZeros} + R)$ with contiguous hardware memory access.

---

## 🔁 Module 02 Summary & Key Takeaways

1. **Strings** are character arrays with encoding nuances; repeated concatenation in immutable languages leads to $O(n^2)$ performance traps unless buffers are used.
2. In **Row-Major Order**, traverse rows in the outer loop and columns in the inner loop to maximize CPU L1 cache hits.
3. Rotating a matrix $90^\circ$ clockwise equals **Transpose + Reverse each row**, solvable in-place in $O(N^2)$ time with $O(1)$ auxiliary memory.

---
[⬅️ Previous: Module 01 — Arrays & Dynamic Arrays](file:///d:/DSA/Part-02-Linear-Data-Structures/01_arrays_and_dynamic_arrays.md) | [Next: Module 03 — Singly Linked Lists ➡️](file:///d:/DSA/Part-02-Linear-Data-Structures/03_singly_linked_lists.md)
