import { CodeExample } from "@/types";

const snippets: Record<
  string,
  { title: string; js: string; py: string; cpp: string; java: string }
> = {
  bfs: {
    title: "Breadth-First Search (BFS)",
    js: `function bfs(graph, start) {\n  const visited = new Set();\n  const queue = [start];\n  visited.add(start);\n\n  while (queue.length > 0) {\n    const node = queue.shift();\n    console.log(node);\n\n    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n}`,
    py: `def bfs(graph, start):\n    visited = set()\n    queue = [start]\n    visited.add(start)\n\n    while queue:\n        node = queue.pop(0)\n        print(node)\n\n        for neighbor in graph[node]:\n            if neighbor not in visited:\n                visited.add(neighbor)\n                queue.append(neighbor)`,
    cpp: `void bfs(unordered_map<int, vector<int>>& graph, int start) {\n    unordered_set<int> visited;\n    queue<int> q;\n    visited.insert(start);\n    q.push(start);\n\n    while (!q.empty()) {\n        int node = q.front();\n        q.pop();\n        cout << node << " ";\n\n        for (int neighbor : graph[node]) {\n            if (visited.find(neighbor) == visited.end()) {\n                visited.insert(neighbor);\n                q.push(neighbor);\n            }\n        }\n    }\n}`,
    java: `void bfs(Map<Integer, List<Integer>> graph, int start) {\n    Set<Integer> visited = new HashSet<>();\n    Queue<Integer> queue = new LinkedList<>();\n    visited.add(start);\n    queue.add(start);\n\n    while (!queue.isEmpty()) {\n        int node = queue.poll();\n        System.out.print(node + " ");\n\n        for (int neighbor : graph.getOrDefault(node, Collections.emptyList())) {\n            if (!visited.contains(neighbor)) {\n                visited.add(neighbor);\n                queue.add(neighbor);\n            }\n        }\n    }\n}`,
  },
  dfs: {
    title: "Depth-First Search (DFS) using a Stack",
    js: `function dfs(graph, start) {\n  const visited = new Set();\n  const stack = [start];\n\n  while (stack.length > 0) {\n    const node = stack.pop();\n    \n    if (!visited.has(node)) {\n      console.log(node);\n      visited.add(node);\n      \n      for (const neighbor of graph[node]) {\n        stack.push(neighbor);\n      }\n    }\n  }\n}`,
    py: `def dfs(graph, start):\n    visited = set()\n    stack = [start]\n\n    while stack:\n        node = stack.pop()\n        \n        if node not in visited:\n            print(node)\n            visited.add(node)\n            \n            for neighbor in graph[node]:\n                stack.append(neighbor)`,
    cpp: `void dfs(unordered_map<int, vector<int>>& graph, int start) {\n    unordered_set<int> visited;\n    stack<int> s;\n    s.push(start);\n\n    while (!s.empty()) {\n        int node = s.top();\n        s.pop();\n\n        if (visited.find(node) == visited.end()) {\n            cout << node << " ";\n            visited.insert(node);\n\n            for (int neighbor : graph[node]) {\n                s.push(neighbor);\n            }\n        }\n    }\n}`,
    java: `void dfs(Map<Integer, List<Integer>> graph, int start) {\n    Set<Integer> visited = new HashSet<>();\n    Stack<Integer> stack = new Stack<>();\n    stack.push(start);\n\n    while (!stack.isEmpty()) {\n        int node = stack.pop();\n\n        if (!visited.contains(node)) {\n            System.out.print(node + " ");\n            visited.add(node);\n\n            for (int neighbor : graph.getOrDefault(node, Collections.emptyList())) {\n                stack.push(neighbor);\n            }\n        }\n    }\n}`,
  },
};

export function getGraphCodeExamples(slug: string, algorithmId: string): CodeExample[] {
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
