# 🔍 Part 07: Graphs — Module 03: Graph Traversals, Cycles & Connectivity

> **Topics Covered:**  
> 107. Breadth-First Search (BFS & Unweighted Shortest Path) &bull; 108. Depth-First Search (DFS & Edge Classifications) &bull; 109. Cycle Detection (Undirected vs Directed 3-Coloring) &bull; 110. Connected Components & Flood Fill &bull; 111. Bipartite Graph Detection (2-Coloring Theorem)

---

# TOPIC 107: BREADTH-FIRST SEARCH (BFS)

### 1. Problem Statement & Paradigm
Given a graph $G = (V, E)$ and a starting `source` vertex $s$, visit every reachable vertex in concentric layers radiating outwards from $s$.
- **Data Structure**: Uses a **FIFO Queue** and a boolean **`visited[]` array** to ensure each vertex is processed exactly once.
- **⭐ KEY THEOREM**: In an unweighted graph, BFS is guaranteed to discover the **shortest path (minimum number of edges)** from $s$ to any reachable vertex!

---

### 2. Pseudocode: Breadth-First Search

```text
ALGORITHM BFS(adj, V, source)
    Input: Adjacency list adj, vertex count V, source vertex
    Output: Order of visited vertices and distance array dist

1.  allocate visited[0...V - 1] initialized to false
2.  allocate dist[0...V - 1] initialized to ∞
3.  queue ← empty Queue
4.  visited[source] ← true
5.  dist[source] ← 0
6.  queue.Enqueue(source)
7.  while not queue.IsEmpty():
8.      u ← queue.Dequeue()
9.      Print(u)
10.     for each neighbor v in adj[u]:
11.         if not visited[v]:
12.             visited[v] ← true
13.             dist[v] ← dist[u] + 1
14.             queue.Enqueue(v)
15. return dist
```

---

### 3. Complexity:
- **Time Complexity**: $\mathbf{\Theta(V + E)}$ (Each vertex is enqueued at most once; every incident edge is explored once).
- **Auxiliary Space**: $\mathbf{\Theta(V)}$ (For `queue` and `visited[]` array).

---
---

# TOPIC 108: DEPTH-FIRST SEARCH (DFS)

### 1. Problem Statement & Paradigm
DFS explores as deeply as possible along each branch before backtracking. It uses the runtime **Call Stack** (or an explicit stack) and a `visited[]` array.

---

### 2. Pseudocode: Depth-First Search

```text
ALGORITHM DFS(adj, V, source):
1.  allocate visited[0...V - 1] initialized to false
2.  DFSVisit(adj, source, visited)

ALGORITHM DFSVisit(adj, u, visited):
1.  visited[u] ← true
2.  Print(u)
3.  for each neighbor v in adj[u]:
4.      if not visited[v]:
5.          DFSVisit(adj, v, visited)
```

---

### 3. The 4 Types of Edges in a DFS Forest (Directed Graphs)
1. **Tree Edge**: Discovers an unvisited vertex $v$ for the first time ($u \to v$).
2. **Back Edge**: Connects to an **ancestor** in the current DFS path ($u \to \text{ancestor}$). **Indicates a CYCLE!**
3. **Forward Edge**: Connects to a descendant in the DFS tree ($u \to \text{descendant}$).
4. **Cross Edge**: Connects between two different branches of the DFS tree.

---
---

# TOPIC 109: CYCLE DETECTION

### 1. Undirected Graph Cycle Detection (Parent Pointer Technique)
In an undirected graph, an edge connects back and forth between two vertices. A cycle exists if we encounter an already visited neighbor that is **NOT the immediate parent** of the current vertex!

```text
ALGORITHM HasCycleUndirected(adj, u, parent, visited)
1.  visited[u] ← true
2.  for each neighbor v in adj[u]:
3.      if not visited[v]:
4.          if HasCycleUndirected(adj, v, u, visited) = true:
5.              return true
6.      else if v ≠ parent:     // Visited neighbor that is NOT parent ──► CYCLE!
7.          return true
8.  return false
```

---

### 2. Directed Graph Cycle Detection (The 3-Coloring State Machine)
In a directed graph, a cycle exists if and only if a **Back Edge** is discovered. We track each vertex across **3 states (colors)**:
- **WHITE (0)**: Unvisited.
- **GRAY (1)**: Currently active on the recursion call stack (being processed).
- **BLACK (2)**: Completely processed and exited.

$$\mathbf{Cycle \ Condition}: \quad \text{Encountering an edge } (u \to v) \text{ where } v \text{ is colored } \mathbf{GRAY}!$$

```text
ALGORITHM HasCycleDirected(adj, u, color)
1.  color[u] ← 1                // Mark GRAY (In call stack)
2.  for each neighbor v in adj[u]:
3.      if color[v] = 1:        // Back edge to active ancestor ──► CYCLE!
4.          return true
5.      if color[v] = 0:        // Unvisited
6.          if HasCycleDirected(adj, v, color) = true:
7.              return true
8.  color[u] ← 2                // Mark BLACK (Completed)
9.  return false
```

---
---

# TOPIC 110: CONNECTED COMPONENTS & FLOOD FILL

If an undirected graph is disconnected, running BFS/DFS from a single source visits only that specific island. To discover all components, iterate through all vertices $0 \dots V - 1$:

```text
ALGORITHM CountConnectedComponents(adj, V)
1.  allocate visited[0...V - 1] initialized to false
2.  componentCount ← 0
3.  for v ← 0 to V - 1:
4.      if not visited[v]:
5.          componentCount ← componentCount + 1
6.          BFS(adj, V, v, visited)  // Traverses the entire component
7.  return componentCount
```

---
---

# TOPIC 111: BIPARTITE GRAPH DETECTION (2-COLORING)

### 1. Definition & The Odd Cycle Theorem
A graph is **Bipartite** if its vertices can be partitioned into two independent sets $U$ and $V$ such that every edge connects a vertex in $U$ to a vertex in $V$ (no edges exist between vertices of the same set).

$$\mathbf{Theorem}: \quad \text{A graph is Bipartite } \iff \text{It contains } \mathbf{NO \ odd-length \ cycles!}$$

---

### 2. 2-Coloring Algorithm via BFS
Attempt to color the graph using 2 colors (`0` and `1`). If any neighbor has the **exact same color** as the current vertex, the graph is NOT bipartite!

```text
ALGORITHM IsBipartite(adj, V)
1.  allocate color[0...V - 1] initialized to -1
2.  for i ← 0 to V - 1:
3.      if color[i] = -1:
4.          queue ← empty Queue
5.          color[i] ← 0
6.          queue.Enqueue(i)
7.          while not queue.IsEmpty():
8.              u ← queue.Dequeue()
9.              for each v in adj[u]:
10.                 if color[v] = -1:
11.                     color[v] ← 1 - color[u]   // Color with alternate color
12.                     queue.Enqueue(v)
13.                 else if color[v] = color[u]:  // Same color on adjacent vertices!
14.                     return false              // Graph has an odd cycle!
15. return true
```

---

## 🔁 Module 03 Summary & Key Takeaways

1. **BFS** visits vertices in order of unweighted edge distance via a queue; finds shortest paths in $O(V + E)$ time.
2. **DFS** explores deeply via the call stack; classifies edges into Tree, Back, Forward, and Cross edges.
3. In **Undirected Graphs**, cycles are detected by back edges to non-parent nodes; in **Directed Graphs**, cycles require detecting back edges to **GRAY** (active) ancestors.
4. A graph is **Bipartite** if and only if it has **zero odd-length cycles**, verifiable via 2-coloring BFS in $O(V + E)$ time.

---
[⬅️ Previous: Module 02 — Graph Storage Architectures](file:///d:/DSA/Part-07-Graphs/02_graph_storage_architectures.md) | [Next: Module 04 — Topological Sort & DAGs ➡️](file:///d:/DSA/Part-07-Graphs/04_topological_sort_and_dags.md)
