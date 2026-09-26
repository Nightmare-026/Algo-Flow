# Part 07: Graphs — Module 03: Graph Traversals, Cycles & Connectivity

> Breadth-First Search (BFS) and Depth-First Search (DFS) form the twin computational engines of graph algorithms, systematically visiting vertices to solve reachability, unweighted shortest paths, connected components, and topological cycle boundaries. Master the timestamped edge classifications and three-color state machines that reveal hidden structural cycles.

---

## 1. Executive Summary & Learning Objectives

First developed by Edward F. Moore in 1959 for shortest-path maze navigation and revolutionized by Robert E. Tarjan in 1972 for linear-time graph decomposition, graph traversals explore relational networks in $O(V + E)$ time. BFS radiates outward in concentric wavefronts using a FIFO queue, guaranteeing unweighted shortest paths. DFS plunges deep along paths via recursion, partitioning edges into a classification forest that detects directed and undirected cycles.

By the end of this chapter, you will be able to:

1. **Implement** Breadth-First Search (BFS) to compute unweighted single-source shortest path distances and reconstruct traversal paths in $O(V + E)$ time.
2. **Deconstruct** Depth-First Search (DFS) execution trees into Tree, Back, Forward, and Cross edges using discovery and finish timestamps.
3. **Detect** cycles in undirected graphs via parent pointers and in directed graphs via the 3-color (White/Gray/Black) state machine.
4. **Partition** disconnected graphs into connected components and solve multi-source Flood Fill grid problems.
5. **Trace** a directed cycle detection walk through a structured, step-by-step state execution table.

---

## 2. Breadth-First Search (BFS) & Shortest Path Foundations

Given a graph $G = (V, E)$ and source vertex $s$, BFS explores all vertices at distance $k$ from $s$ before exploring any vertex at distance $k + 1$.

### The BFS Shortest Path Theorem

_In an unweighted graph, Breadth-First Search is mathematically guaranteed to discover the shortest path (minimum edge count) from source $s$ to any reachable vertex $v$._

**Proof Sketch:**

1. Let $\delta(s, v)$ denote the true shortest path distance from $s$ to $v$.
2. The FIFO queue maintains the monotonic queue property: at any moment, the queue contains vertices with distance values $d$ and possibly $d + 1$.
3. Inductively, every vertex $v$ is discovered via the shortest possible edge chain, setting $\text{dist}[v] = \delta(s, v)$ upon first discovery. $\blacksquare$

```typescript
export function breadthFirstSearch(
  adj: number[][],
  numVertices: number,
  source: number
): { distances: number[]; parents: (number | null)[] } {
  const distances = new Array(numVertices).fill(Infinity);
  const parents = new Array<number | null>(numVertices).fill(null);
  const queue: number[] = [];

  distances[source] = 0;
  queue.push(source);

  while (queue.length > 0) {
    const u = queue.shift()!;

    for (const v of adj[u]) {
      if (distances[v] === Infinity) {
        distances[v] = distances[u] + 1;
        parents[v] = u;
        queue.push(v);
      }
    }
  }

  return { distances, parents };
}
```

---

## 3. Depth-First Search (DFS) & Edge Classifications

DFS explores as deeply as possible along each branch before backtracking. By tracking discovery time $d[u]$ and finish time $f[u]$, DFS decomposes a directed graph into a spanning forest with four distinct edge classifications:

| Edge Classification | Formal Timestamp Relationship                            | Geometric Nature in DFS Forest                          | Algorithmic Consequence                  |
| :------------------ | :------------------------------------------------------- | :------------------------------------------------------ | :--------------------------------------- |
| **Tree Edge**       | $v$ is discovered from $u$ ($d[u] < d[v] < f[v] < f[u]$) | Primary edge in the DFS spanning tree                   | Discovers new unvisited vertices         |
| **Back Edge**       | $v$ is an ancestor of $u$ ($d[v] < d[u] < f[u] < f[v]$)  | Points upward to an active node on the call stack       | **Strictly indicates a DIRECTED CYCLE!** |
| **Forward Edge**    | $v$ is a descendant of $u$ ($d[u] < d[v] < f[v] < f[u]$) | Non-tree edge connecting to already finished descendant | Shortcut across tree levels              |
| **Cross Edge**      | $v$ is in another branch ($d[v] < f[v] < d[u] < f[u]$)   | Connects between disjoint branches or components        | No ancestor-descendant relationship      |

```typescript
export class DFSTraversal {
  private time = 0;
  public d: number[];
  public f: number[];
  public visited: boolean[];

  constructor(
    private numVertices: number,
    private adj: number[][]
  ) {
    this.d = new Array(numVertices).fill(0);
    this.f = new Array(numVertices).fill(0);
    this.visited = new Array(numVertices).fill(false);
  }

  public run(): void {
    for (let i = 0; i < this.numVertices; i++) {
      if (!this.visited[i]) {
        this.dfsVisit(i);
      }
    }
  }

  private dfsVisit(u: number): void {
    this.visited[u] = true;
    this.d[u] = ++this.time;

    for (const v of this.adj[u]) {
      if (!this.visited[v]) {
        this.dfsVisit(v);
      }
    }

    this.f[u] = ++this.time;
  }
}
```

---

## 4. Cycle Detection: Undirected vs. Directed Graphs

### Undirected Graphs: Parent Pointer Technique

In an undirected graph, every edge is inherently bidirectional. A cycle exists if and only if DFS encounters an already visited neighbor $v$ that is **not the direct parent** of current node $u$:

```typescript
export function hasCycleUndirected(adj: number[][], numVertices: number): boolean {
  const visited = new Array(numVertices).fill(false);

  function dfs(u: number, parent: number): boolean {
    visited[u] = true;

    for (const v of adj[u]) {
      if (!visited[v]) {
        if (dfs(v, u)) return true;
      } else if (v !== parent) {
        // Visited neighbor that is not our direct parent -> CYCLE!
        return true;
      }
    }

    return false;
  }

  for (let i = 0; i < numVertices; i++) {
    if (!visited[i]) {
      if (dfs(i, -1)) return true;
    }
  }

  return false;
}
```

---

### Directed Graphs: The 3-Color State Machine

In directed graphs, an edge to an already-visited vertex does _not_ necessarily imply a cycle (it could be a forward or cross edge). A directed cycle exists if and only if DFS discovers a **Back Edge** pointing to a node currently active on the recursion call stack.

We track vertices using three distinct colors:

|   Color Code    | Semantic State       | Description                                                                  |
| :-------------: | :------------------- | :--------------------------------------------------------------------------- |
| **`WHITE (0)`** | Unvisited            | Node has not yet been discovered.                                            |
| **`GRAY (1)`**  | Active on Call Stack | Node is discovered; its descendants are currently being explored.            |
| **`BLACK (2)`** | Finished             | All descendants of this node have been fully explored and popped from stack. |

$$\mathbf{Cycle \ Condition}: \quad \text{An edge } u \to v \text{ is a cycle if and only if } \text{color}[v] == \mathbf{GRAY}!$$

```typescript
export enum Color {
  WHITE = 0,
  GRAY = 1,
  BLACK = 2,
}

export function hasCycleDirected(adj: number[][], numVertices: number): boolean {
  const color = new Array<Color>(numVertices).fill(Color.WHITE);

  function dfs(u: number): boolean {
    color[u] = Color.GRAY; // Enter recursion stack

    for (const v of adj[u]) {
      if (color[v] === Color.GRAY) {
        return true; // Back-edge detected!
      }
      if (color[v] === Color.WHITE) {
        if (dfs(v)) return true;
      }
    }

    color[u] = Color.BLACK; // Leave recursion stack
    return false;
  }

  for (let i = 0; i < numVertices; i++) {
    if (color[i] === Color.WHITE) {
      if (dfs(i)) return true;
    }
  }

  return false;
}
```

---

## 5. Step-by-Step Dry Run State Trace: Directed Cycle Detection

Consider a directed graph with 4 vertices $\{0, 1, 2, 3\}$ and edges:

- $0 \to 1$
- $1 \to 2$
- $2 \to 3$
- $3 \to 1$ (Back edge causing cycle $1 \to 2 \to 3 \to 1$)

|   Step   | Active Call | Visited Vertex $u$ | Explored Edge $(u \to v)$ | Target Color $\text{color}[v]$ | State Action Taken                                                        | Call Stack (Gray Nodes) |
| :------: | :---------: | :----------------: | :-----------------------: | :----------------------------: | :------------------------------------------------------------------------ | :---------------------- |
|  **1**   |  `dfs(0)`   |        $0$         |             —             |               —                | Mark $\text{color}[0] = \text{GRAY}$.                                     | `[0]`                   |
|  **2**   |  `dfs(0)`   |        $0$         |         $0 \to 1$         |            `WHITE`             | Recurse into `dfs(1)`.                                                    | `[0]`                   |
|  **3**   |  `dfs(1)`   |        $1$         |             —             |               —                | Mark $\text{color}[1] = \text{GRAY}$.                                     | `[0, 1]`                |
|  **4**   |  `dfs(1)`   |        $1$         |         $1 \to 2$         |            `WHITE`             | Recurse into `dfs(2)`.                                                    | `[0, 1]`                |
|  **5**   |  `dfs(2)`   |        $2$         |             —             |               —                | Mark $\text{color}[2] = \text{GRAY}$.                                     | `[0, 1, 2]`             |
|  **6**   |  `dfs(2)`   |        $2$         |         $2 \to 3$         |            `WHITE`             | Recurse into `dfs(3)`.                                                    | `[0, 1, 2]`             |
|  **7**   |  `dfs(3)`   |        $3$         |             —             |               —                | Mark $\text{color}[3] = \text{GRAY}$.                                     | `[0, 1, 2, 3]`          |
|  **8**   |  `dfs(3)`   |        $3$         |       **$3 \to 1$**       |           **`GRAY`**           | **Back Edge Detected!** Target $1$ is currently on the active call stack! | `[0, 1, 2, 3]`          |
| **Exit** |      —      |         —          |             —             |               —                | **Cycle confirmed: $1 \to 2 \to 3 \to 1$**. Return `true`.                | —                       |

---

## 6. Connected Components & Multi-Source Flood Fill

### Connected Components in Undirected Graphs

If an undirected graph is disconnected, running BFS from a single vertex leaves other components unvisited. To discover all components, iterate through all vertices $0 \dots V - 1$:

```typescript
export function countConnectedComponents(adj: number[][], numVertices: number): number {
  const visited = new Array(numVertices).fill(false);
  let count = 0;

  for (let i = 0; i < numVertices; i++) {
    if (!visited[i]) {
      count++;
      // Traverse entire component
      const queue = [i];
      visited[i] = true;
      while (queue.length > 0) {
        const curr = queue.shift()!;
        for (const neighbor of adj[curr]) {
          if (!visited[neighbor]) {
            visited[neighbor] = true;
            queue.push(neighbor);
          }
        }
      }
    }
  }

  return count;
}
```

---

## 7. Complexity Matrix: Traversals and Cycle Detection

| Algorithm            | Data Structure Used     |     Time Complexity      | Auxiliary Space | Key Capability                                         |
| :------------------- | :---------------------- | :----------------------: | :-------------: | :----------------------------------------------------- |
| **BFS**              | FIFO Queue              | $\mathbf{\Theta(V + E)}$ |   $\Theta(V)$   | Unweighted shortest paths, level-order traversal       |
| **DFS**              | Call Stack / LIFO Stack | $\mathbf{\Theta(V + E)}$ |   $\Theta(V)$   | Connectivity, reachability, topological order, bridges |
| **Undirected Cycle** | DFS + Parent tracking   |     $\mathbf{O(V)}$      |   $\Theta(V)$   | Terminates early when edge count reaches $V$           |
| **Directed Cycle**   | DFS + 3-Coloring State  |   $\mathbf{O(V + E)}$    |   $\Theta(V)$   | Discovers back edges to active call stack ancestors    |
| **Bipartite Check**  | BFS / DFS + 2-Coloring  |   $\mathbf{O(V + E)}$    |   $\Theta(V)$   | Validates odd-cycle absence                            |

---

## 8. Common Traps, Edge Cases & Implementation Pitfalls

1. **Marking Visited on Dequeue Instead of Enqueue in BFS**:
   - In BFS, setting `visited[v] = true` when removing from the queue allows the same vertex to be enqueued multiple times by different neighbors, exploding queue size to $O(E)$ and causing memory limits to fail. Always mark visited **immediately upon enqueueing**.
2. **Confusing Cross Edges with Back Edges in Digraphs**:
   - In directed graphs, encountering an already visited vertex does not mean a cycle exists unless that vertex is currently `GRAY` (on the recursion stack). If it is `BLACK`, it is a cross or forward edge.
3. **Stack Overflow on Deep Graphs in DFS**:
   - In deeply skewed linear graphs ($V = 100,000$), recursive DFS crashes with `Maximum call stack size exceeded`. For deep production graphs, use an iterative DFS with an explicit heap-allocated stack.

---

## 9. Real-World Applications & Practice Problems

### Production Systems

- **Web Crawlers**: Use distributed BFS with URL frontier queues to index pages level-by-level based on PageRank and distance from seed domains.
- **Deadlock Detection in Operating Systems**: Resource Allocation Graphs (RAG) detect system deadlocks by finding directed cycles among processes and resource locks.
- **Garbage Collection (Mark-and-Sweep)**: Tracing garbage collectors (V8, JVM) run DFS/BFS starting from GC Roots to identify all reachable memory objects.

### Practice Problems

1. **Number of Islands (LeetCode 200)** — Grid-based 2D connected components using BFS/DFS.
2. **Course Schedule (LeetCode 207)** — Directed graph cycle detection via 3-color DFS or Kahn's algorithm.
3. **Is Graph Bipartite? (LeetCode 785)** — 2-color BFS verification.

---

## 10. References & Academic Attribution

1. **Moore, E. F.** (1959). The shortest path through a maze. _Proceedings of an International Symposium on the Theory of Switching_, Part II, 285–292. Harvard University Press.
2. **Tarjan, R. E.** (1972). Depth-first search and linear graph algorithms. _SIAM Journal on Computing_, 1(2), 146–160.
3. **Hopcroft, J., & Tarjan, R.** (1973). Algorithm 447: Efficient algorithms for graph manipulation. _Communications of the ACM_, 16(6), 372–378.
4. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). _Introduction to Algorithms_ (4th ed.), Chapter 20. MIT Press.
