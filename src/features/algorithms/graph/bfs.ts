import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { GraphVisualState, createDefaultGraph } from "./types";

export function generateGraphBFSSteps(
  requestedStartNodeId = "A", 
  customGraph?: GraphVisualState,
  isDirected: boolean = false
): VisualStep[] {
  const steps: VisualStep[] = [];
  const graph = customGraph ? structuredClone(customGraph) : createDefaultGraph();
  const currentState: GraphVisualState = structuredClone(graph);
  
  // Find start node, default to first available node if requested one doesn't exist
  let startNodeId = requestedStartNodeId;
  if (!graph.nodes.some(n => n.id === startNodeId) && graph.nodes.length > 0) {
    startNodeId = graph.nodes[0].id;
  }
  
  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize BFS",
    description: `Starting Breadth-First Search from node ${startNodeId}.`,
    operation: "BFS",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: {}
  });
  const queue: string[] = [startNodeId];
  const visited = new Set<string>([startNodeId]);
  
  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Enqueue Start Node",
    description: `Added node ${startNodeId} to the queue and marked it as visited.`,
    operation: "BFS",
    actionType: "enqueue",
    dataState: structuredClone(currentState),
    highlights: { visited: [startNodeId] },
    codeLine: 3,
    pseudocodeLine: 2,
    variables: { "Queue": queue.join(", ") }
  });

  while (queue.length > 0) {
    const current = queue.shift()!;
    
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Dequeue Node ${current}`,
      description: `Dequeued node ${current} for processing.`,
      operation: "BFS",
      actionType: "dequeue",
      dataState: structuredClone(currentState),
      highlights: { active: [current], visited: Array.from(visited).filter(v => v !== current) },
      codeLine: 6,
      pseudocodeLine: 4,
      variables: { "Current": current, "Queue": queue.join(", ") }
    });

    // Find neighbors based on directedness
    const neighbors = graph.edges
      .filter(e => e.source === current || (!isDirected && e.target === current))
      .map(e => e.source === current ? e.target : e.source);

    for (const neighbor of neighbors) {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Check Neighbor ${neighbor}`,
        description: `Checking neighbor ${neighbor} of node ${current}.`,
        operation: "BFS",
        actionType: "visit",
        dataState: structuredClone(currentState),
        highlights: { 
          active: [current, neighbor], 
          visited: Array.from(visited).filter(v => v !== current && v !== neighbor) 
        },
        codeLine: 8,
        pseudocodeLine: 6,
        variables: { "Current": current, "Neighbor": neighbor, "Queue": queue.join(", ") }
      });

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        
        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: `Enqueue Neighbor ${neighbor}`,
          description: `Node ${neighbor} has not been visited. Marking as visited and enqueuing.`,
          operation: "BFS",
          actionType: "enqueue",
          dataState: structuredClone(currentState),
          highlights: { 
            active: [current], 
            visited: Array.from(visited).filter(v => v !== current) 
          },
          codeLine: 10,
          pseudocodeLine: 8,
          variables: { "Current": current, "Neighbor": neighbor, "Queue": queue.join(", ") }
        });
      } else {
        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: `Neighbor ${neighbor} Already Visited`,
          description: `Node ${neighbor} was already visited. Skipping.`,
          operation: "BFS",
          actionType: "compare",
          dataState: structuredClone(currentState),
          highlights: { 
            active: [current], 
            visited: Array.from(visited).filter(v => v !== current) 
          },
          codeLine: 9,
          pseudocodeLine: 7,
          variables: { "Current": current, "Neighbor": neighbor, "Queue": queue.join(", ") }
        });
      }
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "BFS Complete",
    description: "Queue is empty. Breadth-First Search is complete.",
    operation: "BFS",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { visited: Array.from(visited) },
    codeLine: 14,
    pseudocodeLine: 11,
    variables: {}
  });

  return steps;
}
