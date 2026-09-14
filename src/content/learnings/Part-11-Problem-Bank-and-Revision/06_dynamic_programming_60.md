# Part 11: Problem Bank — Volume 06: Dynamic Programming (60 Problems)


Optimal substructure and overlapping subproblems allow dynamic programming to solve intractable combinatorial explosions in polynomial time. This volume compiles 60 benchmark interview problems spanning 1D linear recurrences, 2D grid pathing, knapsack variations, sequence alignments, interval partitions, and advanced tree and digit state formulations.

---

## 1. Executive Summary & Learning Objectives

This problem bank codifies 60 essential dynamic programming challenges classified by structural state formulation and topological iteration direction.

By completing this problem set, you will be able to:
1. **Define Multi-Dimensional States**: Isolate independent state parameters capturing prefix decisions, remaining capacities, and boundary constraints.
2. **Execute Space Compression**: Compress 2D state matrices into 1D rolling buffers using directional iteration to preserve single-use invariants.
3. **Formulate String & Sequence Alignments**: Solve Longest Common Subsequence, Edit Distance, and Interleaving Strings in $\mathcal{O}(m \cdot n)$ time.
4. **Architect Non-Linear DP Systems**: Formulate Interval DP for matrix chains, Bitmask DP for permutation graphs, and Postorder Tree DP for hierarchical node monitoring.
5. **Construct Digit DP Solvers**: Count constrained integers using position, tight-bound, and leading-zero state flags in logarithmic digit steps.

---

## 2. Problem Taxonomy & Architecture Guide

| Section | Problem Range | Primary Patterns Covered | Target Complexity Range |
| :--- | :--- | :--- | :--- |
| **Section 1** | Q411 – Q420 | 1D DP, Linear Recurrences & State Machines | $\mathcal{O}(n)$ Time, $\mathcal{O}(1)$ to $\mathcal{O}(n)$ Space |
| **Section 2** | Q421 – Q440 | 2D Grid DP & Knapsack Archetypes (0/1 & Unbounded) | $\mathcal{O}(m \cdot n)$ or $\mathcal{O}(n \cdot W)$ Time, $\mathcal{O}(W)$ Space |
| **Section 3** | Q441 – Q455 | String Alignments, LCS & Edit Distance | $\mathcal{O}(m \cdot n)$ Time, $\mathcal{O}(\min(m, n))$ Space |
| **Section 4** | Q456 – Q470 | Interval DP, Bitmask DP, Tree DP & Digit DP | $\mathcal{O}(n^3)$ to $\mathcal{O}(n^2 2^n)$ Time, Exponential to Polynomial Space |

---

## Section 1: 1D DP & Linear Recurrences (Q411 – Q420)

#### Q411: Climbing Stairs
- **Difficulty:** `[Easy]` | **Pattern:** `[Fibonacci 1D DP]`
- **Statement:** Distinct ways to climb $n$ steps taking 1 or 2 steps at a time.
- **Optimal Approach:** $DP[i] = DP[i-1] + DP[i-2]$. Maintain two rolling variables `a` and `b`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** $n = 1, n = 2$.

#### Q412: Min Cost Climbing Stairs
- **Difficulty:** `[Easy]` | **Pattern:** `[Rolling Cost DP]`
- **Statement:** Pay `cost[i]` to step on stair $i$; climb 1 or 2 steps. Reach top minimizing cost.
- **Optimal Approach:** $DP[i] = cost[i] + \min(DP[i-1], DP[i-2])$. Rolling two variables.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Length 2 (pay $\min(cost[0], cost[1])$).

#### Q413: House Robber
- **Difficulty:** `[Medium]` | **Pattern:** `[State Machine / Non-Adjacent DP]`
- **Statement:** Max money to rob without robbing two adjacent houses.
- **Optimal Approach:** $DP[i] = \max(DP[i-1], DP[i-2] + nums[i])$. Rolling variables `robPrev1` and `robPrev2`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Single house, two houses.

#### Q414: House Robber II
- **Difficulty:** `[Medium]` | **Pattern:** `[Circular Reduction to Linear DP]`
- **Statement:** Houses arranged in a circle (house 0 is adjacent to house $n-1$).
- **Optimal Approach:** $\max(\text{rob}(nums[0 \dots n-2]), \text{rob}(nums[1 \dots n-1]))$.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Single house (return `nums[0]`).

#### Q415: House Robber III
- **Difficulty:** `[Medium]` | **Pattern:** `[Tree DP Dual State]`
- **Statement:** Houses form a binary tree. Adjacent linked nodes cannot be robbed.
- **Optimal Approach:** Postorder helper returns pair `(robRoot, skipRoot)`. `robRoot = val + left.skip + right.skip`. `skipRoot = max(left.rob, left.skip) + max(right.rob, right.skip)`.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Empty tree (returns `(0, 0)`).

#### Q416: Decode Ways
- **Difficulty:** `[Medium]` | **Pattern:** `[1D DP with Valid Digit Substrings]`
- **Statement:** Count ways to decode string mapped by $'1' \dots '26' \to 'A' \dots 'Z'$.
- **Optimal Approach:** $DP[i]$ represents ways for prefix $i$. Add $DP[i-1]$ if single digit $\in [1, 9]$; add $DP[i-2]$ if two digits $\in [10, 26]$.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$ rolling
- **Edge Cases:** Leading zero `"06"` (cannot decode, returns 0).

#### Q417: Word Break
- **Difficulty:** `[Medium]` | **Pattern:** `[1D Boolean Prefix DP]`
- **Statement:** Determine if string $s$ can be segmented into space-separated dictionary words.
- **Optimal Approach:** $DP[i] = \text{true}$ if there exists $j < i$ where $DP[j] == \text{true}$ and $s[j \dots i-1] \in dict$.
- **Complexity:** Time: $O(n^2 \cdot L)$ | Space: $O(n)$
- **Edge Cases:** Single letter words, no valid segmentation.

#### Q418: Word Break II
- **Difficulty:** `[Hard]` | **Pattern:** `[Memoized DFS Backtracking]`
- **Statement:** Return all possible sentence segmentations using dictionary words.
- **Optimal Approach:** Memoized DFS returning list of sentences for each suffix. Loop over prefix words in dictionary, recurse on remainder.
- **Complexity:** Time: $O(2^n)$ worst case | Space: $O(2^n)$
- **Edge Cases:** Impossible string (memoized check prunes early).

#### Q419: Coin Change
- **Difficulty:** `[Medium]` | **Pattern:** `[Unbounded Knapsack Min Cost]`
- **Statement:** Find fewest coins needed to make up `amount`.
- **Optimal Approach:** $DP[i] = 1 + \min_{c \in coins} DP[i - c]$ with $DP[0] = 0$. Initialize array with $\infty$.
- **Complexity:** Time: $O(\text{amount} \cdot n)$ | Space: $O(\text{amount})$
- **Edge Cases:** Amount 0 (returns 0), impossible amount (returns $-1$).

#### Q420: Coin Change II
- **Difficulty:** `[Medium]` | **Pattern:** `[Unbounded Knapsack Combination Count]`
- **Statement:** Count number of combinations that make up `amount`.
- **Optimal Approach:** Outer loop over each coin $c$, inner loop over amount from $c$ to `amount`: $DP[i] += DP[i - c]$. (Coin in outer loop ensures combinations, not permutations!).
- **Complexity:** Time: $O(n \cdot \text{amount})$ | Space: $O(\text{amount})$
- **Edge Cases:** Amount 0 (1 combination: empty set).

---

## Section 2: 2D Grid DP & Matrix Paths (Q421 – Q430)

#### Q421: Unique Paths
- **Difficulty:** `[Medium]` | **Pattern:** `[Grid DP / Combinatorics]`
- **Statement:** Count paths from top-left to bottom-right moving only right or down.
- **Optimal Approach:** $DP[r][c] = DP[r-1][c] + DP[r][c-1]$. Space optimized to 1D array of size $C$. Or combinatorics $\binom{m + n - 2}{m - 1}$.
- **Complexity:** Time: $O(M \cdot N)$ | Space: $O(N)$
- **Edge Cases:** $M = 1$ or $N = 1$ (1 path).

#### Q422: Unique Paths II
- **Difficulty:** `[Medium]` | **Pattern:** `[Grid DP with Obstacles]`
- **Statement:** Count unique paths avoiding cells with obstacle 1.
- **Optimal Approach:** If $grid[r][c] == 1$, $DP[r][c] = 0$; else $DP[r-1][c] + DP[r][c-1]$.
- **Complexity:** Time: $O(M \cdot N)$ | Space: $O(N)$
- **Edge Cases:** Start or end cell has obstacle (returns 0).

#### Q423: Minimum Path Sum
- **Difficulty:** `[Medium]` | **Pattern:** `[2D Grid Min DP]`
- **Statement:** Find path from top-left to bottom-right minimizing sum of numbers along path.
- **Optimal Approach:** $DP[r][c] = grid[r][c] + \min(DP[r-1][c], DP[r][c-1])$. Compress to 1D array.
- **Complexity:** Time: $O(M \cdot N)$ | Space: $O(N)$
- **Edge Cases:** Single row or single column matrix.

#### Q424: Triangle
- **Difficulty:** `[Medium]` | **Pattern:** `[Bottom-Up Triangle DP]`
- **Statement:** Find minimum path sum from top to bottom of triangle.
- **Optimal Approach:** Bottom-up from second-to-last row up to apex: $T[r][c] += \min(T[r+1][c], T[r+1][c+1])$. Result is $T[0][0]$.
- **Complexity:** Time: $O(n^2)$ | Space: $O(1)$ in-place
- **Edge Cases:** Triangle with 1 row.

#### Q425: Dungeon Game
- **Difficulty:** `[Hard]` | **Pattern:** `[Bottom-Right to Top-Left Reverse DP]`
- **Statement:** Find minimum initial health required for knight to reach princess.
- **Optimal Approach:** Reverse DP from princess $(R-1, C-1)$ back to $(0, 0)$. Health needed to exit cell is $\min(healthNeeded[down], healthNeeded[right])$. Health needed to enter cell is $\max(1, healthNeeded - dungeon[r][c])$.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(C)$
- **Edge Cases:** Large positive demon or magic cells.

#### Q426: Cherry Pickup
- **Difficulty:** `[Hard]` | **Pattern:** `[Dual Simultaneous Paths DP]`
- **Statement:** Collect cherries from $(0, 0)$ to $(n-1, n-1)$ and back to $(0, 0)$.
- **Optimal Approach:** Equivalent to two people walking from $(0, 0)$ to $(n-1, n-1)$ simultaneously! At step $t = r_1 + c_1 = r_2 + c_2$, state is $DP(t, r_1, r_2)$. Add cherries once if $r_1 == r_2$.
- **Complexity:** Time: $O(n^3)$ | Space: $O(n^2)$
- **Edge Cases:** No path exists (blocked by $-1$).

#### Q427: Cherry Pickup II
- **Difficulty:** `[Hard]` | **Pattern:** `[3D Grid DP (Two Robots)]`
- **Statement:** Two robots start at $(0, 0)$ and $(0, C-1)$ moving down. Maximize cherries.
- **Optimal Approach:** State $DP(r, c_1, c_2)$ row-by-row. Try all $3 \times 3 = 9$ combinations of moves for $(c_1, c_2)$. Add cells once if $c_1 == c_2$.
- **Complexity:** Time: $O(R \cdot C^2)$ | Space: $O(C^2)$
- **Edge Cases:** Both robots land on same cell.

#### Q428: Maximal Square
- **Difficulty:** `[Medium]` | **Pattern:** `[Min of 3 Neighbors DP]`
- **Statement:** Find largest square of 1s in binary matrix; return area.
- **Optimal Approach:** If $matrix[r][c] == '1'$, $DP[r][c] = 1 + \min(DP[r-1][c], DP[r][c-1], DP[r-1][c-1])$. Result is $\max(DP)^2$.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(C)$
- **Edge Cases:** Matrix of all 0s.

#### Q429: Minimum Falling Path Sum
- **Difficulty:** `[Medium]` | **Pattern:** `[Row-by-Row 3-Direction DP]`
- **Statement:** Find falling path from top to bottom picking directly below or diagonally adjacent cells.
- **Optimal Approach:** $DP[r][c] = matrix[r][c] + \min(DP[r-1][c-1], DP[r-1][c], DP[r-1][c+1])$.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n)$
- **Edge Cases:** Negative numbers.

#### Q430: Out of Boundary Paths
- **Difficulty:** `[Medium]` | **Pattern:** `[3D State DP with Modulo]`
- **Statement:** Count paths to move ball off $M \times N$ grid in at most $maxMove$ moves.
- **Optimal Approach:** State $DP[k][r][c]$ for $k$ moves remaining. For boundary steps, add 1 to count; for interior steps, sum $DP[k-1]$ over 4 directions.
- **Complexity:** Time: $O(maxMove \cdot M \cdot N)$ | Space: $O(M \cdot N)$
- **Edge Cases:** $maxMove = 0$.

---

## Section 3: Knapsack & Subsets (Q431 – Q440)

#### Q431: 0/1 Knapsack Classical
- **Difficulty:** `[Medium]` | **Pattern:** `[0/1 Knapsack 1D Reverse Walk]`
- **Statement:** Maximize value under weight capacity $W$ where each item can be chosen at most once.
- **Optimal Approach:** Reverse 1D DP array from $W$ down to $wt[i]$: $DP[w] = \max(DP[w], val[i] + DP[w - wt[i]])$.
- **Complexity:** Time: $O(N \cdot W)$ | Space: $O(W)$
- **Edge Cases:** Item weight exceeds capacity.

#### Q432: Partition Equal Subset Sum
- **Difficulty:** `[Medium]` | **Pattern:** `[0/1 Knapsack Target Sum/2]`
- **Statement:** Check if array can be partitioned into two subsets with equal sum.
- **Optimal Approach:** Total sum must be even; target $S = \text{sum} / 2$. Boolean 1D DP: $DP[s] = DP[s] \lor DP[s - x]$ traversing $S$ down to $x$.
- **Complexity:** Time: $O(N \cdot S)$ | Space: $O(S)$
- **Edge Cases:** Total sum is odd (immediately false).

#### Q433: Target Sum
- **Difficulty:** `[Medium]` | **Pattern:** `[Subset Sum Reduction]`
- **Statement:** Assign $+$ or $-$ to each element so sum equals $target$.
- **Optimal Approach:** Let $P$ be positive subset, $N$ negative. $P - N = target$ and $P + N = \text{totalSum} \implies P = (\text{totalSum} + target) / 2$. Reduces to Subset Sum!
- **Complexity:** Time: $O(n \cdot P)$ | Space: $O(P)$
- **Edge Cases:** $(totalSum + target)$ is odd or $target > totalSum$.

#### Q434: Ones and Zeroes
- **Difficulty:** `[Medium]` | **Pattern:** `[2D Knapsack Reverse Walk]`
- **Statement:** Maximize strings formed using at most $m$ 0s and $n$ 1s.
- **Optimal Approach:** 2D array $DP[z][o]$ reverse walked from $m$ down to $zeros$ and $n$ down to $ones$: $DP[z][o] = \max(DP[z][o], 1 + DP[z - zeros][o - ones])$.
- **Complexity:** Time: $O(\text{strings} \cdot m \cdot n)$ | Space: $O(m \cdot n)$
- **Edge Cases:** Single string uses all capacity.

#### Q435: Last Stone Weight II
- **Difficulty:** `[Medium]` | **Pattern:** `[Subset Sum Nearest Half]`
- **Statement:** Smash stones together; minimize final stone weight.
- **Optimal Approach:** Find subset sum closest to $\lfloor \text{totalSum} / 2 \rfloor$. Result is $\text{totalSum} - 2 \times subsetSum$.
- **Complexity:** Time: $O(n \cdot S)$ | Space: $O(S)$
- **Edge Cases:** Array with 1 stone.

#### Q436: Combination Sum IV
- **Difficulty:** `[Medium]` | **Pattern:** `[Permutations 1D DP]`
- **Statement:** Find number of sequences summing to target (different orders counted as different combinations).
- **Optimal Approach:** Target in outer loop, numbers in inner loop: $DP[i] += DP[i - num]$ for all $num \le i$.
- **Complexity:** Time: $O(n \cdot target)$ | Space: $O(target)$
- **Edge Cases:** 32-bit integer overflow during addition.

#### Q437: Unbounded Knapsack
- **Difficulty:** `[Medium]` | **Pattern:** `[Unbounded Knapsack Forward Walk]`
- **Statement:** Maximize value with unlimited supply of each item under capacity $W$.
- **Optimal Approach:** Forward walk from $wt[i]$ to $W$: $DP[w] = \max(DP[w], val[i] + DP[w - wt[i]])$.
- **Complexity:** Time: $O(N \cdot W)$ | Space: $O(W)$
- **Edge Cases:** $W = 0$.

#### Q438: Rod Cutting Problem
- **Difficulty:** `[Medium]` | **Pattern:** `[Unbounded Knapsack]`
- **Statement:** Cut rod of length $n$ into pieces maximizing total revenue.
- **Optimal Approach:** $DP[i] = \max_{1 \le j \le i}(price[j] + DP[i - j])$.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n)$
- **Edge Cases:** Rod of length 0.

#### Q439: Perfect Squares
- **Difficulty:** `[Medium]` | **Pattern:** `[Unbounded Knapsack Min Coins]`
- **Statement:** Find least number of perfect square numbers summing to $n$.
- **Optimal Approach:** $DP[i] = 1 + \min_{j \times j \le i} DP[i - j \times j]$. Or Lagrange's Four-Square Theorem in $O(\sqrt{n})$ time!
- **Complexity:** Time: $O(n \sqrt{n})$ | Space: $O(n)$
- **Edge Cases:** $n$ is already a perfect square (returns 1).

#### Q440: Integer Break
- **Difficulty:** `[Medium]` | **Pattern:** `[Math / 1D DP]`
- **Statement:** Break integer $n \ge 2$ into sum of $\ge 2$ positive integers maximizing product.
- **Optimal Approach:** $DP[i] = \max_{1 \le j < i}(j \times \max(i - j, DP[i - j]))$. (Greedy math: break into as many 3s as possible!).
- **Complexity:** Time: $O(n^2)$ or $O(1)$ math | Space: $O(n)$
- **Edge Cases:** $n = 2$ (break $1 + 1 = 1$), $n = 3$ (break $2 + 1 = 2$).

---

## Section 4: Strings & Sequence DP (Q441 – Q455)

#### Q441: Longest Common Subsequence (LCS)
- **Difficulty:** `[Medium]` | **Pattern:** `[2D String Alignment DP]`
- **Statement:** Find length of longest common subsequence between $s1$ and $s2$.
- **Optimal Approach:** If $s1[i] == s2[j]$, $DP[i][j] = 1 + DP[i-1][j-1]$; else $\max(DP[i-1][j], DP[i][j-1])$.
- **Complexity:** Time: $O(m \cdot n)$ | Space: $O(\min(m, n))$
- **Edge Cases:** No common characters (returns 0).

#### Q442: Longest Increasing Subsequence (LIS)
- **Difficulty:** `[Medium]` | **Pattern:** `[Patience Sorting with BS]`
- **Statement:** Find length of strictly increasing subsequence.
- **Optimal Approach:** Binary search `lower_bound` on tails array. If element $>$ all tails, append; else overwrite first element $\ge x$.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Strictly decreasing array (length 1).

#### Q443: Edit Distance
- **Difficulty:** `[Medium]` | **Pattern:** `[Levenshtein Distance 2D DP]`
- **Statement:** Minimum operations (insert, delete, replace) to convert $word1$ to $word2$.
- **Optimal Approach:** If $w1[i] == w2[j]$, $DP[i][j] = DP[i-1][j-1]$. Else $1 + \min(\text{insert: } DP[i][j-1], \text{delete: } DP[i-1][j], \text{replace: } DP[i-1][j-1])$.
- **Complexity:** Time: $O(m \cdot n)$ | Space: $O(\min(m, n))$
- **Edge Cases:** One word is empty string (return length of other word).

#### Q444: Distinct Subsequences
- **Difficulty:** `[Hard]` | **Pattern:** `[2D Matching Count DP]`
- **Statement:** Count distinct subsequences of $s$ that equal $t$.
- **Optimal Approach:** If $s[i-1] == t[j-1]$, $DP[j] += DP[j-1]$ (reverse walk 1D array).
- **Complexity:** Time: $O(|s| \cdot |t|)$ | Space: $O(|t|)$
- **Edge Cases:** $|s| < |t|$ (returns 0).

#### Q445: Wildcard Matching
- **Difficulty:** `[Hard]` | **Pattern:** `[2D DP / Greedy Two Pointers]`
- **Statement:** Match string against pattern with `?` (any single char) and `*` (any sequence).
- **Optimal Approach:** Two pointers tracking last `*` position. Or 2D DP: if $p[j] == '*$, $DP[i][j] = DP[i-1][j] \lor DP[i][j-1]$.
- **Complexity:** Time: $O(n)$ average | Space: $O(1)$
- **Edge Cases:** Pattern composed entirely of `***`.

#### Q446: Regular Expression Matching
- **Difficulty:** `[Hard]` | **Pattern:** `[2D DP with Kleene Star]`
- **Statement:** Match string with `.` (any char) and `*` (zero or more of preceding char).
- **Optimal Approach:** For `c*`: $DP[i][j] = DP[i][j-2]$ (zero copies) $\lor (matches(s[i], c) \land DP[i-1][j])$ (one or more copies).
- **Complexity:** Time: $O(m \cdot n)$ | Space: $O(m \cdot n)$
- **Edge Cases:** Pattern `"a*b*c*"` matching empty string `""`.

#### Q447: Interleaving String
- **Difficulty:** `[Medium]` | **Pattern:** `[2D Boolean Grid DP]`
- **Statement:** Check if $s3$ is formed by interleaving $s1$ and $s2$.
- **Optimal Approach:** $DP[i][j] = (DP[i-1][j] \land s1[i-1] == s3[i+j-1]) \lor (DP[i][j-1] \land s2[j-1] == s3[i+j-1])$.
- **Complexity:** Time: $O(m \cdot n)$ | Space: $O(n)$
- **Edge Cases:** $|s1| + |s2| \ne |s3|$ (immediately false).

#### Q448: Shortest Common Supersequence
- **Difficulty:** `[Hard]` | **Pattern:** `[LCS Table Backtracking]`
- **Statement:** Find shortest string that has both $str1$ and $str2$ as subsequences.
- **Optimal Approach:** Build LCS table. Backtrack from $(m, n)$: if characters match, take once; else take character corresponding to the max DP branch.
- **Complexity:** Time: $O(m \cdot n)$ | Space: $O(m \cdot n)$
- **Edge Cases:** One string is a substring of the other.

#### Q449: Minimum ASCII Delete Sum for Two Strings
- **Difficulty:** `[Medium]` | **Pattern:** `[LCS Maximum ASCII Keep]`
- **Statement:** Delete characters to make two strings equal minimizing ASCII sum of deleted chars.
- **Optimal Approach:** Equivalent to maximizing the ASCII sum of the Common Subsequence!
- **Complexity:** Time: $O(m \cdot n)$ | Space: $O(n)$
- **Edge Cases:** No common characters.

#### Q450: Longest Palindromic Subsequence
- **Difficulty:** `[Medium]` | **Pattern:** `[Interval DP / LCS with Reversed String]`
- **Statement:** Find length of longest palindromic subsequence in $s$.
- **Optimal Approach:** If $s[i] == s[j]$, $DP[i][j] = 2 + DP[i+1][j-1]$; else $\max(DP[i+1][j], DP[i][j-1])$.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n)$
- **Edge Cases:** Single character (length 1).

#### Q451: Palindrome Partitioning II
- **Difficulty:** `[Hard]` | **Pattern:** `[1D DP + Palindrome Expand]`
- **Statement:** Minimum cuts needed for palindrome partitioning of $s$.
- **Optimal Approach:** Precompute palindromic substrings. $DP[i] = \min_{j \le i, s[j \dots i] \text{ is pal}}(DP[j-1] + 1)$.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n)$
- **Edge Cases:** String already a palindrome (0 cuts).

#### Q452: Count Different Palindromic Subsequences
- **Difficulty:** `[Hard]` | **Pattern:** `[Interval DP with 4-Character Alphabets]`
- **Statement:** Count non-empty distinct palindromic subsequences modulo $10^9 + 7$.
- **Optimal Approach:** $DP[i][j]$ for interval $[i, j]$. If $s[i] == s[j] == c$, handle interior occurrences of character $c$.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n^2)$
- **Edge Cases:** Duplicate subsequences avoided.

#### Q453: Number of Longest Increasing Subsequences
- **Difficulty:** `[Medium]` | **Pattern:** `[Dual DP (Length & Count)]`
- **Statement:** Count total number of longest increasing subsequences.
- **Optimal Approach:** Maintain `len[i]` and `count[i]`. When $nums[i] > nums[j]$: if $len[j] + 1 > len[i]$, update length and copy count; if equal, add count.
- **Complexity:** Time: $O(n^2)$ | Space: $O(n)$
- **Edge Cases:** All elements identical.

#### Q454: Longest String Chain
- **Difficulty:** `[Medium]` | **Pattern:** `[Hash Map DP + String Deletion]`
- **Statement:** Find longest word chain where each word is formed by adding 1 letter to predecessor.
- **Optimal Approach:** Sort words by length. Map stores `{word: maxChain}`. For each word, generate all $|w|$ predecessors by deleting 1 char; query map.
- **Complexity:** Time: $O(N \log N + N \cdot L^2)$ | Space: $O(N \cdot L)$
- **Edge Cases:** Words with length 1.

#### Q455: Maximum Length of Pair Chain
- **Difficulty:** `[Medium]` | **Pattern:** `[Interval Greedy / LIS]`
- **Statement:** Longest chain of pairs $[a, b]$ where next pair starts $> b$.
- **Optimal Approach:** Sort pairs by second element (greedy activity selection). Greedily pick next pair starting $> currentEnd$.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(1)$
- **Edge Cases:** Overlapping intervals.

---

## Section 5: Interval, Bitmask & Tree DP (Q456 – Q470)

#### Q456: Matrix Chain Multiplication (MCM)
- **Difficulty:** `[Hard]` | **Pattern:** `[Interval DP Split Search]`
- **Statement:** Find minimum scalar multiplications to multiply chain of matrices.
- **Optimal Approach:** $DP[i][j] = \min_{i \le k < j}(DP[i][k] + DP[k+1][j] + p_{i-1} \cdot p_k \cdot p_j)$. Loop on chain length $len = 2 \dots n$.
- **Complexity:** Time: $O(n^3)$ | Space: $O(n^2)$
- **Edge Cases:** Chain of 1 matrix (0 multiplications).

#### Q457: Burst Balloons
- **Difficulty:** `[Hard]` | **Pattern:** `[Interval DP Last Burst Element]`
- **Statement:** Burst balloons for coins: bursting $i$ gives $nums[i-1] \times nums[i] \times nums[i+1]$.
- **Optimal Approach:** Think **backwards**: which balloon is burst **LAST** in interval $(L, R)$? $DP[L][R] = \max_{k \in (L, R)}(DP[L][k] + DP[k][R] + nums[L] \cdot nums[k] \cdot nums[R])$.
- **Complexity:** Time: $O(n^3)$ | Space: $O(n^2)$
- **Edge Cases:** Single balloon.

#### Q458: Minimum Cost to Merge Stones
- **Difficulty:** `[Hard]` | **Pattern:** `[Interval DP with K Parts]`
- **Statement:** Merge $k$ consecutive piles of stones until 1 pile remains. Minimize cost.
- **Optimal Approach:** Valid iff $(n - 1) \bmod (k - 1) == 0$. $DP[i][j]$ maintains cost to merge subarray $[i, j]$.
- **Complexity:** Time: $O(n^3 / k)$ | Space: $O(n^2)$
- **Edge Cases:** Impossible configurations (returns $-1$).

#### Q459: Remove Boxes
- **Difficulty:** `[Hard]` | **Pattern:** `[3D Interval DP with Suffix Match Count]`
- **Statement:** Remove contiguous boxes of same color; $k$ boxes gives $k^2$ points. Maximize score.
- **Optimal Approach:** State $DP[l][r][k]$: max points from $[l, r]$ where $r$ has $k$ adjacent boxes of same color following it.
- **Complexity:** Time: $O(n^4)$ | Space: $O(n^3)$
- **Edge Cases:** All boxes same color.

#### Q460: Strange Printer
- **Difficulty:** `[Hard]` | **Pattern:** `[Interval DP Match Collapse]`
- **Statement:** Printer prints sequence of same characters at once. Find minimum turns to print string.
- **Optimal Approach:** $DP[i][j] = DP[i][j-1]$. If $s[k] == s[j]$ for some $k \in [i, j-1]$, $DP[i][j] = \min(DP[i][j], DP[i][k] + DP[k+1][j-1])$.
- **Complexity:** Time: $O(n^3)$ | Space: $O(n^2)$
- **Edge Cases:** Repeated characters (collapse consecutive identical chars).

#### Q461: Can I Win
- **Difficulty:** `[Medium]` | **Pattern:** `[Minimax Game Theory + Bitmask DP]`
- **Statement:** Pick integers $1 \dots M$ without replacement; first to make running total $\ge desiredTotal$ wins.
- **Optimal Approach:** Memoized DFS on `(usedMask, remainingTotal)`. If choosing $num$ makes remaining $\le 0$ OR opponent cannot win on next state, current player wins!
- **Complexity:** Time: $O(2^M)$ | Space: $O(2^M)$
- **Edge Cases:** $\sum 1 \dots M < desiredTotal$ (impossible to win, returns `false`).

#### Q462: Partition to K Equal Sum Subsets
- **Difficulty:** `[Medium]` | **Pattern:** `[Bitmask DP / Backtracking Pruning]`
- **Statement:** Partition array into $k$ subsets of equal sum.
- **Optimal Approach:** Sort descending. Backtrack filling buckets, or Bitmask DP state storing current bucket remainder.
- **Complexity:** Time: $O(k \cdot 2^n)$ | Space: $O(2^n)$
- **Edge Cases:** Total sum not divisible by $k$.

#### Q463: Matchsticks to Square
- **Difficulty:** `[Medium]` | **Pattern:** `[4-Subset Partitioning Bitmask DP]`
- **Statement:** Form square using all matchsticks without breaking.
- **Optimal Approach:** Equivalent to Partition to $K$ Equal Subsets with $k = 4$ and side $= \text{sum} / 4$.
- **Complexity:** Time: $O(4^n)$ pruned to $O(n \cdot 2^n)$ | Space: $O(2^n)$
- **Edge Cases:** Single matchstick larger than side length.

#### Q464: Shortest Path Visiting All Nodes
- **Difficulty:** `[Hard]` | **Pattern:** `[Bitmask BFS State Space]`
- **Statement:** Shortest path visiting every node in undirected graph.
- **Optimal Approach:** BFS state `(node, mask)`. Pop and visit all neighbors with `nextMask = mask | (1 << neighbor)`.
- **Complexity:** Time: $O(n \cdot 2^n)$ | Space: $O(n \cdot 2^n)$
- **Edge Cases:** $n = 1$ (0 steps).

#### Q465: Find the Shortest Superstring (Traveling Salesman Problem)
- **Difficulty:** `[Hard]` | **Pattern:** `[TSP Bitmask DP with Overlap Costs]`
- **Statement:** Shortest string containing all words in dictionary as substrings.
- **Optimal Approach:** Precompute pairwise string overlaps. TSP on directed graph: $DP[mask][last]$ storing maximum overlap. Reconstruct string from path.
- **Complexity:** Time: $O(n^2 \cdot 2^n)$ | Space: $O(n \cdot 2^n)$
- **Edge Cases:** One word completely contained within another.

#### Q466: Smallest Sufficient Team
- **Difficulty:** `[Hard]` | **Pattern:** `[Bitmask DP Set Cover]`
- **Statement:** Form smallest team possessing all required skills.
- **Optimal Approach:** Map each skill to bit. $DP[mask]$ stores list of people forming skill mask. For each person, $DP[mask | personMask] = \min(DP[mask | personMask], DP[mask] + person)$.
- **Complexity:** Time: $O(P \cdot 2^S)$ | Space: $O(2^S)$
- **Edge Cases:** Single person possesses all skills.

#### Q467: Maximum Students Taking Exam
- **Difficulty:** `[Hard]` | **Pattern:** `[Bitmask DP on Grid Rows]`
- **Statement:** Seat students so no one can see neighbors (left, right, upper diagonals).
- **Optimal Approach:** State $DP[row][mask]$. Mask valid if no adjacent 1s and no student on broken seat. Transition ensures no diagonal cheating from previous row mask.
- **Complexity:** Time: $O(R \cdot 2^C \cdot 2^C)$ | Space: $O(2^C)$
- **Edge Cases:** All seats broken.

#### Q468: Binary Tree Cameras
- **Difficulty:** `[Hard]` | **Pattern:** `[Tree DP 3-State Greedy]`
- **Statement:** Place minimum cameras on nodes so every node is monitored.
- **Optimal Approach:** Postorder DFS returning state: 0 = unmonitored, 1 = has camera, 2 = covered. If either child is 0, must place camera (state 1). If either child has camera, covered (state 2).
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Root remains unmonitored at end (must place camera at root).

#### Q469: Distribute Coins in Binary Tree
- **Difficulty:** `[Medium]` | **Pattern:** `[Tree DP Net Balance Postorder]`
- **Statement:** Move coins between adjacent nodes so every node has exactly 1 coin. Minimize moves.
- **Optimal Approach:** Postorder DFS returns net coin balance: `node.val + leftBalance + rightBalance - 1`. Total moves accumulates $|leftBalance| + |rightBalance|$.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** All coins located in single node.

#### Q470: Numbers At Most N Given Digit Set (Digit DP)
- **Difficulty:** `[Hard]` | **Pattern:** `[Digit DP with Tight & Leading Zeroes]`
- **Statement:** Count positive integers $\le n$ written using only digits from given set.
- **Optimal Approach:** Count numbers with strictly fewer digits than $n$ ($|D|^k$). For numbers with same length, match digits with tight constraint.
- **Complexity:** Time: $O(\text{digits} \cdot |D|)$ | Space: $O(\text{digits})$
- **Edge Cases:** Digit set does not contain any valid matching digit.

---

## References & Academic Attribution

1. **Skiena, S. S.** (2020). *The Algorithm Design Manual* (3rd ed.). Springer.
2. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.). MIT Press.
3. **USA Computing Olympiad (USACO)** & **CP-Algorithms Archives** (2024). Curated Competitive Programming and Algorithm Verification Standards.
