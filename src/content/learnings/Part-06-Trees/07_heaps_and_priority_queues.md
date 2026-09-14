# Part 06: Trees — Module 07: Heaps & Priority Queues

> **Topics Covered:**  
> 89. Heap Structure & Dual Invariants &bull; 90. Min-Heap & Max-Heap &bull; 91. Array Mapping Arithmetic ($2i+1, 2i+2$) &bull; 92. Core Operations: Sift-Up & Sift-Down &bull; 93. Mathematical Proof: $O(n)$ Linear Build-Heap &bull; 94. Priority Queue ADT Implementation &bull; 94b. Advanced Heaps: D-ary Heaps, Binomial Heaps & Fibonacci Heaps

---

# TOPICS 89–91: HEAP DEFINITION & DUAL INVARIANTS

### 1. Topic Title
**Binary Heap (Complete Binary Tree Priority Structure)**

### 2. Category
Non-Linear Data Structures — Partially Ordered Complete Trees.

### 3. Difficulty
Intermediate.

### 4. Definition & The Two Inviolable Heap Invariants
A **Binary Heap** is a specialized binary tree that satisfies two strict invariants:
1. **Shape Invariant (Complete Binary Tree)**: All levels are completely filled except possibly the last level, which is filled strictly from left to right without any holes.
2. **Heap-Order Invariant**:
   - **Max-Heap**: For every node $u$ (except root), $\text{val}(\text{parent}(u)) \ge \text{val}(u)$. The maximum element is permanently at the root!
   - **Min-Heap**: For every node $u$ (except root), $\text{val}(\text{parent}(u)) \le \text{val}(u)$. The minimum element is permanently at the root!

---

### 5. Array Mapping Arithmetic (Pointerless Structure)

Because a binary heap is a complete binary tree, it can be packed into a flat contiguous 1D array without storing any pointers:

```text
LOGICAL MAX-HEAP TREE:                       FLAT CONTIGUOUS ARRAY STORAGE:
                 [ 90 ]                       Index:    0    1    2    3    4    5    6
               /        \                     Array: [ 90 │ 80 │ 70 │ 30 │ 40 │ 50 │ 10 ]
           [ 80 ]      [ 70 ]
          /      \    /      \                Parent Index:  ⌊(i - 1) / 2⌋
       [ 30 ]  [ 40 ][ 50 ]  [ 10 ]           Left Child:    2 · i + 1
                                              Right Child:   2 · i + 2
```

```text
INDEXING RULES (0-Indexed Array):
- Parent of node at index i:      Parent(i) = ⌊(i - 1) / 2⌋
- Left child of node at index i:  Left(i)   = 2 · i + 1
- Right child of node at index i: Right(i)  = 2 · i + 2
- First non-leaf node:            ⌊n / 2⌋ - 1
```

---

# TOPICS 92–93: CORE HEAP OPERATIONS & $O(n)$ BUILD-HEAP

### 1. Sift-Up (Heapify-Up) — Used on Insertion ($O(\log n)$)
1. Append the new element to the end of the array (at index $n$).
2. Compare the element with its parent ($\lfloor (i-1)/2 \rfloor$).
3. If the element violates heap order, swap it with its parent.
4. Repeat upward until the heap property is satisfied or the root is reached.

```text
ALGORITHM SiftUp(A, i):
1.  while i > 0 and A[Parent(i)] < A[i]:
2.      Swap(A[i], A[Parent(i)])
3.      i ← Parent(i)
```

---

### 2. Sift-Down (Heapify-Down) — Used on Extract ($O(\log n)$)
1. Replace the root with the last element of the array, decrement size by 1.
2. Compare the new root with its children (both left and right).
3. Swap with the largest (for Max-Heap) or smallest (for Min-Heap) child.
4. Repeat downward until the heap property is satisfied or a leaf is reached.

```text
ALGORITHM SiftDown(A, n, i):
1.  largest ← i
2.  left ← 2 · i + 1
3.  right ← 2 · i + 2
4.  if left < n and A[left] > A[largest]:
5.      largest ← left
6.  if right < n and A[right] > A[largest]:
7.      largest ← right
8.  if largest ≠ i:
9.      Swap(A[i], A[largest])
10.     SiftDown(A, n, largest)
```

---

### 3. Formal Mathematical Proof: Build-Heap is Strictly $O(n)$ Linear Time

A common misconception is that building a heap of $n$ elements takes $O(n \log n)$ time (as if calling `Insert` $n$ times).  
Instead, **Floyd's Build-Heap Algorithm** runs `SiftDown` bottom-up from index $\lfloor n/2 \rfloor - 1$ down to 0:

```text
ALGORITHM BuildHeap(A, n):
1.  for i ← ⌊n / 2⌋ - 1 down to 0:
2.      SiftDown(A, n, i)
```

#### The Mathematical Proof
In an $n$-element binary heap of height $H = \lfloor \log_2 n \rfloor$:
- At height $h$, there are at most $\lceil \frac{n}{2^{h+1}} \rceil$ nodes.
- A node at height $h$ can sift down at most $h$ levels.
- The total number of swap operations is:

$$S = \sum_{h=0}^{H} \left\lceil \frac{n}{2^{h+1}} \right\rceil \cdot h \le \frac{n}{2} \sum_{h=0}^\infty \frac{h}{2^h}$$

Let $X = \sum_{h=0}^\infty \frac{h}{2^h} = \frac{0}{1} + \frac{1}{2} + \frac{2}{4} + \frac{3}{8} + \frac{4}{16} + \dots$  
Multiplying by $\frac{1}{2}$:
$$\frac{1}{2}X = \frac{1}{4} + \frac{2}{8} + \frac{3}{16} + \dots$$
Subtracting the two series:
$$X - \frac{1}{2}X = \frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \frac{1}{16} + \dots = \sum_{k=1}^\infty \frac{1}{2^k} = 1$$
$$\frac{1}{2}X = 1 \implies X = 2$$

Substituting back:
$$S \le \frac{n}{2} \cdot 2 = \mathbf{n}$$

$$\therefore \text{Build-Heap runs in strictly } \mathbf{O(n)} \text{ linear time! } \blacksquare$$

---

# TOPIC 94: COMPLETE PRIORITY QUEUE ADT

```text
DATA STRUCTURE PriorityQueue
    Fields:
        data: dynamic array
        size: integer

    OPERATION Insert(val):
        data.Append(val)
        size ← size + 1
        SiftUp(data, size - 1)

    OPERATION Peek():
        if size = 0: error "Queue Underflow"
        return data[0]

    OPERATION ExtractMax():
        if size = 0: error "Queue Underflow"
        maxVal ← data[0]
        data[0] ← data[size - 1]
        data.RemoveLast()
        size ← size - 1
        if size > 0:
            SiftDown(data, size, 0)
        return maxVal

    OPERATION IncreaseKey(i, newVal):
        if newVal < data[i]: error "New key is smaller"
        data[i] ← newVal
        SiftUp(data, i)
```

---

# TOPIC 94b: ADVANCED HEAP VARIATIONS

```text
┌────────────────────┬──────────────┬──────────────┬──────────────┬──────────────┐
│ Heap Type          │ Insert       │ Extract-Min  │ Decrease-Key │ Merge/Meld   │
├────────────────────┼──────────────┼──────────────┼──────────────┼──────────────┤
│ Binary Heap        │ O(log n)     │ O(log n)     │ O(log n)     │ O(n)         │
│ D-ary Heap (d=4)   │ O(log_d n)   │ O(d log_d n) │ O(log_d n)   │ O(n)         │
│ Binomial Heap      │ O(1) amort   │ O(log n)     │ O(log n)     │ O(log n)     │
│ Fibonacci Heap     │ O(1) amort   │ O(log n) am  │ O(1) amort   │ O(1) worst   │
└────────────────────┴──────────────┴──────────────┴──────────────┴──────────────┘
```

1. **D-ary Heap**: Generalizes binary heap to $d$ children per node.
   - For $d = 4$, tree height shrinks to $\log_4 n$, reducing memory latency and maximizing CPU L1/L2 cache line hits.
2. **Fibonacci Heap**:
   - Uses a collection of heap-ordered trees with lazy consolidation.
   - Achieves amortized **$O(1)$ `Decrease-Key`**, speeding up Dijkstra's algorithm from $O(E \log V)$ to $O(E + V \log V)$ in dense graphs.

---

## Module 07 Summary & Key Takeaways

1. **Binary Heap** enforces Shape (complete binary tree) and Order (parent $\ge$ or $\le$ children) invariants.
2. Array arithmetic ($2i+1, 2i+2, \lfloor(i-1)/2\rfloor$) eliminates pointer overhead.
3. Bottom-up `BuildHeap` runs in strictly **$O(n)$ time** because the vast majority of nodes are near the leaves and only sift down 0 or 1 levels.
4. For high-performance caches, $d$-ary heaps ($d=4$) provide superior real-world throughput due to cache alignment.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 12–13 (BSTs and Red-Black Trees) & Chapter 18 (B-Trees). MIT Press.
2. **Bayer, R., & McCreight, E.** (1972). Organization and maintenance of large ordered indices. *Acta Informatica*, 1(3), 173–189.
3. **Sleator, D. D., & Tarjan, R. E.** (1985). Self-adjusting binary search trees. *Journal of the ACM (JACM)*, 32(3), 652–686.
