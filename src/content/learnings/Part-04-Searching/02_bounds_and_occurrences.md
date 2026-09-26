# Part 04: Searching — Module 02: Lower Bound, Upper Bound & Element Occurrences

> **Topics Covered:**  
> 51. Binary Search Invariants & Interval Models &bull; 52. Lower Bound Algorithm ($A[i] \ge \text{target}$) &bull; Upper Bound Algorithm ($A[i] > \text{target}$) &bull; 53. First and Last Occurrences & Frequency Counting in $O(\log n)$ &bull; Production Multi-Language Implementations

---

Beyond locating exact single-element matches, binary search serves as a precision tool for locating boundaries in sorted sequences. Standard binary search halts unpredictably on any arbitrary instance of a duplicate target. In production algorithms, standard libraries (such as C++ `std::lower_bound` and `std::upper_bound`, Java `Arrays.binarySearch`, and Python `bisect_left`/`bisect_right`) rely on invariant-preserving predicates to find the exact boundaries of duplicate runs. This chapter formalizes binary search interval models, strict versus non-strict monotonic boundary predicates, candidate-tracking state machines, and $O(\log n)$ frequency range evaluations.

### Learning Objectives

- Differentiate the three fundamental binary search interval paradigms (Closed $[low, high]$, Half-Open $[low, high)$, and Open $(low, high)$).
- Formulate the exact mathematical predicates defining Lower Bound ($A[i] \ge \text{target}$) and Upper Bound ($A[i] > \text{target}$).
- Prove why the total frequency of any element in a sorted array equals $\text{UpperBound} - \text{LowerBound}$ in guaranteed $O(\log n)$ time.
- Implement dedicated `FirstOccurrence` and `LastOccurrence` variants using candidate-retention variables and directional interval compression.
- Trace boundary conditions where the search key is strictly smaller than $A[0]$, strictly greater than $A[n-1]$, or present across contiguous duplicate spans.

---

## Topic 51: Binary Search Interval Invariants

### 1. The Three Interval Paradigms

| Interval Model                  | Mathematical Window | Loop Invariant Condition |   Left Pointer Update    |   Right Pointer Update    | Post-Loop Termination State |
| :------------------------------ | :-----------------: | :----------------------: | :----------------------: | :-----------------------: | :-------------------------: |
| **Model 1: Closed Interval**    |    $[low, high]$    |   `while low <= high:`   | $low \leftarrow mid + 1$ | $high \leftarrow mid - 1$ |      $low = high + 1$       |
| **Model 2: Half-Open Interval** |    $[low, high)$    |   `while low < high:`    | $low \leftarrow mid + 1$ |   $high \leftarrow mid$   |        $low = high$         |
| **Model 3: Open Interval**      |    $(low, high)$    | `while low + 1 < high:`  |   $low \leftarrow mid$   |   $high \leftarrow mid$   |      $low + 1 = high$       |

---

## Topic 52: Lower Bound & Upper Bound Mathematics

### 1. Boundary Geometry Across Contiguous Runs

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Boundary Mathematics: Lower Bound (LB) vs. Upper Bound (UB) Contiguous Span
  </div>
  <svg viewBox="0 0 850 320" class="w-full h-auto text-xs" style="max-height: 320px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="bndArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="280" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Array Layout in Center -->
    <g transform="translate(100, 70)">
      <text x="325" y="-15" font-weight="700" fill="currentColor" text-anchor="middle" font-size="13">Array A = [2, 4, 6, 8, 8, 8, 10, 12] (Target = 8)</text>
      <!-- Slots 0..7 -->
      <g transform="translate(0, 15)">
        <rect x="0" y="0" width="70" height="50" rx="4" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="35" y="30" text-anchor="middle" font-family="monospace">2</text>
        <text x="35" y="-6" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">idx 0</text>
        <rect x="75" y="0" width="70" height="50" rx="4" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="110" y="30" text-anchor="middle" font-family="monospace">4</text>
        <text x="110" y="-6" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">idx 1</text>
        <rect x="150" y="0" width="70" height="50" rx="4" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="185" y="30" text-anchor="middle" font-family="monospace">6</text>
        <text x="185" y="-6" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">idx 2</text>
        <!-- Duplicate Run of 8: Indices 3..5 -->
        <rect x="225" y="-4" width="225" height="58" rx="6" fill="#3b82f6" fill-opacity="0.1" stroke="#3b82f6" stroke-width="2"/>
        <rect x="225" y="0" width="70" height="50" rx="4" fill="#10b981" fill-opacity="0.25" stroke="#10b981" stroke-width="2"/>
        <text x="260" y="30" text-anchor="middle" font-family="monospace" font-weight="700" fill="#10b981">8</text>
        <text x="260" y="-6" text-anchor="middle" font-size="9" font-weight="700" fill="#10b981">idx 3</text>
        <rect x="300" y="0" width="70" height="50" rx="4" fill="#3b82f6" fill-opacity="0.2"/>
        <text x="335" y="30" text-anchor="middle" font-family="monospace" font-weight="700">8</text>
        <text x="335" y="-6" text-anchor="middle" font-size="9">idx 4</text>
        <rect x="375" y="0" width="70" height="50" rx="4" fill="#3b82f6" fill-opacity="0.2"/>
        <text x="410" y="30" text-anchor="middle" font-family="monospace" font-weight="700">8</text>
        <text x="410" y="-6" text-anchor="middle" font-size="9">idx 5</text>
        <rect x="450" y="0" width="70" height="50" rx="4" fill="#f59e0b" fill-opacity="0.25" stroke="#f59e0b" stroke-width="2"/>
        <text x="485" y="30" text-anchor="middle" font-family="monospace" font-weight="700" fill="#f59e0b">10</text>
        <text x="485" y="-6" text-anchor="middle" font-size="9" font-weight="700" fill="#f59e0b">idx 6</text>
        <rect x="525" y="0" width="70" height="50" rx="4" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.2"/>
        <text x="560" y="30" text-anchor="middle" font-family="monospace">12</text>
        <text x="560" y="-6" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.5">idx 7</text>
      </g>
    </g>
    <!-- Pointer Pointers Below -->
    <g transform="translate(100, 175)">
      <!-- Lower Bound Indicator -->
      <g transform="translate(260, 0)">
        <path d="M 0 35 L 0 5" stroke="#10b981" stroke-width="2" marker-end="url(#bndArrow)"/>
        <rect x="-80" y="40" width="160" height="50" rx="6" fill="#10b981" fill-opacity="0.12" stroke="#10b981"/>
        <text x="0" y="58" text-anchor="middle" font-weight="700" fill="#10b981">Lower Bound = 3</text>
        <text x="0" y="74" text-anchor="middle" font-size="10" fill="currentColor">First element &ge; 8</text>
      </g>
      <!-- Upper Bound Indicator -->
      <g transform="translate(485, 0)">
        <path d="M 0 35 L 0 5" stroke="#f59e0b" stroke-width="2" marker-end="url(#bndArrow)"/>
        <rect x="-80" y="40" width="160" height="50" rx="6" fill="#f59e0b" fill-opacity="0.12" stroke="#f59e0b"/>
        <text x="0" y="58" text-anchor="middle" font-weight="700" fill="#f59e0b">Upper Bound = 6</text>
        <text x="0" y="74" text-anchor="middle" font-size="10" fill="currentColor">First element &gt; 8</text>
      </g>
      <!-- Frequency Badge in Center -->
      <g transform="translate(372, 55)">
        <text x="0" y="0" text-anchor="middle" font-weight="700" fill="#3b82f6" font-size="12">Span = UB - LB</text>
        <text x="0" y="16" text-anchor="middle" font-family="monospace" font-weight="700" fill="#3b82f6">6 - 3 = 3 elements</text>
      </g>
    </g>
  </svg>
</div>

---

### 2. Concrete Production Implementations

#### C++20 Lower Bound, Upper Bound & Range Count

```cpp
#include <span>
#include <cstddef>
#include <utility>

// Lower Bound: Returns index of first element >= target, or arr.size() if none
size_t lower_bound(std::span<const int> arr, int target) {
    size_t low = 0;
    size_t high = arr.size();

    while (low < high) {
        size_t mid = low + (high - low) / 2;
        if (arr[mid] >= target) {
            high = mid; // Candidate found; continue searching left
        } else {
            low = mid + 1;
        }
    }
    return low;
}

// Upper Bound: Returns index of first element > target, or arr.size() if none
size_t upper_bound(std::span<const int> arr, int target) {
    size_t low = 0;
    size_t high = arr.size();

    while (low < high) {
        size_t mid = low + (high - low) / 2;
        if (arr[mid] > target) {
            high = mid; // Candidate found; continue searching left
        } else {
            low = mid + 1;
        }
    }
    return low;
}

// O(log n) Exact Frequency Query
size_t count_occurrences(std::span<const int> arr, int target) {
    size_t lb = lower_bound(arr, target);
    if (lb == arr.size() || arr[lb] != target) {
        return 0; // Target is absent
    }
    size_t ub = upper_bound(arr, target);
    return ub - lb;
}
```

---

### 3. Key Takeaways

1. **Predicate Distinction**: Lower Bound uses a non-strict inequality ($A[i] \ge \text{target}$); Upper Bound uses a strict inequality ($A[i] > \text{target}$).
2. **Fallback Index**: If no element satisfies the predicate, both Lower and Upper Bound return $n$ (the valid insertion position).
3. **Range Counting**: The exact frequency of any element in a sorted array is computed in $O(\log n)$ time as $\text{UpperBound} - \text{LowerBound}$.
4. **Candidate Tracking**: Half-open intervals $[low, high)$ guarantee convergence to the optimal boundary point with zero pointer underflow.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). _Introduction to Algorithms_ (4th ed.), Section 2.3 & Chapter 12. MIT Press.
2. **Bentley, J.** (2000). _Programming Pearls_ (2nd ed.), Column 4: _Writing Correct Programs_. Addison-Wesley.
3. **Stepanov, A., & Lee, M.** (1995). _The Standard Template Library (STL)_. HP Laboratories Technical Report.
