# Part 02: Linear Data Structures — Module 06: Stacks

> **Topics Covered:**  
> 30. Stack Abstract Data Type (LIFO) & Core Operations &bull; Static & Dynamic Array Stack Implementations (Amortized Analysis) &bull; Linked List Stack &bull; Hardware Call Stack & Activation Records &bull; Expression Evaluation (Infix, Prefix, Postfix, Shunting-Yard Algorithm) &bull; Balanced Delimiter Matching (Dyck Language & Formal Induction Proof) &bull; Production Multi-Language Implementations

---

The stack is one of computing's most fundamental restricted-access linear abstractions, operating under the strict Last-In, First-Out (LIFO) principle. All element insertions and removals occur at a single designated boundary: the top. Beyond its utility as a software container, the stack is embedded directly into computer architecture as the CPU execution call stack, powering subroutine invocation, local variable scoping, and recursion. This chapter examines array and pointer-linked stack implementations, activation record lifecycles, balanced bracket validation, postfix expression evaluation, and Dijkstra's Shunting-Yard parsing algorithm.

### Learning Objectives

- Formalize the Stack Abstract Data Type (ADT) interface and enforce strict Last-In, First-Out (LIFO) invariants.
- Compare contiguous dynamic-array stack backing buffers against heap pointer-linked implementations in terms of allocation latency and memory overhead.
- Trace hardware activation records, frame pointers (`%rbp`), and return addresses on the physical CPU call stack to diagnose stack overflow and buffer overflow conditions.
- Prove the correctness of linear-time balanced delimiter matching over the Dyck Language $D_k$ using mathematical induction.
- Implement postfix (Reverse Polish Notation) arithmetic evaluation and Dijkstra's Shunting-Yard algorithm for converting infix expressions to postfix.
- Master robust production implementations across C++, Python, and Java with full error handling and cache consciousness.

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

| Operation       | Description                          | Array Best  |    Array Worst    | Array Amortized | Linked List | Auxiliary Space |
| :-------------- | :----------------------------------- | :---------: | :---------------: | :-------------: | :---------: | :-------------: |
| **`Push(x)`**   | Insert element $x$ at `TOP`          | $\Theta(1)$ | $O(n)$ _(resize)_ |   $\Theta(1)$   | $\Theta(1)$ |     $O(1)$      |
| **`Pop()`**     | Remove and return element at `TOP`   | $\Theta(1)$ |    $\Theta(1)$    |   $\Theta(1)$   | $\Theta(1)$ |     $O(1)$      |
| **`Peek()`**    | Read value at `TOP` without removing | $\Theta(1)$ |    $\Theta(1)$    |   $\Theta(1)$   | $\Theta(1)$ |     $O(1)$      |
| **`IsEmpty()`** | Returns `true` if size is 0          | $\Theta(1)$ |    $\Theta(1)$    |   $\Theta(1)$   | $\Theta(1)$ |     $O(1)$      |
| **`Size()`**    | Return current count of elements     | $\Theta(1)$ |    $\Theta(1)$    |   $\Theta(1)$   | $\Theta(1)$ |     $O(1)$      |

---

### 3. Implementation Paradigms: Contiguous Array vs. Linked List

#### Paradigm A: Contiguous Array Implementation

Maintains a backing array `storage[]` and an integer offset `topIndex`:

- **Empty State**: `topIndex = -1`.
- **Push($x$)**: Check bounds; `topIndex += 1; storage[topIndex] = x;`.
- **Pop()**: Check for underflow (`topIndex == -1`); `val = storage[topIndex]; topIndex -= 1; return val;`.

| Array Index       |  `0`   |   `1`    |           `2`            |    `3`    |    `4`    |
| :---------------- | :----: | :------: | :----------------------: | :-------: | :-------: |
| **Stored Value**  |  `10`  |   `20`   |           `30`           | `[EMPTY]` | `[EMPTY]` |
| **Role / Marker** | Bottom | Interior | **`topIndex = 2` (TOP)** | Available | Available |

_Amortized Cost_: When backed by a geometrically doubling dynamic array, `Push` incurs occasional $O(n)$ reallocations, but achieves $O(1)$ amortized cost across any sequence of $n$ operations while maintaining exceptional CPU L1/L2 cache locality.

#### Paradigm B: Linked-List-Based Stack

Maintains a pointer to the head node:

- **`Push(x)`**: Allocate new node, set `newNode.next = top`, `top = newNode`.
- **`Pop()`**: Retrieve `top.data`, advance `top = top.next`, free old node.

| Node Position | Virtual Heap Address | Node Payload | `next` Pointer Target | Architectural Role       |
| :-----------: | :------------------- | :----------: | :-------------------- | :----------------------- |
|  **Node 3**   | `0x30A0`             |     `30`     | `0x2050`              | **`top` (Head of List)** |
|  **Node 2**   | `0x2050`             |     `20`     | `0x1010`              | Intermediate Frame       |
|  **Node 1**   | `0x1010`             |     `10`     | `NULL`                | Bottom of Stack          |

_Guaranteed Strict Bound_: Every single operation executes in guaranteed worst-case $\Theta(1)$ time without memory reallocation pauses, but consumes $16\text{ bytes}$ of pointer and padding overhead per element.

---

### 4. Hardware Symbiosis: The CPU Call Stack & Activation Records

In von Neumann computer architecture, subroutine execution is governed by the hardware call stack located in the upper region of the process virtual address space. On x86-64 / AMD64 architectures:

- The stack grows **downward** from higher memory addresses toward lower memory addresses.
- The `%rsp` (Stack Pointer) register holds the memory address of the current top of the stack.
- The `%rbp` (Base / Frame Pointer) register anchors the base of the current subroutine activation record.

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Hardware Architecture: x86-64 Subroutine Activation Record Topology
  </div>
  <svg viewBox="0 0 850 440" class="w-full h-auto text-xs" style="max-height: 440px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="stackGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="var(--primary)" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="var(--primary)" stop-opacity="0.02"/>
      </linearGradient>
      <linearGradient id="frameGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#3b82f6" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#60a5fa" stop-opacity="0.05"/>
      </linearGradient>
      <linearGradient id="callerGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#34d399" stop-opacity="0.05"/>
      </linearGradient>
      <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="400" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Memory Address Growth Direction Indicator -->
    <line x1="80" y1="60" x2="80" y2="380" stroke="currentColor" stroke-width="2" stroke-dasharray="4,4" marker-end="url(#arrow)"/>
    <text x="80" y="50" font-weight="700" fill="currentColor" text-anchor="middle" font-size="11">High Memory (0x7FFF...)</text>
    <text x="80" y="405" font-weight="700" fill="currentColor" text-anchor="middle" font-size="11">Low Memory (0x0000...)</text>
    <text x="65" y="225" font-weight="600" fill="currentColor" text-anchor="middle" transform="rotate(-90 65 225)" font-size="12" fill-opacity="0.75">Stack Growth (pushq %reg)</text>
    <!-- Caller Stack Frame -->
    <g transform="translate(180, 50)">
      <rect x="0" y="0" width="460" height="85" rx="8" fill="url(#callerGrad)" stroke="#10b981" stroke-width="1.5"/>
      <text x="20" y="28" font-weight="700" fill="#10b981" font-size="13">Caller Activation Frame (main / caller)</text>
      <text x="20" y="48" fill="currentColor" fill-opacity="0.75" font-size="11">Arguments 7..N passed on stack (if &gt; 6 parameters)</text>
      <text x="20" y="68" fill="currentColor" fill-opacity="0.75" font-size="11">Caller-saved local variables and scratch registers</text>
      <text x="440" y="28" text-anchor="end" font-family="monospace" fill="currentColor" fill-opacity="0.6">0x7FFFFFFFE500</text>
    </g>
    <!-- Linkage Boundary: Return Address & Saved RBP -->
    <g transform="translate(180, 145)">
      <rect x="0" y="0" width="460" height="50" rx="6" fill="#f59e0b" fill-opacity="0.12" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="20" y="22" font-weight="700" fill="#f59e0b" font-size="12">Return Instruction Pointer (RIP)</text>
      <text x="20" y="38" fill="currentColor" fill-opacity="0.7" font-size="10">Pushed by callq; CPU resumes here upon retq</text>
      <text x="440" y="28" text-anchor="end" font-family="monospace" fill="currentColor" fill-opacity="0.6">0x7FFFFFFFE4A8</text>
    </g>
    <g transform="translate(180, 205)">
      <rect x="0" y="0" width="460" height="45" rx="6" fill="#8b5cf6" fill-opacity="0.12" stroke="#8b5cf6" stroke-width="1.5"/>
      <text x="20" y="20" font-weight="700" fill="#8b5cf6" font-size="12">Saved Base Pointer (%rbp)</text>
      <text x="20" y="36" fill="currentColor" fill-opacity="0.7" font-size="10">Pushed by callee prologue (pushq %rbp; movq %rsp, %rbp)</text>
      <text x="440" y="25" text-anchor="end" font-family="monospace" fill="#8b5cf6" font-weight="700">&lt;-- %rbp points here</text>
    </g>
    <!-- Callee Stack Frame -->
    <g transform="translate(180, 260)">
      <rect x="0" y="0" width="460" height="95" rx="8" fill="url(#frameGrad)" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="20" y="26" font-weight="700" fill="#3b82f6" font-size="13">Callee Activation Frame (current subroutine)</text>
      <text x="20" y="48" fill="currentColor" fill-opacity="0.75" font-size="11">Local variables: int x, char buf[64], struct Node temp</text>
      <text x="20" y="68" fill="currentColor" fill-opacity="0.75" font-size="11">Callee-saved registers: %rbx, %r12-%r15 (if modified)</text>
      <text x="440" y="85" text-anchor="end" font-family="monospace" fill="#3b82f6" font-weight="700">&lt;-- %rsp points here</text>
    </g>
    <!-- Register Indicators on Right -->
    <g transform="translate(660, 220)">
      <path d="M 0 5 L -15 5" stroke="#8b5cf6" stroke-width="2"/>
      <rect x="0" y="-12" width="130" height="34" rx="6" fill="#8b5cf6" fill-opacity="0.15" stroke="#8b5cf6" stroke-width="1"/>
      <text x="65" y="3" font-weight="700" fill="#8b5cf6" text-anchor="middle" font-size="11">%rbp (Base Frame)</text>
      <text x="65" y="16" fill="currentColor" fill-opacity="0.7" text-anchor="middle" font-size="9">Fixed Anchor</text>
    </g>
    <g transform="translate(660, 335)">
      <path d="M 0 5 L -15 5" stroke="#3b82f6" stroke-width="2"/>
      <rect x="0" y="-12" width="130" height="34" rx="6" fill="#3b82f6" fill-opacity="0.15" stroke="#3b82f6" stroke-width="1"/>
      <text x="65" y="3" font-weight="700" fill="#3b82f6" text-anchor="middle" font-size="11">%rsp (Top of Stack)</text>
      <text x="65" y="16" fill="currentColor" fill-opacity="0.7" text-anchor="middle" font-size="9">Mutates on push/pop</text>
    </g>
  </svg>
</div>

#### Call Stack Lifecycle:

1. **Prologue**: When a function is called (`callq`):
   - The CPU pushes `%rip` (return address) onto the stack.
   - The callee executes: `pushq %rbp; movq %rsp, %rbp; subq $N, %rsp;` to allocate $N$ bytes of local stack memory.
2. **Epilogue**: Before returning (`retq`):
   - The callee executes: `movq %rbp, %rsp; popq %rbp; retq;`.
   - The CPU pops `%rip` into the program counter and resumes the caller seamlessly.
3. **Stack Overflow**: If recursive invocations exceed the OS stack ceiling (typically 8 MB on Linux, 1 MB on Windows), `%rsp` collides with the memory guard page, triggering an immediate `SIGSEGV` fault.

---

### 5. Application 1: Balanced Delimiter Matching & Formal Proof

The balanced parenthesis problem requires validating whether a string $S$ over alphabet $\Sigma = \{(, ), [, ], \{, \}\}$ belongs to the **Dyck Language $D_k$**.

#### Grammar of $D_k$:

$$\mathcal{S} \to \varepsilon \mid (\mathcal{S}) \mid [\mathcal{S}] \mid \{\mathcal{S}\} \mid \mathcal{S}\mathcal{S}$$

#### Correctness Invariant & Induction Proof:

- **Loop Invariant**: Prior to scanning index $i$, the stack contains the exact sequence of unmatched open delimiters in the order they were opened.
- **Base Case ($i = 0$)**: The stack is empty. An empty prefix $\varepsilon$ has no unmatched delimiters. Invariant holds.
- **Inductive Step**: Assume invariant holds for prefix $S[0 \dots i-1]$.
  - If $S[i] \in \{(, [, \{\}$, it must eventually match a future closing bracket of the same type. Pushing $S[i]$ onto the stack preserves the invariant.
  - If $S[i] \in \{), ], \}\}$, by the Dyck grammar, the most recently opened unmatched delimiter must be its exact counterpart. Peeking at `TOP`:
    - If `stk.IsEmpty()`, an unopen closing delimiter exists $\implies$ invalid.
    - If `stk.Top() != match(S[i])`, delimiters are improperly nested $\implies$ invalid.
    - If `stk.Top() == match(S[i])`, popping the top successfully completes the inner Dyck reduction $\mathcal{S} \to ( \mathcal{S} )$. The invariant is preserved for $S[0 \dots i]$.
- **Termination**: At string conclusion ($i = n$), $S \in D_k \iff \text{stk.IsEmpty()}$. Any remaining element represents an unclosed delimiter. $\blacksquare$

---

### 6. Application 2: Expression Parsing & Dijkstra's Shunting-Yard Algorithm

Mathematical expressions can be formalized in three distinct notations:

1. **Infix**: $A + B \times C$ (human-readable; requires operator precedence and parentheses).
2. **Prefix (Polish)**: $+ A \times B C$ (operator precedes operands).
3. **Postfix (Reverse Polish Notation / RPN)**: $A B C \times +$ (operands precede operator; **zero parentheses required**).

<div class="my-6 p-4 rounded-xl border border-border bg-card">
  <div class="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
    <span class="inline-block w-2.5 h-2.5 rounded-full bg-primary"></span>
    Algorithm State Machine: Dijkstra's Shunting-Yard Parsing Pipeline
  </div>
  <svg viewBox="0 0 850 320" class="w-full h-auto text-xs" style="max-height: 320px;" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="syArrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
        <path d="M 0 1 L 8 5 L 0 9 z" fill="currentColor"/>
      </marker>
    </defs>
    <!-- Background Frame -->
    <rect x="20" y="20" width="810" height="280" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.15"/>
    <!-- Input Token Stream -->
    <g transform="translate(50, 110)">
      <rect x="0" y="0" width="160" height="80" rx="8" fill="#3b82f6" fill-opacity="0.12" stroke="#3b82f6" stroke-width="1.5"/>
      <text x="80" y="30" font-weight="700" fill="#3b82f6" text-anchor="middle" font-size="13">Infix Token Stream</text>
      <text x="80" y="55" font-family="monospace" fill="currentColor" text-anchor="middle" font-size="12">3 + 4 * 2 / (1 - 5)</text>
    </g>
    <!-- Decision Splitter -->
    <path d="M 210 150 L 270 150" stroke="currentColor" stroke-width="2" marker-end="url(#syArrow)"/>
    <g transform="translate(270, 95)">
      <polygon points="50,0 100,55 50,110 0,55" fill="#f59e0b" fill-opacity="0.15" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="50" y="52" font-weight="700" fill="#f59e0b" text-anchor="middle" font-size="11">Token</text>
      <text x="50" y="66" font-weight="700" fill="#f59e0b" text-anchor="middle" font-size="11">Type?</text>
    </g>
    <!-- Branch A: Operand Direct to Output -->
    <path d="M 320 95 L 320 50 L 580 50" stroke="#10b981" stroke-width="2" marker-end="url(#syArrow)"/>
    <text x="450" y="42" font-weight="600" fill="#10b981" text-anchor="middle" font-size="11">Operand (Number) &rarr; Emit Directly</text>
    <!-- Branch B: Operator to Operator Stack -->
    <path d="M 320 205 L 320 250 L 410 250" stroke="#8b5cf6" stroke-width="2" marker-end="url(#syArrow)"/>
    <text x="350" y="265" font-weight="600" fill="#8b5cf6" text-anchor="middle" font-size="11">Operator / Parenthesis</text>
    <!-- Operator Stack Box -->
    <g transform="translate(410, 190)">
      <rect x="0" y="0" width="160" height="90" rx="8" fill="#8b5cf6" fill-opacity="0.12" stroke="#8b5cf6" stroke-width="1.5"/>
      <text x="80" y="25" font-weight="700" fill="#8b5cf6" text-anchor="middle" font-size="12">Operator Stack</text>
      <text x="80" y="45" fill="currentColor" fill-opacity="0.75" text-anchor="middle" font-size="10">Precedence &amp; Assoc.</text>
      <text x="80" y="65" font-family="monospace" fill="#8b5cf6" font-weight="700" text-anchor="middle" font-size="12">['+', '/'] &lt;-- Top</text>
    </g>
    <!-- Popping Operators to Output -->
    <path d="M 570 235 L 670 235 L 670 185" stroke="#f59e0b" stroke-width="2" marker-end="url(#syArrow)"/>
    <text x="635" y="225" font-weight="600" fill="#f59e0b" text-anchor="middle" font-size="10">Pop higher prec.</text>
    <!-- Output Queue / RPN Output -->
    <g transform="translate(580, 95)">
      <rect x="0" y="0" width="220" height="90" rx="8" fill="#10b981" fill-opacity="0.12" stroke="#10b981" stroke-width="1.5"/>
      <text x="110" y="28" font-weight="700" fill="#10b981" text-anchor="middle" font-size="13">Postfix Output Stream</text>
      <text x="110" y="55" font-family="monospace" fill="currentColor" text-anchor="middle" font-size="12">3 4 2 * 1 5 - / +</text>
      <text x="110" y="75" fill="currentColor" fill-opacity="0.7" text-anchor="middle" font-size="10">Parenthesis-Free RPN</text>
    </g>
  </svg>
</div>

#### Step-by-Step Conversion Trace: `3 + 4 * 2 / ( 1 - 5 )`

|  Token  | Operator Stack Action                        | Operator Stack (Bottom $\to$ Top) | Postfix Output Queue         |
| :-----: | :------------------------------------------- | :-------------------------------- | :--------------------------- |
|   `3`   | None (Operand)                               | `[]`                              | `3`                          |
|   `+`   | `Push('+')`                                  | `['+']`                           | `3`                          |
|   `4`   | None (Operand)                               | `['+']`                           | `3, 4`                       |
|   `*`   | `Push('*')` ($* > +$)                        | `['+', '*']`                      | `3, 4`                       |
|   `2`   | None (Operand)                               | `['+', '*']`                      | `3, 4, 2`                    |
|   `/`   | Pop `*` (equal precedence), then `Push('/')` | `['+', '/']`                      | `3, 4, 2, *`                 |
|   `(`   | `Push('(')`                                  | `['+', '/', '(']`                 | `3, 4, 2, *`                 |
|   `1`   | None (Operand)                               | `['+', '/', '(']`                 | `3, 4, 2, * , 1`             |
|   `-`   | `Push('-')`                                  | `['+', '/', '(', '-']`            | `3, 4, 2, * , 1`             |
|   `5`   | None (Operand)                               | `['+', '/', '(', '-']`            | `3, 4, 2, * , 1, 5`          |
|   `)`   | Pop until `(`                                | `['+', '/']`                      | `3, 4, 2, * , 1, 5, -`       |
| **End** | Pop remaining operators                      | `[]`                              | `3, 4, 2, * , 1, 5, -, /, +` |

---

### 7. Concrete Production Implementations

#### A. C++20 Cache-Conscious Templated Dynamic Stack

```cpp
#include <iostream>
#include <vector>
#include <stdexcept>
#include <string>

template <typename T>
class ArrayStack {
private:
    T* buffer_;
    size_t capacity_;
    size_t size_;

    void resize(size_t new_capacity) {
        T* new_buffer = new T[new_capacity];
        for (size_t i = 0; i < size_; ++i) {
            new_buffer[i] = std::move(buffer_[i]);
        }
        delete[] buffer_;
        buffer_ = new_buffer;
        capacity_ = new_capacity;
    }

public:
    explicit ArrayStack(size_t initial_capacity = 8)
        : buffer_(new T[initial_capacity]), capacity_(initial_capacity), size_(0) {}

    ~ArrayStack() {
        delete[] buffer_;
    }

    // Disable copy for RAII safety
    ArrayStack(const ArrayStack&) = delete;
    ArrayStack& operator=(const ArrayStack&) = delete;

    // Enable move semantics
    ArrayStack(ArrayStack&& other) noexcept
        : buffer_(other.buffer_), capacity_(other.capacity_), size_(other.size_) {
        other.buffer_ = nullptr;
        other.capacity_ = 0;
        other.size_ = 0;
    }

    void push(const T& item) {
        if (size_ == capacity_) {
            resize(capacity_ * 2);
        }
        buffer_[size_++] = item;
    }

    void push(T&& item) {
        if (size_ == capacity_) {
            resize(capacity_ * 2);
        }
        buffer_[size_++] = std::move(item);
    }

    T pop() {
        if (empty()) {
            throw std::underflow_error("Stack underflow: cannot pop from empty stack.");
        }
        T val = std::move(buffer_[--size_]);
        if (size_ > 0 && size_ <= capacity_ / 4 && capacity_ > 8) {
            resize(capacity_ / 2);
        }
        return val;
    }

    [[nodiscard]] const T& top() const {
        if (empty()) {
            throw std::underflow_error("Stack is empty.");
        }
        return buffer_[size_ - 1];
    }

    [[nodiscard]] bool empty() const noexcept { return size_ == 0; }
    [[nodiscard]] size_t size() const noexcept { return size_; }
};
```

#### B. Python 3 Production Shunting-Yard & Postfix Evaluator

```python
from typing import List

def shunting_yard(tokens: List[str]) -> List[str]:
    """Converts an infix token list into Reverse Polish Notation (RPN)."""
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}
    right_associative = {'^'}
    output: List[str] = []
    op_stack: List[str] = []

    for token in tokens:
        if token.isnumeric() or (token.startswith('-') and token[1:].isnumeric()):
            output.append(token)
        elif token == '(':
            op_stack.append(token)
        elif token == ')':
            while op_stack and op_stack[-1] != '(':
                output.append(op_stack.pop())
            if not op_stack:
                raise ValueError("Mismatched parentheses in expression.")
            op_stack.pop()  # Discard '('
        elif token in precedence:
            curr_p = precedence[token]
            while (op_stack and op_stack[-1] != '(' and
                   (precedence.get(op_stack[-1], 0) > curr_p or
                    (precedence.get(op_stack[-1], 0) == curr_p and token not in right_associative))):
                output.append(op_stack.pop())
            op_stack.append(token)
        else:
            raise ValueError(f"Unrecognized token: {token}")

    while op_stack:
        op = op_stack.pop()
        if op in {'(', ')'}:
            raise ValueError("Mismatched parentheses in expression.")
        output.append(op)

    return output

def evaluate_postfix(rpn_tokens: List[str]) -> float:
    """Evaluates an RPN token list in O(n) time using an operand stack."""
    stack: List[float] = []
    for token in rpn_tokens:
        if token.isnumeric() or (token.startswith('-') and token[1:].isnumeric()):
            stack.append(float(token))
        else:
            if len(stack) < 2:
                raise ValueError("Malformed RPN expression.")
            b = stack.pop()
            a = stack.pop()
            if token == '+': stack.append(a + b)
            elif token == '-': stack.append(a - b)
            elif token == '*': stack.append(a * b)
            elif token == '/': stack.append(a / b)
            elif token == '^': stack.append(a ** b)
    if len(stack) != 1:
        raise ValueError("Invalid RPN evaluation: excess operands.")
    return stack[0]
```

---

### 8. Key Takeaways

1. **LIFO Discipline**: Stacks enforce restricted access where all operations occur in $O(1)$ time at the `TOP` boundary.
2. **Array vs. Linked List**: Contiguous dynamic arrays achieve superior CPU cache locality with amortized $O(1)$ push; linked lists guarantee strict $O(1)$ worst-case push with pointer overhead.
3. **Execution Call Stack**: The CPU utilizes an internal stack to manage activation records, return pointers, and local scoping during function execution.
4. **Parsing Foundations**: Stacks are the core computational engine driving syntax tree generation, delimiter balancing, and Reverse Polish Notation (RPN) compilers via the Shunting-Yard algorithm.

---

## Academic Attribution & References

1. **Cormen, T. H., Leiserson, C. E., Rivest, R. L., & Stein, C.** (2022). _Introduction to Algorithms_ (4th ed.), Chapter 10: _Elementary Data Structures_. MIT Press.
2. **Dijkstra, E. W.** (1961). _Making a Translator for ALGOL 60_. ALGOL Bulletin, 10, 10-11.
3. **Aho, A. V., Lam, M. S., Sethi, R., & Ullman, J. D.** (2006). _Compilers: Principles, Techniques, and Tools_ (2nd ed.), Chapter 4: _Syntax Analysis_. Addison-Wesley.
4. **Sedgewick, R., & Wayne, K.** (2011). _Algorithms_ (4th ed.), Section 1.3: _Bags, Queues, and Stacks_. Addison-Wesley.
