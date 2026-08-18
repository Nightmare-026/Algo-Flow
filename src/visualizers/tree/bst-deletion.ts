import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { TreeVisualState, TreeNodeData, createBSTFromArr } from "./types";

export function generateBSTDeleteSteps(
  initialData: number[],
  valueToDelete: number,
  customTree?: TreeVisualState
): VisualStep[] {
  const steps: VisualStep[] = [];
  const root = customTree ? structuredClone(customTree.root) : createBSTFromArr(initialData);
  const currentState: TreeVisualState = { root: structuredClone(root) };

  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize BST Delete",
    description: `Searching for node ${valueToDelete} to delete from the BST.`,
    operation: "Delete",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Target: valueToDelete },
  });

  if (!currentState.root) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Tree is Empty",
      description: "Cannot delete from an empty BST.",
      operation: "Delete",
      actionType: "complete",
      dataState: structuredClone(currentState),
      highlights: { active: [] },
      codeLine: 2,
      pseudocodeLine: 2,
      variables: { Target: valueToDelete },
    });
    return steps;
  }

  function findMin(node: TreeNodeData): TreeNodeData {
    let curr = node;
    while (curr.left !== null) {
      curr = curr.left;
    }
    return curr;
  }

  function deleteNode(node: TreeNodeData | null, val: number): TreeNodeData | null {
    if (!node) {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Node Not Found",
        description: `Value ${val} not found in the BST.`,
        operation: "Delete",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: { active: [] },
        codeLine: 2,
        pseudocodeLine: 2,
        variables: { Target: val },
      });
      return null;
    }

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Inspect Node ${node.value}`,
      description: `Comparing target ${val} with current node ${node.value}.`,
      operation: "Delete",
      actionType: "compare",
      dataState: structuredClone(currentState),
      highlights: { active: [node.id] },
      codeLine: 3,
      pseudocodeLine: 3,
      variables: { Target: val, Current: node.value },
    });

    if (val < node.value) {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Go Left",
        description: `${val} < ${node.value}, traversing left child.`,
        operation: "Delete",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: { active: [node.id], compared: node.left ? [node.left.id] : [] },
        codeLine: 4,
        pseudocodeLine: 4,
        variables: { Target: val, Current: node.value },
      });
      node.left = deleteNode(node.left, val);
      return node;
    } else if (val > node.value) {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Go Right",
        description: `${val} > ${node.value}, traversing right child.`,
        operation: "Delete",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: { active: [node.id], compared: node.right ? [node.right.id] : [] },
        codeLine: 5,
        pseudocodeLine: 4,
        variables: { Target: val, Current: node.value },
      });
      node.right = deleteNode(node.right, val);
      return node;
    } else {
      // Node found!
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Found Node ${node.value} to Delete`,
        description: `Target node ${node.value} located. Analyzing children count.`,
        operation: "Delete",
        actionType: "visit",
        dataState: structuredClone(currentState),
        highlights: { active: [node.id], deleted: [node.id] },
        codeLine: 6,
        pseudocodeLine: 5,
        variables: { Target: val, Current: node.value },
      });

      // Case 1 & 2: 0 or 1 child
      if (node.left === null) {
        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: "Delete Node (Replace with Right Child)",
          description: `Node ${node.value} has no left child. Replacing with right child ${node.right ? node.right.value : "null"}.`,
          operation: "Delete",
          actionType: "delete",
          dataState: structuredClone(currentState),
          highlights: { active: [node.id], deleted: [node.id] },
          codeLine: 7,
          pseudocodeLine: 6,
          variables: { "Replaced By": node.right ? node.right.value : "null" },
        });
        return node.right;
      } else if (node.right === null) {
        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: "Delete Node (Replace with Left Child)",
          description: `Node ${node.value} has no right child. Replacing with left child ${node.left.value}.`,
          operation: "Delete",
          actionType: "delete",
          dataState: structuredClone(currentState),
          highlights: { active: [node.id], deleted: [node.id] },
          codeLine: 8,
          pseudocodeLine: 6,
          variables: { "Replaced By": node.left.value },
        });
        return node.left;
      }

      // Case 3: 2 children - find in-order successor (min in right subtree)
      const successor = findMin(node.right);
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Find In-Order Successor (${successor.value})`,
        description: `Node ${node.value} has 2 children. Found in-order successor ${successor.value} (smallest in right subtree).`,
        operation: "Delete",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: { active: [node.id], compared: [successor.id] },
        codeLine: 10,
        pseudocodeLine: 7,
        variables: { Current: node.value, Successor: successor.value },
      });

      node.value = successor.value;

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Copy Successor Value (${successor.value})`,
        description: `Copied successor value ${successor.value} to target node. Now deleting successor from right subtree.`,
        operation: "Delete",
        actionType: "update",
        dataState: structuredClone(currentState),
        highlights: { active: [node.id], swapped: [successor.id] },
        codeLine: 11,
        pseudocodeLine: 7,
        variables: { "New Value": successor.value },
      });

      node.right = deleteNode(node.right, successor.value);
      return node;
    }
  }

  currentState.root = deleteNode(currentState.root, valueToDelete);

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "BST Deletion Complete",
    description: `Successfully deleted node ${valueToDelete} while maintaining BST invariants.`,
    operation: "Delete",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 13,
    pseudocodeLine: 8,
    variables: { Target: valueToDelete },
  });

  return steps;
}
