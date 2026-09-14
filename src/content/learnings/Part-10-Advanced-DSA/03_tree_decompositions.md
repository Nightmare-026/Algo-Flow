# Part 10: Advanced DSA — Module 03: Tree Decompositions & Dynamic Trees (HLD, Centroid & Link-Cut Trees)

Complex tree queries and dynamic forest topology mutations require advanced structural partitioning beyond standard depth-first traversals. By decomposing trees into vertex-disjoint heavy paths, recursive centroid hierarchies, or splay-backed preferred paths, algorithms execute path aggregations, dynamic connectivity updates, and distance divide-and-conquer in poly-logarithmic time.

---

## 1. Executive Summary & Learning Objectives

This module introduces advanced structural decompositions for tree-structured data, bridging static tree algorithms and dynamic geometric graphs.

By the end of this chapter, you will be able to:
1. **Decompose Trees via HLD**: Partition general tree topologies into vertex-disjoint Heavy Paths such that any simple path crosses at most $\lfloor \log_2 n \rfloor$ Light Edges.
2. **Linearize Path Queries onto Segment Trees**: Coordinate heavy-path head jumps with segment tree interval queries to achieve $\mathcal{O}(\log^2 n)$ path sum/max operations.
3. **Execute Centroid Divide-and-Conquer**: Recursively isolate balance centroids to construct a $\mathcal{O}(\log n)$-depth centroid tree, evaluating all tree paths in $\mathcal{O}(n \log n)$ total time.
4. **Maintain Dynamic Forests via Link-Cut Trees**: Utilize splay-backed preferred path decompositions to execute `Link`, `Cut`, and path aggregate queries in amortized $\mathcal{O}(\log n)$ time.

---

## 2. Topic 154b & 154c: Heavy-Light Decomposition (HLD)

### 1. Conceptual Motivation
Given a tree with $n$ nodes subject to dynamic vertex updates, standard algorithms face severe trade-offs:
- Naive DFS path scans require $\mathcal{O}(n)$ time per query.
- Flattening via Euler Tour handles subtree updates in $\mathcal{O}(\log n)$, but cannot efficiently handle arbitrary path queries between arbitrary nodes $u$ and $v$.

**Heavy-Light Decomposition (HLD)** addresses this by decomposing the tree into **vertex-disjoint chains (Heavy Paths)** such that any path from the root to an arbitrary node passes through at most $\mathcal{O}(\log n)$ distinct light edges.

---

### 2. Heavy vs. Light Edge Classification
For every internal node $u$:
1. Compute subtree sizes $\text{size}(v)$ for each child $v$ of $u$.
2. The child with the **strictly largest subtree** is designated the **Heavy Child** (breaking ties arbitrarily).
3. The directed edge $(u, \text{heavyChild})$ is a **Heavy Edge**.
4. All other edges emanating from $u$ to remaining children are **Light Edges**.

| Edge Classification | Criterion | Subtree Size Condition | Transition Cost |
| :--- | :--- | :--- | :--- |
| **Heavy Edge** | Maximum child subtree: $\arg\max_v |T_v|$ | $|T_{\text{child}}| > \frac{1}{2}|T_u|$ (at most one per node) | Traversed along contiguous segment tree array block |
| **Light Edge** | Any non-heavy child | $|T_{\text{child}}| \le \frac{1}{2}|T_u|$ | Requires jumping across chains via parent pointers |

---

### 3. The Fundamental HLD Theorem
$$\mathbf{Theorem}: \quad \text{On any simple path from the root to any node } u, \text{ there are at most } \mathbf{\lfloor \log_2 n \rfloor} \text{ Light Edges.}$$

**Proof**:  
By definition, crossing a light edge $(u, v)$ implies $|T_v| \le \frac{1}{2}|T_u|$. If $|T_v| > \frac{1}{2}|T_u|$, then $v$ would possess more than half the total descendants of $u$, making it impossible for any sibling to exceed it, forcing $v$ to be the heavy child.  
Since the subtree size strictly halves upon traversing every light edge, one can cross at most $\lfloor \log_2 n \rfloor$ light edges before the subtree size reduces to 1. $\blacksquare$

---

### 4. Implementation: Heavy-Light Decomposition Path Queries

```typescript
export class HeavyLightDecomposition {
  private n: number;
  private adj: number[][];
  private parent: number[];
  private depth: number[];
  private heavy: number[];
  private head: number[];
  private pos: number[];
  private curPos: number = 0;

  constructor(n: number, adj: number[][], root: number = 0) {
    this.n = n;
    this.adj = adj;
    this.parent = new Array(n).fill(-1);
    this.depth = new Array(n).fill(0);
    this.heavy = new Array(n).fill(-1);
    this.head = new Array(n).fill(0);
    this.pos = new Array(n).fill(0);

    this.dfsSize(root, -1, 0);
    this.decompose(root, root);
  }

  // Pass 1: Compute subtree sizes, depths, and identify heavy edges
  private dfsSize(u: number, p: number, d: number): number {
    this.parent[u] = p;
    this.depth[u] = d;
    let size = 1;
    let maxChildSize = 0;

    for (const v of this.adj[u]) {
      if (v !== p) {
        const childSize = this.dfsSize(v, u, d + 1);
        size += childSize;
        if (childSize > maxChildSize) {
          maxChildSize = childSize;
          this.heavy[u] = v; // Heavy child
        }
      }
    }
    return size;
  }

  // Pass 2: Assign contiguous positions to nodes on the same heavy chain
  private decompose(u: number, h: number): void {
    this.head[u] = h;
    this.pos[u] = this.curPos++;

    // Continue the heavy chain first to ensure contiguous array indices
    if (this.heavy[u] !== -1) {
      this.decompose(this.heavy[u], h);
    }

    // Decompose light child subtrees as new chain heads
    for (const v of this.adj[u]) {
      if (v !== this.parent[u] && v !== this.heavy[u]) {
        this.decompose(v, v);
      }
    }
  }

  /**
   * Decomposes the path between u and v into at most O(log n) contiguous segments.
   */
  public queryPath(
    u: number,
    v: number,
    segmentQuery: (l: number, r: number) => number
  ): number {
    let result = 0;

    while (this.head[u] !== this.head[v]) {
      if (this.depth[this.head[u]] < this.depth[this.head[v]]) {
        [u, v] = [v, u];
      }
      // Query contiguous segment on u's heavy chain
      result += segmentQuery(this.pos[this.head[u]], this.pos[u]);
      u = this.parent[this.head[u]]; // Jump across light edge
    }

    // u and v are now on the same heavy chain
    if (this.depth[u] > this.depth[v]) {
      [u, v] = [v, u];
    }
    result += segmentQuery(this.pos[u], this.pos[v]);

    return result;
  }
}
```

---

## 3. Topic 154d: Centroid Decomposition

### 1. Definition of a Tree Centroid
A **Centroid** of an unrooted tree $T = (V, E)$ with $|V| = n$ is a vertex $C$ whose removal partitions the tree into a forest where every resulting connected component has size at most $\lfloor n / 2 \rfloor$:

$$\forall \text{ resulting component } T_i, \quad |T_i| \le \frac{n}{2}$$

**Existence Theorem**: Every finite tree possesses at least one and at most two centroids. A centroid can be located in $\mathcal{O}(n)$ time via a single depth-first search:

```typescript
export function findCentroid(
  u: number,
  parent: number,
  totalSize: number,
  adj: number[][],
  subtreeSize: number[],
  isRemoved: boolean[]
): number {
  for (const v of adj[u]) {
    if (v !== parent && !isRemoved[v]) {
      if (subtreeSize[v] > totalSize / 2) {
        return findCentroid(v, u, totalSize, adj, subtreeSize, isRemoved);
      }
    }
  }
  return u; // u is the centroid
}
```

---

### 2. Centroid Divide-and-Conquer Architecture
1. Locate the centroid $C$ of the current component.
2. Evaluate all paths traversing through $C$ (combining information across distinct subtrees).
3. Mark $C$ as removed (`isRemoved[C] = true`).
4. Recursively decompose each disconnected remaining subtree.
5. Connecting each child centroid to its parent centroid constructs the **Centroid Tree**.

- **Height Invariant**: Because component sizes reduce by at least a factor of 2 at each recursive level, the depth of the centroid tree is bounded by $\lfloor \log_2 n \rfloor$.
- **Complexity**: Overall divide-and-conquer processing executes in $\mathbf{\mathcal{O}(n \log n)}$ time.

---

## 4. Topic 154e: Link-Cut Trees (Dynamic Forest Algorithms)

Developed by Daniel Sleator and Robert Tarjan in 1983, the **Link-Cut Tree (LCT)** maintains a collection of disjoint rooted trees subject to online structural modifications:

| Operation | Semantics | Amortized Time Complexity |
| :--- | :--- | :---: |
| **`Link(u, v)`** | Adds a directed edge making $u$ a child of $v$ | $\mathcal{O}(\log n)$ |
| **`Cut(u)`** | Severs the edge connecting $u$ to its parent | $\mathcal{O}(\log n)$ |
| **`FindRoot(u)`**| Identifies the root of the tree containing $u$ | $\mathcal{O}(\log n)$ |
| **`PathQuery(u, v)`** | Aggregates edge/vertex weights along the simple path between $u$ and $v$ | $\mathcal{O}(\log n)$ |

### Splay-Backed Preferred Path Decomposition
Unlike HLD where heavy edges remain statically fixed based on initial tree structure, a Link-Cut Tree utilizes **Preferred Edges** that mutate dynamically:
- Whenever a node $u$ is accessed via `access(u)`, the path from the root of $u$'s tree to $u$ becomes the single active preferred path.
- Each preferred path is stored in an auxiliary **Splay Tree** ordered by vertex depth.
- The `access(u)` primitive splays nodes across auxiliary tree boundaries, ensuring that all subsequent structural operations execute in amortized $\mathcal{O}(\log n)$ time.

---

## 5. Summary & Comparison of Advanced Tree Techniques

| Technique | Dynamic Edits Supported? | Path Aggregates | Subtree Aggregates | Implementation Complexity |
| :--- | :---: | :---: | :---: | :---: |
| **Euler Tour** | No (Static tree) | $\mathcal{O}(n)$ | $\mathbf{\mathcal{O}(\log n)}$ | Low |
| **Binary Lifting (LCA)** | No (Static tree) | $\mathcal{O}(\log n)$ | Not supported | Low |
| **Heavy-Light Decomposition**| Vertex values only | $\mathbf{\mathcal{O}(\log^2 n)}$ | $\mathbf{\mathcal{O}(\log n)}$ | Moderate |
| **Centroid Decomposition** | No (Static tree) | All-pairs distance in $\mathcal{O}(n \log n)$ | Not supported | Moderate |
| **Link-Cut Tree** | **Yes (`Link` & `Cut`)** | $\mathbf{\mathcal{O}(\log n)}$ | Complex (Requires auxiliary trees) | High |

---

## References & Academic Attribution

1. **Sleator, D. D., & Tarjan, R. E.** (1983). A data structure for dynamic trees. *Journal of Computer and System Sciences*, 26(3), 362–391.
2. **Tarjan, R. E.** (1979). Applications of path compression on balanced trees. *Journal of the ACM (JACM)*, 26(4), 690–715.
3. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.). MIT Press.
