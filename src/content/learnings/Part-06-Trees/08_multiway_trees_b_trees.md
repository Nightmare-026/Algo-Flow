# Part 06: Trees — Module 08: Multiway Trees, B-Trees & B+ Trees

> When data scales beyond random-access memory, binary trees fail due to disk seek latency. Multiway search trees solve the memory wall by matching node capacity to physical storage pages, collapsing tree height into shallow, high-fanout hierarchies where B-Trees and B+ Trees power virtually all production relational databases and filesystem storage engines.

---

## 1. Executive Summary & Learning Objectives

Invented by Rudolf Bayer and Edward M. McCreight in 1970 at Boeing, the B-Tree is a self-balancing search tree optimized for systems reading and writing large blocks of memory. Unlike binary trees whose branching factor is fixed at 2, B-Trees and B+ Trees expand their branching factor to hundreds or thousands of keys per node, keeping the tree exceptionally shallow and minimizing disk I/O operations.

By the end of this chapter, you will be able to:
1. **Analyze** the storage hierarchy latencies (L1 cache vs. RAM vs. NVMe SSD vs. HDD) and formulate why binary search trees fail on external storage.
2. **State** the formal B-Tree invariants parameterized by minimum degree $t \ge 2$, calculating key and child boundaries across all levels.
3. **Execute** proactive split insertions and borrow/merge deletions in $O(t \log_t n)$ time without cascading backward passes.
4. **Contrast** B-Trees and B+ Trees, explaining how separating router keys from doubly-linked data leaves optimizes sequential range queries.
5. **Prove** the structural isomorphism between 2-3-4 trees and Red-Black trees.

---

## 2. External Memory & The Need for Multiway Trees

### The Storage Hierarchy Latency Cliff
Modern computing hardware exhibits latency disparities spanning seven orders of magnitude across the memory hierarchy:

| Memory Tier | Typical Access Latency | Latency Scaled to Human Terms ($1\text{ ns} \approx 1\text{ s}$) | Hardware Transfer Granularity |
| :--- | :---: | :---: | :---: |
| **CPU L1 / L2 Cache** | $\sim 0.5 - 2\text{ ns}$ | $1 - 2\text{ seconds}$ | $64\text{ bytes}$ (Cache Line) |
| **Main Memory (DRAM)** | $\sim 50 - 100\text{ ns}$ | $1 - 2\text{ minutes}$ | $64\text{ bytes}$ |
| **NVMe Flash SSD** | $\sim 10 - 25\ \mu\text{s}$ ($10^4\text{ ns}$) | $\sim 3 - 7\text{ hours}$ | $4\text{ KB} - 16\text{ KB}$ (Page Block) |
| **Mechanical Hard Disk (HDD)** | $\sim 5 - 10\text{ ms}$ ($10^7\text{ ns}$) | $\sim 2 - 4\text{ months}$ | $4\text{ KB}$ (Sector Block) |

Because operating systems and storage controllers read and write secondary storage strictly in fixed-size blocks (typically $4\text{ KB}$, $8\text{ KB}$, or $16\text{ KB}$), fetching a single byte costs the same I/O latency as reading the entire page block.

### Why Binary Search Trees Fail on External Storage
Suppose an enterprise database indexes $n = 1,000,000,000$ ($10^9$) records using a balanced binary search tree (AVL or Red-Black Tree):
- Tree Height: $h \approx \log_2(10^9) \approx 30$ levels.
- In the worst case, each node resides on a different physical disk page.
- A single key lookup requires **30 random page reads**.
- On an NVMe SSD at $20\ \mu\text{s}$ per read, this takes $600\ \mu\text{s}$; on an HDD at $10\text{ ms}$ per seek, this takes $300\text{ ms}$ per query!

### The Multiway Solution: High Fanout, Shallow Trees
Instead of 2 children per node, let each node hold hundreds of keys, precisely matching one storage page block ($4\text{ KB}$):
- Suppose page size $= 4096\text{ bytes}$, key size $= 8\text{ bytes}$, and pointer size $= 8\text{ bytes}$.
- Each node stores $B \approx 256$ keys and $257$ child pointers.
- Resulting Tree Height:

$$h \approx \log_{256}(10^9) = \frac{\log_{10}(10^9)}{\log_{10}(256)} \approx \frac{9}{2.408} \approx \mathbf{3.73 \implies 4 \text{ levels}}$$

- Searching now requires only **3 to 4 page reads**—an **$87\%$ reduction in physical I/O**!

---

## 3. B-Tree Invariants & Structural Mechanics

A B-Tree is a self-balancing search tree parameterized by a **minimum degree $t \ge 2$**:

| Invariant # | Invariant Rule | Formal Boundary Condition | Architectural Purpose |
| :---: | :--- | :--- | :--- |
| **1** | **Root Capacity** | The root contains between $1$ and $2t - 1$ keys. If not a leaf, it has at least $2$ children. | Allows the tree to grow upward through root splits. |
| **2** | **Internal Node Keys** | Every internal node except root has at least $t - 1$ keys and at most $2t - 1$ keys. | Guarantees at least $50\%$ storage page utilization. |
| **3** | **Internal Node Children** | An internal node with $k$ keys has exactly $k + 1$ children (between $t$ and $2t$ children). | Matches multiway search partitioning boundaries. |
| **4** | **Key Ordering** | Keys in each node are strictly sorted: $K_1 < K_2 < \dots < K_k$. | Enables fast in-node binary search. |
| **5** | **Subtree Range Invariant** | For child subtrees $C_0, C_1, \dots, C_k$ of node $u$: $\text{keys}(C_0) < K_1 < \text{keys}(C_1) < \dots < K_k < \text{keys}(C_k)$. | Preserves the global multiway search invariant. |
| **6** | **Uniform Leaf Depth** | **All leaves appear at the exact same depth $h$**. | Ensures uniform, predictable worst-case performance. |

---

### Proactive Split Insertion ($O(t \log_t n)$)

In classical algorithms, inserting into a full leaf requires splitting that node and propagating the median key upward, which can trigger cascading splits back to the root.

CLRS formalizes **Proactive Splitting**:
As the search algorithm descends from the root toward the target insertion leaf, whenever it encounters any node that is already **full** (contains exactly $2t - 1$ keys), it **splits that node immediately** before descending further. Consequently, the parent is guaranteed to have space to accept the promoted median key!

| Phase | Topological State | Keys in Involved Nodes | Structural Changes |
| :--- | :--- | :--- | :--- |
| **Before Split** | Full Child Node $Y$ ($2t - 1$ keys). | $Y.\text{keys} = [K_1, K_2, \dots, K_t, \dots, K_{2t-1}]$. | $Y$ is the $i$-th child of non-full Parent $P$. |
| **Split Execution** | Median key $K_t$ is extracted. | - Median: $K_t$.<br>- Left slice: $[K_1, \dots, K_{t-1}]$.<br>- Right slice: $[K_{t+1}, \dots, K_{2t-1}]$. | $K_t$ is inserted into $P$ at position $i$. $Y$ retains the left $t-1$ keys. A new sibling node $Z$ is allocated for the right $t-1$ keys. |
| **After Split** | Parent $P$ has one additional key and child. | - $P$: contains $K_t$.<br>- $Y$: $t-1$ keys, $t$ children.<br>- $Z$: $t-1$ keys, $t$ children. | Both $Y$ and $Z$ now have room for future insertions. Invariant 2 and 6 preserved! |

---

## 4. B+ Trees: The Universal Database Storage Engine Standard

While a standard B-Tree stores satellite data records in both internal router nodes and leaf nodes, the **B+ Tree** enforces a strict separation between routing indices and payload data:

| Dimension / Layer | Internal Nodes (Router Layer) | Leaf Nodes (Data Layer) |
| :--- | :--- | :--- |
| **Stored Contents** | Search keys and child pointers only. **Zero data payloads!** | All actual data records or tuple row IDs (`RID`). |
| **Key Duplication** | Keys may be duplicated in leaves as exact data anchors. | Contains every single key present in the entire database. |
| **Inter-Node Links** | Downward child pointers only. | **Linked sequentially via a Doubly-Linked List**. |
| **Query Traversal** | Pure routing: Guides searches down to appropriate leaf. | Terminal points for lookups and start points for range scans. |

---

### Why B+ Trees Dominate Relational Databases (PostgreSQL, MySQL InnoDB)

1. **Higher Branching Factor ($B$)**:
   - Because internal nodes store zero tuple data, many more index keys fit into each $4\text{ KB}$ disk page. The resulting tree is shorter, reducing disk I/O.
2. **High-Performance Range Scans (`BETWEEN A AND B`)**:
   - In a standard B-Tree, a range scan requires an in-order tree walk that jumps repeatedly between disk pages across different levels of the tree.
   - In a **B+ Tree**, the engine performs a single binary search to find the start key leaf, then traverses the horizontal linked list of leaves linearly!
3. **Predictable Query Latency**:
   - Every lookup traverses the exact same depth $h$ to reach a leaf, eliminating latency jitter.

---

## 5. Step-by-Step Dry Run State Trace: B-Tree Insertion & Node Split

Consider a B-Tree with minimum degree $t = 2$ (each node holds at most $2t - 1 = 3$ keys and at least $t - 1 = 1$ key).  
Inserting keys sequentially: $[10, 20, 30]$ into a single root node:

| Step | Operation | Current Node Keys | Node Condition | Mutation / Split Action | Resulting Hierarchy |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | Insert $10$ | `[10]` | Count = 1 ($< 3$) | Insert into sorted position. | Root: `[10]` |
| **2** | Insert $20$ | `[10, 20]` | Count = 2 ($< 3$) | Insert into sorted position. | Root: `[10, 20]` |
| **3** | Insert $30$ | `[10, 20, 30]` | Count = 3 (Node Full!) | Node is full ($2t-1 = 3$). Root must split upon next insertion. | Root: `[10, 20, 30]` |
| **4** | Insert $25$ | Needs insertion into `[10, 20, 30]` | Full Node Encountered! | **Root Split Triggered**: Median key $20$ promoted to become new Root! | New Root: `[20]`<br>Left Child: `[10]`<br>Right Child: `[30]` |
| **5** | Complete Insert $25$ | Target leaf is Right Child `[30]` | Count = 1 ($< 3$) | Insert $25$ into right leaf: `[25, 30]`. | Root: `[20]`<br>Left: `[10]`<br>Right: `[25, 30]` |

---

## 6. The Isomorphism Between 2-3-4 Trees and Red-Black Trees

A **2-3-4 Tree** is a B-Tree of minimum degree $t = 2$:
- **2-Node**: 1 key, 2 children.
- **3-Node**: 2 keys, 3 children.
- **4-Node**: 3 keys, 4 children.

Every Red-Black Tree is structurally isomorphic to a 2-3-4 Tree:

| 2-3-4 Tree Node | Equivalent Red-Black Tree Subtree | Node Color Encoding |
| :--- | :--- | :--- |
| **2-Node** `[ B ]` | Single node `[ B ]` | `B` is `BLACK`. |
| **3-Node** `[ A │ B ]` | Parent `[ B ]` with left child `[ A ]` (or right child `[ B ]` with left child `[ A ]`) | `B` is `BLACK`, `A` is `RED`. |
| **4-Node** `[ A │ B │ C ]` | Node `[ B ]` with two children: left `[ A ]` and right `[ C ]` | Root `B` is `BLACK`, both children `A` and `C` are `RED`. |

*Isomorphism Consequence:* When a 2-3-4 tree splits a 4-node $[A \mid B \mid C]$, median key $B$ moves up. In the isomorphic Red-Black Tree, this corresponds precisely to **Case 1 (Uncle Color Flip)**: recoloring children $A$ and $C$ to `BLACK` and parent $B$ to `RED`!

---

## 7. Asymptotic Complexity Matrix

| Operation | B-Tree (Memory Keys) | B-Tree (Disk Block I/O) | B+ Tree Range Query ($k$ items) | Binary Search Tree (Disk I/O) |
| :--- | :---: | :---: | :---: | :---: |
| **Search** | $O(t \log_t n)$ | **$O(\log_t n)$** | $O(\log_t n + k/B)$ | $O(\log_2 n)$ |
| **Insertion** | $O(t \log_t n)$ | **$O(\log_t n)$** | $O(\log_t n)$ | $O(\log_2 n)$ |
| **Deletion** | $O(t \log_t n)$ | **$O(\log_t n)$** | $O(\log_t n)$ | $O(\log_2 n)$ |
| **Range Scan** | $O(k \log_t n)$ | $O(k)$ random I/Os | **$O(\log_t n + k/B)$ sequential I/Os** | $O(k \log_2 n)$ random I/Os |

---

## 8. Common Traps, Edge Cases & Implementation Pitfalls

1. **Underflow on Deletion (Borrow vs. Merge)**:
   - When deleting from an internal node with $t - 1$ keys, check whether an immediate sibling has $\ge t$ keys. If so, borrow a key via parent rotation; if both siblings have $t - 1$ keys, merge the node with a sibling and drop a parent key.
2. **Page Fragmentation in In-Memory B-Trees**:
   - In languages with garbage collection (JavaScript/Python/Java), allocating array objects inside nodes can induce heap fragmentation. Systems implementations in C/C++ or Rust allocate contiguous page-aligned byte buffers.
3. **Failure to Maintain Doubly-Linked Leaf Chain**:
   - In B+ Trees, when a leaf splits, the `next` and `prev` pointers of the leaf chain must be updated atomically. Omitting this breaks concurrent range scans.

---

## 9. Real-World Applications & Practice Problems

### Production Systems
- **PostgreSQL & MySQL InnoDB Storage Engines**: Use B+ Trees as the default indexing structure (`BTREE`) for primary keys and secondary indices.
- **Modern Filesystems (Btrfs, XFS, APFS, NTFS)**: Manage filesystem directory namespaces and extent allocation maps using B-Trees.
- **SQLite Database**: Uses B-Trees for database table organization and B+ Trees for indices.

### Practice Problems
1. **Implement B-Tree Search and Split Insertion** — Implement multiway key search and proactive child split.
2. **B+ Tree Leaf Chain Scan** — Implement lower-bound binary search to leaf followed by doubly-linked list iteration.

---

## 10. References & Academic Attribution

1. **Bayer, R., & McCreight, E. M.** (1970). Organization and maintenance of large ordered indices. *Boeing Scientific Research Laboratories*, Report No. 20.
2. **Comer, D.** (1979). The ubiquitous B-tree. *ACM Computing Surveys (CSUR)*, 11(2), 121–137.
3. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 18 (B-Trees). MIT Press.
