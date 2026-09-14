# Part 05: Sorting — Module 01: Elementary $O(n^2)$ Sorting Algorithms

> **Topics Covered:**  
> 50. Bubble Sort (Adjacent Comparisons & Early Exit Optimization) &bull; 51. Selection Sort (Prefix Selection & Instability) &bull; 52. Insertion Sort (Adaptive Shifting & Online Sorting)

---

Elementary sorting algorithms—Bubble Sort, Selection Sort, and Insertion Sort—form the pedagogical bedrock of computational order. While all three exhibit quadratic $O(n^2)$ worst-case time bounds, their internal mechanics represent fundamentally distinct algorithmic paradigms: local inversion elimination, prefix selection invariants, and adaptive incremental insertion. Analyzing these algorithms uncovers foundational concepts that govern all sorting theory, including inversion counts, memory write minimization, stability preservation, and cache locality. Furthermore, Insertion Sort's exceptional efficiency on nearly sorted data makes it the indispensable base-case engine powering modern hybrid production sorts such as Timsort and Introsort.

### Learning Objectives
- Formulate the mechanics, loop invariants, and early-exit termination condition of Bubble Sort.
- Prove why adjacent transposition algorithms eliminate exactly one inversion per swap.
- Analyze Selection Sort's $O(n)$ minimal write guarantee and prove its inherent instability through formal counterexamples.
- Implement Insertion Sort and derive its adaptive $O(n + I)$ runtime as a function of the input inversion count $I$.
- Compare the three elementary sorting paradigms across comparison bounds, swap operations, stability, and adaptive execution.
- Evaluate why Insertion Sort remains the standard base-case sort in production runtimes for small partitions ($n \le 32$).

---

## Topic 50: Bubble Sort (Adjacent Transpositions)

### 1. Mathematical Foundations & Inversion Elimination

Given an array $A = [a_0, a_1, \dots, a_{n-1}]$ of $n$ elements, the sorting problem requires finding a permutation $\pi$ such that:

$$A[\pi(0)] \le A[\pi(1)] \le \dots \le A[\pi(n-1)]$$

The degree of disorder in an array is formally quantified by its **inversion count** $I(A)$:

$$I(A) = |\{ (i, j) \mid 0 \le i < j < n \text{ and } A[i] > A[j] \}|$$

- A strictly sorted array has $I(A) = 0$.
- A strictly reverse-sorted array of distinct elements has the maximum possible inversions:
  $$I_{\max} = \sum_{i=0}^{n-1} i = \frac{n(n-1)}{2}$$

> **Theorem (Adjacent Inversion Transposition):**  
> Swapping two adjacent elements $A[j]$ and $A[j+1]$ where $A[j] > A[j+1]$ reduces the total inversion count $I(A)$ by **exactly one**, without altering the inversion status of any other pair in the array.

Bubble Sort is the direct physical realization of this theorem. It repeatedly sweeps across the array, comparing adjacent pairs $(A[j], A[j+1])$, and transposes them whenever they violate non-decreasing order. In each pass $i$ ($0 \le i < n - 1$), the largest unsorted element "bubbles up" to its final resting position at the rightmost available index $n - 1 - i$.

---

### 2. Trace of Pass 0: Bubbling the Maximum Element

Consider the unsorted array $A = [5, 1, 4, 2, 8]$ of size $n = 5$. The table below tracks the adjacent comparisons and transpositions during Pass 0 ($i = 0$):

| Inner Step $j$ | Inspected Pair $(A[j], A[j+1])$ | Out of Order? ($A[j] > A[j+1]$) | Transposition Action | Inversion Eliminated | Resulting Array State | Status |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **`0`** | $(5, 1)$ | **True** ($5 > 1$) | Swap $A[0] \leftrightarrow A[1]$ | $(5, 1)$ | $[1, 5, 4, 2, 8]$ | Adjacent swap performed |
| **`1`** | $(5, 4)$ | **True** ($5 > 4$) | Swap $A[1] \leftrightarrow A[2]$ | $(5, 4)$ | $[1, 4, 5, 2, 8]$ | Adjacent swap performed |
| **`2`** | $(5, 2)$ | **True** ($5 > 2$) | Swap $A[2] \leftrightarrow A[3]$ | $(5, 2)$ | $[1, 4, 2, 5, 8]$ | Adjacent swap performed |
| **`3`** | $(5, 8)$ | **False** ($5 \le 8$) | None (Preserve order) | None | $[1, 4, 2, 5, \mathbf{8}]$ | Element `8` locked at index `4` |

At the conclusion of Pass 0, the global maximum value `8` is guaranteed to be locked into index $n - 1 = 4$. Subsequent passes can safely ignore this suffix.

---

### 3. Early-Exit Optimization

In its naive formulation, Bubble Sort executes $\frac{n(n-1)}{2}$ comparisons regardless of input order. However, if an entire inner pass completes without performing a single swap, then $A[j] \le A[j+1]$ held true for every pair. By mathematical induction, the entire array is sorted. 

By introducing a boolean flag `swapped`, the algorithm terminates early in $O(n)$ time when provided an already-sorted or nearly-sorted array:

| Pass $i$ | Unsorted Boundary $j \in [0, n - 2 - i]$ | Inner Comparisons | Swaps | Array State at End of Pass | `swapped` Flag | Control Flow Outcome |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **`0`** | $j \in [0, 3]$ | $(5,1), (5,4), (5,2), (5,8)$ | 3 | $[1, 4, 2, 5, \mathbf{8}]$ | **`True`** | Continue to Pass 1 |
| **`1`** | $j \in [0, 2]$ | $(1,4), (4,2), (4,5)$ | 1 | $[1, 2, 4, \mathbf{5}, \mathbf{8}]$ | **`True`** | Continue to Pass 2 |
| **`2`** | $j \in [0, 1]$ | $(1,2), (2,4)$ | 0 | $[1, 2, \mathbf{4}, \mathbf{5}, \mathbf{8}]$ | **`False`** | **Early Exit Triggered! (Break)** |

The algorithm completes in 3 passes rather than the naive 4 passes, avoiding unnecessary quadratic overhead.

---

### 4. Canonical Algorithm: Bubble Sort with Early Exit

```text
FUNCTION BubbleSort(A: Array of Element, n: Integer) -> Array of Element:
    FOR i <- 0 TO n - 2 DO
        swapped <- False

        FOR j <- 0 TO n - 2 - i DO
            IF A[j] > A[j + 1] THEN
                temp <- A[j]
                A[j] <- A[j + 1]
                A[j + 1] <- temp
                swapped <- True
            END IF
        END FOR

        // If no swaps occurred, the array is already sorted
        IF NOT swapped THEN
            BREAK
        END IF
    END FOR

    RETURN A
```

#### Complexity & Invariant Analysis:
- **Loop Invariant:** At the start of pass $i$, the suffix subarray $A[n - i \dots n - 1]$ contains the $i$ largest elements of $A$ in fully sorted order, and every element in the suffix is $\ge$ every element in the prefix $A[0 \dots n - 1 - i]$.
- **Best-Case Time Complexity:** $\Theta(n)$. When the array is already sorted, Pass 0 executes $n - 1$ comparisons, performs $0$ swaps, observes `swapped == False`, and breaks immediately.
- **Worst-Case Time Complexity:** $\Theta(n^2)$. When the array is reverse-sorted, the number of comparisons and swaps is:
  $$\sum_{i=0}^{n-2} (n - 1 - i) = \frac{n(n-1)}{2} = \Theta(n^2)$$
- **Average-Case Time Complexity:** $\Theta(n^2)$ comparisons and $\Theta(n^2)$ swaps (an average random permutation has $n(n-1)/4$ inversions).
- **Space Complexity:** $\Theta(1)$ auxiliary memory (strictly in-place).
- **Stability:** **Stable**. The condition $A[j] > A[j+1]$ uses a strict inequality; identical elements are never swapped, preserving their initial relative order.

---

## Topic 51: Selection Sort (Prefix Selection & Instability)

### 1. Architectural Concept & The Prefix Invariant

Selection Sort structures the sorting process into two distinct memory partitions:
1. A **sorted prefix** occupying indices $A[0 \dots i - 1]$.
2. An **unsorted suffix** occupying indices $A[i \dots n - 1]$.

In each pass $i$ ($0 \le i \le n - 2$), the algorithm scans the entire unsorted suffix to locate the minimum element, and performs a single swap placing that minimum element at index $i$. This increments the sorted prefix boundary by one.

Unlike Bubble Sort, which executes numerous intermediate swaps to transport values, Selection Sort isolates the search phase from the mutation phase: it performs $O(n)$ comparisons to identify the minimum, but executes **at most one swap per outer loop iteration**.

---

### 2. Step-by-Step Execution Trace

Sorting $A = [64, 25, 12, 22, 11]$ of size $n = 5$:

| Pass $i$ | Sorted Prefix $A[0 \dots i - 1]$ | Unsorted Suffix $A[i \dots n - 1]$ | Minimum Candidate Found | Swap Operation | Array Snapshot Post-Pass | Prefix Status |
| :---: | :---: | :---: | :---: | :---: | :---: | :--- |
| **`0`** | $\emptyset$ | $[64, 25, 12, 22, 11]$ | Value `11` at index `4` | $A[0] \leftrightarrow A[4]$ ($64 \leftrightarrow 11$) | $[\mathbf{11}, 25, 12, 22, 64]$ | Prefix $[11]$ sorted |
| **`1`** | $[11]$ | $[25, 12, 22, 64]$ | Value `12` at index `2` | $A[1] \leftrightarrow A[2]$ ($25 \leftrightarrow 12$) | $[\mathbf{11}, \mathbf{12}, 25, 22, 64]$ | Prefix $[11, 12]$ sorted |
| **`2`** | $[11, 12]$ | $[25, 22, 64]$ | Value `22` at index `3` | $A[2] \leftrightarrow A[3]$ ($25 \leftrightarrow 22$) | $[\mathbf{11}, \mathbf{12}, \mathbf{22}, 25, 64]$ | Prefix $[11, 12, 22]$ sorted |
| **`3`** | $[11, 12, 22]$ | $[25, 64]$ | Value `25` at index `3` | $A[3] \leftrightarrow A[3]$ (Self-swap / No-op) | $[\mathbf{11}, \mathbf{12}, \mathbf{22}, \mathbf{25}, \mathbf{64}]$ | All elements sorted |

Total comparisons performed: $4 + 3 + 2 + 1 = 10$. Total write operations (swaps): 3.

---

### 3. Canonical Algorithm: Selection Sort

```text
FUNCTION SelectionSort(A: Array of Element, n: Integer) -> Array of Element:
    FOR i <- 0 TO n - 2 DO
        minIdx <- i

        // Scan unsorted suffix to locate minimum element
        FOR j <- i + 1 TO n - 1 DO
            IF A[j] < A[minIdx] THEN
                minIdx <- j
            END IF
        END FOR

        // Swap minimum element into current prefix slot
        IF minIdx != i THEN
            temp <- A[i]
            A[i] <- A[minIdx]
            A[minIdx] <- temp
        END IF
    END FOR

    RETURN A
```

---

### 4. Complexity & The Minimal-Write Guarantee

Selection Sort exhibits unique performance characteristics:
- **Time Complexity:** Strictly $\Theta(n^2)$ in **all cases** (best, average, and worst). The inner loop must scan every remaining unsorted position to verify that no smaller element exists. It cannot adapt to pre-existing order.
  $$C(n) = \sum_{i=0}^{n-2} (n - 1 - i) = \frac{n(n-1)}{2} = \Theta(n^2)$$
- **Space Complexity:** $\Theta(1)$ auxiliary memory.
- **Write Complexity (Swaps):** At most $n - 1$ swaps. 
  > **Hardware Significance:** In systems where memory write operations are orders of magnitude more expensive than reads—such as embedded EEPROM or flash memory where writes cause physical wear and latency—Selection Sort minimizes bus write traffic compared to Bubble or Insertion Sort.

---

### 5. Proof of Instability

Selection Sort is inherently **unstable**. A sorting algorithm is unstable if it can invert the relative order of duplicate elements.

> **Formal Counterexample:**  
> Let $A = [4_a, 4_b, 2]$ where $4_a$ and $4_b$ have identical key values but distinct original positions ($0 < 1$).

| Pass | Inspected Array | Minimum Element | Swap Executed | Resulting Array | Stability Evaluation |
| :---: | :---: | :---: | :---: | :---: | :--- |
| **Initial** | $[4_a, 4_b, 2]$ | — | — | $[4_a, 4_b, 2]$ | Relative order: $4_a$ precedes $4_b$ |
| **Pass 0** | $[4_a, 4_b, 2]$ | Value `2` at index `2` | $A[0] \leftrightarrow A[2]$ ($4_a \leftrightarrow 2$) | $[2, 4_b, 4_a]$ | Long-distance swap jumps $4_a$ over $4_b$! |
| **Pass 1** | $[2, 4_b, 4_a]$ | Value $4_b$ at index `1` | None ($minIdx = 1$) | $[2, \mathbf{4_b}, \mathbf{4_a}]$ | **Relative order inverted:** $4_b$ precedes $4_a$ ❌ |

Because the swap transports the minimum element across long distances, duplicate keys are displaced across one another, destroying stability.

---

## Topic 52: Insertion Sort (Adaptive Shifting & Online Sorting)

### 1. Mechanics & Playing Card Analogy

Insertion Sort mirrors the way a human player sorts playing cards in hand. The algorithm partitions the array into a sorted subarray $A[0 \dots i - 1]$ and an unsorted subarray $A[i \dots n - 1]$. 

In each iteration $i$ ($1 \le i < n$):
1. The element $A[i]$ is extracted as the `key`.
2. The algorithm scans backward through the sorted subarray ($j = i - 1$ down to $0$).
3. All elements strictly greater than `key` are shifted one position to the right ($A[j+1] \leftarrow A[j]$).
4. As soon as an element $A[j] \le \text{key}$ is encountered (or the start of the array is reached), the backward scan halts.
5. The `key` is inserted into the vacated slot $A[j+1]$.

The backward scan below illustrates inserting $\text{key} = 3$ into the sorted prefix $[2, 5, 7]$:

| Scan Step $j$ | Inspected Element $A[j]$ | Comparison ($A[j] > \text{key}$) | Action Taken | Array Sub-State |
| :---: | :---: | :---: | :---: | :---: |
| **Extraction** | — | — | Extract $\text{key} = 3$ | $[2, 5, 7, \_]$ |
| **$j = 2$** | `7` | **True** ($7 > 3$) | Shift `7` right to index 3 | $[2, 5, \_, 7]$ |
| **$j = 1$** | `5` | **True** ($5 > 3$) | Shift `5` right to index 2 | $[2, \_, 5, 7]$ |
| **$j = 0$** | `2` | **False** ($2 \le 3$) | Halt backward scan! | $[2, \_, 5, 7]$ |
| **Insertion** | — | — | Insert $\text{key} = 3$ at $A[j+1] = A[1]$ | $[2, \mathbf{3}, 5, 7]$ |

---

### 2. Full Array Trace: Sorting $[8, 3, 5, 2]$

| Pass $i$ | `key` Value | Sorted Prefix Before Pass | Backward Comparisons & Shifts | Vacated Insertion Slot | Array State at End of Pass |
| :---: | :---: | :---: | :--- | :---: | :---: |
| **`1`** | `3` | $[8]$ | Compare `8` ($8 > 3$) $\implies$ shift `8` right | Index `0` | $[3, 8, 5, 2]$ |
| **`2`** | `5` | $[3, 8]$ | Compare `8` ($8 > 5$) $\implies$ shift `8` right; Compare `3` ($3 \le 5$) $\implies$ halt | Index `1` | $[3, 5, 8, 2]$ |
| **`3`** | `2` | $[3, 5, 8]$ | Compare `8`, `5`, `3` (all $> 2$) $\implies$ shift all right | Index `0` | $[2, 3, 5, 8]$ |

---

### 3. Canonical Algorithm: Insertion Sort

```text
FUNCTION InsertionSort(A: Array of Element, n: Integer) -> Array of Element:
    FOR i <- 1 TO n - 1 DO
        key <- A[i]
        j <- i - 1

        // Shift elements of A[0..i-1] that are greater than key to the right
        WHILE j >= 0 AND A[j] > key DO
            A[j + 1] <- A[j]
            j <- j - 1
        END WHILE

        // Place key in its correct sorted location
        A[j + 1] <- key
    END FOR

    RETURN A
```

---

### 4. Complexity & Adaptive Performance

Insertion Sort's performance is strictly tied to the input array's inversion count $I$:

> **Theorem (Insertion Sort Adaptive Complexity):**  
> The number of element shifts executed by Insertion Sort equals the exact number of inversions $I$ in the input array. The total number of comparisons is at most $n - 1 + I$.

- **Best-Case Time Complexity:** $\mathbf{\Theta(n)}$. When the array is already sorted ($I = 0$), the inner condition `A[j] > key` evaluates to `False` on the very first check for every $i$. Exactly $n - 1$ comparisons and $0$ shifts are executed.
- **Worst-Case Time Complexity:** $\mathbf{\Theta(n^2)}$. When the array is reverse sorted, every element must shift past all preceding elements:
  $$\sum_{i=1}^{n-1} i = \frac{n(n-1)}{2} = \Theta(n^2)$$
- **Average-Case Time Complexity:** $\Theta(n^2)$ ($n(n-1)/4$ shifts on average).
- **Space Complexity:** $\Theta(1)$ auxiliary memory (in-place).
- **Stability:** **Stable**. The condition `A[j] > key` strictly shifts elements greater than `key`. If $A[j] = \text{key}$, the while loop halts, placing `key` after the duplicate element and preserving relative order.
- **Online Sorting Property:** Insertion Sort is an **online algorithm**. It can process elements in real time as they arrive from an input stream, maintaining a sorted prefix at every intermediate moment.

---

### 5. Why Insertion Sort Powers Modern Production Hybrids

Despite its quadratic worst-case bound, Insertion Sort is widely deployed inside modern programming language runtimes:

1. **Low Constant Factor ($c$):** Insertion Sort involves no recursive call stack allocations, no dynamic heap buffers, and minimal instructions per iteration. For small arrays ($n \le 16$ to $32$), $c_{\text{insert}} \cdot n^2 < c_{\text{quick}} \cdot n \log n$.
2. **Superior Cache Locality:** The inner loop shifts contiguous memory words backward through the L1 CPU cache. Modern superscalar processors execute these contiguous memory shifts with exceptional memory throughput.
3. **Timsort Integration:** Python (`list.sort()`) and Java (`Arrays.sort()` for objects) use Timsort, which partitions input data into monotonic runs and sorts short chunks using **Binary Insertion Sort** (where binary search determines the insertion slot before shifting).
4. **Introsort Integration:** C++ `std::sort` implements Introsort, which begins with Quicksort, switches to Heapsort if recursion depth exceeds $2 \log n$, and delegates all subarrays smaller than 16 elements to Insertion Sort.

---

## Master Comparison Matrix: Elementary Sorting Algorithms

| Metric | Bubble Sort | Selection Sort | Insertion Sort |
| :--- | :---: | :---: | :---: |
| **Best-Case Time** | $\Theta(n)$ (with flag) | $\Theta(n^2)$ | $\mathbf{\Theta(n)}$ |
| **Average-Case Time** | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(n^2)$ |
| **Worst-Case Time** | $\Theta(n^2)$ | $\Theta(n^2)$ | $\Theta(n^2)$ |
| **Auxiliary Space** | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ |
| **Comparisons (Worst)** | $n(n-1)/2$ | $n(n-1)/2$ | $n(n-1)/2$ |
| **Comparisons (Best)** | $n - 1$ | $n(n-1)/2$ | $n - 1$ |
| **Memory Writes (Worst)** | $3 \cdot \frac{n(n-1)}{2}$ | $\mathbf{3(n - 1)}$ | $\frac{n(n-1)}{2} + 2(n - 1)$ |
| **Stability** | **Stable** | **Unstable** | **Stable** |
| **Adaptive to Pre-Sorted?** | Yes ($O(n)$ best) | No (Always $\Theta(n^2)$) | **Yes ($O(n + I)$)** |
| **Online Data Stream?** | No | No | **Yes** |
| **Primary Production Role** | Pedagogical instruction | Hardware with expensive writes | Small partitions in Timsort/Introsort |

---

## Module 01 Summary & Key Takeaways

1. **Inversion Counting:** An inversion is any pair $(i, j)$ where $i < j$ and $A[i] > A[j]$. An array is sorted if and only if $I(A) = 0$. Swapping adjacent inverted elements removes exactly one inversion.
2. **Bubble Sort Invariant:** Each pass transports the largest remaining unsorted value to the end of the array. An early-exit boolean flag (`swapped`) detects when $I = 0$ in Pass 0, yielding an optimal $\Theta(n)$ best case.
3. **Selection Sort Write Minimization:** Selection Sort separates comparison from mutation, executing at most $n - 1$ swaps. While strictly $\Theta(n^2)$ in time and inherently unstable due to long-distance swaps, it minimizes write endurance wear on EEPROM/Flash architectures.
4. **Insertion Sort Adaptivity:** Insertion Sort's runtime is proportional to the number of inversions: $O(n + I)$. For nearly sorted sequences ($I = O(n)$), it completes in linear time.
5. **Modern Hybrid Sorting:** Modern production sorting algorithms (Timsort, Introsort) delegate partitions where $n \le 32$ to Insertion Sort, capitalizing on its low instruction overhead and high cache locality.

---

## References & Academic Attribution

1. **Knuth, D. E.** (1998). *The Art of Computer Programming, Volume 3: Sorting and Searching* (2nd ed.), Section 5.2.1: Sorting by Insertion & Section 5.2.2: Sorting by Exchanging. Addison-Wesley.
2. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 2: Getting Started (Insertion Sort analysis & loop invariants). MIT Press.
3. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 2.1: Elementary Sorts. Addison-Wesley.
4. **Peters, T.** (2002). *Timsort Description*. Python Software Foundation. Available at: https://github.com/python/cpython/blob/main/Objects/listsort.txt.

