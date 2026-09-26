# Part 10: Advanced DSA — Module 01: Range Query Data Structures

Interval-based queries and dynamic mutations are central to database indexing, competitive programming, and geometric processing. Range query data structures resolve the fundamental tension between static prefix precomputations and naive linear scans, unlocking logarithmic updates and constant-time idempotent queries.

---

## 1. Executive Summary & Learning Objectives

This module formalizes advanced hierarchical data structures designed to evaluate and mutate range aggregates over 1D sequences with optimal asymptotic efficiency.

By the end of this chapter, you will be able to:

1. **Construct Array-Backed Segment Trees**: Implement binary interval decomposition supporting range associative queries and point updates in $\mathcal{O}(\log n)$ time within $4n$ array bounds.
2. **Apply Lazy Propagation**: Defer pending range updates via transmission tags, guaranteeing $\mathcal{O}(\log n)$ batch modifications.
3. **Master Fenwick Trees (BIT)**: Utilize low-bit isolation $i \ \& \ (-i)$ to manage prefix sums and point mutations with zero pointer overhead in strictly $\mathcal{O}(n)$ memory.
4. **Leverage Idempotent Sparse Tables**: Exploit algebraic property $\min(x, x) = x$ to evaluate static Range Minimum Queries in strictly $\mathcal{O}(1)$ time following $\mathcal{O}(n \log n)$ preprocessing.

---

## 2. Topic 148: Segment Tree

### 1. The Core Trade-off Problem

Given an array $A$ of size $n$, systems require efficient handling of two competing operations:

1. **Range Query**: Evaluate $\sum_{i=L}^{R} A[i]$ (or $\min$, $\max$, $\gcd$).
2. **Point Update**: Assign $A[\text{index}] \leftarrow \text{value}$.

| Architecture         |        Range Query Time        |       Point Update Time        | Construction Time | Memory Bound |
| :------------------- | :----------------------------: | :----------------------------: | :---------------: | :----------: |
| **Unindexed Array**  |        $\mathcal{O}(n)$        |        $\mathcal{O}(1)$        | $\mathcal{O}(1)$  |     $n$      |
| **Prefix Sum Array** |        $\mathcal{O}(1)$        |        $\mathcal{O}(n)$        | $\mathcal{O}(n)$  |     $n$      |
| **Segment Tree**     | $\mathbf{\mathcal{O}(\log n)}$ | $\mathbf{\mathcal{O}(\log n)}$ | $\mathcal{O}(n)$  |     $4n$     |

---

### 2. Binary Interval Decomposition & 4n Bound

A Segment Tree recursively divides an interval $[0, n-1]$ into two halves until reaching unit-length intervals $[i, i]$:

- **Leaf Nodes**: Hold individual elements $A[i]$.
- **Internal Nodes**: Store the aggregated result (e.g., sum) of their left child $[L, \text{mid}]$ and right child $[\text{mid}+1, R]$.
- **Storage Layout**: Flat 1D array indexed from $0$:
  - Left child of node $u$: $2u + 1$
  - Right child of node $u$: $2u + 2$
  - Maximum nodes in binary tree of height $\lceil \log_2 n \rceil + 1 \le 4n$.

<div class="my-6 p-4 bg-surface rounded-xl border border-border overflow-x-auto">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 310" width="100%" height="310" class="mx-auto block font-sans">
  <defs>
    <linearGradient id="seg-inside" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/><stop offset="100%" stop-color="#10b981" stop-opacity="0.05"/></linearGradient>
    <linearGradient id="seg-outside" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#64748b" stop-opacity="0.2"/><stop offset="100%" stop-color="#64748b" stop-opacity="0.05"/></linearGradient>
  </defs>
  <text x="410" y="22" text-anchor="middle" font-size="15" font-weight="bold" fill="currentColor">Segment Tree: Binary Interval Decomposition &amp; Query Range [2 &#x2026; 5] Pruning</text>
  <line x1="410" y1="50" x2="215" y2="110" stroke="#64748b" stroke-width="2"/>
  <line x1="410" y1="50" x2="605" y2="110" stroke="#64748b" stroke-width="2"/>
  <line x1="215" y1="110" x2="120" y2="175" stroke="#64748b" stroke-width="2"/>
  <line x1="215" y1="110" x2="310" y2="175" stroke="#64748b" stroke-width="2"/>
  <line x1="605" y1="110" x2="510" y2="175" stroke="#64748b" stroke-width="2"/>
  <line x1="605" y1="110" x2="700" y2="175" stroke="#64748b" stroke-width="2"/>
  <rect x="365" y="35" width="90" height="32" rx="6" fill="#1e293b" stroke="#0284c7" stroke-width="2"/>
  <text x="410" y="55" text-anchor="middle" font-size="12" font-weight="bold" fill="#38bdf8">[0 &#x2026; 7]</text>
  <rect x="170" y="95" width="90" height="32" rx="6" fill="#1e293b" stroke="#0284c7" stroke-width="2"/>
  <text x="215" y="115" text-anchor="middle" font-size="12" font-weight="bold" fill="#38bdf8">[0 &#x2026; 3]</text>
  <rect x="560" y="95" width="90" height="32" rx="6" fill="#1e293b" stroke="#0284c7" stroke-width="2"/>
  <text x="605" y="115" text-anchor="middle" font-size="12" font-weight="bold" fill="#38bdf8">[4 &#x2026; 7]</text>
  <rect x="75" y="160" width="90" height="32" rx="6" fill="url(#seg-outside)" stroke="#64748b" stroke-width="1.5"/>
  <text x="120" y="180" text-anchor="middle" font-size="11" fill="#94a3b8">[0 &#x2026; 1] (Out)</text>
  <rect x="265" y="160" width="90" height="32" rx="6" fill="url(#seg-inside)" stroke="#10b981" stroke-width="2.5"/>
  <text x="310" y="180" text-anchor="middle" font-size="12" font-weight="bold" fill="#10b981">[2 &#x2026; 3] &#x2714;</text>
  <rect x="465" y="160" width="90" height="32" rx="6" fill="url(#seg-inside)" stroke="#10b981" stroke-width="2.5"/>
  <text x="510" y="180" text-anchor="middle" font-size="12" font-weight="bold" fill="#10b981">[4 &#x2026; 5] &#x2714;</text>
  <rect x="655" y="160" width="90" height="32" rx="6" fill="url(#seg-outside)" stroke="#64748b" stroke-width="1.5"/>
  <text x="700" y="180" text-anchor="middle" font-size="11" fill="#94a3b8">[6 &#x2026; 7] (Out)</text>
  <rect x="80" y="225" width="660" height="65" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="95" y="248" font-size="11" font-weight="bold" fill="#10b981">Query(L=2, R=5) Canonical Coverage Result:</text>
  <text x="95" y="270" font-size="10.5" fill="currentColor">&#x2022; Segment [2 &#x2026; 3] and [4 &#x2026; 5] are completely covered: return aggregated values directly in O(1)!</text>
  <text x="550" y="248" font-size="11" font-weight="bold" fill="#38bdf8">Total Visited Nodes: &#x2264; 4 &#x2308;log&#x2082; n&#x2309;</text>
</svg>
</div>

---

### 3. Implementation: Segment Tree with Point Updates

```typescript
export class SegmentTree {
  private tree: number[];
  private n: number;

  constructor(nums: number[]) {
    this.n = nums.length;
    this.tree = new Array(4 * this.n).fill(0);
    if (this.n > 0) {
      this.build(nums, 0, 0, this.n - 1);
    }
  }

  private build(nums: number[], node: number, start: number, end: number): void {
    if (start === end) {
      this.tree[node] = nums[start];
      return;
    }
    const mid = start + Math.floor((end - start) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    this.build(nums, leftChild, start, mid);
    this.build(nums, rightChild, mid + 1, end);
    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }

  public update(index: number, val: number): void {
    this.updatePoint(0, 0, this.n - 1, index, val);
  }

  private updatePoint(node: number, start: number, end: number, idx: number, val: number): void {
    if (start === end) {
      this.tree[node] = val;
      return;
    }
    const mid = start + Math.floor((end - start) / 2);
    const leftChild = 2 * node + 1;
    const rightChild = 2 * node + 2;

    if (idx <= mid) {
      this.updatePoint(leftChild, start, mid, idx, val);
    } else {
      this.updatePoint(rightChild, mid + 1, end, idx, val);
    }
    this.tree[node] = this.tree[leftChild] + this.tree[rightChild];
  }

  public query(left: number, right: number): number {
    return this.queryRange(0, 0, this.n - 1, left, right);
  }

  private queryRange(node: number, start: number, end: number, L: number, R: number): number {
    // Case 1: Out of range
    if (R < start || end < L) return 0;

    // Case 2: Node range completely inside query range
    if (L <= start && end <= R) return this.tree[node];

    // Case 3: Partial overlap
    const mid = start + Math.floor((end - start) / 2);
    const p1 = this.queryRange(2 * node + 1, start, mid, L, R);
    const p2 = this.queryRange(2 * node + 2, mid + 1, end, L, R);
    return p1 + p2;
  }
}
```

---

## 3. Topic 149: Segment Tree with Lazy Propagation

### 1. The Challenge of Range Updates

When updating an entire interval $[L, R]$ by adding delta $v$ to every element:

- Iterating individual point updates requires $\mathcal{O}(k \log n)$ time, degrading to $\mathcal{O}(n \log n)$ for full-array updates.
- **Lazy Propagation Principle**: Postpone updating child nodes until their values are strictly needed by a descendant query or update.
- Maintain a secondary array `lazy[4n]`. When a node's interval falls completely within $[L, R]$:
  1. Increment `tree[node]` immediately by $v \cdot (\text{end} - \text{start} + 1)$.
  2. Accumulate $v$ into `lazy[node]`.
  3. Return without visiting children.
- If a future operation must traverse into child nodes, push the pending lazy tag down one level before proceeding.
- **Asymptotic Complexity**: Range Update drops from $\mathcal{O}(n \log n)$ to **$\mathcal{O}(\log n)$**.

---

## 4. Topic 150: Fenwick Tree (Binary Indexed Tree / BIT)

### 1. Low-Bit Isolation ($i \ \& \ (-i)$)

Invented by Peter Fenwick in 1994, the Binary Indexed Tree maintains prefix sums and point updates in $\mathcal{O}(\log n)$ time with **zero pointer overhead and strictly $n + 1$ integer cells**.

#### Mathematical Foundation

Let $\text{LSB}(i) = i \ \& \ (-i)$ isolate the least significant set bit of integer $i$.
Each 1-based index $i$ in a Fenwick Tree stores the partial sum for the left-open interval:

$$(i - (i \ \& \ (-i)), \ i]$$

| Index $i$ (Binary) | $\text{LSB}(i)$ | Responsible Interval Range           | Span Length |
| :----------------- | :-------------- | :----------------------------------- | :---------: |
| **1** ($0001_2$)   | 1               | $(0, 1] = A[1]$                      |      1      |
| **2** ($0010_2$)   | 2               | $(0, 2] = A[1] + A[2]$               |      2      |
| **3** ($0011_2$)   | 1               | $(2, 3] = A[3]$                      |      1      |
| **4** ($0100_2$)   | 4               | $(0, 4] = A[1] + A[2] + A[3] + A[4]$ |      4      |

---

### 2. Implementation: Fenwick Tree (BIT)

```typescript
export class FenwickTree {
  private tree: number[];
  private n: number;

  constructor(size: number) {
    this.n = size;
    this.tree = new Array(this.n + 1).fill(0);
  }

  /**
   * Adds delta to element at 1-based index i.
   * Time Complexity: O(log n)
   */
  public update(i: number, delta: number): void {
    while (i <= this.n) {
      this.tree[i] += delta;
      i += i & -i; // Cascade forward to parent intervals
    }
  }

  /**
   * Computes prefix sum from index 1 through i.
   * Time Complexity: O(log n)
   */
  public query(i: number): number {
    let sum = 0;
    while (i > 0) {
      sum += this.tree[i];
      i -= i & -i; // Cascade backward by stripping lowest set bits
    }
    return sum;
  }

  /**
   * Computes range sum from 1-based index L to R inclusive.
   */
  public queryRange(L: number, R: number): number {
    return this.query(R) - this.query(L - 1);
  }
}
```

---

## 5. Topic 151: Sparse Table (Static RMQ in Strictly $\mathcal{O}(1)$)

### 1. Idempotency Principle

An algebraic binary operation $\circ$ is **idempotent** if:
$$x \circ x = x$$

Functions such as $\min(x, y)$, $\max(x, y)$, and $\gcd(x, y)$ are idempotent, whereas addition is not.

Because overlapping duplicate elements do not alter the minimum value of an interval, any range $[L, R]$ of length $\text{len} = R - L + 1$ can be decomposed into **two overlapping power-of-two blocks** of length $2^k$, where:
$$k = \lfloor \log_2(\text{len}) \rfloor$$

$$\min(A[L \dots R]) = \min\Big(\text{ST}[k][L], \, \text{ST}[k][R - 2^k + 1]\Big)$$

```typescript
export class SparseTable {
  private st: number[][];
  private logTable: number[];

  constructor(nums: number[]) {
    const n = nums.length;
    const maxK = Math.floor(Math.log2(Math.max(1, n))) + 1;
    this.st = Array.from({ length: maxK }, () => new Array(n).fill(0));

    // Precompute floor(log2(i)) for O(1) query lookup
    this.logTable = new Array(n + 1).fill(0);
    for (let i = 2; i <= n; i++) {
      this.logTable[i] = this.logTable[Math.floor(i / 2)] + 1;
    }

    // Base row: intervals of length 2^0 = 1
    for (let i = 0; i < n; i++) {
      this.st[0][i] = nums[i];
    }

    // Dynamic programming fill: ST[k][i] = min(ST[k-1][i], ST[k-1][i + 2^(k-1)])
    for (let k = 1; k < maxK; k++) {
      const halfLen = 1 << (k - 1);
      for (let i = 0; i + (1 << k) <= n; i++) {
        this.st[k][i] = Math.min(this.st[k - 1][i], this.st[k - 1][i + halfLen]);
      }
    }
  }

  /**
   * Evaluates Range Minimum Query in strictly O(1) time.
   */
  public queryMin(L: number, R: number): number {
    const len = R - L + 1;
    const k = this.logTable[len];
    return Math.min(this.st[k][L], this.st[k][R - (1 << k) + 1]);
  }
}
```

---

## 6. Range Query Data Structures Comparison

| Data Structure          |   Preprocessing Time    |           Range Query Time            |   Point Update Time   |        Range Update Time         |     Auxiliary Space     | Idempotency Required? |
| :---------------------- | :---------------------: | :-----------------------------------: | :-------------------: | :------------------------------: | :---------------------: | :-------------------: |
| **Prefix Sum Array**    |    $\mathcal{O}(n)$     |      $\mathcal{O}(1)$ (Sum only)      |   $\mathcal{O}(n)$    |         $\mathcal{O}(n)$         |           $n$           |          No           |
| **Sparse Table**        | $\mathcal{O}(n \log n)$ | $\mathbf{\mathcal{O}(1)}$ (RMQ / GCD) |     Not supported     |          Not supported           | $\mathcal{O}(n \log n)$ |        **Yes**        |
| **Fenwick Tree (BIT)**  |    $\mathcal{O}(n)$     |         $\mathcal{O}(\log n)$         | $\mathcal{O}(\log n)$ | $\mathcal{O}(\log n)$ (Dual BIT) |      $\mathbf{n}$       | No (Invertible only)  |
| **Segment Tree**        |    $\mathcal{O}(n)$     |         $\mathcal{O}(\log n)$         | $\mathcal{O}(\log n)$ |         $\mathcal{O}(n)$         |          $4n$           | No (Associative only) |
| **Segment Tree + Lazy** |    $\mathcal{O}(n)$     |         $\mathcal{O}(\log n)$         | $\mathcal{O}(\log n)$ |  $\mathbf{\mathcal{O}(\log n)}$  |          $4n$           | No (Associative only) |

---

## References & Academic Attribution

1. **Fenwick, P. M.** (1994). A new data structure for cumulative frequency tables. _Software: Practice and Experience_, 24(3), 327–336.
2. **Bender, M. A., & Farach-Colton, M.** (2000). The LCA problem revisited. _Latin American Symposium on Theoretical Informatics_, 88–94. Springer.
3. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). _Introduction to Algorithms_ (4th ed.). MIT Press.
