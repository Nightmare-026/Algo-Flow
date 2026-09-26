# Part 00: Front Matter — DSA Notation, Mathematical Symbols & Pseudocode Standard

Precise mathematical notation and unambiguous pseudocode syntax prevent misinterpretations between theoretical proofs and executable software.

This chapter establishes the universal mathematical symbols, asymptotic definitions, graph formalisms, pointer conventions, and language-independent pseudocode standards used across the entire curriculum.

---

### Learning Objectives

By the end of this chapter, you will be able to:

- Interpret and apply formal set theory, first-order predicate logic, and interval notations in algorithmic definitions.
- Distinguish between all five standard asymptotic bounding symbols ($O, \Omega, \Theta, o, \omega$) and the soft-O notation ($\tilde{O}$) used in advanced algorithms.
- Read and author standardized, language-independent algorithmic pseudocode adhering to the **CLRS (Cormen et al.)** academic specification.
- Map abstract pointer models (`HEAD`, `TAIL`, `node.next`, `adj[u]`) to concrete memory references in C++, Java, Python, Go, and Rust.
- Formulate loop invariants with explicit mathematical preconditions, maintenance conditions, and postconditions.

---

## 1. Discrete Mathematics, Logic & Set Notations

Algorithmic specifications rely on standard discrete mathematics to define data domains, problem constraints, and operational bounds:

### Set Theory Notations

|      Symbol       | Mathematical Name      | Formal Definition                                         | Concrete Algorithmic Usage             |
| :---------------: | :--------------------- | :-------------------------------------------------------- | :------------------------------------- |
|       $\in$       | Element Of             | $x \in S$ indicates element $x$ belongs to set $S$        | Key membership: $k \in \text{keys}(H)$ |
|     $\notin$      | Not An Element Of      | $x \notin S \iff \neg(x \in S)$                           | Disjoint element check                 |
|    $\subseteq$    | Subset                 | $A \subseteq B \iff \forall x (x \in A \implies x \in B)$ | Graph vertex subsets $S \subseteq V$   |
|     $\subset$     | Strict / Proper Subset | $A \subset B \iff A \subseteq B \land A \ne B$            | Proper partition cuts in graphs        |
|    $\emptyset$    | Empty / Null Set       | The unique set containing zero elements: $\{\}$           | Base condition for collections         |
|      $\cup$       | Set Union              | $A \cup B = \{x : x \in A \lor x \in B\}$                 | Merging disjoint sets in DSU           |
|      $\cap$       | Set Intersection       | $A \cap B = \{x : x \in A \land x \in B\}$                | Finding common neighbors in graphs     |
|    $\setminus$    | Set Difference         | $A \setminus B = \{x : x \in A \land x \notin B\}$        | Unvisited vertices: $V \setminus S$    |
|     $\times$      | Cartesian Product      | $A \times B = \{(a, b) : a \in A \land b \in B\}$         | Edge domain $E \subseteq V \times V$   |
| $\lvert S \rvert$ | Set Cardinality        | The number of distinct elements in set $S$                | Vertex count $                         | V   | $, edge count $ | E   | $   |

---

### Number Domains & Numerical Sets

|     Domain     | Name                  | Definition                                      | Common Role in Algorithms                     |
| :------------: | :-------------------- | :---------------------------------------------- | :-------------------------------------------- |
|  $\mathbb{N}$  | Natural Numbers       | $\{0, 1, 2, 3, \dots\}$ or $\{1, 2, 3, \dots\}$ | Array sizes, loop step counters, tree depths  |
|  $\mathbb{Z}$  | Integers              | $\{\dots, -2, -1, 0, 1, 2, \dots\}$             | Signed array values, negative edge weights    |
|  $\mathbb{Q}$  | Rational Numbers      | $\{p/q : p, q \in \mathbb{Z}, q \ne 0\}$        | Exact fractional fractional knapsack ratios   |
|  $\mathbb{R}$  | Real Numbers          | Continuous real number line                     | Geometric coordinates, floating-point weights |
| $\mathbb{R}^+$ | Positive Real Numbers | $\{x \in \mathbb{R} : x > 0\}$                  | Strict non-negative weights for Dijkstra      |

---

### Predicate Logic & Proof Operators

|   Symbol   | Meaning                       | Example Statement                                          | English Translation                                   |
| :--------: | :---------------------------- | :--------------------------------------------------------- | :---------------------------------------------------- |
| $\forall$  | Universal Quantifier          | $\forall x \in A, \, x \ge 0$                              | "For all elements $x$ in $A$, $x$ is non-negative."   |
| $\exists$  | Existential Quantifier        | $\exists v \in V \text{ s.t. } \deg(v) = 0$                | "There exists at least one vertex $v$ with degree 0." |
| $\exists!$ | Unique Existential Quantifier | $\exists! r \in V \text{ s.t. } \text{indeg}(r) = 0$       | "There exists exactly one unique root node $r$."      |
| $\implies$ | Material Implication          | $u \in S \implies \text{visited}[u] = \text{true}$         | "If $u$ is in $S$, then $u$ is marked visited."       |
|   $\iff$   | Logical Equivalence           | $f(n) \in \Theta(g) \iff f \in O(g) \land f \in \Omega(g)$ | "if and only if" (bidirectional implication)          |
|  $\land$   | Logical Conjunction (AND)     | $i < n \land A[i] = k$                                     | Both conditions must simultaneously evaluate true     |
|   $\lor$   | Logical Disjunction (OR)      | $p == \text{NULL} \lor p\to\text{val} == 0$                | True if at least one operand evaluates true           |
|   $\neg$   | Logical Negation (NOT)        | $\neg \text{found}$                                        | Inverts the boolean truth value                       |

---

### Intervals, Rounding & Summations

|       Notation       | Formal Name             | Definition / Property                                                                                |
| :------------------: | :---------------------- | :--------------------------------------------------------------------------------------------------- |
|       $[a, b]$       | Closed Interval         | $\{x \in \mathbb{R} : a \le x \le b\}$ (Both boundary endpoints included)                            |
|       $(a, b)$       | Open Interval           | $\{x \in \mathbb{R} : a < x < b\}$ (Both boundary endpoints excluded)                                |
|       $[a, b)$       | Left-Closed, Right-Open | $\{x \in \mathbb{R} : a \le x < b\}$ (Standard for array slicing `A[0:n]`)                           |
| $\lfloor x \rfloor$  | Floor Function          | $\max \{m \in \mathbb{Z} : m \le x\}$ (e.g., $\lfloor 3.9 \rfloor = 3$, $\lfloor -1.2 \rfloor = -2$) |
|  $\lceil x \rceil$   | Ceiling Function        | $\min \{m \in \mathbb{Z} : m \ge x\}$ (e.g., $\lceil 3.1 \rceil = 4$, $\lceil -1.2 \rceil = -1$)     |
| $\sum_{i=a}^b f(i)$  | Summation Operator      | $f(a) + f(a + 1) + \dots + f(b)$ (Loops and operation counting)                                      |
| $\prod_{i=a}^b f(i)$ | Product Operator        | $f(a) \cdot f(a + 1) \dots f(b)$ (Factorials and permutations)                                       |
|       $\log n$       | Binary Logarithm        | Strictly $\log_2(n)$ in computer science unless specified otherwise                                  |

---

## 2. Asymptotic & Complexity Notations

Asymptotic notation captures the rate of growth of resource consumption as $n \to \infty$, ignoring machine constants:

```
+-------------------------------------------------------------------------------------------------+
|                                 THE ASYMPTOTIC NOTATION CANON                                   |
+----------+-----------------------+------------------------------------------+-------------------+
| Symbol   | Asymptotic Bound Role | Formal Mathematical Definition           | Relational Analog |
+----------+-----------------------+------------------------------------------+-------------------+
| O(g(n))  | Upper Bound           | 0 <= f(n) <= c * g(n)  for all n >= n0   | f(n) <= g(n)      |
| Ω(g(n))  | Lower Bound           | 0 <= c * g(n) <= f(n)  for all n >= n0   | f(n) >= g(n)      |
| Θ(g(n))  | Tight Bound           | c1 * g(n) <= f(n) <= c2 * g(n) (n >= n0) | f(n) == g(n)      |
| o(g(n))  | Strict Upper Bound    | lim_{n->inf} f(n) / g(n) = 0             | f(n) < g(n)       |
| ω(g(n))  | Strict Lower Bound    | lim_{n->inf} f(n) / g(n) = inf           | f(n) > g(n)       |
| Õ(g(n))  | Soft-O Bound          | O(g(n) * log^k(g(n))) for some k         | Ignores polylog   |
+----------+-----------------------+------------------------------------------+-------------------+
```

> [!NOTE]
> **Soft-O ($\tilde{O}$) Notation**:
> In advanced algorithm design (e.g., fast Fourier transform, computational geometry, randomized matrix multiplication), algorithms frequently feature polylogarithmic factors like $O(n \log^3 n)$ or $O(n \log n \log \log n)$.
> Soft-O notation suppresses all polylogarithmic terms:
> $$\tilde{O}(g(n)) = O(g(n) \cdot \log^k g(n)) \quad \text{for some constant } k \ge 0$$
> For instance, an algorithm running in $O(n \log^2 n)$ time is concisely written as $\tilde{O}(n)$.

---

## 3. Graph Theory Formalisms & Topologies

Graphs represent relational topologies. Standardized notation ensures clarity across shortest paths, flows, and network traversals:

```
           Undirected Edge (u, v)                Directed Edge / Arc (u -> v)
              (u) ------------ (v)                   (u) ------------> (v)
               Weight: w(u, v)                    Tail: u             Head: v
```

| Graph Formalism            |            Mathematical Symbol             | Exact Definition / Invariant                                                                                     |
| :------------------------- | :----------------------------------------: | :--------------------------------------------------------------------------------------------------------------- |
| **Graph Structure**        |                $G = (V, E)$                | $V$ is the set of vertices (nodes); $E$ is the set of edges (pairs of vertices).                                 |
| **Vertex Cardinality**     |          $\lvert V \rvert$ or $V$          | Total number of vertices in graph $G$.                                                                           |
| **Edge Cardinality**       |          $\lvert E \rvert$ or $E$          | Total number of edges in graph $G$. (For simple graphs, $0 \le \lvert E \rvert \le \binom{\lvert V \rvert}{2}$). |
| **Edge Weight Function**   |           $w: E \to \mathbb{R}$            | Maps every edge $(u, v) \in E$ to a real-valued scalar cost $w(u, v)$.                                           |
| **Vertex Degree**          |                 $\deg(u)$                  | Count of incident edges connected to vertex $u$ in an undirected graph.                                          |
| **In-Degree / Out-Degree** |   $\text{deg}^-(u), \, \text{deg}^+(u)$    | Number of incoming and outgoing directed edges in a digraph.                                                     |
| **Adjacency Set**          |         $\text{Adj}[u]$ or $N(u)$          | The neighborhood set of vertices adjacent to vertex $u$: $\{v \in V : (u, v) \in E\}$.                           |
| **Path**                   | $p = \langle v_0, v_1, \dots, v_k \rangle$ | A sequence of vertices such that $(v_{i-1}, v_i) \in E$ for all $1 \le i \le k$.                                 |
| **Simple Path**            |                     —                      | A path where all vertices $v_0, v_1, \dots, v_k$ are mutually distinct.                                          |
| **Cycle**                  |                     —                      | A path where $k \ge 3$ (undirected) or $k \ge 1$ (directed) and $v_0 = v_k$.                                     |
| **Directed Acyclic Graph** |                  **DAG**                   | A directed graph possessing zero directed cycles; topological order is guaranteed.                               |

---

## 4. Pointer Conventions & Multi-Language Concrete Mapping

Abstract data structures rely on relational pointers to link memory cells. In this curriculum, pseudocode uses standardized symbolic accessors mapped to idiomatic syntax across modern systems languages:

```
        Abstract Pointer Node Model
        +-----------------------------------+
        | Payload: node.value               |
        +-----------------------------------+
        | Forward Pointer: node.next        | ----> [ Successor Node ]
        +-----------------------------------+
        | Backward Pointer: node.prev       | ----> [ Predecessor Node ]
        +-----------------------------------+
```

| Abstract Pseudocode | Memory Semantic       | C++20          | Java / C#     | Python 3      | Rust                    |
| :------------------ | :-------------------- | :------------- | :------------ | :------------ | :---------------------- |
| `HEAD`              | Pointer to first node | `Node* head;`  | `Node head;`  | `self.head`   | `Option<Box<Node>>`     |
| `TAIL`              | Pointer to last node  | `Node* tail;`  | `Node tail;`  | `self.tail`   | `*mut Node`             |
| `node.val`          | Value payload         | `node->val`    | `node.val`    | `node.val`    | `node.val`              |
| `node.next`         | Forward pointer       | `node->next`   | `node.next`   | `node.next`   | `node.next.as_deref()`  |
| `node.prev`         | Backward pointer      | `node->prev`   | `node.prev`   | `node.prev`   | `node.prev`             |
| `NULL` / `NIL`      | Null address          | `nullptr`      | `null`        | `None`        | `None`                  |
| `allocate(Node)`    | Heap allocation       | `new Node()`   | `new Node()`  | `Node()`      | `Box::new(Node::new())` |
| `free(node)`        | Deallocate memory     | `delete node;` | Managed by GC | Managed by GC | Dropped at scope end    |

---

## 5. The CLRS Algorithmic Pseudocode Standard

To maintain rigorous mathematical precision without tying algorithms to language-specific runtime quirks, all pseudocode in this curriculum follows the **CLRS (Introduction to Algorithms)** convention:

### Syntactic & Formatting Rules

1. **Explicit Line Numbering**: Every executable statement is assigned a unique line number for direct analysis in proofs and operation counting.
2. **Indentation Indicates Block Scope**: Blocks of code (loop bodies, conditional branches) are delimited strictly by indentation rather than braces (`{}`) or `begin`/`end` keywords.
3. **Compound Data Variables**: Attributes are accessed using object notation: `A.length`, `node.next`, `T.root`.
4. **Assignment Operator**: Assignment is denoted by a left-pointing arrow $\leftarrow$ (or `:=` in text), strictly distinguishing assignment from equality testing ($=$).
5. **Array Indexing**: Unless explicitly noted otherwise for competitive programming contexts, theoretical pseudocode uses **1-based indexing** ($A[1 \dots n]$), with subarrays specified as $A[p \dots r]$.
6. **Pass-by-Reference for Objects**: Arrays and composite data structures are passed by reference; primitive scalars are passed by value.

---

### Canonical Pseudocode Example: Insertion Sort with Invariant

```text
ALGORITHM InsertionSort(A, n)
Input: An array A containing n elements: A[1...n]
Output: The array A sorted in monotonically non-decreasing order: A[1] <= A[2] <= ... <= A[n]

1.  for j = 2 to n do
2.      key ← A[j]
3.      // INVARIANT: The subarray A[1...j-1] consists of elements originally
4.      // in A[1...j-1], but in strictly sorted ascending order.
5.      i ← j - 1
6.      while i > 0 and A[i] > key do
7.          A[i + 1] ← A[i]
8.          i ← i - 1
9.      A[i + 1] ← key
10. return A
```

---

## 6. Loop Invariants: Structure & Formal Proof Template

A **Loop Invariant** is a formal predicate about the state of an algorithm that remains true before and after each iteration of a loop. It serves as the primary tool for proving the partial correctness of iterative algorithms.

Every formal loop invariant proof must establish three mandatory phases:

```
                         LOOP INVARIANT THREE-PHASE LIFECYCLE

    1. INITIALIZATION                    2. MAINTENANCE                    3. TERMINATION
    -----------------                    --------------                    -------------
    True prior to the first             If true before an iteration,       When loop terminates,
    loop iteration (Base Step).         remains true before next step      invariant gives property
                                        (Inductive Progression).           proving correctness.
```

### Invariant Proof Walkthrough: Insertion Sort

- **Invariant**: At the start of each iteration of the outer `for` loop (line 1), the subarray $A[1 \dots j - 1]$ consists of the elements originally in $A[1 \dots j - 1]$, but in sorted ascending order.

1. **Initialization (Base Case)**:
   - Prior to the first iteration, $j = 2$.
   - The subarray consists of the single element $A[1 \dots 1]$.
   - Any single-element array is trivially sorted. Thus, the invariant holds before loop entry.

2. **Maintenance (Inductive Step)**:
   - Assume the invariant holds for an index $j$: $A[1 \dots j - 1]$ is sorted.
   - Lines 5–8 shift elements $A[j - 1], A[j - 2], \dots$ to the right until the correct position for `key` ($A[j]$) is identified.
   - Line 9 inserts `key` into this slot.
   - Subarray $A[1 \dots j]$ now contains the exact same elements as before, but with `key` inserted in its sorted position.
   - Incrementing $j$ for the next iteration maintains the invariant for the new subarray $A[1 \dots j - 1]$.

3. **Termination**:
   - The loop terminates when $j > n$. Since $j$ increments by $1$ per step, it terminates precisely when $j = n + 1$.
   - Substituting $j = n + 1$ into the invariant statement:
     The subarray $A[1 \dots (n + 1) - 1] = A[1 \dots n]$ consists of the original elements of $A[1 \dots n]$ in sorted ascending order.
   - The entire array is sorted! The algorithm is formally proven correct. $\blacksquare$

---

## 7. Key Takeaways & Notation Quick Reference

- **Asymptotics**: Always use $\Theta$ when an upper and lower bound match; reserve $O$ for upper bounds and $\Omega$ for theoretical lower limits.
- **Interval Bounds**: Differentiate closed intervals $[0, n]$ ($n + 1$ items) from half-open intervals $[0, n)$ ($n$ items).
- **CLRS Pseudocode**: Treat pseudocode as executable mathematical specifications with explicit block scoping and invariant statements.
- **Loop Invariants**: Validate correctness using the tripartite template: **Initialization**, **Maintenance**, and **Termination**.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). _Introduction to Algorithms_ (4th ed.), Section 2.1: "Insertion sort" & Chapter 3: "Growth of Functions". MIT Press.
2. **Knuth, D. E.** (1997). _The Art of Computer Programming, Volume 1: Fundamental Algorithms_ (3rd ed.), Section 1.1: "Algorithms". Addison-Wesley.
3. **Rosen, K. H.** (2019). _Discrete Mathematics and Its Applications_ (8th ed.). McGraw-Hill.
