# Part 08: Algorithm Design Techniques — Module 02: The Greedy Paradigm & Greedy vs DP

> Greedy algorithms construct optimal solutions through a sequence of irrevocable local choices, bypassing exhaustive search and subproblem tabulation. Guided by the Greedy-Choice Property and validated through formal exchange arguments, greedy strategies deliver high-speed $O(n \log n)$ solutions for interval scheduling, minimum spanning trees, and fractional resource allocation.

---

## 1. Executive Summary & Learning Objectives

The Greedy Paradigm builds candidate solutions incrementally by selecting the locally optimal choice at each step without backtracking or exploring alternative branches. Pioneered formally through Jack Edmonds' matroid theory (1971), greedy correctness requires establishing two mathematical conditions: the Greedy-Choice Property and Optimal Substructure.

By the end of this chapter, you will be able to:
1. **Formulate** the Greedy-Choice Property and Optimal Substructure with mathematical rigor.
2. **Execute** the Exchange Argument to prove by induction that a greedy sequence matches or exceeds any hypothetical optimal solution.
3. **Implement** and trace Interval Scheduling (Activity Selection) and Fractional Knapsack algorithms in $O(n \log n)$ time.
4. **Identify** greedy failure modes through counterexamples (non-canonical coin systems, 0/1 Knapsack) that mandate Dynamic Programming.
5. **Evaluate** trade-offs between greedy heuristics ($O(n \log n)$ speed, $O(1)$ memory) and dynamic programming ($O(n \cdot W)$ optimality guarantees).

---

## 2. The Greedy Paradigm & Theoretical Foundations

A **Greedy Algorithm** constructs a candidate solution incrementally through a sequence of locally optimal choices without reconsidering earlier choices or evaluating downstream branches:

$$\text{Decision}(t) = \arg \max_{c \in \text{Candidates}(t)} \text{LocalHeuristic}(c)$$

### Structural Characteristics
- **Irrevocability**: Once a choice is made, it is permanent. The algorithm never backtracks to reconsider alternatives.
- **Top-Down Reduction**: Subproblem reduction occurs immediately after each greedy choice is made.

### The Two Mandatory Mathematical Conditions

| Condition | Formal Requirement | Analytical Significance |
| :--- | :--- | :--- |
| **1. Greedy-Choice Property** | A globally optimal solution can be assembled by making locally optimal (greedy) choices without consulting future subproblems. | Eliminates the need to evaluate multiple branching paths. |
| **2. Optimal Substructure** | An optimal solution to the instance contains within it optimal solutions to resulting subproblems: $\text{OPT}(S) = \text{Choice}^* \cup \text{OPT}(S \setminus \{\text{Choice}^*\})$. | Ensures subproblems can be solved independently. |

---

## 3. Mathematical Proof: The Exchange Argument

The standard rigorous method for proving greedy correctness is the **Exchange Argument**: we establish that any hypothetical optimal solution can be transformed into the greedy solution step-by-step without degrading objective value.

### Theorem: Interval Scheduling (Activity Selection)
*Given $n$ intervals with start times $S[i]$ and finish times $F[i]$, selecting activities in ascending order of finish time $F[i]$ produces a schedule of maximum possible cardinality.*

#### Inductive Proof via Exchange:
Let $G = \{g_1, g_2, \dots, g_k\}$ be the set of activities selected by the greedy algorithm, ordered by finish time: $F[g_1] \le F[g_2] \le \dots \le F[g_k]$.  
Let $O = \{o_1, o_2, \dots, o_m\}$ be an arbitrary optimal solution, ordered by finish time: $F[o_1] \le F[o_2] \le \dots \le F[o_m]$. We must prove $k = m$.

1. **Base Case ($r = 1$)**: By construction, greedy selects $g_1$ such that $F[g_1] = \min_{i} F[i]$.  
   Therefore, $F[g_1] \le F[o_1]$.  
   Construct modified solution $O' = (O \setminus \{o_1\}) \cup \{g_1\}$. Since $F[g_1] \le F[o_1] \le S[o_2]$, activity $g_1$ does not conflict with $o_2$. Thus $O'$ is valid and $|O'| = |O| = m$.
2. **Inductive Step**: Assume there exists an optimal solution whose first $r$ activities match $G$: $\{g_1, g_2, \dots, g_r, o_{r+1}, \dots, o_m\}$.  
   Because greedy selects $g_{r+1}$ as the activity with earliest finish time starting after $F[g_r]$, we have $F[g_{r+1}] \le F[o_{r+1}]$.  
   Substituting $g_{r+1}$ in place of $o_{r+1}$ leaves activities $o_{r+2}, \dots, o_m$ valid because $F[g_{r+1}] \le F[o_{r+1}] \le S[o_{r+2}]$.
3. **Conclusion**: By induction, the entire set $G$ can replace the first $k$ elements of an optimal solution. If $m > k$, there would exist an activity $o_{k+1}$ compatible with $g_k$, contradicting greedy termination. Hence, $k = m$, and $G$ is globally optimal. $\blacksquare$

---

## 4. Step-by-Step Worked Dry Run: Activity Selection

Consider $n = 8$ activities sorted by ascending finish times:
- $A_1: [1, 4]$, $A_2: [3, 5]$, $A_3: [0, 6]$, $A_4: [5, 7]$, $A_5: [3, 9]$, $A_6: [5, 9]$, $A_7: [6, 10]$, $A_8: [8, 11]$

| Order by $F[i]$ | Activity | Interval $[S_i, F_i]$ | Last Finish Time | Conflict Test ($S_i \ge \text{lastFinish}$) | Selection Decision | Active Set |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | $A_1$ | $[1, 4]$ | $0$ (Init) | $1 \ge 0 \implies \text{True}$ | **SELECT** | $\{ A_1 \}$ |
| **2** | $A_2$ | $[3, 5]$ | $4$ | $3 \ge 4 \implies \text{False}$ | **REJECT (Overlap)** | $\{ A_1 \}$ |
| **3** | $A_3$ | $[0, 6]$ | $4$ | $0 \ge 4 \implies \text{False}$ | **REJECT (Overlap)** | $\{ A_1 \}$ |
| **4** | $A_4$ | $[5, 7]$ | $4$ | $5 \ge 4 \implies \text{True}$ | **SELECT** | $\{ A_1, A_4 \}$ |
| **5** | $A_5$ | $[3, 9]$ | $7$ | $3 \ge 7 \implies \text{False}$ | **REJECT (Overlap)** | $\{ A_1, A_4 \}$ |
| **6** | $A_6$ | $[5, 9]$ | $7$ | $5 \ge 7 \implies \text{False}$ | **REJECT (Overlap)** | $\{ A_1, A_4 \}$ |
| **7** | $A_7$ | $[6, 10]$ | $7$ | $6 \ge 7 \implies \text{False}$ | **REJECT (Overlap)** | $\{ A_1, A_4 \}$ |
| **8** | $A_8$ | $[8, 11]$ | $7$ | $8 \ge 7 \implies \text{True}$ | **SELECT** | $\{ A_1, A_4, A_8 \}$ |

**Result**: Maximum compatible set cardinality is $3$: $\{A_1, A_4, A_8\}$. Runtime: $\Theta(n \log n)$ for initial sorting.

```typescript
export interface Interval {
  id: number;
  start: number;
  finish: number;
}

export function selectActivities(activities: Interval[]): Interval[] {
  // Sort by ascending finish times - O(n log n)
  const sorted = [...activities].sort((a, b) => a.finish - b.finish);
  const selected: Interval[] = [];
  let lastFinish = -Infinity;

  for (const act of sorted) {
    if (act.start >= lastFinish) {
      selected.push(act);
      lastFinish = act.finish;
    }
  }

  return selected;
}
```

---

## 5. Step-by-Step Worked Dry Run: Fractional Knapsack

Given knapsack capacity $W = 50\text{ kg}$ and 4 items:
- Item 1: $v_1 = 60, w_1 = 10 \implies \rho_1 = 6.0\text{ \$/kg}$
- Item 2: $v_2 = 100, w_2 = 20 \implies \rho_2 = 5.0\text{ \$/kg}$
- Item 3: $v_3 = 120, w_3 = 30 \implies \rho_3 = 4.0\text{ \$/kg}$
- Item 4: $v_4 = 50, w_4 = 25 \implies \rho_4 = 2.0\text{ \$/kg}$

| Density Rank | Item | Value ($v_i$) | Weight ($w_i$) | Density $\rho_i = v_i / w_i$ | Capacity Left | Fraction Taken | Value Accrued | Cumulative Profit |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | Item 1 | $\$60$ | $10\text{ kg}$ | $\$6.00 / \text{kg}$ | $50\text{ kg}$ | $1.0$ (Full) | $\$60$ | $\$60$ |
| **2** | Item 2 | $\$100$ | $20\text{ kg}$ | $\$5.00 / \text{kg}$ | $40\text{ kg}$ | $1.0$ (Full) | $\$100$ | $\$160$ |
| **3** | Item 3 | $\$120$ | $30\text{ kg}$ | $\$4.00 / \text{kg}$ | $20\text{ kg}$ | $20/30 = 2/3$ | $\frac{2}{3} \times \$120 = \$80$ | **$\$240$** |
| **4** | Item 4 | $\$50$ | $25\text{ kg}$ | $\$2.00 / \text{kg}$ | $0\text{ kg}$ | $0.0$ (Skipped) | $\$0$ | $\$240$ |

**Conclusion**: Greedily sorting by value density yields maximum possible profit of $\$240$ in $O(n \log n)$ time.

---

## 6. Greedy vs. Dynamic Programming

Whenever the Greedy-Choice Property fails, greedy algorithms yield suboptimal or incorrect results.

### The Coin Change Counterexample

Given coin denominations $C$ and target value $V$:

| Coin System | Target $V$ | Greedy Strategy (Largest Coin First) | Optimal Strategy (Dynamic Programming) | Greedy Status |
| :--- | :---: | :--- | :--- | :---: |
| **US Canonical** $\{1, 5, 10, 25\}$ | $30\text{ cents}$ | $25 + 5$ (2 coins) | $25 + 5$ (2 coins) | **OPTIMAL** |
| **Non-Canonical** $\{1, 3, 4\}$ | $6\text{ cents}$ | $4 + 1 + 1$ (**3 coins**) | $3 + 3$ (**2 coins**) | **FAILED** |
| **Arbitrary** $\{1, 7, 10\}$ | $14\text{ cents}$ | $10 + 1 + 1 + 1 + 1$ (**5 coins**) | $7 + 7$ (**2 coins**) | **FAILED** |

*Matroid Theory Insight (Pearson, 1994):* A coin system is canonical if and only if the change-making problem satisfies Pearson's $O(n^3)$ algebraic test. Arbitrary coin systems lack the greedy-choice property and require $O(n \cdot V)$ Dynamic Programming.

---

## 7. Master Comparison: Greedy vs. Dynamic Programming

| Dimension | Greedy Paradigm | Dynamic Programming (DP) |
| :--- | :--- | :--- |
| **Decision Policy** | Irrevocable local choice at each step; **never backtracks** | Evaluates all valid subproblem transitions before committing |
| **Subproblem Structure** | Solves independent subproblems sequentially | Solves **overlapping subproblems** via memoization or tabulation |
| **Proof Burden** | High (Exchange argument or matroid isomorphism required) | Moderate (Verification of optimal substructure recurrence) |
| **Time Complexity** | Typically $O(n \log n)$ (sorting) or $O(n)$ | Polynomial $O(n^2), O(n^3)$ or pseudo-polynomial $O(n \cdot W)$ |
| **Space Complexity** | Typically $O(1)$ auxiliary memory | Requires memory for state tables ($O(n), O(n \cdot W)$) |
| **Failure Mode** | Produces suboptimal solutions if greedy-choice property fails | Guaranteed globally optimal provided recurrence is sound |

---

## 8. Common Traps, Edge Cases & Implementation Pitfalls

1. **Applying Greedy to 0/1 Knapsack**:
   - Greedily sorting by value density works for *fractional* knapsack, but fails catastrophically for 0/1 knapsack where items cannot be divided. 0/1 knapsack requires pseudo-polynomial DP.
2. **Sorting by Start Time in Interval Scheduling**:
   - Selecting activities by earliest start time fails (e.g., an activity starting at $0$ spanning until $100$ would block multiple shorter activities). Always sort by **earliest finish time**.
3. **Floating-Point Density Inaccuracy**:
   - In fractional knapsack, comparing density using division `v1 / w1 < v2 / w2` induces IEEE-754 precision errors. Compare using cross-multiplication: `v1 * w2 < v2 * w1`.

---

## 9. Real-World Applications & Practice Problems

### Production Systems
- **Huffman Coding (Data Compression)**: Greedily merges the two least frequent character trees to construct optimal prefix codes (gzip, JPEG).
- **Network Routing Protocols (OSPF / Prim's MST)**: Dijkstra and Prim greedily extend shortest routes and minimum spanning connections.
- **CPU Task Schedulers (Earliest Deadline First / EDF)**: Schedules real-time processes greedily by closest deadline to guarantee optimal schedulability on uniprocessors.

### Practice Problems
1. **Non-overlapping Intervals (LeetCode 435)** — Activity selection greedy finish-time ordering.
2. **Jump Game (LeetCode 55)** — Greedy reachability tracking in $O(n)$ time.
3. **Gas Station (LeetCode 134)** — Greedy circular tour validation in single pass.

---

## 10. References & Academic Attribution

1. **Edmonds, J.** (1971). Matroids and the greedy algorithm. *Mathematical Programming*, 1(1), 127–136.
2. **Pearson, D.** (1994). A polynomial-time algorithm for the change-making problem. *Operations Research Letters*, 33(3), 231–234.
3. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 15 (Greedy Algorithms). MIT Press.
4. **Kleinberg, J., & Tardos, É.** (2006). *Algorithm Design*, Chapter 4 (Greedy Algorithms). Pearson.
