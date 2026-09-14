# Part 06: Trees — Module 01: Tree Fundamentals & Binary Tree Varieties

> **Topics Covered:**  
> 63. Tree Terminology & Anatomy &bull; 64. Fundamental Mathematical Tree Theorems &bull; 65. Structural Classification of Trees &bull; 66. Binary Tree Anatomy &bull; 67. Complete Binary Tree &bull; 68. Full (Strict) Binary Tree &bull; 69. Perfect Binary Tree &bull; 70. Balanced Trees &bull; 71. Degenerate (Skewed) Tree

---

# TOPIC 63: TREE TERMINOLOGY & ANATOMY

### 1. Definition
A **Tree** is a non-linear, hierarchical data structure consisting of a collection of nodes connected by directed or undirected edges, such that:
1. There exists exactly one designated origin node called the **Root**.
2. Every other node $u$ has exactly **one incoming edge** (one parent).
3. The structure is **Acyclic** (contains zero closed cycles).

---

### 2. Comprehensive Visual Anatomy Diagram (ASCII)

```text
Level 0:                    [ A ]               ◄── ROOT (indegree = 0)
                          /       \
Level 1:            [ B ]           [ C ]       ◄── B and C are SIBLINGS
                  /       \               \
Level 2:      [ D ]       [ E ]           [ F ] ◄── INTERNAL NODES (Degree > 0)
                          /   \             │
Level 3:                [ G ] [ H ]       [ I ] ◄── LEAVES / TERMINAL (Degree = 0)

Key Metric Relationships:
• Depth of E  = 2 (Edges from Root A to E: A ─► B ─► E)
• Height of B = 2 (Longest downward path to leaf: B ─► E ─► G)
• Height of Tree = 3 (Height of Root A)
```

---

### 3. Terminology Glossary
- **Root**: The top node without a parent (indegree 0).
- **Edge**: The directed link connecting parent $u$ to child $v$.
- **Parent**: The direct immediate ancestor above a node.
- **Child**: A direct immediate descendant below a node.
- **Siblings**: Nodes sharing the identical parent (e.g., $D$ and $E$).
- **Leaf (External / Terminal Node)**: A node with 0 children (outdegree 0).
- **Internal (Non-Terminal) Node**: A node with at least one child.
- **Degree of a Node**: Number of children attached to that node.
- **Degree of a Tree**: The maximum degree among all nodes in the tree.
- **Depth of a Node**: Number of edges on the path from the root down to that node ($\text{Depth}(\text{root}) = 0$).
- **Height of a Node**: Number of edges on the longest downward path from that node to a leaf ($\text{Height}(\text{leaf}) = 0$).
- **Height of a Tree**: The height of its root node.

---
---

# TOPIC 64: FUNDAMENTAL MATHEMATICAL TREE THEOREMS

### Theorem 1: Edge-to-Vertex Invariant
For any valid tree $T = (V, E)$ containing $|V| = N$ nodes:
$$|E| = N - 1$$
*Every node except the root has exactly one incoming edge.*

### Theorem 2: Maximum Nodes at Level $i$ in a Binary Tree
In any binary tree, level $i$ (where $\text{root}$ is level 0) contains at most:
$$2^i \text{ nodes}$$

### Theorem 3: Maximum Nodes in a Binary Tree of Height $h$
$$\text{Max Nodes } N = \sum_{i=0}^{h} 2^i = 2^{h+1} - 1$$

### Theorem 4: Minimum Height for $N$ Nodes
$$h_{\min} = \lceil \log_2(N + 1) \rceil - 1 = \Theta(\log N)$$

---
---

# TOPICS 66–71: BINARY TREE VARIETIES

A **Binary Tree** is a tree in which every node has **at most 2 children**, distinguished as the **Left Child** and the **Right Child**.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE 5 CANONICAL BINARY TREE SHAPES                    │
└─────────────────────────────────────────────────────────────────────────────┘

1. FULL (STRICT) BINARY TREE           2. PERFECT BINARY TREE
   Every node has 0 or 2 children.        All interior nodes have 2 children;
   Never has 1 child.                     all leaves sit at identical depth.
           [ A ]                                  [ A ]
          /     \                                /     \
       [ B ]   [ C ]                          [ B ]   [ C ]
              /     \                        /   \     /   \
           [ D ]   [ E ]                   [ D ] [ E ][ F ] [ G ]

3. COMPLETE BINARY TREE                4. BALANCED BINARY TREE
   All levels completely filled,          For every node, height of left and
   except possibly the last, which        right subtrees differs by at most 1.
   is filled strictly LEFT-TO-RIGHT.      Guarantees h = O(log n).
           [ A ]                                  [ A ]
          /     \                                /     \
       [ B ]   [ C ]                          [ B ]   [ C ]
      /   \     /                            /   \
    [ D ] [ E ][ F ]                       [ D ] [ E ]

5. DEGENERATE (SKEWED) TREE
   Every internal node has only 1 child.
   Pathological: degenerates into a singly linked list! Height h = n - 1.
           [ A ]
            \
            [ B ]
              \
              [ C ]  ──► Operations degrade from O(log n) to catastrophic O(n)!
```

---

### Detailed Analysis of Complete Binary Trees & Array Mapping

Complete Binary Trees have a profound property: **they can be stored contiguously in an array with ZERO pointer overhead!**

```text
Level-Order Traversal Array:
Index:     0     1     2     3     4     5
Array:  [  A  │  B  │  C  │  D  │  E  │  F  ]

Array Indexing Arithmetic (Zero-Based):
• For any node at index i:
  - Parent Index:       ⌊(i - 1) / 2⌋
  - Left Child Index:   2 · i + 1
  - Right Child Index:  2 · i + 2
```

This compact, cache-friendly array representation forms the exact physical foundation for the **Binary Heap** (Topic 89).

---

### Summary of Tree Classification Metrics

| Tree Type | Key Invariant | Height $h$ in terms of $n$ | Pointerless Array Viable? |
| :--- | :--- | :---: | :---: |
| **Full Binary Tree** | Every node has degree $\in \{0, 2\}$ | $O(\log n)$ to $O(n)$ | No |
| **Perfect Binary Tree** | All leaves at same level; $n = 2^{h+1}-1$ | $\log_2(n+1) - 1$ | Yes |
| **Complete Binary Tree** | Packed left-to-right on final level | $\lfloor \log_2 n \rfloor$ | **Yes (Heap format)** |
| **Balanced Tree (AVL)** | $|h_L - h_R| \le 1$ everywhere | $\approx 1.44 \log_2 n$ | No (Pointers needed) |
| **Degenerate Tree** | Every internal node has 1 child | $n - 1$ (Worst case) | No |

---

## Module 01 Summary & Key Takeaways

1. A tree with $N$ vertices has exactly **$N - 1$ edges** and no cycles.
2. In a **Complete Binary Tree**, leaves are packed left-to-right; mapped directly into arrays via indices $2i+1$ and $2i+2$.
3. In a **Full Binary Tree**, the number of leaf nodes $L$ and internal nodes $I$ satisfy the relation $L = I + 1$.
4. Keeping a tree **Balanced** ($h = O(\log n)$) is essential to prevent operations from degrading to $O(n)$ linked list speed.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 12–13 (BSTs and Red-Black Trees) & Chapter 18 (B-Trees). MIT Press.
2. **Bayer, R., & McCreight, E.** (1972). Organization and maintenance of large ordered indices. *Acta Informatica*, 1(3), 173–189.
3. **Sleator, D. D., & Tarjan, R. E.** (1985). Self-adjusting binary search trees. *Journal of the ACM (JACM)*, 32(3), 652–686.
