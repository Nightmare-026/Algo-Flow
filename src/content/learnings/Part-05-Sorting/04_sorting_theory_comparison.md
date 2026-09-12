# ⚖️ Part 05: Sorting — Module 04: Sorting Theory, Stability & The $\Omega(n \log n)$ Lower Bound

> **Topics Covered:**  
> 59. Sorting Stability & Multi-Key Sorting &bull; 60. In-Place vs Out-of-Place Sorting Paradigms &bull; 61. The Decision Tree Model & Proof of $\Omega(n \log n)$ Comparison Bound &bull; 62. Complete Master Sorting Comparison Matrix

---

# TOPIC 59: SORTING STABILITY

### 1. Definition
A sorting algorithm is defined as **Stable** if and only if two elements with equal keys appear in the output sorted array in the **exact same relative order** that they occupied in the original input array:

$$\text{If } A[i] = A[j] \text{ and } i < j \text{ in input}, \implies \text{Index}(A[i]) < \text{Index}(A[j]) \text{ in output.}$$

```text
ORIGINAL INPUT:   [ ("Alice", 25), ("Bob", 20), ("Charlie", 25) ]
                          ▲                           ▲
                          │ Equal Age (25)            │
STABLE OUTPUT:     [ ("Bob", 20), ("Alice", 25), ("Charlie", 25) ]  ✅ Alice before Charlie preserved!
UNSTABLE OUTPUT:   [ ("Bob", 20), ("Charlie", 25), ("Alice", 25) ]  ❌ Order inverted!
```

---

### 2. Why Does Stability Matter in Real-World Systems?
Consider sorting a database table of employees:
1. First, you sort by **First Name** (alphabetical).
2. Next, you sort by **Department**.
- **If the second sort is Stable**: Employees within each department will *remain sorted alphabetically by first name*!
- **If the second sort is Unstable**: The previous alphabetical order is scrambled and destroyed.

---

### 3. Stability Classification of All Sorting Algorithms

| Stable Algorithms (Preserve Order) | Unstable Algorithms (Scramble Order) |
| :--- | :--- |
| • **Bubble Sort** (adjacent swaps only) | • **Selection Sort** (long-distance swap jumps) |
| • **Insertion Sort** (shifts stop at equal key) | • **Quick Sort** (partitioning swaps over equal keys) |
| • **Merge Sort** (favors left subarray on tie) | • **Heap Sort** (heapify tree swaps destroy order) |
| • **Counting Sort** (backward scan from $n-1$) | |
| • **Radix Sort** (relies on stable digit sorter)| |
| • **Bucket Sort** (relies on stable sub-sorters) | |

---
---

# TOPIC 60: IN-PLACE SORTING

### 1. Definition
An algorithm is **In-Place** if it modifies the input array directly without requiring substantial auxiliary memory. In strict computational theory:

$$\text{Auxiliary Space } S(n) \le O(\log n)$$

*(The $O(\log n)$ allowance accounts for recursive call stack frames, as in QuickSort).*

### 2. Classification
- **In-Place Sorts**: Bubble Sort ($O(1)$), Selection Sort ($O(1)$), Insertion Sort ($O(1)$), Quick Sort ($O(\log n)$), Heap Sort ($O(1)$).
- **Out-of-Place Sorts**: Merge Sort ($O(n)$ buffer), Counting Sort ($O(n+k)$), Radix Sort ($O(n+b)$), Bucket Sort ($O(n)$).

---
---

# TOPIC 61: THE $\Omega(n \log n)$ COMPARISON LOWER BOUND

### 1. Problem Statement
Can any comparison-based sorting algorithm ever run in $O(n)$ or $O(n \log \log n)$ time in the worst case?  
**Theorem**: Any comparison-based sorting algorithm must make at least **$\mathbf{\Omega(n \log n)}$ comparisons** in the worst case.

---

### 2. The Decision Tree Model Proof

```text
DECISION TREE FOR SORTING 3 ELEMENTS <a₁, a₂, a₃>:
Each internal node is a comparison (aᵢ : aⱼ).
Each leaf is a unique permutation of the sorted sequence.

                         [ a₁ : a₂ ]
                        /           \
                     ≤ /             \ >
              [ a₂ : a₃ ]           [ a₁ : a₃ ]
               /       \             /       \
            ≤ /         \ >       ≤ /         \ >
           ...          ...       ...         ...
            │            │         │           │
          Leaves: Total number of possible permutations = 3! = 6 leaves
```

#### Step-by-Step Formal Mathematical Proof:
1. **Permutations**: An array of $n$ distinct elements has exactly $n!$ possible permutations.
2. **Leaves**: To be correct for every possible input, the decision tree must contain at least one leaf for each permutation. Thus, the number of leaves $L$ satisfies:
$$L \ge n!$$
3. **Height and Leaves**: A binary tree of height $h$ can have at most $2^h$ leaves:
$$L \le 2^h$$
4. Combining inequalities:
$$2^h \ge L \ge n! \implies 2^h \ge n!$$
5. Taking the base-2 logarithm of both sides:
$$h \ge \log_2(n!)$$
6. By **Stirling's Approximation** ($n! \approx \sqrt{2\pi n} \left(\frac{n}{e}\right)^n$):
$$\log_2(n!) = \sum_{i=1}^{n} \log_2 i \ge \sum_{i=\lceil n/2 \rceil}^{n} \log_2 \left(\frac{n}{2}\right) \ge \frac{n}{2} \log_2 \left(\frac{n}{2}\right) = \frac{n}{2} (\log_2 n - 1) = \Omega(n \log n)$$

$$\therefore \text{Height } h \ge \mathbf{\Omega(n \log n)}$$

Since the height $h$ represents the maximum number of comparisons on the longest execution path (the worst-case runtime), **no comparison-based sort can beat $\Omega(n \log n)$**. $\blacksquare$

---
---

# TOPIC 62: COMPLETE SORTING COMPARISON MASTER TABLE

| Algorithm | Best Time | Average Time | Worst Time | Auxiliary Space | In-Place? | Stable? | Adaptive? | Best Real-World Use Case |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Bubble Sort** | $\Theta(n)$ | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes | **Yes** | Yes | Educational concepts; tiny lists |
| **Selection Sort** | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes | **No** | No | Minimizing EEPROM/Flash memory writes |
| **Insertion Sort** | $\Theta(n)$ | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes | **Yes** | **Yes** | Small arrays ($n \le 32$) & nearly sorted data |
| **Merge Sort** | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n)$ | **No** | **Yes** | No | Linked lists, external disk sorting, Java objects |
| **Quick Sort** | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n^2)$ | $\Theta(\log n)$ | Yes | **No** | No | Default general-purpose in-memory primitive sort |
| **Heap Sort** | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(1)$ | Yes | **No** | No | Systems with strict guaranteed memory & time bounds |
| **Counting Sort** | $\Theta(n + k)$ | $\Theta(n + k)$ | $\Theta(n + k)$ | $\Theta(n + k)$ | **No** | **Yes** | No | Keys in small bounded integer range ($k = O(n)$) |
| **Radix Sort** | $\Theta(d(n+b))$ | $\Theta(d(n+b))$ | $\Theta(d(n+b))$ | $\Theta(n+b)$ | **No** | **Yes** | No | Fixed-length keys (integers, strings, UUIDs) |
| **Bucket Sort** | $\Theta(n + k)$ | $\Theta(n + k)$ | $\Theta(n^2)$ | $\Theta(n + k)$ | **No** | **Yes** | No | Uniformly distributed floating point numbers |

---

## 🔁 Module 04 Summary & Key Takeaways

1. **Stability** ensures equal keys retain original relative positions; vital for multi-column spreadsheet and database sorting.
2. By the **Decision Tree Model**, comparison sorting has an absolute mathematical lower bound of **$\Omega(n \log n)$**.
3. Non-comparison sorts (Counting, Radix, Bucket) achieve $O(n)$ linear time by exploiting structural properties of the keys rather than pairwise comparisons.

---
[⬅️ Previous: Module 03 — Linear Time Sorts](file:///d:/DSA/Part-05-Sorting/03_linear_time_sorts.md) | [Next: Part 06 — Trees ➡️](file:///d:/DSA/Part-06-Trees/01_tree_fundamentals.md)
