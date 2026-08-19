# Algo Flow — Core Algorithm Logic & Oracle Audit Report

Audit Date: **2026-08-19**
Total Visualizers Audited: **133**

## 1. Executive Summary

All published visualizers in Algo Flow have been audited against pure independent reference algorithm implementations. Every visualizer implementation generates valid, deterministic visual steps whose final data state matches the oracle expected result.

## 2. Invariant Specifications by Category

### ARRAY

- ✅ Result matches pure reference output (sorted order, array reversal, rotation k-shift).
- ✅ Preserves element count and values (permutation invariant).
- ✅ Handles single-element and duplicate input arrays without crashing or infinite loops.
- ✅ Index bounds are strictly maintained; no out-of-bound access.

### STACK

- ✅ Strict LIFO (Last-In First-Out) push/pop ordering.
- ✅ Capacity overflow and underflow conditions set step actionType to overflow/underflow or error.
- ✅ Top pointer correctly tracks the current top element index.
- ✅ Element stack depth stays within [0, capacity].

### QUEUE

- ✅ Strict FIFO (First-In First-Out) enqueue/dequeue ordering.
- ✅ Front and rear pointers correctly wrap around in circular queue mode.
- ✅ Queue element count calculation accurately accounts for pointer wrap-around.
- ✅ Overflow and underflow states correctly handled.

### LINKED LIST

- ✅ Head and tail pointer integrity preserved across operations.
- ✅ No node is orphaned or lost during insertion/deletion.
- ✅ Reversal flips all next pointers and updates head/tail references.
- ✅ Floyds cycle detection moves slow (1 step) and fast (2 steps) pointers deterministically.

### TREE

- ✅ BST invariant (left < root < right) maintained on insertion and search.
- ✅ Traversal orders (Inorder, Preorder, Postorder, Level-order) match mathematical definitions.
- ✅ Heap insertion bubbles upward to maintain max/min-heap property.
- ✅ Trie insertion builds character paths and marks end-of-word nodes.

### GRAPH

- ✅ BFS uses FIFO queue to explore nodes level-by-level.
- ✅ DFS uses LIFO stack/recursion to explore branches to maximum depth.
- ✅ Visited set prevents revisiting nodes and infinite loops in cyclic graphs.
- ✅ Neighbor node exploration follows deterministic adjacency list ordering.

### HASH TABLE

- ✅ Hash function key % size correctly computes bucket index for non-negative integers.
- ✅ Linear probing sequence checks consecutive slots (index + i) % size.
- ✅ Separate chaining appends entries to list buckets at target index.
- ✅ Tombstones (DELETED markers) preserve search chains on deletion.
- ✅ Rehashing doubles table capacity and re-indexes all existing keys when load factor threshold is reached.

### HASH SET

- ✅ Uniqueness invariant enforced: inserting duplicate keys is a no-op.
- ✅ Contains/Search correctly queries probing or bucket chains.
- ✅ Set Union and Intersection correctly construct union and shared-element sets.

### MATRIX

- ✅ Row and column bounds enforced for 2D cell grids.
- ✅ Row-wise, column-wise, and spiral traversals visit all cells in exact order.
- ✅ Transpose swaps matrix[i][j] with matrix[j][i].
- ✅ Matrix 90-degree rotation transposes then reverses rows.
- ✅ Matrix arithmetic and multiplication validate dimension compatibility.

### STRING

- ✅ Forward and reverse traversals visit characters in 0..n-1 and n-1..0 order.
- ✅ Palindrome check uses two pointers moving inward to compare characters.
- ✅ Naive search checks pattern windows across text.
- ✅ KMP search constructs valid LPS array and skips redundant comparisons.
- ✅ Rabin-Karp search computes rolling hash and confirms candidate matches.

## 3. Visualizer Correctness Verification Matrix

| # | Slug | Category | Algorithm Name | Oracle Test Status | Step Generation | Invariant Checks |
|---|---|---|---|---|---|---|
| 1 | `access-by-index` | ARRAY | Access by Index | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 2 | `random-access` | ARRAY | Random Access | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 3 | `forward-traversal` | ARRAY | Forward Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 4 | `reverse-traversal` | ARRAY | Reverse Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 5 | `range-traversal` | ARRAY | Range Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 6 | `insert-beginning` | ARRAY | Insert at Beginning | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 7 | `insert-end` | ARRAY | Insert at End | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 8 | `insert-index` | ARRAY | Insert at Index | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 9 | `delete-beginning` | ARRAY | Delete from Beginning | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 10 | `delete-end` | ARRAY | Delete from End | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 11 | `delete-index` | ARRAY | Delete at Index | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 12 | `delete-value` | ARRAY | Delete by Value | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 13 | `update-by-index` | ARRAY | Update by Index | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 14 | `update-by-value` | ARRAY | Update by Value | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 15 | `merge-sorted-arrays` | ARRAY | Merge Sorted Arrays | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 16 | `reverse-array` | ARRAY | Reverse Array | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 17 | `left-rotation` | ARRAY | Left Rotation | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 18 | `right-rotation` | ARRAY | Right Rotation | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 19 | `remove-duplicates` | ARRAY | Remove Duplicates | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 20 | `linear-search` | ARRAY | Linear Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 21 | `binary-search` | ARRAY | Binary Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 22 | `jump-search` | ARRAY | Jump Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 23 | `interpolation-search` | ARRAY | Interpolation Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 24 | `bubble-sort` | ARRAY | Bubble Sort | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 25 | `selection-sort` | ARRAY | Selection Sort | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 26 | `insertion-sort` | ARRAY | Insertion Sort | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 27 | `merge-sort` | ARRAY | Merge Sort | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 28 | `quick-sort` | ARRAY | Quick Sort | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 29 | `heap-sort` | ARRAY | Heap Sort | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 30 | `counting-sort` | ARRAY | Counting Sort | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 31 | `radix-sort` | ARRAY | Radix Sort | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 32 | `stack-push` | STACK | Push Operation | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 33 | `stack-pop` | STACK | Pop Operation | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 34 | `sll-traversal` | LINKED LIST | Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 35 | `sll-search` | LINKED LIST | Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 36 | `sll-insert-head` | LINKED LIST | Insert at Head | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 37 | `sll-insert-tail` | LINKED LIST | Insert at Tail | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 38 | `sll-delete` | LINKED LIST | Delete by Value | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 39 | `inorder-traversal` | TREE | Inorder Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 40 | `preorder-traversal` | TREE | Preorder Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 41 | `postorder-traversal` | TREE | Postorder Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 42 | `level-order-traversal` | TREE | Level Order Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 43 | `bst-insertion` | TREE | BST Insertion | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 44 | `bst-search` | TREE | BST Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 45 | `bfs` | GRAPH | Breadth-First Search (BFS) | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 46 | `dfs` | GRAPH | Depth-First Search (DFS) | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 47 | `dijkstra` | GRAPH | Dijkstra's Algorithm | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 48 | `bellman-ford` | GRAPH | Bellman-Ford Algorithm | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 49 | `kruskal` | GRAPH | Kruskal's MST | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 50 | `prim` | GRAPH | Prim's MST | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 51 | `topological-sort` | GRAPH | Topological Sort | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 52 | `detect-cycle-graph` | GRAPH | Cycle Detection in Graph | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 53 | `connected-components` | GRAPH | Connected Components | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 54 | `chaining-insert` | HASH TABLE | Separate Chaining - Insert | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 55 | `chaining-search` | HASH TABLE | Separate Chaining - Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 56 | `chaining-delete` | HASH TABLE | Separate Chaining - Delete | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 57 | `probing-insert` | HASH TABLE | Linear Probing - Insert | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 58 | `probing-search` | HASH TABLE | Linear Probing - Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 59 | `probing-delete` | HASH TABLE | Linear Probing - Delete | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 60 | `row-wise-traversal` | MATRIX | Row-wise Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 61 | `col-wise-traversal` | MATRIX | Column-wise Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 62 | `matrix-search` | MATRIX | Matrix Linear Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 63 | `spiral-traversal` | MATRIX | Spiral Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 64 | `row-column-sorted-search` | MATRIX | Row-column Sorted Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 65 | `transpose-matrix` | MATRIX | Transpose Matrix | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 66 | `rotate-matrix-90` | MATRIX | Rotate Matrix 90 Degrees | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 67 | `matrix-multiplication` | MATRIX | Matrix Multiplication | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 68 | `matrix-addition` | MATRIX | Matrix Addition | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 69 | `matrix-subtraction` | MATRIX | Matrix Subtraction | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 70 | `string-forward-traversal` | STRING | Forward Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 71 | `string-reverse-traversal` | STRING | Reverse Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 72 | `string-palindrome` | STRING | Palindrome Check | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 73 | `string-naive-search` | STRING | Naive Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 74 | `string-kmp-search` | STRING | KMP Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 75 | `string-rabin-karp` | STRING | Rabin-Karp Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 76 | `reverse-string` | STRING | Reverse String | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 77 | `string-insert` | STRING | Insert Character | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 78 | `string-delete` | STRING | Delete Character | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 79 | `string-replace` | STRING | Replace Character | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 80 | `string-change-case` | STRING | Change Case | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 81 | `access` | ARRAY | Access Element | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 82 | `array-stack` | STACK | Array Stack | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 83 | `stack-peek` | STACK | Peek / Top | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 84 | `stack-is-empty` | STACK | isEmpty | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 85 | `stack-is-full` | STACK | isFull | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 86 | `stack-size` | STACK | Stack Size | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 87 | `simple-queue` | QUEUE | Simple Queue | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 88 | `circular-queue` | QUEUE | Circular Queue Wrap-around | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 89 | `queue-enqueue` | QUEUE | Enqueue | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 90 | `queue-dequeue` | QUEUE | Dequeue | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 91 | `queue-peek` | QUEUE | Peek | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 92 | `queue-front-rear` | QUEUE | Front and Rear | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 93 | `linked-list-types` | LINKED LIST | Singly, Doubly, and Circular Lists | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 94 | `sll-insert-position` | LINKED LIST | Insert at Position | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 95 | `sll-delete-head` | LINKED LIST | Delete Head | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 96 | `sll-reverse` | LINKED LIST | Reverse Linked List | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 97 | `sll-detect-cycle` | LINKED LIST | Detect Cycle | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 98 | `sll-delete-tail` | LINKED LIST | Delete Tail | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 99 | `sll-find-middle` | LINKED LIST | Find Middle Node | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 100 | `sll-remove-duplicates` | LINKED LIST | Remove Duplicates | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 101 | `dll-traversal` | DOUBLY LINKED LIST | DLL Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 102 | `dll-insert-head` | DOUBLY LINKED LIST | DLL Insert Head | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 103 | `dll-insert-tail` | DOUBLY LINKED LIST | DLL Insert Tail | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 104 | `dll-delete-head` | DOUBLY LINKED LIST | DLL Delete Head | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 105 | `dll-delete-tail` | DOUBLY LINKED LIST | DLL Delete Tail | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 106 | `dll-reverse` | DOUBLY LINKED LIST | DLL Reverse | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 107 | `cll-traversal` | CIRCULAR LINKED LIST | CLL Traversal | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 108 | `cll-insert-head` | CIRCULAR LINKED LIST | CLL Insert Head | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 109 | `cll-insert-tail` | CIRCULAR LINKED LIST | CLL Insert Tail | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 110 | `cll-delete-head` | CIRCULAR LINKED LIST | CLL Delete Head | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 111 | `deque-push-front` | QUEUE | Deque Push Front | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 112 | `deque-pop-rear` | QUEUE | Deque Pop Rear | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 113 | `priority-queue-enqueue` | QUEUE | Priority Queue Enqueue | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 114 | `priority-queue-dequeue` | QUEUE | Priority Queue Dequeue | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 115 | `heap-insert` | TREE | Heap Insert | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 116 | `trie-insert-word` | TREE | Trie Insert Word | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 117 | `build-segment-tree` | TREE | Build Segment Tree | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 118 | `bst-deletion` | TREE | BST Deletion | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 119 | `avl-rotations` | TREE | AVL Rotations | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 120 | `heap-extract-max` | TREE | Heap Extract Max | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 121 | `heapify` | TREE | Heapify | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 122 | `trie-search` | TREE | Trie Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 123 | `division-hash-method` | HASH TABLE | Division Hash Method | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 124 | `hash-insert` | HASH TABLE | Hash Insert | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 125 | `hash-search` | HASH TABLE | Hash Search | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 126 | `hash-delete` | HASH TABLE | Hash Delete | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 127 | `linear-probing` | HASH TABLE | Linear Probing | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 128 | `rehashing` | HASH TABLE | Rehashing | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 129 | `hash-set-insert` | HASH SET | Insert | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 130 | `hash-set-search` | HASH SET | Search / Contains | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 131 | `hash-set-delete` | HASH SET | Delete | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 132 | `set-union` | HASH SET | Set Union | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |
| 133 | `set-intersection` | HASH SET | Set Intersection | ✅ PASS | ✅ Valid (steps generated) | ✅ Verified |


## 4. Conclusion & Verification Summary

- **133 / 133** Published Visualizers passed pure reference oracle validation.
- **0** Core logic defects remaining.
- Unit test suite `tests/oracle-comparison.test.ts` and `tests/visualizer-step-invariants.test.ts` pass 100%.
