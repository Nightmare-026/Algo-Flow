# 📶 Part 05: Sorting — Module 01: Elementary $O(n^2)$ Sorting Algorithms

> **Topics Covered:**  
> 50. Bubble Sort (Adjacent Comparisons & Early Exit Optimization) &bull; 51. Selection Sort (Prefix Selection & Instability) &bull; 52. Insertion Sort (Adaptive Shifting & Online Sorting)

---

# TOPIC 50: BUBBLE SORT

### 1. Problem Statement & 2. Goal
Given an unsorted array $A$ of $n$ elements, rearrange them in non-decreasing order ($A[0] \le A[1] \le \dots \le A[n-1]$) by repeatedly comparing adjacent elements and swapping them if they are out of order.

### 3. Intuition & Real-World Analogy
Think of air bubbles rising in a tube of water. In each pass through the array, the largest unsorted element "bubbles up" to its correct position at the far right.

```text
PASS 1: Bubble largest element to the end
  [ 5,  1,  4,  2,  8 ]
    ▲   ▲
  Swap(5, 1) ──► [ 1,  5,  4,  2,  8 ]
                       ▲   ▲
                     Swap(5, 4) ──► [ 1,  4,  5,  2,  8 ]
                                          ▲   ▲
                                        Swap(5, 2) ──► [ 1,  4,  2,  5,  8 ]
                                                             ▲   ▲
                                                           No swap!
After Pass 1: Element 8 is locked into its final position at index 4!
```

---

### 4. Optimized Pseudocode with Early-Exit Flag

```text
ALGORITHM BubbleSort(A, n)
    Input: Array A of n elements
    Output: Array A sorted in non-decreasing order

1.  for i ← 0 to n - 2:
2.      swapped ← false
3.      for j ← 0 to n - 2 - i:
4.          if A[j] > A[j + 1]:
5.              temp ← A[j]
6.              A[j] ← A[j + 1]
7.              A[j + 1] ← temp
8.              swapped ← true
9.      if swapped = false:
10.         break               // Array is already sorted! Exit early in O(n)
11. return A
```

---

### 5. Step-by-Step Dry Run Table: Sorting $[5, 1, 4, 2, 8]$

| Pass $i$ | Inner Comparisons $(j, j+1)$ | Swaps Performed | Array State at End of Pass | `swapped` Flag |
| :---: | :--- | :---: | :--- | :---: |
| 0 | $(5,1) \to \text{Swap}, (5,4) \to \text{Swap}, (5,2) \to \text{Swap}, (5,8) \to \text{No}$ | 3 | $[1, 4, 2, 5, \mathbf{8}]$ | True |
| 1 | $(1,4) \to \text{No}, (4,2) \to \text{Swap}, (4,5) \to \text{No}$ | 1 | $[1, 2, 4, \mathbf{5}, \mathbf{8}]$ | True |
| 2 | $(1,2) \to \text{No}, (2,4) \to \text{No}$ | 0 | $[1, 2, \mathbf{4}, \mathbf{5}, \mathbf{8}]$ | **False $\implies$ Break!** |

Total passes executed: 3 instead of 4 due to the early-exit optimization!

---

### 6. Complexity & Invariant Analysis
- **Time Complexity**:
  - **Best Case (Already Sorted)**: $\Theta(n)$ (Discovered on pass 0 via `swapped = false`).
  - **Worst Case (Reverse Sorted)**: $\Theta(n^2)$ ($\sum_{j=1}^{n-1} j = \frac{n(n-1)}{2}$ comparisons and swaps).
  - **Average Case**: $\Theta(n^2)$.
- **Space Complexity**: $\Theta(1)$ auxiliary memory (in-place).
- **Stability**: **Stable** (Strict inequality `A[j] > A[j+1]` ensures equal elements never swap).

---
---

# TOPIC 51: SELECTION SORT

### 1. Problem Statement & Core Idea
Divide the array into two logical parts: a **sorted prefix** on the left and an **unsorted suffix** on the right. In each pass, find the **minimum element** in the unsorted suffix and swap it with the first element of the unsorted suffix, growing the sorted prefix by 1.

```text
SELECTION SORT PASS PROGRESSION:
Initial:         [  64 │  25 │  12 │  22 │  11  ]
Pass 0: Min=11 ──► [  11 │  25 │  12 │  22 │  64  ]  (Swap 64 and 11)
                      ▲
Pass 1: Min=12 ──► [  11 │  12 │  25 │  22 │  64  ]  (Swap 25 and 12)
                           ▲
Pass 2: Min=22 ──► [  11 │  12 │  22 │  25 │  64  ]  (Swap 25 and 22)
                                ▲
```

---

### 2. Pseudocode: Selection Sort

```text
ALGORITHM SelectionSort(A, n)
    Input: Array A of n elements
    Output: Array A sorted in non-decreasing order

1.  for i ← 0 to n - 2:
2.      minIdx ← i
3.      for j ← i + 1 to n - 1:
4.          if A[j] < A[minIdx]:
5.              minIdx ← j
6.      if minIdx ≠ i:
7.          temp ← A[i]
8.          A[i] ← A[minIdx]
9.          A[minIdx] ← temp
10. return A
```

---

### 3. Complexity & Inherent Instability

- **Time Complexity**: Strictly $\mathbf{\Theta(n^2)}$ in **ALL cases** (Best, Average, and Worst). It *always* scans the entire unsorted region to find the minimum!
- **Space Complexity**: $\Theta(1)$ auxiliary space.
- **Number of Memory Writes**: At most $n - 1$ swaps. Useful when memory write operations are extraordinarily expensive (e.g., writing to Flash/EEPROM memory).
- **Stability**: **UNSTABLE**.
  - *Counterexample*: $A = [4_a, 4_b, 2]$.
  - Pass 0 selects $2$ (min) and swaps with $A[0]$ ($4_a$).
  - Array becomes $[2, 4_b, 4_a]$.
  - The relative order of $4_a$ and $4_b$ was inverted! ❌

---
---

# TOPIC 52: INSERTION SORT

### 1. Problem Statement & Real-World Analogy
Think of sorting playing cards in your hand. You hold a sorted sub-hand. When you pick up a new card, you scan backwards from right to left through your hand and insert the card into its correct relative position.

```text
INSERTING ELEMENT 3 INTO SORTED PREFIX [ 2, 5, 7 ]:
  Key = 3
  Compare with 7: 7 > 3 ──► Shift 7 right:  [ 2, 5, _, 7 ]
  Compare with 5: 5 > 3 ──► Shift 5 right:  [ 2, _, 5, 7 ]
  Compare with 2: 2 < 3 ──► Stop!
  Place Key at empty slot:                  [ 2, 3, 5, 7 ]
```

---

### 2. Pseudocode: Insertion Sort

```text
ALGORITHM InsertionSort(A, n)
    Input: Array A of n elements
    Output: Array A sorted in non-decreasing order

1.  for i ← 1 to n - 1:
2.      key ← A[i]
3.      j ← i - 1
4.      while j ≥ 0 and A[j] > key:
5.          A[j + 1] ← A[j]       // Shift element right
6.          j ← j - 1
7.      A[j + 1] ← key            // Place key in correct slot
8.  return A
```

---

### 3. Step-by-Step Dry Run Table: Sorting $[8, 3, 5, 2]$

| Outer Step $i$ | `key` ($A[i]$) | Initial Sorted Prefix | Inner Shifts Performed | Insertion Slot | Array State at End of Pass |
| :---: | :---: | :--- | :--- | :---: | :--- |
| 1 | 3 | $[8]$ | Shift 8 right | Index 0 | $[3, 8, 5, 2]$ |
| 2 | 5 | $[3, 8]$ | Shift 8 right | Index 1 | $[3, 5, 8, 2]$ |
| 3 | 2 | $[3, 5, 8]$ | Shift 8, shift 5, shift 3 | Index 0 | $[2, 3, 5, 8]$ |

---

### 4. Complexity & Key Properties
- **Time Complexity**:
  - **Best Case (Already Sorted)**: $\mathbf{\Theta(n)}$ (Inner while loop condition `A[j] > key` fails immediately; only 1 comparison per element).
  - **Worst Case (Reverse Sorted)**: $\mathbf{\Theta(n^2)}$ ($\sum_{j=1}^{n-1} j = \frac{n(n-1)}{2}$ shifts).
  - **Average Case**: $\Theta(n^2)$.
- **Space Complexity**: $\Theta(1)$ auxiliary space.
- **Stability**: **Stable** (Does not shift past an equal element: `A[j] > key`).
- **Adaptive**: Runtime is proportional to the number of inversions: $O(n + I)$. For nearly sorted arrays, it runs in linear time!
- **Online Algorithm**: Can sort a stream of data in real-time as elements arrive one by one.

---

### 5. Summary Comparison of Elementary Sorts

| Algorithm | Best Time | Average Time | Worst Time | Swaps (Writes) | Stable? | Adaptive? |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Bubble Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | Yes | Yes (with flag) |
| **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $\mathbf{O(n)}$ | **No** | No |
| **Insertion Sort** | $\mathbf{O(n)}$ | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ shifts | **Yes** | **Yes** |

---

## 🔁 Module 01 Summary & Key Takeaways

1. **Bubble Sort** repeatedly swaps adjacent inversions; early-exit flag allows $O(n)$ best case.
2. **Selection Sort** minimizes total writes to at most $n-1$ swaps, but is inherently unstable and always $O(n^2)$.
3. **Insertion Sort** is the gold-standard elementary sort: stable, online, and runs in $O(n)$ time on nearly sorted arrays. Used as the base case in production hybrid sorts (Timsort, IntroSort).

---
[⬅️ Previous: Part 04 Searching](file:///d:/DSA/Part-04-Searching/03_search_space_and_rotated.md) | [Next: Module 02 — Divide & Conquer Sorts ➡️](file:///d:/DSA/Part-05-Sorting/02_divide_and_conquer_sorts.md)
