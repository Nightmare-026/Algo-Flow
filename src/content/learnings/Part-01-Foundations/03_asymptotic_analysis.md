# Part 01: Foundations — Module 03: Asymptotic Analysis & Growth of Functions

> **Topics Covered:**  
> 10. Time Complexity & Counting Primitive Operations &bull; 11. Space Complexity (Auxiliary vs Total) &bull; 12. Big-O Notation ($O$) &bull; 13. Big-Omega Notation ($\Omega$) &bull; 14. Big-Theta Notation ($\Theta$) &bull; 15. Best, Average, and Worst Case Analyses &bull; 16. Asymptotic Hierarchy & Growth of Functions

---

## 10. Time Complexity & Counting Operations

### Concept
**Time Complexity** is not the wall-clock time (seconds or milliseconds) an algorithm takes to run. Wall-clock time varies wildly depending on processor clock speed, operating system scheduling, compiler optimizations, and background processes.

Instead, **Time Complexity $T(n)$** is a mathematical function that quantifies the **number of elementary operations** executed by an algorithm as a function of the input size $n$.

### What Counts as an Elementary Operation?
An elementary (primitive) operation executes in constant time ($O(1)$) on the Random Access Machine (RAM) model:
- Assigning a value to a variable: `x ← 10`
- Arithmetic operations: `+`, `-`, `*`, `/`, `%`
- Comparison between two values: `a < b`
- Array index dereference: `A[i]`
- Pointer dereference: `node.next`
- Function call invocation and return

### Step-by-Step Operation Counting Example

Consider the algorithm to compute the sum of an array $A$ of size $n$:

```text
ALGORITHM ArraySum(A, n)
1.  sum ← 0                      // Cost c₁, executes 1 time
2.  i ← 0                        // Cost c₂, executes 1 time
3.  while i < n:                 // Cost c₃, executes (n + 1) times (including final false check)
4.      sum ← sum + A[i]         // Cost c₄, executes n times
5.      i ← i + 1                // Cost c₅, executes n times
6.  return sum                   // Cost c₆, executes 1 time
```

#### Total Computational Cost Function:
$$T(n) = c_1(1) + c_2(1) + c_3(n + 1) + c_4(n) + c_5(n) + c_6(1)$$
$$T(n) = (c_3 + c_4 + c_5)n + (c_1 + c_2 + c_3 + c_6)$$
$$T(n) = an + b \quad (\text{where } a, b \text{ are constants})$$

As $n \to \infty$, the constant $b$ and coefficient $a$ become insignificant relative to the linear growth rate. Thus, $T(n)$ grows **linearly**: $O(n)$.

---

## 11. Space Complexity: Auxiliary vs Total Memory

### Concept
**Space Complexity $S(n)$** measures the total memory required by the algorithm with respect to input size $n$.

### Critical Architectural Distinction

$$\text{Total Space Complexity} = \text{Input Space} + \text{Auxiliary Space}$$

1. **Input Space**: The memory allocated to store the original input data (e.g., storing the input array of $n$ elements requires $O(n)$ space).
2. **Auxiliary Space**: The extra temporary memory allocated by the algorithm *excluding* the input space (e.g., temporary variables, dynamically allocated buffers, and recursion call stack frames).

> ⚠️ **COMMON MISTAKE**: When an interviewer or exam asks for the space complexity of an in-place sorting algorithm (like QuickSort or HeapSort), they are asking for **Auxiliary Space**. QuickSort uses $O(n)$ total space (to store the array), but requires $O(\log n)$ auxiliary space for recursive stack frames.

```text
┌────────────────────────────────────────────────────────────────────────┐
│ TOTAL MEMORY ALLOCATION                                                │
│ ┌────────────────────────────────────┐┌──────────────────────────────┐ │
│ │ INPUT SPACE                        ││ AUXILIARY SPACE              │ │
│ │ Array A[0...n-1]: O(n)             ││ • Temp variables: O(1)       │ │
│ │ (Allocated prior to function call) ││ • Recursive Call Stack: O(h) │ │
│ │                                    ││ • Dynamic Buffers: O(k)      │ │
│ └────────────────────────────────────┘└──────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Big-O ($O$) Notation: Asymptotic Upper Bound

### Concept & Formal Definition
Big-O characterizes the **worst-case rate of growth** (upper bound). It guarantees that the function will never grow faster than a constant multiple of $g(n)$ for sufficiently large $n$.

$$\mathcal{O}(g(n)) = \left\{ f(n) : \exists \, c > 0 \text{ and } n_0 \ge 1 \text{ such that } 0 \le f(n) \le c \cdot g(n) \text{ for all } n \ge n_0 \right\}$$

```text
    T(n) ▲
         │                                       c · g(n)  [Upper Bound]
         │                                     /
         │                                   /
         │                       f(n)      /
         │                         \     /
         │                           \ /
         │                           / \
         │                         /     \
         │                       /         \
         │                     /             f(n) ≤ c · g(n)
         │                   /
         └─────────────────┬──────────────────────────────────────────► n
                          n₀
                     (Threshold)
```

### Intuition
$c \cdot g(n)$ acts as a "ceiling". Past the point $n_0$, $f(n)$ is trapped permanently beneath $c \cdot g(n)$.

### Formal Mathematical Proof Example
**Theorem**: Prove that $f(n) = 3n^2 + 5n + 8$ is $O(n^2)$.

**Proof**:
We must find positive constants $c$ and $n_0$ such that $3n^2 + 5n + 8 \le c \cdot n^2$ for all $n \ge n_0$.
For any $n \ge 1$:
$$5n \le 5n^2$$
$$8 \le 8n^2$$
Therefore:
$$3n^2 + 5n + 8 \le 3n^2 + 5n^2 + 8n^2 = 16n^2 \quad (\forall n \ge 1)$$
Choosing $c = 16$ and $n_0 = 1$, the condition $f(n) \le c \cdot g(n)$ holds.  
$\therefore 3n^2 + 5n + 8 \in O(n^2)$. $\blacksquare$

---

## 13. Big-Omega ($\Omega$) Notation: Asymptotic Lower Bound

### Concept & Formal Definition
Big-Omega characterizes the **asymptotic lower bound**. It guarantees that an algorithm will take *at least* a constant multiple of $g(n)$ steps for large $n$.

$$\Omega(g(n)) = \left\{ f(n) : \exists \, c > 0 \text{ and } n_0 \ge 1 \text{ such that } 0 \le c \cdot g(n) \le f(n) \text{ for all } n \ge n_0 \right\}$$

```text
    T(n) ▲                                       f(n)
         │                                     /
         │                       c · g(n)    /
         │                         \       /
         │                           \   /
         │                             x
         │                           /   \
         │                         /       c · g(n) ≤ f(n)  [Lower Bound]
         │                       /
         └─────────────────────┬──────────────────────────────────────► n
                              n₀
```

### Intuition
$c \cdot g(n)$ is the "floor". Past $n_0$, the algorithm's runtime will never fall below this line.

---

## 14. Big-Theta ($\Theta$) Notation: Asymptotically Tight Bound

### Concept & Formal Definition
Big-Theta characterizes the **tight bound**. An algorithm is $\Theta(g(n))$ if and only if $g(n)$ is simultaneously its upper bound ($O$) and its lower bound ($\Omega$).

$$\Theta(g(n)) = \left\{ f(n) : \exists \, c_1 > 0, c_2 > 0, n_0 \ge 1 \text{ such that } 0 \le c_1 \cdot g(n) \le f(n) \le c_2 \cdot g(n) \text{ for all } n \ge n_0 \right\}$$

$$\mathbf{Theorem}: \quad f(n) = \Theta(g(n)) \iff f(n) = O(g(n)) \quad \mathbf{and} \quad f(n) = \Omega(g(n))$$

```text
    T(n) ▲                                       c₂ · g(n)  [Upper Envelope]
         │                                     /
         │                       f(n)        /
         │                         \       /
         │                           \   /   f(n)  [Trapped Function]
         │                             x
         │                           /   \
         │                         /       c₁ · g(n)  [Lower Envelope]
         │                       /
         └─────────────────────┬──────────────────────────────────────► n
                              n₀
```

---

## 15. Best, Average, and Worst Case Analyses

> ⚠️ **CRITICAL CONFUSION DEBUNKED**:  
> Many students mistakenly equate:
> - Best Case with Big-Omega ($\Omega$) ❌
> - Worst Case with Big-O ($O$) ❌
> - Average Case with Big-Theta ($\Theta$) ❌
>
> **This is completely false!**  
> - **Cases (Best, Average, Worst)** describe the **nature of the input instance**.
> - **Asymptotic Notations ($O, \Omega, \Theta$)** are **mathematical bounds** that can be applied to *any* case!
> - For example, the **Worst-Case runtime of QuickSort** is $\Theta(n^2)$. The **Best-Case runtime of QuickSort** is $\Theta(n \log n)$.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ INPUT SCENARIOS (CASES)                                                     │
├───────────────────┬─────────────────────────────────────────────────────────┤
│ BEST CASE         │ The specific input configuration that produces the      │
│                   │ minimum number of operations (e.g., element found at    │
│                   │ index 0 in Linear Search: 1 comparison = Θ(1)).         │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ WORST CASE        │ The specific input configuration that triggers the      │
│                   │ maximum number of operations (e.g., element not present │
│                   │ in Linear Search: n comparisons = Θ(n)).                │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ AVERAGE CASE      │ Expected runtime over all possible inputs of size n     │
│                   │ weighted by their probability distribution:             │
│                   │ T_avg(n) = ∑ P(I) · T(I)                                │
└───────────────────┴─────────────────────────────────────────────────────────┘
```

---

## 16. Asymptotic Hierarchy & Growth Rates

When evaluating functions as $n \to \infty$, use the **Limit Test**:
$$\lim_{n \to \infty} \frac{f(n)}{g(n)} = \begin{cases} 
0 & \implies f(n) \text{ is asymptotically strictly smaller: } f(n) \in o(g(n)) \\
c > 0 & \implies f(n) \text{ and } g(n) \text{ grow at identical rates: } f(n) \in \Theta(g(n)) \\
\infty & \implies f(n) \text{ is asymptotically strictly larger: } f(n) \in \omega(g(n))
\end{cases}$$

### The Universal Hierarchy of Dominance

$$O(1) \ll O(\log \log n) \ll O(\log n) \ll O(n^c) \ (0 < c < 1) \ll O(n) \ll O(n \log n) \ll O(n^2) \ll O(n^k) \ll O(2^n) \ll O(n!) \ll O(n^n)$$

```text
Operations ▲
           │                                                                    n!
           │                                                                 / 2ⁿ
           │                                                          n²   /  /
           │                                                       /     /   /
           │                                                n log n     /   /
           │                                             /            /    /
           │                                           /             /    /
           │                                        n /             /    /
           │                                      /  /             /    /
           │                               log n /  /             /    /
           │                         ___________/  /             /    /
           │              O(1) ─────┴─────────────┴─────────────┴────┴──────────►
           └─────────────────────────────────────────────────────────────────── Input Size n
```

---

## Module 03 Summary & Key Takeaways

1. **Time Complexity** measures abstract step count; **Auxiliary Space** measures extra memory beyond the original input.
2. **Big-O** is an asymptotic upper bound ($\le$); **Big-Omega** is an asymptotic lower bound ($\ge$); **Big-Theta** is a tight sandwich ($\le \text{and} \ge$).
3. **Cases $\ne$ Bounds**: Best, Average, and Worst cases are distinct *inputs*; $O, \Omega, \Theta$ are mathematical *envelopes*.
4. Any algorithm with exponential ($2^n$) or factorial ($n!$) complexity becomes unrunnable for $n > 30$.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 3: Characterizing Running Times. MIT Press.
2. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.4: Analysis of Algorithms. Addison-Wesley.
3. **Sipser, M.** (2012). *Introduction to the Theory of Computation* (3rd ed.). Cengage Learning.
