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
  "sll-delete-tail": {
    title: "Deletes the last node in a singly linked list.",
    js: `function deleteTail(head) {\n  if (!head || !head.next) return null;\n  let curr = head;\n  while (curr.next.next) curr = curr.next;\n  curr.next = null;\n  return head;\n}`,
    py: `def delete_tail(head):\n    if not head or not head.next: return None\n    curr = head\n    while curr.next.next:\n        curr = curr.next\n    curr.next = None\n    return head`,
    cpp: `Node* deleteTail(Node* head) {\n    if (!head || !head->next) return nullptr;\n    Node* curr = head;\n    while (curr->next->next) curr = curr->next;\n    delete curr->next;\n    curr->next = nullptr;\n    return head;\n}`,
    java: `Node deleteTail(Node head) {\n    if (head == null || head.next == null) return null;\n    Node curr = head;\n    while (curr.next.next != null) curr = curr.next;\n    curr.next = null;\n    return head;\n}`,
  },
  "sll-find-middle": {
    title: "Finds the middle node of a linked list using slow and fast pointers.",
    js: `function findMiddle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n  }\n  return slow;\n}`,
    py: `def find_middle(head):\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n    return slow`,
    cpp: `Node* findMiddle(Node* head) {\n    Node *slow = head, *fast = head;\n    while (fast && fast->next) {\n        slow = slow->next;\n        fast = fast->next->next;\n    }\n    return slow;\n}`,
    java: `Node findMiddle(Node head) {\n    Node slow = head, fast = head;\n    while (fast != null && fast.next != null) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    return slow;\n}`,
  },
  "sll-remove-duplicates": {
    title: "Removes duplicates from a sorted linked list.",
    js: `function removeDuplicates(head) {\n  let curr = head;\n  while (curr && curr.next) {\n    if (curr.value === curr.next.value) curr.next = curr.next.next;\n    else curr = curr.next;\n  }\n  return head;\n}`,
    py: `def remove_duplicates(head):\n    curr = head\n    while curr and curr.next:\n        if curr.value == curr.next.value:\n            curr.next = curr.next.next\n        else:\n            curr = curr.next\n    return head`,
    cpp: `Node* removeDuplicates(Node* head) {\n    Node* curr = head;\n    while (curr && curr->next) {\n        if (curr->value == curr->next->value) {\n            Node* temp = curr->next;\n            curr->next = curr->next->next;\n            delete temp;\n        } else curr = curr->next;\n    }\n    return head;\n}`,
    java: `Node removeDuplicates(Node head) {\n    Node curr = head;\n    while (curr != null && curr.next != null) {\n        if (curr.value == curr.next.value) curr.next = curr.next.next;\n        else curr = curr.next;\n    }\n    return head;\n}`,
  },
  "dll-traversal": {
    title: "Traverses a doubly linked list forward and backward.",
    js: `function traverseDLL(head, tail) {\n  let curr = head;\n  while (curr) {\n    console.log(curr.value);\n    curr = curr.next;\n  }\n  curr = tail;\n  while (curr) {\n    console.log(curr.value);\n    curr = curr.prev;\n  }\n}`,
    py: `def traverse_dll(head, tail):\n    curr = head\n    while curr:\n        print(curr.value)\n        curr = curr.next\n    curr = tail\n    while curr:\n        print(curr.value)\n        curr = curr.prev`,
    cpp: `void traverseDLL(DNode* head, DNode* tail) {\n    DNode* curr = head;\n    while (curr) {\n        cout << curr->val << " ";\n        curr = curr->next;\n    }\n    curr = tail;\n    while (curr) {\n        cout << curr->val << " ";\n        curr = curr->prev;\n    }\n}`,
    java: `void traverseDLL(DNode head, DNode tail) {\n    DNode curr = head;\n    while (curr != null) {\n        System.out.print(curr.val + " ");\n        curr = curr.next;\n    }\n    curr = tail;\n    while (curr != null) {\n        System.out.print(curr.val + " ");\n        curr = curr.prev;\n    }\n}`,
  },
  "dll-insert-head": {
    title: "Inserts a node at the head of a doubly linked list.",
    js: `function insertHeadDLL(head, val) {\n  const node = { value: val, prev: null, next: head };\n  if (head) head.prev = node;\n  return node;\n}`,
    py: `def insert_head_dll(head, val):\n    node = DNode(val, next=head)\n    if head: head.prev = node\n    return node`,
    cpp: `DNode* insertHeadDLL(DNode* head, int val) {\n    DNode* node = new DNode(val);\n    node->next = head;\n    if (head) head->prev = node;\n    return node;\n}`,
    java: `DNode insertHeadDLL(DNode head, int val) {\n    DNode node = new DNode(val);\n    node.next = head;\n    if (head != null) head.prev = node;\n    return node;\n}`,
  },
  "dll-insert-tail": {
    title: "Inserts a node at the tail of a doubly linked list in O(1).",
    js: `function insertTailDLL(tail, val) {\n  const node = { value: val, prev: tail, next: null };\n  if (tail) tail.next = node;\n  return node;\n}`,
    py: `def insert_tail_dll(tail, val):\n    node = DNode(val, prev=tail)\n    if tail: tail.next = node\n    return node`,
    cpp: `DNode* insertTailDLL(DNode* tail, int val) {\n    DNode* node = new DNode(val);\n    node->prev = tail;\n    if (tail) tail->next = node;\n    return node;\n}`,
    java: `DNode insertTailDLL(DNode tail, int val) {\n    DNode node = new DNode(val);\n    node.prev = tail;\n    if (tail != null) tail.next = node;\n    return node;\n}`,
  },
  "dll-delete-head": {
    title: "Deletes the head node of a doubly linked list in O(1).",
    js: `function deleteHeadDLL(head) {\n  if (!head) return null;\n  const newHead = head.next;\n  if (newHead) newHead.prev = null;\n  return newHead;\n}`,
    py: `def delete_head_dll(head):\n    if not head: return None\n    new_head = head.next\n    if new_head: new_head.prev = None\n    return new_head`,
    cpp: `DNode* deleteHeadDLL(DNode* head) {\n    if (!head) return nullptr;\n    DNode* newHead = head->next;\n    if (newHead) newHead->prev = nullptr;\n    delete head;\n    return newHead;\n}`,
    java: `DNode deleteHeadDLL(DNode head) {\n    if (head == null) return null;\n    DNode newHead = head.next;\n    if (newHead != null) newHead.prev = null;\n    return newHead;\n}`,
  },
  "dll-delete-tail": {
    title: "Deletes the tail node of a doubly linked list in O(1).",
    js: `function deleteTailDLL(tail) {\n  if (!tail) return null;\n  const newTail = tail.prev;\n  if (newTail) newTail.next = null;\n  return newTail;\n}`,
    py: `def delete_tail_dll(tail):\n    if not tail: return None\n    new_tail = tail.prev\n    if new_tail: new_tail.next = None\n    return new_tail`,
    cpp: `DNode* deleteTailDLL(DNode* tail) {\n    if (!tail) return nullptr;\n    DNode* newTail = tail->prev;\n    if (newTail) newTail->next = nullptr;\n    delete tail;\n    return newTail;\n}`,
    java: `DNode deleteTailDLL(DNode tail) {\n    if (tail == null) return null;\n    DNode newTail = tail.prev;\n    if (newTail != null) newTail.next = null;\n    return newTail;\n}`,
  },
  "dll-reverse": {
    title: "Reverses a doubly linked list by swapping prev and next pointers.",
    js: `function reverseDLL(head) {\n  let curr = head, temp = null;\n  while (curr) {\n    temp = curr.prev;\n    curr.prev = curr.next;\n    curr.next = temp;\n    curr = curr.prev;\n  }\n  return temp ? temp.prev : head;\n}`,
    py: `def reverse_dll(head):\n    curr = head\n    temp = None\n    while curr:\n        temp = curr.prev\n        curr.prev = curr.next\n        curr.next = temp\n        curr = curr.prev\n    return temp.prev if temp else head`,
    cpp: `DNode* reverseDLL(DNode* head) {\n    DNode *curr = head, *temp = nullptr;\n    while (curr) {\n        temp = curr->prev;\n        curr->prev = curr->next;\n        curr->next = temp;\n        curr = curr->prev;\n    }\n    return temp ? temp->prev : head;\n}`,
    java: `DNode reverseDLL(DNode head) {\n    DNode curr = head, temp = null;\n    while (curr != null) {\n        temp = curr.prev;\n        curr.prev = curr.next;\n        curr.next = temp;\n        curr = curr.prev;\n    }\n    return temp != null ? temp.prev : head;\n}`,
  },
  "cll-traversal": {
    title: "Traverses a circular singly linked list.",
    js: `function traverseCLL(head) {\n  if (!head) return;\n  let curr = head;\n  do {\n    console.log(curr.value);\n    curr = curr.next;\n  } while (curr !== head);\n}`,
    py: `def traverse_cll(head):\n    if not head: return\n    curr = head\n    while True:\n        print(curr.value)\n        curr = curr.next\n        if curr == head: break`,
    cpp: `void traverseCLL(Node* head) {\n    if (!head) return;\n    Node* curr = head;\n    do {\n        cout << curr->value << " ";\n        curr = curr->next;\n    } while (curr != head);\n}`,
    java: `void traverseCLL(Node head) {\n    if (head == null) return;\n    Node curr = head;\n    do {\n        System.out.print(curr.value + " ");\n        curr = curr.next;\n    } while (curr != head);\n}`,
  },
  "cll-insert-head": {
    title: "Inserts a node at the head of a circular linked list.",
    js: `function insertHeadCLL(head, val) {\n  const node = { value: val, next: head };\n  if (!head) { node.next = node; return node; }\n  let curr = head;\n  while (curr.next !== head) curr = curr.next;\n  curr.next = node;\n  return node;\n}`,
    py: `def insert_head_cll(head, val):\n    node = Node(val, next=head)\n    if not head:\n        node.next = node\n        return node\n    curr = head\n    while curr.next != head:\n        curr = curr.next\n    curr.next = node\n    return node`,
    cpp: `Node* insertHeadCLL(Node* head, int val) {\n    Node* node = new Node(val);\n    if (!head) { node->next = node; return node; }\n    Node* curr = head;\n    while (curr->next != head) curr = curr->next;\n    curr->next = node;\n    node->next = head;\n    return node;\n}`,
    java: `Node insertHeadCLL(Node head, int val) {\n    Node node = new Node(val);\n    if (head == null) { node.next = node; return node; }\n    Node curr = head;\n    while (curr.next != head) curr = curr.next;\n    curr.next = node;\n    node.next = head;\n    return node;\n}`,
  },
  "cll-insert-tail": {
    title: "Inserts a node at the tail of a circular linked list in O(1) with tail reference.",
    js: `function insertTailCLL(head, tail, val) {\n  const node = { value: val, next: head };\n  if (!head) { node.next = node; return node; }\n  tail.next = node;\n  return node;\n}`,
    py: `def insert_tail_cll(head, tail, val):\n    node = Node(val, next=head)\n    if not head:\n        node.next = node\n        return node\n    tail.next = node\n    return node`,
    cpp: `Node* insertTailCLL(Node* head, Node* tail, int val) {\n    Node* node = new Node(val);\n    node->next = head;\n    if (!head) { node->next = node; return node; }\n    tail->next = node;\n    return node;\n}`,
    java: `Node insertTailCLL(Node head, Node tail, int val) {\n    Node node = new Node(val);\n    node.next = head;\n    if (head == null) { node.next = node; return node; }\n    tail.next = node;\n    return node;\n}`,
  },
  "cll-delete-head": {
    title: "Deletes the head node of a circular linked list.",
    js: `function deleteHeadCLL(head, tail) {\n  if (!head || head.next === head) return null;\n  const newHead = head.next;\n  tail.next = newHead;\n  return newHead;\n}`,
    py: `def delete_head_cll(head, tail):\n    if not head or head.next == head: return None\n    new_head = head.next\n    tail.next = new_head\n    return new_head`,
    cpp: `Node* deleteHeadCLL(Node* head, Node* tail) {\n    if (!head || head->next == head) return nullptr;\n    Node* newHead = head->next;\n    tail->next = newHead;\n    delete head;\n    return newHead;\n}`,
    java: `Node deleteHeadCLL(Node head, Node tail) {\n    if (head == null || head.next == head) return null;\n    Node newHead = head.next;\n    tail.next = newHead;\n    return newHead;\n}`,
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
