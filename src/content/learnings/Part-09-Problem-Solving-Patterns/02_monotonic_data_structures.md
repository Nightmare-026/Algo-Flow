# Part 09: Problem-Solving Patterns — Module 02: Monotonic Data Structures

> **Topics Covered:**  
> 139. Monotonic Stack (Next Greater/Smaller Element & Largest Rectangle in Histogram) &bull; 140. Monotonic Queue (Sliding Window Maximum via Deque in $O(n)$)

---

# TOPIC 139: MONOTONIC STACK PATTERN

### 1. Definition & Core Invariant
A **Monotonic Stack** is a standard stack with an added structural invariant: its elements are **strictly ordered (monotonically increasing or decreasing)** from bottom to top.
- **Monotonically Increasing Stack**: Smallest at bottom, largest at top.
- **Monotonically Decreasing Stack**: Largest at bottom, smallest at top.

Whenever an incoming element $x$ would violate the monotonicity property, elements are repeatedly popped off the stack until the invariant is restored, and then $x$ is pushed.

---

### 2. The Next Greater Element (NGE) Problem
Given array $A = [2, 1, 2, 4, 3]$, find the first element to the right that is strictly greater than each element.
- **Brute Force**: Two nested loops $\implies O(n^2)$.
- **Monotonic Stack**: Single pass from right to left $\implies \mathbf{O(n)}$ linear time!

```text
ALGORITHM NextGreaterElement(A, n)
    Input: Array A of n elements
    Output: Array nge where nge[i] is next greater element, or -1

1.  allocate nge[0...n - 1]
2.  stack ← empty Stack
3.  // Iterate from right to left
4.  for i ← n - 1 down to 0:
5.      // Pop elements smaller than or equal to current element
6.      while not stack.IsEmpty() and stack.Peek() ≤ A[i]:
7.          stack.Pop()
8.      if stack.IsEmpty():
9.          nge[i] ← -1
10.     else:
11.         nge[i] ← stack.Peek()
12.     stack.Push(A[i])
13. return nge
```

---

### 3. Step-by-Step Dry Run: NGE on $A = [2, 1, 2, 4, 3]$

| Index $i$ | Element $A[i]$ | Stack State (Bottom $\to$ Top) Before Action | Action & Pops | `nge[i]` Assigned | Stack State After Push |
| :---: | :---: | :---: | :---: | :---: | :---: |
| 4 | 3 | `[]` | Stack empty | `-1` | `[3]` |
| 3 | 4 | `[3]` | $3 \le 4 \implies$ Pop 3 | `-1` | `[4]` |
| 2 | 2 | `[4]` | $4 > 2 \implies$ Keep 4 | `4` | `[4, 2]` |
| 1 | 1 | `[4, 2]` | $2 > 1 \implies$ Keep 2 | `2` | `[4, 2, 1]` |
| 0 | 2 | `[4, 2, 1]` | $1 \le 2 \implies$ Pop 1, $2 \le 2 \implies$ Pop 2 | `4` | `[4, 2]` |

**Final Result**: `nge = [4, 2, 4, -1, -1]`.

---

### 4. Amortized $O(n)$ Runtime Proof
Even though there is a `while` loop inside the `for` loop, **every element in the array is pushed onto the stack exactly once, and popped from the stack at most once**.
$$\text{Total Stack Operations across entire execution} \le 2n \implies \mathbf{\Theta(n)} \text{ time!}$$

---

### 5. Signature Master Problem: Largest Rectangle in Histogram

Given bar heights $H = [2, 1, 5, 6, 2, 3]$, find the area of the largest rectangle.  
A monotonic stack finds the **Previous Smaller Element (PSE)** and **Next Smaller Element (NSE)** for each bar in $O(n)$ time:
$$\text{Width} = \text{NSE}[i] - \text{PSE}[i] - 1$$
$$\text{Area}[i] = H[i] \times \text{Width}$$
$$\text{Max Area} = \max_{i} (\text{Area}[i]) = \mathbf{10} \quad (\text{bars of height 5 and 6 with width 2})!$$

---
---

# TOPIC 140: MONOTONIC QUEUE PATTERN

### 1. Definition & Problem Context: Sliding Window Maximum
Given an array $A$ of size $n$ and a window of size $K$, find the maximum element in every contiguous sliding window of size $K$ as the window shifts right by 1.
- **Brute Force**: Scan window $\implies O(n \cdot K)$.
- **Heap Approach**: $O(n \log K)$.
- **Monotonic Queue (Deque)**: **Optimal $\mathbf{\Theta(n)}$ linear time!**

---

### 2. The Deque Invariant
A **Monotonic Queue** maintains elements in **strictly decreasing order** from front to back:
1. **Front of Deque**: Permanently holds the **Maximum element** of the current window!
2. **Back Eviction**: When a new element $A[i]$ arrives, pop all elements from the back of the deque that are $\le A[i]$. *(Intuition: If an older element is smaller than a newer element, it can never possibly be the maximum again!)*
3. **Front Expiration**: If the front index falls outside the current window ($< i - K + 1$), pop it from the front.

```text
SLIDING WINDOW MAX WITH K = 3 ON A = [ 1, 3, -1, -3, 5, 3, 6, 7 ]

Window [1, 3, -1]:
- Push 1: Deque = [1]
- Push 3: 3 > 1 ──► Evict 1! Deque = [3]
- Push -1: Deque = [3, -1]. Max = Front = 3.

Window [3, -1, -3]:
- Push -3: Deque = [3, -1, -3]. Max = Front = 3.

Window [-1, -3, 5]:
- Front index for 3 has expired! Pop 3 from front.
- Push 5: 5 > -3 and 5 > -1 ──► Evict all! Deque = [5]. Max = Front = 5.
```

---

### 3. Pseudocode: Sliding Window Maximum

```text
ALGORITHM SlidingWindowMax(A, n, K)
    Input: Array A of length n, window size K
    Output: List result containing maximum of each window

1.  deque ← empty DoubleEndedQueue     // Stores INDICES, not values!
2.  result ← empty List
3.  for i ← 0 to n - 1:
4.      // 1. Remove indices that fell out of window bounds
5.      if not deque.IsEmpty() and deque.GetFront() ≤ i - K:
6.          deque.PopFront()
7.      // 2. Maintain decreasing monotonic invariant (Evict smaller elements from back)
8.      while not deque.IsEmpty() and A[deque.GetBack()] ≤ A[i]:
9.          deque.PopBack()
10.     // 3. Add current element index
11.     deque.PushBack(i)
12.     // 4. Record answer once first window of size K is completed
13.     if i ≥ K - 1:
14.         result.Append(A[deque.GetFront()])
15. return result
```

- **Time Complexity**: Strictly $\mathbf{\Theta(n)}$ (Each index is pushed and popped at most once).
- **Auxiliary Space**: $O(K)$ space inside the deque.

---

## Module 02 Summary & Key Takeaways

1. **Monotonic Stack** solves Next Greater / Smaller Element queries in $O(n)$ total amortized time.
2. The core template repeatedly pops stack elements that violate monotonicity before pushing the new element.
3. **Monotonic Queue (Deque)** finds the maximum/minimum in a sliding window in $O(n)$ time by evicting older smaller candidates.

---

## References & Academic Attribution

1. **Halim, S., Halim, F., & Skiena, S. S.** (2020). *Competitive Programming 4: The Lower Bound of Programming Contests*. CP4 Pte Ltd.
2. **Laaksonen, A.** (2020). *Guide to Competitive Programming: Learning and Improving Algorithms Through Contests* (2nd ed.). Springer.
3. **Skiena, S. S.** (2020). *The Algorithm Design Manual* (3rd ed.). Springer.
