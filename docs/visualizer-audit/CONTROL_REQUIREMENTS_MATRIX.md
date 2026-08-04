# Algo Flow — Visualizer Control Requirements Matrix

Date: **2026-08-04**
Total Visualizers: **104**

## 1. Global Controls Specification

Every published visualizer workspace features the unified global playback control bar:
- **Playback Actions**: Play, Pause, Previous Step, Next Step, Restart, Jump to First, Jump to Last
- **Timeline Navigation**: Scrubber / Step Slider with step count indicator (`Step X / Y`)
- **Speed Control**: Single unified playback speed slider (0.5x, 1x, 1.5x, 2x)
- **Accessibility**: Keyboard shortcuts (Space = Play/Pause, Left/Right = Prev/Next step), tooltips, and ARIA labels

## 2. Visualizer-Specific Control Requirements Matrix

| Category | Input Controls Component | Required Operations & Custom Input Fields |
|---|---|---|
| **Array** | `ArrayInputControls` | Custom array input, size slider, random generator, sorted preset, reverse preset, target value (search), index & value (insert/update), rotation k |
| **Stack** | `StackInputControls` | Initial stack values, capacity limit, push value input, overflow test trigger, underflow test trigger |
| **Queue** | `QueueInputControls` | Initial queue values, capacity limit, enqueue value input, circular queue wrap-around toggle, front/rear indicators |
| **Linked List** | `LinkedListInputControls` | Node values string, insert value, position/index, head/tail selector, list type (Singly/Doubly/Circular), custom cycle entry index |
| **Tree** | `TreeInputControls` | Custom node tree values, BST insert value, BST search target, heap type toggle, trie word input, segment tree array input |
| **Graph** | `GraphInputControls` | Node editor, edge list editor, start node selector, directed/undirected toggle, deterministic neighbor order toggle |
| **Hash Table** | `HashTableInputControls` | Table size (capacity), key input, value input, collision strategy toggle (Linear Probing / Separate Chaining), tombstone display, rehash trigger |
| **Hash Set** | `HashSetInputControls` | Key input, Set A input, Set B input, Insert/Search/Delete controls, Union/Intersection mode toggle |
| **Matrix** | `MatrixInputControls` | Rows slider, Cols slider, editable grid inputs, Matrix A & B inputs (addition/subtraction/multiplication), compatible dimension validation, search target |
| **String** | `StringInputControls` | Text string input, pattern substring input, character input, replacement char, index input, case toggle |

## 3. Per-Visualizer Control Compliance

| # | Slug | Category | Global Controls | Specific Controls | Input Validation |
|---|---|---|---|---|---|
| 1 | `access-by-index` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 2 | `random-access` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 3 | `forward-traversal` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 4 | `reverse-traversal` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 5 | `range-traversal` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 6 | `insert-beginning` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 7 | `insert-end` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 8 | `insert-index` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 9 | `delete-beginning` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 10 | `delete-end` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 11 | `delete-index` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 12 | `delete-value` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 13 | `update-by-index` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 14 | `update-by-value` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 15 | `merge-sorted-arrays` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 16 | `reverse-array` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 17 | `left-rotation` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 18 | `right-rotation` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 19 | `remove-duplicates` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 20 | `linear-search` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 21 | `binary-search` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 22 | `jump-search` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 23 | `interpolation-search` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 24 | `bubble-sort` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 25 | `selection-sort` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 26 | `insertion-sort` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 27 | `merge-sort` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 28 | `quick-sort` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 29 | `heap-sort` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 30 | `counting-sort` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 31 | `radix-sort` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 32 | `stack-push` | STACK | ✅ Full | ✅ Configured | ✅ Validated |
| 33 | `stack-pop` | STACK | ✅ Full | ✅ Configured | ✅ Validated |
| 34 | `sll-traversal` | LINKED LIST | ✅ Full | ✅ Configured | ✅ Validated |
| 35 | `sll-search` | LINKED LIST | ✅ Full | ✅ Configured | ✅ Validated |
| 36 | `sll-insert-head` | LINKED LIST | ✅ Full | ✅ Configured | ✅ Validated |
| 37 | `sll-insert-tail` | LINKED LIST | ✅ Full | ✅ Configured | ✅ Validated |
| 38 | `sll-delete` | LINKED LIST | ✅ Full | ✅ Configured | ✅ Validated |
| 39 | `inorder-traversal` | TREE | ✅ Full | ✅ Configured | ✅ Validated |
| 40 | `preorder-traversal` | TREE | ✅ Full | ✅ Configured | ✅ Validated |
| 41 | `postorder-traversal` | TREE | ✅ Full | ✅ Configured | ✅ Validated |
| 42 | `level-order-traversal` | TREE | ✅ Full | ✅ Configured | ✅ Validated |
| 43 | `bst-insertion` | TREE | ✅ Full | ✅ Configured | ✅ Validated |
| 44 | `bst-search` | TREE | ✅ Full | ✅ Configured | ✅ Validated |
| 45 | `bfs` | GRAPH | ✅ Full | ✅ Configured | ✅ Validated |
| 46 | `dfs` | GRAPH | ✅ Full | ✅ Configured | ✅ Validated |
| 47 | `chaining-insert` | HASH TABLE | ✅ Full | ✅ Configured | ✅ Validated |
| 48 | `chaining-search` | HASH TABLE | ✅ Full | ✅ Configured | ✅ Validated |
| 49 | `chaining-delete` | HASH TABLE | ✅ Full | ✅ Configured | ✅ Validated |
| 50 | `probing-insert` | HASH TABLE | ✅ Full | ✅ Configured | ✅ Validated |
| 51 | `probing-search` | HASH TABLE | ✅ Full | ✅ Configured | ✅ Validated |
| 52 | `probing-delete` | HASH TABLE | ✅ Full | ✅ Configured | ✅ Validated |
| 53 | `row-wise-traversal` | MATRIX | ✅ Full | ✅ Configured | ✅ Validated |
| 54 | `col-wise-traversal` | MATRIX | ✅ Full | ✅ Configured | ✅ Validated |
| 55 | `matrix-search` | MATRIX | ✅ Full | ✅ Configured | ✅ Validated |
| 56 | `spiral-traversal` | MATRIX | ✅ Full | ✅ Configured | ✅ Validated |
| 57 | `row-column-sorted-search` | MATRIX | ✅ Full | ✅ Configured | ✅ Validated |
| 58 | `transpose-matrix` | MATRIX | ✅ Full | ✅ Configured | ✅ Validated |
| 59 | `rotate-matrix-90` | MATRIX | ✅ Full | ✅ Configured | ✅ Validated |
| 60 | `matrix-multiplication` | MATRIX | ✅ Full | ✅ Configured | ✅ Validated |
| 61 | `matrix-addition` | MATRIX | ✅ Full | ✅ Configured | ✅ Validated |
| 62 | `matrix-subtraction` | MATRIX | ✅ Full | ✅ Configured | ✅ Validated |
| 63 | `string-forward-traversal` | STRING | ✅ Full | ✅ Configured | ✅ Validated |
| 64 | `string-reverse-traversal` | STRING | ✅ Full | ✅ Configured | ✅ Validated |
| 65 | `string-palindrome` | STRING | ✅ Full | ✅ Configured | ✅ Validated |
| 66 | `string-naive-search` | STRING | ✅ Full | ✅ Configured | ✅ Validated |
| 67 | `string-kmp-search` | STRING | ✅ Full | ✅ Configured | ✅ Validated |
| 68 | `string-rabin-karp` | STRING | ✅ Full | ✅ Configured | ✅ Validated |
| 69 | `reverse-string` | STRING | ✅ Full | ✅ Configured | ✅ Validated |
| 70 | `string-insert` | STRING | ✅ Full | ✅ Configured | ✅ Validated |
| 71 | `string-delete` | STRING | ✅ Full | ✅ Configured | ✅ Validated |
| 72 | `string-replace` | STRING | ✅ Full | ✅ Configured | ✅ Validated |
| 73 | `string-change-case` | STRING | ✅ Full | ✅ Configured | ✅ Validated |
| 74 | `access` | ARRAY | ✅ Full | ✅ Configured | ✅ Validated |
| 75 | `array-stack` | STACK | ✅ Full | ✅ Configured | ✅ Validated |
| 76 | `stack-peek` | STACK | ✅ Full | ✅ Configured | ✅ Validated |
| 77 | `stack-is-empty` | STACK | ✅ Full | ✅ Configured | ✅ Validated |
| 78 | `stack-is-full` | STACK | ✅ Full | ✅ Configured | ✅ Validated |
| 79 | `stack-size` | STACK | ✅ Full | ✅ Configured | ✅ Validated |
| 80 | `simple-queue` | QUEUE | ✅ Full | ✅ Configured | ✅ Validated |
| 81 | `circular-queue` | QUEUE | ✅ Full | ✅ Configured | ✅ Validated |
| 82 | `queue-enqueue` | QUEUE | ✅ Full | ✅ Configured | ✅ Validated |
| 83 | `queue-dequeue` | QUEUE | ✅ Full | ✅ Configured | ✅ Validated |
| 84 | `queue-peek` | QUEUE | ✅ Full | ✅ Configured | ✅ Validated |
| 85 | `queue-front-rear` | QUEUE | ✅ Full | ✅ Configured | ✅ Validated |
| 86 | `linked-list-types` | LINKED LIST | ✅ Full | ✅ Configured | ✅ Validated |
| 87 | `sll-insert-position` | LINKED LIST | ✅ Full | ✅ Configured | ✅ Validated |
| 88 | `sll-delete-head` | LINKED LIST | ✅ Full | ✅ Configured | ✅ Validated |
| 89 | `sll-reverse` | LINKED LIST | ✅ Full | ✅ Configured | ✅ Validated |
| 90 | `sll-detect-cycle` | LINKED LIST | ✅ Full | ✅ Configured | ✅ Validated |
| 91 | `heap-insert` | TREE | ✅ Full | ✅ Configured | ✅ Validated |
| 92 | `trie-insert-word` | TREE | ✅ Full | ✅ Configured | ✅ Validated |
| 93 | `build-segment-tree` | TREE | ✅ Full | ✅ Configured | ✅ Validated |
| 94 | `division-hash-method` | HASH TABLE | ✅ Full | ✅ Configured | ✅ Validated |
| 95 | `hash-insert` | HASH TABLE | ✅ Full | ✅ Configured | ✅ Validated |
| 96 | `hash-search` | HASH TABLE | ✅ Full | ✅ Configured | ✅ Validated |
| 97 | `hash-delete` | HASH TABLE | ✅ Full | ✅ Configured | ✅ Validated |
| 98 | `linear-probing` | HASH TABLE | ✅ Full | ✅ Configured | ✅ Validated |
| 99 | `rehashing` | HASH TABLE | ✅ Full | ✅ Configured | ✅ Validated |
| 100 | `hash-set-insert` | HASH SET | ✅ Full | ✅ Configured | ✅ Validated |
| 101 | `hash-set-search` | HASH SET | ✅ Full | ✅ Configured | ✅ Validated |
| 102 | `hash-set-delete` | HASH SET | ✅ Full | ✅ Configured | ✅ Validated |
| 103 | `set-union` | HASH SET | ✅ Full | ✅ Configured | ✅ Validated |
| 104 | `set-intersection` | HASH SET | ✅ Full | ✅ Configured | ✅ Validated |
