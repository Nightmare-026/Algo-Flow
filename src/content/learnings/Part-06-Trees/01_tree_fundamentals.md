# Part 06: Trees — Module 01: Tree Fundamentals & Binary Tree Varieties

> **Topics Covered:**  
> 63. Tree Terminology & Anatomy &bull; 64. Fundamental Mathematical Tree Theorems &bull; 65. Structural Classification of Trees &bull; 66. Binary Tree Anatomy &bull; 67. Complete Binary Tree &bull; 68. Full (Strict) Binary Tree &bull; 69. Perfect Binary Tree &bull; 70. Balanced Trees &bull; 71. Degenerate (Skewed) Tree

---

Trees represent computing's primary hierarchical abstraction, modeling nested relationships, recursive sub-problems, and logarithmic search boundaries across memory and storage systems. Unlike linear structures (arrays and linked lists) that enforce a single predecessor and successor, trees organize data through parent-child hierarchies that balance storage flexibility with efficient multi-way branching. Understanding tree topology, topological invariants, node degrees, and structural tree varieties forms the prerequisite for mastering self-balancing search trees, spatial indices, and heap architectures.

### Learning Objectives
- Formulate the graph-theoretic definition of a rooted tree and verify the edge-vertex invariant $|E| = |V| - 1$.
- Distinguish between node depth, node height, subtree height, and tree diameter across hierarchical structures.
- Prove the Full Binary Tree theorem relating leaf count to internal node count ($L = I + 1$).
- Differentiate the 5 canonical binary tree varieties: Full, Complete, Perfect, Balanced, and Degenerate (Skewed).
- Implement zero-pointer array mapping for Complete Binary Trees via arithmetic child/parent indexing ($2i+1, 2i+2, \lfloor (i-1)/2 \rfloor$).

---

## Topic 63: Tree Terminology & Anatomy

### 1. Graph-Theoretic Formalism

Formally, a **Tree** $T = (V, E)$ is an undirected, connected, acyclic graph. When directed away from a distinguished origin, it is called a **Rooted Directed Tree**, defined by three invariant properties:
1. **Unique Root:** There exists exactly one node $r \in V$ with in-degree $\text{deg}^-(r) = 0$.
2. **Single Predecessor:** Every other node $u \in V \setminus \{r\}$ has an in-degree of strictly $\text{deg}^-(u) = 1$ (exactly one parent).
3. **Acyclic Connectivity:** For every node $u \in V$, there exists a unique simple directed path from root $r$ to $u$.

---

### 2. Comprehensive Anatomy of a Sample Tree

Consider a hierarchical tree $T$ containing 9 nodes with root $A$:
- $A$ connects to children $B$ and $C$.
- $B$ connects to children $D$ and $E$.
- $C$ connects to child $F$.
- $E$ connects to children $G$ and $H$.
- $F$ connects to child $I$.

The table below catalogs every node's topological measurements and anatomical classification:

| Node | Parent | Children | In-Degree ($\text{deg}^-$) | Out-Degree ($\text{deg}^+$) | Depth from Root | Height to Leaf | Topological Role |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **`A`** | None ($\emptyset$) | $\{B, C\}$ | `0` | `2` | `0` | `3` | **Root Node** ($\text{deg}^- = 0$) |
| **`B`** | $A$ | $\{D, E\}$ | `1` | `2` | `1` | `2` | Internal Node (Ancestor of $D, E, G, H$) |
| **`C`** | $A$ | $\{F\}$ | `1` | `1` | `1` | `2` | Internal Node (Sibling of $B$) |
| **`D`** | $B$ | $\emptyset$ | `1` | `0` | `2` | `0` | **Leaf Node** ($\text{deg}^+ = 0$) |
| **`E`** | $B$ | $\{G, H\}$ | `1` | `2` | `2` | `1` | Internal Node |
| **`F`** | $C$ | $\{I\}$ | `1` | `1` | `2` | `1` | Internal Node |
| **`G`** | $E$ | $\emptyset$ | `1` | `0` | `3` | `0` | **Leaf Node** (Terminal) |
| **`H`** | $E$ | $\emptyset$ | `1` | `0` | `3` | `0` | **Leaf Node** (Terminal, Sibling of $G$) |
| **`I`** | $F$ | $\emptyset$ | `1` | `0` | `3` | `0` | **Leaf Node** (Terminal) |

---

### 3. Metric Definitions & Path Semantics

- **Depth of Node $u$ ($\text{depth}(u)$):** The number of edges on the unique path from root $r$ down to node $u$. By definition, $\text{depth}(\text{root}) = 0$.
- **Height of Node $u$ ($\text{height}(u)$):** The number of edges on the longest simple downward path from node $u$ to any leaf in its subtree. For all leaves, $\text{height}(\text{leaf}) = 0$.
- **Height of Tree $T$ ($\text{height}(T)$):** The height of the root node: $\text{height}(T) = \text{height}(r) = \max_{u \in V} \text{depth}(u)$. For the tree above, $\text{height}(T) = 3$.
- **Degree of Node $u$ ($\text{deg}(u)$):** In rooted trees, this refers to the out-degree (the number of children attached to $u$).
- **Degree of Tree ($\text{degree}(T)$):** The maximum degree across all nodes: $\text{degree}(T) = \max_{u \in V} \text{deg}^+(u)$. For binary trees, $\text{degree}(T) \le 2$.
- **Subtree:** A tree consisting of a node $u$ and all of its descendants, retaining all connecting edges.

---

## Topic 64: Fundamental Mathematical Tree Theorems

### Theorem 1: The Edge-to-Vertex Invariant
For any connected tree $T = (V, E)$ containing $|V| = N$ nodes:
$$|E| = N - 1$$

#### Proof:
In any rooted tree, every node except the root has exactly one incoming edge connecting it to its parent. Because the root has zero incoming edges, the total number of edges equals the sum of in-degrees of all non-root nodes:
$$|E| = \sum_{u \in V} \text{deg}^-(u) = \text{deg}^-(r) + \sum_{u \in V \setminus \{r\}} 1 = 0 + (N - 1) = N - 1 \quad \blacksquare$$

---

### Theorem 2: Maximum Nodes at Level $i$
In any binary tree, level $i$ (where the root is defined as level $0$) contains at most:
$$N_{\text{level}}(i) \le 2^i \text{ nodes}$$

#### Proof (By Mathematical Induction):
- **Base Case ($i = 0$):** At level $0$, there is only the root node. $2^0 = 1$. The base case holds.
- **Inductive Step:** Assume level $k$ has at most $2^k$ nodes. Each node in a binary tree has at most $2$ children. Therefore, the number of nodes at level $k + 1$ is at most:
  $$N_{\text{level}}(k + 1) \le 2 \times N_{\text{level}}(k) \le 2 \times 2^k = 2^{k+1}$$
By induction, level $i$ contains at most $2^i$ nodes for all $i \ge 0$. $\blacksquare$

---

### Theorem 3: Maximum Nodes in a Binary Tree of Height $h$
A binary tree of height $h$ can contain at most:
$$N_{\max} = \sum_{i=0}^{h} 2^i = 2^{h+1} - 1 \text{ nodes}$$

Conversely, for a binary tree with $N$ nodes, its height is lower-bounded by:
$$h \ge \lceil \log_2(N + 1) \rceil - 1 = \Omega(\log N)$$

---

### Theorem 4: The Full Binary Tree Theorem ($L = I + 1$)
In any non-empty full (strict) binary tree where every node has either 0 or 2 children:
$$L = I + 1$$
where $L$ is the number of leaf nodes and $I$ is the number of internal nodes.

#### Proof:
1. Total nodes $N = L + I$.
2. Every internal node contributes exactly 2 outgoing edges, while leaves contribute 0 outgoing edges:
   $$|E| = 2I$$
3. By Theorem 1, $|E| = N - 1$:
   $$2I = N - 1 = (L + I) - 1$$
4. Subtracting $I$ from both sides:
   $$I = L - 1 \implies L = I + 1 \quad \blacksquare$$

---

## Topics 65–71: Binary Tree Varieties

A **Binary Tree** is a specialized tree in which every node has at most two children, designated as the **Left Child** and the **Right Child**. Binary trees are categorized into five distinct structural archetypes based on balance and level fullness.

### 1. Structural Comparison Matrix

| Binary Tree Variety | Structural Invariant | Height Bound $h(n)$ | Leaf Node Count $L$ | Pointerless Array Storage? | Primary Algorithmic Application |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Full (Strict) Binary Tree** | Every node has degree $\in \{0, 2\}$; never 1 child | $O(\log n)$ to $O(n)$ | $L = I + 1$ | No | Huffman coding trees, expression parsing |
| **Perfect Binary Tree** | All internal nodes have 2 children; all leaves at depth $h$ | $\log_2(n + 1) - 1$ | $L = 2^h = \frac{n+1}{2}$ | **Yes** ($n = 2^{h+1}-1$) | Complete parallel divide-and-conquer networks |
| **Complete Binary Tree** | All levels filled except last; last filled left-to-right | $\lfloor \log_2 n \rfloor$ | $\lceil n/2 \rceil$ | **Yes (Heap array)** | Binary Heaps, Priority Queues |
| **Balanced Binary Tree** | For all nodes, $|h_{\text{left}} - h_{\text{right}}| \le 1$ | $\le 1.44 \log_2 n$ | $\Theta(n)$ | No (Pointers needed) | AVL Trees, Red-Black Trees, Map/Set |
| **Degenerate (Skewed)** | Every internal node has exactly 1 child | $n - 1$ (worst-case) | $L = 1$ | No | Degenerate BST (linked list behavior) |

---

### 2. Complete Binary Tree: The Zero-Pointer Array Mapping

Complete Binary Trees possess an exceptional architectural property: they can be stored contiguously in a flat array without allocating any pointer variables (`left`, `right`, `parent`). The tree hierarchy is maintained entirely through **arithmetic index relationships**.

For an $n$-element Complete Binary Tree mapped into zero-based array $A[0 \dots n - 1]$ via level-order indexing:
- **Root Element:** Stored at index $0$.
- **Left Child of Node $i$:**
  $$\text{left}(i) = 2i + 1 \quad (\text{valid if } 2i + 1 < n)$$
- **Right Child of Node $i$:**
  $$\text{right}(i) = 2i + 2 \quad (\text{valid if } 2i + 2 < n)$$
- **Parent of Node $i$ ($i > 0$):**
  $$\text{parent}(i) = \left\lfloor \frac{i - 1}{2} \right\rfloor$$

#### Array Mapping Trace: 6-Node Complete Tree ($A = [A, B, C, D, E, F]$)

| Array Index ($i$) | Stored Value | Tree Level $\lfloor\log_2(i+1)\rfloor$ | Left Child Index ($2i + 1$) | Right Child Index ($2i + 2$) | Parent Index ($\lfloor(i-1)/2\rfloor$) | Node Topology Type |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **`0`** | `A` | Level 0 | $1$ (Value `B`) | $2$ (Value `C`) | None | **Root Node** |
| **`1`** | `B` | Level 1 | $3$ (Value `D`) | $4$ (Value `E`) | $0$ (Value `A`) | Internal Node |
| **`2`** | `C` | Level 1 | $5$ (Value `F`) | Out of bounds | $0$ (Value `A`) | Internal Node |
| **`3`** | `D` | Level 2 | Out of bounds | Out of bounds | $1$ (Value `B`) | Leaf Node |
| **`4`** | `E` | Level 2 | Out of bounds | Out of bounds | $1$ (Value `B`) | Leaf Node |
| **`5`** | `F` | Level 2 | Out of bounds | Out of bounds | $2$ (Value `C`) | Leaf Node |

> **Hardware & Cache Advantage:**  
> Because the tree nodes reside in contiguous memory, traversing parent-child relationships incurs zero pointer-dereference latency. Sequential memory reads maximize L1 CPU cache line utilization and eliminate the 16-to-24 byte per-node pointer overhead required by traditional dynamic tree node allocations.

---

## Module 01 Summary & Key Takeaways

1. **Topological Tree Invariant:** A tree of $N$ nodes contains strictly $N - 1$ edges and zero cycles. Every non-root node has an in-degree of exactly 1.
2. **Depth vs Height:** Node depth counts edges from the root down to the node; node height counts edges on the longest downward path from the node to a leaf. The tree height is the height of its root.
3. **Full Binary Tree Relation:** In any full binary tree (where each node has either 0 or 2 children), the number of leaves is always one greater than the number of internal nodes: $L = I + 1$.
4. **Complete Binary Tree Array Mapping:** Complete binary trees map into flat arrays with zero pointer overhead using arithmetic indexing ($2i + 1, 2i + 2, \lfloor (i - 1)/2 \rfloor$), forming the physical basis for binary heaps.
5. **The Cost of Imbalance:** A degenerate (skewed) binary tree has height $h = n - 1$, collapsing tree operations from logarithmic $O(\log n)$ to linear $O(n)$ linked list scans. Maintaining balance is essential for performance.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Appendix B.5: Trees & Chapter 12: Binary Search Trees. MIT Press.
2. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.3: Trees. Addison-Wesley.
3. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 3.2: Binary Search Trees. Addison-Wesley.

