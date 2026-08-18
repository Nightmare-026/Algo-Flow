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
  dijkstra: {
    title: "Dijkstra's Shortest Path Algorithm",
    js: `function dijkstra(graph, start) {\n  const dist = {};\n  const visited = new Set();\n  for (let node in graph) dist[node] = Infinity;\n  dist[start] = 0;\n  while (visited.size < Object.keys(graph).length) {\n    let curr = null, minD = Infinity;\n    for (let node in dist) if (!visited.has(node) && dist[node] < minD) { minD = dist[node]; curr = node; }\n    if (!curr || minD === Infinity) break;\n    visited.add(curr);\n    for (let neighbor in graph[curr]) {\n      let newD = dist[curr] + graph[curr][neighbor];\n      if (newD < dist[neighbor]) dist[neighbor] = newD;\n    }\n  }\n  return dist;\n}`,
    py: `import heapq\ndef dijkstra(graph, start):\n    distances = {node: float('inf') for node in graph}\n    distances[start] = 0\n    pq = [(0, start)]\n    while pq:\n        curr_d, u = heapq.heappop(pq)\n        if curr_d > distances[u]: continue\n        for v, weight in graph[u].items():\n            dist = curr_d + weight\n            if dist < distances[v]:\n                distances[v] = dist\n                heapq.heappush(pq, (dist, v))\n    return distances`,
    cpp: `vector<int> dijkstra(int V, vector<vector<pair<int, int>>>& adj, int S) {\n    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;\n    vector<int> dist(V, 1e9);\n    dist[S] = 0;\n    pq.push({0, S});\n    while (!pq.empty()) {\n        auto [d, u] = pq.top(); pq.pop();\n        if (d > dist[u]) continue;\n        for (auto& [v, w] : adj[u]) {\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.push({dist[v], v});\n            }\n        }\n    }\n    return dist;\n}`,
    java: `public int[] dijkstra(int V, List<List<int[]>> adj, int S) {\n    int[] dist = new int[V];\n    Arrays.fill(dist, Integer.MAX_VALUE);\n    dist[S] = 0;\n    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));\n    pq.offer(new int[]{S, 0});\n    while (!pq.isEmpty()) {\n        int[] curr = pq.poll();\n        int u = curr[0], d = curr[1];\n        if (d > dist[u]) continue;\n        for (int[] edge : adj.get(u)) {\n            int v = edge[0], w = edge[1];\n            if (dist[u] + w < dist[v]) {\n                dist[v] = dist[u] + w;\n                pq.offer(new int[]{v, dist[v]});\n            }\n        }\n    }\n    return dist;\n}`,
  },
  "bellman-ford": {
    title: "Bellman-Ford Shortest Path Algorithm",
    js: `function bellmanFord(V, edges, src) {\n  const dist = Array(V).fill(Infinity);\n  dist[src] = 0;\n  for (let i = 0; i < V - 1; i++) {\n    for (const [u, v, w] of edges) {\n      if (dist[u] !== Infinity && dist[u] + w < dist[v]) dist[v] = dist[u] + w;\n    }\n  }\n  return dist;\n}`,
    py: `def bellman_ford(V, edges, src):\n    dist = [float('inf')] * V\n    dist[src] = 0\n    for _ in range(V - 1):\n        for u, v, w in edges:\n            if dist[u] != float('inf') and dist[u] + w < dist[v]:\n                dist[v] = dist[u] + w\n    return dist`,
    cpp: `vector<int> bellmanFord(int V, vector<vector<int>>& edges, int src) {\n    vector<int> dist(V, 1e8);\n    dist[src] = 0;\n    for (int i = 0; i < V - 1; i++) {\n        for (auto& e : edges) {\n            int u = e[0], v = e[1], w = e[2];\n            if (dist[u] != 1e8 && dist[u] + w < dist[v]) dist[v] = dist[u] + w;\n        }\n    }\n    return dist;\n}`,
    java: `public int[] bellmanFord(int V, int[][] edges, int src) {\n    int[] dist = new int[V];\n    Arrays.fill(dist, (int)1e8);\n    dist[src] = 0;\n    for (int i = 0; i < V - 1; i++) {\n        for (int[] e : edges) {\n            int u = e[0], v = e[1], w = e[2];\n            if (dist[u] != (int)1e8 && dist[u] + w < dist[v]) dist[v] = dist[u] + w;\n        }\n    }\n    return dist;\n}`,
  },
  kruskal: {
    title: "Kruskal's Minimum Spanning Tree",
    js: `function kruskalMST(V, edges) {\n  edges.sort((a, b) => a[2] - b[2]);\n  const parent = Array.from({length: V}, (_, i) => i);\n  const find = (i) => parent[i] === i ? i : (parent[i] = find(parent[i]));\n  let mstWeight = 0;\n  for (const [u, v, w] of edges) {\n    const rU = find(u), rV = find(v);\n    if (rU !== rV) { parent[rU] = rV; mstWeight += w; }\n  }\n  return mstWeight;\n}`,
    py: `def kruskal(V, edges):\n    edges.sort(key=lambda x: x[2])\n    parent = list(range(V))\n    def find(i):\n        if parent[i] == i: return i\n        parent[i] = find(parent[i])\n        return parent[i]\n    mst_weight = 0\n    for u, v, w in edges:\n        ru, rv = find(u), find(v)\n        if ru != rv:\n            parent[ru] = rv\n            mst_weight += w\n    return mst_weight`,
    cpp: `int kruskalMST(int V, vector<vector<int>>& edges) {\n    sort(edges.begin(), edges.end(), [](auto& a, auto& b) { return a[2] < b[2]; });\n    vector<int> parent(V);\n    iota(parent.begin(), parent.end(), 0);\n    auto find = [&](auto& self, int i) -> int { return parent[i] == i ? i : parent[i] = self(self, parent[i]); };\n    int total = 0;\n    for (auto& e : edges) {\n        int ru = find(find, e[0]), rv = find(find, e[1]);\n        if (ru != rv) { parent[ru] = rv; total += e[2]; }\n    }\n    return total;\n}`,
    java: `public int kruskalMST(int V, int[][] edges) {\n    Arrays.sort(edges, (a, b) -> a[2] - b[2]);\n    int[] parent = new int[V];\n    for (int i = 0; i < V; i++) parent[i] = i;\n    int total = 0;\n    for (int[] e : edges) {\n        int ru = find(parent, e[0]), rv = find(parent, e[1]);\n        if (ru != rv) { parent[ru] = rv; total += e[2]; }\n    }\n    return total;\n}\nprivate int find(int[] p, int i) { return p[i] == i ? i : (p[i] = find(p, p[i])); }`,
  },
  prim: {
    title: "Prim's Minimum Spanning Tree",
    js: `function primMST(V, adj) {\n  const visited = Array(V).fill(false);\n  let totalWeight = 0;\n  const pq = [[0, 0]]; // [weight, node]\n  while (pq.length > 0) {\n    pq.sort((a, b) => a[0] - b[0]);\n    const [w, u] = pq.shift();\n    if (visited[u]) continue;\n    visited[u] = true;\n    totalWeight += w;\n    for (const [v, weight] of adj[u]) if (!visited[v]) pq.push([weight, v]);\n  }\n  return totalWeight;\n}`,
    py: `import heapq\ndef prim_mst(V, adj):\n    visited = [False] * V\n    pq = [(0, 0)]\n    total_weight = 0\n    while pq:\n        w, u = heapq.heappop(pq)\n        if visited[u]: continue\n        visited[u] = True\n        total_weight += w\n        for v, weight in adj[u]:\n            if not visited[v]: heapq.heappush(pq, (weight, v))\n    return total_weight`,
    cpp: `int primMST(int V, vector<vector<pair<int, int>>>& adj) {\n    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> pq;\n    vector<bool> visited(V, false);\n    pq.push({0, 0});\n    int total = 0;\n    while (!pq.empty()) {\n        auto [w, u] = pq.top(); pq.pop();\n        if (visited[u]) continue;\n        visited[u] = true;\n        total += w;\n        for (auto& [v, weight] : adj[u]) if (!visited[v]) pq.push({weight, v});\n    }\n    return total;\n}`,
    java: `public int primMST(int V, List<List<int[]>> adj) {\n    boolean[] visited = new boolean[V];\n    PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));\n    pq.offer(new int[]{0, 0});\n    int total = 0;\n    while (!pq.isEmpty()) {\n        int[] curr = pq.poll();\n        int w = curr[0], u = curr[1];\n        if (visited[u]) continue;\n        visited[u] = true;\n        total += w;\n        for (int[] edge : adj.get(u)) if (!visited[edge[0]]) pq.offer(new int[]{edge[1], edge[0]});\n    }\n    return total;\n}`,
  },
  "topological-sort": {
    title: "Topological Sort (Kahn's In-Degree Algorithm)",
    js: `function topologicalSort(V, adj) {\n  const inDegree = Array(V).fill(0);\n  for (let u = 0; u < V; u++) for (const v of adj[u]) inDegree[v]++;\n  const queue = [];\n  for (let i = 0; i < V; i++) if (inDegree[i] === 0) queue.push(i);\n  const order = [];\n  while (queue.length > 0) {\n    const u = queue.shift();\n    order.push(u);\n    for (const v of adj[u]) if (--inDegree[v] === 0) queue.push(v);\n  }\n  return order;\n}`,
    py: `def topological_sort(V, adj):\n    in_degree = [0] * V\n    for u in range(V):\n        for v in adj[u]: in_degree[v] += 1\n    queue = [i for i in range(V) if in_degree[i] == 0]\n    order = []\n    while queue:\n        u = queue.pop(0)\n        order.append(u)\n        for v in adj[u]:\n            in_degree[v] -= 1\n            if in_degree[v] == 0: queue.append(v)\n    return order`,
    cpp: `vector<int> topologicalSort(int V, vector<vector<int>>& adj) {\n    vector<int> inDegree(V, 0);\n    for (int u = 0; u < V; u++) for (int v : adj[u]) inDegree[v]++;\n    queue<int> q;\n    for (int i = 0; i < V; i++) if (inDegree[i] == 0) q.push(i);\n    vector<int> order;\n    while (!q.empty()) {\n        int u = q.front(); q.pop();\n        order.push_back(u);\n        for (int v : adj[u]) if (--inDegree[v] == 0) q.push(v);\n    }\n    return order;\n}`,
    java: `public List<Integer> topologicalSort(int V, List<List<Integer>> adj) {\n    int[] inDegree = new int[V];\n    for (int u = 0; u < V; u++) for (int v : adj.get(u)) inDegree[v]++;\n    Queue<Integer> queue = new LinkedList<>();\n    for (int i = 0; i < V; i++) if (inDegree[i] == 0) queue.add(i);\n    List<Integer> order = new ArrayList<>();\n    while (!queue.isEmpty()) {\n        int u = queue.poll();\n        order.add(u);\n        for (int v : adj.get(u)) if (--inDegree[v] == 0) queue.add(v);\n    }\n    return order;\n}`,
  },
  "detect-cycle-graph": {
    title: "Cycle Detection in Graph via 3-State DFS",
    js: `function hasCycle(V, adj) {\n  const state = Array(V).fill(0); // 0=unvisited, 1=visiting, 2=visited\n  function dfs(u) {\n    state[u] = 1;\n    for (const v of adj[u]) {\n      if (state[v] === 1) return true;\n      if (state[v] === 0 && dfs(v)) return true;\n    }\n    state[u] = 2;\n    return false;\n  }\n  for (let i = 0; i < V; i++) if (state[i] === 0 && dfs(i)) return true;\n  return false;\n}`,
    py: `def has_cycle(V, adj):\n    state = [0] * V\n    def dfs(u):\n        state[u] = 1\n        for v in adj[u]:\n            if state[v] == 1: return True\n            if state[v] == 0 and dfs(v): return True\n        state[u] = 2\n        return False\n    for i in range(V):\n        if state[i] == 0 and dfs(i): return True\n    return False`,
    cpp: `bool hasCycle(int V, vector<vector<int>>& adj) {\n    vector<int> state(V, 0);\n    auto dfs = [&](auto& self, int u) -> bool {\n        state[u] = 1;\n        for (int v : adj[u]) {\n            if (state[v] == 1) return true;\n            if (state[v] == 0 && self(self, v)) return true;\n        }\n        state[u] = 2;\n        return false;\n    };\n    for (int i = 0; i < V; i++) if (state[i] == 0 && dfs(dfs, i)) return true;\n    return false;\n}`,
    java: `public boolean hasCycle(int V, List<List<Integer>> adj) {\n    int[] state = new int[V];\n    for (int i = 0; i < V; i++) if (state[i] == 0 && dfs(i, state, adj)) return true;\n    return false;\n}\nprivate boolean dfs(int u, int[] state, List<List<Integer>> adj) {\n    state[u] = 1;\n    for (int v : adj.get(u)) {\n        if (state[v] == 1) return true;\n        if (state[v] == 0 && dfs(v, state, adj)) return true;\n    }\n    state[u] = 2;\n    return false;\n}`,
  },
  "connected-components": {
    title: "Connected Components in Undirected Graph",
    js: `function connectedComponents(V, adj) {\n  const visited = Array(V).fill(false);\n  const components = [];\n  for (let i = 0; i < V; i++) {\n    if (!visited[i]) {\n      const comp = [];\n      const q = [i];\n      visited[i] = true;\n      while (q.length > 0) {\n        const u = q.shift();\n        comp.push(u);\n        for (const v of adj[u]) if (!visited[v]) { visited[v] = true; q.push(v); }\n      }\n      components.push(comp);\n    }\n  }\n  return components;\n}`,
    py: `def connected_components(V, adj):\n    visited = [False] * V\n    components = []\n    for i in range(V):\n        if not visited[i]:\n            comp, q = [], [i]\n            visited[i] = True\n            while q:\n                u = q.pop(0)\n                comp.append(u)\n                for v in adj[u]:\n                    if not visited[v]: visited[v] = True; q.append(v)\n            components.append(comp)\n    return components`,
    cpp: `vector<vector<int>> connectedComponents(int V, vector<vector<int>>& adj) {\n    vector<bool> visited(V, false);\n    vector<vector<int>> components;\n    for (int i = 0; i < V; i++) {\n        if (!visited[i]) {\n            vector<int> comp;\n            queue<int> q; q.push(i); visited[i] = true;\n            while (!q.empty()) {\n                int u = q.front(); q.pop(); comp.push_back(u);\n                for (int v : adj[u]) if (!visited[v]) { visited[v] = true; q.push(v); }\n            }\n            components.push_back(comp);\n        }\n    }\n    return components;\n}`,
    java: `public List<List<Integer>> connectedComponents(int V, List<List<Integer>> adj) {\n    boolean[] visited = new boolean[V];\n    List<List<Integer>> components = new ArrayList<>();\n    for (int i = 0; i < V; i++) {\n        if (!visited[i]) {\n            List<Integer> comp = new ArrayList<>();\n            Queue<Integer> q = new LinkedList<>();\n            q.offer(i); visited[i] = true;\n            while (!q.isEmpty()) {\n                int u = q.poll(); comp.add(u);\n                for (int v : adj.get(u)) if (!visited[v]) { visited[v] = true; q.offer(v); }\n            }\n            components.add(comp);\n        }\n    }\n    return components;\n}`,
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
