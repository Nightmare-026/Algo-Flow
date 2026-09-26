# Part 06: Trees — Module 06: Splay Trees & Treaps (Randomized Cartesian Trees)

> Splay Trees and Treaps dispense with rigid deterministic balancing factors in favor of self-adjusting heuristics and randomized priorities. Splay trees exploit temporal locality to guarantee amortized $O(\log n)$ performance with zero metadata overhead, while Treaps combine BST keys with heap priorities to provide expected $O(\log n)$ search times and elegant $O(\log n)$ split-and-merge array slicing.

---

## 1. Executive Summary & Learning Objectives

Invented by Daniel Sleator and Robert Tarjan in 1985, the Splay Tree is a self-adjusting binary search tree that moves accessed nodes to the root via splay rotations without storing balance factors, heights, or color bits. Invented by Raimund Seidel and Cecilia Aragon in 1989, the Treap (Tree + Heap) merges binary search ordering on keys with max-heap ordering on randomly assigned priorities to guarantee a unique Cartesian tree with expected logarithmic height.

By the end of this chapter, you will be able to:

1. **Analyze** the self-adjusting mechanics of Splay Trees and prove why rotating the grandparent first in the Zig-Zig configuration cuts tree depth in half.
2. **Formulate** Tarjan's potential function $\Phi(T)$ and explain the Access Lemma establishing amortized $O(\log n)$ bound per operation.
3. **Differentiate** between standard Splay rotations: terminal Zig, homogeneous Zig-Zig, and heterogeneous Zig-Zag.
4. **Prove** the Cartesian Uniqueness Theorem for Treaps and demonstrate why randomized priorities produce expected $O(\log n)$ height.
5. **Implement** the universal Treap primitives (`Split` and `Merge`) and apply Implicit Treaps to execute $O(\log n)$ dynamic array range reversals.

---

## 2. Splay Tree Principles & Self-Adjusting Heuristics

A Splay Tree stores no metadata per node beyond its key, left, right, and parent pointers. Whenever any key is accessed (searched, inserted, or deleted), the target node is **splayed** (rotated) through a sequence of local tree rotations until it becomes the new root of the tree.

### The Temporal Locality Advantage

In real-world workloads (e.g., caches, memory allocation page tables, network routers), memory access distributions follow the Pareto 80/20 rule: roughly 80% of operations access a working set of 20% of items. Splaying continually pulls accessed items toward the top of the tree, rendering frequent operations near $O(1)$.

### The Three Splay Rotation Configurations

Let $X$ be the active node being splayed upward, $P$ its parent, and $G$ its grandparent:

| Rotation Configuration      | Structural Geometric Pattern                                                      | Surgical Action Order                                                            | Primary Effect on Path Depth                                                               |
| :-------------------------- | :-------------------------------------------------------------------------------- | :------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| **Zig (Terminal Case)**     | $P$ is the tree root ($G = \text{null}$). $X$ is either left or right child.      | Execute single `RotateRight(P)` or `RotateLeft(P)`.                              | Moves $X$ into root position. Performed at most once per splay.                            |
| **Zig-Zig (Homogeneous)**   | $X$ and $P$ are **both left children** or **both right children** (linear chain). | **CRITICAL**: Rotate grandparent $G$ first, then rotate parent $P$!              | **Cuts the depth of the entire path roughly in half**, progressively rebalancing the tree. |
| **Zig-Zag (Heterogeneous)** | $X$ is right child of $P$ and $P$ is left child of $G$ (or vice versa).           | Rotate parent $P$ first, then rotate grandparent $G$ (standard double rotation). | Moves $X$ up two levels; identical to AVL LR/RL double rotations.                          |

---

### Why Rotate Grandparent First in Zig-Zig?

If we naively rotated $P$ then $G$ (as in standard bottom-up single rotations), a degenerate linear path of length $n$ would simply be reversed into another linear path of length $n$, doing nothing to compress path length. By rotating the grandparent $G$ first, all nodes along the path have their depths halved:

| Topological Element     | Before Zig-Zig ($X$ and $P$ both left children) | After Zig-Zig ($G$ rotated right first, then $P$ rotated right) |
| :---------------------- | :---------------------------------------------- | :-------------------------------------------------------------- |
| **Subtree Root**        | Node $G$                                        | Node $X$                                                        |
| **Left Child of Root**  | Node $P$                                        | Subtree $A$ (Left child of $X$)                                 |
| **Right Child of Root** | Subtree $D$                                     | Node $P$                                                        |
| **Left Child of $P$**   | Node $X$                                        | Subtree $B$ (Right child of $X$)                                |
| **Right Child of $P$**  | Subtree $C$                                     | Node $G$                                                        |
| **Subtrees of $G$**     | Left: $P$, Right: $D$                           | Left: $C$, Right: $D$                                           |

$$\text{Inorder Sequence Invariant}: \quad \text{keys}(A) < X < \text{keys}(B) < P < \text{keys}(C) < G < \text{keys}(D)$$

---

## 3. Tarjan Potential Function & Amortized Complexity

While an individual splay operation in a skewed tree can take $O(n)$ time, Robert Tarjan proved using the potential method that any sequence of $m$ operations on an $n$-node splay tree takes at most $O(m \log n)$ time.

### The Potential Function

For any node $x$ in tree $T$, let $s(x)$ denote the size of the subtree rooted at $x$ (number of nodes). The **rank** of node $x$ is defined as:

$$r(x) = \log_2(s(x))$$

The global **potential function** $\Phi(T)$ is the sum of ranks across all nodes in $T$:

$$\Phi(T) = \sum_{x \in T} r(x) = \sum_{x \in T} \log_2(s(x))$$

### The Splay Access Lemma

_The amortized time to splay a node $x$ in a tree with root $t$ is:_

$$\hat{c} \le 3(r(t) - r(x)) + 1 = O(\log n)$$

Because $r(t) = \log_2 n$ and $r(x) \ge 0$, the amortized cost per search, insertion, or deletion is strictly bounded by $O(\log n)$.

---

## 4. Complete Implementation: Splay Tree Operations

```typescript
export class SplayNode<T> {
  key: T;
  left: SplayNode<T> | null = null;
  right: SplayNode<T> | null = null;
  parent: SplayNode<T> | null = null;

  constructor(key: T) {
    this.key = key;
  }
}

export class SplayTree<T> {
  root: SplayNode<T> | null = null;

  private rotateRight(p: SplayNode<T>): void {
    const x = p.left!;
    p.left = x.right;
    if (x.right !== null) x.right.parent = p;

    x.parent = p.parent;
    if (p.parent === null) {
      this.root = x;
    } else if (p === p.parent.left) {
      p.parent.left = x;
    } else {
      p.parent.right = x;
    }

    x.right = p;
    p.parent = x;
  }

  private rotateLeft(p: SplayNode<T>): void {
    const x = p.right!;
    p.right = x.left;
    if (x.left !== null) x.left.parent = p;

    x.parent = p.parent;
    if (p.parent === null) {
      this.root = x;
    } else if (p === p.parent.left) {
      p.parent.left = x;
    } else {
      p.parent.right = x;
    }

    x.left = p;
    p.parent = x;
  }

  public splay(x: SplayNode<T>): void {
    while (x.parent !== null) {
      const p = x.parent;
      const g = p.parent;

      if (g === null) {
        // Case 1: Zig
        if (x === p.left) this.rotateRight(p);
        else this.rotateLeft(p);
      } else if (x === p.left && p === g.left) {
        // Case 2a: Zig-Zig (Rotate G first, then P!)
        this.rotateRight(g);
        this.rotateRight(p);
      } else if (x === p.right && p === g.right) {
        // Case 2b: Zig-Zig (Rotate G first, then P!)
        this.rotateLeft(g);
        this.rotateLeft(p);
      } else if (x === p.right && p === g.left) {
        // Case 3a: Zig-Zag
        this.rotateLeft(p);
        this.rotateRight(g);
      } else {
        // Case 3b: Zig-Zag
        this.rotateRight(p);
        this.rotateLeft(g);
      }
    }
  }

  public search(key: T): SplayNode<T> | null {
    let curr = this.root;
    let last: SplayNode<T> | null = null;

    while (curr !== null) {
      last = curr;
      if (key < curr.key) curr = curr.left;
      else if (key > curr.key) curr = curr.right;
      else {
        this.splay(curr);
        return curr;
      }
    }

    if (last !== null) this.splay(last);
    return null;
  }
}
```

---

## 5. Treaps: Duality of Tree + Heap

A Treap (Tree + Heap) assigns every item two distinct properties:

1. **Key $K$**: Maintains the symmetric **Binary Search Tree Invariant** ($y.\text{key} < x.\text{key} < z.\text{key}$).
2. **Priority $P$**: Generated **uniformly at random** upon creation; maintains the **Max-Heap Invariant** ($x.\text{priority} \ge x.\text{left}.\text{priority}$ and $x.\text{priority} \ge x.\text{right}.\text{priority}$).

### Cartesian Uniqueness Theorem

_For any set of pairs $\{(K_1, P_1), (K_2, P_2), \dots, (K_n, P_n)\}$ with distinct keys and distinct priorities, there exists exactly one unique Treap structure._

**Proof Sketch**:

1. The pair with the maximal priority $P_{\max}$ must unconditionally serve as the **Root** of the tree to satisfy the Max-Heap property.
2. By the BST property, all pairs with $K_i < K_{\text{root}}$ must fall into the left subtree, and all pairs with $K_i > K_{\text{root}}$ must fall into the right subtree.
3. Applying this logic inductively down each partition defines a unique topological tree. $\blacksquare$

Because priorities are chosen uniformly at random, every key permutation is equally likely. Thus, the expected height of a Treap matches that of a randomly generated BST:

$$\mathbf{E}[\text{Height}] = \mathbf{\Theta(\log n)}$$

---

## 6. Core Treap Primitives: Split and Merge

Instead of maintaining explicit balance factors and complex rotation cases, modern Treap implementations operate exclusively via two $O(\log n)$ building blocks:

| Primitive           | Preconditions                                                                                  | Input Arguments                            | Output Return Values                                                                                                             | Purpose                                                              |
| :------------------ | :--------------------------------------------------------------------------------------------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- |
| **`Split(T, val)`** | $T$ is a valid Treap.                                                                          | Tree root $T$, split threshold `val`.      | Two valid Treaps $(L, R)$ where $\forall u \in L: u.\text{key} \le \text{val}$ and $\forall v \in R: v.\text{key} > \text{val}$. | Partitions a tree into two subtrees along key boundary.              |
| **`Merge(L, R)`**   | **Crucial**: All keys in $L$ must be strictly less than all keys in $R$ ($\max(L) < \min(R)$). | Left Treap root $L$, Right Treap root $R$. | A single merged Treap $T$.                                                                                                       | Joins two disjoint subtrees respecting both BST and Heap invariants. |

```typescript
export class TreapNode<T> {
  key: T;
  priority: number;
  left: TreapNode<T> | null = null;
  right: TreapNode<T> | null = null;

  constructor(key: T, priority: number = Math.random()) {
    this.key = key;
    this.priority = priority;
  }
}

export function split<T>(
  t: TreapNode<T> | null,
  val: T
): [TreapNode<T> | null, TreapNode<T> | null] {
  if (t === null) return [null, null];

  if (t.key <= val) {
    const [subL, subR] = split(t.right, val);
    t.right = subL;
    return [t, subR];
  } else {
    const [subL, subR] = split(t.left, val);
    t.left = subR;
    return [subL, t];
  }
}

export function merge<T>(l: TreapNode<T> | null, r: TreapNode<T> | null): TreapNode<T> | null {
  if (l === null) return r;
  if (r === null) return l;

  if (l.priority > r.priority) {
    l.right = merge(l.right, r);
    return l;
  } else {
    r.left = merge(l, r.left);
    return r;
  }
}
```

---

## 7. Implicit Treap: Dynamic Arrays with $O(\log n)$ Range Reversals

An **Implicit Treap** does not store explicit keys. Instead, the key of a node is implicitly determined by its 1-based index in the in-order traversal:

$$\text{Index}(X) = \text{SubtreeSize}(X.\text{left}) + 1$$

Each node tracks $\text{size}(u) = 1 + \text{size}(u.\text{left}) + \text{size}(u.\text{right})$.

### Range Reversal in $O(\log n)$

To reverse the subarray $[l, r]$:

1. `split(T, r)` into $(T_1, T_{>r})$.
2. `split(T_1, l - 1)` into $(T_{<l}, T_{\text{target}})$.
3. $T_{\text{target}}$ now isolates exactly the subarray $[l, r]$.
4. Toggle a lazy boolean `reversed` flag at $T_{\text{target}}$'s root (which pushes down child pointer swaps on demand).
5. `merge(merge(T_{<l}, T_{\text{target}}), T_{>r})$ to restore the global tree.

---

## 8. Comparative Analysis: Splay Tree vs. Treap vs. AVL/Red-Black

| Dimension              | Splay Tree                                   | Treap                                   | AVL / Red-Black Tree                    |
| :--------------------- | :------------------------------------------- | :-------------------------------------- | :-------------------------------------- |
| **Balance Mechanism**  | Self-adjusting heuristics (Splaying)         | Random priority heap ordering           | Deterministic height/color invariants   |
| **Worst-Case Search**  | $O(n)$ (Amortized $O(\log n)$)               | $O(n)$ (Expected $O(\log n)$)           | **Strictly $O(\log n)$ guaranteed**     |
| **Node Overhead**      | **0 extra bits** (Only pointers)             | 32-bit random priority integer          | 1-bit color or 2-bit balance factor     |
| **Primary Strength**   | Working-set caching, Pareto 80/20            | Code simplicity, split/merge slicing    | Mission-critical hard real-time latency |
| **Concurrency Safety** | Poor (read operations mutate tree structure) | Excellent (reads do not alter topology) | Excellent (read operations are pure)    |

---

## 9. Common Traps, Edge Cases & Implementation Pitfalls

1. **Splaying During Read Operations**:
   - In a Splay Tree, a `search` or `contains` query **must mutate the tree** by splaying the found node (or last accessed node) to the root. Treating search as a read-only const operation destroys the amortized $O(\log n)$ guarantee.
2. **Rotating the Wrong Node First in Zig-Zig**:
   - Rotating parent $P$ before grandparent $G$ in Zig-Zig fails to halve the path length, degrading sequential access to quadratic $O(n^2)$ time.
3. **Treap Merge Precondition Violation**:
   - Calling `merge(L, R)` when $\max(L) > \min(R)$ silently corrupts the Binary Search Tree invariant. Always verify or ensure that key ranges are strictly disjoint before merging.

---

## 10. References & Academic Attribution

1. **Sleator, D. D., & Tarjan, R. E.** (1985). Self-adjusting binary search trees. _Journal of the ACM (JACM)_, 32(3), 652–686.
2. **Aragon, C. R., & Seidel, R.** (1989). Randomized search trees. _30th Annual Symposium on Foundations of Computer Science (SFCS)_, 540–545. IEEE.
3. **Tarjan, R. E.** (1985). Amortized computational complexity. _SIAM Journal on Algebraic Discrete Methods_, 6(2), 306–318.
