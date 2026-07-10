export function getStackPseudocode(slug: string): string[] {
  switch (slug) {
    case "stack-push":
      return ["function push(stack, value):", "    if isFull(stack): return overflow", "    top = top + 1", "    stack[top] = value", "    return success"];
    case "stack-pop":
      return ["function pop(stack):", "    if isEmpty(stack): return underflow", "    value = stack[top]", "    top = top - 1", "    return value"];
    case "stack-peek":
      return ["function peek(stack):", "    if isEmpty(stack): return underflow", "    return stack[top]", "    stack is unchanged"];
    case "stack-is-empty":
      return ["function isEmpty(stack):", "    return size(stack) == 0"];
    case "stack-is-full":
      return ["function isFull(stack):", "    return size(stack) == capacity(stack)"];
    case "stack-size":
      return ["function size(stack):", "    return top + 1"];
    default:
      return [];
  }
}
