# Part 05: Sorting — Module 02: Divide & Conquer and Heap Sorts

> **Topics Covered:**  
> 53. Merge Sort (Divide & Conquer, Merging & Stability) &bull; 54. Quick Sort (Partitioning Schemes, Pivot Strategies & Dutch National Flag) &bull; 55. Heap Sort (Max-Heap, In-Place Sorting & $O(n)$ Build-Heap Derivation)

---

Divide-and-conquer and heap-based algorithms elevate comparison sorting to the theoretical optimum of $\Theta(n \log n)$ time. While sharing identical asymptotic lower bounds, Merge Sort, Quick Sort, and Heap Sort make fundamentally divergent engineering trade-offs across memory footprint, cache line utilization, algorithmic stability, and worst-case guarantees. Merge Sort offers deterministic stability at the cost of auxiliary memory buffers; Quick Sort delivers exceptional real-world throughput through cache locality and in-place partitioning, yet requires defenses against pathological inputs; and Heap Sort enforces strict $O(1)$ space and $O(n \log n)$ worst-case bounds at the expense of scattered memory access patterns.

### Learning Objectives
- Formulate the Divide-and-Conquer recurrence $T(n) = 2T(n/2) + \Theta(n)$ and implement stable linear-time 2-way merging.
- Analyze Quick Sort partitioning strategies (Lomuto vs Hoare) and implement Dutch National Flag (3-way) partitioning for duplicate key robustness.
- Implement recursive call stack depth optimization ($O(\log n)$ space bound) via tail-recursion elimination.
- Derive mathematically why Floyd's bottom-up `BuildMaxHeap` algorithm executes in strictly linear $O(n)$ time.
- Synthesize the cache performance, memory overhead, stability, and failure modes across Merge Sort, Quick Sort, and Heap Sort.

---

## Topic 53: Merge Sort (Divide & Conquer & Stability)

### 1. Architectural Paradigm: Divide, Conquer, Combine

Merge Sort, devised by John von Neumann in 1945, is an asymptotically optimal, comparison-based, stable sorting algorithm operating strictly under the **Divide-and-Conquer** paradigm:

1. **Divide:** Split the array of size $n$ at midpoint $\text{mid} = \lfloor(low + high) / 2\rfloor$ into two contiguous sub-arrays of size $\lfloor n/2 \rfloor$ and $\lceil n/2 \rceil$.
2. **Conquer:** Recursively invoke Merge Sort on both sub-arrays until reaching trivial base-case sub-arrays of size $1$ (which are trivially sorted).
3. **Combine (Merge):** Linearly merge the two sorted sub-arrays into a single sorted range using two tracking pointers.

The table below traces the hierarchical division and recursive bottom-up merge stages for input $A = [38, 27, 43, 3, 9, 82, 10]$:

| Recursion Tree Level | Operation Stage | Partition Segments | Active Subarray Operations | Comparisons at Level |
| :---: | :---: | :--- | :--- | :---: |
| **Level 0** (Root) | Divide | $[38, 27, 43, 3, 9, 82, 10]$ | Split at index 3 $\implies [38, 27, 43, 3]$ and $[9, 82, 10]$ | 0 |
| **Level 1** | Divide | $[38, 27, 43, 3] \mid [9, 82, 10]$ | Split into pairs: $[38, 27]$, $[43, 3]$, $[9, 82]$, $[10]$ | 0 |
| **Level 2** | Divide (Base) | $[38], [27], [43], [3], [9], [82], [10]$ | Base cases reached ($low = high$, size 1) | 0 |
| **Level 2 $\to$ 1** | **Merge** | $[27, 38], [3, 43], [9, 82], [10]$ | 2-element pairwise merges | 4 comparisons |
| **Level 1 $\to$ 0** | **Merge** | $[3, 27, 38, 43] \mid [9, 10, 82]$ | Merge 4-element and 3-element subarrays | 5 comparisons |
| **Final Combine** | **Merge** | $[3, 9, 10, 27, 38, 43, 82]$ | Final two-pointer merge into complete array | 6 comparisons |

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Algorithm Architectures: Merge Sort Divide &amp; Conquer vs. Quick Sort Partitioning Paradigms
  </div>
  <svg viewBox="0 0 850 360" class="w-full h-auto text-xs" style="max-height: 360px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="dcArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="320" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Left: Merge Sort Tree (Divide & Conquer) -->
    <g transform="translate(45, 45)">
      <text x="175" y="20" font-weight="700" fill="#3b82f6" text-anchor="middle" font-size="13">Merge Sort: Divide &amp; 2-Way Combine</text>
      <!-- Root Array -->
      <g transform="translate(85, 40)">
        <rect x="0" y="0" width="180" height="30" rx="4" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6"/>
        <text x="90" y="19" text-anchor="middle" font-family="monospace">[38, 27, 43, 3, 9, 82]</text>
      </g>
      <!-- Divide Branch Arrows -->
      <path d="M 140 75 L 90 105" stroke="currentColor" stroke-width="1.5" marker-end="url(#dcArrow)"/>
      <path d="M 210 75 L 260 105" stroke="currentColor" stroke-width="1.5" marker-end="url(#dcArrow)"/>
      <!-- Level 1 Subarrays -->
      <g transform="translate(30, 110)">
        <rect x="0" y="0" width="120" height="28" rx="4" fill="#3b82f6" fill-opacity="0.1" stroke="#3b82f6"/>
        <text x="60" y="18" text-anchor="middle" font-family="monospace">[38, 27, 43]</text>
      </g>
      <g transform="translate(200, 110)">
        <rect x="0" y="0" width="120" height="28" rx="4" fill="#3b82f6" fill-opacity="0.1" stroke="#3b82f6"/>
        <text x="60" y="18" text-anchor="middle" font-family="monospace">[3, 9, 82]</text>
      </g>
      <!-- Merge Back Arrow -->
      <path d="M 90 145 L 140 185" stroke="#10b981" stroke-width="2" marker-end="url(#dcArrow)"/>
      <path d="M 260 145 L 210 185" stroke="#10b981" stroke-width="2" marker-end="url(#dcArrow)"/>
      <!-- Combined Array -->
      <g transform="translate(85, 195)">
        <rect x="0" y="0" width="180" height="32" rx="4" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="1.5"/>
        <text x="90" y="20" text-anchor="middle" font-family="monospace" font-weight="700" fill="#10b981">[3, 9, 27, 38, 43, 82]</text>
      </g>
      <text x="175" y="255" text-anchor="middle" font-size="10" fill="currentColor" fill-opacity="0.75">&bull; Guaranteed &Theta;(n log n) &bull; Stable &bull; Auxiliary Space O(n)</text>
    </g>
    <!-- Divider -->
    <line x1="420" y1="40" x2="420" y2="340" stroke="currentColor" stroke-opacity="0.15" stroke-width="1.5"/>
    <!-- Right: Quick Sort Partition Schemes -->
    <g transform="translate(450, 45)">
      <text x="180" y="20" font-weight="700" fill="#f59e0b" text-anchor="middle" font-size="13">Quick Sort: Partitioning Invariants</text>
      <!-- Scheme 1: Lomuto vs Hoare -->
      <g transform="translate(10, 45)">
        <rect x="0" y="0" width="340" height="75" rx="6" fill="#f59e0b" fill-opacity="0.08" stroke="#f59e0b"/>
        <text x="15" y="22" font-weight="700" fill="#f59e0b" font-size="11">Hoare Bidirectional Partition:</text>
        <text x="15" y="40" fill="currentColor" fill-opacity="0.8" font-size="10">Pointers i &rarr; and &larr; j converge towards center.</text>
        <text x="15" y="58" font-size="10" font-weight="600" fill="#10b981">Executes 3x fewer swaps than Lomuto on average!</text>
      </g>
      <!-- Scheme 2: Dutch National Flag 3-Way Partition -->
      <g transform="translate(10, 135)">
        <rect x="0" y="0" width="340" height="95" rx="6" fill="#10b981" fill-opacity="0.08" stroke="#10b981" stroke-width="1.5"/>
        <text x="15" y="22" font-weight="700" fill="#10b981" font-size="11">Dutch National Flag (3-Way Partition for Duplicates):</text>
        <g transform="translate(15, 35)">
          <rect x="0" y="0" width="95" height="30" rx="3" fill="#3b82f6" fill-opacity="0.2"/>
          <text x="47" y="19" text-anchor="middle" font-size="10">&lt; Pivot</text>
          <rect x="100" y="0" width="105" height="30" rx="3" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="1.5"/>
          <text x="152" y="19" text-anchor="middle" font-weight="700" font-size="10">== Pivot</text>
          <rect x="210" y="0" width="95" height="30" rx="3" fill="#ef4444" fill-opacity="0.2"/>
          <text x="257" y="19" text-anchor="middle" font-size="10">&gt; Pivot</text>
        </g>
        <text x="15" y="82" font-size="10" fill="currentColor" fill-opacity="0.75">Equal elements are never recursively sorted &rarr; O(n) on duplicates!</text>
      </g>
      <text x="180" y="255" text-anchor="middle" font-size="10" fill="currentColor" fill-opacity="0.75">&bull; In-Place O(log n) stack &bull; Unstable &bull; Cache Friendly</text>
    </g>
  </svg>
</div>

---

### 2. Linear Merge Subroutine & State Trace

The core engine of Merge Sort is the linear merge procedure. Given two sorted adjacent subarrays $L = A[low \dots \text{mid}]$ and $R = A[\text{mid} + 1 \dots high]$, the subroutine copies them into temporary buffers and steps two pointers $i$ and $j$ forward, copying the smaller element into $A[k]$.

> **Crucial Stability Invariant:**  
> When $L[i] = R[j]$, the algorithm **must** select $L[i]$ from the left buffer. Because elements in $L$ originally appeared before elements in $R$, this tie-breaking rule guarantees that identical keys preserve their relative order, making Merge Sort **stable**.

#### State Trace: Merging $L = [27, 38, 43]$ and $R = [3, 9, 10, 82]$

| Step $k$ | Left Pointer $i$ ($L[i]$) | Right Pointer $j$ ($R[j]$) | Comparison ($L[i] \le R[j]$) | Element Selected | Output Target $A[k]$ | Advancing Pointer |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0** | $0$ (`27`) | $0$ (`3`) | $27 \le 3$ is **False** | `3` (from $R$) | $A[0] \leftarrow 3$ | $j \leftarrow 1$ |
| **1** | $0$ (`27`) | $1$ (`9`) | $27 \le 9$ is **False** | `9` (from $R$) | $A[1] \leftarrow 9$ | $j \leftarrow 2$ |
| **2** | $0$ (`27`) | $2$ (`10`) | $27 \le 10$ is **False** | `10` (from $R$) | $A[2] \leftarrow 10$ | $j \leftarrow 3$ |
| **3** | $0$ (`27`) | $3$ (`82`) | $27 \le 82$ is **True** | `27` (from $L$) | $A[3] \leftarrow 27$ | $i \leftarrow 1$ |
| **4** | $1$ (`38`) | $3$ (`82`) | $38 \le 82$ is **True** | `38` (from $L$) | $A[4] \leftarrow 38$ | $i \leftarrow 2$ |
| **5** | $2$ (`43`) | $3$ (`82`) | $43 \le 82$ is **True** | `43` (from $L$) | $A[5] \leftarrow 43$ | $i \leftarrow 3$ ($L$ exhausted) |
| **6** | $3$ (Exhausted) | $3$ (`82`) | Buffer $L$ empty | `82` (drain $R$) | $A[6] \leftarrow 82$ | $j \leftarrow 4$ ($R$ exhausted) |

---

### 3. Canonical Algorithm: Merge Sort

```text
FUNCTION MergeSort(A: Array of Element, low: Integer, high: Integer):
    IF low < high THEN
        mid <- low + FLOOR((high - low) / 2)

        MergeSort(A, low, mid)
        MergeSort(A, mid + 1, high)
        Merge(A, low, mid, high)
    END IF

FUNCTION Merge(A: Array of Element, low: Integer, mid: Integer, high: Integer):
    n1 <- mid - low + 1
    n2 <- high - mid

    // Allocate temporary buffers
    L <- Array of size n1
    R <- Array of size n2

    FOR i <- 0 TO n1 - 1 DO L[i] <- A[low + i]
    FOR j <- 0 TO n2 - 1 DO R[j] <- A[mid + 1 + j]

    i <- 0
    j <- 0
    k <- low

    WHILE i < n1 AND j < n2 DO
        // '<=' is required for stability
        IF L[i] <= R[j] THEN
            A[k] <- L[i]
            i <- i + 1
        ELSE
            A[k] <- R[j]
            j <- j + 1
        END IF
        k <- k + 1
    END WHILE

    // Copy remaining elements of L (if any)
    WHILE i < n1 DO
        A[k] <- L[i]
        i <- i + 1
        k <- k + 1
    END WHILE

    // Copy remaining elements of R (if any)
    WHILE j < n2 DO
        A[k] <- R[j]
        j <- j + 1
        k <- k + 1
    END WHILE
```

---

### 4. Asymptotic Analysis: The Master Theorem Recurrence

The runtime of Merge Sort on an array of size $n$ satisfies the standard divide-and-conquer recurrence:

$$T(n) = 2T\left(\frac{n}{2}\right) + \Theta(n), \quad T(1) = \Theta(1)$$

- $2T(n/2)$ represents the work of recursively sorting both halves.
- $\Theta(n)$ represents the linear merging pass across $n$ elements.

Applying the Master Theorem ($T(n) = aT(n/b) + f(n)$):
- $a = 2, b = 2 \implies n^{\log_b a} = n^{\log_2 2} = n^1 = n$.
- $f(n) = \Theta(n) = \Theta(n^{\log_b a})$.
- This matches **Case 2** of the Master Theorem:
  $$T(n) = \mathbf{\Theta(n \log n)} \quad \text{across Best, Average, and Worst Cases!}$$

#### Resource Constraints:
- **Auxiliary Space:** $\Theta(n)$. Merging requires allocating temporary buffers proportional to the subarray size. In-place merge algorithms exist but suffer from large constant-factor slowdowns ($O(n \log^2 n)$ or high $c$).
- **Call Stack Memory:** $\Theta(\log n)$ activation records on the execution stack.
- **Stability:** **Stable**.

---

## Topic 54: Quick Sort (Partitioning Schemes & 3-Way Splitting)

### 1. Architectural Concept: Divide-and-Conquer In-Place

Quick Sort, invented by Tony Hoare in 1959, inverts Merge Sort's philosophy. Where Merge Sort does simple work dividing ($O(1)$) and heavy work combining ($\Theta(n)$), Quick Sort does heavy work dividing ($\Theta(n)$ partitioning) and zero work combining ($O(1)$).

1. **Pivot Selection:** Choose an element $p$ from subarray $A[low \dots high]$.
2. **Partitioning:** Rearrange $A[low \dots high]$ in place such that all elements smaller than $p$ precede it, and all elements larger than $p$ succeed it. The pivot is now at its **final sorted position** $\text{pivotIdx}$.
3. **Conquer:** Recursively sort subarrays $A[low \dots \text{pivotIdx} - 1]$ and $A[\text{pivotIdx} + 1 \dots high]$.

---

### 2. Partitioning Schemes: Lomuto vs Hoare

| Feature | Lomuto Partitioning Scheme | Hoare Partitioning Scheme |
| :--- | :--- | :--- |
| **Pivot Placement** | Typically chosen at $A[high]$ (or swapped there) | Typically chosen at $A[low]$ or median |
| **Pointer Mechanics** | Single forward-scanning pointer $j$, barrier pointer $i$ | Two pointers $i$ and $j$ converging inward |
| **Average Swap Count** | Higher ($\approx \frac{n}{2}$ to $\frac{2n}{3}$ swaps) | **Low** ($\approx \frac{n}{6}$ swaps, roughly $3\times$ fewer) |
| **Duplicate Keys** | Poor ($O(n^2)$ when all elements are identical) | Excellent (splits equal elements across both halves) |
| **Pivot Final Location** | Returned index is guaranteed final pivot index | Returned index splits array, pivot may not be at boundary |

#### A. Canonical Lomuto Partitioning Algorithm

```text
FUNCTION LomutoPartition(A: Array of Element, low: Integer, high: Integer) -> Integer:
    pivot <- A[high]
    i <- low - 1

    FOR j <- low TO high - 1 DO
        IF A[j] < pivot THEN
            i <- i + 1
            Swap(A[i], A[j])
        END IF
    END FOR

    Swap(A[i + 1], A[high])
    RETURN i + 1    // Final index of pivot
```

#### B. Canonical Hoare Partitioning Algorithm

```text
FUNCTION HoarePartition(A: Array of Element, low: Integer, high: Integer) -> Integer:
    pivot <- A[low]
    i <- low - 1
    j <- high + 1

    LOOP
        REPEAT i <- i + 1 UNTIL A[i] >= pivot
        REPEAT j <- j - 1 UNTIL A[j] <= pivot

        IF i >= j THEN
            RETURN j
        END IF

        Swap(A[i], A[j])
    END LOOP
```

---

### 3. Stack Space Bound: Tail-Call Optimization

Naive recursive Quick Sort can consume $O(n)$ stack space if partitions degenerate into unbalanced $1 : n - 1$ splits. By sorting the **smaller partition recursively** and handling the larger partition via an **iterative loop update** (tail-call elimination), stack depth is strictly bounded to $\mathbf{O(\log n)}$:

```text
FUNCTION QuickSortTailOptimized(A: Array of Element, low: Integer, high: Integer):
    WHILE low < high DO
        pivotIdx <- Partition(A, low, high)

        // Always recurse into the smaller partition first
        IF pivotIdx - low < high - pivotIdx THEN
            QuickSortTailOptimized(A, low, pivotIdx - 1)
            low <- pivotIdx + 1    // Tail-call elimination
        ELSE
            QuickSortTailOptimized(A, pivotIdx + 1, high)
            high <- pivotIdx - 1   // Tail-call elimination
        END IF
    END WHILE
```

---

### 4. Duplicate Key Degeneracy & Dutch National Flag (3-Way) Partitioning

When an input contains large clusters of identical elements (e.g., boolean flags, categorical keys, or repeated numbers), standard 2-way Quick Sort repeatedly partitions around duplicates, degenerating to $\Theta(n^2)$ time. Edsger Dijkstra's **Dutch National Flag (3-Way Partitioning)** solves this by partitioning the array into three contiguous zones in a single pass:
1. $A[low \dots \text{lt} - 1] < \text{pivot}$
2. $A[\text{lt} \dots \text{gt}] = \text{pivot}$
3. $A[\text{gt} + 1 \dots high] > \text{pivot}$

#### 3-Way Invariant Layout:

| Segment | Range | Structural Property | Pointer Invariant |
| :---: | :---: | :--- | :--- |
| **Zone 1** | $[low \dots \text{lt} - 1]$ | Elements strictly smaller than pivot | Maintained via `Swap(A[lt], A[mid]); lt++; mid++` |
| **Zone 2** | $[\text{lt} \dots \text{mid} - 1]$ | Elements strictly equal to pivot | Unaltered; advanced via `mid++` |
| **Zone 3** | $[\text{mid} \dots \text{gt}]$ | Unprocessed elements | Current element inspected at `mid` |
| **Zone 4** | $[\text{gt} + 1 \dots high]$ | Elements strictly greater than pivot | Maintained via `Swap(A[mid], A[gt]); gt--` |

#### State Trace: 3-Way Partitioning on $A = [4, 2, 4, 3, 4, 1]$, $\text{pivot} = 4$

| Step | $\text{lt}$ | $\text{mid}$ | $\text{gt}$ | Current Element $A[\text{mid}]$ | Comparison vs Pivot (`4`) | Action Taken | Array State Post-Step |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- | :---: |
| **0** | $0$ | $0$ | $5$ | $A[0] = 4$ | Equal ($4 = 4$) | `mid++` | $[4, 2, 4, 3, 4, 1]$ |
| **1** | $0$ | $1$ | $5$ | $A[1] = 2$ | Less ($2 < 4$) | `Swap(A[0], A[1]); lt++; mid++` | $[2, 4, 4, 3, 4, 1]$ |
| **2** | $1$ | $2$ | $5$ | $A[2] = 4$ | Equal ($4 = 4$) | `mid++` | $[2, 4, 4, 3, 4, 1]$ |
| **3** | $1$ | $3$ | $5$ | $A[3] = 3$ | Less ($3 < 4$) | `Swap(A[1], A[3]); lt++; mid++` | $[2, 3, 4, 4, 4, 1]$ |
| **4** | $2$ | $4$ | $5$ | $A[4] = 4$ | Equal ($4 = 4$) | `mid++` | $[2, 3, 4, 4, 4, 1]$ |
| **5** | $2$ | $5$ | $5$ | $A[5] = 1$ | Less ($1 < 4$) | `Swap(A[2], A[5]); lt++; mid++` | $[2, 3, 1, 4, 4, 4]$ |
| **Done** | $3$ | $6$ | $5$ | $\text{mid} > \text{gt}$ | Loop terminates | Middle segment $[4, 4, 4]$ completely sorted! | $[2, 3, 1 \mid 4, 4, 4]$ |

After this single $O(n)$ pass, all instances of `4` are locked in their final global positions. The recursive step only sorts $[2, 3, 1]$, completely bypassing all duplicates!

---

## Topic 55: Heap Sort (Max-Heap, In-Place Sorting & Linear Construction)

### 1. Conceptual Mechanics & In-Place Binary Heap

Heap Sort converts an array into an implicit complete binary tree mapped directly into continuous memory:
- Root is stored at index $0$.
- For any node at index $i$:
  - Left child: $\text{left}(i) = 2i + 1$
  - Right child: $\text{right}(i) = 2i + 2$
  - Parent: $\text{parent}(i) = \lfloor (i - 1) / 2 \rfloor$

A **Max-Heap** enforces the property that $A[\text{parent}(i)] \ge A[i]$ for all $i > 0$. Heap Sort proceeds in two phases:
1. **Phase 1 (Heap Construction):** Convert unsorted array $A[0 \dots n - 1]$ into a Max-Heap in $O(n)$ time using Floyd's bottom-up algorithm.
2. **Phase 2 (Successive Extraction):** For $i = n - 1$ down to $1$:
   - Swap root $A[0]$ (the current maximum) with $A[i]$ (locking the maximum into the sorted suffix).
   - Decrement heap size to $i$.
   - Sift the displaced root downward via `HeapifyDown(A, i, 0)` in $O(\log n)$ time.

---

### 2. State Trace: Max-Heap Construction on $A = [4, 10, 3, 5, 1]$

Floyd's algorithm starts at the last non-leaf node index $\lfloor n/2 \rfloor - 1 = \lfloor 5/2 \rfloor - 1 = 1$, and filters down toward the root $0$:

| Pass Index $i$ | Target Node $A[i]$ | Children $(2i+1, 2i+2)$ | Largest Among $\{i, \text{left}, \text{right}\}$ | Mutation (Swap Action) | Resulting Array State |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **$i = 1$** | `10` | Left: $A[3]=5$, Right: $A[4]=1$ | Node 1 (`10` is max) | None (Heap property satisfied) | $[4, 10, 3, 5, 1]$ |
| **$i = 0$** | `4` | Left: $A[1]=10$, Right: $A[2]=3$ | Left child ($10 > 4$) | Swap $A[0] \leftrightarrow A[1]$ ($4 \leftrightarrow 10$) | $[10, 4, 3, 5, 1]$ |
| **Cascade ($i=1$)** | `4` | Left: $A[3]=5$, Right: $A[4]=1$ | Left child ($5 > 4$) | Swap $A[1] \leftrightarrow A[3]$ ($4 \leftrightarrow 5$) | $[\mathbf{10}, \mathbf{5}, \mathbf{3}, \mathbf{4}, \mathbf{1}]$ |

The array is now a valid Max-Heap in strictly linear operations.

---

### 3. Rigorous Proof: Why BuildMaxHeap is $O(n)$, NOT $O(n \log n)$

A common naive analysis assumes calling `HeapifyDown` (costing $O(\log n)$) on $n/2$ nodes yields $O(n \log n)$. This is mathematically incorrect because the vast majority of nodes reside near the leaves and have very small heights.

#### Formal Derivation:
In a complete binary tree of $n$ nodes, the height is $h = \lfloor \log_2 n \rfloor$.  
At height $k$ (measured from the leaves where $k = 0$), there are at most $\lceil n / 2^{k+1} \rceil$ nodes. A node at height $k$ can drop at most $k$ levels during `HeapifyDown`:

$$\text{Total Cost} = \sum_{k=0}^{\lfloor \log_2 n \rfloor} \left\lceil \frac{n}{2^{k+1}} \right\rceil \cdot O(k) \le c n \sum_{k=0}^{\infty} \frac{k}{2^{k+1}} = \frac{c n}{2} \sum_{k=0}^{\infty} \frac{k}{2^k}$$

To evaluate the infinite series $S = \sum_{k=0}^{\infty} \frac{k}{2^k}$:
$$S = \frac{0}{1} + \frac{1}{2} + \frac{2}{4} + \frac{3}{8} + \frac{4}{16} + \dots$$
Multiply by $\frac{1}{2}$:
$$\frac{1}{2}S = \frac{0}{2} + \frac{1}{4} + \frac{2}{8} + \frac{3}{16} + \dots$$
Subtract $\frac{1}{2}S$ from $S$:
$$S - \frac{1}{2}S = \frac{1}{2}S = \sum_{k=1}^{\infty} \frac{1}{2^k} = \frac{1/2}{1 - 1/2} = 1 \implies S = 2$$

Substituting $S = 2$ back into the summation:

$$\text{Total Cost} \le \frac{c n}{2} \times 2 = c \cdot n = \mathbf{\Theta(n)} \quad \blacksquare$$

Therefore, bottom-up heap construction runs in strictly **linear $\Theta(n)$ time**.

---

### 4. Canonical Algorithm: Heap Sort

```text
FUNCTION HeapSort(A: Array of Element, n: Integer):
    // Phase 1: Build Max-Heap in Theta(n) time
    FOR i <- FLOOR(n / 2) - 1 DOWNTO 0 DO
        HeapifyDown(A, n, i)
    END FOR

    // Phase 2: Extract maximum elements in Theta(n log n) time
    FOR i <- n - 1 DOWNTO 1 DO
        // Move current root (maximum) to end of unsorted region
        Swap(A[0], A[i])
        // Re-heapify root with reduced heap size i
        HeapifyDown(A, i, 0)
    END FOR

FUNCTION HeapifyDown(A: Array of Element, heapSize: Integer, rootIdx: Integer):
    largest <- rootIdx
    left <- 2 * rootIdx + 1
    right <- 2 * rootIdx + 2

    IF left < heapSize AND A[left] > A[largest] THEN
        largest <- left
    END IF

    IF right < heapSize AND A[right] > A[largest] THEN
        largest <- right
    END IF

    IF largest != rootIdx THEN
        Swap(A[rootIdx], A[largest])
        HeapifyDown(A, heapSize, largest)
    END IF
```

---

## Master Comparison Matrix: $O(n \log n)$ Sorting Algorithms

| Metric | Merge Sort | Quick Sort | Heap Sort |
| :--- | :---: | :---: | :---: |
| **Best-Case Time** | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n \log n)$ |
| **Average-Case Time** | $\Theta(n \log n)$ | $\Theta(n \log n)$ | $\Theta(n \log n)$ |
| **Worst-Case Time** | $\mathbf{\Theta(n \log n)}$ | $\Theta(n^2)$ (pathological pivots) | $\mathbf{\Theta(n \log n)}$ |
| **Auxiliary Memory** | $\Theta(n)$ buffers | $\mathbf{\Theta(\log n)}$ stack frames | $\mathbf{\Theta(1)}$ in-place |
| **Stability** | **Stable** | **Unstable** | **Unstable** |
| **L1/L2 Cache Locality** | Good (sequential sweeps) | **Optimal** (contiguous blocks) | Poor (power-of-2 jumping) |
| **Adaptive to Pre-Sorted?** | With check: $O(n)$ best | With median pivot: $O(n \log n)$ | Always $\Theta(n \log n)$ |
| **Primary Industry Role** | External sorting, linked lists | General-purpose library sort | Real-time / safety-critical systems |

---

## Module 02 Summary & Key Takeaways

1. **Merge Sort Determinism:** Merge Sort guarantees $\Theta(n \log n)$ runtime across all inputs and preserves duplicate ordering (stability), but requires $\Theta(n)$ auxiliary memory.
2. **Quick Sort Throughput:** Quick Sort is usually the fastest general-purpose sort in practice due to contiguous cache locality. Applying Median-of-Three pivot selection and Dutch National Flag 3-way partitioning prevents $O(n^2)$ degradation on sorted data or duplicate arrays.
3. **Tail-Call Recursion Bound:** Recursing into the smaller partition first bounds Quick Sort's execution call stack depth to $O(\log n)$ frames in the worst case.
4. **Floyd's Linear Heap Build:** Converting an unsorted array into a Max-Heap takes $\Theta(n)$ time because the number of nodes decays exponentially with height: $\sum k/2^k = 2$.
5. **Heap Sort Predictability:** Heap Sort provides guaranteed $O(n \log n)$ worst-case time with strictly $O(1)$ auxiliary space, making it the algorithm of choice for mission-critical embedded systems where memory allocations and quadratic spikes are unacceptable.

---

## References & Academic Attribution

1. **von Neumann, J.** (1945). *First Draft of a Report on the EDVAC* (Merge sort derivation and design). Institute for Advanced Study, Princeton.
2. **Hoare, C. A. R.** (1961). Algorithm 64: Quicksort. *Communications of the ACM*, 4(7), 321.
3. **Williams, J. W. J.** (1964). Algorithm 232: Heapsort. *Communications of the ACM*, 7(6), 347–348.
4. **Floyd, R. W.** (1964). Algorithm 245: Treesort 3 (Linear Build-Heap analysis). *Communications of the ACM*, 7(12), 701.
5. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 6, 7, and 8. MIT Press.

