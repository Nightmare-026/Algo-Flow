# Part 09: Problem-Solving Patterns — Module 03: Core Interview & Competitive Patterns

Competitive programming and technical interviews center on a core suite of canonical archetype patterns that recur across domains. By mastering interval consolidation, heap selection, prefix-sum hash table invariants, and single-cycle ALU bit manipulation, developers can rapidly classify unstructured problem statements and implement optimal solutions under strict time constraints.

---

## 1. Executive Summary & Learning Objectives

This module synthesizes essential problem-solving patterns frequently encountered in systems design and algorithmic interviews, focusing on invariant preservation and asymptotic efficiency.

By the end of this chapter, you will be able to:

1. **Consolidate Disjoint & Overlapping Intervals**: Sort time boundaries to merge intervals and allocate minimum resource pools via min-heaps in $\mathcal{O}(n \log n)$ time.
2. **Track Dynamic Order Statistics**: Maintain the $K$-th largest element in $\mathcal{O}(n \log K)$ time and maintain running medians from real-time streams in $\mathcal{O}(\log n)$ insertion time using dual heaps.
3. **Exploit Hash Table Invariants**: Formulate prefix sum frequency mappings to count continuous subarrays summing to $K$ in $\mathcal{O}(n)$ time across negative numbers.
4. **Leverage Single-Cycle Bit Manipulation**: Apply hardware-level bitwise primitives (`n & (n - 1)`, `n & -n`, XOR cancellation) to solve parity, power-of-two, and frequency queries in $\mathcal{O}(1)$ time.

---

## 2. Topic 141: Interval Patterns

### 1. Merge Overlapping Intervals

Given an array of intervals $[s_i, e_i]$, combine all overlapping segments into non-overlapping contiguous ranges:

1. **Sort by Start Time**: Order intervals such that $s_0 \le s_1 \le \dots \le s_{n-1}$.
2. **Linear Merge Sweep**:
   - If the current interval starts after the active merged interval ends ($s_i > \text{last}.\text{end}$), append it as a new disjoint interval.
   - Otherwise, an overlap exists: update $\text{last}.\text{end} \leftarrow \max(\text{last}.\text{end}, e_i)$.

```typescript
export function mergeIntervals(intervals: number[][]): number[][] {
  if (intervals.length <= 1) return intervals;

  // Sort ascending by start boundary
  intervals.sort((a, b) => a[0] - b[0]);

  const merged: number[][] = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const current = intervals[i];
    const lastMerged = merged[merged.length - 1];

    if (current[0] <= lastMerged[1]) {
      // Overlap detected: expand ending boundary
      lastMerged[1] = Math.max(lastMerged[1], current[1]);
    } else {
      // Disjoint: start new interval block
      merged.push(current);
    }
  }

  return merged;
}
```

---

### 2. Meeting Rooms II (Minimum Resource Allocation)

Given meeting schedule intervals, calculate the minimum number of rooms required so that no two meetings overlap in the same room.

- **Min-Heap Strategy**: Sort meetings by start time. Maintain a min-heap storing the end times of ongoing meetings.
- When evaluating meeting $[s_i, e_i]$:
  - If $s_i \ge \text{heap}.\text{min}()$, the earliest ending meeting has completed $\implies$ reuse the room by popping the root.
  - Push $e_i$ into the min-heap.
- **Result**: The peak heap size reflects the minimum rooms needed. Overall time complexity: $\mathcal{O}(n \log n)$.

---

## 3. Topic 143: Heap Patterns (Top-K & Streaming Median)

### 1. Top-K Frequent / Extreme Elements in $\mathcal{O}(n \log K)$ Time

To extract the $K$ largest elements from an unsorted stream of $n$ elements:

- Sorting the full array requires $\mathcal{O}(n \log n)$ time.
- By maintaining a **Min-Heap of size $K$**, we process each element in $\mathcal{O}(\log K)$ time:
  - Push incoming element $x$ into the min-heap.
  - If the heap size exceeds $K$, remove the minimum element ($\text{extractMin}$).
  - After processing all $n$ items, the heap contains strictly the $K$ largest elements, with the root representing the $K$-th largest element.

### 2. Median from a Dynamic Data Stream (Dual-Heap Pattern)

To maintain the exact running median of numbers arriving sequentially in $\mathcal{O}(\log n)$ insertion and $\mathcal{O}(1)$ query time:

- Partition the dataset into two balanced halves:
  1. **Max-Heap (`low`)**: Holds the smaller half of elements (root is the maximum of the lower partition).
  2. **Min-Heap (`high`)**: Holds the larger half of elements (root is the minimum of the upper partition).

| Invariant           | Specification                                                                                                    | Action on Violation                                                                                          |
| :------------------ | :--------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------- |
| **Order Invariant** | $\max(\text{low}) \le \min(\text{high})$                                                                         | If $\text{low}.\text{peek}() > \text{high}.\text{peek}()$, swap the root elements.                           |
| **Size Invariant**  | $\text{size}(\text{low}) = \text{size}(\text{high})$ or $\text{size}(\text{low}) = \text{size}(\text{high}) + 1$ | If $\text{size}(\text{low}) > \text{size}(\text{high}) + 1$, move $\text{low}.\text{pop}() \to \text{high}$. |

**Median Query**:

- If total elements is odd: return $\text{low}.\text{peek}()$.
- If total elements is even: return $(\text{low}.\text{peek}() + \text{high}.\text{peek}()) / 2.0$.

<div class="my-6 p-4 bg-surface rounded-xl border border-border overflow-x-auto">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 310" width="100%" height="310" class="mx-auto block font-sans">
  <defs>
    <marker id="med-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#10b981"/></marker>
    <linearGradient id="heap-low-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#f59e0b" stop-opacity="0.3"/><stop offset="100%" stop-color="#f59e0b" stop-opacity="0.05"/></linearGradient>
    <linearGradient id="heap-high-g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0284c7" stop-opacity="0.3"/><stop offset="100%" stop-color="#0284c7" stop-opacity="0.05"/></linearGradient>
  </defs>
  <text x="410" y="22" text-anchor="middle" font-size="15" font-weight="bold" fill="currentColor">Archetype Models: Dual-Heap Streaming Median &amp; Interval Merge Topology</text>
  <rect x="20" y="45" width="375" height="250" rx="8" fill="none" stroke="#64748b" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="207" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#f59e0b">1. Dual-Heap Streaming Median</text>
  <g transform="translate(45, 90)">
    <rect x="0" y="0" width="145" height="110" rx="6" fill="url(#heap-low-g)" stroke="#f59e0b" stroke-width="2"/>
    <text x="72" y="25" text-anchor="middle" font-size="11" font-weight="bold" fill="#f59e0b">Max-Heap: low</text>
    <text x="72" y="45" text-anchor="middle" font-size="10" fill="currentColor">Lower Half Elements</text>
    <circle cx="72" cy="78" r="16" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
    <text x="72" y="83" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">max</text>
    <rect x="180" y="0" width="145" height="110" rx="6" fill="url(#heap-high-g)" stroke="#0284c7" stroke-width="2"/>
    <text x="252" y="25" text-anchor="middle" font-size="11" font-weight="bold" fill="#0284c7">Min-Heap: high</text>
    <text x="252" y="45" text-anchor="middle" font-size="10" fill="currentColor">Upper Half Elements</text>
    <circle cx="252" cy="78" r="16" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
    <text x="252" y="83" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">min</text>
    <line x1="162" y1="10" x2="162" y2="135" stroke="#10b981" stroke-width="2.5" stroke-dasharray="4,2"/>
    <text x="162" y="150" text-anchor="middle" font-size="11" font-weight="bold" fill="#10b981">Median Axis</text>
    <text x="162" y="168" text-anchor="middle" font-size="9.5" fill="currentColor">O(1) query lookup</text>
  </g>
  <text x="207" y="280" text-anchor="middle" font-size="10.5" fill="currentColor">Invariant: max(low) &#x2264; min(high) | size delta &#x2264; 1</text>
  <rect x="415" y="45" width="385" height="250" rx="8" fill="none" stroke="#64748b" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="607" y="68" text-anchor="middle" font-size="12" font-weight="bold" fill="#0284c7">2. Interval Merge Timeline Geometry</text>
  <g transform="translate(440, 95)">
    <line x1="0" y1="120" x2="335" y2="120" stroke="#64748b" stroke-width="1.5"/>
    <rect x="20" y="20" width="100" height="24" rx="4" fill="#0284c7" fill-opacity="0.3" stroke="#0284c7" stroke-width="1.5"/>
    <text x="70" y="36" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">[1, 4]</text>
    <rect x="70" y="55" width="110" height="24" rx="4" fill="#0284c7" fill-opacity="0.3" stroke="#0284c7" stroke-width="1.5"/>
    <text x="125" y="71" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">[3, 6]</text>
    <rect x="20" y="85" width="160" height="26" rx="4" fill="#10b981" fill-opacity="0.3" stroke="#10b981" stroke-width="2"/>
    <text x="100" y="102" text-anchor="middle" font-size="11" font-weight="bold" fill="#10b981">&#x27F6; Merged: [1, 6]</text>
    <rect x="220" y="55" width="85" height="24" rx="4" fill="#6366f1" fill-opacity="0.3" stroke="#6366f1" stroke-width="1.5"/>
    <text x="262" y="71" text-anchor="middle" font-size="11" font-weight="bold" fill="#ffffff">[8, 10]</text>
    <text x="262" y="102" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#6366f1">Disjoint Block</text>
  </g>
  <text x="607" y="280" text-anchor="middle" font-size="10.5" font-weight="bold" fill="#10b981">Sort by Start &#x2192; Linear Sweep O(n log n)</text>
</svg>
</div>

---

## 4. Topic 144: Hash Map Prefix Sum Invariant Pattern

### Subarray Sum Equals $K$ in Linear Time

Given an unsorted array containing positive and negative integers, count the total number of continuous subarrays whose sum equals $K$.

#### Mathematical Invariant

Let $P[i]$ denote the prefix sum up to index $i$. A subarray $A[j \dots i]$ evaluates to sum $K$ if and only if:

$$P[i] - P[j - 1] = K \iff P[j - 1] = P[i] - K$$

By recording the frequencies of prefix sums in a hash table as we iterate, we can query in $\mathcal{O}(1)$ time how many prior prefixes satisfy $P[j - 1] = P[i] - K$.

```typescript
export function subarraySumEqualsK(nums: number[], k: number): number {
  const prefixFrequency = new Map<number, number>();
  // Base case: prefix sum of 0 occurs once initially
  prefixFrequency.set(0, 1);

  let runningSum = 0;
  let totalSubarrays = 0;

  for (let i = 0; i < nums.length; i++) {
    runningSum += nums[i];
    const targetComplement = runningSum - k;

    if (prefixFrequency.has(targetComplement)) {
      totalSubarrays += prefixFrequency.get(targetComplement)!;
    }

    prefixFrequency.set(runningSum, (prefixFrequency.get(runningSum) || 0) + 1);
  }

  return totalSubarrays;
}
```

---

## 5. Topic 147: Bit Manipulation Hacks & Masking

Bitwise operations execute directly in CPU Arithmetic Logic Units (ALUs) in a single clock cycle ($\approx 0.3\text{ ns}$).

### 1. Fundamental Bitwise Operators

|    Operator     |  Syntax  | Name                 | Logic Condition                       | Arithmetic Equivalence                     |
| :-------------: | :------: | :------------------- | :------------------------------------ | :----------------------------------------- |
|     **AND**     | `a & b`  | Conjunction          | 1 only if both operand bits are 1     | Set intersection of active bits            |
|     **OR**      | `a \| b` | Disjunction          | 1 if at least one operand bit is 1    | Set union of active bits                   |
|     **XOR**     | `a ^ b`  | Exclusive OR         | 1 if operand bits differ              | Addition modulo 2 without carry            |
|     **NOT**     |   `~a`   | Inversion            | Flips all bits ($0 \to 1, 1 \to 0$)   | Two's complement negation $-a - 1$         |
| **Left Shift**  | `a << k` | Left Shift           | Shifts bits left, fills with zeros    | Multiply by $2^k$                          |
| **Right Shift** | `a >> k` | Sign-Extending Shift | Shifts bits right, preserves sign bit | Integer division $\lfloor a / 2^k \rfloor$ |

---

### 2. The 5 Essential Bit Manipulation Primitives

#### Primitive 1: Brian Kernighan's Bit-Counting Algorithm

Clears the lowest set bit in an integer in $\mathcal{O}(\text{number of set bits})$:
$$n = n \ \& \ (n - 1)$$

_Proof_: Subtracting 1 flips the lowest set bit to 0 and turns all subsequent trailing zeros into ones. Performing a bitwise AND between $n$ and $n-1$ clears exactly that lowest set bit while keeping all higher bits unchanged.

#### Primitive 2: Power-of-Two Detection

A positive integer is a power of 2 if and only if its binary expansion contains exactly one set bit:
$$\text{isPowerOfTwo}(n) \iff (n > 0) \ \land \ ((n \ \& \ (n - 1)) = 0)$$

#### Primitive 3: XOR Cancellation (Single Unique Element)

Exploiting algebraic properties $x \oplus x = 0$ and $x \oplus 0 = x$:
When all elements in an array appear twice except for one unique element, XORing every value collapses duplicate pairs to 0, isolating the unique value in $\mathcal{O}(n)$ time and $\mathcal{O}(1)$ space.

#### Primitive 4: Isolate Lowest Set Bit

$$L(n) = n \ \& \ (-n)$$
In Two's Complement representation, $-n = (\sim n) + 1$. Performing a bitwise AND between $n$ and $-n$ isolates the single least-significant set bit.

#### Primitive 5: Bitmask Manipulation Primitives

- **Test bit $k$**: `(n >> k) & 1`
- **Set bit $k$**: `n | (1 << k)`
- **Clear bit $k$**: `n & ~(1 << k)`
- **Toggle bit $k$**: `n ^ (1 << k)`

---

## 6. Pattern Selection Matrix

| Pattern Archetype    | Input Precondition                      | Key Invariant / Property                                     | Asymptotic Complexity                                   |
| :------------------- | :-------------------------------------- | :----------------------------------------------------------- | :------------------------------------------------------ |
| **Interval Merging** | Collection of start/end pairs           | Sort by start boundary; merge overlapping tails              | $\mathcal{O}(n \log n)$ time, $\mathcal{O}(n)$ space    |
| **Min-Heap Top-K**   | Stream or large unsorted array          | Bounded heap of size $K$ retains top elements                | $\mathcal{O}(n \log K)$ time, $\mathcal{O}(K)$ space    |
| **Dual Heap Median** | Continuous dynamic numerical stream     | Balanced sizes with $\max(\text{low}) \le \min(\text{high})$ | $\mathcal{O}(\log n)$ insertion, $\mathcal{O}(1)$ query |
| **Prefix Hash Map**  | Linear sequence with negative values    | $P[j-1] = P[i] - K$ captures target subarrays                | $\mathcal{O}(n)$ time, $\mathcal{O}(n)$ space           |
| **Bit Manipulation** | Integer attributes, boolean flags, sets | ALU single-cycle execution of bitwise algebra                | $\mathcal{O}(1)$ time, $\mathcal{O}(1)$ space           |

---

## References & Academic Attribution

1. **Halim, S., Halim, F., & Skiena, S. S.** (2020). _Competitive Programming 4: The Lower Bound of Programming Contests_. CP4 Pte Ltd.
2. **Laaksonen, A.** (2020). _Guide to Competitive Programming: Learning and Improving Algorithms Through Contests_ (2nd ed.). Springer.
3. **Skiena, S. S.** (2020). _The Algorithm Design Manual_ (3rd ed.). Springer.
4. **Warren, H. S.** (2012). _Hacker's Delight_ (2nd ed.). Addison-Wesley Professional.
