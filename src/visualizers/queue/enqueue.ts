import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { QueueElement, QueueVisualState } from "./types";

export function generateQueueEnqueueSteps(
  initialData: number[],
  valueToEnqueue: number,
  maxCapacity: number = 8
): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements: QueueElement[] = initialData.map((val) => ({
    id: uuidv4(),
    value: val,
  }));

  let currentState: QueueVisualState = { elements: [...elements], maxCapacity };

  // Step 1: Initialize
  steps.push({
    id: uuidv4(),
    stepNumber: 1,
    title: "Initialize Enqueue",
    description: `Preparing to enqueue value ${valueToEnqueue}.`,
    operation: "Enqueue",
    actionType: "initialize",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 2,
    pseudocodeLine: 1,
    variables: {
      Value: valueToEnqueue,
      Rear: elements.length - 1,
    },
  });

  // Step 2: Check overflow
  const isOverflow = elements.length >= maxCapacity;
  steps.push({
    id: uuidv4(),
    stepNumber: 2,
    title: "Check Capacity",
    description: isOverflow
      ? `Queue is full (capacity ${maxCapacity}). Cannot enqueue new element.`
      : "Queue has space available. Proceeding.",
    operation: "Enqueue",
    actionType: "compare",
    dataState: { ...currentState },
    highlights: { active: elements.at(-1) ? [elements.at(-1)!.id] : [] },
    codeLine: 3,
    pseudocodeLine: 2,
    variables: {
      Value: valueToEnqueue,
      Rear: elements.length - 1,
      Capacity: maxCapacity,
    },
  });

  if (isOverflow) {
    steps.push({
      id: uuidv4(),
      stepNumber: 3,
      title: "Queue Overflow Error",
      description: "Enqueue failed due to Queue Overflow.",
      operation: "Enqueue",
      actionType: "error",
      dataState: { ...currentState },
      highlights: { error: [] },
      codeLine: 4,
      pseudocodeLine: 3,
      variables: {},
    });
    return steps;
  }

  // Step 3: Create element
  const newElement: QueueElement = { id: uuidv4(), value: valueToEnqueue };

  // Step 4: Enqueue
  elements.push(newElement);
  currentState = { elements: [...elements], maxCapacity };

  steps.push({
    id: uuidv4(),
    stepNumber: 3,
    title: "Increment Rear and Add Value",
    description: `Incremented rear pointer and placed ${valueToEnqueue} at the new rear.`,
    operation: "Enqueue",
    actionType: "enqueue",
    dataState: { ...currentState },
    highlights: { inserted: [newElement.id], active: [newElement.id] },
    codeLine: 5,
    pseudocodeLine: 4,
    variables: {
      Rear: elements.length - 1,
    },
  });

  // Step 5: Complete
  steps.push({
    id: uuidv4(),
    stepNumber: 4,
    title: "Enqueue Complete",
    description: `Value ${valueToEnqueue} successfully enqueued.`,
    operation: "Enqueue",
    actionType: "complete",
    dataState: { ...currentState },
    highlights: { sorted: [newElement.id] },
    codeLine: 6,
    pseudocodeLine: 5,
  });

  return steps;
}
