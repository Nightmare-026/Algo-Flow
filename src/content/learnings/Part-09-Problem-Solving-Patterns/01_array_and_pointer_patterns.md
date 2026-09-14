# Part 09: Problem-Solving Patterns — Module 01: Array & Pointer Patterns

> **Topics Covered:**  
> 134. Prefix Sum (1D & 2D Static Range Queries in $O(1)$) &bull; 135. Difference Array ($O(1)$ Range Updates) &bull; 136. Two Pointers (Opposite & Fast/Slow Convergence) &bull; 137. Sliding Window (Fixed & Variable Length Subarrays) &bull; 138. Fast & Slow Pointer (Floyd's Cycle Start Mathematical Proof)

---

# TOPIC 134: PREFIX SUM PATTERN

### 1. The Core Problem
You have an array $A$ of $n$ numbers. You must answer $Q$ queries of the form:
> *"What is the sum of elements from index $L$ to index $R$ inclusive?"*

- **Brute Force**: Loop from $L$ to $R$ for each query $\implies O(n)$ per query, $O(Q \cdot n)$ total.
- **Prefix Sum Optimization**: Precompute cumulative sums in $O(n)$ time; answer **each query in $O(1)$ time**!

---

### 2. 1D Prefix Sum Mechanics
Define array $P$ where $P[i] = \sum_{k=0}^{i} A[k]$:

$$\text{RangeSum}(L, R) = \begin{cases} 
P[R] & \text{if } L = 0 \\
P[R] - P[L - 1] & \text{if } L > 0
\end{cases}$$

```text
ARRAY A:        [  3,   1,   4,   1,   5,   9  ]
INDEX:             0    1    2    3    4    5
PREFIX SUM P:   [  3,   4,   8,   9,  14,  23  ]

Query: Sum from L = 2 to R = 4 (elements 4 + 1 + 5 = 10):
P[4] - P[1] = 14 - 4 = 10! (Computed in exactly 1 operation!)
```

---

### 3. 2D Prefix Sum (Submatrix Sum Queries)
To query the sum of any rectangular submatrix with top-left $(r_1, c_1)$ and bottom-right $(r_2, c_2)$ in $O(1)$:

$$\text{Sum} = P[r_2][c_2] - P[r_1 - 1][c_2] - P[r_2][c_1 - 1] + P[r_1 - 1][c_1 - 1]$$

```text
       c₁-1      c₂
   ┌─────────┬─────────┐
   │    A    │    B    │
r₁-1├─────────┼─────────┤
   │    C    │    D    │  ◄── D is the target submatrix!
r₂ └─────────┴─────────┘
Formula: Area(D) = (A + B + C + D) - (A + B) - (A + C) + A
```

---
---

# TOPIC 135: DIFFERENCE ARRAY (RANGE UPDATE PATTERN)

### 1. The Dual Problem to Prefix Sums
You start with an array of zeros. You must perform $Q$ updates of the form:
> *"Add value $v$ to all elements from index $L$ to index $R$."*

- **Brute Force**: Loop from $L$ to $R$ $\implies O(n)$ per update.
- **Difference Array Optimization**: Update **in $O(1)$ time**!

---

### 2. Mechanics
Maintain an array $D$ of size $n + 1$. For each update $(L, R, v)$:
1. $D[L] \leftarrow D[L] + v$
2. $D[R + 1] \leftarrow D[R + 1] - v$

After processing all $Q$ queries, **take the prefix sum of $D$** to reconstruct the final array in a single $O(n)$ pass!

```text
UPDATE: Add +5 from index 1 to 3 in array of size 5:
D:  [  0,  +5,   0,   0,  -5,   0  ]
       0    1    2    3    4    5

Take Prefix Sum of D:
A:  [  0,   5,   5,   5,   0  ]  (Exact range [1..3] updated in O(1)!)
```

---
---

# TOPIC 136: TWO POINTERS PATTERN

### 1. Paradigm & Categorization
Two pointers track indices in a linear sequence to replace nested loops ($O(n^2)$) with a single linear pass ($O(n)$):
1. **Opposite Direction (Inward Convergence)**: `left` starts at 0, `right` starts at $n-1$. Move toward each other (e.g., Two-Sum on sorted array, Reversing array, Container with Most Water).
2. **Same Direction (Fast & Slow)**: `fast` explores ahead, `slow` lags behind (e.g., Removing duplicates in-place).

---

### 2. Canonical Example: Two-Sum on Sorted Array

```text
ALGORITHM TwoSumSorted(A, n, target)
1.  left ← 0
2.  right ← n - 1
3.  while left < right:
4.      sum ← A[left] + A[right]
5.      if sum = target:
6.          return (left, right)
7.      else if sum < target:
8.          left ← left + 1     // Need larger sum
9.      else:
10.         right ← right - 1   // Need smaller sum
11. return (-1, -1)
```

---
---

# TOPIC 137: SLIDING WINDOW PATTERN

### 1. Paradigm
Maintains a contiguous "window" $[L, R]$ over an array or string that expands or contracts dynamically, transforming $O(n^2)$ subarray evaluations into $O(n)$ time.

### 2. The Two Window Types
1. **Fixed Window of Size $K$**: Window length is constant. Slide right by adding incoming element $A[i]$ and subtracting exiting element $A[i - K]$.
2. **Variable Window (Longest / Shortest Subarray)**:
   - **Expand**: Increment `right` pointer to include $A[\text{right}]$.
   - **Contract**: While the window violates the constraint, increment `left` pointer to shrink the window until valid again.

```text
ALGORITHM VariableSlidingWindow(A, n, condition)
1.  left ← 0
2.  for right ← 0 to n - 1:
3.      Add(A[right])           // Expand window
4.      while WindowViolatesConstraint():
5.          Remove(A[left])     // Contract window
6.          left ← left + 1
7.      UpdateAnswer(right - left + 1)
```

---
---

# TOPIC 138: FAST & SLOW POINTERS (FLOYD'S CYCLE START PROOF)

### 1. Mathematical Proof: Finding the Exact Cycle Entry Node
When detecting a cycle in a linked list using `slow` (speed 1) and `fast` (speed 2):

```text
              ◄─── L ────►
        HEAD ────────────► [ ENTRY ] ────────┐
                             ▲               │
                           d │               │ C - d
                             │               ▼
                             └────── [ MEET ]
```

Let:
- $L$ = Distance from Head to Cycle Entry Node.
- $C$ = Length of the cycle.
- $d$ = Distance from Cycle Entry to the meeting point inside the cycle.

When they meet:
- Distance traveled by `slow`: $D_{\text{slow}} = L + d$
- Distance traveled by `fast`: $D_{\text{fast}} = L + d + k \cdot C$ (where $k \ge 1$ is complete loops)
- Since `fast` travels twice as fast:
$$2 \cdot D_{\text{slow}} = D_{\text{fast}}$$
$$2(L + d) = L + d + k \cdot C$$
$$L + d = k \cdot C \implies \mathbf{L = k \cdot C - d = (k - 1)C + (C - d)}$$

#### The Astonishing Result:
The distance from the **Head to the Entry Node ($L$)** is mathematically identical to the distance from the **Meeting Point to the Entry Node ($(C - d)$)**!

#### Algorithm to Find Cycle Entry:
1. Detect meeting point using `slow` and `fast`.
2. Move `slow` back to `head`; keep `fast` at the meeting point.
3. Advance both pointers **at the same speed of 1 step per iteration**.
4. The exact node where they collide is **guaranteed to be the Cycle Entry Node!** $\blacksquare$

---

## Module 01 Summary & Key Takeaways

1. **Prefix Sum** answers static range sum queries in $O(1)$ time; **Difference Array** applies range updates in $O(1)$ time.
2. **Two Pointers** replaces nested loops with linear convergence on sorted sequences.
3. **Sliding Window** manages contiguous subarrays by expanding the right boundary and contracting the left.
4. **Floyd's Tortoise and Hare** discovers the cycle entry node in $O(n)$ time and $O(1)$ space via the distance identity $L = (k-1)C + (C-d)$.

---

## References & Academic Attribution

1. **Halim, S., Halim, F., & Skiena, S. S.** (2020). *Competitive Programming 4: The Lower Bound of Programming Contests*. CP4 Pte Ltd.
2. **Laaksonen, A.** (2020). *Guide to Competitive Programming: Learning and Improving Algorithms Through Contests* (2nd ed.). Springer.
3. **Skiena, S. S.** (2020). *The Algorithm Design Manual* (3rd ed.). Springer.
