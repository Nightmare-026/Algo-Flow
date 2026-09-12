# ⚡ Part 05: Sorting — Module 02: Divide & Conquer and Heap Sorts

> **Topics Covered:**  
> 53. Merge Sort (Divide & Conquer, Merging & Stability) &bull; 54. Quick Sort (Partitioning Schemes, Pivot Strategies & Dutch National Flag) &bull; 55. Heap Sort (Max-Heap, In-Place Sorting & $O(n)$ Build-Heap Derivation)

---

# TOPIC 53: MERGE SORT

### 1. Problem Statement & Paradigm
Merge Sort is an asymptotically optimal, comparison-based, stable sorting algorithm based strictly on the **Divide-and-Conquer** algorithmic paradigm:
1. **Divide**: Split the array of size $n$ into two equal halves of size $n/2$.
2. **Conquer**: Recursively sort both halves using Merge Sort.
3. **Combine**: Merge the two sorted subarrays into a single sorted array.

```text
DIVIDE PHASE:
                     [ 38, 27, 43, 3, 9, 82, 10 ]
                            /            \
                 [ 38, 27, 43, 3 ]     [ 9, 82, 10 ]
                     /       \             /      \
                 [38, 27]   [43, 3]      [9, 82]  [10]
                  /   \      /   \        /   \     │
                [38] [27]  [43]  [3]    [9]  [82]  [10]
─────────────────────────────────────────────────────────────────
COMBINE (MERGE) PHASE:
                [27, 38]   [3, 43]       [9, 82]   [10]
                    \         /             \       /
                 [ 3, 27, 38, 43 ]         [ 9, 10, 82 ]
                         \                      /
                     [ 3, 9, 10, 27, 38, 43, 82 ]
```

---

### 2. Pseudocode: Merge Sort & Linear Merge Subroutine

```text
ALGORITHM MergeSort(A, low, high)
    Input: Array A, boundary indices low and high
    Output: Subarray A[low...high] sorted in non-decreasing order

1.  if low < high:
2.      mid ← low + ⌊(high - low) / 2⌋
3.      MergeSort(A, low, mid)
4.      MergeSort(A, mid + 1, high)
5.      Merge(A, low, mid, high)

ALGORITHM Merge(A, low, mid, high)
    Input: Array A where A[low...mid] and A[mid+1...high] are sorted
    Output: A[low...high] merged into a single sorted range

1.  n1 ← mid - low + 1
2.  n2 ← high - mid
3.  allocate temporary arrays L[0...n1 - 1] and R[0...n2 - 1]
4.  for i ← 0 to n1 - 1: L[i] ← A[low + i]
5.  for j ← 0 to n2 - 1: R[j] ← A[mid + 1 + j]
6.  i ← 0, j ← 0, k ← low
7.  while i < n1 and j < n2:
8.      if L[i] ≤ R[j]:          // Note: '≤' guarantees STABILITY!
9.          A[k] ← L[i]
10.         i ← i + 1
11.     else:
12.         A[k] ← R[j]
13.         j ← j + 1
14.     k ← k + 1
15. while i < n1:                 // Copy remaining elements of L
16.     A[k] ← L[i], i ← i + 1, k ← k + 1
17. while j < n2:                 // Copy remaining elements of R
18.     A[k] ← R[j], j ← j + 1, k ← k + 1
```

---

### 3. Asymptotic Complexity Derivation
- **Recurrence**:
$$T(n) = 2T\left(\frac{n}{2}\right) + \Theta(n)$$
- By Master Theorem: $a = 2, b = 2 \implies n^{\log_2 2} = n^1 = n$.  
  Since $f(n) = \Theta(n)$, Case 2 applies:
$$T(n) = \mathbf{\Theta(n \log n)} \quad \text{in ALL cases (Best, Average, Worst!)}$$
- **Auxiliary Space**: $\mathbf{\Theta(n)}$ (Required for temporary arrays $L$ and $R$ during merge).
- **Stability**: **Stable** (Line 8 picks from the left subarray $L[i]$ on equality, preserving original order).

---
---

# TOPIC 54: QUICK SORT

### 1. Problem Statement & Paradigm
Quick Sort is a divide-and-conquer algorithm that sorts **in-place**:
1. **Choose a Pivot**: Select an element $p$ from the array.
2. **Partition**: Rearrange the array such that all elements $< p$ are moved to its left, and all elements $> p$ are moved to its right. The pivot $p$ is now at its **final sorted index**!
3. **Recurse**: Independently sort the left and right partitions.

---

### 2. Partitioning Schemes: Lomuto vs Hoare

#### A. Lomuto Partition Scheme
- Simpler, cleaner, uses 1 pointer scanning forward.
- Pivot is chosen as the last element $A[\text{high}]$.

```text
ALGORITHM LomutoPartition(A, low, high)
1.  pivot ← A[high]
2.  i ← low - 1
3.  for j ← low to high - 1:
4.      if A[j] < pivot:
5.          i ← i + 1
6.          Swap(A[i], A[j])
7.  Swap(A[i + 1], A[high])
8.  return i + 1                // Final index of pivot
```

#### B. Hoare Partition Scheme
- Two pointers moving inward from both ends.
- Performs roughly **$3\times$ fewer swaps** than Lomuto on average.

---

### 3. Complete QuickSort with Tail-Recursion Depth Optimization

To prevent $O(n)$ stack overflow on degenerated inputs, always recurse on the **smaller subarray first** and iterate on the larger:

```text
ALGORITHM QuickSort(A, low, high)
1.  while low < high:
2.      // Randomized or Median-of-Three pivot
3.      pIndex ← RandomizedPartition(A, low, high)
4.      if pIndex - low < high - pIndex:
5.          QuickSort(A, low, pIndex - 1)
6.          low ← pIndex + 1    // Tail call optimization
7.      else:
8.          QuickSort(A, pIndex + 1, high)
9.          high ← pIndex - 1   // Tail call optimization
```

---

### 4. The 3-Way Partitioning (Dutch National Flag Algorithm)
When an array contains many duplicate keys, standard QuickSort degrades to $O(n^2)$. Dijkstra's **3-Way Partitioning** splits the array into three segments: $< \text{pivot}$, $= \text{pivot}$, and $> \text{pivot}$ in a single linear pass:

```text
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│   < pivot       │   = pivot       │   Unprocessed   │   > pivot       │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
  ▲                 ▲                 ▲                 ▲
 low               mid               curr              high
```

---

### 5. Complexity Analysis
- **Time Complexity**:
  - **Best Case**: $\Theta(n \log n)$ (Pivot splits array into two equal halves).
  - **Average Case**: $\Theta(n \log n)$ ($1.39 \, n \log_2 n$ comparisons).
  - **Worst Case**: $\mathbf{\Theta(n^2)}$ (Occurs when array is already sorted and first/last element is picked as pivot).
- **Auxiliary Space**:
  - Worst Case: $O(n)$ stack frames.
  - With Tail-Call Optimization: $\mathbf{O(\log n)}$ stack frames guaranteed!
- **Stability**: **Unstable** (Long-distance swaps bypass equal elements).

---
---

# TOPIC 55: HEAP SORT

### 1. Problem Statement & Core Concept
Heap Sort is an in-place $O(n \log n)$ comparison sort that uses a **Max-Heap** binary tree structure mapped directly inside the array:
1. **Build Max-Heap**: Transform the unsorted array into a valid Max-Heap in $O(n)$ time.
2. **Successive Extract-Max**:
   - Swap root element $A[0]$ (the maximum) with the last element of the unsorted region $A[i]$.
   - Shrink the heap size by 1.
   - Restore the heap property at the root via `HeapifyDown(0)`.

---

### 2. Pseudocode: Heap Sort

```text
ALGORITHM HeapSort(A, n)
    Input: Array A of n elements
    Output: Array A sorted in non-decreasing order

1.  // Step 1: Build Max-Heap in O(n)
2.  for i ← ⌊n / 2⌋ - 1 down to 0:
3.      HeapifyDown(A, n, i)
4.  // Step 2: Extract elements one by one
5.  for i ← n - 1 down to 1:
6.      Swap(A[0], A[i])        // Move current root to end
7.      HeapifyDown(A, i, 0)    // Re-heapify root with reduced heap size i
8.  return A

ALGORITHM HeapifyDown(A, n, i)
1.  largest ← i
2.  left ← 2 * i + 1
3.  right ← 2 * i + 2
4.  if left < n and A[left] > A[largest]:
5.      largest ← left
6.  if right < n and A[right] > A[largest]:
7.      largest ← right
8.  if largest ≠ i:
9.      Swap(A[i], A[largest])
10.     HeapifyDown(A, n, largest)
```

---

### 3. Formal Proof: Why Build-Heap is $O(n)$, NOT $O(n \log n)$
A common error assumes that calling `HeapifyDown` ($O(\log n)$) on $n/2$ nodes costs $O(n \log n)$.

#### Rigorous Summation:
A complete binary tree of $n$ nodes has height $h = \lfloor \log_2 n \rfloor$.  
At height $k$ (counting from leaves upwards, where leaves have height $k=0$), there are at most $\lceil n / 2^{k+1} \rceil$ nodes, and each node can drop at most $k$ levels:

$$\text{Total Work} = \sum_{k=0}^{\lfloor \log_2 n \rfloor} \left\lceil \frac{n}{2^{k+1}} \right\rceil \cdot O(k) = \frac{n}{2} \sum_{k=0}^{\infty} \frac{k}{2^k}$$

Evaluating the geometric series $\sum_{k=0}^{\infty} \frac{k}{2^k}$:
Let $S = \frac{0}{1} + \frac{1}{2} + \frac{2}{4} + \frac{3}{8} + \dots$  
Then $\frac{1}{2}S = \frac{1}{4} + \frac{2}{8} + \dots$  
Subtracting: $S - \frac{1}{2}S = \frac{1}{2}S = \frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \dots = 1 \implies S = 2$.

$$\text{Total Work} = \frac{n}{2} \times 2 = \mathbf{O(n)} \quad \blacksquare$$

---

### 4. Complexity & Comparison with QuickSort
- **Time Complexity**: Strictly $\mathbf{\Theta(n \log n)}$ in all cases.
- **Auxiliary Space**: $\mathbf{\Theta(1)}$ strictly in-place (no recursive stack required if heapify is iterative).
- **Stability**: **Unstable**.
- *Why is QuickSort preferred over HeapSort in practice?*  
  HeapSort jumps through the array along power-of-two index steps ($2i + 1, 2i + 2$), which exhibits **poor cache locality** and causes frequent L1/L2 cache misses compared to QuickSort's sequential memory sweeps.

---

## 🔁 Module 02 Summary & Key Takeaways

1. **Merge Sort** guarantees $O(n \log n)$ time and is stable, but requires $O(n)$ extra memory buffer.
2. **Quick Sort** is the fastest in practice due to contiguous memory access and $O(\log n)$ auxiliary space, but has an $O(n^2)$ worst case on pathological pivots.
3. **Heap Sort** guarantees $O(n \log n)$ in-place ($O(1)$ space), but runs slower than QuickSort due to scattered cache access.

---
[⬅️ Previous: Module 01 — Elementary Sorts](file:///d:/DSA/Part-05-Sorting/01_elementary_sorts.md) | [Next: Module 03 — Linear Time Sorts ➡️](file:///d:/DSA/Part-05-Sorting/03_linear_time_sorts.md)
