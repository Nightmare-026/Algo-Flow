import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { LinkedListNode, LinkedListVisualState, createLinkedListNodes } from "./types";

export function generateSLLInsertHeadSteps(
  initialData: number[],
  valueToInsert: number
): VisualStep[] {
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
    title: "Initialize Insert at Head",
    description: `Preparing to insert value ${valueToInsert} at the head of the linked list.`,
    operation: "Insert Head",
    actionType: "initialize",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 2,
    pseudocodeLine: 1,
    variables: {
      Value: valueToInsert,
    },
  });

  // Step 2: Create new node
  const newNode: LinkedListNode = {
    id: uuidv4(),
    value: valueToInsert,
    nextId: null,
  };

  // We add the node to the state but it's floating (not connected)
  currentState.nodes.push(newNode);

  steps.push({
    id: uuidv4(),
    stepNumber: 2,
    title: "Create New Node",
    description: `Created a new node with value ${valueToInsert} and next pointer set to null.`,
    operation: "Insert Head",
    actionType: "build",
    dataState: { ...currentState }, // new node is in the array but head hasn't changed and no nextId
    highlights: { active: [newNode.id], inserted: [newNode.id] },
    codeLine: 3,
    pseudocodeLine: 2,
    variables: {
      Value: valueToInsert,
      NewNode: newNode.id.substring(0, 4),
    },
  });

  // Step 3: Link new node to current head
  newNode.nextId = currentState.headId;
  currentState = {
    nodes: [...currentState.nodes],
    headId: currentState.headId,
  };

  steps.push({
    id: uuidv4(),
    stepNumber: 3,
    title: "Link to Current Head",
    description: currentState.headId
      ? `Set the new node's next pointer to the current head.`
      : `List is empty, so next pointer remains null.`,
    operation: "Insert Head",
    actionType: "link",
    dataState: { ...currentState },
    highlights: { active: [newNode.id], pointer: currentState.headId ? [currentState.headId] : [] },
    codeLine: 4,
    pseudocodeLine: 3,
    variables: {
      "NewNode.next": currentState.headId ? currentState.headId.substring(0, 4) : "null",
    },
  });

  // Step 4: Update head pointer
  currentState.headId = newNode.id;
  currentState = { ...currentState };

  steps.push({
    id: uuidv4(),
    stepNumber: 4,
    title: "Update Head Pointer",
    description: `Updated the head pointer to point to the new node.`,
    operation: "Insert Head",
    actionType: "set-pointer",
    dataState: { ...currentState },
    highlights: { active: [newNode.id], sorted: [newNode.id] },
    codeLine: 5,
    pseudocodeLine: 4,
    variables: {
      Head: newNode.id.substring(0, 4),
    },
  });

  // Step 5: Complete
  steps.push({
    id: uuidv4(),
    stepNumber: 5,
    title: "Insertion Complete",
    description: `Value ${valueToInsert} successfully inserted at the head.`,
    operation: "Insert Head",
    actionType: "complete",
    dataState: { ...currentState },
    highlights: {},
    codeLine: 6,
    pseudocodeLine: 5,
  });

  return steps;
}

export function generateSLLInsertTailSteps(
  initialData: number[],
  valueToInsert: number
): VisualStep[] {
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
    title: "Initialize Insert at Tail",
    description: `Preparing to insert value ${valueToInsert} at the tail of the linked list.`,
    operation: "Insert Tail",
    actionType: "initialize",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 2,
    pseudocodeLine: 1,
    variables: {
      Value: valueToInsert,
    },
  });

  // Step 2: Create new node
  const newNode: LinkedListNode = {
    id: uuidv4(),
    value: valueToInsert,
    nextId: null,
  };

  currentState.nodes.push(newNode);

  steps.push({
    id: uuidv4(),
    stepNumber: 2,
    title: "Create New Node",
    description: `Created a new node with value ${valueToInsert}.`,
    operation: "Insert Tail",
    actionType: "build",
    dataState: { ...currentState },
    highlights: { active: [newNode.id], inserted: [newNode.id] },
    codeLine: 3,
    pseudocodeLine: 2,
    variables: {
      Value: valueToInsert,
      NewNode: newNode.id.substring(0, 4),
    },
  });

  if (!currentState.headId) {
    currentState.headId = newNode.id;
    currentState = { ...currentState };
    steps.push({
      id: uuidv4(),
      stepNumber: 3,
      title: "List is Empty",
      description: `The list is empty, so the new node becomes the head.`,
      operation: "Insert Tail",
      actionType: "set-pointer",
      dataState: { ...currentState },
      highlights: { active: [newNode.id], sorted: [newNode.id] },
      codeLine: 4,
      pseudocodeLine: 3,
      variables: {
        Head: newNode.id.substring(0, 4),
      },
    });
  } else {
    // Traverse to tail
    let currentId = currentState.headId;
    let stepNum = 3;

    while (currentId) {
      const currentNode = currentState.nodes.find((n) => n.id === currentId);
      if (!currentNode) break;

      steps.push({
        id: uuidv4(),
        stepNumber: stepNum++,
        title: "Traverse",
        description: `Checking node with value ${currentNode.value}.`,
        operation: "Insert Tail",
        actionType: "visit",
        dataState: { ...currentState },
        highlights: { active: [currentId] },
        codeLine: 5,
        pseudocodeLine: 4,
        variables: {
          Current: currentId.substring(0, 4),
        },
      });

      if (currentNode.nextId === null) {
        // We found the tail
        currentNode.nextId = newNode.id;
        currentState = { nodes: [...currentState.nodes], headId: currentState.headId };

        steps.push({
          id: uuidv4(),
          stepNumber: stepNum++,
          title: "Link New Node",
          description: `Found the tail node. Set its next pointer to the new node.`,
          operation: "Insert Tail",
          actionType: "link",
          dataState: { ...currentState },
          highlights: { active: [newNode.id], pointer: [currentId] },
          codeLine: 6,
          pseudocodeLine: 5,
          variables: {
            "Current.next": newNode.id.substring(0, 4),
          },
        });
        break;
      }

      currentId = currentNode.nextId;
    }
  }

  // Final step
  steps.push({
    id: uuidv4(),
    stepNumber: steps.length + 1,
    title: "Insertion Complete",
    description: `Value ${valueToInsert} successfully inserted at the tail.`,
    operation: "Insert Tail",
    actionType: "complete",
    dataState: { ...currentState },
    highlights: {},
    codeLine: 7,
    pseudocodeLine: 6,
  });

  return steps;
}
