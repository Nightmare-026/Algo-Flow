# Part 04: Searching — Module 02: Lower Bound, Upper Bound & Element Occurrences

> **Topics Covered:**  
> 51. Binary Search Invariants & Interval Models &bull; 52. Lower Bound Algorithm ($A[i] \ge \text{target}$) &bull; Upper Bound Algorithm ($A[i] > \text{target}$) &bull; 53. First and Last Occurrences & Frequency Counting in $O(\log n)$

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

A significant portion of binary search bugs—including infinite loops, off-by-one errors, and array boundary violations—stem from mixing interval models. A production implementation must maintain strict consistency across its loop condition and pointer updates:

| Interval Model | Mathematical Window | Loop Invariant Condition | Left Pointer Update | Right Pointer Update | Post-Loop Termination State |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Model 1: Closed Interval** | $[low, high]$ | `while low <= high:` | $low \leftarrow mid + 1$ | $high \leftarrow mid - 1$ | $low = high + 1$ |
| **Model 2: Half-Open Interval**| $[low, high)$ | `while low < high:` | $low \leftarrow mid + 1$ | $high \leftarrow mid$ | $low = high$ |
| **Model 3: Open Interval** | $(low, high)$ | `while low + 1 < high:`| $low \leftarrow mid$ | $high \leftarrow mid$ | $low + 1 = high$ |

*Standardization Note*: Throughout this chapter, algorithms are formulated under **Model 1 (Closed Interval with Candidate Retention)**, which guarantees safe convergence without boundary-pointer underflow.

---

## Topic 52: Lower Bound & Upper Bound Mathematics

### 1. Lower Bound: Mathematical Definition & Mechanics

Given a sorted array $A$ of $n$ elements in non-decreasing order, the **Lower Bound** of `target` is the **smallest index $i$** such that:

$$A[i] \ge \text{target}$$

If all elements in $A$ are strictly smaller than `target`, the lower bound returns $n$ (representing the theoretical insertion index at the end of the array).

#### Lower Bound Query Matrix ($A = [2, 4, 6, 8, 8, 8, 10, 12]$, $n = 8$)

| Query Target | Evaluated Predicate ($A[i] \ge \text{target}$) | First Qualifying Element | Resulting Index | Algorithmic Rationale |
| :---: | :---: | :---: | :---: | :--- |
| **`8`** | $A[i] \ge 8$ | `8` | **`3`** | First duplicate instance of 8 |
| **`7`** | $A[i] \ge 7$ | `8` | **`3`** | Value 7 absent; 8 is the smallest element $\ge 7$ |
| **`2`** | $A[i] \ge 2$ | `2` | **`0`** | First element satisfies condition |
| **`15`** | $A[i] \ge 15$ | None | **`8` ($n$)** | All elements $< 15$; returns array length |

#### Canonical Lower Bound Implementation:
```text
FUNCTION LowerBound(A: Array of Element, n: Integer, target: Element) -> Integer:
    low <- 0
    high <- n - 1
    ans <- n                    // Default if all elements < target

    while low <= high:
        mid <- low + (high - low) / 2
        if A[mid] >= target:
            ans <- mid          // Candidate found; search left for earlier occurrence
            high <- mid - 1
        else:
            low <- mid + 1      // A[mid] too small; search right half

    return ans
```

---

### 2. Upper Bound: Mathematical Definition & Mechanics

Given a sorted array $A$ of $n$ elements in non-decreasing order, the **Upper Bound** of `target` is the **smallest index $i$** such that:

$$A[i] > \text{target}$$

If no element in $A$ is strictly greater than `target`, the upper bound returns $n$.

#### Upper Bound Query Matrix ($A = [2, 4, 6, 8, 8, 8, 10, 12]$, $n = 8$)

| Query Target | Evaluated Predicate ($A[i] > \text{target}$) | First Qualifying Element | Resulting Index | Algorithmic Rationale |
| :---: | :---: | :---: | :---: | :--- |
| **`8`** | $A[i] > 8$ | `10` | **`6`** | First element strictly greater than 8 |
| **`5`** | $A[i] > 5$ | `6` | **`2`** | Smallest element strictly greater than 5 |
| **`12`** | $A[i] > 12$ | None | **`8` ($n$)** | No elements $> 12$; returns array length |

#### Canonical Upper Bound Implementation:
```text
FUNCTION UpperBound(A: Array of Element, n: Integer, target: Element) -> Integer:
    low <- 0
    high <- n - 1
    ans <- n                    // Default if no element > target

    while low <= high:
        mid <- low + (high - low) / 2
        if A[mid] > target:
            ans <- mid          // Candidate found; search left for smaller index
            high <- mid - 1
        else:
            low <- mid + 1      // A[mid] <= target; search right half

    return ans
```

---

## Topic 53: Element Occurrences & Frequency Counting

### 1. The $O(\log n)$ Range Extraction Theorem

In an unsorted array, counting the occurrences of a value requires a full linear scan ($\Theta(n)$ time). In a sorted array, duplicate elements form an unbroken contiguous subarray:

$$\text{First Occurrence Index} = \text{LowerBound}(A, n, \text{target})$$

$$\text{Last Occurrence Index} = \text{UpperBound}(A, n, \text{target}) - 1$$

$$\text{Total Count}(\text{target}) = \text{UpperBound}(A, n, \text{target}) - \text{LowerBound}(A, n, \text{target})$$

#### Existence Verification Rule:
The target exists in array $A$ if and only if:
$$\text{firstIdx} < n \quad \text{and} \quad A[\text{firstIdx}] == \text{target}$$

---

### 2. Step-by-Step Range Trace: Target $= 8$ in $A = [2, 4, 6, 8, 8, 8, 10, 12]$

| Sub-Algorithm | `low` | `high` | `mid` | $A[\text{mid}]$ | Predicate Evaluation | Window Update |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **Lower Bound Pass** | `0` | `7` | `3` | `8` | $8 \ge 8$ (True) $\implies \text{ans} = 3$ | $\text{high} \leftarrow 3 - 1 = 2$ |
| | `0` | `2` | `1` | `4` | $4 \ge 8$ (False) | $\text{low} \leftarrow 1 + 1 = 2$ |
| | `2` | `2` | `2` | `6` | $6 \ge 8$ (False) | $\text{low} \leftarrow 2 + 1 = 3$ |
| | **Terminates** | | | | **LowerBound Result** | **`ans = 3`** |
| **Upper Bound Pass** | `0` | `7` | `3` | `8` | $8 > 8$ (False) | $\text{low} \leftarrow 3 + 1 = 4$ |
| | `4` | `7` | `5` | `8` | $8 > 8$ (False) | $\text{low} \leftarrow 5 + 1 = 6$ |
| | `6` | `7` | `6` | `10` | $10 > 8$ (True) $\implies \text{ans} = 6$ | $\text{high} \leftarrow 6 - 1 = 5$ |
| | **Terminates** | | | | **UpperBound Result** | **`ans = 6`** |

#### Operational Output:
- **First Occurrence**: Index $3$ ($A[3] = 8$)
- **Last Occurrence**: $\text{UpperBound} - 1 = 6 - 1 = 5$ ($A[5] = 8$)
- **Total Frequency**: $6 - 3 = 3$ instances of value 8!
- **Total Time**: Two binary searches $\implies 2 \times O(\log n) = \mathbf{O(\log n)}$.

---

### 3. Dedicated First and Last Occurrence Functions

When only one boundary is required, dedicated functions avoid invoking two separate passes:

```text
FUNCTION FirstOccurrence(A: Array of Element, n: Integer, target: Element) -> Integer:
    low <- 0
    high <- n - 1
    ans <- -1

    while low <= high:
        mid <- low + (high - low) / 2
        if A[mid] == target:
            ans <- mid
            high <- mid - 1    // Contract right boundary to search earlier indices
        else if A[mid] < target:
            low <- mid + 1
        else:
            high <- mid - 1

    return ans

FUNCTION LastOccurrence(A: Array of Element, n: Integer, target: Element) -> Integer:
    low <- 0
    high <- n - 1
    ans <- -1

    while low <= high:
        mid <- low + (high - low) / 2
        if A[mid] == target:
            ans <- mid
            low <- mid + 1     // Contract left boundary to search later indices
        else if A[mid] < target:
            low <- mid + 1
        else:
            high <- mid - 1

    return ans
```

---

### 4. Key Takeaways

1. **Predicate Distinction**: Lower Bound uses a non-strict inequality ($A[i] \ge \text{target}$); Upper Bound uses a strict inequality ($A[i] > \text{target}$).
2. **Fallback Index**: If no element satisfies the predicate, both Lower and Upper Bound return $n$ (the valid insertion position).
3. **Range Counting**: The exact frequency of any element in a sorted array is computed in $O(\log n)$ time as $\text{UpperBound} - \text{LowerBound}$.
4. **Candidate Tracking**: Initializing `ans = n` and contracting the active window when a candidate is identified guarantees safe convergence without off-by-one errors.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Section 2.3 & Chapter 12. MIT Press.
2. **Bentley, J.** (2000). *Programming Pearls* (2nd ed.), Column 4: *Writing Correct Programs*. Addison-Wesley.
3. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 6.2: *Searching by Comparison of Keys*. Addison-Wesley.
4. **Stepanov, A., & Lee, M.** (1995). *The Standard Template Library (STL)*. HP Laboratories Technical Report.
