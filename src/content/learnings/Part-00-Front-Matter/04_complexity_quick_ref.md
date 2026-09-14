# Part 00: Front Matter — Complexity Quick Reference & Master Tables

In production systems and competitive programming, hardware limits enforce a strict runtime constraint: modern CPUs execute approximately $10^8$ basic operations per second. Knowing the asymptotic bounds of standard data structures and algorithms allows engineers to immediately evaluate whether an approach is physically viable before writing a single line of code.

### Learning Objectives
By the end of this chapter, you will be able to:
- Correlate input sizes ($n \in [10, 10^8]$) with asymptotic bounds to identify viable algorithmic complexities under a 1-second CPU budget.
- Compare the access, search, insertion, and deletion bounds of all major linear and hierarchical data structures.
- Select sorting algorithms based on time/space trade-offs, in-place constraints, and stability requirements.
- Identify graph algorithm runtimes, auxiliary space bounds, and precondition requirements (e.g., non-negative edge weights or acyclic constraints).

---

## 1. Asymptotic Growth Rates & 1-Second CPU Budgets

The following table benchmarks operational counts as $n$ scales, assuming a standard budget of $\approx 10^8$ operations per second:

| Complexity | Name | $n = 10$ | $n = 100$ | $n = 10^3$ | $n = 10^6$ | Viable Input Size for 1 sec ($10^8$ ops) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| $O(1)$ | Constant | $1$ | $1$ | $1$ | $1$ | Any input size ($n \le 10^{18}$) |
| $O(\log n)$ | Logarithmic | $\approx 3$ | $\approx 7$ | $\approx 10$ | $\approx 20$ | Huge ($n \le 10^{18}$) |
| $O(\sqrt{n})$ | Sublinear | $\approx 3$ | $10$ | $\approx 31$ | $10^3$ | Very Large ($n \le 10^{12}$) |
| $O(n)$ | Linear | $10$ | $100$ | $1,000$ | $10^6$ | Large ($n \le 10^8$) |
| $O(n \log n)$ | Linearithmic | $\approx 33$ | $\approx 664$ | $\approx 9,965$ | $\approx 2 \times 10^7$ | Medium-Large ($n \le 10^6$) |
| $O(n^2)$ | Quadratic | $100$ | $10,000$ | $10^6$ | $10^{12}$ (TLE) | Moderate ($n \le 5,000$) |
| $O(n^3)$ | Cubic | $1,000$ | $10^6$ | $10^9$ (TLE) | $10^{18}$ (TLE) | Small ($n \le 400$) |
| $O(2^n)$ | Exponential | $1,024$ | $1.26 \times 10^{30}$ | Intractable | Intractable | Tiny ($n \le 22$) |
| $O(n!)$ | Factorial | $3.6 \times 10^6$ | Intractable | Intractable | Intractable | Micro ($n \le 11$) |

---

## 2. Master Data Structure Operations Table

*Values denote Worst-Case performance unless explicitly annotated as Amortized or Average.*

| Data Structure | Access by Index | Search by Value | Insert at Head | Insert at Tail | Insert Arbitrary | Delete at Head | Delete at Tail | Delete Arbitrary | Space Complexity |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Static Array** | $O(1)$ | $O(n)$ | — | — | — | — | — | — | $O(n)$ |
| **Dynamic Array** | $O(1)$ | $O(n)$ | $O(n)$ | $O(1)^*$ | $O(n)$ | $O(n)$ | $O(1)$ | $O(n)$ | $O(n)$ |
| **Singly Linked List** | $O(n)$ | $O(n)$ | $O(1)$ | $O(1)^\dagger$ | $O(n)$ | $O(1)$ | $O(n)$ | $O(n)$ | $O(n)$ |
| **Doubly Linked List** | $O(n)$ | $O(n)$ | $O(1)$ | $O(1)$ | $O(n)$ | $O(1)$ | $O(1)$ | $O(1)^\ddagger$ | $O(n)$ |
| **Stack** | — | $O(n)$ | $O(1)$ [Push] | — | — | $O(1)$ [Pop] | — | — | $O(n)$ |
| **Queue** | — | $O(n)$ | — | $O(1)$ [Enqueue] | — | $O(1)$ [Dequeue] | — | — | $O(n)$ |
| **Deque** | $O(1)$ | $O(n)$ | $O(1)$ | $O(1)$ | $O(n)$ | $O(1)$ | $O(1)$ | $O(n)$ | $O(n)$ |
| **Hash Table** | — | $O(1)^\text{avg} / O(n)$ | $O(1)^\text{avg} / O(n)$ | $O(1)^\text{avg} / O(n)$ | $O(1)^\text{avg} / O(n)$ | $O(1)^\text{avg} / O(n)$ | $O(1)^\text{avg} / O(n)$ | $O(1)^\text{avg} / O(n)$ | $O(n)$ |
| **Binary Search Tree** | — | $O(h) \to O(n)$ | — | — | $O(h) \to O(n)$ | — | — | $O(h) \to O(n)$ | $O(n)$ |
| **AVL Tree (Balanced)**| — | $O(\log n)$ | — | — | $O(\log n)$ | — | — | $O(\log n)$ | $O(n)$ |
| **Binary Heap** | $O(1)$ [Peek] | $O(n)$ | — | — | $O(\log n)$ [Push] | $O(\log n)$ [Extract] | — | $O(\log n)$ | $O(n)$ |

$^*$ *Amortized $O(1)$ time for push-back; resizing takes $O(n)$ worst-case.*  
$^\dagger$ *Assuming a maintained tail pointer.*  
$^\ddagger$ *Given direct pointer reference to the target node.*

---

## 3. Master Sorting Algorithms Table

| Algorithm | Best Time | Average Time | Worst Time | Auxiliary Space | In-Place? | Stable? | Paradigm |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **Bubble Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | Yes | Comparison / Exchange |
| **Selection Sort** | $O(n^2)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | No | Comparison / Selection |
| **Insertion Sort** | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | Yes | Comparison / Insertion |
| **Merge Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ | No | Yes | Divide & Conquer |
| **Quick Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ | Yes | No | Divide & Conquer / Partition |
| **Heap Sort** | $O(n \log n)$ | $O(n \log n)$ | $O(n \log n)$ | $O(1)$ | Yes | No | Selection / Heap Structure |
| **Counting Sort** | $O(n + k)$ | $O(n + k)$ | $O(n + k)$ | $O(k)$ | No | Yes | Non-Comparison / Distribution |
| **Radix Sort** | $O(d \cdot (n + b))$ | $O(d \cdot (n + b))$ | $O(d \cdot (n + b))$ | $O(n + b)$ | No | Yes | Non-Comparison / Positional |
| **Bucket Sort** | $O(n + k)$ | $O(n + k)$ | $O(n^2)$ | $O(n + k)$ | No | Yes | Non-Comparison / Bucketing |

---

## 4. Master Graph Algorithms Table

| Algorithm | Problem Solved | Time Complexity | Space Complexity | Graph Preconditions |
| :--- | :--- | :---: | :---: | :--- |
| **BFS** | Shortest path in unweighted graph | $O(V + E)$ | $O(V)$ | Any graph |
| **DFS** | Connectivity, cycles, flood-fill | $O(V + E)$ | $O(V)$ | Any graph |
| **Kahn's (BFS)** | Topological ordering | $O(V + E)$ | $O(V)$ | Directed Acyclic Graph (DAG) |
| **Dijkstra** | Single-Source Shortest Path (SSSP) | $O((V + E) \log V)$ | $O(V)$ | Non-negative edge weights ($w \ge 0$) |
| **Bellman-Ford** | SSSP & Negative Cycle Detection | $O(V \cdot E)$ | $O(V)$ | No negative cycles reachable from source |
| **Floyd-Warshall**| All-Pairs Shortest Path (APSP) | $O(V^3)$ | $O(V^2)$ | No negative cycles |
| **Prim's** | Minimum Spanning Tree (MST) | $O((V + E) \log V)$ | $O(V)$ | Connected, undirected graph |
| **Kruskal's** | Minimum Spanning Tree (MST) | $O(E \log E)$ | $O(V)$ | Connected, undirected graph |
| **Tarjan's** | Strongly Connected Components | $O(V + E)$ | $O(V)$ | Directed graph |

---

## 5. Key Takeaways

- **Input Bound Rule of Thumb**: For $n \le 10^3$, $O(n^2)$ algorithms pass comfortably; for $n \le 10^6$, $O(n \log n)$ is required; for $n \ge 10^8$, only strictly $O(n)$ or $O(\log n)$ approaches complete within 1 second.
- **Cache Locality Trade-Off**: While linked lists guarantee $O(1)$ head insertion, arrays frequently outperform them in wall-clock benchmarks due to cache lines and contiguous memory fetches.
- **Precondition Awareness**: Always check edge-weight constraints before choosing between Dijkstra, Bellman-Ford, and Floyd-Warshall.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 1–3, 6–9, 22–24. MIT Press.
2. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.). Addison-Wesley.
3. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.). Addison-Wesley.
