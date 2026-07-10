import { v4 as uuidv4 } from "uuid";

export interface LinkedListNode {
  id: string; // Unique ID to track node for layout animations
  value: number;
  nextId: string | null;
}

export interface LinkedListVisualState {
  nodes: LinkedListNode[];
  headId: string | null;
}

// Helper to convert an array of numbers into a linked list state
export function createLinkedListNodes(arr: number[]): LinkedListVisualState {
  if (arr.length === 0) {
    return { nodes: [], headId: null };
  }

  const nodes: LinkedListNode[] = arr.map((val) => ({
    id: uuidv4(),
    value: val,
    nextId: null,
  }));

  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].nextId = nodes[i + 1].id;
  }

  return { nodes, headId: nodes[0].id };
}
