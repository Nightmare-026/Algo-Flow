# Part 02: Linear Data Structures — Module 07: Queues & Circular Queues

> **Topics Covered:**  
> 31. Queue Abstract Data Type (FIFO) & Operations &bull; Linear Array Queue & The "False Overflow / Drift" Problem &bull; Linked List Queue Implementation &bull; 32. Circular Queue (Ring Buffer) & Modulo Arithmetic &bull; Wrap-Around State Tracking & Kernel Ring Buffers &bull; Two-Stack Queue Paradigm (Potential Method Proof) &bull; Production Implementations

---

While stacks govern depth-first backtracking through Last-In, First-Out (LIFO) access, queues enforce fair, sequential scheduling through First-In, First-Out (FIFO) semantics. Elements enter at the rear and exit from the front, mirroring pipeline buffers and operating system task schedulers. However, naive linear array implementations suffer from pointer drift and false capacity exhaustion. This chapter analyzes the FIFO abstraction, diagnoses the false overflow failure mode, formalizes modulo-arithmetic circular ring buffers, details two-stack queue emulation with a rigorous potential method amortized proof, and explores lock-free kernel buffer architectures.

### Learning Objectives

- Define the FIFO Queue Abstract Data Type and enforce boundary invariants for `front` and `rear` pointers.
- Diagnose the "false overflow" (pointer drift) problem in linear array queues and quantify the $O(n)$ latency penalty of element shifting.
- Implement circular queues (ring buffers) using modulo arithmetic to achieve $O(1)$ wrap-around insertions and deletions.
- Compare full/empty state disambiguation strategies: explicit counter tracking versus the reserved empty slot invariant.
- Prove the amortized $O(1)$ complexity of the two-stack queue using the formal Physicist's Potential Method.
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

| Operation              | Description                               | Target Time | Auxiliary Space | Invariant / Precondition                           |
| :--------------------- | :---------------------------------------- | :---------: | :-------------: | :------------------------------------------------- |
| **`Enqueue(x)`**       | Append item $x$ to the `Rear`             | $\Theta(1)$ |     $O(1)$      | Fails with Overflow if bounded capacity is reached |
| **`Dequeue()`**        | Remove and return item at `Front`         | $\Theta(1)$ |     $O(1)$      | Fails with Underflow if queue is empty             |
| **`Front() / Peek()`** | Inspect value at `Front` without mutating | $\Theta(1)$ |     $O(1)$      | Requires non-empty queue                           |
| **`Rear()`**           | Inspect value at `Rear` without mutating  | $\Theta(1)$ |     $O(1)$      | Requires non-empty queue                           |
| **`IsEmpty()`**        | Returns `true` if element count is zero   | $\Theta(1)$ |     $O(1)$      | Verified via `count == 0` or `front == -1`         |
| **`Size()`**           | Returns current active element count      | $\Theta(1)$ |     $O(1)$      | Returns non-negative integer                       |

---

### 3. The Fatal Flaw of Linear Arrays: False Overflow (Pointer Drift)

Consider a static array of capacity $C = 5$ with two pointer offsets: `front` and `rear`.

#### State Progression Demonstrating Drift

| Step  | Operation                      | `front` | `rear` | Array Contents $[0, 1, 2, 3, 4]$ | Status & Operational Diagnostics    |
| :---: | :----------------------------- | :-----: | :----: | :------------------------------- | :---------------------------------- |
| **0** | Initial State                  |  `-1`   |  `-1`  | `[ _, _, _, _, _ ]`              | Queue is empty                      |
| **1** | Enqueue 5 items ($10..50$)     |   `0`   |  `4`   | `[ 10, 20, 30, 40, 50 ]`         | Array is legitimately 100% full     |
| **2** | Dequeue 3 items ($10, 20, 30$) |   `3`   |  `4`   | `[ _, _, _, 40, 50 ]`            | Slots 0, 1, 2 vacated and available |
| **3** | **Attempt `Enqueue(60)`**      |   `3`   |  `4`   | `[ _, _, _, 40, 50 ]`            | **CRASH: False Overflow!**          |

#### Why Linear Arrays Fail for Queues:

The condition `rear == capacity - 1` evaluates to `true` ($4 == 4$), so the linear queue reports an **Overflow Error** and rejects the item, even though $60\%$ of the physical array is vacant!

To reuse the vacated slots at the front of a linear array, the implementation would have to shift all remaining elements back to index 0 on every dequeue:

```text
Shift Remediation (Anti-Pattern):
[ _, _, _, 40, 50 ]  ---> Shift 40 to index 0, 50 to index 1 ---> [ 40, 50, _, _, _ ]
Latency: O(n) element moves per Dequeue! Destroying the O(1) performance contract.
```

---

### 4. Pointer Drift vs. Circular Ring Buffer Topology

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Memory Layout Comparison: Linear Array Drift vs. Modulo Ring Buffer
  </div>
  <svg viewBox="0 0 850 380" class="w-full h-auto text-xs" style="max-height: 380px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="ringArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="340" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Left: Linear Drift Problem -->
    <g transform="translate(45, 50)">
      <text x="175" y="20" font-weight="700" fill="#ef4444" text-anchor="middle" font-size="13">Linear Array Drift: "False Overflow"</text>
      <!-- Slots 0..4 -->
      <g transform="translate(20, 45)">
        <rect x="0" y="0" width="60" height="60" rx="6" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,4"/>
        <text x="30" y="35" text-anchor="middle" font-family="monospace" fill="#ef4444">[Vacant]</text>
        <text x="30" y="75" text-anchor="middle" font-size="10" fill="currentColor" fill-opacity="0.6">idx 0</text>
        <rect x="65" y="0" width="60" height="60" rx="6" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,4"/>
        <text x="95" y="35" text-anchor="middle" font-family="monospace" fill="#ef4444">[Vacant]</text>
        <text x="95" y="75" text-anchor="middle" font-size="10" fill="currentColor" fill-opacity="0.6">idx 1</text>
        <rect x="130" y="0" width="60" height="60" rx="6" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,4"/>
        <text x="160" y="35" text-anchor="middle" font-family="monospace" fill="#ef4444">[Vacant]</text>
        <text x="160" y="75" text-anchor="middle" font-size="10" fill="currentColor" fill-opacity="0.6">idx 2</text>
        <rect x="195" y="0" width="60" height="60" rx="6" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
        <text x="225" y="35" text-anchor="middle" font-family="monospace" font-weight="700" fill="#3b82f6">40</text>
        <text x="225" y="75" text-anchor="middle" font-size="10" fill="currentColor" fill-opacity="0.6">idx 3 (F)</text>
        <rect x="260" y="0" width="60" height="60" rx="6" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
        <text x="290" y="35" text-anchor="middle" font-family="monospace" font-weight="700" fill="#3b82f6">50</text>
        <text x="290" y="75" text-anchor="middle" font-size="10" fill="currentColor" fill-opacity="0.6">idx 4 (R)</text>
      </g>
      <!-- Error Explanation -->
      <path d="M 330 75 L 365 75" stroke="#ef4444" stroke-width="2" marker-end="url(#ringArrow)"/>
      <rect x="20" y="160" width="310" height="95" rx="8" fill="#ef4444" fill-opacity="0.08" stroke="#ef4444" stroke-width="1"/>
      <text x="35" y="185" font-weight="700" fill="#ef4444" font-size="11">Dead-End Barrier Reached:</text>
      <text x="35" y="205" fill="currentColor" fill-opacity="0.8" font-size="10">rear == capacity - 1 (4 == 4).</text>
      <text x="35" y="222" fill="currentColor" fill-opacity="0.8" font-size="10">Slots 0..2 are wasted, but new Enqueue fails!</text>
      <text x="35" y="240" fill="#ef4444" font-size="10" font-weight="600">Requires O(n) array shift to recover space.</text>
    </g>
    <!-- Divider -->
    <line x1="435" y1="40" x2="435" y2="340" stroke="currentColor" stroke-opacity="0.15" stroke-width="1.5"/>
    <!-- Right: Modulo Ring Buffer Solution -->
    <g transform="translate(460, 50)">
      <text x="175" y="20" font-weight="700" fill="#10b981" text-anchor="middle" font-size="13">Circular Ring Buffer: Modulo Wrap-Around</text>
      <!-- Circular Modulo Geometry (8 slots ring) -->
      <g transform="translate(175, 150)">
        <!-- Center Hub -->
        <circle cx="0" cy="0" r="35" fill="#10b981" fill-opacity="0.1" stroke="#10b981" stroke-width="1.5"/>
        <text x="0" y="4" text-anchor="middle" font-weight="700" fill="#10b981" font-size="11">(i + 1) % C</text>
        <!-- 8 Circular Slots: Radius = 85 -->
        <!-- Slot 0: Top (0, -85) -->
        <circle cx="0" cy="-85" r="22" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="2"/>
        <text x="0" y="-81" text-anchor="middle" font-family="monospace" font-weight="700" font-size="11" fill="currentColor">60 (R)</text>
        <!-- Slot 1: Top-Right (60, -60) -->
        <circle cx="60" cy="-60" r="22" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="3,3"/>
        <text x="60" y="-56" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor" fill-opacity="0.5">[free]</text>
        <!-- Slot 2: Right (85, 0) -->
        <circle cx="85" cy="0" r="22" fill="none" stroke="currentColor" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="3,3"/>
        <text x="85" y="4" text-anchor="middle" font-family="monospace" font-size="10" fill="currentColor" fill-opacity="0.5">[free]</text>
        <!-- Slot 3: Bottom-Right (60, 60) -->
        <circle cx="60" cy="60" r="22" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="2"/>
        <text x="60" y="64" text-anchor="middle" font-family="monospace" font-weight="700" font-size="11" fill="#3b82f6">30 (F)</text>
        <!-- Slot 4: Bottom (0, 85) -->
        <circle cx="0" cy="85" r="22" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="0" y="89" text-anchor="middle" font-family="monospace" font-size="11" fill="currentColor">40</text>
        <!-- Slot 5: Bottom-Left (-60, 60) -->
        <circle cx="-60" cy="60" r="22" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="-60" y="64" text-anchor="middle" font-family="monospace" font-size="11" fill="currentColor">50</text>
        <!-- Directional Flow Arrows on Ring -->
        <path d="M -30 -80 A 85 85 0 0 1 30 -80" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#ringArrow)"/>
      </g>
      <!-- Benefits Box -->
      <rect x="20" y="260" width="310" height="50" rx="8" fill="#10b981" fill-opacity="0.08" stroke="#10b981" stroke-width="1"/>
      <text x="175" y="280" font-weight="700" fill="#10b981" text-anchor="middle" font-size="11">Infinite Memory Recycling (Theta(1)):</text>
      <text x="175" y="298" fill="currentColor" fill-opacity="0.8" text-anchor="middle" font-size="10">rear wraps from idx 5 &rarr; idx 0. Zero byte moves!</text>
    </g>
  </svg>
</div>

---

## Topic 32: Circular Queues (Ring Buffers) & Modulo Arithmetic

### 1. Conceptual Architecture & The Modulo Ring

Instead of treating backing memory as a finite line that dead-ends at index $C - 1$, a **Circular Queue (Ring Buffer)** bends the array into a continuous logical ring where index $C - 1$ connects directly to index $0$.

When pointer `rear` or `front` increments past the physical boundary of the array, it wraps around to the beginning using **Modulo Arithmetic**:

$$\text{nextIndex} = (\text{currentIndex} + 1) \pmod{\text{Capacity}}$$

When slot $C-1$ is reached, $((C-1) + 1) \pmod C = 0$. If slot $0$ was previously vacated by a `Dequeue`, `rear` immediately claims it without shifting a single byte of memory.

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

### 3. Step-by-Step Wrap-Around State Trace

Let Capacity $C = 5$. We trace a complete lifecycle demonstrating wrap-around:

|  Step  | Operation            | `front` | `rear`  | `count` | Physical Array $[0, 1, 2, 3, 4]$ | Event / Notes                                     |
| :----: | :------------------- | :-----: | :-----: | :-----: | :------------------------------: | :------------------------------------------------ |
| **0**  | `Init(5)`            |   `0`   |  `-1`   |   `0`   |       `[ _, _, _, _, _ ]`        | Buffer allocated empty                            |
| **1**  | `Enqueue(10)`        |   `0`   |   `0`   |   `1`   |       `[ 10, _, _, _, _ ]`       | Standard insert                                   |
| **2**  | `Enqueue(20)`        |   `0`   |   `1`   |   `2`   |      `[ 10, 20, _, _, _ ]`       | Standard insert                                   |
| **3**  | `Enqueue(30)`        |   `0`   |   `2`   |   `3`   |      `[ 10, 20, 30, _, _ ]`      | Standard insert                                   |
| **4**  | `Dequeue()` $\to 10$ |   `1`   |   `2`   |   `2`   |     `[ (10), 20, 30, _, _ ]`     | Slot 0 vacated (`front = 1`)                      |
| **5**  | `Dequeue()` $\to 20$ |   `2`   |   `2`   |   `1`   |    `[ (10), (20), 30, _, _ ]`    | Slot 1 vacated (`front = 2`)                      |
| **6**  | `Enqueue(40)`        |   `2`   |   `3`   |   `2`   |      `[ _, _, 30, 40, _ ]`       | Standard insert                                   |
| **7**  | `Enqueue(50)`        |   `2`   |   `4`   |   `3`   |      `[ _, _, 30, 40, 50 ]`      | Physical boundary reached                         |
| **8**  | **`Enqueue(60)`**    |   `2`   | **`0`** |   `4`   |     `[ 60, _, 30, 40, 50 ]`      | **WRAP-AROUND: $(4+1)\%5 = 0$! Reclaims Slot 0!** |
| **9**  | **`Enqueue(70)`**    |   `2`   | **`1`** |   `5`   |     `[ 60, 70, 30, 40, 50 ]`     | **WRAP-AROUND: $(0+1)\%5 = 1$! Queue 100% Full!** |
| **10** | `Enqueue(80)`        |   `2`   |   `1`   |   `5`   |                —                 | **Overflow cleanly rejected!**                    |

---

### 4. Two-Stack Queue Implementation & Formal Potential Method Proof

Can a strict FIFO queue be constructed using only two LIFO stacks ($S_{\text{in}}$ and $S_{\text{out}}$)?

```text
Enqueue(x):
    S_in.Push(x)

Dequeue():
    if S_out.IsEmpty():
        if S_in.IsEmpty(): raise Underflow
        while not S_in.IsEmpty():
            S_out.Push(S_in.Pop())  // Inverts LIFO to FIFO order!
    return S_out.Pop()
```

#### Formal Amortized Proof via the Physicist's Potential Method:

Define the potential function $\Phi$ of the two-stack system at state $t$ as:
$$\Phi(D_t) = 2 \cdot |S_{\text{in}}|$$
Where $|S_{\text{in}}|$ is the number of elements currently stored in the input stack.

- Notice that $\Phi(D_0) = 0$ (initially empty) and $\Phi(D_t) \ge 0$ for all $t \ge 0$.

1. **Amortized Cost of `Enqueue(x)`**:
   - Actual work $c_i = 1$ (pushing onto $S_{\text{in}}$).
   - $\Delta \Phi = \Phi(D_i) - \Phi(D_{i-1}) = 2(|S_{\text{in}}| + 1) - 2|S_{\text{in}}| = +2$.
   - Amortized cost:
     $$\hat{c}_i = c_i + \Delta \Phi = 1 + 2 = 3 = \Theta(1)$$

2. **Amortized Cost of `Dequeue()`**:
   - **Case A: $S_{\text{out}}$ is non-empty**:
     - Actual work $c_i = 1$ (pop from $S_{\text{out}}$).
     - $\Delta \Phi = 0$ (size of $S_{\text{in}}$ is unchanged).
     - $\hat{c}_i = 1 + 0 = 1 = \Theta(1)$.
   - **Case B: $S_{\text{out}}$ is empty (batch transfer of $k = |S_{\text{in}}|$ items)**:
     - Actual work $c_i = 2k + 1$ ($k$ pops from $S_{\text{in}}$, $k$ pushes to $S_{\text{out}}$, plus $1$ final pop).
     - $\Delta \Phi = 2 \cdot 0 - 2k = -2k$.
     - Amortized cost:
       $$\hat{c}_i = c_i + \Delta \Phi = (2k + 1) - 2k = 1 = \Theta(1)$$

Therefore, every operation executes in **amortized $\Theta(1)$ time**. $\blacksquare$

---

### 5. Systems Engineering: Kernel Ring Buffers & Bitwise Masking

In high-performance operating system engineering (such as the Linux kernel's `kfifo` subsystem):

- Capacities are constrained to powers of two: $C = 2^k$.
- Integer modulo division (`id % C`) translates to an expensive multi-cycle CPU instruction (`idiv` on x86, taking 15–40 clock cycles).
- By constraining $C = 2^k$, modulo is replaced with a single-cycle bitwise AND mask:
  $$\text{index} \pmod{2^k} \equiv \text{index} \ \& \ (2^k - 1)$$

```c
// Linux kernel kfifo wrap-around idiom:
unsigned int next_in = (fifo->in + 1) & (fifo->size - 1);
```

Furthermore, by decoupling `in` and `out` into 64-bit monotonically increasing unsigned counters that wrap naturally on integer overflow ($2^{64}-1 \to 0$), Single-Producer Single-Consumer (SPSC) ring buffers run completely **lock-free** without mutex locks or atomic compare-and-swap (CAS) instructions.

---

### 6. Production Multi-Language Implementations

#### A. C++20 Ring Buffer with Bitwise Masking & Template Safety

```cpp
#include <iostream>
#include <vector>
#include <stdexcept>
#include <concepts>

template <typename T>
class CircularQueue {
private:
    std::vector<T> buffer_;
    size_t capacity_;
    size_t mask_;
    size_t front_;
    size_t rear_;
    size_t count_;

    static size_t next_power_of_two(size_t n) {
        size_t power = 1;
        while (power < n) power <<= 1;
        return power;
    }

public:
    explicit CircularQueue(size_t min_capacity = 8)
        : capacity_(next_power_of_two(min_capacity)),
          mask_(capacity_ - 1),
          buffer_(capacity_),
          front_(0),
          rear_(0),
          count_(0) {}

    bool enqueue(T item) {
        if (is_full()) {
            return false;
        }
        buffer_[rear_] = std::move(item);
        rear_ = (rear_ + 1) & mask_;
        ++count_;
        return true;
    }

    bool dequeue(T& item) {
        if (is_empty()) {
            return false;
        }
        item = std::move(buffer_[front_]);
        front_ = (front_ + 1) & mask_;
        --count_;
        return true;
    }

    [[nodiscard]] bool is_empty() const noexcept { return count_ == 0; }
    [[nodiscard]] bool is_full() const noexcept { return count_ == capacity_; }
    [[nodiscard]] size_t size() const noexcept { return count_; }
    [[nodiscard]] size_t capacity() const noexcept { return capacity_; }
};
```

---

### 7. Key Takeaways

1. **FIFO Invariant**: Queues enforce First-In, First-Out order, serving as the universal primitive for breadth-first search and pipeline scheduling.
2. **False Overflow Elimination**: Naive linear array queues suffer from pointer drift; circular ring buffers recycle memory via modulo arithmetic `(idx + 1) % C`.
3. **Disambiguation Rules**: Full versus empty state in ring buffers is cleanly resolved by maintaining an explicit element `count` tracker.
4. **Hardware Symbiosis**: Sizing ring buffers to powers of two enables bitwise wrap-around masking `idx & (C - 1)`, a cornerstone optimization in Linux kernel `kfifo` and NIC ring buffers.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). _Introduction to Algorithms_ (4th ed.), Chapter 10: _Elementary Data Structures_. MIT Press.
2. **Corbet, J., Rubini, A., & Kroah-Hartman, G.** (2005). _Linux Device Drivers_ (3rd ed.), Chapter 11: _Data Types in the Kernel (kfifo)_. O'Reilly Media.
3. **Sedgewick, R., & Wayne, K.** (2011). _Algorithms_ (4th ed.), Section 1.3: _Bags, Queues, and Stacks_. Addison-Wesley.
4. **Knuth, D. E.** (1997). _The Art of Computer Programming, Volume 1: Fundamental Algorithms_ (3rd ed.), Section 2.2: _Linear Lists_. Addison-Wesley.
