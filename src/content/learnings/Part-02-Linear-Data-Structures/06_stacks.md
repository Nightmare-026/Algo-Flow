# Part 02: Linear Data Structures — Module 06: Stacks

> **Topics Covered:**  
> 27. Stack Abstract Data Type (LIFO) & Core Operations &bull; Static & Dynamic Array Stack Implementations (Amortized Analysis) &bull; Linked List Stack &bull; Hardware Call Stack & Activation Records &bull; Expression Evaluation (Infix, Prefix, Postfix, Shunting-Yard Algorithm) &bull; Balanced Delimiter Matching

---

# TOPIC 27: STACK (LIFO)

### 1. Topic Title
**Stack (Last-In, First-Out Restricted-Access Linear Container)**

### 2. Category
Linear Data Structures — Restricted Access Container (LIFO).

### 3. Difficulty
Beginner to Intermediate.

### 4. Prerequisites
- Module 01: Arrays & Dynamic Arrays.
- Module 03: Singly Linked Lists.

---

### 5. Definition & Intuitive Mental Model

### Concept
A **Stack** is a linear data structure governed by the **LIFO (Last-In, First-Out)** principle: the most recently inserted element is always the first one to be removed. Access to elements is strictly restricted to one single boundary known as the **Top**.

### Intuition: The Cafeteria Tray Dispenser
Imagine a spring-loaded stack of trays in a cafeteria:
- When a dishwasher cleans a tray, they place it on **Top** (`Push`).
- When a customer needs a tray, they take the one on **Top** (`Pop`).
- You cannot pull a tray out from the bottom or middle without collapsing the stack. The tray placed last is taken first!

```text
       ┌───────────┐
 PUSH  │  Item D   │  ▲ POP (Extracts Item D)
   │   └───────────┘  │
   ▼   ┌───────────┐  │
       │  Item C   │ ── TOP pointer
       ├───────────┤
       │  Item B   │
       ├───────────┤
       │  Item A   │  (Inserted first, extracted last)
       └───────────┘
         BOTTOM
```

---

### 6. The Stack Abstract Data Type (ADT) Interface

| Operation | Description | Target Time | Space |
| :--- | :--- | :---: | :---: |
| **Push($x$)** | Places element $x$ on top of the stack. | $\Theta(1)$ | $O(1)$ |
| **Pop()** | Removes and returns the top-most element. | $\Theta(1)$ | $O(1)$ |
| **Peek() / Top()** | Returns top element without removing it. | $\Theta(1)$ | $O(1)$ |
| **IsEmpty()** | Returns `true` if stack contains zero elements. | $\Theta(1)$ | $O(1)$ |
| **IsFull()** | Returns `true` if capacity limit is reached. | $\Theta(1)$ | $O(1)$ |
| **Size()** | Returns count of currently stored elements. | $\Theta(1)$ | $O(1)$ |

---

### 7. Implementation Architecture 1: Array-Based Stack

In an array-based stack, elements are stored in a contiguous array `arr[]`, and an integer index `top` tracks the index of the highest occupied slot.
- **Empty State**: `top = -1`.
- **Push($x$)**: Check if `top == capacity - 1` (Overflow). If not, `top ← top + 1`, `arr[top] ← x`.
- **Pop()**: Check if `top == -1` (Underflow). If not, `val ← arr[top]`, `top ← top - 1`, return `val`.

```text
ARRAY SLOTS:   [ 10 │ 20 │ 30 │ __ │ __ ]
INDEX:           0    1    2    3    4
                           ▲
                           │
                          top = 2 (Capacity = 5)
```

#### Amortized Analysis of Dynamic Array Stack:
When the array becomes full (`top == capacity - 1`), allocating a new array of double capacity ($2 \times$) takes $O(n)$ time. However, by the **Accounting / Potential Method** established in Part 01:
- A sequence of $n$ pushes costs total $O(n)$ work.
- The amortized time per `Push` is strictly **$O(1)$**.

---

### 8. Implementation Architecture 2: Linked-List-Based Stack

To guarantee strict $O(1)$ worst-case time for every individual operation without dynamic array reallocation spikes:
- Maintain a Singly Linked List where `top` points to the list's **Head**.
- **Push($x$)**: Insert node at head ($O(1)$).
- **Pop()**: Delete node at head ($O(1)$).
- **No Overflow**: The stack grows dynamically until system RAM is exhausted.

```text
TOP (Head)
 │
 ▼
[ 30 │ ● ] ──► [ 20 │ ● ] ──► [ 10 │ NULL ]
```

---

### 9. Complete Language-Independent Pseudocode

```text
DATA STRUCTURE ArrayStack
    Fields:
        storage: Array of ValueType
        topIndex: integer ← -1
        capacity: integer

    OPERATION Initialize(cap):
        capacity ← cap
        storage ← allocate Array of size capacity
        topIndex ← -1

    OPERATION Push(x):
        if topIndex = capacity - 1:
            error "Stack Overflow"
        topIndex ← topIndex + 1
        storage[topIndex] ← x

    OPERATION Pop():
        if topIndex = -1:
            error "Stack Underflow"
        val ← storage[topIndex]
        topIndex ← topIndex - 1
        return val

    OPERATION Peek():
        if topIndex = -1:
            error "Stack is empty"
        return storage[topIndex]

    OPERATION IsEmpty():
        return (topIndex = -1)

    OPERATION Size():
        return (topIndex + 1)
```

---

### 10. Hardware Call Stack & Activation Records

### THE HARDWARE FOUNDATION
Every running software process allocates a dedicated block of RAM called the **Execution Call Stack**:
- When a function is called, the CPU pushes an **Activation Record (Stack Frame)** containing:
  1. Return address in machine code instructions.
  2. Input arguments and parameters.
  3. Local function variables.
  4. Saved register states.
- When the function executes `return`, the CPU pops the top activation record and jumps execution back to the caller's return address.

```text
HIGH MEMORY ADDRESS
┌────────────────────────────────────────────────────────┐
│ Main Function Frame (args, local vars)                 │
├────────────────────────────────────────────────────────┤
│ HelperA Frame (return address to Main, local vars)     │
├────────────────────────────────────────────────────────┤
│ Factorial(3) Frame                                     │
├────────────────────────────────────────────────────────┤
│ Factorial(2) Frame                                     │
├────────────────────────────────────────────────────────┤
│ Factorial(1) Frame  ◄── TOP OF STACK (Active Frame)    │
└────────────────────────────────────────────────────────┘
LOW MEMORY ADDRESS (Grows downward toward Heap)
```

**Stack Overflow**: If a recursive function lacks a valid base case, it endlessly pushes new activation records until it breaches the OS stack limit (typically 1 MB to 8 MB), triggering a segmentation fault / crash.

---

### 11. Application 1: Balanced Delimiters & Parentheses

Given a string containing brackets `()`, `{}`, `[]`, determine if all opening brackets are closed in valid nested order.

```text
ALGORITHM IsBalanced(expression)
    Input: String s
    Output: true if brackets are balanced, else false

1.  stk ← new EmptyStack()
2.  for each char c in expression:
3.      if c is '(' or c is '{' or c is '[':
4.          stk.Push(c)
5.      else if c is ')' or c is '}' or c is ']':
6.          if stk.IsEmpty():
7.              return false    // Closing bracket has no matching opener
8.          topChar ← stk.Pop()
9.          if (c is ')' and topChar ≠ '(') or
10.            (c is '}' and topChar ≠ '{') or
11.            (c is ']' and topChar ≠ '['):
12.             return false    // Mismatched bracket type
13. return stk.IsEmpty()        // Any unclosed openers left?
```

#### Dry-Run Table: Testing `{[()]}`

| Step | Current Char `c` | Stack Action | Stack State (Bottom $\to$ Top) | Match Verification |
| :---: | :---: | :---: | :---: | :---: |
| 1 | `{` | `Push('{')` | `['{']` | Opening bracket |
| 2 | `[` | `Push('[')` | `['{', '[']` | Opening bracket |
| 3 | `(` | `Push('(')` | `['{', '[', '(']` | Opening bracket |
| 4 | `)` | `Pop()` $\to$ `'('` | `['{', '[']` | `')'` matches `'('` ✅ |
| 5 | `]` | `Pop()` $\to$ `'['` | `['{']` | `']'` matches `'['` ✅ |
| 6 | `}` | `Pop()` $\to$ `'{'` | `[]` (Empty) | `'}'` matches `'{'` ✅ |
| **End** | End of string | `stk.IsEmpty()` | `[]` | **True (Valid Balanced Expression)** |

---

### 12. Application 2: Expression Parsing & The Shunting-Yard Algorithm

Mathematical expressions can be represented in three notations:
1. **Infix** (Human-readable): $A + B * C$ (requires operator precedence and parentheses).
2. **Prefix / Polish**: $+ A * B C$ (operator precedes operands).
3. **Postfix / Reverse Polish (RPN)**: $A B C * +$ (operands precede operator; **zero parentheses required!**).

#### Postfix Evaluation Algorithm ($O(n)$ Time):
Postfix expressions are trivially evaluated using a single operand stack:
- Scan token by token from left to right:
  - If operand: `Push(value)`.
  - If operator $\odot$: Pop two operands $B \leftarrow \text{Pop}()$, $A \leftarrow \text{Pop}()$. Compute $R \leftarrow A \odot B$. `Push(R)`.
- At the end, the stack contains the final result.

```text
ALGORITHM EvaluatePostfix(tokens)
1.  stk ← new EmptyStack()
2.  for each token in tokens:
3.      if token is number:
4.          stk.Push(token)
5.      else:  // token is operator
6.          b ← stk.Pop()
7.          a ← stk.Pop()
8.          res ← ApplyOperator(token, a, b)
9.          stk.Push(res)
10. return stk.Pop()
```

#### Dijkstra's Shunting-Yard Algorithm (Infix $\to$ Postfix):
Uses an operator stack to convert infix expressions respecting operator precedence ($* , / > + , -$) and associativity (Left-to-Right).

---

## Module 06 Summary & Key Takeaways

1. **Stacks** enforce strict **LIFO** discipline with $O(1)$ operations at `TOP`.
2. Dynamic array stacks achieve **amortized $O(1)$** push, while linked list stacks guarantee **worst-case $O(1)$** at the cost of pointer overhead.
3. The **Hardware Call Stack** manages function execution, parameters, and return addresses; unbounded recursion causes **Stack Overflow**.
4. Stacks are the fundamental engine behind **bracket balancing**, **DFS traversal**, and **Reverse Polish Notation (RPN) compilers**.

---

## References & Academic Attribution

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 10: Elementary Data Structures. MIT Press.
2. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.3: Bags, Queues, and Stacks. Addison-Wesley.
3. **Knuth, D. E.** (1997). *The Art of Computer Programming, Volume 1: Fundamental Algorithms* (3rd ed.), Section 2.2: Linear Lists. Addison-Wesley.
