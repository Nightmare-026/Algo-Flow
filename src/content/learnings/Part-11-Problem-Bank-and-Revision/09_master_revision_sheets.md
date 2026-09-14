# Part 11: Problem Bank & Revision — Module 09: Master Revision Sheets & Formula Reference

Synthesizing an entire computer science curriculum requires compact, high-density reference matrices that map constraints to paradigms within seconds. This capstone revision module consolidates master asymptotic complexity tables, foundational summation identities, and rapid decision frameworks across all 168 topics of AlgoFlow.

---

## 1. Executive Summary & Learning Objectives

This master reference module serves as the final analytical synthesis for the AlgoFlow DSA curriculum, assembling lookup tables, closed-form formulas, and rapid decision rubrics.

By the end of this chapter, you will be able to:
1. **Recall Asymptotic Complexity Profiles**: Cross-reference time and space bounds across 16 data structures and 9 sorting algorithms.
2. **Apply Mathematical Identities**: Leverage arithmetic series, geometric series, logarithm rules, and Master Theorem watershed cases during live analysis.
3. **Map Numerical Constraints to Complexity Bounds**: Determine viable algorithmic classes instantly from input size bounds ($N \le 20 \to \mathcal{O}(N^2 2^N)$, $N \le 10^5 \to \mathcal{O}(N \log N)$).
4. **Identify Problem Archetypes via Intent Keywords**: Translate functional requirements into optimal algorithm selections under pressure.

---

## 2. Topic 165: Master Complexity Tables

### 1. Data Structures Operation Matrix

| Data Structure | Access by Index | Search by Value | Insertion | Deletion | Auxiliary Space | Best Use Case |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Static Array** | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | Known fixed size, cache locality |
| **Dynamic Array** | $\Theta(1)$ | $\Theta(n)$ | $\mathcal{O}(1)$ amortized | $\mathcal{O}(1)$ at end | $\Theta(n)$ | Unknown size, frequent appends |
| **Singly Linked List** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(1)$ at head | $\Theta(1)$ at head | $\Theta(n)$ | Head insertions/deletions |
| **Doubly Linked List** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(1)$ at ends | $\Theta(1)$ with pointer | $\Theta(n)$ | LRU Cache, bidirectional traversal |
| **Stack (LIFO)** | — | $\Theta(n)$ | $\Theta(1)$ [Push] | $\Theta(1)$ [Pop] | $\Theta(n)$ | Backtracking, function call frames |
| **Queue (FIFO)** | — | $\Theta(n)$ | $\Theta(1)$ [Enqueue] | $\Theta(1)$ [Dequeue] | $\Theta(n)$ | BFS, task scheduling pipelines |
| **Deque** | $\Theta(1)$ | $\Theta(n)$ | $\Theta(1)$ at ends | $\Theta(1)$ at ends | $\Theta(n)$ | Sliding window extrema, work stealing |
| **Hash Table** | — | $\Theta(1)$ avg / $\mathcal{O}(n)$ | $\Theta(1)$ avg / $\mathcal{O}(n)$ | $\Theta(1)$ avg / $\mathcal{O}(n)$ | $\Theta(n)$ | Constant-time key lookups |
| **Binary Search Tree** | — | $\mathcal{O}(h) \to \mathcal{O}(n)$ | $\mathcal{O}(h) \to \mathcal{O}(n)$ | $\mathcal{O}(h) \to \mathcal{O}(n)$ | $\Theta(n)$ | Sorted key traversals |
| **AVL Tree** | — | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(\log n)}$ | $\Theta(n)$ | Guaranteed balanced search/insert |
| **Binary Heap** | $\Theta(1)$ [Peek] | $\Theta(n)$ | $\Theta(\log n)$ [Push] | $\Theta(\log n)$ [Pop] | $\Theta(n)$ | Priority Queues, Top-K elements |
| **Trie (Prefix Tree)** | — | $\Theta(L)$ | $\Theta(L)$ | $\Theta(L)$ | $\mathcal{O}(\Sigma \cdot N \cdot L)$ | Autocomplete, dictionary prefix matching |
| **Segment Tree** | — | $\mathcal{O}(\log n)$ [Query] | $\mathcal{O}(\log n)$ [Update] | — | $4n$ | Dynamic range sum / min queries |
| **Fenwick Tree (BIT)** | — | $\mathcal{O}(\log n)$ [Prefix] | $\mathcal{O}(\log n)$ [Update] | — | $\mathbf{n}$ | Dynamic prefix sums, minimal code |
| **Sparse Table** | — | $\mathbf{\mathcal{O}(1)}$ [RMQ] | Not supported | — | $\mathcal{O}(n \log n)$ | Static Range Minimum Queries |
| **Disjoint Set (DSU)** | — | $\mathcal{O}(\alpha(n)) \approx \mathcal{O}(1)$ | $\mathcal{O}(\alpha(n)) \approx \mathcal{O}(1)$ | — | $\Theta(n)$ | Dynamic connectivity, Kruskal's MST |

---

### 2. Sorting Algorithms Master Matrix

| Algorithm | Best Time | Average Time | Worst Time | Auxiliary Space | In-Place? | Stable? | Primary Paradigm |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Bubble Sort** | $\Theta(n)$ | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes | **Yes** | Adjacent Exchange |
| **Selection Sort** | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes | **No** | Minimum Selection |
| **Insertion Sort** | $\mathbf{\Theta(n)}$ | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes | **Yes** | Shift Insertion |
| **Merge Sort** | $\mathbf{\Theta(n \log n)}$ | $\mathbf{\Theta(n \log n)}$ | $\mathbf{\Theta(n \log n)}$ | $\Theta(n)$ | **No** | **Yes** | Divide & Conquer |
| **Quick Sort** | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n^2)$ | $\Theta(\log n)$ | Yes | **No** | Partitioning |
| **Heap Sort** | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\mathbf{\Theta(1)}$ | Yes | **No** | Complete Binary Heap |
| **Counting Sort** | $\mathbf{\Theta(n + k)}$ | $\mathbf{\Theta(n + k)}$ | $\mathbf{\Theta(n + k)}$ | $\Theta(n + k)$ | **No** | **Yes** | Non-Comparison Frequency |
| **Radix Sort** | $\Theta(d(n+b))$ | $\Theta(d(n+b))$ | $\Theta(d(n+b))$ | $\Theta(n+b)$ | **No** | **Yes** | Positional Digit Sort |
| **Bucket Sort** | $\Theta(n + k)$ | $\Theta(n + k)$ | $\Theta(n^2)$ | $\Theta(n + k)$ | **No** | **Yes** | Uniform Distribution Scattering |

---

## 3. Topic 166: Mathematical Formula Sheet

### 1. Essential Summations
- **Arithmetic Series**:
$$\sum_{i=1}^{n} i = \frac{n(n + 1)}{2} = \Theta(n^2)$$

- **Sum of Squares**:
$$\sum_{i=1}^{n} i^2 = \frac{n(n + 1)(2n + 1)}{6} = \Theta(n^3)$$

- **Finite Geometric Series** ($r \ne 1$):
$$\sum_{i=0}^{n-1} r^i = \frac{1 - r^n}{1 - r}$$

- **Infinite Geometric Series** ($|r| < 1$):
$$\sum_{i=0}^{\infty} r^i = \frac{1}{1 - r}$$

- **Linear-Geometric Series** (Heapify $\mathcal{O}(n)$ Construction Proof):
$$\sum_{k=0}^{\infty} \frac{k}{2^k} = 2$$

- **Harmonic Series**:
$$\sum_{i=1}^{n} \frac{1}{i} = \ln n + \gamma + \mathcal{O}\left(\frac{1}{n}\right) = \Theta(\log n)$$

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
  - Case 1: If $f(n) = \mathcal{O}(n^{\log_b a - \varepsilon}) \implies T(n) = \Theta(n^{\log_b a})$
  - Case 2: If $f(n) = \Theta(n^{\log_b a} \log^k n) \implies T(n) = \Theta(n^{\log_b a} \log^{k+1} n)$
  - Case 3: If $f(n) = \Omega(n^{\log_b a + \varepsilon}) \implies T(n) = \Theta(f(n))$

---

### 4. Graph & Tree Combinatorics
- **Tree Edges**: $|E| = |V| - 1$
- **Maximum Nodes in Binary Tree of Height $h$**: $N = 2^{h+1} - 1$
- **Full Binary Tree Leaf Count**: $L = I + 1$ (where $I$ is the internal node count)
- **Handshaking Lemma**: $\sum_{v \in V} \deg(v) = 2|E|$
- **Birthday Paradox Collision Threshold**: $n \approx 1.177 \sqrt{m}$

---

## 4. Topic 167: 1-Minute Algorithm Decision Cheat Sheets

### 1. Constraint-Driven Complexity Target

| Input Constraint ($N$) | Target Upper Bound Complexity | Recommended Algorithmic Paradigms |
| :--- | :--- | :--- |
| **$N \le 10$** | $\mathcal{O}(N!)$ or $\mathcal{O}(2^N)$ | Backtracking, Permutations, Exhaustive Search |
| **$N \le 20$** | $\mathcal{O}(N^2 \cdot 2^N)$ | Bitmask Dynamic Programming |
| **$N \le 100$** | $\mathcal{O}(N^3)$ | Floyd-Warshall, 3D Dynamic Programming, Matrix Chain Multiplication |
| **$N \le 2,000$** | $\mathcal{O}(N^2)$ | 2D Dynamic Programming, Double Nested Loops, Insertion Sort |
| **$N \le 10^5$** | $\mathcal{O}(N \log N)$ | Merge Sort, Quick Sort, Heaps, Divide & Conquer, Segment Trees |
| **$N \le 10^6$** | $\mathcal{O}(N)$ | Prefix Sums, Two Pointers, Sliding Window, Monotonic Stack, BFS/DFS |
| **$N \ge 10^9$** | $\mathcal{O}(\log N)$ or $\mathcal{O}(1)$ | Binary Search, Bitwise Arithmetic, Modular Math, Matrix Exponentiation |

---

### 2. Functional Intent Selection Matrix

| Problem Specification / Intent Keyword | Recommended Algorithm / Data Structure |
| :--- | :--- |
| **Shortest path in unweighted graph** | Breadth-First Search (BFS) |
| **Shortest path with non-negative weights** | Dijkstra's Algorithm (Min-Heap) |
| **Shortest path with negative edge weights** | Bellman-Ford Algorithm |
| **All-pairs shortest path** | Floyd-Warshall Algorithm |
| **Minimum cost to connect all nodes** | Kruskal's with DSU or Prim's with Min-Heap |
| **Connected components / Cycle detection** | Disjoint Set Union (DSU) or Depth-First Search (DFS) |
| **Topological dependency orderings** | Kahn's Algorithm (BFS with In-degrees) or DFS Postorder |
| **Next greater or smaller element** | Monotonic Stack |
| **Sliding window minimum or maximum** | Monotonic Queue (Deque) |
| **Top-K frequent or extreme elements** | Min-Heap of size $K$ or Quickselect |
| **Dynamic streaming median** | Dual Heaps (Max-Heap + Min-Heap) |
| **Dynamic range sum with point updates** | Fenwick Tree (BIT) or Segment Tree |
| **Dynamic range updates with range sum** | Segment Tree with Lazy Propagation |
| **Static range minimum queries in $\mathcal{O}(1)$** | Sparse Table |
| **Continuous subarrays summing to $K$** | Prefix Sum Frequency Hash Map |
| **Optimization over monotonic answer** | Binary Search on Answer Space |
| **Subset partition optimization** | 0/1 Knapsack Dynamic Programming |

---

## 5. Topic 168: Final Comprehensive DSA Revision Map

The 12 parts and 168 topics of AlgoFlow form an integrated conceptual hierarchy:

| Curriculum Pillar | Core Topics & Competencies | Key Paradigms & Structures |
| :--- | :--- | :--- |
| **Foundations** (Part 00–01) | Asymptotic Notations ($O, \Omega, \Theta$), Master Theorem, Recurrence Relations, Call Stack | Mathematical Induction, Recursion Trees |
| **Linear Sequences** (Part 02–03) | Dynamic Arrays, Singly/Doubly Linked Lists, Stacks, Queues, Hash Tables, Bloom Filters | Amortized Doubling, Collision Resolution |
| **Searching & Sorting** (Part 04–05) | Binary Search, Lower/Upper Bounds, QuickSort, MergeSort, Linear-Time Counting/Radix Sort | Invariant Maintenance, Divide-and-Conquer |
| **Hierarchies & Networks** (Part 06–07) | BSTs, AVL Rotations, Binary Heaps, Tries, BFS/DFS, Dijkstra, Topological Sort, Kruskal/DSU | Tree Balancing, Graph Traversals |
| **Design Paradigms** (Part 08–09) | Greedy Matroids, Backtracking, Dynamic Programming (0/1 Knapsack, LCS), Two Pointers, Monotonic Structures | Bellman Optimality, Pruning Search Trees |
| **Advanced & Mastery** (Part 10–11) | Segment Trees, Fenwick Trees, Sparse Tables, KMP, HLD, Centroid Decomposition, 525+ Problem Bank | Hierarchical Decompositions, Synthesis |

---

## References & Academic Attribution

1. **Skiena, S. S.** (2020). *The Algorithm Design Manual* (3rd ed.). Springer.
2. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.). MIT Press.
3. **USA Computing Olympiad (USACO)** & **CP-Algorithms Archives** (2024). Curated Competitive Programming and Algorithm Verification Standards.
