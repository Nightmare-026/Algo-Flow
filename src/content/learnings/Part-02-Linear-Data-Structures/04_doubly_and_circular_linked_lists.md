# Part 02: Linear Data Structures — Module 04: Doubly & Circular Linked Lists

> **Topics Covered:**  
> 25. Doubly Linked List (DLL) Architecture & Bi-Directional Traversal &bull; $O(1)$ Arbitrary Deletion Mechanics &bull; The Sentinel / Dummy Node Pattern &bull; 26. Circular Singly Linked List (CSLL) &bull; Circular Doubly Linked List (CDLL) &bull; The Josephus Elimination Problem & Simulation

---

# TOPIC 25: DOUBLY LINKED LIST

### 1. Topic Title
**Doubly Linked List (Two-Way Bi-Directional Node-Pointer Linear Structure)**

### 2. Category
Linear Data Structures — Non-Contiguous Node-Pointer Linked Allocation.

### 3. Difficulty
Intermediate.

### 4. Prerequisites
- Module 03: Singly Linked Lists (Pointers, Head/Tail references, Pointer reassignment).

---

### 5. Definition & Motivation

### Concept
A **Doubly Linked List (DLL)** is a sequence of nodes where each node contains **two pointers**:
1. `next`: Points to the immediate succeeding node in sequence.
2. `prev`: Points to the immediate preceding node in sequence.

```text
┌─────────────────────────────────────────────────────────┐
│                       DOUBLY NODE                       │
├───────────────────┬─────────────────┬───────────────────┤
│       prev        │      data       │       next        │
│     (Pointer)     │     (Value)     │     (Pointer)     │
│   e.g., 8 bytes   │  e.g., 4 bytes  │   e.g., 8 bytes   │
└─────────┬─────────┴─────────────────┴─────────┬─────────┘
          │                                     │
          ▼ Points to Predecessor               ▼ Points to Successor
```

### Why Do We Need Doubly Linked Lists?
In a Singly Linked List:
- You cannot move backward; finding a predecessor requires a full $O(n)$ scan from `HEAD`.
- Deleting the tail node requires $O(n)$ time even if you hold a direct pointer to `TAIL`!
- Deleting any arbitrary node $X$ requires $O(n)$ time to discover the node pointing to $X$.

**Doubly Linked Lists solve this completely**: Given a direct reference to any node $X$, deletion and bidirectional traversal take guaranteed **$O(1)$ constant time**!

---

### 6. Structural Diagram (ASCII)

```text
       HEAD                                                                    TAIL
        │                                                                       │
        ▼                                                                       ▼
NULL ◄──[ prev │ 10 │ next ] ◄══► [ prev │ 20 │ next ] ◄══► [ prev │ 30 │ next ] ──► NULL
         Addr: 0x10A0               Addr: 0x20F4               Addr: 0x15C8
```

---

### 7. Operations & Asymptotic Complexities

| Operation | Best Case Time | Worst Case Time | Auxiliary Space | Key Note |
| :--- | :---: | :---: | :---: | :--- |
| **InsertAtHead($x$)** | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ | Updates `new.next` and `oldHead.prev` |
| **InsertAtTail($x$)** | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ | $O(1)$ direct via tail pointer |
| **InsertBeforeNode($N, x$)** | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ | Constant time without scanning! |
| **InsertAfterNode($N, x$)** | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ | Constant time without scanning |
| **DeleteHead()** | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ | Advance head, set new `head.prev ← NULL` |
| **DeleteTail()** | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ | **$O(1)$ vs $O(n)$ in Singly List!** |
| **DeleteNode($N$)** | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ | **$O(1)$ arbitrary deletion superpower!** |
| **Search($x$)** | $\Theta(1)$ | $\Theta(n)$ | $O(1)$ | Linear scan (can search from head or tail) |
| **TraverseBackward()** | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ | Follow `prev` pointers starting from `tail` |

---

### 8. The Superpower of DLLs: $O(1)$ Arbitrary Deletion

In systems programming, database caches, and browser history engines, we frequently need to delete a node when we already hold a reference to it (e.g., hash map pointing directly to cache node in an LRU Cache).

```text
BEFORE DELETION (Targeting Node 20):
[ 10 │ next ] ◄═══════► [ prev │ 20 │ next ] ◄═══════► [ prev │ 30 ]
   (predecessor)             (target node)              (successor)

ACTION:
  1. target.prev.next ← target.next    // Node 10 points forward directly to 30
  2. target.next.prev ← target.prev    // Node 30 points backward directly to 10
  3. deallocate target

AFTER DELETION:
[ 10 │ next ] ◄════════════════════════════════════════► [ prev │ 30 ]
```

---

### 9. The Sentinel (Dummy) Node Pattern

### THE PROBLEM: Pointer Edge-Case Hell
In raw linked lists, you must constantly check for boundary edge cases:
- Is the list currently empty (`head = NULL`)?
- Are we deleting the only remaining node?
- Are we inserting before `head` (requires updating `head`)?
- Are we inserting after `tail` (requires updating `tail`)?

### Solution: Sentinels
Introduce permanent, invariant **Dummy Head** and **Dummy Tail** nodes that never change and never hold user data:

```text
EMPTY LIST WITH SENTINELS:
┌───────────────────────────┐         ┌───────────────────────────┐
│        DUMMY HEAD         │ ◄═════► │        DUMMY TAIL         │
│  [ NULL │ DUMMY │ next ]  │         │  [ prev │ DUMMY │ NULL ]  │
└───────────────────────────┘         └───────────────────────────┘

POPULATED LIST WITH SENTINELS:
[ DUMMY HEAD ] ◄══► [ Node 10 ] ◄══► [ Node 20 ] ◄══► [ Node 30 ] ◄══► [ DUMMY TAIL ]
```

**Why Sentinels are Architectural Gold**:
Every real data node *always* has a valid, non-null predecessor and a valid, non-null successor! Special-case `if (head == NULL)` checks completely vanish from your codebase.

---

### 10. Complete Language-Independent Pseudocode (Sentinel DLL)

```text
STRUCTURE DoublyNode
    data: ValueType
    prev: DoublyNode pointer ← NULL
    next: DoublyNode pointer ← NULL

STRUCTURE DoublyLinkedList
    headSentinel: DoublyNode pointer
    tailSentinel: DoublyNode pointer
    size: integer ← 0

    OPERATION Initialize():
        headSentinel ← allocate DoublyNode
        tailSentinel ← allocate DoublyNode
        headSentinel.next ← tailSentinel
        tailSentinel.prev ← headSentinel
        size ← 0

    OPERATION InsertAtHead(val):
        InsertAfterNode(headSentinel, val)

    OPERATION InsertAtTail(val):
        InsertBeforeNode(tailSentinel, val)

    OPERATION InsertAfterNode(targetNode, val):
        newNode ← allocate DoublyNode
        newNode.data ← val
        
        successor ← targetNode.next
        
        newNode.prev ← targetNode
        newNode.next ← successor
        targetNode.next ← newNode
        successor.prev ← newNode
        
        size ← size + 1

    OPERATION InsertBeforeNode(targetNode, val):
        InsertAfterNode(targetNode.prev, val)

    OPERATION DeleteNode(targetNode):
        if targetNode = headSentinel or targetNode = tailSentinel:
            error "Cannot delete sentinel boundary node"
        
        predecessor ← targetNode.prev
        successor ← targetNode.next
        
        predecessor.next ← successor
        successor.prev ← predecessor
        
        deallocate targetNode
        size ← size - 1

    OPERATION DeleteHead():
        if size = 0:
            error "Underflow: List is empty"
        DeleteNode(headSentinel.next)

    OPERATION DeleteTail():
        if size = 0:
            error "Underflow: List is empty"
        DeleteNode(tailSentinel.prev)
```

---
---

# TOPIC 26: CIRCULAR LINKED LIST

### 1. Topic Title
**Circular Linked List (Endless Loop Linear Ring Buffer)**

### 2. Category
Linear Data Structures — Cyclic Node-Pointer Linked Allocation.

### 3. Structural Variations

#### Variation A: Circular Singly Linked List (CSLL)
The last node's `next` pointer points back to `head`:
```text
           HEAD
            │
            ▼
        ┌──────┬──────┐        ┌──────┬──────┐
   ┌───►│  10  │  ●───┼───────►│  20  │  ●───┼──┐
   │    └──────┴──────┘        └──────┴──────┘  │
   │                                            │
   │    ┌──────┬──────┐                         │
   └───┬┤  30  │  ●───┼─────────────────────────┘
       │└──────┴──────┘
      TAIL
```

#### Variation B: Circular Doubly Linked List (CDLL)
A complete two-way symmetrical ring where:
- `head.prev = tail`
- `tail.next = head`

```text
                ┌───────────────────────────────────────────────┐
                │                                               │
                ▼                                               │
NULL ◄── [ prev │ 10 │ next ] ◄══► [ prev │ 20 │ next ] ◄══► [ prev │ 30 │ next ] ──► NULL
   ▲                                                            │
   └────────────────────────────────────────────────────────────┘
```

---

### 4. Efficient Representation: Single `tail` Pointer

In a Circular Singly Linked List, maintaining a pointer to `TAIL` is strictly superior to maintaining a pointer to `HEAD`!
- Why? Because `tail.next` is automatically `HEAD`!
- Therefore, having `TAIL` grants you:
  - Immediate $O(1)$ access to the tail node (`tail`).
  - Immediate $O(1)$ access to the head node (`tail.next`).
  - Insertion at Head in $O(1)$: Insert after `tail`.
  - Insertion at Tail in $O(1)$: Insert after `tail`, then update `tail ← tail.next`.

```text
ALGORITHM InsertAtHeadCSLL(tail, val):
1.  newNode ← allocate Node(val)
2.  if tail = NULL:
3.      newNode.next ← newNode
4.      return newNode   // tail points to the single node
5.  newNode.next ← tail.next
6.  tail.next ← newNode
7.  return tail

ALGORITHM InsertAtTailCSLL(tail, val):
1.  newNode ← allocate Node(val)
2.  if tail = NULL:
3.      newNode.next ← newNode
4.      return newNode
5.  newNode.next ← tail.next
6.  tail.next ← newNode
7.  return newNode       // newNode becomes the new tail!
```

---

### 5. Classic Application: The Josephus Problem

### THE PROBLEM
$n$ people stand in a circle numbered $1$ to $n$. A count begins at person $1$ and moves around the circle in a fixed direction. In each step, the $k$-th person is executed/eliminated. The circle closes, and counting resumes from the person immediately following the eliminated one. Find the safe position that guarantees survival.

#### Circular Linked List Simulation:
Create a circular linked list of $n$ nodes ($1 \to 2 \to \dots \to n \to 1$). Advance $k-1$ steps, delete the target node, and repeat until only $1$ node remains.

```text
ALGORITHM JosephusSurvivor(n, k)
    Input: Number of people n, step count k
    Output: Value of surviving node

1.  head ← allocate Node(1)
2.  prevNode ← head
3.  for i ← 2 to n:
4.      curr ← allocate Node(i)
5.      prevNode.next ← curr
6.      prevNode ← curr
7.  prevNode.next ← head      // Close the ring!
8.  
9.  curr ← head
10. while curr.next ≠ curr:   // While more than 1 node remains
11.     for count ← 1 to k - 2:
12.         curr ← curr.next
13.     // Delete next node (k-th person)
14.     eliminated ← curr.next
15.     curr.next ← eliminated.next
16.     deallocate eliminated
17.     curr ← curr.next      // Advance to next starter
18. return curr.data
```

#### Step-by-Step State Table: $n = 5$ People, $k = 2$ Elimination Step

| Round | Active Circle Nodes | Counting from | Steps Advanced ($k-1$) | Eliminated Person | Remaining Circle |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **Round 1** | $1 \to 2 \to 3 \to 4 \to 5$ | Node 1 | 1 step ($1 \to 2$) | **Person 2** | $3 \to 4 \to 5 \to 1$ |
| **Round 2** | $3 \to 4 \to 5 \to 1$ | Node 3 | 1 step ($3 \to 4$) | **Person 4** | $5 \to 1 \to 3$ |
| **Round 3** | $5 \to 1 \to 3$ | Node 5 | 1 step ($5 \to 1$) | **Person 1** | $3 \to 5$ |
| **Round 4** | $3 \to 5$ | Node 3 | 1 step ($3 \to 5$) | **Person 5** | **Person 3** |

**Survivor**: **Person 3**. Time Complexity: $O(n \cdot k)$, Auxiliary Space: $O(n)$.

---

## Module 04 Summary & Key Takeaways

1. **Doubly Linked Lists** trade 8 additional bytes of pointer memory per node for **$O(1)$ arbitrary deletion** and bidirectional traversals.
2. The **Sentinel pattern** replaces null boundary checks with invariant dummy nodes, preventing off-by-one pointer errors.
3. In **Circular Singly Linked Lists**, storing only a pointer to **TAIL** provides $O(1)$ access to both `tail` and `head` (`tail.next`).
4. **Circular Linked Lists** naturally model periodic round-robin schedulers and token-ring networks without edge-case resets.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 10: Elementary Data Structures. MIT Press.
2. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.3: Bags, Queues, and Stacks. Addison-Wesley.
3. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.2: Linear Lists. Addison-Wesley.
