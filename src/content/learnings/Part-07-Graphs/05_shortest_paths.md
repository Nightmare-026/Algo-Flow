# Part 07: Graphs — Module 05: Shortest Path Algorithms

> Shortest path algorithms resolve optimal routing across weighted relational networks under varying edge-weight regimes. From Dijkstra's greedy priority queue scans on non-negative edges to Bellman-Ford's cycle-detecting edge relaxations and Floyd-Warshall's all-pairs dynamic programming, routing algorithms balance mathematical guarantees against asymptotic efficiency.

---

## 1. Executive Summary & Learning Objectives

The shortest path problem seeks a path between two vertices whose constituent edge weights sum to a minimum. Formulated by Edsger Dijkstra (1959), Richard Bellman (1958), Lester Ford (1956), and Robert Floyd (1962), the algorithms divide along two primary axes: Single-Source Shortest Path (SSSP) versus All-Pairs Shortest Path (APSP), and non-negative versus arbitrary negative edge weights.

By the end of this chapter, you will be able to:
1. **Implement** Dijkstra's algorithm using a Min-Priority Queue, proving why non-negative edge weights are required for greedy finality.
2. **Execute** the Bellman-Ford algorithm across $V - 1$ relaxation passes, identifying negative weight cycles on the $V$-th pass.
3. **Derive** the Floyd-Warshall dynamic programming recurrence and explain why intermediate vertex $k$ must form the outermost loop.
4. **Trace** Dijkstra's algorithm step-by-step using a structured state execution table tracking priority queue states and distance arrays.
5. **Select** the appropriate shortest path strategy given network density, edge weight domains, and single-source versus all-pairs query contracts.

---

## 2. Edge Relaxation & The Triangle Inequality

All shortest path algorithms rely on a fundamental operation: **Edge Relaxation**.

### The Triangle Inequality
For any vertices $u, v$ and source $s$:

$$\delta(s, v) \le \delta(s, u) + w(u, v)$$

If the currently known distance to $v$ exceeds the path routed through $u$, the estimate is relaxed:

| State | Relaxation Condition | Action Taken |
| :--- | :--- | :--- |
| **Before Relaxation** | Current distance $\text{dist}[v] = 10$, $\text{dist}[u] = 4$, edge $w(u, v) = 3$. | Path through $u$ offers cost $4 + 3 = 7 < 10$. |
| **Relaxation Step** | $\text{dist}[u] + w(u, v) < \text{dist}[v]$ evaluates to `true`. | Update $\text{dist}[v] \leftarrow \text{dist}[u] + w(u, v) = 7$; set $\text{parent}[v] \leftarrow u$. |
| **After Relaxation** | Invariant restored: $\text{dist}[v] \le \text{dist}[u] + w(u, v)$. | $v$ holds an improved upper bound on true shortest distance. |

---

## 3. Dijkstra's Algorithm (Greedy Single-Source Shortest Path)

Dijkstra's algorithm solves Single-Source Shortest Path (SSSP) on graphs with **strictly non-negative edge weights** ($w(u, v) \ge 0$).

### Algorithmic Invariant
When a vertex $u$ with minimum tentative distance is extracted from the min-priority queue, its distance is **final**: $\text{dist}[u] = \delta(s, u)$.

### Why Dijkstra Fails on Negative Edge Weights
Dijkstra assumes that adding an edge to a path can never decrease its total length ($w \ge 0$). If an edge has negative weight ($w < 0$), an already "finalized" vertex could have its distance reduced by a longer path containing the negative edge, violating the greedy invariant.

```typescript
export interface WeightedEdge {
  to: number;
  weight: number;
}

export function dijkstra(
  adj: WeightedEdge[][],
  numVertices: number,
  source: number
): { distances: number[]; parents: (number | null)[] } {
  const distances = new Float64Array(numVertices).fill(Infinity);
  const parents = new Array<(number | null)>(numVertices).fill(null);
  const visited = new Uint8Array(numVertices);

  distances[source] = 0;

  // Min-Priority Queue storing [distance, vertex]
  // In production, use a Binary Heap priority queue
  const pq: [number, number][] = [[0, source]];

  while (pq.length > 0) {
    // Extract minimum distance element
    pq.sort((a, b) => a[0] - b[0]);
    const [d, u] = pq.shift()!;

    if (visited[u]) continue;
    visited[u] = 1;

    for (const edge of adj[u]) {
      const v = edge.to;
      const weight = edge.weight;

      if (!visited[v] && distances[u] + weight < distances[v]) {
        distances[v] = distances[u] + weight;
        parents[v] = u;
        pq.push([distances[v], v]);
      }
    }
  }

  return { distances: Array.from(distances), parents };
}
```

---

## 4. Step-by-Step Worked Dry Run: Dijkstra's Algorithm

Consider a directed weighted graph with 4 vertices $\{0, 1, 2, 3\}$, source vertex $s = 0$, and edges:
- $0 \to 1$ ($w = 4$)
- $0 \to 2$ ($w = 1$)
- $2 \to 1$ ($w = 2$)
- $1 \to 3$ ($w = 1$)
- $2 \to 3$ ($w = 5$)

| Step | Extracted Vertex $(u, \text{dist}[u])$ | Outgoing Edges Explored | Relaxation Check | Distance Array State After Step | Priority Queue State |
| :---: | :---: | :--- | :--- | :--- | :--- |
| **0** | — (Init) | None | None | `[0, ∞, ∞, ∞]` | `[(0, 0)]` |
| **1** | **Node 0** ($d = 0$) | $0 \to 1$ ($w=4$)<br>$0 \to 2$ ($w=1$) | $0 + 4 < \infty \implies \text{dist}[1] = 4$<br>$0 + 1 < \infty \implies \text{dist}[2] = 1$ | `[0, 4, 1, ∞]` | `[(1, 2), (4, 1)]` |
| **2** | **Node 2** ($d = 1$) | $2 \to 1$ ($w=2$)<br>$2 \to 3$ ($w=5$) | $1 + 2 < 4 \implies \text{dist}[1] = 3$ (Improved!)<br>$1 + 5 < \infty \implies \text{dist}[3] = 6$ | `[0, 3, 1, 6]` | `[(3, 1), (4, 1), (6, 3)]` |
| **3** | **Node 1** ($d = 3$) | $1 \to 3$ ($w=1$) | $3 + 1 < 6 \implies \text{dist}[3] = 4$ (Improved!) | `[0, 3, 1, 4]` | `[(4, 3), (4, 1), (6, 3)]` |
| **4** | **Node 3** ($d = 4$) | (No outgoing edges) | None | `[0, 3, 1, 4]` | `[(4, 1), (6, 3)]` |
| **5** | Stale Entries | Nodes already visited (`visited[1]=1`, `visited[3]=1`) | Skipped | `[0, 3, 1, 4]` | `[]` (Empty) |

**Final Shortest Distances from Source 0**: `dist = [0, 3, 1, 4]`. Shortest path to vertex $3$: $0 \to 2 \to 1 \to 3$ with total cost $4$.

---

## 5. Bellman-Ford Algorithm (Negative Weights & Cycle Detection)

Bellman-Ford solves SSSP in graphs that may contain **negative edge weights**, and formally determines whether the graph contains a **Negative Weight Cycle**.

### The $V - 1$ Relaxation Theorem
*In any graph with $V$ vertices, any simple shortest path contains at most $V - 1$ edges.*

Therefore, relaxing every edge in the graph $V - 1$ times is mathematically guaranteed to find the true shortest distance to all reachable vertices.

### The $V$-th Negative Cycle Detection Pass
If an additional $V$-th pass over all edges succeeds in relaxing *any* edge ($\text{dist}[u] + w < \text{dist}[v]$), a **negative weight cycle exists**! In a negative cycle, looping indefinitely drives path cost to $-\infty$.

```typescript
export interface FlatEdge {
  u: number;
  v: number;
  weight: number;
}

export function bellmanFord(
  edges: FlatEdge[],
  numVertices: number,
  source: number
): { distances: number[] | null; hasNegativeCycle: boolean } {
  const dist = new Float64Array(numVertices).fill(Infinity);
  dist[source] = 0;

  // Relax all edges V - 1 times
  for (let i = 1; i < numVertices; i++) {
    for (const edge of edges) {
      if (dist[edge.u] !== Infinity && dist[edge.u] + edge.weight < dist[edge.v]) {
        dist[edge.v] = dist[edge.u] + edge.weight;
      }
    }
  }

  // V-th pass: Detect negative weight cycles
  for (const edge of edges) {
    if (dist[edge.u] !== Infinity && dist[edge.u] + edge.weight < dist[edge.v]) {
      return { distances: null, hasNegativeCycle: true };
    }
  }

  return { distances: Array.from(dist), hasNegativeCycle: false };
}
```

---

## 6. Floyd-Warshall Algorithm (All-Pairs Shortest Paths)

Floyd-Warshall (1962) computes the shortest path between **every pair of vertices $(i, j)$** via dynamic programming.

### State Recurrence
Let $D^{(k)}[i][j]$ be the shortest distance from $i$ to $j$ utilizing only intermediate vertices from $\{0, 1, \dots, k\}$.
- **Option 1**: Path does not route through $k$: Distance remains $D^{(k-1)}[i][j]$.
- **Option 2**: Path routes through $k$: Distance becomes $D^{(k-1)}[i][k] + D^{(k-1)}[k][j]$.

$$\mathbf{DP \ Recurrence}: \quad D[i][j] = \min(D[i][j], \quad D[i][k] + D[k][j])$$

*Critical Implementation Requirement:* The intermediate vertex $k$ **must unconditionally be the outermost loop**! Inverting loop order computes invalid intermediate states.

```typescript
export function floydWarshall(
  matrix: number[][],
  numVertices: number
): number[][] | null {
  const dist: number[][] = matrix.map((row) => [...row]);

  for (let k = 0; k < numVertices; k++) {
    for (let i = 0; i < numVertices; i++) {
      for (let j = 0; j < numVertices; j++) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    }
  }

  // Check for negative weight cycles along the main diagonal
  for (let i = 0; i < numVertices; i++) {
    if (dist[i][i] < 0) return null; // Negative cycle detected!
  }

  return dist;
}
```

---

## 7. Master Comparison of Shortest Path Algorithms

| Algorithm | Problem Scope | Edge Weight Domain | Time Complexity | Auxiliary Space | Optimal Production Use Case |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **BFS** | Single-Source (SSSP) | Unweighted ($w = 1$) | $\Theta(V + E)$ | $\Theta(V)$ | Hop-count routing, social graph distance |
| **Dijkstra** | Single-Source (SSSP) | Non-negative only ($w \ge 0$) | $\Theta((V + E) \log V)$ | $\Theta(V)$ | GPS map navigation, OSPF internet routing |
| **Bellman-Ford** | Single-Source (SSSP) | Arbitrary (Detects negative cycles) | $\Theta(V \cdot E)$ | $\Theta(V)$ | Currency arbitrage detection, RIP network protocol |
| **Floyd-Warshall** | All-Pairs (APSP) | Arbitrary (Detects negative cycles) | $\Theta(V^3)$ | $\Theta(V^2)$ | Dense networks, transitive closure, small graphs ($V \le 500$) |
| **Johnson's Algorithm** | All-Pairs (APSP) | Arbitrary (Reweight via Bellman-Ford) | $O(V^2 \log V + V E)$ | $\Theta(V^2)$ | Sparse all-pairs shortest paths |

---

## 8. Common Traps, Edge Cases & Implementation Pitfalls

1. **Infinity Arithmetic Overflow in Bellman-Ford / Floyd-Warshall**:
   - In languages with 32-bit signed integers (C++, Java), computing $\infty + w$ when $\infty = \text{INT\_MAX}$ causes integer underflow to negative values, corrupting shortest path distances. Guard all relaxations with `dist[u] !== Infinity`.
2. **Priority Queue Stale Pair Handling in Dijkstra**:
   - Standard priority queues without decrease-key support enqueue updated $(d, u)$ pairs. If `d > dist[u]`, the extracted pair is stale and must be immediately discarded (`continue`).
3. **Loop Ordering in Floyd-Warshall**:
   - Writing $i, j, k$ instead of $k, i, j$ computes local paths through immediate neighbors rather than globally optimal paths through all intermediate vertices.

---

## 9. Real-World Applications & Practice Problems

### Production Systems
- **GPS Navigation (Google Maps, Waze)**: Augmented Dijkstra ($A^*$ search) computes driving directions with road speed weight heuristics.
- **Financial Arbitrage Engines**: Bellman-Ford on negative-log currency exchange rate matrices detects risk-free arbitrage currency loops.
- **Internet Protocol Routing (OSPF / BGP)**: Open Shortest Path First (OSPF) runs Dijkstra's algorithm inside autonomous systems to establish optimal packet routing tables.

### Practice Problems
1. **Network Delay Time (LeetCode 743)** — Classic Dijkstra SSSP on weighted directed graphs.
2. **Cheapest Flights Within K Stops (LeetCode 787)** — Bellman-Ford bounded by $K + 1$ relaxation passes.
3. **Find the City With Smallest Number of Neighbors at Threshold (LeetCode 1334)** — Floyd-Warshall all-pairs shortest paths.

---

## 10. References & Academic Attribution

1. **Dijkstra, E. W.** (1959). A note on two problems in connexion with graphs. *Numerische Mathematik*, 1(1), 269–271.
2. **Bellman, R.** (1958). On a routing problem. *Quarterly of Applied Mathematics*, 16(1), 87–90.
3. **Ford, L. R.** (1956). *Network Flow Theory*. Paper P-923. RAND Corporation.
4. **Floyd, R. W.** (1962). Algorithm 97: Shortest path. *Communications of the ACM*, 5(6), 345.
5. **Warshall, S.** (1962). A theorem on boolean matrices. *Journal of the ACM (JACM)*, 9(1), 11–12.
