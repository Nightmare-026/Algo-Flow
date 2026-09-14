# Part 07: Graphs — Module 02: Graph Storage Architectures & Data Structures

> **Topics Covered:**  
> 103. Adjacency Matrix Representation & Matrix Powers ($A^k$) &bull; 104. Adjacency List Representation (Vectors vs Linked Nodes) &bull; 105. Edge List Representation &bull; 106. Compressed Sparse Row (CSR) & Compressed Sparse Column (CSC) in HPC & ML &bull; Incidence Matrix Representation &bull; Master Storage Benchmark & Hardware Cache Analysis

---

# TOPIC 103: GRAPH STORAGE ARCHITECTURES

### 1. The Core Engineering Challenge

How we represent a graph in computer memory dictates the asymptotic time complexity of every traversal, search, and shortest path algorithm we run.
- A graph with $V = 1,000,000$ vertices and $E = 3,000,000$ edges is typical of road networks.
- An unwise choice of data structure could demand **4 Terabytes of RAM** or trigger millions of **CPU cache misses**!

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      GRAPH STORAGE SPECTRUM                                 │
├────────────────────────┬─────────────────────────┬──────────────────────────┤
│    DENSE STRUCTURES    │    SPARSE STRUCTURES    │  HIGH-PERFORMANCE / HPC  │
├────────────────────────┼─────────────────────────┼──────────────────────────┤
│ • Adjacency Matrix     │ • Adjacency List        │ • Compressed Sparse Row  │
│   (V × V flat array)   │   (Array of vectors)    │   (CSR - 3 flat arrays)  │
│ • Incidence Matrix     │ • Edge List             │ • Compressed Sparse Col  │
│   (V × E matrix)       │   (Array of triplets)   │   (CSC)                  │
└────────────────────────┴─────────────────────────┴──────────────────────────┘
```

---

### 2. Architecture 1: Adjacency Matrix

A 2D array `Adj[V][V]` of size $|V| \times |V|$:
- `Adj[u][v] = 1` (or edge weight $w$) if edge $(u, v) \in E$.
- `Adj[u][v] = 0` (or $\infty$ in weighted graphs) if no edge exists.

```text
SAMPLE GRAPH (4 Vertices):               ADJACENCY MATRIX:
        (0) ────── (1)                          0   1   2   3
         │          │                      0 [  0 │ 1 │ 1 │ 0  ]
         │          │                      1 [  1 │ 0 │ 0 │ 1  ]
        (2) ────── (3)                      2 [  1 │ 0 │ 0 │ 1  ]
                                           3 [  0 │ 1 │ 1 │ 0  ]
```

#### Symmetric Property in Undirected Graphs:
In an undirected graph, $Adj[u][v] = Adj[v][u]$ for all $u, v$. The matrix is **strictly symmetric along its main diagonal**! We can compress memory by half by storing only the upper triangular matrix.

#### Mathematical Superpower: Matrix Powers Count Paths!
If $A$ is the adjacency matrix of a graph, then the entry $(A^k)[i][j]$ in the $k$-th matrix power $A^k = A \times A \times \dots \times A$ equals **the exact number of distinct paths of length $k$ from vertex $i$ to vertex $j$**!

#### Engineering Trade-offs:
- **Pros**:
  - Edge existence check `HasEdge(u, v)` is instant: $\mathbf{O(1)}$.
  - Inserting/deleting an edge takes $\mathbf{O(1)}$.
- **Cons**:
  - Memory consumption is strictly $\mathbf{\Theta(V^2)}$, regardless of how few edges exist! For $V = 100,000$, requires $\approx 40\text{ Gigabytes}$ of RAM!
  - Finding all neighbors of vertex $u$ requires scanning an entire row of length $V$, taking $\mathbf{\Theta(V)}$ time even if $u$ has only $1$ neighbor!

---

### 3. Architecture 2: Adjacency List (Industry Standard for Software)

An array (or vector) of size $|V|$ where index $u$ stores a dynamic list (or vector) of all adjacent neighbors incident to $u$:

```text
ADJACENCY LIST (Array of Dynamic Arrays):
Index 0: [ 1 , 2 ]
Index 1: [ 0 , 3 ]
Index 2: [ 0 , 3 ]
Index 3: [ 1 , 2 ]

WEIGHTED VARIANT (Array of (Neighbor, Weight) Pairs):
Index 0: [ (1, 10) , (2, 25) ]
Index 1: [ (0, 10) , (3, 14) ]
```

#### Engineering Trade-offs:
- **Pros**:
  - Memory consumption is optimal: $\mathbf{\Theta(V + E)}$ for directed graphs ($\mathbf{\Theta(V + 2E)}$ for undirected).
  - Perfect for **Sparse Graphs** ($|E| \ll |V|^2$), representing $99\%$ of real-world networks (Web, social networks, maps).
  - Iterating over all neighbors of vertex $u$ takes optimal $\mathbf{\Theta(\deg(u))}$ time!
- **Cons**:
  - Checking `HasEdge(u, v)` requires scanning through $u$'s neighbor list: $O(\deg(u))$ time.
  - If implemented using linked list nodes, incurs heavy pointer memory overhead and CPU cache misses. (Hence, dynamic arrays / vectors like `std::vector` or `ArrayList` are always preferred in production!).

---

### 4. Architecture 3: Edge List

A flat 1D array of all edges in the graph, where each edge is stored as a tuple `(u, v, weight)`:

```text
EDGE LIST:
[
  (0, 1, 10),
  (0, 2, 25),
  (1, 3, 14),
  (2, 3, 30)
]
```

#### Engineering Trade-offs:
- **Space**: Strictly $\mathbf{\Theta(E)}$ (minimal possible storage).
- **Pros**: Outstanding for algorithms that process edges globally by sorted weight:
  - **Kruskal's Minimum Spanning Tree** (sorts edges by weight in $O(E \log E)$).
  - **Bellman-Ford Shortest Path** (relaxes all edges in a simple flat loop $|V| - 1$ times).
- **Cons**: Finding neighbors of a vertex $u$ or checking edge existence requires a full linear scan of all $E$ edges: $\Theta(E)$ time!

---

### 5. Architecture 4: Compressed Sparse Row (CSR) & CSC in HPC / AI

### Hardware Performance Bottleneck WITH ADJACENCY LISTS:
In standard Adjacency Lists (`vector<vector<int>>`):
- Each inner vector is a separate heap allocation.
- Pointers to inner vectors are scattered across memory.
- In High-Performance Computing (HPC), GPU graph processing (NVIDIA cuGraph), and Graph Neural Networks (PyTorch Geometric, DGL), pointer chasing cripples memory bandwidth!

### Solution: Compressed Sparse Row (CSR)
CSR packs the entire graph into **three flat, contiguous 1D primitive arrays** with **zero pointers**:
1. `col_ind[]`: Flat array of length $|E|$ containing the destination neighbor IDs of all edges.
2. `values[]`: Flat array of length $|E|$ containing edge weights.
3. `row_ptr[]`: Array of length $|V| + 1$ containing the starting index offsets into `col_ind` for each vertex.

```text
EXAMPLE GRAPH (3 Vertices, 4 Directed Edges):
(0) ──► (1) with weight 5
(0) ──► (2) with weight 8
(1) ──► (2) with weight 3
(2) ──► (0) with weight 9

CSR REPRESENTATION:
row_ptr:   [ 0 │ 2 │ 3 │ 4 ]   (Length = V + 1 = 4)
             │   │   │   │
             │   │   │   └─► End of all edges
             │   │   └─────► Vertex 2 edges start at index 3
             │   └─────────► Vertex 1 edges start at index 2
             └─────────────► Vertex 0 edges start at index 0

col_ind:   [ 1 │ 2 │ 2 │ 0 ]   (Length = E = 4)
values:    [ 5 │ 8 │ 3 │ 9 ]   (Length = E = 4)
```

#### How to Find Neighbors of Vertex $u$ in CSR:
The neighbors of vertex $u$ reside contiguously between:
$$\text{col\_ind}[\text{row\_ptr}[u]] \quad \text{and} \quad \text{col\_ind}[\text{row\_ptr}[u+1] - 1]$$
- **Degree of $u$**: $\deg(u) = \text{row\_ptr}[u+1] - \text{row\_ptr}[u]$ in **$O(1)$ time**!
- **Cache Locality**: 100% contiguous hardware vector prefetching! Zero pointer overhead! Perfect for SIMD and GPU matrix cores!

---

### 6. Architecture 5: Incidence Matrix

A 2D array of size $|V| \times |E|$ where rows represent vertices and columns represent edges:
- **Undirected**: `Inc[v][e] = 1` if vertex $v$ is incident to edge $e$, else $0$. (Each column has exactly two $1$s!).
- **Directed (Oriented)**:
  - `Inc[v][e] = -1` if edge $e$ leaves vertex $v$ (source).
  - `Inc[v][e] = +1` if edge $e$ enters vertex $v$ (target).
  - `Inc[v][e] = 0` if vertex $v$ is not connected to edge $e$.

```text
ORIENTED INCIDENCE MATRIX:
               Edge 0 (0->1)   Edge 1 (0->2)   Edge 2 (1->2)
Vertex 0:    [      -1       │      -1       │       0       ]
Vertex 1:    [      +1       │       0       │      -1       ]
Vertex 2:    [       0       │      +1       │      +1       ]
```

- **Primary Use**: Algebraic graph theory, electrical circuit Kirchhoff laws, and network flow matrix formulations.

---

### 7. Master Storage Benchmark & Hardware Cache Analysis

| Metric / Operation | Adjacency Matrix | Adjacency List (Vectors) | Edge List | Compressed Sparse Row (CSR) |
| :--- | :---: | :---: | :---: | :---: |
| **Total Memory Space** | $\mathbf{\Theta(V^2)}$ | $\mathbf{\Theta(V + E)}$ | $\mathbf{\Theta(E)}$ | $\mathbf{\Theta(V + E)}$ (No pointer overhead) |
| **Check Edge $(u, v)$** | $\mathbf{O(1)}$ | $O(\deg(u))$ | $O(E)$ | $O(\log(\deg(u)))$ (via binary search) |
| **Iterate Neighbors of $u$** | $\Theta(V)$ | $\Theta(\deg(u))$ | $\Theta(E)$ | $\mathbf{\Theta(\deg(u))}$ (Contiguous slice) |
| **Add an Edge** | $O(1)$ | $O(1)$ amortized | $O(1)$ | $O(E)$ (Requires array shift; static graphs) |
| **Add a Vertex** | $\Theta(V^2)$ reallocation | $O(1)$ amortized | $O(1)$ | $O(V)$ |
| **CPU Cache Efficiency** | Moderate | Good (vectors) / Poor (lists) | Excellent (flat scan) | **OPTIMAL (Hardware Prefech & SIMD)** |
| **Best Used When** | Dense ($E \approx V^2$), small $V$ | **General software, dynamic graphs** | Sorting edges by weight (Kruskal) | **HPC, GraphBLAS, AI / GNNs, static graphs** |

---

## Module 02 Summary & Key Takeaways

1. **Adjacency Matrix** provides $O(1)$ edge queries but wastes $\Theta(V^2)$ memory, making it unviable for large sparse graphs.
2. The $k$-th power of an adjacency matrix ($A^k$) counts the exact number of paths of length $k$ between all node pairs.
3. **Adjacency List** is the standard choice for general-purpose algorithms (BFS, DFS, Dijkstra), consuming optimal $\Theta(V + E)$ memory.
4. **Compressed Sparse Row (CSR)** packs sparse graphs into 3 flat contiguous arrays (`row_ptr`, `col_ind`, `values`), delivering zero pointer overhead and maximum CPU/GPU cache performance in HPC and machine learning.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 20–23 (Graph Algorithms, Minimum Spanning Trees, Shortest Paths). MIT Press.
2. **Dijkstra, E. W.** (1959). A note on two problems in connexion with graphs. *Numerische Mathematik*, 1(1), 269–271.
3. **Tarjan, R. E.** (1972). Depth-first search and linear graph algorithms. *SIAM Journal on Computing*, 1(2), 146–160.
