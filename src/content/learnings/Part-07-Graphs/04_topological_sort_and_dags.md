# Part 07: Graphs — Module 04: Topological Sorting & Directed Acyclic Graphs (DAGs)

> **Topics Covered:**  
> 112. Topological Sorting Principles & DFS Postorder Stack Method &bull; 113. Kahn's Algorithm (BFS In-Degree Queue & Cycle Detection)

---

## Assessable Learning Objectives

Upon completing this chapter, you will be able to:
1. **Prove the Acyclicity Criterion**: Prove by contradiction that a directed graph admits a valid topological ordering if and only if it contains zero directed cycles.
2. **Execute DFS Postorder Topological Sorting**: Trace the recursive DFS call stack and verify why prepending vertices upon recursive return correctly satisfies all dependency constraints.
3. **Trace Kahn's Algorithm Step-by-Step**: Maintain an in-degree array and FIFO queue step-by-step on concrete graphs, updating dependencies and validating DAG integrity.
4. **Detect Graph Cycles**: Prove how Kahn's algorithm detects cycles when the processed vertex count is strictly less than $|V|$.

---

# TOPIC 112: TOPOLOGICAL SORTING FUNDAMENTALS

### 1. Formal Mathematical Definition

A **Topological Sort** of a Directed Acyclic Graph (DAG) $G = (V, E)$ is a linear ordering of all vertices such that for every directed edge $(u \to v) \in E$, vertex $u$ appears **strictly before** vertex $v$ in the linear sequence:

$$\forall (u, v) \in E \implies \text{Index}(u) < \text{Index}(v)$$

---

### 2. The Fundamental Theorem of Topological Ordering

$$\mathbf{Theorem}: \quad \text{A directed graph } G = (V, E) \text{ admits a topological sort } \iff G \text{ is a Directed Acyclic Graph (DAG)}.$$

#### Formal Proof:
1. **($\implies$ Direction: Topo Sort implies Acyclic)**:  
   Assume for contradiction that $G$ admits a topological sort $\sigma$ and contains a directed cycle $C = \langle v_1, v_2, \dots, v_k, v_1 \rangle$.  
   Because $(v_i, v_{i+1}) \in E$, the topological invariant requires $\sigma(v_1) < \sigma(v_2) < \dots < \sigma(v_k)$.  
   Furthermore, since the cycle closes with edge $(v_k, v_1) \in E$, we must have $\sigma(v_k) < \sigma(v_1)$.  
   By transitivity, $\sigma(v_1) < \sigma(v_1)$, which is an immediate contradiction. Hence, $G$ must be acyclic.
2. **($\impliedby$ Direction: DAG implies Topo Sort exists)**:  
   We proceed by induction on $|V|$. Every finite DAG must possess at least one source vertex with $\text{in-degree}(u) = 0$ (otherwise, tracing backward indefinitely along incoming edges must repeat a vertex, creating a cycle).  
   Place vertex $u$ first in the topological sequence. Removing $u$ and all its outgoing edges yields a sub-graph $G' = G \setminus \{u\}$ that remains a DAG with $|V| - 1$ vertices. By the induction hypothesis, $G'$ has a valid topological sort, which we append to $u$. $\blacksquare$

---

### 3. Method 1: Depth-First Search (Postorder Reverse Stack)

In a DFS traversal of a DAG, a vertex $u$ can finish processing (return from its recursive call) only after all vertices reachable from $u$ have finished processing. Pushing each vertex onto a stack upon recursive termination automatically orders descendants after ancestors.

```text
ALGORITHM TopoSortDFS(adj, V):
1.  allocate visited[0...V - 1] ← false
2.  stack ← empty Stack
3.  for u ← 0 to V - 1:
4.      if not visited[u]:
5.          DFSHelper(adj, u, visited, stack)
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
5.  stack.Push(u)   // Key Invariant: Push ONLY after all downstream descendants return!
```

---

# TOPIC 113: KAHN'S ALGORITHM (BFS IN-DEGREE METHOD)

Arthur Kahn (1962) formulated an intuitive iterative approach based on vertex **in-degrees**:

1. **Compute In-Degrees**: Count the number of incoming edges for every vertex $v \in V$.
2. **Initialize Frontier**: Enqueue all vertices with $\text{in-degree}[v] == 0$ (these tasks have zero prerequisites).
3. **Iterative Reduction**:
   - Dequeue vertex $u$ and append it to the topological sequence.
   - For every outgoing edge $(u \to v)$, decrement $\text{in-degree}[v]$.
   - If $\text{in-degree}[v]$ reaches $0$, enqueue $v$.
4. **Cycle Detection**: If the total count of processed vertices is strictly less than $|V|$, a cycle exists in the graph.

---

### Step-by-Step Worked Dry Run: Kahn's Algorithm

Consider a DAG with $V = 6$ vertices ($0$ through $5$) and directed edges:
$5 \to 2, \quad 5 \to 0, \quad 4 \to 0, \quad 4 \to 1, \quad 2 \to 3, \quad 3 \to 1$

#### Initial State:
- $\text{In-Degrees}$: `[Node 0: 2, Node 1: 2, Node 2: 1, Node 3: 1, Node 4: 0, Node 5: 0]`
- Initial Queue ($\text{in-degree} = 0$): `[4, 5]`

#### Step-by-Step Execution Table:

| Step | Dequeued Vertex | Edge Reductions | Updated In-Degrees | New Zero In-Degree Nodes | Queue State | Current Topological Sequence |
| :---: | :---: | :--- | :--- | :---: | :--- | :--- |
| **0** | — (Init) | None | `[0:2, 1:2, 2:1, 3:1, 4:0, 5:0]` | $\{4, 5\}$ | `[4, 5]` | `[]` |
| **1** | **Node 4** | $4 \to 0, 4 \to 1$ | `inDegree[0]=1, inDegree[1]=1` | None | `[5]` | `[4]` |
| **2** | **Node 5** | $5 \to 2, 5 \to 0$ | `inDegree[2]=0, inDegree[0]=0` | $\{2, 0\}$ | `[2, 0]` | `[4, 5]` |
| **3** | **Node 2** | $2 \to 3$ | `inDegree[3]=0` | $\{3\}$ | `[0, 3]` | `[4, 5, 2]` |
| **4** | **Node 0** | (No outgoing edges) | No change | None | `[3]` | `[4, 5, 2, 0]` |
| **5** | **Node 3** | $3 \to 1$ | `inDegree[1]=0` | $\{1\}$ | `[1]` | `[4, 5, 2, 0, 3]` |
| **6** | **Node 1** | (No outgoing edges) | No change | None | `[]` (Empty) | `[4, 5, 2, 0, 3, 1]` |

**Validation**: Processed count $= 6 = |V|$. Graph is confirmed acyclic. Valid topological sequence: **`[4, 5, 2, 0, 3, 1]`**.

---

### Comparative Evaluation: DFS Postorder vs Kahn's BFS

| Architectural Metric | DFS Postorder Stack Method | Kahn's In-Degree BFS Algorithm |
| :--- | :---: | :---: |
| **Time Complexity** | $\Theta(V + E)$ | $\Theta(V + E)$ |
| **Auxiliary Memory** | $\Theta(V)$ (Call Stack + Visited) | $\Theta(V)$ (In-degree array + Queue) |
| **Cycle Detection Mechanism** | Requires 3-state vertex coloring (White/Gray/Black) | **Built-in automatically**: `countProcessed < V` |
| **Deterministic Tie-Breaking** | Difficult to constrain globally | **Trivial**: Replace Queue with Min-Heap for lexicographically smallest order |
| **Parallelizability** | Inherently sequential (DFS call stack) | Frontier queue can be processed concurrently in waves |

---

### Real-World Engineering Applications

1. **Monorepo Build Pipelines (Turborepo, Nx, Bazel)**: Packages and tasks are modeled as DAG vertices. Kahn's algorithm discovers the optimal concurrent build stages.
2. **Relational Database DDL Migrations**: Tables with foreign-key constraints must be created in topological order and dropped in reverse topological order.
3. **Spreadsheet Dependency Computation**: Excel and Google Sheets evaluate formulas by computing a topological sort of interdependent cells to avoid stale reads.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Section 22.4: Topological sort. MIT Press.
2. **Kahn, A. B.** (1962). Topological sorting of large networks. *Communications of the ACM*, 5(11), 558-562.
3. **Tarjan, R. E.** (1972). Depth-first search and linear graph algorithms. *SIAM Journal on Computing*, 1(2), 146-160.
