# Part 08: Algorithm Design Techniques — Module 01: Brute Force & Divide and Conquer

> **Topics Covered:**  
> 121. Brute Force & Exhaustive Search Paradigms &bull; 122. Divide and Conquer Paradigm (Subproblem Independence & Watershed Recurrences)

---

## Assessable Learning Objectives

Upon completing this chapter, you will be able to:
1. **Analyze Combinatorial Search Spaces**: Derive exact state-space bounds ($O(2^n), O(n!)$) and prove when exhaustive search becomes physically intractable.
2. **Verify Subproblem Independence**: Formulate the structural independence criterion and recognize when overlapping subproblems mandate dynamic programming.
3. **Apply the Master Theorem**: Solve recurrences of the form $T(n) = aT(n/b) + f(n)$ rigorously across all three watershed cases.
4. **Trace Karatsuba's Multiplication**: Execute the 3-multiplication divide-and-conquer algorithm step-by-step and contrast its operation count against the classical $\Theta(n^2)$ schoolbook method.

---

# TOPIC 121: BRUTE FORCE & EXHAUSTIVE SEARCH

### 1. Definition & Theoretical Foundations

**Brute Force (Exhaustive Search)** is an algorithmic paradigm that systematically enumerates every candidate in a problem's solution space $\mathcal{S}$ and evaluates each against the problem constraints until an optimal or satisfying solution is found.

$$\text{BruteForce}(\mathcal{S}) = \arg \max_{s \in \mathcal{S}} \Big\{ f(s) \;\Big|\; \text{Valid}(s) = \text{true} \Big\}$$

While conceptually straightforward, brute force provides an indispensable foundation:
- **Oracle for Testing**: Provides the ground-truth reference implementation against which optimized heuristics and DP formulations are verified via property-based testing.
- **Small-Input Optimality**: For tiny problem sizes ($n \le 8$), simple loops without branch mispredictions or dynamic memory allocation frequently outperform asymptotic winners.

---

### 2. Search Space Growth Dynamics

The primary constraint on brute force is the combinatorial explosion of the state space $\mathcal{S}$:

| Search Space Topology | Canonical Problem | State Space Size $|\mathcal{S}|$ | Growth Rate | Practical Limit ($t \le 1\text{s}$) |
| :--- | :--- | :---: | :---: | :---: |
| **All Pairs** | 2-Sum, Closest Pair | $\frac{n(n-1)}{2}$ | $\Theta(n^2)$ | $n \approx 50,000$ |
| **All Triples** | 3-Sum, Triangle Listing | $\frac{n(n-1)(n-2)}{6}$ | $\Theta(n^3)$ | $n \approx 1,500$ |
| **Power Set (Subsets)** | 0/1 Knapsack, Subset Sum | $2^n$ | $\Theta(2^n)$ | $n \approx 28$ |
| **Permutations** | Traveling Salesperson (TSP) | $n!$ | $\Theta(n!)$ | $n \approx 11$ |
| **Graph Partitions** | Graph Coloring, Max Cut | $k^n$ | $\Theta(k^n)$ | $n \approx 18$ ($k=3$) |

For $n = 30$:
- $2^{30} \approx 1.07 \times 10^9$ operations ($\approx 1\text{ second}$ on modern 3 GHz hardware).
- $30! \approx 2.65 \times 10^{32}$ operations (exceeds $10^{15}$ years of continuous computation).

---

# TOPIC 122: DIVIDE AND CONQUER PARADIGM

### 1. The Three Structural Phases

Divide-and-conquer designs solve problems recursively through three strictly defined steps:

```text
                             Original Problem P (Size n)
                                          │
                  ┌───────────────────────┴───────────────────────┐
                  ▼                                               ▼
         Subproblem P₁ (Size n/b)                        Subproblem P₂ (Size n/b)
                  │                                               │
           (Recursive Call)                                (Recursive Call)
                  ▼                                               ▼
             Solution S₁                                     Solution S₂
                  │                                               │
                  └───────────────────────┬───────────────────────┘
                                          ▼
                             Combined Solution S (Merge)
```

1. **Divide**: Split the problem into $a$ smaller subproblems of size $n/b$, where $a \ge 1$ and $b > 1$.
2. **Conquer**: Solve each subproblem recursively. When subproblems reach base size $n \le n_0$, solve them directly.
3. **Combine**: Merge the $a$ subproblem solutions into the unified solution for $P$ using $f(n)$ auxiliary work.

---

### 2. The Invariant of Subproblem Independence

A problem is solvable via Divide-and-Conquer if and only if:

$$\text{Subproblems } P_1, P_2, \dots, P_a \text{ share no mutable state and are completely independent.}$$

- **Independent Subproblems**: Solutions to $P_1$ do not affect or recalculate work in $P_2$. Examples: Merge Sort, Binary Search, Karatsuba Multiplication.
- **Overlapping Subproblems**: Subproblems compute identical states repeatedly (e.g., $F(n-1)$ and $F(n-2)$ both evaluating $F(n-3)$). If subproblems overlap, divide-and-conquer degrades to $\Omega(2^n)$; the algorithm must be redesigned using **Dynamic Programming**.

---

### 3. The Master Theorem: General Recurrence Solver

For recurrences of the form:

$$T(n) = a T\left(\frac{n}{b}\right) + f(n)$$

where $a \ge 1$ is the number of subproblems, $b > 1$ is the subproblem reduction factor, and $f(n)$ is the work done to divide and combine at the current level. Let $c_{\text{crit}} = \log_b a$ denote the critical exponent.

| Case | Condition on $f(n)$ | Dominant Cost Layer | Solution $T(n)$ | Example Algorithm |
| :--- | :--- | :--- | :--- | :--- |
| **Case 1** | $f(n) = O(n^c)$ where $c < \log_b a$ | Tree Leaves dominate | $\Theta(n^{\log_b a})$ | Karatsuba ($a=3, b=2, c=1 \implies \Theta(n^{1.585})$) |
| **Case 2** | $f(n) = \Theta(n^{\log_b a} \log^k n)$ ($k \ge 0$) | Work is balanced across all levels | $\Theta(n^{\log_b a} \log^{k+1} n)$ | Merge Sort ($a=2, b=2, k=0 \implies \Theta(n \log n)$) |
| **Case 3** | $f(n) = \Omega(n^c)$ where $c > \log_b a$ and $a f(n/b) \le d f(n)$ for $d < 1$ | Root step dominates | $\Theta(f(n))$ | Median of Medians ($T(n) = T(n/5) + T(7n/10) + O(n)$) |

---

### 4. Step-by-Step Worked Dry Run: Karatsuba Integer Multiplication

Classical grade-school multiplication computes $n^2$ single-digit products. Anatoly Karatsuba (1960) discovered how to compute the product of two $n$-digit numbers using **only 3 recursive multiplications** instead of 4.

#### Mathematical Foundation
Given two $n$-digit integers $X$ and $Y$ base 10 (assume $n$ is even):
$$X = X_1 \cdot 10^{n/2} + X_0, \quad Y = Y_1 \cdot 10^{n/2} + Y_0$$
$$X \cdot Y = X_1 Y_1 \cdot 10^n + (X_1 Y_0 + X_0 Y_1) \cdot 10^{n/2} + X_0 Y_0$$

Let:
- $z_2 = X_1 \cdot Y_1$
- $z_0 = X_0 \cdot Y_0$
- $z_1 = (X_1 + X_0)(Y_1 + Y_0) - z_2 - z_0 = X_1 Y_0 + X_0 Y_1$

Final Assembly:
$$X \cdot Y = z_2 \cdot 10^n + z_1 \cdot 10^{n/2} + z_0$$

#### Worked Execution Trace: $X = 1234$, $Y = 5678$ ($n = 4$, $n/2 = 2$)

| Step | Operation | Formula | Calculation | Intermediate Result |
| :---: | :--- | :--- | :--- | :--- |
| **0** | Partition Input | $X_1, X_0 = \lfloor X / 10^2 \rfloor, X \pmod{10^2}$ | $X_1 = 12, \quad X_0 = 34$ | High/Low Halves split |
| **1** | Partition Input | $Y_1, Y_0 = \lfloor Y / 10^2 \rfloor, Y \pmod{10^2}$ | $Y_1 = 56, \quad Y_0 = 78$ | High/Low Halves split |
| **2** | Recursive Mult 1 ($z_2$) | $z_2 = X_1 \cdot Y_1$ | $12 \times 56$ | **$z_2 = 672$** |
| **3** | Recursive Mult 2 ($z_0$) | $z_0 = X_0 \cdot Y_0$ | $34 \times 78$ | **$z_0 = 2652$** |
| **4** | Intermediate Sums | $S_x = X_1 + X_0, \; S_y = Y_1 + Y_0$ | $12 + 34 = 46, \quad 56 + 78 = 134$ | Cross terms |
| **5** | Recursive Mult 3 ($P_3$) | $P_3 = S_x \cdot S_y$ | $46 \times 134$ | $P_3 = 6164$ |
| **6** | Gauss Identity ($z_1$) | $z_1 = P_3 - z_2 - z_0$ | $6164 - 672 - 2652 = 6164 - 3324$ | **$z_1 = 2840$** |
| **7** | Shift and Combine | $z_2 \cdot 10^4 + z_1 \cdot 10^2 + z_0$ | $6,720,000 + 284,000 + 2652$ | **$7,006,652$** |

**Verification**: $1234 \times 5678 = 7,006,652$. Direct evaluation confirms mathematical correctness.

---

### 5. Asymptotic Comparison: Watershed Divide-and-Conquer Recurrences

| Algorithm | Division Factor ($b$) | Subproblems ($a$) | Combine Work $f(n)$ | Recurrence | Asymptotic Complexity | Speedup vs Elementary |
| :--- | :---: | :---: | :---: | :--- | :---: | :--- |
| **Binary Search** | 2 | 1 | $O(1)$ | $T(n) = T(n/2) + O(1)$ | $\Theta(\log n)$ | Exponential vs $O(n)$ |
| **Merge Sort** | 2 | 2 | $O(n)$ | $T(n) = 2T(n/2) + O(n)$ | $\Theta(n \log n)$ | Quadratic vs $O(n^2)$ |
| **Karatsuba Mult** | 2 | 3 | $O(n)$ | $T(n) = 3T(n/2) + O(n)$ | $\Theta(n^{\log_2 3}) \approx \Theta(n^{1.585})$ | $O(n^{1.585})$ vs $O(n^2)$ |
| **Strassen Matrix** | 2 | 7 | $O(n^2)$ | $T(n) = 7T(n/2) + O(n^2)$ | $\Theta(n^{\log_2 7}) \approx \Theta(n^{2.807})$ | $O(n^{2.807})$ vs $O(n^3)$ |

---

### 6. Edge Cases & Common Pitfalls

1. **Integer Overflow in Partitioning**: When splitting large integers or calculating midpoint `mid = (low + high) / 2`, integer overflow can occur. Always compute `mid = low + (high - low) / 2`.
2. **Base Case Failure**: If the recursive base case does not terminate on $n \le 1$ or $n \le 2$, infinite recursive expansion exhausts the execution call stack.
3. **Subproblem Imbalance**: If the problem is divided unevenly ($T(n) = T(n-1) + O(1)$), divide-and-conquer collapses into linear recursion, destroying logarithmic performance (e.g., Quicksort with an extreme pivot).

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 4: Divide-and-Conquer. MIT Press.
2. **Karatsuba, A., & Ofman, Y.** (1962). Multiplication of Many-Digital Numbers by Automata. *Proceedings of the USSR Academy of Sciences*, 145(2), 293-294.
3. **Strassen, V.** (1969). Gaussian elimination is not optimal. *Numerische Mathematik*, 13(4), 354-356.
4. **Kleinberg, J., & Tardos, É.** (2006). *Algorithm Design*, Chapter 5: Divide and Conquer. Pearson.
