import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { TreeVisualState, TreeNodeData, createBSTFromArr } from "./types";

export function generateBSTSearchSteps(
  initialData: number[],
  target: number
): VisualStep[] {
  const steps: VisualStep[] = [];
  const root = createBSTFromArr(initialData);
  const currentState: TreeVisualState = { root: structuredClone(root) };
  
  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize BST Search",
    description: `Searching for value ${target} in the Binary Search Tree.`,
    operation: "Search",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { "Target": target }
  });

  if (!root) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Tree is Empty",
      description: "The tree is empty, so the target cannot be found.",
      operation: "Search",
      actionType: "compare",
      dataState: structuredClone(currentState),
      highlights: { active: [] },
      codeLine: 2,
      pseudocodeLine: 2,
      variables: { "Target": target }
    });
    return steps;
  }

  let current: TreeNodeData | null = root;

  while (current !== null) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Check Node ${current.value}`,
      description: `Comparing target ${target} with current node ${current.value}.`,
      operation: "Search",
      actionType: "compare",
      dataState: structuredClone(currentState),
      highlights: { active: [current.id] },
      codeLine: 3,
      pseudocodeLine: 3,
      variables: { "Target": target, "Current": current.value }
    });

    if (current.value === target) {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Target Found",
        description: `Found target ${target} in the BST.`,
        operation: "Search",
        actionType: "complete",
        dataState: structuredClone(currentState),
        highlights: { active: [current.id], sorted: [current.id] },
        codeLine: 4,
        pseudocodeLine: 4,
        variables: { "Target": target, "Current": current.value }
      });
      return steps;
    }

    if (target < current.value) {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Go Left",
        description: `${target} < ${current.value}, so we move to the left child.`,
        operation: "Search",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: { active: [current.id] },
        codeLine: 6,
        pseudocodeLine: 6,
        variables: { "Target": target, "Current": current.value }
      });
      current = current.left;
    } else {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Go Right",
        description: `${target} > ${current.value}, so we move to the right child.`,
        operation: "Search",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: { active: [current.id] },
        codeLine: 8,
        pseudocodeLine: 8,
        variables: { "Target": target, "Current": current.value }
      });
      current = current.right;
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Target Not Found",
    description: `Reached a leaf node. Target ${target} is not in the BST.`,
    operation: "Search",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 11,
    pseudocodeLine: 11,
    variables: { "Target": target }
  });

  return steps;
}

export function generateBSTInsertSteps(
  initialData: number[],
  valueToInsert: number
): VisualStep[] {
  const steps: VisualStep[] = [];
  const root = createBSTFromArr(initialData);
  const currentState: TreeVisualState = { root: structuredClone(root) };
  
  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize BST Insert",
    description: `Preparing to insert value ${valueToInsert} into the BST.`,
    operation: "Insert",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { "Value": valueToInsert }
  });

  if (!currentState.root) {
    const newNode = { id: uuidv4(), value: valueToInsert, left: null, right: null };
    currentState.root = newNode;
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Insert Root",
      description: "Tree was empty. Inserted as root node.",
      operation: "Insert",
      actionType: "complete",
      dataState: structuredClone(currentState),
      highlights: { inserted: [newNode.id] },
      codeLine: 2,
      pseudocodeLine: 2,
      variables: { "Value": valueToInsert }
    });
    return steps;
  }

  function insert(node: TreeNodeData) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Check Node ${node.value}`,
      description: `Comparing value ${valueToInsert} with current node ${node.value}.`,
      operation: "Insert",
      actionType: "compare",
      dataState: structuredClone(currentState),
      highlights: { active: [node.id] },
      codeLine: 4,
      pseudocodeLine: 4,
      variables: { "Value": valueToInsert, "Current": node.value }
    });

    if (valueToInsert < node.value) {
      if (node.left === null) {
        const newNode = { id: uuidv4(), value: valueToInsert, left: null, right: null };
        node.left = newNode;
        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: "Insert Left Child",
          description: `Found empty spot on the left. Inserted ${valueToInsert}.`,
          operation: "Insert",
          actionType: "complete",
          dataState: structuredClone(currentState),
          highlights: { inserted: [newNode.id], active: [node.id] },
          codeLine: 6,
          pseudocodeLine: 6,
          variables: { "Value": valueToInsert, "Current": node.value }
        });
      } else {
        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: "Go Left",
          description: `${valueToInsert} < ${node.value}, continuing to left child.`,
          operation: "Insert",
          actionType: "compare",
          dataState: structuredClone(currentState),
          highlights: { active: [node.left.id] },
          codeLine: 8,
          pseudocodeLine: 8,
          variables: { "Value": valueToInsert, "Current": node.value }
        });
        insert(node.left);
      }
    } else {
      if (node.right === null) {
        const newNode = { id: uuidv4(), value: valueToInsert, left: null, right: null };
        node.right = newNode;
        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: "Insert Right Child",
          description: `Found empty spot on the right. Inserted ${valueToInsert}.`,
          operation: "Insert",
          actionType: "complete",
          dataState: structuredClone(currentState),
          highlights: { inserted: [newNode.id], active: [node.id] },
          codeLine: 11,
          pseudocodeLine: 11,
          variables: { "Value": valueToInsert, "Current": node.value }
        });
      } else {
        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: "Go Right",
          description: `${valueToInsert} >= ${node.value}, continuing to right child.`,
          operation: "Insert",
          actionType: "compare",
          dataState: structuredClone(currentState),
          highlights: { active: [node.right.id] },
          codeLine: 13,
          pseudocodeLine: 13,
          variables: { "Value": valueToInsert, "Current": node.value }
        });
        insert(node.right);
      }
    }
  }

  insert(currentState.root);

  return steps;
}
