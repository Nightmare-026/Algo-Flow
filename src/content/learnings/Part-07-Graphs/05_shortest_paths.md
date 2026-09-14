# Part 07: Graphs — Module 05: Shortest Path Algorithms

> **Topics Covered:**  
> 114. Dijkstra's Algorithm (Greedy SSSP with Min-Heap) &bull; 115. Bellman-Ford Algorithm (Negative Weights & Cycle Detection) &bull; 116. Floyd-Warshall Algorithm (All-Pairs Shortest Paths via Dynamic Programming)

---

# TOPIC 114: DIJKSTRA'S ALGORITHM

### 1. Problem Statement & Paradigm
Given a directed or undirected graph with **non-negative edge weights** ($w(u, v) \ge 0$) and a starting source vertex $s$, find the minimum distance from $s$ to all other vertices.
- **Paradigm**: Greedy Algorithm.
- **Data Structure**: Min-Priority Queue (Binary Heap).

---

### 2. Edge Relaxation Property
For any edge $(u, v)$ with weight $w$:
$$\text{If } \text{dist}[u] + w < \text{dist}[v] \implies \text{dist}[v] \leftarrow \text{dist}[u] + w$$

```text
       (u) ────── w = 3 ──────► (v)
     dist[u] = 4              dist[v] = 10 (Before)

     New Path Cost via u = 4 + 3 = 7 < 10!
     RELAXATION: Update dist[v] ← 7!
```

---

### 3. Pseudocode: Dijkstra with Min-Heap

```text
ALGORITHM Dijkstra(adj, V, source)
    Input: Adjacency list adj with weights (v, w), vertex count V, source
    Output: Distance array dist

1.  allocate dist[0...V - 1] initialized to ∞
2.  dist[source] ← 0
3.  minHeap ← empty MinPriorityQueue   // Stores pairs (distance, vertex)
4.  minHeap.Push((0, source))
5.  while not minHeap.IsEmpty():
6.      (d, u) ← minHeap.ExtractMin()
7.      if d > dist[u]:                // Stale pair check
8.          continue
9.      for each edge (v, weight) in adj[u]:
10.         if dist[u] + weight < dist[v]:
11.             dist[v] ← dist[u] + weight
12.             minHeap.Push((dist[v], v))
13. return dist
```

---

### 4. Why Dijkstra Fails on Negative Edge Weights
Dijkstra greedily assumes that once a vertex is extracted from the min-heap, its shortest path is permanently finalized. A negative edge later in the graph can reduce an already finalized path, breaking the greedy invariant!

---
---

# TOPIC 115: BELLMAN-FORD ALGORITHM

### 1. Problem Statement & Strengths
Bellman-Ford computes the Single-Source Shortest Path (SSSP) on graphs that **contain negative edge weights**. Furthermore, it detects whether the graph contains a **Negative Weight Cycle**.

---

### 2. Core Theorem: $V - 1$ Relaxation Passes
In a graph with $V$ vertices, any simple path (a path with no cycles) can contain at most **$V - 1$ edges**.
- Therefore, relaxing **all edges** in the graph $V - 1$ times is mathematically guaranteed to propagate shortest paths across the entire network.

---

### 3. Detecting Negative Cycles: The $V$-th Pass
If we run an additional **$V$-th relaxation pass** and *any* edge can still be relaxed ($\text{dist}[u] + w < \text{dist}[v]$), then a **Negative Weight Cycle exists**!

```text
NEGATIVE CYCLE PARADOX:
  (A) ─── 1 ───► (B) ─── (-5) ───► (C) ─── 2 ───► (A)
  Cycle Cost = 1 + (-5) + 2 = -2 < 0!
  Each loop through the cycle reduces path cost by -2 to -∞!
```

---

### 4. Pseudocode: Bellman-Ford

```text
ALGORITHM BellmanFord(edgeList, V, E, source)
    Input: Edge list containing tuples (u, v, weight), vertex count V, source
    Output: dist array, or error if negative cycle exists

1.  allocate dist[0...V - 1] initialized to ∞
2.  dist[source] ← 0
3.  // Relax all edges V - 1 times
4.  for pass ← 1 to V - 1:
5.      for each edge (u, v, w) in edgeList:
6.          if dist[u] ≠ ∞ and dist[u] + w < dist[v]:
7.              dist[v] ← dist[u] + w
8.  // V-th pass to detect negative weight cycles
9.  for each edge (u, v, w) in edgeList:
10.     if dist[u] ≠ ∞ and dist[u] + w < dist[v]:
11.         error "Graph contains a negative weight cycle!"
12. return dist
```

- **Time Complexity**: $\mathbf{\Theta(V \cdot E)}$.
- **Auxiliary Space**: $\Theta(V)$.

---
---

# TOPIC 116: FLOYD-WARSHALL ALGORITHM (ALL-PAIRS SHORTEST PATH)

### 1. Problem Statement & Paradigm
Find the shortest path between **every pair of vertices $(i, j)$** in a directed weighted graph with no negative cycles.
- **Paradigm**: Dynamic Programming.
- **State Definition**: Let $D^{(k)}[i][j]$ be the shortest distance from vertex $i$ to vertex $j$ using only intermediate vertices from the set $\{0, 1, 2, \dots, k\}$.

---

### 2. The Recurrence Transition
To compute the shortest path using intermediate vertices up to $k$, we either:
1. Do not use vertex $k$: Distance remains $D^{(k-1)}[i][j]$.
2. Route through vertex $k$: Distance becomes $D^{(k-1)}[i][k] + D^{(k-1)}[k][j]$.

$$\mathbf{Transition}: \quad D[i][j] = \min(D[i][j], \, D[i][k] + D[k][j])$$

---

### 3. Pseudocode: Floyd-Warshall

```text
ALGORITHM FloydWarshall(adjMatrix, V)
    Input: V x V matrix where adjMatrix[i][j] = weight (or ∞ if no edge, 0 on diagonal)
    Output: V x V matrix of all-pairs shortest distances

1.  allocate dist[0...V - 1][0...V - 1] initialized to adjMatrix
2.  // Intermediate vertex k MUST be the outermost loop!
3.  for k ← 0 to V - 1:
4.      for i ← 0 to V - 1:
5.          for j ← 0 to V - 1:
6.              if dist[i][k] ≠ ∞ and dist[k][j] ≠ ∞:
7.                  if dist[i][k] + dist[k][j] < dist[i][j]:
8.                      dist[i][j] ← dist[i][k] + dist[k][j]
9.  // Negative cycle check: negative distance on main diagonal
10. for i ← 0 to V - 1:
11.     if dist[i][i] < 0:
12.         error "Negative cycle detected!"
13. return dist
```

- **Time Complexity**: Strictly $\mathbf{\Theta(V^3)}$ in all cases.
- **Auxiliary Space**: $\Theta(V^2)$ distance matrix.

---

### 4. Master Comparison of Shortest Path Algorithms

| Algorithm | Problem Scope | Edge Weights Allowed | Time Complexity | Auxiliary Space |
| :--- | :--- | :--- | :---: | :---: |
| **BFS** | Single-Source (SSSP) | Unweighted only ($w = 1$) | $\Theta(V + E)$ | $\Theta(V)$ |
| **Dijkstra** | Single-Source (SSSP) | Non-negative only ($w \ge 0$) | $\Theta((V + E) \log V)$ | $\Theta(V)$ |
| **Bellman-Ford** | Single-Source (SSSP) | **Negative allowed** (Detects cycles) | $\Theta(V \cdot E)$ | $\Theta(V)$ |
| **Floyd-Warshall**| All-Pairs (APSP) | **Negative allowed** (Detects cycles) | $\Theta(V^3)$ | $\Theta(V^2)$ |

---

## Module 05 Summary & Key Takeaways

1. **Dijkstra's Algorithm** is the fastest SSSP algorithm for non-negative graphs ($O((V+E)\log V)$), but fails when negative weights are present.
2. **Bellman-Ford** handles negative edge weights and detects negative cycles by relaxing all edges $V - 1$ times ($O(V \cdot E)$).
3. **Floyd-Warshall** computes All-Pairs Shortest Paths in $O(V^3)$ via DP; the intermediate vertex $k$ must always be the outermost loop.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 20–23 (Graph Algorithms, Minimum Spanning Trees, Shortest Paths). MIT Press.
2. **Dijkstra, E. W.** (1959). A note on two problems in connexion with graphs. *Numerische Mathematik*, 1(1), 269–271.
3. **Tarjan, R. E.** (1972). Depth-first search and linear graph algorithms. *SIAM Journal on Computing*, 1(2), 146–160.
