import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { GraphVisualState, createDefaultWeightedGraph } from "./types";

export function generateGraphPrimSteps(
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
  const inMST = new Set<string>([startNodeId]);
  const mstEdges: Array<{ u: string; v: string; weight: number }> = [];
  let totalWeight = 0;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Prim's MST",
    description: `Start growing Minimum Spanning Tree from root node ${startNodeId}.`,
    operation: "Prim",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [startNodeId] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { "MST Nodes": startNodeId, "MST Weight": 0 },
  });

  const totalNodes = graph.nodes.length;

  while (inMST.size < totalNodes) {
    // Find candidate cut edges crossing from inMST to outside
    let minEdge: { u: string; v: string; weight: number } | null = null;

    for (const edge of graph.edges) {
      const u = edge.source;
      const v = edge.target;
      const w = edge.weight ?? 1;

      const uIn = inMST.has(u);
      const vIn = inMST.has(v);

      if ((uIn && !vIn) || (!uIn && vIn)) {
        const fromNode = uIn ? u : v;
        const toNode = uIn ? v : u;

        if (!minEdge || w < minEdge.weight) {
          minEdge = { u: fromNode, v: toNode, weight: w };
        }
      }
    }

    if (!minEdge) {
      // Graph is disconnected
      break;
    }

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Select Min Cut Edge (${minEdge.u} - ${minEdge.v})`,
      description: `Smallest available edge connecting MST to unvisited node is (${minEdge.u} - ${minEdge.v}) with weight ${minEdge.weight}.`,
      operation: "Prim",
      actionType: "compare",
      dataState: structuredClone(currentState),
      highlights: {
        active: [minEdge.v],
        compared: [minEdge.u],
        visited: Array.from(inMST),
      },
      codeLine: 3,
      pseudocodeLine: 3,
      variables: {
        "Selected Edge": `${minEdge.u} - ${minEdge.v}`,
        Weight: minEdge.weight,
        "New Node": minEdge.v,
      },
    });

    inMST.add(minEdge.v);
    mstEdges.push(minEdge);
    totalWeight += minEdge.weight;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Add Node ${minEdge.v} to MST`,
      description: `Added node ${minEdge.v} to MST via edge (${minEdge.u}-${minEdge.v}). Total MST weight is ${totalWeight}.`,
      operation: "Prim",
      actionType: "insert",
      dataState: structuredClone(currentState),
      highlights: {
        active: [minEdge.v],
        visited: Array.from(inMST),
      },
      codeLine: 5,
      pseudocodeLine: 5,
      variables: {
        "MST Nodes": Array.from(inMST).join(", "),
        "MST Weight": totalWeight,
        Progress: `${inMST.size}/${totalNodes} nodes`,
      },
    });
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Prim's MST Complete",
    description: `All ${inMST.size} reachable nodes spanned with total MST weight ${totalWeight}.`,
    operation: "Prim",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { visited: Array.from(inMST) },
    codeLine: 7,
    pseudocodeLine: 6,
    variables: {
      "Total Weight": totalWeight,
      "MST Edges": mstEdges.map((e) => `${e.u}-${e.v}`).join(", "),
    },
  });

  return steps;
}
