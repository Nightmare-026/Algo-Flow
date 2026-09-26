# Part 10: Advanced DSA — Module 02: Advanced Graphs, Strings & Tree Techniques

Advanced algorithmic paradigms conquer combinatorial explosions and topological complexities by exploiting hidden structural symmetries. From finding strongly connected components and linear pattern matching to flattening tree hierarchies and bitmask dynamic programming, these techniques power compilers, network routers, and high-performance search engines.

---

## 1. Executive Summary & Learning Objectives

This module explores advanced computational techniques across graphs, strings, trees, and exponential state spaces, establishing rigorous mathematical invariants for industrial and competitive applications.

By the end of this chapter, you will be able to:

1. **Partition Directed & Undirected Graphs**: Compute Strongly Connected Components via Kosaraju's two-pass algorithm and detect critical bridges using Tarjan's low-link timestamps in $\mathcal{O}(V + E)$ time.
2. **Execute Linear String Matching**: Construct the KMP prefix-function ($\pi$ table) in $\mathcal{O}(m)$ time and stream text searches in $\mathcal{O}(n)$ time without pointer backtracking.
3. **Flatten Tree Hierarchies**: Apply the Euler Tour Technique to map subtree queries directly to contiguous 1D ranges $[\text{in}[u], \text{out}[u]]$.
4. **Compute Lowest Common Ancestors**: Implement binary lifting via dynamic programming to jump ancestral powers of two in $\mathcal{O}(\log n)$ query time.
5. **Formulate Bitmask State Spaces**: Compress subset membership into integer bitmasks to solve permutation-hard problems such as TSP in $\mathcal{O}(n^2 2^n)$ time.

---

## 2. Topic 152: Advanced Graph Algorithms (SCC & Bridges)

### 1. Strongly Connected Components (SCC)

In a directed graph $G = (V, E)$, a **Strongly Connected Component (SCC)** is a maximal set of vertices $U \subseteq V$ such that for every pair $u, v \in U$, there exists a directed path from $u$ to $v$ and from $v$ to $u$.

#### Kosaraju's Two-Pass Algorithm

1. **First DFS Pass**: Perform DFS on $G$. Upon completing vertex exploration, push the vertex onto a finishing stack $S$.
2. **Transpose Graph**: Construct $G^T$ by reversing the orientation of every directed edge in $E$.
3. **Second DFS Pass**: Pop vertices sequentially from $S$. If a popped vertex is unvisited in $G^T$, initiate a DFS from it in $G^T$. The resulting traversal tree constitutes an entire independent SCC.

- **Time Complexity**: $\Theta(V + E)$
- **Space Complexity**: $\Theta(V + E)$ auxiliary storage

---

### 2. Bridges (Critical Connections) in Undirected Graphs

A **Bridge** is an edge whose deletion strictly increases the number of connected components in an undirected graph.

#### Tarjan's Bridge Invariant

Maintain two DFS timestamps for each vertex $u$:

- $\text{disc}[u]$: Discovery time of node $u$ in the DFS tree.
- $\text{low}[u]$: Lowest discovery time reachable from $u$ through its DFS subtree and at most one back-edge.

An edge $(u, v)$ is a **Bridge** if and only if:
$$\mathbf{low}[v] > \mathbf{disc}[u]$$

_Proof_: If $\text{low}[v] \le \text{disc}[u]$, there exists a cycle or back-edge from $v$ or its descendants reaching $u$ or an ancestor of $u$. If $\text{low}[v] > \text{disc}[u]$, no alternate route exists, and severing $(u, v)$ isolates $v$'s subtree.

---

## 3. Topic 153: Advanced String Algorithms: Knuth-Morris-Pratt (KMP)

### 1. The Non-Rewinding Search Invariant

When matching pattern $P$ (length $m$) against text $T$ (length $n$):

- Naive matching rewinds the text index upon mismatch $\implies \mathcal{O}(n \cdot m)$ worst case.
- **KMP Invariant**: The text pointer $i$ moves strictly forward ($i \to i + 1$). On mismatch, pattern pointer $j$ falls back using the precomputed $\pi$ (LPS) table.

### 2. The $\pi$ (LPS) Array

$\pi[k]$ stores the length of the longest proper prefix of $P[0 \dots k]$ that is also a suffix of $P[0 \dots k]$:

|    Pattern Char    | **a** | **b** | **a** | **b** | **a** | **c** | **a** |
| :----------------: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
|   **Index $k$**    |   0   |   1   |   2   |   3   |   4   |   5   |   6   |
| **$\pi[k]$ (LPS)** |   0   |   0   |   1   |   2   |   3   |   0   |   1   |

For prefix `"ababa"` at index 4, the longest proper prefix matching a suffix is `"aba"` of length 3.

```typescript
export function buildLPS(pattern: string): number[] {
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1]; // Fallback to shorter prefix-suffix
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  return lps;
}

export function kmpSearch(text: string, pattern: string): number[] {
  const n = text.length;
  const m = pattern.length;
  const matches: number[] = [];
  if (m === 0) return matches;

  const lps = buildLPS(pattern);
  let i = 0; // Text pointer
  let j = 0; // Pattern pointer

  while (i < n) {
    if (text[i] === pattern[j]) {
      i++;
      j++;
    }

    if (j === m) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < n && text[i] !== pattern[j]) {
      if (j !== 0) {
        j = lps[j - 1]; // Skip redundant comparisons
      } else {
        i++;
      }
    }
  }

  return matches;
}
```

---

## 4. Topic 154: Advanced Tree Techniques (Euler Tour & Binary Lifting)

### 1. The Euler Tour Technique (Subtree Interval Mapping)

By recording timestamps when entering and exiting vertices during DFS, a hierarchical tree is projected onto a 1D sequence:

- Record `in[u]` upon visiting node $u$.
- Record `out[u]` upon exiting node $u$.

**Key Invariant**: The entire subtree rooted at node $u$ corresponds precisely to the contiguous 1D interval:
$$[\text{in}[u], \, \text{out}[u]]$$

This projection converts complex subtree mutations and aggregations into standard 1D range queries executable on a Segment Tree or Fenwick Tree in $\mathcal{O}(\log n)$ time.

---

### 2. Binary Lifting for Lowest Common Ancestor (LCA)

Binary lifting precomputes an ancestral jump table using dynamic programming:
Let `up[u][k]` denote the $2^k$-th ancestor of vertex $u$:

$$\text{up}[u][k] = \text{up}\big[\text{up}[u][k-1]\big][k-1]$$

```typescript
export class BinaryLiftingLCA {
  private up: number[][];
  private depth: number[];
  private maxK: number;

  constructor(n: number, adj: number[][], root: number = 0) {
    this.maxK = Math.floor(Math.log2(Math.max(1, n))) + 1;
    this.up = Array.from({ length: n }, () => new Array(this.maxK).fill(-1));
    this.depth = new Array(n).fill(0);

    this.dfs(root, -1, 0, adj);
  }

  private dfs(u: number, parent: number, d: number, adj: number[][]): void {
    this.depth[u] = d;
    this.up[u][0] = parent;

    for (let k = 1; k < this.maxK; k++) {
      if (this.up[u][k - 1] !== -1) {
        this.up[u][k] = this.up[this.up[u][k - 1]][k - 1];
      }
    }

    for (const v of adj[u]) {
      if (v !== parent) {
        this.dfs(v, u, d + 1, adj);
      }
    }
  }

  public getLCA(u: number, v: number): number {
    // 1. Ensure u is at least as deep as v
    if (this.depth[u] < this.depth[v]) {
      [u, v] = [v, u];
    }

    // 2. Lift u to the same depth as v
    for (let k = this.maxK - 1; k >= 0; k--) {
      if (this.depth[u] - (1 << k) >= this.depth[v]) {
        u = this.up[u][k];
      }
    }

    if (u === v) return u;

    // 3. Lift both nodes together below the LCA
    for (let k = this.maxK - 1; k >= 0; k--) {
      if (this.up[u][k] !== -1 && this.up[u][k] !== this.up[v][k]) {
        u = this.up[u][k];
        v = this.up[v][k];
      }
    }

    return this.up[u][0];
  }
}
```

---

## 5. Topic 155: Advanced Dynamic Programming (Bitmask DP)

### Traveling Salesperson Problem (TSP)

Given $N$ vertices and pairwise transition costs, find the minimum cost tour visiting every node once and returning to the origin.

- **Brute Force Permutations**: $\mathcal{O}(N!)$ (Intractable for $N \ge 15$).
- **Held-Karp Bitmask DP**: Encode visited subsets as an integer bitmask of length $N$:

#### State Definition

`dp[mask][u]`: Minimum cost of traversing all vertices present in `mask`, currently located at vertex $u$.

#### Recurrence Relation

$$\text{dp}[\text{mask} \ | \ (1 \ll v)][v] = \min_{v \notin \text{mask}} \Big( \text{dp}[\text{mask}][u] + \text{cost}[u][v] \Big)$$

- **Total States**: $2^N \times N$
- **Transitions per State**: $N$
- **Overall Runtime**: $\mathbf{\Theta(N^2 \cdot 2^N)}$, solving $N = 20$ instances in approximately $0.4\text{ seconds}$.

---

## 6. Algorithmic Domain Summary

| Subsystem                    | Core Paradigm                  | Canonical Algorithm   | Asymptotic Complexity                                      |
| :--------------------------- | :----------------------------- | :-------------------- | :--------------------------------------------------------- |
| **Directed Graphs**          | Transposition + Double DFS     | Kosaraju SCC          | $\Theta(V + E)$ time, $\mathcal{O}(V)$ space               |
| **Undirected Graphs**        | DFS Discovery / Low-Link       | Tarjan Bridges        | $\Theta(V + E)$ time, $\mathcal{O}(V)$ space               |
| **String Matching**          | Prefix-Suffix Finite Automaton | Knuth-Morris-Pratt    | $\Theta(n + m)$ time, $\mathcal{O}(m)$ space               |
| **Tree Subtree Queries**     | DFS Interval Projection        | Euler Tour Flattening | $\mathcal{O}(n)$ build, $\mathcal{O}(\log n)$ query        |
| **Ancestral Queries**        | Dyadic Powers Decomposition    | Binary Lifting LCA    | $\mathcal{O}(n \log n)$ build, $\mathcal{O}(\log n)$ query |
| **Permutation Optimization** | Subset State Compression       | Held-Karp Bitmask DP  | $\Theta(n^2 2^n)$ time, $\Theta(n 2^n)$ space              |

---

## References & Academic Attribution

1. **Kosaraju, S. R.** (1978). Fast algorithms for connectivity and related problems. _Unpublished technical report_.
2. **Tarjan, R. E.** (1972). Depth-first search and linear graph algorithms. _SIAM Journal on Computing_, 1(2), 146–160.
3. **Knuth, D. E., Morris, J. H., & Pratt, V. R.** (1977). Fast pattern matching in strings. _SIAM Journal on Computing_, 6(2), 323–350.
4. **Held, M., & Karp, R. M.** (1962). A dynamic programming approach to sequencing problems. _Journal of the Society for Industrial and Applied Mathematics_, 10(1), 196–210.
