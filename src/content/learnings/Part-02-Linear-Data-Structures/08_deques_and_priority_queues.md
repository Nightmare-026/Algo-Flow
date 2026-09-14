# Part 02: Linear Data Structures — Module 08: Deques & Priority Queues

> **Topics Covered:**  
> 33. Double-Ended Queue (Deque) ADT & Core Operations &bull; Input-Restricted vs Output-Restricted Deques &bull; Circular Array Deque Modulo Mathematics &bull; The Sliding Window Maximum Monotonic Deque Pattern &bull; 34. Priority Queue ADT Fundamentals & Underlying Data Structure Trade-offs

---

Linear data structures culminate in two powerful generalized container models: Double-Ended Queues (Deques) and Priority Queues. While a Deque generalizes sequence boundaries by enabling constant-time insertions and removals at both the front and rear, a Priority Queue breaks away from chronological arrival ordering entirely, servicing elements based on an intrinsic priority key. This chapter formalizes bidirectional ring buffer mathematics, monotonic deque algorithms for optimal $O(n)$ sliding window queries, the Priority Queue abstract contract, and comparative trade-offs across contiguous, linked, and tree-backed implementations.

### Learning Objectives
- Formalize the Double-Ended Queue (Deque) ADT contract and demonstrate how it subsumes both LIFO stacks and FIFO queues.
- Implement circular array deques using bidirectional modular arithmetic to step backward and forward in physical RAM without shifting.
- Formulate the decreasing monotonic deque invariant and prove how it solves the Sliding Window Maximum problem in optimal $\Theta(n)$ time.
- Define the Priority Queue ADT interface and compare the asymptotic bounds of arrays, linked lists, balanced binary search trees, and binary heaps.
- Trace real-world deployments in operating system scheduling (Linux CFS), network traffic QoS packet prioritization, and Huffman tree construction.

---

## Topic 33: Double-Ended Queue (Deque)

### 1. Conceptual Architecture & Dual-Boundary Access

A **Double-Ended Queue (Deque)**, pronounced *"deck"*, is a generalized linear container that permits element insertion and deletion with equal efficiency at **both ends**: the **Front** and the **Rear**.

Because access is permitted at both boundaries, the Deque serves as a universal linear primitive:
- Restricting mutations to `PushFront` and `PopFront` forms a **LIFO Stack**.
- Restricting mutations to `PushBack` and `PopFront` forms a **FIFO Queue**.

```
+---------------------------------------------------------------------------------+
|                           DOUBLE-ENDED QUEUE (DEQUE)                            |
|                                                                                 |
|   PUSH FRONT ------->                                   <------- PUSH BACK      |
|                       [ Front Node ] <=====> [ Rear Node ]                      |
|   POP FRONT <--------                                   -------> POP BACK       |
+---------------------------------------------------------------------------------+
```

---

### 2. The Deque Abstract Data Type (ADT) Interface

| Operation | Description | Target Time | Auxiliary Space | Boundary Condition / Check |
| :--- | :--- | :---: | :---: | :--- |
| **`PushFront(x)`** | Prepends element $x$ at the `Front` | $\Theta(1)$ | $O(1)$ | Fails if bounded capacity is saturated |
| **`PushBack(x)`** | Appends element $x$ at the `Rear` | $\Theta(1)$ | $O(1)$ | Fails if bounded capacity is saturated |
| **`PopFront()`** | Removes and returns element at `Front` | $\Theta(1)$ | $O(1)$ | Fails with Underflow if deque is empty |
| **`PopBack()`** | Removes and returns element at `Rear` | $\Theta(1)$ | $O(1)$ | Fails with Underflow if deque is empty |
| **`PeekFront()`** | Inspects front-most element without removal | $\Theta(1)$ | $O(1)$ | Requires non-empty deque |
| **`PeekBack()`** | Inspects rear-most element without removal | $\Theta(1)$ | $O(1)$ | Requires non-empty deque |
| **`IsEmpty()`** | Returns `true` if size is 0 | $\Theta(1)$ | $O(1)$ | Verified via `count == 0` |
| **`IsFull()`** | Returns `true` if count equals capacity | $\Theta(1)$ | $O(1)$ | Verified via `count == capacity` |

---

### 3. Restricted Deque Variations

| Variant | Insertion Endpoints | Deletion Endpoints | Architectural Rationale & Use Cases |
| :--- | :---: | :---: | :--- |
| **Input-Restricted Deque** | **Rear Only** | **Both Front and Rear** | Allows normal FIFO enqueuing while permitting work-stealing schedulers to pop from either the front or the back |
| **Output-Restricted Deque** | **Both Front and Rear** | **Front Only** | Allows high-priority jobs to bypass normal arrivals while strictly enforcing single-point consumer dispatch |

---

### 4. Implementation: Circular Array Ring Buffer

To achieve $O(1)$ time across all four boundary operations without dynamic node allocations or memory shifting, an implementation wraps a contiguous array using modular arithmetic in both directions:

#### Advancing Forward:
$$\text{nextIndex} = (\text{currentIndex} + 1) \pmod{\text{Capacity}}$$

#### Stepping Backward:
Adding `Capacity` before modulo ensures the intermediate value remains strictly non-negative in languages where the `%` operator handles negative numbers via truncated division:
$$\text{prevIndex} = (\text{currentIndex} - 1 + \text{Capacity}) \pmod{\text{Capacity}}$$

```text
CLASS CircularArrayDeque:
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

    FUNCTION PushFront(x: ValueType) -> Void:
        if this.IsFull():
            raise OverflowException("Deque is full")
        this.front <- (this.front - 1 + this.capacity) mod this.capacity
        this.buffer[this.front] <- x
        this.count <- this.count + 1
        if this.count == 1:
            this.rear <- this.front

    FUNCTION PushBack(x: ValueType) -> Void:
        if this.IsFull():
            raise OverflowException("Deque is full")
        this.rear <- (this.rear + 1) mod this.capacity
        this.buffer[this.rear] <- x
        this.count <- this.count + 1

    FUNCTION PopFront() -> ValueType:
        if this.IsEmpty():
            raise UnderflowException("Deque is empty")
        val <- this.buffer[this.front]
        this.front <- (this.front + 1) mod this.capacity
        this.count <- this.count - 1
        return val

    FUNCTION PopBack() -> ValueType:
        if this.IsEmpty():
            raise UnderflowException("Deque is empty")
        val <- this.buffer[this.rear]
        this.rear <- (this.rear - 1 + this.capacity) mod this.capacity
        this.count <- this.count - 1
        return val
```

---

### 5. Algorithmic Mastery: Sliding Window Maximum via Monotonic Deque

#### The Problem:
Given an array $A$ of $n$ numbers and a sliding window of size $k$, find the maximum value in every window as it slides from left to right.
- **Brute Force**: Inspecting all $k$ elements per window requires $O((n - k + 1) \cdot k) = O(n \cdot k)$ time.
- **Monotonic Deque Solution**: Achieves optimal **$\Theta(n)$ linear time** by inspecting each element at most twice!

#### The Monotonic Invariant:
Store array **indices** in the deque such that the corresponding array values are maintained in **strictly decreasing order**:
$$A[\text{deque}[0]] > A[\text{deque}[1]] > \dots > A[\text{deque}[m-1]]$$

1. **Evict Expired Indices**: Pop from `Front` if the stored index falls outside the current window boundary ($\le i - k$).
2. **Preserve Monotonicity**: Before inserting index $i$, pop from `Rear` as long as $A[\text{deque.PeekBack()}] \le A[i]$. (A smaller element that appears earlier than $A[i]$ can never be the maximum in any subsequent window!).
3. **Record Window Maximum**: Once the first window is primed ($i \ge k - 1$), the front of the deque **always** references the maximum element!

```text
FUNCTION SlidingWindowMax(A: Array of Number, n: Integer, k: Integer) -> List of Number:
    dq <- new CircularArrayDeque(n)
    result <- empty List

    for i from 0 to n - 1:
        // 1. Evict expired index
        if not dq.IsEmpty() and dq.PeekFront() <= i - k:
            dq.PopFront()

        // 2. Discard smaller elements from rear
        while not dq.IsEmpty() and A[dq.PeekBack()] <= A[i]:
            dq.PopBack()

        // 3. Insert current index
        dq.PushBack(i)

        // 4. Record maximum
        if i >= k - 1:
            result.Append(A[dq.PeekFront()])

    return result
```

#### Step-by-Step Trace: $A = [1, 3, -1, -3, 5, 3, 6, 7]$, Window $k = 3$

| Index $i$ | Value $A[i]$ | Expired Eviction | Rear Pops (Monotonicity) | Deque Indices (Values) | Output Window Maximum |
| :---: | :---: | :---: | :--- | :--- | :---: |
| **0** | `1` | — | None | `[0]` (`[1]`) | — |
| **1** | `3` | — | Pop index 0 ($1 \le 3$) | `[1]` (`[3]`) | — |
| **2** | `-1` | — | None | `[1, 2]` (`[3, -1]`) | **`3`** |
| **3** | `-3` | None | None | `[1, 2, 3]` (`[3, -1, -3]`) | **`3`** |
| **4** | `5` | Evict index 1 ($1 \le 4-3$) | Pop index 3, index 2 | `[4]` (`[5]`) | **`5`** |
| **5** | `3` | None | None | `[4, 5]` (`[5, 3]`) | **`5`** |
| **6** | `6` | None | Pop index 5, index 4 | `[6]` (`[6]`) | **`6`** |
| **7** | `7` | None | Pop index 6 ($6 \le 7$) | `[7]` (`[7]`) | **`7`** |

**Final Window Maximums**: `[3, 3, 5, 5, 6, 7]`.  
**Total Steps**: Every index enters the deque once and leaves at most once $\implies$ exactly $2n$ operations $\implies \Theta(n)$ time!

---

## Topic 34: Priority Queue Fundamentals & Trade-offs

### 1. The Priority Queue Abstract Data Type (ADT)

A **Priority Queue** is an Abstract Data Type where element servicing is governed not by chronological arrival order, but by an associated **Priority Key**:
- **Max-Priority Queue**: The element with the highest key is extracted first (`ExtractMax`).
- **Min-Priority Queue**: The element with the lowest key is extracted first (`ExtractMin`).

```
Hospital Triage Mental Model:
Incoming Patients:
- Patient A (Arrival 8:00 AM, Mild Flu -> Priority 2)
- Patient B (Arrival 8:15 AM, Acute Trauma -> Priority 10)

Next Serviced: Patient B (Priority 10), superseding Patient A regardless of arrival time!
```

---

### 2. Architectural Comparison of Underlying Implementations

A Priority Queue is an interface contract, not a concrete layout. It can be instantiated across multiple data structures with distinct performance trade-offs:

| Underlying Storage Architecture | `Insert(x, p)` | `Peek()` | `Extract()` | Memory Overhead | Practical Systems Evaluation |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Unsorted Array** | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $0\text{ bytes}$ | Fast insert, unacceptably slow extract |
| **Sorted Array** | $\Theta(n)$ | $\Theta(1)$ | $\Theta(1)$ | $0\text{ bytes}$ | Expensive insertion shift cascade |
| **Unsorted Linked List** | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $8\text{ bytes / node}$ | Poor cache locality, slow scan |
| **Sorted Linked List** | $\Theta(n)$ | $\Theta(1)$ | $\Theta(1)$ | $8\text{ bytes / node}$ | Linear traversal to find insertion point |
| **Balanced BST (AVL / Red-Black)**| $\Theta(\log n)$ | $\Theta(1)^*$ | $\Theta(\log n)$ | $24\text{ bytes / node}$ | High pointer and rebalancing overhead |
| **Binary Heap (Complete Tree in Array)**| **$O(\log n)$** | **$\Theta(1)$** | **$O(\log n)$** | **$0\text{ bytes}$** | **The Gold Standard**: Zero pointer overhead, contiguous array storage, maximum L1 cache efficiency |

---

### 3. Systems Applications

1. **Operating System Process Scheduling**:
   - The Linux kernel Completely Fair Scheduler (CFS) utilizes a priority queue to select the next runnable thread with the lowest accumulated virtual runtime (`vruntime`).
2. **Network Quality of Service (QoS) Queuing**:
   - Enterprise network routers prioritize latency-critical voice-over-IP (VoIP) and video streaming packets over bulk file transfers (FTP/HTTP downloads) using multi-level priority queues.
3. **Lossless Data Compression (Huffman Coding)**:
   - Huffman's greedy compression algorithm repeatedly extracts the two lowest-frequency character nodes from a Min-Priority Queue to build an optimal prefix code tree.
4. **Graph Algorithms**:
   - **Dijkstra's Single-Source Shortest Path** and **Prim's Minimum Spanning Tree** require a Min-Priority Queue to iteratively extract the nearest frontier vertex in $O(E \log V)$ time.

---

### 4. Key Takeaways

1. **Deque Generalization**: Deques support bidirectional $O(1)$ operations at both `Front` and `Rear`, seamlessly subsuming both stacks and queues.
2. **Bidirectional Modulo**: Stepping backward in a circular array deque requires `(idx - 1 + capacity) % capacity` to prevent negative dividend truncation.
3. **Monotonic Deques**: Enforcing a strictly decreasing invariant across stored indices eliminates dominated candidates, solving the Sliding Window Maximum problem in optimal $\Theta(n)$ time.
4. **Priority Queue ADT**: Governed by priority rankings rather than arrival time; the **Binary Heap** is the canonical backing implementation due to $O(\log n)$ extraction and zero pointer overhead.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 6: *Heapsort*, Chapter 10: *Elementary Data Structures*. MIT Press.
2. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.2: *Linear Lists*. Addison-Wesley.
3. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 2.4: *Priority Queues*. Addison-Wesley.
4. **Huffman, D. A.** (1952). *A Method for the Construction of Minimum-Redundancy Codes*. Proceedings of the IRE, 40(9), 1098-1101.
