import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { GraphVisualState, createDefaultDAG } from "./types";

export function generateGraphTopologicalSortSteps(customGraph?: GraphVisualState): VisualStep[] {
  const steps: VisualStep[] = [];
  const graph = customGraph ? structuredClone(customGraph) : createDefaultDAG();
  const currentState: GraphVisualState = structuredClone(graph);

  let stepNumber = 1;
  const inDegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};

  for (const node of graph.nodes) {
    inDegree[node.id] = 0;
    adj[node.id] = [];
  }

  for (const edge of graph.edges) {
    inDegree[edge.target] = (inDegree[edge.target] ?? 0) + 1;
    adj[edge.source] = adj[edge.source] ?? [];
    adj[edge.source].push(edge.target);
  }

  const formatInDegrees = () =>
    Object.entries(inDegree)
      .map(([id, deg]) => `${id}:${deg}`)
      .join(", ");

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Calculate In-Degrees",
    description: `Count the incoming edges for every node in the DAG: ${formatInDegrees()}.`,
    operation: "Topological Sort",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { "In-Degrees": formatInDegrees() },
  });

  const queue: string[] = [];
  for (const node of graph.nodes) {
    if (inDegree[node.id] === 0) {
      queue.push(node.id);
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Enqueue Zero In-Degree Nodes",
    description: `Nodes with in-degree 0: [${queue.join(", ")}]. They have no dependencies.`,
    operation: "Topological Sort",
    actionType: "enqueue",
    dataState: structuredClone(currentState),
    highlights: { active: [...queue] },
    codeLine: 3,
    pseudocodeLine: 2,
    variables: { Queue: queue.join(", "), "In-Degrees": formatInDegrees() },
  });

  const order: string[] = [];

  while (queue.length > 0) {
    const u = queue.shift()!;
    order.push(u);

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Process Node ${u}`,
      description: `Dequeued node ${u}. Added to topological order: [${order.join(" -> ")}].`,
      operation: "Topological Sort",
      actionType: "dequeue",
      dataState: structuredClone(currentState),
      highlights: {
        active: [u],
        visited: [...order],
      },
      codeLine: 5,
      pseudocodeLine: 4,
      variables: {
        Current: u,
        "Topological Order": order.join(" -> "),
        Queue: queue.join(", "),
      },
    });

    const neighbors = adj[u] ?? [];
    for (const v of neighbors) {
      inDegree[v]--;

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Decrement In-Degree of ${v}`,
        description: `Removed incoming edge from ${u}. In-degree of ${v} drops to ${inDegree[v]}.`,
        operation: "Topological Sort",
        actionType: "update",
        dataState: structuredClone(currentState),
        highlights: {
          active: [u],
          compared: [v],
          visited: [...order],
        },
        codeLine: 7,
        pseudocodeLine: 5,
        variables: {
          Neighbor: v,
          "New In-Degree": inDegree[v],
          "In-Degrees": formatInDegrees(),
        },
      });

      if (inDegree[v] === 0) {
        queue.push(v);

        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: `Enqueue ${v} (In-Degree 0)`,
          description: `All prerequisites for ${v} have been satisfied. Enqueuing ${v}.`,
          operation: "Topological Sort",
          actionType: "enqueue",
          dataState: structuredClone(currentState),
          highlights: {
            active: [v],
            visited: [...order],
          },
          codeLine: 8,
          pseudocodeLine: 6,
          variables: { Enqueued: v, Queue: queue.join(", ") },
        });
      }
    }
  }

  const isDAG = order.length === graph.nodes.length;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: isDAG ? "Topological Sort Complete" : "Cycle Detected",
    description: isDAG
      ? `Valid topological ordering: [${order.join(" -> ")}].`
      : "Graph contains a directed cycle; topological ordering not possible.",
    operation: "Topological Sort",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { visited: [...order] },
    codeLine: 10,
    pseudocodeLine: 7,
    variables: { "Final Order": order.join(" -> "), "Is DAG": isDAG },
  });

  return steps;
}
