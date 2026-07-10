import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";


function visualStep(input: Omit<VisualStep, "id">): VisualStep {
  return { id: uuidv4(), ...input };
}

import { createCompleteTreeFromArr, TreeNodeData, TreeVisualState } from "./types";

function pathTreeFromValues(values: number[]): TreeNodeData | null {
  if (values.length === 0) return null;
  const root: TreeNodeData = { id: uuidv4(), value: values[0], left: null, right: null };
  let current = root;
  for (const value of values.slice(1)) {
    current.left = { id: uuidv4(), value, left: null, right: null };
    current = current.left;
  }
  return root;
}

function buildSegmentTree(values: number[], left = 0, right = values.length - 1): TreeNodeData | null {
  if (left > right) return null;
  if (left === right) return { id: uuidv4(), value: values[left], left: null, right: null };
  const mid = Math.floor((left + right) / 2);
  const leftNode = buildSegmentTree(values, left, mid);
  const rightNode = buildSegmentTree(values, mid + 1, right);
  const value = (leftNode?.value ?? 0) + (rightNode?.value ?? 0);
  return { id: uuidv4(), value, left: leftNode, right: rightNode };
}

export function generateHeapInsertSteps(data: number[], value: number): VisualStep[] {
  const heap = data.slice(0, 8).sort((a, b) => a - b);
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  let root = createCompleteTreeFromArr(heap);
  steps.push(visualStep({
    stepNumber: stepNumber++,
    title: "Start with Min-Heap Shape",
    description: "A heap is a complete binary tree. New values are inserted at the next open position.",
    operation: "Heap Insert",
    actionType: "initialize",
    dataState: { root } satisfies TreeVisualState,
    highlights: {},
    variables: { size: heap.length, value },
    pseudocodeLine: 1,
  }));
  heap.push(value);
  let index = heap.length - 1;
  root = createCompleteTreeFromArr(heap);
  steps.push(visualStep({
    stepNumber: stepNumber++,
    title: "Append New Value",
    description: `Append ${value} at the next open leaf position to preserve complete-tree shape.`,
    operation: "Heap Insert",
    actionType: "insert",
    dataState: { root } satisfies TreeVisualState,
    highlights: {},
    variables: { index },
    pseudocodeLine: 2,
  }));
  while (index > 0) {
    const parent = Math.floor((index - 1) / 2);
    steps.push(visualStep({
      stepNumber: stepNumber++,
      title: "Compare with Parent",
      description: `Compare child ${heap[index]} with parent ${heap[parent]}.`,
      operation: "Heap Insert",
      actionType: "compare",
      dataState: { root: createCompleteTreeFromArr(heap) } satisfies TreeVisualState,
      highlights: {},
      variables: { child: heap[index], parent: heap[parent] },
      pseudocodeLine: 4,
    }));
    if (heap[parent] <= heap[index]) break;
    [heap[parent], heap[index]] = [heap[index], heap[parent]];
    index = parent;
    steps.push(visualStep({
      stepNumber: stepNumber++,
      title: "Bubble Up",
      description: "Swap with parent to restore min-heap order.",
      operation: "Heap Insert",
      actionType: "swap",
      dataState: { root: createCompleteTreeFromArr(heap) } satisfies TreeVisualState,
      highlights: {},
      variables: { newIndex: index },
      pseudocodeLine: 5,
    }));
  }
  steps.push(visualStep({
    stepNumber,
    title: "Heap Restored",
    description: "The inserted value is now in a position that satisfies the heap property.",
    operation: "Heap Insert",
    actionType: "complete",
    dataState: { root: createCompleteTreeFromArr(heap) } satisfies TreeVisualState,
    highlights: {},
    pseudocodeLine: 6,
  }));
  return steps;
}

export function generateTrieInsertWordSteps(): VisualStep[] {
  const chars = [67, 79, 68, 69];
  const labels = ["C", "O", "D", "E"];
  const steps: VisualStep[] = [];
  for (let i = 0; i < chars.length; i++) {
    steps.push(visualStep({
      stepNumber: i + 1,
      title: `Insert '${labels[i]}'`,
      description: `Create or reuse the trie node for character '${labels[i]}' on the word path CODE. Numeric labels show character codes in the tree renderer.`,
      operation: "Trie Insert",
      actionType: i === 0 ? "initialize" : "insert",
      dataState: { root: pathTreeFromValues(chars.slice(0, i + 1)) } satisfies TreeVisualState,
      highlights: {},
      variables: { char: labels[i], code: chars[i], depth: i + 1 },
      pseudocodeLine: 3,
    }));
  }
  steps.push(visualStep({
    stepNumber: chars.length + 1,
    title: "Mark End of Word",
    description: "The final node is marked as a complete word endpoint.",
    operation: "Trie Insert",
    actionType: "complete",
    dataState: { root: pathTreeFromValues(chars) } satisfies TreeVisualState,
    highlights: {},
    variables: { word: "CODE", isWord: true },
    pseudocodeLine: 5,
  }));
  return steps;
}

export function generateSegmentTreeBuildSteps(data: number[]): VisualStep[] {
  const values = data.slice(0, 8);
  return [
    visualStep({
      stepNumber: 1,
      title: "Create Leaf Nodes",
      description: "Each input value becomes a leaf representing a one-element interval.",
      operation: "Build Segment Tree",
      actionType: "initialize",
      dataState: { root: createCompleteTreeFromArr(values) } satisfies TreeVisualState,
      highlights: {},
      variables: { leaves: values.length },
      pseudocodeLine: 1,
    }),
    visualStep({
      stepNumber: 2,
      title: "Combine Interval Sums",
      description: "Internal nodes store the sum of their left and right child intervals.",
      operation: "Build Segment Tree",
      actionType: "build",
      dataState: { root: buildSegmentTree(values) } satisfies TreeVisualState,
      highlights: {},
      variables: { rootSum: values.reduce((sum, value) => sum + value, 0) },
      pseudocodeLine: 4,
    }),
  ];
}

