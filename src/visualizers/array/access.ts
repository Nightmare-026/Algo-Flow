/**
 * Phase 3 — Array access step-generators emit canonical shapes via the
 * helpers and route through `ArrayElement.id` (UUID) so renderers paint
 * correctly.
 */

import { VisualStep } from "@/types";
import { ArrayVisualState, createArrayElements } from "./types";
import {
  compare,
  conjunct,
  currentTarget,
  errorOn,
  found as foundHL,
  pointerOn,
} from "@/visualizers/shared/highlights";

function makeStep(input: Omit<VisualStep, "id">): VisualStep {
  return { id: `step-${input.stepNumber}`, ...input };
}

// 1. Access by Index
export function generateAccessByIndexSteps(arr: number[], indexToAccess: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createArrayElements(arr);

  steps.push({
    ...makeStep({
      stepNumber: 1,
      title: "Initial Array",
      description: `We want to access the element at index ${indexToAccess}.`,
      operation: "Access by Index",
      actionType: "initialize",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: {},
      codeLine: 2,
    }),
  });

  const isValid = indexToAccess >= 0 && indexToAccess < arr.length;
  steps.push({
    ...makeStep({
      stepNumber: 2,
      title: "Validate Index",
      description: `Check if ${indexToAccess} is within bounds (0 to ${arr.length - 1}).`,
      operation: "Access by Index",
      actionType: isValid ? "compare" : "error",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: isValid ? currentTarget([elements[indexToAccess].id]) : {},
      codeLine: 3,
    }),
  });

  if (!isValid) {
    steps.push({
      ...makeStep({
        stepNumber: 3,
        title: "Index Out of Bounds",
        description: `The index ${indexToAccess} is out of bounds. Throw an error.`,
        operation: "Access by Index",
        actionType: "error",
        dataState: { elements: structuredClone(elements) } as ArrayVisualState,
        highlights: errorOn([]),
        codeLine: 4,
      }),
    });
    return steps;
  }

  steps.push({
    ...makeStep({
      stepNumber: 3,
      title: "Access Element",
      description: `Directly access memory offset for index ${indexToAccess}. Arrays provide O(1) random access time.`,
      operation: "Access by Index",
      actionType: "access",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: conjunct([
        currentTarget([elements[indexToAccess].id]),
        pointerOn([elements[indexToAccess].id]),
      ]),
      codeLine: 6,
      complexityNote: "Time Complexity: O(1). Space Complexity: O(1).",
    }),
  });

  steps.push({
    ...makeStep({
      stepNumber: 4,
      title: "Access Complete",
      description: `Successfully retrieved value ${arr[indexToAccess]} from index ${indexToAccess}.`,
      operation: "Access by Index",
      actionType: "complete",
      dataState: { elements: structuredClone(elements) } as ArrayVisualState,
      highlights: foundHL([elements[indexToAccess].id]),
      codeLine: 7,
    }),
  });

  return steps;
}

export const generateRandomAccessSteps = generateAccessByIndexSteps;

export function generateAccessElementSteps(data: number[], index: number): VisualStep[] {
  const elements = createArrayElements(data);
  const safeIndex = Math.max(0, Math.min(index, elements.length - 1));
  return [
    makeStep({
      stepNumber: 1,
      title: "Validate Index",
      description: `Check whether index ${index} is inside the array bounds 0..${elements.length - 1}.`,
      operation: "Access",
      actionType: index < 0 || index >= elements.length ? "error" : "compare",
      dataState: { elements } as ArrayVisualState,
      highlights:
        index < 0 || index >= elements.length
          ? errorOn([])
          : compare([elements[safeIndex]?.id ?? safeIndex.toString()]),
      pseudocodeLine: 2,
      codeLine: 2,
    }),
    makeStep({
      stepNumber: 2,
      title: index < 0 || index >= elements.length ? "Index Out of Bounds" : "Return Element",
      description:
        index < 0 || index >= elements.length
          ? "The index is invalid, so no element can be returned."
          : `Array access jumps directly to index ${safeIndex} and returns ${elements[safeIndex].value}.`,
      operation: "Access",
      actionType: index < 0 || index >= elements.length ? "error" : "access",
      dataState: { elements } as ArrayVisualState,
      highlights:
        index < 0 || index >= elements.length
          ? errorOn([])
          : conjunct([foundHL([elements[safeIndex].id]), pointerOn([elements[safeIndex].id])]),
      pseudocodeLine: 4,
      codeLine: 4,
      complexityNote:
        "Array access is O(1) because the address is computed from the base address plus an index offset.",
    }),
  ];
}
