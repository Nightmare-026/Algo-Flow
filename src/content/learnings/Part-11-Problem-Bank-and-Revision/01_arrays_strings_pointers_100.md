# 📚 Part 11: Problem Bank — Volume 01: Arrays, Strings, Matrices & Pointer Patterns (100 Problems)

> **Problems Covered:** Q001 to Q100  
> **Patterns:** Two Pointers &bull; Sliding Window &bull; Prefix Sum &bull; Difference Array &bull; Kadane's &bull; Dutch National Flag &bull; Boyer-Moore &bull; Matrix Traversal

---

## Section 1: Array Fundamentals & In-Place Manipulations (Q001 – Q020)

#### Q001: Two Sum
- **Difficulty:** `[Easy]` | **Pattern:** `[Hash Map Lookup]`
- **Statement:** Given an array of integers `nums` and integer `target`, return indices of the two numbers that add up to `target`.
- **Optimal Approach:** Iterate through `nums`, maintaining a hash map of `{value: index}`. For each `nums[i]`, check if `target - nums[i]` exists in the map.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Negative numbers, duplicate values, target achievable using the same element twice (prevented by checking index).

#### Q002: Best Time to Buy and Sell Stock
- **Difficulty:** `[Easy]` | **Pattern:** `[Greedy / Running Minimum]`
- **Statement:** Maximize profit by choosing a single day to buy and a single future day to sell.
- **Optimal Approach:** Track running minimum price seen so far. At each day $i$, compute potential profit `prices[i] - minPrice` and update max profit.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Strictly decreasing prices (profit must remain 0), single element array.

#### Q003: Best Time to Buy and Sell Stock II
- **Difficulty:** `[Medium]` | **Pattern:** `[Greedy Peak-Valley]`
- **Statement:** Buy and sell on multiple days to maximize profit (at most 1 share held at any time).
- **Optimal Approach:** Sum all positive daily price increments: if `prices[i] > prices[i-1]`, add `prices[i] - prices[i-1]` to total profit.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Strictly decreasing prices, equal prices consecutively.

#### Q004: Contains Duplicate
- **Difficulty:** `[Easy]` | **Pattern:** `[Hash Set]`
- **Statement:** Return `true` if any value appears at least twice in the array.
- **Optimal Approach:** Insert elements into a hash set; if an element is already present, return `true`.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Empty array, all unique elements.

#### Q005: Contains Duplicate II
- **Difficulty:** `[Easy]` | **Pattern:** `[Sliding Window Hash Set]`
- **Statement:** Return `true` if `nums[i] == nums[j]` and $|i - j| \le k$.
- **Optimal Approach:** Maintain a hash set of size at most $k$. Remove `nums[i - k - 1]` when sliding window exceeds $k$.
- **Complexity:** Time: $O(n)$ | Space: $O(\min(n, k))$
- **Edge Cases:** $k = 0$, $k \ge n$.

#### Q006: Product of Array Except Self
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix & Suffix Products]`
- **Statement:** Return an array `output` where `output[i]` is the product of all elements except `nums[i]` without using division.
- **Optimal Approach:** Compute prefix products left-to-right into output array, then traverse right-to-left maintaining a running suffix product.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$ auxiliary (excluding output array)
- **Edge Cases:** Multiple zeroes (all outputs 0), single zero (only that index non-zero), negative numbers.

#### Q007: Maximum Subarray (Kadane's Algorithm)
- **Difficulty:** `[Medium]` | **Pattern:** `[Dynamic Programming / Kadane]`
- **Statement:** Find the contiguous subarray with the largest sum.
- **Optimal Approach:** Maintain `currentSum = max(nums[i], currentSum + nums[i])` and `maxSum = max(maxSum, currentSum)`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** All negative numbers (must return the maximum single negative number).

#### Q008: Maximum Product Subarray
- **Difficulty:** `[Medium]` | **Pattern:** `[Dual State Kadane]`
- **Statement:** Find the contiguous subarray with the largest product.
- **Optimal Approach:** Maintain both `curMax` and `curMin` at each step. When `nums[i] < 0`, swap `curMax` and `curMin` before multiplying.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Array containing zeroes (resets product to 1), odd number of negative values.

#### Q009: Rotate Array
- **Difficulty:** `[Medium]` | **Pattern:** `[Array Reversal]`
- **Statement:** Rotate an array of $n$ elements to the right by $k$ steps.
- **Optimal Approach:** Normalize $k = k \bmod n$. Reverse the entire array, reverse the first $k$ elements, then reverse the remaining $n - k$ elements.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** $k = 0$, $k > n$, $n = 1$.

#### Q010: Move Zeroes
- **Difficulty:** `[Easy]` | **Pattern:** `[Two Pointers / Fast-Slow]`
- **Statement:** Move all zeroes to the end of the array while maintaining the relative order of non-zero elements.
- **Optimal Approach:** Slow pointer `insertPos` tracks position for next non-zero. Fast pointer iterates; when non-zero found, swap `nums[insertPos++]` with `nums[i]`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Array with no zeroes, array with all zeroes.

#### Q011: Majority Element
- **Difficulty:** `[Easy]` | **Pattern:** `[Boyer-Moore Voting]`
- **Statement:** Find the element that appears more than $\lfloor n / 2 \rfloor$ times.
- **Optimal Approach:** Maintain `candidate` and `count`. If `count == 0`, choose current element as candidate. If `nums[i] == candidate`, increment count; else decrement count.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Single element array, majority element appearing exactly $\lfloor n/2 \rfloor + 1$ times.

#### Q012: Majority Element II
- **Difficulty:** `[Medium]` | **Pattern:** `[Extended Boyer-Moore]`
- **Statement:** Find all elements that appear more than $\lfloor n / 3 \rfloor$ times (at most 2 candidates).
- **Optimal Approach:** Maintain 2 candidates and 2 counters. Second pass to verify both candidates actually exceed $\lfloor n/3 \rfloor$.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** No element meets threshold, 1 element meets threshold, 2 elements meet threshold.

#### Q013: Missing Number
- **Difficulty:** `[Easy]` | **Pattern:** `[Bit XOR / Gauss Formula]`
- **Statement:** Given an array containing $n$ distinct numbers in range $[0, n]$, find the missing number.
- **Optimal Approach:** XOR all indices $0 \dots n$ and all array values. Since $x \oplus x = 0$, the remaining value is the missing number.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Missing number is 0, missing number is $n$.

#### Q014: Find All Duplicates in an Array
- **Difficulty:** `[Medium]` | **Pattern:** `[In-Place Index Negation]`
- **Statement:** Array of length $n$ with numbers in $[1, n]$ where elements appear once or twice. Find all duplicates in $O(n)$ time and $O(1)$ space.
- **Optimal Approach:** For each value $v = |nums[i]|$, inspect `nums[v - 1]`. If already negative, $v$ is a duplicate; else negate `nums[v - 1]`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$ auxiliary
- **Edge Cases:** No duplicates, all numbers duplicated.

#### Q015: Merge Sorted Array
- **Difficulty:** `[Easy]` | **Pattern:** `[Three Pointers Backward]`
- **Statement:** Merge sorted array `nums2` into `nums1` in-place (nums1 has size $m + n$).
- **Optimal Approach:** Populate `nums1` from the back (index $m + n - 1$) by comparing largest remaining elements of both arrays.
- **Complexity:** Time: $O(m + n)$ | Space: $O(1)$
- **Edge Cases:** $m = 0$ (copy all from nums2), $n = 0$ (nothing to do).

#### Q016: Remove Duplicates from Sorted Array
- **Difficulty:** `[Easy]` | **Pattern:** `[Two Pointers Read/Write]`
- **Statement:** Remove duplicates in-place such that each unique element appears once. Return count of unique elements.
- **Optimal Approach:** Slow pointer `k = 0`. Fast pointer `i` scans; whenever `nums[i] != nums[k]`, increment `k` and set `nums[k] = nums[i]`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Array with all identical elements, all unique elements.

#### Q017: Remove Duplicates from Sorted Array II
- **Difficulty:** `[Medium]` | **Pattern:** `[Two Pointers with Count Limit]`
- **Statement:** Remove duplicates in-place such that duplicates appear at most twice.
- **Optimal Approach:** For each element $x$ in `nums`, if `k < 2` or `x != nums[k - 2]`, write `nums[k++] = x`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Length $< 2$, all elements equal.

#### Q018: Next Permutation
- **Difficulty:** `[Medium]` | **Pattern:** `[Lexicographical Permutation Scan]`
- **Statement:** Rearrange numbers into the lexicographically next greater permutation.
- **Optimal Approach:** Scan from right to find first pivot $i$ where $nums[i] < nums[i+1]$. From right, find smallest element $> nums[i]$, swap them, and reverse suffix from $i+1$ to end.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Array sorted in descending order (reverses to fully ascending).

#### Q019: Set Matrix Zeroes
- **Difficulty:** `[Medium]` | **Pattern:** `[Matrix In-Place Markers]`
- **Statement:** If an element in an $M \times N$ matrix is 0, set its entire row and column to 0 in-place.
- **Optimal Approach:** Use the first row and first column as marker arrays. Use two boolean flags to record whether row 0 and col 0 themselves originally had zeroes.
- **Complexity:** Time: $O(M \cdot N)$ | Space: $O(1)$
- **Edge Cases:** Zero at $(0, 0)$, matrix with only 1 row or 1 column.

#### Q020: Spiral Matrix
- **Difficulty:** `[Medium]` | **Pattern:** `[Layered Boundary Shrinking]`
- **Statement:** Return all elements of an $M \times N$ matrix in spiral order.
- **Optimal Approach:** Maintain four boundaries: `top, bottom, left, right`. Traverse right, down, left, up, shrinking boundaries after each direction.
- **Complexity:** Time: $O(M \cdot N)$ | Space: $O(1)$ auxiliary
- **Edge Cases:** Single row matrix, single column matrix, rectangular matrices where $M \ne N$.

---

## Section 2: Two Pointer Mastery (Q021 – Q040)

#### Q021: Valid Palindrome
- **Difficulty:** `[Easy]` | **Pattern:** `[Two Pointers Inward]`
- **Statement:** Check if string is palindrome considering only alphanumeric characters and ignoring cases.
- **Optimal Approach:** Left and right pointers moving inward, skipping non-alphanumerics and comparing lowercase characters.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** String with no alphanumerics (returns `true`), single character.

#### Q022: Two Sum II - Input Array Is Sorted
- **Difficulty:** `[Medium]` | **Pattern:** `[Two Pointers Inward]`
- **Statement:** Find two indices in 1-indexed sorted array that sum to `target`.
- **Optimal Approach:** If `nums[left] + nums[right] > target`, decrement `right`; if smaller, increment `left`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Negative target, exactly 2 elements.

#### Q023: 3Sum
- **Difficulty:** `[Medium]` | **Pattern:** `[Sort + Two Pointers]`
- **Statement:** Return all unique triplets $[nums[i], nums[j], nums[k]]$ summing to 0.
- **Optimal Approach:** Sort array. Iterate $i$ from 0 to $n-3$. Skip duplicate $nums[i]$. Use two pointers for remaining target $-nums[i]$, skipping duplicates on matches.
- **Complexity:** Time: $O(n^2)$ | Space: $O(1)$ auxiliary
- **Edge Cases:** Array with $< 3$ elements, all zeroes `[0, 0, 0]`, duplicate triplets avoided.

#### Q024: 3Sum Closest
- **Difficulty:** `[Medium]` | **Pattern:** `[Sort + Two Pointers]`
- **Statement:** Find three integers whose sum is closest to `target`.
- **Optimal Approach:** Sort array. For each index, use two pointers, updating `closestSum` whenever $|sum - target| < |closestSum - target|$.
- **Complexity:** Time: $O(n^2)$ | Space: $O(1)$
- **Edge Cases:** Exact match found (return immediately).

#### Q025: 4Sum
- **Difficulty:** `[Medium]` | **Pattern:** `[Sort + 2-Loop Two Pointers]`
- **Statement:** Return all unique quadruplets summing to `target`.
- **Optimal Approach:** Sort array. Nested loops for first two elements with duplicate skipping, then two pointers for remaining two elements.
- **Complexity:** Time: $O(n^3)$ | Space: $O(1)$ auxiliary
- **Edge Cases:** Integer overflow in sums (use 64-bit integer during sum checks).

#### Q026: Container With Most Water
- **Difficulty:** `[Medium]` | **Pattern:** `[Two Pointers Greedy]`
- **Statement:** Find two lines that together with x-axis form a container holding the most water.
- **Optimal Approach:** Left at 0, right at $n-1$. Area is $(right - left) \times \min(H[left], H[right])$. Always advance the pointer pointing to the shorter height!
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** All heights equal, strictly increasing heights.

#### Q027: Trapping Rain Water
- **Difficulty:** `[Hard]` | **Pattern:** `[Two Pointers Left/Right Max]`
- **Statement:** Compute how much water elevation map can trap after raining.
- **Optimal Approach:** Two pointers with `leftMax` and `rightMax`. If `leftMax < rightMax`, water trapped at left is `leftMax - height[left]` and advance `left`; else mirror for `right`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Monotonically increasing/decreasing slopes (traps 0), flat array.

#### Q028: Sort Colors (Dutch National Flag)
- **Difficulty:** `[Medium]` | **Pattern:** `[Three-Way Partitioning]`
- **Statement:** Sort array of 0s, 1s, and 2s in-place in a single pass.
- **Optimal Approach:** Pointers `low = 0, mid = 0, high = n - 1`. If `nums[mid] == 0`, swap with `low++`, `mid++`. If 1, `mid++`. If 2, swap with `high--`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Array with all 0s, all 1s, or all 2s.

#### Q029: Boats to Save People
- **Difficulty:** `[Medium]` | **Pattern:** `[Greedy Two Pointers]`
- **Statement:** Each boat carries at most 2 people under `limit`. Find minimum boats.
- **Optimal Approach:** Sort people. Pair heaviest person with lightest if `people[left] + people[right] <= limit`. Always place heaviest person on boat (`right--`).
- **Complexity:** Time: $O(n \log n)$ | Space: $O(1)$
- **Edge Cases:** All people exceed half the limit.

#### Q030: Squares of a Sorted Array
- **Difficulty:** `[Easy]` | **Pattern:** `[Two Pointers from Ends]`
- **Statement:** Given sorted array with negative numbers, return array of squares in sorted order.
- **Optimal Approach:** Pointers at left and right. Compare $|nums[left]|$ and $|nums[right]|$. Place larger square at back of result array.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** All positive numbers, all negative numbers.

#### Q031: Interval List Intersections
- **Difficulty:** `[Medium]` | **Pattern:** `[Two Pointer Sweepline]`
- **Statement:** Find intersections of two closed interval lists.
- **Optimal Approach:** Intersection is $[\max(A[i].start, B[j].start), \min(A[i].end, B[j].end)]$. Valid if $start \le end$. Advance the interval with the smaller endpoint.
- **Complexity:** Time: $O(n + m)$ | Space: $O(1)$ auxiliary
- **Edge Cases:** Non-overlapping intervals, one interval fully contained in another.

#### Q032: Remove Element
- **Difficulty:** `[Easy]` | **Pattern:** `[Two Pointers Fast-Slow]`
- **Statement:** Remove all instances of `val` in-place and return new length.
- **Optimal Approach:** Write pointer `k = 0`. Iterate through array; when `nums[i] != val`, assign `nums[k++] = nums[i]`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** All elements equal to `val`, no elements equal to `val`.

#### Q033: Reverse String
- **Difficulty:** `[Easy]` | **Pattern:** `[Two Pointers Swap]`
- **Statement:** Reverse an array of characters in-place.
- **Optimal Approach:** Swap `s[left++]` with `s[right--]` until pointers cross.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Length 0 or 1, even vs odd lengths.

#### Q034: Reverse Vowels of a String
- **Difficulty:** `[Easy]` | **Pattern:** `[Two Pointers Filtered Swap]`
- **Statement:** Reverse only the vowels in a string.
- **Optimal Approach:** Left and right pointers scanning inward; advance until both point to vowels, then swap.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** No vowels, all vowels, uppercase vs lowercase vowels.

#### Q035: Valid Palindrome II
- **Difficulty:** `[Easy]` | **Pattern:** `[Two Pointers with 1 Skip]`
- **Statement:** Check if string can be palindrome after deleting at most one character.
- **Optimal Approach:** Inward two pointers. On first mismatch `s[l] != s[r]`, check if substring `s[l+1...r]` OR `s[l...r-1]` is a palindrome.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Already a palindrome, deletion at start vs end.

#### Q036: Backspace String Compare
- **Difficulty:** `[Easy]` | **Pattern:** `[Two Pointers Backward]`
- **Statement:** Compare strings `s` and `t` containing `'#'` (backspace) in $O(1)$ space.
- **Optimal Approach:** Traverse both strings backwards, tracking skip counters for active `#` characters.
- **Complexity:** Time: $O(n + m)$ | Space: $O(1)$
- **Edge Cases:** Consecutive backspaces exceeding string length (`"ab##"` becomes `""`).

#### Q037: Find the Duplicate Number
- **Difficulty:** `[Medium]` | **Pattern:** `[Floyd Cycle Detection]`
- **Statement:** Array of $n+1$ integers in range $[1, n]$ with one duplicate. Find it in $O(n)$ time and $O(1)$ space without modifying array.
- **Optimal Approach:** Model as linked list where $i \to nums[i]$. Use Tortoise and Hare pointers to find cycle intersection, then reset slow to 0 to find cycle entry.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Duplicate appears multiple times ($> 2$ times).

#### Q038: 4Sum II
- **Difficulty:** `[Medium]` | **Pattern:** `[Hash Map Pair Splitting]`
- **Statement:** Given four arrays $A, B, C, D$, find tuples $(i, j, k, l)$ such that $A[i] + B[j] + C[k] + D[l] = 0$.
- **Optimal Approach:** Compute pairwise sums of $A$ and $B$ into hash map with frequencies. For pairs in $C$ and $D$, query $-(C[k] + D[l])$ in map.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n^2)$
- **Edge Cases:** All values 0 (combinatorial explosion).

#### Q039: Longest Mountain in Array
- **Difficulty:** `[Medium]` | **Pattern:** `[Peak Finding Two Pointers]`
- **Statement:** Find length of longest mountain subarray (strictly increasing then strictly decreasing, length $\ge 3$).
- **Optimal Approach:** Identify peak elements where $A[i-1] < A[i] > A[i+1]$. Expand left and right from each peak to measure mountain length.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Flat plateaus (invalidates mountain), strictly monotonic arrays.

#### Q040: Assign Cookies
- **Difficulty:** `[Easy]` | **Pattern:** `[Greedy Two Pointers]`
- **Statement:** Maximize number of content children given greed factors and cookie sizes.
- **Optimal Approach:** Sort both arrays. Match smallest sufficient cookie to the least greedy child using two pointers.
- **Complexity:** Time: $O(n \log n + m \log m)$ | Space: $O(1)$
- **Edge Cases:** Cookies all too small, children with equal greed factors.

---

## Section 3: Sliding Window Mastery (Q041 – Q060)

#### Q041: Maximum Sum Subarray of Size K
- **Difficulty:** `[Easy]` | **Pattern:** `[Fixed Sliding Window]`
- **Statement:** Find maximum sum of any contiguous subarray of size $k$.
- **Optimal Approach:** Compute sum of first $k$ elements. Slide window across: add incoming element $A[i]$ and subtract outgoing $A[i-k]$.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** $k = 1$, $k = n$.

#### Q042: Longest Substring Without Repeating Characters
- **Difficulty:** `[Medium]` | **Pattern:** `[Variable Sliding Window]`
- **Statement:** Find length of longest substring without repeating characters.
- **Optimal Approach:** Window $[L, R]$. Maintain hash map of character last seen index. When duplicate seen at or after $L$, move $L = \text{map}[c] + 1$.
- **Complexity:** Time: $O(n)$ | Space: $O(\min(n, |\Sigma|))$
- **Edge Cases:** Empty string, string of all identical characters.

#### Q043: Longest Repeating Character Replacement
- **Difficulty:** `[Medium]` | **Pattern:** `[Variable Sliding Window]`
- **Statement:** Given string and $k$ operations to replace characters, find longest substring with all identical letters.
- **Optimal Approach:** Window $[L, R]$. Track `maxFreq` of any character in window. If $(R - L + 1) - maxFreq > k$, shrink window from left.
- **Complexity:** Time: $O(n)$ | Space: $O(26) = O(1)$
- **Edge Cases:** $k \ge n$ (entire string can be replaced).

#### Q044: Minimum Window Substring
- **Difficulty:** `[Hard]` | **Pattern:** `[Variable Sliding Window with Frequency Map]`
- **Statement:** Find smallest substring in $S$ that contains all characters of $T$ including duplicates.
- **Optimal Approach:** Frequency map of $T$. Expand $R$ until window contains all characters (`formed == required`). Then contract $L$ while window remains valid, updating min window.
- **Complexity:** Time: $O(|S| + |T|)$ | Space: $O(|\Sigma|)$
- **Edge Cases:** No valid window exists (return `""`), $T$ longer than $S$.

#### Q045: Permutation in String
- **Difficulty:** `[Medium]` | **Pattern:** `[Fixed Sliding Window Match Count]`
- **Statement:** Return `true` if $s2$ contains a permutation of $s1$.
- **Optimal Approach:** Window of size $|s1|$ on $s2$. Maintain character counts. Track number of matching characters between window and $s1$.
- **Complexity:** Time: $O(|s2|)$ | Space: $O(26) = O(1)$
- **Edge Cases:** $|s1| > |s2|$.

#### Q046: Find All Anagrams in a String
- **Difficulty:** `[Medium]` | **Pattern:** `[Fixed Sliding Window]`
- **Statement:** Find all start indices of $p$'s anagrams in $s$.
- **Optimal Approach:** Fixed window of size $|p|$. Maintain count arrays for window and $p$. Compare counts at each slide.
- **Complexity:** Time: $O(|s|)$ | Space: $O(26) = O(1)$
- **Edge Cases:** $|p| > |s|$.

#### Q047: Sliding Window Maximum
- **Difficulty:** `[Hard]` | **Pattern:** `[Monotonic Decreasing Deque]`
- **Statement:** Return maximum element in every sliding window of size $k$.
- **Optimal Approach:** Monotonic deque storing indices with values in decreasing order. Remove elements outside window from front, remove elements smaller than incoming from back.
- **Complexity:** Time: $O(n)$ | Space: $O(k)$
- **Edge Cases:** $k = 1$, strictly increasing/decreasing array.

#### Q048: Minimum Size Subarray Sum
- **Difficulty:** `[Medium]` | **Pattern:** `[Variable Sliding Window]`
- **Statement:** Return minimal length of contiguous subarray with sum $\ge target$.
- **Optimal Approach:** Expand $R$ adding to running sum. While `sum >= target`, record window length $R - L + 1$, subtract $nums[L++]$.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Sum of all elements $< target$ (return 0).

#### Q049: Fruit Into Baskets
- **Difficulty:** `[Medium]` | **Pattern:** `[At Most K Distinct]`
- **Statement:** Find length of longest subarray containing at most 2 distinct integers.
- **Optimal Approach:** Sliding window with hash map of counts. Shrink $L$ whenever `map.size() > 2`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$ (at most 3 keys)
- **Edge Cases:** All fruits identical, only 2 types in entire array.

#### Q050: Max Consecutive Ones III
- **Difficulty:** `[Medium]` | **Pattern:** `[Sliding Window Zero Count]`
- **Statement:** Given binary array, find max consecutive 1s if you can flip at most $k$ 0s.
- **Optimal Approach:** Window $[L, R]$. Increment `zeroCount` when $nums[R] == 0$. If `zeroCount > k`, shrink $L$ until `zeroCount <= k`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** $k = 0$, array of all 0s.

#### Q051: Subarrays with K Different Integers
- **Difficulty:** `[Hard]` | **Pattern:** `[Exact K via AtMost(K) - AtMost(K-1)]`
- **Statement:** Count contiguous subarrays containing exactly $k$ different integers.
- **Optimal Approach:** Compute `atMost(k) - atMost(k - 1)` where `atMost(m)` counts subarrays with at most $m$ distinct elements in $O(n)$ time.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** $k = 1$, $k > n$.

#### Q052: Count Number of Nice Subarrays
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix Sum / Sliding Window]`
- **Statement:** A subarray is nice if it contains exactly $k$ odd numbers.
- **Optimal Approach:** Replace odd numbers with 1 and even with 0. Reduces directly to Subarray Sum Equals $K$ or `atMost(k) - atMost(k - 1)`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Array with no odd numbers, $k$ exceeds total odd numbers.

#### Q053: Binary Subarrays With Sum
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix Sum / Sliding Window]`
- **Statement:** Count non-empty subarrays with sum equal to `goal` in binary array.
- **Optimal Approach:** Use `atMost(goal) - atMost(goal - 1)` sliding window.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** `goal = 0`.

#### Q054: Frequency of the Most Frequent Element
- **Difficulty:** `[Medium]` | **Pattern:** `[Sort + Sliding Window Cost]`
- **Statement:** Maximize frequency of an element after incrementing elements at most $k$ times.
- **Optimal Approach:** Sort array. Window $[L, R]$ where cost to make all elements equal to $nums[R]$ is $(R - L + 1) \times nums[R] - \text{windowSum}$. If cost $> k$, advance $L$.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(1)$ auxiliary
- **Edge Cases:** $k = 0$, all elements already equal.

#### Q055: Grumpy Bookstore Owner
- **Difficulty:** `[Medium]` | **Pattern:** `[Fixed Sliding Window Improvement]`
- **Statement:** Maximize satisfied customers using a secret technique for $minutes$ window to keep owner not grumpy.
- **Optimal Approach:** Sum all customers where owner is already not grumpy. Use fixed window of size $minutes$ to maximize additional satisfied customers.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Owner never grumpy, owner always grumpy.

#### Q056: Subarray Product Less Than K
- **Difficulty:** `[Medium]` | **Pattern:** `[Variable Sliding Window]`
- **Statement:** Count contiguous subarrays where product of elements is strictly less than $k$.
- **Optimal Approach:** If $k \le 1$, return 0. Window $[L, R]$ maintaining product. If product $\ge k$, divide by $nums[L++]$. Add $R - L + 1$ to answer.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** $k = 0$, $k = 1$, numbers containing 1s.

#### Q057: Longest Substring with At Most Two Distinct Characters
- **Difficulty:** `[Medium]` | **Pattern:** `[Variable Sliding Window]`
- **Statement:** Find length of longest substring with at most 2 distinct characters.
- **Optimal Approach:** Maintain character counts in hash map. When size $> 2$, increment $L$ until a character count reaches 0 and remove it.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** String length $\le 2$.

#### Q058: Minimum Window Subsequence
- **Difficulty:** `[Hard]` | **Pattern:** `[Two Pointer Forward-Backward Scan]`
- **Statement:** Find shortest substring of $S$ containing $T$ as a subsequence.
- **Optimal Approach:** Find match for $T$ scanning right in $S$. Once matched, scan backward from rightmost character to find optimal start.
- **Complexity:** Time: $O(|S| \cdot |T|)$ | Space: $O(1)$
- **Edge Cases:** No valid subsequence exists.

#### Q059: Maximum Points You Can Obtain from Cards
- **Difficulty:** `[Medium]` | **Pattern:** `[Inverted Sliding Window]`
- **Statement:** Pick $k$ cards from either end of row to maximize score.
- **Optimal Approach:** Equivalent to minimizing the sum of an unpicked contiguous subarray of size $n - k$.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** $k = n$ (sum entire array).

#### Q060: Defuse the Bomb
- **Difficulty:** `[Easy]` | **Pattern:** `[Circular Fixed Sliding Window]`
- **Statement:** Replace each number with sum of next $k$ (or previous $|k|$) numbers circularly.
- **Optimal Approach:** If $k = 0$, return all 0s. Maintain sliding window of size $|k|$ over doubled array using modulo arithmetic.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$ auxiliary
- **Edge Cases:** $k < 0$, $k > n$.

---

## Section 4: Prefix Sum & Difference Arrays (Q061 – Q080)

#### Q061: Range Sum Query - Immutable
- **Difficulty:** `[Easy]` | **Pattern:** `[1D Prefix Sum]`
- **Statement:** Calculate sum of elements between indices $L$ and $R$ inclusive in $O(1)$ time.
- **Optimal Approach:** Precompute $P[i] = P[i-1] + A[i-1]$. Query returns $P[R + 1] - P[L]$.
- **Complexity:** Preprocess: $O(n)$ | Query: $O(1)$ | Space: $O(n)$
- **Edge Cases:** $L = 0$, $L = R$.

#### Q062: Range Sum Query 2D - Immutable
- **Difficulty:** `[Medium]` | **Pattern:** `[2D Prefix Sum]`
- **Statement:** Calculate sum of rectangle from $(r1, c1)$ to $(r2, c2)$ in $O(1)$ time.
- **Optimal Approach:** $P[r][c] = M[r][c] + P[r-1][c] + P[r][c-1] - P[r-1][c-1]$. Query returns $P[r2][c2] - P[r1-1][c2] - P[r2][c1-1] + P[r1-1][c1-1]$.
- **Complexity:** Preprocess: $O(R \cdot C)$ | Query: $O(1)$ | Space: $O(R \cdot C)$
- **Edge Cases:** Querying single cell, querying full matrix.

#### Q063: Subarray Sum Equals K
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix Sum + Hash Map]`
- **Statement:** Find total number of continuous subarrays whose sum equals $k$.
- **Optimal Approach:** Maintain running prefix sum $P$. Map stores `{prefixSum: count}`, initialized with `{0: 1}`. Add `map[P - k]` to answer.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Negative numbers (prefix sum not monotonic), $k = 0$.

#### Q064: Continuous Subarray Sum
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix Sum Modulo Hash Map]`
- **Statement:** Return `true` if array has continuous subarray of size $\ge 2$ summing to a multiple of $k$.
- **Optimal Approach:** Map stores `{prefixSum % k: earliestIndex}`. If same remainder seen at index $\ge 2$ distance, return `true`.
- **Complexity:** Time: $O(n)$ | Space: $O(\min(n, k))$
- **Edge Cases:** $k = 0$, multiple zeroes consecutively.

#### Q065: Subarray Sums Divisible by K
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix Sum Remainder Combinatorics]`
- **Statement:** Count contiguous subarrays whose sum is divisible by $k$.
- **Optimal Approach:** Track frequency of $(P \bmod k + k) \bmod k$. For frequency $c$, add $\binom{c}{2}$ to answer.
- **Complexity:** Time: $O(n)$ | Space: $O(k)$
- **Edge Cases:** Negative numbers causing negative remainders.

#### Q066: Find Pivot Index
- **Difficulty:** `[Easy]` | **Pattern:** `[Running Left Sum vs Total Sum]`
- **Statement:** Find index where sum of elements strictly to left equals sum strictly to right.
- **Optimal Approach:** Compute `totalSum`. Maintain `leftSum`. Pivot condition: `leftSum == totalSum - leftSum - nums[i]`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Pivot at index 0 (left sum 0), pivot at index $n-1$.

#### Q067: Corporate Flight Bookings
- **Difficulty:** `[Medium]` | **Pattern:** `[Difference Array]`
- **Statement:** Given bookings $[first, last, seats]$, return total seats booked on each flight $1 \dots n$.
- **Optimal Approach:** Difference array $D$. For booking $[l, r, s]$, set $D[l] \mathrel{+}= s$ and $D[r+1] \mathrel{-}= s$. Take running prefix sum.
- **Complexity:** Time: $O(n + \text{bookings})$ | Space: $O(n)$
- **Edge Cases:** Bookings covering all flights, booking covering single flight.

#### Q068: Range Addition
- **Difficulty:** `[Medium]` | **Pattern:** `[Difference Array]`
- **Statement:** Start with zero array of size $length$. Apply operations $[start, end, inc]$.
- **Optimal Approach:** $D[start] \mathrel{+}= inc$ and $D[end + 1] \mathrel{-}= inc$. Prefix sum gives final array.
- **Complexity:** Time: $O(n + \text{ops})$ | Space: $O(n)$
- **Edge Cases:** $end = length - 1$ (do not write out of bounds).

#### Q069: Car Pooling
- **Difficulty:** `[Medium]` | **Pattern:** `[Difference Array / Bucket Sweepline]`
- **Statement:** Check if car with given capacity can pick up and drop off all passengers.
- **Optimal Approach:** Array of size 1001. Add passengers at `from`, subtract at `to`. Prefix sum must never exceed capacity.
- **Complexity:** Time: $O(n + \text{maxLocation})$ | Space: $O(1)$ (fixed 1001 buckets)
- **Edge Cases:** Passenger drop-off happens before pickup at same location.

#### Q070: Maximum Sum Circular Subarray
- **Difficulty:** `[Medium]` | **Pattern:** `[Kadane Min & Max]`
- **Statement:** Find maximum possible sum of non-empty subarray in circular array.
- **Optimal Approach:** Calculate `maxKadane` and `minKadane`. Result is $\max(\text{maxKadane}, \text{totalSum} - \text{minKadane})$.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** All elements negative ($\text{totalSum} == \text{minKadane}$; return `maxKadane`).

#### Q071: Make Sum Divisible by P
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix Sum Modulo Subarray]`
- **Statement:** Remove smallest subarray so remaining sum is divisible by $p$.
- **Optimal Approach:** Let target remainder be $rem = \text{totalSum} \bmod p$. Find shortest subarray with sum $\equiv rem \pmod p$.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Remainder is 0 (return 0), cannot remove entire array.

#### Q072: Count Triplets That Can Form Two Arrays of Equal XOR
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix XOR]`
- **Statement:** Find $(i, j, k)$ where $A[i \dots j-1] \oplus A[j \dots k] = 0$.
- **Optimal Approach:** Condition holds iff prefix XOR $P[i-1] == P[k]$. Any $j$ between $i$ and $k$ is valid, contributing $k - i$ triplets!
- **Complexity:** Time: $O(n^2)$ or $O(n)$ with hash map | Space: $O(n)$
- **Edge Cases:** Entire array XOR equals 0.

#### Q073: Find Good Days to Rob the Bank
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix Non-Increasing & Suffix Non-Decreasing]`
- **Statement:** Day $i$ is good if prices are non-increasing for $time$ days before and non-decreasing for $time$ days after.
- **Optimal Approach:** Precompute `left[i]` (consecutive non-increasing steps before $i$) and `right[i]` (consecutive non-decreasing after $i$). Good if both $\ge time$.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** $time = 0$ (all days valid).

#### Q074: Number of Submatrices That Sum to Target
- **Difficulty:** `[Hard]` | **Pattern:** `[2D to 1D Prefix Sum]`
- **Statement:** Count submatrices that sum to target.
- **Optimal Approach:** Fix top and bottom row pairs $(r1, r2)$. Compress column sums between them into a 1D array, reducing to Subarray Sum Equals $K$.
- **Complexity:** Time: $O(R^2 \cdot C)$ | Space: $O(C)$
- **Edge Cases:** Target is 0, matrix with negative values.

#### Q075: Matrix Block Sum
- **Difficulty:** `[Medium]` | **Pattern:** `[2D Prefix Sum]`
- **Statement:** Return matrix `ans` where `ans[i][j]` is sum of elements in $[i-k, i+k] \times [j-k, j+k]$.
- **Optimal Approach:** Precompute 2D prefix sums. Clamp coordinates to matrix bounds and query in $O(1)$.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** $k$ larger than matrix dimensions.

#### Q076: Maximum Size Subarray Sum Equals K
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix Sum Earliest Index]`
- **Statement:** Find max length of subarray summing to $k$.
- **Optimal Approach:** Map stores `{prefixSum: earliestIndex}`. When $P - k$ exists in map, update `maxLen = max(maxLen, i - map[P - k])`.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** No subarray sums to $k$.

#### Q077: Splitting a String Into Descending Consecutive Values
- **Difficulty:** `[Medium]` | **Pattern:** `[Backtracking / String Parsing]`
- **Statement:** Check if string can be split into $\ge 2$ substrings with values strictly decreasing by 1.
- **Optimal Approach:** Try all valid first numbers. Backtrack to verify subsequent adjacent numbers match $prev - 1$.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n)$
- **Edge Cases:** Leading zeroes, large numbers requiring 64-bit integer.

#### Q078: Minimum Penalty for a Shop
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix 'N' & Suffix 'Y' Counts]`
- **Statement:** Find earliest closing hour minimizing penalty ('Y' after close + 'N' before close).
- **Optimal Approach:** Precompute suffix count of 'Y' and prefix count of 'N'. Iterate through closing hours to find minimum penalty.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Closing at hour 0 vs hour $n$.

#### Q079: Shifting Letters
- **Difficulty:** `[Medium]` | **Pattern:** `[Suffix Sum on Shifts]`
- **Statement:** Shift first $i+1$ letters by `shifts[i]`. Return resulting string.
- **Optimal Approach:** Shifts accumulate from right to left! Take suffix sum of shifts modulo 26, then shift each character $s[i]$ by `totalShift[i]`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$ auxiliary
- **Edge Cases:** Very large shift values (exceeding $10^9$; use modulo 26).

#### Q080: Check If Array Pairs Are Divisible by K
- **Difficulty:** `[Medium]` | **Pattern:** `[Remainder Frequency Pairing]`
- **Statement:** Can array be paired such that sum of each pair is divisible by $k$?
- **Optimal Approach:** Count remainders modulo $k$. Frequency of remainder 0 must be even; for $r > 0$, frequency of $r$ must equal frequency of $k - r$.
- **Complexity:** Time: $O(n)$ | Space: $O(k)$
- **Edge Cases:** Negative numbers, $k$ is even ($k/2$ frequency must be even).

---

## Section 5: String Algorithms & Palindromes (Q081 – Q100)

#### Q081: Valid Anagram
- **Difficulty:** `[Easy]` | **Pattern:** `[Frequency Array Count]`
- **Statement:** Given two strings $s$ and $t$, return `true` if $t$ is an anagram of $s$.
- **Optimal Approach:** Array of size 26. Increment for $s$, decrement for $t$. All counts must equal 0.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Strings of different lengths.

#### Q082: Group Anagrams
- **Difficulty:** `[Medium]` | **Pattern:** `[Sorted String / Frequency Key Hash Map]`
- **Statement:** Group an array of strings into anagram clusters.
- **Optimal Approach:** For each word, use sorted word (or 26-character frequency tuple) as key in hash map.
- **Complexity:** Time: $O(N \cdot L \log L)$ | Space: $O(N \cdot L)$
- **Edge Cases:** Empty strings `""`, single character strings.

#### Q083: Longest Common Prefix
- **Difficulty:** `[Easy]` | **Pattern:** `[Vertical Character Scanning]`
- **Statement:** Find longest common prefix string amongst an array of strings.
- **Optimal Approach:** Compare characters column by column across all strings until mismatch or end of shortest string.
- **Complexity:** Time: $O(N \cdot L)$ | Space: $O(1)$
- **Edge Cases:** Empty array, no common prefix.

#### Q084: String to Integer (atoi)
- **Difficulty:** `[Medium]` | **Pattern:** `[State Machine / Overflow Handling]`
- **Statement:** Parse string into 32-bit signed integer handling whitespace, sign, and clamp on overflow.
- **Optimal Approach:** Skip leading spaces. Check `+` or `-`. Parse digits, checking `parsed > (INT_MAX - digit) / 10` to clamp before overflow.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Integer overflow/underflow, non-digit characters following valid digits.

#### Q085: Longest Palindromic Substring
- **Difficulty:** `[Medium]` | **Pattern:** `[Expand Around Center]`
- **Statement:** Find longest palindromic substring in $s$.
- **Optimal Approach:** Expand around $2n - 1$ centers (each character for odd palindromes, each gap for even palindromes).
- **Complexity:** Time: $O(n^2)$ | Space: $O(1)$
- **Edge Cases:** String with all identical characters, single character string.

#### Q086: Palindromic Substrings
- **Difficulty:** `[Medium]` | **Pattern:** `[Expand Around Center]`
- **Statement:** Count total number of palindromic substrings.
- **Optimal Approach:** For each of the $2n - 1$ centers, expand outward, incrementing count while characters match.
- **Complexity:** Time: $O(n^2)$ | Space: $O(1)$
- **Edge Cases:** Single character string (count 1).

#### Q087: Count and Say
- **Difficulty:** `[Medium]` | **Pattern:** `[Run-Length Encoding Simulation]`
- **Statement:** Generate the $n$-th term of the count-and-say sequence.
- **Optimal Approach:** Iteratively transform string: scan contiguous blocks of identical digits, append `count` then `digit`.
- **Complexity:** Time: $O(2^n)$ upper bound | Space: $O(2^n)$
- **Edge Cases:** $n = 1$ (base case `"1"`).

#### Q088: Minimum Insertion Steps to Make a String Palindrome
- **Difficulty:** `[Hard]` | **Pattern:** `[LCS with Reversed String]`
- **Statement:** Find minimum characters inserted to make string a palindrome.
- **Optimal Approach:** $\text{Answer} = n - \text{LPS}(s) = n - \text{LCS}(s, s^{\text{reversed}})$.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n)$
- **Edge Cases:** String already a palindrome (returns 0).

#### Q089: Longest Happy Prefix
- **Difficulty:** `[Hard]` | **Pattern:** `[KMP $\pi$ Table]`
- **Statement:** Find longest prefix that is also a suffix (excluding string itself).
- **Optimal Approach:** Compute KMP LPS array $\pi$. Return prefix of length $\pi[n - 1]$.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** No valid prefix-suffix (returns `""`).

#### Q090: Repeated Substring Pattern
- **Difficulty:** `[Easy]` | **Pattern:** `[String Doubling / KMP]`
- **Statement:** Check if string can be constructed by repeating a substring.
- **Optimal Approach:** Check if $s$ is a substring of $(s + s)[1 \dots 2n - 2]$.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Single character string (returns `false`).

#### Q091: Multiply Strings
- **Difficulty:** `[Medium]` | **Pattern:** `[Elementary School Multiplication Array]`
- **Statement:** Multiply two non-negative integers represented as strings without big integer libraries.
- **Optimal Approach:** Allocate array of size $m + n$. Digits $num1[i] \times num2[j]$ contribute to indices $i + j$ (carry) and $i + j + 1$.
- **Complexity:** Time: $O(m \cdot n)$ | Space: $O(m + n)$
- **Edge Cases:** Either string is `"0"`.

#### Q092: Add Strings
- **Difficulty:** `[Easy]` | **Pattern:** `[Column Addition with Carry]`
- **Statement:** Add two non-negative integer strings.
- **Optimal Approach:** Two pointers from right ends, add digits with carry, prepend to result.
- **Complexity:** Time: $O(\max(n, m))$ | Space: $O(1)$ auxiliary
- **Edge Cases:** Unequal lengths, final leftover carry $= 1$.

#### Q093: Compare Version Numbers
- **Difficulty:** `[Medium]` | **Pattern:** `[Two Pointer Delimiter Parsing]`
- **Statement:** Compare version strings `version1` and `version2` split by `'.'`.
- **Optimal Approach:** Parse numerical chunk between dots in both versions. Compare integer values (treating missing chunks as 0).
- **Complexity:** Time: $O(n + m)$ | Space: $O(1)$
- **Edge Cases:** Leading zeroes (`"1.01"` equals `"1.1"`), trailing zeroes (`"1.0"` equals `"1"`).

#### Q094: Reverse Words in a String
- **Difficulty:** `[Medium]` | **Pattern:** `[Word Inversion Two Pointers]`
- **Statement:** Reverse words in string, removing leading, trailing, and multiple spaces.
- **Optimal Approach:** Reverse entire string, reverse each individual word, and clean up spaces in-place.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$ in mutable languages
- **Edge Cases:** Multiple consecutive spaces, leading/trailing whitespace.

#### Q095: Basic Calculator II
- **Difficulty:** `[Medium]` | **Pattern:** `[Stack / Running Evaluation]`
- **Statement:** Evaluate string expression containing `+`, `-`, `*`, `/` and non-negative integers.
- **Optimal Approach:** Track current number and previous sign. For `*` and `/`, resolve immediately with top of stack. Sum stack at the end.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Multi-digit numbers, spaces interspersed throughout.

#### Q096: Minimum Deletions to Make Character Frequencies Unique
- **Difficulty:** `[Medium]` | **Pattern:** `[Greedy Hash Set]`
- **Statement:** Delete minimal characters so no two letters have same non-zero frequency.
- **Optimal Approach:** Count frequencies. Decrement duplicate frequencies until unused or 0 using a hash set.
- **Complexity:** Time: $O(n)$ | Space: $O(26) = O(1)$
- **Edge Cases:** Many characters with frequency 1.

#### Q097: Decode String
- **Difficulty:** `[Medium]` | **Pattern:** `[Dual Stack (Counts & Strings)]`
- **Statement:** Decode pattern $k[\text{encoded\_string}]$ where encoded string inside brackets is repeated $k$ times.
- **Optimal Approach:** When `[` seen, push current multiplier and current string onto stacks. When `]` seen, pop multiplier and append repeated substring.
- **Complexity:** Time: $O(\text{output length})$ | Space: $O(n)$
- **Edge Cases:** Nested brackets `3[a2[c]]`, multi-digit repeat counts `10[a]`.

#### Q098: Custom Sort String
- **Difficulty:** `[Medium]` | **Pattern:** `[Counting Sort by Order Map]`
- **Statement:** Sort characters of $s$ according to custom order given in string `order`.
- **Optimal Approach:** Count frequencies of characters in $s$. Output characters in sequence of `order`, then append remaining unmentioned characters.
- **Complexity:** Time: $O(|s| + |order|)$ | Space: $O(26) = O(1)$
- **Edge Cases:** Characters in $s$ not present in `order`.

#### Q099: Reorganize String
- **Difficulty:** `[Medium]` | **Pattern:** `[Max-Heap / Parity Placement]`
- **Statement:** Rearrange characters so no two adjacent characters are identical.
- **Optimal Approach:** If most frequent character $> \lceil n / 2 \rceil$, impossible. Place most frequent character at even indices $0, 2, 4, \dots$, then fill remaining.
- **Complexity:** Time: $O(n)$ | Space: $O(26) = O(1)$
- **Edge Cases:** Impossible configurations where max frequency exceeds $\lfloor (n+1)/2 \rfloor$.

#### Q100: Word Pattern
- **Difficulty:** `[Easy]` | **Pattern:** `[Bijection Dual Hash Map]`
- **Statement:** Check if string $s$ follows the same pattern as string $pattern$.
- **Optimal Approach:** Bijective mapping: map character $\to$ word and word $\to$ character. Both mappings must remain consistent.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Unequal number of words and pattern characters.

---
[⬅️ Previous: Part 10 Advanced DSA](file:///d:/DSA/Part-10-Advanced-DSA/03_tree_decompositions.md) | [Next: Volume 02 — Linked Lists, Stacks & Queues (Q101–Q160) ➡️](file:///d:/DSA/Part-11-Problem-Bank-and-Revision/02_linked_lists_stacks_queues_60.md)
