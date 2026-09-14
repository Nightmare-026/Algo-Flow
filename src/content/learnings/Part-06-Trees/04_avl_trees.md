# Part 06: Trees — Module 04: AVL Trees & Self-Balancing Rotations

> An AVL Tree enforces strict logarithmic height through rigid local invariants, guaranteeing worst-case $O(\log n)$ search, insertion, and deletion. By detecting imbalances immediately along the recursive call stack, four atomic tree rotations restore structural equilibrium in $O(1)$ pointer adjustments.

---

## 1. Executive Summary & Learning Objectives

An AVL Tree (named after Soviet mathematicians Georgy Adelson-Velsky and Evgenii Landis, 1962) is an augmented self-balancing Binary Search Tree where the heights of the left and right subtrees of every node differ by at most 1.

By the end of this chapter, you will be able to:
1. **Derive** the AVL balance factor invariant and reproduce the Fibonacci-based proof bounding tree height to $1.44 \log_2 n$.
2. **Classify** tree imbalances into the four canonical configurations: Left-Left (LL), Right-Right (RR), Left-Right (LR), and Right-Left (RL).
3. **Execute** single and double tree rotations through exact pointer reassignments and height recalculations in $O(1)$ time.
4. **Trace** an AVL insertion and rebalancing sequence step-by-step using a structured state execution table.
5. **Contrast** AVL trees with Red-Black trees regarding rotation frequency, lookup performance, and memory overhead.

---

## 2. The Balance Factor ($BF$) Invariant & Height Bound Proof

### Definition: Balance Factor
For every node $u$ in an AVL tree, the Balance Factor $BF(u)$ is defined as:

$$BF(u) = \text{Height}(\text{LeftSubtree}(u)) - \text{Height}(\text{RightSubtree}(u))$$

$$\mathbf{Inviolable \ AVL \ Invariant}: \quad BF(u) \in \{-1, \, 0, \, +1\}$$

| Balance Factor $BF(u)$ | Structural State | Operational Implication |
| :---: | :--- | :--- |
| **$+1$** | Left-heavy | Left subtree is 1 level taller than right subtree. Invariant satisfied. |
| **$0$** | Symmetrically balanced | Left and right subtrees have identical heights. Invariant satisfied. |
| **$-1$** | Right-heavy | Right subtree is 1 level taller than left subtree. Invariant satisfied. |
| **$\ge +2$ or $\le -2$** | Critically unbalanced | Invariant violated! Must be restored via immediate local tree rotation. |

*(Note: In by-convention implementations, $BF$ may be defined as $\text{Height}(\text{Right}) - \text{Height}(\text{Left})$; the mathematical properties are fully symmetric).*

### Formal Mathematical Proof: Worst-Case Height is Strictly $O(\log n)$
Let $N(h)$ denote the minimum number of nodes required to construct an AVL tree of height $h$:
- For $h = 0$: $N(0) = 1$ (a single root node).
- For $h = 1$: $N(1) = 2$ (root with one child).
- For height $h \ge 2$, to minimize total nodes while maintaining the AVL property, one child must have height $h - 1$ and the other must have height $h - 2$:

$$N(h) = 1 + N(h - 1) + N(h - 2)$$

This recurrence is closely related to the Fibonacci sequence ($F_k = F_{k-1} + F_{k-2}$):

$$N(h) = F_{h+2} - 1$$

Using Binet's formula for Fibonacci numbers with the Golden Ratio $\phi = \frac{1 + \sqrt{5}}{2} \approx 1.61803$:

$$F_{h+2} \approx \frac{\phi^{h+2}}{\sqrt{5}}$$

$$N(h) \approx \frac{\phi^{h+2}}{\sqrt{5}} - 1 \implies n + 1 \ge \frac{\phi^{h+2}}{\sqrt{5}}$$

Taking the base-$\phi$ logarithm:

$$h + 2 \le \log_{\phi}(\sqrt{5}(n + 1)) = \frac{\log_2(n + 1) + \log_2(\sqrt{5})}{\log_2 \phi}$$

Since $\log_2 \phi = \log_2(1.61803) \approx 0.69424$:

$$\frac{1}{\log_2 \phi} \approx \frac{1}{0.69424} \approx 1.44042$$

$$h \le 1.44042 \log_2(n + 1) - 0.3277 \implies h \le \mathbf{1.44 \log_2 n}$$

$$\therefore \text{Height } h = \mathbf{\Theta(\log n)} \quad \text{guaranteed in the absolute worst case! } \blacksquare$$

---

## 3. The Four Canonical Rebalancing Rotations

When an insertion or deletion causes a node $Z$ to violate the AVL invariant ($|BF(Z)| = 2$), the structural imbalance falls into one of four mutually exclusive cases:

| Imbalance Type | Condition at Node $Z$ | Condition at Heavy Child | Rebalancing Action |
| :--- | :--- | :--- | :--- |
| **Left-Left (LL)** | $BF(Z) = +2$ | $BF(Z.\text{left}) \ge 0$ | **Single Right Rotation** on $Z$ |
| **Right-Right (RR)** | $BF(Z) = -2$ | $BF(Z.\text{right}) \le 0$ | **Single Left Rotation** on $Z$ |
| **Left-Right (LR)** | $BF(Z) = +2$ | $BF(Z.\text{left}) < 0$ | **Double Rotation**: Left-Rotate child $Y$, then Right-Rotate root $Z$ |
| **Right-Left (RL)** | $BF(Z) = -2$ | $BF(Z.\text{right}) > 0$ | **Double Rotation**: Right-Rotate child $Y$, then Left-Rotate root $Z$ |

---

### Single Right Rotation (LL Case)

Applied when an insertion occurs in the left subtree of the left child of $Z$:

| Topological Role | Before Rotation | After Right Rotation | Pointer Adjustment |
| :--- | :--- | :--- | :--- |
| **Subtree Root** | Node $Z$ ($BF = +2$) | Node $Y$ ($BF = 0$) | $Y$ becomes the new parent/root of this subtree |
| **Left Child of Root** | Node $Y$ | Node $X$ (Unchanged) | $Y.\text{left}$ remains $X$ |
| **Right Child of Root** | Subtree $T_3$ | Node $Z$ ($BF = 0$) | $Y.\text{right}$ is set to $Z$ |
| **Transferred Subtree** | $T_2$ ($Y$'s original right child) | $Z$'s new left child | $Z.\text{left}$ is set to $T_2$ |

$$\text{Inorder Sequence Preserved}: \quad \text{keys}(T_0) < X < \text{keys}(T_1) < Y < \text{keys}(T_2) < Z < \text{keys}(T_3)$$

---

### Single Left Rotation (RR Case)

Applied when an insertion occurs in the right subtree of the right child of $Z$:

| Topological Role | Before Rotation | After Left Rotation | Pointer Adjustment |
| :--- | :--- | :--- | :--- |
| **Subtree Root** | Node $Z$ ($BF = -2$) | Node $Y$ ($BF = 0$) | $Y$ becomes the new parent/root of this subtree |
| **Left Child of Root** | Subtree $T_0$ | Node $Z$ ($BF = 0$) | $Y.\text{left}$ is set to $Z$ |
| **Right Child of Root** | Node $Y$ | Node $X$ (Unchanged) | $Y.\text{right}$ remains $X$ |
| **Transferred Subtree** | $T_1$ ($Y$'s original left child) | $Z$'s new right child | $Z.\text{right}$ is set to $T_1$ |

$$\text{Inorder Sequence Preserved}: \quad \text{keys}(T_0) < Z < \text{keys}(T_1) < Y < \text{keys}(T_2) < X < \text{keys}(T_3)$$

---

### Double Rotations: Left-Right (LR) and Right-Left (RL)

A single rotation cannot resolve an "inner" child imbalance (zigzag shape). Instead, two consecutive single rotations are executed:

| Step | Left-Right (LR) Procedure | Right-Left (RL) Procedure |
| :---: | :--- | :--- |
| **Phase 1** | Perform **Left Rotation** on $Z$'s left child ($Y$). This transforms the LL/LR zigzag into a purely linear LL chain. | Perform **Right Rotation** on $Z$'s right child ($Y$). This transforms the RR/RL zigzag into a purely linear RR chain. |
| **Phase 2** | Perform **Right Rotation** on unbalanced node $Z$. Node $X$ becomes the new subtree root. | Perform **Left Rotation** on unbalanced node $Z$. Node $X$ becomes the new subtree root. |
| **Result** | Subtree height is restored to its pre-insertion baseline with zero invariant violations. | Subtree height is restored to its pre-insertion baseline with zero invariant violations. |

---

## 4. Complete Implementation: AVL Tree Node, Rotations, and Insertion

```typescript
export class AVLNode<T> {
  key: T;
  height: number = 1;
  left: AVLNode<T> | null = null;
  right: AVLNode<T> | null = null;

  constructor(key: T) {
    this.key = key;
  }
}

function getHeight<T>(node: AVLNode<T> | null): number {
  return node ? node.height : 0;
}

function getBalanceFactor<T>(node: AVLNode<T> | null): number {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
}

function updateHeight<T>(node: AVLNode<T>): void {
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

export function rotateRight<T>(y: AVLNode<T>): AVLNode<T> {
  const x = y.left!;
  const T2 = x.right;

  // Perform rotation
  x.right = y;
  y.left = T2;

  // Update heights (order matters: bottom node first)
  updateHeight(y);
  updateHeight(x);

  return x; // New root of rotated subtree
}

export function rotateLeft<T>(x: AVLNode<T>): AVLNode<T> {
  const y = x.right!;
  const T2 = y.left;

  // Perform rotation
  y.left = x;
  x.right = T2;

  // Update heights (order matters: bottom node first)
  updateHeight(x);
  updateHeight(y);

  return y; // New root of rotated subtree
}

export function insertAVL<T>(node: AVLNode<T> | null, key: T): AVLNode<T> {
  // Step 1: Standard recursive BST insertion
  if (node === null) return new AVLNode(key);

  if (key < node.key) {
    node.left = insertAVL(node.left, key);
  } else if (key > node.key) {
    node.right = insertAVL(node.right, key);
  } else {
    return node; // Duplicate keys disallowed
  }

  // Step 2: Update height of ancestor node
  updateHeight(node);

  // Step 3: Check Balance Factor
  const balance = getBalanceFactor(node);

  // Step 4: Rebalance if required
  // Case 1: Left-Left (LL)
  if (balance > 1 && key < node.left!.key) {
    return rotateRight(node);
  }

  // Case 2: Right-Right (RR)
  if (balance < -1 && key > node.right!.key) {
    return rotateLeft(node);
  }

  // Case 3: Left-Right (LR)
  if (balance > 1 && key > node.left!.key) {
    node.left = rotateLeft(node.left!);
    return rotateRight(node);
  }

  // Case 4: Right-Left (RL)
  if (balance < -1 && key < node.right!.key) {
    node.right = rotateRight(node.right!);
    return rotateLeft(node);
  }

  return node;
}
```

---

## 5. Step-by-Step Dry Run State Trace: Left-Right (LR) Double Rotation

Consider inserting keys in sequence: $[30, 10, 20]$ into an initially empty AVL tree.

| Step | Operation | Current Tree State | Balance Factors | Identified Violation | Rebalancing Execution |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | Insert $30$ | Root $30$ | $BF(30) = 0$ | None | Height = 1. Valid. |
| **2** | Insert $10$ | $30 \to \text{left}(10)$ | $BF(10) = 0$, $BF(30) = +1$ | None | Height = 2. Left-heavy but within $\{-1, 0, +1\}$. |
| **3** | Insert $20$ | $10 \to \text{right}(20)$ attached | $BF(20) = 0$<br>$BF(10) = -1$<br>$BF(30) = +2$ | **Critical Violation at Node 30**: $BF = +2$ with Child $BF(10) = -1$. | **Left-Right (LR) Case** detected! Requires 2 rotations. |
| **4** | Phase 1: Left-Rotate on Child $10$ | Left child transforms: $20$ becomes left child of $30$; $10$ becomes left child of $20$. | $BF(10) = 0$, $BF(20) = +1$, $BF(30) = +2$ | Intermediate state: purely Left-Left (LL) chain. | Height of $20$ is updated to 2. |
| **5** | Phase 2: Right-Rotate on Root $30$ | Node $20$ becomes new root; $10$ is left child, $30$ is right child. | $BF(10) = 0$<br>$BF(30) = 0$<br>$BF(20) = 0$ | None! Invariant fully restored. | Tree height reduced from 3 to 2. Perfectly balanced. |

---

## 6. Asymptotic Complexity Matrix

| Operation | Best Case | Average Case | Worst Case | Space Complexity |
| :--- | :---: | :---: | :---: | :---: |
| **Search** | $\Theta(1)$ | $\Theta(\log n)$ | $\mathbf{\Theta(\log n)}$ | $O(1)$ |
| **Insertion** | $\Theta(1)$ | $\Theta(\log n)$ | $\mathbf{\Theta(\log n)}$ | $O(\log n)$ call stack |
| **Deletion** | $\Theta(1)$ | $\Theta(\log n)$ | $\mathbf{\Theta(\log n)}$ | $O(\log n)$ call stack |
| **Single Rotation** | $\Theta(1)$ | $\Theta(1)$ | $\mathbf{\Theta(1)}$ | $O(1)$ |

### Engineering Trade-Off: AVL Trees vs. Red-Black Trees

| Feature / Metric | AVL Tree | Red-Black Tree |
| :--- | :--- | :--- |
| **Balance Rigidity** | Stricter: Height $\le 1.44 \log_2 n$ | Looser: Height $\le 2.00 \log_2 n$ |
| **Lookup Speed** | **Faster** (due to flatter height) | Slightly slower (due to potentially deeper paths) |
| **Insertion Rotations** | At most 1 single or double rotation | At most 2 rotations |
| **Deletion Rotations** | Up to $O(\log n)$ rotations up the tree | At most 3 rotations |
| **Metadata Overhead** | 1 integer or byte for height | 1 bit for color (`RED` / `BLACK`) |
| **Optimal Use Case** | Read-heavy workloads (dictionaries, static lookups) | Write-heavy workloads (standard map/set library engines) |

---

## 7. Common Traps, Edge Cases & Implementation Pitfalls

1. **Height Update Ordering**:
   - In both single and double rotations, the child node that moves down must have its height updated *before* the new root node. Inverting the order computes stale parent heights.
2. **Deletion Rebalancing Propagation**:
   - Unlike insertion where at most one rotation sequence restores the global tree, deletion can cause balance factor violations to propagate all the way up to the tree root, requiring $O(\log n)$ rebalancing rotations.
3. **Integer Subtraction for Balance Factor**:
   - Always ensure empty/leaf subtrees return height $0$ (or $-1$ depending on node vs. edge counting conventions) consistently. Mixing $0$-based and $1$-based height representations corrupts balance factor calculations.

---

## 8. Real-World Applications & Practice Problems

### Production Systems
- **In-Memory Ordered Dictionaries**: Used in high-performance trading systems where lookup latency predictability is prioritized over insertion speed.
- **Database Query Optimizers**: Used for keeping in-memory index range scans strictly bounded with minimal variance.

### Standard Practice Problems
1. **Balance a Binary Search Tree (LeetCode 1382)** — Inorder extraction followed by median-based recursive tree reconstruction.
2. **AVL Tree Implementation** — Implement full `insert` and `delete` routines with automatic rotation dispatch.

---

## 9. References & Academic Attribution

1. **Adelson-Velsky, G. M., & Landis, E. M.** (1962). An algorithm for the organization of information. *Proceedings of the USSR Academy of Sciences*, 146, 263–266.
2. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 13. MIT Press.
3. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 6.2.3. Addison-Wesley.
