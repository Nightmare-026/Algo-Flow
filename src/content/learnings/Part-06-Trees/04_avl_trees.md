# ⚖️ Part 06: Trees — Module 04: AVL Trees & Self-Balancing Rotations

> **Topics Covered:**  
> 83. AVL Tree Invariants & Theoretical Foundations &bull; 84. Balance Factor ($BF$) & Logarithmic Height Proof &bull; 85. Left-Left (LL) Single Right Rotation &bull; 86. Right-Right (RR) Single Left Rotation &bull; 87. Left-Right (LR) Double Rotation &bull; 88. Right-Left (RL) Double Rotation

---

# TOPIC 83 & 84: AVL TREE DEFINITION & BALANCE FACTOR

### 1. Definition
An **AVL Tree** (named after Soviet mathematicians Georgy **A**delson-**V**elsky and Evgenii **L**andis, 1962) is a self-balancing Binary Search Tree where the heights of the left and right subtrees of **every single node** differ by at most 1.

---

### 2. The Balance Factor ($BF$) Invariant
For every node $u$ in an AVL tree:

$$BF(u) = \text{Height}(\text{LeftSubtree}(u)) - \text{Height}(\text{RightSubtree}(u))$$

$$\mathbf{Inviolable \ AVL \ Invariant}: \quad BF(u) \in \{-1, \, 0, \, +1\}$$

- $BF(u) = +1$: Left-heavy (left child is 1 level taller).
- $BF(u) = 0$: Perfectly balanced.
- $BF(u) = -1$: Right-heavy (right child is 1 level taller).
- If $|BF(u)| \ge 2$, the node is **CRITICALLY UNBALANCED** and must be restored to balance via tree rotations!

---

### 3. Formal Mathematical Proof: AVL Tree Height is Strictly $O(\log n)$
Let $N(h)$ be the **minimum number of nodes** in an AVL tree of height $h$:
- For $h = 0$: $N(0) = 1$ (single root node).
- For $h = 1$: $N(1) = 2$ (root + 1 child).
- To construct the sparsest possible AVL tree of height $h$, one subtree must have height $h-1$ and the other must have height $h-2$:

$$N(h) = 1 + N(h - 1) + N(h - 2)$$

Notice the close resemblance to the **Fibonacci Numbers** ($F_k = F_{k-1} + F_{k-2}$):
$$N(h) = F_{h+2} - 1$$
Using Binet's formula for Fibonacci numbers with the Golden Ratio $\phi = \frac{1 + \sqrt{5}}{2} \approx 1.618$:
$$N(h) \approx \frac{\phi^{h+2}}{\sqrt{5}} - 1$$
Taking the base-2 logarithm of both sides:
$$h \le \frac{\log_2 n}{\log_2 \phi} \approx \frac{\log_2 n}{0.694} \approx \mathbf{1.44 \log_2 n}$$

$$\therefore \text{Height } h = \mathbf{\Theta(\log n)} \quad \text{guaranteed in the absolute worst case! } \blacksquare$$

---
---

# TOPICS 85–88: THE 4 REBALANCING ROTATIONS

Whenever an insertion or deletion pushes $|BF(u)| \ge 2$, the imbalance falls into exactly one of **4 canonical configurations**:

```text
IMBALANCE TYPE            DETECTION CONDITION                     REBALANCING ACTION
─────────────────────────────────────────────────────────────────────────────────────────────
1. Left-Left (LL)         BF(Node) = +2  and  BF(LeftChild) ≥ 0   Single RIGHT Rotation
2. Right-Right (RR)       BF(Node) = -2  and  BF(RightChild) ≤ 0  Single LEFT Rotation
3. Left-Right (LR)        BF(Node) = +2  and  BF(LeftChild) < 0   Double: Left(Child) + Right(Node)
4. Right-Left (RL)        BF(Node) = -2  and  BF(RightChild) > 0  Double: Right(Child) + Left(Node)
```

---

### 1. Left-Left (LL) Case $\implies$ Single Right Rotation

Occurs when a node is inserted into the **Left subtree of the Left child**:

```text
BEFORE (Imbalance at node Z, BF = +2):
              [ Z ]  (BF = +2)
             /     \
          [ Y ]    [ T3 ]                   [ Y ]
         /     \                ──►        /     \
      [ X ]    [ T2 ]                   [ X ]   [ Z ]
     /     \                           /     \  /    \
   [ T0 ]  [ T1 ]                    [T0]  [T1][T2] [T3]

ROTATION ACTION:
1. Y becomes the new root.
2. Z becomes Y's right child.
3. Y's original right subtree (T2) becomes Z's left subtree!
```

---

### 2. Right-Right (RR) Case $\implies$ Single Left Rotation

Occurs when a node is inserted into the **Right subtree of the Right child**:

```text
BEFORE (Imbalance at node Z, BF = -2):
          [ Z ]  (BF = -2)
         /     \
       [ T0 ]  [ Y ]                         [ Y ]
              /     \           ──►         /     \
            [ T1 ]  [ X ]                [ Z ]   [ X ]
                   /     \              /    \   /    \
                 [ T2 ]  [ T3 ]       [T0]  [T1][T2] [T3]

ROTATION ACTION:
1. Y becomes the new root.
2. Z becomes Y's left child.
3. Y's original left subtree (T1) becomes Z's right subtree!
```

---

### 3. Left-Right (LR) Case $\implies$ Double Rotation (Left, then Right)

Occurs when a node is inserted into the **Right subtree of the Left child**:

```text
STEP 1: Left-Rotate on Child Y:
          [ Z ] (BF = +2)                     [ Z ] (BF = +2)
         /     \                             /     \
       [ Y ]   [ T3 ]         ──►          [ X ]   [ T3 ]
      /     \                             /     \
    [ T0 ]  [ X ]                       [ Y ]   [ T2 ]
           /     \                     /     \
         [ T1 ]  [ T2 ]              [ T0 ]  [ T1 ]
         
STEP 2: Right-Rotate on Root Z:
                      [ X ]
                    /       \
                [ Y ]       [ Z ]
               /     \     /     \
             [ T0 ] [ T1 ][ T2 ] [ T3 ]
```

---

### 4. Right-Left (RL) Case $\implies$ Double Rotation (Right, then Left)
Symmetric counterpart to LR: Right-Rotate on right child $Y$, then Left-Rotate on root $Z$.

---

### 5. Complete Pseudocode: AVL Tree Insertion with Auto-Rebalance

```text
ALGORITHM RotateRight(y)
1.  x ← y.left
2.  T2 ← x.right
3.  x.right ← y
4.  y.left ← T2
5.  y.height ← 1 + max(Height(y.left), Height(y.right))
6.  x.height ← 1 + max(Height(x.left), Height(x.right))
7.  return x                   // New root of subtree

ALGORITHM RotateLeft(x)
1.  y ← x.right
2.  T2 ← y.left
3.  y.left ← x
4.  x.right ← T2
5.  x.height ← 1 + max(Height(x.left), Height(x.right))
6.  y.height ← 1 + max(Height(y.left), Height(y.right))
7.  return y                   // New root of subtree

ALGORITHM InsertAVL(node, key)
1.  // Step 1: Standard recursive BST insertion
2.  if node = NULL:
3.      return allocate Node(key)
4.  if key < node.key:
5.      node.left ← InsertAVL(node.left, key)
6.  else if key > node.key:
7.      node.right ← InsertAVL(node.right, key)
8.  else:
9.      return node             // Duplicate keys not allowed
10. // Step 2: Update height of this ancestor node
11. node.height ← 1 + max(Height(node.left), Height(node.right))
12. // Step 3: Compute balance factor
13. balance ← BalanceFactor(node)
14. // Step 4: Rebalance if needed (4 cases)
15. // Case 1: Left-Left (LL)
16. if balance > 1 and key < node.left.key:
17.     return RotateRight(node)
18. // Case 2: Right-Right (RR)
19. if balance < -1 and key > node.right.key:
20.     return RotateLeft(node)
21. // Case 3: Left-Right (LR)
22. if balance > 1 and key > node.left.key:
23.     node.left ← RotateLeft(node.left)
24.     return RotateRight(node)
25. // Case 4: Right-Left (RL)
26. if balance < -1 and key < node.right.key:
27.     node.right ← RotateRight(node.right)
28.     return RotateLeft(node)
29. return node
```

---

### 6. AVL Tree Complexity Matrix

| Operation | Best Case | Average Case | Worst Case | Auxiliary Space |
| :--- | :---: | :---: | :---: | :---: |
| **Search** | $\Theta(1)$ | $\Theta(\log n)$ | $\mathbf{\Theta(\log n)}$ | $O(1)$ |
| **Insert** | $\Theta(1)$ | $\Theta(\log n)$ | $\mathbf{\Theta(\log n)}$ | $O(\log n)$ |
| **Delete** | $\Theta(1)$ | $\Theta(\log n)$ | $\mathbf{\Theta(\log n)}$ | $O(\log n)$ |

---

## 🔁 Module 04 Summary & Key Takeaways

1. An **AVL Tree** maintains $|BF| \le 1$ at every node, strictly bounding height to $\le 1.44 \log_2 n$.
2. All search, insertion, and deletion operations run in guaranteed **$O(\log n)$ worst-case time**.
3. Rebalancing is accomplished in $O(1)$ time via **4 rotations**: Single rotations (LL, RR) or Double rotations (LR, RL).

---
[⬅️ Previous: Module 03 — Binary Search Trees](file:///d:/DSA/Part-06-Trees/03_binary_search_trees.md) | [Next: Module 05 — Red-Black Trees ➡️](file:///d:/DSA/Part-06-Trees/05_red_black_trees.md)
