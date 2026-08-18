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
    case "sll-delete-tail":
      return [
        "function deleteTail(head):",
        "    if head is null or head.next is null: return null",
        "    current = head",
        "    while current.next.next is not null:",
        "        current = current.next",
        "    current.next = null",
        "    return head",
      ];
    case "sll-find-middle":
      return [
        "function findMiddle(head):",
        "    slow = head, fast = head",
        "    while fast is not null and fast.next is not null:",
        "        slow = slow.next",
        "        fast = fast.next.next",
        "    return slow",
      ];
    case "sll-remove-duplicates":
      return [
        "function removeDuplicates(head):",
        "    current = head",
        "    while current is not null and current.next is not null:",
        "        if current.value == current.next.value:",
        "            current.next = current.next.next",
        "        else: current = current.next",
        "    return head",
      ];
    case "dll-traversal":
      return [
        "function traverseDLL(head, tail):",
        "    if head is null: return",
        "    current = head",
        "    while current is not null: current = current.next",
        "    current = tail",
        "    while current is not null:",
        "        current = current.prev",
        "    return",
      ];
    case "dll-insert-head":
      return [
        "function insertHeadDLL(head, value):",
        "    node = new DNode(value, prev=null, next=head)",
        "    if head is not null: head.prev = node",
        "    head = node; return head",
      ];
    case "dll-insert-tail":
      return [
        "function insertTailDLL(tail, value):",
        "    node = new DNode(value, prev=tail, next=null)",
        "    if tail is not null: tail.next = node",
        "    tail = node; return tail",
      ];
    case "dll-delete-head":
      return [
        "function deleteHeadDLL(head):",
        "    if head is null: return null",
        "    head = head.next",
        "    if head is not null: head.prev = null",
        "    return head",
      ];
    case "dll-delete-tail":
      return [
        "function deleteTailDLL(tail):",
        "    if tail is null: return null",
        "    tail = tail.prev",
        "    if tail is not null: tail.next = null",
        "    return tail",
      ];
    case "dll-reverse":
      return [
        "function reverseDLL(head):",
        "    current = head, temp = null",
        "    while current is not null:",
        "        swap(current.prev, current.next)",
        "        current = current.prev",
        "    return new_head",
      ];
    case "cll-traversal":
      return [
        "function traverseCLL(head):",
        "    if head is null: return",
        "    current = head",
        "    repeat: visit(current); current = current.next",
        "    until current == head",
      ];
    case "cll-insert-head":
      return [
        "function insertHeadCLL(head, value):",
        "    node = new Node(value, next=head)",
        "    update tail.next = node",
        "    head = node; return head",
      ];
    case "cll-insert-tail":
      return [
        "function insertTailCLL(head, tail, value):",
        "    node = new Node(value, next=head)",
        "    tail.next = node",
        "    tail = node; return tail",
      ];
    case "cll-delete-head":
      return [
        "function deleteHeadCLL(head, tail):",
        "    if head is null or head.next == head: return null",
        "    tail.next = head.next",
        "    head = head.next; return head",
      ];
    default:
      return [];
  }
}
