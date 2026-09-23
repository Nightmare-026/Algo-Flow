# Part 00: Front Matter — Complexity Quick Reference & Master Tables

In production engineering and competitive programming, physical hardware limits enforce a strict computational budget: modern enterprise CPUs execute approximately **$10^8$ elementary operations per second** on a single thread. 

Knowing the exact asymptotic bounds, memory footprints, and architectural preconditions of standard data structures and algorithms allows software architects to determine whether an approach will succeed before writing a single line of code.

This chapter provides comprehensive, master reference tables for data structures, sorting algorithms, graph algorithms, and range-query engines, complete with 64-bit memory footprints and cache-efficiency metrics.

---

### Learning Objectives
By the end of this chapter, you will be able to:
- Correlate input scale constraints ($n \in [10, 10^{18}]$) with viable algorithmic complexity classes under a 1-second CPU budget.
- Evaluate the worst-case, average-case, and amortized time bounds for 16 primary data structures across index access, search, insertion, and deletion.
- Select sorting algorithms based on theoretical stability, auxiliary memory overhead, and information-theoretic lower bounds ($\Omega(n \log n)$).
- Choose appropriate graph algorithms based on structural preconditions (cycles, negative edge weights, directed acyclic constraints).
- Compare advanced range-query engines (Segment Trees, Fenwick Trees, Sparse Tables) across preprocessing, point update, and range query time profiles.

---

## 1. Hardware Physics & The 1-Second CPU Operations Budget

Wall-clock execution time is fundamentally bounded by the memory hierarchy and CPU instruction pipeline. While a 3.5 GHz CPU completes $3.5 \times 10^9$ raw clock cycles per second, instruction pipelining, branch mispredictions, and memory cache misses reduce effective throughput to approximately **$10^8$ operations per second** for algorithmic logic.

```
                              CPU MEMORY ACCESS LATENCY PENALTY
                              
    Memory Level      Latency (Cycles)    Relative Latency    Visual Scale
    ----------------------------------------------------------------------------------
    CPU Registers     1 cycle             1x                  | [Immediate]
    L1 Data Cache     4 - 5 cycles        4x                  ||||
    L2 Cache          12 - 14 cycles      14x                 ||||||||||||||
    L3 Shared Cache   40 - 60 cycles      50x                 |||||||||||||||||||||||||...
    Main DRAM Memory  150 - 250 cycles    200x                [200x slower than register!]
```

---

### Input Scale vs Viable Algorithmic Complexity

When presented with an input constraint $n$, use this table to immediately identify the required algorithmic time complexity:

| Input Scale Constraint $n$ | Maximum Viable Time Complexity | Archetypal Algorithmic Strategy | Canonical Examples |
| :---: | :---: | :--- | :--- |
| **$n \le 11$** | $O(n!)$ or $O(n^2 \cdot 2^n)$ | Factorial permutations, brute-force search | Traveling Salesperson (brute force) |
| **$n \le 22$** | $O(2^n)$ or $O(n \cdot 2^n)$ | Bitmask dynamic programming, backtracking | TSP via Held-Karp, Meet-in-the-Middle |
| **$n \le 100$** | $O(n^4)$ | High-order polynomial dynamic programming | Matrix chain multiplication |
| **$n \le 400$** | $O(n^3)$ | Cubic dynamic programming, all-pairs paths | Floyd-Warshall APSP, Gaussian Elimination |
| **$n \le 5,000$** | $O(n^2)$ | Quadratic nested loops, pairwise comparisons | Insertion Sort, 2D Grid DP, Bellman-Ford |
| **$n \le 10^5$** | $O(n \sqrt{n})$ | Square root decomposition, block queries | Mo's Algorithm, Light/Heavy Decomposition |
| **$n \le 10^6$** | $O(n \log n)$ or $O(n \log^2 n)$ | Divide-and-conquer, heap operations, sorting | MergeSort, QuickSort, Segment Trees, Dijkstra |
| **$n \le 10^8$** | $O(n)$ | Linear scan, two pointers, sliding window | Kadane's Algorithm, Prefix Sums, Kahn's BFS |
| **$n \le 10^{14}$** | $O(\sqrt{n})$ | Sublinear factorization, square root search | Trial division primality testing |
| **$n \ge 10^{18}$** | $O(\log n)$ or $O(1)$ | Logarithmic divide, binary search, math formulas | Binary search, GCD, modular exponentiation |

---

## 2. Master Data Structures Operations Table

*Conventions: $n$ = element count, $h$ = tree height ($O(\log n)$ balanced, $O(n)$ degenerate), $\alpha = n / m$ = hash load factor. $^*$ denotes amortized time.*

| Data Structure | Access (Index) | Search (Value) | Insertion (Head) | Insertion (Tail) | Insertion (Arbitrary) | Deletion (Head) | Deletion (Tail) | Deletion (Arbitrary) | Auxiliary Space | 64-Bit Memory Overhead Per Element |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Static Array** | $\Theta(1)$ | $O(n)$ | — | — | — | — | — | — | $O(n)$ | **0 bytes** (Raw contiguous primitive bytes) |
| **Dynamic Array (Vector)** | $\Theta(1)$ | $O(n)$ | $O(n)$ | $O(1)^*$ | $O(n)$ | $O(n)$ | $O(1)$ | $O(n)$ | $O(n)$ | **$0 - 100\%$** (Excess capacity buffer) |
| **Singly Linked List** | $O(n)$ | $O(n)$ | $O(1)$ | $O(1)^\dagger$ | $O(n)$ | $O(1)$ | $O(n)$ | $O(n)$ | $O(n)$ | **8 bytes** (`next` pointer + struct padding) |
| **Doubly Linked List** | $O(n)$ | $O(n)$ | $O(1)$ | $O(1)$ | $O(n)$ | $O(1)$ | $O(1)$ | $O(1)^\ddagger$ | $O(n)$ | **16–20 bytes** (`next` and `prev` pointers) |
| **Stack (Array Backed)** | — | $O(n)$ | $O(1)^*$ [Push] | — | — | $O(1)$ [Pop] | — | — | $O(n)$ | Contiguous buffer overhead |
| **Queue (Circular Buffer)**| — | $O(n)$ | — | $O(1)$ [Enq] | — | $O(1)$ [Deq] | — | — | $O(n)$ | Fixed circular array slots |
| **Deque (Double Ended)** | $\Theta(1)$ | $O(n)$ | $O(1)$ | $O(1)$ | $O(n)$ | $O(1)$ | $O(1)$ | $O(n)$ | $O(n)$ | Chunked array map pointers |
| **Hash Table (Chaining)** | — | $O(1)^\text{avg} / O(n)$ | $O(1)$ | — | $O(1)^\text{avg}$ | $O(1)^\text{avg}$ | — | $O(1)^\text{avg} / O(n)$ | $O(n)$ | Bucket array + linked list node pointers |
| **Hash Table (Open Addr)** | — | $O(1)^\text{avg} / O(n)$ | — | — | $O(1)^\text{avg}$ | — | — | $O(1)^\text{avg} / O(n)$ | $O(n)$ | Flat table array (Zero pointer overhead) |
| **Binary Search Tree** | — | $O(h)$ | — | — | $O(h)$ | — | — | $O(h)$ | $O(n)$ | **16–24 bytes** (`left`, `right`, `parent`) |
| **AVL Tree (Self-Balancing)**| — | $O(\log n)$ | — | — | $O(\log n)$ | — | — | $O(\log n)$ | $O(n)$ | **20–28 bytes** (Pointers + height field) |
| **Red-Black Tree** | — | $O(\log n)$ | — | — | $O(\log n)$ | — | — | $O(\log n)$ | $O(n)$ | **17–24 bytes** (Pointers + 1-bit color flag) |
| **Binary Min/Max Heap** | $O(1)$ [Peek] | $O(n)$ | — | — | $O(\log n)$ [Push] | $O(\log n)$ [Pop] | — | $O(\log n)$ | $O(n)$ | **0 bytes** (Implicit complete binary array) |
| **Trie (Prefix Tree)** | — | $O(L)$ | — | — | $O(L)$ [Insert] | — | — | $O(L)$ [Delete] | $O(\Sigma \cdot N)$ | $\Sigma \times 8\text{ bytes}$ per node ($\Sigma = 26$ alphabet) |
| **Disjoint Set Union (DSU)**| — | $O(\alpha(n))^*$ | — | — | $O(\alpha(n))^*$ [Union] | — | — | — | $O(n)$ | Two flat integer arrays (`parent`, `rank`) |

$^\dagger$ *Assuming a maintained tail reference pointer.*  
$^\ddagger$ *Assuming a direct pointer reference to the target node is provided.*  
$^*$ *Amortized bound. $\alpha(n)$ is the Inverse Ackermann function ($\alpha(n) \le 4$ for all practical inputs $n \le 10^{80}$).*

---

## 3. Master Sorting Algorithms Benchmark Table

```
           COMPARISON SORTING LOWER BOUND: Ω(n log n)
           
           Any comparison-based sorting algorithm can be modeled as a binary 
           decision tree with n! leaves.
           Tree Height h >= log2(n!)
           By Stirling's Approximation:
           log2(n!) = n log2(n) - n log2(e) + O(log n) = Ω(n log n)
```

| Algorithm | Best Time | Average Time | Worst Time | Auxiliary Space | In-Place? | Stable? | Algorithmic Paradigm | Recommended Production Use Case |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **Bubble Sort** | $\Theta(n)$ | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes | **Yes** | Comparison / Exchange | Academic pedagogy only |
| **Selection Sort** | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes | **No** | Comparison / Selection | Minimizing physical memory writes ($O(n)$ swaps) |
| **Insertion Sort** | $\Theta(n)$ | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(1)$ | Yes | **Yes** | Comparison / Insertion | Small datasets ($n \le 32$) or nearly-sorted data |
| **Merge Sort** | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n)$ | **No** | **Yes** | Divide & Conquer | External sorting, sorting linked lists ($O(1)$ space) |
| **Quick Sort** | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n^2)$ | $\Theta(\log n)$ | Yes | **No** | Divide & Conquer / Partition | General-purpose in-memory sorting |
| **Heap Sort** | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(1)$ | Yes | **No** | Selection / Binary Heap | Systems with hard real-time latency and strict $O(1)$ space |
| **Counting Sort** | $\Theta(n + k)$ | $\Theta(n + k)$ | $\Theta(n + k)$ | $\Theta(k)$ | **No** | **Yes** | Non-Comparison / Distribution | Integers within a small bounded range ($k \le O(n)$) |
| **Radix Sort (LSD)**| $\Theta(d(n + b))$ | $\Theta(d(n + b))$ | $\Theta(d(n + b))$ | $\Theta(n + b)$ | **No** | **Yes** | Non-Comparison / Positional | Fixed-width keys (e.g., 32-bit integers, IP addresses) |
| **Bucket Sort** | $\Theta(n + k)$ | $\Theta(n + k)$ | $\Theta(n^2)$ | $\Theta(n + k)$ | **No** | **Yes** | Non-Comparison / Bucketing | Uniformly distributed floating-point numbers $[0.0, 1.0)$ |
| **TimSort** | $\Theta(n)$ | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n)$ | **No** | **Yes** | Adaptive Hybrid (Merge + Insert) | Default standard in Python (`sort()`) and Java (`Arrays.sort()`) |
| **IntroSort** | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(\log n)$ | Yes | **No** | Hybrid (Quick + Heap + Insert) | Default standard in C++ STL (`std::sort`) |

---

## 4. Master Graph Algorithms Reference Table

*Conventions: $V = \lvert V \rvert$ (vertex count), $E = \lvert E \rvert$ (edge count).*

| Algorithm | Problem Addressed | Time Complexity | Auxiliary Space | Graph Preconditions & Constraints |
| :--- | :--- | :---: | :---: | :--- |
| **Breadth-First Search (BFS)** | Shortest path in unweighted graphs | $\Theta(V + E)$ | $\Theta(V)$ | Any graph; finds minimal edge-count paths |
| **Depth-First Search (DFS)** | Reachability, cycle detection, bridges | $\Theta(V + E)$ | $\Theta(V)$ | Any graph; call stack bounded by $O(V)$ |
| **Kahn's Topological Sort** | Topological linear ordering | $\Theta(V + E)$ | $\Theta(V)$ | Graph must be a **DAG** (zero directed cycles) |
| **Dijkstra (Binary Heap)** | Single-Source Shortest Paths (SSSP) | $\Theta((V + E) \log V)$ | $\Theta(V)$ | **Edge weights must be non-negative** ($w(e) \ge 0$) |
| **Dijkstra (Fibonacci Heap)** | Single-Source Shortest Paths (SSSP) | $\Theta(E + V \log V)$ | $\Theta(V)$ | Non-negative edge weights; high constant factors |
| **Bellman-Ford** | SSSP & Negative Cycle Detection | $\Theta(V \cdot E)$ | $\Theta(V)$ | Detects negative weight cycles reachable from source |
| **Floyd-Warshall** | All-Pairs Shortest Paths (APSP) | $\Theta(V^3)$ | $\Theta(V^2)$ | Graph must contain zero negative weight cycles |
| **Prim's Algorithm** | Minimum Spanning Tree (MST) | $\Theta((V + E) \log V)$ | $\Theta(V)$ | Connected, undirected graph |
| **Kruskal's Algorithm** | Minimum Spanning Tree (MST) | $\Theta(E \log E)$ | $\Theta(V)$ | Connected, undirected graph; utilizes DSU |
| **Tarjan's SCC** | Strongly Connected Components | $\Theta(V + E)$ | $\Theta(V)$ | Directed graph; single DFS pass using discovery & low-link values |
| **Kosaraju's SCC** | Strongly Connected Components | $\Theta(V + E)$ | $\Theta(V)$ | Directed graph; requires transposed reverse graph $G^T$ |
| **Edmonds-Karp** | Maximum Network Flow | $O(V \cdot E^2)$ | $\Theta(V + E)$ | Directed graph with non-negative capacity constraints |
| **Dinic's Algorithm** | Maximum Network Flow | $O(V^2 \cdot E)$ | $\Theta(V + E)$ | Level graphs with blocking flows ($O(E \sqrt{V})$ on unit networks) |

---

## 5. Master Range Query Data Structures Table

When answering repeated range queries (Range Sum, Range Minimum/Maximum Query) over dynamic or static arrays of size $n$:

| Data Structure | Preprocessing Time | Range Query Time | Point Update Time | Range Update Time | Space Complexity | Supported Operations |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Prefix Sum Array** | $\Theta(n)$ | $\Theta(1)$ | $O(n)$ | $O(n)$ | $\Theta(n)$ | Static invertible operations (Sum, XOR) |
| **Difference Array** | $\Theta(n)$ | $O(n)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(n)$ | Batch range additions with offline queries |
| **Sparse Table** | $\Theta(n \log n)$ | $\mathbf{\Theta(1)}$ | $O(n)$ | $O(n)$ | $\Theta(n \log n)$ | Static idempotent operations (RMQ: Min, Max, GCD) |
| **Binary Indexed Tree (Fenwick)**| $\Theta(n)$ | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(\log n)}$ | $O(n)$ | $\mathbf{\Theta(n)}$ | Dynamic prefix queries (Sum, Inversions) |
| **Segment Tree (Standard)** | $\Theta(n)$ | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(\log n)}$ | $O(n)$ | $\mathbf{\Theta(4n)}$ | Any associative operation (Sum, Min, Max, Matrix) |
| **Segment Tree (Lazy Prop)** | $\Theta(n)$ | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(\log n)}$ | $\mathbf{\Theta(4n)}$ | Dynamic range updates + dynamic range queries |
| **Square Root Decomposition**| $\Theta(n)$ | $O(\sqrt{n})$ | $\Theta(1)$ | $O(\sqrt{n})$ | $\Theta(n)$ | Arbitrary dynamic queries, offline Mo's algorithm |

---

## 6. Decision Flowchart: Selecting the Right Data Structure

```
                         WHAT OPERATION DOMINATES YOUR WORKLOAD?
                                            |
         +----------------------------------+---------------------------------+
         |                                  |                                 |
         v                                  v                                 v
[ Fast Key-Value Lookup ]          [ Ordered Traversal & Extremum ]    [ Sequential LIFO / FIFO ]
         |                                  |                                 |
   Are keys ordered?                  Is priority dynamic?             Is ordering strict?
    /         \                         /           \                   /          \
  (Yes)       (No)                    (Yes)         (No)              (LIFO)       (FIFO)
   |           |                        |             |                 |            |
[AVL / RB]  [Hash Table]          [Binary Heap]  [Sorted Array]      [Stack]      [Queue/Deque]
O(log n)    O(1) average          O(log n) push  O(log n) bisect     O(1) pop     O(1) deq
```

---

## 7. Key Takeaways & Architectural Heuristics

1. **The $10^8$ Operations Rule**: Always verify that $f(n) \le 10^8$ for the maximum given constraint $n$ to guarantee a sub-second response time.
2. **Memory Alignment Matters**: Contiguous primitive arrays have zero pointer overhead and maximize L1/L2 cache prefetching; linked nodes incur 16–24 bytes of pointer overhead per element and cause cache stalls.
3. **Comparison Sort Limit**: No comparison-based sort can beat $\Omega(n \log n)$ in the worst case; beating this bound requires non-comparison distribution methods (Counting Sort, Radix Sort).
4. **Idempotency in Range Queries**: If the query function is **idempotent** ($f(x, x) = x$ such as $\min, \max, \gcd$), a Sparse Table answers queries in strict **$O(1)$ time**.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.). MIT Press.
2. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.). Addison-Wesley.
3. **Williams, J. W. J.** (1964). *Algorithm 232: Heapsort*. Communications of the ACM, 7(6), 347–348.
4. **Tarjan, R. E.** (1975). *Efficiency of a good but not linear set union algorithm*. Journal of the ACM, 22(2), 215–225.
