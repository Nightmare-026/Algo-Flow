export function getLinkedListPseudocode(slug: string): string[] {
  switch (slug) {
    case "sll-traversal":
      return [
        "function traverse(head):",
        "    current = head",
        "    while current is not null:",
        "        visit current",
        "        current = current.next",
      ];
    case "sll-search":
      return [
        "function search(head, target):",
        "    current = head",
        "    while current is not null:",
        "        if current.value == target: return found",
        "        current = current.next",
        "    return not found",
      ];
    case "sll-insert-head":
      return [
        "function insertHead(head, value):",
        "    node = new Node(value)",
        "    node.next = head",
        "    head = node",
        "    return head",
      ];
    case "sll-insert-tail":
      return [
        "function insertTail(head, value):",
        "    node = new Node(value)",
        "    if head is null: return node",
        "    current = head",
        "    while current.next is not null: current = current.next",
        "    current.next = node",
        "    return head",
      ];
    case "sll-delete":
      return [
        "function deleteValue(head, value):",
        "    if head is null: return head",
        "    if head.value == value: return head.next",
        "    find previous node before target",
        "    previous.next = target.next",
        "    return head",
      ];
    default:
      return [];
  }
}
