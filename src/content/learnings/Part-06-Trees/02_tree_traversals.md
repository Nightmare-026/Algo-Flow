# Part 06: Trees — Module 02: Tree Traversals (DFS, BFS & Advanced $O(1)$ Morris Traversals)

> **Topics Covered:**  
> 72. Tree Traversal Fundamentals & Classifications &bull; 73. Preorder Traversal (Recursive, Iterative, Morris) &bull; 74. Inorder Traversal (Recursive, Iterative, Morris $O(1)$ Space) &bull; 75. Postorder Traversal (Recursive, 2-Stack Iterative, 1-Stack Iterative) &bull; 76. Level Order Traversal & Zigzag BFS &bull; 76b. Advanced Views: Boundary, Vertical Order, Top & Bottom Views

---

Tree traversals define the algorithmic protocols that linearize non-linear hierarchical graphs into deterministic, ordered sequences. Unlike linear structures (arrays, linked lists) that offer a single sequential trajectory, hierarchical trees support multiple traversal dimensions depending on scheduling mechanisms (LIFO call stacks, FIFO queues, state machines, or in-place pointer threading). This module examines the mathematical foundations, stack simulation mechanics, and geometric projections of tree traversals, culminating in J. H. Morris's optimal $O(1)$ auxiliary memory algorithm.

### Learning Objectives
- Formulate the visitation invariants of Depth-First Search (Preorder, Inorder, Postorder) and construct both recursive and explicit stack implementations.
- Prove why an Inorder traversal across a Binary Search Tree produces a strictly non-decreasing monotonic sequence.
- Implement Morris Inorder and Preorder traversals, proving how temporary right-pointer threading achieves $O(n)$ time with strictly $O(1)$ auxiliary space.
- Implement Breadth-First Search (Level Order) and alternating Zigzag traversals using FIFO queue scheduling.
- Derive coordinate-based geometric views (Vertical Order, Top View, Bottom View, and Anti-Clockwise Boundary Traversal) using horizontal distance projections.

---

## Topic 72: Tree Traversal Overview & Reference Model

### 1. Classification of Traversal Dimensions

Tree traversals are broadly categorized across four distinct algorithmic dimensions:

1. **Depth-First Search (DFS):** Explores branches deeply toward leaf nodes before backtracking, traditionally consuming $O(h)$ auxiliary stack frames:
   - **Preorder:** $\text{Root} \to \text{Left} \to \text{Right}$ (Prefix linearization)
   - **Inorder:** $\text{Left} \to \text{Root} \to \text{Right}$ (Infix / Monotonic BST order)
   - **Postorder:** $\text{Left} \to \text{Right} \to \text{Root}$ (Postfix / Bottom-up reduction)
2. **Breadth-First Search (BFS):** Explores nodes layer-by-layer in increasing order of distance from the root, consuming $O(W)$ auxiliary queue space (where $W$ is maximum level width):
   - **Level Order Traversal** and **Zigzag (Spiral) Traversal**.
3. **Threaded Traversals ($O(1)$ Auxiliary Space):**
   - **Morris Inorder and Preorder Traversals**, which exploit unused leaf pointer fields to establish transient back-links without allocating memory.
4. **Coordinate-Based Geometric Views:**
   - **Vertical Order**, **Top View**, **Bottom View**, and **Boundary Traversal**, mapped via 2D Cartesian coordinates $(HD, VD)$ (Horizontal Distance and Vertical Depth).

---

### 2. Reference Binary Tree Specification

To provide clear comparative traces across all traversals, we establish a standardized 9-node reference binary tree:

| Node Value | Left Child | Right Child | Tree Level | Depth ($VD$) | Horizontal Distance ($HD$) | In-Degree | Out-Degree |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **`1`** | `2` | `3` | Level 0 | `0` | `0` | `0` (Root) | `2` |
| **`2`** | `4` | `5` | Level 1 | `1` | `-1` | `1` | `2` |
| **`3`** | `6` | `7` | Level 1 | `1` | `+1` | `1` | `2` |
| **`4`** | `8` | `9` | Level 2 | `2` | `-2` | `1` | `2` |
| **`5`** | None | None | Level 2 | `2` | `0` | `1` | `0` (Leaf) |
| **`6`** | None | None | Level 2 | `2` | `0` | `1` | `0` (Leaf) |
| **`7`** | None | None | Level 2 | `2` | `+2` | `1` | `0` (Leaf) |
| **`8`** | None | None | Level 3 | `3` | `-3` | `1` | `0` (Leaf) |
| **`9`** | None | None | Level 3 | `3` | `-1` | `1` | `0` (Leaf) |

#### Master Output Sequences on Reference Tree:
- **Preorder:** `1, 2, 4, 8, 9, 5, 3, 6, 7`
- **Inorder:** `8, 4, 9, 2, 5, 1, 6, 3, 7`
- **Postorder:** `8, 9, 4, 5, 2, 6, 7, 3, 1`
- **Level Order:** `1, 2, 3, 4, 5, 6, 7, 8, 9`

---

## Topic 73: Depth-First Search Traversals (Preorder, Inorder, Postorder)

### 1. Preorder Traversal: $\text{Root} \to \text{Left} \to \text{Right}$

- **Execution Invariant:** Process the parent node immediately upon first arrival, before descending recursively into the left subtree, followed by the right subtree.
- **Primary Use Cases:** Tree cloning, structured file serialization, prefix expression evaluation (Polish Notation).

#### Iterative Preorder with Explicit LIFO Stack:
Because stacks are Last-In, First-Out (LIFO), when visiting node `curr`, we must push `curr.right` onto the stack **before** `curr.left`. This ensures that `curr.left` is popped and processed next.

```text
FUNCTION PreorderIterative(root: Node):
    IF root = NULL THEN RETURN

    stack <- empty Stack of Node
    stack.Push(root)

    WHILE NOT stack.IsEmpty() DO
        curr <- stack.Pop()
        Visit(curr.val)

        // Push right child first so left child is popped and processed first
        IF curr.right != NULL THEN
            stack.Push(curr.right)
        END IF
        IF curr.left != NULL THEN
            stack.Push(curr.left)
        END IF
    END WHILE
```

---

### 2. Inorder Traversal: $\text{Left} \to \text{Root} \to \text{Right}$

- **Execution Invariant:** Fully traverse the entire left subtree down to its leftmost descendant before visiting the node itself, followed by descending into the right subtree.
- **The BST Inorder Theorem:** When applied to a Binary Search Tree (BST), Inorder traversal visits keys in **strictly non-decreasing sorted order**.

#### Iterative Inorder with Explicit LIFO Stack:
We simulate recursion by driving a pointer `curr` down left branches while pushing nodes onto the stack until hitting `NULL`. We then pop the top node, process its value, and redirect `curr` to its right child:

```text
FUNCTION InorderIterative(root: Node):
    stack <- empty Stack of Node
    curr <- root

    WHILE curr != NULL OR NOT stack.IsEmpty() DO
        // Traverse to leftmost node of current subtree
        WHILE curr != NULL DO
            stack.Push(curr)
            curr <- curr.left
        END WHILE

        curr <- stack.Pop()
        Visit(curr.val)
        curr <- curr.right
    END WHILE
```

---

### 3. Postorder Traversal: $\text{Left} \to \text{Right} \to \text{Root}$

- **Execution Invariant:** Fully traverse both left and right subtrees before visiting the parent node (bottom-up leaf-to-root reduction).
- **Primary Use Cases:** Deleting or freeing a tree from heap memory (children must be destroyed before their parent), bottom-up subtree height/size calculation, directory disk-usage summation.

#### Implementation Strategies:
1. **Two-Stack Approach:** Notice that reversing postorder ($\text{Left} \to \text{Right} \to \text{Root}$) yields $\text{Root} \to \text{Right} \to \text{Left}$. We execute a modified preorder pushing to a second stack, which when emptied yields the exact postorder sequence.
2. **Single-Stack with Previous-Node Tracking:** A single stack tracks the path. A node can only be popped and visited if its right child is `NULL` or was the immediately preceding node visited (`lastVisited == curr.right`).

```text
FUNCTION PostorderIterativeOneStack(root: Node):
    stack <- empty Stack of Node
    curr <- root
    lastVisited <- NULL

    WHILE curr != NULL OR NOT stack.IsEmpty() DO
        IF curr != NULL THEN
            stack.Push(curr)
            curr <- curr.left
        ELSE
            peekNode <- stack.Peek()
            // If right child exists and traversing from left child, move right
            IF peekNode.right != NULL AND lastVisited != peekNode.right THEN
                curr <- peekNode.right
            ELSE
                Visit(peekNode.val)
                lastVisited <- stack.Pop()
            END IF
        END IF
    END WHILE
```

---

## Topic 74: Morris Traversal ($O(1)$ Auxiliary Space via Temporary Threading)

### 1. The Principle of Inorder Predecessor Threading

Standard recursive or iterative DFS traversals consume $O(h)$ stack frames (up to $O(n)$ space in skewed trees). In 1979, J. H. Morris introduced an algorithm that traverses any binary tree in $\Theta(n)$ time using **strictly $O(1)$ auxiliary memory**, leaving the tree's original structural pointers completely unaltered upon completion.

> **The Morris Inorder Invariant:**  
> In an inorder traversal, the predecessor of `curr` is the rightmost node in `curr.left` (the **Inorder Predecessor**). Since that predecessor's right pointer is currently `NULL`, Morris temporarily points `pred.right` back to `curr` as a return bridge (thread). When following this bridge later, the algorithm detects that `pred.right == curr`, dismantles the thread back to `NULL`, visits `curr`, and moves right.

---

### 2. Step-by-Step State Trace: Morris Inorder Traversal

The table below traces Morris Inorder traversal through the left subtree of our reference tree (nodes $1, 2, 4, 8, 9, 5$):

| Step | Current (`curr`) | Inorder Predecessor (`pred`) | Predecessor Right (`pred.right`) | Threading Action | Output Emitted | Pointer Update | Tree Mutation State |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | `1` | `7` in right? No: `6` (rightmost of left subtree from 2) $\to$ `5` | `NULL` | Create thread: `5.right = 1` | None | `curr <- curr.left` (2) | Temporary thread $5 \to 1$ active |
| **2** | `2` | Rightmost in $2$'s left subtree $\to$ `9` | `NULL` | Create thread: `9.right = 2` | None | `curr <- curr.left` (4) | Temporary thread $9 \to 2$ active |
| **3** | `4` | Rightmost in $4$'s left subtree $\to$ `8` | `NULL` | Create thread: `8.right = 4` | None | `curr <- curr.left` (8) | Temporary thread $8 \to 4$ active |
| **4** | `8` | Left child is `NULL` | — | **Visit `8`** | `8` | `curr <- curr.right` (Thread $8 \to 4$) | Bridge returns to 4 |
| **5** | `4` | Predecessor is `8` | `pred.right == curr` (`8.right == 4`) | **Sever thread:** `8.right = NULL`; **Visit `4`** | `4` | `curr <- curr.right` (9) | Original pointer restored |
| **6** | `9` | Left child is `NULL` | — | **Visit `9`** | `9` | `curr <- curr.right` (Thread $9 \to 2$) | Bridge returns to 2 |
| **7** | `2` | Predecessor is `9` | `pred.right == curr` (`9.right == 2`) | **Sever thread:** `9.right = NULL`; **Visit `2`** | `2` | `curr <- curr.right` (5) | Original pointer restored |
| **8** | `5` | Left child is `NULL` | — | **Visit `5`** | `5` | `curr <- curr.right` (Thread $5 \to 1$) | Bridge returns to 1 |
| **9** | `1` | Predecessor is `5` | `pred.right == curr` (`5.right == 1`) | **Sever thread:** `5.right = NULL`; **Visit `1`** | `1` | `curr <- curr.right` (3) | Tree fully restored! |

Output generated so far: `8, 4, 9, 2, 5, 1` — exactly matching standard Inorder traversal!

---

### 3. Canonical Algorithm: Morris Inorder Traversal

```text
FUNCTION MorrisInorder(root: Node):
    curr <- root

    WHILE curr != NULL DO
        // Case 1: If left child is NULL, visit curr and move to right child
        IF curr.left = NULL THEN
            Visit(curr.val)
            curr <- curr.right
        ELSE
            // Case 2: Find the inorder predecessor of curr
            pred <- curr.left
            WHILE pred.right != NULL AND pred.right != curr DO
                pred <- pred.right
            END WHILE

            // 2A: Predecessor's right is NULL -> establish thread
            IF pred.right = NULL THEN
                pred.right <- curr
                curr <- curr.left
            // 2B: Predecessor's right is curr -> thread already exists; dismantle it
            ELSE
                pred.right <- NULL
                Visit(curr.val)
                curr <- curr.right
            END IF
        END IF
    END WHILE
```

#### Amortized Time Complexity Proof ($O(n)$):
Each edge in the tree is traversed at most **three times**:
1. Once downwards while searching for the predecessor to construct the thread.
2. Once downwards during normal traversal.
3. Once downwards while finding the predecessor a second time to sever the thread.

Because a tree with $n$ nodes has $n - 1$ edges, the total pointer operations are bounded by $3(n - 1) = \Theta(n)$. The auxiliary space is strictly $\mathbf{O(1)}$ because no call stack or heap data structure is created.

---

## Topic 75: Breadth-First Search & Level Order Variants

### 1. Level Order Traversal (BFS with Queue)

Breadth-First Search linearizes trees level by level. It relies on a FIFO queue to record child nodes for subsequent evaluation:

```text
FUNCTION LevelOrderTraversal(root: Node) -> List of List of Integer:
    result <- empty List
    IF root = NULL THEN RETURN result

    queue <- empty Queue of Node
    queue.Enqueue(root)

    WHILE NOT queue.IsEmpty() DO
        levelSize <- queue.Size()
        currentLevel <- empty List

        FOR i <- 1 TO levelSize DO
            curr <- queue.Dequeue()
            currentLevel.Append(curr.val)

            IF curr.left != NULL THEN queue.Enqueue(curr.left) END IF
            IF curr.right != NULL THEN queue.Enqueue(curr.right) END IF
        END FOR

        result.Append(currentLevel)
    END WHILE

    RETURN result
```

#### Queue Capacity & Memory Footprint:
The maximum number of nodes residing simultaneously in the queue equals the tree's **maximum width $W$**. For a complete binary tree, the maximum width occurs at the leaf level:
$$W_{\max} = \left\lceil \frac{n}{2} \right\rceil \implies \text{Auxiliary Space } = \Theta(n)$$

---

### 2. Zigzag Level Order (Spiral) Traversal

Alternates left-to-right and right-to-left visitation across consecutive levels:
- Even depths (Level 0, 2, 4...): Left-to-Right.
- Odd depths (Level 1, 3, 5...): Right-to-Left.

On our reference tree:
- Level 0: `[1]`
- Level 1: `[3, 2]`
- Level 2: `[4, 5, 6, 7]`
- Level 3: `[9, 8]`

---

## Topic 76: Coordinate-Based Geometric Tree Views

By mapping each node to a 2D integer Cartesian coordinate $(HD, VD)$ where:
- $\text{Root} = (0, 0)$
- Left Child: $(HD - 1, VD + 1)$
- Right Child: $(HD + 1, VD + 1)$

We can project geometric perspectives of the tree.

### 1. Horizontal Distance ($HD$) Projection Table

| Node Value | Horizontal Distance ($HD$) | Vertical Depth ($VD$) | In Vertical Order Column ($HD$) | Top View Visible? | Bottom View Visible? |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **`8`** | `-3` | `3` | Column `-3` | **Yes** (Only node at $HD=-3$) | **Yes** (Only node at $HD=-3$) |
| **`4`** | `-2` | `2` | Column `-2` | **Yes** (Smallest $VD$ at $HD=-2$) | **Yes** (Largest $VD$ at $HD=-2$) |
| **`2`** | `-1` | `1` | Column `-1` | **Yes** ($VD=1 < 3$) | No (Occluded by Node 9) |
| **`9`** | `-1` | `3` | Column `-1` | No (Occluded by Node 2) | **Yes** ($VD=3 > 1$) |
| **`1`** | `0` | `0` | Column `0` | **Yes** ($VD=0$, topmost) | No (Occluded by Node 5/6) |
| **`5`** | `0` | `2` | Column `0` | No | Overwritten |
| **`6`** | `0` | `2` | Column `0` | No | **Yes** (Deepest at $HD=0$) |
| **`3`** | `+1` | `1` | Column `+1` | **Yes** (Only node at $HD=+1$) | **Yes** (Only node at $HD=+1$) |
| **`7`** | `+2` | `2` | Column `+2` | **Yes** (Only node at $HD=+2$) | **Yes** (Only node at $HD=+2$) |

#### Resulting Geometric Views:
- **Top View:** `[8, 4, 2, 1, 3, 7]` (The first node encountered at each unique $HD$ during BFS level-order traversal).
- **Bottom View:** `[8, 4, 9, 6, 3, 7]` (The last / deepest node recorded at each unique $HD$).
- **Vertical Order Traversal:** Sorted columns: $\text{Col}_{-3}: [8]$, $\text{Col}_{-2}: [4]$, $\text{Col}_{-1}: [2, 9]$, $\text{Col}_{0}: [1, 5, 6]$, $\text{Col}_{+1}: [3]$, $\text{Col}_{+2}: [7]$.

---

### 2. Anti-Clockwise Boundary Traversal

Constructs the outer perimeter path of the tree in anti-clockwise orientation:
1. **Root Node:** Included first (`1`).
2. **Left Boundary (Top-Down):** Follow left pointers (or right if left is null), excluding leaf nodes: `[2, 4]`.
3. **Leaf Nodes (Left-to-Right):** All leaves collected via DFS in sequence: `[8, 9, 5, 6, 7]`.
4. **Right Boundary (Bottom-Up):** Follow right pointers (or left if right is null) from root downwards, excluding leaves; reverse the collection before appending: `[3]`.

Final Boundary Traversal sequence: `[1, 2, 4, 8, 9, 5, 6, 7, 3]`.

---

## Master Comparison Matrix: Tree Traversal Protocols

| Traversal Protocol | Sequence Rule | Data Structure | Time Complexity | Auxiliary Space | Key Production Application |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Preorder** | Root $\to$ Left $\to$ Right | LIFO Stack | $\Theta(n)$ | $O(h)$ | Tree cloning, prefix serialization |
| **Inorder** | Left $\to$ Root $\to$ Right | LIFO Stack | $\Theta(n)$ | $O(h)$ | **BST sorted sequence verification** |
| **Postorder** | Left $\to$ Right $\to$ Root | LIFO Stack | $\Theta(n)$ | $O(h)$ | Memory deallocation, subtree height/diameter |
| **Morris Inorder** | Left $\to$ Root $\to$ Right | In-Place Threading | $\Theta(n)$ | $\mathbf{O(1)}$ | Embedded / memory-critical environments |
| **Level Order** | Layer-by-Layer | FIFO Queue | $\Theta(n)$ | $O(W) = \Theta(n)$ | Shortest unweighted paths, level printing |
| **Zigzag Order** | Alternating Directions | FIFO Queue + Array | $\Theta(n)$ | $O(W) = \Theta(n)$ | Spiral visualization, UI layouts |
| **Top View** | First node at each $HD$ | BFS + Hash Map | $\Theta(n \log n)$ | $O(n)$ | 2D silhouette rendering, camera projection |
| **Bottom View** | Last node at each $HD$ | BFS + Hash Map | $\Theta(n \log n)$ | $O(n)$ | Ground-up occlusion mapping |
| **Boundary Traversal**| Perimeter cycle | Recursive DFS | $\Theta(n)$ | $O(h)$ | Convex hull approximations, game boundary |

---

## Module 02 Summary & Key Takeaways

1. **DFS Space Invariant:** Standard DFS traversals (Preorder, Inorder, Postorder) consume $O(h)$ auxiliary stack memory. In skewed trees ($h = n$), this risks stack overflow without heap allocation.
2. **BST Inorder Guarantee:** Inorder traversal visits Binary Search Tree nodes in strictly ascending sorted order; any violation indicates a corrupted BST invariant.
3. **Morris Constant-Space Traversal:** Morris traversal uses temporary right-pointer threads from predecessor leaves to ancestors, enabling $O(n)$ time with strictly $O(1)$ auxiliary space while fully restoring the tree structure.
4. **BFS Width Bottleneck:** Level-order traversal consumes queue memory proportional to the maximum level width $W = \lceil n/2 \rceil \implies \Theta(n)$.
5. **Horizontal Distance Projections:** Geometric tree views (Vertical Order, Top View, Bottom View) project nodes onto Cartesian horizontal distance columns ($HD_{\text{left}} = HD - 1, HD_{\text{right}} = HD + 1$) resolved via BFS.

---

## References & Academic Attribution

1. **Morris, J. H.** (1979). Traversing binary trees simply with stack. *Information Processing Letters*, 9(4), 197–200.
2. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.3.1: Traversing Binary Trees. Addison-Wesley.
3. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Section 12.1: What is a binary search tree? (Inorder tree walk proof). MIT Press.
4. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 3.2: Binary Search Trees. Addison-Wesley.

