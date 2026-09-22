# Part 00: Front Matter — DSA Notation, Mathematical Symbols & Pseudocode Standard

Precise mathematical notation and unambiguous pseudocode syntax prevent misinterpretations between theoretical proofs and executable software. This chapter establishes the universal mathematical symbols, asymptotic definitions, pointer conventions, and language-independent pseudocode standards used across the entire curriculum.

### Learning Objectives
By the end of this chapter, you will be able to:
- Interpret and apply formal set theory, interval, and floor/ceiling notations in algorithmic contexts.
- Distinguish between asymptotic upper bounds ($O$), lower bounds ($\Omega$), and tight bounds ($\Theta$).
- Read and author standardized, language-independent algorithmic pseudocode with explicit line numbering and scope.
- Map mathematical pointer notations (`HEAD`, `TAIL`, `node.next`, `adj[u]`) to concrete memory references in C++, Java, Python, Go, and Rust.

---

## 1. Mathematical & Set Notations

Standard mathematical conventions used throughout the 62 chapters to describe data domains, sizes, and operational invariants:

| Notation | Meaning | Example / Definition |
| :--- | :--- | :--- |
| $\in$ | Element of | $x \in A$ ($x$ belongs to set $A$) |
| $\notin$ | Not an element of | $x \notin A$ ($x$ does not belong to set $A$) |
| $\subset, \subseteq$ | Proper subset / Subset | $S \subseteq V$ (Subset of vertices) |
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

Asymptotic notation characterizes the limiting behavior of an algorithm's runtime or memory footprint as input size $n \to \infty$.

### Asymptotic Growth Rate Hierarchy

$$O(1) < O(\log n) < O(\sqrt{n}) < O(n) < O(n \log n) < O(n^2) < O(n^3) < O(2^n) < O(n!)$$

| Order of Growth | Common Term | Example Algorithm / Operation |
| :--- | :--- | :--- |
| $O(1)$ | Constant | Array indexing, hash table average lookup |
| $O(\log n)$ | Logarithmic | Binary search, balanced BST lookup |
| $O(\sqrt{n})$ | Sublinear | Square root decomposition, trial division |
| $O(n)$ | Linear | Linear scan, counting elements |
| $O(n \log n)$ | Linearithmic | Merge sort, heap sort, quick sort average |
| $O(n^2)$ | Quadratic | Bubble sort, nested loops over arrays |
| $O(n^3)$ | Cubic | Naive matrix multiplication, Floyd-Warshall |
| $O(2^n)$ | Exponential | Recursive subset generation, naive Fibonacci |
| $O(n!)$ | Factorial | Generating all permutations, brute force TSP |

### Formal Definitions

| Symbol | Name | Formal Mathematical Definition | Practical Interpretation |
| :---: | :--- | :--- | :--- |
| $O(g(n))$ | **Big-O** | $f(n) \le c \cdot g(n)$ for all $n \ge n_0$ ($c > 0, n_0 \ge 1$) | **Upper Bound**: Growth rate does not exceed $g(n)$ |
| $\Omega(g(n))$ | **Big-Omega** | $f(n) \ge c \cdot g(n)$ for all $n \ge n_0$ ($c > 0, n_0 \ge 1$) | **Lower Bound**: Growth rate is at least $g(n)$ |
| $\Theta(g(n))$ | **Big-Theta** | $c_1 g(n) \le f(n) \le c_2 g(n)$ for all $n \ge n_0$ | **Tight Bound**: Exact rate within constant factors |
| $o(g(n))$ | **Little-o** | $\lim_{n \to \infty} \frac{f(n)}{g(n)} = 0$ | **Strict Upper Bound**: Asymptotically strictly smaller |
| $\omega(g(n))$ | **Little-omega**| $\lim_{n \to \infty} \frac{f(n)}{g(n)} = \infty$ | **Strict Lower Bound**: Asymptotically strictly larger |

---

## 3. Structural & Pointer Notations

### Memory & Linear Structures
- `A[i]`: Element at zero-based index $i$ in array $A$.
- `length(A)`: Total active elements stored in structure $A$.
- `capacity(A)`: Total allocated physical buffer slots before a resize is triggered.
- `HEAD`: Pointer or reference to the initial node of a linked list.
- `TAIL`: Pointer or reference to the terminal node of a linked list.
- `node.value`: Data payload contained inside a node.
- `node.next`: Pointer referencing the successor node.
- `node.prev`: Pointer referencing the predecessor node (doubly linked list).
- `NULL` / `NIL`: Ground reference denoting absence of memory address.

### Trees & Hierarchical Structures
- $T$: A tree structure.
- `root`: The unique origin node possessing indegree 0.
- `node.left`, `node.right`: Left and right child references in binary trees.
- `node.parent`: Pointer to the direct ancestor.
- $h(u)$: Height of node $u$ (longest downward edge-path to a leaf; leaf height $= 0$).
- $d(u)$: Depth of node $u$ (edges on path from root down to $u$; root depth $= 0$).
- $BF(u)$: Balance Factor of node $u$, defined as $BF(u) = h(u.left) - h(u.right)$.

### Graphs & Networks
- $G = (V, E)$: A graph consisting of vertex set $V$ and edge set $E$.
- $|V|$ or $V$: Total count of vertices (nodes).
- $|E|$ or $E$: Total count of edges (arcs).
- $(u, v)$: Edge connecting vertex $u$ to vertex $v$.
- $w(u, v)$: Scalar weight or cost associated with edge $(u, v)$.
- $\deg(u)$: Degree of vertex $u$ (total incident edges).
- $\text{in-deg}(u), \text{out-deg}(u)$: In-degree and out-degree in directed graphs (digraphs).
- $adj[u]$: Adjacency list storing all vertices adjacent to $u$.

---

## 4. Universal Pseudocode Specification Standard

To ensure algorithms transfer seamlessly across the four workstation languages (JavaScript, Python, C++, and Java), every algorithm in this curriculum follows a language-independent pseudocode standard.

### Syntax Specifications

1. **Line Numbering**: Explicit 1-based numbering enables step-by-step state table tracing.
2. **Assignment Operator**: Left arrow `←` indicates assignment (reserving `=` for equality comparison).
3. **Equality & Relations**: `=` (equality), `≠` (inequality), `<`, `≤`, `>`, `≥`.
4. **Logical Operators**: `and`, `or`, `not` written in lowercase text.
5. **Indentation Scoping**: 4-space indentation defines block scope without language-specific braces.
6. **Control Flow**:
   - `while <condition>:`
   - `for <var> ← <start> to <end>:` (inclusive range)
   - `for each <item> in <collection>:`
   - `if <condition>: ... else if <condition>: ... else:`
7. **Signatures**:
   - Declaration: `ALGORITHM Name(parameters)`
   - Exit: `return <value>`

### Reference Implementation Pattern

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

## 5. Key Takeaways

- **Strict Terminology**: Distinguish between worst-case runtime and Big-O upper bounds; Big-O is a mathematical envelope, while worst-case is an operational scenario.
- **Logarithmic Base**: In computer science, $\log n$ implies base 2 unless explicitly denoted otherwise (due to binary subdivisions).
- **Pseudocode Discipline**: Explicit line numbering and unambiguous assignment (`←`) eliminate translation errors when implementing algorithms across diverse programming languages.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 1–3. MIT Press.
2. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.). Addison-Wesley.
3. **IEEE / ACM Computing Curricula Guidelines** (2020). Curriculum Guidelines for Undergraduate Degree Programs in Computer Science.
