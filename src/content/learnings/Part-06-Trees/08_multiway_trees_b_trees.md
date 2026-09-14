# Part 06: Trees — Module 08: Multiway Trees, B-Trees & B+ Trees

> **Topics Covered:**  
> 96a. The Memory Hierarchy & External Storage Latency &bull; 96b. Why Binary Trees Fail on Disk (Random I/O Bottlenecks) &bull; 96c. B-Tree Definition, Minimum Degree $t$ & Invariants &bull; 96d. B-Tree Search & Proactive Split Insertion &bull; 96e. B-Tree Deletion (Borrow & Merge) &bull; 97a. B+ Tree Architecture & Routing Key Paradigm &bull; 97b. Doubly-Linked Leaf Chain & Range Query Mastery &bull; 97c. 2-3 and 2-3-4 Trees & The Red-Black Tree Isomorphism

---

# TOPIC 96a & 96b: EXTERNAL MEMORY & THE NEED FOR MULTIWAY TREES

### 1. The Memory Wall: RAM vs Disk Block I/O
In modern computing, memory access speed varies by orders of magnitude:
- **CPU L1 Cache**: $\sim 1\text{ ns}$
- **RAM Access**: $\sim 50-100\text{ ns}$
- **NVMe SSD Block Read**: $\sim 10,000\text{ ns} \ (10\ \mu\text{s})$
- **Mechanical HDD Seek**: $\sim 10,000,000\text{ ns} \ (10\text{ ms})$

Operating systems and database storage engines transfer data to and from disk in fixed-size blocks called **Disk Pages** (typically $4\text{ KB}$, $8\text{ KB}$, or $16\text{ KB}$). Accessing even 1 byte costs reading the entire $4\text{ KB}$ page into memory.

---

### 2. Why Binary Search Trees Fail on Disk Storage

Suppose we store 1,000,000,000 ($10^9$) database records in a balanced Binary Search Tree (AVL or Red-Black Tree):
- Height $h \approx \log_2(10^9) \approx 30$ levels.
- In the worst case, each node resides on a different disk page.
- Searching for a record requires **30 random disk reads**!
- At $10\text{ ms}$ per HDD seek, this takes **$300\text{ ms}$ per single query** (completely unacceptable for database systems processing tens of thousands of queries per second).

---

### 3. The Multiway Solution: Fat, Shallow Trees

Instead of 2 children per node, let each node hold **hundreds or thousands of keys**, matching the size of one disk page ($4\text{ KB}$):
- Suppose page size $= 4096\text{ bytes}$, key size $= 8\text{ bytes}$, pointer size $= 8\text{ bytes}$.
- Each node can store $B \approx 256$ keys and $257$ child pointers!
- Height $h \approx \log_{256}(10^9) \approx \mathbf{3.7 \approx 4 \text{ levels}}$!
- Searching now requires only **3 to 4 disk page reads** — an **87% reduction in disk I/O**!

```text
SHALLOW MULTIWAY TREE (Branching Factor B = 4):
                         [ 20 │ 50 │ 80 ]
                  /           │         │         \
           [ 5│10│15 ]   [ 25│35│45 ] [ 55│65│75 ] [ 85│90│95 ]
```

---

# TOPIC 96c–96e: B-TREES (BALANCED MULTIWAY SEARCH TREES)

Invented by Rudolf Bayer and Edward M. McCreight in 1970 at Boeing, a **B-Tree** is a self-balancing search tree parameterized by a **minimum degree $t \ge 2$**:

### 1. Inviolable B-Tree Invariants
1. **Root Property**: The root has at least 1 key (if tree is non-empty). If the root is not a leaf, it has at least 2 children.
2. **Key Capacity**: Every internal node (except root) contains between **$t - 1$** and **$2t - 1$** keys.
3. **Child Capacity**: An internal node with $k$ keys has exactly **$k + 1$** children. Hence, every internal node has between **$t$** and **$2t$** children.
4. **Sorted Keys**: The keys within every node are sorted: $K_1 < K_2 < \dots < K_k$.
5. **Key-Subtree Ordering**: For child subtrees $C_0, C_1, \dots, C_k$:
   - All keys in $C_0 < K_1$
   - All keys in $C_i$ satisfy $K_i < \text{keys} < K_{i+1}$
   - All keys in $C_k > K_k$
6. **Perfect Leaf Depth**: **All leaves appear at the exact same depth**! (The tree grows and shrinks strictly at the root!).

---

### 2. Proactive Split Insertion ($O(t \log_t n)$)

To prevent cascading splits back up to the root, CLRS defines **proactive splitting**:
As we traverse down from the root searching for the insertion leaf, whenever we encounter a node that is **full** (contains exactly $2t - 1$ keys), we **split it immediately** before descending into it!

```text
NODE SPLIT MECHANICS (Minimum degree t = 3, Node full with 2t - 1 = 5 keys):

BEFORE SPLIT (Full Node):
Parent:                 [ ... │ P │ ... ]
                              │
Full Child:    [ K1 │ K2 │ (K3) │ K4 │ K5 ]  <-- K3 is the median key!
               /    │    │      │    │    \
              C0   C1   C2     C3   C4   C5

SPLIT ACTION:
1. Median key K3 is pushed up into the Parent!
2. Full Child splits into two nodes of t - 1 = 2 keys each:
   - Left Node:  [ K1 │ K2 ] with children C0, C1, C2
   - Right Node: [ K4 │ K5 ] with children C3, C4, C5

AFTER SPLIT:
Parent:                 [ ... │ P │ K3 │ ... ]
                              /        \
Left Child:             [ K1 │ K2 ]   [ K4 │ K5 ]
                        /    │    \   /    │    \
                       C0   C1   C2  C3   C4   C5
```

---

# TOPIC 97a & 97b: B+ TREES (THE DATABASE STANDARD)

While B-Trees store data records in both internal nodes and leaf nodes, the **B+ Tree** introduces a revolutionary architectural separation:

```text
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        THE B+ TREE DUAL-LAYER ARCHITECTURE                             │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. Internal Nodes (Router Layer): Store ONLY Search Keys and Child Pointers.           │
│    They hold NO data records or tuple pointers! They serve purely to route queries.    │
│ 2. Leaf Nodes (Data Layer): Store ALL actual data records (or record pointers).        │
│ 3. Sequential Leaf Chain: ALL leaves are linked together as a DOUBLY LINKED LIST!      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

```text
STRUCTURAL DIAGRAM OF A B+ TREE:
INTERNAL:                     [ 30 │ 70 ]                  <-- Pure Index Routers
                           /       │       \
INTERNAL:            [ 10 │ 20 ] [ 40│50 ] [ 80│90 ]       <-- Pure Index Routers
                     /    │    \  /   │  \  /   │   \
LEAF NODES:        [5]─►[10]─►[20]─►[30]─►[40]─►[50]─►[70]─►[80]─►[90] (Doubly Linked Data Chain)
                   ◄─   ◄─    ◄─   ◄─    ◄─   ◄─   ◄─    ◄─   ◄─
                    │     │     │    │     │    │    │     │    │
DATA RECORDS:     (Rec) (Rec) (Rec)(Rec) (Rec)(Rec)(Rec) (Rec)(Rec)
```

---

### Why B+ Trees are Superior to B-Trees for Database Systems

1. **Higher Branching Factor ($B$)**:
   - Because internal nodes do not waste space on data payloads, far more keys fit inside one $4\text{ KB}$ disk page.
   - Result: Shorter tree height $\implies$ fewer disk page I/O operations per query.
2. **Blazing Fast Range Scans (`BETWEEN val1 AND val2`)**:
   - In a standard B-Tree, a range scan requires an in-order traversal that jumps up and down between disk pages across different levels of the tree.
   - In a **B+ Tree**, the query simply does **one** binary search to locate the first leaf node, and then **sequentially traverses the leaf linked list**!
3. **Predictable Query Latency**:
   - Every single record lookup always terminates at the bottom leaf level, ensuring uniform and deterministic response times.

---

# TOPIC 97c: 2-3 TREES, 2-3-4 TREES & RED-BLACK TREE ISOMORPHISM

A **2-3-4 Tree** is a B-Tree of minimum degree $t = 2$:
- **2-Node**: 1 key, 2 children.
- **3-Node**: 2 keys, 3 children.
- **4-Node**: 3 keys, 4 children.

### The Isomorphism to Red-Black Trees
Every Red-Black Tree is structurally **isomorphic (1-to-1 mathematically equivalent)** to a 2-3-4 Tree!
- A **2-Node** $[B]$ is represented by a single **BLACK** node.
- A **3-Node** $[A \mid B]$ is represented by a **BLACK** node with one **RED** child.
- A **4-Node** $[A \mid B \mid C]$ is represented by a **BLACK** node $B$ with two **RED** children $A$ and $C$!

```text
2-3-4 NODE                                 EQUIVALENT RED-BLACK SUBTREE
──────────                                 ────────────────────────────
2-Node: [ B ]                   ──►                  [ B (Black) ]

3-Node: [ A │ B ]               ──►                  [ B (Black) ]
                                                    /
                                              [ A (Red) ]

4-Node: [ A │ B │ C ]           ──►                  [ B (Black) ]
                                                    /             \
                                              [ A (Red) ]     [ C (Red) ]
```

When an insertion in a 2-3-4 tree splits a full 4-node, in the equivalent Red-Black tree this corresponds exactly to **Case 1 (Recoloring parent and uncle to Black and grandparent to Red)**!

---

## Module 08 Summary & Key Takeaways

1. **Disk I/O** is $10^5 \times$ slower than RAM; multiway trees minimize disk page fetches by maximizing the branching factor $B$.
2. **B-Trees** maintain all leaves at the exact same depth, guaranteeing $O(\log_t n)$ worst-case search, insert, and delete.
3. **B+ Trees** store data records strictly in leaf nodes linked as a doubly linked list, making them the universal standard for relational database engines (MySQL InnoDB, PostgreSQL).
4. A **Red-Black Tree** is an isometric binary encoding of a **2-3-4 Tree**.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 12–13 (BSTs and Red-Black Trees) & Chapter 18 (B-Trees). MIT Press.
2. **Bayer, R., & McCreight, E.** (1972). Organization and maintenance of large ordered indices. *Acta Informatica*, 1(3), 173–189.
3. **Sleator, D. D., & Tarjan, R. E.** (1985). Self-adjusting binary search trees. *Journal of the ACM (JACM)*, 32(3), 652–686.
