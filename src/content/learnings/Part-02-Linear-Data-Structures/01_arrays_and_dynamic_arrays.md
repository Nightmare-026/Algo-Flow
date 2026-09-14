# Part 02: Linear Data Structures — Module 01: Arrays & Dynamic Arrays

> **Topics Covered:**  
> 20. Static Arrays &bull; 21. Dynamic Arrays (Vectors / Resizable Arrays)

---

# TOPIC 20: STATIC ARRAYS

### 1. Topic Title
**Static Arrays (Fixed-Size Contiguous Sequential Containers)**

### 2. Category
Linear Data Structures — Contiguous Physical Memory Layout.

### 3. Difficulty
Beginner.

### 4. Prerequisites
Part 01: Foundations (Primitive data types, RAM addressing model, Asymptotic complexity).

### 5. Definition
A **Static Array** is a fixed-size, homogeneous, contiguous sequence of elements stored at consecutively numbered physical memory addresses, accessible directly via zero-based arithmetic indexing in $O(1)$ constant time.

### 6. Simple Explanation
Think of an egg carton with exactly 12 numbered slots. Every slot holds an item of identical size. Because each slot has a known physical spacing, your hand can reach directly into slot #7 without touching slots 0 through 6.

### 7. Why Do We Need It?
Computers need a way to store multiple items of the same type such that any item can be retrieved instantly ($O(1)$) using its numerical sequence number (index), without scanning prior elements.

### 8. Real-World Analogy
Numbered street addresses on a straight avenue where every house lot has identical frontage width ($W$). If house 0 is at mile marker $B$, house $i$ is exactly at mile marker $B + (i \times W)$.

### 9. Core Intuition
$$\text{Address}(A[i]) = \text{Base Address} + (i \times \text{sizeof}(\text{Element}))$$
Because multiplication and addition are single-cycle CPU instructions, lookup requires no searching.

### 10. Key Properties
1. **Fixed Capacity**: Size $N$ is fixed at allocation time and cannot grow or shrink.
2. **Homogeneous Elements**: Every element occupies identical byte size $S$.
3. **Contiguous Allocation**: Elements occupy an unbroken block of physical RAM.
4. **Random Access**: Any element is accessed in $O(1)$ time via index.

### 11. Terminology
- **Base Address ($\alpha$)**: The memory address of the first byte of index 0.
- **Index ($i$)**: Zero-based integer offset from the base address ($0 \le i < N$).
- **Element Size ($S$)**: Number of bytes allocated per cell (e.g., 4 bytes for 32-bit integer).
- **Bounds**: Valid index range $[0, N-1]$.

---

### 12. Structural Diagram (ASCII)

```text
Logical Index:      0         1         2         3         4
                ┌─────────┬─────────┬─────────┬─────────┬─────────┐
Array A:        │   42    │   17    │   89    │   05    │   63    │
                └─────────┴─────────┴─────────┴─────────┴─────────┘
RAM Address:      0x1000    0x1004    0x1008    0x100C    0x1010
                (Base α)  (α + 1·4) (α + 2·4) (α + 3·4) (α + 4·4)
```

---

### 13. Memory Representation & Cache Locality
Because elements sit adjacent in physical memory:
- **Spatial Locality**: When the CPU accesses $A[0]$, the hardware memory controller fetches an entire 64-byte **Cache Line** into L1 CPU cache. Subsequent accesses to $A[1], A[2], \dots, A[15]$ result in ultra-fast L1 cache hits ($\approx 1\text{ ns}$) rather than main memory RAM latency ($\approx 100\text{ ns}$).

---

### 14. Types / Variants
- **1D Static Array**: Flat linear sequence.
- **Multi-Dimensional Static Array**: Matrix layout (Row-Major vs Column-Major).
- **Static Buffer**: Fixed array used as a FIFO ring buffer.

---

### 15. Supported Operations

| Operation | Description | Worst Case Time | Space |
| :--- | :--- | :---: | :---: |
| **Access($i$)** | Read element at index $i$ | $O(1)$ | $O(1)$ |
| **Update($i, x$)** | Overwrite element at index $i$ with $x$ | $O(1)$ | $O(1)$ |
| **Search($x$)** | Locate index containing value $x$ | $O(n)$ | $O(1)$ |
| **InsertAt($i, x$)**| Shift right to insert (requires spare capacity) | $O(n)$ | $O(1)$ |
| **DeleteAt($i$)** | Shift left to fill hole | $O(n)$ | $O(1)$ |

---

### 16. Operation-by-Operation Explanation

#### Insertion at Index $i$
To insert a new element at index $i$ in an array with $n$ elements and capacity $C > n$:
1. Check bounds ($0 \le i \le n$) and capacity ($n < C$).
2. Shift all elements from index $n-1$ down to $i$ one position to the right.
3. Place element at index $i$.
4. Increment size counter $n \leftarrow n + 1$.

#### Deletion at Index $i$
1. Check bounds ($0 \le i < n$).
2. Shift all elements from index $i+1$ up to $n-1$ one position to the left.
3. Decrement size counter $n \leftarrow n - 1$.

---

### 17. Operation Diagrams (Before / Action / After)

```text
INSERTION OF VALUE 99 AT INDEX 2:

BEFORE:
Index:     0      1      2      3
Value:   [ 10 ] [ 20 ] [ 30 ] [ 40 ] [    ]  (size = 4, capacity = 5)

ACTION (Shift right from right to left):
Step 1: Move 40 to index 4:   [ 10 ] [ 20 ] [ 30 ] [ 40 ] [ 40 ]
Step 2: Move 30 to index 3:   [ 10 ] [ 20 ] [ 30 ] [ 30 ] [ 40 ]
Step 3: Insert 99 at index 2: [ 10 ] [ 20 ] [ 99 ] [ 30 ] [ 40 ]

AFTER:
Index:     0      1      2      3      4
Value:   [ 10 ] [ 20 ] [ 99 ] [ 30 ] [ 40 ]  (size = 5)
```

---

### 18. Pseudocode

```text
ALGORITHM InsertAt(A, n, capacity, index, value)
    Input: Array A, current size n, capacity, target index, value
    Output: Updated size n, or error if full/out-of-bounds

1.  if n ≥ capacity:
2.      error "Array capacity exceeded"
3.  if index < 0 or index > n:
4.      error "Index out of bounds"
5.  for j ← n - 1 down to index:
6.      A[j + 1] ← A[j]
7.  A[index] ← value
8.  return n + 1

ALGORITHM DeleteAt(A, n, index)
    Input: Array A, current size n, target index to remove
    Output: Updated size n

1.  if index < 0 or index ≥ n:
2.      error "Index out of bounds"
3.  for j ← index to n - 2:
4.      A[j] ← A[j + 1]
5.  return n - 1
```

---

### 19. Worked Example
Given array $A = [5, 8, 2, 9]$, delete element at index $1$ (value 8):
- Shift $A[2]$ (2) to $A[1]$. Array becomes $[5, 2, 2, 9]$.
- Shift $A[3]$ (9) to $A[2]$. Array becomes $[5, 2, 9, 9]$.
- Decrement size to 3. Active array is $[5, 2, 9]$.

---

### 20. Step-by-Step Dry Run Table

Deleting index 1 from $A = [5, 8, 2, 9]$ ($n=4$):

| Step | Loop Var $j$ | Action | Array State | Effective Size |
| :---: | :---: | :--- | :--- | :---: |
| 0 | — | Initial state | $[5, 8, 2, 9]$ | 4 |
| 1 | $j = 1$ | $A[1] \leftarrow A[2]$ ($2$) | $[5, 2, 2, 9]$ | 4 |
| 2 | $j = 2$ | $A[2] \leftarrow A[3]$ ($9$) | $[5, 2, 9, 9]$ | 4 |
| 3 | Loop ends | Return $n - 1$ | $[5, 2, 9, \text{ignored}]$ | 3 |

---

### 21. Correctness / Why It Works
**Loop Invariant for Deletion**: At the start of iteration $j$, elements $A[0 \dots \text{index}-1]$ remain in their original positions, and elements $A[\text{index} \dots j-1]$ have each been shifted left by 1. When $j = n-1$, all trailing elements are shifted left by 1, preserving their relative order without gaps.

---

### 22. Time Complexity
- **Access**: Best $\Theta(1)$, Average $\Theta(1)$, Worst $\Theta(1)$
- **Search (Unsorted)**: Best $\Theta(1)$ (at head), Worst $\Theta(n)$ (not found)
- **Insert / Delete at End**: $\Theta(1)$
- **Insert / Delete at Head**: $\Theta(n)$ (all $n$ elements shifted)

### 23. Space Complexity
- **Auxiliary Space**: $O(1)$ (in-place operations)
- **Total Space**: $O(N)$ where $N$ is static capacity

---

### 24–26. Case Analyses
- **Best Case Insertion**: Inserting at index $n$ (end) $\implies 0$ elements shifted $\implies O(1)$.
- **Worst Case Insertion**: Inserting at index $0$ (head) $\implies n$ elements shifted $\implies O(n)$.
- **Average Case**: Random index $\implies n/2$ shifts $\implies O(n)$.

---

### 27. Edge Cases
1. Empty array ($n=0$): Deletion raises underflow.
2. Full array ($n = \text{capacity}$): Insertion raises overflow.
3. Index $= 0$: Maximum shift cost.
4. Index $= n$: Insertion requires 0 shifts; deletion invalid.

---

### 28. Advantages
- Instant $O(1)$ random access.
- Minimal memory overhead (zero pointer overhead).
- Maximum CPU cache efficiency due to contiguous layout.

### 29. Limitations
- Fixed capacity cannot grow dynamically.
- Costly $O(n)$ insertions and deletions due to shifting.
- Can waste memory if capacity is over-allocated.

### 30. Applications
- Lookup tables, mathematical matrices.
- Buffer pools and image pixel buffers.
- Foundation for stacks, circular queues, and heaps.

### 31. Common Mistakes
- **Off-by-One in Shift Loop**: Overwriting values before reading them during insertion (must shift *right-to-left*, not left-to-right).
- **Out of Bounds Indexing**: Accessing $A[N]$ instead of $A[N-1]$.

---

### 32. Comparison: Static Array vs Singly Linked List

| Feature | Static Array | Singly Linked List |
| :--- | :--- | :--- |
| **Size** | Fixed at compile/allocation time | Dynamic, grows node-by-node |
| **Memory Layout** | Contiguous physical block | Scattered heap nodes |
| **Access Time** | $O(1)$ via index arithmetic | $O(n)$ sequential pointer traversal |
| **Insert at Head**| $O(n)$ shift | $O(1)$ pointer redirection |
| **Per-Element Overhead**| 0 extra bytes | 8 bytes pointer overhead (64-bit) |
| **Cache Performance**| Exceptional (L1/L2 cache prefetching) | Poor (frequent cache misses) |

---

### 33. Complete Implementation (Language-Independent Pseudocode)

```text
DATA STRUCTURE StaticArray
    Fields:
        data: contiguous memory block of fixed size CAPACITY
        size: integer, initially 0
        capacity: integer CAPACITY

    OPERATION Initialize(cap):
        capacity ← cap
        size ← 0
        allocate data[0 ... cap - 1]

    OPERATION Get(index):
        if index < 0 or index ≥ size:
            error "Index out of bounds"
        return data[index]

    OPERATION Set(index, val):
        if index < 0 or index ≥ size:
            error "Index out of bounds"
        data[index] ← val

    OPERATION PushBack(val):
        if size = capacity:
            error "Array full"
        data[size] ← val
        size ← size + 1

    OPERATION PopBack():
        if size = 0:
            error "Array empty"
        size ← size - 1
        return data[size]
```

---

### 34. Practice Problems
1. Reverse an array in-place with $O(1)$ auxiliary space.
2. Rotate an array by $k$ positions.
3. Remove duplicates from a sorted array in-place.

### 35. Interview Questions
- *Q: Why is indexing $O(1)$ in arrays?*  
  **A**: Because memory is a linear address space and the address is calculated in $O(1)$ via $\alpha + i \times S$.
- *Q: Why are arrays faster than linked lists for sequential reads?*  
  **A**: Hardware prefetchers load contiguous memory blocks into CPU L1/L2 cache lines automatically.

### 36. Exam Questions
- *Derive the memory location of element $A[i][j]$ stored in row-major order with base address $\alpha$, row dimension $R$, column dimension $C$, and element size $S$.*  
  $$\text{Address}(A[i][j]) = \alpha + (i \times C + j) \times S$$

### 37. One-Minute Revision
- Static array = contiguous, fixed size, homogeneous data.
- Access: $O(1)$ &bull; Search: $O(n)$ &bull; Insert/Delete at end: $O(1)$ &bull; Insert/Delete at head: $O(n)$.
- Unmatched cache locality; rigid sizing.

### 38. Final Key Takeaways
Always use static arrays when the upper bound on data size is known in advance and random access speed or minimal memory overhead is paramount.

---
---

# TOPIC 21: DYNAMIC ARRAYS

### 1. Topic Title
**Dynamic Arrays (Vectors, ArrayLists, Resizable Contiguous Sequences)**

### 2. Category
Linear Data Structures — Geometric Growth Resizable Containers.

### 3. Difficulty
Beginner to Intermediate.

### 4. Prerequisites
Topic 20: Static Arrays, Amortized Complexity Analysis.

### 5. Definition
A **Dynamic Array** is an abstraction over a static array that automatically grows and shrinks its underlying physical capacity as elements are inserted or deleted, providing **Amortized $O(1)$** insertions at the back while preserving $O(1)$ random indexing.

### 6. Simple Explanation
Imagine a concert hall that starts with 4 seats. When a 5th person arrives, the management builds an entirely new hall with double the seats (8 seats), moves the first 4 people over, and seats the 5th. Because doubling happens exponentially less frequently, the average cost per person remains constant ($O(1)$).

### 7. Why Do We Need It?
In real-world applications, the number of incoming data items is rarely known beforehand. Static arrays either waste memory (over-allocation) or crash when full (under-allocation). Dynamic arrays provide flexibility without sacrificing indexing speed.

### 8. Real-World Analogy
A notebook where every time you run out of blank pages, you buy a notebook with twice as many pages and copy your existing notes over.

### 9. Core Intuition: Geometric vs Arithmetic Growth
- **Arithmetic Growth (+K each time)**: Adding 10 slots each resize costs $\sum_{i=1}^{n/K} i \cdot K \approx O(n^2)$ total work $\implies O(n)$ per insert! ❌
- **Geometric Growth ($\times 2$ each time)**: Doubling capacity costs $1 + 2 + 4 + 8 + \dots + n = 2n - 1 \approx O(n)$ total work for $n$ inserts $\implies O(1)$ amortized cost per insert! ✅

---

### 10. Key Properties
1. **Dynamic Resizing**: Automatically reallocates physical buffer when full.
2. **Growth Factor ($g$)**: Typically $2.0$ (C++ `std::vector`, Java `ArrayList`) or $1.5$ (MSVC STL).
3. **Logical Size ($n$)**: Number of elements currently stored.
4. **Physical Capacity ($C$)**: Total allocated slots in current underlying static array ($C \ge n$).
5. **Amortized $O(1)$ PushBack**: Cost of expensive reallocations spread evenly across cheap insertions.

---

### 11. Terminology
- **Size ($n$)**: Active elements.
- **Capacity ($C$)**: Total available slots before next resize.
- **Amortized Cost**: Average cost per operation over a worst-case sequence of operations.
- **Shrinking / Compaction**: Optional capacity reduction when $n \le C/4$ to avoid hysteresis.

---

### 12. Structural Diagram (ASCII)

```text
Dynamic Array Lifecycle: size = 3, capacity = 4
┌─────────┬─────────┬─────────┬─────────┐
│   10    │   20    │   30    │ [EMPTY] │
└─────────┴─────────┴─────────┴─────────┘
  idx 0     idx 1     idx 2     idx 3
▲                                       ▲
└───────────── size = 3 ────────────────┘
└──────────────────── capacity = 4 ─────┘

INSERTION TRIGGERING RESIZE (PushBack(40), then PushBack(50)):
Step 1: Insert 40 at index 3. Array is now FULL (size = 4, capacity = 4).
Step 2: Insert 50. Capacity is full!
        - Allocate new buffer of capacity = 4 * 2 = 8
        - Copy 10, 20, 30, 40 to new buffer
        - Deallocate old buffer
        - Append 50 at index 4

NEW BUFFER: (size = 5, capacity = 8)
┌─────┬─────┬─────┬─────┬─────┬───────┬───────┬───────┐
│ 10  │ 20  │ 30  │ 40  │ 50  │ [EMP] │ [EMP] │ [EMP] │
└─────┴─────┴─────┴─────┴─────┴───────┴───────┴───────┘
  0     1     2     3     4       5       6       7
```

---

### 13. Memory Representation
Stored on the **Heap**. The container object on the stack contains just 3 words:
```text
Stack Frame:
┌───────────────────────────┐
│ pointer to heap buffer    │ ────► Heap: [ 10 | 20 | 30 | 40 | 50 | ... ]
│ size: 5                   │
│ capacity: 8               │
└───────────────────────────┘
```

---

### 14. Supported Operations

| Operation | Description | Amortized Time | Worst Case Time | Space |
| :--- | :--- | :---: | :---: | :---: |
| **Access($i$)** | Read element at index $i$ | $O(1)$ | $O(1)$ | $O(1)$ |
| **PushBack($x$)** | Append element to the end | $O(1)^*$ | $O(n)$ | $O(1)$ |
| **PopBack()** | Remove last element | $O(1)$ | $O(1)$ | $O(1)$ |
| **InsertAt($i, x$)**| Insert at arbitrary index $i$ | $O(n)$ | $O(n)$ | $O(1)$ |
| **DeleteAt($i$)** | Delete at arbitrary index $i$ | $O(n)$ | $O(n)$ | $O(1)$ |

---

### 15. Formal Proof: Amortized $O(1)$ via Accounting Method

Let the cost of writing an element into an empty slot be **1 coin**.  
Charge each inserted element **3 coins**:
- **1 coin** pays for its own immediate insertion into the array.
- **1 coin** is stored as credit on its own slot.
- **1 coin** is stored as credit on a previously inserted element that has already moved once.

When capacity doubles from $N$ to $2N$:
- Exactly $N$ new elements were inserted since the last resize.
- Each of these $N$ elements has stored credit.
- Total accumulated credit $= 2 \times N = 2N$ coins.
- Copying all $N$ elements to the new buffer costs exactly $N$ operations.
- The accumulated credit fully finances the copying work with coins to spare!
$$\text{Amortized Cost per Insertion} = 3 \text{ coins} = O(1) \quad \blacksquare$$

---

### 16. Pseudocode

```text
DATA STRUCTURE DynamicArray
    Fields:
        buffer: array of elements
        size: integer ← 0
        capacity: integer ← 1

    OPERATION Initialize(initialCapacity ← 1):
        capacity ← initialCapacity
        size ← 0
        buffer ← allocate array of size capacity

    OPERATION PushBack(val):
        if size = capacity:
            Resize(2 * capacity)
        buffer[size] ← val
        size ← size + 1

    OPERATION Resize(newCapacity):
        newBuffer ← allocate array of size newCapacity
        for i ← 0 to size - 1:
            newBuffer[i] ← buffer[i]
        deallocate buffer
        buffer ← newBuffer
        capacity ← newCapacity

    OPERATION PopBack():
        if size = 0:
            error "Underflow"
        size ← size - 1
        val ← buffer[size]
        // Optional shrinking to prevent thrashing
        if size > 0 and size ≤ ⌊capacity / 4⌋:
            Resize(⌊capacity / 2⌋)
        return val
```

---

### 17. Step-by-Step Dry Run Table: Sequence of 5 PushBack Operations

Starting with capacity $= 1$:

| Op # | Call | Initial $(n, C)$ | Resize Triggered? | New $C$ | Elements Copied | Final Buffer | Final $(n, C)$ | Cost |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| 1 | `PushBack(1)` | $(0, 1)$ | No | 1 | 0 | $[1]$ | $(1, 1)$ | 1 |
| 2 | `PushBack(2)` | $(1, 1)$ | **Yes (1 $\to$ 2)**| 2 | 1 (copy 1) | $[1, 2]$ | $(2, 2)$ | $1+1=2$ |
| 3 | `PushBack(3)` | $(2, 2)$ | **Yes (2 $\to$ 4)**| 4 | 2 (copy 1, 2)| $[1, 2, 3, \_]$ | $(3, 4)$ | $2+1=3$ |
| 4 | `PushBack(4)` | $(3, 4)$ | No | 4 | 0 | $[1, 2, 3, 4]$ | $(4, 4)$ | 1 |
| 5 | `PushBack(5)` | $(4, 4)$ | **Yes (4 $\to$ 8)**| 8 | 4 (copy 1..4)| $[1, 2, 3, 4, 5, \_, \_, \_]$ | $(5, 8)$ | $4+1=5$ |

**Total Actual Cost for 5 Operations** $= 1 + 2 + 3 + 1 + 5 = 12$ operations.  
**Average Cost per Operation** $= 12 / 5 = 2.4 \approx O(1)$.

---

### 18. Edge Cases
- **Initial Capacity = 0**: Must branch to set capacity to at least 1 or 2 during first push.
- **Shrink Thrashing (Hysteresis)**: If you double at $n = C$ and halve at $n = C/2$, alternating `PushBack` and `PopBack` at the threshold triggers $O(n)$ resize *every single step*.
  - **Mitigation**: Double when $n = C$; halve only when $n \le C/4$.

---

### 19. Advantages & Limitations
- **Advantages**: Dynamic sizing; instant $O(1)$ random indexing; great cache locality.
- **Limitations**: Occasional $O(n)$ spike on resize (unsuitable for hard real-time systems); wasted memory buffer overhead (up to $50\%$ empty space).

---

### 20. One-Minute Revision
- Dynamic Array = Static array + Geometric doubling + Amortized $O(1)$ append.
- Doubling factor must be geometric ($>1.0$), never arithmetic ($+K$).
- Halve at $C/4$ to prevent resize thrashing.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 10: Elementary Data Structures. MIT Press.
2. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.3: Bags, Queues, and Stacks. Addison-Wesley.
3. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.2: Linear Lists. Addison-Wesley.
