# Part 10: Advanced DSA — Module 03: Tree Decompositions & Dynamic Trees (HLD, Centroid & Link-Cut Trees)

> **Topics Covered:**  
> 154b. Heavy-Light Decomposition (HLD & $O(\log^2 n)$ Path Queries) &bull; 154c. Segment Tree Mapping on Heavy Paths &bull; 154d. Centroid Decomposition ($O(n \log n)$ Tree Divide-and-Conquer) &bull; 154e. Link-Cut Trees (Sleator-Tarjan Dynamic Forests & Splay-Backed Preferred Paths)

---

# TOPIC 154b & 154c: HEAVY-LIGHT DECOMPOSITION (HLD)

### 1. Conceptual Motivation
Given a tree with $N$ nodes where node values change dynamically:
- How do we find the maximum value (or sum) along the simple path between any two nodes $u$ and $v$ in $O(\log^2 N)$ time?
- How do we update all nodes along the path between $u$ and $v$ in $O(\log^2 N)$ time?
- How do we query or update an entire subtree in $O(\log N)$ time?

**Heavy-Light Decomposition (HLD)** decomposes an arbitrary tree into a set of **vertex-disjoint paths** (called Heavy Paths) such that any simple path from the root to any node crosses at most **$O(\log N)$ distinct paths**!

---

### 2. Heavy vs Light Edges

For every node $u$:
1. Calculate the subtree size $\text{size}(v)$ for all children $v$ of $u$.
2. The child with the **strictly largest subtree** is designated the **Heavy Child** (breaking ties arbitrarily).
3. The edge $(u, \text{heavyChild})$ is a **Heavy Edge**.
4. All other edges connecting $u$ to its other children are **Light Edges**.

```text
VISUALIZING HEAVY AND LIGHT EDGES:
                     [ A (size=9) ]
                    //            \
        (Heavy)    //              \ (Light)
                  ▼                 ▼
          [ B (size=6) ]       [ C (size=2) ]
          //          \
(Heavy)  //            \ (Light)
        ▼               ▼
   [ D (size=4) ]    [ E (size=1) ]
```

---

### 3. The Fundamental HLD Theorem
$$\mathbf{Theorem}: \quad \text{On any simple path from the root to any leaf, there are at most } \mathbf{\lfloor \log_2 N \rfloor} \text{ Light Edges!}$$

**Proof**:  
Whenever you cross a Light Edge $(u, v)$, the subtree size of $v$ must be strictly less than half the subtree size of $u$ ($\text{size}(v) \le \frac{1}{2}\text{size}(u)$). Otherwise, $v$ would have been chosen as the Heavy Child!  
Because the subtree size halves at every light edge, one can cross at most $\log_2 N$ light edges before the subtree size reduces to 1. $\blacksquare$

---

### 4. Linearization onto a Segment Tree
We perform a DFS to assign flat array indices to tree nodes such that **all nodes on any Heavy Path occupy a contiguous subarray interval**!
- Furthermore, all nodes in any subtree also occupy a contiguous interval $[in[u], out[u]]$!
- A path between arbitrary nodes $u$ and $v$ is decomposed into at most $O(\log N)$ heavy path segments.
- Querying or updating each segment takes $O(\log N)$ in a standard Segment Tree.
- Total query/update time along any path: **$O(\log^2 N)$**!

```text
ALGORITHM QueryPath(u, v):
1.  ans ← 0
2.  while head[u] ≠ head[v]:
3.      // Ensure u is deeper in the tree
4.      if depth[head[u]] < depth[head[v]]:
5.          Swap(u, v)
6.      // Query the segment of u's heavy path
7.      ans ← ans + SegmentTreeQuery(pos[head[u]], pos[u])
8.      u ← parent[head[u]] // Jump across the light edge!
9.  // Now u and v are on the exact same heavy path
10. if depth[u] > depth[v]: Swap(u, v)
11. ans ← ans + SegmentTreeQuery(pos[u], pos[v])
12. return ans
```

---

# TOPIC 154d: CENTROID DECOMPOSITION

### 1. Definition of a Tree Centroid
A **Centroid** of a tree with $N$ vertices is a node $C$ whose removal breaks the tree into a forest of subtrees, each having **size at most $\lfloor N/2 \rfloor$**:
$$\forall \text{ resulting component } T', \quad |T'| \le \frac{N}{2}$$

**Existence Guarantee**: Every tree has at least one and at most two centroids. A centroid can be found in $O(N)$ time via simple DFS:

```text
ALGORITHM FindCentroid(u, parent, totalN):
1.  for each neighbor v of u:
2.      if v ≠ parent and not isRemoved[v]:
3.          if subtreeSize[v] > totalN / 2:
4.              return FindCentroid(v, u, totalN)
5.  return u // Found centroid!
```

---

### 2. Centroid Tree Architecture & $O(N \log N)$ Divide-and-Conquer
1. Find the centroid $C$ of tree $T$.
2. Solve the problem for all paths passing through $C$.
3. Mark $C$ as removed (`isRemoved[C] = true`).
4. Recursively decompose the disconnected subtrees.
5. Link $C$ as the parent of the centroids of each subtree to construct the **Centroid Tree**.

```text
CENTROID RECURSION TREE:
                        [ Centroid C1 ]   (Depth 0)
                      /        │        \
             [ Centroid C2 ] [ C3 ]   [ C4 ] (Depth 1, size ≤ N/2)
               /       \
            [ C5 ]   [ C6 ]                  (Depth 2, size ≤ N/4)
```

- **Height Invariant**: Because subtree sizes halve at every level, the height of the Centroid Tree is strictly **$\le \log_2 N$**!
- **Signature Application**: Counting paths of length $K$ in a tree, or finding the closest red node in dynamic tree coloring in **$O(N \log N)$** time.

---

# TOPIC 154e: LINK-CUT TREES (DYNAMIC FOREST ALGORITHMS)

Invented by Daniel Sleator and Robert Tarjan in 1983, a **Link-Cut Tree (LCT)** maintains a dynamic forest of rooted trees that change structure over time:
- **`Link(u, v)`**: Add an edge between $u$ and $v$ (in $O(\log n)$ amortized time).
- **`Cut(u, v)`**: Remove the edge between $u$ and $v$ (in $O(\log n)$ amortized time).
- **`PathQuery(u, v)`**: Compute path sum/min/max between $u$ and $v$ in $O(\log n)$ amortized time.

### Splay-Backed Preferred Path Decomposition
Unlike HLD where heavy edges are fixed statically, a Link-Cut Tree uses **Preferred Edges** that change dynamically based on query access:
- When a node $u$ is accessed, its outgoing edge becomes preferred, severing previous preferences.
- Each contiguous preferred path is represented internally as a **Splay Tree** keyed by node depth!
- The single core primitive `Access(u)` splays the entire path from the root of the forest to $u$, making it a single unified preferred path in **amortized $O(\log n)$ time**!

---

## Module 03 Summary & Key Takeaways

1. **Heavy-Light Decomposition (HLD)** partitions trees into heavy paths; any root-to-node path crosses at most $\log_2 N$ light edges, enabling $O(\log^2 N)$ path queries via Segment Trees.
2. **Centroid Decomposition** provides $O(N \log N)$ divide-and-conquer on trees by recursively finding vertices whose removal cuts subtrees to $\le N/2$.
3. **Link-Cut Trees** handle dynamic structural edits (`Link` and `Cut`) in amortized $O(\log N)$ time by modeling preferred paths as auxiliary Splay trees.

---

## References & Academic Attribution

1. **Fenwick, P. M.** (1994). A new data structure for cumulative frequency tables. *Software: Practice and Experience*, 24(3), 327–336.
2. **Sleator, D. D., & Tarjan, R. E.** (1983). A data structure for dynamic trees. *Journal of Computer and System Sciences*, 26(3), 362–391.
3. **Tarjan, R. E.** (1979). Applications of path compression on balanced trees. *Journal of the ACM (JACM)*, 26(4), 690–715.
