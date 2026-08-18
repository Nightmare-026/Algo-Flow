import { CodeExample } from "@/types";

const queueSnippets: Record<
  string,
  { title: string; js: string; py: string; cpp: string; java: string }
> = {
  "queue-enqueue": {
    title: "Adds an element to the rear of the queue.",
    js: `queue.push(value);`,
    py: `queue.append(value)`,
    cpp: `std::queue<int> queue;\nqueue.push(value);`,
    java: `Queue<Integer> queue = new LinkedList<>();\nqueue.add(value);`,
  },
  "queue-dequeue": {
    title: "Removes the front element from the queue.",
    js: `const value = queue.shift();`,
    py: `value = queue.pop(0)`,
    cpp: `int value = queue.front();\nqueue.pop();`,
    java: `int value = queue.poll();`,
  },
  "queue-peek": {
    title: "Reads the front element without removing it.",
    js: `const front = queue[0];`,
    py: `front = queue[0]`,
    cpp: `int front = queue.front();`,
    java: `int front = queue.peek();`,
  },
  "queue-front-rear": {
    title: "Reads both queue ends without changing the queue.",
    js: `const front = queue[0];\nconst rear = queue[queue.length - 1];`,
    py: `front = queue[0]\nrear = queue[-1]`,
    cpp: `int front = queue.front();\nint rear = queue.back();`,
    java: `int front = queue.peek();\nint rear = ((LinkedList<Integer>) queue).getLast();`,
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
    js: `deque.unshift(value);`,
    py: `from collections import deque\nd = deque()\nd.appendleft(value)`,
    cpp: `#include <deque>\nstd::deque<int> dq;\ndq.push_front(value);`,
    java: `import java.util.ArrayDeque;\nimport java.util.Deque;\nDeque<Integer> dq = new ArrayDeque<>();\ndq.addFirst(value);`,
  },
  "deque-pop-rear": {
    title: "Pop element from rear of Deque",
    js: `const val = deque.pop();`,
    py: `val = d.pop()`,
    cpp: `int val = dq.back();\ndq.pop_back();`,
    java: `int val = dq.removeLast();`,
  },
  "priority-queue-enqueue": {
    title: "Enqueue element by priority",
    js: `pq.push({ value, priority });\npq.sort((a, b) => b.priority - a.priority);`,
    py: `import heapq\nheapq.heappush(pq, (-priority, value))`,
    cpp: `#include <queue>\nstd::priority_queue<int> pq;\npq.push(value);`,
    java: `import java.util.PriorityQueue;\nPriorityQueue<Integer> pq = new PriorityQueue<>((a, b) -> b - a);\npq.offer(value);`,
  },
  "priority-queue-dequeue": {
    title: "Dequeue highest priority element",
    js: `const highest = pq.shift();`,
    py: `priority, value = heapq.heappop(pq)`,
    cpp: `int highest = pq.top();\npq.pop();`,
    java: `int highest = pq.poll();`,
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
