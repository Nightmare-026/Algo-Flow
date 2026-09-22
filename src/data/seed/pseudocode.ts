export const pseudocodeMap: Record<string, string> = {
  // Array Access & Traversal
  "access-by-index": "return arr[index]",
  "random-access": "return arr[index]",
  "forward-traversal": "for i from 0 to n-1:\n  visit(arr[i])",
  "reverse-traversal": "for i from n-1 down to 0:\n  visit(arr[i])",
  "range-traversal": "for i from start to end:\n  visit(arr[i])",

  // Array Insertion
  "insert-beginning": "for i from n down to 1:\n  arr[i] = arr[i-1]\narr[0] = value\nn = n + 1",
  "insert-end": "arr[n] = value\nn = n + 1",
  "insert-index":
    "for i from n down to index+1:\n  arr[i] = arr[i-1]\narr[index] = value\nn = n + 1",

  // Array Deletion
  "delete-beginning": "for i from 0 to n-2:\n  arr[i] = arr[i+1]\nn = n - 1",
  "delete-end": "n = n - 1",
  "delete-index": "for i from index to n-2:\n  arr[i] = arr[i+1]\nn = n - 1",
  "delete-value":
    "index = find(value)\nif index found:\n  for i from index to n-2:\n    arr[i] = arr[i+1]\n  n = n - 1",

  // Array Update
  "update-by-index": "arr[index] = newValue",
  "update-by-value": "index = find(oldValue)\nif index found:\n  arr[index] = newValue",

  // Array Operations
  "merge-sorted-arrays":
    "while i < n1 and j < n2:\n  if arr1[i] < arr2[j]:\n    res.append(arr1[i++])\n  else:\n    res.append(arr2[j++])\nappend remaining elements",
  "reverse-array":
    "left = 0, right = n - 1\nwhile left < right:\n  swap(arr[left++], arr[right--])",
  "left-rotation": "first = arr[0]\nfor i from 0 to n-2:\n  arr[i] = arr[i+1]\narr[n-1] = first",
  "right-rotation":
    "last = arr[n-1]\nfor i from n-1 down to 1:\n  arr[i] = arr[i-1]\narr[0] = last",
  "remove-duplicates":
    "if n == 0 return\nj = 0\nfor i from 1 to n-1:\n  if arr[i] != arr[j]:\n    j++\n    arr[j] = arr[i]\nreturn j+1",

  // Array Searching
  "linear-search": "for i from 0 to n-1:\n  if arr[i] == target:\n    return i\nreturn -1",
  "binary-search":
    "Precondition: arr must be sorted\nlow = 0, high = n-1\nwhile low <= high:\n  mid = low + floor((high - low) / 2)\n  if arr[mid] == target: return mid\n  if arr[mid] < target: low = mid + 1\n  else: high = mid - 1\nreturn -1",
  "jump-search":
    "step = sqrt(n)\nprev = 0\nwhile arr[min(step, n)-1] < target:\n  prev = step\n  step += sqrt(n)\n  if prev >= n: return -1\nfor i from prev to min(step, n)-1:\n  if arr[i] == target: return i\nreturn -1",
  "interpolation-search":
    "low = 0, high = n-1\nwhile low <= high and target >= arr[low] and target <= arr[high]:\n  pos = low + ((target - arr[low]) * (high - low) / (arr[high] - arr[low]))\n  if arr[pos] == target: return pos\n  if arr[pos] < target: low = pos + 1\n  else: high = pos - 1\nreturn -1",

  // Array Sorting
  "bubble-sort":
    "for i from 0 to n-1:\n  swapped = false\n  for j from 0 to n-i-2:\n    if arr[j] > arr[j+1]:\n      swap(arr[j], arr[j+1])\n      swapped = true\n  if not swapped: break",
  "selection-sort":
    "for i from 0 to n-2:\n  minIdx = i\n  for j from i+1 to n-1:\n    if arr[j] < arr[minIdx]:\n      minIdx = j\n  swap(arr[i], arr[minIdx])",
  "insertion-sort":
    "for i from 1 to n-1:\n  key = arr[i]\n  j = i - 1\n  while j >= 0 and arr[j] > key:\n    arr[j+1] = arr[j]\n    j--\n  arr[j+1] = key",
  "merge-sort":
    "if n <= 1: return arr\nmid = n / 2\nleft = mergeSort(arr[0..mid])\nright = mergeSort(arr[mid..n])\nreturn merge(left, right)",
  "quick-sort":
    "if low < high:\n  pi = partition(arr, low, high)\n  quickSort(arr, low, pi - 1)\n  quickSort(arr, pi + 1, high)",
  "heap-sort":
    "buildMaxHeap(arr)\nfor i from n-1 down to 1:\n  swap(arr[0], arr[i])\n  heapify(arr, 0, i)",
  "counting-sort":
    "max = findMax(arr)\ncount = new array of size max+1\nfor val in arr: count[val]++\nfor i from 1 to max: count[i] += count[i-1]\nfor val in reversed(arr):\n  output[count[val]-1] = val\n  count[val]--\nreturn output",
  "radix-sort":
    "max = findMax(arr)\nfor exp from 1 to max (exp *= 10):\n  countingSortByDigit(arr, exp)",

  // Linked List
  "sll-traversal": "curr = head\nwhile curr != null:\n  visit(curr.val)\n  curr = curr.next",
  "sll-search":
    "curr = head\nwhile curr != null:\n  if curr.val == target: return curr\n  curr = curr.next\nreturn null",
  "sll-insert-head": "newNode = Node(val)\nnewNode.next = head\nhead = newNode",
  "sll-insert-tail":
    "newNode = Node(val)\nif head == null: head = newNode\nelse:\n  curr = head\n  while curr.next != null: curr = curr.next\n  curr.next = newNode",
  "sll-insert-position":
    "if pos == 0: insertHead(val)\nelse:\n  curr = head\n  for i from 0 to pos-2: curr = curr.next\n  newNode = Node(val)\n  newNode.next = curr.next\n  curr.next = newNode",
  "sll-delete-head": "if head != null:\n  head = head.next",
  "sll-delete":
    "if head.val == target: head = head.next\nelse:\n  curr = head\n  while curr.next != null and curr.next.val != target:\n    curr = curr.next\n  if curr.next != null:\n    curr.next = curr.next.next",
  "sll-reverse":
    "prev = null\ncurr = head\nwhile curr != null:\n  next = curr.next\n  curr.next = prev\n  prev = curr\n  curr = next\nhead = prev",
  "sll-detect-cycle":
    "slow = head, fast = head\nwhile fast != null and fast.next != null:\n  slow = slow.next\n  fast = fast.next.next\n  if slow == fast: return true\nreturn false",

  // Stack & Queue
  "array-stack":
    "class ArrayStack:\n  top = -1, capacity = N\n  push(val): if top < capacity-1: arr[++top] = val\n  pop(): if top >= 0: return arr[top--]",
  "stack-push":
    "function push(stack, value):\n  if isFull(stack): return overflow\n  top = top + 1\n  stack[top] = value\n  return success",
  "stack-pop":
    "function pop(stack):\n  if isEmpty(stack): return underflow\n  value = stack[top]\n  top = top - 1\n  return value",
  "stack-peek":
    "function peek(stack):\n  if isEmpty(stack): return underflow\n  return stack[top]\n  stack is unchanged",
  "stack-is-empty": "function isEmpty(stack):\n  return top == -1  // size == 0",
  "stack-is-full": "function isFull(stack):\n  return size(stack) == capacity",
  "stack-size": "function size(stack):\n  return top + 1",
  "balanced-parentheses":
    "function isBalanced(str):\n  if isOpen(char): stack.push(char)\n  if isEmpty() or not matches(top(), char): return false\n  if matches(top(), char): stack.pop()\n  return stack.isEmpty()",
  "infix-to-postfix":
    "function infixToPostfix(tokens):\n  if isOperand(token): output.append(token)\n  if token == '(': stack.push(token)\n  if token == ')': pop until '(' to output\n  if isOperator(token): pop higher prec to output; push(token)\n  pop remaining operators to output",
  "postfix-evaluation":
    "function evaluatePostfix(tokens):\n  if isOperand(token): stack.push(token)\n  if isOperator(token): b = pop(); a = pop(); push(eval(a, op, b))\n  return stack.pop()",
  "min-stack":
    "class MinStack:\n  push(val): main.push(val); min.push(min(val, min.top()))\n  pop(): main.pop(); min.pop()\n  getMin(): return min.top()",
  "next-greater-element":
    "function nextGreaterElement(arr):\n  while stack and arr[stack.top()] < arr[i]:\n    result[stack.pop()] = arr[i]\n  stack.push(i)\n  while stack: result[stack.pop()] = -1",
  "queue-enqueue": "rear = (rear + 1) % capacity\narr[rear] = value\nsize++",
  "queue-dequeue": "val = arr[front]\nfront = (front + 1) % capacity\nsize--\nreturn val",
  "deque-push-front": "front = (front - 1 + capacity) % capacity\narr[front] = value\nsize++",
  "deque-pop-rear": "val = arr[rear]\nrear = (rear - 1 + capacity) % capacity\nsize--\nreturn val",
  "priority-queue-enqueue":
    "i = size - 1\nwhile i >= 0 and arr[i] < value:\n  arr[i+1] = arr[i]\n  i--\narr[i+1] = value\nsize++",
  "priority-queue-dequeue":
    "val = arr[0]\nfor i from 0 to size-2:\n  arr[i] = arr[i+1]\nsize--\nreturn val",

  // Tree
  "inorder-traversal":
    "if node == null: return\ninorder(node.left)\nvisit(node.val)\ninorder(node.right)",
  "preorder-traversal":
    "if node == null: return\nvisit(node.val)\npreorder(node.left)\npreorder(node.right)",
  "postorder-traversal":
    "if node == null: return\npostorder(node.left)\npostorder(node.right)\nvisit(node.val)",
  "level-order-traversal":
    "q.enqueue(root)\nwhile not q.isEmpty():\n  node = q.dequeue()\n  visit(node.val)\n  if node.left: q.enqueue(node.left)\n  if node.right: q.enqueue(node.right)",
  "bst-insertion":
    "if root == null: return Node(val)\nif val < root.val:\n  root.left = insert(root.left, val)\nelse if val > root.val:\n  root.right = insert(root.right, val)\nreturn root",
  "bst-search":
    "if root == null or root.val == target: return root\nif target < root.val:\n  return search(root.left, target)\nreturn search(root.right, target)",
  "bst-deletion":
    "if root == null: return null\nif val < root.val: root.left = delete(root.left, val)\nelse if val > root.val: root.right = delete(root.right, val)\nelse:\n  if not root.left: return root.right\n  if not root.right: return root.left\n  succ = findMin(root.right)\n  root.val = succ.val\n  root.right = delete(root.right, succ.val)\nreturn root",
  "avl-rotations":
    "bf = height(left) - height(right)\nif bf > 1:\n  if height(left.left) >= height(left.right): return rightRotate(root)\n  else: root.left = leftRotate(root.left); return rightRotate(root)\nif bf < -1:\n  if height(right.right) >= height(right.left): return leftRotate(root)\n  else: root.right = rightRotate(root.right); return leftRotate(root)",
  "heap-extract-max": "max = heap[0]\nheap[0] = heap.pop()\nsiftDown(0)\nreturn max",
  heapify: "for i from floor(n/2)-1 down to 0:\n  siftDown(arr, n, i)",
  "trie-search":
    "curr = root\nfor char in word:\n  if char not in curr.children: return false\n  curr = curr.children[char]\nreturn curr.isEndOfWord",

  // Graph
  bfs: "q.enqueue(start)\nvisited[start] = true\nwhile not q.isEmpty():\n  u = q.dequeue()\n  visit(u)\n  for v in adj[u]:\n    if not visited[v]:\n      visited[v] = true\n      q.enqueue(v)",
  dfs: "visited[u] = true\nvisit(u)\nfor v in adj[u]:\n  if not visited[v]:\n    dfs(v)",
  dijkstra:
    "Precondition: all edge weights >= 0 (binary heap: O((V+E) log V); array min-scan: O(V^2))\ndist[start] = 0, dist[others] = inf\nwhile unvisited:\n  u = min(dist[unvisited])\n  for (v, w) in adj[u]:\n    if dist[u] + w < dist[v]: dist[v] = dist[u] + w",
  "bellman-ford":
    "dist[src] = 0, dist[others] = inf\nfor i from 1 to |V|-1:\n  for (u, v, w) in edges:\n    if dist[u] + w < dist[v]: dist[v] = dist[u] + w\none more pass over all edges: if any dist can be relaxed, a reachable negative cycle exists",
  kruskal:
    "sort edges by weight\nfor (u, v, w) in edges:\n  if find(u) != find(v):\n    union(u, v)\n    add (u, v) to MST",
  prim: "inMST = {root}\nwhile |inMST| < |V|:\n  (u, v) = min cut edge\n  inMST.add(v)\n  add (u, v) to MST",
  "topological-sort":
    "compute in-degrees\nq = nodes with in-degree 0\nwhile q not empty:\n  u = q.dequeue(); order.append(u)\n  for v in adj[u]:\n    if --inDegree[v] == 0: q.enqueue(v)",
  "detect-cycle-graph":
    "state[u] = UNVISITED\nfor u in V:\n  if state[u] == UNVISITED and dfs(u): return true\nreturn false",
  "connected-components":
    "for u in V:\n  if not visited[u]:\n    start new component\n    explore via BFS/DFS\n    save component",

  // Matrix
  "row-wise-traversal": "for r from 0 to rows-1:\n  for c from 0 to cols-1:\n    visit(mat[r][c])",
  "col-wise-traversal": "for c from 0 to cols-1:\n  for r from 0 to rows-1:\n    visit(mat[r][c])",
  "matrix-search":
    "for r from 0 to rows-1:\n  for c from 0 to cols-1:\n    if mat[r][c] == target: return (r, c)\nreturn (-1, -1)",
  "spiral-traversal":
    "top = 0, bottom = R-1, left = 0, right = C-1\nwhile top <= bottom and left <= right:\n  for c from left to right: visit(mat[top][c])\n  top++\n  for r from top to bottom: visit(mat[r][right])\n  right--\n  if top <= bottom:\n    for c from right down to left: visit(mat[bottom][c])\n    bottom--\n  if left <= right:\n    for r from bottom down to top: visit(mat[r][left])\n    left++",
  "row-column-sorted-search":
    "r = 0, c = cols - 1\nwhile r < rows and c >= 0:\n  if mat[r][c] == target: return (r, c)\n  if mat[r][c] > target: c--\n  else: r++\nreturn (-1, -1)",
  "transpose-matrix":
    "for i from 0 to rows-1:\n  for j from i+1 to cols-1:\n    swap(mat[i][j], mat[j][i])",
  "rotate-matrix-90": "transpose(mat)\nfor i from 0 to rows-1:\n  reverse(mat[i])",
  "matrix-multiplication":
    "for i from 0 to R1-1:\n  for j from 0 to C2-1:\n    for k from 0 to C1-1:\n      res[i][j] += mat1[i][k] * mat2[k][j]",
  "matrix-addition":
    "for r from 0 to rows-1:\n  for c from 0 to cols-1:\n    res[r][c] = mat1[r][c] + mat2[r][c]",
  "matrix-subtraction":
    "for r from 0 to rows-1:\n  for c from 0 to cols-1:\n    res[r][c] = mat1[r][c] - mat2[r][c]",

  // String
  "string-forward-traversal": "for i from 0 to len-1:\n  visit(str[i])",
  "string-reverse-traversal": "for i from len-1 down to 0:\n  visit(str[i])",
  "string-palindrome":
    "l = 0, r = len-1\nwhile l < r:\n  if str[l++] != str[r--]: return false\nreturn true",
  "string-naive-search":
    "for i from 0 to N-M:\n  for j from 0 to M-1:\n    if text[i+j] != pat[j]: break\n  if j == M: return i\nreturn -1",
  "string-kmp-search":
    "function kmpSearch(text, pattern)\n  lps = array(pattern.length, 0)\n  i = 1; len = 0\n  while i < pattern.length\n    compare pattern[i] with pattern[len]\n    if equal: len++; lps[i] = len; i++\n    else if len > 0: len = lps[len - 1]\n    else: lps[i] = 0; i++\n  preprocessing complete\n  i = 0; j = 0\n  while i < text.length\n    compare text[i] with pattern[j]\n    if equal: i++; j++\n    if j == pattern.length: record i - j\n    after match: j = lps[j - 1]\n    else if mismatch and j > 0\n      j = lps[j - 1]\n    else: i++\n  return all match indexes",
  "string-rabin-karp":
    "pHash = hash(pat), tHash = hash(txt[0..M-1])\nfor i from 0 to N-M:\n  if pHash == tHash and text[i..i+M-1] == pat:\n    return i\n  tHash = rehash(tHash, txt[i], txt[i+M])\nreturn -1",
  "reverse-string": "l = 0, r = len-1\nwhile l < r:\n  swap(str[l++], str[r--])",
  "string-insert": "return str.substring(0, pos) + char + str.substring(pos)",
  "string-delete": "return str.substring(0, pos) + str.substring(pos+1)",
  "string-replace": "str[pos] = newChar",
  "string-change-case":
    "for i from 0 to len-1:\n  if isLower(str[i]): str[i] = toUpper(str[i])\n  else: str[i] = toLower(str[i])",

  // Hash Table
  "division-hash-method": "return key % capacity",
  "hash-insert":
    "idx = hash(key)\nwhile table[idx] is occupied:\n  idx = (idx + 1) % capacity\ntable[idx] = (key, value)",
  "hash-search":
    "idx = hash(key)\nwhile table[idx] is occupied:\n  if table[idx].key == key: return table[idx].value\n  idx = (idx + 1) % capacity\nreturn null",
  "hash-delete":
    "idx = hash(key)\nwhile table[idx] is occupied:\n  if table[idx].key == key:\n    table[idx] = DELETED\n    return\n  idx = (idx + 1) % capacity",
  "linear-probing":
    "idx = hash(key)\nwhile table[idx] is occupied:\n  idx = (idx + 1) % capacity\ntable[idx] = (key, value)",
  rehashing:
    "if loadFactor >= threshold: rehash\nnewTable = createTable(newCapacity)\nfor oldIndex from 0 to oldCapacity - 1:\n  if oldTable[oldIndex] is empty: continue\n  newIndex = hash(key) % newCapacity\n  while newTable[newIndex] is occupied: probe next\n  newTable[newIndex] = entry\n  advance oldIndex\nreturn newTable",
  "chaining-insert": "idx = hash(key)\ntable[idx].append((key, value))",
  "chaining-search":
    "idx = hash(key)\nfor entry in table[idx]:\n  if entry.key == key: return entry.value\nreturn null",
  "chaining-delete": "idx = hash(key)\ntable[idx].removeIf(entry => entry.key == key)",
  "probing-insert":
    "idx = hash(key)\nwhile table[idx] is occupied:\n  idx = (idx + 1) % capacity\ntable[idx] = (key, value)",
  "probing-search":
    "idx = hash(key)\nwhile table[idx] is occupied:\n  if table[idx].key == key: return table[idx].value\n  idx = (idx + 1) % capacity\nreturn null",
  "probing-delete":
    "idx = hash(key)\nwhile table[idx] is occupied:\n  if table[idx].key == key:\n    table[idx] = DELETED\n    return\n  idx = (idx + 1) % capacity",

  // Hash Set
  "hash-set-insert": "idx = hash(key)\nif not set.contains(key):\n  set[idx].append(key)",
  "hash-set-search": "idx = hash(key)\nreturn set[idx].contains(key)",
  "hash-set-delete": "idx = hash(key)\nset[idx].remove(key)",
  "set-union":
    "res = new Set()\nfor val in set1: res.add(val)\nfor val in set2: res.add(val)\nreturn res",
  "set-intersection":
    "res = new Set()\nfor val in set1:\n  if set2.contains(val): res.add(val)\nreturn res",

  // Advanced / Catalog Only
  access: "return arr[index]",
  "simple-queue":
    "front = 0, rear = 0\nenqueue(val): arr[rear++] = val\ndequeue(): return arr[front++]",
  "circular-queue":
    "enqueue(val): rear = (rear + 1) % cap; arr[rear] = val\ndequeue(): front = (front + 1) % cap",
  "queue-peek": "return arr[front]",
  "queue-front-rear": "return arr[front], arr[rear]",
  "linked-list-types":
    "Singly: node.next\nDoubly: node.prev, node.next\nCircular: tail.next = head",
  "sll-delete-tail":
    "if head is null or head.next is null: return null\ncurr = head\nwhile curr.next.next is not null:\n  curr = curr.next\ncurr.next = null\nreturn head",
  "sll-find-middle":
    "slow = head, fast = head\nwhile fast is not null and fast.next is not null:\n  slow = slow.next\n  fast = fast.next.next\nreturn slow",
  "sll-remove-duplicates":
    "curr = head\nwhile curr is not null and curr.next is not null:\n  if curr.value == curr.next.value:\n    curr.next = curr.next.next\n  else: curr = curr.next\nreturn head",
  "dll-traversal":
    "curr = head\nwhile curr is not null: visit(curr); curr = curr.next\ncurr = tail\nwhile curr is not null: visit(curr); curr = curr.prev",
  "dll-insert-head":
    "node = new DNode(val, prev=null, next=head)\nif head is not null: head.prev = node\nhead = node; return head",
  "dll-insert-tail":
    "node = new DNode(val, prev=tail, next=null)\nif tail is not null: tail.next = node\ntail = node; return tail",
  "dll-delete-head":
    "if head is null: return null\nhead = head.next\nif head is not null: head.prev = null\nreturn head",
  "dll-delete-tail":
    "if tail is null: return null\ntail = tail.prev\nif tail is not null: tail.next = null\nreturn tail",
  "dll-reverse":
    "curr = head, temp = null\nwhile curr is not null:\n  swap(curr.prev, curr.next)\n  curr = curr.prev\nreturn new_head",
  "cll-traversal":
    "if head is null: return\ncurr = head\nrepeat: visit(curr); curr = curr.next\nuntil curr == head",
  "cll-insert-head":
    "node = new Node(val, next=head)\nupdate tail.next = node\nhead = node; return head",
  "cll-insert-tail": "node = new Node(val, next=head)\ntail.next = node\ntail = node; return tail",
  "cll-delete-head":
    "if head is null or head.next == head: return null\ntail.next = head.next\nhead = head.next; return head",
  "heap-insert":
    "arr.append(val)\ni = arr.length - 1\nwhile i > 0 and arr[parent(i)] < arr[i]:\n  swap(arr[i], arr[parent(i)])\n  i = parent(i)",
  "trie-insert-word":
    "curr = root\nfor char in word:\n  if char not in curr.children:\n    curr.children[char] = new Node()\n  curr = curr.children[char]\ncurr.isEndOfWord = true",
  "build-segment-tree":
    "if start == end: tree[node] = arr[start]; return\nmid = (start + end) / 2\nbuild(2*node, start, mid)\nbuild(2*node+1, mid+1, end)\ntree[node] = tree[2*node] + tree[2*node+1]",
};
