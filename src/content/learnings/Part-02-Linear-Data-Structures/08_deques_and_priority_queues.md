# Part 02: Linear Data Structures — Module 08: Deques & Priority Queues

> **Topics Covered:**  
> 33. Double-Ended Queue (Deque) ADT & Core Operations &bull; Input-Restricted vs Output-Restricted Deques &bull; Circular Array Deque Modulo Mathematics &bull; The Sliding Window Maximum Monotonic Deque Pattern (Potential Method Proof) &bull; 34. Priority Queue ADT Fundamentals & Underlying Data Structure Trade-offs &bull; Production Implementations

---

Linear data structures culminate in two powerful generalized container models: Double-Ended Queues (Deques) and Priority Queues. While a Deque generalizes sequence boundaries by enabling constant-time insertions and removals at both the front and rear, a Priority Queue breaks away from chronological arrival ordering entirely, servicing elements based on an intrinsic priority key. This chapter formalizes bidirectional ring buffer mathematics, monotonic deque algorithms for optimal $O(n)$ sliding window queries, the Priority Queue abstract contract, and comparative trade-offs across contiguous, linked, and tree-backed implementations.

### Learning Objectives

- Formalize the Double-Ended Queue (Deque) ADT contract and demonstrate how it subsumes both LIFO stacks and FIFO queues.
- Implement circular array deques using bidirectional modular arithmetic to step backward and forward in physical RAM without shifting.
- Formulate the decreasing monotonic deque invariant and prove how it solves the Sliding Window Maximum problem in optimal $\Theta(n)$ time using the Physicist's Potential Method.
- Define the Priority Queue ADT interface and compare the asymptotic bounds of arrays, linked lists, balanced binary search trees, and binary heaps.
- Trace real-world deployments in operating system scheduling (Linux CFS), network traffic QoS packet prioritization, and Huffman tree construction.

---

## Topic 33: Double-Ended Queue (Deque)

### 1. Conceptual Architecture & Dual-Boundary Access

A **Double-Ended Queue (Deque)**, pronounced _"deck"_, is a generalized linear container that permits element insertion and deletion with equal efficiency at **both ends**: the **Front** and the **Rear**.

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

| Operation          | Description                                 | Target Time | Auxiliary Space | Boundary Condition / Check             |
| :----------------- | :------------------------------------------ | :---------: | :-------------: | :------------------------------------- |
| **`PushFront(x)`** | Prepends element $x$ at the `Front`         | $\Theta(1)$ |     $O(1)$      | Fails if bounded capacity is saturated |
| **`PushBack(x)`**  | Appends element $x$ at the `Rear`           | $\Theta(1)$ |     $O(1)$      | Fails if bounded capacity is saturated |
| **`PopFront()`**   | Removes and returns element at `Front`      | $\Theta(1)$ |     $O(1)$      | Fails with Underflow if deque is empty |
| **`PopBack()`**    | Removes and returns element at `Rear`       | $\Theta(1)$ |     $O(1)$      | Fails with Underflow if deque is empty |
| **`PeekFront()`**  | Inspects front-most element without removal | $\Theta(1)$ |     $O(1)$      | Requires non-empty deque               |
| **`PeekBack()`**   | Inspects rear-most element without removal  | $\Theta(1)$ |     $O(1)$      | Requires non-empty deque               |
| **`IsEmpty()`**    | Returns `true` if size is 0                 | $\Theta(1)$ |     $O(1)$      | Verified via `count == 0`              |
| **`IsFull()`**     | Returns `true` if count equals capacity     | $\Theta(1)$ |     $O(1)$      | Verified via `count == capacity`       |

---

### 3. Bidirectional Modular Arithmetic in Circular Deques

To achieve $O(1)$ time across all four boundary operations without dynamic node allocations or memory shifting, an implementation wraps a contiguous array using modular arithmetic in both directions:

#### Advancing Forward (`PushBack`, `PopFront`):

$$\text{nextIndex} = (\text{currentIndex} + 1) \pmod{\text{Capacity}}$$

#### Stepping Backward (`PushFront`, `PopBack`):

Adding `Capacity` before modulo ensures the intermediate value remains strictly non-negative in languages where `%` calculates truncated remainder rather than Euclidean modulo:
$$\text{prevIndex} = (\text{currentIndex} - 1 + \text{Capacity}) \pmod{\text{Capacity}}$$

---

### 4. Algorithmic Mastery: Sliding Window Maximum via Monotonic Deque

#### The Problem:

Given an array $A$ of $n$ numbers and a sliding window of size $k$, find the maximum value in every window as it slides from left to right.

- **Brute Force**: Inspecting all $k$ elements per window requires $O((n - k + 1) \cdot k) = O(n \cdot k)$ time.
- **Monotonic Deque Solution**: Achieves optimal **$\Theta(n)$ linear time** by maintaining a strictly decreasing invariant!

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Algorithm Topology: Monotonic Deque Sliding Window Maximum Elimination
  </div>
  <svg viewBox="0 0 850 360" class="w-full h-auto text-xs" style="max-height: 360px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="mdArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="320" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Array Stream at Top -->
    <g transform="translate(50, 45)">
      <text x="375" y="15" font-weight="700" fill="currentColor" text-anchor="middle" font-size="12">Array A: Sliding Window (k = 3) at Index i = 4 (Value = 5)</text>
      <!-- Slots 0..7 -->
      <g transform="translate(30, 25)">
        <rect x="0" y="0" width="50" height="40" rx="4" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="25" y="24" text-anchor="middle" font-family="monospace">1</text>
        <text x="25" y="-6" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">i=0</text>
        <rect x="55" y="0" width="50" height="40" rx="4" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444" stroke-width="1.5"/>
        <text x="80" y="24" text-anchor="middle" font-family="monospace" fill="#ef4444">3</text>
        <text x="80" y="-6" text-anchor="middle" font-size="9" fill="#ef4444" font-weight="700">i=1 (Expiring)</text>
        <!-- Window Box [i=2..4] -->
        <rect x="105" y="-5" width="165" height="50" rx="6" fill="#3b82f6" fill-opacity="0.1" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4,4"/>
        <rect x="110" y="0" width="50" height="40" rx="4" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6"/>
        <text x="135" y="24" text-anchor="middle" font-family="monospace" font-weight="700">-1</text>
        <text x="135" y="-6" text-anchor="middle" font-size="9">i=2</text>
        <rect x="165" y="0" width="50" height="40" rx="4" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6"/>
        <text x="190" y="24" text-anchor="middle" font-family="monospace" font-weight="700">-3</text>
        <text x="190" y="-6" text-anchor="middle" font-size="9">i=3</text>
        <rect x="220" y="0" width="50" height="40" rx="4" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="2"/>
        <text x="245" y="24" text-anchor="middle" font-family="monospace" font-weight="700" fill="#10b981">5</text>
        <text x="245" y="-6" text-anchor="middle" font-size="9" fill="#10b981" font-weight="700">i=4 (New)</text>
        <rect x="275" y="0" width="50" height="40" rx="4" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="300" y="24" text-anchor="middle" font-family="monospace">3</text>
        <text x="300" y="-6" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">i=5</text>
        <rect x="330" y="0" width="50" height="40" rx="4" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="355" y="24" text-anchor="middle" font-family="monospace">6</text>
        <text x="355" y="-6" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">i=6</text>
      </g>
    </g>
    <!-- Monotonic Deque State in Middle -->
    <g transform="translate(100, 150)">
      <rect x="0" y="0" width="650" height="150" rx="10" fill="currentColor" fill-opacity="0.03" stroke="currentColor" stroke-opacity="0.15"/>
      <text x="20" y="25" font-weight="700" fill="currentColor" font-size="12">Monotonic Deque (Stores Indices, Values Strictly Decreasing: A[dq[0]] &gt; A[dq[1]] &gt; ...)</text>
      <!-- Action 1: Expire Out of Window -->
      <g transform="translate(30, 45)">
        <rect x="0" y="0" width="130" height="70" rx="6" fill="#ef4444" fill-opacity="0.12" stroke="#ef4444" stroke-width="1.5"/>
        <text x="65" y="22" font-weight="700" fill="#ef4444" text-anchor="middle" font-size="11">1. Pop Front</text>
        <text x="65" y="40" fill="currentColor" fill-opacity="0.8" text-anchor="middle" font-size="10">Expired Index:</text>
        <text x="65" y="56" font-family="monospace" fill="#ef4444" text-anchor="middle" font-weight="700">idx 1 &le; 4 - 3</text>
      </g>
      <!-- Action 2: Purge Dominated Elements -->
      <g transform="translate(200, 45)">
        <rect x="0" y="0" width="180" height="70" rx="6" fill="#f59e0b" fill-opacity="0.12" stroke="#f59e0b" stroke-width="1.5"/>
        <text x="90" y="22" font-weight="700" fill="#f59e0b" text-anchor="middle" font-size="11">2. Pop Back (Dominated)</text>
        <text x="90" y="40" fill="currentColor" fill-opacity="0.8" text-anchor="middle" font-size="10">Eject smaller rear items:</text>
        <text x="90" y="56" font-family="monospace" fill="#f59e0b" text-anchor="middle" font-weight="700">A[3]=-3 &le; 5, A[2]=-1 &le; 5</text>
      </g>
      <!-- Action 3: Push Incoming Element -->
      <g transform="translate(420, 45)">
        <rect x="0" y="0" width="190" height="70" rx="6" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="2"/>
        <text x="95" y="22" font-weight="700" fill="#10b981" text-anchor="middle" font-size="11">3. Push Back &amp; Read Max</text>
        <text x="95" y="40" fill="currentColor" fill-opacity="0.8" text-anchor="middle" font-size="10">Push index 4 (val=5)</text>
        <text x="95" y="58" font-family="monospace" fill="#10b981" text-anchor="middle" font-weight="700">Window Max = A[front] = 5</text>
      </g>
    </g>
  </svg>
</div>

#### Formal Amortized Analysis via the Physicist's Potential Method:

Define the potential function $\Phi$ at step $i$ as the number of elements currently stored in the deque:
$$\Phi_i = |\text{Deque}_i|$$
Notice that $\Phi_0 = 0$ (initially empty) and $\Phi_i \ge 0$ for all $0 \le i \le n$.

- For each index $i \in [0, n-1]$:
  1. Let $d_i$ be the number of elements popped from the back (dominated elements) plus elements popped from the front (expired elements).
  2. The actual work performed is $c_i = 1 + d_i$ (one push plus $d_i$ pops).
  3. The change in potential is:
     $$\Delta \Phi_i = \Phi_i - \Phi_{i-1} = 1 - d_i$$
  4. The amortized cost per element is:
     $$\hat{c}_i = c_i + \Delta \Phi_i = (1 + d_i) + (1 - d_i) = 2 = \Theta(1)$$

Across the entire array of length $n$, total operations $\sum_{i=1}^n c_i \le 2n \implies$ **Strictly $\Theta(n)$ linear time**. $\blacksquare$

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

| Underlying Storage Architecture          |  `Insert(x, p)`  |    `Peek()`     |   `Extract()`    |     Memory Overhead      | Practical Systems Evaluation                                                                        |
| :--------------------------------------- | :--------------: | :-------------: | :--------------: | :----------------------: | :-------------------------------------------------------------------------------------------------- |
| **Unsorted Array**                       |   $\Theta(1)$    |   $\Theta(n)$   |   $\Theta(n)$    |     $0\text{ bytes}$     | Fast insert, unacceptably slow extract                                                              |
| **Sorted Array**                         |   $\Theta(n)$    |   $\Theta(1)$   |   $\Theta(1)$    |     $0\text{ bytes}$     | Expensive insertion shift cascade                                                                   |
| **Unsorted Linked List**                 |   $\Theta(1)$    |   $\Theta(n)$   |   $\Theta(n)$    | $8\text{ bytes / node}$  | Poor cache locality, slow scan                                                                      |
| **Sorted Linked List**                   |   $\Theta(n)$    |   $\Theta(1)$   |   $\Theta(1)$    | $8\text{ bytes / node}$  | Linear traversal to find insertion point                                                            |
| **Balanced BST (AVL / Red-Black)**       | $\Theta(\log n)$ |  $\Theta(1)^*$  | $\Theta(\log n)$ | $24\text{ bytes / node}$ | High pointer and rebalancing overhead                                                               |
| **Binary Heap (Complete Tree in Array)** | **$O(\log n)$**  | **$\Theta(1)$** | **$O(\log n)$**  |   **$0\text{ bytes}$**   | **The Gold Standard**: Zero pointer overhead, contiguous array storage, maximum L1 cache efficiency |

---

### 3. Production Multi-Language Implementations

#### A. C++20 Optimal Sliding Window Maximum Monotonic Deque

```cpp
#include <vector>
#include <deque>
#include <span>

std::vector<int> maxSlidingWindow(std::span<const int> nums, int k) {
    if (nums.empty() || k <= 0) return {};

    std::deque<int> dq; // Stores indices of candidate maximums
    std::vector<int> result;
    result.reserve(nums.size() - k + 1);

    for (int i = 0; i < static_cast<int>(nums.size()); ++i) {
        // 1. Evict expired index outside current window [i - k + 1, i]
        if (!dq.empty() && dq.front() <= i - k) {
            dq.pop_front();
        }

        // 2. Preserve strictly decreasing monotonic invariant
        while (!dq.empty() && nums[dq.back()] <= nums[i]) {
            dq.pop_back();
        }

        // 3. Insert current element's index
        dq.push_back(i);

        // 4. Record maximum once the first window is primed
        if (i >= k - 1) {
            result.push_back(nums[dq.front()]);
        }
    }

    return result;
}
```

#### B. Python 3 Monotonic Deque with Type Annotations

```python
from collections import deque
from typing import List

def max_sliding_window(nums: List[int], k: int) -> List[int]:
    """Finds maximum in each sliding window of size k in O(n) linear time."""
    if not nums or k <= 0:
        return []

    dq: deque[int] = deque()  # Stores indices
    result: List[int] = []

    for i, num in enumerate(nums):
        # 1. Evict expired index
        if dq and dq[0] <= i - k:
            dq.popleft()

        # 2. Maintain decreasing monotonic invariant
        while dq and nums[dq[-1]] <= num:
            dq.pop()

        # 3. Add current index
        dq.append(i)

        # 4. First window completes at index k - 1
        if i >= k - 1:
            result.append(nums[dq[0]])

    return result
```

---

### 4. Key Takeaways

1. **Deque Generalization**: Deques support bidirectional $O(1)$ operations at both `Front` and `Rear`, seamlessly subsuming both stacks and queues.
2. **Bidirectional Modulo**: Stepping backward in a circular array deque requires `(idx - 1 + capacity) % capacity` to prevent negative dividend truncation.
3. **Monotonic Deques**: Enforcing a strictly decreasing invariant across stored indices eliminates dominated candidates, solving the Sliding Window Maximum problem in optimal $\Theta(n)$ time.
4. **Priority Queue ADT**: Governed by priority rankings rather than arrival time; the **Binary Heap** is the canonical backing implementation due to $O(\log n)$ extraction and zero pointer overhead.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). _Introduction to Algorithms_ (4th ed.), Chapter 6: _Heapsort_, Chapter 10: _Elementary Data Structures_. MIT Press.
2. **Knuth, D. E.** (1997). _The Art of Computer Programming, Volume 1: Fundamental Algorithms_ (3rd ed.), Section 2.2: _Linear Lists_. Addison-Wesley.
3. **Sedgewick, R., & Wayne, K.** (2011). _Algorithms_ (4th ed.), Section 2.4: _Priority Queues_. Addison-Wesley.
4. **Huffman, D. A.** (1952). _A Method for the Construction of Minimum-Redundancy Codes_. Proceedings of the IRE, 40(9), 1098-1101.
