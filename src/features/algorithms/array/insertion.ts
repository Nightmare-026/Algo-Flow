/**
 * Phase 3 — Array insertion step-generators emit canonical shapes via the
 * helpers and route through `ArrayElement.id` (UUID).
 */

import { VisualStep } from "@/types";
import { ArrayElement, ArrayVisualState, createElements } from "./types";
import { v4 as uuidv4 } from "uuid";
import {
  compare,
  conjunct,
  inserted,
  pointerOn,
  sortedHighlight,
  visited,
} from "@/features/visualizer-engine/highlights";

const clone = (elements: ArrayElement[]): ArrayElement[] =>
  elements.map((el) => ({ ...el }));

/**
 * Array Insertion at Beginning
 */
export function generateInsertBeginningSteps(arr: number[], value: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const newValueId = uuidv4();

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Initial Array",
    description: `We want to insert ${value} at the beginning (index 0). First, we need to create space by shifting all existing elements one position to the right.`,
    operation: "insertion",
    actionType: "initialize",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: pointerOn(["0"]),
    codeLine: 1,
  });

  if (elements.length > 0) {
    for (let i = elements.length - 1; i >= 0; i--) {
      steps.push({
        id: `step-${stepCount++}`,
        stepNumber: stepCount - 1,
        title: "Shift Element Right",
        description: `Shift the element at index ${i} to index ${i + 1}.`,
        operation: "insertion",
        actionType: "shift",
        dataState: { elements: clone(elements) } as ArrayVisualState,
        highlights: conjunct([
          compare([elements[i].id]),
          visited([elements[i + 1]?.id ?? (i + 1).toString()]),
        ]),
        codeLine: 2,
      });
    }
  }

  const newElements: ArrayElement[] = [
    { id: newValueId, value, originalIndex: 0 },
    ...elements.map((el, i) => ({ ...el, originalIndex: i + 1 })),
  ];

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Insert New Value",
    description: `Now that index 0 is available, we insert ${value}.`,
    operation: "insertion",
    actionType: "insert",
    dataState: { elements: clone(newElements) } as ArrayVisualState,
    highlights: inserted([newElements[0].id]),
    codeLine: 3,
  });

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Insertion Complete",
    description: `${value} has been successfully inserted at the beginning of the array.`,
    operation: "insertion",
    actionType: "success",
    dataState: { elements: clone(newElements) } as ArrayVisualState,
    highlights: sortedHighlight([newElements[0].id]),
    codeLine: 4,
  });

  return steps;
}

/**
 * Array Insertion at End
 */
export function generateInsertEndSteps(arr: number[], value: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const newValueId = uuidv4();

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Initial Array",
    description: `We want to insert ${value} at the end of the array (index ${arr.length}). Since it's at the end, no shifting is required.`,
    operation: "insertion",
    actionType: "initialize",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: pointerOn([arr.length.toString()]),
    codeLine: 1,
  });

  const newElements: ArrayElement[] = [
    ...elements,
    { id: newValueId, value, originalIndex: arr.length },
  ];

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Insert New Value",
    description: `We append ${value} directly to the end of the array.`,
    operation: "insertion",
    actionType: "insert",
    dataState: { elements: clone(newElements) } as ArrayVisualState,
    highlights: inserted([newElements[newElements.length - 1].id]),
    codeLine: 2,
  });

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Insertion Complete",
    description: `${value} has been successfully inserted at the end of the array.`,
    operation: "insertion",
    actionType: "success",
    dataState: { elements: clone(newElements) } as ArrayVisualState,
    highlights: sortedHighlight([newElements[newElements.length - 1].id]),
    codeLine: 3,
  });

  return steps;
}

/**
 * Array Insertion at specific Index
 */
export function generateInsertIndexSteps(arr: number[], value: number, insertIndex: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const newValueId = uuidv4();

  const idx = Math.max(0, Math.min(insertIndex, arr.length));

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Initial Array",
    description: `We want to insert ${value} at index ${idx}. We need to shift all elements from index ${idx} to the right to make room.`,
    operation: "insertion",
    actionType: "initialize",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: pointerOn([idx.toString()]),
    codeLine: 1,
  });

  if (idx < elements.length) {
    for (let i = elements.length - 1; i >= idx; i--) {
      steps.push({
        id: `step-${stepCount++}`,
        stepNumber: stepCount - 1,
        title: "Shift Element Right",
        description: `Shift the element at index ${i} to index ${i + 1}.`,
        operation: "insertion",
        actionType: "shift",
        dataState: { elements: clone(elements) } as ArrayVisualState,
        highlights: conjunct([
          compare([elements[i].id]),
          visited([elements[i + 1]?.id ?? (i + 1).toString()]),
        ]),
        codeLine: 2,
      });
    }
  }

  const newElements: ArrayElement[] = [];
  for (let i = 0; i < idx; i++) newElements.push({ ...elements[i] });
  newElements.push({ id: newValueId, value, originalIndex: idx });
  for (let i = idx; i < elements.length; i++) newElements.push({ ...elements[i], originalIndex: i + 1 });

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Insert New Value",
    description: `Now that index ${idx} is available, we insert ${value}.`,
    operation: "insertion",
    actionType: "insert",
    dataState: { elements: clone(newElements) } as ArrayVisualState,
    highlights: inserted([newElements[idx].id]),
    codeLine: 3,
  });

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Insertion Complete",
    description: `${value} has been successfully inserted at index ${idx}.`,
    operation: "insertion",
    actionType: "success",
    dataState: { elements: clone(newElements) } as ArrayVisualState,
    highlights: sortedHighlight([newElements[idx].id]),
    codeLine: 4,
  });

  return steps;
}
