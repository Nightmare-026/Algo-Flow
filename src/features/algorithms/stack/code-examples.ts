import { CodeExample } from "@/types";

const stackSnippets: Record<string, { title: string; js: string; py: string; cpp: string; java: string }> = {
  "stack-push": {
    title: "Adds an element to the top of the stack.",
    js: `stack.push(value);`,
    py: `stack.append(value)`,
    cpp: `std::stack<int> stack;\nstack.push(value);`,
    java: `Stack<Integer> stack = new Stack<>();\nstack.push(value);`,
  },
  "stack-pop": {
    title: "Removes the top element from the stack.",
    js: `const value = stack.pop();`,
    py: `value = stack.pop()`,
    cpp: `int value = stack.top();\nstack.pop();`,
    java: `int value = stack.pop();`,
  },
  "stack-peek": {
    title: "Reads the top element without removing it.",
    js: `const top = stack[stack.length - 1];`,
    py: `top = stack[-1]`,
    cpp: `int top = stack.top();`,
    java: `int top = stack.peek();`,
  },
  "stack-is-empty": {
    title: "Checks whether the stack is empty.",
    js: `const isEmpty = stack.length === 0;`,
    py: `is_empty = len(stack) == 0`,
    cpp: `bool isEmpty = stack.empty();`,
    java: `boolean isEmpty = stack.empty();`,
  },
  "stack-is-full": {
    title: "Checks whether a fixed-capacity stack is full.",
    js: `const isFull = stack.length === capacity;`,
    py: `is_full = len(stack) == capacity`,
    cpp: `bool isFull = size == capacity;`,
    java: `boolean isFull = stack.size() == capacity;`,
  },
  "stack-size": {
    title: "Returns the current number of stack elements.",
    js: `const size = stack.length;`,
    py: `size = len(stack)`,
    cpp: `size_t size = stack.size();`,
    java: `int size = stack.size();`,
  },
  "array-stack": {
    title: "Array-Based Stack Implementation",
    js: `class Stack {\n  constructor() { this.items = []; }\n  push(element) { this.items.push(element); }\n  pop() { if (this.items.length === 0) return "Underflow"; return this.items.pop(); }\n  peek() { return this.items[this.items.length - 1]; }\n  isEmpty() { return this.items.length === 0; }\n}`,
    py: `class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, item):\n        self.items.append(item)\n    def pop(self):\n        if not self.is_empty():\n            return self.items.pop()\n    def peek(self):\n        if not self.is_empty():\n            return self.items[-1]\n    def is_empty(self):\n        return len(self.items) == 0`,
    cpp: `class Stack {\n    int top;\n    int a[1000];\npublic:\n    Stack() { top = -1; }\n    bool push(int x) {\n        if (top >= 999) return false;\n        a[++top] = x;\n        return true;\n    }\n    int pop() {\n        if (top < 0) return 0;\n        return a[top--];\n    }\n    int peek() {\n        if (top < 0) return 0;\n        return a[top];\n    }\n    bool isEmpty() {\n        return (top < 0);\n    }\n};`,
    java: `class Stack {\n    static final int MAX = 1000;\n    int top;\n    int a[] = new int[MAX];\n    Stack() { top = -1; }\n    boolean push(int x) {\n        if (top >= (MAX - 1)) return false;\n        a[++top] = x;\n        return true;\n    }\n    int pop() {\n        if (top < 0) return 0;\n        return a[top--];\n    }\n    int peek() {\n        if (top < 0) return 0;\n        return a[top];\n    }\n    boolean isEmpty() { return (top < 0); }\n}`,
  },
};

export function getStackCodeExamples(slug: string, algorithmId: string): CodeExample[] {
  const snippet = stackSnippets[slug];
  if (!snippet) return [];

  return [
    { id: `${algorithmId}-js`, algorithmId, language: "javascript", isPrimary: true, explanation: snippet.title, code: snippet.js },
    { id: `${algorithmId}-py`, algorithmId, language: "python", isPrimary: false, explanation: snippet.title, code: snippet.py },
    { id: `${algorithmId}-cpp`, algorithmId, language: "cpp", isPrimary: false, explanation: snippet.title, code: `#include <stack>\n\n${snippet.cpp}` },
    { id: `${algorithmId}-java`, algorithmId, language: "java", isPrimary: false, explanation: snippet.title, code: `import java.util.Stack;\n\n${snippet.java}` },
  ];
}
