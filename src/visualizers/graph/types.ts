export interface GraphNodeData {
  id: string; // The ID of the node
  value: string; // e.g. "A", "B", "1"
  x: number; // Pre-calculated x position for rendering
  y: number; // Pre-calculated y position for rendering
}

export interface GraphEdgeData {
  source: string; // ID of source node
  target: string; // ID of target node
  weight?: number;
  isDirected?: boolean;
}

export interface GraphVisualState {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
}

/**
 * Helper function to create a default unweighted undirected graph
 * for traversing algorithms like BFS and DFS.
 */
export function createDefaultGraph(): GraphVisualState {
  // A standard layout for a simple graph
  const nodes = [
    { id: "A", value: "A", x: 100, y: 100 },
    { id: "B", value: "B", x: 250, y: 50 },
    { id: "C", value: "C", x: 400, y: 100 },
    { id: "D", value: "D", x: 100, y: 250 },
    { id: "E", value: "E", x: 250, y: 300 },
    { id: "F", value: "F", x: 400, y: 250 },
  ];

  const edges = [
    { source: "A", target: "B" },
    { source: "A", target: "D" },
    { source: "B", target: "C" },
    { source: "B", target: "E" },
    { source: "C", target: "F" },
    { source: "D", target: "E" },
    { source: "E", target: "F" },
  ];

  return { nodes, edges };
}
