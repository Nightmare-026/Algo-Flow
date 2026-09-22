import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { GraphVisualState, createDefaultWeightedGraph } from "./types";

export function generateGraphBellmanFordSteps(
  requestedStartNodeId = "A",
  customGraph?: GraphVisualState
): VisualStep[] {
  const steps: VisualStep[] = [];
  const graph = customGraph ? structuredClone(customGraph) : createDefaultWeightedGraph();
  const currentState: GraphVisualState = structuredClone(graph);

  let startNodeId = requestedStartNodeId;
  if (!graph.nodes.some((n) => n.id === startNodeId) && graph.nodes.length > 0) {
    startNodeId = graph.nodes[0].id;
  }

  let stepNumber = 1;
  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};

  for (const node of graph.nodes) {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    previous[node.id] = null;
  }

  const formatDistances = () =>
    Object.entries(distances)
      .map(([id, d]) => `${id}:${d === Infinity ? "inf" : d}`)
      .join(", ");

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Bellman-Ford",
    description: `Distance to source node ${startNodeId} is 0, others infinity. Plan: relax all edges V-1 times, then one extra pass — any further relaxation means a reachable negative cycle.`,
    operation: "Bellman-Ford",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [startNodeId] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Distances: formatDistances() },
  });

  const numVertices = graph.nodes.length;
  // Directed edge list for relaxing
  const allEdges: Array<{ u: string; v: string; weight: number }> = [];
  for (const edge of graph.edges) {
    const w = edge.weight ?? 1;
    allEdges.push({ u: edge.source, v: edge.target, weight: w });
    if (!edge.isDirected) {
      allEdges.push({ u: edge.target, v: edge.source, weight: w });
    }
  }

  // Relax edges |V| - 1 times (early exit on convergence via the Early Convergence step below)
  for (let iter = 1; iter <= Math.max(numVertices - 1, 1); iter++) {
    let anyRelaxed = false;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Iteration ${iter} / ${numVertices - 1}`,
      description: `Starting relaxation pass ${iter} over all ${allEdges.length} directed edges.`,
      operation: "Bellman-Ford",
      actionType: "visit",
      dataState: structuredClone(currentState),
      highlights: {
        active: [startNodeId],
        visited: Object.keys(distances).filter((id) => distances[id] < Infinity),
      },
      codeLine: 2,
      pseudocodeLine: 2,
      variables: { Iteration: `${iter}/${numVertices - 1}`, Distances: formatDistances() },
    });

    for (const { u, v, weight } of allEdges) {
      if (distances[u] === Infinity) continue;

      const tentative = distances[u] + weight;
      if (tentative < distances[v]) {
        distances[v] = tentative;
        previous[v] = u;
        anyRelaxed = true;

        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: `Relax Edge (${u} -> ${v})`,
          description: `Relaxing edge (${u} -> ${v}, w=${weight}): distance to ${v} drops to ${tentative}.`,
          operation: "Bellman-Ford",
          actionType: "update",
          dataState: structuredClone(currentState),
          highlights: { active: [u, v] },
          codeLine: 4,
          pseudocodeLine: 4,
          variables: {
            Edge: `${u} -> ${v}`,
            Weight: weight,
            "New Distance": tentative,
            Distances: formatDistances(),
          },
        });
      }
    }

    if (!anyRelaxed) {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Early Convergence",
        description: `No edges were relaxed during iteration ${iter}. Shortest paths have stabilized.`,
        operation: "Bellman-Ford",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: {
          active: [startNodeId],
          compared: graph.nodes.map((n) => n.id),
        },
        codeLine: 5,
        pseudocodeLine: 5,
        variables: { Distances: formatDistances() },
      });
      break;
    }
  }

  // Check for negative cycles
  let hasNegativeCycle = false;
  for (const { u, v, weight } of allEdges) {
    if (distances[u] !== Infinity && distances[u] + weight < distances[v]) {
      hasNegativeCycle = true;
      break;
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: hasNegativeCycle ? "Negative Cycle Detected" : "Bellman-Ford Complete",
    description: hasNegativeCycle
      ? "Graph contains a negative-weight cycle reachable from the source."
      : `Computed shortest distances from ${startNodeId}: ${formatDistances()}.`,
    operation: "Bellman-Ford",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { visited: graph.nodes.map((n) => n.id) },
    codeLine: 7,
    pseudocodeLine: 6,
    variables: { "Final Distances": formatDistances(), "Negative Cycle": hasNegativeCycle },
  });

  return steps;
}
