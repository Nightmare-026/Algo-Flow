# Part 02: Linear Data Structures — Module 07: Queues & Circular Queues

> **Topics Covered:**  
> 31. Queue Abstract Data Type (FIFO) & Operations &bull; Linear Array Queue & The "False Overflow / Drift" Problem &bull; Linked List Queue Implementation &bull; 32. Circular Queue (Ring Buffer) & Modulo Arithmetic &bull; Wrap-Around State Tracking & Kernel Ring Buffers &bull; Two-Stack Queue Paradigm

---

While stacks govern depth-first back-tracking through Last-In, First-Out (LIFO) access, queues enforce fair, sequential scheduling through First-In, First-Out (FIFO) semantics. Elements enter at the rear and exit from the front, mirroring pipeline buffers and operating system task schedulers. However, naive linear array implementations suffer from pointer drift and false capacity exhaustion. This chapter analyzes the FIFO abstraction, diagnoses the false overflow failure mode, formalizes modulo-arithmetic circular ring buffers, details two-stack queue emulation, and explores lock-free kernel buffer architectures.

### Learning Objectives
- Define the FIFO Queue Abstract Data Type and enforce boundary invariants for `front` and `rear` pointers.
- Diagnose the "false overflow" (pointer drift) problem in linear array queues and quantify the $O(n)$ latency penalty of element shifting.
- Implement circular queues (ring buffers) using modulo arithmetic to achieve $O(1)$ wrap-around insertions and deletions.
- Compare full/empty state disambiguation strategies: explicit counter tracking versus the reserved empty slot invariant.
- Implement an amortized $O(1)$ FIFO queue using two LIFO stacks and trace batch element transfers.
- Analyze the architectural role of circular ring buffers in Linux kernel `kfifo` and high-throughput network packet ring buffers.

---

## Topic 31: Queue (FIFO) Architecture & The Linear Drift Problem

### 1. Conceptual Foundations & The FIFO Invariant

A **Queue** is a restricted-access linear sequence governed by the **First-In, First-Out (FIFO)** discipline:
- Elements are inserted strictly at the **Rear (Tail)** via `Enqueue`.
- Elements are removed strictly from the **Front (Head)** via `Dequeue`.
- The element that has spent the longest duration in the queue is always the next one to be serviced.

```
+-----------------------------------------------------------------------------------+
|                              FIFO PIPELINE CONTAINER                              |
|                                                                                   |
|  DEQUEUE <-------- [ Front: Element A ] <--- [ Element B ] <--- [ Rear: Element C ] <--- ENQUEUE
|  (Departing Head)                                               (Arriving Tail)   |
+-----------------------------------------------------------------------------------+
```

> **Interactive Simulations**:  
> Step through FIFO queue behavior live in the [Interactive Queue Enqueue Simulator](/visualizer/queue-enqueue) and the [Interactive Queue Dequeue Simulator](/visualizer/queue-dequeue).

---

### 2. The Queue Abstract Data Type (ADT) Interface

| Operation | Description | Target Time | Auxiliary Space | Invariant / Precondition |
| :--- | :--- | :---: | :---: | :--- |
| **`Enqueue(x)`** | Append item $x$ to the `Rear` | $\Theta(1)$ | $O(1)$ | Fails with Overflow if bounded capacity is reached |
| **`Dequeue()`** | Remove and return item at `Front` | $\Theta(1)$ | $O(1)$ | Fails with Underflow if queue is empty |
| **`Front() / Peek()`**| Inspect value at `Front` without mutating | $\Theta(1)$ | $O(1)$ | Requires non-empty queue |
| **`Rear()`** | Inspect value at `Rear` without mutating | $\Theta(1)$ | $O(1)$ | Requires non-empty queue |
| **`IsEmpty()`** | Returns `true` if element count is zero | $\Theta(1)$ | $O(1)$ | Verified via `count == 0` or `front == -1` |
| **`Size()`** | Returns current active element count | $\Theta(1)$ | $O(1)$ | Returns non-negative integer |

---

### 3. The Fatal Flaw of Linear Arrays: False Overflow (Pointer Drift)

Consider a static array of capacity $C = 5$ with two pointer offsets: `front` and `rear`.

#### State Progression Demonstrating Drift

| Step | Operation | `front` | `rear` | Array Contents $[0, 1, 2, 3, 4]$ | Status & Operational Diagnostics |
| :---: | :--- | :---: | :---: | :--- | :--- |
| **0** | Initial State | `-1` | `-1` | `[ _, _, _, _, _ ]` | Queue is empty |
| **1** | Enqueue 5 items ($10..50$) | `0` | `4` | `[ 10, 20, 30, 40, 50 ]` | Array is legitimately 100% full |
| **2** | Dequeue 3 items ($10, 20, 30$) | `3` | `4` | `[ _, _, _, 40, 50 ]` | Slots 0, 1, 2 vacated and available |
| **3** | **Attempt `Enqueue(60)`** | `3` | `4` | `[ _, _, _, 40, 50 ]` | **CRASH: False Overflow!** |

#### Why Linear Arrays Fail for Queues:
The condition `rear == capacity - 1` evaluates to `true` ($4 == 4$), so the linear queue reports an **Overflow Error** and rejects the item, even though $60\%$ of the physical array is vacant!

To reuse the vacated slots at the front of a linear array, the implementation would have to shift all remaining elements back to index 0 on every dequeue:

```text
Shift Remediation (Anti-Pattern):
[ _, _, _, 40, 50 ]  ---> Shift 40 to index 0, 50 to index 1 ---> [ 40, 50, _, _, _ ]
Latency: O(n) element moves per Dequeue! Destroying the O(1) performance contract.
```

---

### 4. Linked-List-Based Queue Implementation

A pointer-based linked list resolves linear array drift and guarantees strict $O(1)$ time with zero shifting:
- Maintain a singly linked list with `front` pointing to the head and `rear` pointing to the tail.
- **`Enqueue(x)`**: `rear.next = new Node(x); rear = rear.next;` ($\Theta(1)$).
- **`Dequeue()`**: `val = front.data; front = front.next;` ($\Theta(1)$).

| Pointer Handle | Target Node Address | Stored Value | `next` Pointer Reference | Semantic Role |
| :--- | :---: | :---: | :---: | :--- |
| **`front`** | `0x10A0` | `10` | `0x20F4` | **Front of Queue (Next to Dequeue)** |
| *(Internal Link)* | `0x20F4` | `20` | `0x3500` | Intermediate FIFO Node |
| **`rear`** | `0x3500` | `30` | `NULL` | **Rear of Queue (Most Recently Enqueued)** |

---

## Topic 32: Circular Queues (Ring Buffers) & Modulo Arithmetic

### 1. Conceptual Architecture & The Modulo Ring

Instead of treating backing memory as a finite line that dead-ends at index $C - 1$, a **Circular Queue (Ring Buffer)** bends the array into a continuous logical ring where index $C - 1$ connects directly to index $0$.

When pointer `rear` or `front` increments past the physical boundary of the array, it wraps around to the beginning using **Modulo Arithmetic**:

$$\text{nextIndex} = (\text{currentIndex} + 1) \pmod{\text{Capacity}}$$

```
Logical Ring Buffer (Capacity = 5):
                  [ Slot 0 ]
                 /          \
       [ Slot 4 ]            [ Slot 1 ]
            |                     |
       [ Slot 3 ] ------------ [ Slot 2 ]
```

When slot $4$ is reached, $(4 + 1) \pmod 5 = 0$. If slot $0$ was previously vacated by a `Dequeue`, `rear` immediately claims it without shifting a single byte of memory.

---

### 2. Disambiguating Full vs. Empty States

When `front == rear`, does it signify that the queue is completely empty or completely full? Two distinct architectural patterns resolve this ambiguity:

#### Strategy A: Explicit Count Variable (Recommended)
Maintain an internal integer `count` tracking the active element count ($0 \le \text{count} \le \text{Capacity}$):
- **Empty Condition**: $\text{count} == 0$
- **Full Condition**: $\text{count} == \text{Capacity}$
- **Available Slots**: $\text{Capacity} - \text{count}$

#### Strategy B: Reserved Empty Slot (Classic Textbook)
Sacrifice one array slot permanently. An array of size $C$ holds at most $C - 1$ elements:
- **Empty Condition**: $\text{front} == \text{rear}$
- **Full Condition**: $(\text{rear} + 1) \pmod C == \text{front}$

---

### 3. Canonical Ring Buffer Specification

```text
CLASS CircularQueue:
    field buffer: Array of ValueType
    field front: Integer <- 0
    field rear: Integer <- -1
    field capacity: Integer
    field count: Integer <- 0

    CONSTRUCTOR(cap: Integer):
        assert cap > 0
        this.capacity <- cap
        this.buffer <- allocate_memory(cap * sizeof(ValueType))
        this.front <- 0
        this.rear <- -1
        this.count <- 0

    FUNCTION Enqueue(x: ValueType) -> Void:
        if this.IsFull():
            raise OverflowException("Circular Queue is full")
        this.rear <- (this.rear + 1) mod this.capacity
        this.buffer[this.rear] <- x
        this.count <- this.count + 1

    FUNCTION Dequeue() -> ValueType:
        if this.IsEmpty():
            raise UnderflowException("Circular Queue is empty")
        val <- this.buffer[this.front]
        this.front <- (this.front + 1) mod this.capacity
        this.count <- this.count - 1
        return val

    FUNCTION Peek() -> ValueType:
        if this.IsEmpty():
            raise UnderflowException("Circular Queue is empty")
        return this.buffer[this.front]

    FUNCTION IsEmpty() -> Boolean:
        return (this.count == 0)

    FUNCTION IsFull() -> Boolean:
        return (this.count == this.capacity)

    FUNCTION Size() -> Integer:
        return this.count
```

---

### 4. Step-by-Step Wrap-Around State Trace

Let Capacity $C = 5$. We trace a complete lifecycle demonstrating wrap-around:

| Step | Operation | `front` | `rear` | `count` | Physical Array $[0, 1, 2, 3, 4]$ | Event / Notes |
| :---: | :--- | :---: | :---: | :---: | :--- | :--- |
| **0** | `Init(5)` | `0` | `-1` | `0` | `[ _, _, _, _, _ ]` | Buffer allocated empty |
| **1** | `Enqueue(10)` | `0` | `0` | `1` | `[ 10, _, _, _, _ ]` | Standard insert |
| **2** | `Enqueue(20)` | `0` | `1` | `2` | `[ 10, 20, _, _, _ ]` | Standard insert |
| **3** | `Enqueue(30)` | `0` | `2` | `3` | `[ 10, 20, 30, _, _ ]` | Standard insert |
| **4** | `Dequeue()` $\to 10$ | `1` | `2` | `2` | `[ (10), 20, 30, _, _ ]` | Slot 0 vacated (`front = 1`) |
| **5** | `Dequeue()` $\to 20$ | `2` | `2` | `1` | `[ (10), (20), 30, _, _ ]` | Slot 1 vacated (`front = 2`) |
| **6** | `Enqueue(40)` | `2` | `3` | `2` | `[ _, _, 30, 40, _ ]` | Standard insert |
| **7** | `Enqueue(50)` | `2` | `4` | `3` | `[ _, _, 30, 40, 50 ]` | Physical boundary reached |
| **8** | **`Enqueue(60)`** | `2` | **`0`** | `4` | `[ 60, _, 30, 40, 50 ]` | **WRAP-AROUND: $(4+1)\%5 = 0$! Reclaims Slot 0!** |
| **9** | **`Enqueue(70)`** | `2` | **`1`** | `5` | `[ 60, 70, 30, 40, 50 ]` | **WRAP-AROUND: $(0+1)\%5 = 1$! Queue 100% Full!** |
| **10**| `Enqueue(80)` | `2` | `1` | `5` | — | **Overflow cleanly rejected!** |

---

### 5. Two-Stack Queue Implementation (Amortized Analysis)

Can a FIFO queue be constructed using only two LIFO stacks?

#### Architecture:
- `inStack`: Receives incoming items during `Enqueue`.
- `outStack`: Serves items during `Dequeue`.

```text
CLASS QueueUsingStacks:
    field inStack: Stack
    field outStack: Stack

    FUNCTION Enqueue(x: ValueType) -> Void:
        this.inStack.Push(x)

    FUNCTION Dequeue() -> ValueType:
        if this.outStack.IsEmpty():
            if this.inStack.IsEmpty():
                raise UnderflowException("Queue is empty")
            // Batch transfer elements: inverting LIFO into FIFO!
            while not this.inStack.IsEmpty():
                this.outStack.Push(this.inStack.Pop())
        return this.outStack.Pop()
```

#### Amortized Complexity Proof:
Each element is pushed to `inStack` once ($1$ op), popped from `inStack` once ($1$ op), pushed to `outStack` once ($1$ op), and popped from `outStack` once ($1$ op).  
Total lifetime cost per element $= 4$ operations $\implies$ **Amortized $\Theta(1)$ per operation**.

---

### 6. Systems Engineering: Kernel Ring Buffers & Lock-Free IPC

Circular queues are the industry standard architecture for real-time systems and operating system kernels:

1. **Linux Kernel `kfifo`**: A lock-free ring buffer utilizing a power-of-two capacity $C = 2^k$. Instead of expensive division modulo `(idx % C)`, the kernel optimizes wrap-around using bitwise AND:  
   $$\text{idx} \pmod{2^k} \equiv \text{idx} \ \& \ (2^k - 1)$$
   This replaces a multi-cycle hardware integer division instruction with a single-cycle bitwise mask.
2. **Network Interface Card (NIC) Ring Buffers**: High-speed Ethernet controllers use Direct Memory Access (DMA) to stream network packets straight into circular RX/TX ring buffers in kernel memory without CPU interrupts on every frame.
3. **Audio PCM Buffers**: Audio playback pipelines use circular buffers to bridge asynchronous audio decoders with real-time digital-to-analog converter (DAC) hardware timers.

---

### 7. Key Takeaways

1. **FIFO Invariant**: Queues enforce First-In, First-Out order, serving as the universal primitive for breadth-first search and pipeline scheduling.
2. **False Overflow Elimination**: Naive linear array queues suffer from pointer drift; circular ring buffers recycle memory via modulo arithmetic `(idx + 1) % C`.
3. **Disambiguation Rules**: Full versus empty state in ring buffers is cleanly resolved by maintaining an explicit element `count` tracker.
4. **Hardware Symbiosis**: Sizing ring buffers to powers of two enables bitwise wrap-around masking `idx & (C - 1)`, a cornerstone optimization in Linux kernel `kfifo` and NIC ring buffers.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 10: *Elementary Data Structures*. MIT Press.
2. **Corbet, J., Rubini, A., & Kroah-Hartman, G.** (2005). *Linux Device Drivers* (3rd ed.), Chapter 11: *Data Types in the Kernel (kfifo)*. O'Reilly Media.
3. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.3: *Bags, Queues, and Stacks*. Addison-Wesley.
4. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.2: *Linear Lists*. Addison-Wesley.
