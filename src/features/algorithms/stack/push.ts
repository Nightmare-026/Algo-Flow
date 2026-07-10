import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { StackElement, StackVisualState } from "./types";

export function generateStackPushSteps(
  initialData: number[],
  valueToPush: number,
  maxCapacity: number = 8
): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements: StackElement[] = initialData.map((val) => ({
    id: uuidv4(),
    value: val,
  }));
  
  let currentState: StackVisualState = { elements: [...elements], maxCapacity };

  // Step 1: Initialize
  steps.push({
    id: uuidv4(),
    stepNumber: 1,
    title: "Initialize Push",
    description: `Preparing to push value ${valueToPush} onto the stack.`,
    operation: "Push",
    actionType: "initialize",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 2,
    pseudocodeLine: 1,
    variables: {
      "Value": valueToPush,
      "Top": elements.length - 1,
    }
  });

  // Step 2: Check overflow
  const isOverflow = elements.length >= maxCapacity;
  steps.push({
    id: uuidv4(),
    stepNumber: 2,
    title: "Check Overflow",
    description: isOverflow
      ? `Stack is full (capacity ${maxCapacity}). Cannot push new element.`
      : "Stack has space available. Proceeding with push.",
    operation: "Push",
    actionType: "compare",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 3,
    pseudocodeLine: 2,
    variables: {
      "Value": valueToPush,
      "Top": elements.length - 1,
      "Capacity": maxCapacity
    }
  });

  if (isOverflow) {
    steps.push({
      id: uuidv4(),
      stepNumber: 3,
      title: "Stack Overflow Error",
      description: "Push operation failed due to Stack Overflow.",
      operation: "Push",
      actionType: "error",
      dataState: { ...currentState },
      highlights: { error: [] },
      codeLine: 4,
      pseudocodeLine: 3,
      variables: {}
    });
    return steps;
  }

  // Step 3: Create element
  const newElement: StackElement = { id: uuidv4(), value: valueToPush };
  
  // Step 4: Push to stack
  elements.push(newElement);
  currentState = { elements: [...elements], maxCapacity };
  
  steps.push({
    id: uuidv4(),
    stepNumber: 3,
    title: "Increment Top and Add Value",
    description: `Incremented top pointer and placed ${valueToPush} at the new top.`,
    operation: "Push",
    actionType: "push",
    dataState: { ...currentState },
    highlights: { inserted: [newElement.id], active: [newElement.id] },
    codeLine: 5,
    pseudocodeLine: 4,
    variables: {
      "Top": elements.length - 1
    }
  });

  // Step 5: Complete
  steps.push({
    id: uuidv4(),
    stepNumber: 4,
    title: "Push Complete",
    description: `Value ${valueToPush} successfully pushed onto the stack.`,
    operation: "Push",
    actionType: "complete",
    dataState: { ...currentState },
    highlights: { sorted: [newElement.id] },
    codeLine: 6,
    pseudocodeLine: 5,
  });

  return steps;
}
