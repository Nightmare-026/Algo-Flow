# Part 00: Front Matter — Complete DSA Roadmap & Study Tracks

Navigating the landscape of data structures and algorithms requires an intentional prerequisite graph. Advancing to dynamic programming without mastering call stack physics, or attempting graph shortest paths without understanding priority queues, leads to fragile pattern memorization rather than deep algorithmic engineering.

### Learning Objectives
By the end of this chapter, you will be able to:
- Trace the topological prerequisite order across all 12 modules in the curriculum.
- Identify how fundamental linear structures unlock non-linear hierarchical trees, networks, and advanced range-query engines.
- Formulate a personal study plan tracking your progress through all 168 syllabus topics and 525+ practice problems.
- Benchmark your progress against clear mastery milestones.

---

## 1. End-to-End Prerequisite Architecture

The curriculum is structured as a directed acyclic graph (DAG) of concepts. Each module provides the structural invariants, memory physics, or recurrence relations required by subsequent modules:

| Module | Title | Core Focus | Direct Prerequisites | Unlocks |
| :---: | :--- | :--- | :--- | :--- |
| **01** | **Algorithmic Foundations** | Asymptotic bounds ($O, \Omega, \Theta$), recurrences, call stack physics | High school algebra | Linear structures, searching |
| **02** | **Linear Data Structures** | Arrays, strings, linked lists, stacks, queues, deques | Part 01 | Hashing, sorting, trees |
| **03** | **Hashing & Constant-Time Lookups** | Hash functions, collision resolution, dynamic rehashing | Part 02 | Graph adjacency, memoization |
| **04** | **Searching Paradigms** | Binary search, monotonic search spaces, lower/upper bounds | Part 01, Part 02 | Divide & conquer, optimization |
| **05** | **Sorting Algorithms & Theory** | Comparison vs non-comparison sorts, partition, $\Omega(n \log n)$ bound | Part 02, Part 04 | Trees, two pointers, intervals |
| **06** | **Trees & Hierarchical Structures** | Binary trees, BSTs, AVL, Red-Black, Heaps, Tries | Part 02, Part 05 | Graphs, priority search, spatial trees |
| **07** | **Graph Theory & Network Algorithms** | Traversals (BFS/DFS), DAGs, shortest paths, MSTs, DSU | Part 03, Part 06 | Advanced network flow, state space |
| **08** | **Algorithm Design Paradigms** | Divide & conquer, greedy choices, backtracking, DP | Part 01, Part 06, Part 07 | Competitive patterns, advanced DP |
| **09** | **Interview & Competitive Patterns** | Two pointers, sliding window, monotonic stacks | Part 02, Part 08 | Problem bank mastery |
| **10** | **Advanced Data Structures & Algorithms** | Segment trees, Fenwick trees, Sparse Tables, HLD, LCT | Part 06, Part 07 | Systems architecture, contest performance |
| **11** | **525+ Problem Bank & Master Revision** | Multi-topic synthesis, pattern cheat sheets, revision | Parts 01–10 | Technical interviews & university exams |

---

## 2. Topic-by-Topic Syllabus Checklist

Use this checklist to monitor your personal progress through all 168 syllabus topics.

### Part 01: Algorithmic Foundations (Topics 1–19)
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
- [x] 31. Priority Queue Fundamentals (ADT Specification, Array/List vs Binary Heap Trade-offs)

### Part 03: Hashing & Constant-Time Lookups (Topics 32–41)
- [x] 32. Hashing Fundamentals & Pigeonhole Principle
- [x] 33. Hash Functions & Uniform Distribution
- [x] 34. Collision & Load Factor ($\alpha$)
- [x] 35. Separate Chaining
- [x] 36. Open Addressing Principles & Tombstones
- [x] 37. Linear Probing
- [x] 38. Quadratic Probing
- [x] 39. Double Hashing
- [x] 40. Hash Table Architecture & Dynamic Rehashing ($\alpha \ge 0.75$)
- [x] 40b. Hash Map Architecture (Unique Key Invariants, Bucket Treeification, Compact Dicts)
- [x] 40c. Hash Set Architecture (Deduplication Engine, Map Backing, Set Operations)
- [x] 41. Advanced Collision Resolution (Cuckoo Hashing $O(1)$ Worst-Case, Robin Hood PSL)
- [x] 41b. Perfect Hashing (FKS 2-Level Hashing with Guaranteed Zero Collisions in $O(n)$ Space)
- [x] 41c. Probabilistic Data Structures (Bloom Filters with Zero False Negatives, Count-Min Sketch)

### Part 04: Searching Paradigms (Topics 42–49)
- [x] 42. Linear Search
- [x] 43. Classical Binary Search
- [x] 44. Binary Search Invariants & Variants
- [x] 45. Lower Bound Search
- [x] 46. Upper Bound Search
- [x] 47. First & Last Occurrence of an Element
- [x] 48. Search in Rotated Sorted Array
- [x] 49. Binary Search on Answer / Monotonic Search Space

### Part 05: Sorting Algorithms & Theory (Topics 50–62)
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
- [x] 02. Tree Traversals (DFS Pre/In/Post, BFS Level Order, Zigzag, Morris $O(1)$ Space, Views)
- [x] 03. Binary Search Trees (Search, Insert, 3-Case Delete, Successor/Predecessor, Validations)
- [x] 04. AVL Trees (Balance Factor $BF \in \{-1, 0, 1\}$, Fibonacci Height Proof, Rotations)
- [x] 05. Red-Black Trees (5 Invariants, Height Proof $h \le 2\log_2(n+1)$, Insert & Delete Fixup)
- [x] 06. Splay Trees & Treaps (Splay Rotations, Tarjan Amortized Proof, Cartesian Duality, Split & Merge)
- [x] 07. Binary Heaps & Priority Queues (Min/Max Heap, Sift-Up/Down, $O(n)$ Build-Heap Proof, Binomial/Fibonacci)
- [x] 08. Multiway Trees, B-Trees & B+ Trees (Disk Page Cache, Proactive Split, Borrow/Merge, Leaf Chains)
- [x] 09. Tries, Radix Trees & Bitwise Structures (Standard Trie, Patricia/Radix Tree, 0-1 Bitwise Trie, Aho-Corasick)
- [x] 10. Spatial & Specialized Trees (Kd-Trees, Quadtrees/Octrees, Cartesian Trees, Threaded Trees)

### Part 07: Graph Theory & Network Algorithms (Topics 98–120)
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

### Part 08: Algorithm Design Paradigms (Topics 121–133)
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

### Part 09: Interview & Competitive Patterns (Topics 134–147)
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

### Part 10: Advanced Data Structures & Algorithms (Modules 01–03)
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

## 3. Recommended Study Strategies & Milestones

1. **Foundations First**: Never skip Part 01 or Part 02. The amortized doubling physics of dynamic arrays and the pointer mechanics of linked lists form the bedrock of memory awareness.
2. **Pairs that Synergize**: Study searching (Part 04) alongside sorting (Part 05); study priority queues (Part 06 Module 07) alongside Dijkstra's algorithm (Part 07 Topic 114).
3. **Trace Before Coding**: Before typing solution code, draw the state transitions and dry-run the sample input against a variable table.

---

## 4. Key Takeaways

- **Prerequisite Discipline**: Progressing through the curriculum in topological order prevents cognitive bottlenecks when encountering hybrid structures like Fenwick trees or heavy-light decomposition.
- **Syllabus Coverage**: All 168 topics are indexed with stable numerical identifiers matching the curriculum's interactive visualizers and practice problem banks.
- **Active Tracking**: Use this roadmap as an interactive syllabus checkpoint as you complete each chapter and milestone.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.). MIT Press.
2. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.). Addison-Wesley.
3. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.). Addison-Wesley.
