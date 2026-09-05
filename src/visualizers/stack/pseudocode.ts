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
    default:
      return [];
  }
}
