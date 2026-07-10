import { VisualStep } from "@/types";
import { ArrayVisualState, createArrayElements } from "./types";
import { v4 as uuidv4 } from "uuid";

// 1. Access by Index
export function generateAccessByIndexSteps(arr: number[], indexToAccess: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createArrayElements(arr);
  const dataState: ArrayVisualState = { elements };

  // Step 1: Initial state
  steps.push({
    id: uuidv4(),
    stepNumber: 1,
    title: "Initial Array",
    description: `We want to access the element at index ${indexToAccess}.`,
    operation: "Access by Index",
    actionType: "compare",
    dataState: JSON.parse(JSON.stringify(dataState)),
    highlights: {},
    codeLine: 2,
    variables: { index: indexToAccess }
  });

  // Step 2: Validate Index
  const isValid = indexToAccess >= 0 && indexToAccess < arr.length;
  steps.push({
    id: uuidv4(),
    stepNumber: 2,
    title: "Validate Index",
    description: `Check if ${indexToAccess} is within bounds (0 to ${arr.length - 1}).`,
    operation: "Access by Index",
    actionType: "compare",
    dataState: JSON.parse(JSON.stringify(dataState)),
    highlights: {},
    codeLine: 3,
    variables: { index: indexToAccess, isValid }
  });

  if (!isValid) {
    steps.push({
      id: uuidv4(),
      stepNumber: 3,
      title: "Index Out of Bounds",
      description: `The index ${indexToAccess} is out of bounds. Throw an error.`,
      operation: "Access by Index",
      actionType: "error",
      dataState: JSON.parse(JSON.stringify(dataState)),
      highlights: { error: [indexToAccess.toString()] }, // Highlight index if possible, otherwise generic error
      codeLine: 4,
      variables: { index: indexToAccess, error: "IndexOutOfBoundsException" }
    });
    return steps;
  }

  // Step 3: Access
  steps.push({
    id: uuidv4(),
    stepNumber: 3,
    title: "Access Element",
    description: `Directly access memory offset for index ${indexToAccess}. Arrays provide O(1) random access time.`,
    operation: "Access by Index",
    actionType: "access",
    dataState: JSON.parse(JSON.stringify(dataState)),
    highlights: { current: [indexToAccess.toString()], pointer: [indexToAccess.toString()] },
    codeLine: 6,
    variables: { index: indexToAccess, value: arr[indexToAccess] },
    complexityNote: "Time Complexity: O(1). Space Complexity: O(1)."
  });

  // Step 4: Complete
  steps.push({
    id: uuidv4(),
    stepNumber: 4,
    title: "Access Complete",
    description: `Successfully retrieved value ${arr[indexToAccess]} from index ${indexToAccess}.`,
    operation: "Access by Index",
    actionType: "complete",
    dataState: JSON.parse(JSON.stringify(dataState)),
    highlights: { found: [indexToAccess.toString()] },
    codeLine: 7,
    variables: { index: indexToAccess, value: arr[indexToAccess] }
  });

  return steps;
}

// 2. Random Access is essentially the same algorithm visually.
export const generateRandomAccessSteps = generateAccessByIndexSteps;




function visualStep(input: Omit<VisualStep, "id">): VisualStep {
  return { id: uuidv4(), ...input };
}

export function generateAccessElementSteps(data: number[], index: number): VisualStep[] {
  const elements = createArrayElements(data);
  const safeIndex = Math.max(0, Math.min(index, elements.length - 1));
  return [
    visualStep({
      stepNumber: 1,
      title: "Validate Index",
      description: `Check whether index ${index} is inside the array bounds 0..${elements.length - 1}.`,
      operation: "Access",
      actionType: index < 0 || index >= elements.length ? "error" : "compare",
      dataState: { elements },
      highlights: index < 0 || index >= elements.length ? { error: [] } : { active: [safeIndex.toString()] },
      variables: { index, length: elements.length },
      pseudocodeLine: 2,
      codeLine: 2,
    }),
    visualStep({
      stepNumber: 2,
      title: index < 0 || index >= elements.length ? "Index Out of Bounds" : "Return Element",
      description: index < 0 || index >= elements.length
        ? "The index is invalid, so no element can be returned."
        : `Array access jumps directly to index ${safeIndex} and returns ${elements[safeIndex].value}.`,
      operation: "Access",
      actionType: index < 0 || index >= elements.length ? "error" : "access",
      dataState: { elements },
      highlights: index < 0 || index >= elements.length ? { error: [] } : { found: [safeIndex.toString()], pointer: [safeIndex.toString()] },
      variables: { index: safeIndex, value: elements[safeIndex]?.value ?? null },
      pseudocodeLine: 4,
      codeLine: 4,
      complexityNote: "Array access is O(1) because the address is computed from the base address plus an index offset.",
    }),
  ];
}

