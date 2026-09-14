# Part 02: Linear Data Structures — Module 08: Deques & Priority Queues

> **Topics Covered:**  
> 30. Double-Ended Queue (Deque) ADT & Core Operations &bull; Input-Restricted vs Output-Restricted Deques &bull; Circular Array Deque Modulo Mathematics &bull; The Sliding Window Maximum Monotonic Deque Pattern &bull; 31. Priority Queue ADT Fundamentals & Underlying Data Structure Trade-offs

---

# TOPIC 30: DOUBLE-ENDED QUEUE (DEQUE)

### 1. Topic Title
**Double-Ended Queue (Deque: Bi-Directional General-Purpose Linear Container)**

### 2. Category
Linear Data Structures — Generalized Dual-Boundary Access Container.

### 3. Difficulty
Intermediate.

### 4. Prerequisites
- Module 06: Stacks (LIFO).
- Module 07: Queues & Circular Queues (FIFO & Ring Buffers).

---

### 5. Definition & Intuitive Mental Model

### Concept
A **Double-Ended Queue (Deque)**, pronounced *"deck"*, is a generalized linear data structure that permits elements to be inserted and deleted with equal ease and efficiency from **both ends**: the **Front** and the **Rear**.

### Intuition: The Universal Chameleon
A Deque is the "Swiss Army Knife" of linear containers:
- If you restrict operations to `PushFront` and `PopFront` $\implies$ You have created a **Stack**!
- If you restrict operations to `PushBack` and `PopFront` $\implies$ You have created a **Queue**!
- In addition, you can freely inject high-priority elements at the front or inspect elements from the rear.

```text
  PUSH FRONT ──►                                      ◄── PUSH BACK
                   [ Front ] ◄══════════► [ Rear ]
  POP FRONT  ◄──                                      ──► POP BACK
```

---

### 6. Deque Abstract Data Type (ADT) Interface

| Operation | Description | Target Time | Space |
| :--- | :--- | :---: | :---: |
| **PushFront($x$)** | Prepends element $x$ at the very front of the deque. | $\Theta(1)$ | $O(1)$ |
| **PushBack($x$)** | Appends element $x$ at the rear of the deque. | $\Theta(1)$ | $O(1)$ |
| **PopFront()** | Removes and returns the front-most element. | $\Theta(1)$ | $O(1)$ |
| **PopBack()** | Removes and returns the rear-most element. | $\Theta(1)$ | $O(1)$ |
| **PeekFront()** | Returns the front-most element without deletion. | $\Theta(1)$ | $O(1)$ |
| **PeekBack()** | Returns the rear-most element without deletion. | $\Theta(1)$ | $O(1)$ |
| **IsEmpty()** | Checks whether deque contains zero elements. | $\Theta(1)$ | $O(1)$ |
| **IsFull()** | Checks if bounded array capacity is saturated. | $\Theta(1)$ | $O(1)$ |

---

### 7. Restricted Deque Variations

In many specialized algorithms and hardware architectures, full bidirectional freedom is deliberately constrained to enforce specific behavioral guarantees:

```text
1. INPUT-RESTRICTED DEQUE:
   - Insertions: Permitted at REAR ONLY.
   - Deletions:  Permitted at BOTH Front and Rear.

               DEQUEUE FRONT ◄── [ FRONT ─── REAR ] ──► DEQUEUE REAR
                                              ▲
                                              └── ENQUEUE REAR ONLY

2. OUTPUT-RESTRICTED DEQUE:
   - Deletions:  Permitted at FRONT ONLY.
   - Insertions: Permitted at BOTH Front and Rear.

   ENQUEUE FRONT ──►                                 ◄── ENQUEUE REAR
                     [ FRONT ─────────────── REAR ]
                           │
                           ▼ DEQUEUE FRONT ONLY
```

---

### 8. Implementation Architectures

#### Architecture A: Doubly Linked List with Sentinels
- `headSentinel` and `tailSentinel` provide instantaneous $O(1)$ insertion and deletion at both ends.
- **Advantage**: Dynamically sized; never overflows.
- **Disadvantage**: Memory overhead of 16 bytes of pointers per element; cache-unfriendly.

#### Architecture B: Circular Array Ring Buffer (Industry Standard)
Uses a contiguous array of size $C$ with two sliding indices: `front` and `rear`.
- **PushBack($x$)**: `rear ← (rear + 1) mod capacity`
- **PopFront()**: `front ← (front + 1) mod capacity`
- **PushFront($x$)**: Step backward in the circular ring:
$$\text{front} \leftarrow (\text{front} - 1 + \text{capacity}) \pmod{\text{Capacity}}$$
- **PopBack()**: Step backward in the circular ring:
$$\text{rear} \leftarrow (\text{rear} - 1 + \text{capacity}) \pmod{\text{Capacity}}$$

```text
DATA STRUCTURE CircularArrayDeque
    Fields:
        buffer: Array of ValueType
        front: integer ← 0
        rear: integer ← -1
        capacity: integer
        count: integer ← 0

    OPERATION PushFront(x):
        if count = capacity: error "Deque Overflow"
        front ← (front - 1 + capacity) mod capacity
        buffer[front] ← x
        count ← count + 1
        if count = 1: rear ← front

    OPERATION PushBack(x):
        if count = capacity: error "Deque Overflow"
        rear ← (rear + 1) mod capacity
        buffer[rear] ← x
        count ← count + 1

    OPERATION PopFront():
        if count = 0: error "Deque Underflow"
        val ← buffer[front]
        front ← (front + 1) mod capacity
        count ← count - 1
        return val

    OPERATION PopBack():
        if count = 0: error "Deque Underflow"
        val ← buffer[rear]
        rear ← (rear - 1 + capacity) mod capacity
        count ← count - 1
        return val
```

---

### 9. Classic High-Performance Application: Monotonic Deque for Sliding Window Maximum

### THE PROBLEM:
Given an array $A$ of $n$ numbers and a sliding window of size $k$, find the maximum value in every window as it slides from left to right.
- Brute Force: Scan all $k$ elements in every window $\implies O(n \cdot k)$ time.
- **Monotonic Deque Solution**: Process all elements in strictly **$O(n)$ linear time**!

#### Invariant:
Maintain a Deque storing indices of elements such that their values are in **strictly decreasing monotonic order**. The front of the deque *always* holds the index of the maximum element for the current window!

```text
ALGORITHM SlidingWindowMax(A, n, k)
    dq ← new Deque()  // Stores array indices
    results ← empty list

    for i ← 0 to n - 1:
        // 1. Evict elements that fell outside the sliding window
        if not dq.IsEmpty() and dq.PeekFront() ≤ i - k:
            dq.PopFront()
        
        // 2. Maintain decreasing monotonicity: pop smaller elements from rear
        while not dq.IsEmpty() and A[dq.PeekBack()] ≤ A[i]:
            dq.PopBack()
        
        // 3. Add current element's index
        dq.PushBack(i)
        
        // 4. Record current window maximum (once first window is full)
        if i ≥ k - 1:
            results.Append(A[dq.PeekFront()])
    
    return results
```

---
---

# TOPIC 31: PRIORITY QUEUE FUNDAMENTALS

### 1. Topic Title
**Priority Queue (Key-Prioritized Abstract Data Type Foundations)**

### 2. Category
Prioritized Abstract Containers — Element-Ranking Data Structures.

### 3. Difficulty
Intermediate.

### 4. Prerequisites
- Topic 28: Standard FIFO Queue.
- Part 01: Foundations (Order Relations, Comparisons).

---

### 5. Definition & Intuitive Mental Model

### Concept
A **Priority Queue** is an Abstract Data Type (ADT) similar to a regular queue or stack, but where each stored element has an associated numerical or comparable **Priority Key**. 
- In a standard queue, departure is strictly determined by arrival time (**FIFO**).
- In a Priority Queue, departure is strictly determined by **highest (or lowest) priority**, regardless of when the element was inserted!

### Intuition: The Hospital Emergency Room (Triage)
In an ER:
- A patient with a minor cough who arrives at 8:00 AM does NOT get treated before a patient with a severe cardiac arrest who arrives at 8:15 AM!
- Patients are treated in order of clinical severity (Priority), not arrival sequence.

---

### 6. Types of Priority Queues

1. **Max-Priority Queue**:
   - The element with the **maximum numerical value** is dequeued first (`ExtractMax`).
   - Used in: Job scheduling where highest-importance tasks run first.
2. **Min-Priority Queue**:
   - The element with the **minimum numerical value** is dequeued first (`ExtractMin`).
   - Used in: **Dijkstra’s Shortest Path Algorithm** (closest node processed first), **Prim’s Minimum Spanning Tree**, and Event-Driven Simulation.

---

### 7. Priority Queue ADT Interface

| Operation | Description | Target Optimal Time (Heap) |
| :--- | :--- | :---: |
| **Insert($x, p$)** | Inserts element $x$ with priority $p$. | $O(\log n)$ |
| **ExtractMin() / ExtractMax()** | Removes and returns the element with highest priority. | $O(\log n)$ |
| **Peek()** | Returns highest priority element without removing it. | $O(1)$ |
| **ChangePriority($x, p'$)** | Dynamically updates priority of an existing item. | $O(\log n)$ |
| **IsEmpty()** | Checks whether queue is empty. | $O(1)$ |

---

### 8. Architectural Comparison of Underlying Implementations

A Priority Queue is an **Abstract Data Type (Interface)**, NOT a concrete storage layout. It can be implemented using multiple underlying data structures:

| Underlying Data Structure | `Insert` Time | `FindMax / Peek` Time | `ExtractMax` Time | Practical Assessment |
| :--- | :---: | :---: | :---: | :--- |
| **Unsorted Array** | $\Theta(1)$ (append) | $\Theta(n)$ (linear scan) | $\Theta(n)$ (scan + shift) | Horrible for large $n$ extraction |
| **Sorted Array** | $\Theta(n)$ (insertion shift) | $\Theta(1)$ (read last item) | $\Theta(1)$ (decrement size) | Horrible for frequent insertions |
| **Unsorted Linked List** | $\Theta(1)$ (insert at head) | $\Theta(n)$ (traverse list) | $\Theta(n)$ (delete max node) | High pointer overhead, slow extract |
| **Sorted Linked List** | $\Theta(n)$ (find insertion point) | $\Theta(1)$ (head node) | $\Theta(1)$ (delete head) | No binary search possible |
| **Binary Search Tree (Balanced)** | $\Theta(\log n)$ | $\Theta(\log n)$ (or $\Theta(1)$ cached) | $\Theta(\log n)$ | Good, but high pointer overhead |
| **Binary Heap (Complete Binary Tree)** | **$O(\log n)$** (Amortized $O(1)$) | **$\Theta(1)$** (root slot 0) | **$O(\log n)$** | **THE GOLD STANDARD!** Contiguous array, zero pointer overhead, optimal cache locality. |

*(Note: The full structural mechanics, sift-up/sift-down heapify algorithms, and mathematical proofs for Binary Heaps are covered in depth in Part 06: Module 07).*

---

### 9. Real-World Production Applications

1. **Operating System Process Scheduling**:
   - The Linux Completely Fair Scheduler (CFS) and priority schedulers pick the next thread with the lowest virtual runtime (`vruntime`).
2. **Bandwidth & Network Traffic Shaping**:
   - Routers classify IP packets into Quality-of-Service (QoS) queues; VoIP audio packets preempt large FTP file transfers.
3. **Lossless Data Compression (Huffman Coding)**:
   - Repeatedly extracts the two lowest-frequency character nodes from a Min-Priority Queue to build the optimal prefix code tree.

---

## Module 08 Summary & Key Takeaways

1. **Deques** support insertion and deletion at both `Front` and `Rear` in $O(1)$ time, subsuming both Stacks and Queues.
2. **Circular Array Deques** utilize modulo wrap-around `(index - 1 + capacity) % capacity` to move backward without shifting.
3. The **Monotonic Deque** pattern solves the Sliding Window Maximum problem in optimal linear $O(n)$ time.
4. A **Priority Queue** is an ADT where departure order is governed by priority keys rather than arrival sequence; the **Binary Heap** is its most efficient general-purpose implementation.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 10: Elementary Data Structures. MIT Press.
2. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.3: Bags, Queues, and Stacks. Addison-Wesley.
3. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.2: Linear Lists. Addison-Wesley.
