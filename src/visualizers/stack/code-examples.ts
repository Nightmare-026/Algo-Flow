import { CodeExample } from "@/types";

const stackSnippets: Record<
  string,
  { title: string; js: string; py: string; cpp: string; java: string }
> = {
  "stack-push": {
    title: "Adds an element to the top of the stack.",
    js: `function push(stack, value, capacity = 8) {\n  if (stack.length >= capacity) {\n    return false;\n  }\n  stack.push(value);\n  return true;\n}`,
    py: `def push(stack: list, value: int, capacity: int = 8) -> bool:\n    if len(stack) >= capacity:\n        return False\n    stack.append(value)\n    return True`,
    cpp: `bool push(std::stack<int>& st, int value, int capacity = 8) {\n    if ((int)st.size() >= capacity) {\n        return false;\n    }\n    st.push(value);\n    return true;\n}`,
    java: `public static boolean push(Stack<Integer> stack, int value, int capacity) {\n    if (stack.size() >= capacity) {\n        return false;\n    }\n    stack.push(value);\n    return true;\n}`,
  },
  "stack-pop": {
    title: "Removes the top element from the stack.",
    js: `function pop(stack) {\n  if (stack.length === 0) {\n    return null;\n  }\n  const top = stack[stack.length - 1];\n  stack.pop();\n  return top;\n}`,
    py: `def pop(stack: list):\n    if len(stack) == 0:\n        return None\n    top = stack[-1]\n    stack.pop()\n    return top`,
    cpp: `int pop(std::stack<int>& st) {\n    if (st.empty()) {\n        return -1;\n    }\n    int top = st.top();\n    st.pop();\n    return top;\n}`,
    java: `public static Integer pop(Stack<Integer> stack) {\n    if (stack.isEmpty()) {\n        return null;\n    }\n    int top = stack.peek();\n    stack.pop();\n    return top;\n}`,
  },
  "stack-peek": {
    title: "Reads the top element without removing it.",
    js: `function peek(stack) {\n  if (stack.length === 0) {\n    return null;\n  }\n  const top = stack[stack.length - 1];\n  return top;\n}`,
    py: `def peek(stack: list):\n    if len(stack) == 0:\n        return None\n    top = stack[-1]\n    return top`,
    cpp: `int peek(const std::stack<int>& st) {\n    if (st.empty()) {\n        return -1;\n    }\n    int top = st.top();\n    return top;\n}`,
    java: `public static Integer peek(Stack<Integer> stack) {\n    if (stack.isEmpty()) {\n        return null;\n    }\n    int top = stack.peek();\n    return top;\n}`,
  },
  "stack-is-empty": {
    title: "Checks whether the stack is empty.",
    js: `function isEmpty(stack) {\n  return stack.length === 0;\n}`,
    py: `def is_empty(stack: list) -> bool:\n    return len(stack) == 0`,
    cpp: `bool isEmpty(const std::stack<int>& st) {\n    return st.empty();\n}`,
    java: `public static boolean isEmpty(Stack<Integer> stack) {\n    return stack.empty();\n}`,
  },
  "stack-is-full": {
    title: "Checks whether a fixed-capacity stack is full.",
    js: `function isFull(stack, capacity = 8) {\n  return stack.length >= capacity;\n}`,
    py: `def is_full(stack: list, capacity: int = 8) -> bool:\n    return len(stack) >= capacity`,
    cpp: `bool isFull(const std::stack<int>& st, int capacity = 8) {\n    return (int)st.size() >= capacity;\n}`,
    java: `public static boolean isFull(Stack<Integer> stack, int capacity) {\n    return stack.size() >= capacity;\n}`,
  },
  "stack-size": {
    title: "Returns the current number of stack elements.",
    js: `function getSize(stack) {\n  return stack.length;\n}`,
    py: `def get_size(stack: list) -> int:\n    return len(stack)`,
    cpp: `int getSize(const std::stack<int>& st) {\n    return (int)st.size();\n}`,
    java: `public static int getSize(Stack<Integer> stack) {\n    return stack.size();\n}`,
  },
  "array-stack": {
    title: "Array-Based Stack Implementation",
    js: `class Stack {\n  constructor() { this.items = []; }\n  push(element) { this.items.push(element); }\n  pop() { if (this.items.length === 0) return "Underflow"; return this.items.pop(); }\n  peek() { return this.items[this.items.length - 1]; }\n  isEmpty() { return this.items.length === 0; }\n}`,
    py: `class Stack:\n    def __init__(self):\n        self.items = []\n    def push(self, item):\n        self.items.append(item)\n    def pop(self):\n        if not self.is_empty():\n            return self.items.pop()\n    def peek(self):\n        if not self.is_empty():\n            return self.items[-1]\n    def is_empty(self):\n        return len(self.items) == 0`,
    cpp: `class Stack {\n    int top;\n    int a[1000];\npublic:\n    Stack() { top = -1; }\n    bool push(int x) {\n        if (top >= 999) return false;\n        a[++top] = x;\n        return true;\n    }\n    int pop() {\n        if (top < 0) return 0;\n        return a[top--];\n    }\n    int peek() {\n        if (top < 0) return 0;\n        return a[top];\n    }\n    bool isEmpty() {\n        return (top < 0);\n    }\n};`,
    java: `class Stack {\n    static final int MAX = 1000;\n    int top;\n    int a[] = new int[MAX];\n    Stack() { top = -1; }\n    boolean push(int x) {\n        if (top >= (MAX - 1)) return false;\n        a[++top] = x;\n        return true;\n    }\n    int pop() {\n        if (top < 0) return 0;\n        return a[top--];\n    }\n    int peek() {\n        if (top < 0) return 0;\n        return a[top];\n    }\n    boolean isEmpty() { return (top < 0); }\n}`,
  },
  "balanced-parentheses": {
    title: "Validate Balanced Parentheses using Stack",
    js: `function isValid(s) {\n  const stack = [], map = { ')': '(', '}': '{', ']': '[' };\n  for (const c of s) {\n    if (c === '(' || c === '{' || c === '[') stack.push(c);\n    else if (!stack.length || stack.pop() !== map[c]) return false;\n  }\n  return stack.length === 0;\n}`,
    py: `def isValid(s: str) -> bool:\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for c in s:\n        if c in "({[":\n            stack.append(c)\n        elif not stack or stack.pop() != pairs[c]:\n            return False\n    return len(stack) == 0`,
    cpp: `bool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if (st.empty()) return false;\n            char top = st.top(); st.pop();\n            if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;\n        }\n    }\n    return st.empty();\n}`,
    java: `public boolean isValid(String s) {\n    Stack<Character> stack = new Stack<>();\n    for (char c : s.toCharArray()) {\n        if (c == '(' || c == '{' || c == '[') stack.push(c);\n        else {\n            if (stack.isEmpty()) return false;\n            char top = stack.pop();\n            if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) return false;\n        }\n    }\n    return stack.isEmpty();\n}`,
  },
  "infix-to-postfix": {
    title: "Convert Infix to Postfix (Shunting-Yard)",
    js: `function infixToPostfix(exp) {\n  let out = "", st = [];\n  const prec = { '+':1, '-':1, '*':2, '/':2, '^':3 };\n  for (let c of exp) {\n    if (/[a-zA-Z0-9]/.test(c)) out += c;\n    else if (c === '(') st.push(c);\n    else if (c === ')') { while (st.length && st.at(-1) !== '(') out += st.pop(); st.pop(); }\n    else { while (st.length && (prec[st.at(-1)] || 0) >= prec[c]) out += st.pop(); st.push(c); }\n  }\n  while (st.length) out += st.pop();\n  return out;\n}`,
    py: `def infixToPostfix(exp: str) -> str:\n    out, stack = [], []\n    prec = {'+': 1, '-': 1, '*': 2, '/': 2, '^': 3}\n    for c in exp:\n        if c.isalnum(): out.append(c)\n        elif c == '(': stack.append(c)\n        elif c == ')':\n            while stack and stack[-1] != '(': out.append(stack.pop())\n            stack.pop()\n        else:\n            while stack and prec.get(stack[-1], 0) >= prec.get(c, 0): out.append(stack.pop())\n            stack.append(c)\n    while stack: out.append(stack.pop())\n    return "".join(out)`,
    cpp: `string infixToPostfix(string s) {\n    string out = ""; stack<char> st;\n    auto prec = [](char c) { if (c == '^') return 3; if (c == '*' || c == '/') return 2; if (c == '+' || c == '-') return 1; return -1; };\n    for (char c : s) {\n        if (isalnum(c)) out += c;\n        else if (c == '(') st.push(c);\n        else if (c == ')') { while (!st.empty() && st.top() != '(') { out += st.top(); st.pop(); } st.pop(); }\n        else { while (!st.empty() && prec(st.top()) >= prec(c)) { out += st.top(); st.pop(); } st.push(c); }\n    }\n    while (!st.empty()) { out += st.top(); st.pop(); }\n    return out;\n}`,
    java: `public String infixToPostfix(String exp) {\n    StringBuilder out = new StringBuilder();\n    Stack<Character> st = new Stack<>();\n    for (char c : exp.toCharArray()) {\n        if (Character.isLetterOrDigit(c)) out.append(c);\n        else if (c == '(') st.push(c);\n        else if (c == ')') { while (!st.isEmpty() && st.peek() != '(') out.append(st.pop()); st.pop(); }\n        else { while (!st.isEmpty() && prec(st.peek()) >= prec(c)) out.append(st.pop()); st.push(c); }\n    }\n    while (!st.isEmpty()) out.append(st.pop());\n    return out.toString();\n}`,
  },
  "postfix-evaluation": {
    title: "Evaluate Arithmetic Postfix Expression",
    js: `function evalPostfix(tokens) {\n  const st = [];\n  for (let t of tokens) {\n    if (!isNaN(t)) st.push(Number(t));\n    else {\n      const b = st.pop(), a = st.pop();\n      if (t === '+') st.push(a + b);\n      else if (t === '-') st.push(a - b);\n      else if (t === '*') st.push(a * b);\n      else if (t === '/') st.push(Math.trunc(a / b));\n    }\n  }\n  return st.pop();\n}`,
    py: `def evalPostfix(tokens) -> int:\n    stack = []\n    for t in tokens:\n        if t not in "+-*/":\n            stack.append(int(t))\n        else:\n            b, a = stack.pop(), stack.pop()\n            if t == '+': stack.append(a + b)\n            elif t == '-': stack.append(a - b)\n            elif t == '*': stack.append(a * b)\n            elif t == '/': stack.append(int(a / b))\n    return stack.pop()`,
    cpp: `int evalPostfix(vector<string>& tokens) {\n    stack<int> st;\n    for (const string& t : tokens) {\n        if (t != "+" && t != "-" && t != "*" && t != "/") st.push(stoi(t));\n        else {\n            int b = st.top(); st.pop(); int a = st.top(); st.pop();\n            if (t == "+") st.push(a + b);\n            else if (t == "-") st.push(a - b);\n            else if (t == "*") st.push(a * b);\n            else if (t == "/") st.push(a / b);\n        }\n    }\n    return st.top();\n}`,
    java: `public int evalPostfix(String[] tokens) {\n    Stack<Integer> st = new Stack<>();\n    for (String t : tokens) {\n        if (!"+-*/".contains(t)) st.push(Integer.parseInt(t));\n        else {\n            int b = st.pop(), a = st.pop();\n            if (t.equals("+")) st.push(a + b);\n            else if (t.equals("-")) st.push(a - b);\n            else if (t.equals("*")) st.push(a * b);\n            else if (t.equals("/")) st.push(a / b);\n        }\n    }\n    return st.pop();\n}`,
  },
  "min-stack": {
    title: "Min Stack with O(1) getMin",
    js: `class MinStack {\n  constructor() { this.s = []; this.min = []; }\n  push(val) {\n    this.s.push(val);\n    const m = this.min.length ? Math.min(val, this.min.at(-1)) : val;\n    this.min.push(m);\n  }\n  pop() { this.s.pop(); this.min.pop(); }\n  top() { return this.s.at(-1); }\n  getMin() { return this.min.at(-1); }\n}`,
    py: `class MinStack:\n    def __init__(self):\n        self.stack = []\n        self.min_stack = []\n    def push(self, val: int) -> None:\n        self.stack.append(val)\n        m = min(val, self.min_stack[-1]) if self.min_stack else val\n        self.min_stack.append(m)\n    def pop(self) -> None:\n        self.stack.pop()\n        self.min_stack.pop()\n    def top(self) -> int: return self.stack[-1]\n    def getMin(self) -> int: return self.min_stack[-1]`,
    cpp: `class MinStack {\n    stack<int> s, minSt;\npublic:\n    void push(int val) {\n        s.push(val);\n        int m = minSt.empty() ? val : min(val, minSt.top());\n        minSt.push(m);\n    }\n    void pop() { s.pop(); minSt.pop(); }\n    int top() { return s.top(); }\n    int getMin() { return minSt.top(); }\n};`,
    java: `class MinStack {\n    Stack<Integer> s = new Stack<>(), minSt = new Stack<>();\n    public void push(int val) {\n        s.push(val);\n        int m = minSt.isEmpty() ? val : Math.min(val, minSt.peek());\n        minSt.push(m);\n    }\n    public void pop() { s.pop(); minSt.pop(); }\n    public int top() { return s.peek(); }\n    public int getMin() { return minSt.peek(); }\n}`,
  },
  "next-greater-element": {
    title: "Next Greater Element using Monotonic Stack",
    js: `function nextGreaterElement(nums) {\n  const res = new Array(nums.length).fill(-1), st = [];\n  for (let i = 0; i < nums.length; i++) {\n    while (st.length && nums[st.at(-1)] < nums[i]) {\n      res[st.pop()] = nums[i];\n    }\n    st.push(i);\n  }\n  return res;\n}`,
    py: `def nextGreaterElement(nums):\n    res = [-1] * len(nums)\n    stack = []\n    for i in range(len(nums)):\n        while stack and nums[stack[-1]] < nums[i]:\n            res[stack.pop()] = nums[i]\n        stack.append(i)\n    return res`,
    cpp: `vector<int> nextGreaterElement(vector<int>& nums) {\n    vector<int> res(nums.size(), -1);\n    stack<int> st;\n    for (int i = 0; i < nums.size(); i++) {\n        while (!st.empty() && nums[st.top()] < nums[i]) {\n            res[st.top()] = nums[i];\n            st.pop();\n        }\n        st.push(i);\n    }\n    return res;\n}`,
    java: `public int[] nextGreaterElement(int[] nums) {\n    int[] res = new int[nums.length];\n    Arrays.fill(res, -1);\n    Stack<Integer> st = new Stack<>();\n    for (int i = 0; i < nums.length; i++) {\n        while (!st.isEmpty() && nums[st.peek()] < nums[i]) {\n            res[st.pop()] = nums[i];\n        }\n        st.push(i);\n    }\n    return res;\n}`,
  },
};

export function getStackCodeExamples(slug: string, algorithmId: string): CodeExample[] {
  const snippet = stackSnippets[slug];
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
      code: `#include <stack>\n\n${snippet.cpp}`,
    },
    {
      id: `${algorithmId}-java`,
      algorithmId,
      language: "java",
      isPrimary: false,
      explanation: snippet.title,
      code: `import java.util.Stack;\n\n${snippet.java}`,
    },
  ];
}
