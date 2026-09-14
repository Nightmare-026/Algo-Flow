# Part 01: Foundations — Module 03: Asymptotic Analysis & Growth of Functions

Evaluating software solely through wall-clock execution benchmarks is flawed: execution speed varies with processor architecture, operating system scheduling, memory bandwidth, and background processes. Asymptotic analysis provides an objective, hardware-independent mathematical framework for quantifying how computational resources scale as input size $n \to \infty$.

### Learning Objectives
By the end of this chapter, you will be able to:
- Count elementary operations on the Random Access Machine (RAM) model to derive a closed-form cost function $T(n)$.
- Distinguish between auxiliary space (algorithm memory overhead) and input space.
- Apply formal mathematical definitions ($c, n_0$) to prove Big-O ($O$), Big-Omega ($\Omega$), and Big-Theta ($\Theta$) bounds.
- Eliminate the common misconception that conflates input scenarios (Best/Worst/Average case) with asymptotic bounds ($O, \Omega, \Theta$).
- Apply the asymptotic Limit Test to evaluate relative growth rates across polynomial, exponential, and factorial functions.

---

## 1. Elementary Operations & Time Complexity Functions

Time complexity $T(n)$ quantifies the count of elementary machine operations executed by an algorithm as a function of the input size $n$.

### The Random Access Machine (RAM) Model
On the standard RAM model, each of the following elementary operations executes in uniform $O(1)$ time:
- Variable assignment: `x ← 10`
- Arithmetic operations: `+`, `-`, `*`, `/`, `%`
- Relational comparisons: `a < b`, `x == y`
- Array indexing: `A[i]`
- Pointer dereferencing: `node.next`
- Function call invocation and return frame management

### Step-by-Step Operation Counting Example

Consider an algorithm that sums an array $A$ of size $n$:

```text
ALGORITHM ArraySum(A, n)
1.  sum ← 0                      // Cost c₁, executes 1 time
2.  i ← 0                        // Cost c₂, executes 1 time
3.  while i < n:                 // Cost c₃, executes (n + 1) times (including terminating check)
4.      sum ← sum + A[i]         // Cost c₄, executes n times
5.      i ← i + 1                // Cost c₅, executes n times
6.  return sum                   // Cost c₆, executes 1 time
```

#### Total Computational Cost Function:
$$T(n) = c_1(1) + c_2(1) + c_3(n + 1) + c_4(n) + c_5(n) + c_6(1)$$
$$T(n) = (c_3 + c_4 + c_5)n + (c_1 + c_2 + c_3 + c_6)$$
$$T(n) = an + b \quad (a > 0, b > 0)$$

As $n \to \infty$, the lower-order term $b$ and the constant coefficient $a$ become insignificant relative to the linear growth rate. Thus, $T(n) \in \Theta(n)$.

---

## 2. Space Complexity: Auxiliary vs Input Memory

Space complexity $S(n)$ quantifies the total physical memory consumed by an algorithm as a function of input size $n$.

$$\text{Total Space} = \text{Input Space} + \text{Auxiliary Space}$$

| Memory Category | Description | Examples |
| :--- | :--- | :--- |
| **Input Space** | Memory allocated to store the original input dataset before execution begins. | The $n$ elements in array `A`, the graph adjacency list $G=(V, E)$. |
| **Auxiliary Space** | Extra memory allocated dynamically by the algorithm during execution. | Loop variables ($O(1)$), recursive call stack frames ($O(h)$), temporary merge buffers ($O(n)$). |

> **Key Architectural Takeaway**: When evaluating whether an algorithm is **in-place** (such as QuickSort, HeapSort, or in-place array reversal), we analyze **Auxiliary Space**. QuickSort uses $O(n)$ total space (to hold input data), but operates with $O(\log n)$ auxiliary space for recursive stack frames.

---

## 3. Asymptotic Notations: Big-O, Big-Omega, and Big-Theta

Asymptotic notation abstracts away machine constants and low-order terms, focusing entirely on growth rate dominance.

| Notation | Formal Mathematical Definition | Envelope Role | Practical Guarantee |
| :---: | :--- | :--- | :--- |
| $O(g(n))$ | $0 \le f(n) \le c \cdot g(n) \quad \forall n \ge n_0 \ (c > 0, n_0 \ge 1)$ | **Upper Bound** ($\le$) | Runtime will not exceed a constant multiple of $g(n)$. |
| $\Omega(g(n))$ | $0 \le c \cdot g(n) \le f(n) \quad \forall n \ge n_0 \ (c > 0, n_0 \ge 1)$ | **Lower Bound** ($\ge$) | Runtime will require at least a constant multiple of $g(n)$. |
| $\Theta(g(n))$ | $c_1 g(n) \le f(n) \le c_2 g(n) \quad \forall n \ge n_0 \ (c_1, c_2 > 0)$ | **Tight Bound** ($=$) | Runtime is strictly trapped between $c_1 g(n)$ and $c_2 g(n)$. |
| $o(g(n))$ | $\lim_{n \to \infty} \frac{f(n)}{g(n)} = 0$ | **Strict Upper Bound** ($<$) | $f(n)$ grows strictly slower than $g(n)$. |
| $\omega(g(n))$ | $\lim_{n \to \infty} \frac{f(n)}{g(n)} = \infty$ | **Strict Lower Bound** ($>$) | $f(n)$ grows strictly faster than $g(n)$. |

### Formal Sandwich Theorem
$$f(n) \in \Theta(g(n)) \iff f(n) \in O(g(n)) \quad \text{and} \quad f(n) \in \Omega(g(n))$$

### Formal Proof Example: Proving $f(n) \in O(n^2)$

**Theorem**: Prove that $f(n) = 3n^2 + 5n + 8$ is $O(n^2)$.

**Proof**:
We seek positive constants $c$ and $n_0$ such that $3n^2 + 5n + 8 \le c \cdot n^2$ for all $n \ge n_0$.
For all $n \ge 1$:
$$5n \le 5n^2$$
$$8 \le 8n^2$$
Summing terms:
$$3n^2 + 5n + 8 \le 3n^2 + 5n^2 + 8n^2 = 16n^2 \quad (\forall n \ge 1)$$
Choosing $c = 16$ and $n_0 = 1$, the inequality holds.  
$\therefore 3n^2 + 5n + 8 \in O(n^2)$. $\blacksquare$

---

## 4. Input Scenarios: Best, Worst, and Average Cases

A pervasive misconception in computer science is equating Best Case with Big-Omega ($\Omega$), Worst Case with Big-O ($O$), and Average Case with Big-Theta ($\Theta$). 

- **Input Scenarios (Cases)** describe the configuration of the data presented to the algorithm.
- **Asymptotic Notations ($O, \Omega, \Theta$)** are mathematical bounds that apply to *any* case.

| Scenario | Definition | Concrete Example (QuickSort) |
| :--- | :--- | :--- |
| **Best Case** | The input instance that triggers the minimal number of operations. | Median pivot chosen at every level: $\Theta(n \log n)$ |
| **Worst Case** | The input instance that triggers the maximum number of operations. | Sorted array with extremum pivot: $\Theta(n^2)$ |
| **Average Case** | The expected number of operations over all permutations of size $n$: $T_{\text{avg}}(n) = \sum P(I) \cdot T(I)$ | Uniform random permutations: $\Theta(n \log n)$ |

---

## 5. The Asymptotic Dominance Hierarchy & Limit Tests

When comparing two complexity functions $f(n)$ and $g(n)$ as $n \to \infty$, evaluate the limit of their ratio:

$$\lim_{n \to \infty} \frac{f(n)}{g(n)} = \begin{cases} 
0 & \implies f(n) \in o(g(n)) \quad (g(n) \text{ dominates}) \\
c \in (0, \infty) & \implies f(n) \in \Theta(g(n)) \quad (\text{equivalent growth rates}) \\
\infty & \implies f(n) \in \omega(g(n)) \quad (f(n) \text{ dominates})
\end{cases}$$

### Universal Dominance Sequence

$$O(1) \ll O(\log \log n) \ll O(\log n) \ll O(\sqrt{n}) \ll O(n) \ll O(n \log n) \ll O(n^2) \ll O(n^3) \ll O(2^n) \ll O(n!) \ll O(n^n)$$

| Function Class | Asymptotic Order | Practical Threshold for 1-Second Limit ($\approx 10^8$ ops) |
| :--- | :--- | :--- |
| Constant | $O(1)$ | Unlimited ($n \le 10^{18}$) |
| Logarithmic | $O(\log n)$ | Unlimited ($n \le 10^{18}$) |
| Sublinear | $O(\sqrt{n})$ | Very Large ($n \le 10^{12}$) |
| Linear | $O(n)$ | Large ($n \le 10^8$) |
| Linearithmic | $O(n \log n)$ | Medium-Large ($n \le 10^6$) |
| Quadratic | $O(n^2)$ | Moderate ($n \le 5,000$) |
| Cubic | $O(n^3)$ | Small ($n \le 400$) |
| Exponential | $O(2^n)$ | Micro ($n \le 22$) |
| Factorial | $O(n!)$ | Tiny ($n \le 11$) |

---

## 6. Key Takeaways

- **RAM Step Counts**: Time complexity evaluates primitive hardware operations rather than clock cycles, isolating algorithmic quality from system specifications.
- **Auxiliary Space Metric**: When assessing in-place space complexity, isolate auxiliary heap/stack allocations from initial input storage.
- **Cases vs Bounds**: Scenarios (Best, Worst, Average) describe input data states; bounds ($O, \Omega, \Theta$) provide the mathematical envelopes for those states.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 3: Characterizing Running Times. MIT Press.
2. **Knuth, D. E.** (1976). *Big Omicron and big Omega and big Theta*. ACM SIGACT News, 8(2), 18–24.
3. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.4: Analysis of Algorithms. Addison-Wesley.
