# Part 06: Trees — Module 03: Binary Search Trees (BST)

> **Curriculum Milestone:** Part 06 &bull; Module 03 &bull; Chapter 27 of 62  
> **Topic Competencies:** Binary Search Property &bull; Inorder Monotonicity Theorem &bull; Pointer-Based Search &bull; Leaf Insertion &bull; 3-Case Deletion Surgery &bull; Predecessor/Successor Navigation &bull; Height Degradation Proof  
> **Primary Academic References:** CLRS 4th Ed. Chapter 12 &bull; Knuth Vol. 3 (Sorting and Searching) &bull; Sedgewick & Wayne Section 3.2

---

## 1. Executive Summary & Learning Objectives

A Binary Search Tree (BST) is an explicitly ordered hierarchical data structure where every node enforces a symmetric comparison invariant between its key and all keys residing in its subtrees.

By the end of this chapter, you will be able to:
1. Formulate the Binary Search Tree invariant and prove that an inorder traversal produces keys in strictly increasing order.
2. Implement pointer-based search, insertion, and the three canonical deletion cases with zero memory leaks.
3. Trace search, insert, and delete executions step-by-step through a concrete dry-run trace table.
4. Identify the structural conditions causing tree height to degrade to $\Theta(n)$ and motivate self-balancing variants (AVL, Red-Black).
5. Compute inorder successors and predecessors across both ancestor-climbing and subtree-descending configurations.

---

## 2. Structural Invariant & The Inorder Monotonicity Theorem

### Definition: The Binary Search Property
Let $x$ be a node in a binary search tree. If $y$ is a node in the left subtree of $x$, then $y.\text{key} \le x.\text{key}$. If $y$ is a node in the right subtree of $x$, then $y.\text{key} \ge x.\text{key}$. In strict BST models with unique keys:

$$\forall y \in \text{LeftSubtree}(x), \quad y.\text{key} < x.\text{key}$$
$$\forall z \in \text{RightSubtree}(x), \quad z.\text{key} > x.\text{key}$$

```text
                             [ 50 ]
                           /        \
                      [ 30 ]        [ 70 ]
                     /      \      /      \
                 [ 20 ]   [ 40 ] [ 60 ]  [ 80 ]

Inorder Traversal: 20, 30, 40, 50, 60, 70, 80 (Monotonically Increasing)
```

### Theorem: Inorder Traversal Monotonicity
*An inorder tree walk on a binary search tree $T$ visits the keys in monotonically non-decreasing order.*

**Proof by Structural Induction:**
- **Base Case**: If $T$ is empty, the sequence is trivially empty and sorted.
- **Inductive Hypothesis**: Assume inorder traversal correctly outputs keys in non-decreasing order for all trees with $< k$ nodes.
- **Inductive Step**: Consider a tree $T$ of size $k$ with root $x$. Inorder traversal visits:
  1. All nodes in $\text{LeftSubtree}(x)$ in non-decreasing order (by induction).
  2. The root key $x.\text{key}$.
  3. All nodes in $\text{RightSubtree}(x)$ in non-decreasing order (by induction).
  By the binary search property, every key in $\text{LeftSubtree}(x)$ is $< x.\text{key}$, and $x.\text{key}$ is $< $ every key in $\text{RightSubtree}(x)$. Therefore, the combined sequence is strictly sorted. $\blacksquare$

---

## 3. Search and Insertion Mechanics

### Search Algorithm ($O(h)$ time)
Starting from root, we compare search key $k$ with current node $x$:
- If $x == \text{NULL}$ or $k == x.\text{key}$, return $x$.
- If $k < x.\text{key}$, transition to $x.\text{left}$.
- If $k > x.\text{key}$, transition to $x.\text{right}$.

```typescript
export class BSTNode<T> {
  key: T;
  left: BSTNode<T> | null = null;
  right: BSTNode<T> | null = null;
  parent: BSTNode<T> | null = null;

  constructor(key: T, parent: BSTNode<T> | null = null) {
    this.key = key;
    this.parent = parent;
  }
}

export function searchBST<T>(root: BSTNode<T> | null, target: T): BSTNode<T> | null {
  let curr = root;
  while (curr !== null && curr.key !== target) {
    curr = target < curr.key ? curr.left : curr.right;
  }
  return curr;
}
```

### Insertion Algorithm ($O(h)$ time)
A new node is always inserted as a **new leaf**:
1. Scan down the tree using two pointers: `curr` and its trailing `parent`.
2. Determine whether the new node attaches as the left or right child of `parent`.
3. Allocate and link the new node.

---

## 4. Deletion: The Three Canonical Structural Cases

When deleting node $z$, three topological cases arise:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE THREE TOPOLOGICAL DELETION CASES                     │
├─────────────────────────────────────────────────────────────────────────────┤
│ CASE 1: Node z is a LEAF (Zero Children)                                    │
│ Action: Set the corresponding child pointer of z's parent to NULL.          │
│                                                                             │
│ CASE 2: Node z has EXACTLY ONE CHILD                                        │
│ Action: Splice z out by connecting z's parent directly to z's child.       │
│                                                                             │
│ CASE 3: Node z has TWO CHILDREN                                             │
│ Action:                                                                     │
│ 1. Find z's Inorder Successor y (the minimum node in z's right subtree).   │
│ 2. y has at most ONE child (its right child; it cannot have a left child).  │
│ 3. Splice y out of its current position (Case 1 or 2).                      │
│ 4. Replace z's key and satellite data with y's key.                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

```typescript
export function deleteBST<T>(root: BSTNode<T> | null, target: T): BSTNode<T> | null {
  if (root === null) return null;

  if (target < root.key) {
    root.left = deleteBST(root.left, target);
  } else if (target > root.key) {
    root.right = deleteBST(root.right, target);
  } else {
    // Case 1 & 2: 0 or 1 child
    if (root.left === null) return root.right;
    if (root.right === null) return root.left;

    // Case 3: 2 children — Find inorder successor (min in right subtree)
    let successor = root.right;
    while (successor.left !== null) {
      successor = successor.left;
    }

    root.key = successor.key;
    root.right = deleteBST(root.right, successor.key);
  }

  return root;
}
```

---

## 5. Complete Step-by-Step Dry Run State Trace Table

Consider the tree populated with keys $[50, 30, 70, 20, 40, 60, 80]$.

### Execution: Delete Node 50 (Case 3: Two Children)

| Step | Current Operation | Active Pointers | Comparison / Invariant Check | State Mutation |
| :---: | :---: | :---: | :---: | :--- |
| **1** | Locate target key $50$ | `curr = root (50)` | $50 == curr.\text{key}$ | Target node located. Both `curr.left (30)` and `curr.right (70)` are non-NULL (Case 3). |
| **2** | Locate Inorder Successor | `succ = curr.right (70)` | Check `succ.left` | `succ.left` points to node $60$. Advance `succ = succ.left (60)`. |
| **3** | Successor Terminal Check | `succ = 60` | Check `succ.left` | Node $60$ has `left == NULL`. Node $60$ is the minimum key in the right subtree. |
| **4** | Key Replacement | `curr.key` | Overwrite root key | `root.key` updated from $50 \to 60$. |
| **5** | Splice Successor Out | `root.right` | Delete key $60$ from right subtree | Node $60$ is a leaf (Case 1). Subtree parent ($70$) updates `70.left = NULL`. |
| **6** | Verification | Inorder Traversal | Check sorted invariant | Resulting traversal: $20, 30, 40, 60, 70, 80$. Invariant maintained! |

---

## 6. Mathematical Invariants: Minimum, Maximum, Successor, Predecessor

### Inorder Successor Rules
To find the successor of node $x$ without an inorder traversal:
1. **If $x$ has a non-empty right subtree**: The successor is the node with the minimum key in $\text{RightSubtree}(x)$.
2. **If $x$ has an empty right subtree**: The successor is the lowest ancestor of $x$ whose left child is also an ancestor of $x$.

### Inorder Predecessor Rules
1. **If $x$ has a non-empty left subtree**: The predecessor is the node with the maximum key in $\text{LeftSubtree}(x)$.
2. **If $x$ has an empty left subtree**: The predecessor is the lowest ancestor of $x$ whose right child is also an ancestor of $x$.

---

## 7. Asymptotic Complexity & Height Degradation

The running time of Search, Insert, and Delete is $\Theta(h)$, where $h$ is the height of the tree.

| Scenario | Tree Topology | Height $h$ | Search Time | Insertion Time | Deletion Time |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Best Case** | Complete / Perfectly Balanced | $\lfloor \log_2 n \rfloor$ | $\Theta(\log n)$ | $\Theta(\log n)$ | $\Theta(\log n)$ |
| **Average Case** | Randomly Built BST | $\Theta(\log n)$ | $\Theta(\log n)$ | $\Theta(\log n)$ | $\Theta(\log n)$ |
| **Worst Case** | Strictly Skewed (Degenerate) | $n - 1$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ |

### Why Simple BSTs Degrade to $\Theta(n)$
If keys are inserted in strictly ascending order ($[1, 2, 3, 4, 5]$) or strictly descending order ($[5, 4, 3, 2, 1]$), each node is appended as a right-only or left-only child. The tree topology degenerates into a linear singly linked list, mirroring the worst-case partitioning behavior of Quicksort. This limitation directly motivates self-balancing binary search trees (AVL Trees and Red-Black Trees).

---

## 8. Common Traps, Edge Cases & Implementation Pitfalls

1. **Root Node Deletion**:
   - When deleting the root node in Case 1 or Case 2, the caller's root pointer must be reassigned. Failure to update the reference causes memory leaks or orphaned subtrees.
2. **Duplicate Key Management**:
   - Standard mathematical BSTs disallow duplicate keys. If duplicates are required, store a `count` frequency field within each node rather than allocating redundant identical nodes, which unbalances tree height.
3. **Integer Overflow in Comparison**:
   - Computing key differences via subtraction (`a.key - b.key`) causes signed integer overflow when comparing large positive and negative values. Always use explicit comparisons (`a.key < b.key ? -1 : 1`).
4. **Stray Parent Pointers**:
   - In implementations maintaining parent pointers, splicing a node out without updating its child's parent pointer creates circular references or invalid ancestor walks.

---

## 9. Real-World Applications & Practice Problems

### Production Systems
- **Virtual Memory Region Management**: The Linux kernel manages process virtual memory areas (`vm_area_struct`) using balanced BSTs to quickly check whether a faulting memory address belongs to a mapped memory page.
- **Relational Database Indices**: Early indexing engines used in-memory BSTs prior to the adoption of block-oriented B-trees for secondary storage.

### Standard Practice Roadmap
1. **Validate Binary Search Tree (LeetCode 98)** — Verify range bounds $(-\infty, +\infty)$ recursively.
2. **Lowest Common Ancestor of a BST (LeetCode 235)** — Exploit BST ordering property in $O(h)$ time without hash sets.
3. **Kth Smallest Element in a BST (LeetCode 230)** — Inorder traversal with counter or augmented subtree sizes.
4. **Delete Node in a BST (LeetCode 450)** — Implementation of the 3 canonical deletion cases.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 12–13 (BSTs and Red-Black Trees) & Chapter 18 (B-Trees). MIT Press.
2. **Bayer, R., & McCreight, E.** (1972). Organization and maintenance of large ordered indices. *Acta Informatica*, 1(3), 173–189.
3. **Sleator, D. D., & Tarjan, R. E.** (1985). Self-adjusting binary search trees. *Journal of the ACM (JACM)*, 32(3), 652–686.
