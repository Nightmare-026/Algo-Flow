# Part 08: Algorithm Design Techniques — Module 03: Backtracking & State Space Trees

> **Topics Covered:**  
> 124. Backtracking Paradigm, State Space Trees & The "Choose-Explore-Unchoose" Blueprint &bull; 133. Backtracking vs Brute Force vs Branch and Bound

---

## Assessable Learning Objectives

Upon completing this chapter, you will be able to:
1. **Model Combinatorial Search Trees**: Formalize a constraint satisfaction problem as a virtual State Space Tree with explicit decision vertices and constraint edges.
2. **Implement Bounding Functions**: Formulate $O(1)$ pruning checks using bitmasks and hash sets to truncate non-viable solution subtrees.
3. **Execute the Choose-Explore-Unchoose Pattern**: Master state preservation and restoration invariants in recursive search frames.
4. **Trace N-Queens State Evolution**: Trace recursive decision steps, constraint violations, pruning events, and backtrack triggers on concrete board configurations.

---

# TOPIC 124: THE BACKTRACKING PARADIGM

### 1. Definition & Algorithmic Mechanics

**Backtracking** is a systematic method for solving constraint satisfaction problems by constructing candidate solutions incrementally, one decision component at a time. The algorithm traverses the virtual **State Space Tree** in Depth-First Search (DFS) order.

$$\text{Search}(u) = \begin{cases} 
\text{RecordSolution}(u) & \text{if } \text{IsComplete}(u) \\
\text{PruneBranch}(u) & \text{if } \neg \text{Feasible}(u) \\
\bigcup_{c \in \text{Children}(u)} \text{Search}(c) & \text{otherwise}
\end{cases}$$

As soon as a partial candidate vector $(x_1, x_2, \dots, x_k)$ violates any problem constraint, the algorithm **immediately abandons the branch (pruning)** and backtracks to the parent decision point to test alternative values for $x_k$ or $x_{k-1}$.

```text
                           [ Root: Empty State ]
                           /         │         \
                      x₁ = 1      x₁ = 2      x₁ = 3
                      /    \         │
                  x₂ = 1  x₂ = 2   Pruned! (Constraint Violated)
                  /         │      ◄── Entire subtree skipped in O(1)!
             Solution    Dead End
```

---

### 2. The Universal Choose — Explore — Unchoose Blueprint

Every valid backtracking implementation adheres strictly to this state-restoration lifecycle:

```text
ALGORITHM Backtrack(state, depth, n):
1.  if depth == n:
2.      solutions.Append(DeepCopy(state))   // Invariant: Must deep copy mutable state
3.      return
4.  for each choice in AvailableChoices(state, depth):
5.      if IsValid(choice, state):          // Bounding / Pruning Function
6.          // 1. CHOOSE: Apply decision to state
7.          ApplyChoice(state, choice)
8.          // 2. EXPLORE: Recursively search subproblem
9.          Backtrack(state, depth + 1, n)
10.         // 3. UNCHOOSE: Reverse decision (restore state invariant)
11.         RevertChoice(state, choice)
```

---

### 3. Step-by-Step Worked Dry Run: The 4-Queens Problem

**Problem**: Place $N = 4$ non-attacking queens on a $4 \times 4$ board such that no two queens share the same row, column, main diagonal ($\backslash$), or anti-diagonal ($/$).

#### $O(1)$ Diagonal Representation
- Columns: `colMask` or set `cols`
- Main Diagonal ($\backslash$): Difference $(r - c)$ is constant; offset by $N - 1$: index $(r - c + 3) \in [0, 6]$
- Anti-Diagonal ($/$): Sum $(r + c)$ is constant: index $(r + c) \in [0, 6]$

#### Detailed Decision & Pruning Trace:

| Step | Current Row | Candidate Col | Conflict Check | Decision / Action | Board State $[Q_0, Q_1, Q_2, Q_3]$ |
| :---: | :---: | :---: | :--- | :--- | :--- |
| **1** | Row 0 | Col 0 | No conflicts | **CHOOSE (0, 0)** | `[0, _, _, _]` |
| **2** | Row 1 | Col 0 | Conflict: Col 0 | Reject | `[0, _, _, _]` |
| **3** | Row 1 | Col 1 | Conflict: Main Diag $(1-1 = 0-0)$ | Reject | `[0, _, _, _]` |
| **4** | Row 1 | Col 2 | No conflicts | **CHOOSE (1, 2)** | `[0, 2, _, _]` |
| **5** | Row 2 | Col 0 | Conflict: Col 0 | Reject | `[0, 2, _, _]` |
| **6** | Row 2 | Col 1 | Conflict: Anti-Diag $(2+1 = 1+2)$ | Reject | `[0, 2, _, _]` |
| **7** | Row 2 | Col 2 | Conflict: Col 2 | Reject | `[0, 2, _, _]` |
| **8** | Row 2 | Col 3 | Conflict: Main Diag $(2-3 = 0-1 \to -1)$ | Reject | `[0, 2, _, _]` |
| **9** | **Row 2 Dead End** | — | All columns invalid | **PRUNE & BACKTRACK to Row 1** | Revert `(1, 2)` $\to [0, _, _, _]$ |
| **10** | Row 1 | Col 3 | No conflicts | **CHOOSE (1, 3)** | `[0, 3, _, _]` |
| **11** | Row 2 | Col 0 | Conflict: Col 0 | Reject | `[0, 3, _, _]` |
| **12** | Row 2 | Col 1 | No conflicts | **CHOOSE (2, 1)** | `[0, 3, 1, _]` |
| **13** | Row 3 | Col 0..3 | All cols conflict with existing queens | **PRUNE & BACKTRACK to Row 0** | Revert all $\to [\_, _, _, _]$ |
| **14** | Row 0 | Col 1 | No conflicts | **CHOOSE (0, 1)** | `[1, _, _, _]` |
| **15** | Row 1 | Col 3 | No conflicts | **CHOOSE (1, 3)** | `[1, 3, _, _]` |
| **16** | Row 2 | Col 0 | No conflicts | **CHOOSE (2, 0)** | `[1, 3, 0, _]` |
| **17** | Row 3 | Col 2 | No conflicts | **CHOOSE (3, 2)** | `[1, 3, 0, 2]` |
| **18** | **Row 4** | — | Row $r = N = 4$ reached | **RECORD SOLUTION 1** | **`[1, 3, 0, 2]`** ✅ |

**Symmetric Second Solution**: By mirroring across the central axis, backtracking subsequently identifies `[2, 0, 3, 1]`.

---

# TOPIC 133: BACKTRACKING VS BRUTE FORCE VS BRANCH & BOUND

Understanding how these three search paradigms compare is essential for algorithm selection:

| Architectural Dimension | Brute Force | Backtracking | Branch and Bound |
| :--- | :--- | :--- | :--- |
| **Search Traversal** | Unconstrained iteration | **Depth-First Search (DFS)** | **Best-First Search (BFS)** via Priority Queue |
| **Pruning Mechanism** | None (visits every leaf) | **Bounding Predicate** (discards invalid states) | **Cost Lower/Upper Bounds** (discards suboptimal states) |
| **Space Consumption** | $O(1)$ or $O(n)$ | $\mathbf{O(\text{Tree Depth})}$ stack frames | Potentially exponential $O(b^d)$ queue storage |
| **Optimal Problem Domain** | Verification, small sets | **Constraint Satisfaction** (Sudoku, N-Queens, Subsets) | **Global Optimization** (Traveling Salesperson, Integer LP) |
| **Termination Strategy** | Fixed iteration over space | Stops at first valid solution or enumerates all | Prunes when subproblem lower bound $\ge$ known upper bound |

---

### Common Implementation Pitfalls

1. **Reference Sharing Bug**: In languages like Python and JavaScript, appending `state` directly into `results` stores a reference to a mutable array that subsequently gets cleared during backtracking:
   ```python
   # INCORRECT: All results will point to the same empty array at termination
   results.append(current_path)

   # CORRECT: Store a defensive copy of the current valid state
   results.append(list(current_path))
   ```
2. **Missing Unchoose Step**: If choice application alters external data structures without an exact mirror cleanup in the unchoose phase, corrupt state leaks into subsequent branches.
3. **Redundant Pruning Checks**: Computing validity by scanning the entire board in $O(n)$ at each step instead of using $O(1)$ set lookups turns an $O(n!)$ search into $O(n \cdot n!)$.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 34: NP-Completeness. MIT Press.
2. **Golomb, S. W., & Baumert, L. D.** (1965). Backtrack programming. *Journal of the ACM (JACM)*, 12(4), 516-524.
3. **Knuth, D. E.** (2000). Dancing Links. In *Millennial Perspectives in Computer Science*, pp. 187-214.
4. **Russell, S., & Norvig, P.** (2020). *Artificial Intelligence: A Modern Approach* (4th ed.), Chapter 6: Constraint Satisfaction Problems. Pearson.
