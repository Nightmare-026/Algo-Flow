# Part 08: Algorithm Design Techniques — Module 04: Dynamic Programming

> **Curriculum Milestone:** Part 08 &bull; Module 04 &bull; Chapter 46 of 62  
> **Topic Competencies:** Bellman's Principle of Optimality &bull; Optimal Substructure & Overlapping Subproblems &bull; Memoization vs. Tabulation &bull; 4-Step State Formulation &bull; 0/1 Knapsack Matrix &bull; LCS 2D Grid Trace &bull; Space Optimization Proof &bull; Pseudo-Polynomial Complexity  
> **Primary Academic References:** CLRS 4th Ed. Chapter 14 &bull; Bellman (1957) *Dynamic Programming* &bull; Kleinberg & Tardos Chapter 6

---

## 1. Executive Summary & Learning Objectives

Dynamic Programming (DP) is an algorithm design paradigm for solving optimization problems by decomposing them into overlapping subproblems, computing each subproblem solution exactly once, and storing the results in a table.

By the end of this chapter, you will be able to:
1. Formulate formal state definitions $(i, w)$ and derive recurrence equations satisfying Bellman's Principle of Optimality.
2. Differentiate between Top-Down Memoization (demand-driven recursion) and Bottom-Up Tabulation (topological table fill).
3. Manually trace multi-dimensional DP state matrices step-by-step and reconstruct optimal solution subsets via backwards path reconstruction.
4. Prove why rolling buffer space optimization requires reverse iteration in 0/1 knapsack problems.
5. Identify pseudo-polynomial time constraints and avoid integer overflow in optimization recurrences.

---

## 2. Theoretical Foundations: The Two Pillars of Dynamic Programming

Formulated by Richard Bellman in 1957, dynamic programming applies strictly to problems exhibiting two structural properties:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE TWO PILLARS OF DYNAMIC PROGRAMMING                   │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 1. OPTIMAL SUBSTRUCTURE              │ 2. OVERLAPPING SUBPROBLEMS           │
│                                      │                                      │
│ An optimal solution to the overall   │ A naive recursive decomposition      │
│ problem contains within it optimal   │ evaluates the exact same state       │
│ solutions to subproblems.            │ multiple times across the call tree. │
│                                      │                                      │
│ Theorem: If a shortest path from u   │ Example: Fib(5) computes Fib(3)      │
│ to v passes through w, the sub-path  │ twice, Fib(2) three times, and       │
│ from u to w must also be a shortest  │ Fib(1) five times in O(2^n) time.    │
│ path between u and w.                │ Memoization collapses this to O(n).  │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

### Contrast with Other Paradigms

- **Divide and Conquer (e.g., Merge Sort)**: Decomposes problems into **independent** (disjoint) subproblems. Subproblems do not overlap; memoization provides no benefit.
- **Greedy Algorithms (e.g., Dijkstra, Kruskal)**: Makes a locally optimal choice at each step without reconsidering previous choices. Requires the matroid greedy-choice property. When greedy choice fails to guarantee global optimality, DP is required.

---

## 3. Memoization (Top-Down) vs. Tabulation (Bottom-Up)

```text
TOP-DOWN (MEMOIZATION):
Starts at the root problem S(n), explores branches recursively on demand,
and records answers in a memo table (array or hash map).

BOTTOM-UP (TABULATION):
Constructs a Topological Ordering of the subproblem dependency DAG.
Iteratively computes states starting from base cases up to the target state.
```

### Architectural Trade-Off Matrix

| Dimension | Top-Down (Memoization) | Bottom-Up (Tabulation) |
| :--- | :--- | :--- |
| **Control Flow** | Recursive function invocation | Iterative nested loops (`for` / `while`) |
| **State Storage** | Lookup array or hash table | Pre-allocated matrix (`dp[]` or `dp[][]`) |
| **Subproblem Evaluation** | Lazy evaluation (computes only reachable states) | Eager evaluation (computes all table entries in order) |
| **Call Stack Overhead** | $\Theta(D)$ stack frames where $D$ is recursion depth | $\Theta(1)$ call stack overhead (zero recursion) |
| **Cache Locality** | Random/scattered memory access patterns | Sequential, cache-friendly array traversals |
| **Space Optimization** | Difficult to eliminate state dimensions | Straightforward reduction via rolling buffers |

---

## 4. The 4-Step Systematic DP Design Method

Every dynamic programming algorithm must be developed through this four-step engineering sequence:

1. **State Definition**: Identify the minimal tuple of independent parameters $(i, j, \dots)$ that fully captures the subproblem state.
2. **Recurrence Relation**: Express state $dp[\dots]$ mathematically in terms of strictly smaller subproblems.
3. **Base Cases**: Establish trivial boundary conditions that terminate the recurrence without lookups.
4. **Evaluation Order**: Determine the topological iteration order ensuring all prerequisite subproblems are resolved prior to computing the current state.

---

## 5. Canonical Problem 1: The 0/1 Knapsack Problem

### Problem Specification
Given $N$ items, each with a positive integer weight $w_i$ and value $v_i$, determine the maximum value subset of items that fits within a knapsack of capacity $W$. Each item can be selected at most once ($x_i \in \{0, 1\}$).

### Recurrence Formulation

Let $dp[i][w]$ denote the maximum value obtainable using a subset of the first $i$ items with remaining weight capacity $w$, for $0 \le i \le N$ and $0 \le w \le W$:

$$\text{dp}[i][w] = \begin{cases} 
0 & \text{if } i = 0 \text{ or } w = 0 \\
\text{dp}[i-1][w] & \text{if } w_i > w \quad (\text{Item exceeds capacity}) \\
\max\Big(\text{dp}[i-1][w], \, v_i + \text{dp}[i-1][w - w_i]\Big) & \text{if } w_i \le w \quad (\text{Exclude vs. Include})
\end{cases}$$

---

### Complete Worked Example & 2D State Trace Table

Consider $N = 3$ items and capacity $W = 5$:
- Item 1: $w_1 = 1$, $v_1 = 6$
- Item 2: $w_2 = 2$, $v_2 = 10$
- Item 3: $w_3 = 3$, $v_3 = 12$

#### State Matrix $dp[i][w]$:

| Item $i$ | Item Specs $(w_i, v_i)$ | $w = 0$ | $w = 1$ | $w = 2$ | $w = 3$ | $w = 4$ | $w = 5$ |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0** | Base Case ($\emptyset$) | 0 | 0 | 0 | 0 | 0 | 0 |
| **1** | $(w_1=1, v_1=6)$ | 0 | 6 | 6 | 6 | 6 | 6 |
| **2** | $(w_2=2, v_2=10)$ | 0 | 6 | 10 | 16 | 16 | 16 |
| **3** | $(w_3=3, v_3=12)$ | 0 | 6 | 10 | 16 | 18 | **22** |

#### Step-by-Step State Derivation for Row 3:
- $w = 1, 2$: $w_3 = 3 > w \implies dp[3][w] = dp[2][w] \implies 6, 10$.
- $w = 3$: $\max(dp[2][3], v_3 + dp[2][3-3]) = \max(16, 12 + 0) = 16$.
- $w = 4$: $\max(dp[2][4], v_3 + dp[2][4-3]) = \max(16, 12 + 6) = 18$.
- $w = 5$: $\max(dp[2][5], v_3 + dp[2][5-3]) = \max(16, 12 + 10) = \mathbf{22}$.

#### Optimal Subset Backtracking:
Starting at $dp[3][5] = 22$:
1. Compare $dp[3][5]$ with $dp[2][5]$ ($22 \ne 16$) $\implies$ **Item 3 included**. Remaining capacity $= 5 - 3 = 2$.
2. Compare $dp[2][2]$ with $dp[1][2]$ ($10 \ne 6$) $\implies$ **Item 2 included**. Remaining capacity $= 2 - 2 = 0$.
3. Capacity is 0. Selected items: **Item 2 and Item 3** (Total weight $= 2 + 3 = 5$, Total value $= 10 + 12 = \mathbf{22}$).

---

## 6. Space Optimization: 2D Table to 1D Rolling Buffer

Observe that computing row $i$ requires access only to row $i-1$. Rows $0 \dots i-2$ are never read again.

### The Reverse-Iteration Invariant

When compressing $dp[i][w]$ to a 1D array $dp[w]$, we must iterate capacity $w$ in **strictly descending order** from $W$ down to $w_i$:

```text
FORWARD LOOP (w from w_i to W):
dp[w] = max(dp[w], v_i + dp[w - w_i])
ERROR: dp[w - w_i] was ALREADY overwritten in the current iteration!
Result: Item i is used multiple times (Unbounded Knapsack behavior).

REVERSE LOOP (w from W down to w_i):
dp[w] = max(dp[w], v_i + dp[w - w_i])
CORRECT: dp[w - w_i] contains the value from the PREVIOUS row (i - 1).
Result: Guarantees 0/1 single-use item semantics in O(W) space.
```

```typescript
export function knapsack01SpaceOptimized(
  weights: number[],
  values: number[],
  capacity: number
): number {
  const dp = new Array(capacity + 1).fill(0);

  for (let i = 0; i < weights.length; i++) {
    const wt = weights[i];
    const val = values[i];
    // Traverse backwards to preserve previous row states
    for (let w = capacity; w >= wt; w--) {
      dp[w] = Math.max(dp[w], val + dp[w - wt]);
    }
  }

  return dp[capacity];
}
```

---

## 7. Canonical Problem 2: Longest Common Subsequence (LCS)

### Problem Specification
Given two sequences $S_1$ of length $m$ and $S_2$ of length $n$, find the length of the longest subsequence present in both. A subsequence maintains relative left-to-right order without requiring contiguity.

### Mathematical Recurrence

Let $dp[i][j]$ represent the length of the LCS between prefixes $S_1[0 \dots i-1]$ and $S_2[0 \dots j-1]$:

$$\text{dp}[i][j] = \begin{cases} 
0 & \text{if } i = 0 \text{ or } j = 0 \\
1 + \text{dp}[i-1][j-1] & \text{if } S_1[i-1] = S_2[j-1] \quad (\text{Character Match}) \\
\max\Big(\text{dp}[i-1][j], \, \text{dp}[i][j-1]\Big) & \text{if } S_1[i-1] \ne S_2[j-1] \quad (\text{Character Mismatch})
\end{cases}$$

---

### Complete 2D Grid Trace: $S_1 = \text{"ABCDE"}$, $S_2 = \text{"ACE"}$

Dimensions: $(m+1) \times (n+1) = 6 \times 4$:

| $S_1 \downarrow \backslash S_2 \rightarrow$ | $\emptyset$ ($j=0$) | **A** ($j=1$) | **C** ($j=2$) | **E** ($j=3$) |
| :---: | :---: | :---: | :---: | :---: |
| $\emptyset$ ($i=0$) | 0 | 0 | 0 | 0 |
| **A** ($i=1$) | 0 | **1** $\nwarrow$ | 1 $\leftarrow$ | 1 $\leftarrow$ |
| **B** ($i=2$) | 0 | 1 $\uparrow$ | 1 | 1 |
| **C** ($i=3$) | 0 | 1 $\uparrow$ | **2** $\nwarrow$ | 2 $\leftarrow$ |
| **D** ($i=4$) | 0 | 1 $\uparrow$ | 2 $\uparrow$ | 2 |
| **E** ($i=5$) | 0 | 1 $\uparrow$ | 2 $\uparrow$ | **3** $\nwarrow$ |

#### Solution Reconstruction:
Follow diagonal match arrows ($\nwarrow$):
- $dp[5][3] = 3 \implies S_1[4] == S_2[2] == \text{'E'}$ $\nwarrow$ move to $(4, 2)$.
- $dp[4][2] == dp[3][2] \implies$ move up to $(3, 2)$.
- $dp[3][2] = 2 \implies S_1[2] == S_2[1] == \text{'C'}$ $\nwarrow$ move to $(2, 1)$.
- $dp[2][1] == dp[1][1] \implies$ move up to $(1, 1)$.
- $dp[1][1] = 1 \implies S_1[0] == S_2[0] == \text{'A'}$ $\nwarrow$ move to $(0, 0)$.

Reconstructed string: **"ACE"** of length **3**.

---

## 8. Complexity Analysis & The Pseudo-Polynomial Distinction

### Time Complexity
- **0/1 Knapsack**: $\Theta(N \cdot W)$ operations.
  - **Pseudo-Polynomial Time**: The parameter $W$ is a numeric value whose representation requires $k = \lceil \log_2 W \rceil$ bits. Relative to input size in bits, the time complexity is $\Theta(N \cdot 2^k)$, which is **exponential** in the length of $W$. 0/1 Knapsack is weakly NP-complete.
- **LCS**: $\Theta(m \cdot n)$ operations, strictly polynomial in input string lengths.

### Space Complexity
- **2D Tabulation**: $\Theta(N \cdot W)$ or $\Theta(m \cdot n)$ auxiliary space.
- **Optimized 1D Rolling Buffer**: $\Theta(W)$ or $\Theta(\min(m, n))$ auxiliary space.

---

## 9. Common Traps, Edge Cases & Implementation Pitfalls

1. **Integer Overflow in Minimization Recurrences**:
   - In problems like Coin Change ($dp[w] = \min(dp[w], 1 + dp[w - c])$), initializing unreachable states to `INT_MAX` causes signed integer overflow when adding 1.
   - *Mitigation*: Initialize unreachable states to a sentinel upper bound (e.g., `1e9` or $W + 1$) rather than `INT_MAX`.

2. **Index Off-by-One Mismatch**:
   - State index $i \in [0 \dots N]$ maps to item index $i - 1$ in zero-indexed collections.
   - *Mitigation*: Consistently use $dp[i]$ to denote decisions on the prefix of length $i$.

3. **Direction of Capacity Iteration**:
   - In 1D arrays, iterating $w$ forward from $0 \to W$ solves **Unbounded Knapsack** (items can be reused).
   - Iterating $w$ backward from $W \to 0$ enforces **0/1 Knapsack** (items used at most once).

4. **Floating Point State Coordinates**:
   - DP tables require discrete, integer-addressable states. If continuous values are present, discretize via scaling or apply branch-and-bound.

---

## 10. Curated Practice Problems & Real-World Systems Applications

### Real-World Production Systems
- **Version Control (`git diff`)**: Uses Myers' diff algorithm, an optimized variant of the Longest Common Subsequence DP on an edit graph.
- **Relational Query Planners**: The System R dynamic programming algorithm optimizes multi-table database JOIN orders in $O(3^n)$ time compared to $O(n!)$ brute force.
- **Speech Recognition & Bioinformatics**: The Viterbi algorithm uses dynamic programming over Hidden Markov Models (HMMs) to find the most probable sequence of hidden states.

### Standard Practice Roadmap
1. **Coin Change (LeetCode 322)** — Unbounded Knapsack variant with minimization recurrence.
2. **Partition Equal Subset Sum (LeetCode 416)** — Reduction to 0/1 Knapsack with target sum $= \text{TotalSum} / 2$.
3. **Edit Distance / Levenshtein Distance (LeetCode 72)** — 2D DP with insertion, deletion, and substitution operations.
4. **Longest Increasing Subsequence (LeetCode 300)** — $\Theta(n^2)$ tabulation transitioning to $\Theta(n \log n)$ via patience sorting.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 4, 14, 15, & 16. MIT Press.
2. **Kleinberg, J., & Tardos, É.** (2006). *Algorithm Design*. Pearson / Addison-Wesley.
3. **Bellman, R.** (1957). *Dynamic Programming*. Princeton University Press.
