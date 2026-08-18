import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { GraphVisualState, createDefaultCyclicGraph } from "./types";

export function generateGraphCycleDetectionSteps(customGraph?: GraphVisualState): VisualStep[] {
  const steps: VisualStep[] = [];
  const graph = customGraph ? structuredClone(customGraph) : createDefaultCyclicGraph();
  const currentState: GraphVisualState = structuredClone(graph);

  let stepNumber = 1;
  // State: 0 = unvisited, 1 = visiting (in recursion stack), 2 = visited
  const state: Record<string, "unvisited" | "visiting" | "visited"> = {};
  const adj: Record<string, string[]> = {};

  for (const node of graph.nodes) {
    state[node.id] = "unvisited";
    adj[node.id] = [];
  }

  for (const edge of graph.edges) {
    adj[edge.source] = adj[edge.source] ?? [];
    adj[edge.source].push(edge.target);
    if (!edge.isDirected) {
      adj[edge.target] = adj[edge.target] ?? [];
      adj[edge.target].push(edge.source);
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Cycle Detection",
    description: "Use 3-color DFS to detect back-edges indicating cycles.",
    operation: "Cycle Detection",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { State: "All nodes unvisited" },
  });

  let cycleFound = false;
  let cycleNodes: string[] = [];

  function dfs(u: string, path: string[]): boolean {
    state[u] = "visiting";
    path.push(u);

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Enter Node ${u} (Visiting)`,
      description: `Marked node ${u} as VISITING (currently in active DFS recursion stack).`,
      operation: "Cycle Detection",
      actionType: "visit",
      dataState: structuredClone(currentState),
      highlights: {
        active: [u],
        compared: [...path.slice(0, -1)],
        visited: Object.keys(state).filter((id) => state[id] === "visited"),
      },
      codeLine: 3,
      pseudocodeLine: 3,
      variables: { Current: u, "Recursion Stack": path.join(" -> ") },
    });

    const neighbors = adj[u] ?? [];
    for (const v of neighbors) {
      if (state[v] === "visiting") {
        cycleFound = true;
        const cycleStartIndex = path.indexOf(v);
        cycleNodes = path.slice(cycleStartIndex);
        const cyclePathStr = [...cycleNodes, v].join(" -> ");

        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: `Back-Edge Found (${u} -> ${v})`,
          description: `Node ${v} is already in the active recursion stack! Cycle detected: ${cyclePathStr}.`,
          operation: "Cycle Detection",
          actionType: "found",
          dataState: structuredClone(currentState),
          highlights: {
            active: [u, v],
            swapped: [...cycleNodes],
          },
          codeLine: 5,
          pseudocodeLine: 4,
          variables: {
            "Back Edge": `${u} -> ${v}`,
            "Detected Cycle": cyclePathStr,
          },
        });
        return true;
      }

      if (state[v] === "unvisited") {
        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: `Traverse Edge (${u} -> ${v})`,
          description: `Node ${v} is unvisited. Recursing into ${v}.`,
          operation: "Cycle Detection",
          actionType: "compare",
          dataState: structuredClone(currentState),
          highlights: {
            active: [u, v],
            compared: [...path],
          },
          codeLine: 4,
          pseudocodeLine: 3,
          variables: { Current: u, Neighbor: v },
        });

        if (dfs(v, path)) return true;
      }
    }

    state[u] = "visited";
    path.pop();

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Finish Node ${u} (Visited)`,
      description: `All descendants of node ${u} explored. Removed from active stack and marked VISITED.`,
      operation: "Cycle Detection",
      actionType: "update",
      dataState: structuredClone(currentState),
      highlights: {
        active: [u],
        visited: Object.keys(state).filter((id) => state[id] === "visited"),
      },
      codeLine: 7,
      pseudocodeLine: 5,
      variables: { Finished: u, "Recursion Stack": path.join(" -> ") },
    });

    return false;
  }

  for (const node of graph.nodes) {
    if (state[node.id] === "unvisited") {
      if (dfs(node.id, [])) break;
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: cycleFound ? "Cycle Detection: Cycle Found" : "Cycle Detection: Acyclic",
    description: cycleFound
      ? `Graph contains at least one cycle: ${cycleNodes.join(" -> ")}.`
      : "No cycles found in the graph. The graph is a Directed Acyclic Graph (DAG).",
    operation: "Cycle Detection",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: {
      active: cycleFound ? cycleNodes : [],
      visited: Object.keys(state).filter((id) => state[id] === "visited"),
    },
    codeLine: 9,
    pseudocodeLine: 6,
    variables: { "Cycle Found": cycleFound, Cycle: cycleNodes.join(" -> ") || "None" },
  });

  return steps;
}
