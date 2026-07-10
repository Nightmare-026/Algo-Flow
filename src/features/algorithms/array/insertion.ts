import { VisualStep } from "@/types";
import { ArrayElement, ArrayVisualState, createElements } from "./types";
import { v4 as uuidv4 } from "uuid";

// Helper to deep copy array elements
const clone = (elements: ArrayElement[]): ArrayElement[] => 
  elements.map(el => ({ ...el }));

/**
 * Array Insertion at Beginning
 */
export function generateInsertBeginningSteps(arr: number[], value: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  let stepCount = 1;
  const newValueId = uuidv4();

  // Step 1: Initial state
  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Initial Array",
    description: `We want to insert ${value} at the beginning (index 0). First, we need to create space by shifting all existing elements one position to the right.`,
    operation: "insertion",
    actionType: "initialize",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: { pointer: ["0"] },
    variables: { value, length: arr.length },
    codeLine: 1
  });

  // Step 2: Shifting elements to the right
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
        highlights: { active: [i.toString()], visited: [(i + 1).toString()] },
        variables: { value, i, length: elements.length },
        codeLine: 2
      });
    }
  }

  // Create new array with shifted elements to represent the insertion
  const newElements: ArrayElement[] = [
    { id: newValueId, value, originalIndex: 0 },
    ...elements.map((el, i) => ({ ...el, originalIndex: i + 1 }))
  ];

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Insert New Value",
    description: `Now that index 0 is available, we insert ${value}.`,
    operation: "insertion",
    actionType: "insert",
    dataState: { elements: clone(newElements) } as ArrayVisualState,
    highlights: { inserted: ["0"] },
    variables: { value, length: newElements.length },
    codeLine: 3
  });

  // Final step
  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Insertion Complete",
    description: `${value} has been successfully inserted at the beginning of the array.`,
    operation: "insertion",
    actionType: "success",
    dataState: { elements: clone(newElements) } as ArrayVisualState,
    highlights: { sorted: ["0"] },
    variables: { value, length: newElements.length },
    codeLine: 4
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

  // Step 1: Initial state
  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Initial Array",
    description: `We want to insert ${value} at the end of the array (index ${arr.length}). Since it's at the end, no shifting is required.`,
    operation: "insertion",
    actionType: "initialize",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: { pointer: [arr.length.toString()] },
    variables: { value, length: arr.length },
    codeLine: 1
  });

  // Create new array with element appended
  const newElements: ArrayElement[] = [
    ...elements,
    { id: newValueId, value, originalIndex: arr.length }
  ];

  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Insert New Value",
    description: `We append ${value} directly to the end of the array.`,
    operation: "insertion",
    actionType: "insert",
    dataState: { elements: clone(newElements) } as ArrayVisualState,
    highlights: { inserted: [arr.length.toString()] },
    variables: { value, length: newElements.length },
    codeLine: 2
  });

  // Final step
  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Insertion Complete",
    description: `${value} has been successfully inserted at the end of the array.`,
    operation: "insertion",
    actionType: "success",
    dataState: { elements: clone(newElements) } as ArrayVisualState,
    highlights: { sorted: [arr.length.toString()] },
    variables: { value, length: newElements.length },
    codeLine: 3
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
  
  // Bound the index to valid range
  const idx = Math.max(0, Math.min(insertIndex, arr.length));

  // Step 1: Initial state
  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Initial Array",
    description: `We want to insert ${value} at index ${idx}. We need to shift all elements from index ${idx} to the right to make room.`,
    operation: "insertion",
    actionType: "initialize",
    dataState: { elements: clone(elements) } as ArrayVisualState,
    highlights: { pointer: [idx.toString()] },
    variables: { value, index: idx, length: arr.length },
    codeLine: 1
  });

  // Step 2: Shifting elements to the right
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
        highlights: { active: [i.toString()], visited: [(i + 1).toString()] },
        variables: { value, index: idx, i, length: elements.length },
        codeLine: 2
      });
    }
  }

  // Create new array with shifted elements
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
    highlights: { inserted: [idx.toString()] },
    variables: { value, index: idx, length: newElements.length },
    codeLine: 3
  });

  // Final step
  steps.push({
    id: `step-${stepCount++}`,
    stepNumber: stepCount - 1,
    title: "Insertion Complete",
    description: `${value} has been successfully inserted at index ${idx}.`,
    operation: "insertion",
    actionType: "success",
    dataState: { elements: clone(newElements) } as ArrayVisualState,
    highlights: { sorted: [idx.toString()] },
    variables: { value, index: idx, length: newElements.length },
    codeLine: 4
  });

  return steps;
}
