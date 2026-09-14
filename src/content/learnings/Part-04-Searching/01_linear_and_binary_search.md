# Part 04: Searching — Module 01: Linear & Binary Search

> **Topics Covered:**  
> 42. Linear Search (Sequential Search & Sentinel Optimization) &bull; 43. Binary Search (Logarithmic Divide-and-Conquer Search)

---

# TOPIC 42: LINEAR SEARCH

### 1. Problem Statement
Given an unsorted or sorted array $A$ containing $n$ elements, determine whether a specified `target` value exists in $A$. If it exists, return its zero-based index; otherwise, return $-1$.

### 2. Goal
Exhaustively scan the container until the target element is identified or all elements have been examined.

### 3. Why is this problem important?
Linear Search is the universal baseline search algorithm. It requires **zero preconditions** (no sorting, no indexing, no hashing) and works across any iterable container (arrays, linked lists, files, streams).

### 4. Input
- Array $A$ of size $n$.
- Search key `target`.

### 5. Output
- Integer index $i \in [0, n-1]$ such that $A[i] = \text{target}$, or $-1$ if $\text{target} \notin A$.

### 6. Constraints / Preconditions
- None. Container elements can be in any arbitrary order.

### 7. Intuition
Imagine looking for a lost key in an unsorted drawer. You inspect item after item sequentially from front to back until you find the key or reach the back of the drawer.

### 8. Core Idea
Initialize an index pointer $i \leftarrow 0$. Compare $A[i]$ with `target`. If equal, return $i$. If not, increment $i \leftarrow i + 1$. Repeat until $i = n$.

---

### 9. Step-by-Step Algorithm
1. Start at index $i = 0$.
2. While $i < n$:
   a. If $A[i] = \text{target}$, return $i$.
   b. Otherwise, increment $i \leftarrow i + 1$.
3. If loop finishes without returning, return $-1$.

---

### 10. Visual Explanation & ASCII Diagram

```text
SEARCHING FOR TARGET = 42 IN ARRAY A OF SIZE 5:

  Step 1: i = 0  ──► A[0] = 17 ≠ 42   (Mismatch, advance)
  Step 2: i = 1  ──► A[1] = 89 ≠ 42   (Mismatch, advance)
  Step 3: i = 2  ──► A[2] = 42 = 42   (MATCH FOUND! Return index 2)

      Index:    0      1      2      3      4
      Array:  [ 17 │  89 │  42 │  05 │  63 ]
                            ▲
                            │
                       Target Found!
```

---

### 11. Pseudocode

```text
ALGORITHM LinearSearch(A, n, target)
    Input: Array A of size n, target value
    Output: Index of target, or -1 if not found

1.  for i ← 0 to n - 1:
2.      if A[i] = target:
3.          return i
4.  return -1
```

---

### 12. Worked Example & 13. Complete Dry Run Table
Search for `target = 5` in $A = [12, 8, 5, 23]$, $n = 4$:

| Step | Index $i$ | Current Element $A[i]$ | Condition $A[i] = \text{target}$ | Action Taken |
| :---: | :---: | :---: | :---: | :--- |
| 1 | 0 | 12 | $12 = 5$ (False) | Increment $i \leftarrow 1$ |
| 2 | 1 | 8 | $8 = 5$ (False) | Increment $i \leftarrow 2$ |
| 3 | 2 | 5 | $5 = 5$ (**True**) | **Return index 2** |

---

### 14. Why It Works & Correctness Invariant
**Loop Invariant**: At the start of iteration $i$, the target value does not appear in subarray $A[0 \dots i-1]$.
- **Initialization**: At $i = 0$, $A[0 \dots -1]$ is empty, so invariant holds vacuously.
- **Maintenance**: If $A[i] \ne \text{target}$, then $A[0 \dots i]$ does not contain target, maintaining invariant for $i + 1$.
- **Termination**: If $A[i] = \text{target}$, returned index is correct. If loop terminates ($i = n$), $A[0 \dots n-1]$ does not contain target, so returning $-1$ is correct.

---

### 15. Complexity Analysis
- **Time Complexity**:
  - **Best Case**: $\Theta(1)$ (Target is at index 0).
  - **Average Case**: $\Theta(n/2) = \Theta(n)$.
  - **Worst Case**: $\Theta(n)$ (Target is at index $n-1$ or absent).
- **Space Complexity**:
  - **Auxiliary Space**: $\Theta(1)$ (Only scalar counter $i$).

---

### 16. Edge Cases
- Empty array ($n=0$): Loop never executes; instantly returns $-1$.
- Target at first index ($i=0$): 1 comparison.
- Target at last index ($i=n-1$): $n$ comparisons.
- Target not in array: $n$ comparisons.
- Multiple duplicate targets: Returns the first occurrence index.

---

### 17. Optimization: Sentinel Linear Search
Standard linear search performs **two comparisons per iteration**:
1. Loop boundary check: `i < n`
2. Element equality check: `A[i] == target`

By placing `target` as a **sentinel** at the end of the array, the boundary check `i < n` is eliminated entirely from the inner loop, doubling execution speed on large datasets:

```text
ALGORITHM SentinelLinearSearch(A, n, target)
1.  last ← A[n - 1]
2.  A[n - 1] ← target          // Set sentinel
3.  i ← 0
4.  while A[i] ≠ target:       // Only 1 comparison per iteration!
5.      i ← i + 1
6.  A[n - 1] ← last            // Restore original element
7.  if i < n - 1 or A[n - 1] = target:
8.      return i
9.  return -1
```

---
---

# TOPIC 43: BINARY SEARCH

### 1. Problem Statement
Given a **sorted** array $A$ of $n$ elements in non-decreasing order ($A[0] \le A[1] \le \dots \le A[n-1]$), locate the index of a specified `target` value, or return $-1$ if absent.

### 2. Goal
Find the target in logarithmic time $\Theta(\log n)$ by halving the search space in each iteration.

### 3. Why is this problem important?
Binary Search is one of the most fundamental algorithms in computer science. For $n = 1,000,000,000$ (one billion items), Linear Search requires up to $10^9$ operations ($\approx 1\text{ second}$), whereas Binary Search requires at most **30 comparisons** ($\approx 30\text{ nanoseconds}$)!

### 4. Input
- Sorted array $A$ of size $n$.
- Search key `target`.

### 5. Output
- Index $i$ where $A[i] = \text{target}$, or $-1$.

### 6. Constraints / Invariants
- **Structural Precondition**: $A$ **must be sorted**. If $A$ is unsorted, Binary Search fails completely.

---

### 7. Intuition & 8. Core Idea
Looking up a word in a 1,000-page physical dictionary:
- Open directly to the middle page 500.
- If your word starts with 'M' and page 500 has 'T', you know with 100% certainty the word cannot be in pages 501–1000.
- You throw away half the dictionary in a single motion and repeat on pages 1–499.

---

### 9. Step-by-Step Algorithm
1. Initialize two pointers: `low ← 0`, `high ← n - 1`.
2. While `low ≤ high`:
   a. Compute midpoint: $\text{mid} \leftarrow \text{low} + \lfloor (\text{high} - \text{low}) / 2 \rfloor$.
   b. If $A[\text{mid}] = \text{target}$, return `mid`.
   c. If $A[\text{mid}] < \text{target}$, the target must lie to the right: $\text{low} \leftarrow \text{mid} + 1$.
   d. If $A[\text{mid}] > \text{target}$, the target must lie to the left: $\text{high} \leftarrow \text{mid} - 1$.
3. If search space collapses (`low > high`), target is absent: return $-1$.

---

### 10. Visual Explanation & ASCII Diagram

```text
SEARCHING FOR TARGET = 23 IN A = [ 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 ] (n = 10)

Iteration 1:
  low = 0, high = 9 ──► mid = 0 + ⌊(9 - 0)/2⌋ = 4
  A[mid] = A[4] = 16.
  Since 16 < 23, target must be in right half!
  Discard indices 0..4. Set low ← mid + 1 = 5.

      0    1    2    3    4    5    6    7    8    9
    [ 2 │  5 │  8 │ 12 │ 16 │ 23 │ 38 │ 56 │ 72 │ 91 ]
      ▲                   ▲                        ▲
     low                 mid                      high

Iteration 2:
  low = 5, high = 9 ──► mid = 5 + ⌊(9 - 5)/2⌋ = 7
  A[mid] = A[7] = 56.
  Since 56 > 23, target must be in left half!
  Discard indices 7..9. Set high ← mid - 1 = 6.

      5    6    7    8    9
    [ 23 │ 38 │ 56 │ 72 │ 91 ]
      ▲         ▲         ▲
     low       mid       high

Iteration 3:
  low = 5, high = 6 ──► mid = 5 + ⌊(6 - 5)/2⌋ = 5
  A[mid] = A[5] = 23.
  Match found! Return index 5.
```

---

### 11. Pseudocode

```text
ALGORITHM BinarySearch(A, n, target)
    Input: Sorted array A of length n, search key target
    Output: Index of target in A, or -1 if not found

1.  low ← 0
2.  high ← n - 1
3.  while low ≤ high:
4.      mid ← low + ⌊(high - low) / 2⌋    // Prevents integer overflow
5.      if A[mid] = target:
6.          return mid
7.      else if A[mid] < target:
8.          low ← mid + 1
9.      else:
10.         high ← mid - 1
11. return -1
```

> ⚠️ **CRITICAL INTEGER OVERFLOW BUG**:  
> In many textbooks, line 4 is written as `mid = (low + high) / 2`.  
> If $\text{low} + \text{high} > 2^{31} - 1$ (e.g., in arrays with $10^9$ elements), the addition overflows into a negative integer, causing an `IndexOutOfBounds` crash!  
> **Always use**: `mid = low + (high - low) / 2`.

---

### 12. Complete Dry Run Table

Searching for `target = 23` in $A = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]$:

| Iteration | `low` | `high` | `mid` | $A[\text{mid}]$ | Comparison | Action Taken |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| 1 | 0 | 9 | 4 | 16 | $16 < 23$ | `low ← 4 + 1 = 5` |
| 2 | 5 | 9 | 7 | 56 | $56 > 23$ | `high ← 7 - 1 = 6` |
| 3 | 5 | 6 | 5 | 23 | $23 = 23$ | **Match Found! Return 5** |

---

### 13. Mathematical Proof of Time Complexity
In each iteration, the search interval size is halved:
- Initially: $N$
- After step 1: $N / 2$
- After step 2: $N / 4 = N / 2^2$
- After step $k$: $N / 2^k$

The algorithm terminates when the search interval size drops to 1:
$$\frac{N}{2^k} = 1 \implies 2^k = N \implies k = \log_2 N$$
$$T(n) = \Theta(\log n) \quad \blacksquare$$

---

### 14. Edge Cases
- Empty array ($n=0$): `low = 0, high = -1` $\implies$ loop never executes; returns $-1$.
- Target at `low = 0` or `high = n - 1`: Correctly found.
- Target smaller than all elements: `high` steps down to `-1`; returns $-1$.
- Target larger than all elements: `low` steps up to `n`; returns $-1$.

---

## Module 01 Summary & Key Takeaways

1. **Linear Search** runs in $O(n)$ time with zero preconditions; **Sentinel search** eliminates boundary checks to double speed.
2. **Binary Search** requires a sorted container and runs in $O(\log n)$ time.
3. Always calculate midpoint as $\text{low} + \lfloor (\text{high} - \text{low}) / 2 \rfloor$ to avoid arithmetic overflow.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Section 2.3 & Chapter 12. MIT Press.
2. **Bentley, J.** (2000). *Programming Pearls* (2nd ed.), Column 4: Writing Correct Programs. Addison-Wesley.
3. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 6.2: Searching by Comparison of Keys. Addison-Wesley.
