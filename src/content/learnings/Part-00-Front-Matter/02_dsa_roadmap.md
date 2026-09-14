# Part 00: Front Matter — Complete DSA Roadmap & Study Tracks

---

## 1. Visual End-to-End Progression Graph

The following dependency map charts the required learning path across computer science data structures and algorithms. Arrows indicate strict prerequisite relationships.

```text
                        ┌────────────────────────────────┐
                        │   PART 01: FOUNDATIONS         │
                        │   - Asymptotic Analysis (O,Ω,Θ)│
                        │   - Recurrences & Call Stack   │
                        └───────────────┬────────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 ▼                                             ▼
  ┌──────────────────────────────┐              ┌──────────────────────────────┐
  │ PART 02: LINEAR STRUCTURES   │              │ PART 04: SEARCHING           │
  │ - Static & Dynamic Arrays    │              │ - Linear & Binary Search     │
  │ - Strings & Matrices         │              │ - Bound Search (Lower/Upper) │
  │ - Singly/Doubly Linked Lists │              │ - Search on Answer Space     │
  │ - Stacks, Queues, Deques     │              └──────────────┬───────────────┘
  └──────────────┬───────────────┘                             │
                 │                                             │
                 ├───────────────────────────────┐             │
                 ▼                               ▼             ▼
  ┌──────────────────────────────┐              ┌──────────────────────────────┐
  │ PART 03: HASHING             │              │ PART 05: SORTING             │
  │ - Hash Functions & Collisions│              │ - Elementary Sorts (O(n²))   │
  │ - Chaining vs Open Addressing│              │ - Divide & Conquer (O(nlogn))│
  │ - Hash Tables & Rehashing    │              │ - Linear Time Sorts (O(n))   │
  └──────────────┬───────────────┘              └──────────────┬───────────────┘
                 │                                             │
                 └──────────────────────┬──────────────────────┘
                                        ▼
                        ┌────────────────────────────────┐
                        │ PART 06: HIERARCHICAL (TREES)  │
                        │ - Binary Trees & Traversals    │
                        │ - Binary Search Trees (BST)    │
                        │ - Self-Balancing (AVL Trees)   │
                        │ - Priority Queues & Heaps      │
                        │ - Prefix Trees (Tries)         │
                        └───────────────┬────────────────┘
                                        ▼
                        ┌────────────────────────────────┐
                        │ PART 07: NETWORKS (GRAPHS)     │
                        │ - Representations (Adj List)   │
                        │ - Traversals (BFS & DFS)       │
                        │ - Topological Sorting (DAGs)   │
                        │ - Shortest Paths (Dijkstra)    │
                        │ - MST (Prim/Kruskal) & DSU     │
                        └───────────────┬────────────────┘
                                        ▼
                        ┌────────────────────────────────┐
                        │ PART 08: ALGORITHM PARADIGMS   │
                        │ - Divide & Conquer             │
                        │ - Greedy Choice Property       │
                        │ - Backtracking & State Space   │
                        │ - Dynamic Programming (DP)     │
                        └───────────────┬────────────────┘
                                        ▼
                        ┌────────────────────────────────┐
                        │ PART 09: PROBLEM-SOLVING       │
                        │ - Two Pointers & Sliding Window│
                        │ - Monotonic Stack / Queue      │
                        │ - Intervals & Bit Manipulation │
                        └───────────────┬────────────────┘
                                        ▼
                        ┌────────────────────────────────┐
                        │ PART 10: ADVANCED DSA          │
                        │ - Segment Tree & Lazy Prop     │
                        │ - Fenwick Tree (BIT)           │
                        │ - Sparse Table (RMQ O(1))      │
                        │ - SCC (Tarjan / Kosaraju)      │
                        └────────────────────────────────┘
```

---

## 2. Topic-by-Topic Checklist

Use this checklist to monitor your personal progress through all 168 sections.

### Part 01: Foundations (Topics 1–19)
- [x] 01. What is Data?
- [x] 02. What is a Data Structure?
- [x] 03. What is an Algorithm?
- [x] 04. Characteristics of a Good Algorithm
- [x] 05. Algorithm vs Program
- [x] 06. Algorithm Design Process
- [x] 07. Problem-Solving Methodology
- [x] 08. Pseudocode Basics
- [x] 09. Flowchart Basics
- [x] 10. Time Complexity
- [x] 11. Space Complexity
- [x] 12. Big-O ($O$) Notation
- [x] 13. Big-Omega ($\Omega$) Notation
- [x] 14. Big-Theta ($\Theta$) Notation
- [x] 15. Best, Average, and Worst Case
- [x] 16. Complexity Growth Rates
- [x] 17. Recursion Fundamentals
- [x] 18. Recurrence Relations & Master Theorem
- [x] 19. Iteration vs Recursion

### Part 02: Linear Data Structures (Topics 20–31)
- [x] 20. Static Arrays
- [x] 21. Dynamic Arrays (Vectors / ArrayLists)
- [x] 22. Strings & Character Encodings
- [x] 23. Matrices & Multi-Dimensional Arrays
- [x] 24. Singly Linked List (Node Anatomy, 3-Pointer In-Place Reversal, Floyd's Cycle Proof)
- [x] 25. Doubly Linked List (Two-Way Pointers, $O(1)$ Arbitrary Deletion, Sentinels)
- [x] 26. Circular Linked List (Singly & Doubly Circular Lists, Josephus Problem)
- [x] 26b. Specialized Linked Lists (Skip Lists, Unrolled Linked Lists, XOR Linked Lists)
- [x] 27. Stack (LIFO Principle, Array & Linked Backing, Call Stack, Shunting-Yard, Balanced Delimiters)
- [x] 28. Queue (FIFO Principle, Linear Drift / False Overflow Problem)
- [x] 29. Circular Queue (Modulo Arithmetic Ring Buffers $(i+1)\%C$, Kernel Ring Buffers)
- [x] 30. Double-Ended Queue (Deque: Input-Restricted, Output-Restricted, Monotonic Sliding Window)
- [x] 31. Priority Queue Fundamentals (ADT Specification, Unsorted/Sorted Array/List vs Binary Heap Trade-offs)

### Part 03: Hashing (Topics 32–41)
- [x] 32. Hashing Fundamentals & Pigeonhole Principle
- [x] 33. Hash Functions & Uniform Distribution
- [x] 34. Collision & Load Factor ($\alpha$)
- [x] 35. Separate Chaining
- [x] 36. Open Addressing Principles & Tombstones
- [x] 37. Linear Probing
- [x] 38. Quadratic Probing
- [x] 39. Double Hashing
- [x] 40. Hash Table Architecture & Dynamic Rehashing ($\alpha \ge 0.75$)
- [x] 40b. Hash Map Architecture (Unique Key Invariants, Java 8+ Bucket Treeification, Python Compact Dicts)
- [x] 40c. Hash Set Architecture (Deduplication Engine, Map Backing, Mathematical Set Operations)
- [x] 41. Advanced Collision Resolution (Cuckoo Hashing $O(1)$ Worst-Case, Robin Hood PSL Variance Reduction)
- [x] 41b. Perfect Hashing (FKS 2-Level Hashing with Guaranteed Zero Collisions in $O(n)$ Space)
- [x] 41c. Probabilistic Data Structures (Bloom Filters with Zero False Negatives, Count-Min Sketch)

### Part 04: Searching (Topics 42–49)
- [x] 42. Linear Search
- [x] 43. Classical Binary Search
- [x] 44. Binary Search Invariants & Variants
- [x] 45. Lower Bound Search
- [x] 46. Upper Bound Search
- [x] 47. First & Last Occurrence of an Element
- [x] 48. Search in Rotated Sorted Array
- [x] 49. Binary Search on Answer / Monotonic Search Space

### Part 05: Sorting (Topics 50–62)
- [x] 50. Bubble Sort
- [x] 51. Selection Sort
- [x] 52. Insertion Sort
- [x] 53. Merge Sort
- [x] 54. Quick Sort & 3-Way Partitioning
- [x] 55. Heap Sort
- [x] 56. Counting Sort
- [x] 57. Radix Sort
- [x] 58. Bucket Sort
- [x] 59. Sorting Stability
- [x] 60. In-Place vs Out-of-Place Sorting
- [x] 61. Comparison-Based Lower Bound ($\Omega(n \log n)$) vs Non-Comparison
- [x] 62. Complete Master Sorting Comparison

### Part 06: Trees & Hierarchical Structures (Modules 01–10)
- [x] 01. Tree Fundamentals (Terminology, Anatomy, Complete/Full/Perfect/Degenerate Trees)
- [x] 02. Tree Traversals (DFS Pre/In/Post, BFS Level Order, Zigzag, Morris $O(1)$ Space, Top/Bottom/Boundary Views)
- [x] 03. Binary Search Trees (Search, Insert, 3-Case Delete, Successor/Predecessor, Validations)
- [x] 04. AVL Trees (Balance Factor $BF \in \{-1, 0, 1\}$, Fibonacci Height Proof, LL/RR/LR/RL Rotations)
- [x] 05. Red-Black Trees (5 Invariants, Height Proof $h \le 2\log_2(n+1)$, 3-Case Insert Fixup, 4-Case Double-Black Delete Fixup)
- [x] 06. Splay Trees & Treaps (Splay Zig/Zig-Zig/Zig-Zag Rotations, Tarjan Amortized $O(\log n)$ Proof, Treap Cartesian Duality, Split & Merge, Implicit Treap)
- [x] 07. Binary Heaps & Priority Queues (Min/Max Heap, Sift-Up/Down, $O(n)$ Build-Heap Proof, D-ary, Binomial & Fibonacci Heaps)
- [x] 08. Multiway Trees, B-Trees & B+ Trees (Disk Page Cache, Proactive Split Insert, Borrow/Merge Delete, Doubly-Linked Leaf Chain, 2-3 & 2-3-4 Trees)
- [x] 09. Tries, Radix Trees & Bitwise Structures (Standard Trie, Compressed Patricia/Radix Tree, 0-1 Bitwise Trie for Max XOR, Suffix Trees, Aho-Corasick)
- [x] 10. Spatial & Specialized Trees (Kd-Trees with k-NN Hyperplane Pruning, Quadtrees/Octrees, Cartesian Trees with $O(n)$ Monotonic Stack, Threaded Trees)

### Part 07: Graphs & Networks (Topics 98–120)
- [x] 98. Graph Terminology, Anatomy & Euler's Handshaking Lemma
- [x] 99. Directed (Digraphs) vs Undirected Graphs (Degrees, Handshaking for Digraphs)
- [x] 100. Weighted vs Unweighted Graphs (Metric Distances, Negative Weights, Negative Cycles)
- [x] 101. Directed Acyclic Graphs (DAGs: Sources, Sinks, Topological Order, DP Engine)
- [x] 102. Bipartite Graphs & The Odd Cycle Theorem (2-Coloring BFS/DFS)
- [x] 102b. Complete Graphs ($K_n, K_{m,n}$), Planar Graphs (Euler's $V - E + F = 2$), Eulerian vs Hamiltonian
- [x] 103. Graph Storage Strategies & The Sparsity Threshold
- [x] 104. Adjacency Matrix Representation & Matrix Powers ($A^k$ Path Counting)
- [x] 105. Adjacency List Representation (Dynamic Vectors vs Pointers)
- [x] 106. Edge List Representation (Triplets for Kruskal & Bellman-Ford)
- [x] 106b. Compressed Sparse Row (CSR) & Compressed Sparse Column (CSC) in HPC & AI
- [x] 107. Breadth-First Search (BFS & Unweighted Shortest Paths)
- [x] 108. Depth-First Search (DFS & Edge Classifications: Tree, Back, Forward, Cross)
- [x] 109. Cycle Detection (Undirected Back Edges & Directed 3-Coloring DFS)
- [x] 110. Connected Components & Flood Fill
- [x] 111. Bipartite Graph Verification Algorithm
- [x] 112. Topological Sort (DFS Postorder Stack Method)
- [x] 113. Kahn's Algorithm (BFS In-Degree Queue & Built-in Cycle Detection)
- [x] 114. Dijkstra's Shortest Path Algorithm (Greedy SSSP with Min-Heap)
- [x] 115. Bellman-Ford Algorithm (Negative Weights & Negative Cycle Detection)
- [x] 116. Floyd-Warshall All-Pairs Shortest Path (APSP via Dynamic Programming)
- [x] 117. Minimum Spanning Tree (MST) Concept & The Cut Property
- [x] 118. Prim's Algorithm (Greedy Vertex-Growth via Min-Heap)
- [x] 119. Kruskal's Algorithm (Greedy Edge-Selection via DSU)
- [x] 120. Disjoint Set Union (DSU / Union-Find with Path Compression & Rank)

### Part 08: Algorithm Design Techniques (Topics 121–133)
- [x] 121. Brute Force & Exhaustive Search
- [x] 122. Divide and Conquer Paradigm
- [x] 123. Greedy Paradigm & Greedy-Choice Property
- [x] 124. Backtracking & State Space Exploration
- [x] 125. Dynamic Programming Fundamentals (Overlapping Subproblems)
- [x] 126. Top-Down DP with Memoization
- [x] 127. Bottom-Up DP with Tabulation
- [x] 128. Optimal State Definition in DP
- [x] 129. Recurrence Transitions
- [x] 130. Base Cases & Boundary Handling
- [x] 131. Space Optimization Techniques in DP
- [x] 132. Greedy vs Dynamic Programming Trade-offs
- [x] 133. Backtracking vs Brute Force vs Branch & Bound

### Part 09: Problem-Solving Patterns (Topics 134–147)
- [x] 134. Prefix Sum Pattern (1D & 2D)
- [x] 135. Difference Array Pattern (Range Updates)
- [x] 136. Two Pointers Pattern (Opposite & Same Direction)
- [x] 137. Sliding Window Pattern (Fixed & Variable Length)
- [x] 138. Fast & Slow Pointer (Floyd's Tortoise and Hare)
- [x] 139. Monotonic Stack Pattern (Next Greater/Smaller Element)
- [x] 140. Monotonic Queue Pattern (Sliding Window Maximum)
- [x] 141. Interval Merge & Overlap Pattern
- [x] 142. Binary Search on Answer Space Pattern
- [x] 143. Heap / Top-K Pattern
- [x] 144. Hash Map Frequency & Invariant Pattern
- [x] 145. Recursion & Divide-and-Conquer Pattern
- [x] 146. Backtracking Search Pattern
- [x] 147. Bit Manipulation Tricks & Masking

### Part 10: Advanced DSA & Tree Decompositions (Modules 01–03)
- [x] 148. Segment Tree & Range Queries ($O(\log N)$)
- [x] 149. Segment Tree with Lazy Propagation ($O(\log N)$ Range Updates)
- [x] 150. Fenwick Tree (Binary Indexed Tree / BIT & `i & (-i)`)
- [x] 151. Sparse Table (Static Range Minimum Query in strictly $O(1)$)
- [x] 152. Strongly Connected Components (Tarjan's & Kosaraju's)
- [x] 153. String Algorithms (KMP & $\pi$ Table)
- [x] 154. Advanced Tree Techniques (Euler Tour, Tree Flattening, Binary Lifting LCA)
- [x] 154b. Heavy-Light Decomposition (HLD & $O(\log^2 N)$ Path Queries)
- [x] 154c. Segment Tree Mapping on Heavy Paths
- [x] 154d. Centroid Decomposition ($O(N \log N)$ Divide-and-Conquer)
- [x] 154e. Link-Cut Trees (Sleator-Tarjan Dynamic Forests & Splay Preferred Paths)
- [x] 155. Advanced DP Optimizations (Bitmask DP & Digit DP)

### Part 11: 525+ Problem Bank & Master Revision (Modules 01–09)
- [x] Module 01: Arrays, Strings, Matrices & Pointer Patterns (100 Problems: Q001–Q100)
- [x] Module 02: Linked Lists, Stacks, Queues & Monotonic Structures (60 Problems: Q101–Q160)
- [x] Module 03: Hashing, HashMaps & Binary Search (80 Problems: Q161–Q240)
- [x] Module 04: Trees, BSTs, Heaps & Tries (100 Problems: Q241–Q340)
- [x] Module 05: Graphs, Traversals, Shortest Paths & MSTs (70 Problems: Q341–Q410)
- [x] Module 06: Dynamic Programming Across All Families (60 Problems: Q411–Q470)
- [x] Module 07: Greedy, Backtracking, Bit Hacks, Math & Geometry (55 Problems: Q471–Q525)
- [x] Module 08: Hall of Common Pitfalls & Frequently Confused Concepts
- [x] Module 09: Master Revision Sheets, Complexity Matrix & Final Map

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 1–3. MIT Press.
2. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.). Addison-Wesley.
3. **IEEE / ACM Computing Curricula Guidelines** (2020). Curriculum Guidelines for Undergraduate Degree Programs in Computer Science.
