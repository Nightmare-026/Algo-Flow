# Part 06: Trees — Module 10: Spatial & Specialized Trees (Kd-Trees, Quadtrees, Cartesian & Threaded Trees)

> Multidimensional spatial geometry, range query equivalence, and stackless traversals demand specialized tree topologies that transcend standard binary search. Kd-Trees and Quadtrees orthogonally partition multidimensional coordinate spaces for spatial indexing, Cartesian trees bridge Range Minimum Queries to Lowest Common Ancestors, and Threaded Trees repurpose leaf null pointers for stackless $O(1)$ traversals.

---

## 1. Executive Summary & Learning Objectives

Invented by Jon Bentley in 1975, the Kd-Tree partitions $k$-dimensional space via alternating axis-aligned hyperplanes, enabling nearest-neighbor and range searches. Quadtrees and Octrees generalize spatial subdivision into four or eight simultaneous quadrants. Cartesian trees (Jean Vuillemin, 1980) map 1D sequence arrays into heap-ordered trees via linear-time monotonic stacks, establishing the fundamental equivalence between Range Minimum Queries (RMQ) and Lowest Common Ancestors (LCA). Finally, Threaded Binary Trees (Perlis & Thornton, 1960) eliminate call stacks and extra memory during in-order traversal by weaving predecessor and successor pointers directly through leaf null references.

By the end of this chapter, you will be able to:

1. **Formulate** the alternating splitting axis invariant ($\text{depth} \bmod k$) of Kd-Trees and execute nearest neighbor queries with hyper-plane pruning.
2. **Deconstruct** Quadtree and Octree spatial decompositions and contrast their applications in spatial indexing, collision detection, and Barnes-Hut $N$-body simulations.
3. **Construct** a Cartesian tree in strictly $O(n)$ linear time using an increasing monotonic stack.
4. **Prove** the fundamental $\text{RMQ}_A(L, R) \iff \text{LCA}_{\text{Cartesian}}(L, R)$ equivalence theorem enabling $O(1)$ range queries.
5. **Implement** stackless in-order traversal over Threaded Binary Trees utilizing right-thread successor navigation.

---

## 2. Kd-Trees: $k$-Dimensional Orthogonal Partitioning

Standard binary search trees organize 1-dimensional keys along a total order. For multidimensional records (e.g., GPS coordinates $(x, y)$, 3D point clouds $(x, y, z)$, or vector embeddings), points cannot be totally ordered without loss of spatial proximity.

A **Kd-Tree** ($k$-dimensional tree) is a space-partitioning data structure that stores points in $k$-dimensional Euclidean space.

### The Alternating Splitting Axes Invariant

At depth $d$, the tree partitions space along coordinate axis:

$$\text{Axis} = d \bmod k$$

For 2D points $(x, y)$ where $k = 2$:

- **Level 0 (Root)**: Splits along the **$X$-axis** (vertical line through median point).
- **Level 1**: Splits along the **$Y$-axis** (horizontal line through median point).
- **Level 2**: Cycles back to split along the **$X$-axis**, and so forth.

### Sample 2D Kd-Tree Topological Mapping

Consider 2D points: $P = \{(5, 4), (2, 3), (8, 6), (1, 1), (4, 7), (9, 2)\}$:

| Node Point $(x, y)$ | Tree Depth |       Splitting Axis       | Splitting Criterion | Left Subtree Coordinate Region        | Right Subtree Coordinate Region |
| :-----------------: | :--------: | :------------------------: | :-----------------: | :------------------------------------ | :------------------------------ |
|    **$(5, 4)$**     | $0$ (Root) | $X$-axis ($d \bmod 2 = 0$) |       $x = 5$       | $x < 5$: $\{(2, 3), (1, 1), (4, 7)\}$ | $x > 5$: $\{(8, 6), (9, 2)\}$   |
|    **$(2, 3)$**     |    $1$     | $Y$-axis ($d \bmod 2 = 1$) |       $y = 3$       | $y < 3$: $\{(1, 1)\}$                 | $y > 3$: $\{(4, 7)\}$           |
|    **$(8, 6)$**     |    $1$     | $Y$-axis ($d \bmod 2 = 1$) |       $y = 6$       | $y < 6$: $\{(9, 2)\}$                 | $y > 6$: $\emptyset$            |
|    **$(1, 1)$**     |    $2$     | $X$-axis ($d \bmod 2 = 0$) |       $x = 1$       | Leaf Node                             | Leaf Node                       |
|    **$(4, 7)$**     |    $2$     | $X$-axis ($d \bmod 2 = 0$) |       $x = 4$       | Leaf Node                             | Leaf Node                       |
|    **$(9, 2)$**     |    $2$     | $X$-axis ($d \bmod 2 = 0$) |       $x = 9$       | Leaf Node                             | Leaf Node                       |

---

## 3. Nearest Neighbor Search ($k$-NN) with Branch Pruning

To locate the nearest point to query coordinate $Q$:

1. Traverse downward through splitting hyperplanes to reach the leaf bounding box containing $Q$.
2. Initialize `bestDistance` to $\text{EuclideanDistance}(Q, \text{leaf})$.
3. Backtrack up the recursive stack:
   - Check if current node is closer than `bestDistance`; update if true.
   - **The Hyperplane Pruning Condition**: Calculate the perpendicular distance from query point $Q$ to the splitting hyperplane:

$$D_{\perp} = |Q[\text{axis}] - \text{node.point}[\text{axis}]|$$

- If $D_{\perp} \ge \text{bestDistance}$, **prune the opposite subtree entirely**! A closer point cannot physically exist on the other side of that hyperplane.
- If $D_{\perp} < \text{bestDistance}$, recursively explore the opposite branch.

```typescript
export interface Point2D {
  x: number;
  y: number;
}

export class KdNode {
  point: Point2D;
  left: KdNode | null = null;
  right: KdNode | null = null;

  constructor(point: Point2D) {
    this.point = point;
  }
}

export function buildKdTree(points: Point2D[], depth: number = 0): KdNode | null {
  if (points.length === 0) return null;

  const axis = depth % 2 === 0 ? "x" : "y";
  points.sort((a, b) => a[axis] - b[axis]);

  const mid = Math.floor(points.length / 2);
  const node = new KdNode(points[mid]);

  node.left = buildKdTree(points.slice(0, mid), depth + 1);
  node.right = buildKdTree(points.slice(mid + 1), depth + 1);

  return node;
}
```

---

## 4. Quadtrees (2D) and Octrees (3D)

While Kd-Trees alternate splitting one dimension per level, a **Quadtree** decomposes two-dimensional space by recursively subdividing a bounding rectangle into four quadrants:

| Quadrant |             Coordinate Range Condition             |    Spatial Direction     | Engineering Applications                     |
| :------: | :------------------------------------------------: | :----------------------: | :------------------------------------------- |
|  **NW**  |  $x < x_{\text{mid}}, \quad y \ge y_{\text{mid}}$  | North-West (Upper-Left)  | Image compression, 2D terrain mapping        |
|  **NE**  | $x \ge x_{\text{mid}}, \quad y \ge y_{\text{mid}}$ | North-East (Upper-Right) | Spatial collision detection, GIS maps        |
|  **SW**  |   $x < x_{\text{mid}}, \quad y < y_{\text{mid}}$   | South-West (Lower-Left)  | Video game broad-phase physics engines       |
|  **SE**  |  $x \ge x_{\text{mid}}, \quad y < y_{\text{mid}}$  | South-East (Lower-Right) | Barnes-Hut $N$-body astronomical simulations |

In three dimensions, an **Octree** subdivides space into eight octants, widely utilized in 3D game engines (Unreal, Unity) for frustum culling and point cloud processing (LiDAR).

---

## 5. Cartesian Trees & Linear-Time Monotonic Stack Construction

Invented by Jean Vuillemin in 1980, a **Cartesian Tree** derived from a 1D sequence $A[0 \dots n-1]$ is a binary tree satisfying two simultaneous invariants:

1. **Inorder Traversal Invariant**: An inorder traversal of the Cartesian tree visits the nodes in the exact sequential order of their original indices: $0, 1, 2, \dots, n-1$.
2. **Min-Heap Invariant**: For every node $u$, $A[u] \le A[\text{left}(u)]$ and $A[u] \le A[\text{right}(u)]$. The root is the global minimum of the entire array.

### Linear-Time $O(n)$ Construction Algorithm

Scanning array $A$ from left to right while maintaining the tree's right spine in an increasing monotonic stack guarantees $O(n)$ total time:

```typescript
export class CartesianNode {
  idx: number;
  val: number;
  left: CartesianNode | null = null;
  right: CartesianNode | null = null;

  constructor(idx: number, val: number) {
    this.idx = idx;
    this.val = val;
  }
}

export function buildCartesianTree(arr: number[]): CartesianNode | null {
  const stack: CartesianNode[] = [];

  for (let i = 0; i < arr.length; i++) {
    const curr = new CartesianNode(i, arr[i]);
    let lastPopped: CartesianNode | null = null;

    // Pop nodes larger than curr to preserve min-heap ordering
    while (stack.length > 0 && stack[stack.length - 1].val > curr.val) {
      lastPopped = stack.pop()!;
    }

    // The last popped node becomes curr's left child
    curr.left = lastPopped;

    // If stack is not empty, curr becomes right child of stack top
    if (stack.length > 0) {
      stack[stack.length - 1].right = curr;
    }

    stack.push(curr);
  }

  return stack.length > 0 ? stack[0] : null;
}
```

---

## 6. Step-by-Step Dry Run State Trace: Cartesian Tree Construction

Consider building a Cartesian Tree on array: $A = [9, 3, 7, 1]$:

| Step  | Current Node $(i, A[i])$ | Stack State Before | Elements Popped (`val > curr.val`)               | Child Pointer Assignments                                   | Stack State After  |
| :---: | :----------------------: | :----------------- | :----------------------------------------------- | :---------------------------------------------------------- | :----------------- |
| **1** |         $(0, 9)$         | `[]`               | None                                             | Stack empty: `curr.left = null`.                            | `[(0, 9)]`         |
| **2** |         $(1, 3)$         | `[(0, 9)]`         | Pop $(0, 9)$ ($9 > 3$)                           | `curr.left = (0, 9)`. Stack empty: no parent.               | `[(1, 3)]`         |
| **3** |         $(2, 7)$         | `[(1, 3)]`         | None ($3 < 7$)                                   | Stack top $(1, 3)$ links `right = (2, 7)`.                  | `[(1, 3), (2, 7)]` |
| **4** |         $(3, 1)$         | `[(1, 3), (2, 7)]` | Pop $(2, 7)$ ($7 > 1$)<br>Pop $(1, 3)$ ($3 > 1$) | Last popped is $(1, 3) \implies \text{curr.left} = (1, 3)$. | `[(3, 1)]`         |

_Resulting Tree:_ Node $(3, 1)$ is root with left child $(1, 3)$. Node $(1, 3)$ has left child $(0, 9)$ and right child $(2, 7)$. Inorder traversal yields: $0 \to 1 \to 2 \to 3$. Min-heap invariant is preserved across all nodes!

---

## 7. The Grand Equivalence Theorem: $\text{RMQ} \iff \text{LCA}$

$$\mathbf{Theorem}: \quad \text{For any array } A, \text{ the index of the minimum element in range } [L, R] \text{ is precisely}$$
$$\text{the Lowest Common Ancestor (LCA) of nodes } L \text{ and } R \text{ in the Cartesian tree of } A:$$

$$\mathbf{RMQ}_A(L, R) = \mathbf{LCA}_{\text{CartesianTree}}(L, R)$$

### Theoretical Significance

By constructing the Cartesian tree in $O(n)$ time and preprocessing the tree for LCA queries using the Euler Tour technique + Farach-Colton & Bender algorithm, Range Minimum Queries can be answered in **strictly $O(1)$ worst-case time with $O(n)$ preprocessing**!

---

## 8. Threaded Binary Trees: Stackless $O(1)$ Space Traversal

In an ordinary binary tree of $n$ nodes, there are $2n$ child pointer fields, but only $n - 1$ are used. The remaining $n + 1$ pointers store `null`.

Invented by A. J. Perlis and C. Thornton in 1960, **Threaded Binary Trees** repurpose these unused pointers:

- A `null` left child pointer is repurposed to point to the node's **Inorder Predecessor**.
- A `null` right child pointer is repurposed to point to the node's **Inorder Successor**.
- Two boolean tags (`isLeftThread`, `isRightThread`) differentiate structural edges from threads.

```typescript
export class ThreadedNode<T> {
  key: T;
  left: ThreadedNode<T> | null = null;
  right: ThreadedNode<T> | null = null;
  isLeftThread: boolean = false;
  isRightThread: boolean = false;

  constructor(key: T) {
    this.key = key;
  }
}

export function inorderSuccessor<T>(node: ThreadedNode<T>): ThreadedNode<T> | null {
  // If right pointer is a thread, follow it directly in O(1)
  if (node.isRightThread) return node.right;

  // Otherwise, find leftmost child of right subtree
  let curr = node.right;
  if (curr === null) return null;

  while (!curr.isLeftThread && curr.left !== null) {
    curr = curr.left;
  }

  return curr;
}
```

_Architectural Consequence:_ Inorder traversal runs in $O(n)$ time with **strictly $O(1)$ auxiliary space**, requiring zero recursion, call stacks, or explicit heap memory.

---

## 9. Common Traps, Edge Cases & Implementation Pitfalls

1. **Kd-Tree Curse of Dimensionality**:
   - For high dimensions ($k \ge 20$), nearest-neighbor search degrades toward an exhaustive $O(n)$ scan because the bounding hyperplanes fail to prune high-dimensional spherical shells. In high dimensions, approximate nearest neighbor algorithms (e.g., HNSW, Annoy) are preferred.
2. **Infinite Loops in Threaded Trees**:
   - Forgetting to check `node.isRightThread` before traversing `node.right` causes traversal algorithms to loop infinitely between a node and its successor thread.
3. **Duplicate Values in Cartesian Trees**:
   - When input arrays contain duplicate values, strict comparisons (`>`) vs non-strict (`>=`) dictate whether duplicate keys become left or right children. Standardize on index tie-breaking to guarantee a unique Cartesian tree.

---

## 10. References & Academic Attribution

1. **Bentley, J. L.** (1975). Multidimensional binary search trees used for associative searching. _Communications of the ACM_, 18(9), 509–517.
2. **Finkel, R. A., & Bentley, J. L.** (1974). Quad trees a data structure for retrieval on composite keys. _Acta Informatica_, 4(1), 1–9.
3. **Vuillemin, J.** (1980). A unifying look at data structures. _Communications of the ACM_, 23(4), 229–239.
4. **Perlis, A. J., & Thornton, C.** (1960). Symbol manipulation by threaded lists. _Communications of the ACM_, 3(4), 195–204.
5. **Bender, M. A., & Farach-Colton, M.** (2000). The LCA problem revisited. _Latin American Symposium on Theoretical Informatics (LATIN)_, 88–94.
