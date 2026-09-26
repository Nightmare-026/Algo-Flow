# Part 02: Linear Data Structures — Module 04: Doubly & Circular Linked Lists

> **Topics Covered:**  
> 25. Doubly Linked List (DLL) Architecture & Bi-Directional Traversal &bull; $O(1)$ Arbitrary Deletion Mechanics &bull; The Sentinel / Dummy Node Pattern &bull; 26. Circular Singly Linked List (CSLL) &bull; Circular Doubly Linked List (CDLL) &bull; The Josephus Elimination Problem & Simulation

---

While singly linked lists provide unidirectional linear chains, systems programming and high-performance caching require bi-directional navigation and true $O(1)$ arbitrary node removals. Doubly linked lists achieve this by embedding both predecessor (`prev`) and successor (`next`) references within each node, while circular variants loop terminal pointers back to the entry node to form endless ring buffers. This chapter details bidirectional heap node topologies, sentinel-based elimination of boundary pointer edge cases, the mechanics of constant-time arbitrary deletion, and cyclic simulations including the classic Josephus elimination problem.

### Learning Objectives

- Differentiate the memory layouts, pointer alignment overheads, and traversal capabilities of singly, doubly, and circular linked structures.
- Prove why holding a direct node reference enables true $O(1)$ deletion in doubly linked lists versus $O(n)$ in singly linked lists.
- Implement the Sentinel (Dummy Head & Tail) architectural pattern to eliminate null-pointer branch penalties and edge-case exceptions.
- Construct Circular Singly Linked Lists (CSLL) using a single `tail` pointer to guarantee $O(1)$ insertions at both ends without tracking `head`.
- Formulate the Josephus elimination problem using circular pointer chains and verify the simulation against the closed-form recurrence $J(n, 2) = 2(n - 2^{\lfloor \log_2 n \rfloor}) + 1$.

---

## Topic 25: Doubly Linked Lists (DLL)

### 1. Conceptual Architecture & Node Anatomy

A **Doubly Linked List (DLL)** is a sequence of dynamically allocated nodes where each node contains **two pointers**:

1. `next`: Stores the virtual heap address of the succeeding node.
2. `prev`: Stores the virtual heap address of the preceding node.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        64-BIT DOUBLY NODE LAYOUT                        │
├───────────────────┬───────────────────┬─────────────────────────────────┤
│    prev pointer   │   data payload    │          next pointer           │
│     (8 bytes)     │     (4 bytes)     │           (8 bytes)             │
│   Offset: +0      │    Offset: +8     │          Offset: +16            │
└───────────────────┴───────────────────┴─────────────────────────────────┘
```

| Field         | Type             | Size (64-bit Architecture) | Alignment / Offset | Architectural Function                                   |
| :------------ | :--------------- | :------------------------: | :----------------: | :------------------------------------------------------- |
| **`prev`**    | Node Reference   |      $8\text{ bytes}$      |    Offset $+0$     | Holds virtual heap address of immediate predecessor node |
| **`data`**    | Value / Payload  |      $4\text{ bytes}$      |    Offset $+8$     | Stores client data (e.g., 32-bit integer)                |
| **`padding`** | System Alignment |      $4\text{ bytes}$      |    Offset $+12$    | Padding to preserve 8-byte boundary alignment            |
| **`next`**    | Node Reference   |      $8\text{ bytes}$      |    Offset $+16$    | Holds virtual heap address of immediate successor node   |

Total node size is $24\text{ bytes}$. Compared to a flat array storing a 4-byte integer, a DLL node incurs a **$500\%$ memory overhead**.

#### Virtual Memory Layout Example

|  Logical Position   | Virtual Heap Address | `prev` Pointer | `data` Value | `next` Pointer | Semantic Role                      |
| :-----------------: | :------------------- | :------------: | :----------: | :------------: | :--------------------------------- |
| **Node 1 (`HEAD`)** | `0x10A0`             | `NULL` (`0x0`) |     `10`     |    `0x20F4`    | First data node; no predecessor    |
|     **Node 2**      | `0x20F4`             |    `0x10A0`    |     `20`     |    `0x15C8`    | Interior node; bidirectional links |
| **Node 3 (`TAIL`)** | `0x15C8`             |    `0x20F4`    |     `30`     | `NULL` (`0x0`) | Last data node; no successor       |

---

### 2. Operations & Asymptotic Complexities

| Operation                    |  Best Case  | Average Case | Worst Case  | Auxiliary Space | Comparison vs. Singly Linked List                                   |
| :--------------------------- | :---------: | :----------: | :---------: | :-------------: | :------------------------------------------------------------------ |
| **InsertAtHead($x$)**        | $\Theta(1)$ | $\Theta(1)$  | $\Theta(1)$ |     $O(1)$      | Identical $O(1)$ bound; requires updating `oldHead.prev`            |
| **InsertAtTail($x$)**        | $\Theta(1)$ | $\Theta(1)$  | $\Theta(1)$ |     $O(1)$      | Identical $O(1)$ bound via `tail` reference                         |
| **DeleteHead()**             | $\Theta(1)$ | $\Theta(1)$  | $\Theta(1)$ |     $O(1)$      | Identical $O(1)$ bound; sets new `head.prev = NULL`                 |
| **DeleteTail()**             | $\Theta(1)$ | $\Theta(1)$  | $\Theta(1)$ |     $O(1)$      | **$O(1)$ vs $O(n)$ in SLL** (immediate predecessor via `tail.prev`) |
| **DeleteNode($N$)**          | $\Theta(1)$ | $\Theta(1)$  | $\Theta(1)$ |     $O(1)$      | **$O(1)$ arbitrary deletion** without scanning from head            |
| **InsertBeforeNode($N, x$)** | $\Theta(1)$ | $\Theta(1)$  | $\Theta(1)$ |     $O(1)$      | **$O(1)$ vs $O(n)$ in SLL** (direct access to $N.\text{prev}$)      |
| **InsertAfterNode($N, x$)**  | $\Theta(1)$ | $\Theta(1)$  | $\Theta(1)$ |     $O(1)$      | $O(1)$ constant time pointer insertion                              |
| **Search($x$)**              | $\Theta(1)$ | $\Theta(n)$  | $\Theta(n)$ |     $O(1)$      | Linear scan; can traverse from `head` or `tail`                     |
| **ReverseInPlace()**         | $\Theta(n)$ | $\Theta(n)$  | $\Theta(n)$ |     $O(1)$      | Swap `prev` and `next` pointers on every node                       |

---

### 3. The Superpower of DLLs: $O(1)$ Arbitrary Deletion

In cache eviction systems (e.g., Least Recently Used / LRU Cache) and OS process scheduling queues, an algorithm frequently needs to evict an item given a direct reference to that node (for instance, retrieved from an auxiliary hash map).

- In a **Singly Linked List**, deleting node $X$ requires starting at `HEAD` and walking forward until finding node $P$ whose `next == X` ($\Theta(n)$ time).
- In a **Doubly Linked List**, node $X$ already knows its predecessor ($X.\text{prev}$) and its successor ($X.\text{next}$). Deletion requires only rewiring two pointers!

#### State Transition Table: Deleting Node $20$ from $[10 \leftrightarrow 20 \leftrightarrow 30]$

| Step  | Action Taken              | Pointer Expression               | Consequence                                                        |
| :---: | :------------------------ | :------------------------------- | :----------------------------------------------------------------- |
| **1** | Point predecessor forward | `target.prev.next = target.next` | Node 10's `next` now skips Node 20 to point directly to Node 30    |
| **2** | Point successor backward  | `target.next.prev = target.prev` | Node 30's `prev` now skips Node 20 to point directly to Node 10    |
| **3** | Deallocate target node    | `free(target)`                   | Node 20 memory reclaimed; $[10 \leftrightarrow 30]$ remains intact |

$$\text{Time Complexity} = \Theta(1), \quad \text{Auxiliary Space} = O(1)$$

---

### 4. The Sentinel (Dummy) Node Architectural Pattern

Managing boundary conditions in raw linked lists leads to conditional branches for empty lists, single-element lists, head mutations, and tail mutations.

#### The Sentinel Solution

Introduce two permanent invariant nodes that hold no client data:

- `headSentinel`: Always sits before the first true data node.
- `tailSentinel`: Always sits after the last true data node.

```
Empty List with Sentinels:
[ headSentinel ] <===================> [ tailSentinel ]
(prev = NULL, next = tailSentinel)     (prev = headSentinel, next = NULL)

Populated List with Sentinels:
[ headSentinel ] <===> [ Node 10 ] <===> [ Node 20 ] <===> [ Node 30 ] <===> [ tailSentinel ]
```

<svg viewBox="0 0 880 210" width="100%" height="auto" class="rounded-xl border border-border shadow-sm my-6 bg-surface">
  <defs>
    <marker id="biArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L0,6 L6,3 z" fill="currentColor" fill-opacity="0.4" />
    </marker>
  </defs>
  <!-- Background Bounds -->
  <rect x="20" y="20" width="840" height="170" rx="10" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" />

  <!-- Head Sentinel Node -->
  <rect x="40" y="70" width="120" height="50" rx="8" fill="#3b82f6" fill-opacity="0.12" stroke="#3b82f6" stroke-width="2" />
  <text x="100" y="93" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#3b82f6">headSentinel</text>
  <text x="100" y="110" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" fill="currentColor" fill-opacity="0.7">prev=NULL, next=N1</text>

  <!-- Connectors Head -> Node 1 -->
  <line x1="160" y1="85" x2="210" y2="85" stroke="#10b981" stroke-width="2" marker-end="url(#biArrow)" />
  <line x1="210" y1="105" x2="160" y2="105" stroke="#3b82f6" stroke-width="2" marker-end="url(#biArrow)" />

  <!-- Data Node 10 -->
  <rect x="210" y="70" width="110" height="50" rx="8" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="2" />
  <text x="265" y="93" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#10b981">Node(10)</text>
  <text x="265" y="110" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" fill="currentColor" fill-opacity="0.7">Client Payload</text>

  <!-- Connectors Node 1 -> Node 2 -->
  <line x1="320" y1="85" x2="370" y2="85" stroke="#10b981" stroke-width="2" marker-end="url(#biArrow)" />
  <line x1="370" y1="105" x2="320" y2="105" stroke="#10b981" stroke-width="2" marker-end="url(#biArrow)" />

  <!-- Data Node 20 (Target Deletion) -->
  <rect x="370" y="70" width="110" height="50" rx="8" fill="#8b5cf6" fill-opacity="0.15" stroke="#8b5cf6" stroke-width="2" />
  <text x="425" y="93" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#8b5cf6">Node(20)</text>
  <text x="425" y="110" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" fill="currentColor" fill-opacity="0.7">targetNode</text>

  <!-- Connectors Node 2 -> Node 3 -->
  <line x1="480" y1="85" x2="530" y2="85" stroke="#10b981" stroke-width="2" marker-end="url(#biArrow)" />
  <line x1="530" y1="105" x2="480" y2="105" stroke="#8b5cf6" stroke-width="2" marker-end="url(#biArrow)" />

  <!-- Data Node 30 -->
  <rect x="530" y="70" width="110" height="50" rx="8" fill="#10b981" fill-opacity="0.15" stroke="#10b981" stroke-width="2" />
  <text x="585" y="93" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#10b981">Node(30)</text>
  <text x="585" y="110" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" fill="currentColor" fill-opacity="0.7">Client Payload</text>

  <!-- Connectors Node 3 -> Tail -->
  <line x1="640" y1="85" x2="690" y2="85" stroke="#3b82f6" stroke-width="2" marker-end="url(#biArrow)" />
  <line x1="690" y1="105" x2="640" y2="105" stroke="#10b981" stroke-width="2" marker-end="url(#biArrow)" />

  <!-- Tail Sentinel Node -->
  <rect x="690" y="70" width="120" height="50" rx="8" fill="#3b82f6" fill-opacity="0.12" stroke="#3b82f6" stroke-width="2" />
  <text x="750" y="93" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#3b82f6">tailSentinel</text>
  <text x="750" y="110" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" fill="currentColor" fill-opacity="0.7">prev=N3, next=NULL</text>

  <!-- Footer Annotation -->

<text x="440" y="160" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="600" fill="#10b981">Every node is guaranteed non-NULL prev and next pointers — Zero boundary condition branches required!</text>
</svg>

#### Why Sentinels Eliminate Edge Cases:

Every user node—regardless of whether it is at the front, middle, or back—**always has a non-null predecessor and a non-null successor**. Special `if (head == NULL)` or `if (curr->prev == NULL)` checks completely disappear from the codebase. Node deletion collapses into two unconditional pointer assignments:

```text
targetNode.prev.next <- targetNode.next
targetNode.next.prev <- targetNode.prev
```

---

### 5. Production Specification: Sentinel Doubly Linked List

```text
CLASS DoublyNode:
    field data: ValueType
    field prev: DoublyNode Pointer <- NULL
    field next: DoublyNode Pointer <- NULL

    CONSTRUCTOR(val: ValueType):
        this.data <- val

CLASS SentinelDoublyLinkedList:
    field headSentinel: DoublyNode Pointer
    field tailSentinel: DoublyNode Pointer
    field size: Integer <- 0

    CONSTRUCTOR():
        this.headSentinel <- new DoublyNode(DEFAULT)
        this.tailSentinel <- new DoublyNode(DEFAULT)
        this.headSentinel.next <- this.tailSentinel
        this.tailSentinel.prev <- this.headSentinel
        this.size <- 0

    FUNCTION InsertAfterNode(targetNode: DoublyNode, val: ValueType) -> DoublyNode:
        newNode <- new DoublyNode(val)
        successor <- targetNode.next

        newNode.prev <- targetNode
        newNode.next <- successor
        targetNode.next <- newNode
        successor.prev <- newNode

        this.size <- this.size + 1
        return newNode

    FUNCTION InsertAtHead(val: ValueType) -> DoublyNode:
        return this.InsertAfterNode(this.headSentinel, val)

    FUNCTION InsertAtTail(val: ValueType) -> DoublyNode:
        return this.InsertAfterNode(this.tailSentinel.prev, val)

    FUNCTION DeleteNode(targetNode: DoublyNode) -> ValueType:
        if targetNode == this.headSentinel or targetNode == this.tailSentinel:
            raise BoundaryException("Cannot delete sentinel nodes")

        predecessor <- targetNode.prev
        successor <- targetNode.next

        predecessor.next <- successor
        successor.prev <- predecessor

        val <- targetNode.data
        free(targetNode)
        this.size <- this.size - 1
        return val

    FUNCTION DeleteHead() -> ValueType:
        if this.size == 0:
            raise UnderflowException("List is empty")
        return this.DeleteNode(this.headSentinel.next)

    FUNCTION DeleteTail() -> ValueType:
        if this.size == 0:
            raise UnderflowException("List is empty")
        return this.DeleteNode(this.tailSentinel.prev)
```

---

## Topic 26: Circular Linked Lists (CSLL & CDLL)

### 1. Structural Variations & Topologies

A **Circular Linked List** eliminates terminal `NULL` pointers by connecting the final node back to the initial node, forming an unbroken ring buffer.

#### Comparison of Circular Topologies

| Property                   | Circular Singly Linked List (CSLL) | Circular Doubly Linked List (CDLL)          |
| :------------------------- | :--------------------------------- | :------------------------------------------ |
| **Pointer Count per Node** | 1 (`next`)                         | 2 (`prev`, `next`)                          |
| **Loop-Back Condition**    | `tail.next == head`                | `head.prev == tail` and `tail.next == head` |
| **Traversal Direction**    | Unidirectional (forward only)      | Bidirectional (forward and backward)        |
| **Memory Overhead**        | 8 bytes pointer / node             | 16 bytes pointer / node                     |
| **Primary Use Cases**      | Round-robin CPU schedulers         | Media playlist loops, Fibonacci heaps       |

```
Circular Singly Linked List:
HEAD -> [ 10 ] -> [ 20 ] -> [ 30 ] (TAIL)
  ^                            |
  |----------------------------|

Circular Doubly Linked List:
  |---------------------------------------------------------|
  v                                                         |
[ 10 (HEAD) ] <==========> [ 20 ] <==========> [ 30 (TAIL) ]
  |                                                         ^
  |---------------------------------------------------------|
```

---

### 2. The Single-`tail` Pointer Architecture for CSLL

In a standard singly linked list, maintaining a pointer to `HEAD` requires an $O(n)$ traversal to append at the tail. In a Circular Singly Linked List, maintaining only a pointer to **`TAIL`** provides instant $O(1)$ access to both ends:

- **Tail Access**: Direct via `tail`.
- **Head Access**: Direct via `tail.next`!
- **Insert At Head**: Insert a new node between `tail` and `tail.next`.
- **Insert At Tail**: Insert between `tail` and `tail.next`, then advance `tail = newNode`.

```text
FUNCTION InsertAtHeadCSLL(tail: Node Pointer, val: ValueType) -> Node Pointer:
    newNode <- new Node(val)
    if tail == NULL:
        newNode.next <- newNode
        return newNode
    newNode.next <- tail.next
    tail.next <- newNode
    return tail

FUNCTION InsertAtTailCSLL(tail: Node Pointer, val: ValueType) -> Node Pointer:
    newNode <- new Node(val)
    if tail == NULL:
        newNode.next <- newNode
        return newNode
    newNode.next <- tail.next
    tail.next <- newNode
    return newNode    // newNode is the new tail
```

---

### 3. Classic Application: The Josephus Problem

#### Problem Formulation

$n$ people stand in a circle labeled $1$ through $n$. Beginning at person $1$, counting proceeds clockwise. Every $k$-th person is eliminated. The circle closes and counting resumes from the person immediately following the eliminated individual. The goal is to determine the safe starting position $J(n, k)$ that guarantees survival.

#### Analytical Formula for $k = 2$

When $k = 2$ (every second person is eliminated), the problem admits an elegant closed-form solution based on powers of 2:

$$J(n, 2) = 2(n - 2^{\lfloor \log_2 n \rfloor}) + 1$$

For $n = 5$:

- $\lfloor \log_2 5 \rfloor = 2 \implies 2^2 = 4$
- $J(5, 2) = 2(5 - 4) + 1 = 2(1) + 1 = 3$

#### Simulation via Circular Linked List ($n = 5, k = 2$)

| Round | Active Circle Sequence            | Elimination Step ($k=2$)               | Eliminated Person | Remaining Circle            |
| :---: | :-------------------------------- | :------------------------------------- | :---------------: | :-------------------------- |
| **1** | $1 \to 2 \to 3 \to 4 \to 5 \to 1$ | Count 1 (Person 1), Count 2 (Person 2) |   **Person 2**    | $3 \to 4 \to 5 \to 1 \to 3$ |
| **2** | $3 \to 4 \to 5 \to 1 \to 3$       | Count 1 (Person 3), Count 2 (Person 4) |   **Person 4**    | $5 \to 1 \to 3 \to 5$       |
| **3** | $5 \to 1 \to 3 \to 5$             | Count 1 (Person 5), Count 2 (Person 1) |   **Person 1**    | $3 \to 5 \to 3$             |
| **4** | $3 \to 5 \to 3$                   | Count 1 (Person 3), Count 2 (Person 5) |   **Person 5**    | **Person 3 (Survivor)**     |

The simulation confirms the theoretical derivation: **Person 3 survives**.

```text
FUNCTION JosephusSurvivor(n: Integer, k: Integer) -> Integer:
    head <- new Node(1)
    prev <- head
    for i from 2 to n:
        curr <- new Node(i)
        prev.next <- curr
        prev <- curr
    prev.next <- head    // Close the circular ring

    curr <- head
    while curr.next != curr:
        for step from 1 to k - 2:
            curr <- curr.next
        // Delete the k-th node
        eliminated <- curr.next
        curr.next <- eliminated.next
        free(eliminated)
        curr <- curr.next
    survivor <- curr.data
    free(curr)
    return survivor
```

**Simulation Complexity**: $O(n \cdot k)$ time, $O(n)$ auxiliary space.

---

### 4. Key Takeaways

1. **Bidirectional Navigation**: Doubly linked lists trade $16$ bytes of pointer overhead per node for true $O(1)$ deletion of arbitrary nodes and bidirectional traversal.
2. **Sentinel Pattern**: Invariant dummy head and tail nodes eliminate null pointer dereferences and special boundary checks.
3. **Single Tail Optimization**: Storing only a `tail` reference in a Circular Singly Linked List grants $O(1)$ operations at both head (`tail.next`) and tail (`tail`).
4. **Natural Ring Topologies**: Circular lists are the natural data structure for round-robin CPU schedulers, periodic ring buffers, and cyclic elimination simulations.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). _Introduction to Algorithms_ (4th ed.), Chapter 10: _Elementary Data Structures_. MIT Press.
2. **Knuth, D. E.** (1997). _The Art of Computer Programming, Volume 1: Fundamental Algorithms_ (3rd ed.), Section 2.2: _Linear Lists_. Addison-Wesley.
3. **Graham, R. L., Knuth, D. E., & Patashnik, O.** (1994). _Concrete Mathematics: A Foundation for Computer Science_ (2nd ed.), Section 1.3: _The Josephus Problem_. Addison-Wesley.
4. **Sedgewick, R., & Wayne, K.** (2011). _Algorithms_ (4th ed.), Section 1.3: _Bags, Queues, and Stacks_. Addison-Wesley.
