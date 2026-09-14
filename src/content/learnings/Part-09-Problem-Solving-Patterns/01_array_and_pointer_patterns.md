# Part 09: Problem-Solving Patterns — Module 01: Array & Pointer Patterns

Linear array processing is the bedrock of algorithmic problem solving, yet naive multi-loop solutions frequently succumb to quadratic slowdowns. Master five fundamental pointer and accumulator paradigms—Prefix Sums, Difference Arrays, Two Pointers, Sliding Windows, and Floyd's Cycle Detection—that transform intractable $\mathcal{O}(n^2)$ scans into optimal $\mathcal{O}(n)$ time.

---

## 1. Executive Summary & Learning Objectives

This module formalizes optimal linear sequence manipulation techniques, replacing repetitive traversals with analytical precomputation, stateful pointers, and invariant-driven boundary tracking.

By the end of this chapter, you will be able to:
1. **Accelerate Static Range Queries**: Formulate 1D and 2D prefix sums to answer arbitrary range sum queries in $\mathcal{O}(1)$ time.
2. **Execute Batch Range Updates**: Apply difference arrays to perform multiple offline range additions in $\mathcal{O}(1)$ time per update, reconstructing the final state in $\mathcal{O}(n)$ time.
3. **Eliminate Quadratic Nested Loops**: Design inward-converging and same-direction two-pointer strategies that traverse sorted sequences in linear time.
4. **Implement Resizable Sliding Windows**: Maintain running subarray states across fixed-length intervals and variable-length condition boundaries with amortized $\mathcal{O}(n)$ operations.
5. **Prove Floyd's Cycle Detection**: Derive the mathematical distance relation between head-to-entry and meet-to-entry segments in cyclic pointer structures.

---

## 2. Topic 134: Prefix Sum Pattern

### 1. The Core Problem
Given an array $A$ of $n$ elements, answer $Q$ range sum queries of the form:
> *"What is the sum of elements from index $L$ to index $R$ inclusive?"*

- **Brute Force**: Iterate from $L$ to $R$ for each query $\implies \mathcal{O}(n)$ per query, $\mathcal{O}(Q \cdot n)$ total.
- **Prefix Sum Optimization**: Precompute cumulative sums in $\mathcal{O}(n)$ time; answer **each query in $\mathcal{O}(1)$ time** and $\mathcal{O}(Q + n)$ overall.

### 2. 1D Prefix Sum Mechanics
Define array $P$ of length $n + 1$ where $P[i] = \sum_{k=0}^{i-1} A[k]$, with $P[0] = 0$:

$$\text{RangeSum}(L, R) = P[R + 1] - P[L]$$

#### Trace Example:

| Index $i$ | $\emptyset$ | 0 | 1 | 2 | 3 | 4 | 5 |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Array $A[i]$** | — | 3 | 1 | 4 | 1 | 5 | 9 |
| **Prefix Sum $P[i]$** | 0 | 3 | 4 | 8 | 9 | 14 | 23 |

**Query**: Sum from $L = 2$ to $R = 4$ (elements $4 + 1 + 5 = 10$):
$$P[5] - P[2] = 14 - 4 = 10$$
Computed in $\mathcal{O}(1)$ arithmetic operations.

### 3. 2D Prefix Sum (Submatrix Sum Queries)
To query the sum of any rectangular submatrix with top-left $(r_1, c_1)$ and bottom-right $(r_2, c_2)$ in $\mathcal{O}(1)$ time, construct 2D array $P$:

$$P[r][c] = A[r-1][c-1] + P[r-1][c] + P[r][c-1] - P[r-1][c-1]$$

The query sum is computed via the 2D Principle of Inclusion-Exclusion:

$$\text{SubmatrixSum}(r_1, c_1, r_2, c_2) = P[r_2+1][c_2+1] - P[r_1][c_2+1] - P[r_2+1][c_1] + P[r_1][c_1]$$

| Region Component | Inclusion / Exclusion Rationale |
| :--- | :--- |
| $+ P[r_2+1][c_2+1]$ | Covers total area from origin $(0,0)$ to bottom-right $(r_2, c_2)$. |
| $- P[r_1][c_2+1]$ | Subtracts redundant rectangle above the submatrix. |
| $- P[r_2+1][c_1]$ | Subtracts redundant rectangle to the left of the submatrix. |
| $+ P[r_1][c_1]$ | Re-adds the top-left intersection subtracted twice by previous steps. |

---

## 3. Topic 135: Difference Array (Range Update Pattern)

### 1. The Dual Problem to Prefix Sums
Given an initial array of size $n$, perform $Q$ range additions of the form:
> *"Add value $v$ to all elements from index $L$ to index $R$ inclusive."*

- **Brute Force**: Loop through indices $L \dots R$ for every update $\implies \mathcal{O}(n)$ per update, $\mathcal{O}(Q \cdot n)$ total.
- **Difference Array Optimization**: Apply updates in $\mathcal{O}(1)$ time per operation, reconstructing the final values in a single $\mathcal{O}(n)$ sweep.

### 2. Mechanics & Invariants
Maintain difference array $D$ of size $n + 1$, where $D[i] = A[i] - A[i-1]$ (with $A[-1] = 0$). For each update tuple $(L, R, v)$:
1. $D[L] \leftarrow D[L] + v$ (initiates offset $+v$ from $L$ onward)
2. $D[R + 1] \leftarrow D[R + 1] - v$ (neutralizes offset $+v$ beyond $R$)

After applying all $Q$ operations, the cumulative prefix sum of $D$ yields the final array $A$:

```typescript
export function applyRangeUpdates(
  n: number,
  updates: Array<[number, number, number]>
): number[] {
  const diff = new Array(n + 1).fill(0);

  for (const [L, R, val] of updates) {
    diff[L] += val;
    if (R + 1 < n) {
      diff[R + 1] -= val;
    }
  }

  const result = new Array(n);
  let running = 0;
  for (let i = 0; i < n; i++) {
    running += diff[i];
    result[i] = running;
  }

  return result;
}
```

---

## 4. Topic 136: Two Pointers Pattern

### 1. Paradigm & Taxonomy
The two-pointer technique coordinates two indices moving through a linear sequence, pruning search spaces and converting $\mathcal{O}(n^2)$ exhaustive comparisons into $\mathcal{O}(n)$ scans:

| Direction | Strategy | Movement Rule | Canonical Applications |
| :--- | :--- | :--- | :--- |
| **Inward Convergence** | `left` at $0$, `right` at $n-1$ | If sum too small, `left++`; if too large, `right--` | Two-Sum in sorted array, Container With Most Water, Palindrome verification |
| **Same Direction** | `fast` explores, `slow` writes | `fast` scans all entries; `slow` records valid items | Remove Duplicates in-place, Move Zeroes, Partitioning |

### 2. Implementation: Two-Sum on Sorted Array

```typescript
export function twoSumSorted(
  numbers: number[],
  target: number
): [number, number] | null {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const currentSum = numbers[left] + numbers[right];

    if (currentSum === target) {
      return [left, right];
    } else if (currentSum < target) {
      left++; // Increase sum by shifting to larger element
    } else {
      right--; // Decrease sum by shifting to smaller element
    }
  }

  return null;
}
```

---

## 5. Topic 137: Sliding Window Pattern

### 1. Paradigm
A sliding window maintains a contiguous range $[L, R]$ across an array or string. By adding newly entering elements and evicting outgoing elements incrementally, it evaluates subarray properties in $\mathcal{O}(n)$ total time.

### 2. Window Types & Templates

| Window Type | Boundary Rule | Time Complexity | Typical Problem |
| :--- | :--- | :--- | :--- |
| **Fixed Window** | Length $R - L + 1 = K$ is constant. Slide right by adding $A[R]$ and removing $A[R-K]$. | $\mathcal{O}(n)$ | Maximum sum subarray of length $K$ |
| **Variable Window** | Expand $R$ greedily. If constraint is violated, increment $L$ until invariant holds. | Amortized $\mathcal{O}(n)$ | Longest substring with at most $K$ distinct characters, Minimum size subarray sum |

```typescript
export function variableSlidingWindow(
  nums: number[],
  targetSum: number
): number {
  let left = 0;
  let currentSum = 0;
  let minLength = Infinity;

  for (let right = 0; right < nums.length; right++) {
    currentSum += nums[right]; // Expand window

    while (currentSum >= targetSum) {
      minLength = Math.min(minLength, right - left + 1);
      currentSum -= nums[left]; // Contract window
      left++;
    }
  }

  return minLength === Infinity ? 0 : minLength;
}
```

---

## 6. Topic 138: Fast & Slow Pointers (Floyd's Cycle Start Proof)

### 1. Mathematical Proof of Cycle Entry Detection
Floyd's Cycle-Finding Algorithm uses two pointers: `slow` advancing 1 step per cycle, and `fast` advancing 2 steps.

Let:
- $L$ = Distance from `head` to the cycle entry node.
- $C$ = Total perimeter length of the cycle.
- $d$ = Distance from cycle entry to the initial meeting point inside the cycle.

When the two pointers collide:
- Distance traversed by `slow`: $D_{\text{slow}} = L + d$
- Distance traversed by `fast`: $D_{\text{fast}} = L + d + k \cdot C$, where $k \ge 1$ represents completed loops.

Since `fast` travels at double the speed of `slow`:
$$2 \cdot D_{\text{slow}} = D_{\text{fast}}$$
$$2(L + d) = L + d + k \cdot C$$
$$L + d = k \cdot C$$
$$L = k \cdot C - d = (k - 1)C + (C - d)$$

### 2. Collision Theorem
The distance from `head` to the cycle entry node ($L$) is algebraically equivalent to $(k-1)$ full loops plus the distance from the collision point to the entry node ($C - d$).

Therefore, resetting `slow` to `head` while keeping `fast` at the meeting point and advancing both at **1 step per iteration** guarantees they will collide at the exact cycle entry node.

```typescript
interface ListNode {
  val: number;
  next: ListNode | null;
}

export function detectCycleEntry(head: ListNode | null): ListNode | null {
  if (!head || !head.next) return null;

  let slow: ListNode | null = head;
  let fast: ListNode | null = head;

  // Phase 1: Detect cycle existence
  while (fast && fast.next) {
    slow = slow!.next;
    fast = fast.next.next;
    if (slow === fast) break;
  }

  if (slow !== fast) return null; // No cycle

  // Phase 2: Find cycle entry node
  slow = head;
  while (slow !== fast) {
    slow = slow!.next;
    fast = fast!.next;
  }

  return slow;
}
```

---

## 7. Comparative Pattern Selection Guide

| Pattern | Input Preconditions | Primary Use Cases | Space Overhead |
| :--- | :--- | :--- | :--- |
| **Prefix Sum** | Static array, associative operations ($+$, $\oplus$) | Cumulative range sum queries, balance points | $\mathcal{O}(n)$ auxiliary table |
| **Difference Array** | Offline updates, static evaluation at end | Batch range additions across intervals | $\mathcal{O}(n)$ difference table |
| **Two Pointers** | Monotonicity (sorted arrays, unidirectional metrics) | Pair sum matching, in-place partitions | $\mathcal{O}(1)$ pointers |
| **Sliding Window** | Contiguous subarrays/substrings, monotonic state changes | Min/max window lengths, substring frequencies | $\mathcal{O}(1)$ or $\mathcal{O}(|\Sigma|)$ frequency map |
| **Fast & Slow Pointers** | Linked structures or cyclic state transitions | Cycle detection, cycle entry, midpoint retrieval | $\mathcal{O}(1)$ pointers |

---

## References & Academic Attribution

1. **Halim, S., Halim, F., & Skiena, S. S.** (2020). *Competitive Programming 4: The Lower Bound of Programming Contests*. CP4 Pte Ltd.
2. **Laaksonen, A.** (2020). *Guide to Competitive Programming: Learning and Improving Algorithms Through Contests* (2nd ed.). Springer.
3. **Skiena, S. S.** (2020). *The Algorithm Design Manual* (3rd ed.). Springer.
4. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.). MIT Press.
