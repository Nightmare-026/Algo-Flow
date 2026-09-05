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

  // Step 1: Initialize Push
  steps.push({
    id: uuidv4(),
    stepNumber: 1,
    title: "Initialize Push",
    description: `Preparing to push value ${valueToPush} onto the stack.`,
    operation: "Push",
    actionType: "initialize",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: {
      Value: valueToPush,
      Top: elements.length - 1,
      Capacity: maxCapacity,
    },
  });

  // Step 2: Check overflow
  const isOverflow = elements.length >= maxCapacity;
  steps.push({
    id: uuidv4(),
    stepNumber: 2,
    title: "Check Overflow",
    description: isOverflow
      ? `Stack is full (${elements.length}/${maxCapacity} elements). Overflow condition detected.`
      : `Stack has available capacity (${elements.length}/${maxCapacity} elements). Proceeding with push.`,
    operation: "Push",
    actionType: "compare",
    dataState: { ...currentState },
    highlights: { active: elements.at(-1) ? [elements.at(-1)!.id] : [] },
    codeLine: 2,
    pseudocodeLine: 2,
    variables: {
      Value: valueToPush,
      Top: elements.length - 1,
      Capacity: maxCapacity,
      isFull: isOverflow,
    },
  });

  if (isOverflow) {
    steps.push({
      id: uuidv4(),
      stepNumber: 3,
      title: "Stack Overflow Error",
      description: `Push failed! Stack has reached max capacity (${maxCapacity}). Cannot push ${valueToPush}.`,
      operation: "Push",
      actionType: "error",
      dataState: { ...currentState },
      highlights: { error: elements.map((e) => e.id) },
      codeLine: 2,
      pseudocodeLine: 2,
      variables: {
        Error: "Stack Overflow",
        Top: elements.length - 1,
        Capacity: maxCapacity,
      },
    });
    return steps;
  }

  // Step 3: Increment Top Pointer
  const newElement: StackElement = { id: uuidv4(), value: valueToPush };
  const nextTopIndex = elements.length;

  steps.push({
    id: uuidv4(),
    stepNumber: 3,
    title: "Increment Top Pointer",
    description: `Incrementing top pointer from index ${elements.length - 1} to ${nextTopIndex} to allocate slot for ${valueToPush}.`,
    operation: "Push",
    actionType: "move-pointer",
    dataState: { ...currentState },
    highlights: elements.at(-1) ? { pointer: [elements.at(-1)!.id] } : {},
    codeLine: 3,
    pseudocodeLine: 3,
    variables: {
      Top: nextTopIndex,
      Value: valueToPush,
    },
  });

  // Step 4: Write Element to Stack Top
  elements.push(newElement);
  currentState = { elements: [...elements], maxCapacity };

  steps.push({
    id: uuidv4(),
    stepNumber: 4,
    title: "Store Value at Top",
    description: `Placed value ${valueToPush} at stack[${nextTopIndex}] (new top of stack).`,
    operation: "Push",
    actionType: "push",
    dataState: { ...currentState },
    highlights: { inserted: [newElement.id], active: [newElement.id] },
    codeLine: 4,
    pseudocodeLine: 4,
    variables: {
      Top: elements.length - 1,
      Value: valueToPush,
    },
  });

  // Step 5: Complete
  steps.push({
    id: uuidv4(),
    stepNumber: 5,
    title: "Push Complete",
    description: `Value ${valueToPush} successfully pushed onto the stack. Top is now at index ${elements.length - 1}.`,
    operation: "Push",
    actionType: "complete",
    dataState: { ...currentState },
    highlights: { sorted: [newElement.id] },
    codeLine: 5,
    pseudocodeLine: 5,
    variables: {
      Top: elements.length - 1,
      Size: elements.length,
    },
  });

  return steps;
}
