# 🌌 Part 10: Advanced DSA — Module 02: Advanced Graphs, Strings & Tree Techniques

> **Topics Covered:**  
> 152. Strongly Connected Components (Tarjan & Kosaraju), Bridges & Articulation Points &bull; 153. Advanced String Search (KMP & The $\pi$ Prefix Table) &bull; 154. Advanced Tree Techniques (Euler Tour & Binary Lifting for LCA) &bull; 155. Advanced DP Paradigms (Bitmask DP & Digit DP)

---

# TOPIC 152: ADVANCED GRAPH ALGORITHMS (SCC & BRIDGES)

### 1. Strongly Connected Components (SCC)
In a directed graph, a **Strongly Connected Component (SCC)** is a maximal subgraph where **every vertex is reachable from every other vertex**.

#### Kosaraju's 2-Pass Algorithm:
1. Run DFS on graph $G$. Push vertices onto a stack according to their finish times.
2. Compute the **Transpose Graph $G^T$** (reverse the direction of all edges).
3. Pop vertices from the stack. If unvisited in $G^T$, run DFS from that vertex: the resulting visited tree forms an **entire SCC**!
- **Time Complexity**: $\mathbf{\Theta(V + E)}$.

```text
ORIGINAL GRAPH G:        (1) ───► (2) ───► (3)
                          ▲        │        │
                          └────────┘        ▼
                                           (4)
SCC 1: {1, 2} (Mutually reachable cycle)
SCC 2: {3}
SCC 3: {4}
```

---

### 2. Bridges (Critical Connections) in Undirected Graphs
A **Bridge** is an edge whose removal strictly increases the number of connected components (disconnects the graph).
- **Tarjan's Bridge Algorithm**: Maintain two arrays during DFS:
  - `disc[u]`: Discovery time of vertex $u$.
  - `low[u]`: Lowest discovery time reachable from $u$ via at most one back-edge.
- **Bridge Invariant**: An edge $(u, v)$ is a **Bridge** if and only if:
$$\mathbf{low}[v] > \mathbf{disc}[u]$$
*(Meaning $v$ has zero alternate back-edges connecting to $u$ or an ancestor of $u$; cutting $(u, v)$ isolates $v$'s subtree!)*

---
---

# TOPIC 153: ADVANCED STRING ALGORITHMS: KNUTH-MORRIS-PRATT (KMP)

### 1. The Naive String Matching Inefficiency
Searching for pattern $P$ (length $m$) in text $T$ (length $n$):
- Naive scan rewinds the text pointer $i$ on every mismatch $\implies O(n \cdot m)$ worst case.
- **KMP Insight**: The text pointer $i$ **NEVER rewinds**! It always moves strictly forward ($O(n)$ time) by precomputing the **LPS (Longest Proper Prefix which is also Suffix)** table $\pi$.

---

### 2. The $\pi$ (LPS) Array
For pattern $P$, $\pi[i]$ stores the length of the longest proper prefix of $P[0 \dots i]$ that matches a suffix of $P[0 \dots i]$:

```text
PATTERN:    a   b   a   b   a   c   a
INDEX:      0   1   2   3   4   5   6
π [LPS]:    0   0   1   2   3   0   1

For substring "ababa" (index 4):
Prefix "aba" equals Suffix "aba" ──► Length = 3!
```

---

### 3. Complete Pseudocode: KMP String Matching

```text
ALGORITHM BuildLPS(pattern, m)
1.  allocate lps[0...m - 1] initialized to 0
2.  len ← 0, i ← 1
3.  while i < m:
4.      if pattern[i] = pattern[len]:
5.          len ← len + 1
6.          lps[i] ← len
7.          i ← i + 1
8.      else:
9.          if len ≠ 0:
10.             len ← lps[len - 1]  // Smart fallback
11.         else:
12.             lps[i] ← 0
13.             i ← i + 1
14. return lps

ALGORITHM KMP(text, pattern, n, m)
1.  lps ← BuildLPS(pattern, m)
2.  i ← 0, j ← 0
3.  while i < n:
4.      if text[i] = pattern[j]:
5.          i ← i + 1, j ← j + 1
6.      if j = m:
7.          Print("Pattern found at index: " + (i - j))
8.          j ← lps[j - 1]
9.      else if i < n and text[i] ≠ pattern[j]:
10.         if j ≠ 0:
11.             j ← lps[j - 1]      // Fallback without rewinding text pointer i!
12.         else:
13.             i ← i + 1
```

- **Preprocessing Time**: $\Theta(m)$.
- **Search Time**: $\Theta(n)$.
- **Total Time Complexity**: $\mathbf{\Theta(n + m)}$ linear time!

---
---

# TOPIC 154: ADVANCED TREE TECHNIQUES (EULER TOUR & BINARY LIFTING)

### 1. The Euler Tour Technique (Tree Flattening)
Flattens a hierarchical tree into a 1D linear array using DFS entry and exit timestamps:
- Record `in[u]` when entering node $u$.
- Record `out[u]` when exiting node $u$.
- **⭐ REVOLUTIONARY INVARIANT**: The entire subtree rooted at node $u$ occupies the strictly contiguous 1D range:
$$[\text{in}[u], \, \text{out}[u]]$$
- **Power**: Converts complex subtree updates and subtree queries into simple 1D **Range Queries on a Segment Tree or Fenwick Tree**!

---

### 2. Binary Lifting for Lowest Common Ancestor (LCA)
Find the **Lowest Common Ancestor (LCA)** of two nodes $u$ and $v$ in $O(\log N)$ time:
- Precompute table `up[node][k]`, representing the $2^k$-th ancestor of `node`.
- Recurrence:
$$\text{up}[u][k] = \text{up}\big[\text{up}[u][k - 1]\big][k - 1]$$
*(Your $2^k$-th ancestor is the $2^{k-1}$-th ancestor of your $2^{k-1}$-th ancestor!)*

```text
QUERY LCA(u, v) IN O(log N):
1. Lift the deeper node upwards so depth(u) = depth(v).
2. If u = v, return u.
3. Jump both nodes upwards in decreasing powers of 2 (k = 20 down to 0)
   as long as up[u][k] ≠ up[v][k].
4. Return up[u][0] (their direct parent)!
```

---
---

# TOPIC 155: ADVANCED DYNAMIC PROGRAMMING (BITMASK DP)

### Traveling Salesperson Problem (TSP) in $O(N^2 \cdot 2^N)$
Find the minimum cost to visit all $N$ cities and return to start.
- **Brute Force**: Try all permutations $\implies O(N!)$ (Unusable for $N = 20$: $20! \approx 2.4 \times 10^{18}$).
- **Bitmask DP**: Represent the set of visited cities as a **binary integer bitmask** of length $N$:
  - `mask = (1011)₂` $\implies$ cities 0, 1, and 3 have been visited.

#### State Definition:
`dp[mask][u]`: Minimum cost to visit all cities in `mask`, currently ending at city $u$.

#### Recurrence Transition:
$$\text{dp}[\text{mask} \ | \ (1 \ll v)][v] = \min_{v \notin \text{mask}} \Big( \text{dp}[\text{mask}][u] + \text{cost}[u][v] \Big)$$

- **Total States**: $2^N \times N$.
- **Transitions per State**: $N$.
- **Total Runtime**: $\mathbf{\Theta(N^2 \cdot 2^N)}$ (Easily executes for $N \le 20$ in $\approx 0.4\text{ seconds}$!).

---

## 🔁 Module 02 Summary & Key Takeaways

1. **Kosaraju's Algorithm** finds all Strongly Connected Components in directed graphs in $O(V + E)$ via graph transposition and 2 DFS passes.
2. **KMP** matches strings in $O(n + m)$ without ever rewinding the text pointer by exploiting the $\pi$ (LPS) table.
3. **Euler Tour** flattens tree subtrees into contiguous 1D intervals $[\text{in}[u], \text{out}[u]]$, bridging trees and segment trees.
4. **Binary Lifting** calculates the LCA of any two nodes in $O(\log N)$ time using powers-of-two ancestral tables.

---
[⬅️ Previous: Module 01 — Range Query Structures](file:///d:/DSA/Part-10-Advanced-DSA/01_range_query_structures.md) | [Next: Module 03 — Tree Decompositions ➡️](file:///d:/DSA/Part-10-Advanced-DSA/03_tree_decompositions.md)
