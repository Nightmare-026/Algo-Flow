# 🏆 Part 09: Problem-Solving Patterns — Module 03: Core Interview & Competitive Patterns

> **Topics Covered:**  
> 141. Interval Merging & Meeting Rooms &bull; 142. Binary Search Patterns &bull; 143. Heap / Top-K & Median Patterns &bull; 144. Hash Map Frequency & Prefix Sum Patterns &bull; 145–146. Recursion & Backtracking Patterns &bull; 147. Bit Manipulation Hacks & Masking Techniques

---

# TOPIC 141: INTERVAL PATTERNS

### 1. Merge Overlapping Intervals
Given a collection of intervals $[s_i, e_i]$, merge all overlapping ranges into contiguous blocks:
1. Sort intervals ascending by their **start time**: $s_0 \le s_1 \le \dots \le s_{n-1}$.
2. Iterate through intervals:
   - If current interval starts **after** the last merged interval ends ($s_i > \text{last}.\text{end}$), add it as a new distinct interval.
   - Otherwise, they overlap: merge by extending the end time: $\text{last}.\text{end} \leftarrow \max(\text{last}.\text{end}, e_i)$.

```text
ALGORITHM MergeIntervals(intervals)
1.  Sort(intervals by start ascending)
2.  merged ← empty List
3.  merged.Append(intervals[0])
4.  for i ← 1 to intervals.Length - 1:
5.      last ← merged.Last()
6.      if intervals[i].start ≤ last.end:
7.          last.end ← max(last.end, intervals[i].end)  // Merge overlap!
8.      else:
9.          merged.Append(intervals[i])
10. return merged
```

---

### 2. Meeting Rooms II (Minimum Conference Rooms Required)
Given meeting time intervals, find the minimum number of rooms required.
- **Min-Heap Strategy**: Sort meetings by start time. A Min-Heap stores the **end times** of active meetings.
- If incoming meeting start $\ge$ heap minimum end time, reuse the room (`ExtractMin()`).
- Otherwise, allocate a new room (`Push(meeting.end)`).
- Result = Maximum heap size $= O(n \log n)$ time!

---
---

# TOPIC 143: HEAP PATTERNS (TOP-K & STREAMING MEDIAN)

### 1. Top-K Frequent / Largest Elements in $O(n \log K)$ Time
To find the $K$ largest elements in an array of size $n$:
- **Anti-Pattern**: Sort the entire array $\implies O(n \log n)$ time.
- **Optimal Heap Pattern**: Maintain a **Min-Heap of size $K$**!
  - Iterate through elements. For each $x$, push to min-heap.
  - If heap size exceeds $K$, pop the minimum (`ExtractMin()`).
  - At the end, the heap contains the $K$ largest elements, and the root is the $K$-th largest!
  - **Time Complexity**: $\mathbf{O(n \log K)}$ (vastly superior when $K \ll n$).

---

### 2. Median from a Dynamic Stream (Dual-Heap Pattern)
To maintain the running median of numbers arriving in real-time in $O(\log n)$ per insert and $O(1)$ lookup:
- Divide data into two halves:
  1. **Max-Heap (`low`)**: Stores the smaller half of numbers (root is largest of the small half).
  2. **Min-Heap (`high`)**: Stores the larger half of numbers (root is smallest of the large half).
- **Balance Invariant**: Ensure $\text{size}(\text{low}) = \text{size}(\text{high})$ or $\text{size}(\text{low}) = \text{size}(\text{high}) + 1$.
- **Median Query**:
  - If odd total count: `low.PeekMax()`
  - If even total count: $(\text{low}.\text{PeekMax}() + \text{high}.\text{PeekMin}()) / 2.0$

---
---

# TOPIC 144: HASH MAP PREFIX SUM INVARIANT PATTERN

### Subarray Sum Equals $K$ in $O(n)$ Time
Given an unsorted array containing negative numbers, count the total number of continuous subarrays whose sum equals $K$.

#### Mathematical Invariant:
Let $P[i]$ be the prefix sum up to index $i$.  
A subarray $A[j \dots i]$ has sum $K$ if and only if:
$$P[i] - P[j - 1] = K \iff \mathbf{P[j - 1] = P[i] - K}$$

```text
ALGORITHM SubarraySumEqualsK(A, n, K)
1.  prefixMap ← Hash Table mapping (prefixSum ──► frequency count)
2.  prefixMap[0] ← 1            // Base case: prefix sum of 0 occurs once initially
3.  currentSum ← 0
4.  totalSubarrays ← 0
5.  for i ← 0 to n - 1:
6.      currentSum ← currentSum + A[i]
7.      targetPrefix ← currentSum - K
8.      if targetPrefix in prefixMap:
9.          totalSubarrays ← totalSubarrays + prefixMap[targetPrefix]
10.     prefixMap[currentSum] ← prefixMap.GetOrDefault(currentSum, 0) + 1
11. return totalSubarrays
```
- **Time Complexity**: $\mathbf{\Theta(n)}$ single pass!
- **Auxiliary Space**: $O(n)$ hash table.

---
---

# TOPIC 147: BIT MANIPULATION HACKS & MASKING

Bit operations execute directly inside the CPU Arithmetic Logic Unit (ALU) in a single clock cycle ($\approx 0.3\text{ nanoseconds}$).

### 1. Fundamental Bitwise Operators

| Operator | Symbol | Operation | Truth Table Rule |
| :---: | :---: | :--- | :--- |
| **AND** | `&` | Intersection | 1 only if **both** bits are 1 |
| **OR** | `\|` | Union | 1 if **either** bit is 1 |
| **XOR** | `^` | Difference | 1 if bits are **different** ($1 \oplus 0 = 1$, but $1 \oplus 1 = 0$) |
| **NOT** | `~` | Inversion | Flips all bits ($0 \to 1, 1 \to 0$) |
| **Left Shift** | `<<` | Multiply by $2^k$ | `x << k` $= x \times 2^k$ |
| **Right Shift**| `>>` | Divide by $2^k$ | `x >> k` $= \lfloor x / 2^k \rfloor$ |

---

### 2. The 5 Essential Bit Manipulation Hacks

#### Hack 1: Brian Kernighan's Bit-Counting Algorithm ($O(\text{set bits})$)
Clears the lowest set bit in a number:
$$n = n \ \& \ (n - 1)$$

```text
Let n = 12 (binary 1100):
n - 1 = 11 (binary 1011)
n & (n - 1) = 1100 & 1011 = 1000 (Cleared lowest set bit in 1 operation!)
```

#### Hack 2: Check if an Integer is a Power of 2
A power of 2 has exactly one set bit (e.g., $16 = 10000_2$).  
$$\text{IsPowerOfTwo}(n) \iff (n > 0) \ \mathbf{and} \ ((n \ \& \ (n - 1)) = 0)$$

#### Hack 3: Find the Only Non-Repeated Element (XOR Cancellation)
In an array where every element appears twice except one, XOR all elements:
$$x \oplus x = 0 \quad \text{and} \quad x \oplus 0 = x$$
All duplicate pairs cancel to zero, leaving strictly the single unique element in $O(n)$ time and $O(1)$ space!

#### Hack 4: Isolate the Lowest Set Bit
$$\text{LowestSetBit}(n) = n \ \& \ (-n)$$
*(Uses Two's Complement representation where $-n = (\sim n) + 1$)*.

#### Hack 5: Set, Clear, and Toggle the $k$-th Bit
- **Check bit $k$**: `(n >> k) & 1`
- **Set bit $k$**: `n = n | (1 << k)`
- **Clear bit $k$**: `n = n & ~(1 << k)`
- **Toggle bit $k$**: `n = n ^ (1 << k)`

---

## 🔁 Module 03 Summary & Key Takeaways

1. **Interval Merging** requires sorting by start time; **Meeting Rooms II** uses a min-heap to track active rooms.
2. Finding **Top-K elements** uses a Min-Heap of size $K$ to achieve $O(n \log K)$ runtime without sorting the array.
3. Subarrays with sum $K$ are counted in $O(n)$ using the **Prefix Sum Hash Map** identity $P[j-1] = P[i] - K$.
4. Bit manipulation executes in 1 CPU cycle; use `n & (n - 1)` to clear the lowest set bit and XOR cancellation to eliminate duplicates.

---
[⬅️ Previous: Module 02 — Monotonic Data Structures](file:///d:/DSA/Part-09-Problem-Solving-Patterns/02_monotonic_data_structures.md) | [Next: Part 10 — Advanced DSA ➡️](file:///d:/DSA/Part-10-Advanced-DSA/01_range_query_structures.md)
