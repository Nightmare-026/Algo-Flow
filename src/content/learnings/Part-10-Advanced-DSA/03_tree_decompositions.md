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

| Edge Classification | Criterion                          | Subtree Size Condition | Transition Cost  |
| :------------------ | :--------------------------------- | :--------------------- | :--------------- |
| **Heavy Edge**      | Maximum child subtree: $\arg\max_v | T_v                    | $                | $               | T_{\text{child}} | > \frac{1}{2} | T_u                                                | $ (at most one per node) | Traversed along contiguous segment tree array block |
| **Light Edge**      | Any non-heavy child                | $                      | T_{\text{child}} | \le \frac{1}{2} | T_u              | $             | Requires jumping across chains via parent pointers |

---

### 3. The Fundamental HLD Theorem

$$\mathbf{Theorem}: \quad \text{On any simple path from the root to any node } u, \text{ there are at most } \mathbf{\lfloor \log_2 n \rfloor} \text{ Light Edges.}$$

**Proof**:  
By definition, crossing a light edge $(u, v)$ implies $|T_v| \le \frac{1}{2}|T_u|$. If $|T_v| > \frac{1}{2}|T_u|$, then $v$ would possess more than half the total descendants of $u$, making it impossible for any sibling to exceed it, forcing $v$ to be the heavy child.  
Since the subtree size strictly halves upon traversing every light edge, one can cross at most $\lfloor \log_2 n \rfloor$ light edges before the subtree size reduces to 1. $\blacksquare$

<div class="my-6 p-4 bg-surface rounded-xl border border-border overflow-x-auto">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 310" width="100%" height="310" class="mx-auto block font-sans">
  <defs>
    <marker id="hld-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/></marker>
    <linearGradient id="chain-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/><stop offset="100%" stop-color="#10b981" stop-opacity="0.05"/></linearGradient>
  </defs>
  <text x="410" y="22" text-anchor="middle" font-size="15" font-weight="bold" fill="currentColor">Heavy-Light Decomposition: Tree-to-Chain Linearization &amp; Segment Tree Mapping</text>
  <rect x="20" y="45" width="375" height="250" rx="8" fill="none" stroke="#64748b" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="207" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#10b981">1. Tree Edge Partitioning</text>
  <g transform="translate(60, 85)">
    <line x1="140" y1="20" x2="70" y2="80" stroke="#10b981" stroke-width="4.5"/>
    <line x1="140" y1="20" x2="210" y2="80" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="70" y1="80" x2="40" y2="140" stroke="#10b981" stroke-width="4.5"/>
    <line x1="70" y1="80" x2="100" y2="140" stroke="#64748b" stroke-width="1.5" stroke-dasharray="4,3"/>
    <line x1="210" y1="80" x2="210" y2="140" stroke="#0284c7" stroke-width="4"/>
    <circle cx="140" cy="20" r="16" fill="#1e293b" stroke="#10b981" stroke-width="2.5"/><text x="140" y="25" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">0</text>
    <circle cx="70" cy="80" r="15" fill="#1e293b" stroke="#10b981" stroke-width="2.5"/><text x="70" y="85" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">1</text>
    <circle cx="210" cy="80" r="15" fill="#1e293b" stroke="#0284c7" stroke-width="2"/><text x="210" y="85" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">2</text>
    <circle cx="40" cy="140" r="13" fill="#1e293b" stroke="#10b981" stroke-width="2.5"/><text x="40" y="144" text-anchor="middle" font-size="10" font-weight="bold" fill="#ffffff">3</text>
    <circle cx="100" cy="140" r="13" fill="#1e293b" stroke="#64748b" stroke-width="1.5"/><text x="100" y="144" text-anchor="middle" font-size="10" font-weight="bold" fill="#94a3b8">4</text>
    <circle cx="210" cy="140" r="13" fill="#1e293b" stroke="#0284c7" stroke-width="2"/><text x="210" y="144" text-anchor="middle" font-size="10" font-weight="bold" fill="#ffffff">5</text>
  </g>
  <text x="207" y="260" text-anchor="middle" font-size="10.5" fill="currentColor">&#x2501; Heavy Edge (Thick) | &#x2504; Light Edge (Dashed)</text>
  <text x="207" y="280" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#10b981">Any root-to-leaf path crosses &#x2264; &#x230A;log&#x2082; n&#x230B; light edges</text>
  <rect x="415" y="45" width="385" height="250" rx="8" fill="none" stroke="#64748b" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="607" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#0284c7">2. Flat Contiguous Segment Tree Layout</text>
  <g transform="translate(440, 95)">
    <text x="0" y="15" font-size="10.5" font-weight="bold" fill="#10b981">Chain A (Nodes 0 &#x2192; 1 &#x2192; 3): Contiguous Slice [0 : 2]</text>
    <rect x="0" y="25" width="55" height="34" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="2" rx="4"/><text x="27" y="46" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">pos 0 (0)</text>
    <rect x="58" y="25" width="55" height="34" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="2" rx="4"/><text x="85" y="46" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">pos 1 (1)</text>
    <rect x="116" y="25" width="55" height="34" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="2" rx="4"/><text x="143" y="46" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">pos 2 (3)</text>
    <text x="0" y="80" font-size="10.5" font-weight="bold" fill="#0284c7">Chain B (Nodes 2 &#x2192; 5): Contiguous Slice [3 : 4]</text>
    <rect x="0" y="90" width="55" height="34" fill="#0284c7" fill-opacity="0.25" stroke="#0284c7" stroke-width="2" rx="4"/><text x="27" y="111" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">pos 3 (2)</text>
    <rect x="58" y="90" width="55" height="34" fill="#0284c7" fill-opacity="0.25" stroke="#0284c7" stroke-width="2" rx="4"/><text x="85" y="111" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">pos 4 (5)</text>
  </g>
  <text x="607" y="260" text-anchor="middle" font-size="10.5" fill="currentColor">Tree Path query &#x2192; &#x2264; log n Range Queries on Segment Tree</text>
  <text x="607" y="280" text-anchor="middle" font-size="11" font-weight="bold" fill="#0284c7">Total Query Time: O(log&#178; n)</text>
</svg>
</div>

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
  public queryPath(u: number, v: number, segmentQuery: (l: number, r: number) => number): number {
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

| Operation             | Semantics                                                                | Amortized Time Complexity |
| :-------------------- | :----------------------------------------------------------------------- | :-----------------------: |
| **`Link(u, v)`**      | Adds a directed edge making $u$ a child of $v$                           |   $\mathcal{O}(\log n)$   |
| **`Cut(u)`**          | Severs the edge connecting $u$ to its parent                             |   $\mathcal{O}(\log n)$   |
| **`FindRoot(u)`**     | Identifies the root of the tree containing $u$                           |   $\mathcal{O}(\log n)$   |
| **`PathQuery(u, v)`** | Aggregates edge/vertex weights along the simple path between $u$ and $v$ |   $\mathcal{O}(\log n)$   |

### Splay-Backed Preferred Path Decomposition

Unlike HLD where heavy edges remain statically fixed based on initial tree structure, a Link-Cut Tree utilizes **Preferred Edges** that mutate dynamically:

- Whenever a node $u$ is accessed via `access(u)`, the path from the root of $u$'s tree to $u$ becomes the single active preferred path.
- Each preferred path is stored in an auxiliary **Splay Tree** ordered by vertex depth.
- The `access(u)` primitive splays nodes across auxiliary tree boundaries, ensuring that all subsequent structural operations execute in amortized $\mathcal{O}(\log n)$ time.

---

## 5. Summary & Comparison of Advanced Tree Techniques

| Technique                     | Dynamic Edits Supported? |                Path Aggregates                |         Subtree Aggregates         | Implementation Complexity |
| :---------------------------- | :----------------------: | :-------------------------------------------: | :--------------------------------: | :-----------------------: |
| **Euler Tour**                |     No (Static tree)     |               $\mathcal{O}(n)$                |   $\mathbf{\mathcal{O}(\log n)}$   |            Low            |
| **Binary Lifting (LCA)**      |     No (Static tree)     |             $\mathcal{O}(\log n)$             |           Not supported            |            Low            |
| **Heavy-Light Decomposition** |    Vertex values only    |       $\mathbf{\mathcal{O}(\log^2 n)}$        |   $\mathbf{\mathcal{O}(\log n)}$   |         Moderate          |
| **Centroid Decomposition**    |     No (Static tree)     | All-pairs distance in $\mathcal{O}(n \log n)$ |           Not supported            |         Moderate          |
| **Link-Cut Tree**             | **Yes (`Link` & `Cut`)** |        $\mathbf{\mathcal{O}(\log n)}$         | Complex (Requires auxiliary trees) |           High            |

---

## References & Academic Attribution

1. **Sleator, D. D., & Tarjan, R. E.** (1983). A data structure for dynamic trees. _Journal of Computer and System Sciences_, 26(3), 362–391.
2. **Tarjan, R. E.** (1979). Applications of path compression on balanced trees. _Journal of the ACM (JACM)_, 26(4), 690–715.
3. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). _Introduction to Algorithms_ (4th ed.). MIT Press.
