# Part 04: Searching — Module 01: Linear & Binary Search

> **Topics Covered:**  
> 49. Linear Search (Sequential Search, Sentinel Optimization & Branch Prediction) &bull; 50. Binary Search (Logarithmic Divide-and-Conquer Search, Formal Loop Invariant Proof & Integer Overflow Prevention) &bull; Decision Tree Lower Bound &bull; Branchless Binary Search

---

Search algorithms represent computing's most fundamental query primitives, answering whether a target entity exists within a collection and identifying its precise location. The architectural approach to search hinges directly on the ordering invariants of the underlying data. Across unordered collections, exhaustive linear scanning is mathematically optimal without pre-indexing. When a collection is sorted, however, order permits the elimination of exponential fractions of the search space in each step. This chapter analyzes sequential linear search, sentinel loop optimizations, the divide-and-conquer mechanics of binary search, arithmetic integer overflow prevention, formal loop invariant proofs, and modern branchless optimizations.

### Learning Objectives

- Formulate the fundamental search problem across arbitrary versus monotonically ordered sequences.
- Implement linear search and apply the sentinel optimization technique to eliminate per-iteration boundary checks.
- Master binary search's invariant-driven search interval halving and prevent 32-bit signed integer overflow.
- Formally prove the correctness of binary search using mathematical induction over loop invariants.
- Derive the formal logarithmic recurrence $T(n) = T(n/2) + O(1) \implies \Theta(\log n)$ using the Master Theorem and decision tree lower bounds.
- Implement branchless binary search patterns to avoid CPU branch misprediction penalties on modern superscalar architectures.

---

## Topic 49: Linear Search (Sequential Scanning)

### 1. Problem Definition & Operational Mechanics

Given an arbitrary array $A$ containing $n$ elements, determine whether a specified `target` value exists in $A$. If found, return its zero-based index $i$; otherwise, return $-1$.

Linear Search inspects every cell sequentially from index $0$ to $n - 1$:

- **Preconditions**: **Zero**. Works across completely unordered collections, linked lists, files, and input streams.
- **Decision Contract**: Halts immediately on the first matching element.

---

### 2. Systems Optimization: Sentinel Linear Search

Standard linear search incurs **two branch comparisons on every single iteration**:

1. Loop boundary condition: `i < n`
2. Value equality check: `A[i] == target`

In high-throughput loops processing millions of records, branch predictor overhead degrades CPU pipelining. **Sentinel Linear Search** eliminates the boundary condition from the inner loop entirely:

1. Temporarily store the original last element: $\text{last} = A[n - 1]$.
2. Overwrite the last element with the target: $A[n - 1] = \text{target}$ (acting as a guaranteed loop terminator).
3. Scan using only the equality condition: `while A[i] != target: i++`.
4. Restore $A[n - 1] = \text{last}$.
5. Check if $i < n - 1$ or the restored last element matches the target.

```text
FUNCTION SentinelLinearSearch(A: Array of Element, n: Integer, target: Element) -> Integer:
    if n == 0:
        return -1

    last <- A[n - 1]
    A[n - 1] <- target     // Install sentinel
    i <- 0

    // Only ONE comparison per iteration: no i < n check!
    while A[i] != target:
        i <- i + 1

    A[n - 1] <- last       // Restore original element

    if i < n - 1 or A[n - 1] == target:
        return i
    return -1
```

---

## Topic 50: Binary Search (Logarithmic Divide-and-Conquer)

### 1. Conceptual Architecture & Interval Contraction Geometry

When an array is strictly sorted in non-decreasing order ($A[0] \le A[1] \le \dots \le A[n-1]$), we can test the central element ($A[\text{mid}]$). If the target does not match $A[\text{mid}]$, order guarantees that an entire half of the remaining elements can be discarded immediately.

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Algorithm Geometry: Binary Search Interval Contraction (Target = 23)
  </div>
  <svg viewBox="0 0 850 360" class="w-full h-auto text-xs" style="max-height: 360px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="bsArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="320" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Stage 1: Full Array n = 10 -->
    <g transform="translate(50, 50)">
      <text x="0" y="15" font-weight="700" fill="currentColor">Iteration 1: [low=0, high=9] &rarr; mid = 4 (A[4] = 16 &lt; 23) &rarr; Discard [0..4]</text>
      <!-- Slots 0..9 -->
      <g transform="translate(0, 25)">
        <rect x="0" y="0" width="50" height="40" rx="4" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444" stroke-width="1.5"/>
        <text x="25" y="24" text-anchor="middle" font-family="monospace">2</text>
        <rect x="55" y="0" width="50" height="40" rx="4" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444" stroke-width="1.5"/>
        <text x="80" y="24" text-anchor="middle" font-family="monospace">5</text>
        <rect x="110" y="0" width="50" height="40" rx="4" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444" stroke-width="1.5"/>
        <text x="135" y="24" text-anchor="middle" font-family="monospace">8</text>
        <rect x="165" y="0" width="50" height="40" rx="4" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444" stroke-width="1.5"/>
        <text x="190" y="24" text-anchor="middle" font-family="monospace">12</text>
        <rect x="220" y="0" width="50" height="40" rx="4" fill="#f59e0b" fill-opacity="0.25" stroke="#f59e0b" stroke-width="2"/>
        <text x="245" y="24" text-anchor="middle" font-family="monospace" font-weight="700">16 (M)</text>
        <!-- Active Right Half -->
        <rect x="275" y="0" width="50" height="40" rx="4" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="300" y="24" text-anchor="middle" font-family="monospace">23</text>
        <rect x="330" y="0" width="50" height="40" rx="4" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="355" y="24" text-anchor="middle" font-family="monospace">38</text>
        <rect x="385" y="0" width="50" height="40" rx="4" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="410" y="24" text-anchor="middle" font-family="monospace">56</text>
        <rect x="440" y="0" width="50" height="40" rx="4" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="465" y="24" text-anchor="middle" font-family="monospace">72</text>
        <rect x="495" y="0" width="50" height="40" rx="4" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="520" y="24" text-anchor="middle" font-family="monospace">91</text>
      </g>
    </g>
    <!-- Stage 2: Interval [5..9] -->
    <g transform="translate(50, 140)">
      <text x="0" y="15" font-weight="700" fill="currentColor">Iteration 2: [low=5, high=9] &rarr; mid = 7 (A[7] = 56 &gt; 23) &rarr; Discard [7..9]</text>
      <g transform="translate(275, 25)">
        <rect x="0" y="0" width="50" height="40" rx="4" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="25" y="24" text-anchor="middle" font-family="monospace">23 (L)</text>
        <rect x="55" y="0" width="50" height="40" rx="4" fill="#3b82f6" fill-opacity="0.2" stroke="#3b82f6" stroke-width="1.5"/>
        <text x="80" y="24" text-anchor="middle" font-family="monospace">38</text>
        <rect x="110" y="0" width="50" height="40" rx="4" fill="#f59e0b" fill-opacity="0.25" stroke="#f59e0b" stroke-width="2"/>
        <text x="135" y="24" text-anchor="middle" font-family="monospace" font-weight="700">56 (M)</text>
        <rect x="165" y="0" width="50" height="40" rx="4" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444" stroke-width="1.5"/>
        <text x="190" y="24" text-anchor="middle" font-family="monospace">72</text>
        <rect x="220" y="0" width="50" height="40" rx="4" fill="#ef4444" fill-opacity="0.1" stroke="#ef4444" stroke-width="1.5"/>
        <text x="245" y="24" text-anchor="middle" font-family="monospace">91</text>
      </g>
    </g>
    <!-- Stage 3: Target Match -->
    <g transform="translate(50, 230)">
      <text x="0" y="15" font-weight="700" fill="#10b981">Iteration 3: [low=5, high=6] &rarr; mid = 5 (A[5] = 23 == Target Found!)</text>
      <g transform="translate(275, 25)">
        <rect x="0" y="0" width="60" height="45" rx="6" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="2.5"/>
        <text x="30" y="27" text-anchor="middle" font-family="monospace" font-weight="700" fill="#10b981">23 (MATCH)</text>
        <rect x="70" y="0" width="50" height="45" rx="4" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="95" y="27" text-anchor="middle" font-family="monospace">38</text>
      </g>
    </g>
  </svg>
</div>

---

### 2. Formal Induction Proof of the Binary Search Invariant

#### Loop Invariant:

_At the start of every iteration of the `while (low <= high)` loop, if the `target` exists anywhere in array $A[0 \dots n-1]$, it must be located within the active subarray boundary $A[\text{low} \dots \text{high}]$._

1. **Initialization (Base Case)**:
   - Prior to loop execution, $\text{low} = 0$ and $\text{high} = n - 1$.
   - The active interval is $A[0 \dots n - 1]$, which encompasses the entire collection.
   - If the target exists, it is trivially within this range. The invariant holds.

2. **Maintenance (Inductive Step)**:
   - Assume the invariant holds at the beginning of an iteration: $\text{target} \in A[\text{low} \dots \text{high}]$.
   - Calculate $\text{mid} = \text{low} + \lfloor (\text{high} - \text{low}) / 2 \rfloor$.
   - **Case 1 ($A[\text{mid}] == \text{target}$)**: The element is found; algorithm terminates correctly.
   - **Case 2 ($A[\text{mid}] < \text{target}$)**:
     - Because $A$ is sorted in non-decreasing order:
       $$A[i] \le A[\text{mid}] < \text{target} \quad \text{for all } i \le \text{mid}$$
     - Therefore, `target` cannot exist at index $\text{mid}$ or any index to its left ($i \le \text{mid}$).
     - Setting $\text{low} \leftarrow \text{mid} + 1$ restricts the interval to $A[\text{mid} + 1 \dots \text{high}]$ without eliminating any potential match. The invariant is preserved.
   - **Case 3 ($A[\text{mid}] > \text{target}$)**:
     - Symmetrically, $A[i] \ge A[\text{mid}] > \text{target}$ for all $i \ge \text{mid}$.
     - Setting $\text{high} \leftarrow \text{mid} - 1$ preserves the invariant.

3. **Termination**:
   - The loop terminates either when $A[\text{mid}] == \text{target}$ (returning the valid index), or when $\text{low} > \text{high}$.
   - If $\text{low} > \text{high}$, the candidate interval $A[\text{low} \dots \text{high}]$ is empty.
   - By the invariant, if `target` existed, it must be in this empty interval. Thus, `target` is provably absent from $A$. The algorithm correctly returns $-1$. $\blacksquare$

---

### 3. Systems Optimization: Branchless Binary Search

On modern superscalar CPU pipelines, conditional branches (`if (A[mid] < target)`) trigger pipeline stalls upon branch misprediction. When binary searching, the comparison outcome is effectively random (50/50), causing high branch misprediction rates (~15–20 CPU cycles penalty per branch).

A **Branchless Binary Search** uses conditional moves (`cmov`) or pointer arithmetic to eliminate branches:

```cpp
#include <span>
#include <cstddef>

// Branchless Binary Search: Eliminates CPU branch mispredictions
int branchless_binary_search(std::span<const int> arr, int target) {
    const int* base = arr.data();
    size_t n = arr.size();

    while (n > 1) {
        size_t half = n / 2;
        // Compiler emits conditional move (cmov) instead of jump instruction
        base = (base[half] < target) ? base + half : base;
        n -= half;
    }

    return (*base == target) ? static_cast<int>(base - arr.data()) : -1;
}
```

---

### 4. Key Takeaways

1. **Unsorted Generality**: Linear search requires zero preconditions, operating across arbitrary streams in $\Theta(n)$ time.
2. **Sentinel Optimization**: Placing a temporary copy of the target at array end eliminates the `i < n` loop boundary branch.
3. **Logarithmic Scaling**: Binary search halves the remaining search space at every comparison, achieving $\Theta(\log n)$ performance across sorted containers.
4. **Overflow Prevention**: Always compute midpoint as $\text{low} + \lfloor (\text{high} - \text{low}) / 2 \rfloor$ to avoid signed integer wraparound.
5. **Branchless Search**: Eliminating branch mispredictions via conditional pointer arithmetic dramatically accelerates binary search on modern superscalar processors.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). _Introduction to Algorithms_ (4th ed.), Section 2.3 & Chapter 12. MIT Press.
2. **Bentley, J.** (2000). _Programming Pearls_ (2nd ed.), Column 4: _Writing Correct Programs_. Addison-Wesley.
3. **Knuth, D. E.** (1998). _The Art of Computer Programming, Volume 3: Sorting and Searching_ (2nd ed.), Section 6.2: _Searching by Comparison of Keys_. Addison-Wesley.
4. **Bloch, J.** (2006). _Extra, Extra - Read All About It: Nearly All Binary Searches and Mergesorts are Broken_. Google Research Blog.
