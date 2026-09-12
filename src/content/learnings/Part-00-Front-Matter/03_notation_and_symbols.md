# 📐 Part 00: Front Matter — DSA Notation, Mathematical Symbols & Pseudocode Standard

---

## 1. Mathematical & Set Notations

Throughout this textbook, standard mathematical conventions are used to describe data domains, sizes, and logic.

| Notation | Meaning | Example / Definition |
| :--- | :--- | :--- |
| $\in$ | Element of | $x \in A$ ($x$ belongs to set $A$) |
| $\notin$ | Not an element of | $x \notin A$ |
| $\subset, \subseteq$ | Proper subset / Subset | $S \subseteq V$ (Sub-graph vertices) |
| $\emptyset$ | Empty set | $\emptyset = \{\}$ |
| $\mathbb{N}$ | Natural numbers | $\{0, 1, 2, 3, \dots\}$ or $\{1, 2, 3, \dots\}$ |
| $\mathbb{Z}$ | Integers | $\{\dots, -2, -1, 0, 1, 2, \dots\}$ |
| $\mathbb{R}$ | Real numbers | Continuous numerical domain |
| $[a, b]$ | Closed interval | All numbers $x$ such that $a \le x \le b$ |
| $[a, b)$ | Half-open interval | All numbers $x$ such that $a \le x < b$ |
| $\lfloor x \rfloor$ | Floor function | Greatest integer $\le x$ (e.g., $\lfloor 3.7 \rfloor = 3$) |
| $\lceil x \rceil$ | Ceiling function | Smallest integer $\ge x$ (e.g., $\lceil 3.2 \rceil = 4$) |
| $\sum_{i=1}^{n} f(i)$ | Summation | $f(1) + f(2) + \dots + f(n)$ |
| $\prod_{i=1}^{n} f(i)$ | Product | $f(1) \cdot f(2) \dots f(n)$ |
| $\log n$ | Binary Logarithm | Strictly $\log_2(n)$ in computer science unless noted |

---

## 2. Asymptotic & Complexity Notations

Asymptotic notation characterizes the growth rate of algorithms as input size $n \to \infty$.

```text
       Growth Rate Comparison (Order of Dominance)
       ──────────────────────────────────────────────────────────────────────────►
       O(1) < O(log n) < O(√n) < O(n) < O(n log n) < O(n²) < O(n³) < O(2ⁿ) < O(n!)
       Constant  Logarithmic  Sublinear  Linear  Linearithmic  Quadratic  Cubic  Exponential  Factorial
```

| Symbol | Name | Formal Mathematical Definition | Practical Meaning |
| :---: | :--- | :--- | :--- |
| $O(g(n))$ | **Big-O** | $f(n) \le c \cdot g(n)$ for all $n \ge n_0$ ($c > 0, n_0 \ge 1$) | **Upper Bound**: Growth rate does not exceed $g(n)$ |
| $\Omega(g(n))$ | **Big-Omega** | $f(n) \ge c \cdot g(n)$ for all $n \ge n_0$ ($c > 0, n_0 \ge 1$) | **Lower Bound**: Algorithm requires at least $g(n)$ steps |
| $\Theta(g(n))$ | **Big-Theta** | $c_1 g(n) \le f(n) \le c_2 g(n)$ for all $n \ge n_0$ | **Tight Bound**: Exact asymptotically bounded rate |
| $o(g(n))$ | **Little-o** | $\lim_{n \to \infty} \frac{f(n)}{g(n)} = 0$ | **Strict Upper Bound**: Asymptotically strictly smaller |
| $\omega(g(n))$ | **Little-omega**| $\lim_{n \to \infty} \frac{f(n)}{g(n)} = \infty$ | **Strict Lower Bound**: Asymptotically strictly larger |

---

## 3. Structural & Pointer Notations

### Memory & Linear Structures
- `A[i]`: The element at zero-based index $i$ in array $A$.
- `length(A)`: Total number of elements currently stored.
- `capacity(A)`: Total allocated physical buffer slots before a resize is triggered.
- `HEAD`: Pointer or reference to the first node of a linked list.
- `TAIL`: Pointer or reference to the final node of a linked list.
- `node.value`: Data payload stored inside a node.
- `node.next`: Pointer pointing to the succeeding node.
- `node.prev`: Pointer pointing to the preceding node (in doubly linked lists).
- `NULL` / `NIL`: Ground reference denoting absence of address (terminator).

### Trees & Hierarchical Structures
- $T$: A tree structure.
- `root`: The designated origin node possessing indegree 0.
- `node.left`, `node.right`: Left and right child references in binary trees.
- `node.parent`: Pointer to the direct ancestor.
- $h(u)$: Height of node $u$ (longest downward path to a leaf; leaf height $= 0$).
- $d(u)$: Depth of node $u$ (distance from root to $u$; root depth $= 0$).
- $BF(u)$: Balance Factor of node $u$, defined as $BF(u) = h(u.left) - h(u.right)$.

### Graphs & Networks
- $G = (V, E)$: A graph consisting of vertex set $V$ and edge set $E$.
- $|V|$ or $V$: Total number of vertices (nodes).
- $|E|$ or $E$: Total number of edges (connections).
- $(u, v)$: An edge directed from $u$ to $v$, or an undirected edge between $u$ and $v$.
- $w(u, v)$: The weight or cost assigned to edge $(u, v)$.
- $\deg(u)$: Degree of vertex $u$ (total incident edges).
- $\text{in-deg}(u), \text{out-deg}(u)$: In-degree and out-degree in directed graphs (digraphs).
- $adj[u]$: Adjacency list storing all neighbor vertices adjacent to $u$.

---

## 4. Universal Pseudocode Specification Standard

To ensure maximum clarity across all software engineers and students regardless of whether their primary language is C++, Java, Python, Go, or Rust, every algorithm in this textbook is authored using our strict **Language-Independent Pseudocode Standard**.

### Structural Syntax Rules

1. **Line Numbering**: Every line is explicitly numbered for unambiguous dry-run referencing.
2. **Variable Assignment**: Always written with the left arrow `←` (never single `=` which is reserved for mathematical equality).
   ```text
   1. count ← 0
   2. maxVal ← A[0]
   ```
3. **Equality & Comparison**:
   - Equal: `=`
   - Not Equal: `≠`
   - Relational: `<`, `≤`, `>`, `≥`
4. **Boolean Logic**:
   - `and`, `or`, `not` (written in bold lowercase English).
5. **Indentation Blocks**:
   - 4-space block indentation defines lexical scope (no braces `{}` or begin/end statements).
6. **Loops & Iteration**:
   - `while <condition>:`
   - `for <var> ← <start> to <end>:` (inclusive)
   - `for each <item> in <collection>:`
7. **Conditionals**:
   - `if <condition>:`
   - `else if <condition>:`
   - `else:`
8. **Subroutine Calling & Returns**:
   - Function declaration: `ALGORITHM FunctionName(param1, param2)`
   - Return statement: `return <value>`

### Gold Standard Pseudocode Template

```text
ALGORITHM BinarySearch(A, target)
    Input: Sorted array A of length n, target value to locate
    Output: Index of target in A, or -1 if target is not present

1.  low ← 0
2.  high ← length(A) - 1
3.  while low ≤ high:
4.      mid ← low + ⌊(high - low) / 2⌋
5.      if A[mid] = target:
6.          return mid
7.      else if A[mid] < target:
8.          low ← mid + 1
9.      else:
10.         high ← mid - 1
11. return -1
```

---
[⬅️ Previous: DSA Roadmap](file:///d:/DSA/Part-00-Front-Matter/02_dsa_roadmap.md) | [Next: Complexity Quick Reference ➡️](file:///d:/DSA/Part-00-Front-Matter/04_complexity_quick_ref.md)
