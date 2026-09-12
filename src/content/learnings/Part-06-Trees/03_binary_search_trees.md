# 🌲 Part 06: Trees — Module 03: Binary Search Trees (BST)

> **Topics Covered:**  
> 77. The Binary Search Tree (BST) Invariant &bull; 78. BST Search &bull; 79. BST Insertion &bull; 80. BST Deletion (The 3 Canonical Cases) &bull; 81. Finding Minimum & Maximum Keys &bull; 82. Inorder Successor & Predecessor

---

# TOPIC 77: THE BST INVARIANT & CORE CONCEPTS

### 1. Topic Title
**Binary Search Tree (Sorted Hierarchical Search Container)**

### 2. Category
Non-Linear Data Structures — Hierarchical Search Structures.

### 3. Difficulty
Intermediate.

### 4. Prerequisites
Module 01: Tree Fundamentals, Binary Tree Traversals.

### 5. Definition & The Inviolable BST Invariant
A **Binary Search Tree (BST)** is a binary tree where every node $u$ satisfies the **Binary Search Property**:
1. Every key in the **Left Subtree** of $u$ is strictly less than $u$'s key:
$$\forall x \in \text{LeftSubtree}(u), \quad x.\text{val} < u.\text{val}$$
2. Every key in the **Right Subtree** of $u$ is strictly greater than $u$'s key:
$$\forall y \in \text{RightSubtree}(u), \quad y.\text{val} > u.\text{val}$$
3. Both the left and right subtrees must themselves also be valid Binary Search Trees.

---

### 6. Structural Diagram (ASCII)

```text
                           [ 50 ]
                         /        \
                    [ 30 ]        [ 70 ]
                   /      \      /      \
               [ 20 ]   [ 40 ] [ 60 ]  [ 80 ]
               
Inorder Traversal: 20, 30, 40, 50, 60, 70, 80  (Guaranteed Strictly Sorted!)
```

---

# TOPICS 78–79: BST SEARCH & INSERTION

### 1. BST Search Logic ($O(h)$)
To locate `target`:
- If `curr = NULL`, target is absent $\implies$ return `NULL`.
- If `target = curr.val`, match found $\implies$ return `curr`.
- If `target < curr.val`, recurse into the left child: `curr ← curr.left`.
- If `target > curr.val`, recurse into the right child: `curr ← curr.right`.

```text
ALGORITHM SearchBST(root, target)
1.  curr ← root
2.  while curr ≠ NULL and curr.val ≠ target:
3.      if target < curr.val:
4.          curr ← curr.left
5.      else:
6.          curr ← curr.right
7.  return curr
```

---

### 2. BST Insertion Logic ($O(h)$)
Always inserts the new key as a **new leaf node** at the appropriate boundary:

```text
ALGORITHM InsertBST(root, val)
1.  if root = NULL:
2.      newNode ← allocate Node(val)
3.      return newNode
4.  if val < root.val:
5.      root.left ← InsertBST(root.left, val)
6.  else if val > root.val:
7.      root.right ← InsertBST(root.right, val)
8.  return root
```

---

# TOPIC 80: BST DELETION (THE 3 CANONICAL CASES)

Deleting a node $z$ from a BST requires careful pointer reconnection to preserve the BST invariant across three distinct structural cases:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE 3 STRUCTURAL DELETION CASES                       │
└─────────────────────────────────────────────────────────────────────────────┘

CASE 1: Node z is a LEAF (0 children)
Action: Simply sever the link from z's parent and deallocate z.
        [ 50 ]                   [ 50 ]
       /      \        ──►      /      \
    [ 30 ]  [ 70 ]           [ 30 ]  [ 70 ]
              \
             [ 80 ] ◄── Delete 80 (Set parent.right = NULL)

CASE 2: Node z has ONE CHILD
Action: Splice z out of the tree by connecting z's parent directly to z's child.
        [ 50 ]                   [ 50 ]
       /      \        ──►      /      \
    [ 30 ]  [ 70 ]           [ 30 ]  [ 80 ]  ◄── 80 promoted to replace 70!
              \
             [ 80 ]

CASE 3: Node z has TWO CHILDREN
Action:
1. Locate z's INORDER SUCCESSOR s (the minimum node in z's RIGHT subtree).
2. Overwrite z's value with s's value: z.val ← s.val.
3. Recursively delete s from z's right subtree (guaranteed to fall under Case 1 or 2!).
```

---

### Complete Pseudocode: BST Deletion

```text
ALGORITHM DeleteBST(root, key)
    Input: Root pointer of BST, key to remove
    Output: Updated root pointer

1.  if root = NULL: return NULL
2.  if key < root.val:
3.      root.left ← DeleteBST(root.left, key)
4.  else if key > root.val:
5.      root.right ← DeleteBST(root.right, key)
6.  else:
7.      // Case 1: 0 children (Leaf)
8.      if root.left = NULL and root.right = NULL:
9.          deallocate root
10.         return NULL
11.     // Case 2A: Only Right child exists
12.     if root.left = NULL:
13.         temp ← root.right
14.         deallocate root
15.         return temp
16.     // Case 2B: Only Left child exists
17.     if root.right = NULL:
18.         temp ← root.left
19.         deallocate root
20.         return temp
21.     // Case 3: Two children exist
22.     succ ← FindMin(root.right)          // Inorder successor
23.     root.val ← succ.val                 // Copy successor's value
24.     root.right ← DeleteBST(root.right, succ.val) // Delete successor node
25. return root
```

---

# TOPIC 81 & 82: MIN/MAX & SUCCESSOR/PREDECESSOR

### 1. Minimum & Maximum Keys
- **FindMin(node)**: Follow `left` pointers until hitting a node whose `left` is `NULL`.
- **FindMax(node)**: Follow `right` pointers until hitting a node whose `right` is `NULL`.

---

### 2. Inorder Successor of Node $X$
The Inorder Successor is the node with the smallest key strictly greater than $X.\text{val}$.
- **Scenario A (Right Subtree Exists)**:  
  $$\text{Successor} = \text{FindMin}(X.\text{right})$$
- **Scenario B (No Right Subtree)**:  
  Walk down from the root. The successor is the **deepest ancestor** for which $X$ lies in its left subtree!

```text
ALGORITHM InorderSuccessor(root, target)
1.  succ ← NULL
2.  curr ← root
3.  while curr ≠ NULL:
4.      if target.val < curr.val:
5.          succ ← curr         // curr could be successor; record candidate
6.          curr ← curr.left    // Look for closer successor on left
7.      else:
8.          curr ← curr.right
9.  return succ
```

---

### 3. Asymptotic Complexity: The Pathological Skew Warning

| Operation | Balanced BST Height $h = \Theta(\log n)$ | Degenerate BST Height $h = \Theta(n)$ |
| :--- | :---: | :---: |
| **Search** | $\Theta(\log n)$ | $\Theta(n)$ |
| **Insert** | $\Theta(\log n)$ | $\Theta(n)$ |
| **Delete** | $\Theta(\log n)$ | $\Theta(n)$ |

> ⚠️ **THE ACHILLES HEEL OF STANDARD BSTs**:  
> If keys are inserted in strictly ascending order ($[1, 2, 3, 4, 5]$), the BST degenerates into a single long right-skewed chain. All search and insertion operations drop from $O(\log n)$ to $O(n)$!  
> **Solution**: Self-Balancing Trees (AVL Trees in Module 04).

---

## 🔁 Module 03 Summary & Key Takeaways

1. **BST Invariant**: Left subtree keys are strictly smaller; right subtree keys are strictly larger.
2. An **Inorder Traversal** of a BST visits keys in strictly sorted order.
3. Deletion with 2 children replaces the target node's value with its **Inorder Successor** (minimum of right subtree), reducing the deletion to Case 1 or 2.
4. Without balance enforcement, worst-case BST height is $O(n)$; resolved by AVL Trees.

---
[⬅️ Previous: Module 02 — Tree Traversals](file:///d:/DSA/Part-06-Trees/02_tree_traversals.md) | [Next: Module 04 — AVL Trees ➡️](file:///d:/DSA/Part-06-Trees/04_avl_trees.md)
