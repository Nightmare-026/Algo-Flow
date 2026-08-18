import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { GraphVisualState, createDefaultWeightedGraph } from "./types";

export function generateGraphDijkstraSteps(
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
  const unvisited = new Set<string>();

  for (const node of graph.nodes) {
    distances[node.id] = node.id === startNodeId ? 0 : Infinity;
    previous[node.id] = null;
    unvisited.add(node.id);
  }

  const formatDistances = () =>
    Object.entries(distances)
      .map(([id, d]) => `${id}:${d === Infinity ? "inf" : d}`)
      .join(", ");

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Dijkstra",
    description: `Set distance to start node ${startNodeId} to 0 and all others to infinity.`,
    operation: "Dijkstra",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [startNodeId] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Distances: formatDistances(), Unvisited: Array.from(unvisited).join(", ") },
  });

  const visited: string[] = [];

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let currentId: string | null = null;
    let minDistance = Infinity;

    for (const id of unvisited) {
      if (distances[id] < minDistance) {
        minDistance = distances[id];
        currentId = id;
      }
    }

    // If remaining nodes are unreachable
    if (currentId === null || minDistance === Infinity) {
      break;
    }

    unvisited.delete(currentId);
    visited.push(currentId);

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Select Node ${currentId}`,
      description: `Selected unvisited node ${currentId} with minimum distance ${distances[currentId]}.`,
      operation: "Dijkstra",
      actionType: "visit",
      dataState: structuredClone(currentState),
      highlights: {
        active: [currentId],
        visited: visited.filter((v) => v !== currentId),
      },
      codeLine: 3,
      pseudocodeLine: 3,
      variables: {
        Current: currentId,
        Distance: distances[currentId],
        Distances: formatDistances(),
      },
    });

    // Find outgoing/undirected edges
    const edges = graph.edges.filter(
      (e) => e.source === currentId || (!e.isDirected && e.target === currentId)
    );

    for (const edge of edges) {
      const neighborId = edge.source === currentId ? edge.target : edge.source;
      if (!unvisited.has(neighborId)) continue;

      const weight = edge.weight ?? 1;
      const tentativeDistance = distances[currentId] + weight;

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Examine Edge ${currentId} - ${neighborId}`,
        description: `Edge weight is ${weight}. Tentative distance to ${neighborId} is ${distances[currentId]} + ${weight} = ${tentativeDistance}. Current recorded distance is ${distances[neighborId] === Infinity ? "inf" : distances[neighborId]}.`,
        operation: "Dijkstra",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: {
          active: [currentId],
          compared: [neighborId],
          visited: visited.filter((v) => v !== currentId),
        },
        codeLine: 5,
        pseudocodeLine: 5,
        variables: {
          Current: currentId,
          Neighbor: neighborId,
          Weight: weight,
          "Tentative Dist": tentativeDistance,
          "Current Dist": distances[neighborId] === Infinity ? "inf" : distances[neighborId],
        },
      });

      if (tentativeDistance < distances[neighborId]) {
        distances[neighborId] = tentativeDistance;
        previous[neighborId] = currentId;

        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: `Relax Edge to ${neighborId}`,
          description: `Updated shortest distance to node ${neighborId} from ${distances[neighborId] === tentativeDistance ? "previous" : distances[neighborId]} to ${tentativeDistance}.`,
          operation: "Dijkstra",
          actionType: "update",
          dataState: structuredClone(currentState),
          highlights: {
            active: [currentId, neighborId],
            visited: visited.filter((v) => v !== currentId),
          },
          codeLine: 7,
          pseudocodeLine: 6,
          variables: {
            Updated: neighborId,
            "New Distance": tentativeDistance,
            Distances: formatDistances(),
          },
        });
      }
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Dijkstra Complete",
    description: `Computed shortest paths from node ${startNodeId} to all reachable nodes: ${formatDistances()}.`,
    operation: "Dijkstra",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { visited: visited },
    codeLine: 9,
    pseudocodeLine: 7,
    variables: { "Final Distances": formatDistances() },
  });

  return steps;
}
