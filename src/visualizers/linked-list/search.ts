import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { LinkedListVisualState, createLinkedListNodes } from "./types";

export function generateSLLSearchSteps(initialData: number[], targetValue: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const initialState = createLinkedListNodes(initialData);
  const currentState: LinkedListVisualState = { ...initialState };

  // Step 1: Initialize
  steps.push({
    id: uuidv4(),
    stepNumber: 1,
    title: "Initialize Search",
    description: `Preparing to search for value ${targetValue} in the linked list.`,
    operation: "Search",
    actionType: "initialize",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 2,
    pseudocodeLine: 1,
    variables: {
      Target: targetValue,
      Current: currentState.headId ? currentState.headId.substring(0, 4) : "null",
    },
  });

  if (!currentState.headId) {
    steps.push({
      id: uuidv4(),
      stepNumber: 2,
      title: "List Empty",
      description: "The list is empty. Target not found.",
      operation: "Search",
      actionType: "not-found",
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
  let found = false;

  while (currentId) {
    const currentNode = currentState.nodes.find((n) => n.id === currentId);
    if (!currentNode) break;

    visitedIds.push(currentId);

    steps.push({
      id: uuidv4(),
      stepNumber: stepNum++,
      title: "Check Node",
      description: `Comparing current node value ${currentNode.value} with target ${targetValue}.`,
      operation: "Search",
      actionType: "compare",
      dataState: { ...currentState },
      highlights: { active: [currentId], visited: [...visitedIds], compared: [currentId] },
      codeLine: 4,
      pseudocodeLine: 3,
      variables: {
        Current: currentId.substring(0, 4),
        Value: currentNode.value,
        Target: targetValue,
      },
    });

    if (currentNode.value === targetValue) {
      found = true;
      steps.push({
        id: uuidv4(),
        stepNumber: stepNum++,
        title: "Target Found",
        description: `Value ${targetValue} found in the list!`,
        operation: "Search",
        actionType: "found",
        dataState: { ...currentState },
        highlights: { active: [currentId], visited: [...visitedIds], found: [currentId] },
        codeLine: 5,
        pseudocodeLine: 4,
      });
      break;
    }

    currentId = currentNode.nextId;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNum++,
      title: "Move to Next",
      description: currentId
        ? "Value does not match. Moving pointer to the next node."
        : "Reached the end of the list without finding the target.",
      operation: "Search",
      actionType: "move-pointer",
      dataState: { ...currentState },
      highlights: { active: currentId ? [currentId] : [], visited: [...visitedIds] },
      codeLine: 6,
      pseudocodeLine: 5,
      variables: {
        Current: currentId ? currentId.substring(0, 4) : "null",
      },
    });
  }

  if (!found) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNum,
      title: "Target Not Found",
      description: `Value ${targetValue} is not present in the linked list.`,
      operation: "Search",
      actionType: "not-found",
      dataState: { ...currentState },
      highlights: { visited: [...visitedIds] },
      codeLine: 7,
      pseudocodeLine: 6,
    });
  } else {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNum,
      title: "Search Complete",
      description: `Search operation finished successfully.`,
      operation: "Search",
      actionType: "complete",
      dataState: { ...currentState },
      highlights: { visited: [...visitedIds] },
      codeLine: 8,
      pseudocodeLine: 7,
    });
  }

  return steps;
}
