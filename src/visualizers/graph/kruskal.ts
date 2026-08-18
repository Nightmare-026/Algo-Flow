import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { GraphVisualState, createDefaultWeightedGraph } from "./types";

class DisjointSet {
  private parent: Record<string, string> = {};

  constructor(elements: string[]) {
    for (const el of elements) {
      this.parent[el] = el;
    }
  }

  find(i: string): string {
    if (this.parent[i] === i) return i;
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  union(i: string, j: string): boolean {
    const rootI = this.find(i);
    const rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent[rootI] = rootJ;
      return true;
    }
    return false;
  }
}

export function generateGraphKruskalSteps(customGraph?: GraphVisualState): VisualStep[] {
  const steps: VisualStep[] = [];
  const graph = customGraph ? structuredClone(customGraph) : createDefaultWeightedGraph();
  const currentState: GraphVisualState = structuredClone(graph);

  let stepNumber = 1;

  // Sort edges by weight
  const sortedEdges = [...graph.edges].sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1));
  const nodeIds = graph.nodes.map((n) => n.id);
  const dsu = new DisjointSet(nodeIds);

  const edgeListStr = sortedEdges
    .map((e) => `(${e.source}-${e.target}: ${e.weight ?? 1})`)
    .join(", ");

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Kruskal's MST",
    description: `Sort all ${sortedEdges.length} edges by ascending weight and initialize disjoint sets.`,
    operation: "Kruskal",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { "Sorted Edges": edgeListStr },
  });

  const mstEdges: Array<{ source: string; target: string; weight: number }> = [];
  const mstNodes = new Set<string>();
  let totalWeight = 0;

  for (const edge of sortedEdges) {
    const u = edge.source;
    const v = edge.target;
    const w = edge.weight ?? 1;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Inspect Edge (${u}-${v}, w=${w})`,
      description: `Checking if edge (${u}-${v}) connects two distinct components.`,
      operation: "Kruskal",
      actionType: "compare",
      dataState: structuredClone(currentState),
      highlights: {
        active: [u, v],
        visited: Array.from(mstNodes),
      },
      codeLine: 3,
      pseudocodeLine: 3,
      variables: {
        "Candidate Edge": `${u}-${v}`,
        Weight: w,
        "Current MST Weight": totalWeight,
      },
    });

    const isConnected = dsu.find(u) === dsu.find(v);

    if (!isConnected) {
      dsu.union(u, v);
      mstEdges.push({ source: u, target: v, weight: w });
      mstNodes.add(u);
      mstNodes.add(v);
      totalWeight += w;

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Add Edge (${u}-${v}) to MST`,
        description: `Edge (${u}-${v}) does not create a cycle. Added to MST. Total weight is now ${totalWeight}.`,
        operation: "Kruskal",
        actionType: "insert",
        dataState: structuredClone(currentState),
        highlights: {
          active: [u, v],
          visited: Array.from(mstNodes),
        },
        codeLine: 5,
        pseudocodeLine: 5,
        variables: {
          "Added Edge": `${u}-${v} (w=${w})`,
          "MST Edges Count": `${mstEdges.length} / ${nodeIds.length - 1}`,
          "MST Weight": totalWeight,
        },
      });

      if (mstEdges.length === nodeIds.length - 1) {
        break;
      }
    } else {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Discard Edge (${u}-${v})`,
        description: `Nodes ${u} and ${v} are already in the same component. Adding (${u}-${v}) would form a cycle.`,
        operation: "Kruskal",
        actionType: "delete",
        dataState: structuredClone(currentState),
        highlights: {
          compared: [u, v],
          visited: Array.from(mstNodes),
        },
        codeLine: 4,
        pseudocodeLine: 4,
        variables: { "Rejected Edge": `${u}-${v}`, Reason: "Creates cycle" },
      });
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Kruskal's MST Complete",
    description: `Minimum Spanning Tree found with ${mstEdges.length} edges and total weight ${totalWeight}.`,
    operation: "Kruskal",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { visited: Array.from(mstNodes) },
    codeLine: 7,
    pseudocodeLine: 6,
    variables: {
      "Total MST Weight": totalWeight,
      "MST Edges": mstEdges.map((e) => `${e.source}-${e.target}`).join(", "),
    },
  });

  return steps;
}
