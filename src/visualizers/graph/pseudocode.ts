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
    default:
      return [];
  }
}
