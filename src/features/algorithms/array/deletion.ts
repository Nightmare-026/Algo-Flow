/**
 * Phase 3 — Array deletion step-generators emit canonical shapes via the
 * helpers and route through `ArrayElement.id` (UUID).
 */

import { VisualStep } from "@/types";
import { ArrayElement, ArrayVisualState, createElements } from "./types";
import {
  compare,
  conjunct,
  deleted,
  found as foundHL,
  pointerOn,
} from "@/features/visualizer-engine/highlights";

const clone = (elements: ArrayElement[]): ArrayElement[] =>
  elements.map((el) => ({ ...el }));

/**
 * Array Deletion at Beginning
 */
export function generateDeleteBeginningSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;

  if (arr.length === 0) {
    steps.push({
      id: `step-${stepCount++}`,
      stepNumber: stepCount - 1,
      title: "Error: Empty Array",
      description: "Cannot delete from an empty array.",
      operation: "deletion",
      actionType: "error",
      dataState: { elements: [] } as ArrayVisualState,
      highlights: {},
      codeLine: 1,
    });
    return steps;
  }

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Initial Array",
    description: `We want to delete the first element (index 0). First, we remove it.`,
    operation: "deletion",
    actionType: "initialize",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: pointerOn([elements[0].id]),
    codeLine: 1,
  });

  const removedValue = elements[0].value;
  elements[0] = { ...elements[0] };

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Remove Element",
    description: `Removed value ${removedValue} from index 0. Now we must shift remaining elements left.`,
    operation: "deletion",
    actionType: "delete",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: deleted([elements[0].id]),
    codeLine: 2,
  });

  for (let i = 1; i < elements.length; i++) {
    steps.push({
      id: `step-${stepCount++}`,
      stepNumber: stepCount - 1,
      title: "Shift Element Left",
      description: `Shift element at index ${i} to index ${i - 1}.`,
      operation: "deletion",
      actionType: "shift",
      dataState: { elements: clone(elements) } as ArrayVisualState,
      highlights: conjunct([
        compare([elements[i].id]),
        pointerOn([elements[i - 1].id]),
      ]),
      codeLine: 3,
    });
  }

  const newElements = elements.slice(1).map((el, i) => ({ ...el, originalIndex: i }));

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Deletion Complete",
    description: `First element successfully deleted and array resized.`,
    operation: "deletion",
    actionType: "success",
    dataState: { elements: newElements } as ArrayVisualState,
    highlights: {},
    codeLine: 4,
  });

  return steps;
}

/**
 * Array Deletion at End
 */
export function generateDeleteEndSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;

  if (arr.length === 0) {
    steps.push({
      id: `step-${stepCount++}`,
      stepNumber: stepCount - 1,
      title: "Error: Empty Array",
      description: "Cannot delete from an empty array.",
      operation: "deletion",
      actionType: "error",
      dataState: { elements: [] } as ArrayVisualState,
      highlights: {},
      codeLine: 1,
    });
    return steps;
  }

  const lastIndex = elements.length - 1;

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Initial Array",
    description: `We want to delete the last element (index ${lastIndex}).`,
    operation: "deletion",
    actionType: "initialize",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: pointerOn([elements[lastIndex].id]),
    codeLine: 1,
  });

  const removedValue = elements[lastIndex].value;
  elements[lastIndex] = { ...elements[lastIndex] };

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Remove Element",
    description: `Removed value ${removedValue} from index ${lastIndex}. Since it's the last element, no shifting is required!`,
    operation: "deletion",
    actionType: "delete",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: deleted([elements[lastIndex].id]),
    codeLine: 2,
  });

  const newElements = elements.slice(0, lastIndex);

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Deletion Complete",
    description: `Last element successfully deleted and array resized.`,
    operation: "deletion",
    actionType: "success",
    dataState: { elements: newElements } as ArrayVisualState,
    highlights: {},
    codeLine: 3,
  });

  return steps;
}

/**
 * Array Deletion at Index
 */
export function generateDeleteIndexSteps(arr: number[], index: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;

  if (arr.length === 0 || index < 0 || index >= arr.length) {
    steps.push({
      id: `step-${stepCount++}`,
      stepNumber: stepCount - 1,
      title: "Error: Invalid Index",
      description: `Cannot delete from index ${index}. Valid range is 0 to ${Math.max(0, arr.length - 1)}.`,
      operation: "deletion",
      actionType: "error",
      dataState: { elements: clone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 1,
    });
    return steps;
  }

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Initial Array",
    description: `We want to delete the element at index ${index}. First, we remove it.`,
    operation: "deletion",
    actionType: "initialize",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: pointerOn([elements[index].id]),
    codeLine: 1,
  });

  const removedValue = elements[index].value;
  elements[index] = { ...elements[index] };

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Remove Element",
    description: `Removed value ${removedValue} from index ${index}. Now we must shift elements after it left.`,
    operation: "deletion",
    actionType: "delete",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: deleted([elements[index].id]),
    codeLine: 2,
  });

  for (let i = index + 1; i < elements.length; i++) {
    steps.push({
      id: `step-${stepCount++}`,
      stepNumber: stepCount - 1,
      title: "Shift Element Left",
      description: `Shift element at index ${i} to index ${i - 1}.`,
      operation: "deletion",
      actionType: "shift",
      dataState: { elements: clone(elements) } as ArrayVisualState,
      highlights: conjunct([
        compare([elements[i].id]),
        pointerOn([elements[i - 1].id]),
      ]),
      codeLine: 3,
    });
  }

  const newElements: ArrayElement[] = [];
  for (let i = 0; i < elements.length; i++) {
    if (i === index) continue;
    newElements.push({ ...elements[i], originalIndex: newElements.length });
  }

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Deletion Complete",
    description: `Element at index ${index} successfully deleted and array resized.`,
    operation: "deletion",
    actionType: "success",
    dataState: { elements: newElements } as ArrayVisualState,
    highlights: {},
    codeLine: 4,
  });

  return steps;
}

/**
 * Array Deletion by Value
 */
export function generateDeleteValueSteps(arr: number[], value: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;

  if (arr.length === 0) {
    steps.push({
      id: `step-${stepCount++}`,
      stepNumber: stepCount - 1,
      title: "Error: Empty Array",
      description: "Cannot delete from an empty array.",
      operation: "deletion",
      actionType: "error",
      dataState: { elements: [] } as ArrayVisualState,
      highlights: {},
      codeLine: 1,
    });
    return steps;
  }

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Initial Array",
    description: `We want to find and delete the first occurrence of ${value}. First, we must search for it.`,
    operation: "deletion",
    actionType: "initialize",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 1,
  });

  let foundIndex = -1;

  for (let i = 0; i < elements.length; i++) {
    steps.push({
      id: `step-${stepCount++}`,
      stepNumber: stepCount - 1,
      title: "Search for Value",
      description: `Checking if element at index ${i} equals ${value}.`,
      operation: "deletion",
      actionType: "compare",
      dataState: { elements: clone(elements) } as ArrayVisualState,
      highlights: compare([elements[i].id]),
      codeLine: 2,
    });

    if (elements[i].value === value) {
      foundIndex = i;
      steps.push({
        id: `step-${stepCount++}`,
        stepNumber: stepCount - 1,
        title: "Value Found",
        description: `Found ${value} at index ${i}!`,
        operation: "deletion",
        actionType: "found",
        dataState: { elements: clone(elements) } as ArrayVisualState,
        highlights: foundHL([elements[i].id]),
        codeLine: 3,
      });
      break;
    }
  }

  if (foundIndex === -1) {
    steps.push({
      id: `step-${stepCount++}`,
      stepNumber: stepCount - 1,
      title: "Value Not Found",
      description: `${value} does not exist in the array. No deletion performed.`,
      operation: "deletion",
      actionType: "error",
      dataState: { elements: clone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 4,
    });
    return steps;
  }

  elements[foundIndex] = { ...elements[foundIndex] };

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Remove Element",
    description: `Removed value ${value} from index ${foundIndex}. Now we must shift elements after it left.`,
    operation: "deletion",
    actionType: "delete",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: deleted([elements[foundIndex].id]),
    codeLine: 5,
  });

  for (let i = foundIndex + 1; i < elements.length; i++) {
    steps.push({
      id: `step-${stepCount++}`,
      stepNumber: stepCount - 1,
      title: "Shift Element Left",
      description: `Shift element at index ${i} to index ${i - 1}.`,
      operation: "deletion",
      actionType: "shift",
      dataState: { elements: clone(elements) } as ArrayVisualState,
      highlights: conjunct([
        compare([elements[i].id]),
        pointerOn([elements[i - 1].id]),
      ]),
      codeLine: 6,
    });
  }

  const newElements: ArrayElement[] = [];
  for (let i = 0; i < elements.length; i++) {
    if (i === foundIndex) continue;
    newElements.push({ ...elements[i], originalIndex: newElements.length });
  }

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Deletion Complete",
    description: `Value ${value} successfully deleted and array resized.`,
    operation: "deletion",
    actionType: "success",
    dataState: { elements: newElements } as ArrayVisualState,
    highlights: {},
    codeLine: 7,
  });

  return steps;
}
