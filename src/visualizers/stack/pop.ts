import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { StackElement, StackVisualState } from "./types";

export function generateStackPopSteps(
  initialData: number[],
  maxCapacity: number = 8
): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements: StackElement[] = initialData.map((val) => ({
    id: uuidv4(),
    value: val,
  }));

  let currentState: StackVisualState = { elements: [...elements], maxCapacity };

  // Step 1: Initialize Pop
  steps.push({
    id: uuidv4(),
    stepNumber: 1,
    title: "Initialize Pop",
    description: "Preparing to pop the top element from the stack.",
    operation: "Pop",
    actionType: "initialize",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: {
      Top: elements.length - 1,
      Size: elements.length,
    },
  });

  // Step 2: Check underflow
  const isUnderflow = elements.length === 0;
  steps.push({
    id: uuidv4(),
    stepNumber: 2,
    title: "Check Underflow",
    description: isUnderflow
      ? "Stack is empty (top = -1). Underflow condition detected."
      : `Stack is not empty (top = ${elements.length - 1}). Proceeding with pop.`,
    operation: "Pop",
    actionType: "compare",
    dataState: { ...currentState },
    highlights: { active: elements.at(-1) ? [elements.at(-1)!.id] : [] },
    codeLine: 2,
    pseudocodeLine: 2,
    variables: {
      Top: elements.length - 1,
      isEmpty: isUnderflow,
    },
  });

  if (isUnderflow) {
    steps.push({
      id: uuidv4(),
      stepNumber: 3,
      title: "Stack Underflow Error",
      description: "Pop operation failed due to Stack Underflow. Cannot pop from an empty stack.",
      operation: "Pop",
      actionType: "error",
      dataState: { ...currentState },
      highlights: { error: [] },
      codeLine: 2,
      pseudocodeLine: 2,
      variables: {
        Error: "Stack Underflow",
        Top: -1,
      },
    });
    return steps;
  }

  // Step 3: Access Top Element
  const elementToPop = elements[elements.length - 1];
  steps.push({
    id: uuidv4(),
    stepNumber: 3,
    title: "Read Top Element",
    description: `Reading value ${elementToPop.value} from current top index (${elements.length - 1}).`,
    operation: "Pop",
    actionType: "access",
    dataState: { ...currentState },
    highlights: { active: [elementToPop.id], pointer: [elementToPop.id] },
    codeLine: 3,
    pseudocodeLine: 3,
    variables: {
      Top: elements.length - 1,
      Value: elementToPop.value,
    },
  });

  // Step 4: Decrement Top & Mark Element for Removal
  steps.push({
    id: uuidv4(),
    stepNumber: 4,
    title: "Decrement Top Pointer",
    description: `Decremented top pointer from ${elements.length - 1} to ${elements.length - 2} and marked ${elementToPop.value} for removal.`,
    operation: "Pop",
    actionType: "pop",
    dataState: { ...currentState },
    highlights: { deleted: [elementToPop.id] },
    codeLine: 4,
    pseudocodeLine: 4,
    variables: {
      Top: elements.length - 2,
      Value: elementToPop.value,
    },
  });

  elements.pop();
  currentState = { elements: [...elements], maxCapacity };

  // Step 5: Complete
  steps.push({
    id: uuidv4(),
    stepNumber: 5,
    title: "Pop Complete",
    description: `Popped value ${elementToPop.value} returned successfully. New top is at index ${elements.length - 1}.`,
    operation: "Pop",
    actionType: "complete",
    dataState: { ...currentState },
    highlights: {},
    codeLine: 5,
    pseudocodeLine: 5,
    variables: {
      ReturnedValue: elementToPop.value,
      Top: elements.length - 1,
      Size: elements.length,
    },
  });

  return steps;
}
