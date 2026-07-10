import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { GraphVisualState, createDefaultGraph } from "./types";

export function generateGraphDFSSteps(requestedStartNodeId = "A"): VisualStep[] {
  const steps: VisualStep[] = [];
  const graph = createDefaultGraph();
  const currentState: GraphVisualState = structuredClone(graph);
  const startNodeId = graph.nodes.some((node) => node.id === requestedStartNodeId) ? requestedStartNodeId : "A";
  
  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize DFS",
    description: `Starting Depth-First Search from node ${startNodeId} using a stack.`,
    operation: "DFS",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: {}
  });
  const stack: string[] = [startNodeId];
  const visited = new Set<string>();
  
  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Push Start Node",
    description: `Pushed node ${startNodeId} to the stack.`,
    operation: "DFS",
    actionType: "push",
    dataState: structuredClone(currentState),
    highlights: { active: [startNodeId] },
    codeLine: 3,
    pseudocodeLine: 2,
    variables: { "Stack": stack.join(", ") }
  });

  while (stack.length > 0) {
    const current = stack.pop()!;
    
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Pop Node ${current}`,
      description: `Popped node ${current} for processing.`,
      operation: "DFS",
      actionType: "pop",
      dataState: structuredClone(currentState),
      highlights: { active: [current], visited: Array.from(visited) },
      codeLine: 6,
      pseudocodeLine: 4,
      variables: { "Current": current, "Stack": stack.join(", ") }
    });

    if (!visited.has(current)) {
      visited.add(current);
      
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Visit Node ${current}`,
        description: `Node ${current} has not been visited. Marking as visited.`,
        operation: "DFS",
        actionType: "visit",
        dataState: structuredClone(currentState),
        highlights: { active: [current], visited: Array.from(visited).filter(v => v !== current) },
        codeLine: 8,
        pseudocodeLine: 6,
        variables: { "Current": current, "Stack": stack.join(", ") }
      });

      // Find neighbors in reverse order so they are processed in correct alphabetical order
      // (because a stack is LIFO)
      const neighbors = graph.edges
        .filter(e => e.source === current || e.target === current)
        .map(e => e.source === current ? e.target : e.source)
        .sort((a, b) => b.localeCompare(a)); // Reverse alphabetical for correct DFS order

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          stack.push(neighbor);
          steps.push({
            id: uuidv4(),
            stepNumber: stepNumber++,
            title: `Push Neighbor ${neighbor}`,
            description: `Neighbor ${neighbor} is not visited. Pushing to stack.`,
            operation: "DFS",
            actionType: "push",
            dataState: structuredClone(currentState),
            highlights: { 
              active: [current, neighbor], 
              visited: Array.from(visited) 
            },
            codeLine: 11,
            pseudocodeLine: 9,
            variables: { "Current": current, "Neighbor": neighbor, "Stack": stack.join(", ") }
          });
        }
      }
    } else {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Node ${current} Already Visited`,
        description: `Node ${current} was already visited. Skipping.`,
        operation: "DFS",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: { active: [current], visited: Array.from(visited) },
        codeLine: 7,
        pseudocodeLine: 5,
        variables: { "Current": current, "Stack": stack.join(", ") }
      });
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "DFS Complete",
    description: "Stack is empty. Depth-First Search is complete.",
    operation: "DFS",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { visited: Array.from(visited) },
    codeLine: 14,
    pseudocodeLine: 12,
    variables: {}
  });

  return steps;
}
