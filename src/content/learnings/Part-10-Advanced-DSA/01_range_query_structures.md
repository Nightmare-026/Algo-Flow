# 🚀 Part 10: Advanced DSA — Module 01: Range Query Data Structures

> **Topics Covered:**  
> 148. Segment Tree (Point Updates & Range Queries in $O(\log N)$) &bull; 149. Segment Tree with Lazy Propagation ($O(\log N)$ Range Updates) &bull; 150. Fenwick Tree / Binary Indexed Tree (BIT & `i & (-i)`) &bull; 151. Sparse Table (Static Range Minimum Queries in strictly $O(1)$ Time)

---

# TOPIC 148: SEGMENT TREE

### 1. The Core Trade-off Problem
Given an array $A$ of size $N$, we need to support two operations repeatedly:
1. **Range Query**: Calculate $\sum_{i=L}^{R} A[i]$ (or $\min / \max$).
2. **Point Update**: Set $A[\text{index}] \leftarrow \text{value}$.

| Data Structure | Range Query Time | Point Update Time |
| :--- | :---: | :---: |
| **Naive Array** | $O(N)$ | $O(1)$ |
| **Prefix Sum Array** | $O(1)$ | $O(N)$ (must rebuild prefix sums!) |
| **Segment Tree** | $\mathbf{O(\log N)}$ | $\mathbf{O(\log N)}$ |

---

### 2. Architecture & 4N Memory Bound
A Segment Tree is a full binary tree where each node represents an interval $[L, R]$:
- **Leaf Nodes**: Individual array elements $[i, i]$.
- **Internal Nodes**: The merge of left and right child intervals: $[L, \text{mid}]$ and $[\text{mid}+1, R]$.
- **Storage**: Mapped into a 1D array of size **$4N$** (where left child is $2i+1$ and right is $2i+2$).

```text
SEGMENT TREE OVER A = [ 1, 3, 5, 7 ]:
                        [0..3] (Sum = 16)
                       /      \
             [0..1] (4)        [2..3] (12)
             /      \          /       \
         [0] (1)  [1] (3)   [2] (5)   [3] (7)
```

---

### 3. Pseudocode: Build, Query, and Point Update

```text
ALGORITHM BuildSegmentTree(tree, A, node, start, end)
1.  if start = end:
2.      tree[node] ← A[start]
3.      return
4.  mid ← start + ⌊(end - start) / 2⌋
5.  BuildSegmentTree(tree, A, 2 * node + 1, start, mid)
6.  BuildSegmentTree(tree, A, 2 * node + 2, mid + 1, end)
7.  tree[node] ← tree[2 * node + 1] + tree[2 * node + 2]

ALGORITHM RangeQuery(tree, node, start, end, L, R)
1.  // Case 1: Completely outside range
2.  if R < start or end < L: return 0
3.  // Case 2: Completely inside range
4.  if L ≤ start and end ≤ R: return tree[node]
5.  // Case 3: Partial overlap
6.  mid ← start + ⌊(end - start) / 2⌋
7.  p1 ← RangeQuery(tree, 2 * node + 1, start, mid, L, R)
8.  p2 ← RangeQuery(tree, 2 * node + 2, mid + 1, end, L, R)
9.  return p1 + p2
```

---
---

# TOPIC 149: SEGMENT TREE WITH LAZY PROPAGATION

### 1. The Challenge: Range Updates
What if we need to update an **entire range $[L, R]$** by adding $v$ to every element?
- Updating each leaf individually takes $O(N \log N)$ time.
- **Lazy Propagation**: Postpone updates to descendant nodes until those nodes are actually queried!
- Maintain a secondary `lazy[]` array. When updating an interval, store the pending increment in `lazy[node]` and return immediately! Push the tag down only when traversing deeper during subsequent queries.
- **Time Complexity for Range Update**: **$O(\log N)$**!

---
---

# TOPIC 150: FENWICK TREE (BINARY INDEXED TREE / BIT)

### 1. Definition & The Magic of `i & (-i)`
A **Fenwick Tree (BIT)** (invented by Peter Fenwick, 1994) supports prefix sum queries and point updates in $O(\log N)$ time with **zero pointer overhead and exactly $N + 1$ memory space** (no $4N$ expansion needed!).

#### The Lowbit Isolation:
$$\text{LSB}(i) = i \ \& \ (-i)$$
Each index $i$ in a 1-based Fenwick Tree is responsible for storing the sum of elements in the interval:
$$(i - (i \ \& \ (-i)), \ i]$$

```text
Index (binary)   Responsible Interval Range   Length
1  (0001₂)       (0, 1]                       1
2  (0010₂)       (0, 2]                       2
3  (0011₂)       (2, 3]                       1
4  (0100₂)       (0, 4]                       4 (Covers entire prefix!)
```

---

### 2. Complete Pseudocode: Fenwick Tree (BIT)

```text
DATA STRUCTURE FenwickTree
    Fields:
        tree: array of integers of size N + 1 (1-based, initialized to 0)
        n: integer N

    OPERATION PointUpdate(i, delta):
        // Cascade forward to all ancestors responsible for index i
        while i ≤ n:
            tree[i] ← tree[i] + delta
            i ← i + (i & (-i))          // Advance to parent by adding LSB

    OPERATION PrefixSum(i):
        // Accumulate sum by stripping lowest set bits
        sum ← 0
        while i > 0:
            sum ← sum + tree[i]
            i ← i - (i & (-i))          // Step backwards by subtracting LSB
        return sum

    OPERATION RangeSum(L, R):
        return PrefixSum(R) - PrefixSum(L - 1)
```

- **Point Update**: $O(\log N)$ time.
- **Prefix Sum**: $O(\log N)$ time.
- **Auxiliary Space**: $O(N)$ (requires only 10 lines of code!).

---
---

# TOPIC 151: SPARSE TABLE (STATIC RMQ IN STRICTLY $O(1)$)

### 1. Problem Statement
Given a static array $A$ (no updates), answer **Range Minimum Queries (RMQ)** in **strictly $\mathbf{O(1)}$ constant time**!

---

### 2. Mathematical Principle: Idempotency
An operation $\circ$ is **Idempotent** if:
$$x \circ x = x$$
Functions like $\min(x, y)$, $\max(x, y)$, and $\gcd(x, y)$ are idempotent (unlike sum).  
Because overlapping intervals do not distort the minimum:
$$\min(A[L \dots R]) = \min\Big( \min(A[L \dots L + 2^k - 1]), \quad \min(A[R - 2^k + 1 \dots R]) \Big)$$
Where $k = \lfloor \log_2(R - L + 1) \rfloor$ is the largest power of 2 that fits within the range!

```text
Query Range [L, R] of length 6:
               L                         R
               ┌─────────────────────────┐
Interval 1:    [ 2ᵏ = 4 elements ]       │
Interval 2:    │       [ 2ᵏ = 4 elements ]
               └─────────────────────────┘
Notice the overlap in the middle! Because min(x, x) = x, overlap is 100% harmless!
```

---

### 3. Complexity:
- **Preprocessing (Build Table)**: $\Theta(N \log N)$ time using dynamic programming:
$$\text{ST}[k][i] = \min(\text{ST}[k-1][i], \ \text{ST}[k-1][i + 2^{k-1}])$$
- **Query Time**: Strictly $\mathbf{\Theta(1)}$!
- **Space**: $\Theta(N \log N)$.

---

### 4. Range Query Data Structures Comparison

| Data Structure | Preprocessing Time | Range Query Time | Point Update Time | Range Update Time | Auxiliary Space |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Prefix Sum** | $O(N)$ | $O(1)$ (Sum only) | $O(N)$ | $O(N)$ | $O(N)$ |
| **Sparse Table** | $O(N \log N)$ | $\mathbf{O(1)}$ (Min/Max/GCD) | No updates | No updates | $O(N \log N)$ |
| **Fenwick Tree (BIT)**| $O(N)$ | $O(\log N)$ | $O(\log N)$ | $O(\log N)$ (with 2 BITs)| $\mathbf{O(N)}$ |
| **Segment Tree** | $O(N)$ | $O(\log N)$ | $O(\log N)$ | $O(N)$ | $O(4N)$ |
| **Segment Tree + Lazy**| $O(N)$ | $O(\log N)$ | $O(\log N)$ | $\mathbf{O(\log N)}$ | $O(4N)$ |

---

## 🔁 Module 01 Summary & Key Takeaways

1. **Segment Trees** handle point updates and range queries in $O(\log N)$ using $4N$ memory; **Lazy Propagation** enables $O(\log N)$ range updates.
2. **Fenwick Trees (BIT)** achieve prefix sums and updates in $O(\log N)$ with ultra-lightweight code using `i & (-i)`.
3. **Sparse Tables** exploit idempotency ($\min(x, x) = x$) to deliver **$O(1)$ constant-time Range Minimum Queries** after $O(N \log N)$ preprocessing.

---
[⬅️ Previous: Part 09 Problem Solving Patterns](file:///d:/DSA/Part-09-Problem-Solving-Patterns/03_core_interview_patterns.md) | [Next: Module 02 — Advanced Topics ➡️](file:///d:/DSA/Part-10-Advanced-DSA/02_advanced_topics.md)
