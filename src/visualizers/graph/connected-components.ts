import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { GraphVisualState, createDefaultDisconnectedGraph } from "./types";

export function generateGraphConnectedComponentsSteps(
  customGraph?: GraphVisualState
): VisualStep[] {
  const steps: VisualStep[] = [];
  const graph = customGraph ? structuredClone(customGraph) : createDefaultDisconnectedGraph();
  const currentState: GraphVisualState = structuredClone(graph);

  let stepNumber = 1;
  const visited = new Set<string>();
  const components: Array<string[]> = [];
  const adj: Record<string, string[]> = {};

  for (const node of graph.nodes) {
    adj[node.id] = [];
  }

  for (const edge of graph.edges) {
    adj[edge.source] = adj[edge.source] ?? [];
    adj[edge.source].push(edge.target);
    adj[edge.target] = adj[edge.target] ?? [];
    adj[edge.target].push(edge.source);
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Connected Components",
    description: `Find all maximal connected subgraphs across ${graph.nodes.length} nodes.`,
    operation: "Connected Components",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { "Total Nodes": graph.nodes.length, "Components Found": 0 },
  });

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      const currentComponent: string[] = [];
      const queue: string[] = [node.id];
      visited.add(node.id);
      currentComponent.push(node.id);

      const componentIndex = components.length + 1;

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Start Component #${componentIndex} from ${node.id}`,
        description: `Node ${node.id} is unvisited. Starting exploration of Component #${componentIndex}.`,
        operation: "Connected Components",
        actionType: "visit",
        dataState: structuredClone(currentState),
        highlights: {
          active: [node.id],
          visited: Array.from(visited).filter((v) => v !== node.id),
        },
        codeLine: 3,
        pseudocodeLine: 3,
        variables: {
          "Current Component": componentIndex,
          "Root Node": node.id,
          Queue: queue.join(", "),
        },
      });

      while (queue.length > 0) {
        const u = queue.shift()!;

        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: `Explore Neighbors of ${u}`,
          description: `Dequeued node ${u} in Component #${componentIndex}.`,
          operation: "Connected Components",
          actionType: "dequeue",
          dataState: structuredClone(currentState),
          highlights: {
            active: [u],
            compared: [...currentComponent],
            visited: Array.from(visited).filter((v) => !currentComponent.includes(v)),
          },
          codeLine: 5,
          pseudocodeLine: 4,
          variables: { Current: u, "Component Nodes": currentComponent.join(", ") },
        });

        const neighbors = adj[u] ?? [];
        for (const v of neighbors) {
          if (!visited.has(v)) {
            visited.add(v);
            currentComponent.push(v);
            queue.push(v);

            steps.push({
              id: uuidv4(),
              stepNumber: stepNumber++,
              title: `Add ${v} to Component #${componentIndex}`,
              description: `Found neighbor ${v}. Added to Component #${componentIndex}.`,
              operation: "Connected Components",
              actionType: "enqueue",
              dataState: structuredClone(currentState),
              highlights: {
                active: [u, v],
                compared: [...currentComponent],
              },
              codeLine: 7,
              pseudocodeLine: 5,
              variables: { Added: v, "Component Nodes": currentComponent.join(", ") },
            });
          }
        }
      }

      components.push(currentComponent);

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Component #${componentIndex} Completed`,
        description: `Component #${componentIndex} contains nodes: [${currentComponent.join(", ")}].`,
        operation: "Connected Components",
        actionType: "update",
        dataState: structuredClone(currentState),
        highlights: {
          visited: Array.from(visited),
        },
        codeLine: 8,
        pseudocodeLine: 6,
        variables: {
          "Completed Component": `[${currentComponent.join(", ")}]`,
          "Total Components Found": components.length,
        },
      });
    }
  }

  const compSummary = components.map((c, i) => `#${i + 1}: {${c.join(", ")}}`).join(" | ");

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Connected Components Complete",
    description: `Graph contains ${components.length} connected component(s): ${compSummary}.`,
    operation: "Connected Components",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { visited: Array.from(visited) },
    codeLine: 10,
    pseudocodeLine: 7,
    variables: { "Total Components": components.length, Summary: compSummary },
  });

  return steps;
}
