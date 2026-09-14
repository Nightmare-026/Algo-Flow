# Part 01: Foundations — Module 04: Recursion, Recurrence Relations & the Call Stack

Recursion is mathematical induction realized in executable code: an algorithm solves a complex instance by delegating to strictly smaller subproblems of identical structure until reaching a trivial base case. Understanding call stack frame allocation, recurrence trees, and the Master Theorem enables engineers to predict both runtime bounds and stack-overflow boundaries.

### Learning Objectives
By the end of this chapter, you will be able to:
- Trace call stack activation records and memory lifecycles during recursive winding and unwinding phases.
- Formulate recurrence relations for divide-and-conquer and decrease-and-conquer algorithms.
- Solve recurrences using level-by-level summation in the Recursion Tree Method.
- Apply the three cases of the Master Theorem to immediately establish asymptotic bounds for canonical divide-and-conquer algorithms.
- Refactor non-tail recursion into tail recursion with accumulators to leverage compiler Tail-Call Optimization (TCO).

---

## 1. Recursion Fundamentals & Call Stack Physics

Every mathematically sound recursive algorithm consists of two mandatory components:
1. **Base Case (Termination Condition)**: One or more scenarios evaluated without recursive calls, halting the descent.
2. **Recursive Step (Inductive Progression)**: Decomposes input $n$ into one or more strictly smaller subproblems ($n - 1$, $n / 2$), guaranteeing progress toward the base case.

```text
ALGORITHM Factorial(n)
    Input: Non-negative integer n
    Output: n!

1.  if n ≤ 1:              // Base Case: Directly solvable
2.      return 1
3.  else:                   // Recursive Step: Strictly smaller subproblem
4.      return n * Factorial(n - 1)
```

### Call Stack Lifecycle During `Factorial(3)`

In physical memory, each recursive invocation pushes an **Activation Record (Stack Frame)** onto the runtime call stack, storing parameters, local variables, and the caller's return instruction address:

| Stack Frame Level | Invocations | Parameter $n$ | Execution State | Return Expression / Evaluation |
| :---: | :--- | :---: | :--- | :--- |
| **Frame 3** (Top) | `Factorial(1)` | $1$ | **Active (Base Case)** | Returns $1$ directly to Frame 2 |
| **Frame 2** | `Factorial(2)` | $2$ | Suspended (Waiting) | Computes $2 \cdot 1 = 2$; returns to Frame 1 |
| **Frame 1** | `Factorial(3)` | $3$ | Suspended (Waiting) | Computes $3 \cdot 2 = 6$; returns to Frame 0 |
| **Frame 0** (Base) | `main()` | — | Suspended | Receives final result $6$ |

### The Two Execution Phases
- **Winding (Descent)**: Activation records are pushed successively until the base condition evaluates to true ($O(h)$ maximum stack depth).
- **Unwinding (Ascent)**: Completed frames are popped from the stack in LIFO order as deferred operations (e.g., pending multiplications) evaluate and return values to callers.

---

## 2. Solving Recurrences: The Recursion Tree Method

A **Recurrence Relation** defines an algorithm's runtime $T(n)$ in terms of its performance on smaller subproblems. 

Consider the canonical divide-and-conquer recurrence:
$$T(n) = 2T\left(\frac{n}{2}\right) + cn \quad (c > 0)$$

To solve via the Recursion Tree Method, sum the computational work across each level of the tree:

| Tree Level $i$ | Node Count | Subproblem Size | Cost Per Node | Total Level Cost |
| :---: | :---: | :---: | :---: | :--- |
| **0** (Root) | $2^0 = 1$ | $n$ | $cn$ | $1 \cdot cn = cn$ |
| **1** | $2^1 = 2$ | $n/2$ | $c(n/2)$ | $2 \cdot \frac{cn}{2} = cn$ |
| **2** | $2^2 = 4$ | $n/4$ | $c(n/4)$ | $4 \cdot \frac{cn}{4} = cn$ |
| **$i$** | $2^i$ | $n/2^i$ | $c(n/2^i)$ | $2^i \cdot \frac{cn}{2^i} = cn$ |
| **$\log_2 n$** (Leaves) | $2^{\log_2 n} = n$ | $1$ | $\Theta(1)$ | $n \cdot \Theta(1) = \Theta(n)$ |

### Summation Across All Levels:
$$\text{Height } h = \log_2 n$$
$$\text{Total Cost } T(n) = \sum_{i=0}^{\log_2 n} cn = cn \cdot (\log_2 n + 1) = \Theta(n \log n)$$

---

## 3. The Master Theorem for Divide-and-Conquer

The Master Theorem provides an immediate asymptotic bound for recurrences of the standard form:

$$T(n) = a \, T\left(\frac{n}{b}\right) + f(n) \quad (a \ge 1, b > 1)$$

Where:
- $a$: Number of recursive subproblems generated per step.
- $b$: Factor by which input size is divided.
- $f(n)$: Work required to partition the problem and merge subproblem results.

Compare $f(n)$ to the **Watershed Function** $n^{\log_b a}$ (which represents the asymptotic work done at the leaf level):

| Case | Condition on $f(n)$ vs $n^{\log_b a}$ | Dominant Component | Asymptotic Solution $T(n)$ |
| :---: | :--- | :--- | :--- |
| **Case 1** | $f(n) = O(n^{\log_b a - \varepsilon})$ for some $\varepsilon > 0$ | **Leaves Dominate** | $\Theta(n^{\log_b a})$ |
| **Case 2** | $f(n) = \Theta(n^{\log_b a} \cdot \log^k n)$ for $k \ge 0$ | **Evenly Distributed** | $\Theta(n^{\log_b a} \cdot \log^{k+1} n)$ |
| **Case 3** | $f(n) = \Omega(n^{\log_b a + \varepsilon})$ and regularity holds: $a f(n/b) \le c f(n)$ ($c < 1$) | **Root Dominates** | $\Theta(f(n))$ |

### Benchmark Examples

1. **Merge Sort**: $T(n) = 2T(n/2) + \Theta(n)$  
   $a = 2, b = 2 \implies n^{\log_2 2} = n^1 = n$.  
   Since $f(n) = \Theta(n)$, Case 2 applies ($k = 0$):  
   $$T(n) = \Theta(n \log n)$$

2. **Binary Search**: $T(n) = T(n/2) + \Theta(1)$  
   $a = 1, b = 2 \implies n^{\log_2 1} = n^0 = 1$.  
   Since $f(n) = \Theta(1)$, Case 2 applies ($k = 0$):  
   $$T(n) = \Theta(\log n)$$

3. **Strassen's Matrix Multiplication**: $T(n) = 7T(n/2) + \Theta(n^2)$  
   $a = 7, b = 2 \implies n^{\log_2 7} \approx n^{2.807}$.  
   Since $f(n) = O(n^{2.807 - \varepsilon})$ with $\varepsilon \approx 0.807$, Case 1 applies:  
   $$T(n) = \Theta(n^{\log_2 7}) \approx \Theta(n^{2.81})$$

---

## 4. Iteration vs Recursion & Tail-Call Optimization

| Architectural Dimension | Recursion | Iteration |
| :--- | :--- | :--- |
| **Mechanism** | Function activation records on runtime stack | Loop branch instructions (`for`, `while`) |
| **Memory Overhead** | $O(h)$ auxiliary stack frames ($h = \text{recursion depth}$) | $O(1)$ auxiliary space (counter variables) |
| **Performance** | Function call prologue/epilogue overhead | Zero call overhead; optimized register loops |
| **Failure Mode** | Fatal `StackOverflowError` if $h > 10^4$ frames | Infinite loop consumes CPU, but does not exhaust stack |
| **Clarity** | Highly intuitive for trees, graphs, and divide-and-conquer | Requires explicit manual stack structures for backtracking |

### Tail-Call Optimization (TCO)

A function is **Tail-Recursive** if the recursive invocation is the final operation before returning; no pending calculations remain.

#### Non-Tail Recursive (Pending Multiplication):
```text
ALGORITHM FactorialNonTail(n)
1.  if n ≤ 1: return 1
2.  return n * FactorialNonTail(n - 1)  // Must wait for child return to multiply by n
```

#### Tail-Recursive (Accumulator Pattern):
```text
ALGORITHM FactorialTail(n, accumulator ← 1)
1.  if n ≤ 1: return accumulator
2.  return FactorialTail(n - 1, n * accumulator) // Final operation: direct tail call
```

Under Tail-Call Optimization, a compiler reuses the caller's stack frame instead of pushing a new frame, converting the recursive procedure into an $O(1)$ auxiliary space iterative loop at machine level.

---

## 5. Key Takeaways

- **Memory Overhead Invariant**: Every non-tail recursive call consumes an activation record on the call stack, contributing $O(h)$ auxiliary space proportional to maximum tree depth.
- **The Watershed Comparison**: The Master Theorem compares work at the root ($f(n)$) against total work across all leaves ($n^{\log_b a}$) to determine the dominant asymptotic term.
- **TCO Transformation**: Pass intermediate state via accumulator parameters to transform linear recursive procedures into tail-recursive loops.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 4: Divide-and-Conquer. MIT Press.
2. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.). Addison-Wesley.
3. **Abelson, H., & Sussman, G. J.** (1996). *Structure and Interpretation of Computer Programs* (2nd ed.). MIT Press.
