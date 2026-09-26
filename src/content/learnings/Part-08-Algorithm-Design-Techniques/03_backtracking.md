# Part 08: Algorithm Design Techniques — Module 03: Backtracking & State Space Trees

> Backtracking systematically explores combinatorial state space trees, assembling candidate solutions component-by-component and pruning dead-end branches the instant constraints fail. Grounded in the universal Choose-Explore-Unchoose lifecycle and augmented by bitwise bounding functions, backtracking solves NP-hard constraint satisfaction problems with maximum pruning efficiency.

---

## 1. Executive Summary & Learning Objectives

Formulated by D. H. Lehmer in the 1950s and formalized by Solomon W. Golomb and Leonard D. Baumert in 1965, Backtracking performs an informed Depth-First Search over a virtual State Space Tree. By evaluating problem constraints at each partial state vector, non-viable subtrees are pruned in $O(1)$ time, avoiding the catastrophic combinatorial explosion of brute-force enumeration.

By the end of this chapter, you will be able to:

1. **Model** constraint satisfaction problems as virtual State Space Trees with decision vertices, branching edges, and terminal leaves.
2. **Implement** the universal Choose-Explore-Unchoose lifecycle with defensive copying and state-restoration invariants.
3. **Formulate** $O(1)$ bitwise bounding functions (column and diagonal bitmasks) to prune invalid subtrees immediately.
4. **Trace** the $N$-Queens decision matrix step-by-step, recording conflict checks, dead ends, and backtracking events.
5. **Contrast** Backtracking, Brute Force, and Branch-and-Bound across traversal strategies, pruning mechanisms, and memory profiles.

---

## 2. The Backtracking Paradigm & State Space Trees

**Backtracking** incrementally constructs candidate solutions $(x_1, x_2, \dots, x_k)$ along a virtual **State Space Tree**:

$$ \text{Search}(u) = \begin{cases}
\text{RecordSolution}(u) & \text{if } \text{IsComplete}(u) \\
\text{PruneBranch}(u) & \text{if } \neg \text{Feasible}(u) \\
\bigcup_{c \in \text{Children}(u)} \text{Search}(c) & \text{otherwise}
\end{cases}$$

### State Space Tree Decision Dynamics

| Tree Level | Search Action | Structural Meaning | Pruning Action |
| :---: | :--- | :--- | :--- |
| **Root (Level 0)** | Initial Empty State $\emptyset$ | Zero decision components assigned | Evaluates available choices for variable $x_1$ |
| **Level $k$** | Partial Solution $(x_1, \dots, x_k)$ | $k$ decision components assigned | If constraint violated $\implies$ **Prune entire subtree in $O(1)$** |
| **Leaves (Level $n$)** | Completed Candidate Vector | All variables assigned | If all constraints hold $\implies$ **Record Solution** |

---

## 3. The Universal Choose — Explore — Unchoose Blueprint

Every valid backtracking implementation adheres strictly to this state-restoration lifecycle:

```typescript
export function backtrack<T, S>(
  state: S,
  depth: number,
  targetDepth: number,
  solutions: S[]
): void {
  // Base Case: complete solution found
  if (depth === targetDepth) {
    solutions.push(deepCopy(state)); // Crucial: Defensive copy!
    return;
  }

  for (const choice of getAvailableChoices(state, depth)) {
    if (isValid(choice, state)) {
      // 1. CHOOSE: Apply mutation to state
      applyChoice(state, choice);

      // 2. EXPLORE: Recurse into next decision layer
      backtrack(state, depth + 1, targetDepth, solutions);

      // 3. UNCHOOSE: Reverse mutation to restore invariant
      revertChoice(state, choice);
    }
  }
}
```

---

## 4. Production Implementation: $N$-Queens with $O(1)$ Bitmask Pruning

```typescript
export class NQueensSolver {
  private solutions: string[][] = [];

  public solveNQueens(n: number): string[][] {
    this.solutions = [];
    const board: number[] = new Array(n).fill(-1); // board[row] = col
    this.search(0, n, board, 0, 0, 0);
    return this.solutions;
  }

  private search(
    row: number,
    n: number,
    board: number[],
    cols: number,
    diag1: number,
    diag2: number
  ): void {
    if (row === n) {
      this.solutions.push(this.formatBoard(board, n));
      return;
    }

    for (let col = 0; col < n; col++) {
      const d1 = row - col + (n - 1); // Main diagonal mask index: [0, 2n-2]
      const d2 = row + col;           // Anti-diagonal mask index: [0, 2n-2]

      // Bounding check: verify column and both diagonals in O(1)
      if (
        (cols & (1 << col)) === 0 &&
        (diag1 & (1 << d1)) === 0 &&
        (diag2 & (1 << d2)) === 0
      ) {
        // 1. CHOOSE
        board[row] = col;
        const newCols = cols | (1 << col);
        const newDiag1 = diag1 | (1 << d1);
        const newDiag2 = diag2 | (1 << d2);

        // 2. EXPLORE
        this.search(row + 1, n, board, newCols, newDiag1, newDiag2);

        // 3. UNCHOOSE (Implicit in bitmask parameter passing; reset board)
        board[row] = -1;
      }
    }
  }

  private formatBoard(board: number[], n: number): string[] {
    return board.map((col) => {
      const rowStr = new Array(n).fill('.');
      rowStr[col] = 'Q';
      return rowStr.join('');
    });
  }
}
```

---

## 5. Step-by-Step Worked Dry Run: The 4-Queens Problem

**Problem**: Place $N = 4$ non-attacking queens on a $4 \times 4$ chessboard.

### Diagonal Indexing Invariants
- Columns: Index $c \in [0, 3]$.
- Main Diagonal ($\backslash$): Difference $(r - c)$ is constant; offset by $N - 1$: index $r - c + 3 \in [0, 6]$.
- Anti-Diagonal ($/$): Sum $(r + c)$ is constant: index $r + c \in [0, 6]$.

| Step | Current Row | Candidate Col | Conflict Check | Decision / Action | Board Configuration $[Q_0, Q_1, Q_2, Q_3]$ |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **1** | Row 0 | Col 0 | No conflicts | **CHOOSE (0, 0)** | `[0, _, _, _]` |
| **2** | Row 1 | Col 0 | Conflict: Column 0 | Reject | `[0, _, _, _]` |
| **3** | Row 1 | Col 1 | Conflict: Main Diagonal $(1 - 1 = 0 - 0)$ | Reject | `[0, _, _, _]` |
| **4** | Row 1 | Col 2 | No conflicts | **CHOOSE (1, 2)** | `[0, 2, _, _]` |
| **5** | Row 2 | Col 0 | Conflict: Column 0 | Reject | `[0, 2, _, _]` |
| **6** | Row 2 | Col 1 | Conflict: Anti-Diagonal $(2 + 1 = 1 + 2)$ | Reject | `[0, 2, _, _]` |
| **7** | Row 2 | Col 2 | Conflict: Column 2 | Reject | `[0, 2, _, _]` |
| **8** | Row 2 | Col 3 | Conflict: Main Diagonal $(2 - 3 = -1 = 1 - 2)$ | Reject | `[0, 2, _, _]` |
| **9** | **Row 2 Dead End** | — | All columns conflict | **PRUNE & BACKTRACK to Row 1** | Revert $(1, 2) \implies [0, _, _, _]$ |
| **10** | Row 1 | Col 3 | No conflicts | **CHOOSE (1, 3)** | `[0, 3, _, _]` |
| **11** | Row 2 | Col 0 | Conflict: Column 0 | Reject | `[0, 3, _, _]` |
| **12** | Row 2 | Col 1 | No conflicts | **CHOOSE (2, 1)** | `[0, 3, 1, _]` |
| **13** | Row 3 | Col 0..3 | All columns conflict | **PRUNE & BACKTRACK to Row 0** | Revert all $\implies [\_, _, _, _]$ |
| **14** | Row 0 | Col 1 | No conflicts | **CHOOSE (0, 1)** | `[1, _, _, _]` |
| **15** | Row 1 | Col 3 | No conflicts | **CHOOSE (1, 3)** | `[1, 3, _, _]` |
| **16** | Row 2 | Col 0 | No conflicts | **CHOOSE (2, 0)** | `[1, 3, 0, _]` |
| **17** | Row 3 | Col 2 | No conflicts | **CHOOSE (3, 2)** | `[1, 3, 0, 2]` |
| **18** | **Row 4** | — | Row $r = N = 4$ reached | **RECORD SOLUTION 1** | **`[1, 3, 0, 2]`** |

---

## 6. Master Comparison: Backtracking vs. Brute Force vs. Branch & Bound

| Architectural Dimension | Brute Force | Backtracking | Branch and Bound |
| :--- | :--- | :--- | :--- |
| **Search Traversal** | Unconstrained iteration | **Depth-First Search (DFS)** | **Best-First Search** via Min/Max-Heap |
| **Pruning Mechanism** | None (visits every leaf) | **Bounding Predicate** (discards invalid states) | **Cost Lower/Upper Bounds** (discards suboptimal states) |
| **Space Consumption** | $O(1)$ or $O(n)$ | $\mathbf{O(\text{Tree Depth})}$ stack frames | Potentially exponential $O(b^d)$ heap storage |
| **Optimal Problem Domain** | Verification, small sets ($n \le 10$) | **Constraint Satisfaction** (Sudoku, N-Queens, Subsets) | **Global Optimization** (0/1 Knapsack, TSP, Integer LP) |
| **Termination Strategy** | Full scan over $|\mathcal{S}|$ | Stops at first valid solution or enumerates all valid | Prunes when subproblem lower bound $\ge$ known upper bound |

---

## 7. Common Traps, Edge Cases & Implementation Pitfalls

1. **Reference Sharing Bug**:
   - In JavaScript/TypeScript, appending a mutable array directly into `solutions` (`solutions.push(currentPath)`) pushes a reference. Subsequent unchoose steps modify the array, leaving all solutions pointing to identical empty states. Always push a shallow or deep copy (`solutions.push([...currentPath])`).
2. **Missing or Incomplete Unchoose Step**:
   - If the choose phase modifies a global or shared data structure (e.g., a bitmask or set) and the unchoose phase fails to remove the element, corrupt state leaks into sibling branches.
3. **Linear Scans in Bounding Checks**:
   - Validating constraints by scanning the entire board in $O(n)$ at each step instead of using $O(1)$ bitmasks or sets increases the search overhead by a factor of $n$.

---

## 8. Real-World Applications & Practice Problems

### Production Systems
- **SAT Solvers (Z3, MiniSat)**: DPLL and CDCL (Conflict-Driven Clause Learning) algorithms use backtracking with non-chronological backjumping to verify hardware circuits.
- **Compiler Register Allocation**: Uses backtracking graph coloring to assign CPU registers to temporary variables without spill conflicts.
- **Sudoku & Puzzle Solvers**: High-performance puzzle generation and automated resolution engines.

### Practice Problems
1. **N-Queens (LeetCode 51)** — Classic constraint satisfaction with diagonal bounding.
2. **Sudoku Solver (LeetCode 37)** — 9x9 board backtracking with box/row/col constraints.
3. **Word Search II (LeetCode 212)** — 2D grid backtracking combined with a Trie prefix tree.

---

## 9. References & Academic Attribution

1. **Golomb, S. W., & Baumert, L. D.** (1965). Backtrack programming. *Journal of the ACM (JACM)*, 12(4), 516–524.
2. **Knuth, D. E.** (2000). Dancing Links. In *Millennial Perspectives in Computer Science*, pp. 187–214.
3. **Russell, S., & Norvig, P.** (2020). *Artificial Intelligence: A Modern Approach* (4th ed.), Chapter 6 (Constraint Satisfaction Problems). Pearson.
4. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 34. MIT Press.
$$
