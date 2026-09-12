# 📊 Part 07: Graphs — Module 04: Topological Sorting & Directed Acyclic Graphs (DAGs)

> **Topics Covered:**  
> 112. Topological Sorting Principles & DFS Postorder Stack Method &bull; 113. Kahn's Algorithm (BFS In-Degree Queue & Cycle Detection)

---

# TOPIC 112: TOPOLOGICAL SORTING FUNDAMENTALS

### 1. Definition
A **Topological Sort** of a Directed Acyclic Graph (DAG) $G = (V, E)$ is a linear ordering of all its vertices such that for every directed edge $(u \to v)$, vertex $u$ appears **strictly before** vertex $v$ in the ordering.

$$\forall (u \to v) \in E \implies \text{Position}(u) < \text{Position}(v)$$

---

### 2. The Inviolable Precondition: Must Be a DAG
If a graph contains even a single directed cycle ($u \to v \to w \to u$):
- $u$ must precede $v$, $v$ must precede $w$, and $w$ must precede $u$.
- This creates an insoluble circular paradox ($u < v < w < u \implies u < u$); therefore:

$$\mathbf{Theorem}: \quad \text{A directed graph has a Topological Sort } \iff \text{It is strictly } \mathbf{ACYCLIC \ (A \ DAG)}.$$

---

### 3. Real-World Applications: Task Dependencies & Build Systems
- **Build Systems (Make, Bazel, Webpack)**: Compiling software packages with mutual dependencies.
- **University Course Prerequisites**: Ordering courses so prerequisites are completed first.
- **Database Schema Migrations**: Ordering table creation scripts to satisfy foreign key constraints.

---

### 4. Method 1: DFS Postorder Reverse Stack Algorithm

```text
ALGORITHM TopoSortDFS(adj, V)
    Input: Adjacency list of DAG with V vertices
    Output: List containing topological ordering

1.  allocate visited[0...V - 1] initialized to false
2.  stack ← empty Stack
3.  for i ← 0 to V - 1:
4.      if not visited[i]:
5.          DFSHelper(adj, i, visited, stack)
6.  // Pop stack to generate topological order
7.  topoOrder ← empty List
8.  while not stack.IsEmpty():
9.      topoOrder.Append(stack.Pop())
10. return topoOrder

ALGORITHM DFSHelper(adj, u, visited, stack):
1.  visited[u] ← true
2.  for each neighbor v in adj[u]:
3.      if not visited[v]:
4.          DFSHelper(adj, v, visited, stack)
5.  stack.Push(u)              // Push ONLY AFTER all descendants are processed!
```

---
---

# TOPIC 113: KAHN'S ALGORITHM (BFS IN-DEGREE METHOD)

### 1. Core Intuition & Mechanics
If a vertex has **In-Degree = 0**, it has **zero prerequisites**! It can be completed immediately.
1. Compute the **In-Degree** (number of incoming edges) for every vertex.
2. Push all vertices with `inDegree == 0` into a FIFO Queue.
3. While the queue is not empty:
   - Dequeue vertex $u$ and append it to the topological ordering.
   - For every neighbor $v$ of $u$, decrement `inDegree[v] ← inDegree[v] - 1` (simulate removing edge $u \to v$).
   - If `inDegree[v]` drops to 0, enqueue $v$!
4. **Cycle Detection Check**: If the total count of dequeued vertices is **less than $V$**, the graph contains a directed cycle!

---

### 2. Structural Trace Diagram (ASCII)

```text
DEPENDENCY GRAPH:
      (5) ──────► (2) ──────► (3)
       │                       ▲
       ▼                       │
      (4) ──────► (0) ─────────┘
                   │
                   ▼
                  (1)

In-Degrees:
• Node 5: 0 ──► Enqueue 5
• Node 4: 1
• Node 2: 1
• Node 0: 1
• Node 1: 1
• Node 3: 2

Execution:
1. Dequeue 5 ──► Topo: [5]. Decrement neighbors 2 and 4. (inDegree[4]=0, inDegree[2]=0) ──► Enqueue 4, 2
2. Dequeue 4 ──► Topo: [5, 4]. Decrement neighbor 0. (inDegree[0]=0) ──► Enqueue 0
3. Dequeue 2 ──► Topo: [5, 4, 2]. Decrement neighbor 3. (inDegree[3]=1)
4. Dequeue 0 ──► Topo: [5, 4, 2, 0]. Decrement 1 and 3. (inDegree[1]=0, inDegree[3]=0) ──► Enqueue 1, 3
5. Dequeue 1, 3 ──► Final Topo: [5, 4, 2, 0, 1, 3] (Valid DAG!)
```

---

### 3. Pseudocode: Kahn's Algorithm

```text
ALGORITHM KahnsAlgorithm(adj, V)
    Input: Adjacency list adj with V vertices
    Output: Valid topological order, or error if cycle detected

1.  allocate inDegree[0...V - 1] initialized to 0
2.  // Step 1: Compute in-degrees
3.  for u ← 0 to V - 1:
4.      for each v in adj[u]:
5.          inDegree[v] ← inDegree[v] + 1
6.  // Step 2: Queue all nodes with 0 in-degree
7.  queue ← empty Queue
8.  for i ← 0 to V - 1:
9.      if inDegree[i] = 0:
10.         queue.Enqueue(i)
11. // Step 3: Process queue
12. topoOrder ← empty List
13. count ← 0
14. while not queue.IsEmpty():
15.     u ← queue.Dequeue()
16.     topoOrder.Append(u)
17.     count ← count + 1
18.     for each v in adj[u]:
19.         inDegree[v] ← inDegree[v] - 1
20.         if inDegree[v] = 0:
21.             queue.Enqueue(v)
22. // Step 4: Validate DAG
23. if count ≠ V:
24.     error "Graph contains a directed cycle! Topological sort impossible."
25. return topoOrder
```

---

### 4. Complexity & Comparison

| Metric | DFS Postorder TopoSort | Kahn's BFS TopoSort |
| :--- | :---: | :---: |
| **Time Complexity** | $\Theta(V + E)$ | $\Theta(V + E)$ |
| **Auxiliary Space** | $\Theta(V)$ (Stack) | $\Theta(V)$ (In-degree array + Queue) |
| **Cycle Detection Mechanism** | Requires 3-color gray array | **Built-in automatically** (`count < V`) |
| **Lexicographically Smallest Order**| Difficult | Trivial (Use Min-Priority Queue instead of Queue) |

---

## 🔁 Module 04 Summary & Key Takeaways

1. **Topological Sort** linearizes DAG dependencies such that all edges point strictly forward.
2. **Kahn's Algorithm** processes 0-in-degree vertices via a queue; if the final sorted count is $< V$, a cycle is definitively detected.
3. For dependency resolution in software packages, build graphs, and course schedules, always use Kahn's algorithm or DFS postorder.

---
[⬅️ Previous: Module 03 — Traversals & Cycles](file:///d:/DSA/Part-07-Graphs/03_traversals_and_cycles.md) | [Next: Module 05 — Shortest Paths ➡️](file:///d:/DSA/Part-07-Graphs/05_shortest_paths.md)
