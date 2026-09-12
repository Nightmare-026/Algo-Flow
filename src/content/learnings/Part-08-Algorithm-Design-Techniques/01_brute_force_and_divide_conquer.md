# 🧠 Part 08: Algorithm Design Techniques — Module 01: Brute Force & Divide and Conquer

> **Topics Covered:**  
> 121. Brute Force & Exhaustive Search Paradigms &bull; 122. Divide and Conquer Paradigm (Subproblem Independence & Watershed Recurrences)

---

# TOPIC 121: BRUTE FORCE & EXHAUSTIVE SEARCH

### 1. Definition
**Brute Force (Generate-and-Test / Exhaustive Search)** is a straightforward, direct approach to solving a problem based on the problem statement and definitions of the concepts involved. It systematically enumerates every single possible candidate solution in the search space and evaluates whether each candidate satisfies the problem constraints.

---

### 2. Search Space Growth Dynamics
The fundamental limitation of Brute Force is the combinatorial explosion of the search space $\mathcal{S}$:

```text
SEARCH SPACE TYPE            TYPICAL PROBLEM                 SIZE |S|          GROWTH RATE
─────────────────────────────────────────────────────────────────────────────────────────────
All Subsets / Power Set      0/1 Knapsack, Subset Sum        2ⁿ                Exponential: O(2ⁿ)
All Permutations / Orderings Traveling Salesperson (TSP)     n!                Factorial: O(n!)
All Pairs of Elements        Closest Pair of Points          n(n-1)/2          Polynomial: O(n²)
All Triples of Elements      3-Sum Problem                   n(n-1)(n-2)/6     Polynomial: O(n³)
```

For $n = 30$:
- $2^{30} \approx 1,073,741,824$ operations ($\approx 10\text{ seconds}$ on modern CPU).
- $30! \approx 2.65 \times 10^{32}$ operations (would take billions of years to evaluate!).

---

### 3. Why is Brute Force Valuable?
1. **Universality**: Requires zero clever mathematical insight.
2. **Oracle for Testing**: Serves as the gold standard ground truth for unit testing optimized algorithms against random test cases.
3. **Small Inputs**: For tiny input sizes ($n \le 10$), an $O(n!)$ brute-force solution often runs faster than an elaborate $O(n)$ algorithm due to low constant factors and absence of cache misses.

---
---

# TOPIC 122: DIVIDE AND CONQUER PARADIGM

### 1. The Three Mandatory Phases
Divide and Conquer breaks a complex problem down recursively:
1. **Divide**: Partition the problem into two or more strictly smaller subproblems of the **exact same type**.
2. **Conquer**: Solve the subproblems recursively. If the subproblem size is small enough (base case), solve it directly.
3. **Combine**: Merge the solutions of the subproblems into the solution of the original problem.

```text
                                ORIGINAL PROBLEM (Size n)
                                            │
                    ┌───────────────────────┴───────────────────────┐
                    ▼                                               ▼
          SUBPROBLEM 1 (Size n/2)                         SUBPROBLEM 2 (Size n/2)
                    │                                               │
             (Solve Recursively)                             (Solve Recursively)
                    ▼                                               ▼
          SOLUTION 1                                      SOLUTION 2
                    │                                               │
                    └───────────────────────┬───────────────────────┘
                                            ▼
                                COMBINE INTO FINAL SOLUTION
```

---

### 2. The Golden Invariant: Subproblem Independence
Divide and Conquer is strictly viable **ONLY when subproblems are mutually independent** (they do not share or recalculate common components).
- If subproblems overlap (e.g., Fibonacci or Longest Common Subsequence), Divide and Conquer recalculates identical states repeatedly, resulting in an exponential $O(2^n)$ disaster.
- **When subproblems overlap, switch immediately to Dynamic Programming!**

---

### 3. Canonical Divide and Conquer Algorithms

#### A. Karatsuba Integer Multiplication
Standard grade-school multiplication of two $n$-digit numbers requires $\Theta(n^2)$ single-digit multiplications.  
Karatsuba divides each number into two halves of size $n/2$:
$$X = X_1 \cdot 10^{n/2} + X_0, \quad Y = Y_1 \cdot 10^{n/2} + Y_0$$
$$X \cdot Y = X_1 Y_1 \cdot 10^n + (X_1 Y_0 + X_0 Y_1) \cdot 10^{n/2} + X_0 Y_0$$
Using the algebraic identity:
$$X_1 Y_0 + X_0 Y_1 = (X_1 + X_0)(Y_1 + Y_0) - X_1 Y_1 - X_0 Y_0$$
Karatsuba reduces 4 subproblem multiplications to **just 3 multiplications**!
$$T(n) = 3T\left(\frac{n}{2}\right) + \Theta(n) \implies T(n) = \Theta(n^{\log_2 3}) \approx \mathbf{\Theta(n^{1.585})}$$

---

#### B. Strassen's Matrix Multiplication
Standard matrix multiplication of two $n \times n$ matrices takes $\Theta(n^3)$ operations.  
Strassen partitions each matrix into four $n/2 \times n/2$ submatrices and devises 7 specialized products instead of 8:
$$T(n) = 7T\left(\frac{n}{2}\right) + \Theta(n^2) \implies T(n) = \Theta(n^{\log_2 7}) \approx \mathbf{\Theta(n^{2.807})}$$

---

### 4. Recurrence Archetypes in Divide and Conquer

| Recurrence Form | Algorithm Example | Work at Each Level | Asymptotic Complexity |
| :--- | :--- | :---: | :---: |
| $T(n) = T(n/2) + O(1)$ | Binary Search | Shrinking work | $\Theta(\log n)$ |
| $T(n) = 2T(n/2) + O(n)$ | Merge Sort | Constant work per level ($c n$) | $\Theta(n \log n)$ |
| $T(n) = 2T(n/2) + O(1)$ | Tree Traversal | Leaf dominant | $\Theta(n)$ |
| $T(n) = 3T(n/2) + O(n)$ | Karatsuba Multiplication| Leaves dominate | $\Theta(n^{\log_2 3}) \approx O(n^{1.585})$ |
| $T(n) = 7T(n/2) + O(n^2)$| Strassen Matrix Mult | Leaves dominate | $\Theta(n^{\log_2 7}) \approx O(n^{2.807})$ |

---

## 🔁 Module 01 Summary & Key Takeaways

1. **Brute Force** enumerates the entire combinatorial space ($O(2^n), O(n!)$); ideal as an oracle for unit testing.
2. **Divide and Conquer** requires **independent subproblems**; splits problems into smaller replicas and combines their solutions.
3. If subproblems overlap, Divide and Conquer degrades exponentially; you must use **Dynamic Programming**.

---
[⬅️ Previous: Part 07 Graphs](file:///d:/DSA/Part-07-Graphs/06_spanning_trees_and_dsu.md) | [Next: Module 02 — Greedy Algorithms ➡️](file:///d:/DSA/Part-08-Algorithm-Design-Techniques/02_greedy_algorithms.md)
