import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { LinkedListVisualState, createLinkedListNodes } from "./types";

export function generateSLLTraversalSteps(initialData: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const initialState = createLinkedListNodes(initialData);
  const currentState: LinkedListVisualState = { ...initialState };

  // Step 1: Initialize
  steps.push({
    id: uuidv4(),
    stepNumber: 1,
    title: "Initialize Traversal",
    description: "Preparing to traverse the linked list from the head.",
    operation: "Traversal",
    actionType: "initialize",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 2,
    pseudocodeLine: 1,
    variables: {
      "Current": currentState.headId ? currentState.headId.substring(0, 4) : "null"
    }
  });

  if (!currentState.headId) {
    steps.push({
      id: uuidv4(),
      stepNumber: 2,
      title: "List Empty",
      description: "The list is empty. Nothing to traverse.",
      operation: "Traversal",
      actionType: "complete",
      dataState: { ...currentState },
      highlights: {},
      codeLine: 3,
      pseudocodeLine: 2,
    });
    return steps;
  }

  let currentId: string | null = currentState.headId;
  let stepNum = 2;
  const visitedIds: string[] = [];

  while (currentId) {
    const currentNode = currentState.nodes.find(n => n.id === currentId);
    if (!currentNode) break;

    visitedIds.push(currentId);

    steps.push({
      id: uuidv4(),
      stepNumber: stepNum++,
      title: "Visit Node",
      description: `Visiting node with value ${currentNode.value}.`,
      operation: "Traversal",
      actionType: "visit",
      dataState: { ...currentState },
      highlights: { active: [currentId], visited: [...visitedIds] },
      codeLine: 4,
      pseudocodeLine: 3,
      variables: {
        "Current": currentId.substring(0, 4),
        "Value": currentNode.value
      }
    });

    currentId = currentNode.nextId;
    
    steps.push({
      id: uuidv4(),
      stepNumber: stepNum++,
      title: "Move to Next",
      description: currentId 
        ? "Moving pointer to the next node in the list." 
        : "Reached the end of the list (next is null).",
      operation: "Traversal",
      actionType: "move-pointer",
      dataState: { ...currentState },
      highlights: { active: currentId ? [currentId] : [], visited: [...visitedIds] },
      codeLine: 5,
      pseudocodeLine: 4,
      variables: {
        "Current": currentId ? currentId.substring(0, 4) : "null"
      }
    });
  }

  // Final step
  steps.push({
    id: uuidv4(),
    stepNumber: stepNum,
    title: "Traversal Complete",
    description: "Successfully traversed all nodes in the linked list.",
    operation: "Traversal",
    actionType: "complete",
    dataState: { ...currentState },
    highlights: { visited: [...visitedIds] },
    codeLine: 6,
    pseudocodeLine: 5,
  });

  return steps;
}
