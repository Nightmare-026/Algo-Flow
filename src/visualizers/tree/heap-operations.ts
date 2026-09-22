import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { createCompleteTreeFromArr, TreeNodeData, TreeVisualState } from "./types";

function nodeIdsAtIndices(root: TreeNodeData | null, indices: number[]): string[] {
  if (!root) return [];
  const queue = [root];
  const ids: string[] = [];
  for (let currentIndex = 0; currentIndex < queue.length; currentIndex++) {
    const node = queue[currentIndex];
    if (indices.includes(currentIndex)) ids.push(node.id);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return ids;
}

export function generateHeapExtractMaxSteps(
  data: number[] = [50, 30, 40, 10, 20, 35]
): VisualStep[] {
  const heap = [...data].sort((a, b) => b - a); // Valid max-heap
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  let root = createCompleteTreeFromArr(heap);

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Max-Heap Extract Max",
    description: `Current max-heap root holds maximum value ${heap[0]}.`,
    operation: "Heap Extract Max",
    actionType: "initialize",
    dataState: { root: structuredClone(root) } satisfies TreeVisualState,
    highlights: { active: nodeIdsAtIndices(root, [0]) },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Max: heap[0], Size: heap.length, Heap: heap.join(", ") },
  });

  const maxVal = heap[0];
  const lastVal = heap[heap.length - 1];

  // Swap root with last element
  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Swap Root (${maxVal}) with Last Element (${lastVal})`,
    description: `Swapped root ${maxVal} with last leaf ${lastVal} so root can be safely removed.`,
    operation: "Heap Extract Max",
    actionType: "compare",
    dataState: { root: structuredClone(root) } satisfies TreeVisualState,
    highlights: {
      active: nodeIdsAtIndices(root, [0]),
      swapped: nodeIdsAtIndices(root, [heap.length - 1]),
    },
    codeLine: 2,
    pseudocodeLine: 2,
    variables: { "Extracted Max": maxVal, "Replaced Root": lastVal },
  });

  heap[0] = lastVal;
  heap.pop();
  root = createCompleteTreeFromArr(heap);

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Remove ${maxVal} and Sift Down`,
    description: `Removed ${maxVal}. Root is now ${heap[0]}. Now sifting down to restore max-heap invariant.`,
    operation: "Heap Extract Max",
    actionType: "delete",
    dataState: { root: structuredClone(root) } satisfies TreeVisualState,
    highlights: { active: nodeIdsAtIndices(root, [0]) },
    codeLine: 4,
    pseudocodeLine: 3,
    variables: { "Current Root": heap[0], Size: heap.length },
  });

  // Sift down
  let idx = 0;
  while (true) {
    let largest = idx;
    const left = 2 * idx + 1;
    const right = 2 * idx + 2;

    if (left < heap.length && heap[left] > heap[largest]) {
      largest = left;
    }
    if (right < heap.length && heap[right] > heap[largest]) {
      largest = right;
    }

    if (largest !== idx) {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Compare Node (${heap[idx]}) with Children`,
        description: `Child ${heap[largest]} is greater than parent ${heap[idx]}. Swapping.`,
        operation: "Heap Extract Max",
        actionType: "compare",
        dataState: { root: structuredClone(root) } satisfies TreeVisualState,
        highlights: {
          active: nodeIdsAtIndices(root, [idx]),
          compared: nodeIdsAtIndices(root, [largest]),
        },
        codeLine: 6,
        pseudocodeLine: 4,
        variables: { Parent: heap[idx], "Larger Child": heap[largest] },
      });

      const temp = heap[idx];
      heap[idx] = heap[largest];
      heap[largest] = temp;

      root = createCompleteTreeFromArr(heap);

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Swapped (${temp} <-> ${heap[idx]})`,
        description: `Parent and child swapped. Continuing sift-down at index ${largest}.`,
        operation: "Heap Extract Max",
        actionType: "update",
        dataState: { root: structuredClone(root) } satisfies TreeVisualState,
        highlights: {
          active: nodeIdsAtIndices(root, [largest]),
          swapped: nodeIdsAtIndices(root, [idx]),
        },
        codeLine: 8,
        pseudocodeLine: 5,
        variables: { Heap: heap.join(", ") },
      });

      idx = largest;
    } else {
      break;
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Extract Max Complete",
    description: `Extracted ${maxVal}. Max-heap property fully restored: [${heap.join(", ")}].`,
    operation: "Heap Extract Max",
    actionType: "complete",
    dataState: { root: structuredClone(root) } satisfies TreeVisualState,
    highlights: { active: nodeIdsAtIndices(root, [0]) },
    codeLine: 10,
    pseudocodeLine: 6,
    variables: { "Extracted Value": maxVal, "Final Heap": heap.join(", ") },
  });

  return steps;
}

export function generateHeapifySteps(data: number[] = [4, 10, 3, 5, 1]): VisualStep[] {
  const heap = [...data];
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  let root = createCompleteTreeFromArr(heap);

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Heapify (Build Max-Heap)",
    description: `Starting bottom-up heapify on array [${heap.join(", ")}]. A binary heap is stored compactly as an array: parent(i)=floor((i-1)/2), left(i)=2i+1, right(i)=2i+2.`,
    operation: "Heapify",
    actionType: "initialize",
    dataState: { root: structuredClone(root) } satisfies TreeVisualState,
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Array: heap.join(", "), Size: heap.length },
  });

  const n = heap.length;
  // Start from last non-leaf node: floor(n/2) - 1
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Heapify Subtree at Index ${i} (${heap[i]})`,
      description: `Sifting down node ${heap[i]} at index ${i}.`,
      operation: "Heapify",
      actionType: "visit",
      dataState: { root: structuredClone(root) } satisfies TreeVisualState,
      highlights: { active: nodeIdsAtIndices(root, [i]) },
      codeLine: 3,
      pseudocodeLine: 2,
      variables: { Index: i, Value: heap[i] },
    });

    let current = i;
    while (true) {
      let largest = current;
      const left = 2 * current + 1;
      const right = 2 * current + 2;

      if (left < n && heap[left] > heap[largest]) largest = left;
      if (right < n && heap[right] > heap[largest]) largest = right;

      if (largest !== current) {
        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: `Swap ${heap[current]} with Larger Child ${heap[largest]}`,
          description: `Child ${heap[largest]} violates max-heap order with parent ${heap[current]}.`,
          operation: "Heapify",
          actionType: "compare",
          dataState: { root: structuredClone(root) } satisfies TreeVisualState,
          highlights: {
            active: nodeIdsAtIndices(root, [current]),
            compared: nodeIdsAtIndices(root, [largest]),
          },
          codeLine: 5,
          pseudocodeLine: 3,
          variables: { Parent: heap[current], Child: heap[largest] },
        });

        const temp = heap[current];
        heap[current] = heap[largest];
        heap[largest] = temp;

        root = createCompleteTreeFromArr(heap);

        steps.push({
          id: uuidv4(),
          stepNumber: stepNumber++,
          title: `Updated Subtree at Index ${current}`,
          description: `Max-heap invariant satisfied for node ${heap[current]}.`,
          operation: "Heapify",
          actionType: "update",
          dataState: { root: structuredClone(root) } satisfies TreeVisualState,
          highlights: {
            active: nodeIdsAtIndices(root, [current]),
            swapped: nodeIdsAtIndices(root, [largest]),
          },
          codeLine: 7,
          pseudocodeLine: 4,
          variables: { Heap: heap.join(", ") },
        });

        current = largest;
      } else {
        break;
      }
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Heapify Complete",
    description: `Successfully built valid Max-Heap in O(n) time: [${heap.join(", ")}].`,
    operation: "Heapify",
    actionType: "complete",
    dataState: { root: structuredClone(root) } satisfies TreeVisualState,
    highlights: { active: nodeIdsAtIndices(root, [0]) },
    codeLine: 9,
    pseudocodeLine: 5,
    variables: { "Final Max-Heap": heap.join(", ") },
  });

  return steps;
}
