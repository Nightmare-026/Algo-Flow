# Part 01: Foundations — Module 02: Problem-Solving Methodology, Pseudocode & Flowcharts

Confronting an unseen algorithmic challenge without a systematic process leads to trial-and-error debugging and brittle solutions. A structured engineering methodology decomposes ambiguity into concrete constraints, establishes a verified brute-force baseline, and applies targeted optimizations before writing production code.

### Learning Objectives
By the end of this chapter, you will be able to:
- Apply the 6-Step Problem-Solving Pipeline to systematically decompose unseen algorithmic problems.
- Use the B.U.D. (Bottlenecks, Unnecessary work, Duplicated work) optimization framework to reduce asymptotic complexity.
- Author standardized line-numbered algorithmic pseudocode adhering to universal mathematical conventions.
- Map algorithm control flow to standardized ISO flowchart symbols.
- Validate algorithm logic using dry-run execution tables prior to language-specific coding.

---

## 1. The 6-Step Engineering Problem-Solving Framework

Professional software engineers follow an intentional 6-step pipeline when solving computational problems:

| Step | Phase | Key Action | Critical Artifact |
| :---: | :--- | :--- | :--- |
| **1** | **Clarify & Constrain** | Identify value bounds ($n$), edge cases, memory limits, and data types | Constraint checklist ($n \le 10^5 \implies O(n \log n)$) |
| **2** | **Manual Simulation** | Trace 2–3 concrete examples manually on paper | Input/output state transition sketches |
| **3** | **Brute Force Baseline** | Formulate the simplest working solution (even if $O(n^2)$ or $O(2^n)$) | Verified baseline correctness proof |
| **4** | **Optimize via B.U.D.** | Eliminate bottlenecks, unnecessary operations, and repeated work | Target complexity model ($O(n)$ or $O(\log n)$) |
| **5** | **Pseudocode & Dry Run** | Draft line-numbered logic and trace variables in a state table | Step-by-step state verification table |
| **6** | **Implement & Stress Test** | Code in the target language and test edge cases (empty, single, duplicates) | Production code with unit test suite |

### Extracting Constraints & Runtime Targets

Input scale immediately dictates the target algorithmic complexity under a standard 1-second CPU budget ($\approx 10^8$ operations):

- $n \le 10$: $O(n!)$ or $O(2^n)$ backtracking / permutations
- $n \le 25$: $O(2^n)$ bitmask dynamic programming or meet-in-the-middle
- $n \le 500$: $O(n^3)$ cubic algorithms (Floyd-Warshall, matrix operations)
- $n \le 5,000$: $O(n^2)$ quadratic algorithms (nested loops, dynamic programming)
- $n \le 10^5$: $O(n \log n)$ or $O(n)$ (sorting, divide and conquer, two pointers)
- $n \ge 10^9$: $O(\log n)$ binary search or $O(1)$ closed-form mathematical formula

---

## 2. Optimization Strategy: The B.U.D. Method

When optimizing a working brute-force solution, systematically inspect the logic for three performance killers:

1. **B — Bottlenecks**: Identify which single phase dominates the total runtime.
   - *Example*: In an algorithm that sorts an array in $O(n \log n)$ and then performs an $O(n^2)$ verification loop, the nested loop is the bottleneck. Optimizing the sorting phase yields zero asymptotic gain until the bottleneck is eliminated.
2. **U — Unnecessary Work**: Avoid executing steps whose results are never consumed or could be bypassed.
   - *Example*: Finding the $k$ smallest elements by fully sorting an entire array ($O(n \log n)$) when maintaining a size-$k$ heap requires only $O(n \log k)$.
3. **D — Duplicated Work**: Eliminate recalculating identical state or subproblems.
   - *Example*: Repeatedly summing array ranges $A[i \dots j]$ in $O(n)$ time rather than precomputing a prefix sum array in $O(n)$ space for $O(1)$ queries.

---

## 3. Universal Pseudocode Specification Standard

Pseudocode provides a language-agnostic blueprint that highlights mathematical invariants while omitting memory-management boilerplate.

### Core Formatting Rules

- **Line Numbers**: Every statement is numbered to facilitate dry-run references.
- **Assignment**: Left-arrow `←` denotes assignment; `=` is reserved for mathematical equality.
- **Comparisons**: Relational operators `<`, `≤`, `>`, `≥`, and inequality `≠`.
- **Logic**: Bold lowercase English words: `and`, `or`, `not`.
- **Scoping**: 4-space indentation defines nested execution blocks without braces.
- **Returns**: Explicit `return <value>` designates subroutine exit points.

### Reference Control Structures

```text
ALGORITHM LinearSearch(A, target)
    Input: Array A of length n, value target
    Output: Index of target in A, or -1 if not found

1.  for i ← 0 to length(A) - 1:
2.      if A[i] = target:
3.          return i
4.  return -1
```

---

## 4. Flowchart Architecture & ISO Standard Symbols

A flowchart diagrams the sequential flow of control, branching conditions, and state transitions using standardized ISO geometric shapes:

| Shape | ISO Designation | Control Function | Example Usage |
| :--- | :--- | :--- | :--- |
| **Oval / Capsule** | **Terminator** | Algorithm initiation or termination | `START`, `END`, `RETURN` |
| **Parallelogram** | **Input / Output** | Receiving external input or emitting results | `Read A, target`, `Print result` |
| **Rectangle** | **Process** | Arithmetic calculation or variable assignment | `i ← 0`, `sum ← sum + A[i]` |
| **Diamond** | **Decision** | Conditional evaluation producing boolean branches | `i < n?`, `A[i] == target?` |
| **Arrows** | **Flowline** | Direction of control progression | Sequential or loop-back transitions |

---

## 5. Control Flow Case Study: Linear Search

To inspect live step-by-step pointer progression, explore our interactive [Linear Search Visualizer](/visualizer/linear-search).

### Step-by-Step State Dry Run Table
Tracing `LinearSearch(A, 30)` on input $A = [10, 20, 30, 40]$:

| Step | Line | Loop Index $i$ | Current Value $A[i]$ | Condition $A[i] = 30$ | State Transition |
| :---: | :---: | :---: | :---: | :---: | :--- |
| 1 | 1 | $0$ | $10$ | False ($10 \ne 30$) | Increment $i \leftarrow 1$ |
| 2 | 1 | $1$ | $20$ | False ($20 \ne 30$) | Increment $i \leftarrow 2$ |
| 3 | 2 | $2$ | $30$ | **True** ($30 = 30$) | Execute line 3: `return 2` |

- **Early Exit**: The search terminates in 3 iterations rather than completing the full scan of length 4.
- **Worst-Case Invariant**: If target is absent or at index $n-1$, exactly $n$ comparisons are performed ($O(n)$).

---

## 6. Key Takeaways

- **Constraint Discipline**: Extract input constraints first to immediately determine your target complexity class before drafting algorithms.
- **The B.U.D. Filter**: Accelerate brute force by systematically identifying and eliminating bottlenecks, unnecessary work, and duplicated calculations.
- **Traceability**: Pair pseudocode with variable trace tables to catch edge cases (such as off-by-one errors and null references) before implementation.

---

## References & Academic Attribution

1. **Pólya, G.** (1945). *How to Solve It: A New Aspect of Mathematical Method*. Princeton University Press.
2. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 2: Getting Started. MIT Press.
3. **McDowell, G. L.** (2015). *Cracking the Coding Interview* (6th ed.), Chapter 6: Big-O. CareerCup.
