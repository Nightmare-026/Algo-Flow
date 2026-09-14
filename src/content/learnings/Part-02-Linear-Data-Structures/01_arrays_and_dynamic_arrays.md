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
- $S$ is the **Element Size** in bytes (e.g., $S = 4$ for a 32-bit integer, $S = 8$ for a 64-bit pointer or float).

Because integer multiplication and pointer addition execute in a single CPU cycle, calculating $\text{Address}(A[i])$ does not require scanning intermediate elements $A[0 \dots i-1]$. This is why array indexing is strictly $O(1)$.

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

The primary performance advantage of arrays over pointer-linked nodes is **Hardware Spatial Locality**:

1. **Cache Lines**: The CPU memory controller does not read individual bytes from RAM. Instead, it transfers memory in fixed blocks called **Cache Lines** (typically 64 bytes on modern x86-64 and ARM architectures).
2. **L1/L2 Prefetching**: When the processor reads $A[0]$ (4 bytes), the memory controller loads the entire 64-byte block containing $A[0 \dots 15]$ directly into the L1 data cache in a single memory transaction.
3. **Latency Differential**:
   - Accessing L1 Cache: $\approx 1\text{ ns}$ ($\approx 4\text{ CPU cycles}$).
   - Accessing Main Memory (RAM): $\approx 50\text{--}100\text{ ns}$ ($\approx 150\text{--}300\text{ CPU cycles}$).

Consequently, traversing a static array sequentially incurs a cache miss only once every 16 elements (for 4-byte integers), allowing the hardware prefetcher to stream data seamlessly. Pointer-based structures (like linked lists) scatter nodes across the heap, causing nearly every node traversal to incur a full cache miss.

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

1. **Row-Major Order (C, C++, Python, Java)**: Consecutive elements of a row are stored adjacently.
   $$\text{Address}(M[i][j]) = \alpha + (i \times C + j) \times S$$
2. **Column-Major Order (Fortran, MATLAB, R)**: Consecutive elements of a column are stored adjacently.
   $$\text{Address}(M[i][j]) = \alpha + (j \times R + i) \times S$$

> 💡 **Performance Rule**:  
> In Row-Major languages, always iterate rows in the outer loop and columns in the inner loop (`for i: for j:`). Inverting this order (`for j: for i:`) causes a cache miss on every single memory access, degrading throughput by up to $10\times$ to $20\times$.

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
  Suppose capacity doubles ($g = 2$) whenever full. For $n$ insertions, resizes occur at sizes $1, 2, 4, 8, \dots, 2^k \le n$.
  $$\text{Total Copies} = 1 + 2 + 4 + 8 + \dots + n/2 = \sum_{j=0}^{k-1} 2^j = 2^k - 1 < n$$
  The total copy overhead across all $n$ insertions is strictly bounded by $n$. Dividing by $n$ operations gives an average cost of $\Theta(1)$ per insertion.

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
