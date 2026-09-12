# 📋 Part 11: Problem Bank & Revision — Module 09: Master Revision Sheets & Formula Reference

> **Topics Covered:**  
> 165. Master Complexity Tables &bull; 166. Mathematical Formula Sheet &bull; 167. 1-Minute Algorithm Decision Cheat Sheets &bull; 168. Final Comprehensive DSA Revision Map

---

# TOPIC 165: MASTER COMPLEXITY TABLES

### 1. Data Structures Operation Matrix

| Data Structure | Access by Index | Search by Value | Insertion | Deletion | Space Complexity | Best Use Case |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Static Array** | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | Known fixed size, cache speed |
| **Dynamic Array** | $\Theta(1)$ | $\Theta(n)$ | $O(1)^*$ amortized | $O(1)^*$ at end | $\Theta(n)$ | Unknown size, frequent appends |
| **Singly Linked List** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(1)$ at head | $\Theta(1)$ at head | $\Theta(n)$ | Frequent head inserts/deletes |
| **Doubly Linked List** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(1)$ both ends| $\Theta(1)$ given node | $\Theta(n)$ | LRU Cache, bidirectional scans |
| **Stack (LIFO)** | — | $\Theta(n)$ | $\Theta(1)$ [Push] | $\Theta(1)$ [Pop] | $\Theta(n)$ | Backtracking, function call stacks |
| **Queue (FIFO)** | — | $\Theta(n)$ | $\Theta(1)$ [Enqueue]| $\Theta(1)$ [Dequeue]| $\Theta(n)$ | BFS, job scheduling pipelines |
| **Deque** | $\Theta(1)$ | $\Theta(n)$ | $\Theta(1)$ both ends| $\Theta(1)$ both ends| $\Theta(n)$ | Sliding window maximum, work stealing |
| **Hash Table** | — | $\Theta(1)^\text{avg} / O(n)$ | $\Theta(1)^\text{avg} / O(n)$ | $\Theta(1)^\text{avg} / O(n)$ | $\Theta(n)$ | Instant key-value lookups |
| **Binary Search Tree** | — | $O(h) \to O(n)$ | $O(h) \to O(n)$ | $O(h) \to O(n)$ | $\Theta(n)$ | Ordered key traversal |
| **AVL Tree** | — | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(\log n)}$ | $\Theta(n)$ | Guaranteed $O(\log n)$ search/insert |
| **Binary Heap** | $\Theta(1)$ [Peek]| $\Theta(n)$ | $\Theta(\log n)$ [Push]| $\Theta(\log n)$ [Pop] | $\Theta(n)$ | Priority Queue, Top-K elements |
| **Trie (Prefix Tree)** | — | $\Theta(L)$ | $\Theta(L)$ | $\Theta(L)$ | $O(\Sigma \cdot N \cdot L)$ | Autocomplete, prefix lookups |
| **Segment Tree** | — | $O(\log N)$ [Query] | $O(\log N)$ [Update]| — | $O(4N)$ | Dynamic range sum / min queries |
| **Fenwick Tree (BIT)** | — | $O(\log N)$ [Prefix]| $O(\log N)$ [Update]| — | $\mathbf{O(N)}$ | Dynamic prefix sums, lightweight code |
| **Sparse Table** | — | $\mathbf{O(1)}$ [RMQ] | No updates | — | $O(N \log N)$ | Static Range Minimum Queries |
| **Disjoint Set (DSU)** | — | $O(\alpha(N)) \approx O(1)$ | $O(\alpha(N)) \approx O(1)$ | — | $\Theta(N)$ | Cycle detection, Kruskal's MST |

---

### 2. Sorting Algorithms Master Matrix

| Algorithm | Best Time | Average Time | Worst Time | Auxiliary Space | In-Place? | Stable? | Primary Paradigm |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Bubble Sort** | $\Theta(n)$ | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes | **Yes** | Comparison / Adjacent Exchange |
| **Selection Sort** | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes | **No** | Comparison / Min Selection |
| **Insertion Sort** | $\mathbf{\Theta(n)}$ | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes | **Yes** | Comparison / Shift Insertion |
| **Merge Sort** | $\mathbf{\Theta(n \log n)}$ | $\mathbf{\Theta(n \log n)}$ | $\mathbf{\Theta(n \log n)}$ | $\Theta(n)$ | **No** | **Yes** | Divide & Conquer |
| **Quick Sort** | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n^2)$ | $\Theta(\log n)$ | Yes | **No** | Divide & Conquer / Partitioning |
| **Heap Sort** | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\mathbf{\Theta(1)}$ | Yes | **No** | Selection / Complete Binary Heap |
| **Counting Sort** | $\mathbf{\Theta(n + k)}$ | $\mathbf{\Theta(n + k)}$ | $\mathbf{\Theta(n + k)}$ | $\Theta(n + k)$ | **No** | **Yes** | Non-Comparison / Frequency Hashing |
| **Radix Sort** | $\Theta(d(n+b))$ | $\Theta(d(n+b))$ | $\Theta(d(n+b))$ | $\Theta(n+b)$ | **No** | **Yes** | Non-Comparison / Positional Digit Sort |
| **Bucket Sort** | $\Theta(n + k)$ | $\Theta(n + k)$ | $\Theta(n^2)$ | $\Theta(n + k)$ | **No** | **Yes** | Non-Comparison / Uniform Scattering |

---

# TOPIC 166: MATHEMATICAL FORMULA SHEET

### 1. Essential Summations
- **Arithmetic Series**:
$$\sum_{i=1}^{n} i = \frac{n(n + 1)}{2} = \Theta(n^2)$$
- **Sum of Squares**:
$$\sum_{i=1}^{n} i^2 = \frac{n(n + 1)(2n + 1)}{6} = \Theta(n^3)$$
- **Finite Geometric Series** ($r \ne 1$):
$$\sum_{i=0}^{n-1} r^i = \frac{1 - r^n}{1 - r}$$
- **Infinite Geometric Series** ($|r| < 1$):
$$\sum_{i=0}^{\infty} r^i = \frac{1}{1 - r}$$
- **Linear-Geometric Series** (Heapify $O(n)$ proof):
$$\sum_{k=0}^{\infty} \frac{k}{2^k} = 2$$
- **Harmonic Series**:
$$\sum_{i=1}^{n} \frac{1}{i} = \ln n + \gamma + O\left(\frac{1}{n}\right) = \Theta(\log n)$$

---

### 2. Logarithm Identities
- $\log_b(x \cdot y) = \log_b x + \log_b y$
- $\log_b(x / y) = \log_b x - \log_b y$
- $\log_b(x^k) = k \cdot \log_b x$
- **Base Change**: $\log_b x = \frac{\log_a x}{\log_a b}$
- **Power Swap**: $a^{\log_b c} = c^{\log_b a}$

---

### 3. Asymptotic & Recurrence Formulas
- **Stirling's Approximation**:
$$n! \approx \sqrt{2\pi n} \left(\frac{n}{e}\right)^n \implies \log_2(n!) = \Theta(n \log n)$$
- **Master Theorem Watershed**:
$$T(n) = a \, T\left(\frac{n}{b}\right) + f(n)$$
  - If $f(n) = O(n^{\log_b a - \varepsilon}) \implies T(n) = \Theta(n^{\log_b a})$
  - If $f(n) = \Theta(n^{\log_b a} \log^k n) \implies T(n) = \Theta(n^{\log_b a} \log^{k+1} n)$
  - If $f(n) = \Omega(n^{\log_b a + \varepsilon}) \implies T(n) = \Theta(f(n))$

---

### 4. Graph & Tree Combinatorics
- **Tree Edges**: $|E| = |V| - 1$
- **Max Nodes in Binary Tree of Height $h$**: $N = 2^{h+1} - 1$
- **Full Binary Tree Leaf Relation**: $L = I + 1$
- **Handshaking Lemma**: $\sum_{v \in V} \deg(v) = 2|E|$
- **Birthday Paradox Collision Threshold**: $n \approx 1.177 \sqrt{m}$

---

# TOPIC 167: 1-MINUTE ALGORITHM DECISION CHEAT SHEET

Use this decision tree when facing an unfamiliar problem constraint in an interview or competition:

```text
WHAT ARE THE CONSTRAINTS ON N?
─────────────────────────────────────────────────────────────────────────────
• n ≤ 10      ──► O(n!) or O(2ⁿ): Backtracking, Permutations, Exhaustive Search
• n ≤ 20      ──► O(n² · 2ⁿ): Bitmask Dynamic Programming
• n ≤ 100     ──► O(n³): Floyd-Warshall, 3D Dynamic Programming
• n ≤ 2,000   ──► O(n²): 2D DP, Nested Loops, Matrix Operations, Insertion Sort
• n ≤ 10⁵     ──► O(n log n) or O(n): Sorting, Heap, Divide & Conquer, Segment Tree
• n ≤ 10⁶     ──► O(n): Prefix Sums, Two Pointers, Sliding Window, Monotonic Stack
• n ≥ 10⁹     ──► O(log n) or O(1): Binary Search, Math, Modular Arithmetic, Bitwise

WHAT IS THE PROBLEM ASKING FOR?
─────────────────────────────────────────────────────────────────────────────
• "Shortest path in UNWEIGHTED graph"     ──► Breadth-First Search (BFS)
• "Shortest path in NON-NEGATIVE graph"   ──► Dijkstra's Algorithm (Min-Heap)
• "Shortest path with NEGATIVE weights"   ──► Bellman-Ford Algorithm
• "All-pairs shortest path"               ──► Floyd-Warshall Algorithm
• "Minimum cost to connect all nodes"     ──► Minimum Spanning Tree (Prim / Kruskal)
• "Check if connected / Detect cycles"    ──► Disjoint Set Union (DSU) or DFS
• "Tasks with prerequisite orderings"     ──► Topological Sort (Kahn's BFS / DFS)
• "Next greater / smaller element"        ──► Monotonic Stack
• "Maximum in a sliding window"           ──► Monotonic Queue (Deque)
• "Find Top-K elements"                   ──► Min-Heap of size K
• "Find running median in stream"         ──► Dual Heaps (Max-Heap + Min-Heap)
• "Dynamic range sum with point updates"  ──► Fenwick Tree (BIT) or Segment Tree
• "Dynamic range updates with range sum"  ──► Segment Tree with Lazy Propagation
• "Static range minimum queries in O(1)"  ──► Sparse Table
• "Subarrays with exact sum K"            ──► Prefix Sum + Hash Map
• "Minimum of maximums / Optimization"    ──► Binary Search on Monotonic Answer
• "Count subsets / Partition"             ──► 0/1 Knapsack Dynamic Programming
```

---

# TOPIC 168: FINAL COMPREHENSIVE DSA REVISION MAP

```text
                        THE MASTERY PINNACLE (168 TOPICS)
                                       ▲
                                      / \
                                     /   \
                 PART 10: ADVANCED  /     \  PART 11: PROBLEM BANK
                • Segment & Fenwick/       \ • 168-Topic Matrix
                • Sparse Table RMQ/         \• Hall of Pitfalls
                • Tarjan / Kosaraju           • 1-Min Cheat Sheets
                                  /           \
               PART 08 & 09:     /             \  PART 06 & 07:
             PARADIGMS & PATTERNS                 TREES & GRAPHS
             • 2-Pointer / Slide                 • BST & AVL Rotations
             • Monotonic Stack                   • Heap & Priority Queue
             • Greedy / Backtracking             • Dijkstra & TopoSort
             • Dynamic Programming               • Prim / Kruskal & DSU
                               /                 \
            PART 02 & 03:     /                   \  PART 04 & 05:
            LINEAR & HASHING                         SEARCH & SORT
            • Dynamic Arrays                         • Binary Search Variants
            • Linked Lists (DLL)                     • Search on Answer Space
            • Stacks & Queues                        • QuickSort & MergeSort
            • Chaining & Probing                     • Counting & Radix Sort
                            /                       \
                           /                         \
                          ┌───────────────────────────┐
                          │    PART 01: FOUNDATIONS   │
                          │   • Asymptotics: O, Ω, Θ  │
                          │   • Recurrences & Call Stk│
                          └───────────────────────────┘
```

---
[⬅️ Previous: Module 08 — Pitfalls & Confusions](file:///d:/DSA/Part-11-Problem-Bank-and-Revision/08_pitfalls_and_confusions.md) | [Back to Master Table of Contents 🏠](file:///d:/DSA/README.md)
