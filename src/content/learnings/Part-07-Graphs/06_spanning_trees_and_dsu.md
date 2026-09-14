# Part 07: Graphs — Module 06: Minimum Spanning Trees & Disjoint Set Union (DSU)

> Minimum Spanning Trees (MST) interconnect all vertices in a weighted undirected graph with minimum total weight and zero cycles. Founded on the fundamental Cut Property, greedy edge-selection via Kruskal's algorithm with Disjoint Set Union (DSU) and vertex-growth via Prim's algorithm with priority queues achieve near-linear network optimization.

---

## 1. Executive Summary & Learning Objectives

Formulated by Otakar Borůvka in 1926 for electrical grid design, Joseph Kruskal in 1956, and Robert C. Prim in 1957, the Minimum Spanning Tree problem is a cornerstone of combinatorial optimization. An MST spans all $|V|$ vertices with exactly $|V| - 1$ edges while minimizing the total edge weight sum. The efficiency of Kruskal's algorithm is driven by Disjoint Set Union (DSU), whose inverse Ackermann complexity $\alpha(N)$ was proven by Robert Tarjan in 1975.

By the end of this chapter, you will be able to:
1. **Prove** the Cut Property and demonstrate why the minimum-weight crossing edge across any graph cut must belong to the MST.
2. **Implement** Disjoint Set Union (DSU / Union-Find) with Path Compression and Union by Rank, achieving amortized $O(\alpha(N)) \approx O(1)$ operations.
3. **Execute** Kruskal's edge-based greedy algorithm in $O(E \log E)$ time, tracing cycle rejections and subset merges.
4. **Implement** Prim's vertex-growth greedy algorithm in $O((V + E) \log V)$ time using a Min-Priority Queue.
5. **Contrast** Prim's and Kruskal's performance characteristics across sparse ($E \approx V$) and dense ($E \approx V^2$) network topologies.

---

## 2. Minimum Spanning Tree Fundamentals & The Cut Property

Given a connected, undirected, weighted graph $G = (V, E)$, a **Spanning Tree** is an acyclic subgraph $T = (V, E')$ that connects all $V$ vertices using exactly **$|V| - 1$ edges**.

A **Minimum Spanning Tree (MST)** is a spanning tree whose sum of edge weights is minimized:

$$\text{Weight}(T) = \sum_{e \in T} w(e) = \min_{T' \subseteq G} \sum_{e \in T'} w(e)$$

### The Cut Property (Foundation of Greedy MST Algorithms)
- **Cut**: A partition of vertex set $V$ into two non-empty disjoint subsets $(S, V \setminus S)$.
- **Crossing Edge**: An edge $(u, v)$ such that $u \in S$ and $v \in V \setminus S$.

$$\mathbf{Theorem \ (The \ Cut \ Property)}: \quad \text{For any cut } (S, V \setminus S) \text{ of graph } G, \text{ if edge } e = (u, v)$$
$$\text{is the strictly minimum-weight crossing edge, then } e \text{ belongs to every Minimum Spanning Tree of } G.$$

#### Formal Proof by Exchange Argument:
1. Assume for contradiction that an MST $T$ does not contain the minimum-weight crossing edge $e = (u, v)$ with weight $w(e)$.
2. Since $T$ is a spanning tree, there exists a unique simple path between $u$ and $v$ in $T$.
3. Because $u \in S$ and $v \in V \setminus S$, this path must cross the cut at least once via another crossing edge $e' = (x, y)$.
4. Construct a new spanning tree $T^* = (T \setminus \{e'\}) \cup \{e\}$ by removing $e'$ and adding $e$.
5. The weight of $T^*$ is:

$$\text{Weight}(T^*) = \text{Weight}(T) - w(e') + w(e)$$

6. Since $e$ is the strictly minimum-weight crossing edge across cut $(S, V \setminus S)$, $w(e) < w(e')$, which yields $\text{Weight}(T^*) < \text{Weight}(T)$.
7. This contradicts the assumption that $T$ was a Minimum Spanning Tree. Thus, $e$ must belong to the MST. $\blacksquare$

---

## 3. Disjoint Set Union (DSU / Union-Find)

Disjoint Set Union manages a collection of disjoint dynamic sets over universe $\{0, 1, \dots, n-1\}$ supporting two fundamental operations:
- `find(x)`: Identifies the unique canonical representative (root) of the set containing $x$.
- `union(x, y)`: Merges the set containing $x$ with the set containing $y$.

### The Two Cardinal Optimizations

| Optimization Strategy | Mechanics | Standalone Complexity | Combined Amortized Bound |
| :--- | :--- | :---: | :---: |
| **Union by Rank / Size** | Always attach the root of the tree with smaller depth under the root of the deeper tree. | $O(\log N)$ | — |
| **Path Compression** | During `find(x)`, update parent pointers of all visited nodes directly to the root. | $O(\log N)$ | **$O(\alpha(N))$** |

$$\text{Amortized Cost per Operation} = \mathbf{O(\alpha(N))} \le 4 \quad \text{for all } N \le 10^{80}$$

Robert Tarjan (1975) proved that combining Union by Rank and Path Compression achieves an amortized bound governed by the **Inverse Ackermann Function** $\alpha(N)$. For all practical computation, DSU operations run in **strictly $O(1)$ constant time**.

```typescript
export class DisjointSetUnion {
  private parent: Int32Array;
  private rank: Uint8Array;

  constructor(size: number) {
    this.parent = new Int32Array(size);
    this.rank = new Uint8Array(size);
    for (let i = 0; i < size; i++) {
      this.parent[i] = i; // Each element is its own representative initially
      this.rank[i] = 0;
    }
  }

  public find(i: number): number {
    if (this.parent[i] !== i) {
      // Path compression: flatten tree directly to representative root
      this.parent[i] = this.find(this.parent[i]);
    }
    return this.parent[i];
  }

  public union(x: number, y: number): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) {
      return false; // Elements already in same set; adding edge would form a cycle!
    }

    // Union by rank
    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }

    return true;
  }
}
```

---

## 4. Kruskal's Algorithm (Greedy Edge-Selection)

Joseph Kruskal (1956) formulated an edge-centric greedy algorithm:
1. Sort all edges in non-decreasing order of weight: $w(e_1) \le w(e_2) \le \dots \le w(e_E)$.
2. Initialize a DSU with $|V|$ singleton sets.
3. For each candidate edge $e = (u, v)$ in sorted order:
   - If `dsu.find(u) !== dsu.find(v)`: Adding $e$ will not form a cycle. Add $e$ to the MST and call `dsu.union(u, v)`.
   - If `dsu.find(u) === dsu.find(v)`: Discard $e$ (it connects two vertices already in the same tree, which would create a cycle).
4. Terminate when $|V| - 1$ edges have been added.

```typescript
export interface MSTEdge {
  u: number;
  v: number;
  weight: number;
}

export function kruskal(
  edges: MSTEdge[],
  numVertices: number
): { mstEdges: MSTEdge[]; totalWeight: number } {
  // Step 1: Sort edges ascending by weight - O(E log E)
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

  const dsu = new DisjointSetUnion(numVertices);
  const mstEdges: MSTEdge[] = [];
  let totalWeight = 0;

  // Step 2: Iterate through sorted edges
  for (const edge of sortedEdges) {
    if (dsu.union(edge.u, edge.v)) {
      mstEdges.push(edge);
      totalWeight += edge.weight;
      if (mstEdges.length === numVertices - 1) break;
    }
  }

  return { mstEdges, totalWeight };
}
```

---

## 5. Step-by-Step Dry Run State Trace: Kruskal's Algorithm

Consider an undirected graph with 4 vertices $\{0, 1, 2, 3\}$ and edges:
- $e_1 = (0, 1, w=1)$
- $e_2 = (1, 2, w=2)$
- $e_3 = (0, 2, w=3)$
- $e_4 = (2, 3, w=4)$
- $e_5 = (1, 3, w=5)$

| Step | Candidate Edge | Weight | `find(u)` vs `find(v)` | Cycle Test | DSU Action Taken | MST Edge Set | Total Weight |
| :---: | :---: | :---: | :---: | :---: | :--- | :--- | :---: |
| **1** | $(0, 1)$ | $1$ | $\text{find}(0)=0, \text{find}(1)=1$ | Disjoint | `union(0, 1)` $\implies$ root is $0$. | $\{(0, 1)\}$ | $1$ |
| **2** | $(1, 2)$ | $2$ | $\text{find}(1)=0, \text{find}(2)=2$ | Disjoint | `union(0, 2)` $\implies$ root is $0$. | $\{(0, 1), (1, 2)\}$ | $3$ |
| **3** | $(0, 2)$ | $3$ | $\text{find}(0)=0, \text{find}(2)=0$ | **Cycle Detected!** | **Discard edge $(0, 2)$**! | $\{(0, 1), (1, 2)\}$ | $3$ |
| **4** | $(2, 3)$ | $4$ | $\text{find}(2)=0, \text{find}(3)=3$ | Disjoint | `union(0, 3)` $\implies$ root is $0$. | $\{(0, 1), (1, 2), (2, 3)\}$ | **$7$** |
| **Exit** | — | — | — | — | $|V|-1 = 3$ edges chosen. Terminate! | Final MST: $\{(0, 1), (1, 2), (2, 3)\}$ | **$7$** |

---

## 6. Prim's Algorithm (Greedy Vertex-Growth)

Robert C. Prim (1957) formulated a vertex-centric algorithm that mirrors Dijkstra:
1. Start at an arbitrary root vertex $s$.
2. Maintain a Min-Priority Queue of crossing edges connecting vertices currently inside the growing MST tree to unvisited vertices outside.
3. Greedily extract the crossing edge with minimum weight.
4. Add the newly connected vertex to the MST and push its incident edges into the heap.
5. Repeat until all $|V|$ vertices are included.

```typescript
export interface PrimAdjEdge {
  to: number;
  weight: number;
}

export function prim(
  adj: PrimAdjEdge[][],
  numVertices: number
): { mstEdges: MSTEdge[]; totalWeight: number } {
  const inMST = new Uint8Array(numVertices);
  const mstEdges: MSTEdge[] = [];
  let totalWeight = 0;

  // Min-Priority Queue storing [weight, toVertex, fromVertex]
  const pq: [number, number, number][] = [[0, 0, -1]];

  while (pq.length > 0 && mstEdges.length < numVertices - 1) {
    pq.sort((a, b) => a[0] - b[0]);
    const [w, u, parent] = pq.shift()!;

    if (inMST[u]) continue;
    inMST[u] = 1;

    if (parent !== -1) {
      mstEdges.push({ u: parent, v: u, weight: w });
      totalWeight += w;
    }

    for (const edge of adj[u]) {
      if (!inMST[edge.to]) {
        pq.push([edge.weight, edge.to, u]);
      }
    }
  }

  return { mstEdges, totalWeight };
}
```

---

## 7. Comparative Analysis: Prim vs. Kruskal

| Architectural Metric | Prim's Algorithm | Kruskal's Algorithm |
| :--- | :--- | :--- |
| **Algorithmic Paradigm** | Vertex-Growth (grows a single contiguous tree) | Edge-Selection (grows a forest of trees, coalescing components) |
| **Core Data Structure** | Min-Priority Queue (Binary or Fibonacci Heap) | **Disjoint Set Union (DSU)** + Edge Array Sorting |
| **Time Complexity** | $O((V + E) \log V)$ ($O(E + V \log V)$ with Fib Heap) | $O(E \log E) = \Theta(E \log V)$ |
| **Auxiliary Space** | $\Theta(V)$ | $\Theta(V + E)$ |
| **Optimal Graph Domain** | **Dense Graphs** ($|E| \approx |V|^2$) | **Sparse Graphs** ($|E| \ll |V|^2$) |
| **Disconnected Graphs** | Computes Minimum Spanning Tree of single component | **Computes Minimum Spanning Forest** automatically |

---

## 8. Common Traps, Edge Cases & Implementation Pitfalls

1. **Disconnected Graphs and Infinite Loops**:
   - In disconnected graphs, an MST spanning all $|V|$ vertices is physically impossible. Kruskal terminates with fewer than $|V| - 1$ edges (producing a Minimum Spanning Forest). Prim's queue will empty before visiting all vertices. Always check `mstEdges.length === numVertices - 1`.
2. **Omitting Path Compression**:
   - Implementing DSU with Union by Rank alone yields $O(\log N)$ operations. Omitting both rank and path compression degrades DSU to linear $O(N)$ linked chains, causing Kruskal to degrade to $O(E \cdot V)$.
3. **Graph with Negative Edge Weights**:
   - Both Kruskal's and Prim's algorithms operate **correctly on negative edge weights**. Unlike Dijkstra, MST algorithms only require relative edge weight comparisons and do not accumulate path sums along paths.

---

## 9. Real-World Applications & Practice Problems

### Production Systems
- **Telecommunications & Power Grid Design**: Minimizing physical fiber-optic cable or electrical wire installation costs connecting municipal substations.
- **Cluster Analysis (Single-Linkage Hierarchical Clustering)**: Removing the largest $k - 1$ edges from an MST partitions $n$ data points into $k$ clusters with maximized inter-cluster separation.
- **Approximation Algorithms for TSP**: The Christofides algorithm uses MST construction as a foundational step to guarantee a $1.5$-approximation for metric Traveling Salesperson Problems.

### Practice Problems
1. **Min Cost to Connect All Points (LeetCode 1584)** — Complete Euclidean graph MST using Prim's or Kruskal's algorithm.
2. **Redundant Connection (LeetCode 684)** — Detect the cycle-forming edge in an undirected graph via DSU.
3. **Number of Operations to Make Network Connected (LeetCode 1319)** — Connected components counting via DSU.

---

## 10. References & Academic Attribution

1. **Borůvka, O.** (1926). O jistém problému minimálním (On a certain minimal problem). *Práce Moravské Přírodovědecké Společnosti*, 3(3), 37–58.
2. **Kruskal, J. B.** (1956). On the shortest spanning subtree of a graph and the traveling salesman problem. *Proceedings of the American Mathematical Society*, 7(1), 48–50.
3. **Prim, R. C.** (1957). Shortest connection networks and some generalizations. *Bell System Technical Journal*, 36(6), 1389–1401.
4. **Tarjan, R. E.** (1975). Efficiency of a good but not linear set union algorithm. *Journal of the ACM (JACM)*, 22(2), 215–225.
5. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 21 (Minimum Spanning Trees) & Chapter 19 (Data Structures for Disjoint Sets). MIT Press.
