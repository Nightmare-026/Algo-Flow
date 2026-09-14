# Part 11: Problem Bank — Volume 02: Linked Lists, Stacks, Queues & Monotonic Structures (60 Problems)

> **Problems Covered:** Q101 to Q160  
> **Patterns:** Fast & Slow Pointers &bull; In-Place List Reversal &bull; Dummy Head Sentinel &bull; Monotonic Stack &bull; Monotonic Deque &bull; Parentheses & Expression Parsing &bull; LRU/LFU Cache Architecture

---

## Section 1: Linked List Mastery (Q101 – Q130)

#### Q101: Reverse Linked List
- **Difficulty:** `[Easy]` | **Pattern:** `[Three Pointers Reversal]`
- **Statement:** Reverse a singly linked list iteratively and recursively.
- **Optimal Approach:** Maintain `prev = NULL, curr = head`. In each step, save `next = curr.next`, set `curr.next = prev`, advance `prev = curr, curr = next`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$ iterative ($O(n)$ recursive)
- **Edge Cases:** Empty list (`head = NULL`), single-node list.

#### Q102: Reverse Linked List II
- **Difficulty:** `[Medium]` | **Pattern:** `[Sublist In-Place Reversal]`
- **Statement:** Reverse nodes from position `left` to `right` in a single pass.
- **Optimal Approach:** Use dummy node. Advance `prev` to node immediately before `left`. Reversely insert each successor node between `left` and `right`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** `left = 1` (reversing from head), `left = right` (no change).

#### Q103: Reverse Nodes in k-Group
- **Difficulty:** `[Hard]` | **Pattern:** `[Batched Group Reversal]`
- **Statement:** Reverse nodes of a linked list $k$ at a time; leaves remaining $< k$ nodes as-is.
- **Optimal Approach:** Check if $\ge k$ nodes remain. If so, reverse $k$ nodes, connect reversed tail to the recursive call on remaining list.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$ iterative
- **Edge Cases:** $k = 1$, list length strictly less than $k$.

#### Q104: Merge Two Sorted Lists
- **Difficulty:** `[Easy]` | **Pattern:** `[Two Pointers Dummy Head]`
- **Statement:** Merge two sorted linked lists into one sorted list.
- **Optimal Approach:** Dummy head with pointer `curr`. At each step, attach smaller of `list1` and `list2`, advancing that list pointer.
- **Complexity:** Time: $O(n + m)$ | Space: $O(1)$
- **Edge Cases:** One list empty, both lists empty.

#### Q105: Merge k Sorted Lists
- **Difficulty:** `[Hard]` | **Pattern:** `[Min-Heap / Divide and Conquer]`
- **Statement:** Merge $k$ sorted linked lists into one sorted list.
- **Optimal Approach:** Min-heap of size $k$ storing the heads of each list. Extract min, attach to result, push `minNode.next` if non-null.
- **Complexity:** Time: $O(N \log k)$ | Space: $O(k)$
- **Edge Cases:** $k = 0$, lists containing empty heads.

#### Q106: Linked List Cycle
- **Difficulty:** `[Easy]` | **Pattern:** `[Floyd Tortoise and Hare]`
- **Statement:** Determine if a linked list contains a cycle.
- **Optimal Approach:** `slow` advances 1 step, `fast` advances 2 steps. If `slow == fast`, a cycle exists. If `fast` or `fast.next` reaches `NULL`, no cycle.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Single node pointing to itself, list with 0 or 1 node.

#### Q107: Linked List Cycle II
- **Difficulty:** `[Medium]` | **Pattern:** `[Floyd Cycle Entry]`
- **Statement:** Return the exact node where the cycle begins, or `NULL` if no cycle exists.
- **Optimal Approach:** Find collision of `slow` and `fast`. Reset `slow = head`. Move both `slow` and `fast` 1 step at a time; their meeting point is the cycle start.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Cycle starts at head node.

#### Q108: Remove Nth Node From End of List
- **Difficulty:** `[Medium]` | **Pattern:** `[Two Pointers Offset]`
- **Statement:** Remove the $n$-th node from the end of list in one pass.
- **Optimal Approach:** Advance `fast` pointer by $n + 1$ steps from dummy node. Then advance `fast` and `slow` together until `fast == NULL`. Remove `slow.next`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Removing the head node ($n = \text{length}$).

#### Q109: Palindrome Linked List
- **Difficulty:** `[Easy]` | **Pattern:** `[Midpoint + Reverse Second Half]`
- **Statement:** Check if singly linked list is a palindrome in $O(n)$ time and $O(1)$ space.
- **Optimal Approach:** Find midpoint using fast/slow pointers. Reverse the second half. Compare values of first half and reversed second half.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Odd vs even length lists, length 1.

#### Q110: Reorder List
- **Difficulty:** `[Medium]` | **Pattern:** `[Midpoint + Reverse + Interleave]`
- **Statement:** Reorder list to $L_0 \to L_n \to L_1 \to L_{n-1} \to \dots$
- **Optimal Approach:** Split list into two halves at midpoint. Reverse second half. Interleave nodes from first and second halves alternately.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** List length $\le 2$.

#### Q111: Intersection of Two Linked Lists
- **Difficulty:** `[Easy]` | **Pattern:** `[Two Pointers Cycle Redirection]`
- **Statement:** Find node at which two singly linked lists intersect in $O(1)$ space.
- **Optimal Approach:** Pointers $pA = headA$ and $pB = headB$. When a pointer reaches `NULL`, redirect it to the other list's head. They will meet at intersection!
- **Complexity:** Time: $O(n + m)$ | Space: $O(1)$
- **Edge Cases:** Lists do not intersect (both become `NULL` simultaneously).

#### Q112: Copy List with Random Pointer
- **Difficulty:** `[Medium]` | **Pattern:** `[In-Place Interleaving Nodes]`
- **Statement:** Deep copy a linked list where each node contains an extra `random` pointer in $O(1)$ auxiliary space.
- **Optimal Approach:** Insert cloned nodes immediately after original nodes ($A \to A' \to B \to B'$). Set $curr.next.random = curr.random.next$. Unweave lists.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$ auxiliary
- **Edge Cases:** Random pointer pointing to `NULL`, random pointing to self.

#### Q113: Add Two Numbers
- **Difficulty:** `[Medium]` | **Pattern:** `[Digit-by-Digit Addition with Carry]`
- **Statement:** Add two numbers represented by linked lists (digits in reverse order).
- **Optimal Approach:** Traverse both lists, adding values and `carry`. Create new node with `sum % 10`, `carry = sum / 10`.
- **Complexity:** Time: $O(\max(n, m))$ | Space: $O(1)$ auxiliary
- **Edge Cases:** Unequal lengths, final remaining carry creates an extra node.

#### Q114: Add Two Numbers II
- **Difficulty:** `[Medium]` | **Pattern:** `[Stack or List Reversal]`
- **Statement:** Add two numbers where digits are in forward order without reversing original lists.
- **Optimal Approach:** Push node values of both lists onto two stacks. Pop and sum with carry, constructing result list from right to left using head insertion.
- **Complexity:** Time: $O(n + m)$ | Space: $O(n + m)$
- **Edge Cases:** Unequal lengths, overflow creating new head node.

#### Q115: Remove Duplicates from Sorted List
- **Difficulty:** `[Easy]` | **Pattern:** `[Direct Traversal Deduplication]`
- **Statement:** Delete duplicate values from sorted list so each element appears once.
- **Optimal Approach:** While `curr.next != NULL`, if `curr.val == curr.next.val`, bypass duplicate: `curr.next = curr.next.next`; else `curr = curr.next`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** All duplicate values, list with no duplicates.

#### Q116: Remove Duplicates from Sorted List II
- **Difficulty:** `[Medium]` | **Pattern:** `[Dummy Node Lookahead]`
- **Statement:** Delete all nodes that have duplicate numbers, leaving only distinct numbers.
- **Optimal Approach:** Dummy node before head. If `curr.next.val == curr.next.next.val`, save value and skip all nodes with that value.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Duplicates at the beginning of the list, all nodes duplicated.

#### Q117: Partition List
- **Difficulty:** `[Medium]` | **Pattern:** `[Dual Dummy Head Partitioning]`
- **Statement:** Partition list such that all nodes $< x$ come before nodes $\ge x$, preserving relative order.
- **Optimal Approach:** Create two dummy lists: `less` and `greaterOrEqual`. Traverse original list appending to appropriate dummy list. Connect `less.next = greaterOrEqualHead`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** All nodes $< x$, all nodes $\ge x$.

#### Q118: Sort List
- **Difficulty:** `[Medium]` | **Pattern:** `[Merge Sort on Linked List]`
- **Statement:** Sort linked list in $O(n \log n)$ time and $O(1)$ auxiliary space.
- **Optimal Approach:** Bottom-up iterative merge sort: iteratively split list into sublists of size $1, 2, 4, \dots$ and merge adjacent pairs.
- **Complexity:** Time: $O(n \log n)$ | Space: $O(1)$
- **Edge Cases:** Empty list, single-node list.

#### Q119: Swap Nodes in Pairs
- **Difficulty:** `[Medium]` | **Pattern:** `[Pairwise Pointer Swap]`
- **Statement:** Swap every two adjacent nodes.
- **Optimal Approach:** Use dummy node. Adjust pointers: `first = prev.next, second = first.next; prev.next = second; first.next = second.next; second.next = first`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Odd number of nodes (last node remains unswapped).

#### Q120: Rotate List
- **Difficulty:** `[Medium]` | **Pattern:** `[Ring Closure & Cut]`
- **Statement:** Rotate list to the right by $k$ places.
- **Optimal Approach:** Count length $n$ and connect tail to head (forming circular list). Find new tail at $n - (k \bmod n) - 1$ steps, break ring.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** $k = 0$, $k \ge n$, $k$ multiple of $n$.

#### Q121: Odd Even Linked List
- **Difficulty:** `[Medium]` | **Pattern:** `[Dual Pointer Interleaving]`
- **Statement:** Group all odd nodes together followed by even nodes in-place.
- **Optimal Approach:** Maintain `odd` and `even` pointers with `evenHead`. Traverse connecting odd to odd and even to even. Finally, `odd.next = evenHead`.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** List with $\le 2$ nodes.

#### Q122: Flatten a Multilevel Doubly Linked List
- **Difficulty:** `[Medium]` | **Pattern:** `[DFS / Stack Splice]`
- **Statement:** Flatten doubly linked list where nodes have `child` pointers.
- **Optimal Approach:** Traverse list; when `child` encountered, splice child list between `curr` and `curr.next`. Update `prev` and `next` pointers.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Deeply nested child lists.

#### Q123: LRU Cache
- **Difficulty:** `[Medium]` | **Pattern:** `[Hash Map + Doubly Linked List]`
- **Statement:** Design Least Recently Used (LRU) Cache supporting $O(1)$ `get` and `put`.
- **Optimal Approach:** Hash map mapping `key -> Node`. Doubly linked list tracking recency (head = most recent, tail = least recent).
- **Complexity:** Time: $O(1)$ all ops | Space: $O(\text{capacity})$
- **Edge Cases:** Overwriting existing key, evicting when capacity reached.

#### Q124: LFU Cache
- **Difficulty:** `[Hard]` | **Pattern:** `[Dual Hash Maps + Frequency Doubly Linked Lists]`
- **Statement:** Design Least Frequently Used (LFU) Cache with $O(1)$ operations.
- **Optimal Approach:** Map `key -> Node` and map `frequency -> DoublyLinkedList`. Track `minFreq`. When capacity exceeded, evict tail of list for `minFreq`.
- **Complexity:** Time: $O(1)$ all ops | Space: $O(\text{capacity})$
- **Edge Cases:** Tie-breaking when multiple keys share lowest frequency (evict LRU among them).

#### Q125: Split Linked List in Parts
- **Difficulty:** `[Medium]` | **Pattern:** `[Even Division Arithmetic]`
- **Statement:** Split linked list into $k$ parts with lengths differing by at most 1.
- **Optimal Approach:** Length $N$. Base size $w = \lfloor N / k \rfloor$, remainder $r = N \bmod k$. First $r$ parts have size $w + 1$, rest size $w$. Cut pointers accordingly.
- **Complexity:** Time: $O(N + k)$ | Space: $O(k)$ for result array
- **Edge Cases:** $k > N$ (some parts are `NULL`).

#### Q126: Design Browser History
- **Difficulty:** `[Medium]` | **Pattern:** `[Doubly Linked List / Dynamic Array]`
- **Statement:** Implement browser history supporting `visit(url)`, `back(steps)`, and `forward(steps)`.
- **Optimal Approach:** Doubly linked list node with `prev, next, url`. When visiting, sever existing `next` chain and append new node.
- **Complexity:** Time: $O(\text{steps})$ or $O(1)$ with array | Space: $O(\text{urls})$
- **Edge Cases:** Backing up further than history start, forwarding past current page.

#### Q127: Insertion Sort List
- **Difficulty:** `[Medium]` | **Pattern:** `[Sorted Insert with Dummy Head]`
- **Statement:** Sort linked list using insertion sort.
- **Optimal Approach:** Dummy head for sorted portion. For each node, find insertion spot by scanning from dummy head and insert.
- **Complexity:** Time: $O(n^2)$ | Space: $O(1)$
- **Edge Cases:** Already sorted list, reverse sorted list.

#### Q128: Delete Node in a Linked List
- **Difficulty:** `[Medium]` | **Pattern:** `[Value Copying Overwrite]`
- **Statement:** Delete a node in singly linked list given only access to that node (guaranteed not to be tail).
- **Optimal Approach:** Copy value of next node into current node: `node.val = node.next.val`, then bypass next node: `node.next = node.next.next`.
- **Complexity:** Time: $O(1)$ | Space: $O(1)$
- **Edge Cases:** Target node is last node (not possible per problem guarantee).

#### Q129: Swapping Nodes in a Linked List
- **Difficulty:** `[Medium]` | **Pattern:** `[Two Pointers Offset Swap]`
- **Statement:** Swap values of $k$-th node from beginning and $k$-th from end.
- **Optimal Approach:** Find $k$-th from beginning. Advance second pointer starting at head alongside fast pointer to find $k$-th from end. Swap values.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** The two nodes are the same node, $k = 1$.

#### Q130: Maximum Twin Sum of a Linked List
- **Difficulty:** `[Medium]` | **Pattern:** `[Midpoint + Reverse + Twin Sum]`
- **Statement:** For even length $n$, twin of node $i$ is $n - 1 - i$. Find max twin sum.
- **Optimal Approach:** Find midpoint using fast/slow. Reverse second half. Traverse both halves simultaneously, computing max pair sum.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Length 2 (only one twin sum).

---

## Section 2: Stacks, Queues & Monotonic Patterns (Q131 – Q160)

#### Q131: Valid Parentheses
- **Difficulty:** `[Easy]` | **Pattern:** `[LIFO Stack]`
- **Statement:** Given string containing `()[]{}` determine if input string is valid.
- **Optimal Approach:** Push expected closing brackets onto stack when opening bracket seen. On closing bracket, pop and verify equality. Stack must be empty at end.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Only opening brackets, only closing brackets, mismatch order `([)]`.

#### Q132: Min Stack
- **Difficulty:** `[Medium]` | **Pattern:** `[Dual Stack or Diff Encoding]`
- **Statement:** Stack supporting $O(1)$ `push`, `pop`, `top`, and `getMin`.
- **Optimal Approach:** Maintain `minStack` where top stores current minimum. When pushing $x$, push $\min(x, \text{minStack.top()})$.
- **Complexity:** Time: $O(1)$ all ops | Space: $O(n)$
- **Edge Cases:** Popping when minimum element is removed.

#### Q133: Evaluate Reverse Polish Notation
- **Difficulty:** `[Medium]` | **Pattern:** `[Postfix Stack Evaluation]`
- **Statement:** Evaluate arithmetic expression in Reverse Polish Notation (`["2","1","+","3","*"]`).
- **Optimal Approach:** Push numbers onto stack. When operator encountered, pop top two operands (second popped is left operand), apply operator, push result.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Negative numbers, integer truncation toward zero for division.

#### Q134: Daily Temperatures
- **Difficulty:** `[Medium]` | **Pattern:** `[Monotonic Decreasing Stack]`
- **Statement:** For each day, return number of days to wait for a warmer temperature.
- **Optimal Approach:** Stack stores indices of temperatures in decreasing order. When current temperature $>$ `temperatures[stack.top()]`, pop and record `ans[idx] = i - idx`.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** No warmer future day exists (defaults to 0).

#### Q135: Next Greater Element I
- **Difficulty:** `[Easy]` | **Pattern:** `[Monotonic Stack + Hash Map]`
- **Statement:** Find next greater element for elements of `nums1` in `nums2`.
- **Optimal Approach:** Monotonic decreasing stack on `nums2` to populate map `{val: nextGreaterVal}`. Look up elements of `nums1` in map.
- **Complexity:** Time: $O(n + m)$ | Space: $O(m)$
- **Edge Cases:** Element has no next greater element (map value $-1$).

#### Q136: Next Greater Element II
- **Difficulty:** `[Medium]` | **Pattern:** `[Circular Monotonic Stack]`
- **Statement:** Find next greater element in a circular array.
- **Optimal Approach:** Loop through array twice ($2n$ iterations) using index $i \bmod n$ with monotonic decreasing stack.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** All elements equal, strictly decreasing array.

#### Q137: Next Greater Element III
- **Difficulty:** `[Medium]` | **Pattern:** `[Next Permutation on Digits]`
- **Statement:** Find smallest 32-bit integer with same digits that is greater than $n$.
- **Optimal Approach:** Convert integer to digit array. Apply Next Permutation algorithm. Check if result exceeds 32-bit signed integer max.
- **Complexity:** Time: $O(\text{digits})$ | Space: $O(\text{digits})$
- **Edge Cases:** Digits already in descending order (return $-1$), 32-bit overflow.

#### Q138: Largest Rectangle in Histogram
- **Difficulty:** `[Hard]` | **Pattern:** `[Monotonic Increasing Stack]`
- **Statement:** Find area of largest rectangle in histogram bars.
- **Optimal Approach:** Stack stores bar indices in increasing height order. When bar of smaller height seen, pop and compute area with popped bar as bottleneck height.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Bars all equal height, strictly increasing/decreasing heights.

#### Q139: Maximal Rectangle
- **Difficulty:** `[Hard]` | **Pattern:** `[2D Histogram DP + Monotonic Stack]`
- **Statement:** Find largest rectangle containing only 1s in a binary matrix.
- **Optimal Approach:** Maintain running heights of consecutive 1s for each row. For each row, run Largest Rectangle in Histogram on heights array.
- **Complexity:** Time: $O(R \cdot C)$ | Space: $O(C)$
- **Edge Cases:** Matrix with all 0s, single row or single column matrix.

#### Q140: Trapping Rain Water (Stack Approach)
- **Difficulty:** `[Hard]` | **Pattern:** `[Monotonic Decreasing Stack]`
- **Statement:** Compute trapped rain water using monotonic stack.
- **Optimal Approach:** Stack of bar indices in decreasing height. When taller bar encountered, pop bottom, compute water depth between current bar and new stack top.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Strictly monotonic elevations (traps 0).

#### Q141: Online Stock Span
- **Difficulty:** `[Medium]` | **Pattern:** `[Monotonic Stack with Accumulated Spans]`
- **Statement:** Find span of stock's price today (maximum consecutive days price was $\le$ today).
- **Optimal Approach:** Stack stores pairs `(price, span)`. While current price $\ge$ `stack.top().price`, pop and add top's span to current span.
- **Complexity:** Time: $O(1)$ amortized per query | Space: $O(n)$
- **Edge Cases:** Stock price hits all-time high.

#### Q142: 132 Pattern
- **Difficulty:** `[Medium]` | **Pattern:** `[Reverse Monotonic Stack]`
- **Statement:** Find if there exist indices $i < j < k$ such that $nums[i] < nums[k] < nums[j]$.
- **Optimal Approach:** Traverse from right to left with monotonic decreasing stack. Maintain `num_k = max(popped from stack)`. If $nums[i] < num\_k$, pattern found!
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Array length $< 3$.

#### Q143: Remove K Digits
- **Difficulty:** `[Medium]` | **Pattern:** `[Monotonic Increasing Stack Greedy]`
- **Statement:** Remove $k$ digits from number to make smallest possible value.
- **Optimal Approach:** Monotonic increasing stack. While $k > 0$ and current digit $<$ stack top, pop stack and decrement $k$. Strip leading zeroes.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Removing all digits (returns `"0"`), number with all identical digits.

#### Q144: Create Maximum Number
- **Difficulty:** `[Hard]` | **Pattern:** `[Monotonic Stack + Lexicographical Merge]`
- **Statement:** Create max number of length $k$ from two digit arrays preserving relative orders.
- **Optimal Approach:** For each valid $i \in [0, k]$, get max subsequence of size $i$ from $nums1$ and $k - i$ from $nums2$ using monotonic stacks. Merge and take max.
- **Complexity:** Time: $O(k \cdot (n + m + k))$ | Space: $O(k)$
- **Edge Cases:** $k = n + m$.

#### Q145: Asteroid Collision
- **Difficulty:** `[Medium]` | **Pattern:** `[Collision Stack]`
- **Statement:** Asteroids move left ($-$) or right ($+$). Collisions destroy smaller asteroid, or both if equal.
- **Optimal Approach:** Stack buffers asteroids moving right. When negative asteroid seen, resolve collisions with positive asteroids at stack top.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Asteroids moving away from each other (`[-2, 2]` never collide).

#### Q146: Decode String
- **Difficulty:** `[Medium]` | **Pattern:** `[Dual Stack Parsing]`
- **Statement:** Decode $k[\text{string}]$ patterns.
- **Optimal Approach:** Number stack and string stack. On `[`, push current multiplier and current string. On `]`, pop and repeat.
- **Complexity:** Time: $O(\text{output length})$ | Space: $O(n)$
- **Edge Cases:** Nested brackets `3[a2[c]]`.

#### Q147: Basic Calculator
- **Difficulty:** `[Hard]` | **Pattern:** `[Stack with Signs & Parentheses]`
- **Statement:** Evaluate mathematical expression containing `+`, `-`, `(`, `)`, and spaces.
- **Optimal Approach:** Maintain `result` and current `sign`. On `(`, push `result` and `sign` to stack; on `)`, pop and apply sign.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Unary minus `-(3 + 2)`, spaces everywhere.

#### Q148: Basic Calculator III
- **Difficulty:** `[Hard]` | **Pattern:** `[Recursion / Dual Stack Operators]`
- **Statement:** Evaluate expression with `+`, `-`, `*`, `/`, and nested parentheses `( )`.
- **Optimal Approach:** Operator precedence stack or recursive helper for matching parentheses, reducing to Basic Calculator II at each nesting level.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Negative results from sub-expressions.

#### Q149: Implement Queue using Stacks
- **Difficulty:** `[Easy]` | **Pattern:** `[Amortized Two Stacks]`
- **Statement:** Implement FIFO Queue using only two LIFO Stacks.
- **Optimal Approach:** `inStack` for pushes, `outStack` for pops. When `outStack` empty, transfer all elements from `inStack` to `outStack` (reversing order).
- **Complexity:** Time: $O(1)$ amortized per operation | Space: $O(n)$
- **Edge Cases:** Pop on empty queue.

#### Q150: Implement Stack using Queues
- **Difficulty:** `[Easy]` | **Pattern:** `[Single Queue Rotation]`
- **Statement:** Implement LIFO Stack using queues.
- **Optimal Approach:** On `push(x)`, enqueue $x$, then dequeue and re-enqueue all previous elements so $x$ is at front of queue.
- **Complexity:** Push: $O(n)$ | Pop/Top: $O(1)$ | Space: $O(n)$
- **Edge Cases:** Pop on empty stack.

#### Q151: Design Circular Queue
- **Difficulty:** `[Medium]` | **Pattern:** `[Fixed Array Modulo Ring]`
- **Statement:** Design ring buffer queue supporting `enQueue`, `deQueue`, `Front`, `Rear`, `isFull`, `isEmpty`.
- **Optimal Approach:** Array of size $k$. Maintain `head`, `count`. `tail = (head + count - 1) % k`.
- **Complexity:** Time: $O(1)$ all ops | Space: $O(k)$
- **Edge Cases:** Enqueue when full, dequeue when empty.

#### Q152: Design Circular Deque
- **Difficulty:** `[Medium]` | **Pattern:** `[Modulo Ring Bidirectional]`
- **Statement:** Design circular double-ended queue supporting front and rear operations.
- **Optimal Approach:** Array of size $k$. Maintain `front` and `rear` pointers with modulo wraparound: `front = (front - 1 + k) % k`.
- **Complexity:** Time: $O(1)$ all ops | Space: $O(k)$
- **Edge Cases:** Wraparound index underflow.

#### Q153: Sliding Window Maximum (Deque Approach)
- **Difficulty:** `[Hard]` | **Pattern:** `[Monotonic Decreasing Deque]`
- **Statement:** Return max element in sliding window of size $k$.
- **Optimal Approach:** Deque stores indices with values in descending order. Front of deque is always maximum of current window.
- **Complexity:** Time: $O(n)$ | Space: $O(k)$
- **Edge Cases:** $k = 1$, $k = n$.

#### Q154: Shortest Subarray with Sum at Least K
- **Difficulty:** `[Hard]` | **Pattern:** `[Monotonic Deque on Prefix Sums]`
- **Statement:** Find length of shortest non-empty subarray with sum $\ge k$ (array has negative numbers).
- **Optimal Approach:** Prefix sums $P$. Deque maintains indices $i$ with increasing $P[i]$. Pop front while $P[j] - P[\text{front}] \ge k$. Pop back if $P[j] \le P[\text{back}]$.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** No valid subarray exists (returns $-1$).

#### Q155: Constrained Subsequence Sum
- **Difficulty:** `[Hard]` | **Pattern:** `[Monotonic Deque DP]`
- **Statement:** Max sum of subsequence where consecutive picked elements have index gap $\le k$.
- **Optimal Approach:** $DP[i] = nums[i] + \max(0, \max_{i-k \le j < i} DP[j])$. Monotonic deque maintains maximum of last $k$ values of $DP$.
- **Complexity:** Time: $O(n)$ | Space: $O(k)$
- **Edge Cases:** All negative numbers (must pick maximum single element).

#### Q156: Jump Game VI
- **Difficulty:** `[Medium]` | **Pattern:** `[Monotonic Deque DP]`
- **Statement:** Max score to reach index $n-1$ jumping at most $k$ steps forward.
- **Optimal Approach:** $DP[i] = nums[i] + \max_{i-k \le j < i} DP[j]$. Monotonic decreasing deque maintains running max over window of size $k$.
- **Complexity:** Time: $O(n)$ | Space: $O(k)$
- **Edge Cases:** Negative scores, $k \ge n$.

#### Q157: Number of Visible People in a Queue
- **Difficulty:** `[Hard]` | **Pattern:** `[Reverse Monotonic Stack]`
- **Statement:** Person $i$ can see person $j$ ($i < j$) if everyone in between is shorter than both.
- **Optimal Approach:** Traverse right to left. While current person taller than stack top, pop and increment count. If stack still non-empty, increment count once more. Push current.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** Strictly increasing heights, strictly decreasing heights.

#### Q158: Minimum Remove to Make Valid Parentheses
- **Difficulty:** `[Medium]` | **Pattern:** `[Stack Index Marker]`
- **Statement:** Remove minimum parentheses so string is valid.
- **Optimal Approach:** Stack stores indices of unmatched `(`. On invalid `)`, mark for deletion. At end, mark remaining stack indices. Filter string.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** String with no parentheses, all unmatched parentheses.

#### Q159: Longest Valid Parentheses
- **Difficulty:** `[Hard]` | **Pattern:** `[Stack Index Boundary]`
- **Statement:** Find length of longest valid (well-formed) parentheses substring.
- **Optimal Approach:** Stack initialized with $-1$. For `(`, push index. For `)`, pop stack. If stack empty, push current index as new base; else update `maxLen = max(maxLen, i - stack.top())`.
- **Complexity:** Time: $O(n)$ | Space: $O(n)$
- **Edge Cases:** No valid parentheses (returns 0), entire string valid.

#### Q160: Score of Parentheses
- **Difficulty:** `[Medium]` | **Pattern:** `[Stack Depth Accumulation]`
- **Statement:** `()` scores 1, `AB` scores $A + B$, `(A)` scores $2 \times A$.
- **Optimal Approach:** Track current nesting depth. When `()` pattern encountered, add $2^{\text{depth}}$ to score.
- **Complexity:** Time: $O(n)$ | Space: $O(1)$
- **Edge Cases:** Flat sequences `()()` vs deeply nested `((()))`.

---

## References & Academic Attribution

1. **Skiena, S. S.** (2020). *The Algorithm Design Manual* (3rd ed.). Springer.
2. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.). MIT Press.
3. **USA Computing Olympiad (USACO)** & **CP-Algorithms Archives** (2024). Curated Competitive Programming and Algorithm Verification Standards.
