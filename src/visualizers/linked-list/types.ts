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

// ----------------------------------------------------------------
// Doubly Linked List Types
// ----------------------------------------------------------------
export interface DoublyLinkedListNode {
  id: string;
  value: number;
  prevId: string | null;
  nextId: string | null;
}

export interface DoublyLinkedListVisualState {
  nodes: DoublyLinkedListNode[];
  headId: string | null;
  tailId: string | null;
}

export function createDoublyLinkedListNodes(arr: number[]): DoublyLinkedListVisualState {
  if (arr.length === 0) {
    return { nodes: [], headId: null, tailId: null };
  }

  const nodes: DoublyLinkedListNode[] = arr.map((val) => ({
    id: uuidv4(),
    value: val,
    prevId: null,
    nextId: null,
  }));

  for (let i = 0; i < nodes.length; i++) {
    if (i > 0) nodes[i].prevId = nodes[i - 1].id;
    if (i < nodes.length - 1) nodes[i].nextId = nodes[i + 1].id;
  }

  return {
    nodes,
    headId: nodes[0].id,
    tailId: nodes[nodes.length - 1].id,
  };
}

// ----------------------------------------------------------------
// Circular Linked List Types
// ----------------------------------------------------------------
export interface CircularLinkedListVisualState {
  nodes: LinkedListNode[];
  headId: string | null;
  tailId: string | null;
  isCircular: boolean;
}

export function createCircularLinkedListNodes(arr: number[]): CircularLinkedListVisualState {
  if (arr.length === 0) {
    return { nodes: [], headId: null, tailId: null, isCircular: true };
  }

  const nodes: LinkedListNode[] = arr.map((val) => ({
    id: uuidv4(),
    value: val,
    nextId: null,
  }));

  for (let i = 0; i < nodes.length - 1; i++) {
    nodes[i].nextId = nodes[i + 1].id;
  }
  // Circular link: last node points to head
  nodes[nodes.length - 1].nextId = nodes[0].id;

  return {
    nodes,
    headId: nodes[0].id,
    tailId: nodes[nodes.length - 1].id,
    isCircular: true,
  };
}
