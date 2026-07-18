import { CodeExample } from "@/types";

const snippets: Record<
  string,
  { title: string; pseudocode?: string; js: string; py: string; cpp: string; java: string }
> = {
  "tree-inorder": {
    title: "Inorder traversal (Left, Root, Right)",
    pseudocode: `function inorder(node):
    if node is not null:
        inorder(node.left)
        visit(node)
        inorder(node.right)`,
    js: `function inorder(node) {\n  if (node !== null) {\n    inorder(node.left);\n    console.log(node.value);\n    inorder(node.right);\n  }\n}`,
    py: `def inorder(node):\n    if node is not None:\n        inorder(node.left)\n        print(node.value)\n        inorder(node.right)`,
    cpp: `void inorder(Node* node) {\n    if (node != nullptr) {\n        inorder(node->left);\n        cout << node->value << endl;\n        inorder(node->right);\n    }\n}`,
    java: `void inorder(Node node) {\n    if (node != null) {\n        inorder(node.left);\n        System.out.println(node.value);\n        inorder(node.right);\n    }\n}`,
  },
  "tree-preorder": {
    title: "Preorder traversal (Root, Left, Right)",
    pseudocode: `function preorder(node):
    if node is not null:
        visit(node)
        preorder(node.left)
        preorder(node.right)`,
    js: `function preorder(node) {\n  if (node !== null) {\n    console.log(node.value);\n    preorder(node.left);\n    preorder(node.right);\n  }\n}`,
    py: `def preorder(node):\n    if node is not None:\n        print(node.value)\n        preorder(node.left)\n        preorder(node.right)`,
    cpp: `void preorder(Node* node) {\n    if (node != nullptr) {\n        cout << node->value << endl;\n        preorder(node->left);\n        preorder(node->right);\n    }\n}`,
    java: `void preorder(Node node) {\n    if (node != null) {\n        System.out.println(node.value);\n        preorder(node.left);\n        preorder(node.right);\n    }\n}`,
  },
  "tree-postorder": {
    title: "Postorder traversal (Left, Right, Root)",
    pseudocode: `function postorder(node):
    if node is not null:
        postorder(node.left)
        postorder(node.right)
        visit(node)`,
    js: `function postorder(node) {\n  if (node !== null) {\n    postorder(node.left);\n    postorder(node.right);\n    console.log(node.value);\n  }\n}`,
    py: `def postorder(node):\n    if node is not None:\n        postorder(node.left)\n        postorder(node.right)\n        print(node.value)`,
    cpp: `void postorder(Node* node) {\n    if (node != nullptr) {\n        postorder(node->left);\n        postorder(node->right);\n        cout << node->value << endl;\n    }\n}`,
    java: `void postorder(Node node) {\n    if (node != null) {\n        postorder(node.left);\n        postorder(node.right);\n        System.out.println(node.value);\n    }\n}`,
  },
  "tree-level-order": {
    title: "Level Order Traversal (BFS)",
    pseudocode: `function levelOrder(root):
    if root is null return
    queue.enqueue(root)
    while queue is not empty:
        node = queue.dequeue()
        visit(node)
        if node.left: queue.enqueue(node.left)
        if node.right: queue.enqueue(node.right)`,
    js: `function levelOrder(root) {\n  if (!root) return;\n  const queue = [root];\n  while (queue.length > 0) {\n    const node = queue.shift();\n    console.log(node.value);\n    if (node.left) queue.push(node.left);\n    if (node.right) queue.push(node.right);\n  }\n}`,
    py: `def level_order(root):\n    if not root: return\n    queue = [root]\n    while queue:\n        node = queue.pop(0)\n        print(node.value)\n        if node.left: queue.append(node.left)\n        if node.right: queue.append(node.right)`,
    cpp: `void levelOrder(Node* root) {\n    if (!root) return;\n    queue<Node*> q;\n    q.push(root);\n    while (!q.empty()) {\n        Node* node = q.front(); q.pop();\n        cout << node->value << endl;\n        if (node->left) q.push(node->left);\n        if (node->right) q.push(node->right);\n    }\n}`,
    java: `void levelOrder(Node root) {\n    if (root == null) return;\n    Queue<Node> q = new LinkedList<>();\n    q.add(root);\n    while (!q.isEmpty()) {\n        Node node = q.poll();\n        System.out.println(node.value);\n        if (node.left != null) q.add(node.left);\n        if (node.right != null) q.add(node.right);\n    }\n}`,
  },
  "bst-search": {
    title: "Search in a Binary Search Tree",
    pseudocode: `function search(node, target):
    while node is not null:
        if node.value == target: return node
        if target < node.value: node = node.left
        else: node = node.right
    return null`,
    js: `function search(node, target) {\n  while (node !== null) {\n    if (node.value === target) return node;\n    if (target < node.value) node = node.left;\n    else node = node.right;\n  }\n  return null;\n}`,
    py: `def search(node, target):\n    while node is not None:\n        if node.value == target: return node\n        if target < node.value: node = node.left\n        else: node = node.right\n    return None`,
    cpp: `Node* search(Node* node, int target) {\n    while (node != nullptr) {\n        if (node->value == target) return node;\n        if (target < node->value) node = node->left;\n        else node = node->right;\n    }\n    return nullptr;\n}`,
    java: `Node search(Node node, int target) {\n    while (node != null) {\n        if (node.value == target) return node;\n        if (target < node.value) node = node.left;\n        else node = node.right;\n    }\n    return null;\n}`,
  },
  "bst-insert": {
    title: "Insert into a Binary Search Tree",
    pseudocode: `function insert(root, value):
    if not root: return Node(value)
    curr = root
    while true:
        if value < curr.value:
            if not curr.left: curr.left = Node(value); break
            curr = curr.left
        else:
            if not curr.right: curr.right = Node(value); break
            curr = curr.right
    return root`,
    js: `function insert(root, value) {\n  if (!root) return { value, left: null, right: null };\n  let curr = root;\n  while (true) {\n    if (value < curr.value) {\n      if (!curr.left) { curr.left = { value, left: null, right: null }; break; }\n      curr = curr.left;\n    } else {\n      if (!curr.right) { curr.right = { value, left: null, right: null }; break; }\n      curr = curr.right;\n    }\n  }\n  return root;\n}`,
    py: `def insert(root, value):\n    if not root: return Node(value)\n    curr = root\n    while True:\n        if value < curr.value:\n            if not curr.left:\n                curr.left = Node(value)\n                break\n            curr = curr.left\n        else:\n            if not curr.right:\n                curr.right = Node(value)\n                break\n            curr = curr.right\n    return root`,
    cpp: `Node* insert(Node* root, int value) {\n    if (!root) return new Node(value);\n    Node* curr = root;\n    while (true) {\n        if (value < curr->value) {\n            if (!curr->left) { curr->left = new Node(value); break; }\n            curr = curr->left;\n        } else {\n            if (!curr->right) { curr->right = new Node(value); break; }\n            curr = curr->right;\n        }\n    }\n    return root;\n}`,
    java: `Node insert(Node root, int value) {\n    if (root == null) return new Node(value);\n    Node curr = root;\n    while (true) {\n        if (value < curr.value) {\n            if (curr.left == null) { curr.left = new Node(value); break; }\n            curr = curr.left;\n        } else {\n            if (curr.right == null) { curr.right = new Node(value); break; }\n            curr = curr.right;\n        }\n    }\n    return root;\n}`,
  },
  "bst-deletion": {
    title: "Delete a node from a BST",
    js: `function deleteNode(root, key) {\n  if (!root) return null;\n  if (key < root.value) root.left = deleteNode(root.left, key);\n  else if (key > root.value) root.right = deleteNode(root.right, key);\n  else {\n    if (!root.left) return root.right;\n    if (!root.right) return root.left;\n    let minNode = root.right;\n    while (minNode.left) minNode = minNode.left;\n    root.value = minNode.value;\n    root.right = deleteNode(root.right, root.value);\n  }\n  return root;\n}`,
    py: `def delete_node(root, key):\n    if not root: return None\n    if key < root.value: root.left = delete_node(root.left, key)\n    elif key > root.value: root.right = delete_node(root.right, key)\n    else:\n        if not root.left: return root.right\n        if not root.right: return root.left\n        min_node = root.right\n        while min_node.left: min_node = min_node.left\n        root.value = min_node.value\n        root.right = delete_node(root.right, root.value)\n    return root`,
    cpp: `Node* deleteNode(Node* root, int key) {\n    if (!root) return nullptr;\n    if (key < root->value) root->left = deleteNode(root->left, key);\n    else if (key > root->value) root->right = deleteNode(root->right, key);\n    else {\n        if (!root->left) { Node* temp = root->right; delete root; return temp; }\n        if (!root->right) { Node* temp = root->left; delete root; return temp; }\n        Node* minNode = root->right;\n        while (minNode->left) minNode = minNode->left;\n        root->value = minNode->value;\n        root->right = deleteNode(root->right, root->value);\n    }\n    return root;\n}`,
    java: `Node deleteNode(Node root, int key) {\n    if (root == null) return null;\n    if (key < root.value) root.left = deleteNode(root.left, key);\n    else if (key > root.value) root.right = deleteNode(root.right, key);\n    else {\n        if (root.left == null) return root.right;\n        if (root.right == null) return root.left;\n        Node minNode = root.right;\n        while (minNode.left != null) minNode = minNode.left;\n        root.value = minNode.value;\n        root.right = deleteNode(root.right, root.value);\n    }\n    return root;\n}`,
  },
  "lowest-common-ancestor": {
    title: "Lowest Common Ancestor in a BST",
    js: `function lowestCommonAncestor(root, p, q) {\n  while (root) {\n    if (p.value < root.value && q.value < root.value) root = root.left;\n    else if (p.value > root.value && q.value > root.value) root = root.right;\n    else return root;\n  }\n  return null;\n}`,
    py: `def lowest_common_ancestor(root, p, q):\n    while root:\n        if p.value < root.value and q.value < root.value: root = root.left\n        elif p.value > root.value and q.value > root.value: root = root.right\n        else: return root\n    return None`,
    cpp: `Node* lowestCommonAncestor(Node* root, Node* p, Node* q) {\n    while (root) {\n        if (p->value < root->value && q->value < root->value) root = root->left;\n        else if (p->value > root->value && q->value > root->value) root = root->right;\n        else return root;\n    }\n    return nullptr;\n}`,
    java: `Node lowestCommonAncestor(Node root, Node p, Node q) {\n    while (root != null) {\n        if (p.value < root.value && q.value < root.value) root = root.left;\n        else if (p.value > root.value && q.value > root.value) root = root.right;\n        else return root;\n    }\n    return null;\n}`,
  },
  "heap-insert": {
    title: "Insert into a Min Heap",
    js: `function insertHeap(heap, val) {\n  heap.push(val);\n  let i = heap.length - 1;\n  while (i > 0) {\n    let p = Math.floor((i - 1) / 2);\n    if (heap[p] <= heap[i]) break;\n    [heap[p], heap[i]] = [heap[i], heap[p]];\n    i = p;\n  }\n}`,
    py: `def insert_heap(heap, val):\n    heap.append(val)\n    i = len(heap) - 1\n    while i > 0:\n        p = (i - 1) // 2\n        if heap[p] <= heap[i]: break\n        heap[p], heap[i] = heap[i], heap[p]\n        i = p`,
    cpp: `void insertHeap(vector<int>& heap, int val) {\n    heap.push_back(val);\n    int i = heap.size() - 1;\n    while (i > 0) {\n        int p = (i - 1) / 2;\n        if (heap[p] <= heap[i]) break;\n        swap(heap[p], heap[i]);\n        i = p;\n    }\n}`,
    java: `void insertHeap(List<Integer> heap, int val) {\n    heap.add(val);\n    int i = heap.size() - 1;\n    while (i > 0) {\n        int p = (i - 1) / 2;\n        if (heap.get(p) <= heap.get(i)) break;\n        int temp = heap.get(p);\n        heap.set(p, heap.get(i));\n        heap.set(i, temp);\n        i = p;\n    }\n}`,
  },
  "trie-insert-word": {
    title: "Insert Word into a Trie",
    js: `function insertTrie(root, word) {\n  let curr = root;\n  for (let ch of word) {\n    if (!curr.children[ch]) curr.children[ch] = { children: {}, isEnd: false };\n    curr = curr.children[ch];\n  }\n  curr.isEnd = true;\n}`,
    py: `def insert_trie(root, word):\n    curr = root\n    for ch in word:\n        if ch not in curr.children:\n            curr.children[ch] = TrieNode()\n        curr = curr.children[ch]\n    curr.is_end = True`,
    cpp: `void insertTrie(TrieNode* root, string word) {\n    TrieNode* curr = root;\n    for (char ch : word) {\n        if (!curr->children.count(ch)) curr->children[ch] = new TrieNode();\n        curr = curr->children[ch];\n    }\n    curr->isEnd = true;\n}`,
    java: `void insertTrie(TrieNode root, String word) {\n    TrieNode curr = root;\n    for (char ch : word.toCharArray()) {\n        curr.children.putIfAbsent(ch, new TrieNode());\n        curr = curr.children.get(ch);\n    }\n    curr.isEnd = true;\n}`,
  },
  "build-segment-tree": {
    title: "Build a Segment Tree (Sum)",
    js: `function buildTree(arr, tree, node, start, end) {\n  if (start === end) {\n    tree[node] = arr[start];\n  } else {\n    let mid = Math.floor((start + end) / 2);\n    buildTree(arr, tree, 2 * node + 1, start, mid);\n    buildTree(arr, tree, 2 * node + 2, mid + 1, end);\n    tree[node] = tree[2 * node + 1] + tree[2 * node + 2];\n  }\n}`,
    py: `def build_tree(arr, tree, node, start, end):\n    if start == end:\n        tree[node] = arr[start]\n    else:\n        mid = (start + end) // 2\n        build_tree(arr, tree, 2 * node + 1, start, mid)\n        build_tree(arr, tree, 2 * node + 2, mid + 1, end)\n        tree[node] = tree[2 * node + 1] + tree[2 * node + 2]`,
    cpp: `void buildTree(vector<int>& arr, vector<int>& tree, int node, int start, int end) {\n    if (start == end) {\n        tree[node] = arr[start];\n    } else {\n        int mid = (start + end) / 2;\n        buildTree(arr, tree, 2 * node + 1, start, mid);\n        buildTree(arr, tree, 2 * node + 2, mid + 1, end);\n        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];\n    }\n}`,
    java: `void buildTree(int[] arr, int[] tree, int node, int start, int end) {\n    if (start == end) {\n        tree[node] = arr[start];\n    } else {\n        int mid = (start + end) / 2;\n        buildTree(arr, tree, 2 * node + 1, start, mid);\n        buildTree(arr, tree, 2 * node + 2, mid + 1, end);\n        tree[node] = tree[2 * node + 1] + tree[2 * node + 2];\n    }\n}`,
  },
  "tree-types": {
    title: "Binary Tree vs Binary Search Tree Node",
    js: `// Both use the same structure\nclass TreeNode {\n  constructor(value) {\n    this.value = value;\n    this.left = null;\n    this.right = null;\n  }\n}`,
    py: `class TreeNode:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None`,
    cpp: `struct TreeNode {\n    int value;\n    TreeNode* left;\n    TreeNode* right;\n    TreeNode(int val) : value(val), left(nullptr), right(nullptr) {}\n};`,
    java: `class TreeNode {\n    int value;\n    TreeNode left;\n    TreeNode right;\n    TreeNode(int val) { this.value = val; }\n}`,
  },
};

const aliases: Record<string, string> = {
  "binary-tree-traversal": "tree-inorder",
  "inorder-traversal": "tree-inorder",
  "preorder-traversal": "tree-preorder",
  "postorder-traversal": "tree-postorder",
  "level-order-traversal": "tree-level-order",
  "bst-insertion": "bst-insert",
};

export function getTreeCodeExamples(slug: string, algorithmId: string): CodeExample[] {
  const actualSlug = aliases[slug] || slug;
  const snippet = snippets[actualSlug];
  if (!snippet) return [];

  return [
    {
      id: `${algorithmId}-js`,
      algorithmId,
      language: "javascript",
      isPrimary: true,
      explanation: snippet.title,
      code: snippet.js,
    },
    {
      id: `${algorithmId}-py`,
      algorithmId,
      language: "python",
      isPrimary: false,
      explanation: snippet.title,
      code: snippet.py,
    },
    {
      id: `${algorithmId}-cpp`,
      algorithmId,
      language: "cpp",
      isPrimary: false,
      explanation: snippet.title,
      code: snippet.cpp,
    },
    {
      id: `${algorithmId}-java`,
      algorithmId,
      language: "java",
      isPrimary: false,
      explanation: snippet.title,
      code: snippet.java,
    },
  ];
}
