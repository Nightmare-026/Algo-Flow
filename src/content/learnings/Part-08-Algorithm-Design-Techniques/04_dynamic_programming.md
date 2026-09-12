# 💡 Part 08: Algorithm Design Techniques — Module 04: Dynamic Programming (DP)

> **Topics Covered:**  
> 125. Dynamic Programming Foundations & Bellman's Principle &bull; 126. Top-Down DP with Memoization &bull; 127. Bottom-Up DP with Tabulation &bull; 128. State Definition & Dimension Minimization &bull; 129. Recurrence Transitions &bull; 130. Base Cases & Guard Invariants &bull; 131. Space Optimization (Rolling Buffers)

---

# TOPIC 125: DP FOUNDATIONS & PRINCIPLES

### 1. Definition
**Dynamic Programming (DP)** (formulated by Richard Bellman, 1953) is a mathematical optimization technique that solves complex problems by breaking them down into simpler **Overlapping Subproblems**, solving each subproblem exactly once, and storing their solutions to eliminate redundant recomputations.

---

### 2. The Two Mandatory Prerequisites for DP

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE TWO PILLARS OF DYNAMIC PROGRAMMING                   │
└─────────────────────────────────────────────────────────────────────────────┘

1. OPTIMAL SUBSTRUCTURE                2. OVERLAPPING SUBPROBLEMS
   An optimal solution to the overall     The same subproblems are solved
   problem can be constructed from        repeatedly in the recursion tree.
   optimal solutions to its subproblems.
             [ Fib(5) ]
            /          \
       [ Fib(4) ]     [ Fib(3) ]  ◄── Fib(3) computed twice!
       /        \     /        \
   [ Fib(3) ] [Fib(2)][Fib(2)] [Fib(1)] ◄── Fib(2) computed three times!
```

Without Overlapping Subproblems, Divide and Conquer is sufficient. Without Optimal Substructure, DP cannot guarantee the globally optimal solution.

---
---

# TOPICS 126–127: MEMOIZATION (TOP-DOWN) VS TABULATION (BOTTOM-UP)

```text
TOP-DOWN (MEMOIZATION):
Starts at the desired goal Fib(n), recurses downwards, caching results in a memo table.
Pros: Solves only subproblems that are strictly necessary; intuitive mental model.
Cons: Recursion stack frame overhead; risk of stack overflow on large n.

BOTTOM-UP (TABULATION):
Starts at base cases Fib(0), Fib(1) and iteratively fills a table upwards to Fib(n).
Pros: Zero recursion overhead; faster due to sequential CPU memory access; easy to space-optimize.
Cons: Must solve all subproblems in the table, even if some aren't needed for the final answer.
```

---

### Comparison Matrix: Top-Down vs Bottom-Up

| Dimension | Top-Down (Memoization) | Bottom-Up (Tabulation) |
| :--- | :--- | :--- |
| **Control Flow** | Recursive function calls | Iterative `for` / `while` loops |
| **State Storage** | Hash table or lookup array | Iterative table (`dp[]` or `dp[][]`) |
| **Subproblem Order**| Evaluated on-demand as needed | Pre-determined topological order (base $\to$ goal) |
| **Stack Overhead** | $O(\text{Tree Depth})$ stack frames | **$O(1)$ stack overhead (zero recursion)** |
| **Space Optimization**| Difficult | **Straightforward (Rolling variables / rows)** |

---
---

# TOPICS 128–130: THE 4 STEPS TO DESIGN ANY DP ALGORITHM

To master DP, never memorize solutions. Apply this **4-Step Architectural Method**:

### Step 1: Define the State
Determine the minimal tuple of variables $(i, j, \dots)$ that uniquely identifies a subproblem:
- e.g., in 0/1 Knapsack: `dp[i][w]` = maximum value obtainable considering the first $i$ items with a remaining weight capacity of $w$.

### Step 2: Formulate the Recurrence Transition
Express the answer to state `dp[i][w]` mathematically using previously computed subproblems:
$$\text{dp}[i][w] = \max\Big( \text{dp}[i-1][w], \quad \text{value}[i-1] + \text{dp}[i-1][w - \text{weight}[i-1]] \Big)$$

### Step 3: Establish the Base Cases
Identify the trivial boundary states that can be answered without subproblem lookups:
- `dp[0][w] = 0` (0 items yield 0 value).
- `dp[i][0] = 0` (0 capacity holds 0 value).

### Step 4: Determine the Order of Computation
Ensure that when evaluating `dp[i][w]`, all prerequisite states (`dp[i-1][\dots]`) have already been finalized.

---
---

# TOPIC 131: SPACE OPTIMIZATION VIA ROLLING BUFFERS

Most 2D DP tables `dp[i][w]` only depend on the **immediately preceding row** (`dp[i-1]`). The entire history of rows $0 \dots i-2$ is never accessed again!

### 0/1 Knapsack Space Optimization: $O(N \cdot W) \to O(W)$

```text
STANDARD 2D TABLE (Memory = N × W):
Row i depends ONLY on Row i - 1:
    Row i - 1:  [  ...  │  dp[i-1][w-weight]  │  ...  │  dp[i-1][w]  ]
                              \                               │
    Row i:                    [  ...  │  ...  │  ...  │  dp[i][w]  ]

SPACE OPTIMIZATION: Flatten to a single 1D array of size W + 1!
CRITICAL TRICK: Iterate the capacity loop BACKWARDS (W down to weight):
for i ← 0 to N - 1:
    for w ← W down to weight[i]:
        dp[w] ← max(dp[w], value[i] + dp[w - weight[i]])
```
*(Iterating backwards guarantees that `dp[w - weight[i]]` still contains the value from the PREVIOUS row, preventing an item from being used more than once!)*

---

### Canonical Worked Example 2: Longest Common Subsequence (LCS)

**Problem**: Find the length of the longest subsequence present in both strings $S_1$ (length $m$) and $S_2$ (length $n$).

#### Recurrence Transition:
$$\text{dp}[i][j] = \begin{cases} 
1 + \text{dp}[i-1][j-1] & \text{if } S_1[i-1] = S_2[j-1] \quad (\text{Character match}) \\
\max(\text{dp}[i-1][j], \, \text{dp}[i][j-1]) & \text{if } S_1[i-1] \ne S_2[j-1] \quad (\text{Mismatch})
\end{cases}$$

```text
ALGORITHM LongestCommonSubsequence(S1, S2, m, n)
1.  allocate dp[0...m][0...n] initialized to 0
2.  for i ← 1 to m:
3.      for j ← 1 to n:
4.          if S1[i - 1] = S2[j - 1]:
5.              dp[i][j] ← 1 + dp[i - 1][j - 1]
6.          else:
7.              dp[i][j] ← max(dp[i - 1][j], dp[i][j - 1])
8.  return dp[m][n]
```
- **Time Complexity**: $\Theta(m \cdot n)$.
- **Space Complexity**: $\Theta(m \cdot n)$ (Can be optimized to $\Theta(\min(m, n))$ using two rolling rows).

---

## 🔁 Module 04 Summary & Key Takeaways

1. **Dynamic Programming** solves problems with **Optimal Substructure** and **Overlapping Subproblems**.
2. **Top-Down (Memoization)** uses recursion with a cache; **Bottom-Up (Tabulation)** iteratively fills an array in topological dependency order.
3. Master the 4-step framework: **State $\to$ Transition $\to$ Base Cases $\to$ Computation Order**.
4. When a 2D table depends only on the previous row, **space-optimize** to 1D arrays to slash RAM usage from $O(N \cdot W)$ to $O(W)$.

---
[⬅️ Previous: Module 03 — Backtracking](file:///d:/DSA/Part-08-Algorithm-Design-Techniques/03_backtracking.md) | [Next: Part 09 — Problem Solving Patterns ➡️](file:///d:/DSA/Part-09-Problem-Solving-Patterns/01_array_and_pointer_patterns.md)
