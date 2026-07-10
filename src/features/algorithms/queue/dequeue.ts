import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { QueueElement, QueueVisualState } from "./types";

export function generateQueueDequeueSteps(
  initialData: number[],
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
    title: "Initialize Dequeue",
    description: "Preparing to dequeue the front element from the queue.",
    operation: "Dequeue",
    actionType: "initialize",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 2,
    pseudocodeLine: 1,
    variables: {
      "Front": elements.length > 0 ? 0 : -1,
      "Rear": elements.length - 1,
    }
  });

  // Step 2: Check underflow
  const isUnderflow = elements.length === 0;
  steps.push({
    id: uuidv4(),
    stepNumber: 2,
    title: "Check Underflow",
    description: isUnderflow
      ? "Queue is empty. Cannot dequeue element."
      : "Queue is not empty. Proceeding with dequeue.",
    operation: "Dequeue",
    actionType: "compare",
    dataState: { ...currentState },
    highlights: { active: [] },
    codeLine: 3,
    pseudocodeLine: 2,
    variables: {
      "Front": elements.length > 0 ? 0 : -1,
      "Rear": elements.length - 1,
    }
  });

  if (isUnderflow) {
    steps.push({
      id: uuidv4(),
      stepNumber: 3,
      title: "Queue Underflow Error",
      description: "Dequeue operation failed due to Queue Underflow.",
      operation: "Dequeue",
      actionType: "error",
      dataState: { ...currentState },
      highlights: { error: [] },
      codeLine: 4,
      pseudocodeLine: 3,
      variables: {}
    });
    return steps;
  }

  // Step 3: Identify element to dequeue
  const elementToDequeue = elements[0];
  steps.push({
    id: uuidv4(),
    stepNumber: 3,
    title: "Access Front Element",
    description: `Accessing value ${elementToDequeue.value} at the front of the queue.`,
    operation: "Dequeue",
    actionType: "access",
    dataState: { ...currentState },
    highlights: { active: [elementToDequeue.id] },
    codeLine: 5,
    pseudocodeLine: 4,
    variables: {
      "Front": 0,
      "Value": elementToDequeue.value
    }
  });

  // Step 4: Dequeue
  elements.shift();
  currentState = { elements: [...elements], maxCapacity };
  
  steps.push({
    id: uuidv4(),
    stepNumber: 4,
    title: "Increment Front",
    description: `Removed value ${elementToDequeue.value} and shifted remaining elements (or incremented front pointer).`,
    operation: "Dequeue",
    actionType: "dequeue",
    dataState: { ...currentState },
    highlights: { deleted: [elementToDequeue.id] },
    codeLine: 6,
    pseudocodeLine: 5,
    variables: {
      "Front": elements.length > 0 ? 0 : -1,
      "Rear": elements.length - 1,
      "Value": elementToDequeue.value
    }
  });

  // Step 5: Complete
  steps.push({
    id: uuidv4(),
    stepNumber: 5,
    title: "Dequeue Complete",
    description: `Value ${elementToDequeue.value} successfully dequeued.`,
    operation: "Dequeue",
    actionType: "complete",
    dataState: { ...currentState },
    highlights: {},
    codeLine: 7,
    pseudocodeLine: 6,
  });

  return steps;
}
