# Part 06: Trees — Module 05: Red-Black Trees (RBT)

> **Topics Covered:**  
> 88a. Red-Black Tree Architecture & Motivation &bull; 88b. The 5 Structural Red-Black Tree Properties &bull; 88c. Mathematical Proof: Height $h \le 2\log_2(n+1)$ &bull; 88d. Rotations in Red-Black Trees &bull; 88e. Insertion Algorithm & The 3 Uncle Fixup Cases &bull; 88f. Deletion Algorithm & The 4 Double-Black Fixup Cases &bull; 88g. Red-Black Tree vs AVL Tree Trade-Off Analysis &bull; 88h. Real-World Applications (Linux CFS, C++ STL, Java Collections)

---

# TOPIC 88a & 88b: DEFINITION & THE 5 Structural INVARIANTS

### 1. Motivation: Why Red-Black Trees?
While AVL trees maintain near-perfect balance (height $h \le 1.44 \log_2 n$), they require frequent rotations during insertions and especially deletions (where rotations can cascade all the way to the root).  
**Red-Black Trees** (invented by Rudolf Bayer in 1972 as Symmetric Binary B-Trees, formalized by Guibas & Sedgewick in 1978) relax the balance constraint slightly (height $h \le 2 \log_2(n+1)$) using a 1-bit color attribute (`RED` or `BLACK`) per node.  
- **Maximum rotations on Insert**: At most **2 rotations**.
- **Maximum rotations on Delete**: At most **3 rotations**.
This makes Red-Black Trees significantly faster in write-heavy environments, making them the standard choice in Linux kernel internals (`rbtree.c`), C++ (`std::map`, `std::set`), and Java (`java.util.TreeMap`).

---

### 2. The 5 Structural Red-Black Tree Invariants

Every valid Red-Black Tree must strictly satisfy all 5 properties at all times:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        THE 5 RED-BLACK TREE INVARIANTS                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Node Color:     Every node is colored either RED or BLACK.                          │
│ 2. Root Property:  The root of the tree is always BLACK.                               │
│ 3. Leaf Property:  Every leaf (NIL sentinel node at the bottom) is BLACK.              │
│ 4. Red Property:   If a node is RED, both of its children must be BLACK.               │
│                    (Equivalently: No two RED nodes may appear consecutively on a path).│
│ 5. Black-Height:   For every node u, all simple paths from u to descendant leaves      │
│                    contain the EXACT SAME number of BLACK nodes (denoted bh(u)).       │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

```text
VISUALIZING A VALID RED-BLACK TREE:
                       [ 20 (B) ]                     bh = 2
                     /            \
             [ 10 (R) ]          [ 30 (B) ]
            /          \        /          \
        [ 5 (B) ]   [ 15 (B) ] [NIL(B)]   [ 40 (R) ]
        /      \    /        \            /        \
     [NIL]   [NIL] [NIL]    [NIL]      [NIL]      [NIL]

Note: Every path from Root (20) to any NIL leaf passes through exactly 2 BLACK nodes!
```

---

# TOPIC 88c: MATHEMATICAL PROOF OF HEIGHT BOUND $h \le 2\log_2(n+1)$

### Theorem
A Red-Black Tree with $n$ internal nodes has height at most:
$$h \le 2 \log_2(n + 1)$$

### Formal Proof

**Step 1: Subtree Size Lemma**  
*Claim*: The subtree rooted at any node $x$ contains at least $2^{bh(x)} - 1$ internal nodes.  
*Proof by induction on the height of $x$*:
- **Base Case**: If height $h(x) = 0$, $x$ is a leaf (`NIL`). Its black-height $bh(x) = 0$, and internal nodes $= 2^0 - 1 = 0$. Holds true.
- **Inductive Step**: Consider an internal node $x$ with height $h(x) > 0$ and two children $c_1, c_2$.
  - If child $c_i$ is RED, $bh(c_i) = bh(x)$ (since the child's color does not add to black-height).
  - If child $c_i$ is BLACK, $bh(c_i) = bh(x) - 1$.
  - In either case: $bh(c_i) \ge bh(x) - 1$.
  - By inductive hypothesis, each child's subtree contains at least $2^{bh(x)-1} - 1$ internal nodes.
  - Adding node $x$ itself:
    $$\text{Internal Nodes}(x) \ge 1 + (2^{bh(x)-1} - 1) + (2^{bh(x)-1} - 1) = 2 \cdot 2^{bh(x)-1} - 1 = 2^{bh(x)} - 1$$
  - The lemma is proven by mathematical induction. $\blacksquare$

**Step 2: Linking Black-Height to Total Height**  
- According to **Invariant 4 (Red Property)**, no two RED nodes can be adjacent.
- Therefore, on any simple path from the root to a leaf, at least half of the nodes (excluding the root itself) must be BLACK.
- Consequently:
  $$bh(\text{root}) \ge \frac{h}{2}$$

**Step 3: Combining the Inequalities**  
Let $n$ be the number of internal nodes in the entire tree:
$$n \ge 2^{bh(\text{root})} - 1 \ge 2^{h/2} - 1$$
$$n + 1 \ge 2^{h/2}$$
Taking $\log_2$ on both sides:
$$\log_2(n + 1) \ge \frac{h}{2} \implies \mathbf{h \le 2 \log_2(n + 1)}$$

$$\therefore \text{Search, Insertion, and Deletion are strictly } \mathbf{\Theta(\log n)} \text{ worst-case!} \quad \blacksquare$$

---

# TOPIC 88e: INSERTION ALGORITHM & THE 3 UNCLE CASES

### 1. Insertion Strategy
1. Perform standard Binary Search Tree insertion to insert the new node $z$ at a leaf position.
2. **Color the new node $z$ RED**:
   - Why RED? Because coloring it BLACK would immediately violate Invariant 5 (Black-Height) along that path.
   - If $z$ is the root, simply recolor it BLACK (satisfies Invariant 2).
   - If $z$'s parent is BLACK, all invariants are satisfied; terminate!
3. If $z$'s parent $p$ is RED, Invariant 4 is violated (**Double Red**). We must call `InsertFixup(z)`.

---

### 2. The 3 Insertion Rebalancing Cases (Parent is Left Child of Grandparent)

Let $z$ be the newly inserted node, $p$ its parent, $g$ its grandparent, and $y$ its **uncle** (sibling of $p$):

```text
CASE CLASSIFICATION:
- CASE 1: Uncle y is RED                     ──► RECOLOR (Parent, Uncle, Grandparent) & propagate up
- CASE 2: Uncle y is BLACK & z is Right Child ──► ROTATE PARENT (Convert Triangle to Line) ──► CASE 3
- CASE 3: Uncle y is BLACK & z is Left Child  ──► ROTATE GRANDPARENT & SWAP COLORS
```

#### Case 1: Uncle $y$ is RED (Color Flip)
Both parent $p$ and uncle $y$ are RED.
- **Action**:
  1. Recolor parent $p \leftarrow \text{BLACK}$.
  2. Recolor uncle $y \leftarrow \text{BLACK}$.
  3. Recolor grandparent $g \leftarrow \text{RED}$.
  4. Advance pointer: $z \leftarrow g$ and repeat check upward!

```text
BEFORE CASE 1:                                 AFTER CASE 1:
            [ g (B) ]                                      [ g (R) ]  <-- advance z here
           /         \                                    /         \
       [ p (R) ]   [ y (R) ]                 ──►      [ p (B) ]   [ y (B) ]
       /                                              /
   [ z (R) ]                                      [ z (R) ]
```

#### Case 2: Uncle $y$ is BLACK & $z$ is Right Child (Triangle / Inside Child)
$z$, $p$, and $g$ form a zigzag (triangle).
- **Action**:
  1. Left-rotate around parent $p$: `LeftRotate(p)`.
  2. Re-label $z \leftarrow p$ (now $z$ and its new parent form a straight line, which is **Case 3**).

```text
BEFORE CASE 2 (Triangle):                      AFTER LEFT-ROTATE (Case 3 Line):
            [ g (B) ]                                      [ g (B) ]
           /         \                                    /         \
       [ p (R) ]   [ y (B) ]                 ──►      [ z (R) ]   [ y (B) ]
            \                                         /
          [ z (R) ]                               [ p (R) ]
```

#### Case 3: Uncle $y$ is BLACK & $z$ is Left Child (Line / Outside Child)
$z$, $p$, and $g$ form a straight line.
- **Action**:
  1. Recolor parent $p \leftarrow \text{BLACK}$.
  2. Recolor grandparent $g \leftarrow \text{RED}$.
  3. Right-rotate around grandparent $g$: `RightRotate(g)`.
  4. All invariants are restored; **TERMINATE**!

```text
BEFORE CASE 3 (Line):                          AFTER RIGHT-ROTATE & RECOLOR:
            [ g (B) ]                                      [ p (B) ]
           /         \                                    /         \
       [ p (R) ]   [ y (B) ]                 ──►      [ z (R) ]   [ g (R) ]
       /                                                                \
   [ z (R) ]                                                          [ y (B) ]
```

*(Note: If parent $p$ is the right child of grandparent $g$, the symmetric mirror cases apply with Left and Right swapped).*

---

### 3. Pseudocode: Complete Red-Black Tree Insertion Fixup

```text
ALGORITHM InsertFixup(T, z):
1.  while z.parent ≠ NULL and z.parent.color = RED:
2.      if z.parent = z.parent.parent.left:
3.          uncle ← z.parent.parent.right
4.          // CASE 1: Uncle is RED
5.          if uncle ≠ NULL and uncle.color = RED:
6.              z.parent.color ← BLACK
7.              uncle.color ← BLACK
8.              z.parent.parent.color ← RED
9.              z ← z.parent.parent
10.         else:
11.             // CASE 2: Uncle is BLACK & z is Right child (Triangle)
12.             if z = z.parent.right:
13.                 z ← z.parent
14.                 LeftRotate(T, z)
15.             // CASE 3: Uncle is BLACK & z is Left child (Line)
16.             z.parent.color ← BLACK
17.             z.parent.parent.color ← RED
18.             RightRotate(T, z.parent.parent)
19.     else:
20.         // Symmetric mirror cases (Parent is Right child of Grandparent)
21.         uncle ← z.parent.parent.left
22.         if uncle ≠ NULL and uncle.color = RED:
23.             z.parent.color ← BLACK
24.             uncle.color ← BLACK
25.             z.parent.parent.color ← RED
26.             z ← z.parent.parent
27.         else:
28.             if z = z.parent.left:
29.                 z ← z.parent
30.                 RightRotate(T, z)
31.             z.parent.color ← BLACK
32.             z.parent.parent.color ← RED
33.             LeftRotate(T, z.parent.parent)
34. T.root.color ← BLACK
```

---

# TOPIC 88f: DELETION ALGORITHM & THE 4 DOUBLE-BLACK CASES

### 1. Deletion Mechanics
1. Perform standard BST deletion of node $v$. If $v$ has two children, swap its value with its Inorder Successor $s$ and delete $s$ instead. Thus, the spliced node $y$ has at most one non-NIL child $x$.
2. Splice out node $y$ and let $x$ take its place.
3. If the removed node $y$ was **RED**:
   - No black-height invariant is violated; tree remains completely valid!
4. If the removed node $y$ was **BLACK**:
   - The path through $x$ is now short by 1 black node.
   - We conceptually assign an extra unit of blackness to $x$, making $x$ **DOUBLE BLACK** (or `RED-AND-BLACK` if $x$ was red).
   - If $x$ is `RED-AND-BLACK`, simply recolor $x$ to `BLACK`; done!
   - If $x$ is `DOUBLE BLACK`, call `DeleteFixup(x)`.

---

### 2. The 4 Double-Black Rebalancing Cases

Let $x$ be the Double-Black node, $p$ its parent, and $w$ its **sibling**:

```text
CASE 1: Sibling w is RED
        ──► Rotate parent p, recolor parent RED and sibling BLACK.
        ──► Reduces to Case 2, 3, or 4 with new sibling.

CASE 2: Sibling w is BLACK, and BOTH of w's children are BLACK
        ──► Remove black from x and w (w becomes RED).
        ──► Extra black absorbed by parent p (p becomes DOUBLE BLACK). Propagate upward!

CASE 3: Sibling w is BLACK, w's inner child is RED, outer child is BLACK
        ──► Rotate sibling w away from inner child, swap colors of w and inner child.
        ──► Transforms immediately into Case 4!

CASE 4: Sibling w is BLACK, and w's outer child is RED
        ──► Rotate parent p toward x.
        ──► Sibling w takes parent's color; parent and outer child become BLACK.
        ──► Double-black completely absorbed! TERMINATE.
```

---

# TOPIC 88g: RED-BLACK TREE VS AVL TREE COMPARISON

| Feature | AVL Tree | Red-Black Tree |
| :--- | :--- | :--- |
| **Strict Balance Factor** | $|BF| \le 1$ | Height $h \le 2 \log_2(n+1)$ |
| **Maximum Tree Height** | $\approx 1.44 \log_2 n$ | $\approx 2.00 \log_2 n$ |
| **Lookup Performance** | **Faster** (more strictly balanced) | Slightly slower (~20% deeper paths) |
| **Insertion Rotations** | $\le 2$ rotations | $\le 2$ rotations |
| **Deletion Rotations** | **$O(\log n)$** (can propagate to root) | **$\le 3$ rotations strictly guaranteed** |
| **Color/Balance Overhead** | 2 bits per node (balance factor) | 1 bit per node (red/black) |
| **Primary Use Case** | Read-heavy workloads (Lookup intensive) | Write-heavy & General Purpose (`std::map`, CFS) |

---

## Module 05 Summary & Key Takeaways

1. A **Red-Black Tree** guarantees worst-case $O(\log n)$ time for Search, Insert, and Delete by enforcing 5 invariants, most notably that no two RED nodes are adjacent and every path from root to leaf has identical black-height.
2. The height of an RBT with $n$ internal nodes is mathematically bounded by $h \le 2\log_2(n+1)$.
3. Insertion requires at most **2 rotations**; deletion requires at most **3 rotations**.
4. Standard libraries across the software industry (Linux kernel, C++ STL, Java standard library) prefer Red-Black Trees over AVL trees due to significantly cheaper rebalancing during frequent modifications.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 12–13 (BSTs and Red-Black Trees) & Chapter 18 (B-Trees). MIT Press.
2. **Bayer, R., & McCreight, E.** (1972). Organization and maintenance of large ordered indices. *Acta Informatica*, 1(3), 173–189.
3. **Sleator, D. D., & Tarjan, R. E.** (1985). Self-adjusting binary search trees. *Journal of the ACM (JACM)*, 32(3), 652–686.
