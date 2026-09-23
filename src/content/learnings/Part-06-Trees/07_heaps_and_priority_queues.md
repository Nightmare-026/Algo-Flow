# Part 06: Trees — Module 07: Heaps & Priority Queues

> Binary Heaps exploit complete binary tree geometry to pack a priority queue into a flat, cache-friendly array with zero pointer overhead. By restricting structural depth to $\lfloor \log_2 n \rfloor$ and maintaining partial ordering, heaps guarantee $O(\log n)$ updates and enable Floyd's bottom-up linear-time $O(n)$ heap construction.

---

## 1. Executive Summary & Learning Objectives

Invented by J. W. J. Williams in 1964 for Heapsort and optimized by Robert Floyd in 1964, the Binary Heap is an array-backed data structure that implements the Priority Queue Abstract Data Type (ADT). Rather than enforcing a total global ordering across all keys, a heap enforces a local partial order: every parent key dominates its children.

By the end of this chapter, you will be able to:
1. **Define** the Shape and Heap-Order invariants and map tree parent-child relationships to 0-indexed array arithmetic.
2. **Implement** the fundamental `siftUp` and `siftDown` restoration primitives with exact index arithmetic.
3. **Reproduce** the geometric series proof demonstrating that Floyd's bottom-up `buildHeap` algorithm executes in strictly linear $O(n)$ time.
4. **Trace** priority queue insertions, extracts, and in-place array transformations through a structured dry-run trace table.
5. **Compare** advanced heap architectures (Binary, $D$-ary, Binomial, and Fibonacci heaps) across amortized time complexities and real-world cache locality.

---

## 2. Heap Invariants & Array Mapping Arithmetic

A Binary Heap is a specialized binary tree that strictly satisfies two simultaneous invariants:

| Invariant | Formal Specification | Architectural Purpose |
| :--- | :--- | :--- |
| **1. Shape Invariant** | The tree is a **Complete Binary Tree**: every level is fully populated, except possibly the bottom level, which is filled strictly from left to right. | Eliminates structural holes, allowing the tree to be mapped to a flat array without null gaps. |
| **2. Heap-Order Invariant** | **Max-Heap**: For every node $u \ne \text{root}$, $\text{val}(\text{parent}(u)) \ge \text{val}(u)$.<br>**Min-Heap**: For every node $u \ne \text{root}$, $\text{val}(\text{parent}(u)) \le \text{val}(u)$. | Guarantees that the global extremum (maximum or minimum) resides permanently at the root index $0$. |

---

### Pointerless Contiguous Array Storage

Because of the complete binary tree shape invariant, child and parent references are calculated arithmetically without storing explicit left, right, or parent pointers:

| Node Index $i$ | Formula (0-Indexed) | Formula (1-Indexed) | Boundary Condition Check |
| :--- | :--- | :--- | :--- |
| **Parent Node** | $\lfloor (i - 1) / 2 \rfloor$ | $\lfloor i / 2 \rfloor$ | Valid for all $i > 0$ (Root at index 0 has no parent) |
| **Left Child** | $2i + 1$ | $2i$ | Valid if $2i + 1 < n$ |
| **Right Child** | $2i + 2$ | $2i + 1$ | Valid if $2i + 2 < n$ |
| **First Internal Node** | $\lfloor n / 2 \rfloor - 1$ | $\lfloor n / 2 \rfloor$ | Nodes from $\lfloor n / 2 \rfloor$ to $n - 1$ are guaranteed leaves |

### Sample Array-Tree Correspondence

Consider a Max-Heap containing $n = 7$ elements: `[90, 80, 70, 30, 40, 50, 10]`:

| Array Index $i$ | Element Value | Logical Tree Level | Left Child (Index / Val) | Right Child (Index / Val) | Parent (Index / Val) | Node Role |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **0** | **90** | Level 0 | Index 1 (80) | Index 2 (70) | `null` | Root (Global Maximum) |
| **1** | **80** | Level 1 | Index 3 (30) | Index 4 (40) | Index 0 (90) | Internal Node |
| **2** | **70** | Level 1 | Index 5 (50) | Index 6 (10) | Index 0 (90) | Internal Node |
| **3** | **30** | Level 2 | `null` | `null` | Index 1 (80) | Leaf Node |
| **4** | **40** | Level 2 | `null` | `null` | Index 1 (80) | Leaf Node |
| **5** | **50** | Level 2 | `null` | `null` | Index 2 (70) | Leaf Node |
| **6** | **10** | Level 2 | `null` | `null` | Index 2 (70) | Leaf Node |

<div class="my-6 p-4 bg-surface rounded-xl border border-border overflow-x-auto">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 310" width="100%" height="310" class="mx-auto block font-sans">
  <defs>
    <marker id="heap-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/></marker>
    <linearGradient id="heap-grad-root" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0.05"/></linearGradient>
  </defs>
  <text x="410" y="22" text-anchor="middle" font-size="15" font-weight="bold" fill="currentColor">Binary Heap: Complete Tree Geometry to Pointerless Array Serialization</text>
  <line x1="410" y1="50" x2="215" y2="105" stroke="#64748b" stroke-width="2"/>
  <line x1="410" y1="50" x2="605" y2="105" stroke="#64748b" stroke-width="2"/>
  <line x1="215" y1="105" x2="120" y2="160" stroke="#64748b" stroke-width="2"/>
  <line x1="215" y1="105" x2="310" y2="160" stroke="#64748b" stroke-width="2"/>
  <line x1="605" y1="105" x2="510" y2="160" stroke="#64748b" stroke-width="2"/>
  <line x1="605" y1="105" x2="700" y2="160" stroke="#64748b" stroke-width="2"/>
  <circle cx="410" cy="45" r="20" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
  <text x="410" y="50" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">90</text>
  <text x="410" y="20" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#f59e0b">idx [0]</text>
  <circle cx="215" cy="105" r="18" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  <text x="215" y="110" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">80</text>
  <text x="215" y="80" text-anchor="middle" font-size="10" font-weight="bold" fill="#0284c7">idx [1]</text>
  <circle cx="605" cy="105" r="18" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  <text x="605" y="110" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">70</text>
  <text x="605" y="80" text-anchor="middle" font-size="10" font-weight="bold" fill="#0284c7">idx [2]</text>
  <circle cx="120" cy="160" r="16" fill="#10b981" stroke="#059669" stroke-width="1.5"/>
  <text x="120" y="165" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">30</text>
  <text x="120" y="137" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#10b981">[3]</text>
  <circle cx="310" cy="160" r="16" fill="#10b981" stroke="#059669" stroke-width="1.5"/>
  <text x="310" y="165" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">40</text>
  <text x="310" y="137" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#10b981">[4]</text>
  <circle cx="510" cy="160" r="16" fill="#10b981" stroke="#059669" stroke-width="1.5"/>
  <text x="510" y="165" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">50</text>
  <text x="510" y="137" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#10b981">[5]</text>
  <circle cx="700" cy="160" r="16" fill="#10b981" stroke="#059669" stroke-width="1.5"/>
  <text x="700" y="165" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">10</text>
  <text x="700" y="137" text-anchor="middle" font-size="9.5" font-weight="bold" fill="#10b981">[6]</text>
  <rect x="70" y="210" width="680" height="85" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="85" y="232" font-size="11" font-weight="bold" fill="#94a3b8">Physical Contiguous Memory (0-Indexed Buffer):</text>
  <g transform="translate(85, 242)">
    <rect x="0" y="0" width="85" height="42" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="2" rx="4"/>
    <text x="42" y="18" text-anchor="middle" font-size="9" fill="#f59e0b">idx 0 (Root)</text>
    <text x="42" y="34" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">90</text>
    <rect x="92" y="0" width="85" height="42" fill="#0284c7" fill-opacity="0.15" stroke="#0284c7" stroke-width="1.5" rx="4"/>
    <text x="134" y="18" text-anchor="middle" font-size="9" fill="#0284c7">idx 1 (2i+1)</text>
    <text x="134" y="34" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">80</text>
    <rect x="184" y="0" width="85" height="42" fill="#0284c7" fill-opacity="0.15" stroke="#0284c7" stroke-width="1.5" rx="4"/>
    <text x="226" y="18" text-anchor="middle" font-size="9" fill="#0284c7">idx 2 (2i+2)</text>
    <text x="226" y="34" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">70</text>
    <rect x="276" y="0" width="85" height="42" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1.5" rx="4"/>
    <text x="318" y="18" text-anchor="middle" font-size="9" fill="#10b981">idx 3</text>
    <text x="318" y="34" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">30</text>
    <rect x="368" y="0" width="85" height="42" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1.5" rx="4"/>
    <text x="410" y="18" text-anchor="middle" font-size="9" fill="#10b981">idx 4</text>
    <text x="410" y="34" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">40</text>
    <rect x="460" y="0" width="85" height="42" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1.5" rx="4"/>
    <text x="502" y="18" text-anchor="middle" font-size="9" fill="#10b981">idx 5</text>
    <text x="502" y="34" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">50</text>
    <rect x="552" y="0" width="85" height="42" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1.5" rx="4"/>
    <text x="594" y="18" text-anchor="middle" font-size="9" fill="#10b981">idx 6</text>
    <text x="594" y="34" text-anchor="middle" font-size="13" font-weight="bold" fill="#ffffff">10</text>
  </g>
</svg>
</div>

---

## 3. Core Heap Restoration Primitives: Sift-Up & Sift-Down

### Sift-Up (`heapifyUp`) — Insertion ($O(\log n)$)
When inserting an element, append it to the end of the array (at index $n$). If it violates the heap invariant with its parent, swap it with its parent and propagate upward:

```typescript
function siftUp<T>(arr: T[], index: number): void {
  let curr = index;
  while (curr > 0) {
    const parent = Math.floor((curr - 1) / 2);
    if (arr[curr] > arr[parent]) {
      // Swap with parent in Max-Heap
      [arr[curr], arr[parent]] = [arr[parent], arr[curr]];
      curr = parent;
    } else {
      break;
    }
  }
}
```

### Sift-Down (`heapifyDown`) — Extraction ($O(\log n)$)
When extracting the root, replace `arr[0]` with the last element (`arr[n-1]`), shrink the array size, and sift the new root down by swapping it with its dominant child until the invariant is restored:

```typescript
function siftDown<T>(arr: T[], n: number, index: number): void {
  let curr = index;
  while (true) {
    let largest = curr;
    const left = 2 * curr + 1;
    const right = 2 * curr + 2;

    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    if (largest !== curr) {
      [arr[curr], arr[largest]] = [arr[largest], arr[curr]];
      curr = largest;
    } else {
      break;
    }
  }
}
```

---

## 4. Mathematical Proof: Floyd's Linear-Time $O(n)$ Build-Heap

A naive approach to building a heap from an unsorted array of size $n$ inserts elements one by one via `siftUp`, consuming $\sum_{i=1}^n O(\log i) = O(n \log n)$ time.

**Floyd's Algorithm** (1964) instead processes the array bottom-up, calling `siftDown` starting from the first non-leaf node ($\lfloor n/2 \rfloor - 1$) down to index $0$:

```typescript
export function buildHeap<T>(arr: T[]): void {
  const n = arr.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    siftDown(arr, n, i);
  }
}
```

### Formal Mathematical Proof
In an $n$-element complete binary tree of height $H = \lfloor \log_2 n \rfloor$:
- At height $h$ (where leaves have height $h = 0$ and the root has height $h = H$), there are at most $\lceil \frac{n}{2^{h+1}} \rceil$ nodes.
- A node at height $h$ can sift down at most $h$ levels.
- Total comparisons and swaps across all nodes is bounded by:

$$S = \sum_{h=0}^{H} \left\lceil \frac{n}{2^{h+1}} \right\rceil \cdot h \le \frac{n}{2} \sum_{h=0}^{\infty} \frac{h}{2^h}$$

Let $X = \sum_{h=0}^\infty \frac{h}{2^h} = \frac{0}{1} + \frac{1}{2} + \frac{2}{4} + \frac{3}{8} + \frac{4}{16} + \dots$

Multiplying by $\frac{1}{2}$:

$$\frac{1}{2}X = \frac{1}{4} + \frac{2}{8} + \frac{3}{16} + \frac{4}{32} + \dots$$

Subtracting the two infinite series:

$$X - \frac{1}{2}X = \frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \frac{1}{16} + \dots = \sum_{k=1}^\infty \left(\frac{1}{2}\right)^k = 1$$

$$\frac{1}{2}X = 1 \implies X = 2$$

Substituting $X = 2$ back into our summation:

$$S \le \frac{n}{2} \cdot 2 = \mathbf{n}$$

$$\therefore \text{Floyd's Build-Heap runs in strictly } \mathbf{O(n)} \text{ linear time!} \quad \blacksquare$$

---

## 5. Complete Implementation: Priority Queue ADT

```typescript
export class MaxPriorityQueue<T> {
  private heap: T[] = [];

  constructor(initialItems?: T[]) {
    if (initialItems && initialItems.length > 0) {
      this.heap = [...initialItems];
      buildHeap(this.heap);
    }
  }

  public get size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public peek(): T {
    if (this.isEmpty()) throw new Error("PriorityQueue Underflow");
    return this.heap[0];
  }

  public insert(value: T): void {
    this.heap.push(value);
    siftUp(this.heap, this.heap.length - 1);
  }

  public extractMax(): T {
    if (this.isEmpty()) throw new Error("PriorityQueue Underflow");

    const maxVal = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      siftDown(this.heap, this.heap.length, 0);
    }

    return maxVal;
  }
}
```

---

## 6. Step-by-Step Dry Run State Trace Table

Consider executing Floyd's `buildHeap` on the unsorted input array: `[4, 10, 3, 5, 1]`, with $n = 5$.  
First non-leaf node: $\lfloor 5/2 \rfloor - 1 = 1$. Iteration runs from $i = 1$ down to $i = 0$.

| Step | Subtree Root Index $i$ | Subtree Root Val | Children ($2i+1, 2i+2$) | Condition Check | Swap Action | Array State After Step |
| :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| **1** | $i = 1$ | $10$ | Left: `arr[3] = 5`<br>Right: `arr[4] = 1` | $\max(10, 5, 1) = 10$. Invariant holds. | No swap. | `[4, 10, 3, 5, 1]` |
| **2** | $i = 0$ | $4$ | Left: `arr[1] = 10`<br>Right: `arr[2] = 3` | $\max(4, 10, 3) = 10$ at index $1$. Violation! | Swap `arr[0]` ($4$) with `arr[1]` ($10$). | `[10, 4, 3, 5, 1]` |
| **3** | $i = 1$ (sift-down) | $4$ | Left: `arr[3] = 5`<br>Right: `arr[4] = 1` | $\max(4, 5, 1) = 5$ at index $3$. Violation! | Swap `arr[1]` ($4$) with `arr[3]` ($5$). | `[10, 5, 3, 4, 1]` |
| **4** | $i = 3$ (leaf) | $4$ | No children ($2(3)+1 = 7 \ge 5$) | Leaf reached. Algorithm terminates. | None. | **`[10, 5, 3, 4, 1]`** (Valid Max-Heap!) |

---

## 7. Comparative Analysis: Advanced Heap Architectures

| Heap Architecture | Find-Min/Max | Insert | Extract-Min/Max | Decrease-Key | Merge / Meld | Primary Real-World Application |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Binary Heap** | $\Theta(1)$ | $O(\log n)$ | $O(\log n)$ | $O(\log n)$ | $\Theta(n)$ | General Priority Queues, Heapsort, Event Schedulers |
| **$D$-ary Heap ($d=4$)** | $\Theta(1)$ | $O(\log_d n)$ | $O(d \log_d n)$ | $O(\log_d n)$ | $\Theta(n)$ | Graph shortest paths; optimized for L1/L2 CPU cache lines |
| **Binomial Heap** | $O(\log n)$ | $O(1)$ amortized | $O(\log n)$ | $O(\log n)$ | $\mathbf{O(\log n)}$ | Meldable priority queues, functional programming |
| **Fibonacci Heap** | $\Theta(1)$ | $\mathbf{O(1)}$ amortized | $O(\log n)$ amortized | $\mathbf{O(1)}$ amortized | $\mathbf{O(1)}$ worst-case | Theoretical speedup for Dijkstra ($O(E + V \log V)$) & Prim's MST |

---

## 8. Common Traps, Edge Cases & Implementation Pitfalls

1. **Off-by-One in Child Calculations**:
   - For 0-indexed arrays, using $2i$ and $2i+1$ leaves the root at index $0$ with identical children ($2(0) = 0$). Always use $2i+1$ and $2i+2$.
2. **Comparing Against Out-of-Bounds Children**:
   - In `siftDown`, failing to verify `left < n` and `right < n` causes undefined array index reads or premature loop termination.
3. **Decrease-Key Without Index Tracking**:
   - To execute `decreaseKey` in $O(\log n)$ time, the priority queue must maintain an auxiliary inverted index map (`Map<Key, ArrayIndex>`). Without this, finding the node requires an $O(n)$ linear scan.

---

## 9. Real-World Applications & Practice Problems

### Production Systems
- **Operating System Task Schedulers**: Process runqueues use priority queues to schedule CPU slices based on nice values or deadlines.
- **Dijkstra's & Prim's Graph Algorithms**: Utilize min-priority queues to repeatedly extract the next closest unvisited vertex in $O(E \log V)$ time.
- **Top-$K$ Streaming Systems**: A min-heap of fixed size $K$ computes the rolling largest $K$ items across massive data streams in $O(N \log K)$ time and $O(K)$ auxiliary memory.

### Standard Practice Problems
1. **Kth Largest Element in an Array (LeetCode 215)** — Min-heap of size $K$ or Quickselect.
2. **Merge k Sorted Lists (LeetCode 23)** — Min-heap tracking the head pointer of each list in $O(N \log k)$ time.
3. **Find Median from Data Stream (LeetCode 295)** — Dual-heap architecture (Max-Heap for lower half, Min-Heap for upper half).

---

## 10. References & Academic Attribution

1. **Williams, J. W. J.** (1964). Algorithm 232: Heapsort. *Communications of the ACM*, 7(6), 347–348.
2. **Floyd, R. W.** (1964). Algorithm 245: Treesort 3. *Communications of the ACM*, 7(12), 701.
3. **Fredman, M. L., & Tarjan, R. E.** (1987). Fibonacci heaps and their uses in improved network optimization algorithms. *Journal of the ACM (JACM)*, 34(3), 596–615.
4. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 6 (Heapsort) & Chapter 19 (Fibonacci Heaps). MIT Press.
