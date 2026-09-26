# Part 06: Trees — Module 09: Tries, Radix Trees & Bitwise 0-1 Structures

> Tries shift retrieval complexity from dataset cardinality $N$ to key length $L$, structuring dynamic dictionaries into character-by-character digital search paths. From autocomplete engines and compressed radix routing to bitwise XOR maximization and Aho-Corasick multi-pattern scanning, string trees establish the foundation for high-performance lexical processing.

---

## 1. Executive Summary & Learning Objectives

First described by René de la Briandais in 1959 and named by Edward Fredkin in 1960 from re**trie**val, a Trie (or prefix tree) is an ordered tree data structure where keys are usually strings. Unlike standard binary search trees where nodes store full keys, no node in a Trie stores its entire key; instead, its position within the tree defines the prefix it represents.

By the end of this chapter, you will be able to:

1. **Implement** pointer-safe Standard Trie insertion, prefix search, and bottom-up memory-reclaiming deletion in $O(L)$ time.
2. **Evaluate** memory consumption patterns between flat array pointer tables ($|\Sigma| = 26$) and dynamic hash maps across sparse and dense alphabets.
3. **Contrast** standard Tries with Compressed Radix Trees (PATRICIA tries), proving why edge compaction bounds total nodes to at most $2N$.
4. **Construct** a Bitwise 0-1 Trie to solve the Maximum XOR Pair and Subarray problem in strictly linear $O(32 \cdot n) = O(n)$ time.
5. **Trace** the architectural foundations of Suffix Trees (Ukkonen's $O(n)$ construction) and Aho-Corasick multi-pattern automaton failure links.

---

## 2. Standard Trie Architecture & Invariants

A Standard Trie satisfies four core structural properties:

1. **Root Representation**: The root node corresponds to the empty prefix `""`.
2. **Edge Character Semantics**: Each outgoing edge corresponds to exactly one character from alphabet $\Sigma$.
3. **Common Prefix Sharing**: All descendants of a given node share the identical string prefix defined by the path from the root.
4. **Terminal Marker**: A boolean flag (`isEndOfWord`) or stored terminal value distinguishes intermediate prefix junctions from fully completed words.

### Prefix Tree Topology

The table below illustrates a Trie storing the set of words: `["app", "apple", "apply", "bat", "ball"]`:

| Node Path                                        | Stored Character | Active Prefix | `isEndOfWord` | Child Pointers Present | Structural Classification                   |
| :----------------------------------------------- | :--------------: | :------------ | :-----------: | :--------------------- | :------------------------------------------ |
| **Root**                                         |       `""`       | `""`          |    `false`    | `'a'`, `'b'`           | Root Junction                               |
| **Root $\to$ a**                                 |      `'a'`       | `"a"`         |    `false`    | `'p'`                  | Shared Prefix Node                          |
| **Root $\to$ a $\to$ p**                         |      `'p'`       | `"ap"`        |    `false`    | `'p'`                  | Shared Prefix Node                          |
| **Root $\to$ a $\to$ p $\to$ p**                 |      `'p'`       | `"app"`       |  **`true`**   | `'l'`                  | **Terminal Word ("app")** & Prefix Junction |
| **Root $\to$ a $\to$ p $\to$ p $\to$ l**         |      `'l'`       | `"appl"`      |    `false`    | `'e'`, `'y'`           | Branching Node                              |
| **Root $\to$ a $\to$ p $\to$ p $\to$ l $\to$ e** |      `'e'`       | `"apple"`     |  **`true`**   | `null`                 | **Terminal Word ("apple")** / Leaf          |
| **Root $\to$ a $\to$ p $\to$ p $\to$ l $\to$ y** |      `'y'`       | `"apply"`     |  **`true`**   | `null`                 | **Terminal Word ("apply")** / Leaf          |
| **Root $\to$ b**                                 |      `'b'`       | `"b"`         |    `false`    | `'a'`                  | Shared Prefix Node                          |
| **Root $\to$ b $\to$ a**                         |      `'a'`       | `"ba"`        |    `false`    | `'t'`, `'l'`           | Branching Node                              |
| **Root $\to$ b $\to$ a $\to$ t**                 |      `'t'`       | `"bat"`       |  **`true`**   | `null`                 | **Terminal Word ("bat")** / Leaf            |
| **Root $\to$ b $\to$ a $\to$ l**                 |      `'l'`       | `"bal"`       |    `false`    | `'l'`                  | Single-Child Node                           |
| **Root $\to$ b $\to$ a $\to$ l $\to$ l**         |      `'l'`       | `"ball"`      |  **`true`**   | `null`                 | **Terminal Word ("ball")** / Leaf           |

<div class="my-6 p-4 bg-surface rounded-xl border border-border overflow-x-auto">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 820 340" width="100%" height="340" class="mx-auto block font-sans">
  <defs>
    <marker id="trie-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 1 L 10 5 L 0 9 z" fill="#64748b"/></marker>
    <linearGradient id="trie-term" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#10b981" stop-opacity="0.3"/><stop offset="100%" stop-color="#10b981" stop-opacity="0.05"/></linearGradient>
  </defs>
  <text x="410" y="22" text-anchor="middle" font-size="15" font-weight="bold" fill="currentColor">Standard Prefix Trie: Shared Prefixes &amp; Terminal Markers</text>
  <line x1="410" y1="45" x2="250" y2="95" stroke="#64748b" stroke-width="2"/>
  <line x1="410" y1="45" x2="570" y2="95" stroke="#64748b" stroke-width="2"/>
  <line x1="250" y1="95" x2="250" y2="150" stroke="#64748b" stroke-width="2"/>
  <line x1="250" y1="150" x2="250" y2="205" stroke="#64748b" stroke-width="2"/>
  <line x1="250" y1="205" x2="250" y2="260" stroke="#64748b" stroke-width="2"/>
  <line x1="250" y1="260" x2="190" y2="305" stroke="#64748b" stroke-width="2"/>
  <line x1="250" y1="260" x2="310" y2="305" stroke="#64748b" stroke-width="2"/>
  <line x1="570" y1="95" x2="570" y2="150" stroke="#64748b" stroke-width="2"/>
  <line x1="570" y1="150" x2="510" y2="210" stroke="#64748b" stroke-width="2"/>
  <line x1="570" y1="150" x2="630" y2="210" stroke="#64748b" stroke-width="2"/>
  <line x1="630" y1="210" x2="630" y2="270" stroke="#64748b" stroke-width="2"/>
  <circle cx="410" cy="45" r="18" fill="#1e293b" stroke="#64748b" stroke-width="2"/>
  <text x="410" y="50" text-anchor="middle" font-size="11" font-weight="bold" fill="#94a3b8">&#x2205;</text>
  <circle cx="250" cy="95" r="16" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  <text x="250" y="100" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">a</text>
  <circle cx="570" cy="95" r="16" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  <text x="570" y="100" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">b</text>
  <circle cx="250" cy="150" r="16" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  <text x="250" y="155" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">p</text>
  <circle cx="250" cy="205" r="18" fill="#10b981" stroke="#059669" stroke-width="3"/>
  <text x="250" y="210" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">p</text>
  <rect x="275" y="195" width="85" height="20" rx="4" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="1"/>
  <text x="317" y="209" text-anchor="middle" font-size="10" font-weight="bold" fill="#10b981">"app" &#x2714;</text>
  <circle cx="250" cy="260" r="16" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  <text x="250" y="265" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">l</text>
  <circle cx="190" cy="305" r="18" fill="#10b981" stroke="#059669" stroke-width="3"/>
  <text x="190" y="310" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">e</text>
  <text x="190" y="332" text-anchor="middle" font-size="10" font-weight="bold" fill="#10b981">"apple" &#x2714;</text>
  <circle cx="310" cy="305" r="18" fill="#10b981" stroke="#059669" stroke-width="3"/>
  <text x="310" y="310" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">y</text>
  <text x="310" y="332" text-anchor="middle" font-size="10" font-weight="bold" fill="#10b981">"apply" &#x2714;</text>
  <circle cx="570" cy="150" r="16" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  <text x="570" y="155" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">a</text>
  <circle cx="510" cy="210" r="18" fill="#10b981" stroke="#059669" stroke-width="3"/>
  <text x="510" y="215" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">t</text>
  <text x="510" y="238" text-anchor="middle" font-size="10" font-weight="bold" fill="#10b981">"bat" &#x2714;</text>
  <circle cx="630" cy="210" r="16" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  <text x="630" y="215" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">l</text>
  <circle cx="630" cy="270" r="18" fill="#10b981" stroke="#059669" stroke-width="3"/>
  <text x="630" y="275" text-anchor="middle" font-size="12" font-weight="bold" fill="#ffffff">l</text>
  <text x="630" y="298" text-anchor="middle" font-size="10" font-weight="bold" fill="#10b981">"ball" &#x2714;</text>
  <rect x="675" y="70" width="135" height="150" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1"/>
  <text x="742" y="92" text-anchor="middle" font-size="11" font-weight="bold" fill="#94a3b8">Legend &amp; Types</text>
  <circle cx="695" cy="115" r="7" fill="#0284c7"/>
  <text x="710" y="119" font-size="10" fill="currentColor">Prefix Branch</text>
  <circle cx="695" cy="142" r="7" fill="#10b981" stroke="#059669" stroke-width="2"/>
  <text x="710" y="146" font-size="10" font-weight="bold" fill="#10b981">Terminal Word</text>
  <text x="742" y="175" text-anchor="middle" font-size="9" fill="#94a3b8">Search: O(L) time</text>
  <text x="742" y="195" text-anchor="middle" font-size="9" fill="#94a3b8">L = word length</text>
</svg>
</div>

---

## 3. Complete Implementation: Standard Trie

```typescript
export class TrieNode {
  children: Map<string, TrieNode> = new Map();
  isEndOfWord: boolean = false;
}

export class Trie {
  root: TrieNode = new TrieNode();

  public insert(word: string): void {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children.has(char)) {
        curr.children.set(char, new TrieNode());
      }
      curr = curr.children.get(char)!;
    }
    curr.isEndOfWord = true;
  }

  public search(word: string): boolean {
    let curr = this.root;
    for (const char of word) {
      if (!curr.children.has(char)) return false;
      curr = curr.children.get(char)!;
    }
    return curr.isEndOfWord;
  }

  public startsWith(prefix: string): boolean {
    let curr = this.root;
    for (const char of prefix) {
      if (!curr.children.has(char)) return false;
      curr = curr.children.get(char)!;
    }
    return true;
  }

  public delete(word: string): boolean {
    return this.deleteHelper(this.root, word, 0);
  }

  private deleteHelper(curr: TrieNode, word: string, depth: number): boolean {
    if (depth === word.length) {
      if (!curr.isEndOfWord) return false; // Word not present
      curr.isEndOfWord = false;
      // If node has no other branches, signal caller to prune it
      return curr.children.size === 0;
    }

    const char = word[depth];
    const child = curr.children.get(char);
    if (!child) return false;

    const shouldPruneChild = this.deleteHelper(child, word, depth + 1);

    if (shouldPruneChild) {
      curr.children.delete(char);
      // Prune curr if it is not an end-of-word and has no other children
      return !curr.isEndOfWord && curr.children.size === 0;
    }

    return false;
  }
}
```

---

## 4. Compressed Tries: Radix Tree & PATRICIA Trie

In a Standard Trie, non-branching chains representing long unique words waste considerable pointer overhead. For example, storing `"antidisestablishmentarianism"` requires 28 nodes and $28 \times 26 = 728$ pointer references.

A **Radix Tree** (formalized by Donald R. Morrison in 1968 as **PATRICIA** — _Practical Algorithm To Retrieve Information Coded in Alphanumeric_) compresses every linear path of single-child nodes into a single edge labeled with an edge substring:

| Architectural Metric     | Standard Trie                        | Radix Tree (Compressed Trie)                          |
| :----------------------- | :----------------------------------- | :---------------------------------------------------- |
| **Edge Label**           | Exactly 1 character ($c \in \Sigma$) | Variable-length substring ($S[i \dots j]$)            |
| **Node Count Bound**     | $O(\sum                              | W_i                                                   | )$ (Sum of all character lengths) | **$\le 2N$ nodes strictly** (for $N$ stored words) |
| **Branching Factor**     | Array of size $                      | \Sigma                                                | $ per node                        | Dynamic list or small array of edges               |
| **Internal Node Degree** | Can have degree 1 (linear chains)    | **Degree $\ge 2$ strictly guaranteed** (except root)  |
| **Production Use Cases** | Autocomplete, Spellcheckers          | **Linux Kernel Page Cache**, IP routing tables (CIDR) |

---

## 5. Bitwise 0-1 Trie & Maximum XOR Subarray

A **Bitwise 0-1 Trie** treats 32-bit integers as binary strings indexed from **Most Significant Bit (MSB, bit 31)** down to **Least Significant Bit (LSB, bit 0)**:

- Alphabet size $|\Sigma| = 2$ (`0` = left child, `1` = right child).
- Every branch has fixed maximum depth $32$.

### The Maximum XOR Pair Algorithm ($O(32 \cdot n) = O(n)$)

Given an array of integers $A$, find $\max_{i, j}(A[i] \oplus A[j])$.

#### Greedy Principle

To maximize $X \oplus Y$, we evaluate bits from MSB (bit 31) down to 0:

- If the $k$-th bit of $X$ is $b \in \{0, 1\}$, we greedily search for a matching integer whose $k$-th bit is the complement $1 - b$, because $b \oplus (1 - b) = 1$.
- If a child branch with bit $1 - b$ exists in the 0-1 Trie, traverse it and set the $k$-th bit of the answer to $1$.
- If it does not exist, take the matching branch $b$ ($b \oplus b = 0$).

```typescript
export class BinaryTrieNode {
  children: [BinaryTrieNode | null, BinaryTrieNode | null] = [null, null];
}

export class BinaryTrie {
  root: BinaryTrieNode = new BinaryTrieNode();

  public insert(num: number): void {
    let curr = this.root;
    for (let i = 31; i >= 0; i--) {
      const bit = (num >>> i) & 1;
      if (curr.children[bit] === null) {
        curr.children[bit] = new BinaryTrieNode();
      }
      curr = curr.children[bit]!;
    }
  }

  public findMaxXOR(num: number): number {
    let curr = this.root;
    let maxXor = 0;

    for (let i = 31; i >= 0; i--) {
      const bit = (num >>> i) & 1;
      const toggledBit = 1 - bit;

      if (curr.children[toggledBit] !== null) {
        maxXor = maxXor | (1 << i);
        curr = curr.children[toggledBit]!;
      } else {
        curr = curr.children[bit]!;
      }
    }

    return maxXor;
  }
}
```

---

## 6. Step-by-Step Dry Run State Trace: Maximum XOR Query

Consider a 3-bit binary Trie populated with integers $\{2, 3, 6\}$:

- $2 = 010_2$
- $3 = 011_2$
- $6 = 110_2$

Query: `findMaxXOR(5)` where $5 = 101_2$ (Evaluating bits 2 down to 0):

|   Bit Position $i$    | Target Bit $(5 \gg i) \& 1$ | Desired Complement $(1 - \text{bit})$ |          Branch Available in Trie?           | Action Taken                                                  | Accumulated XOR Value |
| :-------------------: | :-------------------------: | :-----------------------------------: | :------------------------------------------: | :------------------------------------------------------------ | :-------------------- |
| **Bit 2 ($2^2 = 4$)** |             $1$             |                **$0$**                |  **Yes** (Nodes $2$ and $3$ start with $0$)  | Follow branch $0$. Set bit 2 of result to $1$.                | $100_2 = 4$           |
| **Bit 1 ($2^1 = 2$)** |             $0$             |                **$1$**                | **Yes** (Both $2$ and $3$ have bit 1 as $1$) | Follow branch $1$. Set bit 1 of result to $1$.                | $110_2 = 6$           |
| **Bit 0 ($2^0 = 1$)** |             $1$             |                **$0$**                |     **Yes** (Node $2$ has bit 0 as $0$)      | Follow branch $0$ (matching $2$). Set bit 0 of result to $1$. | $111_2 = \mathbf{7}$  |

_Verification:_ $5 \oplus 2 = 101_2 \oplus 010_2 = 111_2 = 7$. The algorithm dynamically found the optimal partner in $O(1)$ bit evaluations!

---

## 7. Advanced String Structures: Suffix Trees & Aho-Corasick Automata

### Suffix Trees & Ukkonen's Linear-Time Algorithm

A **Suffix Tree** is a compacted Trie containing all suffixes of string $S$ terminated by sentinel `$`:

- **Ukkonen's Algorithm (1995)** builds a suffix tree online in strictly **$O(n)$ linear time and space**.
- **Capabilities**:
  - Substring search for pattern $P$ in **$O(|P|)$ time**, completely independent of text length $|S|$.
  - Longest Repeated Substring in $O(n)$ time.
  - Longest Common Substring between two strings $S_1, S_2$ in $O(|S_1| + |S_2|)$ time.

### Aho-Corasick Multi-Pattern Automaton

Invented by Alfred Aho and Margaret Corasick in 1975, this automaton searches for a dictionary of $k$ patterns simultaneously:

- Augments a Trie with **Failure Transitions** (computed via BFS, mirroring the KMP prefix function) and **Dictionary Output Links**.
- Traverses the input text in a single pass without backtracking: running in strictly $O(|Text| + \sum |Pattern_i| + \text{Matches})$ time.
- Standard engine in network intrusion detection (Snort) and antivirus signature matching (ClamAV).

---

## 8. Asymptotic Complexity Matrix

| Data Structure                 |  Lookup Time   | Insertion Time | Deletion Time  |            Memory Bound            |
| :----------------------------- | :------------: | :------------: | :------------: | :--------------------------------: |
| **Standard Trie**              |     $O(L)$     |     $O(L)$     |     $O(L)$     |                $O(                 | \Sigma | \cdot N \cdot L)$ |
| **Radix Tree (PATRICIA)**      |     $O(L)$     |     $O(L)$     |     $O(L)$     |     **$O(N)$ nodes strictly**      |
| **Bitwise 0-1 Trie**           | $O(W) = O(1)$  | $O(W) = O(1)$  | $O(W) = O(1)$  | $O(W \cdot N)$ ($W = 32$ or $64$)  |
| **Suffix Tree**                |      $O(       |       P        |       )$       |                $O(                 | S      | )$ (Ukkonen)      | —   | $O( | S   | )$  |
| **Hash Table (`Set<string>`)** | $O(L)$ average | $O(L)$ average | $O(L)$ average | $O(N \cdot L)$ (No prefix sharing) |

---

## 9. Common Traps, Edge Cases & Implementation Pitfalls

1. **Memory Blowup with Fixed-Size Child Arrays**:
   - Declaring `children: TrieNode[26]` consumes 26 pointer references per node even for leaves. For sparse trees, use a dynamic `Map<char, TrieNode>` or compressed Radix Tree.
2. **Deleting Shared Prefixes**:
   - When deleting a word like `"app"` when `"apple"` exists, clearing children pointers corrupts `"apple"`. Only toggle `isEndOfWord = false`. Only delete nodes when `children.size === 0` and `isEndOfWord === false`.
3. **Signed Bit Shift in 0-1 Tries**:
   - In JavaScript and TypeScript, using `num >> i` executes a sign-propagating shift. Always use the unsigned right shift operator `num >>> i` to prevent negative MSB sign extension bugs.

---

## 10. References & Academic Attribution

1. **Fredkin, E.** (1960). Trie memory. _Communications of the ACM_, 3(9), 490–499.
2. **Morrison, D. R.** (1968). PATRICIA—Practical Algorithm To Retrieve Information Coded in Alphanumeric. _Journal of the ACM (JACM)_, 15(4), 514–534.
3. **Aho, A. V., & Corasick, M. J.** (1975). Efficient string matching: an aid to bibliographic search. _Communications of the ACM_, 18(6), 333–340.
4. **Ukkonen, E.** (1995). On-line construction of suffix trees. _Algorithmica_, 14(3), 249–260.
