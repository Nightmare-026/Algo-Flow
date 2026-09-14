# Part 04: Searching — Module 01: Linear & Binary Search

> **Topics Covered:**  
> 49. Linear Search (Sequential Search & Sentinel Optimization) &bull; 50. Binary Search (Logarithmic Divide-and-Conquer Search)

---

Search algorithms represent computing's most fundamental query primitives, answering whether a target entity exists within a collection and identifying its precise location. The architectural approach to search hinges directly on the ordering invariants of the underlying data. Across unordered collections, exhaustive linear scanning is mathematically optimal without pre-indexing. When a collection is sorted, however, order permits the elimination of exponential fractions of the search space in each step. This chapter analyzes sequential linear search, sentinel loop optimizations, the divide-and-conquer mechanics of binary search, arithmetic integer overflow prevention, and formal loop invariants.

### Learning Objectives
- Formulate the fundamental search problem across arbitrary versus monotonically ordered sequences.
- Implement linear search and apply the sentinel optimization technique to eliminate per-iteration boundary checks.
- Master binary search's invariant-driven search interval halving and prevent 32-bit signed integer overflow.
- Derive the formal logarithmic recurrence $T(n) = T(n/2) + O(1) \implies \Theta(\log n)$ using the Master Theorem.
- Trace binary search executions step-by-step using interval contraction state tracking.

---

## Topic 49: Linear Search (Sequential Scanning)

### 1. Problem Definition & Operational Mechanics

Given an arbitrary array $A$ containing $n$ elements, determine whether a specified `target` value exists in $A$. If found, return its zero-based index $i$; otherwise, return $-1$.

Linear Search inspects every cell sequentially from index $0$ to $n - 1$:
- **Preconditions**: **Zero**. Works across completely unordered collections, linked lists, files, and input streams.
- **Decision Contract**: Halts immediately on the first matching element.

#### Sequential Scan Trace: Target $= 42$ in $A = [17, 89, 42, 05, 63]$

| Search Step | Inspected Index ($i$) | Element Value $A[i]$ | Comparison vs Target ($42$) | Search State / Action Taken |
| :---: | :---: | :---: | :---: | :--- |
| **1** | `0` | `17` | $17 \ne 42$ | Mismatch $\implies$ Advance index to $1$ |
| **2** | `1` | `89` | $89 \ne 42$ | Mismatch $\implies$ Advance index to $2$ |
| **3** | `2` | `42` | $42 == 42$ | **MATCH FOUND! Return Index 2** |

---

### 2. Algorithmic Invariants & Complexity

- **Loop Invariant**: At the beginning of iteration $i$, the target element is guaranteed not to exist in the prefix subarray $A[0 \dots i - 1]$.
- **Time Complexity**:
  - **Best Case**: $\Theta(1)$ (Target is located at index $0$).
  - **Average Case**: $\Theta(n / 2) = \Theta(n)$ (Assuming uniform probability distribution).
  - **Worst Case**: $\Theta(n)$ (Target is at index $n - 1$ or entirely absent).
- **Auxiliary Space**: $\Theta(1)$ (Only scalar iteration counter $i$).

---

### 3. Systems Optimization: Sentinel Linear Search

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

### 1. Conceptual Architecture & The Ordering Invariant

When an array is strictly sorted in non-decreasing order ($A[0] \le A[1] \le \dots \le A[n-1]$), we can test the central element ($A[\text{mid}]$). If the target does not match $A[\text{mid}]$, order guarantees that an entire half of the remaining elements can be discarded immediately.

```
Initial Window:  [ 2, 5, 8, 12, 16, 23, 38, 56, 72, 91 ] (Target = 23)
                   ^              ^                  ^
                  low            mid                high
                  A[mid] = 16 < 23 -> Discard left half entirely!

Next Window:     [ 23, 38, 56, 72, 91 ]
                   ^       ^        ^
                  low     mid      high
                  A[mid] = 56 > 23 -> Discard right half entirely!

Final Window:    [ 23, 38 ] -> mid = 5: A[5] = 23 == Target Found!
```

> **Interactive Simulation**:  
> Step through interval contractions live in the [Interactive Binary Search Simulator](/visualizer/binary-search).

---

### 2. Implementation & The Integer Overflow Bug

```text
FUNCTION BinarySearch(A: Array of Element, n: Integer, target: Element) -> Integer:
    low <- 0
    high <- n - 1

    while low <= high:
        // Midpoint calculation avoiding integer overflow
        mid <- low + (high - low) / 2

        if A[mid] == target:
            return mid
        else if A[mid] < target:
            low <- mid + 1
        else:
            high <- mid - 1

    return -1
```

> ⚠️ **The Classic 32-Bit Integer Overflow Bug**:  
> In many legacy textbooks, the midpoint formula is written as:  
> `mid = (low + high) / 2`  
> In modern architectures processing large arrays ($n > 10^9$), if `low + high` exceeds $2^{31} - 1$ ($2,147,483,647$), 32-bit signed addition overflows into a negative number, resulting in a negative array index and an instant runtime crash!  
> **The Mathematically Sound Formula**:  
> $$\text{mid} = \text{low} + \left\lfloor \frac{\text{high} - \text{low}}{2} \right\rfloor$$

---

### 3. Step-by-Step Interval Contraction Trace

Searching for `target = 23` in $A = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]$ ($n = 10$):

| Iteration | `low` | `high` | Calculated `mid` | Inspected Value $A[\text{mid}]$ | Comparison vs Target ($23$) | Search Window Update Action |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **1** | `0` | `9` | $0 + \lfloor (9-0)/2 \rfloor = 4$ | `16` | $16 < 23$ | Discard left half $\implies \text{low} \leftarrow 4 + 1 = 5$ |
| **2** | `5` | `9` | $5 + \lfloor (9-5)/2 \rfloor = 7$ | `56` | $56 > 23$ | Discard right half $\implies \text{high} \leftarrow 7 - 1 = 6$ |
| **3** | `5` | `6` | $5 + \lfloor (6-5)/2 \rfloor = 5$ | `23` | $23 == 23$ | **Target Located! Return Index 5** |

---

### 4. Mathematical Complexity Proof

At each iteration, the remaining search window is halved:
- Initial interval size: $n$
- After iteration 1: $n / 2$
- After iteration 2: $n / 4 = n / 2^2$
- After iteration $k$: $n / 2^k$

The algorithm terminates when the search interval size is reduced to 1 element ($n / 2^k = 1$):

$$2^k = n \implies k = \log_2 n$$

$$T(n) = T(n / 2) + O(1) \implies T(n) = \Theta(\log n) \quad \blacksquare$$

#### Scaling Differential: Linear vs. Binary Search Comparisons

| Collection Size ($n$) | Linear Search (Worst-Case Comparisons) | Binary Search (Worst-Case Comparisons $\lceil \log_2 n \rceil$) |
| :---: | :---: | :---: |
| **$1,000$** | $1,000$ | **$10$** |
| **$1,000,000$** ($10^6$) | $1,000,000$ | **$20$** |
| **$1,000,000,000$** ($10^9$) | $1,000,000,000$ ($\approx 1\text{ second}$) | **$30$** ($\approx 30\text{ nanoseconds}$) |

---

### 5. Key Takeaways

1. **Unsorted Generality**: Linear search requires zero preconditions, operating across arbitrary streams in $\Theta(n)$ time.
2. **Sentinel Optimization**: Placing a temporary copy of the target at array end eliminates the `i < n` loop boundary branch.
3. **Logarithmic Scaling**: Binary search halves the remaining search space at every comparison, achieving $\Theta(\log n)$ performance across sorted containers.
4. **Overflow Prevention**: Always compute midpoint as $\text{low} + \lfloor (\text{high} - \text{low}) / 2 \rfloor$ to avoid signed integer wraparound.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Section 2.3 & Chapter 12. MIT Press.
2. **Bentley, J.** (2000). *Programming Pearls* (2nd ed.), Column 4: *Writing Correct Programs*. Addison-Wesley.
3. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 6.2: *Searching by Comparison of Keys*. Addison-Wesley.
4. **Bloch, J.** (2006). *Extra, Extra - Read All About It: Nearly All Binary Searches and Mergesorts are Broken*. Google Research Blog.
