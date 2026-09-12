# 🧩 Part 01: Foundations — Module 02: Problem-Solving Methodology, Pseudocode & Flowcharts

> **Topics Covered:**  
> 7. Problem-Solving Methodology & Framework &bull; 8. Pseudocode Standards & Control Flow &bull; 9. Flowchart Architecture & ISO Symbols

---

## 7. Problem-Solving Methodology: The 6-Step Engineering Framework

When confronting an unseen algorithmic problem in an interview, competitive programming contest, or production system, undisciplined trial-and-error leads directly to bugs and wasted time. Master the **Universal 6-Step Problem-Solving Pipeline**:

```text
  STEP 1: Clarify & Constrain   ──► Read carefully, identify constraints, define input/output
            │
  STEP 2: Manual Simulation      ──► Solve small test cases by hand with paper and pencil
            │
  STEP 3: Brute Force Baseline   ──► Formulate the obvious O(n!) or O(n²) solution first
            │
  STEP 4: Optimize & Pattern     ──► Spot bottlenecks, redundancies; apply DSA patterns
            │
  STEP 5: Formalize & Dry Run    ──► Draft line-numbered pseudocode; trace state table
            │
  STEP 6: Code & Stress Test     ──► Implement cleanly; test extreme edge cases (null, empty)
```

### Deep Dive into Each Step

#### Step 1: Clarify & Extract Constraints
- **What is the range of $n$?**
  - If $n \le 10$: $O(n!)$ or $O(2^n)$ backtracking is acceptable.
  - If $n \le 10^3$: $O(n^2)$ nested loops are viable ($10^6$ operations).
  - If $n \le 10^5$: Must be $O(n \log n)$ or $O(n)$ ($10^5$ to $10^6$ operations).
  - If $n \ge 10^9$: Must be $O(\log n)$ or $O(1)$.
- **What are the data types?** Can integer overflow occur ($> 2^{31} - 1$)? Are inputs sorted? Are there negative numbers? Are duplicates allowed?

#### Step 2: Manual Simulation with Concrete Cases
Never write a single line of pseudocode until you have manually simulated 2–3 inputs on paper. Track what your eyes and brain naturally do to find the answer: your human intuition is often an intuitive greedy or two-pointer algorithm in disguise.

#### Step 3: The Brute Force Baseline
Always establish a working, provably correct baseline first (even if $O(n^3)$). It serves two vital functions:
1. It validates that the problem statement is fully understood.
2. It provides an oracle against which to verify the optimized solution during fuzz testing.

#### Step 4: Optimization via the B.U.D. Framework
To optimize from brute force, look for:
- **B — Bottlenecks**: Which single step dominates the runtime (e.g., an internal linear search that could be a hash lookup)?
- **U — Unnecessary Work**: Are you sorting when you only need the top 3 elements?
- **D — Duplicated Work**: Are you recalculating subproblems that were already evaluated (memoization / prefix sums)?

---

## 8. Pseudocode Basics & Universal Standards

### 💡 CONCEPT
**Pseudocode** is an artificial, informal, high-level description of an algorithm. It uses the structural conventions of modern programming languages but omits language-specific syntax, type declarations, and memory-management boilerplate to emphasize the mathematical logic.

### 📌 Universal Syntax Rules

```text
Rule 1: Line Numbers       Every instruction line is numbered (1., 2., 3...)
Rule 2: Assignment         Always use the left-arrow: variable ← expression
Rule 3: Comparisons        Equality is '=' and inequality is '≠'
Rule 4: Logical Operators  Written as bold English: and, or, not
Rule 5: Blocks & Scope     4-space indentation defines nested execution
Rule 6: Return Values      Explicit 'return <value>' at exit points
```

### Standard Control Structures in Pseudocode

#### 1. Sequential Statements
```text
1. total ← 0
2. count ← count + 1
3. average ← total / count
```

#### 2. Conditional Branching
```text
1. if score ≥ 90:
2.     grade ← "A"
3. else if score ≥ 80:
4.     grade ← "B"
5. else:
6.     grade ← "C"
```

#### 3. Count-Controlled Loop (For)
```text
1. sum ← 0
2. for i ← 0 to n - 1:
3.     sum ← sum + A[i]
```

#### 4. Condition-Controlled Loop (While)
```text
1. low ← 0
2. high ← n - 1
3. while low ≤ high:
4.     mid ← low + ⌊(high - low) / 2⌋
5.     // process midpoint
```

#### 5. Collection Traversal (For Each)
```text
1. for each vertex v in Graph.vertices:
2.     visited[v] ← false
```

---

## 9. Flowchart Basics & ISO Standards

### 💡 CONCEPT
A **Flowchart** is a diagrammatic, graphical representation of an algorithm displaying the sequential flow of control, decisions, and data transformations using standardized ISO geometric symbols.

### ISO Flowchart Symbol Legend

```text
   SYMBOL SHAPE             NAME                     PURPOSE / FUNCTION
   ─────────────────────────────────────────────────────────────────────────────
     ╭────────╮
     │  START │          TERMINATOR               Represents Start, End, or Halt
     ╰────────╯                                   of the algorithm.
         │
         ▼
   ┌──────────┐
   │ Read A,B │          INPUT / OUTPUT           Data input from user or output
   └──────────┘          (Parallelogram)          displayed to screen.
         │
         ▼
   ┌──────────┐
   │ x ← A + B│          PROCESS                  Arithmetic operation, assignment,
   └──────────┘          (Rectangle)              or internal memory computation.
         │
         ▼
        /\
       /  \
      <x > 0>            DECISION                 Conditional evaluation yielding
       \  /              (Diamond)                binary branches (True / False).
        \/
       /  \
     Yes   No
```

### Comprehensive Flowchart Example: Linear Search

The following diagram illustrates the complete control flow for searching target $K$ in array $A$ of size $n$:

```text
                  ╭───────────────╮
                  │     START     │
                  ╰───────┬───────╯
                          │
                          ▼
                  ┌───────────────┐
                  │ Read A, n, K  │
                  └───────┬───────┘
                          │
                          ▼
                  ┌───────────────┐
                  │    idx ← 0    │
                  └───────┬───────┘
                          │
                          ▼
                  /───────────────\
                 /                 \      No
                <     idx < n?      > ───────────┐
                 \                 /             │
                  \───────┬───────/              │
                          │ Yes                  │
                          ▼                      │
                  /───────────────\              │
                 /                 \             │
                <   A[idx] = K?     > ───┐       │
                 \                 /     │       │
                  \───────┬───────/      │       │
                       No │              │ Yes   │
                          ▼              │       │
                  ┌───────────────┐      │       │
                  │ idx ← idx + 1 │      │       │
                  └───────┬───────┘      │       │
                          │              │       │
                          └──────►───────┼───────┤
                                         │       │
                                         ▼       ▼
                                  ┌──────────┐ ┌──────────┐
                                  │ Return   │ │ Return   │
                                  │   idx    │ │    -1    │
                                  └────┬─────┘ └────┬─────┘
                                       │            │
                                       ▼            ▼
                                    ╭──────────────────╮
                                    │       END        │
                                    ╰──────────────────╯
```

---

## 🔁 Module 02 Summary & Key Takeaways

1. **Structured Problem Solving**: Clarify constraints first $\rightarrow$ simulate manually $\rightarrow$ build brute force baseline $\rightarrow$ optimize via B.U.D. $\rightarrow$ dry run with state tables $\rightarrow$ code.
2. **Pseudocode** eliminates syntactic noise and emphasizes universal mathematical logic with unambiguous line numbering.
3. **Flowcharts** make branch conditions, loop cycles, and termination boundaries visually unmistakable.

---
[⬅️ Previous: Module 01 — Data & Algorithms](file:///d:/DSA/Part-01-Foundations/01_data_and_algorithms.md) | [Next: Module 03 — Asymptotic Analysis ➡️](file:///d:/DSA/Part-01-Foundations/03_asymptotic_analysis.md)
