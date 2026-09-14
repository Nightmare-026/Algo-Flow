# Part 02: Linear Data Structures — Module 03: Singly Linked Lists

> **Topics Covered:**  
> 24. Singly Linked List Architecture & Heap Memory Layout &bull; Core Node Operations (Insert, Delete, Search, Access) &bull; In-Place 3-Pointer Reversal &bull; Floyd's Cycle-Finding Algorithm & Cycle Start Derivation &bull; Fast & Slow Pointer Patterns

---

# TOPIC 24: SINGLY LINKED LIST

### 1. Topic Title
**Singly Linked List (One-Way Node-Chained Dynamic Linear Structure)**

### 2. Category
Linear Data Structures — Non-Contiguous Node-Pointer Linked Allocation.

### 3. Difficulty
Beginner to Intermediate.

### 4. Prerequisites
- Part 01: Foundations (Pointers, Heap Memory Allocation, Dynamic References).
- Part 02: Static & Dynamic Arrays (Contiguous vs Non-Contiguous Memory trade-offs).

---

### 5. Definition & Intuitive Mental Model

### Concept
A **Singly Linked List** is a linear collection of data elements called **Nodes**, where the linear sequence is maintained not by physical adjacency in hardware memory, but by explicit unidirectional address pointers embedded within each node.

### Intuition: The Scavenger Hunt Analogy
Think of an Array as a row of numbered lockers placed side-by-side in a corridor ($0, 1, 2, 3$). To inspect locker 3, you simply walk directly to it in $O(1)$ time because its address is physically contiguous.

A Singly Linked List, by contrast, is a **treasure hunt / scavenger hunt**:
- You are given a clue to find the first location (`HEAD`).
- At the first location, you find a prize (`data`) and a slip of paper giving you the exact address of the next clue (`next`).
- You cannot jump directly to the 5th clue without physically visiting clues 1, 2, 3, and 4 in sequence.
- The final clue points to nowhere (`NULL`), marking the end of the journey.

---

### 6. Node Anatomy & Memory Layout

Each node consists of two distinct fields:
1. **Data Payload**: Stores the actual value (primitive integer, string, complex object).
2. **Next Pointer (`next`)**: Stores the 64-bit virtual memory heap address of the subsequent node.

```text
┌───────────────────────────────────────────────┐
│                     NODE                      │
├───────────────────────┬───────────────────────┤
│         data          │         next          │
│       (Value)         │       (Pointer)       │
│     e.g., 4 bytes     │     e.g., 8 bytes     │
└───────────────────────┴───────────┬───────────┘
                                    │
                                    ▼ Points to next Node's Heap Address
```

#### Physical Heap Allocation Reality:
Unlike arrays, which demand a single contiguous block of physical RAM, linked list nodes are scattered across the heap at non-contiguous locations created by individual dynamic memory allocations (`malloc` / `new`).

```text
HEAP MEMORY ADDRESS SPACE:
Address 0x10A0: [ Data: 10 │ Next: 0x20F4 ]  (Node 1 - HEAD)
Address 0x18B2: [ Unrelated Process Data  ]
Address 0x20F4: [ Data: 20 │ Next: 0x15C8 ]  (Node 2)
Address 0x15C8: [ Data: 30 │ Next: NULL   ]  (Node 3 - TAIL)
```

**Memory Overhead**: On modern 64-bit operating systems, pointers consume 8 bytes. Storing a 4-byte integer in a linked list requires $4 + 8 = 12$ bytes (padded to 16 bytes due to memory alignment), representing a **300% memory overhead** compared to flat arrays!

---

### 7. Structural Diagram (ASCII)

```text
  HEAD (Pointer)
   │
   ▼
┌──────┬──────┐        ┌──────┬──────┐        ┌──────┬──────┐
│  10  │  ●───┼───────►│  20  │  ●───┼───────►│  30  │ NULL │
└──────┴──────┘        └──────┴──────┘        └──────┴──────┘
  Node 1                 Node 2                 Node 3 (TAIL)
  Addr: 0x10A0           Addr: 0x20F4           Addr: 0x15C8
```

---

### 8. Operations & Asymptotic Complexities

| Operation | Best Case Time | Worst Case Time | Auxiliary Space | Key Condition / Notes |
| :--- | :---: | :---: | :---: | :--- |
| **InsertAtHead($x$)** | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ | Update new node's next to head, update head |
| **InsertAtTail($x$)** (with tail pointer) | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ | `tail.next ← newNode; tail ← newNode` |
| **InsertAtTail($x$)** (no tail pointer) | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ | Must traverse entire list to find last node |
| **InsertAtPosition($k, x$)** | $\Theta(1)$ | $\Theta(n)$ | $O(1)$ | $O(1)$ if $k=0$; requires $k-1$ traversals |
| **DeleteHead()** | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ | Advance head pointer to `head.next` |
| **DeleteTail()** | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ | Even with tail pointer, must find predecessor! |
| **DeleteByValue($x$)** | $\Theta(1)$ | $\Theta(n)$ | $O(1)$ | $\Theta(1)$ if at head; $\Theta(n)$ if at end or missing |
| **Search($x$)** | $\Theta(1)$ | $\Theta(n)$ | $O(1)$ | Linear scan from head |
| **AccessByIndex($i$)** | $\Theta(1)$ | $\Theta(n)$ | $O(1)$ | No pointer arithmetic possible; must step $i$ times |
| **ReverseInPlace()** | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ | 3-pointer sliding window |

---

### 9. Detailed Operation Visualizations

#### A. Insertion at Head ($O(1)$)
```text
BEFORE:
  HEAD ────────► [ 20 │ ● ] ──► [ 30 │ NULL ]

ACTION:
  1. Allocate new node with value 10:    [ 10 │ ? ]
  2. Assign newNode.next ← HEAD:         [ 10 │ ● ] ──► [ 20 │ ● ]
  3. Reassign HEAD ← newNode

AFTER:
  HEAD ────────► [ 10 │ ● ] ──► [ 20 │ ● ] ──► [ 30 │ NULL ]
```

#### B. Insertion at Arbitrary Position $k$ ($O(n)$)
```text
Goal: Insert 25 between Node 20 (pos 1) and Node 30 (pos 2).

STEP 1: Traverse to predecessor (Node 20):
  curr ──► [ 20 │ ● ] ──────────────► [ 30 │ NULL ]
                   \                 ▲
                    \               /
STEP 2: newNode.next ← curr.next   /
        newNode: [ 25 │ ● ] ──────┘

STEP 3: curr.next ← newNode
  [ 20 │ ● ] ──► [ 25 │ ● ] ──► [ 30 │ NULL ]
```

#### C. Deletion at Tail ($O(n)$ — Why Singly Linked Lists Struggle Here)
```text
Even if we have a direct TAIL pointer to Node 30:
  HEAD ──► [ 10 │ ● ] ──► [ 20 │ ● ] ──► [ 30 │ NULL ] ◄── TAIL

To delete Node 30:
- We must update Node 20's next pointer to NULL.
- But Singly Linked Nodes only point FORWARD! There is NO `prev` pointer!
- Therefore, we must traverse all the way from HEAD to Node 20 ($n-1$ steps)
  just to find the predecessor!
```

---

### 10. Complete Language-Independent Pseudocode

```text
STRUCTURE Node
    data: ValueType
    next: Node pointer

STRUCTURE SinglyLinkedList
    head: Node pointer ← NULL
    tail: Node pointer ← NULL
    size: integer ← 0

    OPERATION InsertAtHead(val):
        newNode ← allocate Node
        newNode.data ← val
        newNode.next ← head
        head ← newNode
        if size = 0:
            tail ← newNode
        size ← size + 1

    OPERATION InsertAtTail(val):
        newNode ← allocate Node
        newNode.data ← val
        newNode.next ← NULL
        if size = 0:
            head ← newNode
            tail ← newNode
        else:
            tail.next ← newNode
            tail ← newNode
        size ← size + 1

    OPERATION InsertAtPosition(index, val):
        if index < 0 or index > size:
            error "Index out of bounds"
        if index = 0:
            InsertAtHead(val)
            return
        if index = size:
            InsertAtTail(val)
            return
        
        curr ← head
        for i ← 0 to index - 2:
            curr ← curr.next
        
        newNode ← allocate Node
        newNode.data ← val
        newNode.next ← curr.next
        curr.next ← newNode
        size ← size + 1

    OPERATION DeleteHead():
        if head = NULL:
            error "Underflow: List is empty"
        temp ← head
        head ← head.next
        deallocate temp
        size ← size - 1
        if size = 0:
            tail ← NULL

    OPERATION DeleteTail():
        if head = NULL:
            error "Underflow: List is empty"
        if head = tail:
            deallocate head
            head ← NULL
            tail ← NULL
            size ← 0
            return
        
        curr ← head
        while curr.next ≠ tail:
            curr ← curr.next
        
        deallocate tail
        tail ← curr
        tail.next ← NULL
        size ← size - 1

    OPERATION DeleteByValue(target):
        if head = NULL:
            return false
        if head.data = target:
            DeleteHead()
            return true
        
        curr ← head
        while curr.next ≠ NULL and curr.next.data ≠ target:
            curr ← curr.next
        
        if curr.next = NULL:
            return false   // Target not found
        
        temp ← curr.next
        curr.next ← curr.next.next
        if temp = tail:
            tail ← curr
        deallocate temp
        size ← size - 1
        return true

    OPERATION Search(target):
        curr ← head
        index ← 0
        while curr ≠ NULL:
            if curr.data = target:
                return index
            curr ← curr.next
            index ← index + 1
        return -1
```

---

### 11. In-Place 3-Pointer Reversal

Reversing a linked list without allocating new nodes is a classic fundamental technique requiring three sliding pointer variables: `prev`, `curr`, and `nextNode`.

#### Algorithmic Invariant & State Machine:
At the start of every iteration:
- The sublist strictly before `curr` has already been fully reversed, with `prev` pointing to its new head.
- `curr` points to the unreversed remainder of the list.

```text
ALGORITHM ReverseList(head)
    Input: Pointer to list head
    Output: Pointer to new reversed head

1.  prev ← NULL
2.  curr ← head
3.  while curr ≠ NULL:
4.      nextNode ← curr.next    // 1. Preserve forward reference
5.      curr.next ← prev        // 2. Reverse link to point backward
6.      prev ← curr             // 3. Slide prev one step forward
7.      curr ← nextNode         // 4. Slide curr one step forward
8.  return prev                 // prev now points to new head
```

#### Step-by-Step Dry Run Table: Reversing $[10 \to 20 \to 30 \to \text{NULL}]$

| Step | `prev` | `curr` | `nextNode` (`curr.next`) | Link Action (`curr.next ← prev`) | Next `prev` | Next `curr` |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Init** | `NULL` | Node(10) | — | — | — | — |
| **Iteration 1** | `NULL` | Node(10) | Node(20) | Node(10).next $\leftarrow$ `NULL` | Node(10) | Node(20) |
| **Iteration 2** | Node(10) | Node(20) | Node(30) | Node(20).next $\leftarrow$ Node(10) | Node(20) | Node(30) |
| **Iteration 3** | Node(20) | Node(30) | `NULL` | Node(30).next $\leftarrow$ Node(20) | Node(30) | `NULL` |
| **Termination** | Node(30) | `NULL` | — | Loop ends (`curr = NULL`). Return `prev` = Node(30) | — | — |

**Final State**: $\text{HEAD} \to [30] \to [20] \to [10] \to \text{NULL}$. Time: $O(n)$, Auxiliary Space: $O(1)$.

---

### 12. Floyd's Cycle-Finding Algorithm (Tortoise and Hare)

### Concept
Given a linked list, determine if it contains a closed loop (cycle) and identify the exact node where the cycle begins, using only $O(1)$ auxiliary space.

```text
CYCLE TOPOLOGY:
HEAD
 │
 ▼
[ 1 ] ──► [ 2 ] ──► [ 3 ] ──► [ 4 ] ──► [ 5 ]
                       ▲                   │
                       │                   ▼
                     [ 8 ] ◄── [ 7 ] ◄── [ 6 ]
```

#### Mathematical Proof of Detection & Meeting Point:
Let:
- $L$ = Distance from `HEAD` to the cycle entry node ($[1] \to [3] \implies L = 2$).
- $C$ = Length of the cycle ($[3, 4, 5, 6, 7, 8] \implies C = 6$).
- $d$ = Distance from cycle entry to the point where `slow` and `fast` collide.

1. `slow` moves at speed $1$; `fast` moves at speed $2$.
2. Relative speed of `fast` relative to `slow` is $2 - 1 = 1$ node per step.
3. Once both pointers are inside the cycle of length $C$, `fast` reduces the distance between them by $1$ in each step. Therefore, `fast` is guaranteed to catch `slow` within at most $C$ steps! **No infinite loop can occur.**
4. At the meeting moment, let total steps taken be $k$:
   $$\text{Distance}(\text{slow}) = k = L + m_1 C + d$$
   $$\text{Distance}(\text{fast}) = 2k = L + m_2 C + d$$
   Subtracting the two equations:
   $$k = (m_2 - m_1) C = n \cdot C$$
   *The total number of steps $k$ is an exact integer multiple of the cycle length $C$!*

5. Therefore:
   $$L + d = k = n \cdot C \implies L = n \cdot C - d = (n - 1) C + (C - d)$$
   Notice what $(C - d)$ represents: it is the remaining distance from the collision point to the cycle entry!
   **Fundamental Insight**: The distance from `HEAD` to cycle entry ($L$) equals the distance from the meeting point to cycle entry ($C - d$, plus optional full loops).

6. **Algorithm to Find Cycle Start**:
   - Move `slow` back to `HEAD`.
   - Keep `fast` at the collision point.
   - Advance **both** pointers at the same speed of $1$ step.
   - They will collide at the exact cycle entry node!

```text
ALGORITHM FindCycleEntry(head)
    Input: List head pointer
    Output: Pointer to cycle entry node, or NULL if acyclic

1.  slow ← head
2.  fast ← head
3.  hasCycle ← false
4.  while fast ≠ NULL and fast.next ≠ NULL:
5.      slow ← slow.next
6.      fast ← fast.next.next
7.      if slow = fast:
8.          hasCycle ← true
9.          break
10. if not hasCycle:
11.     return NULL
12. 
13. // Phase 2: Locate Entry
14. slow ← head
15. while slow ≠ fast:
16.     slow ← slow.next
17.     fast ← fast.next
18. return slow
```

---

### 13. Fast & Slow Pointer Variations

1. **Find Middle Node of List**:
   - `slow` moves 1 step, `fast` moves 2 steps.
   - When `fast` reaches tail or `NULL`, `slow` is guaranteed to be at $\lfloor n/2 \rfloor$ (the exact middle).
   - Crucial for **Merge Sort on Linked Lists**.
2. **Find $k$-th Node from End**:
   - Advance `fast` pointer $k$ steps ahead first.
   - Then advance both `slow` and `fast` by 1 step together until `fast = NULL`.
   - `slow` lands precisely at the $k$-th node from the end.

---

### 14. Array vs Singly Linked List: Hardware Reality

| Metric | Array / Dynamic Array | Singly Linked List |
| :--- | :--- | :--- |
| **Physical Memory Layout** | Strictly contiguous | Dispersed across heap |
| **Random Access ($A[i]$)** | $O(1)$ direct hardware arithmetic | $O(n)$ linear traversal |
| **Insert / Delete at Head** | $O(n)$ due to shifting | $O(1)$ pointer reassignment |
| **Insert / Delete at Middle** | $O(n)$ element copying | $O(1)$ after reaching location ($O(n)$ search) |
| **CPU Cache Performance** | **Optimal**: Spatial locality enables prefetching | **Poor**: Frequent L1/L2 cache misses |
| **Memory Overhead** | Minimal (capacity buffer padding) | Heavy (8 bytes pointer per node) |
| **Memory Fragmentation** | Requires large contiguous free blocks | Eliminates external fragmentation |

---

## Module 03 Summary & Key Takeaways

1. **Singly Linked Lists** excel at constant-time insertion and deletion at the head ($O(1)$), but cannot support $O(1)$ random indexing.
2. In-place reversal uses **3 sliding pointers** (`prev`, `curr`, `nextNode`) in $O(n)$ time and $O(1)$ memory.
3. **Floyd's Tortoise and Hare** detects cycles in $O(n)$ time and proves that resetting one pointer to `head` and advancing both at speed 1 finds the cycle entry.
4. Linked lists incur non-trivial pointer memory overhead (8 bytes per node) and poor CPU cache locality compared to contiguous arrays.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 10: Elementary Data Structures. MIT Press.
2. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.3: Bags, Queues, and Stacks. Addison-Wesley.
3. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.2: Linear Lists. Addison-Wesley.
