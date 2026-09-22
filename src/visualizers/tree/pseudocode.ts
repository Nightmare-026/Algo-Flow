export function getTreePseudocode(slug: string): string[] {
  switch (slug) {
    case "inorder-traversal":
      return [
        "function inorder(node):",
        "    if node is not null:",
        "        inorder(node.left)",
        "        visit(node)",
        "        inorder(node.right)",
        "    return output",
      ];
    case "preorder-traversal":
      return [
        "function preorder(node):",
        "    if node is not null:",
        "        visit(node)",
        "        preorder(node.left)",
        "        preorder(node.right)",
        "    return output",
      ];
    case "postorder-traversal":
      return [
        "function postorder(node):",
        "    if node is not null:",
        "        postorder(node.left)",
        "        postorder(node.right)",
        "        visit(node)",
        "    return output",
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
        "        if node.right: queue.enqueue(node.right)",
        "    return output",
      ];
    case "bst-search":
      return [
        "function search(node, target):",
        "    while node is not null:",
        "        if node.value == target: return node",
        "        if target < node.value: node = node.left",
        "        else: node = node.right",
        "    return null",
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
        "    return root",
      ];
    case "bst-deletion":
      return [
        "function deleteNode(root, value):",
        "    if not root: return null",
        "    if value < root.value: root.left = deleteNode(root.left, value)",
        "    else if value > root.value: root.right = deleteNode(root.right, value)",
        "    else:",
        "        if not root.left: return root.right; if not root.right: return root.left",
        "        root.value = findMin(root.right).value; root.right = deleteNode(root.right, root.value)",
        "    return root",
      ];
    case "avl-rotations":
      return [
        "function balanceAVL(node):",
        "    compute balance factor = height(left) - height(right)",
        "    if balance > 1 or balance < -1: perform LL/RR/LR/RL rotation",
        "    return balancedNode",
      ];
    case "heap-extract-max":
      return [
        "function extractMax(heap):",
        "    max = heap[0]; swap(heap[0], heap.last); heap.pop()",
        "    siftDown(0):",
        "        find largest among parent and children",
        "        if largest != parent: swap and continue siftDown",
        "    return max",
      ];
    case "heapify":
      return [
        "function buildMaxHeap(arr):",
        "    for i from floor(n/2)-1 down to 0:",
        "        siftDown(i): find largest child",
        "        swap with largest child and recurse",
        "    return heap",
      ];
    case "trie-search":
      return [
        "function searchTrie(root, word):",
        "    curr = root; for each character c in word:",
        "        if curr.children[c] does not exist: return false",
        "        curr = curr.children[c]",
        "    return curr.isEndOfWord",
      ];
    default:
      return [];
  }
}
