# Part 06: Trees — Module 10: Spatial & Specialized Trees (Kd-Trees, Quadtrees, Cartesian & Threaded Trees)

> **Topics Covered:**  
> 97d. Kd-Trees & Multidimensional Orthogonal Partitioning &bull; 97e. Nearest Neighbor (k-NN) Pruning & Range Queries &bull; 97f. Quadtrees (2D) & Octrees (3D) in Spatial Indexing &bull; 97g. Cartesian Trees & The Monotonic Stack $O(n)$ Construction &bull; 97h. The RMQ $\iff$ LCA Equivalence &bull; 97i. Threaded Binary Trees & Stackless Inorder Traversals

---

# TOPIC 97d & 97e: KD-TREES ($k$-DIMENSIONAL SEARCH TREES)

### 1. Conceptual Motivation
Standard binary search trees organize 1-dimensional keys. But how do we efficiently query multidimensional data (e.g., GPS coordinates $(x, y)$, 3D graphics $(x, y, z)$, or high-dimensional embeddings)?
Invented by Jon Bentley in 1975, a **Kd-Tree** partitions $k$-dimensional space using axis-aligned hyperplanes.

---

### 2. Alternating Splitting Axes Invariant
At each level of the tree, the partitioning axis cycles through the $k$ dimensions:
$$\text{Dimension Axis} = \text{Depth} \pmod k$$
- For 2D points $(x, y)$:
  - Level 0 (Root): Splits along the **$X$-axis** (vertical line $x = \text{median}$).
  - Level 1: Splits along the **$Y$-axis** (horizontal line $y = \text{median}$).
  - Level 2: Splits along the **$X$-axis** again, and so on.

```text
2D SPACE PARTITIONING:                     CORRESPONDING KD-TREE:
  Y ▲                                                   [ (5, 4) ]  (split on X)
    │     │       │                                    /          \
  7 ┼─────┼───────┼───                              [ (2, 3) ]    [ (8, 6) ] (split on Y)
    │     │ (8,6) │                                 /        \          \
  4 ┼─────┼───────┼─── (5,4)                    [ (1, 1) ]  [ (4, 7) ]  [ (9, 2) ] (split on X)
    │(4,7)│       │
  3 ┼─(2,3)───────┼───
    │     │       │(9,2)
  1 ┼(1,1)│       │
  0 └─────┴───────┴──────► X
    0  1  2   5   8 9
```

---

### 3. Construction in $O(n \log n)$ Time

```text
ALGORITHM BuildKdTree(points, depth):
1.  if points is empty: return NULL
2.  k ← DimensionCount(points)
3.  axis ← depth mod k
4.  Sort points by coordinate along 'axis'
5.  medianIdx ← ⌊Length(points) / 2⌋
6.  node ← allocate KdNode(points[medianIdx])
7.  node.left ← BuildKdTree(points[0 ... medianIdx - 1], depth + 1)
8.  node.right ← BuildKdTree(points[medianIdx + 1 ... end], depth + 1)
9.  return node
```

---

### 4. Nearest Neighbor Search (k-NN) with Branch Pruning
To find the closest point to a query target $Q$:
1. Traverse down the tree comparing $Q[\text{axis}]$ to find the leaf cell containing $Q$.
2. Initialize `bestDistance` to distance$(Q, \text{leaf})$.
3. Backtrack up the tree:
   - Update `bestDistance` if the current node is closer.
   - **The Critical Pruning Condition**: If the perpendicular distance from $Q$ to the splitting hyperplane is **greater than or equal to `bestDistance`**, the opposite subtree cannot possibly contain a closer point! **Prune that entire subtree**!
   - Otherwise, recursively search the opposite branch.
- **Expected Search Time**: **$O(\log n)$** in typical distributions.

---

# TOPIC 97f: QUADTREES (2D) & OCTREES (3D)

While a Kd-Tree splits one dimension at a time, a **Quadtree** decomposes 2D space by recursively subdividing a region into **four equal quadrants**:
- **NW (North-West)**, **NE (North-East)**, **SW (South-West)**, **SE (South-East)**.
In 3D space, an **Octree** subdivides volume into **8 octants**.

```text
QUADTREE RECURSIVE QUADRANT DECOMPOSITION:
┌─────────────────┬─────────────────┐
│                 │                 │
│       NW        │       NE        │
│                 │                 │
├─────────────────┼─────────────────┤
│                 │                 │
│       SW        │       SE        │
│                 │                 │
└─────────────────┴─────────────────┘
```

### Signature Applications:
1. **Barnes-Hut $N$-Body Simulation**: Reduces astronomical gravitational simulation from $O(N^2)$ to $O(N \log N)$ by approximating distant clusters of stars as single center-of-mass nodes.
2. **Spatial Collision Detection in Video Games**: Frustum culling and broad-phase physics checks only test objects inside colliding quadrants.
3. **Lossy Image Compression**: Solid color quadrants are stored as single leaf nodes.

---

# TOPIC 97g & 97h: CARTESIAN TREES & THE RMQ $\iff$ LCA EQUIVALENCE

### 1. Definition of a Cartesian Tree
Given an array of distinct numbers $A[0 \dots n-1]$, a **Cartesian Tree** is a binary tree that simultaneously satisfies two invariants:
1. **Inorder Traversal Property**: An inorder traversal of the tree visits nodes in the exact sequential order of their original indices: $0, 1, 2, \dots, n-1$.
2. **Heap Property**: The value of each node is smaller than (or equal to) the values of its children (Min-Heap Cartesian Tree).

```text
ARRAY: A = [ 9, 3, 7, 1, 8, 12, 10, 20, 15, 18, 5 ]

CARTESIAN MIN-HEAP TREE:
                     [ 1 ] (idx 3)
                   /       \
             [ 3 ] (idx 1)  [ 5 ] (idx 10)
            /     \         /
      [ 9 ](0)  [ 7 ](2)  [ 8 ] (idx 4)
                            \
                           [ 10 ] (idx 6)
                           /    \
                       [12](5) [ 15 ] (idx 8)
                               /    \
                            [20](7) [18](9)
```

---

### 2. Linear Time $O(n)$ Construction using a Monotonic Stack

A Cartesian tree can be constructed in strictly **$O(n)$ linear time** by scanning the array from left to right while maintaining the "right spine" of the tree in an **increasing monotonic stack**:

```text
ALGORITHM BuildCartesianTree(A, n):
1.  stack ← empty Stack of Node pointers
2.  for i ← 0 to n - 1:
3.      curr ← allocate Node(val = A[i], idx = i)
4.      lastPopped ← NULL
5.      // Pop nodes with value greater than curr (preserving min-heap order)
6.      while not stack.IsEmpty() and stack.Peek().val > curr.val:
7.          lastPopped ← stack.Pop()
8.      // The last popped node becomes curr's left child!
9.      curr.left ← lastPopped
10.     // If stack is not empty, curr becomes the right child of stack top
11.     if not stack.IsEmpty():
12.         stack.Peek().right ← curr
13.     stack.Push(curr)
14. // The root is the bottom-most element of the stack
15. while stack.Size() > 1: stack.Pop()
16. return stack.Pop()
```

---

### 3. The Grand RMQ $\iff$ LCA Equivalence Theorem

$$\mathbf{Theorem}: \quad \text{The index of the minimum element in subarray } A[L \dots R] \text{ is precisely}$$
$$\text{the Lowest Common Ancestor (LCA) of nodes } A[L] \text{ and } A[R] \text{ in the Cartesian Tree!}$$

$$\mathbf{RMQ}_A(L, R) = \mathbf{LCA}_{\text{CartesianTree}}(L, R)$$

- **Significance**: By converting RMQ to LCA and applying the Euler Tour technique, Range Minimum Queries on arbitrary arrays can be solved in **$O(n)$ preprocessing and strictly $O(1)$ worst-case query time**!

---

# TOPIC 97i: THREADED BINARY TREES

Standard binary trees waste more than half of their pointers storing `NULL` leaf pointers (specifically, an $n$-node binary tree has $n + 1$ null pointers).  
**A. J. Perlis and C. Thornton (1960)** introduced **Threaded Binary Trees**:
- Every `NULL` left child pointer is repurposed to point to the node's **Inorder Predecessor**!
- Every `NULL` right child pointer is repurposed to point to the node's **Inorder Successor**!
- Two 1-bit boolean flags (`isLeftThread`, `isRightThread`) indicate whether a pointer is a real tree child or a thread.

### Consequence:
Traversal in Inorder requires **NO Call Stack, NO LIFO Stack, and NO recursion** while guaranteeing strictly **$O(1)$ auxiliary space** and deterministic forward stepping:
```text
FUNCTION InorderSuccessor(node):
1.  if node.isRightThread = true:
2.      return node.right
3.  node ← node.right
4.  while node.isLeftThread = false:
5.      node ← node.left
6.  return node
```

---

## Module 10 Summary & Key Takeaways

1. **Kd-Trees** alternate splitting hyperplanes across $k$ dimensions, enabling efficient nearest neighbor searches with branch pruning.
2. **Quadtrees** decompose 2D space into 4 quadrants, accelerating collision detection and $N$-body simulations.
3. **Cartesian Trees** can be constructed in strictly **$O(n)$ time** using a monotonic stack and establish the theoretical bridge between Range Minimum Queries and Lowest Common Ancestors.
4. **Threaded Trees** eliminate traversal stack memory by repurposing null leaf pointers as predecessor/successor highway links.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 12–13 (BSTs and Red-Black Trees) & Chapter 18 (B-Trees). MIT Press.
2. **Bayer, R., & McCreight, E.** (1972). Organization and maintenance of large ordered indices. *Acta Informatica*, 1(3), 173–189.
3. **Sleator, D. D., & Tarjan, R. E.** (1985). Self-adjusting binary search trees. *Journal of the ACM (JACM)*, 32(3), 652–686.
