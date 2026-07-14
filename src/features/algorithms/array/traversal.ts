/**
 * Phase 3 — Array traversal step-generators emit canonical
 * `VisualStepHighlights` shapes via the helpers and route ids through
 * `ArrayElement.id` (UUID), matching the renderer's lookup convention.
 */

import { VisualStep } from "@/types";
import { ArrayVisualState, createElements } from "./types";
import {
  conjunct,
  currentTarget,
  errorOn,
  pointerOn,
  visited,
} from "@/features/visualizer-engine/highlights";

// 1. Forward Traversal
export function generateForwardTraversalSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  const dataState: ArrayVisualState = { elements };

  steps.push({
    id: `step-${steps.length + 1}`,
    stepNumber: 1,
    title: "Initial Array",
    description: `We will traverse the array from index 0 to ${arr.length - 1}.`,
    operation: "Forward Traversal",
    actionType: "compare",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  const visitedIds: string[] = [];

  for (let i = 0; i < arr.length; i++) {
    steps.push({
      id: `step-${steps.length + 1}`,
      stepNumber: steps.length + 1,
      title: `Visit Index ${i}`,
      description: `Accessing element at index ${i} with value ${arr[i]}.`,
      operation: "Forward Traversal",
      actionType: "visit",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: conjunct([
        currentTarget([elements[i].id]),
        pointerOn([elements[i].id]),
        visitedIds.length > 0 ? visited(visitedIds) : {},
      ]),
      codeLine: 4,
    });

    visitedIds.push(elements[i].id);
  }

  steps.push({
    id: `step-${steps.length + 1}`,
    stepNumber: steps.length + 1,
    title: "Traversal Complete",
    description: `Successfully visited all ${arr.length} elements in O(n) time.`,
    operation: "Forward Traversal",
    actionType: "complete",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: visited(visitedIds),
    codeLine: 6,
    complexityNote: "Time Complexity: O(n) because we visit each element exactly once. Space Complexity: O(1).",
  });

  return steps;
}

// 2. Reverse Traversal
export function generateReverseTraversalSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  const dataState: ArrayVisualState = { elements };

  steps.push({
    id: `step-${steps.length + 1}`,
    stepNumber: 1,
    title: "Initial Array",
    description: `We will traverse the array backwards, from index ${arr.length - 1} down to 0.`,
    operation: "Reverse Traversal",
    actionType: "compare",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  const visitedIds: string[] = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    steps.push({
      id: `step-${steps.length + 1}`,
      stepNumber: steps.length + 1,
      title: `Visit Index ${i}`,
      description: `Accessing element at index ${i} with value ${arr[i]}.`,
      operation: "Reverse Traversal",
      actionType: "visit",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: conjunct([
        currentTarget([elements[i].id]),
        pointerOn([elements[i].id]),
        visitedIds.length > 0 ? visited(visitedIds) : {},
      ]),
      codeLine: 4,
    });

    visitedIds.push(elements[i].id);
  }

  steps.push({
    id: `step-${steps.length + 1}`,
    stepNumber: steps.length + 1,
    title: "Traversal Complete",
    description: `Successfully visited all ${arr.length} elements in reverse order.`,
    operation: "Reverse Traversal",
    actionType: "complete",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: visited(visitedIds),
    codeLine: 6,
    complexityNote: "Time Complexity: O(n). Space Complexity: O(1).",
  });

  return steps;
}

// 3. Range Traversal
export function generateRangeTraversalSteps(arr: number[], start: number, end: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  const dataState: ArrayVisualState = { elements };

  steps.push({
    id: `step-${steps.length + 1}`,
    stepNumber: 1,
    title: "Initial Array",
    description: `We will traverse the array from index ${start} to ${end}.`,
    operation: "Range Traversal",
    actionType: "compare",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  const isValid = start >= 0 && end < arr.length && start <= end;

  steps.push({
    id: `step-${steps.length + 1}`,
    stepNumber: 2,
    title: "Validate Range",
    description: `Check if range [${start}, ${end}] is valid.`,
    operation: "Range Traversal",
    actionType: "compare",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 3,
  });

  if (!isValid) {
    steps.push({
      id: `step-${steps.length + 1}`,
      stepNumber: 3,
      title: "Invalid Range",
      description: `The range [${start}, ${end}] is invalid. Throw an error.`,
      operation: "Range Traversal",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: errorOn([
        elements[start]?.id ?? start.toString(),
        elements[end]?.id ?? end.toString(),
      ]),
      codeLine: 4,
    });
    return steps;
  }

  const visitedIds: string[] = [];

  for (let i = start; i <= end; i++) {
    steps.push({
      id: `step-${steps.length + 1}`,
      stepNumber: steps.length + 1,
      title: `Visit Index ${i}`,
      description: `Accessing element at index ${i} with value ${arr[i]}.`,
      operation: "Range Traversal",
      actionType: "visit",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: conjunct([
        currentTarget([elements[i].id]),
        pointerOn([elements[i].id]),
        visitedIds.length > 0 ? visited(visitedIds) : {},
      ]),
      codeLine: 6,
    });
    visitedIds.push(elements[i].id);
  }

  steps.push({
    id: `step-${steps.length + 1}`,
    stepNumber: steps.length + 1,
    title: "Range Traversal Complete",
    description: `Successfully visited ${visitedIds.length} elements in the range [${start}, ${end}].`,
    operation: "Range Traversal",
    actionType: "complete",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: visited(visitedIds),
    codeLine: 8,
    complexityNote: `Time Complexity: O(k) where k is the range size (${end - start + 1}).`,
  });

  return steps;
}
