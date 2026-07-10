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

  // Step 1: Initialize
  steps.push({
    id: uuidv4(),
    stepNumber: 1,
    title: "Initialize Pop",
    description: "Preparing to pop the top element from the stack.",
    operation: "Pop",
    actionType: "initialize",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 2,
    pseudocodeLine: 1,
    variables: {
      "Top": elements.length - 1,
    }
  });

  // Step 2: Check underflow
  const isUnderflow = elements.length === 0;
  steps.push({
    id: uuidv4(),
    stepNumber: 2,
    title: "Check Underflow",
    description: isUnderflow
      ? "Stack is empty. Cannot pop element."
      : "Stack is not empty. Proceeding with pop.",
    operation: "Pop",
    actionType: "compare",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 3,
    pseudocodeLine: 2,
    variables: {
      "Top": elements.length - 1,
    }
  });

  if (isUnderflow) {
    steps.push({
      id: uuidv4(),
      stepNumber: 3,
      title: "Stack Underflow Error",
      description: "Pop operation failed due to Stack Underflow.",
      operation: "Pop",
      actionType: "error",
      dataState: { ...currentState },
      highlights: { error: [] },
      codeLine: 4,
      pseudocodeLine: 3,
      variables: {}
    });
    return steps;
  }

  // Step 3: Identify element to pop
  const elementToPop = elements[elements.length - 1];
  steps.push({
    id: uuidv4(),
    stepNumber: 3,
    title: "Access Top Element",
    description: `Accessing value ${elementToPop.value} at the top of the stack.`,
    operation: "Pop",
    actionType: "access",
    dataState: { ...currentState },
    highlights: { active: [elementToPop.id] },
    codeLine: 5,
    pseudocodeLine: 4,
    variables: {
      "Top": elements.length - 1,
      "Value": elementToPop.value
    }
  });

  // Step 4: Pop from stack
  elements.pop();
  currentState = { elements: [...elements], maxCapacity };
  
  steps.push({
    id: uuidv4(),
    stepNumber: 4,
    title: "Decrement Top",
    description: `Removed value ${elementToPop.value} and decremented top pointer.`,
    operation: "Pop",
    actionType: "pop",
    dataState: { ...currentState },
    highlights: { deleted: [elementToPop.id] },
    codeLine: 6,
    pseudocodeLine: 5,
    variables: {
      "Top": elements.length - 1,
      "Value": elementToPop.value
    }
  });

  // Step 5: Complete
  steps.push({
    id: uuidv4(),
    stepNumber: 5,
    title: "Pop Complete",
    description: `Value ${elementToPop.value} successfully popped from the stack.`,
    operation: "Pop",
    actionType: "complete",
    dataState: { ...currentState },
    highlights: {},
    codeLine: 7,
    pseudocodeLine: 6,
  });

  return steps;
}
