# 🚶 Part 06: Trees — Module 02: Tree Traversals (DFS, BFS & Advanced $O(1)$ Morris Traversals)

> **Topics Covered:**  
> 72. Tree Traversal Fundamentals & Classifications &bull; 73. Preorder Traversal (Recursive, Iterative, Morris) &bull; 74. Inorder Traversal (Recursive, Iterative, Morris $O(1)$ Space) &bull; 75. Postorder Traversal (Recursive, 2-Stack Iterative, 1-Stack Iterative) &bull; 76. Level Order Traversal & Zigzag BFS &bull; 76b. Advanced Views: Boundary, Vertical Order, Top & Bottom Views

---

# TOPIC 72: TREE TRAVERSAL OVERVIEW

Unlike linear data structures (Arrays, Linked Lists) which have a single obvious forward sequential order, hierarchical trees can be traversed along multiple dimensions:

1. **Depth-First Search (DFS)**: Explores branches deeply to leaves before backtracking (uses the Call Stack or an explicit LIFO Stack):
   - **Preorder**: $\text{Root} \to \text{Left} \to \text{Right}$
   - **Inorder**: $\text{Left} \to \text{Root} \to \text{Right}$
   - **Postorder**: $\text{Left} \to \text{Right} \to \text{Root}$
2. **Breadth-First Search (BFS)**: Explores all nodes level-by-level from top to bottom (uses a FIFO Queue):
   - **Level Order Traversal** and **Zigzag Level Order**.
3. **Threaded Traversals ($O(1)$ Auxiliary Space)**:
   - **Morris Inorder & Preorder Traversals** using temporary in-place threading.
4. **Geometric & Coordinate Traversals**:
   - **Vertical Order**, **Top View**, **Bottom View**, **Boundary Traversal**.

---

### Reference Binary Tree for All Dry Runs

```text
                     [ 1 ]
                   /       \
               [ 2 ]       [ 3 ]
              /     \     /     \
           [ 4 ]   [ 5 ] [ 6 ]  [ 7 ]
          /     \
        [ 8 ]   [ 9 ]
```

---

# TOPICS 73–75: DEPTH-FIRST TRAVERSALS (DFS)

### 1. Preorder Traversal: $\text{Root} \to \text{Left} \to \text{Right}$
- **Action Order**: Visit the current node immediately, then recurse left, then recurse right.
- **Reference Tree Output**: `1, 2, 4, 8, 9, 5, 3, 6, 7`
- **Primary Uses**: Cloning/copying a tree, serializing a tree to disk, evaluating prefix expressions.

```text
ALGORITHM PreorderRecursive(node):
1.  if node = NULL: return
2.  Print(node.val)
3.  PreorderRecursive(node.left)
4.  PreorderRecursive(node.right)

ALGORITHM PreorderIterative(root):
1.  if root = NULL: return
2.  stack ← empty Stack
3.  stack.Push(root)
4.  while not stack.IsEmpty():
5.      curr ← stack.Pop()
6.      Print(curr.val)
7.      if curr.right ≠ NULL: stack.Push(curr.right) // Right pushed first so Left is popped first!
8.      if curr.left ≠ NULL:  stack.Push(curr.left)
```

---

### 2. Inorder Traversal: $\text{Left} \to \text{Root} \to \text{Right}$
- **Action Order**: Recurse left entirely, visit the node, then recurse right.
- **Reference Tree Output**: `8, 4, 9, 2, 5, 1, 6, 3, 7`
- **⭐ SUPREME PROPERTY**: In a **Binary Search Tree (BST)**, an Inorder Traversal visits keys in **strictly non-decreasing sorted order**!

```text
ALGORITHM InorderRecursive(node):
1.  if node = NULL: return
2.  InorderRecursive(node.left)
3.  Print(node.val)
4.  InorderRecursive(node.right)

ALGORITHM InorderIterative(root):
1.  stack ← empty Stack
2.  curr ← root
3.  while curr ≠ NULL or not stack.IsEmpty():
4.      while curr ≠ NULL:
5.          stack.Push(curr)
6.          curr ← curr.left
7.      curr ← stack.Pop()
8.      Print(curr.val)
9.      curr ← curr.right
```

---

### 3. Postorder Traversal: $\text{Left} \to \text{Right} \to \text{Root}$
- **Action Order**: Recurse left, recurse right, and visit the node last (bottom-up).
- **Reference Tree Output**: `8, 9, 4, 5, 2, 6, 7, 3, 1`
- **Primary Uses**: Deleting or freeing a tree from memory (children must be freed before parent), calculating subtree heights/sizes, bottom-up dynamic programming on trees.

```text
ALGORITHM PostorderRecursive(node):
1.  if node = NULL: return
2.  PostorderRecursive(node.left)
3.  PostorderRecursive(node.right)
4.  Print(node.val)

ALGORITHM PostorderIterativeTwoStacks(root):
1.  if root = NULL: return
2.  s1 ← empty Stack, s2 ← empty Stack
3.  s1.Push(root)
4.  while not s1.IsEmpty():
5.      curr ← s1.Pop()
6.      s2.Push(curr)
7.      if curr.left ≠ NULL:  s1.Push(curr.left)
8.      if curr.right ≠ NULL: s1.Push(curr.right)
9.  while not s2.IsEmpty():
10.     Print(s2.Pop().val + " ")

ALGORITHM PostorderIterativeOneStack(root):
1.  stack ← empty Stack
2.  curr ← root, lastVisited ← NULL
3.  while curr ≠ NULL or not stack.IsEmpty():
4.      if curr ≠ NULL:
5.          stack.Push(curr)
6.          curr ← curr.left
7.      else:
8.          peekNode ← stack.Peek()
9.          if peekNode.right ≠ NULL and lastVisited ≠ peekNode.right:
10.             curr ← peekNode.right
11.         else:
12.             Print(peekNode.val + " ")
13.             lastVisited ← stack.Pop()
```

---

# ADVANCED TOPIC: MORRIS TRAVERSAL ($O(1)$ AUXILIARY SPACE)

Standard DFS algorithms require $O(h)$ space (where $h$ is tree height, up to $O(N)$ in degenerate trees) for recursion or explicit stacks.  
**J. H. Morris (1979)** invented an ingenious algorithm that achieves $O(N)$ time and **strictly $O(1)$ auxiliary memory** without modifying the tree permanently!

### The Core Intuition: Temporary Threading
In an Inorder traversal, after exploring the rightmost leaf of a node's left subtree (its **Inorder Predecessor**), we must return to the current node. Instead of remembering this return path on a stack:
1. Find the **Inorder Predecessor** (`pred = curr.left`, then walk right until `pred.right = NULL` or `pred.right = curr`).
2. If `pred.right = NULL`, establish a **temporary back-pointer thread**: `pred.right ← curr`, then move `curr ← curr.left`.
3. If `pred.right = curr`, the left subtree has already been visited! **Dismantle the thread**: `pred.right ← NULL`, print `curr.val`, and move `curr ← curr.right`.

```text
VISUALIZING THE TEMPORARY THREAD:
           [ Curr ]                      [ Curr ]
           /      \                      /      \
       [ L ]       ...      ──►       [ L ]      ...
      /     \                        /     \
    ...     [ Pred ]               ...    [ Pred ]
                \                             \
                NULL                       (Thread: points back to Curr!)
```

### Pseudocode: Morris Inorder Traversal

```text
ALGORITHM MorrisInorder(root):
1.  curr ← root
2.  while curr ≠ NULL:
3.      if curr.left = NULL:
4.          Print(curr.val + " ")
5.          curr ← curr.right
6.      else:
7.          // Step 1: Find inorder predecessor
8.          pred ← curr.left
9.          while pred.right ≠ NULL and pred.right ≠ curr:
10.             pred ← pred.right
11.         
12.         // Step 2: Establish thread or dismantle it
13.         if pred.right = NULL:
14.             pred.right ← curr    // Create temporary thread
15.             curr ← curr.left
16.         else:
17.             pred.right ← NULL    // Sever thread to restore tree structure
18.             Print(curr.val + " ")
19.             curr ← curr.right
```

### Why is Morris Traversal $O(N)$ Time?
Every edge is traversed at most **3 times**:
1. When finding the predecessor to create the thread.
2. When traversing down the left subtree.
3. When finding the predecessor again to remove the thread.  
Hence, total operations $\le 3N = \mathbf{O(N)}$ time, while auxiliary space is strictly $\mathbf{O(1)}$!

---

# TOPIC 76: LEVEL ORDER TRAVERSAL & GEOMETRIC VIEWS

### 1. Level Order Traversal (BFS via Queue)

```text
ALGORITHM LevelOrder(root):
1.  if root = NULL: return
2.  queue ← empty Queue
3.  queue.Enqueue(root)
4.  while not queue.IsEmpty():
5.      levelSize ← queue.Size()
6.      for i ← 1 to levelSize:
7.          curr ← queue.Dequeue()
8.          Print(curr.val + " ")
9.          if curr.left ≠ NULL:  queue.Enqueue(curr.left)
10.         if curr.right ≠ NULL: queue.Enqueue(curr.right)
11.     PrintNewline()
```

### 2. Zigzag Level Order Traversal (Spiral Traversal)
Alternate traversal direction level by level (Left-to-Right on even levels, Right-to-Left on odd levels).

```text
ALGORITHM ZigzagLevelOrder(root):
1.  if root = NULL: return
2.  queue ← empty Queue
3.  queue.Enqueue(root)
4.  leftToRight ← true
5.  while not queue.IsEmpty():
6.      size ← queue.Size()
7.      currentLevel ← array of size 'size'
8.      for i ← 0 to size - 1:
9.          curr ← queue.Dequeue()
10.         index ← (i if leftToRight else size - 1 - i)
11.         currentLevel[index] ← curr.val
12.         if curr.left ≠ NULL:  queue.Enqueue(curr.left)
13.         if curr.right ≠ NULL: queue.Enqueue(curr.right)
14.     leftToRight ← not leftToRight
15.     Output(currentLevel)
```

---

# ADVANCED TREE VIEWS

```text
COORDINATE MAPPING (Horizontal Distance HD):
                     Root (HD = 0)
                    /             \
             L (HD = -1)       R (HD = +1)
            /           \     /           \
     LL (HD = -2) LR (HD = 0) RL (HD = 0) RR (HD = +2)
```

### 1. Top View & Bottom View
- **Top View**: The set of nodes visible when looking at the tree from the top. For each unique Horizontal Distance ($HD$), record the **first** node encountered during BFS level order traversal.
- **Bottom View**: The set of nodes visible when looking at the tree from the bottom. For each unique $HD$, record the **last** node encountered during BFS level order traversal.

```text
ALGORITHM TopAndBottomView(root):
1.  if root = NULL: return
2.  topMap ← empty SortedMap<int, int>     // HD -> node value
3.  bottomMap ← empty SortedMap<int, int>  // HD -> node value
4.  queue ← empty Queue of Pair(Node, int) // (node, HD)
5.  queue.Enqueue(Pair(root, 0))
6.  while not queue.IsEmpty():
7.      pair ← queue.Dequeue()
8.      curr ← pair.first, hd ← pair.second
9.      if not topMap.ContainsKey(hd):
10.         topMap.Put(hd, curr.val)       // First node at this HD is Top View
11.     bottomMap.Put(hd, curr.val)        // Overwrite to keep deepest node for Bottom View
12.     if curr.left ≠ NULL:  queue.Enqueue(Pair(curr.left, hd - 1))
13.     if curr.right ≠ NULL: queue.Enqueue(Pair(curr.right, hd + 1))
```

### 2. Boundary Traversal (Anti-Clockwise)
Visits the perimeter of the tree in anti-clockwise order:
1. Root node.
2. Left boundary (top-down, excluding leaf nodes).
3. All leaf nodes (left-to-right, via standard DFS).
4. Right boundary (bottom-up, excluding leaf nodes, using recursion or a stack to reverse order).

---

### Comprehensive Traversal Comparison Matrix

| Traversal | Sequence Order | Data Structure | Time | Auxiliary Space | Signature Application |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Preorder** | Root $\to$ Left $\to$ Right | LIFO Stack | $\Theta(N)$ | $O(h)$ | Serialization, tree cloning |
| **Inorder** | Left $\to$ Root $\to$ Right | LIFO Stack | $\Theta(N)$ | $O(h)$ | **BST sorted order verification** |
| **Postorder** | Left $\to$ Right $\to$ Root | LIFO Stack | $\Theta(N)$ | $O(h)$ | Bottom-up height, node deletion |
| **Morris Inorder** | Left $\to$ Root $\to$ Right | Threading | $\Theta(N)$ | $\mathbf{O(1)}$ | Memory-constrained systems |
| **Level Order**| Layer-by-Layer | FIFO Queue | $\Theta(N)$ | $O(W) \approx O(N)$ | Unweighted shortest path |
| **Top/Bottom View**| By Horizontal Distance | Queue + Map | $O(N \log N)$ | $O(N)$ | 2D projection rendering |

---

## 🔁 Module 02 Summary & Key Takeaways

1. DFS traversals (**Preorder, Inorder, Postorder**) consume $O(h)$ stack frames; BFS (**Level Order**) consumes $O(W)$ queue entries where $W \le \lceil N/2 \rceil$.
2. **Morris Traversal** achieves linear time and strictly **$O(1)$ space** by temporarily pointing predecessor right leaves to the current node and restoring them before returning.
3. For all geometric views (Top, Bottom, Vertical Order), assign Horizontal Distance $HD = 0$ to Root, $HD - 1$ to Left child, and $HD + 1$ to Right child, traversing via BFS.

---
[⬅️ Previous: Module 01 — Tree Fundamentals](file:///d:/DSA/Part-06-Trees/01_tree_fundamentals.md) | [Next: Module 03 — Binary Search Trees ➡️](file:///d:/DSA/Part-06-Trees/03_binary_search_trees.md)
