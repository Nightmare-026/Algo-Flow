# Part 06: Trees — Module 09: Tries, Radix Trees & Bitwise 0-1 Structures

> **Topics Covered:**  
> 95a. Standard Trie (Digital Search Tree & Autocomplete) &bull; 95b. Node Memory Footprint & Dynamic Pointers &bull; 95c. Compressed Trie (Radix Tree & Patricia Trie) &bull; 95d. Bitwise 0-1 Trie & Maximum XOR Subarray Mastery &bull; 95e. Suffix Trie & Suffix Tree Foundations &bull; 95f. Aho-Corasick Automaton Multi-Pattern Matching Preview

---

# TOPIC 95a & 95b: THE STANDARD TRIE (PREFIX RETRIEVAL TREE)

### 1. Topic Title
**Standard Trie (Prefix Tree)**

### 2. Category
Multiway Trees — Lexicographical String Retrieval Structures.

### 3. Definition & Invariants
A **Trie** (derived from re**trie**val) is an $m$-ary tree designed to store and search a dynamic dictionary of strings:
1. The **Root** represents the empty prefix `""`.
2. Each node contains up to $|\Sigma|$ child pointers (where $|\Sigma| = 26$ for English lowercase letters).
3. All descendants of a node share a common string **prefix**.
4. A boolean flag `isEndOfWord` distinguishes intermediate prefix nodes from completed words.

```text
STRUCTURAL DIAGRAM OF A TRIE:
Storing ["app", "apple", "apply", "bat", "ball"]:

                              ( Root )
                             /        \
                          [ a ]      [ b ]
                            │          │
                          [ p ]      [ a ]
                            │        /     \
                         [ p*]     [ t*]   [ l ]
                         /   \               │
                       [l]   [l]           [ l*]
                       │      │
                      [e*]   [y*]

Note: '*' indicates isEndOfWord = true.
Notice how "app", "apple", and "apply" share the identical common path: (Root) ─► a ─► p ─► p.
```

---

### 4. Complete Trie Implementation in Pseudocode

```text
STRUCTURE TrieNode:
    children: array of 26 TrieNode pointers (all initialized to NULL)
    isEndOfWord: boolean (initially false)

DATA STRUCTURE Trie:
    Fields:
        root: TrieNode

    OPERATION Initialize():
        root ← allocate TrieNode()

    OPERATION Insert(word):
        curr ← root
        for each char c in word:
            idx ← ascii(c) - ascii('a')
            if curr.children[idx] = NULL:
                curr.children[idx] ← allocate TrieNode()
            curr ← curr.children[idx]
        curr.isEndOfWord ← true

    OPERATION Search(word):
        curr ← root
        for each char c in word:
            idx ← ascii(c) - ascii('a')
            if curr.children[idx] = NULL:
                return false
            curr ← curr.children[idx]
        return curr.isEndOfWord

    OPERATION StartsWith(prefix):
        curr ← root
        for each char c in prefix:
            idx ← ascii(c) - ascii('a')
            if curr.children[idx] = NULL:
                return false
            curr ← curr.children[idx]
        return true

    OPERATION Delete(word):
        DeleteHelper(root, word, 0)

    HELPER DeleteHelper(curr, word, depth):
        if curr = NULL: return false
        if depth = Length(word):
            if not curr.isEndOfWord: return false
            curr.isEndOfWord ← false
            return IsLeaf(curr) // Safe to deallocate if no other children exist
        idx ← ascii(word[depth]) - ascii('a')
        shouldDeleteChild ← DeleteHelper(curr.children[idx], word, depth + 1)
        if shouldDeleteChild:
            deallocate curr.children[idx]
            curr.children[idx] ← NULL
            return not curr.isEndOfWord and IsLeaf(curr)
        return false
```

---

# TOPIC 95c: COMPRESSED TRIE (RADIX TREE / PATRICIA TRIE)

### 1. Space Inefficiency of Standard Tries
In a standard Trie, long sequences of nodes with only **one child** waste enormous memory (e.g., storing the word `"antidisestablishmentarianism"` requires 28 nodes and $28 \times 26 = 728$ child pointers!).

### 2. The Radix Tree Optimization
A **Radix Tree** (or Compressed Trie / Patricia Trie) compresses every non-branching chain of single-child nodes into a **single edge labeled with a substring**:

```text
STANDARD TRIE:                           COMPRESSED RADIX TREE:
        (Root)                                     (Root)
          │                                      /        \
        [ c ]                              "cat"          "dog"
          │                                 /                │
        [ a ]                            (Node)            [ * ]
          │                              /     \
        [ t ]                          "s"     "er"
        /   \                           │       │
      [s]   [e]                        [*]     [*]
             │
            [r]
```

- **Space Bound**: A Radix Tree storing $N$ words contains at most **$2N$ nodes** regardless of word lengths!
- **Industry Standard**: Used in IP routing tables (CIDR longest prefix match) and the **Linux Kernel Page Cache** (`radix-tree.c`).

---

# TOPIC 95d: BITWISE 0-1 TRIE & MAXIMUM XOR SUBARRAY

A **Bitwise (0-1) Trie** treats 32-bit (or 64-bit) integers as strings of binary bits from **Most Significant Bit (MSB, bit 31)** down to **Least Significant Bit (LSB, bit 0)**.
- Alphabet size $|\Sigma| = 2$ (`0` = left child, `1` = right child).
- Every path has a fixed length of 32 steps.

```text
VISUALIZING A 0-1 TRIE STORING NUMBERS 3 (011b) AND 6 (110b):
                             ( Root )
                            /        \
                      bit 0/          \bit 1
                         [ ]          [ ]
                           \          /
                       bit 1\        /bit 1
                            [ ]    [ ]
                              \    /
                          bit 1\  /bit 0
                              [*] [*]
                             (val=3) (val=6)
```

---

### The Maximum XOR Pair Problem ($O(32 \cdot n) = O(n)$)
Given an array of integers $A$, find two elements $A[i], A[j]$ such that $A[i] \oplus A[j]$ is maximized.

#### The Greedy Principle:
To maximize the XOR result, at each bit position $k$ from 31 down to 0, if the $k$-th bit of $X$ is $b$, we want to match it with an integer whose $k$-th bit is **$1 - b$** (the opposite bit), because $b \oplus (1 - b) = 1$!
- If the child with the opposite bit exists in the 0-1 Trie, traverse into it and add $2^k$ to our XOR sum!
- If it does not exist, we are forced to take the child with the same bit ($b \oplus b = 0$).

```text
ALGORITHM FindMaxXOR(root, num):
1.  curr ← root
2.  maxXor ← 0
3.  for bit ← 31 down to 0:
4.      b ← (num >> bit) & 1
5.      oppositeBit ← 1 - b
6.      if curr.children[oppositeBit] ≠ NULL:
7.          maxXor ← maxXor | (1 << bit)
8.          curr ← curr.children[oppositeBit]
9.      else:
10.         curr ← curr.children[b]
11. return maxXor
```

---

# TOPIC 95e & 95f: SUFFIX TREES & AHO-CORASICK MULTI-PATTERN MATCHING

### 1. Suffix Tree
A **Suffix Tree** is a compressed Trie containing all suffixes of a string $S$ terminated by a special end-marker `$`.
- **Esko Ukkonen's Algorithm (1995)** constructs a Suffix Tree in **strictly $O(n)$ linear time** using implicit suffix links and an active point!
- **Superpowers**:
  - Check if pattern $P$ of length $m$ is a substring of text $S$ in **$O(m)$ time** (independent of text length $n$!).
  - Find the Longest Repeated Substring in $O(n)$ time.
  - Find the Longest Common Substring of two strings $S_1, S_2$ in $O(|S_1| + |S_2|)$ time.

---

### 2. Aho-Corasick Automaton
Invented by Alfred Aho and Margaret Corasick in 1975, the **Aho-Corasick Automaton** solves the dictionary matching problem: find all occurrences of a set of $k$ patterns in a text $T$ simultaneously.
- Augments a Trie with **Failure Links** (computed via BFS, identical to the KMP failure function) and **Dictionary Output Links**.
- Runs in **$O(|T| + \sum |P_i| + Z)$** time, where $Z$ is the total number of matches found!
- Used in antivirus signature scanners (ClamAV) and intrusion detection engines (Snort).

---

## Module 09 Summary & Key Takeaways

1. **Standard Tries** provide $O(L)$ search and insert independent of dictionary size $N$.
2. **Radix Trees** eliminate single-child nodes, guaranteeing at most $2N$ internal nodes.
3. **0-1 Bitwise Tries** solve maximum XOR queries in $O(32 \cdot n) = O(n)$ linear time by greedily branching toward the opposite bit at each power of 2.
4. **Suffix Trees** index an entire text in $O(n)$ time, enabling $O(m)$ substring searches.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapters 12–13 (BSTs and Red-Black Trees) & Chapter 18 (B-Trees). MIT Press.
2. **Bayer, R., & McCreight, E.** (1972). Organization and maintenance of large ordered indices. *Acta Informatica*, 1(3), 173–189.
3. **Sleator, D. D., & Tarjan, R. E.** (1985). Self-adjusting binary search trees. *Journal of the ACM (JACM)*, 32(3), 652–686.
