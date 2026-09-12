# ⚠️ Part 11: Problem Bank & Revision — Module 08: Hall of Common Pitfalls & Frequently Confused Concepts

> **Topics Covered:**  
> 163. Hall of Common Mistakes, Bugs & Architectural Anti-Patterns &bull; 164. Frequently Confused Concepts Deconstructed

---

# TOPIC 163: THE HALL OF COMMON MISTAKES & ANTI-PATTERNS

### 1. Integer Overflow in Midpoint Calculation
- ❌ **Anti-Pattern**: `mid = (low + high) / 2`
  - When $\text{low} + \text{high} > 2^{31} - 1$ (over $\approx 2 \times 10^9$), the signed integer overflows into a negative value, triggering `IndexOutOfBoundsException` or memory corruption.
- ✅ **Defensive Fix**: `mid = low + ⌊(high - low) / 2⌋` or unsigned bit-shift `(low + high) >>> 1`.

---

### 2. Accidental $O(n^2)$ String Concatenation in Loops
- ❌ **Anti-Pattern**:
  ```text
  s ← ""
  for i ← 1 to n:
      s ← s + charArray[i]    // Creates a new string copy of size i each pass! Total = O(n²)
  ```
- ✅ **Defensive Fix**: Use an expandable dynamic character buffer / `StringBuilder` ($O(n)$ amortized total).

---

### 3. Forgetting the `visited[]` Marker in Graph BFS/DFS
- ❌ **Anti-Pattern**: Omitting `visited[]` in undirected or cyclic directed graphs causes the algorithm to bounce back and forth across edges indefinitely, triggering an infinite loop or fatal call stack overflow.
- ✅ **Defensive Fix**: Mark nodes `visited` **immediately upon enqueueing (in BFS)** or upon entering the function (in DFS).

---

### 4. Sliding Window Off-by-One Length Calculation
- ❌ **Confusion**: Is window length `right - left` or `right - left + 1`?
- ✅ **Universal Invariant**: For inclusive zero-based indices $[L, R]$, the count of elements is **ALWAYS**:
$$\mathbf{\text{Count} = R - L + 1}$$

---

### 5. Dynamic Array Resize Thrashing (Hysteresis Failure)
- ❌ **Anti-Pattern**: Doubling capacity when $n = C$ and halving capacity when $n = C / 2$.
  - Alternating `PushBack()` and `PopBack()` at the boundary triggers an $O(n)$ reallocation on **every single operation**!
- ✅ **Defensive Fix**: Double at $n = C$; halve only when $n \le C / 4$.

---

### 6. Misusing Dijkstra on Negative Edge Weights
- ❌ **Anti-Pattern**: Running Dijkstra on graphs containing negative edge weights. Dijkstra assumes finalized distances are optimal and will return incorrect paths.
- ✅ **Defensive Fix**: Use **Bellman-Ford** ($O(V \cdot E)$) or Floyd-Warshall ($O(V^3)$).

---
---

# TOPIC 164: FREQUENTLY CONFUSED CONCEPTS DECONSTRUCTED

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    THE 8 GREAT DATA STRUCTURE CONFUSIONS                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. Best / Worst Case vs $\Omega$ / $O$
- **Input Cases (Best / Average / Worst)** describe the **configuration of input data**.
- **Asymptotic Bounds ($O, \Omega, \Theta$)** are **mathematical envelope functions**.
- *Example*: The Worst-Case time of QuickSort is $\Theta(n^2)$ (both $O(n^2)$ and $\Omega(n^2)$). The Best-Case of QuickSort is $\Theta(n \log n)$.

---

### 2. Auxiliary Space vs Total Space
- **Total Space**: Total memory used, including input data buffers ($O(n)$).
- **Auxiliary Space**: Extra temporary scratchpad memory allocated by the algorithm *excluding* the input data (e.g., temporary variables, call stacks).
- *In-Place sorting algorithms require $O(1)$ or $O(\log n)$ auxiliary space, despite using $O(n)$ total space!*

---

### 3. Substring vs Subsequence vs Subarray
- **Subarray / Substring**: Elements must be **strictly contiguous** and maintain relative order (e.g., in `"abcde"`, `"bcd"` is a substring, but `"ace"` is not). Total count $= \frac{n(n+1)}{2} = O(n^2)$.
- **Subsequence**: Elements maintain relative order, but **do not need to be contiguous** (e.g., `"ace"` is a subsequence of `"abcde"`). Total count $= 2^n = O(2^n)$.
- **Subset**: Contiguity and order do **NOT matter** (e.g., $\{e, a, c\}$ is identical to $\{a, c, e\}$).

---

### 4. Tree Height vs Depth
- **Depth of Node $u$**: Number of edges from the **Root DOWN to $u$** ($\text{Depth}(\text{root}) = 0$).
- **Height of Node $u$**: Number of edges on the longest downward path from **$u$ DOWN to a Leaf** ($\text{Height}(\text{leaf}) = 0$).
- **Height of Tree** $=$ Depth of deepest leaf $=$ Height of Root.

---

### 5. Complete Binary Tree vs Full Binary Tree
- **Full Binary Tree**: Every single node has **0 or 2 children** (never 1).
- **Complete Binary Tree**: Every level is completely packed with nodes, and the bottom level is filled **strictly from left to right** (the array-heap property).
- *A complete tree is not necessarily full, and a full tree is not necessarily complete!*

---

### 6. Prim's Algorithm vs Dijkstra's Algorithm
While both algorithms use a Min-Heap and relax edges, their core objectives differ completely:
- **Dijkstra's**: Minimizes total cumulative distance from a single source:  
  $\text{Key} = \text{dist}[u] + w(u, v)$.
- **Prim's**: Minimizes the isolated weight of the next connecting edge to grow the tree:  
  $\text{Key} = w(u, v)$.

---

### 7. Memoization vs Tabulation
- **Memoization (Top-Down)**: On-demand evaluation using recursion with a cache table; skips unreachable subproblem states.
- **Tabulation (Bottom-Up)**: Systematically solves all subproblems in topological dependency order using iterative loops; facilitates memory space optimization.

---

### 8. Stable vs Unstable Sorting
- **Stable**: Preserves the original relative order of duplicate keys (Merge Sort, Insertion Sort, Bubble Sort, Counting Sort).
- **Unstable**: May scramble the relative order of duplicate keys (Quick Sort, Heap Sort, Selection Sort).

---

## 🔁 Module 08 Summary & Key Takeaways

1. Never calculate mid as `(low + high) / 2`; always use `low + (high - low) / 2`.
2. Input cases describe data states; $O, \Omega, \Theta$ describe mathematical growth bounds.
3. Subarrays are contiguous ($O(n^2)$); subsequences are non-contiguous but ordered ($O(2^n)$).
4. Dijkstra minimizes cumulative path distance $\text{dist}[u] + w$; Prim minimizes single edge cost $w$.

---
[⬅️ Previous: Volume 07 — Greedy, Backtracking, Math & Advanced](file:///d:/DSA/Part-11-Problem-Bank-and-Revision/07_greedy_backtracking_math_advanced_55.md) | [Next: Module 09 — Master Revision Sheets ➡️](file:///d:/DSA/Part-11-Problem-Bank-and-Revision/09_master_revision_sheets.md)
