# 🎟️ Part 02: Linear Data Structures — Module 07: Queues & Circular Queues

> **Topics Covered:**  
> 28. Queue Abstract Data Type (FIFO) & Operations &bull; Linear Array Queue & The "False Overflow / Drift" Problem &bull; Linked List Queue Implementation &bull; 29. Circular Queue (Ring Buffer) & Modulo Arithmetic &bull; Wrap-Around State Tracking & Kernel Ring Buffers

---

# TOPIC 28: QUEUE (FIFO)

### 1. Topic Title
**Queue (First-In, First-Out Restricted-Access Linear Container)**

### 2. Category
Linear Data Structures — Restricted Access Container (FIFO).

### 3. Difficulty
Beginner to Intermediate.

### 4. Prerequisites
- Module 01: Arrays & Dynamic Arrays.
- Module 03: Singly Linked Lists.

---

### 5. Definition & Intuitive Mental Model

### 💡 CONCEPT
A **Queue** is a linear data structure governed by the **FIFO (First-In, First-Out)** principle: the first element added to the queue is the first one to be removed. Elements enter at one end called the **Rear (Tail)** and depart from the opposite end called the **Front (Head)**.

### 🧠 INTUITION: The Movie Ticket Counter
Think of a physical line of people waiting to buy tickets at a cinema:
- New customers arrive and join at the back of the line (`Enqueue`).
- The ticket agent serves the customer at the front of the line (`Dequeue`).
- Cutting in line or being served out of order is forbidden. Fairness is preserved!

```text
       DEQUEUE ◄── [ Front: Person A ] ◄── [ Person B ] ◄── [ Person C : Rear ] ◄── ENQUEUE
(Departing Head)                                                            (Arriving Tail)
```

---

### 6. Queue ADT Specification & Asymptotic Complexities

| Operation | Description | Target Time | Space |
| :--- | :--- | :---: | :---: |
| **Enqueue($x$)** | Inserts element $x$ at the **Rear** of the queue. | $\Theta(1)$ | $O(1)$ |
| **Dequeue()** | Removes and returns the element at the **Front**. | $\Theta(1)$ | $O(1)$ |
| **Front() / Peek()** | Inspects front element without removing it. | $\Theta(1)$ | $O(1)$ |
| **Rear()** | Inspects the most recently enqueued element. | $\Theta(1)$ | $O(1)$ |
| **IsEmpty()** | Returns `true` if queue has no elements. | $\Theta(1)$ | $O(1)$ |
| **IsFull()** | Returns `true` if bounded capacity is reached. | $\Theta(1)$ | $O(1)$ |

---

### 7. The Fatal Flaw of Linear Array Queues: The "False Overflow" Problem

Suppose we implement a queue using a static array of size $C = 5$ with two index pointers: `front` and `rear`.

```text
INITIAL STATE: Queue is Empty
front = -1, rear = -1
Array: [ __ │ __ │ __ │ __ │ __ ]

STEP 1: Enqueue 10, 20, 30, 40, 50 (Full)
front = 0, rear = 4
Array: [ 10 │ 20 │ 30 │ 40 │ 50 ]
          ▲                   ▲
          │                   │
        front                rear

STEP 2: Dequeue 3 elements (10, 20, 30 removed)
front = 3, rear = 4
Array: [ __ │ __ │ __ │ 40 │ 50 ]
                        ▲    ▲
                        │    │
                      front rear
```

### ⚠️ THE DISASTER (False Overflow):
Now attempt to `Enqueue(60)`.
- The code checks: `if rear == capacity - 1` ($4 == 4 \implies$ **Overflow error!**).
- **The Tragedy**: The queue rejects the new element claiming it is "FULL", even though slots $0, 1, 2$ are completely **empty and wasted**!
- Shifting all remaining elements left by 3 positions would restore space, but doing so turns every `Dequeue` into an intolerable **$O(n)$ operation**!

---

### 8. Linked-List-Based Queue Implementation

To prevent false overflow and guarantee strict $O(1)$ operations with zero shifting:
- Maintain a Singly Linked List with two pointers: `front` (points to head) and `rear` (points to tail).
- **Enqueue($x$)**: Append node to `rear.next`, update `rear ← newNode` ($O(1)$).
- **Dequeue()**: Advance `front ← front.next` ($O(1)$).

```text
 FRONT (Head)                                              REAR (Tail)
   │                                                           │
   ▼                                                           ▼
[ 10 │ ● ] ──────────────► [ 20 │ ● ] ──────────────► [ 30 │ NULL ]
   ▲                                                           ▲
   │ Dequeue from here                                         │ Enqueue to here
```

---
---

# TOPIC 29: CIRCULAR QUEUE (RING BUFFER)

### 1. Topic Title
**Circular Queue (Ring Buffer via Modulo Arithmetic Optimization)**

### 2. Category
Linear Data Structures — Space-Efficient Cyclic Array Container.

### 3. Difficulty
Intermediate.

### 4. Prerequisites
- Topic 28: Linear Queue (False Overflow problem).
- Part 01: Foundations (Modular Arithmetic $x \pmod C$).

---

### 5. Intuition & Modulo Ring Topology

### 💡 THE ELEGANT SOLUTION:
Instead of treating an array as a straight line that terminates at index $C-1$, mentally bend the array into a **circle** where index $C-1$ wraps seamlessly back around to index $0$!

```text
                  [ Index 0 ]
                 /           \
     [ Index 4 ]               [ Index 1 ]
          │                         │
     [ Index 3 ] ───────────── [ Index 2 ]
```

Every time `rear` or `front` advances, we increment using **Modulo Arithmetic**:
$$\text{nextIndex} = (\text{currentIndex} + 1) \pmod{\text{Capacity}}$$

When `rear` reaches the end of the physical array (index $4$), its next position is $(4 + 1) \pmod 5 = 0$. If slot $0$ was vacated by an earlier `Dequeue`, `rear` wraps around and claims it without shifting a single byte!

---

### 6. Full & Empty Boundary Invariants

To distinguish between an **Empty** queue and a **Full** queue in an array of size $C$:

#### Approach A: Count Tracker (Cleanest & Most Intuitive)
Maintain an explicit `count` variable tracking the current number of elements:
- **Empty**: `count = 0`
- **Full**: `count = capacity`
- **Enqueue**: `rear ← (rear + 1) mod capacity; count ← count + 1`
- **Dequeue**: `front ← (front + 1) mod capacity; count ← count - 1`

#### Approach B: Single Reserved Slot Invariant (Standard Textbook)
- **Empty**: `front = -1` (or `front = rear`)
- **Full Condition**: When advancing `rear` by 1 would collide with `front`:
$$(\text{rear} + 1) \pmod{\text{Capacity}} == \text{front}$$

---

### 7. Complete Language-Independent Pseudocode

```text
DATA STRUCTURE CircularQueue
    Fields:
        buffer: Array of ValueType
        front: integer ← -1
        rear: integer ← -1
        capacity: integer
        count: integer ← 0

    OPERATION Initialize(cap):
        capacity ← cap
        buffer ← allocate Array of size capacity
        front ← 0
        rear ← -1
        count ← 0

    OPERATION Enqueue(x):
        if count = capacity:
            error "Circular Queue Overflow"
        
        rear ← (rear + 1) mod capacity
        buffer[rear] ← x
        count ← count + 1

    OPERATION Dequeue():
        if count = 0:
            error "Circular Queue Underflow"
        
        val ← buffer[front]
        front ← (front + 1) mod capacity
        count ← count - 1
        return val

    OPERATION Peek():
        if count = 0:
            error "Queue is empty"
        return buffer[front]

    OPERATION IsEmpty():
        return (count = 0)

    OPERATION IsFull():
        return (count = capacity)

    OPERATION Size():
        return count
```

---

### 8. Step-by-Step Wrap-Around Dry-Run Table

Let Capacity $C = 5$. We perform a sequence of operations illustrating wrap-around:

| Step | Operation | `front` | `rear` | `count` | Buffer Array State $[0, 1, 2, 3, 4]$ | Event / Notes |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **0** | `Initialize(5)` | 0 | -1 | 0 | `[ __ , __ , __ , __ , __ ]` | Initialized empty |
| **1** | `Enqueue(10)` | 0 | 0 | 1 | `[ 10 , __ , __ , __ , __ ]` | Normal insert |
| **2** | `Enqueue(20)` | 0 | 1 | 2 | `[ 10 , 20 , __ , __ , __ ]` | Normal insert |
| **3** | `Enqueue(30)` | 0 | 2 | 3 | `[ 10 , 20 , 30 , __ , __ ]` | Normal insert |
| **4** | `Dequeue()` $\to 10$ | 1 | 2 | 2 | `[ __ , 20 , 30 , __ , __ ]` | Slot 0 vacated! |
| **5** | `Dequeue()` $\to 20$ | 2 | 2 | 1 | `[ __ , __ , 30 , __ , __ ]` | Slot 1 vacated! |
| **6** | `Enqueue(40)` | 2 | 3 | 2 | `[ __ , __ , 30 , 40 , __ ]` | Normal insert |
| **7** | `Enqueue(50)` | 2 | 4 | 3 | `[ __ , __ , 30 , 40 , 50 ]` | Reached end of array! |
| **8** | **`Enqueue(60)`** | 2 | **0** | 4 | `[ 60 , __ , 30 , 40 , 50 ]` | **WRAP-AROUND! $(4+1)\%5 = 0$!** |
| **9** | **`Enqueue(70)`** | 2 | **1** | 5 | `[ 60 , 70 , 30 , 40 , 50 ]` | **Queue is now 100% Full!** |
| **10**| `Enqueue(80)` | 2 | 1 | 5 | — | **Overflow Rejected!** ✅ |

---

### 9. Real-World Production Systems Use

1. **Operating System Producer-Consumer IPC**:
   - A producer thread writes sensor data, while a consumer thread reads it. A lock-free Circular Buffer with atomic read/write pointers enables thread-safe communication without mutex lock contention.
2. **Audio & Video Streaming Hardware Buffers**:
   - Sound cards and video capture cards process continuous continuous streams of PCM audio samples via DMA into circular ring buffers.
3. **Linux Kernel `kfifo` & Network Ring Buffers**:
   - Network Interface Cards (NICs) transfer incoming Ethernet packets directly into an RX ring buffer using hardware DMA.

---

## 🔁 Module 07 Summary & Key Takeaways

1. **Queues** strictly enforce **FIFO** order with insertions at `rear` and removals at `front`.
2. Linear array queues suffer from **false overflow (drift)**, wasting vacated slots unless shifted at $O(n)$ cost.
3. **Circular Queues (Ring Buffers)** solve false overflow by wrapping indices around using modulo arithmetic: `(index + 1) % capacity`.
4. Ring buffers are the undisputed industry standard for **high-throughput real-time systems, audio streaming, and hardware driver buffers**.

---
[⬅️ Previous: Module 06 — Stacks](file:///d:/DSA/Part-02-Linear-Data-Structures/06_stacks.md) | [Next: Module 08 — Deques & Priority Queues ➡️](file:///d:/DSA/Part-02-Linear-Data-Structures/08_deques_and_priority_queues.md)
