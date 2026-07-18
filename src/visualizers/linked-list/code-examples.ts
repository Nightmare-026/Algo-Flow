import { CodeExample } from "@/types";

const snippets: Record<
  string,
  { title: string; js: string; py: string; cpp: string; java: string }
> = {
  "sll-traversal": {
    title: "Traverses a singly linked list from head to tail.",
    js: `function traverse(head) {\n  let current = head;\n  while (current !== null) {\n    console.log(current.value);\n    current = current.next;\n  }\n}`,
    py: `def traverse(head):\n    current = head\n    while current is not None:\n        print(current.value)\n        current = current.next`,
    cpp: `void traverse(Node* head) {\n    Node* current = head;\n    while (current != nullptr) {\n        cout << current->value << endl;\n        current = current->next;\n    }\n}`,
    java: `void traverse(Node head) {\n    Node current = head;\n    while (current != null) {\n        System.out.println(current.value);\n        current = current.next;\n    }\n}`,
  },
  "sll-search": {
    title: "Searches for a value in a singly linked list.",
    js: `function search(head, target) {\n  let current = head;\n  while (current !== null) {\n    if (current.value === target) return true;\n    current = current.next;\n  }\n  return false;\n}`,
    py: `def search(head, target):\n    current = head\n    while current is not None:\n        if current.value == target:\n            return True\n        current = current.next\n    return False`,
    cpp: `bool search(Node* head, int target) {\n    Node* current = head;\n    while (current != nullptr) {\n        if (current->value == target) return true;\n        current = current->next;\n    }\n    return false;\n}`,
    java: `boolean search(Node head, int target) {\n    Node current = head;\n    while (current != null) {\n        if (current.value == target) return true;\n        current = current.next;\n    }\n    return false;\n}`,
  },
  "sll-insert-head": {
    title: "Inserts a new node at the head of the list.",
    js: `function insertAtHead(head, value) {\n  return { value, next: head };\n}`,
    py: `def insert_at_head(head, value):\n    return Node(value, head)`,
    cpp: `Node* insertAtHead(Node* head, int value) {\n    Node* node = new Node(value);\n    node->next = head;\n    return node;\n}`,
    java: `Node insertAtHead(Node head, int value) {\n    Node node = new Node(value);\n    node.next = head;\n    return node;\n}`,
  },
  "sll-insert-tail": {
    title: "Inserts a new node at the tail of the list.",
    js: `function insertAtTail(head, value) {\n  const node = { value, next: null };\n  if (!head) return node;\n  let current = head;\n  while (current.next) current = current.next;\n  current.next = node;\n  return head;\n}`,
    py: `def insert_at_tail(head, value):\n    node = Node(value)\n    if head is None:\n        return node\n    current = head\n    while current.next is not None:\n        current = current.next\n    current.next = node\n    return head`,
    cpp: `Node* insertAtTail(Node* head, int value) {\n    Node* node = new Node(value);\n    if (!head) return node;\n    Node* current = head;\n    while (current->next) current = current->next;\n    current->next = node;\n    return head;\n}`,
    java: `Node insertAtTail(Node head, int value) {\n    Node node = new Node(value);\n    if (head == null) return node;\n    Node current = head;\n    while (current.next != null) current = current.next;\n    current.next = node;\n    return head;\n}`,
  },
  "sll-delete": {
    title: "Deletes the first occurrence of a value from the list.",
    js: `function deleteValue(head, value) {\n  if (!head) return null;\n  if (head.value === value) return head.next;\n  let current = head;\n  while (current.next && current.next.value !== value) current = current.next;\n  if (current.next) current.next = current.next.next;\n  return head;\n}`,
    py: `def delete_value(head, value):\n    if head is None:\n        return None\n    if head.value == value:\n        return head.next\n    current = head\n    while current.next and current.next.value != value:\n        current = current.next\n    if current.next:\n        current.next = current.next.next\n    return head`,
    cpp: `Node* deleteValue(Node* head, int value) {\n    if (!head) return nullptr;\n    if (head->value == value) return head->next;\n    Node* current = head;\n    while (current->next && current->next->value != value) current = current->next;\n    if (current->next) current->next = current->next->next;\n    return head;\n}`,
    java: `Node deleteValue(Node head, int value) {\n    if (head == null) return null;\n    if (head.value == value) return head.next;\n    Node current = head;\n    while (current.next != null && current.next.value != value) current = current.next;\n    if (current.next != null) current.next = current.next.next;\n    return head;\n}`,
  },
  "linked-list-types": {
    title: "Singly, Doubly, and Circular Linked Lists Layouts",
    js: `// Singly Linked List Node\nclass SNode {\n  constructor(val) { this.val = val; this.next = null; }\n}\n\n// Doubly Linked List Node\nclass DNode {\n  constructor(val) { this.val = val; this.next = null; this.prev = null; }\n}\n\n// Circular Linked List\n// The last node points back to the head:\n// tail.next = head;`,
    py: `# Singly Linked List Node\nclass SNode:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\n# Doubly Linked List Node\nclass DNode:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n        self.prev = None\n\n# Circular Linked List\n# tail.next = head`,
    cpp: `// Singly\nstruct SNode {\n    int val;\n    SNode* next;\n};\n\n// Doubly\nstruct DNode {\n    int val;\n    DNode* next;\n    DNode* prev;\n};\n\n// Circular Linked List\ntail->next = head;`,
    java: `// Singly\nclass SNode {\n    int val;\n    SNode next;\n}\n\n// Doubly\nclass DNode {\n    int val;\n    DNode next;\n    DNode prev;\n}\n\n// Circular Linked List\ntail.next = head;`,
  },
  "sll-insert-position": {
    title: "Inserts a node at a specific position (index 0 = head).",
    js: `function insertAt(head, value, pos) {\n  const node = { value, next: null };\n  if (pos === 0) {\n    node.next = head;\n    return node;\n  }\n  let curr = head;\n  for (let i = 0; i < pos - 1 && curr; i++) curr = curr.next;\n  if (curr) {\n    node.next = curr.next;\n    curr.next = node;\n  }\n  return head;\n}`,
    py: `def insert_at(head, value, pos):\n    node = Node(value)\n    if pos == 0:\n        node.next = head\n        return node\n    curr = head\n    for _ in range(pos - 1):\n        if not curr: break\n        curr = curr.next\n    if curr:\n        node.next = curr.next\n        curr.next = node\n    return head`,
    cpp: `Node* insertAt(Node* head, int value, int pos) {\n    Node* node = new Node(value);\n    if (pos == 0) {\n        node->next = head;\n        return node;\n    }\n    Node* curr = head;\n    for (int i = 0; i < pos - 1 && curr; i++) curr = curr->next;\n    if (curr) {\n        node->next = curr->next;\n        curr->next = node;\n    }\n    return head;\n}`,
    java: `Node insertAt(Node head, int value, int pos) {\n    Node node = new Node(value);\n    if (pos == 0) {\n        node.next = head;\n        return node;\n    }\n    Node curr = head;\n    for (int i = 0; i < pos - 1 && curr != null; i++) curr = curr.next;\n    if (curr != null) {\n        node.next = curr.next;\n        curr.next = node;\n    }\n    return head;\n}`,
  },
  "sll-delete-head": {
    title: "Removes the head node and returns the new head.",
    js: `function deleteHead(head) {\n  if (!head) return null;\n  return head.next;\n}`,
    py: `def delete_head(head):\n    if not head: return None\n    return head.next`,
    cpp: `Node* deleteHead(Node* head) {\n    if (!head) return nullptr;\n    Node* temp = head;\n    head = head->next;\n    delete temp;\n    return head;\n}`,
    java: `Node deleteHead(Node head) {\n    if (head == null) return null;\n    return head.next;\n}`,
  },
  "sll-reverse": {
    title: "Reverses the linked list in place using three pointers.",
    js: `function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    let nxt = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nxt;\n  }\n  return prev;\n}`,
    py: `def reverse_list(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev`,
    cpp: `Node* reverseList(Node* head) {\n    Node* prev = nullptr;\n    Node* curr = head;\n    while (curr) {\n        Node* nxt = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nxt;\n    }\n    return prev;\n}`,
    java: `Node reverseList(Node head) {\n    Node prev = null, curr = head;\n    while (curr != null) {\n        Node nxt = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nxt;\n    }\n    return prev;\n}`,
  },
  "sll-detect-cycle": {
    title: "Detects a cycle using Floyd's Tortoise and Hare.",
    js: `function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}`,
    py: `def has_cycle(head):\n    slow, fast = head, head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False`,
    cpp: `bool hasCycle(Node* head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return true;\n    }\n    return false;\n}`,
    java: `boolean hasCycle(Node head) {\n    Node slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow == fast) return true;\n    }\n    return false;\n}`,
  },
};

export function getLinkedListCodeExamples(slug: string, algorithmId: string): CodeExample[] {
  const snippet = snippets[slug];
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
