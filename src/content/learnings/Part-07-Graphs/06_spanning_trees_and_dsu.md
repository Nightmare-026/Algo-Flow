# 🌲 Part 07: Graphs — Module 06: Minimum Spanning Trees & Disjoint Set Union (DSU)

> **Topics Covered:**  
> 117. Minimum Spanning Tree (MST) Concept & The Cut Property &bull; 118. Prim's Algorithm (Greedy Vertex-Growth via Min-Heap) &bull; 119. Kruskal's Algorithm (Greedy Edge-Selection) &bull; 120. Disjoint Set Union (DSU / Union-Find with Path Compression & Rank)

---

# TOPIC 117: MINIMUM SPANNING TREE (MST) FUNDAMENTALS

### 1. Definition
Given a connected, undirected, weighted graph $G = (V, E)$, a **Spanning Tree** is a subgraph $T = (V, E')$ that connects all $V$ vertices using exactly **$V - 1$ edges** without containing any cycles.

A **Minimum Spanning Tree (MST)** is a spanning tree whose sum of edge weights is minimized:

$$\text{Weight}(T) = \sum_{e \in T} w(e) \quad \text{is minimized across all possible spanning trees.}$$

---

### 2. The Cut Property (Foundation of Greedy MST Algorithms)
- **Cut**: A partition of the vertices $V$ into two disjoint sets $S$ and $V \setminus S$.
- **Crossing Edge**: An edge $(u, v)$ where $u \in S$ and $v \in V \setminus S$.
- **⭐ THE CUT THEOREM**: For any cut of the graph, the crossing edge with the **strictly minimum weight** is guaranteed to belong to the Minimum Spanning Tree!

```text
       SET S                                       SET V \ S
   ┌───────────┐                               ┌───────────┐
   │    (A)    │ ──────────── 8 ─────────────► │    (C)    │
   │     │     │                               │     │     │
   │     │     │ ────── 2 (MIN WEIGHT!) ─────► │     │     │  ◄── BY CUT PROPERTY:
   │    (B)    │                               │    (D)    │      Edge (B,D) MUST be in MST!
   └───────────┘                               └───────────┘
```

---
---

# TOPIC 118: PRIM'S ALGORITHM

### 1. Paradigm & Mechanics
Prim's algorithm is a greedy node-growing algorithm (closely related to Dijkstra's):
1. Start with an arbitrary vertex $s$ in the MST.
2. Maintain a Min-Priority Queue of crossing edges connecting vertices currently inside the MST to unvisited vertices outside.
3. Greedily pick the minimum-weight crossing edge $(u, v)$ from the heap.
4. Add $v$ to the MST and push all of $v$'s incident edges into the heap.
5. Repeat until all $V$ vertices are in the tree.

---

### 2. Pseudocode: Prim's Algorithm

```text
ALGORITHM Prim(adj, V)
    Input: Adjacency list adj with weights, vertex count V
    Output: Minimum Spanning Tree edge list and total weight

1.  allocate inMST[0...V - 1] initialized to false
2.  minHeap ← empty MinPriorityQueue   // Stores tuples (weight, vertex, parent)
3.  minHeap.Push((0, 0, -1))           // Start at vertex 0 with parent -1
4.  totalWeight ← 0
5.  mstEdges ← empty List
6.  while not minHeap.IsEmpty() and mstEdges.Size() < V - 1:
7.      (w, u, parent) ← minHeap.ExtractMin()
8.      if inMST[u]: continue
9.      inMST[u] ← true
10.     totalWeight ← totalWeight + w
11.     if parent ≠ -1:
12.         mstEdges.Append((parent, u, w))
13.     for each edge (v, weight) in adj[u]:
14.         if not inMST[v]:
15.             minHeap.Push((weight, v, u))
16. return (mstEdges, totalWeight)
```

- **Time Complexity**: $\mathbf{\Theta((V + E) \log V)}$ using a Binary Heap.
- **Optimal Domain**: **Dense Graphs** ($E \approx V^2$).

---
---

# TOPIC 120: DISJOINT SET UNION (DSU / UNION-FIND)

Before examining Kruskal's algorithm, we must understand the data structure that makes it possible: **DSU**.

### 1. Definition & Operations
A **Disjoint Set Union (DSU)** tracks a collection of partitioned, non-overlapping subsets:
- **`MakeSet(x)`**: Creates a new singleton set $\{x\}$.
- **`Find(x)`**: Returns the representative (root) of the set containing $x$.
- **`Union(x, y)`**: Merges the set containing $x$ with the set containing $y$.

---

### 2. The Two Cardinal Optimizations

#### Optimization 1: Union by Rank / Size
Always attach the tree with the smaller height (rank) under the root of the taller tree. This bounds the tree height to $O(\log N)$.

#### Optimization 2: Path Compression
During `Find(x)`, update every visited node's parent pointer to point **directly to the root**!

```text
PATH COMPRESSION DURING Find(4):
BEFORE:                            AFTER PATH COMPRESSION:
       [ 1 ] (Root)                        [ 1 ] (Root)
         │                                /  │  \
       [ 2 ]                           [ 2 ][ 3 ][ 4 ]
         │
       [ 3 ]
         │
       [ 4 ]
```

---

### 3. Asymptotic Bound: The Inverse Ackermann Function $\alpha(N)$
When both Union by Rank and Path Compression are combined:

$$\text{Time per Operation} = \mathbf{O(\alpha(N))}$$

Where $\alpha(N)$ is the **Inverse Ackermann function**. For all physical values in the known universe ($N \le 10^{80}$ atoms in the universe), $\alpha(N) \le 4$.  
**For all practical computing purposes, DSU operations run in strictly $\mathbf{O(1)}$ constant time!**

---

### 4. Complete Pseudocode: Disjoint Set Union (DSU)

```text
DATA STRUCTURE DisjointSetUnion
    Fields:
        parent: array of integers
        rank: array of integers

    OPERATION Initialize(n):
        allocate parent[0...n - 1]
        allocate rank[0...n - 1]
        for i ← 0 to n - 1:
            parent[i] ← i       // Each node is its own parent initially
            rank[i] ← 0

    OPERATION Find(i):
        if parent[i] ≠ i:
            parent[i] ← Find(parent[i])  // Path Compression!
        return parent[i]

    OPERATION Union(x, y):
        rootX ← Find(x)
        rootY ← Find(y)
        if rootX = rootY:
            return false        // Already in same set! (Detects cycle)
        // Union by Rank
        if rank[rootX] < rank[rootY]:
            parent[rootX] ← rootY
        else if rank[rootX] > rank[rootY]:
            parent[rootY] ← rootX
        else:
            parent[rootY] ← rootX
            rank[rootX] ← rank[rootX] + 1
        return true
```

---
---

# TOPIC 119: KRUSKAL'S ALGORITHM

### 1. Paradigm & Mechanics
Kruskal's algorithm is an edge-based greedy algorithm that builds the MST one edge at a time:
1. Extract all edges into an **Edge List** and sort them in non-decreasing order of weight ($w_1 \le w_2 \le \dots \le w_E$).
2. Initialize a DSU with $V$ singleton sets.
3. Iterate through sorted edges. For each edge $(u, v)$:
   - Check if $u$ and $v$ belong to the same set via `Find(u)` and `Find(v)`.
   - If `Find(u) ≠ Find(v)`: Adding the edge **will not form a cycle**!  
     Add $(u, v)$ to the MST and merge sets via `Union(u, v)`.
   - If `Find(u) = Find(v)`: Discard the edge (it would create a cycle).
4. Terminate when $V - 1$ edges have been added.

---

### 2. Pseudocode: Kruskal's Algorithm

```text
ALGORITHM Kruskal(edgeList, V, E)
    Input: List of edges (u, v, weight), vertex count V, edge count E
    Output: List of edges in the MST and total weight

1.  Sort(edgeList by weight ascending)  // O(E log E)
2.  dsu ← DisjointSetUnion(V)
3.  mstEdges ← empty List
4.  totalWeight ← 0
5.  for each edge (u, v, w) in edgeList:
6.      if dsu.Union(u, v) = true:     // True if u and v were in different sets
7.          mstEdges.Append((u, v, w))
8.          totalWeight ← totalWeight + w
9.          if mstEdges.Size() = V - 1:
10.             break
11. return (mstEdges, totalWeight)
```

- **Time Complexity**:
  - Sorting edges: $\Theta(E \log E) = \Theta(E \log V)$.
  - $E$ DSU operations: $O(E \cdot \alpha(V)) \approx O(E)$.
  - **Total Runtime**: $\mathbf{\Theta(E \log E)} = \mathbf{\Theta(E \log V)}$.
- **Auxiliary Space**: $\Theta(V)$ for DSU arrays.
- **Optimal Domain**: **Sparse Graphs** ($E \ll V^2$).

---

### 3. Summary Comparison: Prim vs Kruskal

| Feature | Prim's Algorithm | Kruskal's Algorithm |
| :--- | :--- | :--- |
| **Paradigm** | Vertex-growth (grows single connected tree) | Edge-growth (grows forest of trees and connects) |
| **Primary Data Structure** | Min-Priority Queue (Binary Heap) | **Disjoint Set Union (DSU)** + Array Sort |
| **Time Complexity** | $O((V + E) \log V)$ | $O(E \log E)$ |
| **Best Used For** | **Dense Graphs** ($E \approx V^2$) | **Sparse Graphs** ($E \approx V$) |

---

## 🔁 Module 06 Summary & Key Takeaways

1. By the **Cut Property**, the minimum-weight crossing edge for any cut is guaranteed to be in the MST.
2. **Prim's** grows from a root vertex using a min-heap in $O((V+E)\log V)$ time; best for dense graphs.
3. **Kruskal's** sorts all edges and uses **DSU** to prevent cycles in $O(E \log E)$ time; best for sparse graphs.
4. **DSU with Path Compression and Rank** executes union and find operations in effectively $O(1)$ amortized time ($O(\alpha(N))$).

---
[⬅️ Previous: Module 05 — Shortest Paths](file:///d:/DSA/Part-07-Graphs/05_shortest_paths.md) | [Next: Part 08 — Algorithm Design Techniques ➡️](file:///d:/DSA/Part-08-Algorithm-Design-Techniques/01_brute_force_and_divide_conquer.md)
