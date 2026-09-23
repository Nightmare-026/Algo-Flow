# Part 08: Algorithm Design Techniques — Module 04: Dynamic Programming

Dynamic Programming (DP) resolves combinatorial explosions by decomposing complex optimization problems into a directed acyclic graph of overlapping subproblems, computing each state exactly once and reusing tabular results. From compiler instruction scheduling and relational query planners to sequence alignment in computational genomics, DP bridges mathematical induction and cached tabular execution.

---

## 1. Executive Summary & Learning Objectives

Dynamic Programming is an algorithmic paradigm designed to optimize recursive search spaces by identifying shared subproblems, imposing a topological evaluation order, and caching intermediate states in memory.

By the end of this chapter, you will be able to:
1. **Formulate Formal State Definitions**: Isolate the minimal tuple $(i, w)$ capturing sufficient history and derive recurrences conforming to Bellman's Principle of Optimality.
2. **Evaluate Architecture Trade-Offs**: Contrast Top-Down Memoization (lazy recursion) with Bottom-Up Tabulation (eager iteration) across memory overhead, recursion limits, and cache locality.
3. **Trace Multi-Dimensional State Matrices**: Manually construct tabular matrices for 0/1 Knapsack and Longest Common Subsequence (LCS) and reconstruct optimal solution subsets via backwards pointer tracking.
4. **Prove Space-Optimization Invariants**: Mathematically prove why compressing a 2D state matrix to a 1D buffer requires strictly descending capacity iteration to enforce 0/1 single-use constraints.
5. **Analyze Pseudo-Polynomial Complexity**: Differentiate between polynomial and pseudo-polynomial time complexities, analyzing the impact of numeric input magnitudes on bit-length complexity.

---

## 2. Theoretical Foundations: The Two Pillars of Dynamic Programming

Formulated by Richard Bellman in 1957, dynamic programming applies strictly to problems exhibiting two core structural properties:

| Pillar | Theoretical Definition | Algorithmic Consequence | Canonical Counterexample |
| :--- | :--- | :--- | :--- |
| **1. Optimal Substructure** | An optimal solution to the overall problem contains within it optimal solutions to its constituent subproblems. | Enables computing global optima directly from subproblem optima via recurrence equations. | **Longest Simple Path**: A longest simple path from $u$ to $v$ does not decompose into independent longest simple sub-paths because vertices cannot be revisited. |
| **2. Overlapping Subproblems** | A naive recursive tree recomputes the exact same subproblem states multiple times across branches. | Caching states in a memo table or matrix reduces exponential $\mathcal{O}(2^n)$ branching to polynomial $\mathcal{O}(n)$ table fills. | **Merge Sort**: Subproblems ($L[0 \dots n/2]$ and $R[n/2 \dots n]$) are completely disjoint; memoization provides zero reuse. |

### Contrast with Alternative Paradigms

- **Divide and Conquer (e.g., Merge Sort, Strassen Matrix Multiplication)**: Partitions problems into **independent, non-overlapping** subproblems, solves each independently, and combines their solutions.
- **Greedy Algorithms (e.g., Dijkstra, Kruskal, Huffman Coding)**: Commits irrevocably to a locally optimal choice at each step without exploring alternative branches, requiring the greedy-choice property and optimal substructure. When greedy decisions can lead to suboptimal dead ends, dynamic programming explores all candidate state transitions.

---

## 3. Memoization (Top-Down) vs. Tabulation (Bottom-Up)

Every dynamic programming problem can be operationalized through two complementary execution strategies:

### Architectural Comparison Matrix

| Dimension | Top-Down (Memoization) | Bottom-Up (Tabulation) |
| :--- | :--- | :--- |
| **Execution Model** | Demand-driven recursive traversal from target state down to base cases | Topological iteration starting from base cases up to the target state |
| **Data Structure** | Hash map (`Map<string, number>`) or sparse lookup array | Pre-allocated contiguous matrix (`number[]` or `number[][]`) |
| **State Exploration** | **Lazy**: Only explores states strictly reachable from the initial state | **Eager**: Computes all valid states within the grid bounds |
| **Call Stack Overhead** | $\Theta(D)$ stack frames where $D$ is recursion depth (risk of stack overflow) | $\Theta(1)$ call stack overhead (pure nested loops) |
| **Hardware Cache Locality** | Poor (non-contiguous memory jumps, pointer indirection) | Optimal (sequential array traversal friendly to CPU L1/L2 caches) |
| **Space Optimization** | Difficult to discard historical states | Straightforward state compression (e.g., rolling buffers, 2-row swapping) |

---

## 4. The 4-Step Systematic DP Design Method

Every dynamic programming algorithm is engineered through a disciplined four-step protocol:

1. **State Characterization**: Define the state tuple $dp[i][j \dots]$ precisely, specifying the exact subproblem it models and ensuring it satisfies the Markovian property (past transitions do not affect future options beyond the state variables).
2. **Transition Recurrence**: Derive a mathematical relation expressing the target state as an aggregate ($\min$, $\max$, or $\sum$) of strictly smaller prerequisite subproblems.
3. **Base Cases & Boundaries**: Identify trivial edge conditions that terminate the recursion or populate row/column zero of the table.
4. **Topological Evaluation Order**: Determine loop iteration directions such that whenever computing $dp[\text{state}]$, all required dependent states have already been resolved.

---

## 5. Canonical Problem 1: The 0/1 Knapsack Problem

### Problem Specification
Given $N$ items, each characterized by weight $w_i \in \mathbb{Z}^+$ and value $v_i \in \mathbb{Z}^+$, determine the subset of items maximizing total value subject to total weight not exceeding knapsack capacity $W$. Each item can be chosen at most once ($x_i \in \{0, 1\}$).

### Recurrence Formulation

Let $dp[i][w]$ represent the maximum value attainable considering a subset of the first $i$ items with remaining weight capacity $w$, where $0 \le i \le N$ and $0 \le w \le W$:

$$dp[i][w] = \begin{cases} 
0 & \text{if } i = 0 \text{ or } w = 0 \\
dp[i-1][w] & \text{if } w_i > w \\
\max\Big(dp[i-1][w], \, v_i + dp[i-1][w - w_i]\Big) & \text{if } w_i \le w
\end{cases}$$

---

### Worked Trace & 2D State Table

Consider $N = 3$ items and knapsack capacity $W = 5$:
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

#### Optimal Subset Reconstruction
To identify the exact items chosen, backtrack from cell $dp[3][5] = 22$:
1. Compare $dp[3][5]$ with $dp[2][5]$ ($22 \ne 16$) $\implies$ **Item 3 selected**. Remaining capacity $= 5 - 3 = 2$.
2. Compare $dp[2][2]$ with $dp[1][2]$ ($10 \ne 6$) $\implies$ **Item 2 selected**. Remaining capacity $= 2 - 2 = 0$.
3. Capacity reached $0$. Selected set: **{Item 2, Item 3}** with total weight $2 + 3 = 5$ and maximum value $10 + 12 = \mathbf{22}$.

<div class="my-6 p-4 bg-surface rounded-xl border border-border overflow-x-auto">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 340" width="100%" height="340" class="mx-auto block font-sans">
  <defs>
    <marker id="arrow-blue" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#0284c7"/></marker>
    <marker id="arrow-green" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/></marker>
    <marker id="arrow-red" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#ef4444"/></marker>
    <linearGradient id="cell-prev" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0284c7" stop-opacity="0.2"/><stop offset="100%" stop-color="#0284c7" stop-opacity="0.05"/></linearGradient>
    <linearGradient id="cell-inc" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981" stop-opacity="0.25"/><stop offset="100%" stop-color="#10b981" stop-opacity="0.05"/></linearGradient>
    <linearGradient id="cell-target" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.25"/><stop offset="100%" stop-color="#8b5cf6" stop-opacity="0.05"/></linearGradient>
  </defs>
  <text x="410" y="24" text-anchor="middle" font-size="15" font-weight="bold" fill="currentColor">0/1 Knapsack: 2D Recurrence Geometry &amp; 1D Cache Compression Invariant</text>
  <rect x="20" y="45" width="480" height="275" rx="8" fill="none" stroke="#64748b" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="35" y="68" font-size="12" font-weight="bold" fill="#64748b">2D State Grid: dp[i][w]</text>
  <line x1="80" y1="85" x2="480" y2="85" stroke="#64748b" stroke-dasharray="3,3" stroke-opacity="0.4"/>
  <line x1="80" y1="210" x2="480" y2="210" stroke="#64748b" stroke-dasharray="3,3" stroke-opacity="0.4"/>
  <text x="65" y="125" text-anchor="end" font-size="12" font-weight="bold" fill="#64748b">Row i - 1</text>
  <text x="65" y="250" text-anchor="end" font-size="12" font-weight="bold" fill="#8b5cf6">Row i</text>
  <rect x="120" y="95" width="130" height="60" rx="6" fill="url(#cell-inc)" stroke="#10b981" stroke-width="2"/>
  <text x="185" y="120" text-anchor="middle" font-size="12" font-weight="bold" fill="#10b981">dp[i-1][w - w_i]</text>
  <text x="185" y="140" text-anchor="middle" font-size="11" fill="currentColor">Residual Capacity</text>
  <rect x="320" y="95" width="130" height="60" rx="6" fill="url(#cell-prev)" stroke="#0284c7" stroke-width="2"/>
  <text x="385" y="120" text-anchor="middle" font-size="12" font-weight="bold" fill="#0284c7">dp[i-1][w]</text>
  <text x="385" y="140" text-anchor="middle" font-size="11" fill="currentColor">Same Capacity</text>
  <rect x="320" y="220" width="130" height="60" rx="6" fill="url(#cell-target)" stroke="#8b5cf6" stroke-width="2"/>
  <text x="385" y="245" text-anchor="middle" font-size="13" font-weight="bold" fill="#8b5cf6">dp[i][w]</text>
  <text x="385" y="265" text-anchor="middle" font-size="11" fill="currentColor">max(Exclude, Include)</text>
  <path d="M 385 157 L 385 214" stroke="#0284c7" stroke-width="2.5" marker-end="url(#arrow-blue)"/>
  <text x="395" y="188" font-size="10.5" font-weight="bold" fill="#0284c7">Option A: Exclude (+0, w)</text>
  <path d="M 185 157 C 185 195, 310 200, 320 230" fill="none" stroke="#10b981" stroke-width="2.5" marker-end="url(#arrow-green)"/>
  <text x="160" y="195" font-size="10.5" font-weight="bold" fill="#10b981">Option B: Include (+v_i, w - w_i)</text>
  <rect x="525" y="45" width="275" height="275" rx="8" fill="none" stroke="#64748b" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="540" y="68" font-size="12" font-weight="bold" fill="#64748b">1D Rolling Array Compression</text>
  <rect x="545" y="85" width="235" height="100" rx="6" fill="#10b981" fill-opacity="0.08" stroke="#10b981" stroke-width="1.5"/>
  <text x="555" y="105" font-size="11" font-weight="bold" fill="#10b981">&#x2714; Backward Iteration: W &#x2192; w_i</text>
  <text x="555" y="125" font-size="10.5" fill="currentColor">Each item used &#x2264; 1 time (0/1 constraint).</text>
  <text x="555" y="145" font-size="10.5" fill="currentColor">dp[w - w_i] remains from previous row i-1</text>
  <text x="555" y="165" font-size="10.5" font-weight="bold" fill="#10b981">Invariant: Clean single-item state.</text>
  <rect x="545" y="200" width="235" height="105" rx="6" fill="#ef4444" fill-opacity="0.08" stroke="#ef4444" stroke-width="1.5"/>
  <text x="555" y="220" font-size="11" font-weight="bold" fill="#ef4444">&#x2718; Forward Iteration: w_i &#x2192; W</text>
  <text x="555" y="240" font-size="10.5" fill="currentColor">Overwrites dp[w - w_i] with current row i!</text>
  <text x="555" y="260" font-size="10.5" fill="currentColor">Item i can be picked &#x221E; times.</text>
  <text x="555" y="280" font-size="10.5" font-weight="bold" fill="#ef4444">Transforms into Unbounded Knapsack!</text>
</svg>
</div>

---

## 6. Space Optimization: 2D Table to 1D Rolling Buffer

Notice that computing row $i$ relies exclusively on values in row $i-1$. Rows $0 \dots i-2$ are never revisited. This observation allows compressing the table from $\Theta(N \cdot W)$ space to a single array of size $W + 1$.

### The Reverse-Iteration Invariant

When collapsing $dp[i][w]$ into a 1D array $dp[w]$, the capacity iteration order determines problem semantics:

| Capacity Iteration Order | Overwrite Behavior | Semantic Result |
| :--- | :--- | :--- |
| **Ascending ($w = w_i \to W$)** | $dp[w - w_i]$ has already been updated in the current outer loop pass. | **Unbounded Knapsack**: Item $i$ can be selected multiple times. |
| **Descending ($w = W \to w_i$)** | $dp[w - w_i]$ still retains the value from the previous outer loop pass ($i-1$). | **0/1 Knapsack**: Guarantees Item $i$ is used at most once. |

```typescript
/**
 * Computes the 0/1 Knapsack maximum value using a space-optimized 1D array.
 * Time Complexity:  O(N * W)
 * Space Complexity: O(W)
 */
export function knapsack01SpaceOptimized(
  weights: number[],
  values: number[],
  capacity: number
): number {
  const dp = new Array(capacity + 1).fill(0);

  for (let i = 0; i < weights.length; i++) {
    const wt = weights[i];
    const val = values[i];
    // Traverse backwards to preserve previous-row subproblem solutions
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
Given two sequences $S_1$ of length $m$ and $S_2$ of length $n$, find the length of the longest subsequence present in both. A subsequence preserves relative order without requiring contiguity.

### Mathematical Recurrence

Let $dp[i][j]$ represent the length of the LCS between prefixes $S_1[0 \dots i-1]$ and $S_2[0 \dots j-1]$:

$$dp[i][j] = \begin{cases} 
0 & \text{if } i = 0 \text{ or } j = 0 \\
1 + dp[i-1][j-1] & \text{if } S_1[i-1] = S_2[j-1] \\
\max\Big(dp[i-1][j], \, dp[i][j-1]\Big) & \text{if } S_1[i-1] \ne S_2[j-1]
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

#### Solution Reconstruction
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
  - **Pseudo-Polynomial Nature**: The capacity $W$ is a numeric input whose binary encoding length is $k = \lceil \log_2 W \rceil$ bits. Relative to the input size in bits, the runtime is $\Theta(N \cdot 2^k)$, which is **exponential** in the length of $W$. 0/1 Knapsack is weakly NP-complete.
- **LCS**: $\Theta(m \cdot n)$ operations, which is strictly polynomial in terms of input sequence lengths.

### Space Complexity
- **2D Tabulation**: $\Theta(N \cdot W)$ or $\Theta(m \cdot n)$ auxiliary space.
- **Optimized 1D Rolling Buffer**: $\Theta(W)$ auxiliary space for Knapsack, or $\Theta(\min(m, n))$ auxiliary space for LCS length computation.

---

## 9. Common Traps, Edge Cases & Implementation Pitfalls

1. **Integer Overflow in Minimization Recurrences**:
   - In minimization problems such as Coin Change ($dp[w] = \min(dp[w], 1 + dp[w - c])$), initializing unreachable states to `Number.MAX_SAFE_INTEGER` causes signed overflow when evaluating $1 + dp[w - c]$.
   - *Mitigation*: Initialize unreachable states to a sentinel upper bound (e.g., $W + 1$ or `1e9`).

2. **Zero-Indexing vs. DP Table Offset**:
   - Row $i$ in a $1$-indexed DP table corresponds to item $i - 1$ in zero-indexed input arrays `weights` and `values`.
   - *Mitigation*: Standardize on $dp[i]$ representing decisions on the prefix of length $i$, referencing `array[i - 1]`.

3. **Direction of Capacity Iteration in 1D Arrays**:
   - Forward iteration ($0 \to W$) introduces uncontrolled state aliasing, transforming the 0/1 problem into Unbounded Knapsack.
   - *Mitigation*: Strictly enforce reverse iteration ($W \to w_i$) for single-use item constraints.

4. **Continuous State Coordinates**:
   - Dynamic programming tables require discrete, integer-addressable states. Continuous domains must be discretized via scaling or solved via alternative techniques such as branch-and-bound or numerical optimization.

---

## 10. Curated Practice Problems & Real-World Systems Applications

### Real-World Production Systems
- **Version Control (`git diff`)**: Implements Eugene Myers' $\mathcal{O}(ND)$ diff algorithm, a greedy and dynamic programming exploration of the edit graph between two file versions.
- **Relational Query Optimizers**: The System R dynamic programming algorithm optimizes multi-table database join orderings in $\mathcal{O}(3^n)$ time compared to the $\mathcal{O}(n!)$ brute force permutation space.
- **Speech Recognition & Bioinformatics**: The Viterbi algorithm utilizes dynamic programming across Hidden Markov Models (HMMs) to extract the maximum likelihood path of hidden states.

### Standard Practice Roadmap
1. **Coin Change (LeetCode 322)** — Unbounded Knapsack variant with minimization recurrence and sentinel initialization.
2. **Partition Equal Subset Sum (LeetCode 416)** — Reduction to 0/1 Knapsack with target weight capacity $W = \text{TotalSum} / 2$.
3. **Edit Distance / Levenshtein Distance (LeetCode 72)** — 2D prefix DP handling insertion, deletion, and character replacement costs.
4. **Longest Increasing Subsequence (LeetCode 300)** — Transitions from $\mathcal{O}(n^2)$ standard tabulation to $\mathcal{O}(n \log n)$ via patience sorting with binary search.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 14 & 15. MIT Press.
2. **Kleinberg, J., & Tardos, É.** (2006). *Algorithm Design*, Chapter 6: Dynamic Programming. Pearson / Addison-Wesley.
3. **Bellman, R.** (1957). *Dynamic Programming*. Princeton University Press.
