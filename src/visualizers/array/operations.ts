/**
 * Phase 3 — Array operations step-generators emit canonical shapes via the
 * helpers and route through `ArrayElement.id` (UUID).
 */

import { VisualStep } from "@/types";
import { ArrayElement, ArrayVisualState, createElements } from "./types";
import {
  compare,
  conjunct,
  currentTarget,
  errorOn,
  succeeded,
  swap,
  visited,
} from "@/visualizers/shared/highlights";

// 1. Update by Index
export function generateUpdateByIndexSteps(
  arr: number[],
  value: number,
  index: number
): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const n = elements.length;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Update",
    description: `Updating element at index ${index} to ${value}.`,
    operation: "update",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 1,
  });

  if (index < 0 || index >= n) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Error",
      description: `Index ${index} is out of bounds.`,
      operation: "update",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 2,
    });
    return steps;
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Access Index",
    description: `Accessing element at index ${index}. Current value is ${elements[index].value}.`,
    operation: "update",
    actionType: "access",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: currentTarget([elements[index].id]),
    codeLine: 4,
  });

  elements[index] = { ...elements[index], value };

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Update Value",
    description: `Updated value at index ${index} to ${value}.`,
    operation: "update",
    actionType: "update",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: succeeded([elements[index].id]),
    codeLine: 5,
  });

  return steps;
}

// 2. Update by Value
export function generateUpdateByValueSteps(
  arr: number[],
  target: number,
  newValue: number
): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const n = elements.length;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Update by Value",
    description: `Replacing all occurrences of ${target} with ${newValue}.`,
    operation: "update",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 1,
  });

  let found = false;

  for (let i = 0; i < n; i++) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Check Element",
      description: `Checking index ${i}: is ${elements[i].value} equal to ${target}?`,
      operation: "update",
      actionType: "access",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: currentTarget([elements[i].id]),
      codeLine: 3,
    });

    if (elements[i].value === target) {
      found = true;
      elements[i] = { ...elements[i], value: newValue };

      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Value Updated",
        description: `Match found! Updated value at index ${i} to ${newValue}.`,
        operation: "update",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: succeeded([elements[i].id]),
        codeLine: 4,
      });
    }
  }

  if (!found) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "No Match Found",
      description: `Value ${target} was not found in the array.`,
      operation: "update",
      actionType: "not-found",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 7,
    });
  }

  return steps;
}

// 3. Merge Sorted Arrays
export function generateMergeSortedArraysSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const n = elements.length;

  const mid = Math.floor(n / 2);
  const left = elements.slice(0, mid).sort((a, b) => a.value - b.value);
  const right = elements.slice(mid).sort((a, b) => a.value - b.value);

  for (let i = 0; i < mid; i++) elements[i] = left[i];
  for (let i = mid; i < n; i++) elements[i] = right[i - mid];

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Merge",
    description: "Assuming left half and right half are sorted. Merging them.",
    operation: "merge",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 1,
  });

  const merged: ArrayElement[] = [];
  let i = 0;
  let j = mid;

  while (i < mid && j < n) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Compare Elements",
      description: `Comparing ${elements[i].value} (Left) and ${elements[j].value} (Right).`,
      operation: "merge",
      actionType: "compare",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: compare([elements[i].id, elements[j].id]),
      codeLine: 4,
    });

    if (elements[i].value <= elements[j].value) {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Take Left",
        description: `${elements[i].value} <= ${elements[j].value}. Taking element from left half.`,
        operation: "merge",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: succeeded([elements[i].id]),
        codeLine: 5,
      });
      merged.push(elements[i]);
      i++;
    } else {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Take Right",
        description: `${elements[j].value} < ${elements[i].value}. Taking element from right half.`,
        operation: "merge",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: succeeded([elements[j].id]),
        codeLine: 7,
      });
      merged.push(elements[j]);
      j++;
    }
  }

  while (i < mid) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Take Remaining Left",
      description: `Right half exhausted. Taking remaining ${elements[i].value} from left half.`,
      operation: "merge",
      actionType: "update",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: succeeded([elements[i].id]),
      codeLine: 10,
    });
    merged.push(elements[i]);
    i++;
  }

  while (j < n) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Take Remaining Right",
      description: `Left half exhausted. Taking remaining ${elements[j].value} from right half.`,
      operation: "merge",
      actionType: "update",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: succeeded([elements[j].id]),
      codeLine: 13,
    });
    merged.push(elements[j]);
    j++;
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Merge Complete",
    description: "The two halves have been merged into a fully sorted array.",
    operation: "merge",
    actionType: "success",
    dataState: { elements: structuredClone(merged) } as ArrayVisualState,
    highlights: {},
    codeLine: 16,
  });

  return steps;
}

// 4. Reverse Array
export function generateReverseArraySteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const n = elements.length;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Reversal",
    description: "Reversing array by swapping elements from both ends.",
    operation: "update",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 1,
  });

  let left = 0;
  let right = n - 1;

  while (left < right) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Identify Swaps",
      description: `Identifying elements at index ${left} (${elements[left].value}) and index ${right} (${elements[right].value}) for swapping.`,
      operation: "update",
      actionType: "compare",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: compare([elements[left].id, elements[right].id]),
      codeLine: 4,
    });

    const temp = elements[left];
    elements[left] = elements[right];
    elements[right] = temp;

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Swap Elements",
      description: `Swapped ${elements[left].value} and ${elements[right].value}.`,
      operation: "update",
      actionType: "swap",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: swap([elements[left].id, elements[right].id]),
      codeLine: 5,
    });

    left++;
    right--;
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Reversal Complete",
    description: "Array is successfully reversed.",
    operation: "update",
    actionType: "success",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 8,
  });

  return steps;
}

// 5. Left Rotation
export function generateLeftRotationSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const n = elements.length;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Left Rotation",
    description: "Rotating array to the left by 1 position.",
    operation: "update",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 1,
  });

  if (n <= 1) return steps;

  const first = elements[0];

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Store First Element",
    description: `Storing first element (${first.value}) temporarily.`,
    operation: "update",
    actionType: "access",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: currentTarget([first.id]),
    codeLine: 3,
  });

  elements.shift();
  for (let i = 0; i < elements.length; i++) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Shift Elements Left",
      description: `Shifting ${elements[i].value} to the left.`,
      operation: "update",
      actionType: "update",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: visited([elements[i].id]),
      codeLine: 5,
    });
  }

  elements.push(first);

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Place First Element",
    description: `Moving original first element (${first.value}) to the last position.`,
    operation: "update",
    actionType: "update",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: succeeded([first.id]),
    codeLine: 7,
  });

  return steps;
}

// 6. Right Rotation
export function generateRightRotationSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const n = elements.length;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Right Rotation",
    description: "Rotating array to the right by 1 position.",
    operation: "update",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 1,
  });

  if (n <= 1) return steps;

  const last = elements[n - 1];

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Store Last Element",
    description: `Storing last element (${last.value}) temporarily.`,
    operation: "update",
    actionType: "access",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: currentTarget([last.id]),
    codeLine: 3,
  });

  elements.pop();
  for (let i = elements.length - 1; i >= 0; i--) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Shift Elements Right",
      description: `Shifting ${elements[i].value} to the right.`,
      operation: "update",
      actionType: "update",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: visited([elements[i].id]),
      codeLine: 5,
    });
  }

  elements.unshift(last);

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Place Last Element",
    description: `Moving original last element (${last.value}) to the first position.`,
    operation: "update",
    actionType: "update",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: succeeded([last.id]),
    codeLine: 7,
  });

  return steps;
}

export function generateRemoveDuplicatesSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepCount = 1;
  const elements = createElements(arr);

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Remove Duplicates",
    description: `Removing duplicates from array.`,
    operation: "remove",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 1,
  });

  const unique: ArrayElement[] = [];
  const seen = new Set<number>();

  for (let i = 0; i < elements.length; i++) {
    const el = elements[i];

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Check Value",
      description: `Checking if ${el.value} has been seen before.`,
      operation: "remove",
      actionType: "compare",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: conjunct([currentTarget([el.id]), compare([el.id])]),
      codeLine: 2,
    });

    if (!seen.has(el.value)) {
      seen.add(el.value);
      unique.push(el);

      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Unique Value",
        description: `${el.value} is unique. Keeping it.`,
        operation: "remove",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: succeeded([el.id]),
        codeLine: 2,
      });
    } else {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Duplicate Found",
        description: `${el.value} is a duplicate, removing.`,
        operation: "remove",
        actionType: "success",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: errorOn([el.id]),
        codeLine: 2,
      });
    }
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Complete",
    description: `Duplicates removed. Resulting array length is ${unique.length}.`,
    operation: "remove",
    actionType: "complete",
    dataState: { elements: structuredClone(unique) } as ArrayVisualState,
    highlights: {},
    codeLine: 3,
  });

  return steps;
}
