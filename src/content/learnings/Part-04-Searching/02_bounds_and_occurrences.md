# 🎯 Part 04: Searching — Module 02: Lower Bound, Upper Bound & Element Occurrences

> **Topics Covered:**  
> 44. Binary Search Invariants & Interval Models &bull; 45. Lower Bound Algorithm &bull; 46. Upper Bound Algorithm &bull; 47. First and Last Occurrences & Frequency Counting

---

# TOPIC 44: BINARY SEARCH INVARIANTS & INTERVAL MODELS

### 1. The Three Interval Models of Binary Search
Most bugs in Binary Search arise from mixing up interval models. Master these three consistent paradigms:

| Model | Search Interval | Loop Condition | Left Update | Right Update | Terminating State |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Model 1: Closed Interval** | $[low, high]$ | `while low ≤ high:` | `low ← mid + 1` | `high ← mid - 1` | `low = high + 1` |
| **Model 2: Half-Open Interval**| $[low, high)$ | `while low < high:` | `low ← mid + 1` | `high ← mid` | `low = high` |
| **Model 3: Open Interval** | $(low, high)$ | `while low + 1 < high:`| `low ← mid` | `high ← mid` | `low + 1 = high` |

*Throughout this textbook, we standardize on **Model 1 (Closed Interval)** and **Model 2 (Half-Open for bounds)**.*

---
---

# TOPIC 45: LOWER BOUND

### 1. Problem Statement & Mathematical Definition
Given a sorted array $A$ of $n$ elements, find the **first (smallest) index $i$** such that:

$$A[i] \ge \text{target}$$

If all elements in $A$ are strictly smaller than `target`, return $n$ (the insertion point at the end).

```text
ARRAY:        [ 2,  4,  6,  8,  8,  8, 10, 12 ]
INDEX:          0   1   2   3   4   5   6   7

Lower Bound of 8:  Index 3  (First element ≥ 8)
Lower Bound of 7:  Index 3  (First element ≥ 7, which is 8)
Lower Bound of 15: Index 8  (All elements < 15, returns n)
```

---

### 2. Pseudocode: Lower Bound

```text
ALGORITHM LowerBound(A, n, target)
    Input: Sorted array A of length n, target value
    Output: Smallest index i where A[i] ≥ target, or n if none

1.  low ← 0
2.  high ← n - 1
3.  ans ← n                     // Default if all elements < target
4.  while low ≤ high:
5.      mid ← low + ⌊(high - low) / 2⌋
6.      if A[mid] ≥ target:
7.          ans ← mid           // Candidate answer found; try to find an earlier one
8.          high ← mid - 1
9.      else:
10.         low ← mid + 1       // A[mid] is too small; look in right half
11. return ans
```

---
---

# TOPIC 46: UPPER BOUND

### 1. Problem Statement & Mathematical Definition
Given a sorted array $A$ of $n$ elements, find the **first (smallest) index $i$** such that:

$$A[i] > \text{target}$$

If no element in $A$ is strictly greater than `target`, return $n$.

```text
ARRAY:        [ 2,  4,  6,  8,  8,  8, 10, 12 ]
INDEX:          0   1   2   3   4   5   6   7

Upper Bound of 8:  Index 6  (First element strictly > 8, which is 10)
Upper Bound of 5:  Index 2  (First element strictly > 5, which is 6)
Upper Bound of 12: Index 8  (No element > 12, returns n)
```

---

### 2. Pseudocode: Upper Bound

```text
ALGORITHM UpperBound(A, n, target)
    Input: Sorted array A of length n, target value
    Output: Smallest index i where A[i] > target, or n if none

1.  low ← 0
2.  high ← n - 1
3.  ans ← n                     // Default if no element > target
4.  while low ≤ high:
5.      mid ← low + ⌊(high - low) / 2⌋
6.      if A[mid] > target:
7.          ans ← mid           // Candidate answer found; look for smaller index
8.          high ← mid - 1
9.      else:
10.         low ← mid + 1       // A[mid] ≤ target; look in right half
11. return ans
```

---
---

# TOPIC 47: FIRST & LAST OCCURRENCE OF AN ELEMENT

### 1. Finding the Bounding Range in $O(\log n)$ Time
Using Lower Bound and Upper Bound, any repeated range can be found instantly:
- **First Occurrence Index**: $\text{First} = \text{LowerBound}(A, n, \text{target})$
  - If $\text{First} = n$ or $A[\text{First}] \ne \text{target}$, target does not exist.
- **Last Occurrence Index**: $\text{Last} = \text{UpperBound}(A, n, \text{target}) - 1$
- **Total Frequency (Count)**:
$$\text{Count}(\text{target}) = \text{UpperBound}(A, n, \text{target}) - \text{LowerBound}(A, n, \text{target})$$

---

### 2. Complete Dry Run: First & Last Occurrence of 8 in $[2, 4, 6, 8, 8, 8, 10, 12]$

```text
Step 1: LowerBound(A, 8)
- Discovers first index where A[i] ≥ 8 ──► Index 3

Step 2: UpperBound(A, 8)
- Discovers first index where A[i] > 8 ──► Index 6

Step 3: Calculate Range & Frequency:
- First Occurrence = Index 3
- Last Occurrence  = 6 - 1 = Index 5
- Total Count      = 6 - 3 = 3 elements!
```

---

### 3. Dedicated First Occurrence Algorithm (Without Full UB)

```text
ALGORITHM FirstOccurrence(A, n, target)
1.  low ← 0, high ← n - 1, ans ← -1
2.  while low ≤ high:
3.      mid ← low + ⌊(high - low) / 2⌋
4.      if A[mid] = target:
5.          ans ← mid
6.          high ← mid - 1      // Keep searching left for earlier occurrence!
7.      else if A[mid] < target:
8.          low ← mid + 1
9.      else:
10.         high ← mid - 1
11. return ans

ALGORITHM LastOccurrence(A, n, target)
1.  low ← 0, high ← n - 1, ans ← -1
2.  while low ≤ high:
3.      mid ← low + ⌊(high - low) / 2⌋
4.      if A[mid] = target:
5.          ans ← mid
6.          low ← mid + 1       // Keep searching right for later occurrence!
7.      else if A[mid] < target:
8.          low ← mid + 1
9.      else:
10.         high ← mid - 1
11. return ans
```

---

## 🔁 Module 02 Summary & Key Takeaways

1. **Lower Bound** finds the first index where $A[i] \ge \text{target}$; **Upper Bound** finds the first index where $A[i] > \text{target}$.
2. Both run in strictly $O(\log n)$ time and $O(1)$ space.
3. Total occurrences of any value in a sorted array is calculated in $O(\log n)$ as $\text{UB} - \text{LB}$.

---
[⬅️ Previous: Module 01 — Linear & Binary Search](file:///d:/DSA/Part-04-Searching/01_linear_and_binary_search.md) | [Next: Module 03 — Search Space & Rotated Arrays ➡️](file:///d:/DSA/Part-04-Searching/03_search_space_and_rotated.md)
