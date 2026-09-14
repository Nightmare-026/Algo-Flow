# Part 07: Graphs — Module 01: Graph Types & Master Taxonomy

> Graphs model arbitrary non-linear relational topology without the hierarchical constraints of trees, capturing asymmetric dependencies, cyclic flows, and multidimensional networks. Master the mathematical invariants—from Euler's Handshaking Lemma and directed degree balances to the Odd Cycle Bipartiteness Theorem—that dictate every downstream graph algorithm.

---

## 1. Executive Summary & Learning Objectives

Originating with Leonhard Euler's 1736 resolution of the Seven Bridges of Königsberg problem, Graph Theory formalizes pairwise relations between objects. A graph $G = (V, E)$ consists of a set of vertices $V$ connected by edges $E$. Unlike trees, graphs permit arbitrary cycles, multiple disjoint components, and asymmetric traversals.

By the end of this chapter, you will be able to:
1. **Apply** Euler's Handshaking Lemma to prove vertex degree parity invariants in undirected and directed networks.
2. **Differentiate** directed, undirected, weighted, and unweighted graphs across mathematical formalisms and algorithmic constraints.
3. **Formulate** the structural conditions of Directed Acyclic Graphs (DAGs) and their role as topological dependency engines.
4. **Prove** Kőnig's Odd Cycle Theorem and verify graph bipartiteness via 2-color BFS/DFS in $O(V + E)$ time.
5. **Classify** special topological families—including Complete ($K_n$), Planar ($V - E + F = 2$), Eulerian ($O(V+E)$), and Hamiltonian (NP-Complete) graphs.

---

## 2. Graph Anatomy & The Handshaking Lemma

A graph $G = (V, E)$ is defined by:
- A finite vertex set $V = \{v_1, v_2, \dots, v_n\}$.
- An edge set $E \subseteq V \times V$, where each edge connects a pair of vertices $(u, v)$.

### Structural Comparison: Trees vs. General Graphs

| Architectural Dimension | Tree ($T$) | General Graph ($G$) |
| :--- | :--- | :--- |
| **Root & Hierarchy** | Strict single root; parent-child hierarchy | **No root**; arbitrary peer relationships |
| **Path Uniqueness** | Exactly **one unique simple path** between any two nodes | **Zero, one, or exponentially many paths** |
| **Cycles & Loops** | **Strictly acyclic** ($|E| = |V| - 1$) | May contain self-loops, parallel edges, and cycles |
| **Connectivity** | Always fully connected in a single component | May consist of multiple disconnected components |

---

### Theorem: Euler's Handshaking Lemma (1736)

In any undirected graph $G = (V, E)$, the sum of the degrees of all vertices equals **exactly twice the number of edges**:

$$\sum_{v \in V} \deg(v) = 2 |E|$$

#### Formal Proof
1. Each individual edge $e = (u, v)$ has exactly two endpoints ($u$ and $v$).
2. When summing vertex degrees $\sum_{v \in V} \deg(v)$, every incident edge contributes $+1$ to $\deg(u)$ and $+1$ to $\deg(v)$.
3. Because every edge is counted exactly twice, the sum equals $2|E|$. $\blacksquare$

#### Corollary: The Odd Degree Parity Invariant
*In any undirected graph, the count of vertices having an **odd degree** must be **even**.*

*Proof:* Partition $V$ into vertices with even degrees ($V_{\text{even}}$) and odd degrees ($V_{\text{odd}}$):

$$\sum_{v \in V_{\text{even}}} \deg(v) + \sum_{u \in V_{\text{odd}}} \deg(u) = 2|E|$$

The total $2|E|$ is even, and $\sum_{v \in V_{\text{even}}} \deg(v)$ is even. Thus, $\sum_{u \in V_{\text{odd}}} \deg(u)$ must be an even number. The sum of odd integers is even if and only if the number of terms is even. Hence, $|V_{\text{odd}}|$ is even. $\blacksquare$

---

## 3. Directed vs. Undirected Graphs

| Structural Property | Undirected Graph | Directed Graph (Digraph) |
| :--- | :--- | :--- |
| **Edge Representation** | Unordered pair $\{u, v\} \equiv \{v, u\}$ | Ordered pair $(u \to v) \ne (v \to u)$ |
| **Traversal Semantic** | Bidirectional two-way corridor | Asymmetric one-way street ($u = \text{source}, v = \text{target}$) |
| **Degree Metric** | Single degree $\deg(v)$ | Split: In-Degree $\deg^-(v)$ and Out-Degree $\deg^+(v)$ |
| **Degree Sum Theorem** | $\sum_{v} \deg(v) = 2|E|$ | $\sum_{v} \deg^-(v) = \sum_{v} \deg^+(v) = |E|$ |
| **Maximum Edges** | $\binom{|V|}{2} = \frac{|V|(|V|-1)}{2}$ | $|V|(|V| - 1)$ |
| **Real-World Models** | Facebook friendships, bidirectional highway grids | Twitter/X followers, Web hyperlinks, financial wires |

---

## 4. Weighted Graphs & Cost Models

In a weighted graph, every edge $e = (u, v)$ carries an assigned numerical weight $w(e) \in \mathbb{R}$:

| Weight Domain | Real-World Analog | Algorithmic Solvability for Shortest Path |
| :--- | :--- | :--- |
| **Unweighted ($w = 1$)** | Hop counts, web link distance | **Breadth-First Search (BFS)** in $O(V + E)$ |
| **Non-Negative ($w \ge 0$)** | Physical distance, network latency, road tolls | **Dijkstra's Algorithm** with Min-Heap in $O((V + E) \log V)$ |
| **Negative Weights ($w < 0$)** | Financial arbitrage, energy delta, chemical bonds | **Bellman-Ford Algorithm** in $O(V \cdot E)$ (Dijkstra fails!) |
| **Negative Weight Cycles** | Infinite profit cycles, energy generation loops | **Shortest path is mathematically undefined ($-\infty$)** |

---

## 5. Directed Acyclic Graphs (DAGs)

A **Directed Acyclic Graph (DAG)** is a directed graph containing **no directed cycles**: following directed edges from any vertex $v$ never returns to $v$.

### Fundamental Theorems of DAGs

| Theorem | Formal Assertion | Practical Implication |
| :--- | :--- | :--- |
| **1. Source and Sink Invariant** | Every finite non-empty DAG has at least one **Source** ($\deg^-(u) = 0$) and at least one **Sink** ($\deg^+(v) = 0$). | Guarantees well-defined start and end boundaries for traversals. |
| **2. Topological Ordering** | A directed graph admits a **Topological Sort** if and only if it is a DAG. | Linearizes dependencies such that for all $u \to v$, $u$ precedes $v$. |
| **3. Dynamic Programming Equivalence** | Any problem possessing optimal substructure and overlapping subproblems maps to a DAG. | Shortest and longest paths on DAGs are solvable in $O(V + E)$ time! |

### Real-World Production DAG Architectures
- **Compilation Build Systems**: Make, Bazel, and Gradle model compilation targets as DAG nodes to orchestrate parallel builds.
- **Version Control Systems (Git)**: Commits form a directed acyclic graph where child commits point backward to parent commits.
- **Deep Learning Computation Engines**: PyTorch autograd and TensorFlow represent tensor operations as directed acyclic computation graphs.

---

## 6. Bipartite Graphs & Kőnig's Odd Cycle Theorem

### Definition: Bipartite Graph
An undirected graph $G = (V, E)$ is **Bipartite** if its vertex set $V$ can be partitioned into two disjoint subsets $V_1$ and $V_2$ ($V_1 \cup V_2 = V$, $V_1 \cap V_2 = \emptyset$) such that every edge in $E$ connects a vertex in $V_1$ to a vertex in $V_2$. No edge connects two vertices within the same subset.

### Theorem (Dénes Kőnig, 1936)
*A graph is bipartite if and only if it contains **no odd-length cycles**.*

| Cycle Topology | Cycle Length | 2-Color Partition Feasibility | Bipartite Status |
| :--- | :---: | :--- | :---: |
| **Square ($C_4$)** | $4$ (Even) | Alternates: $\text{Red} \to \text{Blue} \to \text{Red} \to \text{Blue} \to \text{Red}$. Zero conflict. | **Bipartite** |
| **Triangle ($C_3$)** | $3$ (Odd) | Nodes: $1(\text{Red}) \to 2(\text{Blue}) \to 3(?)$. Third node connects to both Red and Blue! Conflict! | **Non-Bipartite** |
| **Pentagon ($C_5$)** | $5$ (Odd) | 2-coloring forces adjacent nodes to share the same color. | **Non-Bipartite** |

---

## 7. Step-by-Step Dry Run State Trace: 2-Color BFS Bipartiteness Test

Consider verifying whether graph with edges $\{(1, 2), (2, 3), (3, 4), (4, 1), (2, 4)\}$ is bipartite.

```typescript
export function isBipartite(n: number, adj: number[][]): boolean {
  const color = new Array(n + 1).fill(0); // 0 = unvisited, 1 = Red, -1 = Blue

  for (let start = 1; start <= n; start++) {
    if (color[start] !== 0) continue;

    const queue: number[] = [start];
    color[start] = 1;

    while (queue.length > 0) {
      const u = queue.shift()!;
      for (const v of adj[u]) {
        if (color[v] === 0) {
          color[v] = -color[u]; // Invert color for neighbor
          queue.push(v);
        } else if (color[v] === color[u]) {
          return false; // Odd cycle detected!
        }
      }
    }
  }

  return true;
}
```

### Execution Trace Table

| Step | Queue State | Active Vertex $u$ | Neighbor $v$ | Current Color of $v$ | Invariant Check | Action Taken |
| :---: | :---: | :---: | :---: | :---: | :--- | :--- |
| **1** | `[1]` | $1$ (`Color: Red`) | $2$ | `0` (Unvisited) | Uncolored | Set $\text{color}[2] = \text{Blue}$. Enqueue $2$. |
| **2** | `[1]` | $1$ (`Color: Red`) | $4$ | `0` (Unvisited) | Uncolored | Set $\text{color}[4] = \text{Blue}$. Enqueue $4$. |
| **3** | `[2, 4]` | $2$ (`Color: Blue`) | $3$ | `0` (Unvisited) | Uncolored | Set $\text{color}[3] = \text{Red}$. Enqueue $3$. |
| **4** | `[4, 3]` | $2$ (`Color: Blue`) | $4$ | `-1` (`Blue`) | **$\text{color}[4] == \text{color}[2]$** | **Color conflict!** Both endpoints of edge $(2, 4)$ are Blue! |
| **Result** | — | — | — | — | **Odd-length 3-cycle detected: $(1, 2, 4)$**. Graph is **NOT Bipartite**. | Return `false`. |

---

## 8. Special Graph Classes & Topologies

| Graph Class | Mathematical Invariants | Edge Density | Primary Application / Real-World Role |
| :--- | :--- | :---: | :--- |
| **Complete Graph ($K_n$)** | Every pair of vertices is linked: $|E| = \frac{n(n-1)}{2}$. | Dense ($\Theta(n^2)$) | Worst-case benchmarking, clique detection |
| **Complete Bipartite ($K_{m,n}$)** | Every vertex in $V_1$ links to all in $V_2$: $|E| = m \cdot n$. | Medium | Two-sided matching, recommender systems |
| **Planar Graph** | Can be drawn on 2D plane with zero edge crossings: $V - E + F = 2$. | **Strictly Sparse**: $|E| \le 3V - 6$ | Printed circuit board (PCB) layout, road maps |
| **Eulerian Graph** | Connected and every vertex has even degree. | Arbitrary | DNA sequencing (de Bruijn graphs), street sweeping |
| **Hamiltonian Graph** | Contains a cycle visiting every *vertex* once. | Arbitrary | Traveling Salesperson Problem (NP-Complete) |

---

## 9. Common Traps, Edge Cases & Implementation Pitfalls

1. **Self-Loops and Handshaking**:
   - A self-loop $(u, u)$ in an undirected graph contributes **$+2$** to $\deg(u)$, as both endpoints attach to the same vertex. Neglecting this invalidates the Handshaking Lemma.
2. **Disconnected Components in Traversal**:
   - Graph algorithms (BFS, DFS, Bipartiteness) must loop through all vertices $1 \dots V$ as potential search roots. Running BFS from a single vertex will fail to visit disconnected components.
3. **Eulerian Path vs. Eulerian Circuit**:
   - An Eulerian *Circuit* requires **all** vertices to have even degrees. An Eulerian *Path* requires **exactly two** vertices to have odd degrees (start and finish).

---

## 10. References & Academic Attribution

1. **Euler, L.** (1736). Solutio problematis ad geometriam situs pertinentis. *Commentarii Academiae Scientiarum Petropolitanae*, 8, 128–140.
2. **Kőnig, D.** (1936). *Theorie der endlichen und unendlichen Graphen*. Akademische Verlagsgesellschaft.
3. **Kuratowski, K.** (1930). Sur le problème des courbes gauches en topologie. *Fundamenta Mathematicae*, 15(1), 271–283.
4. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 20. MIT Press.
