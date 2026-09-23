# Part 06: Trees — Module 03: Binary Search Trees (BST)

> A Binary Search Tree (BST) bridges dynamic pointer-based structures and binary search efficiency by enforcing a strict recursive partitioning invariant across every node. Mastering its pointer surgery, three-case deletion mechanics, and ancestor-climbing navigation establishes the foundational mechanics for all balanced search tree engines.

---

## 1. Executive Summary & Learning Objectives

A Binary Search Tree (BST) is an explicitly ordered hierarchical data structure where every node enforces a symmetric comparison invariant between its key and all keys residing in its subtrees.

By the end of this chapter, you will be able to:
1. **Formulate** the Binary Search Tree invariant and prove that an inorder traversal produces keys in strictly increasing order.
2. **Implement** pointer-based search, insertion, and the three canonical deletion cases with zero memory leaks.
3. **Trace** search, insert, and delete executions step-by-step through a concrete dry-run trace table.
4. **Identify** the structural conditions causing tree height to degrade to $\Theta(n)$ and motivate self-balancing variants (AVL, Red-Black).
5. **Compute** inorder successors and predecessors across both ancestor-climbing and subtree-descending configurations.

---

## 2. Structural Invariant & The Inorder Monotonicity Theorem

### Definition: The Binary Search Property
Let $x$ be a node in a binary search tree. If $y$ is a node in the left subtree of $x$, then $y.\text{key} \le x.\text{key}$. If $y$ is a node in the right subtree of $x$, then $y.\text{key} \ge x.\text{key}$. In strict BST models with unique keys:

$$\forall y \in \text{LeftSubtree}(x), \quad y.\text{key} < x.\text{key}$$
$$\forall z \in \text{RightSubtree}(x), \quad z.\text{key} > x.\text{key}$$

### Canonical Binary Search Tree Topology

The table below describes the topological layout of a balanced sample binary search tree containing keys $\{20, 30, 40, 50, 60, 70, 80\}$:

| Node Key | Parent | Left Child | Right Child | Subtree Key Range | Node Classification |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **50** | `null` | `30` | `70` | $(-\infty, +\infty)$ | Root Node |
| **30** | `50` | `20` | `40` | $(-\infty, 50)$ | Internal Node (Left Branch) |
| **70** | `50` | `60` | `80` | $(50, +\infty)$ | Internal Node (Right Branch) |
| **20** | `30` | `null` | `null` | $(-\infty, 30)$ | Leaf Node |
| **40** | `30` | `null` | `null` | $(30, 50)$ | Leaf Node |
| **60** | `70` | `null` | `null` | $(50, 70)$ | Leaf Node |
| **80** | `70` | `null` | `null` | $(70, +\infty)$ | Leaf Node |

*Inorder Traversal Sequence:* $20 \to 30 \to 40 \to 50 \to 60 \to 70 \to 80$ (Monotonically Increasing).

<div class="my-6 p-4 bg-surface rounded-xl border border-border overflow-x-auto">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 290" width="100%" height="290" class="mx-auto block font-sans">
  <defs>
    <marker id="bst-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b"/></marker>
    <marker id="proj-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/></marker>
    <linearGradient id="bst-left-zone" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981" stop-opacity="0.12"/><stop offset="100%" stop-color="#10b981" stop-opacity="0.02"/></linearGradient>
    <linearGradient id="bst-right-zone" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0284c7" stop-opacity="0.12"/><stop offset="100%" stop-color="#0284c7" stop-opacity="0.02"/></linearGradient>
  </defs>
  <text x="410" y="22" text-anchor="middle" font-size="15" font-weight="bold" fill="currentColor">Binary Search Tree: Recursive Partitioning &amp; 1D Sorted Projection Theorem</text>
  <rect x="70" y="65" width="290" height="145" rx="10" fill="url(#bst-left-zone)" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="90" y="85" font-size="12" font-weight="bold" fill="#10b981">Left Subtree: Keys &lt; 50</text>
  <rect x="460" y="65" width="290" height="145" rx="10" fill="url(#bst-right-zone)" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="4,3"/>
  <text x="730" y="85" text-anchor="end" font-size="12" font-weight="bold" fill="#0284c7">Right Subtree: Keys &gt; 50</text>
  <line x1="410" y1="65" x2="215" y2="120" stroke="#64748b" stroke-width="2"/>
  <line x1="410" y1="65" x2="605" y2="120" stroke="#64748b" stroke-width="2"/>
  <line x1="215" y1="120" x2="120" y2="185" stroke="#64748b" stroke-width="2"/>
  <line x1="215" y1="120" x2="310" y2="185" stroke="#64748b" stroke-width="2"/>
  <line x1="605" y1="120" x2="510" y2="185" stroke="#64748b" stroke-width="2"/>
  <line x1="605" y1="120" x2="700" y2="185" stroke="#64748b" stroke-width="2"/>
  <circle cx="410" cy="55" r="22" fill="#8b5cf6" stroke="#7c3aed" stroke-width="2.5"/>
  <text x="410" y="61" text-anchor="middle" font-size="14" font-weight="bold" fill="#ffffff">50</text>
  <circle cx="215" cy="120" r="19" fill="#10b981" stroke="#059669" stroke-width="2"/>
  <text x="215" y="125" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">30</text>
  <circle cx="605" cy="120" r="19" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  <text x="605" y="125" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">70</text>
  <circle cx="120" cy="185" r="17" fill="#10b981" stroke="#059669" stroke-width="1.5"/>
  <text x="120" y="190" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">20</text>
  <circle cx="310" cy="185" r="17" fill="#10b981" stroke="#059669" stroke-width="1.5"/>
  <text x="310" y="190" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">40</text>
  <circle cx="510" cy="185" r="17" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
  <text x="510" y="190" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">60</text>
  <circle cx="700" cy="185" r="17" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
  <text x="700" y="190" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">80</text>
  <line x1="80" y1="240" x2="740" y2="240" stroke="#64748b" stroke-width="1.5" stroke-dasharray="2,2"/>
  <line x1="120" y1="205" x2="120" y2="235" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,2" marker-end="url(#proj-arrow)"/>
  <line x1="215" y1="142" x2="215" y2="235" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,2" marker-end="url(#proj-arrow)"/>
  <line x1="310" y1="205" x2="310" y2="235" stroke="#10b981" stroke-width="1.5" stroke-dasharray="3,2" marker-end="url(#proj-arrow)"/>
  <line x1="410" y1="80" x2="410" y2="235" stroke="#8b5cf6" stroke-width="1.5" stroke-dasharray="3,2" marker-end="url(#proj-arrow)"/>
  <line x1="510" y1="205" x2="510" y2="235" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3,2" marker-end="url(#proj-arrow)"/>
  <line x1="605" y1="142" x2="605" y2="235" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3,2" marker-end="url(#proj-arrow)"/>
  <line x1="700" y1="205" x2="700" y2="235" stroke="#0284c7" stroke-width="1.5" stroke-dasharray="3,2" marker-end="url(#proj-arrow)"/>
  <rect x="75" y="248" width="670" height="32" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="85" y="269" font-size="11" font-weight="bold" fill="#94a3b8">Inorder Walk Projection:</text>
  <text x="215" y="269" text-anchor="middle" font-size="12" font-weight="bold" fill="#34d399">20 &#x2192; 30 &#x2192; 40 &#x2192; 50 &#x2192; 60 &#x2192; 70 &#x2192; 80 (Monotonically Sorted)</text>
</svg>
</div>

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

```typescript
export function insertBST<T>(root: BSTNode<T> | null, key: T): BSTNode<T> {
  const newNode = new BSTNode(key);
  if (root === null) return newNode;

  let parent: BSTNode<T> | null = null;
  let curr: BSTNode<T> | null = root;

  while (curr !== null) {
    parent = curr;
    if (key < curr.key) {
      curr = curr.left;
    } else if (key > curr.key) {
      curr = curr.right;
    } else {
      return root; // Duplicate key: ignore or handle frequency count
    }
  }

  newNode.parent = parent;
  if (parent !== null) {
    if (key < parent.key) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
  }

  return root;
}
```

---

## 4. Deletion: The Three Canonical Structural Cases

When deleting node $z$, three topological cases arise depending on the child degree of $z$:

| Case | Node Topology | Surgical Pointer Action | Example in Sample Tree | Time Complexity |
| :--- | :--- | :--- | :--- | :---: |
| **Case 1: Zero Children** | $z$ is a leaf (`z.left == null` and `z.right == null`) | Set the corresponding child pointer of $z$'s parent to `null`. Deallocate node $z$. | Deleting node $20$: set $30.\text{left} = \text{null}$. | $O(1)$ post-search |
| **Case 2: One Child** | $z$ has exactly one non-null child $c$ | Splice $z$ out by connecting $z$'s parent directly to $c$. Reassign $c.\text{parent} = z.\text{parent}$. | Deleting node $30$ if $20$ absent: link $50.\text{left} = 40$. | $O(1)$ post-search |
| **Case 3: Two Children** | $z$ has both left and right children | Find $z$'s inorder successor $y$ ($\min(\text{RightSubtree}(z))$). Replace $z.\text{key}$ with $y.\text{key}$. Delete $y$ from right subtree (which has at most one child, falling into Case 1 or 2). | Deleting root $50$: successor is $60$. Overwrite $50 \to 60$, delete $60$ from right subtree. | $O(h)$ |

```typescript
export function deleteBST<T>(root: BSTNode<T> | null, target: T): BSTNode<T> | null {
  if (root === null) return null;

  if (target < root.key) {
    root.left = deleteBST(root.left, target);
  } else if (target > root.key) {
    root.right = deleteBST(root.right, target);
  } else {
    // Case 1 & Case 2: 0 or 1 child
    if (root.left === null) return root.right;
    if (root.right === null) return root.left;

    // Case 3: 2 children — Find inorder successor (minimum key in right subtree)
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
| **5** | Splice Successor Out | `root.right` | Delete key $60$ from right subtree | Node $60$ is a leaf (Case 1). Subtree parent ($70$) updates $70.\text{left} = \text{null}$. |
| **6** | Verification | Inorder Traversal | Check sorted invariant | Resulting traversal: $20, 30, 40, 60, 70, 80$. Invariant maintained. |

---

## 6. Mathematical Invariants: Minimum, Maximum, Successor, Predecessor

### Inorder Successor Rules
To find the successor of node $x$ without an inorder traversal:
1. **If $x$ has a non-empty right subtree**: The successor is the node with the minimum key in $\text{RightSubtree}(x)$.
2. **If $x$ has an empty right subtree**: The successor is the lowest ancestor of $x$ whose left child is also an ancestor of $x$.

```typescript
export function treeSuccessor<T>(node: BSTNode<T>): BSTNode<T> | null {
  if (node.right !== null) {
    let curr = node.right;
    while (curr.left !== null) curr = curr.left;
    return curr;
  }

  let curr: BSTNode<T> | null = node;
  let ancestor = node.parent;
  while (ancestor !== null && curr === ancestor.right) {
    curr = ancestor;
    ancestor = ancestor.parent;
  }
  return ancestor;
}
```

### Successor Ancestor-Walk Trace: Find Successor of Node 40

In our sample tree, node $40$ has no right child (`40.right == null`):

| Iteration | Current Pointer `curr` | Ancestor Pointer `ancestor` | Condition Check (`curr === ancestor.right`) | Action Taken |
| :---: | :---: | :---: | :---: | :--- |
| **Init** | `node = 40` | `ancestor = 40.parent (30)` | $40 === 30.\text{right}$ (True) | Node $40$ is a right child: climb up to $30$. |
| **1** | `curr = 30` | `ancestor = 30.parent (50)` | $30 === 50.\text{right}$ (False; $30 === 50.\text{left}$) | Loop terminates! Lowest ancestor where branch was left child is $50$. |
| **Result** | — | `ancestor = 50` | — | Successor of $40$ is $50$. |

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

## 10. References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 12–13 (BSTs and Red-Black Trees) & Chapter 18 (B-Trees). MIT Press.
2. **Bayer, R., & McCreight, E.** (1972). Organization and maintenance of large ordered indices. *Acta Informatica*, 1(3), 173–189.
3. **Sleator, D. D., & Tarjan, R. E.** (1985). Self-adjusting binary search trees. *Journal of the ACM (JACM)*, 32(3), 652–686.
