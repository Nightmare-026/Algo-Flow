# Part 01: Foundations — Module 04: Recursion, Recurrence Relations & the Call Stack

> **Topics Covered:**  
> 17. Recursion Fundamentals, Base Cases & the Call Stack &bull; 18. Recurrence Relations & The Master Theorem &bull; 19. Iteration vs Recursion & Tail-Call Optimization

---

## 17. Recursion Fundamentals & Call Stack Architecture

### Concept
**Recursion** is a programming and mathematical technique where a function solves a problem by calling one or more copies of itself on strictly smaller subproblems of the exact same nature, until reaching a trivial condition called the **Base Case**.

### The Anatomy of Every Valid Recursive Function
Every recursive function must contain two distinct, mandatory components:
1. **Base Case (Termination Condition)**: One or more conditions where the function returns a concrete answer directly without making further recursive calls. Without this, infinite recursion occurs.
2. **Recursive Step (Inductive Step)**: Decomposes the current problem $n$ into one or more smaller subproblems (e.g., $n - 1$ or $n / 2$) and invokes itself, guaranteeing mathematical progress toward the base case.

```text
ALGORITHM Factorial(n)
    Input: Non-negative integer n
    Output: n!

1.  if n ≤ 1:              // 🛑 BASE CASE: Solvable without recursion
2.      return 1
3.  else:                   // 🔁 RECURSIVE STEP: Makes progress toward n ≤ 1
4.      return n * Factorial(n - 1)
```

---

### Physical Call Stack & Activation Record Lifecycle

When a function executes in physical RAM, the operating system allocates an **Activation Record (Stack Frame)** in the runtime call stack memory region.

```text
PHYSICAL RAM LAYOUT DURING Factorial(3) EXECUTION
─────────────────────────────────────────────────────────────────────────────
High Memory ▲
            │  ┌───────────────────────────────────────────────┐
            │  │ [Stack Frame 3]: Factorial(1)                 │  ◄── ACTIVE (Top of Stack)
            │  │   • Argument: n = 1                           │      Hits Base Case!
            │  │   • Return Value: 1                           │      Returns 1 to caller
            │  ├───────────────────────────────────────────────┤
            │  │ [Stack Frame 2]: Factorial(2)                 │  ◄── WAITING
            │  │   • Argument: n = 2                           │      Waiting on Factorial(1)
            │  │   • Computation: 2 * Factorial(1)             │
            │  ├───────────────────────────────────────────────┤
            │  │ [Stack Frame 1]: Factorial(3)                 │  ◄── WAITING
            │  │   • Argument: n = 3                           │      Waiting on Factorial(2)
            │  │   • Computation: 3 * Factorial(2)             │
            │  ├───────────────────────────────────────────────┤
            │  │ [Stack Frame 0]: Main Program Call            │
            │  └───────────────────────────────────────────────┘
Low Memory  ▼
```

### The Two Phases of Recursion:
1. **Winding (Calling) Phase**: New stack frames are pushed onto the call stack as recursive calls cascade downwards until the base case is reached.
2. **Unwinding (Returning) Phase**: The base case returns its result; frames are popped off the stack one-by-one as pending multiplications are evaluated in reverse order.

---

## 18. Recurrence Relations & Solving Techniques

### Concept
A **Recurrence Relation** is an equation or inequality that defines a function $T(n)$ in terms of its value on strictly smaller inputs.

### Method 1: The Recursion Tree Method
To solve $T(n) = 2T(n/2) + cn$:
- Draw the computational cost at each level of the tree.
- Sum the costs across each horizontal level.
- Sum all level costs across the tree's total height.

```text
  Level 0:                      cn                      Cost = cn
                              /    \
  Level 1:               c(n/2)    c(n/2)               Cost = cn
                         /    \    /    \
  Level 2:            c(n/4) c(n/4) c(n/4) c(n/4)       Cost = cn
                        :      :     :      :
  Level log₂ n:       Θ(1)   Θ(1)   ...    Θ(1)         Cost = c · 2^(log₂ n) · 1 = cn

  Total Cost = ∑_{i=0}^{log₂ n} cn = cn · (log₂ n + 1) = Θ(n log n)
```

---

### Method 2: The Master Theorem (Divide-and-Conquer Recurrences)

The Master Theorem provides an immediate asymptotic bound for recurrences of the canonical form:

$$T(n) = a \, T\left(\frac{n}{b}\right) + f(n)$$

Where:
- $a \ge 1$: Number of subproblems in each recursive step.
- $b > 1$: Factor by which subproblem size is divided.
- $f(n)$: Cost of dividing the problem and combining the subproblem results.

Compare $f(n)$ with the watershed benchmark function $n^{\log_b a}$ (which represents the work done at the leaf level):

```text
               ┌────────────────────────────────────────────────────────┐
               │    THE WATERSHED BENCHMARK:  n^(log_b a)               │
               │    (Work done across all leaf subproblems)             │
               └────────────────────────────────────────────────────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           ▼                         ▼                         ▼
   CASE 1: Leaves Dominate   CASE 2: Balanced Tie      CASE 3: Root Dominates
   f(n) = O(n^(log_b a - ε)) f(n) = Θ(n^(log_b a)      f(n) = Ω(n^(log_b a + ε))
   for some ε > 0                   · log^k n)         for some ε > 0
           │                         │                         │
           ▼                         ▼                         ▼
     T(n) = Θ(n^(log_b a))     T(n) = Θ(n^(log_b a)    T(n) = Θ(f(n))
                                      · log^(k+1) n)   (provided regularity holds)
```

#### Master Theorem Examples:
1. **Merge Sort**: $T(n) = 2T(n/2) + \Theta(n)$  
   $a = 2, b = 2 \implies n^{\log_2 2} = n^1 = n$.  
   Since $f(n) = \Theta(n)$, Case 2 applies ($k=0$): $T(n) = \Theta(n \log n)$.
2. **Binary Search**: $T(n) = T(n/2) + \Theta(1)$  
   $a = 1, b = 2 \implies n^{\log_2 1} = n^0 = 1$.  
   Since $f(n) = \Theta(1)$, Case 2 applies ($k=0$): $T(n) = \Theta(\log n)$.
3. **Strassen's Matrix Multiplication**: $T(n) = 7T(n/2) + \Theta(n^2)$  
   $a = 7, b = 2 \implies n^{\log_2 7} \approx n^{2.807}$.  
   Since $f(n) = O(n^{2.807 - \varepsilon})$, Case 1 applies: $T(n) = \Theta(n^{\log_2 7})$.

---

## 19. Iteration vs Recursion & Tail-Call Optimization

### Architectural Comparison

| Dimension | Recursion | Iteration |
| :--- | :--- | :--- |
| **Control Flow** | Repeated self-function calls | Repeated loop constructs (`for`, `while`) |
| **Memory Overhead** | Requires $O(h)$ auxiliary stack memory for $h$ active frames | Typically $O(1)$ auxiliary space (counter variables) |
| **Speed / Performance**| Function call prologue/epilogue overhead | Direct branch instructions in CPU pipeline (faster) |
| **Risk** | Can cause fatal `StackOverflowError` if depth exceeds stack limit ($\approx 10^4$ frames) | Infinite loop causes CPU freeze, but rarely memory crash |
| **Expressiveness** | Elegant, concise, natural for hierarchical/divide-and-conquer structures (Trees, Graphs) | Can become cumbersome and require explicit manual stacks |

---

### Tail-Call Recursion & Tail-Call Optimization (TCO)

A recursive call is said to be **Tail-Recursive** if the recursive call is the **absolute final operation** executed by the function before returning. No pending operations remain.

#### Non-Tail Recursive (Pending Multiplication):
```text
1. ALGORITHM FactorialNonTail(n)
2.     if n ≤ 1: return 1
3.     return n * FactorialNonTail(n - 1)  // ⚠️ NOT tail-recursive: must wait for Factorial to multiply by n
```

#### Tail-Recursive (Using Accumulator):
```text
1. ALGORITHM FactorialTail(n, acc ← 1)
2.     if n ≤ 1: return acc
3.     return FactorialTail(n - 1, n * acc) // ✅ TAIL-RECURSIVE: return value is directly returned
```

#### Compiler Tail-Call Optimization (TCO):
When a function is tail-recursive, a modern optimizing compiler does not allocate a new stack frame. Instead, it reuses the existing stack frame and updates local parameters directly, effectively converting the recursion into an $O(1)$ auxiliary space iterative loop!

---

## Module 04 Summary & Key Takeaways

1. Recursion requires a **Base Case** (to halt) and a **Recursive Step** (to make inductive progress).
2. Every uncompleted recursive call consumes an **Activation Record** on the runtime call stack, contributing $O(\text{max depth})$ auxiliary space.
3. Master Theorem solves divide-and-conquer recurrences by comparing $f(n)$ with the watershed leaf count $n^{\log_b a}$.
4. Tail recursion allows compilers supporting TCO to run recursive logic in $O(1)$ auxiliary stack space.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 3: Characterizing Running Times. MIT Press.
2. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.4: Analysis of Algorithms. Addison-Wesley.
3. **Sipser, M.** (2012). *Introduction to the Theory of Computation* (3rd ed.). Cengage Learning.
