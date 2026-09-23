# Part 02: Linear Data Structures — Module 01: Arrays & Dynamic Arrays

> **Topics Covered:**  
> 20. Static Arrays &bull; 21. Dynamic Arrays (Vectors / Resizable Arrays)

---

Contiguous memory allocation is the foundational building block of computing systems, establishing a direct bridge between physical hardware addressing and high-level algorithmic abstractions. This chapter examines the mechanics of static arrays and dynamically resizable vectors, detailing memory bus addressing equations, CPU cache-line spatial locality, algorithmic invariants for in-place shifts, amortized complexity proofs via the accounting method, and anti-thrashing memory policies.

### Learning Objectives
- Compute exact physical byte addresses for arbitrary 1D and multi-dimensional array coordinates using base-offset arithmetic.
- Explain the physical mechanism of CPU L1/L2 cache prefetching and quantify the performance disparity between contiguous arrays and scattered pointer structures.
- Implement robust boundary-checked insertion, deletion, and search algorithms with formal loop invariants.
- Derive the $O(1)$ amortized cost of geometric array doubling using both aggregate analysis and the accounting method.
- Construct memory-efficient resizing policies that prevent allocation hysteresis and resize thrashing during alternating insertions and deletions.

---

## Topic 20: Static Arrays

### 1. Conceptual & Architectural Foundations

A **Static Array** is a fixed-size, homogeneous sequence of elements stored consecutively in physical memory. Its defining algorithmic trait is $O(1)$ constant-time random access: any element can be read or mutated in a single step using its integer index.

#### The Physical Memory Model
Modern computer memory (RAM) is organized as a linear array of byte-addressable cells. When a program requests a static array of $N$ elements where each element requires $S$ bytes, the runtime environment requests an unbroken contiguous segment of $N \times S$ bytes from the operating system.

The hardware relies on the **Base-Offset Memory Formula**:

$$\text{Address}(A[i]) = \alpha + (i \times S)$$

where:
- $\alpha$ is the **Base Address** (physical address of the first byte of $A[0]$).
- $i$ is the **Zero-Based Index** ($0 \le i < N$).
- $S$ is the **Element Size** in bytes (example on a typical implementation: $S = 4$ for a 32-bit integer; a C `double` is commonly 8 bytes while `float` is commonly 4 bytes — exact sizes depend on ABI, alignment, and language).

Because address arithmetic avoids scanning intermediate elements $A[0 \dots i-1]$ (illustratively a few fast CPU operations, exact timing varies by microarchitecture), array indexing is $O(1)$.

```
Physical Layout in RAM:
+---------------------------------------------------------------------------------+
|  Base α (0x1000)  |  α + 4 (0x1004)   |  α + 8 (0x1008)   |  α + 12 (0x100C)  |
|      A[0] = 42    |      A[1] = 17    |      A[2] = 89    |      A[3] = 05    |
+---------------------------------------------------------------------------------+
```

#### Physical Memory Mapping Table

| Physical RAM Address | Offset Formula | Array Element | Stored Value | Byte Offset ($S = 4$) |
| :--- | :--- | :---: | :---: | :---: |
| `0x1000` | $\alpha + (0 \times 4)$ | `A[0]` | `42` | $+0\text{ bytes}$ |
| `0x1004` | $\alpha + (1 \times 4)$ | `A[1]` | `17` | $+4\text{ bytes}$ |
| `0x1008` | $\alpha + (2 \times 4)$ | `A[2]` | `89` | $+8\text{ bytes}$ |
| `0x100C` | $\alpha + (3 \times 4)$ | `A[3]` | `05` | $+12\text{ bytes}$ |
| `0x1010` | $\alpha + (4 \times 4)$ | `A[4]` | `63` | $+16\text{ bytes}$ |

---

### 2. Hardware Symbiosis: CPU Cache Lines & Spatial Locality

The primary performance advantage of contiguous arrays over pointer-linked nodes is **Hardware Spatial Locality**:

1. **Cache Lines**: The CPU memory controller does not read individual 4-byte or 8-byte primitives from DRAM. Instead, it transfers memory in fixed blocks called **Cache Lines** (standardized at 64 bytes on modern x86-64 and ARM architectures).
2. **L1/L2 Hardware Prefetching**: When the processor reads `A[0]` (4 bytes), the memory controller fetches the entire 64-byte aligned chunk containing `A[0...15]` directly into the L1 data cache in a single transaction.
3. **Hardware Latency Penalty**:
   - Accessing L1 Data Cache: **~4–5 CPU cycles** (~1 nanosecond).
   - Accessing L2 Cache: **~12–14 CPU cycles** (~3 nanoseconds).
   - Accessing L3 Shared Cache: **~40–60 CPU cycles** (~15 nanoseconds).
   - Main DRAM Access: **~150–250 CPU cycles** (~60–80 nanoseconds).

<svg viewBox="0 0 880 260" width="100%" height="auto" class="rounded-xl border border-border shadow-sm my-6 bg-surface">
  <defs>
    <linearGradient id="cacheGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#10b981" stop-opacity="0.15" />
      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.15" />
    </linearGradient>
  </defs>
  <!-- Background Header -->
  <rect x="20" y="20" width="840" height="40" rx="8" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.1" />
  <text x="35" y="45" font-family="system-ui, sans-serif" font-size="13" font-weight="bold" fill="currentColor">64-Byte CPU Cache Line Transaction (16 x 4-byte Integers Loaded Simultaneously)</text>
  <text x="730" y="45" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#10b981">L1 DATA CACHE HIT</text>
  <!-- Cache Line Cells -->
  <!-- A[0] Miss Cell -->
  <rect x="20" y="80" width="60" height="70" rx="6" fill="#ef4444" fill-opacity="0.15" stroke="#ef4444" stroke-width="2" />
  <text x="50" y="112" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#ef4444">A[0]</text>
  <text x="50" y="132" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" fill="#ef4444">MISS</text>
  <!-- A[1] to A[15] Hit Cells -->
  <rect x="85" y="80" width="775" height="70" rx="6" fill="url(#cacheGrad)" stroke="#10b981" stroke-width="1.5" />
  <g font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="currentColor" text-anchor="middle">
    <text x="110" y="112">A[1]</text><text x="110" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="160" y="112">A[2]</text><text x="160" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="210" y="112">A[3]</text><text x="210" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="260" y="112">A[4]</text><text x="260" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="310" y="112">A[5]</text><text x="310" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="360" y="112">A[6]</text><text x="360" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="410" y="112">A[7]</text><text x="410" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="460" y="112">A[8]</text><text x="460" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="510" y="112">A[9]</text><text x="510" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="560" y="112">A[10]</text><text x="560" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="610" y="112">A[11]</text><text x="610" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="660" y="112">A[12]</text><text x="660" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="710" y="112">A[13]</text><text x="710" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="760" y="112">A[14]</text><text x="760" y="132" font-size="9" fill="#10b981">HIT</text>
    <text x="815" y="112">A[15]</text><text x="815" y="132" font-size="9" fill="#10b981">HIT</text>
  </g>
  <!-- Latency Comparison Footer -->
  <rect x="20" y="170" width="410" height="70" rx="8" fill="#ef4444" fill-opacity="0.08" stroke="#ef4444" stroke-opacity="0.2" />
  <text x="35" y="195" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#ef4444">Initial Fetch: 1 DRAM Cache Miss</text>
  <text x="35" y="215" font-family="system-ui, sans-serif" font-size="11" fill="currentColor" fill-opacity="0.8">Requires ~200 CPU cycles to load line from physical RAM</text>
  <rect x="450" y="170" width="410" height="70" rx="8" fill="#10b981" fill-opacity="0.08" stroke="#10b981" stroke-opacity="0.2" />
  <text x="465" y="195" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#10b981">Subsequent 15 Reads: 100% L1 Hits</text>
  <text x="465" y="215" font-family="system-ui, sans-serif" font-size="11" fill="currentColor" fill-opacity="0.8">Execute in ~4 cycles each (50x faster than pointer chasing!)</text>
</svg>

Consequently, sequential traversal through a contiguous array incurs only **1 cache miss per 16 elements**. In contrast, traversing a linked list requires following pointers across disconnected heap addresses, triggering frequent cache misses on almost every dereference!

---

### 3. Supported Operations & Complexity Matrix

| Operation | Description | Best Case | Average Case | Worst Case | Auxiliary Space |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **Access($i$)** | Read element at position $i$ via $\alpha + i \cdot S$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ |
| **Update($i, x$)** | Overwrite cell at index $i$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ |
| **Search($x$)** | Linear scan for target value $x$ | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ |
| **InsertEnd($x$)** | Append to back when size $n < \text{capacity}$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ |
| **InsertAt($i, x$)**| Shift trailing items right and insert | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ |
| **DeleteEnd()** | Decrement size counter | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ |
| **DeleteAt($i$)** | Shift trailing items left over target slot | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ |

> **Interactive Simulation**:  
> Observe memory addressing and bounds verification live in the [Array Access Visualizer](/visualizer/access).

---

### 4. Algorithmic Mechanics: Insertion & Deletion

#### Right-Shift Insertion Mechanism
Inserting an element at index $i$ in an array with current size $n$ and capacity $C > n$ requires shifting all elements from index $n-1$ down to $i$ one slot to the right. 

> ⚠️ **Critical Trap: Shift Order**:  
> Shifting must proceed **right-to-left** (from index $n-1$ down to $i$). If shifted left-to-right, $A[i]$ overwrites $A[i+1]$, duplicating $A[i]$ across all subsequent cells.

#### Insertion State Transition Table ($n = 4$, Capacity $= 5$, Insert $99$ at Index $2$)

| Step | Action | Array State | Active Elements |
| :---: | :--- | :--- | :---: |
| **0** | Initial State | `[10, 20, 30, 40, _]` | $n = 4$ |
| **1** | Shift $A[3] \to A[4]$ | `[10, 20, 30, 40, 40]` | $n = 4$ |
| **2** | Shift $A[2] \to A[3]$ | `[10, 20, 30, 30, 40]` | $n = 4$ |
| **3** | Write $A[2] \leftarrow 99$ | `[10, 20, 99, 30, 40]` | $n = 5$ |

#### Deletion State Transition Table (Delete Element at Index $1$ from $[5, 8, 2, 9]$)

| Step | Action | Array State | Effective Size |
| :---: | :--- | :--- | :---: |
| **0** | Initial State | `[5, 8, 2, 9]` | $n = 4$ |
| **1** | Shift $A[2] \to A[1]$ | `[5, 2, 2, 9]` | $n = 4$ |
| **2** | Shift $A[3] \to A[2]$ | `[5, 2, 9, 9]` | $n = 4$ |
| **3** | Decrement size ($n \leftarrow 3$) | `[5, 2, 9, (stale)]` | $n = 3$ |

---

### 5. Canonical Specification & Invariants

```text
CLASS StaticArray:
    fields:
        data: Array[Capacity] of Type
        size: Integer
        capacity: Integer

    INVARIANT 0 <= size <= capacity
    INVARIANT valid indices for elements are in range [0, size - 1]

    CONSTRUCTOR(cap: Integer):
        assert cap > 0
        this.capacity <- cap
        this.size <- 0
        this.data <- allocate_memory(cap * sizeof(Type))

    FUNCTION Get(i: Integer) -> Type:
        if i < 0 or i >= this.size:
            raise IndexOutOfBoundsException()
        return this.data[i]

    FUNCTION Set(i: Integer, val: Type) -> Void:
        if i < 0 or i >= this.size:
            raise IndexOutOfBoundsException()
        this.data[i] <- val

    FUNCTION InsertAt(i: Integer, val: Type) -> Void:
        if this.size >= this.capacity:
            raise CapacityExceededException()
        if i < 0 or i > this.size:
            raise IndexOutOfBoundsException()
        // Right-to-left shift
        for j from this.size - 1 down to i:
            this.data[j + 1] <- this.data[j]
        this.data[i] <- val
        this.size <- this.size + 1

    FUNCTION DeleteAt(i: Integer) -> Type:
        if i < 0 or i >= this.size:
            raise IndexOutOfBoundsException()
        val <- this.data[i]
        // Left-to-right shift
        for j from i to this.size - 2:
            this.data[j] <- this.data[j + 1]
        this.size <- this.size - 1
        return val
```

---

### 6. Multi-Dimensional Array Addressing (Row-Major vs Column-Major)

A two-dimensional array $M[R][C]$ with $R$ rows and $C$ columns must be linearized into physical 1D RAM:

1. **Row-Major Order (e.g. C/C++ rectangular arrays; many C#/NumPy defaults)**: Consecutive elements of a row are stored adjacently.
   $$\text{Address}(M[i][j]) = \alpha + (i \times C + j) \times S$$
2. **Column-Major Order (e.g. Fortran, MATLAB, R defaults)**: Consecutive elements of a column are stored adjacently.
   $$\text{Address}(M[i][j]) = \alpha + (j \times R + i) \times S$$

Layout is a property of the representation, not of a language as a whole (e.g. Java `int[][]` is an array of arrays; Python nested lists hold object references; libraries may choose either layout).

> 💡 **Performance Guideline (illustrative)**:  
> For row-major layouts, prefer rows in the outer loop and columns in the inner loop (`for i: for j:`). Inverting the order can substantially degrade throughput in cache-sensitive cases (exact effect depends on hardware and problem size).

---

## Topic 21: Dynamic Arrays

### 1. Conceptual Architecture & Geometric Growth

A **Dynamic Array** (such as C++ `std::vector`, Java `ArrayList`, or Python `list`) abstracts the fixed-capacity limitation of static arrays. It maintains an internal static array on the heap, automatically reallocating a larger backing buffer when capacity is exhausted.

#### Geometric vs. Arithmetic Resizing
How much should a dynamic array grow when it becomes full?

- **Arithmetic Growth (+K slots)**:
  Suppose capacity increases by a constant $K$ (e.g., $+10$ slots) whenever full. For $n$ total insertions, the array resizes $n/K$ times.
  $$\text{Total Copies} = \sum_{m=1}^{n/K} m \cdot K = K \cdot \frac{(n/K)(n/K + 1)}{2} = \Theta(n^2)$$
  Dividing by $n$ operations yields an average cost of $\Theta(n)$ per insertion. Arithmetic growth is catastrophically slow for large collections.
- **Geometric Growth ($\times g$ factor, $g > 1$)**:
  Suppose capacity multiplies by a factor $g > 1$ whenever full. For $n$ insertions, resizes occur at sizes $1, g, g^2, \dots, g^k \le n$.
  $$\text{Total Copies} = \sum_{j=0}^{k-1} g^j = \frac{g^k - 1}{g - 1} < \frac{n}{g - 1} = O(n)$$
  Dividing by $n$ operations gives an amortized cost of $O(1)$ per insertion!

#### Growth Factor Deep-Dive: Why $g = 1.5$ vs $g = 2.0$ (The Golden Ratio Heap Invariant)
Different standard library runtimes choose different geometric multipliers:
- **GCC `libstdc++` & LLVM `libc++`**: $g = 2.0$.
- **Microsoft Visual C++ (MSVC) & Facebook `folly::fbvector`**: $g = 1.5$.
- **Python `list`**: Over-allocates using the formula `new_allocated = (size_t)newsize + (newsize >> 3) + (newsize < 9 ? 3 : 6)` (growth factor $\approx 1.125$).

> [!IMPORTANT]
> **The Heap Memory Fragmentation Proof**:
> If an allocator grows by $g = 2.0$, can a newly allocated buffer ever re-use the memory freed by all previous buffers?
> The sum of all previously deallocated buffers is:
> $$\sum_{i=0}^{k-1} 2^i = 2^k - 1 < 2^k$$
> The cumulative memory freed is **strictly less** than the next required capacity $2^k$! Therefore, an array with $g = 2.0$ can **never** reuse its old memory locations in a continuous virtual address space. The allocator is forced to continuously claim fresh memory toward the end of the heap.
>
> In contrast, for the next buffer of size $g^k$ to fit into the sum of prior freed memory:
> $$g^k \le \sum_{i=0}^{k-1} g^i = \frac{g^k - 1}{g - 1} \implies g - 1 \le 1 - \frac{1}{g^k} \implies g < 2$$
> For $k = 2$ consecutive chunks: $g^2 \le g + 1 \implies g^2 - g - 1 \le 0 \implies g \le \frac{1 + \sqrt{5}}{2} \approx 1.618$ (The Golden Ratio $\phi$).
> Choosing **$g = 1.5$** ensures that after a few resizes, the operating system's heap allocator can immediately coalesce freed memory segments to host subsequent buffers, dramatically reducing cache thrashing and virtual memory fragmentation!

---

### 2. Formal Proof: Amortized $O(1)$ Complexity

#### Method A: Aggregate Analysis
Let $c_i$ be the cost of the $i$-th `PushBack` operation:
- If $i - 1$ is not an exact power of 2: $c_i = 1$ (write element directly).
- If $i - 1 = 2^k$ (triggering doubling): $c_i = 2^k + 1$ (copy $2^k$ elements, then write the new element).

Summing the cost over $n$ consecutive insertions:

$$\sum_{i=1}^n c_i = \sum_{i=1}^n 1 + \sum_{j=0}^{\lfloor \log_2(n-1) \rfloor} 2^j = n + (2^{\lfloor \log_2(n-1) \rfloor + 1} - 1) < n + 2n = 3n$$

$$\text{Amortized Cost per Insertion} = \frac{\sum_{i=1}^n c_i}{n} < \frac{3n}{n} = 3 = O(1) \quad \blacksquare$$

#### Method B: The Accounting (Banker's) Method
Assign an amortized charge (fee) of **$3$ credits** to each inserted element:
1. **$1$ credit** is spent immediately to pay for its own insertion into the array slot.
2. **$1$ credit** is deposited as savings into the element's bank account.
3. **$1$ credit** is deposited into the bank account of an earlier element from the first half of the array that has already spent its savings.

When the array doubles from capacity $N$ to $2N$, exactly $N$ new elements have been inserted since the prior resize. Each deposited 2 credits in savings, yielding a total surplus of $2N$ credits. The cost to copy all $N$ existing elements to the new buffer is exactly $N$ units of work. The accumulated credits completely pay for the reallocation with zero deficit remaining.

#### Method C: The Potential (Physicist's) Method
Define the potential function $\Phi$ in terms of current size $s_i$ and capacity $c_i$:
$$\Phi(D_i) = 2s_i - c_i$$
- **Boundary Condition**: Initially $s_0 = 0, c_0 = 0 \implies \Phi(D_0) = 0$. Since capacity is at least size and at most twice size, $\Phi(D_i) \ge 0$ for all $i$.
- **Amortized Cost**: $\hat{c}_i = c_i + \Phi(D_i) - \Phi(D_{i-1})$.
  - When no resize occurs ($s_i = s_{i-1} + 1, c_i = c_{i-1}$):
    $$\hat{c}_i = 1 + (2(s_{i-1} + 1) - c_{i-1}) - (2s_{i-1} - c_{i-1}) = 1 + 2 = 3$$
  - When resize occurs ($s_{i-1} = c_{i-1}, s_i = s_{i-1} + 1, c_i = 2c_{i-1}$):
    $$\hat{c}_i = (s_{i-1} + 1) + (2(s_{i-1} + 1) - 2s_{i-1}) - (2s_{i-1} - s_{i-1}) = (s_{i-1} + 1) + (2 - s_{i-1}) = 3$$
In all instances, $\hat{c}_i = 3 \in O(1)$. $\blacksquare$

---

### 3. Lifecycle Walkthrough & State Tracking

#### Sequence of 5 PushBack Operations (Initial Capacity = 1)

| Operation | Invocation | Pre-Op $(n, C)$ | Doubling Triggered? | New $C$ | Elements Copied | Final Buffer | Post-Op $(n, C)$ | Actual Cost |
| :---: | :--- | :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| **1** | `PushBack(10)` | $(0, 1)$ | No | 1 | 0 | `[10]` | $(1, 1)$ | 1 |
| **2** | `PushBack(20)` | $(1, 1)$ | **Yes ($1 \to 2$)** | 2 | 1 (copy 10) | `[10, 20]` | $(2, 2)$ | $1 + 1 = 2$ |
| **3** | `PushBack(30)` | $(2, 2)$ | **Yes ($2 \to 4$)** | 4 | 2 (copy 10, 20) | `[10, 20, 30, _]` | $(3, 4)$ | $2 + 1 = 3$ |
| **4** | `PushBack(40)` | $(3, 4)$ | No | 4 | 0 | `[10, 20, 30, 40]` | $(4, 4)$ | 1 |
| **5** | `PushBack(50)` | $(4, 4)$ | **Yes ($4 \to 8$)** | 8 | 4 (copy 10..40) | `[10, 20, 30, 40, 50, _, _, _]` | $(5, 8)$ | $4 + 1 = 5$ |

**Total Cumulative Operations**: $1 + 2 + 3 + 1 + 5 = 12$ operations for 5 insertions.  
**Empirical Amortized Cost**: $12 / 5 = 2.4$ operations per insertion $\approx O(1)$.

---

### 4. Memory Thrashing & The Hysteresis Principle

A naïve deallocation strategy shrinks the buffer by half whenever $n \le C / 2$. This creates a critical vulnerability known as **Resize Thrashing (Hysteresis)**:

1. Suppose current capacity is $C$ and size is $n = C$.
2. An insertion triggers a double to $2C$ ($O(n)$ work).
3. The next operation is a deletion (`PopBack`), dropping size to $n = C = (2C)/2$. The array immediately halves back to $C$ ($O(n)$ work).
4. Another insertion immediately doubles back to $2C$ ($O(n)$ work).

Alternating `PushBack` and `PopBack` at the threshold forces an $O(n)$ reallocation on *every single operation*, destroying amortized efficiency.

```
Thrashing Threshold (Anti-Pattern):
PushBack -> Double to 2C (O(n))
PopBack  -> Halve to C   (O(n))
PushBack -> Double to 2C (O(n))
Result: O(n) worst-case per operation!
```

#### The Quarter-Capacity Solution
To prevent thrashing, introduce hysteresis:
- **Double** capacity when $n = C$.
- **Halve** capacity only when $n \le C / 4$.

This guarantees that after halving to $C/2$, at least $C/4$ subsequent deletions or $C/2$ insertions are required before another resize can trigger, restoring amortized $O(1)$ bounds across all operations.

---

### 5. Production Dynamic Array Specification

```text
CLASS DynamicArray:
    fields:
        buffer: Array of Type
        size: Integer
        capacity: Integer

    CONSTRUCTOR(initialCapacity: Integer = 2):
        assert initialCapacity > 0
        this.capacity <- initialCapacity
        this.size <- 0
        this.buffer <- allocate_memory(initialCapacity * sizeof(Type))

    FUNCTION PushBack(val: Type) -> Void:
        if this.size == this.capacity:
            this.Resize(2 * this.capacity)
        this.buffer[this.size] <- val
        this.size <- this.size + 1

    FUNCTION PopBack() -> Type:
        if this.size == 0:
            raise UnderflowException("Cannot pop from empty array")
        this.size <- this.size - 1
        val <- this.buffer[this.size]
        // Anti-thrashing shrink condition
        if this.size > 0 and this.size <= this.capacity / 4 and this.capacity > 4:
            this.Resize(this.capacity / 2)
        return val

    PRIVATE FUNCTION Resize(newCapacity: Integer) -> Void:
        newBuffer <- allocate_memory(newCapacity * sizeof(Type))
        for i from 0 to this.size - 1:
            newBuffer[i] <- this.buffer[i]
        free_memory(this.buffer)
        this.buffer <- newBuffer
        this.capacity <- newCapacity
```

---

### 6. Architectural Trade-offs & Comparisons

| Metric | Static Array | Dynamic Array (`vector`) | Singly Linked List |
| :--- | :--- | :--- | :--- |
| **Size Boundary** | Fixed at allocation time | Grows geometrically | Grows element-by-element |
| **Memory Locality** | Maximum (single block) | Maximum (contiguous heap buffer) | Poor (scattered heap nodes) |
| **Index Access ($A[i]$)** | $O(1)$ | $O(1)$ | $O(n)$ |
| **Insert / Delete at End** | $O(1)$ (bounded by cap) | Amortized $O(1)$, Worst $O(n)$ | $O(1)$ with tail pointer |
| **Insert / Delete at Head**| $O(n)$ shifts | $O(n)$ shifts | $O(1)$ pointer update |
| **Per-Element Memory Overhead** | $0\text{ bytes}$ | $0\text{ to } 8\text{ bytes}$ (unused capacity) | $8\text{ bytes}$ pointer per node |
| **Cache Miss Frequency** | Low ($\approx 1$ per 64 bytes) | Low ($\approx 1$ per 64 bytes) | High ($\approx 1$ per node) |

---

### 7. Key Takeaways

1. **Direct Memory Addressing**: Arrays achieve $O(1)$ random access through single-cycle arithmetic: $\text{Address}(A[i]) = \alpha + i \cdot S$.
2. **Hardware Symbiosis**: Contiguous layouts maximize CPU L1/L2 cache-line prefetching, outperforming node-based structures by orders of magnitude for sequential scans.
3. **Geometric Doubling**: Reallocating capacity by a geometric multiplier ($g > 1$) yields amortized $O(1)$ insertions; arithmetic growth ($+K$) degrades performance to $O(n)$.
4. **Hysteresis Prevents Thrashing**: Halving capacity at $C/4$ rather than $C/2$ prevents worst-case $O(n)$ thrashing during alternating insertions and deletions.
5. **In-Place Shift Discipline**: Array insertions require right-to-left shifts to prevent data corruption; deletions require left-to-right shifts.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 10: *Elementary Data Structures*, Chapter 17: *Amortized Analysis*. MIT Press.
2. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.3: *Bags, Queues, and Stacks* (Resizing Arrays). Addison-Wesley.
3. **Hennessy, J. L., & Patterson, D. A.** (2019). *Computer Architecture: A Quantitative Approach* (6th ed.), Chapter 2: *Memory Hierarchy Design*. Morgan Kaufmann.
4. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.2: *Linear Lists*. Addison-Wesley.
