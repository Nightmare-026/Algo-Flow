# 📚 Part 11: Problem Bank — Volume 03: Hashing & Binary Search (80 Problems)

> **Problems Covered:** Q161 to Q240  
> **Patterns:** Hash Tables & Frequencies &bull; Prefix Sum Remainder Modulo &bull; Rolling Hash &bull; Binary Search on Sorted Arrays &bull; Rotated Array Partitioning &bull; Binary Search on Answer Space &bull; Sweep-Line Hash Maps

---

## Section 1: Hashing, HashMaps & Frequency Tables (Q161 – Q200)

#### Q161: Longest Consecutive Sequence
- **Difficulty:** `[Medium]` | **Pattern:** `[Hash Set Sequence Start]`
- **Statement:** Find length of longest consecutive elements sequence in unsorted array in $O(n)$ time.
- **Optimal Approach:** Insert all numbers into a hash set. Only begin counting if $x - 1$ is NOT in set (ensures we only start at sequence heads).
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Empty array (length 0), large duplicate values.

#### Q162: Contiguous Array
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix Sum Hash Map with -1/1]`
- **Statement:** Find maximum length of contiguous subarray with equal number of 0s and 1s.
- **Optimal Approach:** Treat 0 as $-1$ and 1 as $+1$. Running prefix sum $P$. Map stores `{P: earliestIndex}`. If same sum seen again, length is $i - \text{map}[P]$.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Array with all 0s or all 1s (returns 0).

#### Q163: Insert Delete GetRandom O(1)
- **Difficulty:** `[Medium]` | **Pattern:** `[Dynamic Array + Hash Map]`
- **Statement:** Design a data structure supporting $O(1)$ average `insert`, `remove`, and `getRandom`.
- **Optimal Approach:** Array stores elements. Hash map stores `{val: indexInArray}`. On removal, swap target with last element of array and pop back.
- **Complexity:** Time: $O(1)$ average all ops | Space: $O(n)$
- **Edge Cases:** Removing the last element, inserting already existing element.

#### Q164: Insert Delete GetRandom O(1) - Duplicates Allowed
- **Difficulty:** `[Hard]` | **Pattern:** `[Array + Hash Map of Index Sets]`
- **Statement:** Support $O(1)$ average `insert`, `remove`, and `getRandom` when duplicates are permitted.
- **Optimal Approach:** Map stores `{val: Set of indices}`. On removal, take an index from set, swap with last element of array, update last element's index in map.
- **Complexity:** Time: $O(1)$ average | Space: $O(n)$
- **Edge Cases:** Removing an element when multiple copies exist.

#### Q165: Design Twitter
- **Difficulty:** `[Medium]` | **Pattern:** `[Hash Map + Priority Queue / Merge K Lists]`
- **Statement:** Support posting tweets, following/unfollowing, and generating top 10 most recent news feed tweets.
- **Optimal Approach:** User map with `{userId: Set of followees}`. Each user maintains linked list of tweets with timestamp. Feed uses min-heap to merge k lists.
- **Complexity:** Post: $O(1)$ | Feed: $O(F \log F)$ where $F$ is followees count | Space: $O(U + T)$
- **Edge Cases:** Unfollowing self (disallowed), user with no tweets.

#### Q166: First Missing Positive
- **Difficulty:** `[Hard]` | **Pattern:** `[In-Place Bucket Index Placement]`
- **Statement:** Find smallest missing positive integer in $O(n)$ time and $O(1)$ auxiliary space.
- **Optimal Approach:** While $nums[i] \in [1, n]$ and $nums[nums[i]-1] \ne nums[i]$, swap $nums[i]$ to its target index $nums[i] - 1$. First index $i$ where $nums[i] \ne i + 1$ is the answer.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** All numbers $1 \dots n$ present (answer $n + 1$), negative numbers and zeroes.

#### Q167: Valid Sudoku
- **Difficulty:** `[Medium]` | **Pattern:** `[Hash Set Coordinate Encoding]`
- **Statement:** Determine if $9 \times 9$ Sudoku board is valid according to row, column, and $3 \times 3$ box rules.
- **Optimal Approach:** For each filled cell $(r, c)$ with value $v$, check set for `"r" + r + v`, `"c" + c + v`, and `"b" + (r/3) + (c/3) + v`.
- **Complexity:** Time: $O(81) = O(1)$ | Space: $O(81) = O(1)$
- **Edge Cases:** Empty board (valid), duplicate in same $3 \times 3$ subgrid.

#### Q168: Bulls and Cows
- **Difficulty:** `[Medium]` | **Pattern:** `[Single Array Frequency Count]`
- **Statement:** Count bulls (correct digit and position) and cows (correct digit, wrong position).
- **Optimal Approach:** If $secret[i] == guess[i]$, bull. Else, track frequencies: if count for secret digit $< 0$, cow; if count for guess digit $> 0$, cow.
- **Complexity:** Time: $O(n)$ | Space: $O(10) = O(1)$
- **Edge Cases:** Digits repeated in guess more times than in secret.

#### Q169: Isomorphic Strings
- **Difficulty:** `[Easy]` | **Pattern:** `[Dual Array Character Mapping]`
- **Statement:** Check if characters in $s$ can be replaced to get $t$ with 1-to-1 correspondence.
- **Optimal Approach:** Two arrays of size 256 recording last seen indices of characters in $s$ and $t$. Indices must match at every position.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Two distinct characters in $s$ mapping to the same character in $t$.

#### Q170: Minimum Area Rectangle
- **Difficulty:** `[Medium]` | **Pattern:** `[Hash Set Diagonal Point Matching]`
- **Statement:** Find minimum area of rectangle with sides parallel to axes formed from points array.
- **Optimal Approach:** Store points in hash set. For every pair of points $(x_1, y_1)$ and $(x_2, y_2)$ forming diagonal, check if $(x_1, y_2)$ and $(x_2, y_1)$ exist in set.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n)$
- **Edge Cases:** Points lying on the same horizontal or vertical line (cannot form diagonal).

#### Q171: Max Points on a Line
- **Difficulty:** `[Hard]` | **Pattern:** `[GCD Normalized Slope Hash Map]`
- **Statement:** Find maximum number of points that lie on the same straight line.
- **Optimal Approach:** For each point $i$, calculate slopes to all other points $j$. Represent slope as coprime pair $(\Delta y / g, \Delta x / g)$ using GCD to avoid floating point inaccuracies.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n)$
- **Edge Cases:** Vertical lines ($\Delta x = 0$), duplicate points.

#### Q172: Fraction to Recurring Decimal
- **Difficulty:** `[Medium]` | **Pattern:** `[Remainder Hash Map for Cycles]`
- **Statement:** Convert numerator/denominator to string, enclosing recurring decimals in parentheses.
- **Optimal Approach:** Perform long division. Map stores `{remainder: indexInResult}`. If a remainder repeats, insert `(` at stored index and `)` at end.
- **Complexity:** Time: $O(\text{denominator})$ | Space: $O(\text{denominator})$
- **Edge Cases:** Negative results, integer overflow on `-2147483648 / -1` (use 64-bit int).

#### Q173: Logger Rate Limiter
- **Difficulty:** `[Easy]` | **Pattern:** `[Hash Map Timestamp Filtering]`
- **Statement:** Return `true` if message should be printed (not printed within last 10 seconds).
- **Optimal Approach:** Map stores `{message: nextAllowedTimestamp}`. If $timestamp \ge \text{map}[msg]$, update map and return `true`.
- **Complexity:** Time: $O(1)$ | Space: $O(\text{messages})$
- **Edge Cases:** Simultaneous messages at same timestamp.

#### Q174: Brick Wall
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix Sum Hash Map Edges]`
- **Statement:** Draw vertical line crossing fewest bricks.
- **Optimal Approach:** Find vertical line with the **most brick edges**! Hash map stores `{edgePosition: count}`. Result is `rows - maxEdges`.
- **Complexity:** Time: $O(\text{total bricks})$ | Space: $O(\text{unique edges})$
- **Edge Cases:** Wall where no interior edges align (line must cut all bricks).

#### Q175: Subdomain Visit Count
- **Difficulty:** `[Medium]` | **Pattern:** `[String Suffix Parsing + Map]`
- **Statement:** Count total visits for each subdomain given count-paired domains.
- **Optimal Approach:** For each domain `"900 google.mail.com"`, split count and domain. Add count to map for `"google.mail.com"`, `"mail.com"`, and `"com"`.
- **Complexity:** Time: $O(N \cdot L)$ | Space: $O(N \cdot L)$
- **Edge Cases:** Top-level domains with multiple suffixes.

#### Q176: Hand of Straights
- **Difficulty:** `[Medium]` | **Pattern:** `[Sorted Map Greedy Grouping]`
- **Statement:** Rearrange hand into groups of size $groupSize$ containing consecutive cards.
- **Optimal Approach:** Count frequencies in sorted map. While map non-empty, take smallest key $v$, and decrement count for $v, v+1, \dots, v + groupSize - 1$.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Array length not divisible by $groupSize$.

#### Q177: My Calendar I
- **Difficulty:** `[Medium]` | **Pattern:** `[Sorted Map Floor/Ceiling Lookup]`
- **Statement:** Implement `book(start, end)` without double-booking.
- **Optimal Approach:** Store intervals in balanced BST (e.g. `TreeMap`). Check if `prev.end <= start` and `next.start >= end`.
- **Complexity:** Time: $O(\log n)$ per booking | Space: $O(n)$
- **Edge Cases:** Booking abutting existing interval (`[10, 20)` and `[20, 30)`).

#### Q178: My Calendar II
- **Difficulty:** `[Medium]` | **Pattern:** `[Double Booking Interval List]`
- **Statement:** Allow double-bookings, but no triple-bookings.
- **Optimal Approach:** Maintain `bookings` and `overlaps`. New interval must not intersect any interval in `overlaps`.
- **Complexity:** Time: $O(n)$ per booking | Space: $O(n)$
- **Edge Cases:** Overlaps of length 0.

#### Q179: My Calendar III
- **Difficulty:** `[Hard]` | **Pattern:** `[Sweep-Line Difference Map]`
- **Statement:** Return maximum $k$-booking (max overlapping intervals at any point in time).
- **Optimal Approach:** Map stores delta events: `map[start]++`, `map[end]--`. Take running prefix sum of map entries to find peak active bookings.
- **Complexity:** Time: $O(n)$ per booking | Space: $O(n)$
- **Edge Cases:** Multiple intervals starting/ending at exact same timestamp.

#### Q180: Encode and Decode TinyURL
- **Difficulty:** `[Medium]` | **Pattern:** `[Bi-Directional Hash Map with Counter/Hash]`
- **Statement:** Design a URL shortening service.
- **Optimal Approach:** Maintain two maps: `urlToShort` and `shortToUrl`. Generate 6-character Base62 string (`[a-zA-Z0-9]`) from auto-incrementing counter.
- **Complexity:** Time: $O(1)$ | Space: $O(N)$
- **Edge Cases:** Encoding same long URL multiple times (returns same short URL).

#### Q181: Repeated DNA Sequences
- **Difficulty:** `[Medium]` | **Pattern:** `[Rolling Hash / 20-bit Bitmask]`
- **Statement:** Find all 10-letter substrings that occur more than once in DNA string.
- **Optimal Approach:** Encode A, C, G, T as 2-bit numbers ($00, 01, 10, 11$). A 10-letter sequence fits inside a 20-bit integer! Use rolling bitmask and hash set.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** String length $< 10$.

#### Q182: Rabin-Karp String Matching
- **Difficulty:** `[Medium]` | **Pattern:** `[Polynomial Rolling Hash]`
- **Statement:** Find all occurrences of pattern in text in $O(n + m)$ expected time.
- **Optimal Approach:** Compute hash of pattern and initial window of text using polynomial hash $H = \sum c_i \cdot b^{m - 1 - i} \bmod M$. Slide window in $O(1)$.
- **Complexity:** Time: $O(n + m)$ average | Space: $O(1)$
- **Edge Cases:** Hash collisions (verify actual string match when hashes match).

#### Q183: Longest Duplicate Substring
- **Difficulty:** `[Hard]` | **Pattern:** `[Binary Search on Length + Rabin-Karp]`
- **Statement:** Find longest duplicated substring in a string.
- **Optimal Approach:** Binary search on length $L \in [1, n-1]$. For a fixed $L$, check if any duplicate exists using Rabin-Karp rolling hash with double modulo.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** No duplicate substring exists (returns `""`).

#### Q184: Snapshot Array
- **Difficulty:** `[Medium]` | **Pattern:** `[Array of History Lists + Binary Search]`
- **Statement:** Support `set(index, val)`, `snap()`, and `get(index, snap_id)`.
- **Optimal Approach:** Each array index stores a list of pairs `(snap_id, val)`. `get` uses binary search on snap_id in the target index's history list.
- **Complexity:** Set: $O(1)$ | Snap: $O(1)$ | Get: $O(\log S)$ | Space: $O(\text{sets})$
- **Edge Cases:** Querying `snap_id` that had no writes at that index.

#### Q185: Time Based Key-Value Store
- **Difficulty:** `[Medium]` | **Pattern:** `[Hash Map of Sorted Timestamp Arrays]`
- **Statement:** Store `{key, value, timestamp}` and retrieve value at `timestamp_prev <= timestamp`.
- **Optimal Approach:** Map `key -> List of (timestamp, value)`. Binary search (`upper_bound - 1`) on timestamps list to find largest timestamp $\le target$.
- **Complexity:** Set: $O(1)$ | Get: $O(\log n)$ | Space: $O(n)$
- **Edge Cases:** Target timestamp is strictly smaller than the earliest entry.

#### Q186: Design Underground System
- **Difficulty:** `[Medium]` | **Pattern:** `[Dual Hash Maps for Check-In & Travel Time]`
- **Statement:** Track customer check-ins and compute average travel times between stations.
- **Optimal Approach:** `checkInMap: id -> (station, time)`. `travelMap: (start, end) -> (totalTime, tripCount)`.
- **Complexity:** Time: $O(1)$ all ops | Space: $O(P + S^2)$
- **Edge Cases:** Stations with long names, multiple users traveling simultaneously.

#### Q187: Finding Pairs With a Certain Sum
- **Difficulty:** `[Medium]` | **Pattern:** `[Hash Map Frequency Counting]`
- **Statement:** Add to `nums2` and count pairs $(i, j)$ where $nums1[i] + nums2[j] == tot$.
- **Optimal Approach:** Hash map of frequencies for `nums2`. For each $x$ in `nums1`, add $\text{map}[tot - x]$ to answer.
- **Complexity:** Add: $O(1)$ | Count: $O(|nums1|)$ | Space: $O(|nums2|)$
- **Edge Cases:** Negative sums, target not attainable.

#### Q188: Detect Squares
- **Difficulty:** `[Medium]` | **Pattern:** `[Coordinate Point Counting]`
- **Statement:** Add points and count axis-aligned squares that can be formed with query point.
- **Optimal Approach:** For query point $(x_1, y_1)$, iterate through all points $(x_3, y_3)$ having same $x$ coordinate ($x_3 == x_1$). Side length is $|y_1 - y_3|$. Check points at $(x_1 \pm side, y_1)$ and $(x_1 \pm side, y_3)$.
- **Complexity:** Add: $O(1)$ | Count: $O(\text{points with same x})$ | Space: $O(N)$
- **Edge Cases:** Zero area squares ($y_1 == y_3$).

#### Q189: Line Reflection
- **Difficulty:** `[Medium]` | **Pattern:** `[Hash Set Coordinate Symmetry]`
- **Statement:** Find if there exists a vertical line that reflects all given 2D points.
- **Optimal Approach:** Reflection line must be $x_{\text{mid}} = \frac{x_{\min} + x_{\max}}{2}$. For every point $(x, y)$, $(x_{\min} + x_{\max} - x, y)$ must exist in point set.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** All points lie on the reflection line itself.

#### Q190: Minimum Operations to Make Array Equal
- **Difficulty:** `[Medium]` | **Pattern:** `[Mathematical Median]`
- **Statement:** Array $arr[i] = 2i + 1$. In one op, subtract 1 from one element and add 1 to another. Equalize all elements.
- **Optimal Approach:** Target value is average $= n$. Operations required is $\lfloor n^2 / 4 \rfloor$.
- **Complexity:** Time: $O(1)$ | Space: $O(1)$
- **Edge Cases:** Even vs odd $n$.

#### Q191: Alert Using Same Key-Card Three or More Times in a One Hour Period
- **Difficulty:** `[Medium]` | **Pattern:** `[Map of Times + Sorting Window]`
- **Statement:** Find employees with 3+ accesses within any 60-minute window.
- **Optimal Approach:** Map `name -> List of access minutes`. Sort each list. Check if `times[i] - times[i-2] <= 60`.
- **Complexity:** Time: $O(N \log N)$ | Space: $O(N)$
- **Edge Cases:** Accesses spanning midnight (guaranteed within same day).

#### Q192: Simple Bank System
- **Difficulty:** `[Medium]` | **Pattern:** `[Array State Validation]`
- **Statement:** Validate and execute bank transfers, deposits, and withdrawals.
- **Optimal Approach:** Array storing balances. Verify 1-based account indices are valid and balances sufficient before mutation.
- **Complexity:** Time: $O(1)$ all ops | Space: $O(N)$
- **Edge Cases:** Transferring to non-existent account, insufficient funds.

#### Q193: Design Authentication Manager
- **Difficulty:** `[Medium]` | **Pattern:** `[Hash Map Expiration Times]`
- **Statement:** Manage tokens with time-to-live ($TTL$), renewals, and count unexpired tokens.
- **Optimal Approach:** Map `tokenId -> expiryTime`. On renewal, if $currentTime < \text{map}[id]$, update expiry. Count by filtering.
- **Complexity:** Generate/Renew: $O(1)$ | Count: $O(N)$ | Space: $O(N)$
- **Edge Cases:** Renewing already expired token (ignored).

#### Q194: Find All People With Secret
- **Difficulty:** `[Hard]` | **Pattern:** `[Time-Grouped BFS / DSU with Rollback]`
- **Statement:** People share secrets in meetings at specific timestamps.
- **Optimal Approach:** Group meetings by timestamp. Within each timestamp, construct graph between meeting participants. Run BFS from people who already know secret.
- **Complexity:** Time: $O(M \log M)$ | Space: $O(N + M)$
- **Edge Cases:** Multiple meetings at same timestamp forming connected components.

#### Q195: Count Nice Pairs in an Array
- **Difficulty:** `[Medium]` | **Pattern:** `[Algebraic Rearrangement Hash Map]`
- **Statement:** Count pairs $(i, j)$ where $nums[i] + \text{rev}(nums[j]) == nums[j] + \text{rev}(nums[i])$.
- **Optimal Approach:** Rearrange equation: $nums[i] - \text{rev}(nums[i]) == nums[j] - \text{rev}(nums[j])$. Hash map counts frequencies of $nums[k] - \text{rev}(nums[k])$.
- **Complexity:** Time: $O(n \cdot \text{digits})$ | Space: $O(n)$
- **Edge Cases:** Leading zeroes in reversed numbers (e.g. $\text{rev}(120) = 21$).

#### Q196: Number of Good Ways to Split a String
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix & Suffix Unique Counts]`
- **Statement:** Split string into two non-empty strings with equal number of distinct characters.
- **Optimal Approach:** Precompute prefix count of distinct characters and suffix count. Compare at each split point.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$ or $O(26)$
- **Edge Cases:** All characters identical (split everywhere valid).

#### Q197: Minimum Number of Pushes to Type Word II
- **Difficulty:** `[Medium]` | **Pattern:** `[Greedy Frequency Assignment]`
- **Statement:** Map 26 characters to 8 phone keys (2–9) to minimize total keypresses.
- **Optimal Approach:** Count character frequencies and sort descending. Assign top 8 to cost 1, next 8 to cost 2, next 8 to cost 3, remaining 2 to cost 4.
- **Complexity:** Time: $O(n)$ | Space: $O(26) = O(1)$
- **Edge Cases:** Short words with $< 8$ distinct characters.

#### Q198: Find Players With Zero or One Losses
- **Difficulty:** `[Medium]` | **Pattern:** `[Loss Counter Hash Map]`
- **Statement:** Return players who have lost 0 matches and players who have lost exactly 1 match.
- **Optimal Approach:** Hash map tracking loss count for every player seen in matches. Extract and sort players with count 0 and count 1.
- **Complexity:** Time: $O(N \log N)$ | Space: $O(N)$
- **Edge Cases:** Players who won matches but never lost.

#### Q199: Subarrays with K Different Integers
- **Difficulty:** `[Hard]` | **Pattern:** `[Sliding Window Frequency Hash Map]`
- **Statement:** Count contiguous subarrays with exactly $k$ different integers.
- **Optimal Approach:** Compute `atMost(k) - atMost(k - 1)` using sliding window with frequency map.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** $k = 1$.

#### Q200: Minimum Deletions to Make String K-Special
- **Difficulty:** `[Medium]` | **Pattern:** `[Frequency Sorting]`
- **Statement:** Make max character frequency and min character frequency differ by at most $k$.
- **Optimal Approach:** Count frequencies, sort. Try each frequency $F$ as target minimum: frequencies $< F$ deleted completely, frequencies $> F + k$ reduced to $F + k$.
- **Complexity:** Time: $O(26^2 + n) = O(n)$ | Space: $O(26) = O(1)$
- **Edge Cases:** $k = 0$, all characters already equal.

---

## Section 2: Binary Search, Bounds & Search Spaces (Q201 – Q240)

#### Q201: Binary Search
- **Difficulty:** `[Easy]` | **Pattern:** `[Classical Sorted Search]`
- **Statement:** Search `target` in sorted array; return index or $-1$.
- **Optimal Approach:** `low = 0, high = n - 1`. While `low <= high`, `mid = low + (high - low) / 2`. Narrow search half based on comparison.
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** Target smaller than first element or larger than last element.

#### Q202: Search Insert Position
- **Difficulty:** `[Easy]` | **Pattern:** `[Lower Bound Binary Search]`
- **Statement:** Return index where `target` is found, or index where it would be inserted in order.
- **Optimal Approach:** Lower bound: find smallest index $i$ such that $nums[i] \ge target$. When loop terminates, `low` is insertion position.
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** Target smaller than all elements (index 0), target larger than all (index $n$).

#### Q203: Find First and Last Position of Element in Sorted Array
- **Difficulty:** `[Medium]` | **Pattern:** `[Lower & Upper Bound]`
- **Statement:** Find starting and ending position of `target` in $O(\log n)$ time.
- **Optimal Approach:** Find Lower Bound ($nums[i] \ge target$) for start index. Find Upper Bound ($nums[i] > target$) minus 1 for end index.
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** Target not in array (returns `[-1, -1]`), single element matching target.

#### Q204: Search in Rotated Sorted Array
- **Difficulty:** `[Medium]` | **Pattern:** `[Rotated Binary Search (Distinct)]`
- **Statement:** Search target in rotated sorted array of distinct values.
- **Optimal Approach:** At least one half ($[low, mid]$ or $[mid, high]$) is always normally sorted! Check if target lies within the sorted half; if so, search there, else search other half.
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** Array rotated 0 times (unrotated).

#### Q205: Search in Rotated Sorted Array II
- **Difficulty:** `[Medium]` | **Pattern:** `[Rotated Binary Search with Duplicates]`
- **Statement:** Search target in rotated sorted array that may contain duplicates.
- **Optimal Approach:** When $nums[low] == nums[mid] == nums[high]$, cannot determine which half is sorted! Shrink search space: `low++`, `high--`.
- **Complexity:** Time: $O(\log n)$ average, $O(n)$ worst-case | Space: $O(1)$
- **Edge Cases:** Array of all identical elements except target `[1, 1, 1, 2, 1]`.

#### Q206: Find Minimum in Rotated Sorted Array
- **Difficulty:** `[Medium]` | **Pattern:** `[Inflection Point Binary Search]`
- **Statement:** Find minimum element in rotated sorted array of unique elements.
- **Optimal Approach:** Compare $nums[mid]$ with $nums[high]$. If $nums[mid] > nums[high]$, minimum is strictly in right half (`low = mid + 1`); else in left half (`high = mid`).
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** Array not rotated ($nums[0]$ is minimum).

#### Q207: Find Minimum in Rotated Sorted Array II
- **Difficulty:** `[Hard]` | **Pattern:** `[Inflection Point with Duplicates]`
- **Statement:** Find minimum in rotated sorted array containing duplicates.
- **Optimal Approach:** If $nums[mid] == nums[high]$, decrement `high--` safely.
- **Complexity:** Time: $O(\log n)$ average, $O(n)$ worst-case | Space: $O(1)$
- **Edge Cases:** `[2, 2, 2, 0, 2, 2]`.

#### Q208: Find Peak Element
- **Difficulty:** `[Medium]` | **Pattern:** `[Slope Binary Search]`
- **Statement:** Find peak element $nums[i] > nums[i+1]$ in $O(\log n)$ time.
- **Optimal Approach:** If $nums[mid] < nums[mid+1]$, an upward slope guarantees a peak to the right (`low = mid + 1`); else a peak exists to the left (`high = mid`).
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** Peak at index 0, peak at index $n-1$.

#### Q209: Peak Index in a Mountain Array
- **Difficulty:** `[Medium]` | **Pattern:** `[Binary Search on Mountain Slope]`
- **Statement:** Return index of peak in guaranteed mountain array.
- **Optimal Approach:** Binary search: if $A[mid] < A[mid+1]$, `low = mid + 1`; else `high = mid`.
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** Length 3 (minimal mountain).

#### Q210: Single Element in a Sorted Array
- **Difficulty:** `[Medium]` | **Pattern:** `[Index Parity Binary Search]`
- **Statement:** Array where every element appears twice except one. Find it in $O(\log n)$ time and $O(1)$ space.
- **Optimal Approach:** Pairs before the single element start on even indices ($i, i+1$). Binary search `mid`: ensure `mid` is even (`mid ^= 1`). If $nums[mid] == nums[mid+1]$, single element is to the right.
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** Single element at index 0, single element at index $n-1$.

#### Q211: Median of Two Sorted Arrays
- **Difficulty:** `[Hard]` | **Pattern:** `[Dual Array Partition Binary Search]`
- **Statement:** Find median of two sorted arrays in $O(\log(\min(n, m)))$ time.
- **Optimal Approach:** Binary search partition cut in smaller array $A$. Compute cut in $B$ such that left half has $(m + n + 1) / 2$ elements. Valid if $A_{\text{left}} \le B_{\text{right}}$ and $B_{\text{left}} \le A_{\text{right}}$.
- **Complexity:** Time: $O(\log(\min(n, m)))$ | Space: $O(1)$
- **Edge Cases:** One array empty, non-overlapping arrays.

#### Q212: Kth Smallest Element in a Sorted Matrix
- **Difficulty:** `[Medium]` | **Pattern:** `[Binary Search on Matrix Value Range]`
- **Statement:** Find $k$-th smallest element in $n \times n$ matrix where rows and columns are sorted.
- **Optimal Approach:** Binary search range $[matrix[0][0], matrix[n-1][n-1]]$. Count elements $\le mid$ in $O(n)$ time using staircase walk from bottom-left.
- **Complexity:** Time: $O(n \log(\max - \min))$ | Space: $O(1)$
- **Edge Cases:** $k = 1$, $k = n^2$.

#### Q213: Search a 2D Matrix
- **Difficulty:** `[Medium]` | **Pattern:** `[Flattened Coordinate Binary Search]`
- **Statement:** Search target in $M \times N$ matrix where first integer of each row is greater than last integer of previous row.
- **Optimal Approach:** Treat as virtual 1D array of size $M \cdot N$. Coordinate mapping: `row = mid / N, col = mid % N`. Standard binary search.
- **Complexity:** Time: $O(\log(M \cdot N))$ | Space: $O(1)$
- **Edge Cases:** Matrix with 1 row or 1 column.

#### Q214: Search a 2D Matrix II
- **Difficulty:** `[Medium]` | **Pattern:** `[Staircase Search from Corner]`
- **Statement:** Search target in matrix where rows and columns are individually sorted.
- **Optimal Approach:** Start at top-right corner $(0, C-1)$. If $val > target$, move left (`col--`); if $val < target$, move down (`row++`).
- **Complexity:** Time: $O(R + C)$ | Space: $O(1)$
- **Edge Cases:** Target smaller than minimum or larger than maximum.

#### Q215: Koko Eating Bananas
- **Difficulty:** `[Medium]` | **Pattern:** `[BS on Answer Space]`
- **Statement:** Find minimum eating speed $k$ to finish all bananas within $h$ hours.
- **Optimal Approach:** Binary search speed $k \in [1, \max(\text{piles})]$. Hours needed at speed $k$ is $\sum \lceil pile / k \rceil$. If $\text{hours} \le h$, try smaller speed (`high = mid`); else `low = mid + 1`.
- **Complexity:** Time: $O(n \log(\max A))$ | Space: $O(1)$
- **Edge Cases:** $h = \text{length}(piles)$ (speed must equal $\max(piles)$).

#### Q216: Capacity to Ship Packages Within D Days
- **Difficulty:** `[Medium]` | **Pattern:** `[BS on Answer Space]`
- **Statement:** Find least ship capacity to ship packages within $days$.
- **Optimal Approach:** Binary search capacity in $[\max(weights), \sum weights]$. Greedy check: count days needed by accumulating weights until capacity exceeded.
- **Complexity:** Time: $O(n \log(\sum W))$ | Space: $O(1)$
- **Edge Cases:** $days = 1$ (capacity is $\sum W$), $days = n$ (capacity is $\max W$).

#### Q217: Split Array Largest Sum
- **Difficulty:** `[Hard]` | **Pattern:** `[BS on Answer Space]`
- **Statement:** Split array into $k$ non-empty subarrays minimizing the largest subarray sum.
- **Optimal Approach:** Binary search max sum in range $[\max(nums), \sum nums]$. Greedy check: count subarrays needed to keep sums $\le mid$. If $\text{count} \le k$, valid.
- **Complexity:** Time: $O(n \log(\sum A))$ | Space: $O(1)$
- **Edge Cases:** $k = 1$, $k = n$.

#### Q218: Painter's Partition Problem
- **Difficulty:** `[Hard]` | **Pattern:** `[BS on Answer Space]`
- **Statement:** Partition $n$ boards among $k$ painters minimizing maximum time taken.
- **Optimal Approach:** Identical to Split Array Largest Sum. Binary search on maximum board length painted by any single painter.
- **Complexity:** Time: $O(n \log(\sum L))$ | Space: $O(1)$
- **Edge Cases:** $k \ge n$ (each painter paints 1 board, answer is $\max L$).

#### Q219: Magnetic Force Between Two Balls / Aggressive Cows
- **Difficulty:** `[Medium]` | **Pattern:** `[BS on Answer Space (Maximize Minimum)]`
- **Statement:** Place $m$ balls in baskets maximizing minimum distance between any two balls.
- **Optimal Approach:** Sort basket positions. Binary search distance $D \in [1, pos[n-1] - pos[0]]$. Greedily place balls at first position $\ge lastPos + D$.
- **Complexity:** Time: $O(n \log n + n \log(\max - \min))$ | Space: $O(1)$
- **Edge Cases:** $m = 2$ (place at endpoints).

#### Q220: Minimum Speed to Arrive on Time
- **Difficulty:** `[Medium]` | **Pattern:** `[BS on Answer Space with Floating Point]`
- **Statement:** Find minimum integer speed to arrive in $\le hour$ hours (trains depart on integer hours except last).
- **Optimal Approach:** Binary search speed $\in [1, 10^7]$. Time is $\sum_{i=0}^{n-2} \lceil dist[i] / speed \rceil + dist[n-1] / speed$.
- **Complexity:** Time: $O(n \log(\text{maxSpeed}))$ | Space: $O(1)$
- **Edge Cases:** $hour \le n - 1$ (impossible, returns $-1$).

#### Q221: Maximum Candies Allocated to K Children
- **Difficulty:** `[Medium]` | **Pattern:** `[BS on Answer Space]`
- **Statement:** Maximize candies each of $k$ children receives (piles can be divided but not merged).
- **Optimal Approach:** Binary search candies $C \in [1, \max(candies)]$. Count children satisfied: $\sum \lfloor pile / C \rfloor \ge k$.
- **Complexity:** Time: $O(n \log(\max C))$ | Space: $O(1)$
- **Edge Cases:** Total candies $< k$ (returns 0).

#### Q222: Minimize Max Distance to Gas Station
- **Difficulty:** `[Hard]` | **Pattern:** `[Floating Point Binary Search on Answer]`
- **Statement:** Add $k$ gas stations to minimize maximum distance between adjacent stations.
- **Optimal Approach:** Binary search distance $D$ with precision $10^{-6}$. Stations needed is $\sum \lfloor (dist[i+1] - dist[i]) / D \rfloor \le k$.
- **Complexity:** Time: $O(n \log(\text{range} / \epsilon))$ | Space: $O(1)$
- **Edge Cases:** Precision termination `high - low > 1e-6`.

#### Q223: Find K Closest Elements
- **Difficulty:** `[Medium]` | **Pattern:** `[Binary Search on Window Start]`
- **Statement:** Find $k$ closest integers to $x$ in sorted array.
- **Optimal Approach:** Binary search window start index $i \in [0, n - k]$. Compare distances: if $x - arr[mid] > arr[mid + k] - x$, move right (`low = mid + 1`); else `high = mid`.
- **Complexity:** Time: $O(\log(n - k) + k)$ | Space: $O(1)$ auxiliary
- **Edge Cases:** $x$ smaller than all elements, $x$ larger than all elements.

#### Q224: Sqrt(x)
- **Difficulty:** `[Easy]` | **Pattern:** `[Integer Binary Search]`
- **Statement:** Compute $\lfloor \sqrt{x} \rfloor$ without built-in exponents.
- **Optimal Approach:** Range $[1, x]$. If $mid \le x / mid$ and $(mid + 1) > x / (mid + 1)$, return $mid$. (Avoid overflow with division).
- **Complexity:** Time: $O(\log x)$ | Space: $O(1)$
- **Edge Cases:** $x = 0, x = 1$.

#### Q225: Valid Perfect Square
- **Difficulty:** `[Easy]` | **Pattern:** `[Integer Binary Search]`
- **Statement:** Return `true` if num is perfect square without `sqrt()`.
- **Optimal Approach:** Binary search range $[1, num]$. Check if $mid \times mid == num$.
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** $num = 1$.

#### Q226: Arrange Coins
- **Difficulty:** `[Easy]` | **Pattern:** `[Binary Search on Triangular Numbers]`
- **Statement:** Find number of complete staircase rows built with $n$ coins.
- **Optimal Approach:** Binary search $k$: condition $k(k + 1) / 2 \le n$. Or closed-form math: $\lfloor (\sqrt{8n + 1} - 1) / 2 \rfloor$.
- **Complexity:** Time: $O(1)$ math or $O(\log n)$ BS | Space: $O(1)$
- **Edge Cases:** Large $n$ causing integer overflow in $k(k+1)$.

#### Q227: First Bad Version
- **Difficulty:** `[Easy]` | **Pattern:** `[Lower Bound Binary Search]`
- **Statement:** Given API `isBadVersion(version)`, find first bad version minimizing API calls.
- **Optimal Approach:** Binary search range $[1, n]$. If `isBadVersion(mid)` is true, `high = mid`; else `low = mid + 1`.
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** Version 1 is already bad.

#### Q228: Missing Number in Sorted Array
- **Difficulty:** `[Easy]` | **Pattern:** `[Index Discrepancy Binary Search]`
- **Statement:** Given sorted array of arithmetic progression with one missing number, find it.
- **Optimal Approach:** Compare $arr[mid]$ with expected value $arr[0] + mid \cdot d$. If matches, missing number is in right half.
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** Missing number in first gap.

#### Q229: Count Negative Numbers in a Sorted Matrix
- **Difficulty:** `[Easy]` | **Pattern:** `[Staircase Matrix Walk]`
- **Statement:** Count negative numbers in matrix sorted non-increasingly row-wise and column-wise.
- **Optimal Approach:** Start at bottom-left corner $(R-1, 0)$. If cell is negative, all cells to right in this row are negative: add $C - col$, `row--`; else `col++`.
- **Complexity:** Time: $O(R + C)$ | Space: $O(1)$
- **Edge Cases:** All negative, all positive.

#### Q230: Sum of Mutated Array Closest to Target
- **Difficulty:** `[Medium]` | **Pattern:** `[BS on Cap Value]`
- **Statement:** Choose integer `value` such that replacing elements $> value$ with `value` makes sum closest to target.
- **Optimal Approach:** Binary search `value` in $[0, \max(arr)]$. Calculate capped sum and choose value minimizing difference to target.
- **Complexity:** Time: $O(n \log(\max A))$ | Space: $O(1)$
- **Edge Cases:** Multiple values give same difference (return smaller value).

#### Q231: Minimum Number of Days to Make m Bouquets
- **Difficulty:** `[Medium]` | **Pattern:** `[BS on Answer Space]`
- **Statement:** Bloom days array. Make $m$ bouquets of $k$ adjacent flowers. Find min day.
- **Optimal Approach:** Binary search day in $[1, \max(\text{bloomDay})]$. Greedily count adjacent flowers bloomed by day $D$.
- **Complexity:** Time: $O(n \log(\max D))$ | Space: $O(1)$
- **Edge Cases:** $m \times k > n$ (impossible, returns $-1$).

#### Q232: Cutting Ribbons
- **Difficulty:** `[Medium]` | **Pattern:** `[BS on Answer Space]`
- **Statement:** Cut ribbons into at least $k$ pieces of equal integer length. Maximize length.
- **Optimal Approach:** Binary search length $L \in [1, \max(ribbons)]$. Count pieces: $\sum \lfloor ribbon / L \rfloor \ge k$.
- **Complexity:** Time: $O(n \log(\max R))$ | Space: $O(1)$
- **Edge Cases:** Total length $< k$ (returns 0).

#### Q233: Maximum Running Time of N Computers
- **Difficulty:** `[Hard]` | **Pattern:** `[BS on Answer with Battery Cap]`
- **Statement:** Run $n$ computers simultaneously for $T$ minutes using batteries. Maximize $T$.
- **Optimal Approach:** Binary search time $T \in [1, \sum \text{batteries} / n]$. A battery with charge $b$ can contribute at most $\min(b, T)$ minutes. Valid if $\sum \min(b, T) \ge n \cdot T$.
- **Complexity:** Time: $O(B \log(\sum B))$ | Space: $O(1)$
- **Edge Cases:** Large batteries with charge exceeding $T$.

#### Q234: Minimum Limit of Balls in a Bag
- **Difficulty:** `[Medium]` | **Pattern:** `[BS on Max Bag Size]`
- **Statement:** Divide bags of balls in at most $maxOps$ operations to minimize max bag size.
- **Optimal Approach:** Binary search penalty $P \in [1, \max(nums)]$. Operations needed is $\sum \lceil num / P \rceil - 1 \le maxOps$.
- **Complexity:** Time: $O(n \log(\max A))$ | Space: $O(1)$
- **Edge Cases:** $maxOps = 0$.

#### Q235: Online Election
- **Difficulty:** `[Medium]` | **Pattern:** `[Precomputed Leaders + Binary Search]`
- **Statement:** Query candidate leading vote at timestamp $t$.
- **Optimal Approach:** Precompute leader at each vote timestamp. Query uses binary search (`upper_bound - 1`) on vote times to find latest leader.
- **Complexity:** Preprocess: $O(n)$ | Query: $O(\log n)$ | Space: $O(n)$
- **Edge Cases:** Tie in votes (most recent vote breaks tie).

#### Q236: Russian Doll Envelopes
- **Difficulty:** `[Hard]` | **Pattern:** `[Sort + 1D LIS via Patience Sorting]`
- **Statement:** Find maximum envelopes you can Russian doll (fit inside one another).
- **Optimal Approach:** Sort envelopes: ascending width, and **descending height** for ties! Extract heights; find Longest Increasing Subsequence using binary search.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Envelopes with identical widths (descending sort on height prevents nesting identical widths).

#### Q237: Longest Increasing Subsequence
- **Difficulty:** `[Medium]` | **Pattern:** `[Patience Sorting with Binary Search]`
- **Statement:** Find length of longest strictly increasing subsequence in $O(n \log n)$ time.
- **Optimal Approach:** Maintain `tails` array where `tails[i]` is smallest tail of all increasing subsequences of length $i + 1$. For each $x$, binary search (`lower_bound`) in `tails` and update/append.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Strictly decreasing array (length 1), all elements equal.

#### Q238: Find in Mountain Array
- **Difficulty:** `[Hard]` | **Pattern:** `[Triple Binary Search]`
- **Statement:** Find target in `MountainArray` with $\le 100$ calls to `get()`.
- **Optimal Approach:** 1. BS to find peak index. 2. BS on ascending left slope. 3. If not found, BS on descending right slope.
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** Target at peak, target present on both slopes (must return smaller index).

#### Q239: Heaters
- **Difficulty:** `[Medium]` | **Pattern:** `[Binary Search Nearest Neighbor]`
- **Statement:** Find minimum radius for heaters to warm all houses.
- **Optimal Approach:** Sort heaters. For each house, binary search closest heater to left and right. Radius is $\max_{\text{houses}} \min(\text{distToLeft}, \text{distToRight})$.
- **Complexity:** Time: $O((n + m) \log m)$ | Space: $O(1)$ auxiliary
- **Edge Cases:** All heaters to one side of all houses.

#### Q240: Guess Number Higher or Lower
- **Difficulty:** `[Easy]` | **Pattern:** `[Interactive Binary Search]`
- **Statement:** Guess number $1 \dots n$ using `guess(num)` feedback ($-1, 1, 0$).
- **Optimal Approach:** Standard binary search. Midpoint calculation $low + (high - low) / 2$ to prevent integer overflow.
- **Complexity:** Time: $O(\log n)$ | Space: $O(1)$
- **Edge Cases:** Number is 1 or $n$.

---
[⬅️ Previous: Volume 02 — Linked Lists, Stacks & Queues](file:///d:/DSA/Part-11-Problem-Bank-and-Revision/02_linked_lists_stacks_queues_60.md) | [Next: Volume 04 — Trees, BSTs, Heaps & Tries (Q241–Q340) ➡️](file:///d:/DSA/Part-11-Problem-Bank-and-Revision/04_trees_bst_tries_heaps_100.md)
