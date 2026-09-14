# Part 11: Problem Bank — Volume 07: Greedy, Backtracking, Bit Hacks, Math & Geometry (55 Problems)

> **Problems Covered:** Q471 to Q525  
> **Patterns:** Interval Sweepline & Scheduling &bull; Backtracking State-Space Trees &bull; N-Queens & Sudoku &bull; Bit Manipulation Tricks (`n & (n - 1)`) &bull; Sieve of Eratosthenes &bull; Binary Exponentiation &bull; Computational Geometry (Convex Hull)

---

## Section 1: Greedy Intervals & Scheduling (Q471 – Q482)

#### Q471: Merge Intervals
- **Difficulty:** `[Medium]` | **Pattern:** `[Interval Sort & Merge]`
- **Statement:** Merge overlapping intervals.
- **Optimal Approach:** Sort intervals by start time. Iterate: if `curr.start <= prev.end`, merge by updating `prev.end = max(prev.end, curr.end)`; else append new interval.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Single interval, adjacent non-overlapping intervals (`[1, 4]` and `[5, 6]`).

#### Q472: Insert Interval
- **Difficulty:** `[Medium]` | **Pattern:** `[Three-Stage Interval Walk]`
- **Statement:** Insert new interval into sorted non-overlapping interval list and merge if necessary.
- **Optimal Approach:** 1. Add all intervals ending before `newInterval.start`. 2. Merge all overlapping intervals into `newInterval`. 3. Add all intervals starting after `newInterval.end`.
- **Complexity:** Time: $O(n)$ strictly linear | Space: $O(n)$
- **Edge Cases:** New interval inserted at very beginning or very end.

#### Q473: Non-Overlapping Intervals
- **Difficulty:** `[Medium]` | **Pattern:** `[Greedy Earliest Deadline First]`
- **Statement:** Find minimum number of intervals to remove to make remainder non-overlapping.
- **Optimal Approach:** Sort intervals by **end time** ascending. Greedily keep interval that finishes earliest; if next interval starts before current finish, increment removal count.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(1)$ auxiliary
- **Edge Cases:** Intervals sharing endpoints (`[1, 2]` and `[2, 3]` do NOT overlap).

#### Q474: Minimum Number of Arrows to Burst Balloons
- **Difficulty:** `[Medium]` | **Pattern:** `[Interval Endpoint Greedy]`
- **Statement:** Balloons represented as intervals $[x_{start}, x_{end}]$. Find min arrows shot vertically to burst all.
- **Optimal Approach:** Sort by end coordinate. Shoot arrow at `balloon[0].end`. Skip all balloons overlapping with this arrow position; shoot new arrow when non-overlapping balloon seen.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(1)$
- **Edge Cases:** Coordinate values at `INT_MAX` (use comparison function, avoid `a - b` subtraction overflow).

#### Q475: Meeting Rooms
- **Difficulty:** `[Easy]` | **Pattern:** `[Sort Adjacent Overlap Check]`
- **Statement:** Determine if a person could attend all meetings.
- **Optimal Approach:** Sort intervals by start time. Check if any adjacent pair has `intervals[i].start < intervals[i-1].end`.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(1)$
- **Edge Cases:** 0 or 1 meeting (always true).

#### Q476: Meeting Rooms II
- **Difficulty:** `[Medium]` | **Pattern:** `[Chronological Event Sweepline / Min-Heap]`
- **Statement:** Find minimum conference rooms required to host all meetings.
- **Optimal Approach:** Sort start times and end times separately. Pointers `s` and `e`. If `start[s] < end[e]`, need new room (`rooms++`, `s++`); else room freed (`e++`, `s++`).
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Meetings ending and starting at exact same time (room can be reused immediately).

#### Q477: Jump Game
- **Difficulty:** `[Medium]` | **Pattern:** `[Greedy Furthest Reach]`
- **Statement:** Can you reach last index starting from index 0 jumping at most `nums[i]` steps?
- **Optimal Approach:** Track `maxReach`. At index $i$: if $i > maxReach$, return `false`. Update `maxReach = max(maxReach, i + nums[i])`. Return `maxReach >= n - 1`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Array with zeroes trapping traversal, length 1.

#### Q478: Jump Game II
- **Difficulty:** `[Medium]` | **Pattern:** `[BFS Window / Greedy Jumps]`
- **Statement:** Minimum jumps to reach last index.
- **Optimal Approach:** Track `currentJumpEnd` and `furthestReach`. Iterate $i \in [0, n-2]$. Update `furthestReach = max(furthestReach, i + nums[i])`. When $i == currentJumpEnd$, jump (`jumps++`, `currentJumpEnd = furthestReach`).
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Length 1 (0 jumps).

#### Q479: Gas Station
- **Difficulty:** `[Medium]` | **Pattern:** `[Greedy Deficit Reset]`
- **Statement:** Complete circular tour of gas stations. Find starting station index.
- **Optimal Approach:** Total gas must be $\ge$ total cost. Maintain `tank`. If `tank < 0`, reset `start = i + 1` and `tank = 0`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Sum of gas strictly less than sum of cost (impossible, returns $-1$).

#### Q480: Candy
- **Difficulty:** `[Hard]` | **Pattern:** `[Two-Pass Left & Right Greedy]`
- **Statement:** Children with higher rating than neighbor must get more candies. Minimize candies.
- **Optimal Approach:** Initialize all with 1 candy. Left-to-right pass: if $rating[i] > rating[i-1]$, set $candy[i] = candy[i-1] + 1$. Right-to-left pass: if $rating[i] > rating[i+1]$, set $candy[i] = \max(candy[i], candy[i+1] + 1)$.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Strictly decreasing ratings, all ratings identical.

#### Q481: Lemonade Change
- **Difficulty:** `[Easy]` | **Pattern:** `[Greedy Bill Prioritization]`
- **Statement:** Customers pay with \$5, \$10, \$20. Can you provide correct change to everyone?
- **Optimal Approach:** Track count of \$5 and \$10 bills. For \$10, give \$5. For \$20, greedily give one \$10 and one \$5 (saves \$5 bills for future change!).
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** First customer pays with \$10 or \$20 (cannot give change).

#### Q482: Queue Reconstruction by Height
- **Difficulty:** `[Medium]` | **Pattern:** `[Sort Tallest First + Greedy Insert]`
- **Statement:** Reconstruct queue where person $[h, k]$ has exactly $k$ taller or equal people in front.
- **Optimal Approach:** Sort people by height descending; on height ties, sort by $k$ ascending. Iterate and insert each person into output list at index $k$!
- **Complexity:** Time: $O(n^2)$ | Space: $O(n)$
- **Edge Cases:** All people have identical height.

---

## Section 2: Backtracking & Combinatorial Search (Q483 – Q497)

#### Q483: Subsets
- **Difficulty:** `[Medium]` | **Pattern:** `[Cascading / Backtracking Power Set]`
- **Statement:** Return all possible subsets (power set) of distinct integers.
- **Optimal Approach:** Backtracking `dfs(start, path)`. At each call, add copy of `path` to results. Loop $i$ from $start$ to $n-1$, push $nums[i]$, recurse $dfs(i + 1)$, pop.
- **Complexity:** Time: $O(n \cdot 2^n)$ | Space: $O(n)$ recursion
- **Edge Cases:** Empty array (returns `[[]]`).

#### Q484: Subsets II
- **Difficulty:** `[Medium]` | **Pattern:** `[Sort + Duplicate Skip Backtracking]`
- **Statement:** Return all unique subsets from array that may contain duplicates.
- **Optimal Approach:** Sort array. In loop from $start$ to $n-1$, skip duplicates: `if (i > start && nums[i] == nums[i-1]) continue`.
- **Complexity:** Time: $O(n \cdot 2^n)$ | Space: $O(n)$
- **Edge Cases:** All elements identical.

#### Q485: Permutations
- **Difficulty:** `[Medium]` | **Pattern:** `[In-Place Element Swapping / Visited Set]`
- **Statement:** Return all permutations of distinct integers.
- **Optimal Approach:** `backtrack(first)`: loop $i$ from $first$ to $n-1$, swap $nums[first]$ with $nums[i]$, recurse on $first + 1$, swap back.
- **Complexity:** Time: $O(n \cdot n!)$ | Space: $O(n)$
- **Edge Cases:** Array with 1 element.

#### Q486: Permutations II
- **Difficulty:** `[Medium]` | **Pattern:** `[Sort + Visited Duplicate Pruning]`
- **Statement:** Return unique permutations of array containing duplicates.
- **Optimal Approach:** Sort array. Boolean `used` array. Skip if `used[i]` or `i > 0 && nums[i] == nums[i-1] && !used[i-1]`.
- **Complexity:** Time: $O(n \cdot n!)$ | Space: $O(n)$
- **Edge Cases:** Array with all duplicate elements.

#### Q487: Combinations
- **Difficulty:** `[Medium]` | **Pattern:** `[Size K Backtracking]`
- **Statement:** Return all combinations of $k$ numbers chosen from $1 \dots n$.
- **Optimal Approach:** Backtrack tracking current number and path. Prune search if remaining numbers cannot fill path: `if (path.size() + (n - start + 1) < k) return`.
- **Complexity:** Time: $O(k \cdot \binom{n}{k})$ | Space: $O(k)$
- **Edge Cases:** $k = 1, k = n$.

#### Q488: Combination Sum
- **Difficulty:** `[Medium]` | **Pattern:** `[Unlimited Reuse Backtracking]`
- **Statement:** Return unique combinations summing to target; same number may be used unlimited times.
- **Optimal Approach:** Recurse `backtrack(start, remaining)`: loop $i$ from $start$, subtract $nums[i]$, recurse on same index $i$ (`backtrack(i, remaining - nums[i])`).
- **Complexity:** Time: $O(n^{\text{target} / \min})$ | Space: $O(\text{target} / \min)$
- **Edge Cases:** Target smaller than all numbers.

#### Q489: Combination Sum II
- **Difficulty:** `[Medium]` | **Pattern:** `[No Reuse Duplicate Skip Backtracking]`
- **Statement:** Each number used at most once; input has duplicates. Sum to target.
- **Optimal Approach:** Sort array. Loop $i$ from $start$: skip `if (i > start && nums[i] == nums[i-1])`. Recurse on `i + 1`.
- **Complexity:** Time: $O(2^n)$ | Space: $O(n)$
- **Edge Cases:** Multiple identical numbers needed to reach target.

#### Q490: Combination Sum III
- **Difficulty:** `[Medium]` | **Pattern:** `[Bounded Digits 1-9 Backtracking]`
- **Statement:** Find all combinations of $k$ numbers from $1 \dots 9$ that sum to $n$.
- **Optimal Approach:** Backtrack choosing digits $1 \dots 9$. Stop when `path.size() == k` and `target == 0`.
- **Complexity:** Time: $O(\binom{9}{k})$ | Space: $O(k)$
- **Edge Cases:** $n$ too large to form with $k$ digits.

#### Q491: Letter Combinations of a Phone Number
- **Difficulty:** `[Medium]` | **Pattern:** `[Branching Digits Backtracking]`
- **Statement:** Return all letter combinations for phone digits mapping `2-9`.
- **Optimal Approach:** Array mapping digit to letters. Backtrack index by index in digit string, looping over mapped letters.
- **Complexity:** Time: $O(4^n)$ | Space: $O(n)$
- **Edge Cases:** Empty digit string (returns `[]`).

#### Q492: Generate Parentheses
- **Difficulty:** `[Medium]` | **Pattern:** `[Count-Constrained Backtracking]`
- **Statement:** Generate all well-formed parentheses strings of $n$ pairs.
- **Optimal Approach:** Maintain `open` and `close` counts. If `open < n`, add `(` and recurse. If `close < open`, add `)` and recurse.
- **Complexity:** Time: $O(4^n / \sqrt{n})$ (Catalan number $C_n$) | Space: $O(n)$
- **Edge Cases:** $n = 1$ (`"()"`).

#### Q493: N-Queens
- **Difficulty:** `[Hard]` | **Pattern:** `[Bitmask / Set Diagonal Constraint Backtracking]`
- **Statement:** Place $n$ queens on $n \times n$ chessboard so no two queens attack each other.
- **Optimal Approach:** Row-by-row recursion. Maintain sets/bitmasks for occupied `cols`, major diagonals `r - c`, and minor diagonals `r + c`.
- **Complexity:** Time: $O(n!)$ | Space: $O(n)$
- **Edge Cases:** $n = 1$ (1 solution), $n = 2, 3$ (0 solutions).

#### Q494: N-Queens II
- **Difficulty:** `[Hard]` | **Pattern:** `[Bitmask Solution Counter]`
- **Statement:** Return total number of distinct solutions to the $n$-queens puzzle.
- **Optimal Approach:** Bitmask state `solve(row, cols, diag1, diag2)`. Available positions calculated in $O(1)$ via bitwise `~ (cols | diag1 | diag2)`.
- **Complexity:** Time: $O(n!)$ | Space: $O(n)$
- **Edge Cases:** $n = 4$ (2 solutions).

#### Q495: Sudoku Solver
- **Difficulty:** `[Hard]` | **Pattern:** `[Exact Cover / Constraint Propagation Backtracking]`
- **Statement:** Solve $9 \times 9$ Sudoku puzzle modifying board in-place.
- **Optimal Approach:** Find next empty cell. Try digits $'1' \dots '9'$; verify validity across row, column, and $3 \times 3$ box. If valid, recurse; if recursion fails, reset to $'.' $.
- **Complexity:** Time: $O(9^{81})$ worst case, heavily pruned in practice | Space: $O(81)$
- **Edge Cases:** Unique solution guaranteed per problem description.

#### Q496: Word Search
- **Difficulty:** `[Medium]` | **Pattern:** `[2D Grid DFS Backtracking with In-Place Visited]`
- **Statement:** Check if word exists in grid moving horizontally/vertically without reusing cell.
- **Optimal Approach:** At cell $(r, c)$, match $board[r][c] == word[k]$. Temporarily set $board[r][c] = '\#'$ to mark visited. Explore 4 neighbors, restore character on return.
- **Complexity:** Time: $O(M \cdot N \cdot 3^L)$ | Space: $O(L)$
- **Edge Cases:** Word longer than total cells in board.

#### Q497: Palindrome Partitioning
- **Difficulty:** `[Medium]` | **Pattern:** `[Backtracking with Palindrome Substring Check]`
- **Statement:** Partition string such that every substring is a palindrome.
- **Optimal Approach:** For start index, try all end indices. If substring $s[start \dots end]$ is a palindrome, append to current path and recurse on $end + 1$.
- **Complexity:** Time: $O(n \cdot 2^n)$ | Space: $O(n)$
- **Edge Cases:** String of all identical characters.

---

## Section 3: Bit Manipulation & Hacks (Q498 – Q507)

#### Q498: Single Number
- **Difficulty:** `[Easy]` | **Pattern:** `[XOR Self-Cancellation]`
- **Statement:** Every element appears twice except for one. Find it in $O(1)$ space.
- **Optimal Approach:** XOR all elements together: $x \oplus x = 0$ and $x \oplus 0 = x$. All pairs cancel out, leaving single number.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Single element array.

#### Q499: Single Number II
- **Difficulty:** `[Medium]` | **Pattern:** `[Bit Count Modulo 3 / Digital State Logic]`
- **Statement:** Every element appears 3 times except one. Find it.
- **Optimal Approach:** Count number of 1s at each bit position $0 \dots 31$. Take sum modulo 3. Resulting bits form the single number. Or two variables `ones` and `twos`.
- **Complexity:** Time: $O(32 \cdot n) = O(n)$ | Space: $O(1)$
- **Edge Cases:** Negative single number.

#### Q500: Single Number III
- **Difficulty:** `[Medium]` | **Pattern:** `[XOR Partitioning by Lowest Set Bit]`
- **Statement:** Exactly two numbers appear once; all others appear twice. Find the two numbers.
- **Optimal Approach:** XOR all elements to get $X = a \oplus b$. Find lowest set bit in $X$: `diff = X & (-X)`. Partition array into two groups based on this bit and XOR each group separately!
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Overflow on `INT_MIN & (-INT_MIN)` (cast to 64-bit int).

#### Q501: Number of 1 Bits (Hamming Weight)
- **Difficulty:** `[Easy]` | **Pattern:** `[Brian Kernighan's Algorithm]`
- **Statement:** Return number of set bits in unsigned integer.
- **Optimal Approach:** While $n > 0$, set $n = n \ \& \ (n - 1)$ and increment count. (Clears the lowest set bit in exactly $O(\text{set bits})$ steps!).
- **Complexity:** Time: $O(\text{set bits}) \le 32$ | Space: $O(1)$
- **Edge Cases:** $n = 0$.

#### Q502: Counting Bits
- **Difficulty:** `[Easy]` | **Pattern:** `[Bit DP Relation]`
- **Statement:** For all $i \in [0, n]$, count set bits in $O(n)$ time.
- **Optimal Approach:** $DP[i] = DP[i \ \& \ (i - 1)] + 1$. Or $DP[i] = DP[i \gg 1] + (i \ \& \ 1)$.
- **Complexity:** Time: $O(n)$ strictly linear | Space: $O(n)$
- **Edge Cases:** $n = 0$.

#### Q503: Reverse Bits
- **Difficulty:** `[Easy]` | **Pattern:** `[32-Bit Shift Assembly]`
- **Statement:** Reverse bits of a 32-bit unsigned integer.
- **Optimal Approach:** Loop 32 times: `ans = (ans << 1) | (n & 1)`, then `n = n >> 1`.
- **Complexity:** Time: $O(32) = O(1)$ | Space: $O(1)$
- **Edge Cases:** All bits 1, all bits 0.

#### Q504: Bitwise AND of Numbers Range
- **Difficulty:** `[Medium]` | **Pattern:** `[Common Binary Prefix]`
- **Statement:** Return bitwise AND of all numbers in $[left, right]$.
- **Optimal Approach:** Find common binary prefix of $left$ and $right$! Shift both right until $left == right$, then shift back.
- **Complexity:** Time: $O(32) = O(1)$ | Space: $O(1)$
- **Edge Cases:** $left = 0$ (result 0).

#### Q505: Power of Two
- **Difficulty:** `[Easy]` | **Pattern:** `[Single Set Bit Test]`
- **Statement:** Check if $n$ is a power of 2.
- **Optimal Approach:** Return `n > 0 && (n & (n - 1)) == 0`.
- **Complexity:** Time: $O(1)$ | Space: $O(1)$
- **Edge Cases:** $n \le 0$ (must return false).

#### Q506: Subsets Using Bit Manipulation
- **Difficulty:** `[Medium]` | **Pattern:** `[Binary Mask Generation]`
- **Statement:** Generate all subsets using binary numbers $0 \dots 2^n - 1$.
- **Optimal Approach:** Loop $mask \in [0, 2^n - 1]$. If $j$-th bit of $mask$ is 1, include $nums[j]$ in subset.
- **Complexity:** Time: $O(n \cdot 2^n)$ | Space: $O(1)$ auxiliary
- **Edge Cases:** $n = 0$.

#### Q507: Maximum Product of Word Lengths
- **Difficulty:** `[Medium]` | **Pattern:** `[26-Bit Character Bitmask]`
- **Statement:** Find max $length(w_1) \times length(w_2)$ where words share no common letters.
- **Optimal Approach:** Encode each word as 26-bit bitmask where bit $k = 1$ if character $(k + 'a')$ is present. Two words share no letters iff `mask1 & mask2 == 0`.
- **Complexity:** Time: $O(N^2 + \sum L)$ | Space: $O(N)$
- **Edge Cases:** All pairs share characters (returns 0).

---

## Section 4: Math, Number Theory & Geometry (Q508 – Q525)

#### Q508: Count Primes (Sieve of Eratosthenes)
- **Difficulty:** `[Medium]` | **Pattern:** `[Sieve Prime Sieving]`
- **Statement:** Count primes strictly less than $n$.
- **Optimal Approach:** Boolean array of size $n$ initialized to true. For $i = 2 \dots \lfloor \sqrt{n} \rfloor$, if $isPrime[i]$, cross off all multiples from $i \times i$ step $i$.
- **Complexity:** Time: $O(n \log \log n)$ | Space: $O(n)$
- **Edge Cases:** $n \le 2$ (0 primes).

#### Q509: Greatest Common Divisor (Euclidean Algorithm)
- **Difficulty:** `[Easy]` | **Pattern:** `[Euclidean Modulo Recursion]`
- **Statement:** Compute $\gcd(a, b)$ in $O(\log(\min(a, b)))$ time.
- **Optimal Approach:** While $b \ne 0$, $(a, b) = (b, a \bmod b)$. Return $a$.
- **Complexity:** Time: $O(\log(\min(a, b)))$ | Space: $O(1)$
- **Edge Cases:** $b = 0$.

#### Q510: Pow(x, n) (Binary Exponentiation)
- **Difficulty:** `[Medium]` | **Pattern:** `[Exponent Halving Multiplication]`
- **Statement:** Calculate $x^n$ in $O(\log n)$ time.
- **Optimal Approach:** If $n < 0$, invert $x = 1/x, n = -n$. While $n > 0$: if $n$ is odd, multiply result by $x$; square $x = x \times x$; divide $n = \lfloor n / 2 \rfloor$.
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** $n = -2^{31}$ (negation overflows 32-bit int; cast to 64-bit int), $x = 0$.

#### Q511: Factorial Trailing Zeroes
- **Difficulty:** `[Medium]` | **Pattern:** `[Legendre's Formula (Factors of 5)]`
- **Statement:** Count trailing zeroes in $n!$.
- **Optimal Approach:** Count factors of 5: $\sum_{k=1}^\infty \lfloor n / 5^k \rfloor$. In loop: $count \mathrel{+}= n / 5, n = n / 5$.
- **Complexity:** Time: $O(\log_5 n)$ | Space: $O(1)$
- **Edge Cases:** $n = 0$.

#### Q512: Happy Number
- **Difficulty:** `[Easy]` | **Pattern:** `[Sum of Squares Digits Cycle Detection]`
- **Statement:** Replace number by sum of squares of digits; reaches 1 or loops in cycle.
- **Optimal Approach:** Fast and slow pointers on transformation function. If fast meets 1, happy; if fast meets slow, cycle detected!
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** $n = 1$.

#### Q513: Roman to Integer & Integer to Roman
- **Difficulty:** `[Medium]` | **Pattern:** `[Greedy Decreasing Subtraction]`
- **Statement:** Convert Roman numeral to integer and integer to Roman.
- **Optimal Approach:** For Roman to Int: if current symbol $<$ next symbol, subtract; else add. For Int to Roman: greedy array of 13 value-symbol pairs descending.
- **Complexity:** Time: $O(1)$ | Space: $O(1)$
- **Edge Cases:** Subtractive notation (`IV`, `IX`, `CD`).

#### Q514: Excel Sheet Column Title & Number
- **Difficulty:** `[Easy]` | **Pattern:** `[Base-26 with 1-Based Offset]`
- **Statement:** Convert column number to title (`1 -> "A"`, `28 -> "AB"`) and vice versa.
- **Optimal Approach:** Number to Title: while $n > 0$, decrement $n--$, extract char $(n \bmod 26) + 'A'$, divide $n = n / 26$. Title to Number: multiply by 26 and add digit.
- **Complexity:** Time: $O(\log_{26} n)$ | Space: $O(1)$
- **Edge Cases:** Multiples of 26 (`"Z"`, `"AZ"`).

#### Q515: Angle Between Hands of a Clock
- **Difficulty:** `[Medium]` | **Pattern:** `[Hour & Minute Angles Difference]`
- **Statement:** Calculate smaller angle between hour and minute hands.
- **Optimal Approach:** Minute angle $= minutes \times 6^\circ$. Hour angle $= (hours \bmod 12) \times 30^\circ + minutes \times 0.5^\circ$. Difference $= |\text{hourAngle} - \text{minuteAngle}|$; return $\min(diff, 360 - diff)$.
- **Complexity:** Time: $O(1)$ | Space: $O(1)$
- **Edge Cases:** 12 o'clock, 6 o'clock ($180^\circ$).

#### Q516: Convex Hull (Monotone Chain Algorithm)
- **Difficulty:** `[Hard]` | **Pattern:** `[Cross Product Orientation]`
- **Statement:** Find smallest convex polygon that encloses all given points.
- **Optimal Approach:** Andrew's Monotone Chain: sort points. Build lower hull using 2D cross product: $(b.x - a.x)(c.y - a.y) - (b.y - a.y)(c.x - a.x) \le 0$ (turn left). Repeat for upper hull.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Collinear points, all points identical.

#### Q517: Point Inside Polygon (Ray Casting)
- **Difficulty:** `[Medium]` | **Pattern:** `[Jordan Curve Theorem Ray Casting]`
- **Statement:** Determine if point $P$ lies inside arbitrary polygon.
- **Optimal Approach:** Cast horizontal ray from $P$ to infinity. Count intersections with polygon edges. If intersection count is odd, inside; if even, outside.
- **Complexity:** Time: $O(V)$ | Space: $O(1)$
- **Edge Cases:** Point on edge or vertex.

#### Q518: Line Segment Intersection
- **Difficulty:** `[Hard]` | **Pattern:** `[Orientation CCW Checks]`
- **Statement:** Check if segment $AB$ intersects segment $CD$.
- **Optimal Approach:** Check orientations of triplets $(A, B, C), (A, B, D)$ and $(C, D, A), (C, D, B)$. Intersects if orientations alternate, or if collinear and project overlaps.
- **Complexity:** Time: $O(1)$ | Space: $O(1)$
- **Edge Cases:** Collinear segments overlapping.

#### Q519: Max Points on a Line (GCD Slopes)
- **Difficulty:** `[Hard]` | **Pattern:** `[Coprime Slope Fractions]`
- **Statement:** Find maximum points on any single line.
- **Optimal Approach:** For each point $i$, hash map stores slopes to point $j$ as $(\Delta y / \gcd, \Delta x / \gcd)$ preserving exact rational value.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n)$
- **Edge Cases:** Duplicate points, vertical lines.

#### Q520: Rectangle Area
- **Difficulty:** `[Medium]` | **Pattern:** `[Inclusion-Exclusion 2D]`
- **Statement:** Total area covered by two rectilinear rectangles.
- **Optimal Approach:** $\text{Area}_1 + \text{Area}_2 - \text{OverlapArea}$. Overlap width is $\max(0, \min(ax2, bx2) - \max(ax1, bx1))$. Overlap height is $\max(0, \min(ay2, by2) - \max(ay1, by1))$.
- **Complexity:** Time: $O(1)$ | Space: $O(1)$
- **Edge Cases:** Rectangles do not overlap (overlap area 0).

#### Q521: Perfect Number
- **Difficulty:** `[Easy]` | **Pattern:** `[Divisor Enumeration up to Sqrt]`
- **Statement:** Check if positive integer equals sum of all its proper divisors.
- **Optimal Approach:** Sum divisors up to $\sqrt{n}$. If $i$ divides $n$, add $i$ and $n / i$. Compare with $n$.
- **Complexity:** Time: $O(\sqrt{n})$ | Space: $O(1)$
- **Edge Cases:** $n = 1$ (not perfect).

#### Q522: Reverse Integer
- **Difficulty:** `[Medium]` | **Pattern:** `[Arithmetic Digit Shift with Safe Clamping]`
- **Statement:** Reverse digits of 32-bit signed integer; return 0 if reversed overflows.
- **Optimal Approach:** Pop digit: `digit = x % 10, x /= 10`. Check `ans > INT_MAX / 10 || (ans == INT_MAX / 10 && digit > 7)` before multiplying by 10.
- **Complexity:** Time: $O(\log_{10} x)$ | Space: $O(1)$
- **Edge Cases:** Negative numbers, numbers ending with zeroes.

#### Q523: Palindrome Number
- **Difficulty:** `[Easy]` | **Pattern:** `[Reverse Half the Digits]`
- **Statement:** Determine if integer is a palindrome without converting to string.
- **Optimal Approach:** Negative numbers never palindromes. While $x > reversedHalf$, pop digit and add to $reversedHalf$. Palindrome iff $x == reversedHalf || x == reversedHalf / 10$.
- **Complexity:** Time: $O(\log_{10} n)$ | Space: $O(1)$
- **Edge Cases:** Numbers ending in 0 (except 0 itself) are not palindromes.

#### Q524: Nim Game / Stone Game
- **Difficulty:** `[Easy]` | **Pattern:** `[Game Theory Invariant]`
- **Statement:** Players remove 1, 2, or 3 stones. Can you win starting first with $n$ stones?
- **Optimal Approach:** First player wins iff $n \bmod 4 \ne 0$.
- **Complexity:** Time: $O(1)$ | Space: $O(1)$
- **Edge Cases:** $n \le 3$ (win immediately).

#### Q525: Fast Fourier Transform (FFT Polynomial Multiplication)
- **Difficulty:** `[Hard]` | **Pattern:** `[Divide & Conquer Complex Roots of Unity]`
- **Statement:** Multiply two degree-$n$ polynomials in $O(n \log n)$ time.
- **Optimal Approach:** Convert coefficients to Point-Value form via FFT using complex roots of unity $\omega_n^k = e^{2\pi i k / n}$. Multiply point values in $O(n)$. Inverse FFT back to coefficients in $O(n \log n)$.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Zero polynomial, degrees not powers of 2 (pad with zeroes).

---

## References & Academic Attribution

1. **Skiena, S. S.** (2020). *The Algorithm Design Manual* (3rd ed.). Springer.
2. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.). MIT Press.
3. **USA Computing Olympiad (USACO)** & **CP-Algorithms Archives** (2024). Curated Competitive Programming and Algorithm Verification Standards.
