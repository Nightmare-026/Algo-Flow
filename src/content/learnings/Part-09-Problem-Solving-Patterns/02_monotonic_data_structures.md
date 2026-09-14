# Part 09: Problem-Solving Patterns — Module 02: Monotonic Data Structures

Monotonic stacks and queues enforce strict ordering invariants over dynamically filtered sequences, pruning obsolete candidates in amortized $\mathcal{O}(1)$ time per element. From range extrema lookups and histogram geometry to sliding-window signal filtering, monotonic structures convert intractable $\mathcal{O}(n^2)$ and $\mathcal{O}(n \log k)$ lookups into optimal linear scans.

---

## 1. Executive Summary & Learning Objectives

This module explores ordered linear containers that discard dominated elements as new candidates arrive, maintaining a monotonic sub-sequence that guarantees immediate access to extreme values.

By the end of this chapter, you will be able to:
1. **Enforce Monotonic Stack Invariants**: Implement increasing and decreasing stacks to resolve Next/Previous Greater/Smaller Element queries in amortized $\mathcal{O}(n)$ time.
2. **Maximize Geometric Subarrays**: Apply monotonic stacks to find the largest rectangular area in a histogram by tracking span boundaries in $\mathcal{O}(n)$ time.
3. **Construct Monotonic Deques**: Maintain double-ended queues of indices to solve the Sliding Window Maximum problem in strictly $\Theta(n)$ time and $\mathcal{O}(k)$ auxiliary space.
4. **Prove Amortized Invariants**: Mathematically demonstrate why inner while loops across monotonic structures achieve aggregate $\mathcal{O}(n)$ time through single-push, single-pop guarantees.

---

## 2. Topic 139: Monotonic Stack Pattern

### 1. Definition & Core Invariant
A **Monotonic Stack** is a last-in, first-out container that maintains its stored elements in strictly sorted order (either monotonically increasing or decreasing) from bottom to top:

| Stack Type | Bottom-to-Top Invariant | Popping Condition on Incoming $x$ | Primary Query Resolved |
| :--- | :--- | :--- | :--- |
| **Monotonically Increasing** | Elements increase: $S_0 < S_1 < \dots < S_{\text{top}}$ | Pop while $\text{top} \ge x$ | Next/Previous Smaller Element |
| **Monotonically Decreasing** | Elements decrease: $S_0 > S_1 > \dots > S_{\text{top}}$ | Pop while $\text{top} \le x$ | Next/Previous Greater Element |

### 2. Next Greater Element (NGE) Problem Formulation
Given array $A = [2, 1, 2, 4, 3]$, determine the first element to the right that is strictly greater than each element. If none exists, assign $-1$.

- **Brute Force**: Evaluate all pairs $(i, j)$ where $j > i \implies \mathcal{O}(n^2)$ time.
- **Monotonic Stack Optimization**: Scan right-to-left, popping elements smaller than or equal to $A[i] \implies \mathbf{\Theta(n)}$ linear time.

```typescript
/**
 * Computes Next Greater Element for every array position.
 * Time Complexity:  O(n) amortized
 * Space Complexity: O(n) auxiliary stack
 */
export function nextGreaterElement(nums: number[]): number[] {
  const n = nums.length;
  const nge = new Array<number>(n);
  const stack: number[] = []; // Monotonically decreasing stack storing values

  // Traverse right-to-left
  for (let i = n - 1; i >= 0; i--) {
    // Discard elements dominated by nums[i]
    while (stack.length > 0 && stack[stack.length - 1] <= nums[i]) {
      stack.pop();
    }

    nge[i] = stack.length === 0 ? -1 : stack[stack.length - 1];
    stack.push(nums[i]);
  }

  return nge;
}
```

---

### 3. Step-by-Step State Trace: $A = [2, 1, 2, 4, 3]$

| Index $i$ | Element $A[i]$ | Stack Before Action | Popped Elements | Assigned `nge[i]` | Stack After Push |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **4** | 3 | `[]` | None | `-1` | `[3]` |
| **3** | 4 | `[3]` | $3 \le 4 \implies$ Pop 3 | `-1` | `[4]` |
| **2** | 2 | `[4]` | None ($4 > 2$) | `4` | `[4, 2]` |
| **1** | 1 | `[4, 2]` | None ($2 > 1$) | `2` | `[4, 2, 1]` |
| **0** | 2 | `[4, 2, 1]` | $1 \le 2 \implies$ Pop 1, $2 \le 2 \implies$ Pop 2 | `4` | `[4, 2]` |

**Final Result**: `nge = [4, 2, 4, -1, -1]`.

---

### 4. Amortized $\Theta(n)$ Complexity Proof
Although an inner `while` loop executes during iterations, consider the aggregate lifecycle of elements:
- Each index is pushed onto the stack **exactly once**.
- Each index is popped from the stack **at most once**.
- The total number of stack operations across the entire algorithm cannot exceed $2n$.
- Therefore, the amortized cost per element is $\mathcal{O}(1)$, yielding total runtime $\mathbf{\Theta(n)}$.

---

### 5. Signature Master Problem: Largest Rectangle in Histogram
Given bar heights $H = [2, 1, 5, 6, 2, 3]$, compute the maximum rectangular area formed under the histogram bars.

For each bar $i$, the maximum rectangle with height $H[i]$ spans from its **Previous Smaller Element (PSE)** to its **Next Smaller Element (NSE)**:

$$\text{Width}[i] = \text{NSE}[i] - \text{PSE}[i] - 1$$
$$\text{Area}[i] = H[i] \times \text{Width}[i]$$
$$\text{MaxArea} = \max_{0 \le i < n} (\text{Area}[i])$$

```typescript
export function largestRectangleArea(heights: number[]): number {
  const stack: number[] = []; // Stores indices
  let maxArea = 0;
  const n = heights.length;

  for (let i = 0; i <= n; i++) {
    const currentHeight = i === n ? 0 : heights[i];

    while (stack.length > 0 && currentHeight < heights[stack[stack.length - 1]]) {
      const height = heights[stack.pop()!];
      const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
      maxArea = Math.max(maxArea, height * width);
    }

    stack.push(i);
  }

  return maxArea;
}
```

---

## 3. Topic 140: Monotonic Queue Pattern

### 1. Context: Sliding Window Maximum
Given array $A$ of size $n$ and window size $K$, find the maximum value in every contiguous window of length $K$ as it shifts right by 1 step.

| Algorithmic Approach | Time Complexity | Auxiliary Space | Bottleneck / Limitation |
| :--- | :--- | :--- | :--- |
| **Brute Force Subarray Scan** | $\mathcal{O}(n \cdot K)$ | $\mathcal{O}(1)$ | Repeated redundant comparisons across overlapping intervals |
| **Max-Heap (Priority Queue)** | $\mathcal{O}(n \log K)$ | $\mathcal{O}(K)$ | Lazy deletion requires heap pruning overhead |
| **Monotonic Deque** | $\mathbf{\Theta(n)}$ | $\mathbf{\mathcal{O}(K)}$ | Optimal aggregate amortized performance |

---

### 2. The Deque Invariant
A **Monotonic Queue** maintains array indices in a double-ended queue (deque) adhering to two simultaneous invariants:
1. **Value Monotonicity**: Indices in the deque correspond to strictly decreasing array values from front to back ($A[D_0] > A[D_1] > \dots$). Consequently, **`deque.front()` always holds the index of the window maximum**.
2. **Window Expiration**: If the front index satisfies $D_0 \le i - K$, it has fallen out of window boundaries and is removed from the front.
3. **Domination Pruning**: Before inserting index $i$, all back indices $j$ where $A[j] \le A[i]$ are popped. If an older element is smaller than a newer element, it can never serve as a window maximum.

---

### 3. Step-by-Step Sliding Window Trace: $K = 3$ on $A = [1, 3, -1, -3, 5, 3, 6, 7]$

| Current Index $i$ | Incoming $A[i]$ | Window Bounds | Front Expirations | Back Removals (Dominated) | Deque State (Indices) | Window Max ($A[\text{front}]$) |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0** | 1 | $[0 \dots 0]$ | None | None | `[0]` | — |
| **1** | 3 | $[0 \dots 1]$ | None | $A[0]=1 \le 3 \implies$ Pop back | `[1]` | — |
| **2** | -1 | $[0 \dots 2]$ | None | None | `[1, 2]` | **3** ($A[1]$) |
| **3** | -3 | $[1 \dots 3]$ | None | None | `[1, 2, 3]` | **3** ($A[1]$) |
| **4** | 5 | $[2 \dots 4]$ | $1 \le 4 - 3 \implies$ Pop front | $A[3]=-3, A[2]=-1 \le 5 \implies$ Pop back | `[4]` | **5** ($A[4]$) |
| **5** | 3 | $[3 \dots 5]$ | None | None | `[4, 5]` | **5** ($A[4]$) |
| **6** | 6 | $[4 \dots 6]$ | None | $A[5]=3, A[4]=5 \le 6 \implies$ Pop back | `[6]` | **6** ($A[6]$) |
| **7** | 7 | $[5 \dots 7]$ | None | $A[6]=6 \le 7 \implies$ Pop back | `[7]` | **7** ($A[7]$) |

---

### 4. Implementation: Sliding Window Maximum

```typescript
export function maxSlidingWindow(nums: number[], k: number): number[] {
  const n = nums.length;
  if (n === 0 || k === 0) return [];

  const deque: number[] = []; // Stores indices
  const result: number[] = [];

  for (let i = 0; i < n; i++) {
    // 1. Remove indices outside current window
    if (deque.length > 0 && deque[0] <= i - k) {
      deque.shift();
    }

    // 2. Remove indices with values dominated by nums[i]
    while (deque.length > 0 && nums[deque[deque.length - 1]] <= nums[i]) {
      deque.pop();
    }

    // 3. Append current element index
    deque.push(i);

    // 4. Record front value once first window is complete
    if (i >= k - 1) {
      result.push(nums[deque[0]]);
    }
  }

  return result;
}
```

---

## 4. Module 02 Summary & Architectural Takeaways

1. **Monotonic Stack**: Solves range boundary queries (Next/Previous Greater/Smaller) in $\Theta(n)$ amortized time by discarding non-competitive elements.
2. **Histogram Geometry**: The area under an irregular histogram decomposes into $n$ candidate rectangles defined by Previous and Next Smaller Element boundaries.
3. **Monotonic Deque**: Maintains sliding window extrema in linear time by discarding elements that are both older and smaller than incoming candidates.

---

## References & Academic Attribution

1. **Halim, S., Halim, F., & Skiena, S. S.** (2020). *Competitive Programming 4: The Lower Bound of Programming Contests*. CP4 Pte Ltd.
2. **Laaksonen, A.** (2020). *Guide to Competitive Programming: Learning and Improving Algorithms Through Contests* (2nd ed.). Springer.
3. **Skiena, S. S.** (2020). *The Algorithm Design Manual* (3rd ed.). Springer.
4. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.). MIT Press.
