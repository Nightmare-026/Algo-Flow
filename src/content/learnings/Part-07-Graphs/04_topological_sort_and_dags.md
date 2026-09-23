# Part 07: Graphs — Module 04: Topological Sorting & Directed Acyclic Graphs (DAGs)

> Topological sorting linearizes the dependencies of Directed Acyclic Graphs (DAGs) such that every prerequisite precedes its dependent tasks. Whether resolving package builds, evaluating spreadsheet formula cells, or scheduling task workflows, mastering DFS postorder reversals and Kahn's in-degree frontier queue guarantees deterministic $O(V + E)$ scheduling and cycle detection.

---

## 1. Executive Summary & Learning Objectives

Topological sorting maps the partial order of a Directed Acyclic Graph (DAG) into a compatible total linear ordering. Arthur Kahn in 1962 introduced the queue-based in-degree reduction algorithm, while Robert Tarjan in 1972 formalized the reverse-postorder DFS method. If and only if a directed graph is acyclic, it admits at least one topological ordering.

By the end of this chapter, you will be able to:
1. **Prove** the Fundamental Acyclicity Criterion demonstrating why a directed graph admits a topological sort if and only if it contains zero directed cycles.
2. **Implement** the DFS Postorder Stack method with 3-color cycle detection in $O(V + E)$ time.
3. **Execute** Kahn's In-Degree BFS algorithm step-by-step, explaining how unprocessed vertices detect circular deadlock dependencies.
4. **Augment** Kahn's algorithm with a Min-Heap priority queue to generate the unique lexicographically smallest topological sort.
5. **Trace** dependency resolution workflows across monorepo build tools (Turborepo, Bazel) and relational database foreign-key migrations.

---

## 2. Topological Sorting Fundamentals

A **Topological Sort** of a Directed Acyclic Graph (DAG) $G = (V, E)$ is a linear sequence of all vertices such that for every directed edge $(u \to v) \in E$, vertex $u$ appears strictly before vertex $v$ in the sequence:

$$\forall (u \to v) \in E \implies \text{Index}(u) < \text{Index}(v)$$

### The Fundamental Theorem of Topological Ordering

$$\mathbf{Theorem}: \quad \text{A directed graph } G = (V, E) \text{ admits a topological sort } \iff G \text{ is a Directed Acyclic Graph (DAG)}.$$

#### Formal Mathematical Proof:
1. **($\implies$ Direction: Topological Sort implies Acyclic)**:  
   Assume for contradiction that $G$ admits a topological sort $\sigma$ and contains a directed cycle $C = \langle v_1, v_2, \dots, v_k, v_1 \rangle$.  
   Because $(v_i \to v_{i+1}) \in E$, the topological invariant requires $\sigma(v_1) < \sigma(v_2) < \dots < \sigma(v_k)$.  
   Furthermore, because the cycle closes with directed edge $(v_k \to v_1) \in E$, we must have $\sigma(v_k) < \sigma(v_1)$.  
   By transitivity, $\sigma(v_1) < \sigma(v_1)$, which is a contradiction ($x < x$ is impossible). Therefore, $G$ must be acyclic.
2. **($\impliedby$ Direction: DAG implies Topological Sort exists)**:  
   We proceed by induction on $|V|$:
   - **Base Case**: A DAG with $|V| = 1$ trivially has a valid topological ordering.
   - **Inductive Step**: Every finite DAG has at least one source vertex $u$ with $\text{in-degree}(u) = 0$ (otherwise, following incoming edges backward indefinitely in a finite graph would force a visited vertex to repeat, creating a cycle).
   - Place vertex $u$ first in the sequence.
   - Removing $u$ and all its incident outgoing edges leaves a residual graph $G' = G \setminus \{u\}$ with $|V| - 1$ vertices that remains acyclic.
   - By the inductive hypothesis, $G'$ admits a valid topological sort, which we append to $u$. $\blacksquare$

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Algorithm Pipelines: DAG Topological Dependency Linearization &amp; Kahn's Algorithm
  </div>
  <svg viewBox="0 0 850 360" class="w-full h-auto text-xs" style="max-height: 360px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="dagArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="320" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Left: DAG Dependency Graph -->
    <g transform="translate(45, 45)">
      <text x="175" y="20" font-weight="700" fill="#3b82f6" text-anchor="middle" font-size="13">DAG Dependency Graph (Edges u &rarr; v: u must precede v)</text>
      <!-- Vertices: 0, 1, 2, 3, 4 -->
      <g transform="translate(25, 45)">
        <!-- Node 0: in-deg = 0 -->
        <circle cx="30" cy="40" r="18" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="2"/>
        <text x="30" y="44" text-anchor="middle" font-weight="700" fill="#10b981">A (in:0)</text>
        <!-- Node 1: in-deg = 0 -->
        <circle cx="30" cy="120" r="18" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="2"/>
        <text x="30" y="124" text-anchor="middle" font-weight="700" fill="#10b981">B (in:0)</text>
        <!-- Node 2: in-deg = 2 -->
        <circle cx="150" cy="80" r="18" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="2"/>
        <text x="150" y="84" text-anchor="middle" font-weight="700">C (in:2)</text>
        <!-- Node 3: in-deg = 1 -->
        <circle cx="260" cy="40" r="18" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="2"/>
        <text x="260" y="44" text-anchor="middle" font-weight="700">D (in:1)</text>
        <!-- Node 4: in-deg = 1 -->
        <circle cx="260" cy="120" r="18" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="2"/>
        <text x="260" y="124" text-anchor="middle" font-weight="700">E (in:1)</text>
        <!-- Directed Edges -->
        <line x1="48" y1="46" x2="132" y2="74" stroke="currentColor" stroke-width="1.5" marker-end="url(#dagArrow)"/>
        <line x1="48" y1="114" x2="132" y2="86" stroke="currentColor" stroke-width="1.5" marker-end="url(#dagArrow)"/>
        <line x1="168" y1="74" x2="242" y2="46" stroke="currentColor" stroke-width="1.5" marker-end="url(#dagArrow)"/>
        <line x1="168" y1="86" x2="242" y2="114" stroke="currentColor" stroke-width="1.5" marker-end="url(#dagArrow)"/>
      </g>
      <text x="175" y="245" text-anchor="middle" font-size="10" fill="currentColor" fill-opacity="0.75">&bull; Sources A &amp; B have in-degree 0 &bull; Ready for parallel dispatch</text>
    </g>
    <!-- Divider -->
    <line x1="420" y1="40" x2="420" y2="340" stroke="currentColor" stroke-opacity="0.15" stroke-width="1.5"/>
    <!-- Right: Kahn's In-Degree Reduction Pipeline -->
    <g transform="translate(450, 45)">
      <text x="180" y="20" font-weight="700" fill="#10b981" text-anchor="middle" font-size="13">Kahn's BFS In-Degree Frontier Queue</text>
      <!-- Step 1: Initial Queue -->
      <g transform="translate(10, 45)">
        <rect x="0" y="0" width="340" height="55" rx="6" fill="#10b981" fill-opacity="0.08" stroke="#10b981"/>
        <text x="15" y="22" font-weight="700" fill="#10b981" font-size="11">Queue Init: [A, B] (in-degree == 0)</text>
        <text x="15" y="40" font-size="10" fill="currentColor" fill-opacity="0.8">Emit A, B &rarr; Decrement in-degree of C by 2 &rarr; in-degree(C) = 0!</text>
      </g>
      <!-- Step 2: Enqueue C -->
      <g transform="translate(10, 110)">
        <rect x="0" y="0" width="340" height="55" rx="6" fill="#3b82f6" fill-opacity="0.08" stroke="#3b82f6"/>
        <text x="15" y="22" font-weight="700" fill="#3b82f6" font-size="11">Queue Next: [C] &rarr; Emit C</text>
        <text x="15" y="40" font-size="10" fill="currentColor" fill-opacity="0.8">Decrement in-degree of D and E &rarr; Both reach 0!</text>
      </g>
      <!-- Step 3: Final Output -->
      <g transform="translate(10, 175)">
        <rect x="0" y="0" width="340" height="60" rx="6" fill="#f59e0b" fill-opacity="0.12" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="15" y="24" font-weight="700" fill="#f59e0b" font-size="12">Linearized Topological Sequence:</text>
        <text x="15" y="45" font-family="monospace" font-weight="700" font-size="13" fill="currentColor">A &rarr; B &rarr; C &rarr; D &rarr; E</text>
      </g>
      <text x="180" y="265" text-anchor="middle" font-size="10" fill="currentColor" fill-opacity="0.75">&bull; Processed count = |V| &rArr; Acyclic &bull; Less than |V| &rArr; Cycle deadlock!</text>
    </g>
  </svg>
</div>

---

## 3. Method 1: DFS Postorder Reverse Stack

In a DFS traversal of a DAG, a vertex $u$ finishes processing (exits its recursive call) only after all vertices reachable from $u$ have finished processing. Pushing vertices onto a LIFO stack upon recursive termination naturally orders ancestors before descendants when popped:

```typescript
export function topoSortDFS(
  adj: number[][],
  numVertices: number
): number[] | null {
  const visited = new Uint8Array(numVertices); // 0 = White, 1 = Gray, 2 = Black
  const stack: number[] = [];

  function dfs(u: number): boolean {
    visited[u] = 1; // Mark Gray (active on recursion stack)

    for (const v of adj[u]) {
      if (visited[v] === 1) return false; // Cycle detected!
      if (visited[v] === 0) {
        if (!dfs(v)) return false;
      }
    }

    visited[u] = 2; // Mark Black (finished)
    stack.push(u); // Push on postorder finish
    return true;
  }

  for (let i = 0; i < numVertices; i++) {
    if (visited[i] === 0) {
      if (!dfs(i)) return null; // Cycle detected
    }
  }

  return stack.reverse(); // Reverse postorder yields topological order
}
```

---

## 4. Method 2: Kahn's Algorithm (BFS In-Degree Queue)

Arthur Kahn (1962) formulated an iterative algorithm based on vertex in-degrees:
1. **Compute In-Degrees**: Count incoming edges for every vertex $v \in V$.
2. **Initialize Queue**: Enqueue all vertices with $\text{in-degree}[v] == 0$ (independent tasks with zero prerequisites).
3. **Iterative Reduction**:
   - Dequeue vertex $u$, appending it to the topological sequence.
   - For each outgoing edge $u \to v$, decrement $\text{in-degree}[v]$.
   - If $\text{in-degree}[v]$ reaches $0$, enqueue $v$.
4. **Cycle Detection**: If the total count of processed vertices is strictly less than $|V|$, the graph contains a directed cycle!

```typescript
export function topoSortKahn(
  adj: number[][],
  numVertices: number
): number[] | null {
  const inDegree = new Int32Array(numVertices);

  // Step 1: Compute in-degrees
  for (let u = 0; u < numVertices; u++) {
    for (const v of adj[u]) {
      inDegree[v]++;
    }
  }

  // Step 2: Enqueue source vertices (in-degree == 0)
  const queue: number[] = [];
  for (let i = 0; i < numVertices; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order: number[] = [];

  // Step 3: Process frontier
  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);

    for (const v of adj[u]) {
      inDegree[v]--;
      if (inDegree[v] === 0) {
        queue.push(v);
      }
    }
  }

  // Step 4: Validate acyclicity
  return order.length === numVertices ? order : null;
}
```

---

## 5. Step-by-Step Worked Dry Run: Kahn's Algorithm

Consider a DAG with $V = 6$ vertices ($0$ through $5$) and directed edges:
$$5 \to 2, \quad 5 \to 0, \quad 4 \to 0, \quad 4 \to 1, \quad 2 \to 3, \quad 3 \to 1$$

### Initial State
- $\text{In-Degrees}$: `[Node 0: 2, Node 1: 2, Node 2: 1, Node 3: 1, Node 4: 0, Node 5: 0]`
- Initial Queue ($\text{in-degree} = 0$): `[4, 5]`

| Step | Dequeued Vertex | Outgoing Edges Reduced | In-Degree State After Step | New Nodes Added to Queue | Queue State | Active Sequence |
| :---: | :---: | :--- | :--- | :---: | :--- | :--- |
| **0** | — (Init) | None | `[0:2, 1:2, 2:1, 3:1, 4:0, 5:0]` | $\{4, 5\}$ | `[4, 5]` | `[]` |
| **1** | **Node 4** | $4 \to 0, 4 \to 1$ | `inDegree[0]=1, inDegree[1]=1` | None | `[5]` | `[4]` |
| **2** | **Node 5** | $5 \to 2, 5 \to 0$ | `inDegree[2]=0, inDegree[0]=0` | $\{2, 0\}$ | `[2, 0]` | `[4, 5]` |
| **3** | **Node 2** | $2 \to 3$ | `inDegree[3]=0` | $\{3\}$ | `[0, 3]` | `[4, 5, 2]` |
| **4** | **Node 0** | None | No change | None | `[3]` | `[4, 5, 2, 0]` |
| **5** | **Node 3** | $3 \to 1$ | `inDegree[1]=0` | $\{1\}$ | `[1]` | `[4, 5, 2, 0, 3]` |
| **6** | **Node 1** | None | No change | None | `[]` (Empty) | `[4, 5, 2, 0, 3, 1]` |

**Result:** Total processed count $= 6 = |V|$. Graph is confirmed acyclic. Valid topological sequence: **`[4, 5, 2, 0, 3, 1]`**.

---

## 6. Comparative Evaluation: DFS Postorder vs. Kahn's BFS

| Architectural Metric | DFS Postorder Stack Method | Kahn's In-Degree BFS Algorithm |
| :--- | :---: | :---: |
| **Time Complexity** | $\Theta(V + E)$ | $\Theta(V + E)$ |
| **Auxiliary Space** | $\Theta(V)$ (Call stack + visited) | $\Theta(V)$ (In-degree array + Queue) |
| **Cycle Detection Mechanism** | Requires 3-state coloring (White/Gray/Black) | **Automatic**: `order.length < V` indicates cycle |
| **Deterministic Tie-Breaking** | Difficult to guarantee globally | **Trivial**: Use Min-Heap instead of FIFO Queue |
| **Parallel Execution** | Inherently sequential recursion | Queue frontier can be dispatched to parallel worker pools |

---

## 7. Common Traps, Edge Cases & Implementation Pitfalls

1. **Cycle Concealment via Unvisited Components**:
   - In Kahn's algorithm, vertices locked inside a directed cycle have non-zero in-degrees and are never added to the queue. Failing to check `order.length === numVertices` silently drops circular components from the output.
2. **Lexicographical Tie-Breaking Pitfall**:
   - When multiple valid topological orderings exist, sorting the output array post-hoc produces an invalid order. To generate the lexicographically smallest ordering, use a **Min-Heap** for Kahn's frontier queue.
3. **Graph Direction Inversion**:
   - In dependency graphs, "Task A depends on Task B" means edge is $B \to A$ (B must complete before A begins). Reversing edge directions reverses the dependency order.

---

## 8. Real-World Applications & Practice Problems

### Production Systems
- **Monorepo Build Pipelines (Turborepo, Nx, Bazel)**: Packages and tasks are modeled as DAG vertices. Kahn's algorithm schedules concurrent compilation stages.
- **Relational Database Migrations**: Tables with foreign-key constraints must be created in topological order and dropped in reverse topological order.
- **Spreadsheet Formula Engines**: Excel and Google Sheets evaluate formulas by computing topological orders across cell reference graphs.

### Practice Problems
1. **Course Schedule II (LeetCode 210)** — Return valid topological order or empty array if impossible.
2. **Alien Dictionary (LeetCode 269)** — Derive character alphabet ordering from lexicographically sorted word list.
3. **Parallel Courses (LeetCode 1136)** — Find minimum semesters required using Kahn's algorithm level-by-level BFS.

---

## 9. References & Academic Attribution

1. **Kahn, A. B.** (1962). Topological sorting of large networks. *Communications of the ACM*, 5(11), 558–562.
2. **Tarjan, R. E.** (1972). Depth-first search and linear graph algorithms. *SIAM Journal on Computing*, 1(2), 146–160.
3. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Section 20.4 (Topological sort). MIT Press.
