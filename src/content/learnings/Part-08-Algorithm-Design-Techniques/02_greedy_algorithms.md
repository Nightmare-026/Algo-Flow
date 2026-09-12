# 🦅 Part 08: Algorithm Design Techniques — Module 02: The Greedy Paradigm & Greedy vs DP

> **Topics Covered:**  
> 123. The Greedy Paradigm, The Greedy-Choice Property & The Exchange Argument &bull; 132. Greedy vs Dynamic Programming (The Coin Change & Knapsack Dilemmas)

---

# TOPIC 123: THE GREEDY PARADIGM

### 1. Definition
A **Greedy Algorithm** builds up a solution piece-by-piece, always choosing the next piece that offers the **most immediate and local benefit (locally optimal choice)**, with the expectation that this heuristic will lead to a **globally optimal solution**.
- A greedy algorithm **NEVER backtracks or reconsiders past decisions**. Once a choice is made, it is permanent.

---

### 2. The Two Mandatory Mathematical Pillars

An optimization problem can be solved greedily if and only if it satisfies:

1. **The Greedy-Choice Property**: A globally optimal solution can be arrived at by making a locally optimal choice without needing to evaluate the solutions to subproblems.
2. **Optimal Substructure**: An optimal solution to the overall problem contains within it optimal solutions to its subproblems.

---

### 3. How to Prove a Greedy Algorithm is Correct: The Exchange Argument

Proving a greedy algorithm is correct is notoriously subtle. The gold standard proof technique is the **Exchange Argument**:
1. Let $G$ be the solution produced by the Greedy Algorithm.
2. Assume an alternative, hypothetically superior optimal solution $O$ exists.
3. Show that you can gradually modify $O$ by **exchanging** an element in $O$ with an element from $G$ without worsening $O$'s quality.
4. Conclude through induction that $G$ must be just as optimal as $O$, proving $G$ is globally optimal!

---

### 4. Canonical Problem 1: Activity Selection (Interval Scheduling)

**Problem**: Given $n$ activities with start times $S[i]$ and finish times $F[i]$, select the **maximum number of mutually compatible activities** (no two overlapping).

#### The Greedy Choice: Sort by Earliest Finish Time $F[i]$!
- Intuition: Finishing as early as possible frees up the resource for the maximum possible remaining time!

```text
ALGORITHM ActivitySelection(S, F, n)
    Input: Arrays S (start) and F (finish) of n activities
    Output: Maximum count of non-overlapping activities

1.  Sort activities by finish time F ascending: F[0] ≤ F[1] ≤ ... ≤ F[n - 1]
2.  count ← 1
3.  lastFinish ← F[0]           // Select first activity
4.  for i ← 1 to n - 1:
5.      if S[i] ≥ lastFinish:   // Non-overlapping!
6.          count ← count + 1
7.          lastFinish ← F[i]
8.  return count
```

- **Time Complexity**: $\mathbf{\Theta(n \log n)}$ (Dominated by sorting finish times).
- **Auxiliary Space**: $O(1)$.

---

### 5. Canonical Problem 2: Fractional Knapsack

Given items with values $v_i$ and weights $w_i$, and a knapsack of capacity $W$. You can take **fractions** of items. Maximize total value.

#### The Greedy Strategy:
Sort items by their **Value-to-Weight Ratio** ($\rho_i = v_i / w_i$) in descending order!
1. Greedily pack items with the highest $\rho_i$ in their entirety until capacity runs out.
2. For the final item, take the exact fraction that completely fills the remaining capacity.
- **Time Complexity**: $O(n \log n)$.

---
---

# TOPIC 132: GREEDY VS DYNAMIC PROGRAMMING

Greedy algorithms are faster and simpler than Dynamic Programming, but **they frequently produce completely incorrect answers** if the Greedy-Choice Property does not hold mathematically.

---

### Dilemma 1: The Coin Change Counterexample

**Problem**: Make change for 6 cents using the minimum number of coins.

#### Case A: Canonical Denominations (US Currency: 1¢, 5¢, 10¢, 25¢)
- Greedy choice (pick largest coin $\le \text{target}$) is **provably optimal** for canonical currencies.

#### Case B: Non-Canonical Denominations: Coins = $\{ 1¢, \, 3¢, \, 4¢ \}$
- **Greedy Approach for Target = 6¢**:
  - Picks largest coin $\le 6$: picks **4¢** (Remaining = 2¢).
  - Picks largest coin $\le 2$: picks **1¢** (Remaining = 1¢).
  - Picks largest coin $\le 1$: picks **1¢** (Remaining = 0¢).
  - **Greedy Output**: $4 + 1 + 1 = \mathbf{3 \ coins}$! ❌
- **Dynamic Programming Approach**:
  - Evaluates combinations: $3¢ + 3¢ = 6¢$.
  - **Optimal Output**: $\mathbf{2 \ coins}$! ✅

$$\mathbf{Conclusion}: \quad \text{The Greedy-Choice property FAILS for general coin systems. DP is required!}$$

---

### Dilemma 2: Fractional Knapsack vs 0/1 Knapsack

```text
KNAPSACK CAPACITY W = 50
Item 1: Value = $60,  Weight = 10 kg  (Ratio = $6 / kg)
Item 2: Value = $100, Weight = 20 kg  (Ratio = $5 / kg)
Item 3: Value = $120, Weight = 30 kg  (Ratio = $4 / kg)

FRACTIONAL KNAPSACK: (Items can be cut)
Greedy packs: All Item 1 (10kg, $60) + All Item 2 (20kg, $100) + 2/3 of Item 3 (20kg, $80).
Total Value = $240. (GREEDY IS OPTIMAL! ✅)

0/1 KNAPSACK: (Items are atomic; must take ALL or NONE)
• Greedy by Ratio: Packs Item 1 (10kg) + Item 2 (20kg). Leaves 20kg empty.
  Total Value = $60 + $100 = $160. ❌
• Optimal Solution: Packs Item 2 (20kg) + Item 3 (30kg). Exact 50kg!
  Total Value = $100 + $120 = $220! ✅ (DP IS REQUIRED!)
```

---

### Master Comparison: Greedy vs Dynamic Programming

| Architectural Dimension | Greedy Paradigm | Dynamic Programming (DP) |
| :--- | :--- | :--- |
| **Choice Commitment** | Commits irrevocably to local choice at each step; **never backtracks** | Evaluates **all possibilities** at each step before picking optimal |
| **Subproblem Dependency**| Solves subproblems from top-down or bottom-up sequentially | Solves **overlapping subproblems** via memoization or tabulation |
| **Proof of Correctness** | Requires formal proof (Exchange Argument); easily yields bugs | Self-proving via exhaustive optimal substructure induction |
| **Efficiency** | Typically faster: $O(n \log n)$ or $O(n)$ | Slower: Polynomial ($O(n^2), O(n \cdot W)$) |
| **Applicability** | Restricted to problems with matroid/greedy properties | Broadly applicable to almost all optimization problems |

---

## 🔁 Module 02 Summary & Key Takeaways

1. **Greedy Algorithms** make local optimal choices without backtracking; correct *only* when the problem satisfies the Greedy-Choice Property.
2. Prove greedy correctness using the **Exchange Argument**.
3. If taking an item restricts future choices (as in 0/1 Knapsack or non-canonical Coin Change), **Greedy fails and Dynamic Programming is mandatory**.

---
[⬅️ Previous: Module 01 — Brute Force & Divide and Conquer](file:///d:/DSA/Part-08-Algorithm-Design-Techniques/01_brute_force_and_divide_conquer.md) | [Next: Module 03 — Backtracking ➡️](file:///d:/DSA/Part-08-Algorithm-Design-Techniques/03_backtracking.md)
