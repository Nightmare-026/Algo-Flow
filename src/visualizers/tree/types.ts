import { v4 as uuidv4 } from "uuid";

export interface TreeNodeData {
  id: string; // Unique ID to track element across animations
  value: number;
  left: TreeNodeData | null;
  right: TreeNodeData | null;
}

export interface TreeVisualState {
  root: TreeNodeData | null;
  traversalOutput?: number[];
  callStack?: number[];
  traversalMode?: "recursive" | "queue";
}

export function createDefaultTree(): TreeVisualState {
  return {
    root: createCompleteTreeFromArr([1, 2, 3, 4, 5, 6, 7]),
  };
}

/**
 * Helper function to create a random Binary Search Tree from an array of numbers.
 * The first number becomes the root, and subsequent numbers are inserted.
 */
export function createBSTFromArr(arr: number[]): TreeNodeData | null {
  if (arr.length === 0) return null;

  const root: TreeNodeData = { id: uuidv4(), value: arr[0], left: null, right: null };

  for (let i = 1; i < arr.length; i++) {
    insertIntoBST(root, arr[i]);
  }

  return root;
}

function insertIntoBST(node: TreeNodeData, value: number) {
  if (value < node.value) {
    if (node.left === null) {
      node.left = { id: uuidv4(), value, left: null, right: null };
    } else {
      insertIntoBST(node.left, value);
    }
  } else {
    if (node.right === null) {
      node.right = { id: uuidv4(), value, left: null, right: null };
    } else {
      insertIntoBST(node.right, value);
    }
  }
}

/**
 * Creates a balanced complete binary tree (not necessarily BST) from an array.
 * Good for generic tree traversal examples.
 */
export function createCompleteTreeFromArr(arr: number[]): TreeNodeData | null {
  if (arr.length === 0) return null;

  const nodes: TreeNodeData[] = arr.map((val) => ({
    id: uuidv4(),
    value: val,
    left: null,
    right: null,
  }));

  for (let i = 0; i < nodes.length; i++) {
    const leftChildIdx = 2 * i + 1;
    const rightChildIdx = 2 * i + 2;

    if (leftChildIdx < nodes.length) {
      nodes[i].left = nodes[leftChildIdx];
    }
    if (rightChildIdx < nodes.length) {
      nodes[i].right = nodes[rightChildIdx];
    }
  }

  return nodes[0];
}
