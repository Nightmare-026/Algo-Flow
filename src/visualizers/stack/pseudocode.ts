export function getStackPseudocode(slug: string): string[] {
  switch (slug) {
    case "array-stack":
      return [
        "class ArrayStack:",
        "    top = -1, capacity = N",
        "    push(val): if top < capacity-1: arr[++top] = val",
        "    pop(): if top >= 0: return arr[top--]",
      ];
    case "stack-push":
      return [
        "function push(stack, value):",
        "    if isFull(stack): return overflow",
        "    top = top + 1",
        "    stack[top] = value",
        "    return success",
      ];
    case "stack-pop":
      return [
        "function pop(stack):",
        "    if isEmpty(stack): return underflow",
        "    value = stack[top]",
        "    top = top - 1",
        "    return value",
      ];
    case "stack-peek":
      return [
        "function peek(stack):",
        "    if isEmpty(stack): return underflow",
        "    return stack[top]",
        "    stack is unchanged",
      ];
    case "stack-is-empty":
      return ["function isEmpty(stack):", "    return top == -1  // size == 0"];
    case "stack-is-full":
      return ["function isFull(stack):", "    return size(stack) == capacity"];
    case "stack-size":
      return ["function size(stack):", "    return top + 1"];
    case "balanced-parentheses":
      return [
        "function isBalanced(str):",
        "    if isOpen(char): stack.push(char)",
        "    if isEmpty() or not matches(top(), char): return false",
        "    if matches(top(), char): stack.pop()",
        "    return stack.isEmpty()",
      ];
    case "infix-to-postfix":
      return [
        "function infixToPostfix(tokens):",
        "    if isOperand(token): output.append(token)",
        "    if token == '(': stack.push(token)",
        "    if token == ')': pop until '(' to output",
        "    if isOperator(token): pop higher prec to output; push(token)",
        "    pop remaining operators to output",
      ];
    case "postfix-evaluation":
      return [
        "function evaluatePostfix(tokens):",
        "    if isOperand(token): stack.push(token)",
        "    if isOperator(token): b = pop(); a = pop(); push(eval(a, op, b))",
        "    return stack.pop()",
      ];
    case "min-stack":
      return [
        "class MinStack:",
        "    push(val): main.push(val); min.push(min(val, min.top()))",
        "    pop(): main.pop(); min.pop()",
        "    getMin(): return min.top()",
      ];
    case "next-greater-element":
      return [
        "function nextGreaterElement(arr):",
        "    while stack and arr[stack.top()] < arr[i]:",
        "        result[stack.pop()] = arr[i]",
        "    stack.push(i)",
        "    while stack: result[stack.pop()] = -1",
      ];
    default:
      return [];
  }
}
