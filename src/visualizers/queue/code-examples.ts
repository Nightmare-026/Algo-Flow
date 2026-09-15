import { CodeExample } from "@/types";

const queueSnippets: Record<
  string,
  { title: string; js: string; py: string; cpp: string; java: string }
> = {
  "queue-enqueue": {
    title: "Adds an element to the rear of the queue.",
    js: `// Queue enqueue operation\nfunction enqueue(queue, value, capacity = 8) {\n  if (queue.length >= capacity) {\n    return false;\n  }\n  queue.push(value);\n  return true;\n}`,
    py: `# Queue enqueue operation\ndef enqueue(queue: list, value: int, capacity: int = 8) -> bool:\n    if len(queue) >= capacity:\n        return False\n    queue.append(value)\n    return True`,
    cpp: `bool enqueue(std::queue<int>& q, int value, int capacity = 8) {\n    if ((int)q.size() >= capacity) {\n        return false;\n    }\n    q.push(value);\n    return true;\n}`,
    java: `public static boolean enqueue(Queue<Integer> queue, int value, int capacity) {\n    if (queue.size() >= capacity) {\n        return false;\n    }\n    queue.add(value);\n    return true;\n}`,
  },
  "queue-dequeue": {
    title: "Removes the front element from the queue.",
    js: `// Queue dequeue operation\nfunction dequeue(queue) {\n  if (queue.length === 0) {\n    return null;\n  }\n  const front = queue[0];\n  queue.shift();\n  return front;\n}`,
    py: `# Queue dequeue operation\ndef dequeue(queue: list):\n    if len(queue) == 0:\n        return None\n    front = queue[0]\n    queue.pop(0)\n    return front`,
    cpp: `int dequeue(std::queue<int>& q) {\n    if (q.empty()) {\n        return -1;\n    }\n    int front = q.front();\n    q.pop();\n    return front;\n}`,
    java: `public static Integer dequeue(Queue<Integer> queue) {\n    if (queue.isEmpty()) {\n        return null;\n    }\n    int front = queue.peek();\n    queue.poll();\n    return front;\n}`,
  },
  "queue-peek": {
    title: "Reads the front element without removing it.",
    js: `function peek(queue) {\n  if (queue.length === 0) {\n    return null;\n  }\n  return queue[0];\n}`,
    py: `def peek(queue: list):\n    if len(queue) == 0:\n        return None\n    return queue[0]`,
    cpp: `int peek(const std::queue<int>& q) {\n    if (q.empty()) {\n        return -1;\n    }\n    return q.front();\n}`,
    java: `public static Integer peek(Queue<Integer> queue) {\n    if (queue.isEmpty()) {\n        return null;\n    }\n    return queue.peek();\n}`,
  },
  "queue-front-rear": {
    title: "Reads both queue ends without changing the queue.",
    js: `function getFrontAndRear(queue) {\n  if (queue.length === 0) return null;\n  const front = queue[0];\n  const rear = queue[queue.length - 1];\n  return { front, rear };\n}`,
    py: `def get_front_and_rear(queue: list):\n    if len(queue) == 0: return None\n    front = queue[0]\n    rear = queue[-1]\n    return front, rear`,
    cpp: `pair<int, int> getFrontAndRear(const std::queue<int>& q) {\n    if (q.empty()) return {-1, -1};\n    return {q.front(), q.back()};\n}`,
    java: `public static int[] getFrontAndRear(LinkedList<Integer> queue) {\n    if (queue.isEmpty()) return new int[0];\n    return new int[]{queue.getFirst(), queue.getLast()};\n}`,
  },
  "simple-queue": {
    title: "Simple Array-Based Queue Implementation",
    js: `class Queue {\n  constructor() { this.items = []; }\n  enqueue(element) { this.items.push(element); }\n  dequeue() { if(this.isEmpty()) return "Underflow"; return this.items.shift(); }\n  front() { if(this.isEmpty()) return "No elements"; return this.items[0]; }\n  isEmpty() { return this.items.length === 0; }\n}`,
    py: `class Queue:\n    def __init__(self):\n        self.items = []\n    def enqueue(self, item):\n        self.items.append(item)\n    def dequeue(self):\n        if not self.is_empty():\n            return self.items.pop(0)\n    def front(self):\n        if not self.is_empty():\n            return self.items[0]\n    def is_empty(self):\n        return len(self.items) == 0`,
    cpp: `class Queue {\n    int front, rear, size;\n    unsigned capacity;\n    int* array;\npublic:\n    Queue(unsigned capacity) {\n        this->capacity = capacity;\n        front = size = 0;\n        rear = capacity - 1;\n        array = new int[this->capacity];\n    }\n    bool isFull() { return (size == capacity); }\n    bool isEmpty() { return (size == 0); }\n    void enqueue(int item) {\n        if (isFull()) return;\n        rear = (rear + 1) % capacity;\n        array[rear] = item;\n        size = size + 1;\n    }\n    int dequeue() {\n        if (isEmpty()) return 0;\n        int item = array[front];\n        front = (front + 1) % capacity;\n        size = size - 1;\n        return item;\n    }\n};`,
    java: `class Queue {\n    int front, rear, size;\n    int capacity;\n    int array[];\n    public Queue(int capacity) {\n        this.capacity = capacity;\n        front = this.size = 0;\n        rear = capacity - 1;\n        array = new int[this.capacity];\n    }\n    boolean isFull() { return (this.size == this.capacity); }\n    boolean isEmpty() { return (this.size == 0); }\n    void enqueue(int item) {\n        if (isFull()) return;\n        this.rear = (this.rear + 1) % this.capacity;\n        this.array[this.rear] = item;\n        this.size = this.size + 1;\n    }\n    int dequeue() {\n        if (isEmpty()) return 0;\n        int item = this.array[this.front];\n        this.front = (this.front + 1) % this.capacity;\n        this.size = this.size - 1;\n        return item;\n    }\n}`,
  },
  "circular-queue": {
    title: "Circular Queue Implementation",
    js: `class CircularQueue {\n  constructor(k) {\n    this.queue = new Array(k);\n    this.head = -1; this.tail = -1; this.size = k;\n  }\n  enQueue(value) {\n    if (this.isFull()) return false;\n    if (this.isEmpty()) this.head = 0;\n    this.tail = (this.tail + 1) % this.size;\n    this.queue[this.tail] = value;\n    return true;\n  }\n  deQueue() {\n    if (this.isEmpty()) return false;\n    if (this.head === this.tail) { this.head = -1; this.tail = -1; }\n    else this.head = (this.head + 1) % this.size;\n    return true;\n  }\n  isFull() { return (this.tail + 1) % this.size === this.head; }\n  isEmpty() { return this.head === -1; }\n}`,
    py: `class CircularQueue:\n    def __init__(self, k):\n        self.queue = [None] * k\n        self.head = self.tail = -1\n        self.size = k\n    def enqueue(self, value):\n        if self.is_full(): return False\n        if self.is_empty(): self.head = 0\n        self.tail = (self.tail + 1) % self.size\n        self.queue[self.tail] = value\n        return True\n    def dequeue(self):\n        if self.is_empty(): return False\n        if self.head == self.tail: self.head = self.tail = -1\n        else: self.head = (self.head + 1) % self.size\n        return True\n    def is_full(self): return (self.tail + 1) % self.size == self.head\n    def is_empty(self): return self.head == -1`,
    cpp: `class CircularQueue {\n    int *arr;\n    int front, rear, size;\npublic:\n    CircularQueue(int k) {\n        size = k;\n        arr = new int[k];\n        front = rear = -1;\n    }\n    bool enQueue(int value) {\n        if (isFull()) return false;\n        if (isEmpty()) front = 0;\n        rear = (rear + 1) % size;\n        arr[rear] = value;\n        return true;\n    }\n    bool deQueue() {\n        if (isEmpty()) return false;\n        if (front == rear) front = rear = -1;\n        else front = (front + 1) % size;\n        return true;\n    }\n    bool isFull() { return (rear + 1) % size == front; }\n    bool isEmpty() { return front == -1; }\n};`,
    java: `class CircularQueue {\n    int[] arr;\n    int front, rear, size;\n    public CircularQueue(int k) {\n        size = k;\n        arr = new int[k];\n        front = rear = -1;\n    }\n    public boolean enQueue(int value) {\n        if (isFull()) return false;\n        if (isEmpty()) front = 0;\n        rear = (rear + 1) % size;\n        arr[rear] = value;\n        return true;\n    }\n    public boolean deQueue() {\n        if (isEmpty()) return false;\n        if (front == rear) front = rear = -1;\n        else front = (front + 1) % size;\n        return true;\n    }\n    public boolean isFull() { return (rear + 1) % size == front; }\n    public boolean isEmpty() { return front == -1; }\n}`,
  },
  "deque-push-front": {
    title: "Push element to front of Deque",
    js: `function pushFront(deque, value, capacity = 8) {\n  if (deque.length >= capacity) return false;\n  deque.unshift(value);\n  return true;\n}`,
    py: `def push_front(deque_list: list, value: int, capacity: int = 8) -> bool:\n    if len(deque_list) >= capacity: return False\n    deque_list.insert(0, value)\n    return True`,
    cpp: `bool pushFront(std::deque<int>& dq, int value, int capacity = 8) {\n    if ((int)dq.size() >= capacity) return false;\n    dq.push_front(value);\n    return true;\n}`,
    java: `public static boolean pushFront(java.util.Deque<Integer> dq, int value, int capacity) {\n    if (dq.size() >= capacity) return false;\n    dq.addFirst(value);\n    return true;\n}`,
  },
  "deque-pop-rear": {
    title: "Pop element from rear of Deque",
    js: `function popRear(deque) {\n  if (deque.length === 0) return null;\n  const val = deque[deque.length - 1];\n  deque.pop();\n  return val;\n}`,
    py: `def pop_rear(deque_list: list):\n    if len(deque_list) == 0: return None\n    val = deque_list[-1]\n    deque_list.pop()\n    return val`,
    cpp: `int popRear(std::deque<int>& dq) {\n    if (dq.empty()) return -1;\n    int val = dq.back();\n    dq.pop_back();\n    return val;\n}`,
    java: `public static Integer popRear(java.util.Deque<Integer> dq) {\n    if (dq.isEmpty()) return null;\n    int val = dq.peekLast();\n    dq.removeLast();\n    return val;\n}`,
  },
  "priority-queue-enqueue": {
    title: "Enqueue element by priority",
    js: `function priorityEnqueue(pq, value, capacity = 8) {\n  if (pq.length >= capacity) return false;\n  pq.push(value);\n  pq.sort((a, b) => b - a);\n  return true;\n}`,
    py: `def priority_enqueue(pq: list, value: int, capacity: int = 8) -> bool:\n    if len(pq) >= capacity: return False\n    pq.append(value)\n    pq.sort(reverse=True)\n    return True`,
    cpp: `bool priorityEnqueue(std::priority_queue<int>& pq, int value, int capacity = 8) {\n    if ((int)pq.size() >= capacity) return false;\n    pq.push(value);\n    return true;\n}`,
    java: `public static boolean priorityEnqueue(java.util.PriorityQueue<Integer> pq, int value, int capacity) {\n    if (pq.size() >= capacity) return false;\n    pq.offer(value);\n    return true;\n}`,
  },
  "priority-queue-dequeue": {
    title: "Dequeue highest priority element",
    js: `function priorityDequeue(pq) {\n  if (pq.length === 0) return null;\n  const highest = pq[0];\n  pq.shift();\n  return highest;\n}`,
    py: `def priority_dequeue(pq: list):\n    if len(pq) == 0: return None\n    highest = pq[0]\n    pq.pop(0)\n    return highest`,
    cpp: `int priorityDequeue(std::priority_queue<int>& pq) {\n    if (pq.empty()) return -1;\n    int highest = pq.top();\n    pq.pop();\n    return highest;\n}`,
    java: `public static Integer priorityDequeue(java.util.PriorityQueue<Integer> pq) {\n    if (pq.isEmpty()) return null;\n    int highest = pq.peek();\n    pq.poll();\n    return highest;\n}`,
  },
};

export function getQueueCodeExamples(slug: string, algorithmId: string): CodeExample[] {
  const snippet = queueSnippets[slug];
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
      code: `#include <queue>\n\n${snippet.cpp}`,
    },
    {
      id: `${algorithmId}-java`,
      algorithmId,
      language: "java",
      isPrimary: false,
      explanation: snippet.title,
      code: `import java.util.LinkedList;\nimport java.util.Queue;\n\n${snippet.java}`,
    },
  ];
}
