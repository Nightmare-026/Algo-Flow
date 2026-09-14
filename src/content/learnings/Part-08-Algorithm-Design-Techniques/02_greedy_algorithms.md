# Part 08: Algorithm Design Techniques — Module 02: The Greedy Paradigm & Greedy vs DP

> **Topics Covered:**  
> 123. The Greedy Paradigm, The Greedy-Choice Property & The Exchange Argument &bull; 132. Greedy vs Dynamic Programming (The Coin Change & Knapsack Dilemmas)

---

## Assessable Learning Objectives

Upon completing this chapter, you will be able to:
1. **Formulate Greedy Criteria**: Distinguish between the Greedy-Choice Property and Optimal Substructure with mathematical precision.
2. **Execute the Exchange Argument**: Construct formal mathematical induction proofs establishing that a greedy selection matches or exceeds any hypothetical optimal solution.
3. **Trace Interval Scheduling**: Execute the activity selection algorithm step-by-step on concrete overlapping intervals using early finish-time ordering.
4. **Identify Greedy Failure Modes**: Prove through counterexamples (non-canonical coin denominations, 0/1 Knapsack) where greedy heuristics fail and dynamic programming becomes mandatory.

---

# TOPIC 123: THE GREEDY PARADIGM

### 1. Definition & Operational Mechanics

A **Greedy Algorithm** constructs a candidate solution incrementally through a sequence of local choices. At each decision point, the algorithm commits to the choice that appears best at that exact moment (**locally optimal choice**), without reconsidering earlier choices or evaluating all downstream subproblems.

$$\text{Decision}(t) = \arg \max_{c \in \text{Candidates}(t)} \text{LocalHeuristic}(c)$$

Key characteristics:
- **Irrevocability**: Once a choice is made, it is permanent. The algorithm never backtracks to explore alternative branches.
- **Top-Down Progression**: Subproblem reduction occurs immediately after each greedy choice is made.

---

### 2. The Two Mandatory Mathematical Conditions

A greedy strategy provably finds a global optimum if and only if the problem exhibits both:

1. **Greedy-Choice Property**: A globally optimal solution can be assembled by making locally optimal (greedy) choices without consulting downstream subproblem solutions.
2. **Optimal Substructure**: An optimal solution to the instance contains within it optimal solutions to the resulting subproblems:
$$\text{OPT}(S) = \text{Choice}^* \cup \text{OPT}(S \setminus \{ \text{Choice}^* \})$$

---

### 3. Formal Mathematical Proof: The Exchange Argument

The standard rigorous method for proving greedy correctness is the **Exchange Argument**. We establish that any hypothetical optimal solution can be transformed into the greedy solution step-by-step without degrading its objective value.

#### Theorem: Activity Selection (Interval Scheduling)
Given $n$ intervals with start times $S[i]$ and finish times $F[i]$, selecting activities in ascending order of finish time $F[i]$ yields a schedule of maximum possible cardinality.

#### Inductive Proof via Exchange:
Let $G = \{g_1, g_2, \dots, g_k\}$ be the set of activities selected by the greedy algorithm, ordered by finish time: $F[g_1] \le F[g_2] \le \dots \le F[g_k]$.  
Let $O = \{o_1, o_2, \dots, o_m\}$ be an arbitrary optimal solution, ordered by finish time: $F[o_1] \le F[o_2] \le \dots \le F[o_m]$. We must prove $k = m$.

1. **Base Case ($r = 1$)**: By construction, the greedy algorithm selects activity $g_1$ such that $F[g_1] = \min_{i} F[i]$.  
   Therefore, $F[g_1] \le F[o_1]$.  
   Construct a modified solution $O' = (O \setminus \{o_1\}) \cup \{g_1\}$. Since $F[g_1] \le F[o_1]$ and $F[o_1] \le S[o_2]$, activity $g_1$ does not conflict with $o_2$. Thus $O'$ is valid and $|O'| = |O| = m$.
2. **Inductive Step**: Assume for induction that there exists an optimal solution whose first $r$ activities match $G$: $\{g_1, g_2, \dots, g_r, o_{r+1}, \dots, o_m\}$.  
   Because greedy selects $g_{r+1}$ as the activity with the earliest finish time among all activities starting after $F[g_r]$, we have $F[g_{r+1}] \le F[o_{r+1}]$.  
   Substituting $g_{r+1}$ in place of $o_{r+1}$ leaves activities $o_{r+2}, \dots, o_m$ valid because $F[g_{r+1}] \le F[o_{r+1}] \le S[o_{r+2}]$.
3. **Conclusion**: By induction, the entire set $G$ can replace the first $k$ elements of an optimal solution. If $m > k$, there would exist an activity $o_{k+1}$ compatible with $g_k$, contradicting the termination condition of the greedy algorithm. Hence, $k = m$, and $G$ is globally optimal. $\blacksquare$

---

### 4. Step-by-Step Worked Dry Run: Activity Selection

Consider $n = 6$ activities with the following start and finish intervals:
- $A_1: [1, 4]$, $A_2: [3, 5]$, $A_3: [0, 6]$, $A_4: [5, 7]$, $A_5: [3, 9]$, $A_6: [5, 9]$, $A_7: [6, 10]$, $A_8: [8, 11]$

#### Execution Trace Table:

| Order by $F[i]$ | Activity | Interval $[S_i, F_i]$ | Last Finish Time | Conflict Condition ($S_i \ge \text{lastFinish}$) | Selection Decision | Current Selected Set |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | $A_1$ | $[1, 4]$ | $0$ (Initial) | $1 \ge 0 \implies \text{True}$ | **SELECT** | $\{ A_1 \}$ |
| **2** | $A_2$ | $[3, 5]$ | $4$ | $3 \ge 4 \implies \text{False}$ | **REJECT (Overlap)** | $\{ A_1 \}$ |
| **3** | $A_3$ | $[0, 6]$ | $4$ | $0 \ge 4 \implies \text{False}$ | **REJECT (Overlap)** | $\{ A_1 \}$ |
| **4** | $A_4$ | $[5, 7]$ | $4$ | $5 \ge 4 \implies \text{True}$ | **SELECT** | $\{ A_1, A_4 \}$ |
| **5** | $A_5$ | $[3, 9]$ | $7$ | $3 \ge 7 \implies \text{False}$ | **REJECT (Overlap)** | $\{ A_1, A_4 \}$ |
| **6** | $A_6$ | $[5, 9]$ | $7$ | $5 \ge 7 \implies \text{False}$ | **REJECT (Overlap)** | $\{ A_1, A_4 \}$ |
| **7** | $A_7$ | $[6, 10]$ | $7$ | $6 \ge 7 \implies \text{False}$ | **REJECT (Overlap)** | $\{ A_1, A_4 \}$ |
| **8** | $A_8$ | $[8, 11]$ | $7$ | $8 \ge 7 \implies \text{True}$ | **SELECT** | $\{ A_1, A_4, A_8 \}$ |

**Result**: Maximum compatible set cardinality is $3$: $\{A_1, A_4, A_8\}$. Overall runtime is dominated by sorting: $O(n \log n)$.

---

### 5. Step-by-Step Worked Dry Run: Fractional Knapsack

Given knapsack capacity $W = 50\text{ kg}$ and $4$ available items:
- Item 1: $v_1 = 60, w_1 = 10 \implies \rho_1 = 6.0\text{ \$/kg}$
- Item 2: $v_2 = 100, w_2 = 20 \implies \rho_2 = 5.0\text{ \$/kg}$
- Item 3: $v_3 = 120, w_3 = 30 \implies \rho_3 = 4.0\text{ \$/kg}$
- Item 4: $v_4 = 50, w_4 = 25 \implies \rho_4 = 2.0\text{ \$/kg}$

#### Execution Trace Table:

| Rank | Item | Value ($v_i$) | Weight ($w_i$) | Density $\rho_i = v_i / w_i$ | Remaining Capacity | Fraction Taken | Value Accrued | Total Accumulated Value |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **1** | Item 1 | $\$60$ | $10\text{ kg}$ | $\$6.00 / \text{kg}$ | $50\text{ kg}$ | $1.0$ (Full) | $\$60$ | $\$60$ |
| **2** | Item 2 | $\$100$ | $20\text{ kg}$ | $\$5.00 / \text{kg}$ | $40\text{ kg}$ | $1.0$ (Full) | $\$100$ | $\$160$ |
| **3** | Item 3 | $\$120$ | $30\text{ kg}$ | $\$4.00 / \text{kg}$ | $20\text{ kg}$ | $20/30 = 2/3$ | $\frac{2}{3} \times \$120 = \$80$ | **$\$240$** |
| **4** | Item 4 | $\$50$ | $25\text{ kg}$ | $\$2.00 / \text{kg}$ | $0\text{ kg}$ | $0.0$ (Skipped) | $\$0$ | $\$240$ |

**Conclusion**: Greedily sorting by value density yields maximum possible profit of $\$240$ in $O(n \log n)$ time.

---

# TOPIC 132: GREEDY VS DYNAMIC PROGRAMMING

While greedy algorithms are fast, they produce incorrect results whenever the Greedy-Choice Property fails.

### Dilemma 1: The Coin Change Counterexample

Given coin denominations $C$ and target value $V$:

| Coin System | Target $V$ | Greedy Strategy (Largest Coin First) | Optimal Strategy (Dynamic Programming) | Greedy Status |
| :--- | :---: | :--- | :--- | :---: |
| **US Canonical** $\{1, 5, 10, 25\}$ | $30\text{ cents}$ | $25 + 5$ (2 coins) | $25 + 5$ (2 coins) | **OPTIMAL** |
| **Non-Canonical** $\{1, 3, 4\}$ | $6\text{ cents}$ | $4 + 1 + 1$ (**3 coins**) | $3 + 3$ (**2 coins**) | **FAILED** |
| **Arbitrary** $\{1, 7, 10\}$ | $14\text{ cents}$ | $10 + 1 + 1 + 1 + 1$ (**5 coins**) | $7 + 7$ (**2 coins**) | **FAILED** |

**Theoretical Insight**: A coin system is canonical (greedy-compatible) if and only if the change-making problem forms a matroid or satisfies Pearson's polynomial-time test (1994). For arbitrary coin systems, the problem exhibits optimal substructure with overlapping subproblems, requiring $O(n \cdot V)$ Dynamic Programming.

---

### Architectural Trade-Off Matrix: Greedy vs Dynamic Programming

| Dimension | Greedy Paradigm | Dynamic Programming (DP) |
| :--- | :--- | :--- |
| **Decision Policy** | Irrevocable local choice at each step; **never backtracks** | Evaluates all valid options per state before committing |
| **Subproblem Structure** | Solves independent subproblems sequentially | Solves **overlapping subproblems** via memoization or tabulation |
| **Proof Burden** | High (Exchange argument or matroid isomorphism required) | Moderate (Verification of optimal substructure formulation) |
| **Time Complexity** | Typically $O(n \log n)$ (sorting) or $O(n)$ | Polynomial $O(n^2), O(n^3)$ or pseudo-polynomial $O(n \cdot W)$ |
| **Space Complexity** | Often $O(1)$ auxiliary space | Requires memory for state tables ($O(n), O(n \cdot W)$) |
| **Failure Mode** | Returns suboptimal or invalid solutions if greedy property fails | Always globally optimal provided recurrence is correct |

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 16: Greedy Algorithms. MIT Press.
2. **Edmonds, J.** (1971). Matroids and the greedy algorithm. *Mathematical Programming*, 1(1), 127-136.
3. **Kleinberg, J., & Tardos, É.** (2006). *Algorithm Design*, Chapter 4: Greedy Algorithms. Pearson / Addison-Wesley.
4. **Pearson, D.** (1994). A polynomial-time algorithm for the change-making problem. *Operations Research Letters*, 33(3), 231-234.
