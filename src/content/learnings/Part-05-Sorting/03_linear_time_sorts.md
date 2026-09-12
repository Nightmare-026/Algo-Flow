# ⚡ Part 05: Sorting — Module 03: Non-Comparison Linear Time Sorts

> **Topics Covered:**  
> 56. Counting Sort (Frequency Hashing & Stable Reconstruction) &bull; 57. Radix Sort (LSD vs MSD Positional Sorting) &bull; 58. Bucket Sort (Uniform Distribution & Scatter-Gather)

---

# TOPIC 56: COUNTING SORT

### 1. Problem Statement & Key Concept
Counting Sort breaks the $\Omega(n \log n)$ lower bound by **avoiding comparisons entirely**. It assumes the input keys are non-negative integers lying within a bounded range $[0, k]$.

### 2. Algorithm Mechanics
1. **Count Frequencies**: Create an array $C$ of size $k + 1$. Record how many times each integer occurs in input array $A$.
2. **Compute Prefix Sums**: Transform $C$ such that $C[i]$ contains the count of elements $\le i$. This indicates the exact final index in the output array!
3. **Stable Placement**: Iterate backwards through $A$ from $n - 1$ down to 0, placing elements into output array $B$ at index $C[A[i]] - 1$, and decrementing $C[A[i]]$.

---

### 3. Pseudocode: Stable Counting Sort

```text
ALGORITHM CountingSort(A, n, k)
    Input: Array A of n integers, where each element 0 ≤ A[i] ≤ k
    Output: Array B containing sorted elements

1.  allocate count[0...k] initialized to 0
2.  allocate output[0...n - 1]
3.  // Step 1: Frequency histogram
4.  for i ← 0 to n - 1:
5.      count[A[i]] ← count[A[i]] + 1
6.  // Step 2: Cumulative prefix sums
7.  for i ← 1 to k:
8.      count[i] ← count[i] + count[i - 1]
9.  // Step 3: Build output array backwards to guarantee STABILITY
10. for i ← n - 1 down to 0:
11.     output[count[A[i]] - 1] ← A[i]
12.     count[A[i]] ← count[A[i]] - 1
13. return output
```

---

### 4. Complexity & Constraints
- **Time Complexity**: Strictly $\mathbf{\Theta(n + k)}$ in all cases.
- **Auxiliary Space**: $\mathbf{\Theta(n + k)}$ (For the count array of size $k$ and output array of size $n$).
- **Stability**: **Stable** (Iterating from $n-1$ down to 0 guarantees elements with equal keys maintain their relative order).
- **Limitation**: If $k \gg n$ (e.g., sorting 10 numbers where max value is $10^9$), Counting Sort wastes immense memory and runs slower than QuickSort. It is optimal only when $k = O(n)$.

---
---

# TOPIC 57: RADIX SORT

### 1. Problem Statement & Paradigm
When the maximum integer value $k$ is large, Counting Sort is impractical. **Radix Sort** solves this by breaking each key into $d$ individual digits and sorting digit-by-digit.

### 2. LSD (Least Significant Digit) vs MSD (Most Significant Digit)
- **LSD (Recommended)**: Sorts from right to left (ones digit $\to$ tens $\to$ hundreds).  
  **Mandatory Requirement**: Every pass **MUST BE STABLE** (Counting Sort is used as the stable digit sorter).
- **MSD**: Sorts from left to right (most significant digit first). Requires recursive bucket partitioning.

```text
LSD RADIX SORT PASS-BY-PASS ON [ 170, 045, 075, 090, 002, 024, 802, 066 ]

Pass 1 (Units Digit):   17[0], 09[0] ──► 00[2], 80[2] ──► 02[4] ──► 04[5], 07[5] ──► 06[6]
Array becomes:         [ 170, 090, 002, 802, 024, 045, 075, 066 ]

Pass 2 (Tens Digit):    0[0]2, 8[0]2 ──► 0[2]4 ──► 0[4]5 ──► 0[6]6 ──► 1[7]0, 0[7]5 ──► 0[9]0
Array becomes:         [ 002, 802, 024, 045, 066, 170, 075, 090 ]

Pass 3 (Hundreds):     [0]02, [0]24, [0]45, [0]66, [0]75, [0]90 ──► [1]70 ──► [8]02
Final Sorted Array:    [ 2, 24, 45, 66, 75, 90, 170, 802 ]
```

---

### 3. Pseudocode: LSD Radix Sort

```text
ALGORITHM RadixSort(A, n)
    Input: Array A of n non-negative integers
    Output: Array A sorted in-place

1.  maxVal ← Maximum(A, n)
2.  exp ← 1                     // 1, 10, 100, 1000...
3.  while ⌊maxVal / exp⌋ > 0:
4.      CountingSortByDigit(A, n, exp)
5.      exp ← exp * 10
6.  return A
```

---

### 4. Complexity Analysis
- **Time Complexity**: $\mathbf{\Theta(d \cdot (n + b))}$
  - $d$: Number of digits in maximum element ($\approx \log_b(\text{maxVal})$).
  - $b$: Numerical base (radix) used (e.g., $b = 10$ for decimal, $b = 256$ for byte-level sorting).
  - For standard 32-bit integers, using base $b = 256 = 2^8$, $d = 4$ passes are sufficient. Total time is $4 \times (n + 256) = \mathbf{O(n)}$!
- **Auxiliary Space**: $O(n + b)$.
- **Stability**: **Stable**.

---
---

# TOPIC 58: BUCKET SORT

### 1. Problem Statement & Mathematical Preconditions
Bucket Sort assumes input values are drawn from a **uniform probability distribution** over the real interval $[0.0, 1.0)$.

### 2. Algorithm Mechanics
1. Divide the interval $[0, 1)$ into $n$ equal-sized sub-intervals called **Buckets**.
2. **Scatter**: Distribute each element $A[i]$ into bucket index $\lfloor n \cdot A[i] \rfloor$.
3. **Sort**: Sort each individual bucket using Insertion Sort.
4. **Gather**: Concatenate all buckets in order into the final array.

```text
SCATTER PHASE:
Element 0.78 ──► Bucket ⌊10 × 0.78⌋ = Bucket 7
Element 0.17 ──► Bucket ⌊10 × 0.17⌋ = Bucket 1
Element 0.12 ──► Bucket ⌊10 × 0.12⌋ = Bucket 1

BUCKET 1: [ 0.17 ] ──► [ 0.12 ]  ──(Sort)──► [ 0.12, 0.17 ]
BUCKET 7: [ 0.78 ]
```

---

### 3. Complexity Under Uniform Distribution
- If elements are uniformly distributed, the expected number of elements per bucket is $O(1)$.
- Sorting each bucket of size $k$ via Insertion Sort takes $O(k^2)$ time. The expected value $E[k^2] = O(1)$.
- Summing across all $n$ buckets gives an **Average Case Time Complexity of $\mathbf{\Theta(n)}$**.
- **Worst Case**: If all elements cluster into a single bucket, runtime degrades to $\Theta(n^2)$.
- **Auxiliary Space**: $\Theta(n)$.

---

## 🔁 Module 03 Summary & Key Takeaways

1. **Counting Sort** sorts bounded integers $[0, k]$ in $O(n + k)$ time via prefix frequency counts.
2. **Radix Sort** breaks large integers into $d$ digits, sorting from least significant to most significant in $O(d(n+b))$ time using a stable sub-sorter.
3. **Bucket Sort** delivers expected $O(n)$ runtime for uniformly distributed floating-point data by scattering into $n$ sub-intervals.

---
[⬅️ Previous: Module 02 — Divide & Conquer Sorts](file:///d:/DSA/Part-05-Sorting/02_divide_and_conquer_sorts.md) | [Next: Module 04 — Sorting Theory & Master Comparison ➡️](file:///d:/DSA/Part-05-Sorting/04_sorting_theory_comparison.md)
