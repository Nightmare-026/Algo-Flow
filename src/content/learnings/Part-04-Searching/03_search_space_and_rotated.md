# Part 04: Searching — Module 03: Rotated Arrays & Binary Search on Answer Space

> **Topics Covered:**  
> 54. Search in Rotated Sorted Array & Pivot Identification &bull; 55. Binary Search on Monotonic Answer Space (Optimization Problems)

---

When data deviates from simple linear contiguous ordering—through circular rotation or continuous monotonic function landscapes—binary search retains its logarithmic power through invariant preservation. In circularly shifted arrays, ordering is not destroyed but partitioned into piecewise monotonic segments where at least one half is always strictly sorted. Beyond physical arrays, binary search generalizes into an optimization engine capable of determining optimal capacities, thresholds, and allocations by querying monotonic feasibility predicates $P(x)$. This chapter formalizes circular rotation mechanics, pivot identification, duplicate key degradation, and the transformation of complex minimax optimization problems into binary search on answer spaces.

### Learning Objectives

- Formulate the half-sorted structural invariant of circularly rotated sorted arrays.
- Implement $O(\log n)$ target search across rotated sequences by identifying sorted partitions and testing target inclusion boundaries.
- Develop pivot identification algorithms to locate the minimum element and compute the circular rotation factor $k$.
- Analyze the worst-case degradation to $O(n)$ when handling duplicate elements in rotated arrays and apply duplicate elimination rules.
- Generalize binary search to discrete and continuous monotonic answer spaces via feasibility predicate testing ($P(x) \implies P(x+1)$).
- Apply binary search on answer space to solve canonical optimization problems including ship packaging capacity, allocation of pages, and aggressive cows.

---

## Topic 54: Search in Rotated Sorted Array & Pivot Identification

### 1. Mathematical Foundations & Circular Rotation

Let $S = [s_0, s_1, \dots, s_{n-1}]$ be an array of $n$ distinct elements sorted in strictly ascending order such that $s_0 < s_1 < \dots < s_{n-1}$. A circular right rotation by $k$ positions ($0 \le k < n$) maps each element at index $i$ to index $(i + k) \bmod n$. The resulting rotated array $A$ consists of two strictly increasing contiguous subarrays separated by a single point of discontinuity: the **pivot element** (the minimum element of the array).

The table below illustrates a circular rotation of $S = [0, 1, 2, 4, 5, 6, 7]$ by $k = 4$ positions:

| Array Index ($i$) | Original Value $S[i]$ | Rotated Value $A[i]$ ($k = 4$) |  Subarray Partition   | Monotonic Property | Structural Role                      |
| :---------------: | :-------------------: | :----------------------------: | :-------------------: | :----------------: | :----------------------------------- |
|      **`0`**      |          `0`          |              `4`               | Left Segment ($A_1$)  |   $A[0] < A[1]$    | Left Segment Start                   |
|      **`1`**      |          `1`          |              `5`               | Left Segment ($A_1$)  |   $A[1] < A[2]$    | Interior Element                     |
|      **`2`**      |          `2`          |              `6`               | Left Segment ($A_1$)  |   $A[2] < A[3]$    | Interior Element                     |
|      **`3`**      |          `4`          |              `7`               | Left Segment ($A_1$)  |   $A[3] > A[4]$    | **Local Maximum (Pre-Pivot)**        |
|      **`4`**      |          `5`          |              `0`               | Right Segment ($A_2$) |   $A[4] < A[5]$    | **Global Minimum (Pivot Index $k$)** |
|      **`5`**      |          `6`          |              `1`               | Right Segment ($A_2$) |   $A[5] < A[6]$    | Interior Element                     |
|      **`6`**      |          `7`          |              `2`               | Right Segment ($A_2$) |   $A[6] < A[0]$    | Right Segment End                    |

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Structural Topologies: Rotated Array Discontinuity &amp; Monotonic Answer Space
  </div>
  <svg viewBox="0 0 850 360" class="w-full h-auto text-xs" style="max-height: 360px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="rotArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="320" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Left: Rotated Array Discontinuity Curve -->
    <g transform="translate(45, 45)">
      <text x="175" y="20" font-weight="700" fill="#3b82f6" text-anchor="middle" font-size="13">Piecewise Monotonic Rotated Array</text>
      <!-- Coordinate System -->
      <g transform="translate(25, 40)">
        <line x1="0" y1="180" x2="310" y2="180" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.3"/>
        <line x1="0" y1="0" x2="0" y2="180" stroke="currentColor" stroke-width="1.5" stroke-opacity="0.3"/>
        <!-- Segment 1: Indices 0..3 (Values 4..7) -->
        <polyline points="20,110 50,90 80,70 110,40" fill="none" stroke="#3b82f6" stroke-width="3"/>
        <!-- Points on Segment 1 -->
        <circle cx="20" cy="110" r="4" fill="#3b82f6"/>
        <text x="20" y="130" text-anchor="middle" font-size="9" fill="currentColor">i=0 (4)</text>
        <circle cx="110" cy="40" r="4" fill="#3b82f6"/>
        <text x="110" y="30" text-anchor="middle" font-size="9" font-weight="700" fill="#3b82f6">Local Max (7)</text>
        <!-- The Cliff Discontinuity Line -->
        <line x1="110" y1="40" x2="160" y2="175" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,4"/>
        <text x="150" y="95" fill="#ef4444" font-weight="700" font-size="10">Discontinuity Pivot</text>
        <!-- Segment 2: Indices 4..6 (Values 0..2) -->
        <polyline points="160,175 210,155 260,135" fill="none" stroke="#10b981" stroke-width="3"/>
        <circle cx="160" cy="175" r="5" fill="#ef4444"/>
        <text x="160" y="200" text-anchor="middle" font-size="9" font-weight="700" fill="#ef4444">Global Min: i=4 (0)</text>
        <circle cx="260" cy="135" r="4" fill="#10b981"/>
        <text x="260" y="125" text-anchor="middle" font-size="9" fill="currentColor">i=6 (2)</text>
      </g>
    </g>
    <!-- Divider -->
    <line x1="420" y1="40" x2="420" y2="340" stroke="currentColor" stroke-opacity="0.15" stroke-width="1.5"/>
    <!-- Right: Monotonic Feasibility Predicate on Answer Space -->
    <g transform="translate(450, 45)">
      <text x="180" y="20" font-weight="700" fill="#10b981" text-anchor="middle" font-size="13">Binary Search on Monotonic Answer Space</text>
      <!-- Discrete Step Function [F, F, F, F, T, T, T, T] -->
      <g transform="translate(20, 50)">
        <text x="0" y="15" font-weight="700" font-size="11" fill="currentColor">Predicate Feasibility: P(x) = IsFeasible(x)</text>
        <!-- False Region -->
        <rect x="0" y="30" width="140" height="40" rx="4" fill="#ef4444" fill-opacity="0.15" stroke="#ef4444" stroke-width="1.5"/>
        <text x="70" y="55" text-anchor="middle" font-weight="700" fill="#ef4444" font-size="12">FALSE: Infeasible [1..4]</text>
        <!-- Transition Arrow -->
        <path d="M 140 50 L 175 50" stroke="currentColor" stroke-width="2" marker-end="url(#rotArrow)"/>
        <!-- True Region -->
        <rect x="175" y="30" width="150" height="40" rx="4" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1.5"/>
        <text x="250" y="55" text-anchor="middle" font-weight="700" fill="#10b981" font-size="12">TRUE: Feasible [5..10]</text>
        <!-- Optimal Target Indicator -->
        <g transform="translate(175, 90)">
          <path d="M 0 35 L 0 5" stroke="#10b981" stroke-width="2" marker-end="url(#rotArrow)"/>
          <rect x="-80" y="40" width="160" height="45" rx="6" fill="#10b981" fill-opacity="0.12" stroke="#10b981"/>
          <text x="0" y="58" text-anchor="middle" font-weight="700" fill="#10b981">Optimal Minimum x = 5</text>
          <text x="0" y="74" text-anchor="middle" font-size="10" fill="currentColor">First 'True' Boundary</text>
        </g>
      </g>
    </g>
  </svg>
</div>

In this rotated state, every element in the left partition $A_1 = [4, 5, 6, 7]$ is strictly greater than every element in the right partition $A_2 = [0, 1, 2]$. The global minimum element $0$ resides at index $k = 4$, which marks the rotation offset.

---

### 2. The Half-Sorted Invariant

Standard binary search assumes global monotonicity across $[low, high]$. While a rotated array lacks global monotonicity, it satisfies a pivotal structural invariant:

> **The Half-Sorted Invariant:**  
> For any arbitrary index $\text{mid} = \lfloor(low + high) / 2\rfloor$ within a rotated sorted array $[low, high]$, **at least one of the two halves—either $[low, \text{mid}]$ or $[\text{mid}, high]$—is guaranteed to be strictly sorted.**

#### Formal Proof:

1. The entire array contains at most one point of descent (the pivot where $A[i] > A[i+1]$).
2. The midpoint $\text{mid}$ divides the interval $[low, high]$ into two disjoint sub-intervals: $[low, \text{mid}]$ and $[\text{mid}, high]$.
3. The single point of descent can belong to at most one of these two sub-intervals.
4. Therefore, the sub-interval that does not contain the point of descent contains no inversions and must be strictly sorted.

By comparing the boundary values $A[low]$ and $A[\text{mid}]$, we deterministically classify which half is sorted:

- If $A[low] \le A[\text{mid}]$: The left partition $[low, \text{mid}]$ is monotonically sorted.
- If $A[low] > A[\text{mid}]$: The point of descent lies in the left half; therefore, the right partition $[\text{mid}, high]$ is monotonically sorted.

Once the sorted half is identified, determining whether the target resides within its bounds requires a single $O(1)$ range check. If the target falls inside the sorted half, we contract the search window to that half; otherwise, the target must lie in the opposite half.

| Evaluated Midpoint Condition | Sorted Sub-Interval                           | Target Inclusion Condition                                   | Window Contraction Action        | Discarded Search Half           |
| :--------------------------- | :-------------------------------------------- | :----------------------------------------------------------- | :------------------------------- | :------------------------------ |
| $A[low] \le A[\text{mid}]$   | **Left half** $[low, \text{mid}]$ is sorted   | $A[low] \le \text{target} < A[\text{mid}]$                   | $high \leftarrow \text{mid} - 1$ | Right half $[\text{mid}, high]$ |
| $A[low] \le A[\text{mid}]$   | **Left half** $[low, \text{mid}]$ is sorted   | $\text{target} < A[low] \lor \text{target} > A[\text{mid}]$  | $low \leftarrow \text{mid} + 1$  | Left half $[low, \text{mid}]$   |
| $A[low] > A[\text{mid}]$     | **Right half** $[\text{mid}, high]$ is sorted | $A[\text{mid}] < \text{target} \le A[high]$                  | $low \leftarrow \text{mid} + 1$  | Left half $[low, \text{mid}]$   |
| $A[low] > A[\text{mid}]$     | **Right half** $[\text{mid}, high]$ is sorted | $\text{target} < A[\text{mid}] \lor \text{target} > A[high]$ | $high \leftarrow \text{mid} - 1$ | Right half $[\text{mid}, high]$ |

---

### 3. Step-by-Step State Trace

Consider searching for $\text{target} = 0$ in the rotated array $A = [4, 5, 6, 7, 0, 1, 2]$ of size $n = 7$:

| Step  | Search Interval $[low, high]$ | $low$ ($A[low]$) | $high$ ($A[high]$) | $\text{mid}$ ($A[\text{mid}]$) | Half Classification              | Target In Range?            | Pointer Update              | Remaining Candidates |
| :---: | :---------------------------: | :--------------: | :----------------: | :----------------------------: | :------------------------------- | :-------------------------- | :-------------------------- | :------------------: |
| **1** |           $[0, 6]$            |    $0$ (`4`)     |     $6$ (`2`)      |           $3$ (`7`)            | Left $[0..3]$ sorted ($4 \le 7$) | $0 \in [4, 7)$ is **False** | $low \leftarrow 3 + 1 = 4$  |     $[0, 1, 2]$      |
| **2** |           $[4, 6]$            |    $4$ (`0`)     |     $6$ (`2`)      |           $5$ (`1`)            | Left $[4..5]$ sorted ($0 \le 1$) | $0 \in [0, 1)$ is **True**  | $high \leftarrow 5 - 1 = 4$ |        $[0]$         |
| **3** |           $[4, 4]$            |    $4$ (`0`)     |     $4$ (`0`)      |           $4$ (`0`)            | Match found ($A[4] = 0$)         | **Target Found**            | Return index `4`            |      Completed       |

Total comparisons performed: 3 iterations, achieving logarithmic performance $\lceil\log_2 7\rceil = 3$.

---

### 4. Canonical Algorithm: Search in Rotated Sorted Array

```text
FUNCTION SearchRotatedArray(A: Array of Integer, n: Integer, target: Integer) -> Integer:
    low <- 0
    high <- n - 1

    WHILE low <= high DO
        mid <- low + FLOOR((high - low) / 2)

        IF A[mid] = target THEN
            RETURN mid
        END IF

        // Check if the left partition [low..mid] is sorted
        IF A[low] <= A[mid] THEN
            // Left half is sorted; check if target lies within [A[low], A[mid])
            IF A[low] <= target AND target < A[mid] THEN
                high <- mid - 1
            ELSE
                low <- mid + 1
            END IF
        // Otherwise, the right partition [mid..high] must be sorted
        ELSE
            // Right half is sorted; check if target lies within (A[mid], A[high]]
            IF A[mid] < target AND target <= A[high] THEN
                low <- mid + 1
            ELSE
                high <- mid - 1
            END IF
        END IF
    END WHILE

    RETURN -1    // Target not present in array
```

#### Complexity Analysis:

- **Time Complexity:** $O(\log n)$. At each iteration, exactly half of the remaining elements are eliminated from consideration, giving $T(n) = T(n/2) + O(1) \implies O(\log n)$.
- **Space Complexity:** $O(1)$ auxiliary memory; operates strictly in place with constant pointer variables.

---

### 5. Pivot Identification: Locating the Minimum Element

In many applications, we need to locate the pivot index $k$ directly (e.g., to determine how many times an array has been rotated, or to find the minimum value in $O(\log n)$ time).

When searching for the minimum element, we compare $A[\text{mid}]$ directly against the right boundary $A[high]$:

- If $A[\text{mid}] > A[high]$: The minimum element cannot be in $[low, \text{mid}]$; it must reside strictly in $[\text{mid} + 1, high]$. Thus, $low \leftarrow \text{mid} + 1$.
- If $A[\text{mid}] \le A[high]$: The element at $\text{mid}$ could itself be the minimum, or the minimum lies to the left in $[low, \text{mid}]$. Thus, $high \leftarrow \text{mid}$.
- The loop terminates when $low = high$, pointing directly to the minimum element.

#### Trace: Finding Minimum in $A = [4, 5, 6, 7, 0, 1, 2]$

|      Step       | $[low, high]$ | $\text{mid}$ | $A[\text{mid}]$ | $A[high]$ | Comparison ($A[\text{mid}] \text{ vs } A[high]$) | Inferred Pivot Location                   | Pointer Update             |
| :-------------: | :-----------: | :----------: | :-------------: | :-------: | :----------------------------------------------: | :---------------------------------------- | :------------------------- |
|      **1**      |   $[0, 6]$    |     $3$      |       `7`       |    `2`    |                     $7 > 2$                      | Minimum is strictly right of $\text{mid}$ | $low \leftarrow 3 + 1 = 4$ |
|      **2**      |   $[4, 6]$    |     $5$      |       `1`       |    `2`    |                    $1 \le 2$                     | Minimum is at or left of $\text{mid}$     | $high \leftarrow 5$        |
|      **3**      |   $[4, 5]$    |     $4$      |       `0`       |    `1`    |                    $0 \le 1$                     | Minimum is at or left of $\text{mid}$     | $high \leftarrow 4$        |
| **Termination** |   $[4, 4]$    |      —       |        —        |     —     |                 $low = high = 4$                 | Minimum located at index `4` ($A[4] = 0$) | —                          |

The rotation count of the original sorted array is given directly by the pivot index: $\text{rotations} = k = 4$.

---

### 6. Edge Case: Duplicate Elements & Worst-Case Degradation

When an array contains non-distinct duplicate values (e.g., $A = [1, 0, 1, 1, 1]$ or $B = [1, 1, 1, 0, 1]$), the half-sorted test can fail:

$$A[low] = A[\text{mid}] = A[high]$$

In this scenario, it is impossible to deduce whether the discontinuity lies in the left half or the right half based solely on boundary comparisons:

- In $A = [1, 0, 1, 1, 1]$: $A[0]=1, A[2]=1, A[4]=1$. The pivot $0$ is in the **left** half.
- In $B = [1, 1, 1, 0, 1]$: $B[0]=1, B[2]=1, B[4]=1$. The pivot $0$ is in the **right** half.

#### Mitigation Strategy:

When $A[low] = A[\text{mid}] = A[high]$, we cannot safely discard half of the array. Instead, we shrink both boundaries inward:

$$low \leftarrow low + 1, \quad high \leftarrow high - 1$$

| Scenario                           |   Input Array Example   |                      Boundary Status                      | Structural Consequence                       | Worst-Case Complexity |
| :--------------------------------- | :---------------------: | :-------------------------------------------------------: | :------------------------------------------- | :-------------------: |
| **Distinct Elements**              | `[4, 5, 6, 7, 0, 1, 2]` | $A[low] \ne A[\text{mid}]$ or $A[\text{mid}] \ne A[high]$ | Exactly one half is unambiguously sorted     |      $O(\log n)$      |
| **Duplicates (Boundary Distinct)** |  `[2, 2, 2, 3, 4, 2]`   |                $A[low] \ne A[\text{mid}]$                 | Sorted partition clearly identified          |      $O(\log n)$      |
| **Degenerate Duplicates**          | `[1, 1, 1, 0, 1, 1, 1]` |            $A[low] = A[\text{mid}] = A[high]$             | Boundary trimming ($low++, high--$) required |        $O(n)$         |

If all elements in the array are identical except for one (e.g., $[1, 1, \dots, 0, \dots, 1]$), the algorithm trims one element at each step, degrading time complexity to $O(n)$.

---

## Topic 55: Binary Search on Monotonic Answer Space

### 1. The Optimization-to-Decision Transformation

Many advanced algorithmic problems ask for an optimal numerical value rather than searching within a provided array:

- _"Find the **minimum** capacity of a conveyor belt to ship packages within $D$ days."_
- _"Find the **maximum** minimum distance between $k$ cows placed in $n$ stalls."_
- _"Find the **minimum** reading speed to finish $n$ piles of books within $H$ hours."_

These problems belong to the **Minimax / Maximin** optimization family. Direct constructive solutions are often NP-hard or require complex dynamic programming. However, if the underlying physical problem satisfies **Monotonicity**, we can invert the question:

$$\text{Optimization: } \min_{x} \{ x \mid \text{Physical Constraints Satisfied} \} \iff \text{Decision: } \text{Is answer } x \text{ feasible?}$$

#### The Monotonicity Condition:

Let $P(x) \in \{\text{True}, \text{False}\}$ be a validation predicate that checks whether candidate answer $x$ satisfies the problem constraints. A problem exhibits monotonicity over answer space $[\text{min\_val}, \text{max\_val}]$ if the predicate forms a single step-function transition:

- **Minimization Problems (First True):** If capacity $x$ is sufficient, any capacity $x' > x$ is also sufficient:
  $$P(x) = \text{True} \implies P(x + 1) = \text{True}$$
- **Maximization Problems (Last True):** If distance $x$ is achievable, any smaller distance $x' < x$ is also achievable:
  $$P(x) = \text{True} \implies P(x - 1) = \text{True}$$

The table below visualizes the predicate evaluation landscape across a discrete candidate answer space for a minimization problem:

| Candidate Answer ($x$) |          `1`           |          `2`           |          `3`           |          `4`           |           `5`           |    `6`     |    `7`     |    `8`     |    `9`     |    `10`    |
| :--------------------: | :--------------------: | :--------------------: | :--------------------: | :--------------------: | :---------------------: | :--------: | :--------: | :--------: | :--------: | :--------: |
|  **Predicate $P(x)$**  |      **`False`**       |      **`False`**       |      **`False`**       |      **`False`**       |       **`True`**        | **`True`** | **`True`** | **`True`** | **`True`** | **`True`** |
|  **Physical Meaning**  |       Infeasible       |       Infeasible       |       Infeasible       |       Infeasible       |      **Min Valid**      |   Valid    |   Valid    |   Valid    |   Valid    |   Valid    |
|   **Search Action**    | $low \leftarrow x + 1$ | $low \leftarrow x + 1$ | $low \leftarrow x + 1$ | $low \leftarrow x + 1$ | $high \leftarrow x - 1$ |  Discard   |  Discard   |  Discard   |  Discard   |  Discard   |

Because the boolean array $[F, F, F, F, T, T, T, T, T, T]$ is monotonically sorted, binary search locates the boundary value $x = 5$ in $O(\log(\text{range})) \times \text{Cost}(P)$ time.

---

### 2. Algorithmic Templates

#### Template A: Minimization (First True Pattern)

```text
FUNCTION BinarySearchMinimization(minBound: Integer, maxBound: Integer) -> Integer:
    low <- minBound
    high <- maxBound
    ans <- maxBound            // Fallback upper bound

    WHILE low <= high DO
        mid <- low + FLOOR((high - low) / 2)

        IF IsFeasible(mid) THEN
            ans <- mid         // Candidate answer found; try smaller values
            high <- mid - 1
        ELSE
            low <- mid + 1     // mid is insufficient; increase candidate
        END IF
    END WHILE

    RETURN ans
```

#### Template B: Maximization (Last True Pattern)

```text
FUNCTION BinarySearchMaximization(minBound: Integer, maxBound: Integer) -> Integer:
    low <- minBound
    high <- maxBound
    ans <- minBound            // Fallback lower bound

    WHILE low <= high DO
        mid <- low + FLOOR((high - low) / 2)

        IF IsFeasible(mid) THEN
            ans <- mid         // Feasible; try larger values
            low <- mid + 1
        ELSE
            high <- mid - 1    // Infeasible; decrease candidate
        END IF
    END WHILE

    RETURN ans
```

---

### 3. Case Study: Capacity to Ship Packages Within $D$ Days

#### Problem Statement:

A conveyor belt carries $n$ packages with weights $W = [w_0, w_1, \dots, w_{n-1}]$ that must be shipped sequentially within $D$ days. Each day, packages are loaded onto a ship in the given order until loading another package would exceed the ship's weight capacity. Determine the **minimum ship capacity** required to ship all packages within $D$ days.

#### Numerical Instance:

- Packages: $W = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]$ ($n = 10$, total weight $= 55$, max single weight $= 10$).
- Deadline: $D = 5$ days.

#### Derivation of Search Space Bounds:

1. **Lower Bound ($low$):** A ship must at least be able to carry the heaviest individual package:
   $$low = \max_{0 \le i < n} W[i] = 10$$
   If $\text{capacity} < 10$, package $10$ can never be loaded.
2. **Upper Bound ($high$):** A single ship carrying all packages in $1$ day requires:
   $$high = \sum_{i=0}^{n-1} W[i] = 55$$

#### Feasibility Predicate ($O(n)$ Greedy Check):

Given a candidate capacity `cap`, sequentially accumulate weights into the current day. When adding package $w_i$ would exceed `cap`, dispatch the ship, increment days used by $1$, and start the next day with package $w_i$. If $\text{daysUsed} \le D$, return `True`; otherwise `False`.

```text
FUNCTION CanShip(W: Array of Integer, n: Integer, D: Integer, cap: Integer) -> Boolean:
    daysUsed <- 1
    currentDayLoad <- 0

    FOR i <- 0 TO n - 1 DO
        IF currentDayLoad + W[i] > cap THEN
            daysUsed <- daysUsed + 1
            currentDayLoad <- W[i]
        ELSE
            currentDayLoad <- currentDayLoad + W[i]
        END IF
    END FOR

    RETURN daysUsed <= D
```

---

### 4. Step-by-Step Optimization Trace

Executing binary search over the range $[low = 10, high = 55]$ with target days $D = 5$:

| Iteration | Active Interval $[low, high]$ | Candidate Capacity $\text{mid}$ | Day-by-Day Load Partitions                                                             | Days Required | Feasible? ($\le 5$)  | Recorded Answer (`ans`) |        Next Search Interval         |
| :-------: | :---------------------------: | :-----------------------------: | :------------------------------------------------------------------------------------- | :-----------: | :------------------: | :---------------------: | :---------------------------------: |
|   **1**   |          $[10, 55]$           |              `32`               | $D_1:[1..7]=28$; $D_2:[8, 9]=17$; $D_3:[10]=10$                                        |     **3**     | **True** ($3 \le 5$) |          `32`           |             $[10, 31]$              |
|   **2**   |          $[10, 31]$           |              `20`               | $D_1:[1..5]=15$; $D_2:[6, 7]=13$; $D_3:[8, 9]=17$; $D_4:[10]=10$                       |     **4**     | **True** ($4 \le 5$) |          `20`           |             $[10, 19]$              |
|   **3**   |          $[10, 19]$           |              `14`               | $D_1:[1..4]=10$; $D_2:[5, 6]=11$; $D_3:[7]=7$; $D_4:[8]=8$; $D_5:[9]=9$; $D_6:[10]=10$ |     **6**     | **False** ($6 > 5$)  |    `20` (unchanged)     |             $[15, 19]$              |
|   **4**   |          $[15, 19]$           |              `17`               | $D_1:[1..5]=15$; $D_2:[6, 7]=13$; $D_3:[8, 9]=17$; $D_4:[10]=10$                       |     **4**     | **True** ($4 \le 5$) |          `17`           |             $[15, 16]$              |
|   **5**   |          $[15, 16]$           |              `15`               | $D_1:[1..5]=15$; $D_2:[6, 7]=13$; $D_3:[8]=8$; $D_4:[9]=9$; $D_5:[10]=10$              |     **5**     | **True** ($5 \le 5$) |          `15`           |             $[15, 14]$              |
|  **End**  |          $[15, 14]$           |                —                | $low > high$; Loop terminates                                                          |       —       |          —           |        **`15`**         | Result: $\min \text{capacity} = 15$ |

The optimal minimum ship weight capacity is **15**, found in exactly 5 predicate evaluations.

---

### 5. Canonical Problem Archetypes on Answer Space

The table below summarizes classic algorithmic problems solvable via binary search on monotonic answer space:

| Problem Archetype             | Search Variable ($x$)        | Search Bounds $[low, high]$ | Predicate Invariant                                   | Predicate Complexity |      Total Time Complexity       |
| :---------------------------- | :--------------------------- | :-------------------------- | :---------------------------------------------------- | :------------------: | :------------------------------: |
| **Capacity to Ship Packages** | Minimum weight capacity      | $[\max(W), \sum W]$         | Greedy daily packing: $\text{days} \le D$             |        $O(n)$        |    $O(n \cdot \log(\sum W))$     |
| **Koko Eating Bananas**       | Minimum eating speed $k$     | $[1, \max(P)]$              | Total hours spent: $\sum \lceil p_i / k \rceil \le H$ |        $O(n)$        |    $O(n \cdot \log(\max P))$     |
| **Allocate Minimum Pages**    | Minimum maximum pages        | $[\max(A), \sum A]$         | Student partition count: $\text{students} \le M$      |        $O(n)$        |    $O(n \cdot \log(\sum A))$     |
| **Aggressive Cows (Stalls)**  | Maximum minimum distance     | $[1, x_{\max} - x_{\min}]$  | Greedy cow placement: $\text{cows} \ge C$             |        $O(n)$        | $O(n \log n + n \log(\Delta x))$ |
| **Split Array Largest Sum**   | Minimum largest subarray sum | $[\max(A), \sum A]$         | Subarray splits count: $\text{splits} \le k$          |        $O(n)$        |    $O(n \cdot \log(\sum A))$     |

---

## Module 03 Summary & Key Takeaways

1. **The Half-Sorted Invariant:** In any circularly rotated sorted array, dividing the interval at $\text{mid}$ guarantees that at least one half is strictly sorted. Testing $A[low] \le A[\text{mid}]$ identifies the sorted partition in $O(1)$ time.
2. **Boundary Testing for Discard:** Once the sorted partition is identified, a single range check ($A[low] \le \text{target} < A[\text{mid}]$ or $A[\text{mid}] < \text{target} \le A[high]$) determines whether the target lies inside the sorted half, enabling $O(\log n)$ search.
3. **Pivot & Minimum Element:** Comparing $A[\text{mid}]$ with $A[high]$ locates the array's minimum element and rotation factor $k$. If $A[\text{mid}] > A[high]$, the pivot is strictly right; if $A[\text{mid}] \le A[high]$, the pivot is at or left of $\text{mid}$.
4. **Duplicate Penalty:** When $A[low] = A[\text{mid}] = A[high]$, the sorted half cannot be deduced. Trimming both boundaries ($low++, high--$) preserves correctness but degrades worst-case performance to $O(n)$.
5. **Answer Space Monotonicity:** When optimization problems ask for "Minimum Capacity" or "Maximum Distance", formulate a verification predicate $P(x)$. If $P(x)$ is monotonic, binary search computes the optimal answer in $O(\text{Cost}(P) \cdot \log(\text{Range}))$ time.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). _Introduction to Algorithms_ (4th ed.), Chapter 2 (Getting Started) & Section 12.3. MIT Press.
2. **Bentley, J.** (2000). _Programming Pearls_ (2nd ed.), Column 4: Writing Correct Programs & Column 9: Code Tuning. Addison-Wesley.
3. **Knuth, D. E.** (1998). _The Art of Computer Programming, Volume 3: Sorting and Searching_ (2nd ed.), Section 6.2.1: Searching an Ordered Table. Addison-Wesley.
4. **Sedgewick, R., & Wayne, K.** (2011). _Algorithms_ (4th ed.), Chapter 1.4: Analysis of Algorithms (Binary Search on Functions). Addison-Wesley.
