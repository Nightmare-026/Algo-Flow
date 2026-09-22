/**
 * Phase 3 — Array search step-generators rewritten to emit canonical
 * `VisualStepHighlights` shapes via `highlights` helpers, rather than the
 * legacy inverted `{[elementId]: "bucket"}` literals (audit A-03 / RR-01).
 */

import { VisualStep } from "@/types";
import { ArrayVisualState, createElements } from "./types";
import {
  compare,
  conjunct,
  currentTarget,
  found as foundHL,
  markBucket,
  pointerOn,
  visited,
} from "@/visualizers/shared/highlights";

// 1. Linear Search
export function generateLinearSearchSteps(arr: number[], target: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  let found = false;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Linear Search",
    description: `Searching for target value ${target} by checking each element one by one.`,
    operation: "search",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  for (let i = 0; i < elements.length; i++) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Check Element",
      description: `Checking if element at index ${i} (value: ${elements[i].value}) equals target ${target}.`,
      operation: "search",
      actionType: "compare",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: compare([elements[i].id]),
      codeLine: 4,
    });

    if (elements[i].value === target) {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Target Found",
        description: `Target ${target} found at index ${i}!`,
        operation: "search",
        actionType: "success",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: foundHL([elements[i].id]),
        codeLine: 5,
      });
      found = true;
      break;
    } else {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Element Does Not Match",
        description: `${elements[i].value} != ${target}. Moving to next element.`,
        operation: "search",
        actionType: "compare",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: visited([elements[i].id]),
        codeLine: 4,
      });
    }
  }

  if (!found) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Target Not Found",
      description: `Reached the end of the array. Target ${target} was not found.`,
      operation: "search",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 8,
    });
  }

  return steps;
}

// 2. Binary Search
export function generateBinarySearchSteps(arr: number[], target: number): VisualStep[] {
  const steps: VisualStep[] = [];

  const sortedArr = [...arr].sort((a, b) => a - b);
  const elements = createElements(sortedArr);
  let stepCount = 1;

  const isSortedBefore = arr.every((val, i) => i === 0 || val >= arr[i - 1]);
  let initDesc = `Precondition: array must be sorted. Searching sorted array for target ${target}. Invariant: if present, the target stays inside [low, high].`;
  if (!isSortedBefore) {
    initDesc = `Precondition violated: input was unsorted, so a sorted copy is used. Binary Search requires sorted data. Target: ${target}.`;
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Binary Search",
    description: initDesc,
    operation: "search",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  let low = 0;
  let high = elements.length - 1;
  let found = false;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    // Mid = current comparison target; every other index in [low, high] is
    // the live search space.
    const inRange: string[] = [];
    for (let i = low; i <= high; i++) if (i !== mid) inRange.push(elements[i].id);

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Calculate Midpoint",
      description: `Search space is from index ${low} to ${high}. Midpoint is index ${mid} (value: ${elements[mid].value}).`,
      operation: "search",
      actionType: "compare",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: conjunct([markBucket(inRange, "current"), currentTarget([elements[mid].id])]),
      codeLine: 4,
    });

    if (elements[mid].value === target) {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Target Found",
        description: `Target ${target} found at index ${mid}!`,
        operation: "search",
        actionType: "success",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: foundHL([elements[mid].id]),
        codeLine: 6,
      });
      found = true;
      break;
    } else if (elements[mid].value < target) {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Adjust Search Space",
        description: `${elements[mid].value} is less than ${target}. Search right half (index ${mid + 1} to ${high}).`,
        operation: "search",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: visited([elements[mid].id]),
        codeLine: 8,
      });
      low = mid + 1;
    } else {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Adjust Search Space",
        description: `${elements[mid].value} is greater than ${target}. Search left half (index ${low} to ${mid - 1}).`,
        operation: "search",
        actionType: "update",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: visited([elements[mid].id]),
        codeLine: 10,
      });
      high = mid - 1;
    }
  }

  if (!found) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Target Not Found",
      description: `Search space is empty (low > high). Target ${target} was not found.`,
      operation: "search",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 13,
    });
  }

  return steps;
}

// 3. Jump Search
export function generateJumpSearchSteps(arr: number[], target: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const sortedArr = [...arr].sort((a, b) => a - b);
  const elements = createElements(sortedArr);
  let stepCount = 1;
  const n = arr.length;

  if (n === 0) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Start Jump Search",
      description: "Array is empty.",
      operation: "search",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 1,
    });
    return steps;
  }

  const blockSize = Math.max(1, Math.floor(Math.sqrt(n)));
  let step = blockSize;
  let prev = 0;

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Jump Search",
    description: `Searching the sorted values for target ${target}. Jump step is √${n} ≈ ${blockSize}.`,
    operation: "search",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  while (elements[Math.min(step, n) - 1].value < target) {
    const blockEnd = Math.min(step, n) - 1;
    const nextPrev = prev;
    prev = step;

    const skipParts: VisualStep["highlights"][] = [currentTarget([elements[blockEnd].id])];
    if (nextPrev < prev - 1) {
      const processedIds: string[] = [];
      for (let i = nextPrev; i < prev - 1; i++) processedIds.push(elements[i].id);
      skipParts.push(visited(processedIds));
    }

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Jump",
      description: `Value at index ${blockEnd} is ${elements[blockEnd].value} < ${target}. Jumping ahead to index ${Math.min(step + blockSize, n) - 1}.`,
      operation: "search",
      actionType: "access",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: conjunct(skipParts),
      codeLine: 4,
    });

    if (prev >= n) {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Target Not Found",
        description: `Jumped beyond the array. Target ${target} was not found.`,
        operation: "search",
        actionType: "error",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: {},
        codeLine: 13,
      });
      return steps;
    }
    step += blockSize;
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Block Found",
    description: `Target should be in the block starting at index ${prev}. Doing linear search.`,
    operation: "search",
    actionType: "access",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: currentTarget([elements[prev].id]),
    codeLine: 7,
  });

  let found = false;
  for (let i = prev; i < Math.min(step, n); i++) {
    const partsHL: VisualStep["highlights"][] = [compare([elements[i].id])];
    if (prev < i) {
      const pastIds: string[] = [];
      for (let j = prev; j < i; j++) pastIds.push(elements[j].id);
      partsHL.push(visited(pastIds));
    }

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Linear Search",
      description: `Checking value at index ${i}: ${elements[i].value}`,
      operation: "search",
      actionType: "access",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: conjunct(partsHL),
      codeLine: 8,
    });

    if (elements[i].value === target) {
      found = true;
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Target Found",
        description: `Target ${target} found at index ${i}!`,
        operation: "search",
        actionType: "success",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: foundHL([elements[i].id]),
        codeLine: 10,
      });
      break;
    }
  }

  if (!found) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Target Not Found",
      description: `Reached end of block or array. Target ${target} was not found.`,
      operation: "search",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 13,
    });
  }

  return steps;
}

// 4. Interpolation Search
export function generateInterpolationSearchSteps(arr: number[], target: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const sortedArr = [...arr].sort((a, b) => a - b);
  const elements = createElements(sortedArr);
  let stepCount = 1;
  const n = arr.length;

  if (n === 0) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Start Interpolation Search",
      description: "Array is empty.",
      operation: "search",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 1,
    });
    return steps;
  }

  steps.push({
    id: `step-${stepCount}`,
    stepNumber: stepCount++,
    title: "Start Interpolation Search",
    description: `Searching the sorted values for target ${target} using interpolation.`,
    operation: "search",
    actionType: "initialize",
    dataState: { elements: structuredClone(elements) } as ArrayVisualState,
    highlights: {},
    codeLine: 2,
  });

  let low = 0;
  let high = n - 1;
  let found = false;

  while (low <= high && target >= elements[low].value && target <= elements[high].value) {
    if (elements[low].value === elements[high].value) {
      if (elements[low].value === target) {
        found = true;
        steps.push({
          id: `step-${stepCount}`,
          stepNumber: stepCount++,
          title: "Target Found",
          description: `Target ${target} found at index ${low}!`,
          operation: "search",
          actionType: "success",
          dataState: { elements: structuredClone(elements) } as ArrayVisualState,
          highlights: foundHL([elements[low].id]),
          codeLine: 10,
        });
      }
      break;
    }

    const rawPos =
      low +
      Math.floor(
        ((high - low) / (elements[high].value - elements[low].value)) *
          (target - elements[low].value)
      );
    // Float rounding on skewed distributions can push the estimate outside
    // [low, high]; clamp so elements[pos] is always defined.
    const pos = Math.min(high, Math.max(low, rawPos));

    const probeParts: VisualStep["highlights"][] = [currentTarget([elements[pos].id])];
    if (low !== pos) probeParts.push(pointerOn([elements[low].id]));
    if (high !== pos) probeParts.push(pointerOn([elements[high].id]));

    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Probe Position",
      description: `Estimated position is ${pos}. Checking value: ${elements[pos].value}`,
      operation: "search",
      actionType: "access",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: conjunct(probeParts),
      codeLine: 6,
    });

    if (elements[pos].value === target) {
      found = true;
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Target Found",
        description: `Target ${target} found at index ${pos}!`,
        operation: "search",
        actionType: "success",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: foundHL([elements[pos].id]),
        codeLine: 7,
      });
      break;
    }

    if (elements[pos].value < target) {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Adjust Range",
        description: `Value ${elements[pos].value} < ${target}. Searching right half.`,
        operation: "search",
        actionType: "access",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: currentTarget([elements[pos].id]),
        codeLine: 9,
      });
      low = pos + 1;
    } else {
      steps.push({
        id: `step-${stepCount}`,
        stepNumber: stepCount++,
        title: "Adjust Range",
        description: `Value ${elements[pos].value} > ${target}. Searching left half.`,
        operation: "search",
        actionType: "access",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: currentTarget([elements[pos].id]),
        codeLine: 11,
      });
      high = pos - 1;
    }
  }

  if (!found) {
    steps.push({
      id: `step-${stepCount}`,
      stepNumber: stepCount++,
      title: "Target Not Found",
      description: `Target ${target} was not found in the array.`,
      operation: "search",
      actionType: "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 14,
    });
  }

  return steps;
}
