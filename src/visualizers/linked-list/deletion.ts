import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { LinkedListVisualState, createLinkedListNodes } from "./types";

export function generateSLLDeleteSteps(initialData: number[], valueToDelete: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const initialState = createLinkedListNodes(initialData);
  let currentState: LinkedListVisualState = {
    nodes: [...initialState.nodes],
    headId: initialState.headId,
  };

  // Step 1: Initialize
  steps.push({
    id: uuidv4(),
    stepNumber: 1,
    title: "Initialize Delete",
    description: `Preparing to delete first occurrence of value ${valueToDelete}.`,
    operation: "Delete",
    actionType: "initialize",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 2,
    pseudocodeLine: 1,
    variables: {
      Target: valueToDelete,
      Current: currentState.headId ? currentState.headId.substring(0, 4) : "null",
    },
  });

  if (!currentState.headId) {
    steps.push({
      id: uuidv4(),
      stepNumber: 2,
      title: "List Empty",
      description: "The list is empty. Nothing to delete.",
      operation: "Delete",
      actionType: "error",
      dataState: { ...currentState },
      highlights: {},
      codeLine: 3,
      pseudocodeLine: 2,
    });
    return steps;
  }

  // Check head first
  const headNode = currentState.nodes.find((n) => n.id === currentState.headId);
  if (headNode && headNode.value === valueToDelete) {
    steps.push({
      id: uuidv4(),
      stepNumber: 2,
      title: "Target is Head",
      description: `The head node contains the target value ${valueToDelete}.`,
      operation: "Delete",
      actionType: "found",
      dataState: { ...currentState },
      highlights: { active: [headNode.id], found: [headNode.id] },
      codeLine: 4,
      pseudocodeLine: 3,
      variables: {
        Target: valueToDelete,
        Current: headNode.id.substring(0, 4),
      },
    });

    currentState.headId = headNode.nextId;
    const removalState = structuredClone(currentState);
    currentState.nodes = currentState.nodes.filter((n) => n.id !== headNode.id);
    currentState = { ...currentState };

    steps.push({
      id: uuidv4(),
      stepNumber: 3,
      title: "Update Head Pointer",
      description: `Updated head pointer to the next node, effectively removing the old head.`,
      operation: "Delete",
      actionType: "delete",
      dataState: removalState,
      highlights: { deleted: [headNode.id] },
      codeLine: 5,
      pseudocodeLine: 4,
      variables: {
        Head: currentState.headId ? currentState.headId.substring(0, 4) : "null",
      },
    });

    steps.push({
      id: uuidv4(),
      stepNumber: 4,
      title: "Deletion Complete",
      description: `Successfully deleted node with value ${valueToDelete}.`,
      operation: "Delete",
      actionType: "complete",
      dataState: { ...currentState },
      highlights: {},
      codeLine: 6,
      pseudocodeLine: 5,
    });
    return steps;
  }

  // Target is not head, we need to traverse
  let currentId: string | null = currentState.headId;
  let prevId: string | null = null;
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
      description: `Comparing current node value ${currentNode.value} with target ${valueToDelete}.`,
      operation: "Delete",
      actionType: "compare",
      dataState: { ...currentState },
      highlights: { active: [currentId], visited: [...visitedIds], compared: [currentId] },
      codeLine: 7,
      pseudocodeLine: 6,
      variables: {
        Current: currentId.substring(0, 4),
        Prev: prevId ? prevId.substring(0, 4) : "null",
        Value: currentNode.value,
      },
    });

    if (currentNode.value === valueToDelete) {
      found = true;
      steps.push({
        id: uuidv4(),
        stepNumber: stepNum++,
        title: "Target Found",
        description: `Value ${valueToDelete} found in the list!`,
        operation: "Delete",
        actionType: "found",
        dataState: { ...currentState },
        highlights: { active: [currentId], visited: [...visitedIds], found: [currentId] },
        codeLine: 8,
        pseudocodeLine: 7,
      });

      // Relink prev node
      if (prevId) {
        const prevNode = currentState.nodes.find((n) => n.id === prevId);
        if (prevNode) {
          prevNode.nextId = currentNode.nextId;
          currentState = { ...currentState, nodes: [...currentState.nodes] };

          steps.push({
            id: uuidv4(),
            stepNumber: stepNum++,
            title: "Relink Previous Node",
            description: `Set previous node's next pointer to bypass the deleted node.`,
            operation: "Delete",
            actionType: "link",
            dataState: { ...currentState },
            highlights: { active: [prevId], pointer: [prevId] },
            codeLine: 9,
            pseudocodeLine: 8,
            variables: {
              "Prev.next": currentNode.nextId ? currentNode.nextId.substring(0, 4) : "null",
            },
          });
        }
      }

      const removalState = structuredClone(currentState);
      currentState.nodes = currentState.nodes.filter((n) => n.id !== currentId);
      currentState = { ...currentState };

      steps.push({
        id: uuidv4(),
        stepNumber: stepNum++,
        title: "Remove Node",
        description: `Node with value ${valueToDelete} removed from list.`,
        operation: "Delete",
        actionType: "delete",
        dataState: removalState,
        highlights: { deleted: [currentId] },
        codeLine: 10,
        pseudocodeLine: 9,
      });
      break;
    }

    prevId = currentId;
    currentId = currentNode.nextId;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNum++,
      title: "Move Pointers",
      description: currentId
        ? "Value does not match. Advancing prev and current pointers."
        : "Reached the end of the list without finding the target.",
      operation: "Delete",
      actionType: "move-pointer",
      dataState: { ...currentState },
      highlights: { active: currentId ? [currentId] : [], visited: [...visitedIds] },
      codeLine: 11,
      pseudocodeLine: 10,
      variables: {
        Prev: prevId ? prevId.substring(0, 4) : "null",
        Current: currentId ? currentId.substring(0, 4) : "null",
      },
    });
  }

  if (!found) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNum,
      title: "Target Not Found",
      description: `Value ${valueToDelete} is not present in the linked list. Cannot delete.`,
      operation: "Delete",
      actionType: "not-found",
      dataState: { ...currentState },
      highlights: { visited: [...visitedIds] },
      codeLine: 12,
      pseudocodeLine: 11,
    });
  } else {
    const remainingIds = new Set(currentState.nodes.map((node) => node.id));
    steps.push({
      id: uuidv4(),
      stepNumber: stepNum,
      title: "Deletion Complete",
      description: `Successfully deleted node with value ${valueToDelete}.`,
      operation: "Delete",
      actionType: "complete",
      dataState: { ...currentState },
      highlights: {
        visited: visitedIds.filter((id) => remainingIds.has(id)),
      },
      codeLine: 13,
      pseudocodeLine: 12,
    });
  }

  return steps;
}
