export function getGraphPseudocode(slug: string): string[] {
  switch (slug) {
    case "bfs":
      return [
        "function BFS(graph, start):",
        "    queue.enqueue(start)",
        "    mark start as visited",
        "    while queue is not empty:",
        "        node = queue.dequeue()",
        "        visit(node)",
        "        for neighbor in graph[node]:",
        "            if neighbor not visited:",
        "                mark neighbor as visited",
        "                queue.enqueue(neighbor)",
      ];
    case "dfs":
      return [
        "function DFS(graph, start):",
        "    stack.push(start)",
        "    while stack is not empty:",
        "        node = stack.pop()",
        "        if node not visited:",
        "            visit(node)",
        "            mark node as visited",
        "            for neighbor in graph[node] (reversed):",
        "                if neighbor not visited:",
        "                    stack.push(neighbor)",
      ];
    case "dijkstra":
      return [
        "function dijkstra(graph, start):",
        "    dist[start] = 0, dist[others] = infinity",
        "    while unvisited nodes remain:",
        "        u = unvisited node with minimum dist[u]",
        "        for neighbor v of u:",
        "            if dist[u] + weight(u, v) < dist[v]:",
        "                dist[v] = dist[u] + weight(u, v)",
      ];
    case "bellman-ford":
      return [
        "function bellmanFord(vertices, edges, src):",
        "    for i from 1 to |V| - 1:",
        "        for each edge (u, v, weight):",
        "            if dist[u] + weight < dist[v]:",
        "                dist[v] = dist[u] + weight",
        "    check for negative weight cycles",
      ];
    case "kruskal":
      return [
        "function kruskalMST(vertices, edges):",
        "    sort edges by weight ascending",
        "    for each edge (u, v, weight):",
        "        if find(u) != find(v):",
        "            union(u, v); add (u, v) to MST",
        "    return MST",
      ];
    case "prim":
      return [
        "function primMST(graph, root):",
        "    inMST = {root}",
        "    while |inMST| < |V|:",
        "        (u, v) = min cut edge with u in MST, v not in MST",
        "        inMST.add(v); add (u, v) to MST",
        "    return MST",
      ];
    case "topological-sort":
      return [
        "function topologicalSort(DAG):",
        "    compute in-degree for all vertices",
        "    queue = all vertices with in-degree 0",
        "    while queue not empty: u = queue.dequeue(); order.append(u)",
        "        for neighbor v of u: in-degree[v]--",
        "            if in-degree[v] == 0: queue.enqueue(v)",
        "    return order",
      ];
    case "detect-cycle-graph":
      return [
        "function detectCycle(graph):",
        "    for each vertex u: state[u] = UNVISITED",
        "    dfs(u): state[u] = VISITING",
        "        for neighbor v: if state[v] == VISITING: return cycle",
        "        state[u] = VISITED",
        "    return no cycle",
      ];
    case "connected-components":
      return [
        "function connectedComponents(graph):",
        "    for each vertex u:",
        "        if u not visited:",
        "            start new component",
        "            explore all reachable vertices via BFS/DFS",
        "            record completed component",
        "    return all components",
      ];
    default:
      return [];
  }
}
