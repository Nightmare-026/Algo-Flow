# 🕸️ Part 07: Graphs — Module 01: Graph Types & Master Taxonomy

> **Topics Covered:**  
> 98. Graph Anatomy & The Handshaking Lemma &bull; 99. Directed Graphs (Digraphs) vs Undirected Graphs &bull; 100. Weighted vs Unweighted Graphs &bull; 101. Directed Acyclic Graphs (DAGs) & Invariants &bull; 102. Bipartite Graphs & The Odd Cycle Theorem &bull; Complete Graphs ($K_n, K_{m,n}$) &bull; Dense vs Sparse Graphs & The Sparsity Threshold &bull; Special Graph Classes: Trees, Forests, Planar Graphs, Eulerian & Hamiltonian Topologies

---

# TOPIC 98: GRAPH ANATOMY & THE HANDSHAKING LEMMA

### 1. Topic Title
**Graph Fundamentals (Non-Linear Relational Networks & The Degree Sum Invariant)**

### 2. Category
Non-Linear Data Structures — Relational Topology & Graph Theory.

### 3. Difficulty
Intermediate.

### 4. Prerequisites
- Part 01: Foundations (Set Theory, Relations, Asymptotic Notation).
- Part 06: Trees (Hierarchical vs General Arbitrary Networks).

---

### 5. Definition & Intuitive Mental Model

### 💡 CONCEPT
A **Graph** $G = (V, E)$ is a non-linear data structure consisting of:
- A finite, non-empty set of **Vertices (Nodes)** $V = \{v_1, v_2, \dots, v_n\}$.
- A set of **Edges (Arcs)** $E \subseteq V \times V$, where each edge connects a pair of vertices $(u, v)$.

### 🧠 INTUITION: The Network of Relationships
Unlike trees, which are bound to a strict single root and hierarchical parent-child relationships with zero cycles:
- Graphs have **no root**.
- Graphs have **no hierarchy**.
- Graphs can have **multiple paths** between any two nodes, **isolated islands (disconnected components)**, and **cycles (closed loops)**.
- Real-world instances: The Internet (routers & fiber cables), Social Networks (users & friendships), Road Networks (intersections & streets), Molecular Chemistry (atoms & covalent bonds).

```text
GENERAL GRAPH TOPOLOGY:
       (A) ───────────── (B) ───────────── (C)
        │                 │                 │
        │                 │                 │
       (D) ───────────── (E) ───────────── (F)
         \               /
          \             /
           \           /
                (G)
```

---

### 6. The Fundamental Invariant: Euler's Handshaking Lemma

### 💡 THE THEOREM (Leonhard Euler, 1736):
In any undirected graph $G = (V, E)$, the sum of degrees of all vertices equals **exactly twice the number of edges**:

$$\sum_{v \in V} \deg(v) = 2 |E|$$

#### Mathematical Proof:
1. Every individual edge $e = (u, v)$ has exactly two endpoints ($u$ and $v$).
2. When we calculate the degree $\deg(x)$ of each vertex, we count every incident edge incident to $x$.
3. Since each edge contributes exactly $+1$ to the degree of endpoint $u$ and $+1$ to the degree of endpoint $v$, summing the degrees across all vertices counts each edge exactly two times.
$\blacksquare$

#### Invaluable Corollary:
*In any undirected graph, the number of vertices that have an **odd degree** must be **even**!*
*(Proof: If the sum of an odd number of odd integers were allowed, the total sum would be odd, violating $2|E|$ being strictly even!)*

---
---

# TOPIC 99: DIRECTED VS UNDIRECTED GRAPHS

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EDGE ORIENTATION CLASSIFICATION                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. Undirected Graphs (Symmetric Mutual Links)
In an **Undirected Graph**, edges are unordered pairs:
$$(u, v) \equiv (v, u)$$
- Traffic flows freely in both directions.
- **Real-World Examples**: Facebook friendships (mutual), bidirectional two-way highways, hydrogen bonds in water molecules.
- **Degree**: $\deg(v)$ is simply the number of edges attached to $v$.

### 2. Directed Graphs (Digraphs: Asymmetric One-Way Links)
In a **Directed Graph (Digraph)**, every edge has an explicit orientation (direction), represented as an ordered pair:
$$(u \to v) \ne (v \to u)$$
- Vertex $u$ is the **source / tail**, and vertex $v$ is the **target / head**.
- **Real-World Examples**: Twitter / Instagram follower links (A follows B does not mean B follows A), the World Wide Web (hyperlinks pointing from Page 1 to Page 2), financial wire transfers.

#### Digraph Degree Split:
In a directed graph, vertex degree is bifurcated into:
1. **In-Degree ($\deg^-(v)$)**: Number of incoming edges directed towards $v$.
2. **Out-Degree ($\deg^+(v)$)**: Number of outgoing edges leaving $v$.

#### Handshaking Lemma for Directed Graphs:
$$\sum_{v \in V} \deg^-(v) = \sum_{v \in V} \deg^+(v) = |E|$$
*The sum of all in-degrees equals the sum of all out-degrees, which equals the total number of directed edges!*

```text
UNDIRECTED EDGE:               DIRECTED EDGE:
  (A) ─────────── (B)            (A) ──────────► (B)
Mutual Two-Way Corridor         One-Way Street (A to B only)
```

---
---

# TOPIC 100: WEIGHTED VS UNWEIGHTED GRAPHS

### 1. Unweighted Graphs
Every edge has identical unit cost or significance:
$$\text{weight}(e) = 1 \quad \forall e \in E$$
- The distance between two nodes is measured simply by the **number of hops** (edges traversed).
- **Shortest path algorithm**: **Breadth-First Search (BFS)** solves shortest paths in linear time $O(V + E)$.

### 2. Weighted Graphs
Each edge $e = (u, v)$ carries an assigned numerical scalar $w(e) \in \mathbb{R}$ called its **Weight, Cost, Length, or Capacity**:
$$(u) \xrightarrow{\quad w = 15 \quad} (v)$$

#### Weight Domains & Algorithmic Implications:
1. **Strictly Non-Negative Weights ($w \ge 0$)**:
   - Represents physical distances, transmission latencies, road tolls.
   - Solvable via **Dijkstra's Algorithm** with Fibonacci/Binary Heap in $O((V + E) \log V)$ time.
2. **Negative Edge Weights ($w < 0$)**:
   - Represents financial arbitrage, energy gains, net chemical reactions.
   - **Dijkstra fails completely on negative weights**! Must use **Bellman-Ford Algorithm** ($O(V \cdot E)$).
3. **Negative Weight Cycles**:
   - A directed loop where the sum of edge weights is strictly negative ($\sum_{e \in \text{cycle}} w(e) < 0$).
   - A traversal can loop infinitely, driving path cost to $-\infty$. The shortest path is mathematically undefined!

---
---

# TOPIC 101: DIRECTED ACYCLIC GRAPHS (DAGs)

### 1. Definition & Motivation

### 💡 CONCEPT
A **Directed Acyclic Graph (DAG)** is a directed graph containing **zero directed cycles**:
- You can never start at any vertex $v$ and follow directed edges to return to $v$.

```text
A VALID DIRECTED ACYCLIC GRAPH (DAG):
       (A) ──────────────► (B)
        │                   │
        │                   ▼
        ▼                  (D)
       (C) ──────────────►  ▲
                            │
                           (E)
```

### 2. Fundamental Theorems of DAGs

1. **Existence of Sources and Sinks**:
   *Every non-empty finite DAG has at least one **Source** (a vertex with in-degree $= 0$) and at least one **Sink** (a vertex with out-degree $= 0$).*
2. **Topological Ordering Invariant**:
   *A directed graph $G$ admits a **Topological Sort** if and only if $G$ is a DAG!*
   (A linear permutation of vertices such that for every directed edge $u \to v$, $u$ appears before $v$).
3. **Dynamic Programming Engine**:
   Because DAGs have no feedback loops, they define a natural topological partial order. Any problem with optimal substructure and overlapping subproblems can be modeled as finding shortest/longest paths on a DAG in $O(V + E)$ time!

### Real-World Applications:
- **Build Systems (Make, Bazel, Gradle)**: Task dependency graphs where code must compile before linking.
- **Git Commit History**: Every commit points backward to its parent commit(s). Branch merges form a DAG.
- **Deep Learning Computation Graphs (TensorFlow / PyTorch)**: Tensors flow through operations in an acyclic feedforward graph.

---
---

# TOPIC 102: BIPARTITE GRAPHS & 2-COLORABILITY

### 1. Definition

### 💡 CONCEPT
An undirected graph $G = (V, E)$ is **Bipartite** if its vertex set $V$ can be partitioned into two disjoint subsets $V_1$ and $V_2$ ($V = V_1 \cup V_2$ with $V_1 \cap V_2 = \emptyset$) such that **every edge** connects a vertex in $V_1$ to a vertex in $V_2$.
- **No edge exists between vertices in the same set!**

```text
SET V₁ (Color RED):     (A)         (B)         (C)
                          \       /   \       /
                           \     /     \     /
                            \   /       \   /
SET V₂ (Color BLUE):         (1)         (2)
```

---

### 2. The Odd Cycle Theorem

### 💡 THE THEOREM (Dénes Kőnig, 1936):
*A graph is **Bipartite** if and only if it contains **NO odd-length cycles**!*

#### Proof Intuition (2-Coloring):
- Pick any vertex and color it **RED**.
- Color all its direct neighbors **BLUE**.
- Color all neighbors of neighbors **RED**.
- If we ever encounter an edge connecting two nodes that already share the **SAME color**, an **odd-length cycle** exists ($3$-cycle, $5$-cycle, etc.), and bipartite partitioning is physically impossible!

```text
EVEN CYCLE (4 Nodes) - BIPARTITE:         ODD CYCLE (3 Nodes / Triangle) - NOT BIPARTITE:
      (RED 1) ─── (BLUE 2)                      (RED 1) ─── (BLUE 2)
         │           │                             \         /
         │           │                              \       /
      (BLUE 4) ── (RED 3)                             (???)  <── Cannot be Red or Blue!
      No color conflict! ✅                           Conflict! ❌
```

**Testing Bipartiteness**: Run BFS or DFS with 2 colors in $O(V + E)$ time!

---
---

# TOPIC 103: SPECIAL GRAPH CLASSES & TOPOLOGIES

### 1. Complete Graphs ($K_n$) & Complete Bipartite Graphs ($K_{m,n}$)
- **Complete Graph $K_n$**: Every pair of distinct vertices is connected by an edge.
  $$\text{Total Edges in } K_n = \binom{n}{2} = \frac{n(n - 1)}{2} = \Theta(n^2)$$
- **Complete Bipartite Graph $K_{m,n}$**: Every vertex in $V_1$ ($|V_1| = m$) connects to every vertex in $V_2$ ($|V_2| = n$).
  $$\text{Total Edges in } K_{m,n} = m \cdot n$$

```text
COMPLETE GRAPH K₄ (6 Edges):            COMPLETE BIPARTITE K₂,₃ (6 Edges):
        (1) ──────── (2)                     (A)       (B)
         │  ╲      ╱  │                      ╱│╲       ╱│╲
         │    ╲  ╱    │                     ╱ │ ╲     ╱ │ ╲
         │    ╱  ╲    │                    (1)(2)(3) (1)(2)(3)
        (3) ──────── (4)
```

---

### 2. Dense vs Sparse Graphs & The Sparsity Threshold

The ratio of edge count to vertex count defines the fundamental engineering choice between matrix vs list storage:

$$\text{Density Factor } D = \frac{2 |E|}{|V|(|V| - 1)}$$

| Classification | Edge Density | Mathematical Condition | Real-World Examples | Optimal Representation |
| :--- | :---: | :---: | :--- | :--- |
| **Sparse Graph** | $|E| \ll |V|^2$ | $|E| = O(|V|)$ or $O(|V| \log |V|)$ | Web pages, highway road maps, social graphs | **Adjacency List / CSR** |
| **Dense Graph** | $|E| \approx |V|^2$ | $|E| = \Omega(|V|^2)$ | Flight connections between all airports, all-pairs correlation matrices | **Adjacency Matrix** |

---

### 3. Planar Graphs & Euler's Formula

A graph is **Planar** if it can be drawn on a 2D plane in such a way that **no two edges cross each other**.

#### Euler's Formula for Connected Planar Graphs:
$$V - E + F = 2$$
*(where $V$ is vertices, $E$ is edges, and $F$ is enclosed 2D faces including the exterior face).*

#### Boundary Invariant on Edges:
For any planar graph with $V \ge 3$:
$$E \le 3V - 6$$
*Every planar graph is inherently **Sparse** ($E = O(V)$)!*

#### Kuratowski's Theorem:
*A graph is planar if and only if it does NOT contain a subgraph that is a subdivision of $K_5$ (complete graph on 5 vertices) or $K_{3,3}$ (utility graph).*

---

### 4. Eulerian vs Hamiltonian Topologies

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GLOBAL GRAPH WALKS & CYCLES                              │
├──────────────────────────────────────┬──────────────────────────────────────┤
│           EULERIAN PATH / CIRCUIT    │        HAMILTONIAN PATH / CYCLE      │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ Traverses every single EDGE exactly  │ Visits every single VERTEX exactly   │
│ once!                                │ once!                                │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ Solvable in optimal LINEAR time      │ NP-COMPLETE (No known polynomial     │
│ O(V + E) via Hierholzer's Algorithm! │ time algorithm; basis of Traveling   │
│                                      │ Salesperson Problem / TSP)!          │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ Condition: Connected and:            │ No simple necessary & sufficient     │
│ - Circuit: ALL vertices have even    │ degree condition exists (Dirac's     │
│   degree.                            │ theorem gives sufficiency only).     │
│ - Path: Exactly 2 vertices have odd  │                                      │
│   degrees (start and end).           │                                      │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 🔁 Module 01 Summary & Key Takeaways

1. **The Handshaking Lemma** guarantees that $\sum \deg(v) = 2|E|$, proving the number of odd-degree vertices in any graph must be even.
2. In **Directed Graphs**, $\sum \text{in-deg}(v) = \sum \text{out-deg}(v) = |E|$.
3. **DAGs (Directed Acyclic Graphs)** contain zero cycles, admit topological sorting, and serve as the execution engine for build systems and DP algorithms.
4. A graph is **Bipartite** if and only if it contains **no odd-length cycles**, verifiable via 2-color BFS/DFS in $O(V + E)$ time.
5. **Eulerian paths** traverse every *edge* once ($O(V+E)$), while **Hamiltonian cycles** visit every *vertex* once (NP-Complete).

---
[⬅️ Previous: Part 06 Trees](file:///d:/DSA/Part-06-Trees/10_spatial_and_specialized_trees.md) | [Next: Module 02 — Graph Storage Architectures ➡️](file:///d:/DSA/Part-07-Graphs/02_graph_storage_architectures.md)
