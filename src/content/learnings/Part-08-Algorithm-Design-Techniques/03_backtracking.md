# 🔙 Part 08: Algorithm Design Techniques — Module 03: Backtracking & State Space Trees

> **Topics Covered:**  
> 124. Backtracking Paradigm, State Space Trees & The "Choose-Explore-Unchoose" Blueprint &bull; 133. Backtracking vs Brute Force vs Branch and Bound

---

# TOPIC 124: THE BACKTRACKING PARADIGM

### 1. Definition
**Backtracking** is a refined algorithmic technique for solving constraint satisfaction and combinatorial search problems by building candidates incrementally. As soon as the algorithm determines that a partial candidate $c$ **cannot possibly be extended to a valid solution**, it immediately abandons (prunes) $c$ and **backtracks** to the parent decision point to explore alternate branches.

---

### 2. The State Space Tree & Pruning (Bounding Functions)
The set of all possible partial candidates forms a virtual **State Space Tree**:
- **Brute Force**: Visited all $N!$ or $2^N$ leaves of the entire tree.
- **Backtracking**: Employs a **Bounding (Pruning) Function** to chop off entire subtrees at the root as soon as a constraint violation is detected!

```text
STATE SPACE TREE WITH PRUNING:
                            [ Root Decision ]
                           /        |        \
                      Choice A   Choice B   Choice C
                      /      \      │
                   A1        A2   Pruned! ◄── Constraint violated! Subtree of 10⁶
                  /  \                  candidates completely skipped in O(1)!
             Solution Dead End
```

---

### 3. The Universal Backtracking 3-Step Template: "Choose — Explore — Unchoose"

Every backtracking algorithm in computer science adheres to this strict structural template:

```text
ALGORITHM Backtrack(state, choices)
1.  if IsSolution(state):
2.      RecordSolution(state)
3.      return
4.  for each choice in AvailableChoices(state):
5.      if IsValid(choice, state):       // 🛡️ PRUNING / BOUNDING CHECK
6.          // 1. CHOOSE
7.          MakeChoice(state, choice)
8.          // 2. EXPLORE
9.          Backtrack(state, choices)
10.         // 3. UNCHOOSE (BACKTRACK)
11.         UndoChoice(state, choice)    // ⚠️ RESTORE ORIGINAL STATE!
```

---

### 4. Canonical Problem: The N-Queens Problem

**Problem**: Place $N$ chess queens on an $N \times N$ chessboard such that no two queens attack each other (no two share the same row, column, or diagonal).

```text
4-QUEENS SOLUTION BOARD:
  Row 0:   .  Q  .  .   (Queen at Col 1)
  Row 1:   .  .  .  Q   (Queen at Col 3)
  Row 2:   Q  .  .  .   (Queen at Col 0)
  Row 3:   .  .  Q  .   (Queen at Col 2)
```

#### Fast $O(1)$ Diagonal Pruning via Hash Sets:
- Columns: `colSet`
- Main Diagonals ($\backslash$): Row and Col difference is constant $\implies (\text{row} - \text{col})$
- Anti-Diagonals ($/$): Row and Col sum is constant $\implies (\text{row} + \text{col})$

```text
ALGORITHM SolveNQueens(row, n, cols, diag1, diag2, board):
1.  if row = n:
2.      RecordBoard(board)
3.      return
4.  for col ← 0 to n - 1:
5.      d1 ← row - col
6.      d2 ← row + col
7.      // Check if square is under attack (Pruning!)
8.      if col in cols or d1 in diag1 or d2 in diag2:
9.          continue
10.     // 1. CHOOSE
11.     cols.Add(col), diag1.Add(d1), diag2.Add(d2), board[row][col] ← 'Q'
12.     // 2. EXPLORE
13.     SolveNQueens(row + 1, n, cols, diag1, diag2, board)
14.     // 3. UNCHOOSE
15.     cols.Remove(col), diag1.Remove(d1), diag2.Remove(d2), board[row][col] ← '.'
```

---
---

# TOPIC 133: BACKTRACKING VS BRUTE FORCE VS BRANCH & BOUND

Understanding when to apply these three search paradigms is a hallmark of senior engineering:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SEARCH PARADIGM SPECTRUM                          │
└─────────────────────────────────────────────────────────────────────────────┘

BRUTE FORCE                    BACKTRACKING                   BRANCH & BOUND
─────────────────────────────────────────────────────────────────────────────
• Exhaustive blind search      • Depth-First Search (DFS)     • Breadth-First / Best-First
• Visits EVERY leaf node       • Prunes invalid branches      • Uses priority queue & bounds
• Unusable for n > 20          • Best for Decision Problems   • Best for Optimization (Min/Max)
```

### Detailed Feature Comparison

| Dimension | Brute Force | Backtracking | Branch and Bound |
| :--- | :--- | :--- | :--- |
| **Search Strategy** | Unconstrained enumeration | **Depth-First Search (DFS)** with recursion | **Breadth-First Search (BFS)** with Priority Queue |
| **Pruning Mechanism**| None (evaluates all leaves) | Bounding predicate checks validity | Computes **upper/lower mathematical bounds** |
| **State Tree Memory**| $O(1)$ or $O(n)$ | $\mathbf{O(\text{Tree Depth})}$ stack space | Can consume **exponential memory** (stores frontier) |
| **Typical Problem Type**| Verification, tiny inputs | **Constraint Satisfaction** (Sudoku, N-Queens, Subsets) | **Global Optimization** (0/1 Knapsack, TSP, Integer LP) |
| **Termination** | Scans until completion | Stops at first valid solution or finds all | Discards branches whose bound is worse than best so far |

---

## 🔁 Module 03 Summary & Key Takeaways

1. **Backtracking** prunes impossible subtrees via bounding conditions, saving exponential work.
2. The core template is always: **Choose $\to$ Explore $\to$ Unchoose (Undo)**.
3. In **N-Queens**, track column and diagonal conflicts in $O(1)$ using row-col difference and row+col sum sets.
4. Use **Backtracking** for constraint satisfaction (DFS); use **Branch & Bound** for global optimization problems (Best-First Search).

---
[⬅️ Previous: Module 02 — Greedy Algorithms](file:///d:/DSA/Part-08-Algorithm-Design-Techniques/02_greedy_algorithms.md) | [Next: Module 04 — Dynamic Programming ➡️](file:///d:/DSA/Part-08-Algorithm-Design-Techniques/04_dynamic_programming.md)
