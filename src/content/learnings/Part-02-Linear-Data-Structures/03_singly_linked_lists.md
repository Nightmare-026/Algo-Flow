# Part 02: Linear Data Structures — Module 03: Singly Linked Lists

> **Topics Covered:**  
> 24. Singly Linked List Architecture & Heap Memory Layout &bull; Core Node Operations (Insert, Delete, Search, Access) &bull; In-Place 3-Pointer Reversal &bull; Floyd's Cycle-Finding Algorithm & Cycle Start Derivation &bull; Fast & Slow Pointer Patterns

---

Unlike contiguous arrays that rely on physical hardware adjacency for element ordering, linked lists build logical sequences through explicit directional pointers scattered across heap memory. This architectural decoupling enables $O(1)$ insertions and deletions at the head without memory reallocations or element shifts (tail deletion on a singly linked list remains $\Theta(n)$ without a predecessor pointer; see the complexity table below), but trades away constant-time indexing and hardware cache locality. This chapter details non-contiguous node topologies, memory alignment overheads, boundary-pointer manipulation invariants, the three-pointer in-place reversal state machine, and the mathematical proof underpinning Floyd's Tortoise and Hare cycle detection algorithm.

### Learning Objectives
- Contrast the physical heap allocation and CPU cache-line miss rates of linked nodes against contiguous memory arrays.
- Calculate pointer memory overhead and 64-bit alignment padding for node-based data structures.
- Implement head, tail, and arbitrary position insertions and deletions with strict boundary-condition checks.
- Formulate the loop invariant for canonical three-pointer in-place list reversal and trace state transitions step-by-step.
- Formulate the mathematical proof of Floyd's Cycle-Finding Algorithm and derive why resetting one pointer to `head` guarantees collision at the cycle entrance.
- Apply fast-and-slow two-pointer patterns to find list midpoints and the $k$-th element from the end in a single pass.

---

## Topic 24: Singly Linked List Architecture & Operations

### 1. Conceptual & Physical Memory Foundations

A **Singly Linked List** is a linear data structure composed of self-contained **Nodes**, where each node encapsulates a data payload and a forward reference (pointer) to the next node in the sequence. The list begins with an external pointer called `HEAD` and terminates when a node's pointer references `NULL`.

#### Node Architecture in 64-Bit Memory

```
┌───────────────────────────────────────────────────────────────┐
│                      64-BIT NODE LAYOUT                       │
├───────────────────────────────┬───────────────────────────────┤
│       Data Payload (4 bytes)  │    Next Pointer (8 bytes)     │
│       + 4 bytes padding       │    Points to Heap Address     │
└───────────────────────────────┴───────────────────────────────┘
```

| Field Name | Type | Size (64-Bit OS) | Alignment / Offset | Semantic Function |
| :--- | :--- | :---: | :---: | :--- |
| **`data`** | Value / Primitive | $4\text{ bytes}$ | Offset $+0$ | Holds client payload (e.g., 32-bit integer) |
| **`padding`** | System Alignment | $4\text{ bytes}$ | Offset $+4$ | Structure padding to satisfy 8-byte pointer alignment |
| **`next`** | Memory Address | $8\text{ bytes}$ | Offset $+8$ | Stores virtual heap address of subsequent node |

#### Physical Heap Allocation Reality
While an array requires an unbroken contiguous block of memory, linked list nodes are allocated dynamically at arbitrary, dispersed addresses across the heap.

| Logical Sequence | Virtual Heap Address | Node Payload | `next` Pointer Target | Target Node Description |
| :---: | :--- | :---: | :--- | :--- |
| **Node 1 (`HEAD`)** | `0x10A0` | `10` | `0x20F4` | Points to Node 2 |
| *(Intervening Heap)* | `0x10B0..0x20F0` | — | — | Used by unrelated system allocations |
| **Node 2** | `0x20F4` | `20` | `0x15C8` | Points to Node 3 |
| **Node 3 (`TAIL`)** | `0x15C8` | `30` | `NULL` (`0x0`) | Terminal Sentinel (End of List) |

> ⚠️ **Memory Overhead & Cache Penalty**:  
> Example (particular 64-bit ABI with alignment/padding): storing a 4-byte integer in a linked list node may occupy $16\text{ bytes}$ (value + $8\text{-byte}$ pointer + padding), an illustrative **$300\%$ memory penalty** over a flat array. Actual node size varies by ABI, alignment, headers, and allocator. Furthermore, because adjacent logical nodes can reside at distant heap addresses, traversing links often causes frequent CPU cache misses.

---

### 2. Operations & Asymptotic Complexities

| Operation | Best Case | Average Case | Worst Case | Auxiliary Space | Operational Invariants & Mechanism |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **InsertAtHead($x$)** | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ | `newNode.next = head; head = newNode;` |
| **InsertAtTail($x$)** *(with `tail` ptr)* | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ | `tail.next = newNode; tail = newNode;` |
| **InsertAtTail($x$)** *(no `tail` ptr)* | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ | Must traverse $n-1$ nodes to find terminal node |
| **InsertAtPosition($k, x$)** | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ | $O(1)$ if $k=0$; otherwise requires $k-1$ steps |
| **DeleteHead()** | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ | Advance `head` to `head.next`; free old node |
| **DeleteTail()** *(even with `tail`)* | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ | Must scan from `head` to locate $(n-1)$-th predecessor |
| **DeleteByValue($x$)** | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ | $\Theta(1)$ if target is head; $\Theta(n)$ linear scan |
| **Search($x$)** | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ | Sequential scan from `head` |
| **AccessByIndex($i$)** | $\Theta(1)$ | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ | Pointer arithmetic impossible; requires $i$ pointer hops |
| **ReverseInPlace()** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | $O(1)$ | 3-pointer sliding window reassignment |

> **Interactive Simulation**:  
> Step through pointer links, insertions, and traversals live in the [Interactive Linked List Visualizer](/visualizer/sll-traversal).

---

### 3. Step-by-Step Pointer Transitions

#### A. Head Insertion ($O(1)$)
Inserting a new node with value `10` before existing head node `20`:

| Step | Action Taken | Target Link Modified | Pointer State Result |
| :---: | :--- | :--- | :--- |
| **1** | Allocate `newNode` | `newNode.data = 10` | `newNode -> [10 \| ?]` |
| **2** | Link `newNode` to current head | `newNode.next = HEAD` | `newNode -> [10] -> [20] -> [30] -> NULL` |
| **3** | Reassign `HEAD` pointer | `HEAD = newNode` | `HEAD -> [10] -> [20] -> [30] -> NULL` |

#### B. Insertion at Arbitrary Position $k$ ($O(n)$)
Inserting node `25` between node `20` (index 1) and node `30` (index 2):

| Step | Action Taken | Target Link Modified | Critical Pointer Safety Rule |
| :---: | :--- | :--- | :--- |
| **1** | Traverse to predecessor `curr` | `curr = Node(20)` | Stop traversal at index $k-1$ |
| **2** | Connect new node forward | `newNode.next = curr.next` | **Connect forward first!** If `curr.next` is overwritten first, tail is lost forever |
| **3** | Connect predecessor forward | `curr.next = newNode` | List integrity restored: `... -> [20] -> [25] -> [30] -> ...` |

#### C. The Tail Deletion Bottleneck in Singly Linked Lists
Even if an implementation maintains an explicit `tail` pointer to the final node, **`DeleteTail` remains strictly $\Theta(n)$**.

```text
HEAD -> [10] -> [20] -> [30] -> NULL (tail points to [30])

To delete [30], the tail pointer must become [20], and [20].next must become NULL.
Because singly linked nodes lack backward (prev) pointers, there is no direct way
to inspect the predecessor of tail. The algorithm must traverse n - 1 nodes from HEAD
simply to discover that [20] precedes [30].
```

---

### 4. Comprehensive Production Specification

```text
CLASS Node:
    field data: ValueType
    field next: Node Pointer <- NULL

    CONSTRUCTOR(val: ValueType):
        this.data <- val
        this.next <- NULL

CLASS SinglyLinkedList:
    field head: Node Pointer <- NULL
    field tail: Node Pointer <- NULL
    field size: Integer <- 0

    FUNCTION InsertAtHead(val: ValueType) -> Void:
        newNode <- new Node(val)
        newNode.next <- this.head
        this.head <- newNode
        if this.size == 0:
            this.tail <- newNode
        this.size <- this.size + 1

    FUNCTION InsertAtTail(val: ValueType) -> Void:
        newNode <- new Node(val)
        if this.size == 0:
            this.head <- newNode
            this.tail <- newNode
        else:
            this.tail.next <- newNode
            this.tail <- newNode
        this.size <- this.size + 1

    FUNCTION DeleteHead() -> ValueType:
        if this.head == NULL:
            raise UnderflowException("List is empty")
        temp <- this.head
        val <- temp.data
        this.head <- this.head.next
        if this.head == NULL:
            this.tail <- NULL
        this.size <- this.size - 1
        free(temp)
        return val

    FUNCTION DeleteTail() -> ValueType:
        if this.head == NULL:
            raise UnderflowException("List is empty")
        if this.head == this.tail:
            val <- this.head.data
            free(this.head)
            this.head <- NULL
            this.tail <- NULL
            this.size <- 0
            return val
        
        // Traverse to second-to-last node
        curr <- this.head
        while curr.next != this.tail:
            curr <- curr.next
        
        val <- this.tail.data
        free(this.tail)
        this.tail <- curr
        this.tail.next <- NULL
        this.size <- this.size - 1
        return val
```

---

### 5. In-Place 3-Pointer List Reversal

Reversing a singly linked list in-place without allocating auxiliary nodes requires a sliding window of three pointers: `prev`, `curr`, and `nextNode`.

#### Invariant & Execution Loop
- **Loop Invariant**: At the start of each iteration, the sublist preceding `curr` is fully reversed with `prev` referencing its new head. `curr` references the head of the unreversed remaining sublist.

```text
FUNCTION ReverseList(head: Node Pointer) -> Node Pointer:
    prev <- NULL
    curr <- head
    while curr != NULL:
        nextNode <- curr.next     // 1. Preserve forward link
        curr.next <- prev         // 2. Invert link to point backwards
        prev <- curr              // 3. Advance prev window
        curr <- nextNode          // 4. Advance curr window
    return prev                   // prev points to new reversed head
```

#### Step-by-Step State Trace: Reversing $[10 \to 20 \to 30 \to \text{NULL}]$

| Step / Iteration | `prev` | `curr` | `nextNode` (`curr.next`) | Link Mutation (`curr.next <- prev`) | Next `prev` | Next `curr` |
| :---: | :---: | :---: | :---: | :--- | :---: | :---: |
| **Initialization** | `NULL` | `Node(10)` | — | — | — | — |
| **Iteration 1** | `NULL` | `Node(10)` | `Node(20)` | `Node(10).next = NULL` | `Node(10)` | `Node(20)` |
| **Iteration 2** | `Node(10)` | `Node(20)` | `Node(30)` | `Node(20).next = Node(10)` | `Node(20)` | `Node(30)` |
| **Iteration 3** | `Node(20)` | `Node(30)` | `NULL` | `Node(30).next = Node(20)` | `Node(30)` | `NULL` |
| **Termination** | `Node(30)` | `NULL` | — | Loop terminates (`curr == NULL`). Return `prev` = `Node(30)`. | — | — |

**Final Reconstructed State**: $\text{HEAD} \to [30] \to [20] \to [10] \to \text{NULL}$.  
**Complexity**: Strictly $\Theta(n)$ time, $O(1)$ auxiliary space.

---

### 6. Floyd's Cycle-Finding Algorithm (Tortoise & Hare)

Floyd's algorithm determines whether a linked list contains a cycle and identifies the exact entry node of that cycle using two pointers moving at different speeds, requiring only $O(1)$ auxiliary memory.

#### Mathematical Proof of Detection & Entry Derivation

```
List Topology:
HEAD -> [Node 1] -> [Node 2] -> [Cycle Entry: Node 3] -> [Node 4] -> [Node 5]
                                        ^                               |
                                        |                               v
                                  [Node 8] <-------- [Node 7] <------ [Node 6]
```

<svg viewBox="0 0 880 260" width="100%" height="auto" class="rounded-xl border border-border shadow-sm my-6 bg-surface">
  <defs>
    <marker id="cycleArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
      <path d="M0,0 L0,6 L6,3 z" fill="currentColor" fill-opacity="0.4" />
    </marker>
  </defs>
  <!-- Background Bounds -->
  <rect x="20" y="20" width="840" height="220" rx="10" fill="currentColor" fill-opacity="0.02" stroke="currentColor" stroke-opacity="0.1" />
  
  <!-- Linear Path Section (Length L) -->
  <rect x="40" y="95" width="60" height="40" rx="6" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="1.5" />
  <text x="70" y="120" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#3b82f6">HEAD</text>
  <line x1="100" y1="115" x2="140" y2="115" stroke="currentColor" stroke-opacity="0.4" stroke-width="2" marker-end="url(#cycleArrow)" />

  <rect x="140" y="95" width="60" height="40" rx="6" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="1.5" />
  <text x="170" y="120" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#3b82f6">Node 1</text>
  <line x1="200" y1="115" x2="240" y2="115" stroke="currentColor" stroke-opacity="0.4" stroke-width="2" marker-end="url(#cycleArrow)" />

  <rect x="240" y="95" width="60" height="40" rx="6" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="1.5" />
  <text x="270" y="120" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#3b82f6">Node 2</text>
  <line x1="300" y1="115" x2="350" y2="115" stroke="currentColor" stroke-opacity="0.4" stroke-width="2" marker-end="url(#cycleArrow)" />

  <!-- Length L Indicator -->
  <line x1="40" y1="155" x2="350" y2="155" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4 4" />
  <text x="195" y="175" text-anchor="middle" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" fill="#3b82f6">Linear Lead-in Distance: L</text>

  <!-- Cycle Entry Node -->
  <rect x="350" y="95" width="80" height="40" rx="8" fill="#10b981" fill-opacity="0.2" stroke="#10b981" stroke-width="2.5" />
  <text x="390" y="120" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#10b981">ENTRY (S)</text>

  <!-- Cycle Nodes Circle -->
  <!-- Top arc: Entry -> Node 4 -> Node 5 -->
  <line x1="430" y1="105" x2="480" y2="70" stroke="currentColor" stroke-opacity="0.4" stroke-width="2" marker-end="url(#cycleArrow)" />
  <rect x="480" y="50" width="60" height="35" rx="6" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2" />
  <text x="510" y="72" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="currentColor">Node 4</text>

  <line x1="540" y1="67" x2="600" y2="67" stroke="currentColor" stroke-opacity="0.4" stroke-width="2" marker-end="url(#cycleArrow)" />
  <rect x="600" y="50" width="60" height="35" rx="6" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2" />
  <text x="630" y="72" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="currentColor">Node 5</text>

  <!-- Collision Point (M) on Right -->
  <line x1="660" y1="70" x2="700" y2="100" stroke="currentColor" stroke-opacity="0.4" stroke-width="2" marker-end="url(#cycleArrow)" />
  <rect x="700" y="95" width="90" height="40" rx="8" fill="#f59e0b" fill-opacity="0.2" stroke="#f59e0b" stroke-width="2.5" />
  <text x="745" y="120" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#f59e0b">MEET (M)</text>

  <!-- Bottom arc: M -> Node 7 -> Node 8 -> Entry -->
  <line x1="720" y1="135" x2="660" y2="170" stroke="currentColor" stroke-opacity="0.4" stroke-width="2" marker-end="url(#cycleArrow)" />
  <rect x="600" y="155" width="60" height="35" rx="6" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2" />
  <text x="630" y="177" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="currentColor">Node 7</text>

  <line x1="600" y1="172" x2="540" y2="172" stroke="currentColor" stroke-opacity="0.4" stroke-width="2" marker-end="url(#cycleArrow)" />
  <rect x="480" y="155" width="60" height="35" rx="6" fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2" />
  <text x="510" y="177" text-anchor="middle" font-family="system-ui, sans-serif" font-size="10" fill="currentColor">Node 8</text>

  <line x1="480" y1="170" x2="420" y2="135" stroke="currentColor" stroke-opacity="0.4" stroke-width="2" marker-end="url(#cycleArrow)" />

  <!-- Cycle Labels -->
  <text x="560" y="40" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#f59e0b">Arc Length: d</text>
  <text x="560" y="215" text-anchor="middle" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" fill="#10b981">Remaining Arc: C - d = L</text>
</svg>

Let:
- $L$ = Distance from `HEAD` to the cycle entry node ($L = 2$ in the diagram above: links $1 \to 2$ and $2 \to 3$).
- $C$ = Number of nodes in the cycle ($C = 6$: nodes $3, 4, 5, 6, 7, 8$).
- $d$ = Distance from the cycle entry node to the meeting point where `slow` and `fast` collide.

#### Step 1: Detection Proof
- `slow` advances $1$ node per step; `fast` advances $2$ nodes per step.
- The relative velocity is $2 - 1 = 1$ node per step.
- Once both pointers enter the cycle, `fast` reduces the gap by $1$ node on every iteration. Since the maximum possible gap is $C - 1$, `fast` must collide with `slow` within at most $C$ iterations inside the cycle. An infinite loop is mathematically impossible.

#### Step 2: Cycle Entry Equation Derivation
Let $k$ be the total steps taken by `slow` when the collision occurs. Because `fast` travels at double speed, its total distance is $2k$:

$$\text{Distance}(\text{slow}) = k = L + m_1 \cdot C + d$$

$$\text{Distance}(\text{fast}) = 2k = L + m_2 \cdot C + d$$

Subtracting the first equation from the second:

$$k = (m_2 - m_1) \cdot C = m \cdot C$$

The total steps $k$ is an exact integer multiple of the cycle length $C$.

Substituting $k = m \cdot C$ into the `slow` distance formula:

$$L + d = m \cdot C \implies L = m \cdot C - d = (m - 1) \cdot C + (C - d)$$

#### The Critical Identity:
The term $(C - d)$ is the exact distance remaining from the collision point to the cycle entry node.  
Therefore, **the distance from `HEAD` to the cycle entry ($L$) equals the distance from the collision point to the cycle entry ($(C - d)$)**, modulo full loops.

#### Algorithmic Resolution:
1. When `slow` and `fast` meet at the collision point, leave `fast` at the collision point.
2. Reset `slow` to `HEAD`.
3. Advance both `slow` and `fast` at a uniform speed of **1 step per iteration**.
4. Both pointers will collide at the exact cycle entry node!

```text
FUNCTION DetectAndFindCycleEntry(head: Node Pointer) -> Node Pointer:
    slow <- head
    fast <- head
    hasCycle <- False

    // Phase 1: Detect cycle
    while fast != NULL and fast.next != NULL:
        slow <- slow.next
        fast <- fast.next.next
        if slow == fast:
            hasCycle <- True
            break

    if not hasCycle:
        return NULL

    // Phase 2: Find cycle entry node
    slow <- head
    while slow != fast:
        slow <- slow.next
        fast <- fast.next
    return slow
```

---

### 7. Fast & Slow Pointer Paradigms

| Application | Pointer Initialization | Movement Rule | Termination Condition & Result |
| :--- | :--- | :--- | :--- |
| **Find Midpoint of List** | `slow = head`, `fast = head` | `slow += 1`, `fast += 2` | When `fast.next == NULL` or `fast == NULL`, `slow` is at $\lfloor n/2 \rfloor$ (essential for Merge Sort) |
| **Find $k$-th Node from End** | `fast` advances $k$ steps ahead of `slow` | `slow += 1`, `fast += 1` | When `fast == NULL`, `slow` points to exactly the $k$-th node from the tail |
| **Palindrome Verification** | Find midpoint via fast/slow | Reverse second half in-place | Compare first half and reversed second half; restore list before returning |

---

### 8. Key Takeaways

1. **Trade-offs vs. Arrays**: Linked lists eliminate the need for large contiguous memory blocks and achieve true $O(1)$ head insertions, but forfeit $O(1)$ random indexing and suffer from poor CPU cache locality.
2. **Pointer Overhead**: 64-bit systems impose an 8-byte pointer cost and 4-byte padding per node, causing up to a $300\%$ memory footprint increase for 32-bit payloads.
3. **Tail Deletion Vulnerability**: Even with an explicit `tail` reference, `DeleteTail` on a singly linked list requires $\Theta(n)$ time to scan for the penultimate node.
4. **Three-Pointer Reversal**: Inverting link references requires holding `nextNode` before mutating `curr.next`, advancing `prev` and `curr` in lockstep.
5. **Floyd's Mathematical Harmony**: The distance from `HEAD` to the cycle entrance equals the distance from the collision point to the entrance, enabling $O(n)$ time, $O(1)$ space cycle entrance discovery.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 10: *Elementary Data Structures*. MIT Press.
2. **Floyd, R. W.** (1967). *Non-deterministic Algorithms*. Journal of the ACM, 14(4), 636-644.
3. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.3: *Bags, Queues, and Stacks*. Addison-Wesley.
4. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.2: *Linear Lists*. Addison-Wesley.
