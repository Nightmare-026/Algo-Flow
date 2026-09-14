# Part 02: Linear Data Structures — Module 06: Stacks

> **Topics Covered:**  
> 30. Stack Abstract Data Type (LIFO) & Core Operations &bull; Static & Dynamic Array Stack Implementations (Amortized Analysis) &bull; Linked List Stack &bull; Hardware Call Stack & Activation Records &bull; Expression Evaluation (Infix, Prefix, Postfix, Shunting-Yard Algorithm) &bull; Balanced Delimiter Matching

---

The stack is one of computing's most fundamental restricted-access linear abstractions, operating under the strict Last-In, First-Out (LIFO) principle. All element insertions and removals occur at a single designated boundary: the top. Beyond its utility as a software container, the stack is embedded directly into computer architecture as the CPU execution call stack, powering subroutine invocation, local variable scoping, and recursion. This chapter examines array and pointer-linked stack implementations, activation record lifecycles, balanced bracket validation, postfix expression evaluation, and Dijkstra's Shunting-Yard parsing algorithm.

### Learning Objectives
- Formalize the Stack Abstract Data Type (ADT) interface and enforce strict Last-In, First-Out (LIFO) invariants.
- Compare contiguous dynamic-array stack backing buffers against heap pointer-linked implementations in terms of allocation latency and memory overhead.
- Trace hardware activation records, frame pointers, and return addresses on the physical CPU call stack to diagnose stack overflow conditions.
- Implement linear-time balanced delimiter matching with nested state verification.
- Implement postfix (Reverse Polish Notation) arithmetic evaluation and Dijkstra's Shunting-Yard algorithm for converting infix expressions to postfix.

---

## Topic 30: Stacks (LIFO) & Applications

### 1. Conceptual Architecture & The LIFO Invariant

A **Stack** restricts element access to a single boundary called **Top**:
- **Push**: Places an element onto the top of the container.
- **Pop**: Removes and returns the element currently residing at the top.
- **Peek / Top**: Inspects the value of the top element without mutating state.

```
+-------------------------------------------------------------+
|                       LIFO CONTAINER                        |
|                                                             |
|   PUSH Item D --------+            +-------> POP Item D     |
|                       |            |                        |
|                       v            |                        |
|                 +--------------------+                      |
|      TOP -----> |       Item D       |                      |
|                 +--------------------+                      |
|                 |       Item C       |                      |
|                 +--------------------+                      |
|                 |       Item B       |                      |
|                 +--------------------+                      |
|   BOTTOM -----> |       Item A       | (Inserted 1st,       |
|                 +--------------------+  Extracted Last)     |
+-------------------------------------------------------------+
```

> **Interactive Simulations**:  
> Experiment with LIFO dynamics live in the [Interactive Stack Push Simulator](/visualizer/stack-push) and the [Interactive Stack Pop Simulator](/visualizer/stack-pop).

---

### 2. The Stack Abstract Data Type (ADT) Interface

| Operation | Description | Array Best | Array Worst | Array Amortized | Linked List | Auxiliary Space |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **`Push(x)`** | Insert element $x$ at `TOP` | $\Theta(1)$ | $O(n)$ *(resize)* | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ |
| **`Pop()`** | Remove and return element at `TOP` | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ |
| **`Peek()`** | Read value at `TOP` without removing | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ |
| **`IsEmpty()`** | Returns `true` if size is 0 | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ |
| **`Size()`** | Return current count of elements | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $\Theta(1)$ | $O(1)$ |

---

### 3. Implementation Paradigms: Contiguous Array vs. Linked List

#### Paradigm A: Contiguous Array Implementation
Maintains a backing array `storage[]` and an integer offset `topIndex`:
- **Empty State**: `topIndex = -1`.
- **Push($x$)**: Check bounds; `topIndex += 1; storage[topIndex] = x;`.
- **Pop()**: Check for underflow (`topIndex == -1`); `val = storage[topIndex]; topIndex -= 1; return val;`.

| Array Index | `0` | `1` | `2` | `3` | `4` |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Stored Value** | `10` | `20` | `30` | `[EMPTY]` | `[EMPTY]` |
| **Role / Marker** | Bottom | Interior | **`topIndex = 2` (TOP)** | Available | Available |

*Amortized Cost*: When backed by a geometrically doubling dynamic array, `Push` incurs occasional $O(n)$ reallocations, but achieves $O(1)$ amortized cost across any sequence of $n$ operations while maintaining exceptional CPU cache locality.

#### Paradigm B: Linked-List-Based Stack
Maintains a pointer to the head node:
- **`Push(x)`**: Allocate new node, set `newNode.next = top`, `top = newNode`.
- **`Pop()`**: Retrieve `top.data`, advance `top = top.next`, free old node.

| Node Position | Virtual Heap Address | Node Payload | `next` Pointer Target | Architectural Role |
| :---: | :--- | :---: | :--- | :--- |
| **Node 3** | `0x30A0` | `30` | `0x2050` | **`top` (Head of List)** |
| **Node 2** | `0x2050` | `20` | `0x1010` | Intermediate Frame |
| **Node 1** | `0x1010` | `10` | `NULL` | Bottom of Stack |

*Guaranteed Strict Bound*: Every single operation executes in guaranteed worst-case $\Theta(1)$ time without memory reallocation pauses, but consumes $16\text{ bytes}$ of pointer and padding overhead per element.

---

### 4. Canonical Specification

```text
CLASS ArrayStack:
    field storage: Array of ValueType
    field topIndex: Integer <- -1
    field capacity: Integer

    CONSTRUCTOR(cap: Integer = 16):
        assert cap > 0
        this.capacity <- cap
        this.storage <- allocate_memory(cap * sizeof(ValueType))
        this.topIndex <- -1

    FUNCTION Push(x: ValueType) -> Void:
        if this.topIndex == this.capacity - 1:
            // Dynamic doubling
            this.Resize(2 * this.capacity)
        this.topIndex <- this.topIndex + 1
        this.storage[this.topIndex] <- x

    FUNCTION Pop() -> ValueType:
        if this.IsEmpty():
            raise UnderflowException("Stack is empty")
        val <- this.storage[this.topIndex]
        this.topIndex <- this.topIndex - 1
        return val

    FUNCTION Peek() -> ValueType:
        if this.IsEmpty():
            raise UnderflowException("Stack is empty")
        return this.storage[this.topIndex]

    FUNCTION IsEmpty() -> Boolean:
        return (this.topIndex == -1)

    FUNCTION Size() -> Integer:
        return (this.topIndex + 1)

    PRIVATE FUNCTION Resize(newCap: Integer) -> Void:
        newStorage <- allocate_memory(newCap * sizeof(ValueType))
        for i from 0 to this.topIndex:
            newStorage[i] <- this.storage[i]
        free_memory(this.storage)
        this.storage <- newStorage
        this.capacity <- newCap
```

---

### 5. Hardware Symbiosis: CPU Call Stack & Activation Records

Every running program thread is assigned an operating-system-level **Execution Call Stack**:

```
HIGH MEMORY ADDRESS
┌────────────────────────────────────────────────────────┐
│ Main Function Activation Record                        │
│ - Return Address to Operating System Runtime           │
│ - Local Variables: argc, argv, config                  │
├────────────────────────────────────────────────────────┤
│ ProcessData() Frame                                    │
│ - Return Address to Main instruction line 42           │
│ - Parameters: bufferPtr, dataLength                    │
├────────────────────────────────────────────────────────┤
│ ComputeFactorial(n = 3) Frame                          │
├────────────────────────────────────────────────────────┤
│ ComputeFactorial(n = 2) Frame                          │
├────────────────────────────────────────────────────────┤
│ ComputeFactorial(n = 1) Frame ◄── CPU Stack Pointer RSP│
│ (Active Execution Context)                             │
└────────────────────────────────────────────────────────┘
LOW MEMORY ADDRESS (Grows downward on x86-64)
```

| Frame Component | Hardware Register | Architectural Function |
| :--- | :---: | :--- |
| **Return Address** | Instruction Pointer (`RIP`) | Machine instruction address the CPU jumps to upon `RET` |
| **Frame Pointer** | Base Pointer (`RBP`) | Fixed anchor address used to offset and read local variables |
| **Stack Pointer** | Stack Pointer (`RSP`) | Points to current top of stack; adjusted by `PUSH` and `POP` |
| **Local Variables** | Stack Segment RAM | Stack-allocated primitive values and pointer handles |

> ⚠️ **Stack Overflow**:  
> In unbounded or deep recursion without a reachable base case, successive function calls push activation records until the allocated stack boundary (typically 1 MB to 8 MB) is exceeded, triggering an immediate OS memory fault (segmentation violation).

---

### 6. Application 1: Balanced Delimiter & Parentheses Matching

```text
FUNCTION IsBalanced(expression: String) -> Boolean:
    stk <- new ArrayStack()
    matching <- Map(')' -> '(', '}' -> '{', ']' -> '[')

    for each char c in expression:
        if c in ['(', '{', '[']:
            stk.Push(c)
        else if c in [')', '}', ']']:
            if stk.IsEmpty():
                return False     // Unmatched closing bracket
            topChar <- stk.Pop()
            if topChar != matching[c]:
                return False     // Mismatched bracket types
    return stk.IsEmpty()         // True if zero unclosed brackets remain
```

#### Step-by-Step Trace: Validating `{[()]}`

| Step | Scanned Token | Action | Stack State (Bottom $\to$ Top) | Evaluation Result |
| :---: | :---: | :--- | :--- | :--- |
| **1** | `{` | `Push('{')` | `['{']` | Opening bracket recorded |
| **2** | `[` | `Push('[')` | `['{', '[']` | Opening bracket recorded |
| **3** | `(` | `Push('(')` | `['{', '[', '(']` | Opening bracket recorded |
| **4** | `)` | `Pop()` $\to$ `'('` | `['{', '[']` | `matching[')'] == '('` ✅ |
| **5** | `]` | `Pop()` $\to$ `'['` | `['{']` | `matching[']'] == '['` ✅ |
| **6** | `}` | `Pop()` $\to$ `'{'` | `[]` (Empty) | `matching['}'] == '{'` ✅ |
| **End** | End of string | Inspect `stk.IsEmpty()` | `[]` | **Expression is Balanced (True)** |

---

### 7. Application 2: Expression Parsing & Dijkstra's Shunting-Yard Algorithm

Mathematical expressions can be formalized in three distinct notations:
1. **Infix**: $A + B \times C$ (human-readable; requires operator precedence and parentheses).
2. **Prefix (Polish)**: $+ A \times B C$ (operator precedes operands).
3. **Postfix (Reverse Polish Notation / RPN)**: $A B C \times +$ (operands precede operator; **zero parentheses required**).

#### A. Postfix Expression Evaluation ($O(n)$ Time)
Using a single operand stack:
- Operands are pushed directly onto the stack.
- Operators pop the two top operands $B$ and $A$, compute $A \odot B$, and push the result.

```text
FUNCTION EvaluatePostfix(tokens: List of String) -> Number:
    stk <- new ArrayStack()
    for each token in tokens:
        if IsNumber(token):
            stk.Push(ParseNumber(token))
        else:
            b <- stk.Pop()
            a <- stk.Pop()
            result <- ApplyOperator(token, a, b)
            stk.Push(result)
    return stk.Pop()
```

#### B. Dijkstra's Shunting-Yard Algorithm (Infix $\to$ Postfix)
Uses an operator stack to convert standard infix expressions into postfix notation:

| Operator | Precedence Level | Associativity |
| :---: | :---: | :---: |
| `^` (Power) | 3 | Right-to-Left |
| `*`, `/` | 2 | Left-to-Right |
| `+`, `-` | 1 | Left-to-Right |

```text
FUNCTION ShuntingYard(infixTokens: List of String) -> List of String:
    outputQueue <- empty Queue
    operatorStack <- new ArrayStack()

    for each token in infixTokens:
        if IsNumber(token):
            outputQueue.Enqueue(token)
        else if token == "(":
            operatorStack.Push(token)
        else if token == ")":
            while not operatorStack.IsEmpty() and operatorStack.Peek() != "(":
                outputQueue.Enqueue(operatorStack.Pop())
            if not operatorStack.IsEmpty():
                operatorStack.Pop() // Discard '('
        else: // Token is operator
            while (not operatorStack.IsEmpty() and operatorStack.Peek() != "(" and
                   (Precedence(operatorStack.Peek()) > Precedence(token) or
                   (Precedence(operatorStack.Peek()) == Precedence(token) and IsLeftAssociative(token)))):
                outputQueue.Enqueue(operatorStack.Pop())
            operatorStack.Push(token)

    while not operatorStack.IsEmpty():
        outputQueue.Enqueue(operatorStack.Pop())

    return outputQueue
```

#### Conversion Trace: `3 + 4 * 2 / ( 1 - 5 )`

| Token | Operator Stack Action | Operator Stack (Bottom $\to$ Top) | Postfix Output Queue |
| :---: | :--- | :--- | :--- |
| `3` | None (Operand) | `[]` | `3` |
| `+` | `Push('+')` | `['+']` | `3` |
| `4` | None (Operand) | `['+']` | `3, 4` |
| `*` | `Push('*')` ($* > +$) | `['+', '*']` | `3, 4` |
| `2` | None (Operand) | `['+', '*']` | `3, 4, 2` |
| `/` | Pop `*` (equal precedence), then `Push('/')` | `['+', '/']` | `3, 4, 2, *` |
| `(` | `Push('(')` | `['+', '/', '(']` | `3, 4, 2, *` |
| `1` | None (Operand) | `['+', '/', '(']` | `3, 4, 2, *, 1` |
| `-` | `Push('-')` | `['+', '/', '(', '-']` | `3, 4, 2, *, 1` |
| `5` | None (Operand) | `['+', '/', '(', '-']` | `3, 4, 2, *, 1, 5` |
| `)` | Pop until `(` | `['+', '/']` | `3, 4, 2, *, 1, 5, -` |
| **End** | Pop remaining operators | `[]` | `3, 4, 2, *, 1, 5, -, /, +` |

---

### 8. Key Takeaways

1. **LIFO Discipline**: Stacks enforce restricted access where all operations occur in $O(1)$ time at the `TOP` boundary.
2. **Array vs. Linked List**: Contiguous dynamic arrays achieve superior CPU cache locality with amortized $O(1)$ push; linked lists guarantee strict $O(1)$ worst-case push with pointer overhead.
3. **Execution Call Stack**: The CPU utilizes an internal stack to manage activation records, return pointers, and local scoping during function execution.
4. **Parsing Foundations**: Stacks are the core computational engine driving syntax tree generation, delimiter balancing, and Reverse Polish Notation (RPN) compilers via the Shunting-Yard algorithm.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). *Introduction to Algorithms* (4th ed.), Chapter 10: *Elementary Data Structures*. MIT Press.
2. **Dijkstra, E. W.** (1961). *Making a Translator for ALGOL 60*. ALGOL Bulletin, 10, 10-11.
3. **Aho, A. V., Lam, M. S., Sethi, R., & Ullman, J. D.** (2006). *Compilers: Principles, Techniques, and Tools* (2nd ed.), Chapter 4: *Syntax Analysis*. Addison-Wesley.
4. **Sedgewick, R., & Wayne, K.** (2011). *Algorithms* (4th ed.), Section 1.3: *Bags, Queues, and Stacks*. Addison-Wesley.
