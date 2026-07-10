export function getTreePseudocode(slug: string): string[] {
  switch (slug) {
    case "inorder-traversal":
      return [
        "function inorder(node):",
        "    if node is not null:",
        "        inorder(node.left)",
        "        visit(node)",
        "        inorder(node.right)"
      ];
    case "preorder-traversal":
      return [
        "function preorder(node):",
        "    if node is not null:",
        "        visit(node)",
        "        preorder(node.left)",
        "        preorder(node.right)"
      ];
    case "postorder-traversal":
      return [
        "function postorder(node):",
        "    if node is not null:",
        "        postorder(node.left)",
        "        postorder(node.right)",
        "        visit(node)"
      ];
    case "level-order-traversal":
      return [
        "function levelOrder(root):",
        "    if root is null return",
        "    queue.enqueue(root)",
        "    while queue is not empty:",
        "        node = queue.dequeue()",
        "        visit(node)",
        "        if node.left: queue.enqueue(node.left)",
        "        if node.right: queue.enqueue(node.right)"
      ];
    case "bst-search":
      return [
        "function search(node, target):",
        "    while node is not null:",
        "        if node.value == target: return node",
        "        if target < node.value: node = node.left",
        "        else: node = node.right",
        "    return null"
      ];
    case "bst-insertion":
      return [
        "function insert(root, value):",
        "    if not root: return Node(value)",
        "    curr = root",
        "    while true:",
        "        if value < curr.value:",
        "            if not curr.left: curr.left = Node(value); break",
        "            curr = curr.left",
        "        else:",
        "            if not curr.right: curr.right = Node(value); break",
        "            curr = curr.right",
        "    return root"
      ];
    default:
      return [];
  }
}
