import { VisualStep } from "@/types";
import { ArrayVisualState, createElements } from "./types";
import { v4 as uuidv4 } from "uuid";

// 1. Forward Traversal
export function generateForwardTraversalSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  const dataState: ArrayVisualState = { elements };

  // Step 1: Initial state
  steps.push({
    id: uuidv4(),
    stepNumber: 1,
    title: "Initial Array",
    description: `We will traverse the array from index 0 to ${arr.length - 1}.`,
    operation: "Forward Traversal",
    actionType: "compare",
    dataState: JSON.parse(JSON.stringify(dataState)),
    highlights: {},
    codeLine: 2,
    variables: { length: arr.length }
  });

  const visited: string[] = [];

  for (let i = 0; i < arr.length; i++) {
    // Step: Visit element
    steps.push({
      id: uuidv4(),
      stepNumber: steps.length + 1,
      title: `Visit Index ${i}`,
      description: `Accessing element at index ${i} with value ${arr[i]}.`,
      operation: "Forward Traversal",
      actionType: "visit",
      dataState: JSON.parse(JSON.stringify(dataState)),
      highlights: { 
        current: [i.toString()], 
        pointer: [i.toString()],
        visited: [...visited] // Show previously visited
      },
      codeLine: 4,
      variables: { i, value: arr[i] }
    });
    
    visited.push(i.toString());
  }

  // Final step
  steps.push({
    id: uuidv4(),
    stepNumber: steps.length + 1,
    title: "Traversal Complete",
    description: `Successfully visited all ${arr.length} elements in O(n) time.`,
    operation: "Forward Traversal",
    actionType: "complete",
    dataState: JSON.parse(JSON.stringify(dataState)),
    highlights: { visited: [...visited] },
    codeLine: 6,
    variables: {},
    complexityNote: "Time Complexity: O(n) because we visit each element exactly once. Space Complexity: O(1)."
  });

  return steps;
}

// 2. Reverse Traversal
export function generateReverseTraversalSteps(arr: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  const dataState: ArrayVisualState = { elements };

  // Step 1: Initial state
  steps.push({
    id: uuidv4(),
    stepNumber: 1,
    title: "Initial Array",
    description: `We will traverse the array backwards, from index ${arr.length - 1} down to 0.`,
    operation: "Reverse Traversal",
    actionType: "compare",
    dataState: JSON.parse(JSON.stringify(dataState)),
    highlights: {},
    codeLine: 2,
    variables: { length: arr.length }
  });

  const visited: string[] = [];

  for (let i = arr.length - 1; i >= 0; i--) {
    // Step: Visit element
    steps.push({
      id: uuidv4(),
      stepNumber: steps.length + 1,
      title: `Visit Index ${i}`,
      description: `Accessing element at index ${i} with value ${arr[i]}.`,
      operation: "Reverse Traversal",
      actionType: "visit",
      dataState: JSON.parse(JSON.stringify(dataState)),
      highlights: { 
        current: [i.toString()], 
        pointer: [i.toString()],
        visited: [...visited] 
      },
      codeLine: 4,
      variables: { i, value: arr[i] }
    });
    
    visited.push(i.toString());
  }

  // Final step
  steps.push({
    id: uuidv4(),
    stepNumber: steps.length + 1,
    title: "Traversal Complete",
    description: `Successfully visited all ${arr.length} elements in reverse order.`,
    operation: "Reverse Traversal",
    actionType: "complete",
    dataState: JSON.parse(JSON.stringify(dataState)),
    highlights: { visited: [...visited] },
    codeLine: 6,
    variables: {},
    complexityNote: "Time Complexity: O(n). Space Complexity: O(1)."
  });

  return steps;
}

// 3. Range Traversal
export function generateRangeTraversalSteps(arr: number[], start: number, end: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements = createElements(arr);
  const dataState: ArrayVisualState = { elements };

  steps.push({
    id: uuidv4(),
    stepNumber: 1,
    title: "Initial Array",
    description: `We will traverse the array from index ${start} to ${end}.`,
    operation: "Range Traversal",
    actionType: "compare",
    dataState: JSON.parse(JSON.stringify(dataState)),
    highlights: {},
    codeLine: 2,
    variables: { start, end, length: arr.length }
  });

  const isValid = start >= 0 && end < arr.length && start <= end;
  
  steps.push({
    id: uuidv4(),
    stepNumber: 2,
    title: "Validate Range",
    description: `Check if range [${start}, ${end}] is valid.`,
    operation: "Range Traversal",
    actionType: "compare",
    dataState: JSON.parse(JSON.stringify(dataState)),
    highlights: {},
    codeLine: 3,
    variables: { start, end, isValid }
  });

  if (!isValid) {
    steps.push({
      id: uuidv4(),
      stepNumber: 3,
      title: "Invalid Range",
      description: `The range [${start}, ${end}] is invalid. Throw an error.`,
      operation: "Range Traversal",
      actionType: "error",
      dataState: JSON.parse(JSON.stringify(dataState)),
      highlights: { error: [start.toString(), end.toString()] },
      codeLine: 4,
      variables: { start, end, error: "IllegalArgumentException" }
    });
    return steps;
  }

  const visited: string[] = [];

  for (let i = start; i <= end; i++) {
    steps.push({
      id: uuidv4(),
      stepNumber: steps.length + 1,
      title: `Visit Index ${i}`,
      description: `Accessing element at index ${i} with value ${arr[i]}.`,
      operation: "Range Traversal",
      actionType: "visit",
      dataState: JSON.parse(JSON.stringify(dataState)),
      highlights: { 
        current: [i.toString()], 
        pointer: [i.toString()],
        visited: [...visited] 
      },
      codeLine: 6,
      variables: { i, value: arr[i] }
    });
    visited.push(i.toString());
  }

  steps.push({
    id: uuidv4(),
    stepNumber: steps.length + 1,
    title: "Range Traversal Complete",
    description: `Successfully visited ${visited.length} elements in the range [${start}, ${end}].`,
    operation: "Range Traversal",
    actionType: "complete",
    dataState: JSON.parse(JSON.stringify(dataState)),
    highlights: { visited: [...visited] },
    codeLine: 8,
    variables: {},
    complexityNote: `Time Complexity: O(k) where k is the range size (${end - start + 1}).`
  });

  return steps;
}
