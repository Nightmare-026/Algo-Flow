# Part 11: Problem Bank — Volume 04: Trees, BSTs, Heaps & Tries (100 Problems)

> **Problems Covered:** Q241 to Q340  
> **Patterns:** Binary Tree DFS/BFS &bull; Subtree Metrics &bull; Lowest Common Ancestor &bull; BST Invariants &bull; Dual-Heap Median &bull; Top-K Patterns &bull; Prefix Tries &bull; 0-1 Bitwise Tries &bull; Segment Trees & Fenwick Trees &bull; Tree Decompositions

---

## Section 1: Binary Tree Fundamentals & Traversals (Q241 – Q265)

#### Q241: Maximum Depth of Binary Tree
- **Difficulty:** `[Easy]` | **Pattern:** `[Postorder Tree Height]`
- **Statement:** Find maximum depth (number of nodes along longest path from root to leaf).
- **Optimal Approach:** Bottom-up DFS: `1 + max(maxDepth(root.left), maxDepth(root.right))`.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Empty tree (depth 0), single-node tree (depth 1).

#### Q242: Minimum Depth of Binary Tree
- **Difficulty:** `[Easy]` | **Pattern:** `[BFS Level Order / Leaf Check]`
- **Statement:** Find minimum depth to any leaf node.
- **Optimal Approach:** BFS level by level. Return depth immediately when first node with `left == NULL && right == NULL` is dequeued.
- **Complexity:** Time: $O(n)$ | Space: $O(W)$
- **Edge Cases:** Degenerate tree (skewed line): must not treat null side as depth 0.

#### Q243: Invert Binary Tree
- **Difficulty:** `[Easy]` | **Pattern:** `[Postorder Child Swap]`
- **Statement:** Invert a binary tree (swap left and right child of every node).
- **Optimal Approach:** Recursively invert left and right subtrees, then swap `root.left` with `root.right`.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Empty tree.

#### Q244: Same Tree
- **Difficulty:** `[Easy]` | **Pattern:** `[Dual Tree DFS Preorder]`
- **Statement:** Check if two binary trees are structurally identical and have identical values.
- **Optimal Approach:** If both null, return `true`. If one null or values differ, return `false`. Recurse left and right.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** One tree empty and the other non-empty.

#### Q245: Symmetric Tree
- **Difficulty:** `[Easy]` | **Pattern:** `[Mirror Dual Tree DFS]`
- **Statement:** Check whether a binary tree is a mirror image of itself.
- **Optimal Approach:** Helper `isMirror(t1, t2)`. Verify `t1.val == t2.val`, then recurse `isMirror(t1.left, t2.right)` and `isMirror(t1.right, t2.left)`.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Single node (symmetric).

#### Q246: Diameter of Binary Tree
- **Difficulty:** `[Easy]` | **Pattern:** `[Postorder Subtree Heights]`
- **Statement:** Find length of longest path between any two nodes in a tree (path may or may not pass through root).
- **Optimal Approach:** At each node, diameter passing through node is `leftHeight + rightHeight`. Update global max diameter, return `1 + max(leftHeight, rightHeight)`.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Diameter entirely contained within one subtree.

#### Q247: Balanced Binary Tree
- **Difficulty:** `[Easy]` | **Pattern:** `[Bottom-Up Height Checking]`
- **Statement:** Determine if tree is height-balanced (height of subtrees of every node differs by $\le 1$).
- **Optimal Approach:** Postorder traversal returning height. If $|leftHeight - rightHeight| > 1$ or any subtree returns $-1$ (unbalanced), return $-1$.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Single node, linked-list-like degenerate tree.

#### Q248: Path Sum
- **Difficulty:** `[Easy]` | **Pattern:** `[Top-Down DFS Target Subtraction]`
- **Statement:** Return `true` if root-to-leaf path exists summing to `targetSum`.
- **Optimal Approach:** Subtract `root.val` from target. At leaf (`left == NULL && right == NULL`), return `target == 0`.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Target sum zero, negative node values.

#### Q249: Path Sum II
- **Difficulty:** `[Medium]` | **Pattern:** `[Backtracking Path DFS]`
- **Statement:** Return all root-to-leaf paths that sum to `targetSum`.
- **Optimal Approach:** DFS maintaining current path. Append `root.val`, recurse. At valid leaf, clone path into results. Backtrack (pop last node).
- **Complexity:** Time: $O(n \cdot h)$ | Space: $O(h)$
- **Edge Cases:** Multiple valid paths, negative values.

#### Q250: Path Sum III
- **Difficulty:** `[Medium]` | **Pattern:** `[Prefix Sum Hash Map on Trees]`
- **Statement:** Count paths summing to `targetSum` (paths do not need to start at root or end at leaf).
- **Optimal Approach:** Hash map stores `{prefixSum: count}`. At each node, add `map[currentSum - targetSum]` to answer. Backtrack (decrement `map[currentSum]`) on return.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Large sum causing 32-bit integer overflow (use 64-bit int).

#### Q251: Binary Tree Maximum Path Sum
- **Difficulty:** `[Hard]` | **Pattern:** `[Postorder Max Gain]`
- **Statement:** Find maximum path sum between any two nodes in a binary tree.
- **Optimal Approach:** Helper returns max gain node can contribute to parent: `node.val + max(0, max(leftGain, rightGain))`. Global max updated with `node.val + max(0, leftGain) + max(0, rightGain)`.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** All negative node values (returns maximum single node value).

#### Q252: Lowest Common Ancestor of a Binary Tree
- **Difficulty:** `[Medium]` | **Pattern:** `[Postorder Subtree LCA]`
- **Statement:** Find Lowest Common Ancestor (LCA) of nodes $p$ and $q$.
- **Optimal Approach:** If `root == NULL || root == p || root == q`, return `root`. Recurse left and right. If both return non-null, `root` is LCA; else return non-null child.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** $p$ is ancestor of $q$ (returns $p$).

#### Q253: Lowest Common Ancestor of Deepest Leaves
- **Difficulty:** `[Medium]` | **Pattern:** `[Postorder Depth Matching]`
- **Statement:** Find LCA of all deepest leaves in the tree.
- **Optimal Approach:** Postorder returning `(depth, lcaNode)`. If `leftDepth == rightDepth`, current node is LCA; else return result of deeper subtree.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Only one deepest leaf (returns that leaf).

#### Q254: Binary Tree Level Order Traversal
- **Difficulty:** `[Medium]` | **Pattern:** `[Queue BFS Level Batching]`
- **Statement:** Return level-by-level node values left to right.
- **Optimal Approach:** Queue initialized with root. In loop, get `levelSize = queue.size()`. Dequeue `levelSize` nodes into list, enqueue children.
- **Complexity:** Time: $O(n)$ | Space: $O(W)$
- **Edge Cases:** Empty tree.

#### Q255: Binary Tree Zigzag Level Order Traversal
- **Difficulty:** `[Medium]` | **Pattern:** `[BFS + Direction Toggle]`
- **Statement:** Level order traversal alternating left-to-right and right-to-left.
- **Optimal Approach:** Standard BFS with boolean `leftToRight`. Populate each level array using direct index placement based on flag.
- **Complexity:** Time: $O(n)$ | Space: $O(W)$
- **Edge Cases:** Single level tree.

#### Q256: Binary Tree Right Side View
- **Difficulty:** `[Medium]` | **Pattern:** `[BFS Last in Level / Preorder Right-First]`
- **Statement:** Return values of nodes visible when looking at tree from the right side.
- **Optimal Approach:** Reverse preorder traversal (`Root -> Right -> Left`) tracking depth. When `depth == result.size()`, append `root.val`.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Left subtree deeper than right subtree.

#### Q257: Vertical Order Traversal of a Binary Tree
- **Difficulty:** `[Hard]` | **Pattern:** `[Coordinate BFS + Multi-key Sorting]`
- **Statement:** Traverse tree by column, sorting by `(col, row, value)`.
- **Optimal Approach:** BFS recording tuples `(col, row, value)`. Group by column into sorted map, sort each column by row then value.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Overlapping nodes at identical `(col, row)`.

#### Q258: Boundary of Binary Tree
- **Difficulty:** `[Medium]` | **Pattern:** `[Three-Stage Perimeter DFS]`
- **Statement:** Return anti-clockwise boundary nodes: left boundary, all leaves, right boundary in reverse.
- **Optimal Approach:** Collect root. Traverse left boundary top-down excluding leaves. DFS to collect all leaves. Traverse right boundary bottom-up.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Tree with no left child or no right child.

#### Q259: All Nodes Distance K in Binary Tree
- **Difficulty:** `[Medium]` | **Pattern:** `[Tree to Graph + BFS]`
- **Statement:** Return all nodes at distance $k$ from `target` node.
- **Optimal Approach:** DFS to populate `parent` map for every node. Run BFS outward from `target` traversing left, right, and parent pointers up to distance $k$.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** $k = 0$ (returns `[target.val]`), $k > \text{height}$.

#### Q260: Construct Binary Tree from Preorder and Inorder Traversal
- **Difficulty:** `[Medium]` | **Pattern:** `[Recursive Range Splitting + Hash Map]`
- **Statement:** Reconstruct binary tree given preorder and inorder traversals.
- **Optimal Approach:** First element in preorder is root. Find root in inorder using hash map. Left of root in inorder is left subtree; right is right subtree.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Single node tree.

#### Q261: Construct Binary Tree from Inorder and Postorder Traversal
- **Difficulty:** `[Medium]` | **Pattern:** `[Recursive Range Splitting from End]`
- **Statement:** Reconstruct binary tree given inorder and postorder traversals.
- **Optimal Approach:** Last element in postorder is root. Locate root in inorder map. Recurse right subtree first, then left subtree.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Degenerate single-branch tree.

#### Q262: Serialize and Deserialize Binary Tree
- **Difficulty:** `[Hard]` | **Pattern:** `[Preorder BFS Sentinel String]`
- **Statement:** Design algorithm to serialize binary tree to string and deserialize back.
- **Optimal Approach:** BFS or Preorder DFS with `"#" ` or `"null"` for null pointers and comma delimiters. Deserializer reads tokens recursively.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Empty tree serialized as `"#"` or `""`.

#### Q263: Flatten Binary Tree to Linked List
- **Difficulty:** `[Medium]` | **Pattern:** `[Morris Predecessor Splicing]`
- **Statement:** Flatten tree into pre-order "linked list" using `right` pointers in-place with $O(1)$ space.
- **Optimal Approach:** While `curr != NULL`: if `curr.left != NULL`, find rightmost node of left subtree (`pred`), attach `curr.right` to `pred.right`, move `curr.left` to `curr.right`, set `curr.left = NULL`. Advance `curr = curr.right`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Tree already flat.

#### Q264: Populating Next Right Pointers in Each Node
- **Difficulty:** `[Medium]` | **Pattern:** `[Level-by-Level Pointer Wiring in O(1) Space]`
- **Statement:** Populate `next` pointer of each node to its right neighbor for perfect binary tree in $O(1)$ space.
- **Optimal Approach:** Traverse level $N$ while wiring level $N+1$: `curr.left.next = curr.right`, and `curr.right.next = curr.next.left` (if `curr.next` exists).
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Single node tree.

#### Q265: Morris Inorder Traversal
- **Difficulty:** `[Medium]` | **Pattern:** `[Threaded Binary Tree Simulation]`
- **Statement:** Perform Inorder Traversal in $O(n)$ time and strictly $O(1)$ auxiliary space.
- **Optimal Approach:** Find inorder predecessor `pred`. If `pred.right == NULL`, create thread `pred.right = curr` and move `curr = curr.left`. Else sever thread, print `curr.val`, move `curr = curr.right`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Tree with no left subtrees (standard right traversal).

---

## Section 2: Binary Search Trees & Self-Balancing Trees (Q266 – Q290)

#### Q266: Validate Binary Search Tree
- **Difficulty:** `[Medium]` | **Pattern:** `[Range Invariant DFS]`
- **Statement:** Return `true` if binary tree satisfies strict BST property.
- **Optimal Approach:** Helper `validate(node, minVal, maxVal)`. Ensure $minVal < node.val < maxVal$. Recurse left with upper bound $node.val$, right with lower bound $node.val$.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Node values equal to `INT_MIN` or `INT_MAX` (use 64-bit int or null-box wrappers for bounds).

#### Q267: Lowest Common Ancestor of a Binary Search Tree
- **Difficulty:** `[Medium]` | **Pattern:** `[BST Search Divergence]`
- **Statement:** Find LCA of $p$ and $q$ in a BST in $O(h)$ time.
- **Optimal Approach:** Start at root. If both $p$ and $q$ are smaller, move left. If both are larger, move right. The first node where $p$ and $q$ diverge is their LCA!
- **Complexity:** Time: $O(h)$ | Space: $O(1)$ iterative
- **Edge Cases:** One node is the root itself.

#### Q268: Kth Smallest Element in a BST
- **Difficulty:** `[Medium]` | **Pattern:** `[Iterative Inorder Traversal]`
- **Statement:** Find $k$-th smallest element in a BST.
- **Optimal Approach:** Iterative Inorder traversal using stack. Decrement $k$ on each popped node; when $k = 0$, return popped node's value.
- **Complexity:** Time: $O(h + k)$ | Space: $O(h)$
- **Edge Cases:** $k = 1$ (leftmost node), $k = n$ (rightmost node).

#### Q269: Convert Sorted Array to Binary Search Tree
- **Difficulty:** `[Easy]` | **Pattern:** `[Divide and Conquer Midpoint]`
- **Statement:** Convert sorted ascending array into height-balanced BST.
- **Optimal Approach:** Choose `mid = (L + R) / 2` as root. Recursively construct left subtree from $A[L \dots mid - 1]$ and right from $A[mid + 1 \dots R]$.
- **Complexity:** Time: $O(n)$ | Space: $O(\log n)$
- **Edge Cases:** Even number of elements (choice of left or right mid valid).

#### Q270: Convert Sorted List to Binary Search Tree
- **Difficulty:** `[Medium]` | **Pattern:** `[Inorder Simulation with List Pointer]`
- **Statement:** Convert sorted linked list to balanced BST in $O(n)$ time and $O(\log n)$ space.
- **Optimal Approach:** Count length $n$. Recursively build left subtree of size $\lfloor n/2 \rfloor$, assign current list node to root, advance list pointer, build right subtree.
- **Complexity:** Time: $O(n)$ | Space: $O(\log n)$
- **Edge Cases:** Single-node list.

#### Q271: Delete Node in a BST
- **Difficulty:** `[Medium]` | **Pattern:** `[Three-Case BST Deletion]`
- **Statement:** Delete node with given key in BST.
- **Optimal Approach:** If key smaller, recurse left; if larger, recurse right. If key found: 0 children $\implies$ return null; 1 child $\implies$ return child; 2 children $\implies$ replace value with Inorder Successor, delete successor from right subtree.
- **Complexity:** Time: $O(h)$ | Space: $O(h)$
- **Edge Cases:** Deleting root node, deleting node with 2 children.

#### Q272: Insert into a Binary Search Tree
- **Difficulty:** `[Medium]` | **Pattern:** `[BST Search Placement]`
- **Statement:** Insert value into BST preserving order.
- **Optimal Approach:** Traverse down: if $val < curr.val$, go left (if null, attach new node); else go right.
- **Complexity:** Time: $O(h)$ | Space: $O(1)$ iterative
- **Edge Cases:** Inserting into empty tree (new node is root).

#### Q273: Inorder Successor in BST
- **Difficulty:** `[Medium]` | **Pattern:** `[BST Search with Candidate Tracking]`
- **Statement:** Find inorder successor of node $p$ in BST.
- **Optimal Approach:** If $p$ has right child, successor is leftmost node in right subtree. Else traverse from root: if $p.val < curr.val$, `successor = curr`, go left; else go right.
- **Complexity:** Time: $O(h)$ | Space: $O(1)$
- **Edge Cases:** $p$ is maximum element (successor is `NULL`).

#### Q274: Inorder Predecessor in BST
- **Difficulty:** `[Medium]` | **Pattern:** `[BST Search with Candidate Tracking]`
- **Statement:** Find inorder predecessor of node $p$ in BST.
- **Optimal Approach:** If $p$ has left child, predecessor is rightmost node in left subtree. Else traverse from root: if $p.val > curr.val$, `pred = curr`, go right; else go left.
- **Complexity:** Time: $O(h)$ | Space: $O(1)$
- **Edge Cases:** $p$ is minimum element (predecessor is `NULL`).

#### Q275: Binary Search Tree Iterator
- **Difficulty:** `[Medium]` | **Pattern:** `[Controlled Stack Inorder]`
- **Statement:** Implement iterator over BST with $O(1)$ average `next()` and $O(h)$ memory.
- **Optimal Approach:** Stack storing ancestors. In constructor, push all left children from root. On `next()`, pop node, push all left children of popped node's right child.
- **Complexity:** Time: $O(1)$ amortized | Space: $O(h)$
- **Edge Cases:** Tree with only right children.

#### Q276: Two Sum IV - Input is a BST
- **Difficulty:** `[Easy]` | **Pattern:** `[Dual BST Iterators (Two Pointers)]`
- **Statement:** Check if two nodes in BST sum to `target`.
- **Optimal Approach:** Run two BST iterators: one forward (smallest to largest) and one backward (largest to smallest). Apply two pointers on iterator outputs!
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Target sum requires using same node twice (prevented by iterator equality check).

#### Q277: Trim a Binary Search Tree
- **Difficulty:** `[Medium]` | **Pattern:** `[Recursive Pruning]`
- **Statement:** Trim BST so all elements lie in $[low, high]$.
- **Optimal Approach:** If `root.val < low`, entire left subtree is invalid; return `trim(root.right)`. If `root.val > high`, return `trim(root.left)`. Else trim both subtrees.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** All nodes trimmed out (returns `NULL`).

#### Q278: Recover Binary Search Tree
- **Difficulty:** `[Medium]` | **Pattern:** `[Morris Inorder Inversion Detection]`
- **Statement:** Exactly two nodes in a BST were swapped by mistake. Recover tree in $O(1)$ auxiliary space.
- **Optimal Approach:** Morris Inorder traversal tracking `prev`. First violation: $prev.val > curr.val \implies first = prev, second = curr$. Second violation: $second = curr$. Swap values of $first$ and $second$.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** The two swapped nodes are adjacent in inorder traversal.

#### Q279: Unique Binary Search Trees
- **Difficulty:** `[Medium]` | **Pattern:** `[Catalan Numbers DP]`
- **Statement:** Count structurally unique BSTs storing values $1 \dots n$.
- **Optimal Approach:** $G(n) = \sum_{i=1}^n G(i-1) \cdot G(n-i)$ (Catalan number $C_n = \frac{1}{n+1}\binom{2n}{n}$).
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** $n = 0, n = 1$ (result 1).

#### Q280: Balance a Binary Search Tree
- **Difficulty:** `[Medium]` | **Pattern:** `[Inorder Extraction + Midpoint Rebuild]`
- **Statement:** Convert unbalanced BST into balanced BST.
- **Optimal Approach:** Inorder traversal to extract sorted array of values. Recursively construct balanced BST from array using midpoint.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Completely degenerate linear tree.

#### Q281: Maximum Sum BST in Binary Tree
- **Difficulty:** `[Hard]` | **Pattern:** `[Postorder Subtree Validation Tuple]`
- **Statement:** Find maximum sum of all keys of any subtree that is also a valid BST.
- **Optimal Approach:** Postorder helper returns `(isBST, minVal, maxVal, sum)`. Current tree is BST iff left and right are BSTs and $left.max < node.val < right.min$.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** All negative node values (empty tree is valid BST with sum 0).

#### Q282: Count Complete Tree Nodes
- **Difficulty:** `[Medium]` | **Pattern:** `[Binary Search on Complete Tree Heights]`
- **Statement:** Count nodes in complete binary tree in strictly less than $O(n)$ time.
- **Optimal Approach:** Compute left depth $hl$ and right depth $hr$. If $hl == hr$, tree is perfect: return $2^{hl} - 1$. Else return $1 + count(left) + count(right)$.
- **Complexity:** Time: $O(\log^2 n)$ | Space: $O(\log n)$
- **Edge Cases:** Single node tree.

#### Q283: Range Sum of BST
- **Difficulty:** `[Easy]` | **Pattern:** `[BST Pruning DFS]`
- **Statement:** Return sum of values of all nodes with value in $[low, high]$.
- **Optimal Approach:** If $val < low$, search only right. If $val > high$, search only left. If inside range, add $val$ and search both sides.
- **Complexity:** Time: $O(k + h)$ where $k$ is nodes in range | Space: $O(h)$
- **Edge Cases:** No nodes in range.

#### Q284: Construct BST from Preorder Traversal
- **Difficulty:** `[Medium]` | **Pattern:** `[Upper Bound Recursive DFS]`
- **Statement:** Construct BST given its preorder traversal.
- **Optimal Approach:** Maintain index $i$ and upper bound $bound$. If current element exceeds $bound$, return null. Recurse left with bound $root.val$, right with $bound$.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Monotonically decreasing preorder (skewed left tree).

#### Q285: Check if Array Can Represent Preorder Traversal of BST
- **Difficulty:** `[Medium]` | **Pattern:** `[Monotonic Stack Lower Bound Tracking]`
- **Statement:** Check if array is valid preorder traversal of a BST in $O(n)$ time and $O(1)$ space.
- **Optimal Approach:** Monotonic decreasing stack. Maintain $lowBound$. If incoming element $< lowBound$, invalid. While stack top $< num$, pop and update $lowBound$.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Strictly decreasing array (valid).

#### Q286: All Elements in Two Binary Search Trees
- **Difficulty:** `[Medium]` | **Pattern:** `[Dual Inorder Iterators Merge]`
- **Statement:** Return sorted list containing all integers from two BSTs.
- **Optimal Approach:** Two iterative Inorder stacks. At each step, compare top elements of both stacks, pop the smaller, append to result.
- **Complexity:** Time: $O(n + m)$ | Space: $O(h_1 + h_2)$
- **Edge Cases:** One tree empty.

#### Q287: Closest Binary Search Tree Value
- **Difficulty:** `[Easy]` | **Pattern:** `[BST Search Binary Walk]`
- **Statement:** Find value in BST that is closest to target.
- **Optimal Approach:** Maintain `closest`. In loop: if $|val - target| < |closest - target|$, update `closest`. If $target < val$, go left; else go right.
- **Complexity:** Time: $O(h)$ | Space: $O(1)$
- **Edge Cases:** Target equidistant from two nodes (choose smaller per spec).

#### Q288: Unique Binary Search Trees II
- **Difficulty:** `[Medium]` | **Pattern:** `[Divide and Conquer BST Generation]`
- **Statement:** Generate all structurally unique BSTs storing values $1 \dots n$.
- **Optimal Approach:** Helper `generate(start, end)`. Pick each $i \in [start, end]$ as root. Generate all left subtrees from `[start, i-1]` and right subtrees from `[i+1, end]`. Cross-product combinations.
- **Complexity:** Time: $O(4^n / n^{1.5})$ | Space: $O(4^n / n^{1.5})$
- **Edge Cases:** $n = 1$.

#### Q289: Red-Black Tree Verification
- **Difficulty:** `[Hard]` | **Pattern:** `[Black-Height & Double-Red Verification]`
- **Statement:** Given binary tree with node colors, verify if all 5 RBT invariants hold.
- **Optimal Approach:** 1. Root must be Black. 2. DFS returns black-height; if red node has red child, fail. If black-heights of subtrees differ, fail.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Empty tree (valid).

#### Q290: Convert BST to Greater Tree
- **Difficulty:** `[Medium]` | **Pattern:** `[Reverse Inorder Accumulator]`
- **Statement:** Convert BST such that every key is updated to original key plus sum of all greater keys.
- **Optimal Approach:** Reverse Inorder traversal (`Right -> Root -> Left`). Maintain running sum, set `node.val += runningSum`, update `runningSum = node.val`.
- **Complexity:** Time: $O(n)$ | Space: $O(h)$
- **Edge Cases:** Single node tree.

---

## Section 3: Heaps & Priority Queues (Q291 – Q315)

#### Q291: Kth Largest Element in an Array
- **Difficulty:** `[Medium]` | **Pattern:** `[Min-Heap of Size K / QuickSelect]`
- **Statement:** Find $k$-th largest element in unsorted array.
- **Optimal Approach:** Maintain min-heap of size $k$. Push each element; if size $> k$, pop. Top of heap is $k$-th largest. (Alternatively QuickSelect in $O(n)$ average).
- **Complexity:** Time: $O(n \log k)$ | Space: $O(k)$
- **Edge Cases:** Duplicate values, $k = 1, k = n$.

#### Q292: Top K Frequent Elements
- **Difficulty:** `[Medium]` | **Pattern:** `[Bucket Sort / Min-Heap]`
- **Statement:** Return $k$ most frequent elements.
- **Optimal Approach:** Count frequencies into map. Create array of buckets where `bucket[freq]` stores list of elements with that frequency. Scan from high to low frequency.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** All elements have unique frequency 1.

#### Q293: Find Median from Data Stream
- **Difficulty:** `[Hard]` | **Pattern:** `[Dual Heaps (Max-Heap & Min-Heap)]`
- **Statement:** Design data structure supporting adding numbers and finding running median in $O(1)$.
- **Optimal Approach:** `leftMaxHeap` (stores smaller half) and `rightMinHeap` (stores larger half). Balance heaps so sizes differ by at most 1.
- **Complexity:** Add: $O(\log n)$ | Find Median: $O(1)$ | Space: $O(n)$
- **Edge Cases:** Even vs odd total numbers.

#### Q294: Sliding Window Median
- **Difficulty:** `[Hard]` | **Pattern:** `[Dual Heaps with Lazy Deletion]`
- **Statement:** Return median of every sliding window of size $k$.
- **Optimal Approach:** Dual heaps maintaining smaller and larger halves. Use hash map for lazy removal of outgoing elements when popped.
- **Complexity:** Time: $O(n \log k)$ | Space: $O(k)$
- **Edge Cases:** $k = 1$.

#### Q295: Merge K Sorted Lists
- **Difficulty:** `[Hard]` | **Pattern:** `[Min-Heap K Pointers]`
- **Statement:** Merge $k$ sorted lists into one sorted list.
- **Optimal Approach:** Push heads into min-heap. Extract min node, advance its pointer and push to heap.
- **Complexity:** Time: $O(N \log k)$ | Space: $O(k)$
- **Edge Cases:** Lists containing empty heads, $k = 1$.

#### Q296: Find K Pairs with Smallest Sums
- **Difficulty:** `[Medium]` | **Pattern:** `[Min-Heap Multi-Index Walk]`
- **Statement:** Given two sorted arrays, find $k$ pairs with smallest sums.
- **Optimal Approach:** Push $(u[i] + v[0], i, 0)$ for all $i < \min(n, k)$ into min-heap. Extract min $(u[i] + v[j])$, push next pair $(u[i] + v[j+1])$.
- **Complexity:** Time: $O(k \log k)$ | Space: $O(k)$
- **Edge Cases:** $k > n \cdot m$.

#### Q297: Task Scheduler
- **Difficulty:** `[Medium]` | **Pattern:** `[Max Frequency Math / Max-Heap]`
- **Statement:** Execute tasks with cooling interval $n$ minimizing total intervals.
- **Optimal Approach:** Find max task frequency $M$ and count of tasks with frequency $M$ ($countMax$). Answer is $\max(\text{tasks.length}, (M - 1)(n + 1) + countMax)$.
- **Complexity:** Time: $O(\text{tasks})$ | Space: $O(26) = O(1)$
- **Edge Cases:** $n = 0$ (no cooling).

#### Q298: Minimum Cost to Connect Sticks / Huffman Coding
- **Difficulty:** `[Medium]` | **Pattern:** `[Min-Heap Greedy Pairing]`
- **Statement:** Connect sticks into one stick; cost to connect two sticks is their sum. Minimize cost.
- **Optimal Approach:** Min-heap of stick lengths. Extract two smallest sticks, add their sum to total cost, push sum back to heap until 1 stick remains.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Array with 1 stick (cost 0).

#### Q299: Furthest Building You Can Reach
- **Difficulty:** `[Medium]` | **Pattern:** `[Min-Heap for Ladders]`
- **Statement:** Climb buildings using bricks and ladders. Maximize distance reached.
- **Optimal Approach:** Use min-heap of size $ladders$ to track largest height climbs. For smaller climbs, spend bricks. If bricks exhausted, return current building.
- **Complexity:** Time: $O(n \log(\text{ladders}))$ | Space: $O(\text{ladders})$
- **Edge Cases:** 0 ladders, bricks suffice for all buildings.

#### Q300: Seat Reservation Manager
- **Difficulty:** `[Medium]` | **Pattern:** `[Min-Heap Available Seats]`
- **Statement:** Manage reservation of smallest unreserved seat numbers.
- **Optimal Approach:** Min-heap initialized with $1 \dots n$. `reserve()` pops min, `unreserve(seat)` pushes seat back.
- **Complexity:** Time: $O(\log n)$ all ops | Space: $O(n)$
- **Edge Cases:** Unreserving a seat that becomes the new minimum.

#### Q301: Process Tasks Using Servers
- **Difficulty:** `[Medium]` | **Pattern:** `[Dual Heaps (Free & Busy Servers)]`
- **Statement:** Assign tasks to available servers with smallest weight (breaking ties by index).
- **Optimal Approach:** `freeServers` min-heap by `(weight, index)`. `busyServers` min-heap by `(freeTime, weight, index)`. Advance time and transfer servers.
- **Complexity:** Time: $O((T + S) \log S)$ | Space: $O(S)$
- **Edge Cases:** No servers available when task arrives (jump time forward).

#### Q302: Single-Threaded CPU
- **Difficulty:** `[Medium]` | **Pattern:** `[Min-Heap Shortest Job First]`
- **Statement:** Execute tasks ordered by arrival time, choosing shortest processing time when available.
- **Optimal Approach:** Sort tasks by enqueue time. Min-heap of available tasks by `(processingTime, index)`. Maintain current time.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** CPU idle between task arrivals.

#### Q303: IPO (Maximize Capital)
- **Difficulty:** `[Hard]` | **Pattern:** `[Dual Heaps Capital vs Profit]`
- **Statement:** Pick at most $k$ projects to maximize final capital starting with $w$.
- **Optimal Approach:** Min-heap of projects by `capitalRequirement`. Max-heap of affordable projects by `profit`. At each step, push all newly affordable projects to max-heap and execute best.
- **Complexity:** Time: $O(n \log n + k \log n)$ | Space: $O(n)$
- **Edge Cases:** Cannot afford any project initially.

#### Q304: Maximum Performance of a Team
- **Difficulty:** `[Hard]` | **Pattern:** `[Sort by Efficiency + Min-Heap Speed]`
- **Statement:** Choose at most $k$ engineers to maximize $\sum \text{speed} \times \min(\text{efficiency})$.
- **Optimal Approach:** Sort engineers by efficiency descending. Maintain min-heap of speeds of size $k$. As each engineer is added (acting as minimum efficiency), update max performance.
- **Complexity:** Time: $O(n \log n + n \log k)$ | Space: $O(k)$
- **Edge Cases:** $k = 1$.

#### Q305: Minimum Number of Refueling Stops
- **Difficulty:** `[Hard]` | **Pattern:** `[Max-Heap Greedy Fuel]`
- **Statement:** Reach destination with initial fuel, refueling at stations on the way.
- **Optimal Approach:** Max-heap of fuel at passed gas stations. When fuel reaches 0 before next station, pop max fuel station and refuel.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Cannot reach next station even after using all passed stations.

#### Q306: Swim in Rising Water
- **Difficulty:** `[Hard]` | **Pattern:** `[Dijkstra Min-Heap]`
- **Statement:** Find minimum time to swim from $(0, 0)$ to $(n-1, n-1)$ in grid where water rises.
- **Optimal Approach:** Min-heap of tuples `(maxElevationSoFar, r, c)`. Expand 4-directional neighbors, pushing $\max(\text{elevation}, grid[nr][nc])$.
- **Complexity:** Time: $O(n^2 \log n)$ | Space: $O(n^2)$
- **Edge Cases:** $n = 1$.

#### Q307: Path with Maximum Minimum Value
- **Difficulty:** `[Medium]` | **Pattern:** `[Max-Heap Dijkstra / Modified BFS]`
- **Statement:** Find path from start to end maximizing the minimum cell score along path.
- **Optimal Approach:** Max-heap of `(minScoreOnPath, r, c)`. Greedily explore largest neighbor cell first.
- **Complexity:** Time: $O(R \cdot C \log(R \cdot C))$ | Space: $O(R \cdot C)$
- **Edge Cases:** Grid with 1 cell.

#### Q308: Reduce Array Size to The Half
- **Difficulty:** `[Medium]` | **Pattern:** `[Max-Heap Greedy Frequencies]`
- **Statement:** Choose minimum set of integers to remove at least half the elements.
- **Optimal Approach:** Max-heap of frequencies. Greedily pop largest frequencies until total removed $\ge \lceil n / 2 \rceil$.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** All elements identical (returns 1).

#### Q309: Last Stone Weight
- **Difficulty:** `[Easy]` | **Pattern:** `[Max-Heap Simulation]`
- **Statement:** Smash two heaviest stones: if equal, destroy both; else push difference.
- **Optimal Approach:** Max-heap. Pop top two elements, push difference if $> 0$ until $\le 1$ stone remains.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** All stones destroy each other (returns 0).

#### Q310: Relative Ranks
- **Difficulty:** `[Easy]` | **Pattern:** `[Max-Heap with Indices]`
- **Statement:** Assign medals (Gold, Silver, Bronze, 4, 5...) based on scores.
- **Optimal Approach:** Max-heap storing `(score, originalIndex)`. Pop assigning rank labels.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Array length $< 3$.

#### Q311: Take Gifts From the Richest Pile
- **Difficulty:** `[Easy]` | **Pattern:** `[Max-Heap Simulation]`
- **Statement:** For $k$ seconds, pick largest pile and replace with $\lfloor \sqrt{pile} \rfloor$.
- **Optimal Approach:** Max-heap. Pop max, push $\lfloor \sqrt{max} \rfloor$, repeat $k$ times. Sum heap elements.
- **Complexity:** Time: $O(n + k \log n)$ | Space: $O(n)$
- **Edge Cases:** Piles reduced to 1.

#### Q312: Maximum Subsequence Score
- **Difficulty:** `[Medium]` | **Pattern:** `[Sort + Min-Heap]`
- **Statement:** Maximize $(\sum \text{selected } nums1) \times \min(\text{selected } nums2)$ of size $k$.
- **Optimal Approach:** Sort pairs by $nums2$ descending. Min-heap of size $k$ for $nums1$. Update score with $nums2[i] \times \text{heapSum}$.
- **Complexity:** Time: $O(n \log n + n \log k)$ | Space: $O(k)$
- **Edge Cases:** $k = n$.

#### Q313: Kth Largest Element in a Stream
- **Difficulty:** `[Easy]` | **Pattern:** `[Min-Heap of Size K]`
- **Statement:** Design class to find $k$-th largest element in dynamic stream.
- **Optimal Approach:** Min-heap of size $k$. `add(val)` pushes to heap and pops if size $> k$. Return heap top.
- **Complexity:** Add: $O(\log k)$ | Space: $O(k)$
- **Edge Cases:** Initial array has $< k$ elements.

#### Q314: Minimum Operations to Halve Array Sum
- **Difficulty:** `[Medium]` | **Pattern:** `[Max-Heap Greedy Reduction]`
- **Statement:** Halve array sum by picking largest element and dividing by 2 repeatedly.
- **Optimal Approach:** Max-heap of doubles. Pop largest, subtract half from current sum, push half back until total reduced by $50\%$.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Precision handling with floating points.

#### Q315: Find K-th Smallest Pair Distance
- **Difficulty:** `[Hard]` | **Pattern:** `[Binary Search on Answer + Sliding Window]`
- **Statement:** Find $k$-th smallest distance among all pairs in array.
- **Optimal Approach:** Sort array. Binary search distance $D \in [0, \max - \min]$. Count pairs with distance $\le D$ using two pointers sliding window.
- **Complexity:** Time: $O(n \log n + n \log(\max - \min))$ | Space: $O(1)$
- **Edge Cases:** Many duplicate distances.

---

## Section 4: Tries, Advanced Trees & Range Structures (Q316 – Q340)

#### Q316: Implement Trie (Prefix Tree)
- **Difficulty:** `[Medium]` | **Pattern:** `[Standard Alphabet Trie]`
- **Statement:** Implement `insert(word)`, `search(word)`, and `startsWith(prefix)`.
- **Optimal Approach:** Node with array of 26 child pointers and `isEnd` boolean. Walk character pointers.
- **Complexity:** Time: $O(L)$ all ops | Space: $O(N \cdot L \cdot 26)$
- **Edge Cases:** Empty word `""`.

#### Q317: Design Add and Search Words Data Structure
- **Difficulty:** `[Medium]` | **Pattern:** `[Trie Backtracking with Wildcard]`
- **Statement:** Support searching words with wildcard character `.` matching any letter.
- **Optimal Approach:** Trie structure. For `.`, branch recursively into all 26 non-null children; for letters, step into single child.
- **Complexity:** Search: $O(L)$ normal, $O(26^L)$ worst case with many `.` | Space: $O(N \cdot L)$
- **Edge Cases:** Words composed entirely of `...`.

#### Q318: Word Search II
- **Difficulty:** `[Hard]` | **Pattern:** `[Trie + 2D Grid Backtracking]`
- **Statement:** Find all words from dictionary present on $M \times N$ Boggle board.
- **Optimal Approach:** Build Trie from words. Run DFS on grid cells simultaneously walking down the Trie. Prune leaf Trie nodes when word is matched to optimize future searches!
- **Complexity:** Time: $O(M \cdot N \cdot 4^L)$ | Space: $O(\sum L)$
- **Edge Cases:** Duplicate words on board (prevented by clearing `isEnd` or storing word in leaf).

#### Q319: Maximum XOR of Two Numbers in an Array
- **Difficulty:** `[Medium]` | **Pattern:** `[0-1 Bitwise Trie Greedy Search]`
- **Statement:** Find maximum result of $nums[i] \oplus nums[j]$ in $O(n)$ time.
- **Optimal Approach:** Insert all numbers into 0-1 Trie (MSB to LSB). For each number, greedily branch toward the opposite bit to maximize XOR.
- **Complexity:** Time: $O(32 \cdot n) = O(n)$ | Space: $O(32 \cdot n) = O(n)$
- **Edge Cases:** Array of all identical numbers (XOR is 0).

#### Q320: Maximum XOR With an Element From Array
- **Difficulty:** `[Hard]` | **Pattern:** `[Offline Query Sorting + 0-1 Trie]`
- **Statement:** For query $(x, m)$, maximize $x \oplus val$ where $val \le m$.
- **Optimal Approach:** Sort queries by $m$ ascending. Sort array ascending. Greedily insert array elements $\le m$ into 0-1 Trie before processing query.
- **Complexity:** Time: $O(N \log N + Q \log Q + 32(N + Q))$ | Space: $O(32 N)$
- **Edge Cases:** No array element $\le m$ (returns $-1$).

#### Q321: Replace Words
- **Difficulty:** `[Medium]` | **Pattern:** `[Trie Shortest Root Match]`
- **Statement:** Replace sentence words with shortest dictionary root if matching.
- **Optimal Approach:** Insert roots into Trie. For each word in sentence, traverse Trie: if `isEnd` encountered, replace word with root; if mismatch, keep original.
- **Complexity:** Time: $O(N \cdot L)$ | Space: $O(\sum \text{root lengths})$
- **Edge Cases:** Multiple roots match word (choose shortest root).

#### Q322: Map Sum Pairs
- **Difficulty:** `[Medium]` | **Pattern:** `[Trie Prefix Score Accumulator]`
- **Statement:** Support `insert(key, val)` and `sum(prefix)` returning sum of values of all keys starting with prefix.
- **Optimal Approach:** Each Trie node maintains running sum of all descendant keys: `node.score += (newVal - oldVal)`. `sum(prefix)` returns score of prefix leaf in $O(L)$!
- **Complexity:** Time: $O(L)$ all ops | Space: $O(N \cdot L)$
- **Edge Cases:** Overwriting value of an existing key.

#### Q323: Concatenated Words
- **Difficulty:** `[Hard]` | **Pattern:** `[Trie + Memoized Word Break DFS]`
- **Statement:** Find all words in dictionary formed by concatenating $\ge 2$ shorter dictionary words.
- **Optimal Approach:** Sort words by length. Insert shorter words into Trie. For current word, check if it can be partitioned using words already in Trie.
- **Complexity:** Time: $O(N \cdot L^2)$ | Space: $O(N \cdot L)$
- **Edge Cases:** Empty string, single letter words.

#### Q324: Palindrome Pairs
- **Difficulty:** `[Hard]` | **Pattern:** `[Trie of Reversed Words]`
- **Statement:** Find pairs $(i, j)$ such that $words[i] + words[j]$ forms a palindrome.
- **Optimal Approach:** Insert reversed words into Trie. For each word, traverse Trie checking palindromic suffixes, and check remaining Trie branches for palindromic tails.
- **Complexity:** Time: $O(N \cdot L^2)$ | Space: $O(N \cdot L^2)$
- **Edge Cases:** Empty word `""` pairing with any palindrome word.

#### Q325: Stream of Characters
- **Difficulty:** `[Hard]` | **Pattern:** `[Trie of Reversed Suffixes]`
- **Statement:** Support `query(letter)` returning true if any suffix of stream matches a dictionary word.
- **Optimal Approach:** Insert words in reverse into Trie. Maintain stream buffer. On query, scan buffer backwards from latest character into Trie.
- **Complexity:** Time: $O(L_{\max})$ per query | Space: $O(\sum L)$
- **Edge Cases:** Very long stream (cap buffer size to max word length).

#### Q326: Range Sum Query - Mutable
- **Difficulty:** `[Medium]` | **Pattern:** `[Segment Tree / Binary Indexed Tree]`
- **Statement:** Support $O(\log n)$ point updates and range sum queries.
- **Optimal Approach:** 1D Fenwick Tree (BIT) with `i += (i & -i)` for updates and `i -= (i & -i)` for prefix sum queries.
- **Complexity:** Time: $O(\log n)$ all ops | Space: $O(n)$
- **Edge Cases:** Update with zero delta.

#### Q327: Range Sum Query 2D - Mutable
- **Difficulty:** `[Hard]` | **Pattern:** `[2D Binary Indexed Tree]`
- **Statement:** Support $O(\log R \log C)$ point updates and 2D range sum queries in matrix.
- **Optimal Approach:** 2D Fenwick Tree where both dimensions use `(i & -i)` bitwise navigation.
- **Complexity:** Time: $O(\log R \cdot \log C)$ | Space: $O(R \cdot C)$
- **Edge Cases:** Single cell updates and queries.

#### Q328: Count of Smaller Numbers After Self
- **Difficulty:** `[Hard]` | **Pattern:** `[Coordinate Compression + Fenwick Tree]`
- **Statement:** For each element, count elements to its right that are strictly smaller.
- **Optimal Approach:** Coordinate compress values to ranks $1 \dots U$. Scan array from right to left: query BIT for rank $< x$, then add 1 to BIT at rank $x$.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Duplicate numbers, negative numbers.

#### Q329: Reverse Pairs
- **Difficulty:** `[Hard]` | **Pattern:** `[Fenwick Tree / Merge Sort Inversions]`
- **Statement:** Count pairs $(i, j)$ with $i < j$ and $nums[i] > 2 \cdot nums[j]$.
- **Optimal Approach:** Coordinate compress both $nums[i]$ and $2 \cdot nums[i]$. Traverse right-to-left using Fenwick Tree.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** $2 \cdot nums[j]$ exceeding 32-bit signed integer (overflow).

#### Q330: Static Range Minimum Query (RMQ)
- **Difficulty:** `[Medium]` | **Pattern:** `[Sparse Table strictly O(1)]`
- **Statement:** Query minimum in subarray in $O(1)$ time after $O(n \log n)$ preprocessing.
- **Optimal Approach:** Sparse Table `ST[i][k]` storing minimum in $[i, i + 2^k - 1]$. Query overlaps two power-of-two intervals: $\min(ST[L][k], ST[R - 2^k + 1][k])$ where $k = \lfloor \log_2(R - L + 1) \rfloor$.
- **Complexity:** Preprocess: $O(n \log n)$ | Query: $O(1)$ | Space: $O(n \log n)$
- **Edge Cases:** $L = R$ ($k = 0$).

#### Q331: Segment Tree Lazy Propagation for Range Updates
- **Difficulty:** `[Hard]` | **Pattern:** `[Lazy Tag Push-Down]`
- **Statement:** Support range additions and range sum queries in $O(\log n)$ time.
- **Optimal Approach:** Maintain `lazy` array. When visiting node, push down pending lazy updates to children before recursing.
- **Complexity:** Time: $O(\log n)$ all ops | Space: $O(4n)$
- **Edge Cases:** Overlapping range updates.

#### Q332: Falling Squares
- **Difficulty:** `[Hard]` | **Pattern:** `[Coordinate Compressed Segment Tree]`
- **Statement:** Squares drop on number line; stack if landing on existing square. Return max height after each drop.
- **Optimal Approach:** Coordinate compress $x$-intervals $[pos, pos + side - 1]$. Segment tree with lazy propagation maintains maximum height over intervals.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(n)$
- **Edge Cases:** Squares touching at boundaries (do not stack).

#### Q333: My Calendar III via Segment Tree
- **Difficulty:** `[Hard]` | **Pattern:** `[Dynamic / Segment Tree with Lazy Max]`
- **Statement:** Return max $k$-booking using dynamic segment tree without pre-allocating large range.
- **Optimal Approach:** Dynamic pointer-based segment tree over range $[0, 10^9]$. Range add 1 for each interval, query root maximum.
- **Complexity:** Time: $O(\log(\max T))$ per booking | Space: $O(N \log(\max T))$
- **Edge Cases:** Large timestamps up to $10^9$.

#### Q334: Lowest Common Ancestor via Binary Lifting
- **Difficulty:** `[Hard]` | **Pattern:** `[Binary Lifting Table]`
- **Statement:** Preprocess tree to answer LCA queries in $O(\log n)$ time.
- **Optimal Approach:** Table `up[node][k]` storing $2^k$-th ancestor. Bring deeper node to same depth using binary jumps, then jump both nodes simultaneously until parents match.
- **Complexity:** Preprocess: $O(n \log n)$ | Query: $O(\log n)$ | Space: $O(n \log n)$
- **Edge Cases:** One node is ancestor of the other.

#### Q335: Tree Diameter & Centroid Finding
- **Difficulty:** `[Medium]` | **Pattern:** `[Double DFS & Subtree Halving]`
- **Statement:** 1. Find diameter using 2 BFS/DFS passes. 2. Find centroid where each subtree $\le n/2$.
- **Optimal Approach:** Run BFS from arbitrary node to find furthest node $u$. Run BFS from $u$ to find furthest node $v$; distance$(u, v)$ is diameter. For centroid, DFS picking child with size $> n/2$.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Trees with 2 centroids.

#### Q336: Heavy-Light Decomposition Path Queries
- **Difficulty:** `[Hard]` | **Pattern:** `[HLD + Segment Tree]`
- **Statement:** Update nodes along path $(u, v)$ and query max along path in $O(\log^2 n)$ time.
- **Optimal Approach:** Heavy-Light Decomposition maps tree paths onto segment tree. Jump across light edges, query heavy paths in $O(\log n)$ each.
- **Complexity:** Time: $O(\log^2 n)$ | Space: $O(n)$
- **Edge Cases:** $u$ and $v$ on same heavy path.

#### Q337: Subtree Queries via Euler Tour
- **Difficulty:** `[Medium]` | **Pattern:** `[Euler Tour Flattening + Segment Tree]`
- **Statement:** Update and query entire subtrees in $O(\log n)$ time.
- **Optimal Approach:** Euler tour assigns entry and exit times $[in[u], out[u]]$. Entire subtree of $u$ corresponds to contiguous subarray $[in[u], out[u]]$! Use Fenwick or Segment Tree.
- **Complexity:** Time: $O(\log n)$ | Space: $O(n)$
- **Edge Cases:** Leaf node subtree (interval of size 1).

#### Q338: Cartesian Tree Linear Construction
- **Difficulty:** `[Hard]` | **Pattern:** `[Monotonic Stack RMQ Tree]`
- **Statement:** Build Cartesian Tree from array in $O(n)$ time.
- **Optimal Approach:** Monotonic stack maintaining right spine. New node pops elements with value $>$ current, becomes their parent, attaches to stack top.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Array sorted ascending (all right children), descending (all left children).

#### Q339: Kd-Tree 2D Nearest Neighbor Search
- **Difficulty:** `[Hard]` | **Pattern:** `[Alternating Splitting Hyperplanes with Pruning]`
- **Statement:** Find closest 2D point to query point $Q$ in $O(\log n)$ average time.
- **Optimal Approach:** Kd-tree alternating $X$ and $Y$ splits. Backtrack and prune subtrees where distance to splitting line $\ge$ best distance seen so far.
- **Complexity:** Time: $O(\log n)$ average | Space: $O(n)$
- **Edge Cases:** Multiple points with identical distances.

#### Q340: Implicit Treap Dynamic Array
- **Difficulty:** `[Hard]` | **Pattern:** `[Implicit Key Split & Merge]`
- **Statement:** Implement array supporting arbitrary range reverse in $O(\log n)$ time.
- **Optimal Approach:** Implicit Treap where key is subtree size. `reverse(l, r)` splits target interval, toggles lazy reverse bit on root, and merges back.
- **Complexity:** Time: $O(\log n)$ all ops | Space: $O(n)$
- **Edge Cases:** Reversing range of size 1.

---

## References & Academic Attribution

1. **Skiena, S. S.** (2020). *The Algorithm Design Manual* (3rd ed.). Springer.
2. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.). MIT Press.
3. **USA Computing Olympiad (USACO)** & **CP-Algorithms Archives** (2024). Curated Competitive Programming and Algorithm Verification Standards.
