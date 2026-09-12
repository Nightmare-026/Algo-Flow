# 🔄 Part 04: Searching — Module 03: Rotated Arrays & Binary Search on Answer Space

> **Topics Covered:**  
> 48. Search in Rotated Sorted Array & Pivot Identification &bull; 49. Binary Search on Monotonic Answer Space (Optimization Problems)

---

# TOPIC 48: SEARCH IN ROTATED SORTED ARRAY

### 1. Problem Statement
Given an array $A$ of $n$ elements that was initially sorted in ascending order, but then rotated at some unknown pivot index $k$ ($0 \le k < n$), locate the index of a given `target` in $O(\log n)$ time, or return $-1$ if absent.

```text
ORIGINAL SORTED:   [ 0,  1,  2,  4,  5,  6,  7 ]
ROTATED AT k = 4:  [ 4,  5,  6,  7,  0,  1,  2 ]
```

---

### 2. Core Invariant & Intuition
When a sorted array is rotated, if you divide it at any arbitrary midpoint `mid`, **at least one half (left or right) is GUARANTEED to be strictly sorted!**

```text
                 [ 4,  5,  6,  7,  0,  1,  2 ]
                   ▲           ▲           ▲
                  low         mid         high
                  
Left Half [4..7]:  A[low] ≤ A[mid] (4 ≤ 7) ──► LEFT HALF IS SORTED!
Right Half [7..2]: A[mid] > A[high] (7 > 2) ──► RIGHT HALF CONTAINS PIVOT
```

---

### 3. Decision Logic:
1. Compute `mid`. If $A[\text{mid}] = \text{target}$, return `mid`.
2. Check which half is sorted:
   - **Case A: Left half is sorted ($A[\text{low}] \le A[\text{mid}]$)**:
     - Check if `target` falls inside the left range: $A[\text{low}] \le \text{target} < A[\text{mid}]$.
     - If yes: search left (`high ← mid - 1`).
     - If no: search right (`low ← mid + 1`).
   - **Case B: Right half is sorted ($A[\text{mid}] < A[\text{high}]$)**:
     - Check if `target` falls inside the right range: $A[\text{mid}] < \text{target} \le A[\text{high}]$.
     - If yes: search right (`low ← mid + 1`).
     - If no: search left (`high ← mid - 1`).

---

### 4. Pseudocode: Rotated Sorted Array Search

```text
ALGORITHM SearchRotated(A, n, target)
    Input: Rotated sorted array A of length n, target value
    Output: Index of target in A, or -1 if not found

1.  low ← 0
2.  high ← n - 1
3.  while low ≤ high:
4.      mid ← low + ⌊(high - low) / 2⌋
5.      if A[mid] = target:
6.          return mid
7.      // Check if left half is sorted
8.      if A[low] ≤ A[mid]:
9.          if A[low] ≤ target and target < A[mid]:
10.             high ← mid - 1
11.         else:
12.             low ← mid + 1
13.     // Otherwise right half must be sorted
14.     else:
15.         if A[mid] < target and target ≤ A[high]:
16.             low ← mid + 1
17.         else:
18.             high ← mid - 1
19. return -1
```

---

### 5. Edge Case: Duplicate Elements
If array contains duplicates (e.g., $[1, 0, 1, 1, 1]$):
- Condition $A[\text{low}] = A[\text{mid}] = A[\text{high}]$ can occur!
- We cannot determine which half is sorted.
- **Mitigation**: Trim duplicates by incrementing `low ← low + 1` and decrementing `high ← high - 1`.
- **Worst-case runtime degrades to**: $O(n)$ if all elements are identical.

---
---

# TOPIC 49: BINARY SEARCH ON MONOTONIC ANSWER SPACE

### 1. Problem Classification & The "Minimax" Paradigm
Many complex optimization problems do not ask you to search an array. Instead, they ask:
> *"Find the **minimum** capacity such that..."*  
> *"Find the **maximum** distance such that..."*

If the problem exhibits **Monotonicity**, it can be solved via **Binary Search on the Answer**!

---

### 2. The Monotonicity Condition

Let $P(x)$ be a Boolean validation function (predicate) that answers: *"Is answer $x$ physically feasible?"*

```text
Search Space of Possible Answers (x):
x:       1    2    3    4    5    6    7    8    9    10
P(x): [  F │  F │  F │  F │  T │  T │  T │  T │  T │  T  ]
                             ▲
                             │ First True = Minimum Feasible Answer!
```

If $P(x) = \text{True}$ implies $P(x + 1) = \text{True}$ for all subsequent values (monotonic step function), we can binary search over the numerical interval $[\text{min\_possible}, \text{max\_possible}]$!

---

### 3. Canonical Template: Binary Search on Answer

```text
ALGORITHM BinarySearchOnAnswer(minVal, maxVal)
    Input: Search range bounds [minVal, maxVal]
    Output: Minimum value x satisfying predicate IsFeasible(x)

1.  low ← minVal
2.  high ← maxVal
3.  ans ← high
4.  while low ≤ high:
5.      mid ← low + ⌊(high - low) / 2⌋
6.      if IsFeasible(mid):
7.          ans ← mid           // mid is feasible; try to find a smaller feasible value
8.          high ← mid - 1
9.      else:
10.         low ← mid + 1       // mid is too small; increase value
11. return ans
```

---

### 4. Real-World Problem: Capacity to Ship Packages Within $D$ Days
**Problem**: A conveyor belt has packages with weights $W = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]$. Ship all packages within $D = 5$ days in sequential order. Find the **minimum ship weight capacity**.

- **Search Space Range**:
  - $\text{low} = \max(W) = 10$ (A ship must at least carry the heaviest single package).
  - $\text{high} = \sum W = 55$ (A ship that carries all packages in 1 day).
- **Predicate $\text{IsFeasible}(\text{cap})$**:
  - Greedily load packages into a day until adding the next package exceeds `cap`.
  - Count days required. Return `true` if $\text{days} \le D$, else `false`.

```text
ALGORITHM CanShip(W, n, D, cap)
1.  daysUsed ← 1
2.  currentLoad ← 0
3.  for each weight w in W:
4.      if currentLoad + w > cap:
5.          daysUsed ← daysUsed + 1
6.          currentLoad ← w
7.      else:
8.          currentLoad ← currentLoad + w
9.  return daysUsed ≤ D
```

#### Complexity Analysis:
- Range size: $R = \sum W - \max(W)$
- Each check costs: $O(n)$ time
- Total Time Complexity: $O(n \cdot \log(\sum W))$
- Space Complexity: $O(1)$ auxiliary space.

---

## 🔁 Module 03 Summary & Key Takeaways

1. In **Rotated Sorted Arrays**, at least one half is always sorted; compare $A[\text{low}]$ with $A[\text{mid}]$ to choose the active search half in $O(\log n)$ time.
2. **Binary Search on Answer** transforms difficult optimization problems into a sequence of simple greedy verification checks ($P(x)$).
3. Whenever a question asks for "Minimum of Maximums" or "Maximum of Minimums", test for monotonicity and apply Binary Search on the Answer space.

---
[⬅️ Previous: Module 02 — Bounds & Occurrences](file:///d:/DSA/Part-04-Searching/02_bounds_and_occurrences.md) | [Next: Part 05 — Sorting ➡️](file:///d:/DSA/Part-05-Sorting/01_elementary_sorts.md)
