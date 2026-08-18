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

/**
 * Weighted undirected graph for Dijkstra, Kruskal, Prim.
 */
export function createDefaultWeightedGraph(): GraphVisualState {
  const nodes = [
    { id: "A", value: "A", x: 100, y: 120 },
    { id: "B", value: "B", x: 260, y: 60 },
    { id: "C", value: "C", x: 260, y: 220 },
    { id: "D", value: "D", x: 420, y: 60 },
    { id: "E", value: "E", x: 420, y: 220 },
    { id: "F", value: "F", x: 580, y: 140 },
  ];

  const edges: GraphEdgeData[] = [
    { source: "A", target: "B", weight: 4 },
    { source: "A", target: "C", weight: 2 },
    { source: "B", target: "C", weight: 1 },
    { source: "B", target: "D", weight: 5 },
    { source: "C", target: "D", weight: 8 },
    { source: "C", target: "E", weight: 10 },
    { source: "D", target: "E", weight: 2 },
    { source: "D", target: "F", weight: 6 },
    { source: "E", target: "F", weight: 3 },
  ];

  return { nodes, edges };
}

/**
 * Directed Acyclic Graph (DAG) for Topological Sort.
 */
export function createDefaultDAG(): GraphVisualState {
  const nodes = [
    { id: "A", value: "A", x: 100, y: 100 },
    { id: "B", value: "B", x: 250, y: 50 },
    { id: "C", value: "C", x: 250, y: 220 },
    { id: "D", value: "D", x: 400, y: 50 },
    { id: "E", value: "E", x: 400, y: 220 },
    { id: "F", value: "F", x: 550, y: 140 },
  ];

  const edges: GraphEdgeData[] = [
    { source: "A", target: "B", isDirected: true },
    { source: "A", target: "C", isDirected: true },
    { source: "B", target: "D", isDirected: true },
    { source: "C", target: "D", isDirected: true },
    { source: "C", target: "E", isDirected: true },
    { source: "D", target: "F", isDirected: true },
    { source: "E", target: "F", isDirected: true },
  ];

  return { nodes, edges };
}

/**
 * Graph with a cycle for Cycle Detection.
 */
export function createDefaultCyclicGraph(): GraphVisualState {
  const nodes = [
    { id: "A", value: "A", x: 120, y: 100 },
    { id: "B", value: "B", x: 280, y: 100 },
    { id: "C", value: "C", x: 280, y: 260 },
    { id: "D", value: "D", x: 120, y: 260 },
    { id: "E", value: "E", x: 440, y: 180 },
  ];

  const edges: GraphEdgeData[] = [
    { source: "A", target: "B", isDirected: true },
    { source: "B", target: "C", isDirected: true },
    { source: "C", target: "D", isDirected: true },
    { source: "D", target: "A", isDirected: true },
    { source: "B", target: "E", isDirected: true },
  ];

  return { nodes, edges };
}

/**
 * Disconnected graph for Connected Components.
 */
export function createDefaultDisconnectedGraph(): GraphVisualState {
  const nodes = [
    { id: "A", value: "A", x: 100, y: 100 },
    { id: "B", value: "B", x: 220, y: 100 },
    { id: "C", value: "C", x: 160, y: 220 },
    { id: "D", value: "D", x: 380, y: 100 },
    { id: "E", value: "E", x: 500, y: 100 },
    { id: "F", value: "F", x: 440, y: 220 },
  ];

  const edges: GraphEdgeData[] = [
    { source: "A", target: "B" },
    { source: "B", target: "C" },
    { source: "A", target: "C" },
    { source: "D", target: "E" },
    { source: "E", target: "F" },
  ];

  return { nodes, edges };
}
