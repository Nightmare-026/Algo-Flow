# Part 06: Trees — Module 06: Splay Trees & Treaps (Randomized Cartesian Trees)

> **Topics Covered:**  
> 88i. Splay Tree Principles & Self-Adjusting Heuristics &bull; 88j. Splay Rotations: Zig, Zig-Zig & Zig-Zag Mechanics &bull; 88k. Tarjan Potential Function & Amortized $O(\log n)$ Analysis &bull; 88l. Splay Operations: Search, Insert, Delete, Split & Merge &bull; 88m. Treap Duality: BST Key + Heap Priority &bull; 88n. Cartesian Uniqueness Theorem & Expected $O(\log n)$ Height &bull; 88o. Treap Split & Merge Core Primitives &bull; 88p. Implicit Treap: Dynamic Array with Range Reversals in $O(\log n)$

---

# TOPICS 88i–88l: SPLAY TREES (SELF-ADJUSTING BST)

### 1. Conceptual Motivation
Invented by Daniel Sleator and Robert Tarjan in 1985, a **Splay Tree** is a self-adjusting Binary Search Tree with a remarkable property: it maintains **no balance factors, no heights, and no node colors**.  
Instead, every time an element is accessed (searched, inserted, or deleted), it is **splayed** (rotated) all the way to become the **new root** of the tree.
- **Temporal Locality Heuristic**: In real-world workloads (e.g., caches, network routing tables, memory allocators), 80% of accesses target 20% of items (Pareto 80/20 rule). Splaying naturally places frequently accessed items near the top, giving them near-$O(1)$ access times!
- **Amortized Guarantee**: Any sequence of $m$ operations on an $n$-node splay tree takes at most $O(m \log n)$ time. The **amortized time per operation is strictly $O(\log n)$**!

---

### 2. Splay Rotations: Zig, Zig-Zig, and Zig-Zag

When splaying a node $X$ upward, we consider its relationship with its parent $P$ and grandparent $G$:

```text
ROTATION CASE CLASSIFICATION:
1. ZIG (Terminal Case):      P is the Root of the tree. Single rotation on P.
2. ZIG-ZIG (Homogeneous):    X and P are BOTH left children (or BOTH right children).
                             CRITICAL: ROTATE GRANDPARENT G FIRST, THEN ROTATE P!
3. ZIG-ZAG (Heterogeneous):  X is right child of P, and P is left child of G (or vice versa).
                             ROTATE P FIRST, THEN ROTATE G (Standard double rotation).
```

#### Why Rotate Grandparent First in Zig-Zig?
If we naively rotated $P$ then $G$ (standard single rotations), a degenerate linear path of length $n$ would simply be inverted, remaining a path of length $n$!  
By **rotating grandparent $G$ first**, the depth of the entire path is **cut roughly in half**, progressively rebalancing the tree as a side effect!

```text
THE ZIG-ZIG TRANSFORMATION (X and P both Left Children):

       BEFORE (Zig-Zig):                        AFTER (G rotated first, then P):
              [ G ]                                            [ X ]
             /     \                                          /     \
          [ P ]    [ D ]                                    [ A ]   [ P ]
         /     \                       ──►                         /     \
      [ X ]    [ C ]                                             [ B ]   [ G ]
     /     \                                                            /     \
   [ A ]   [ B ]                                                      [ C ]   [ D ]
```

```text
THE ZIG-ZAG TRANSFORMATION (P is Left child, X is Right child):

       BEFORE (Zig-Zag):                        AFTER (Standard Double Rotation):
              [ G ]                                            [ X ]
             /     \                                         /       \
          [ P ]    [ D ]               ──►               [ P ]       [ G ]
         /     \                                        /     \     /     \
       [ A ]   [ X ]                                  [ A ]   [ B ][ C ]  [ D ]
              /     \
            [ B ]   [ C ]
```

---

### 3. Splay Tree Fundamental Operations

```text
ALGORITHM Splay(T, x):
1.  while x.parent ≠ NULL:
2.      p ← x.parent
3.      g ← p.parent
4.      if g = NULL:
5.          // Case 1: Zig
6.          if x = p.left: RightRotate(T, p)
7.          else:          LeftRotate(T, p)
8.      else if x = p.left and p = g.left:
9.          // Case 2a: Zig-Zig (Rotate G first, then P!)
10.         RightRotate(T, g)
11.         RightRotate(T, p)
12.     else if x = p.right and p = g.right:
13.         // Case 2b: Zig-Zig (Rotate G first, then P!)
14.         LeftRotate(T, g)
15.         LeftRotate(T, p)
16.     else if x = p.right and p = g.left:
17.         // Case 3a: Zig-Zag
18.         LeftRotate(T, p)
19.         RightRotate(T, g)
20.     else:
21.         // Case 3b: Zig-Zag
22.         RightRotate(T, p)
23.         LeftRotate(T, g)

OPERATION Search(T, key):
1.  Traverse down via standard BST search.
2.  If key is found at node x: Splay(T, x); return x.
3.  If key not found: Splay(T, lastVisitedNode); return NULL.

OPERATION Insert(T, key):
1.  Insert node x via standard BST insertion.
2.  Splay(T, x). // x is now the new root!

OPERATION Delete(T, key):
1.  node ← Search(T, key). // Splays node to root!
2.  if node = NULL: return // Key not present
3.  L ← node.left, R ← node.right
4.  Sever L and R from node.
5.  if L = NULL: T.root ← R; return
6.  // Find max in L, splay it to L's root (it will have no right child!)
7.  curr ← L
8.  while curr.right ≠ NULL: curr ← curr.right
9.  Splay(L, curr) // curr is now root of L with curr.right = NULL
10. curr.right ← R
11. T.root ← curr
```

---

# TOPICS 88m–88p: TREAPS (RANDOMIZED CARTESIAN TREES)

### 1. The Treap Philosophy: Duality of Tree + Heap
Invented by Raimund Seidel and Cecilia Aragon in 1989, a **Treap** (contraction of **Tr**ee + H**eap**) is a binary search tree whose nodes store two distinct values:
1. **Key $K$**: Satisfies the **Binary Search Tree Property** (left $\le$ parent $\le$ right).
2. **Priority $P$**: Generated **uniformly at random** upon insertion; satisfies the **Max-Heap Property** ($\text{parent.priority} \ge \text{children.priorities}$).

```text
ANATOMY OF A TREAP NODE:
                 [ Key: "dog" | Priority: 94 ]
                 /                           \
[ Key: "cat" | Priority: 72 ]     [ Key: "fox" | Priority: 81 ]

- Horizontal BST order on Keys:      "cat" < "dog" < "fox"
- Vertical Max-Heap on Priorities:    94 > 72 and 94 > 81
```

---

### 2. Cartesian Uniqueness Theorem & Height Guarantee

$$\mathbf{Theorem}: \quad \text{For any set of pairs } \{(K_1, P_1), (K_2, P_2), \dots, (K_n, P_n)\} \text{ with distinct keys and priorities,}$$
$$\text{there exists \textbf{EXACTLY ONE} unique Treap structure!}$$

- **Proof Sketch**: The pair with the highest priority $P_{\max}$ must unconditionally be the **Root** (by the heap property). All pairs with $K_i < K_{\text{root}}$ must fall into the left subtree, and all pairs with $K_i > K_{\text{root}}$ must fall into the right subtree (by the BST property). Applying this recursively constructs a unique binary tree. $\blacksquare$
- **Height Analysis**: Because priorities are chosen uniformly at random, every permutation of keys into a BST is equally likely. Thus, the expected shape of a Treap is mathematically identical to a BST formed by inserting elements in random order!
$$\mathbf{E}[\text{Height}] = \mathbf{O(\log n)}$$

---

### 3. Core Treap Primitives: Split and Merge

Instead of cumbersome insertions and rotations, modern Treap algorithms rely on two universal $O(\log n)$ building blocks: `Split` and `Merge`.

```text
OPERATION Split(T, val) ──► Returns two Treaps (L, R) where:
- L contains all nodes with key ≤ val
- R contains all nodes with key > val

OPERATION Merge(L, R)   ──► Returns merged Treap T
- Prerequisite: All keys in L must be strictly less than all keys in R!
```

```text
ALGORITHM Split(T, val):
1.  if T = NULL: return (NULL, NULL)
2.  if T.key ≤ val:
3.      (T.right, R) ← Split(T.right, val)
4.      return (T, R)
5.  else:
6.      (L, T.left) ← Split(T.left, val)
7.      return (L, T)

ALGORITHM Merge(L, R):
1.  if L = NULL: return R
2.  if R = NULL: return L
3.  if L.priority > R.priority:
4.      L.right ← Merge(L.right, R)
5.      return L
6.  else:
7.      R.left ← Merge(L, R.left)
8.      return R
```

---

### 4. Implicit Treap: Dynamic Arrays & Range Reversal in $O(\log n)$

An **Implicit Treap** does not store explicit keys! Instead, the key of node $X$ is defined **implicitly** by its 1-based index in the in-order traversal:
$$\text{Index}(X) = \text{SubtreeSize}(X.\text{left}) + 1$$

Each node maintains a `size` field: $\text{size}(u) = 1 + \text{size}(u.\text{left}) + \text{size}(u.\text{right})$.

#### Revolutionary Capabilities of Implicit Treaps:
1. **Dynamic Insertion/Deletion at index $i$**: In $O(\log n)$ time (unlike static arrays which take $O(n)$ to shift elements).
2. **Range Reversal (`Reverse(l, r)`) in $O(\log n)$**:
   - `Split(T, r)` into $(T_1, T_{>r})$.
   - `Split(T_1, l - 1)` into $(T_{<l}, T_{\text{target}})$.
   - Now $T_{\text{target}}$ represents exactly the subarray $[l, r]$!
   - Apply a lazy `reversed` flag to $T_{\text{target}}$'s root (swap left and right children on the fly).
   - Re-merge the pieces together!

---

## Module 06 Summary & Key Takeaways

1. **Splay Trees** achieve amortized $O(\log n)$ performance without storing any balancing metadata by splaying accessed nodes to the root via Zig, Zig-Zig, and Zig-Zag rotations.
2. In Zig-Zig, **always rotate the grandparent first**, which cuts the depth of the traversal path in half.
3. A **Treap** combines a BST on keys and a Heap on random priorities, guaranteeing expected $O(\log n)$ height.
4. **Implicit Treaps** turn tree structures into ultra-fast dynamic arrays, enabling arbitrary range reversals, rotations, and range sum queries in $O(\log n)$ time.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 12–13 (BSTs and Red-Black Trees) & Chapter 18 (B-Trees). MIT Press.
2. **Bayer, R., & McCreight, E.** (1972). Organization and maintenance of large ordered indices. *Acta Informatica*, 1(3), 173–189.
3. **Sleator, D. D., & Tarjan, R. E.** (1985). Self-adjusting binary search trees. *Journal of the ACM (JACM)*, 32(3), 652–686.
