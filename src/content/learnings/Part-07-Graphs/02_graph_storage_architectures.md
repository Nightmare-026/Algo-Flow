# Part 07: Graphs — Module 02: Graph Storage Architectures & Data Structures

> The physical representation of a graph in computer memory dictates algorithmic time complexity, hardware cache locality, and memory overhead. Understanding trade-offs between dense adjacency matrices, sparse adjacency lists, and pointerless Compressed Sparse Row (CSR) arrays bridges theoretical graph traversal with high-performance systems engineering.

---

## 1. Executive Summary & Learning Objectives

Representing a graph $G = (V, E)$ in digital memory requires balancing the trade-off between edge existence lookup latency ($O(1)$) and neighbor iteration cost ($\Theta(\deg(u))$). While dense matrices optimize edge queries for complete topologies, real-world graphs (the Web, highway networks, social graphs) are overwhelmingly sparse, requiring memory-compact adjacency lists and cache-aligned Compressed Sparse Row (CSR) formats.

By the end of this chapter, you will be able to:
1. **Analyze** memory and time trade-offs across Adjacency Matrices, Adjacency Lists, Edge Lists, and Compressed Sparse Row (CSR) representations.
2. **Apply** matrix multiplication powers ($A^k$) to compute exact path counts of length $k$ between vertex pairs in $O(V^3 \log k)$ time.
3. **Construct** a Compressed Sparse Row (CSR) layout from raw edge lists and query contiguous neighbor slices with zero pointer chasing.
4. **Evaluate** CPU L1/L2 cache line utilization and SIMD vectorization characteristics across graph storage models.
5. **Select** the mathematically and hardware-optimal graph data structure given vertex count $|V|$, edge count $|E|$, and query workload.

---

## 2. Graph Storage Architectures Overview

| Architecture Category | Storage Model | Memory Complexity | Best Algorithmic Fit |
| :--- | :--- | :---: | :--- |
| **Dense Representation** | **Adjacency Matrix** ($V \times V$ 2D Array) | $\Theta(V^2)$ | Dense graphs ($|E| \approx |V|^2$), Warshall transitive closure, Floyd-Warshall all-pairs shortest paths |
| **Sparse Representation** | **Adjacency List** (Array of dynamic vectors) | $\Theta(V + E)$ | General graph software, BFS, DFS, Dijkstra, Tarjan SCC |
| **Relational Representation** | **Edge List** (Array of edge triplets) | $\Theta(E)$ | Kruskal's Minimum Spanning Tree, Bellman-Ford edge relaxation |
| **High-Performance (HPC)** | **Compressed Sparse Row (CSR)** (3 flat arrays) | $\Theta(V + E)$ | Graph Neural Networks (PyTorch Geometric), GPU graph analytics (NVIDIA cuGraph), GraphBLAS |
| **Incidence Representation** | **Incidence Matrix** ($V \times E$ 2D Array) | $\Theta(V \cdot E)$ | Algebraic topology, Kirchhoff circuit laws, network flow matrices |

---

## 3. Architecture 1: Adjacency Matrix

An Adjacency Matrix is a 2D array `Adj[V][V]` where:
- `Adj[u][v] = 1` (or edge weight $w$) if $(u, v) \in E$.
- `Adj[u][v] = 0` (or $\infty$ for weighted graphs) if no edge exists.

### Sample Adjacency Matrix (4 Vertices, Undirected Cycle)

Consider an undirected graph with edges $\{(0, 1), (0, 2), (1, 3), (2, 3)\}$:

| Vertex | Column $0$ | Column $1$ | Column $2$ | Column $3$ | Vertex Degree $\deg(u)$ |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **Row $0$** | $0$ | $1$ | $1$ | $0$ | $2$ |
| **Row $1$** | $1$ | $0$ | $0$ | $1$ | $2$ |
| **Row $2$** | $1$ | $0$ | $0$ | $1$ | $2$ |
| **Row $3$** | $0$ | $1$ | $1$ | $0$ | $2$ |

*Symmetric Invariant:* For undirected graphs, $\text{Adj}[u][v] = \text{Adj}[v][u]$ across the main diagonal.

### Mathematical Superpower: Matrix Powers Count Paths
Let $A$ be the unweighted adjacency matrix of graph $G$. The $(i, j)$-th entry of the $k$-th matrix power $A^k$:

$$(A^k)_{i, j} = \sum_{x_1} \sum_{x_2} \dots \sum_{x_{k-1}} A_{i, x_1} A_{x_1, x_2} \dots A_{x_{k-1}, j}$$

equals **the exact number of distinct paths of length $k$ from vertex $i$ to vertex $j$**. Using binary matrix exponentiation, this can be computed in $O(V^3 \log k)$ time!

---

## 4. Architecture 2: Adjacency List

An Adjacency List stores an array of size $|V|$ where index $u$ contains a dynamic array (or list) of all adjacent neighbors incident to $u$:

| Vertex $u$ | Unweighted Neighbor List | Weighted Neighbor List (`(Neighbor, Weight)`) | Neighbor Iteration Complexity |
| :---: | :--- | :--- | :---: |
| **$0$** | `[1, 2]` | `[(1, 10), (2, 25)]` | $\Theta(\deg(0)) = \Theta(2)$ |
| **$1$** | `[0, 3]` | `[(0, 10), (3, 14)]` | $\Theta(\deg(1)) = \Theta(2)$ |
| **$2$** | `[0, 3]` | `[(0, 25), (3, 30)]` | $\Theta(\deg(2)) = \Theta(2)$ |
| **$3$** | `[1, 2]` | `[(1, 14), (2, 30)]` | $\Theta(\deg(3)) = \Theta(2)$ |

*Engineering Rule:* In production software, prefer dynamic contiguous arrays (`std::vector` in C++, dynamic arrays in TypeScript/Java) over linked list nodes. Linked list nodes incur heavy memory fragmentation and CPU cache misses during traversal.

<div class="my-6 p-4 bg-surface rounded-xl border border-border overflow-x-auto">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 310" width="100%" height="310" class="mx-auto block font-sans">
  <defs>
    <marker id="csr-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/></marker>
  </defs>
  <text x="410" y="22" text-anchor="middle" font-size="15" font-weight="bold" fill="currentColor">Graph Storage Models: Memory Layout &amp; Cache Locality Comparison</text>
  <rect x="20" y="45" width="240" height="250" rx="8" fill="none" stroke="#64748b" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="140" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#0284c7">1. Adjacency Matrix</text>
  <g transform="translate(60, 85)">
    <rect x="0" y="0" width="35" height="35" fill="#1e293b" stroke="#334155"/><text x="17" y="23" text-anchor="middle" font-size="12" fill="#94a3b8">0</text>
    <rect x="35" y="0" width="35" height="35" fill="#0284c7" fill-opacity="0.25" stroke="#0284c7"/><text x="52" y="23" text-anchor="middle" font-size="12" font-weight="bold" fill="#38bdf8">1</text>
    <rect x="70" y="0" width="35" height="35" fill="#0284c7" fill-opacity="0.25" stroke="#0284c7"/><text x="87" y="23" text-anchor="middle" font-size="12" font-weight="bold" fill="#38bdf8">1</text>
    <rect x="105" y="0" width="35" height="35" fill="#1e293b" stroke="#334155"/><text x="122" y="23" text-anchor="middle" font-size="12" fill="#94a3b8">0</text>
    <rect x="0" y="35" width="35" height="35" fill="#0284c7" fill-opacity="0.25" stroke="#0284c7"/><text x="17" y="58" text-anchor="middle" font-size="12" font-weight="bold" fill="#38bdf8">1</text>
    <rect x="35" y="35" width="35" height="35" fill="#1e293b" stroke="#334155"/><text x="52" y="58" text-anchor="middle" font-size="12" fill="#94a3b8">0</text>
    <rect x="70" y="35" width="35" height="35" fill="#1e293b" stroke="#334155"/><text x="87" y="58" text-anchor="middle" font-size="12" fill="#94a3b8">0</text>
    <rect x="105" y="35" width="35" height="35" fill="#0284c7" fill-opacity="0.25" stroke="#0284c7"/><text x="122" y="58" text-anchor="middle" font-size="12" font-weight="bold" fill="#38bdf8">1</text>
    <rect x="0" y="70" width="35" height="35" fill="#0284c7" fill-opacity="0.25" stroke="#0284c7"/><text x="17" y="93" text-anchor="middle" font-size="12" font-weight="bold" fill="#38bdf8">1</text>
    <rect x="35" y="70" width="35" height="35" fill="#1e293b" stroke="#334155"/><text x="52" y="93" text-anchor="middle" font-size="12" fill="#94a3b8">0</text>
    <rect x="70" y="70" width="35" height="35" fill="#1e293b" stroke="#334155"/><text x="87" y="93" text-anchor="middle" font-size="12" fill="#94a3b8">0</text>
    <rect x="105" y="70" width="35" height="35" fill="#0284c7" fill-opacity="0.25" stroke="#0284c7"/><text x="122" y="93" text-anchor="middle" font-size="12" font-weight="bold" fill="#38bdf8">1</text>
    <rect x="0" y="105" width="35" height="35" fill="#1e293b" stroke="#334155"/><text x="17" y="128" text-anchor="middle" font-size="12" fill="#94a3b8">0</text>
    <rect x="35" y="105" width="35" height="35" fill="#0284c7" fill-opacity="0.25" stroke="#0284c7"/><text x="52" y="128" text-anchor="middle" font-size="12" font-weight="bold" fill="#38bdf8">1</text>
    <rect x="70" y="105" width="35" height="35" fill="#0284c7" fill-opacity="0.25" stroke="#0284c7"/><text x="87" y="128" text-anchor="middle" font-size="12" font-weight="bold" fill="#38bdf8">1</text>
    <rect x="105" y="105" width="35" height="35" fill="#1e293b" stroke="#334155"/><text x="122" y="128" text-anchor="middle" font-size="12" fill="#94a3b8">0</text>
  </g>
  <text x="140" y="250" text-anchor="middle" font-size="11" font-weight="bold" fill="#0284c7">&#x398;(V&#178;) Dense Storage</text>
  <text x="140" y="270" text-anchor="middle" font-size="10" fill="currentColor">O(1) edge check | &#x398;(V) scan</text>
  <rect x="280" y="45" width="250" height="250" rx="8" fill="none" stroke="#64748b" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="405" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#f59e0b">2. Adjacency List</text>
  <g transform="translate(300, 95)">
    <rect x="0" y="0" width="35" height="26" fill="#1e293b" stroke="#d97706" rx="3"/><text x="17" y="17" text-anchor="middle" font-size="11" font-weight="bold" fill="#f59e0b">[0]</text>
    <line x1="38" y1="13" x2="65" y2="13" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="68" y="0" width="55" height="26" fill="#f59e0b" fill-opacity="0.2" stroke="#d97706" rx="3"/><text x="95" y="17" text-anchor="middle" font-size="11" fill="currentColor">[1, 2]</text>
    <rect x="0" y="36" width="35" height="26" fill="#1e293b" stroke="#d97706" rx="3"/><text x="17" y="53" text-anchor="middle" font-size="11" font-weight="bold" fill="#f59e0b">[1]</text>
    <line x1="38" y1="49" x2="65" y2="49" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="68" y="36" width="55" height="26" fill="#f59e0b" fill-opacity="0.2" stroke="#d97706" rx="3"/><text x="95" y="53" text-anchor="middle" font-size="11" fill="currentColor">[0, 3]</text>
    <rect x="0" y="72" width="35" height="26" fill="#1e293b" stroke="#d97706" rx="3"/><text x="17" y="89" text-anchor="middle" font-size="11" font-weight="bold" fill="#f59e0b">[2]</text>
    <line x1="38" y1="85" x2="65" y2="85" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="68" y="72" width="55" height="26" fill="#f59e0b" fill-opacity="0.2" stroke="#d97706" rx="3"/><text x="95" y="89" text-anchor="middle" font-size="11" fill="currentColor">[0, 3]</text>
    <rect x="0" y="108" width="35" height="26" fill="#1e293b" stroke="#d97706" rx="3"/><text x="17" y="125" text-anchor="middle" font-size="11" font-weight="bold" fill="#f59e0b">[3]</text>
    <line x1="38" y1="121" x2="65" y2="121" stroke="#f59e0b" stroke-width="1.5"/>
    <rect x="68" y="108" width="55" height="26" fill="#f59e0b" fill-opacity="0.2" stroke="#d97706" rx="3"/><text x="95" y="125" text-anchor="middle" font-size="11" fill="currentColor">[1, 2]</text>
  </g>
  <text x="405" y="250" text-anchor="middle" font-size="11" font-weight="bold" fill="#f59e0b">&#x398;(V + E) Pointer Vectors</text>
  <text x="405" y="270" text-anchor="middle" font-size="10" fill="currentColor">Heap allocations | Cache misses</text>
  <rect x="550" y="45" width="250" height="250" rx="8" fill="none" stroke="#64748b" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="675" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#10b981">3. Compressed Sparse Row (CSR)</text>
  <g transform="translate(565, 95)">
    <text x="0" y="15" font-size="10.5" font-weight="bold" fill="#94a3b8">row_ptr (|V|+1):</text>
    <rect x="0" y="22" width="220" height="28" fill="#1e293b" stroke="#334155" rx="3"/>
    <text x="110" y="41" text-anchor="middle" font-size="11" font-weight="bold" fill="#10b981">[0,  2,  4,  6,  8]</text>
    <text x="0" y="75" font-size="10.5" font-weight="bold" fill="#94a3b8">col_ind (2|E|):</text>
    <rect x="0" y="82" width="220" height="28" fill="#1e293b" stroke="#334155" rx="3"/>
    <text x="110" y="101" text-anchor="middle" font-size="11" font-weight="bold" fill="#38bdf8">[1, 2, 0, 3, 0, 3, 1, 2]</text>
    <path d="M 40 52 L 40 78" stroke="#10b981" stroke-width="1.5" marker-end="url(#csr-arr)"/>
    <text x="50" y="68" font-size="9" fill="#10b981">Slice [0:2] for node 0</text>
  </g>
  <text x="675" y="250" text-anchor="middle" font-size="11" font-weight="bold" fill="#10b981">&#x398;(V + E) Flat Contiguous</text>
  <text x="675" y="270" text-anchor="middle" font-size="10" fill="currentColor">0 Pointers | 100% Cache Line Hit</text>
</svg>
</div>

---

## 5. Architecture 3: Edge List

An Edge List represents a graph as a flat array of edge records:

```typescript
export interface Edge<T> {
  u: number;
  v: number;
  weight: T;
}

export const sampleEdgeList: Edge<number>[] = [
  { u: 0, v: 1, weight: 10 },
  { u: 0, v: 2, weight: 25 },
  { u: 1, v: 3, weight: 14 },
  { u: 2, v: 3, weight: 30 },
];
```

*Trade-offs:* Consumes minimal memory ($\Theta(E)$). Highly optimal for global edge-sorting algorithms (Kruskal's MST, Bellman-Ford), but inefficient for neighbor queries ($\Theta(E)$ linear scan).

---

## 6. Architecture 4: Compressed Sparse Row (CSR) in HPC & AI

### Hardware Bottleneck of Standard Adjacency Lists
In standard `vector<vector<int>>` adjacency lists, each inner vector represents an independent heap allocation scattered across RAM. Traversing neighbors induces severe pointer-chasing and CPU cache invalidations, crippling GPU memory throughput.

### The CSR Solution: Zero Pointers, Flat Memory
Compressed Sparse Row (CSR) packs the entire graph into **three contiguous 1D arrays**:
1. `row_ptr[]`: Array of length $|V| + 1$ storing index offsets into `col_ind` where each vertex's neighbor list begins.
2. `col_ind[]`: Flat array of length $|E|$ containing the destination neighbor IDs.
3. `values[]`: Flat array of length $|E|$ containing edge weights.

### Sample CSR Representation
Consider a directed graph with 3 vertices and 4 directed edges:
- $0 \to 1$ ($w = 5$)
- $0 \to 2$ ($w = 8$)
- $1 \to 2$ ($w = 3$)
- $2 \to 0$ ($w = 9$)

| Array | Stored Primitive Values | Array Length | Semantic Meaning |
| :--- | :--- | :---: | :--- |
| **`row_ptr`** | `[0, 2, 3, 4]` | $|V| + 1 = 4$ | Vertex $0$ starts at idx $0$; Vertex $1$ starts at idx $2$; Vertex $2$ starts at idx $3$; Total edges $= 4$. |
| **`col_ind`** | `[1, 2, 2, 0]` | $|E| = 4$ | Destination vertices for all outgoing edges in sequential row order. |
| **`values`** | `[5, 8, 3, 9]` | $|E| = 4$ | Numerical edge weights corresponding directly to `col_ind`. |

### Neighbor Slice Extraction in CSR
The outgoing neighbors of vertex $u$ reside in the contiguous array slice:

$$\text{col\_ind}[\text{row\_ptr}[u] \dots \text{row\_ptr}[u + 1] - 1]$$

$$\deg^+(u) = \text{row\_ptr}[u + 1] - \text{row\_ptr}[u] \quad \text{in strictly } O(1) \text{ time!}$$

---

## 7. Step-by-Step Dry Run State Trace: Building CSR from Edge List

Consider converting directed edge list $E = [(0, 1, 5), (0, 2, 8), (1, 2, 3), (2, 0, 9)]$ for $V = 3$ into a CSR structure:

| Step | Operation | Intermediate Data Structure State | Explanation |
| :---: | :--- | :--- | :--- |
| **1** | Count Out-Degrees | $\text{degree} = [2, 1, 1]$ | Vertex $0$ has 2 edges; Vertex $1$ has 1 edge; Vertex $2$ has 1 edge. |
| **2** | Compute Prefix Sums for `row_ptr` | $\text{row\_ptr} = [0, 0+2, 2+1, 3+1] = [0, 2, 3, 4]$ | Computes starting index offsets into `col_ind` for each vertex. |
| **3** | Populate Edge $(0, 1, 5)$ | `col_ind[0] = 1`, `values[0] = 5` | First edge of vertex $0$ placed at index offset $0$. |
| **4** | Populate Edge $(0, 2, 8)$ | `col_ind[1] = 2`, `values[1] = 8` | Second edge of vertex $0$ placed at index offset $1$. |
| **5** | Populate Edge $(1, 2, 3)$ | `col_ind[2] = 2`, `values[2] = 3` | Edge of vertex $1$ placed at index offset $2$. |
| **6** | Populate Edge $(2, 0, 9)$ | `col_ind[3] = 0`, `values[3] = 9` | Edge of vertex $2$ placed at index offset $3$. |
| **Final** | Verification | `row_ptr = [0, 2, 3, 4]`<br>`col_ind = [1, 2, 2, 0]`<br>`values  = [5, 8, 3, 9]` | Construction complete in strictly $O(V + E)$ time! |

---

## 8. Complete Implementation: CSR Graph Query Engine

```typescript
export class CSRGraph {
  public readonly numVertices: number;
  public readonly numEdges: number;
  public readonly rowPtr: Int32Array;
  public readonly colInd: Int32Array;
  public readonly values: Float64Array;

  constructor(
    numVertices: number,
    edges: { u: number; v: number; weight: number }[]
  ) {
    this.numVertices = numVertices;
    this.numEdges = edges.length;

    this.rowPtr = new Int32Array(numVertices + 1);
    this.colInd = new Int32Array(this.numEdges);
    this.values = new Float64Array(this.numEdges);

    // Step 1: Count out-degrees
    for (const edge of edges) {
      this.rowPtr[edge.u + 1]++;
    }

    // Step 2: Compute prefix sums
    for (let i = 0; i < numVertices; i++) {
      this.rowPtr[i + 1] += this.rowPtr[i];
    }

    // Step 3: Fill colInd and values
    const currentOffset = new Int32Array(this.rowPtr);
    for (const edge of edges) {
      const idx = currentOffset[edge.u]++;
      this.colInd[idx] = edge.v;
      this.values[idx] = edge.weight;
    }
  }

  public getDegree(u: number): number {
    return this.rowPtr[u + 1] - this.rowPtr[u];
  }

  public getNeighbors(u: number): { neighbor: number; weight: number }[] {
    const start = this.rowPtr[u];
    const end = this.rowPtr[u + 1];
    const result = [];

    for (let i = start; i < end; i++) {
      result.push({ neighbor: this.colInd[i], weight: this.values[i] });
    }

    return result;
  }
}
```

---

## 9. Master Storage Benchmark & Hardware Cache Analysis

| Metric / Operation | Adjacency Matrix | Adjacency List (Dynamic Arrays) | Edge List | Compressed Sparse Row (CSR) |
| :--- | :---: | :---: | :---: | :---: |
| **Total Memory Space** | $\mathbf{\Theta(V^2)}$ | $\mathbf{\Theta(V + E)}$ | $\mathbf{\Theta(E)}$ | $\mathbf{\Theta(V + E)}$ (Zero pointers) |
| **Check Edge $(u, v)$** | $\mathbf{O(1)}$ | $O(\deg(u))$ | $O(E)$ | $O(\log(\deg(u)))$ (via binary search) |
| **Iterate Neighbors of $u$** | $\Theta(V)$ | $\Theta(\deg(u))$ | $\Theta(E)$ | $\mathbf{\Theta(\deg(u))}$ (Contiguous slice) |
| **Add an Edge** | $O(1)$ | $O(1)$ amortized | $O(1)$ | $O(E)$ (Requires array shift; static) |
| **CPU Cache Efficiency** | Moderate | Good (vectors) / Poor (pointers) | Excellent (flat scan) | **OPTIMAL (Hardware SIMD & Prefetch)** |
| **Primary Industry Role** | Dense graphs, all-pairs shortest paths | **Standard application software, dynamic graphs** | Global edge processing (Kruskal, Bellman) | **GraphBLAS, HPC, PyTorch Geometric, GNNs** |

---

## 10. Common Traps, Edge Cases & Implementation Pitfalls

1. **Allocating Matrix for Sparse Graphs**:
   - Creating a $100,000 \times 100,000$ 32-bit integer matrix consumes $\approx 40\text{ GB}$ of RAM and triggers an immediate Out-Of-Memory (OOM) crash. Always check the sparsity threshold ($|E| \ll |V|^2$) before selecting matrix storage.
2. **CSR Immutability**:
   - CSR is an immutable (or static) structure. Dynamically inserting an edge requires shifting all subsequent entries in `col_ind` and `values`, costing $O(E)$ time. For dynamic workloads, build with an Adjacency List and compile to CSR once topology stabilizes.
3. **Double Counting in Undirected Edge Lists**:
   - In undirected graphs, each undirected edge $\{u, v\}$ must either be stored once as a single pair or twice as $(u, v)$ and $(v, u)$ depending on the algorithm's contract. Mixing conventions causes duplicate iterations in Kruskal's or Prim's routines.

---

## 11. References & Academic Attribution

1. **Saad, Y.** (2003). *Iterative Methods for Sparse Linear Systems* (2nd ed.). Society for Industrial and Applied Mathematics (SIAM).
2. **Kepner, J., et al.** (2016). Mathematical foundations of the GraphBLAS. *IEEE High Performance Extreme Computing Conference (HPEC)*, 1–9.
3. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 20 (Elementary Graph Algorithms). MIT Press.
