import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { QueueElement, QueueVisualState } from "./types";

export function generatePriorityQueueEnqueueSteps(
  initialData: number[] = [40, 30, 20, 10],
  valueToEnqueue: number = 25,
  maxCapacity: number = 8
): VisualStep[] {
  const steps: VisualStep[] = [];
  const sortedInitial = [...initialData].sort((a, b) => b - a);
  const elements: QueueElement[] = sortedInitial.map((val) => ({ id: uuidv4(), value: val }));
  let currentState: QueueVisualState = { elements: [...elements], maxCapacity };

  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Priority Enqueue",
    description: `Preparing to insert priority item ${valueToEnqueue} in sorted priority order.`,
    operation: "Priority Enqueue",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Value: valueToEnqueue, "Priority Order": "Highest value first" },
  });

  if (elements.length >= maxCapacity) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Priority Queue Overflow",
      description: `Queue is full (capacity ${maxCapacity}). Cannot enqueue new element.`,
      operation: "Priority Enqueue",
      actionType: "error",
      dataState: structuredClone(currentState),
      highlights: { active: [] },
      codeLine: 2,
      pseudocodeLine: 2,
      variables: {},
    });
    return steps;
  }

  // Find insertion index for priority
  let insertIdx = 0;
  while (insertIdx < elements.length && elements[insertIdx].value >= valueToEnqueue) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Compare with Element at Index ${insertIdx} (${elements[insertIdx].value})`,
      description: `${elements[insertIdx].value} >= ${valueToEnqueue}. Scanning forward for correct priority slot.`,
      operation: "Priority Enqueue",
      actionType: "compare",
      dataState: structuredClone(currentState),
      highlights: { active: [elements[insertIdx].id] },
      codeLine: 3,
      pseudocodeLine: 3,
      variables: { Index: insertIdx, Element: elements[insertIdx].value, Target: valueToEnqueue },
    });
    insertIdx++;
  }

  const newElem: QueueElement = { id: uuidv4(), value: valueToEnqueue };
  elements.splice(insertIdx, 0, newElem);
  currentState = { elements: [...elements], maxCapacity };

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Insert at Priority Position ${insertIdx}`,
    description: `Inserted ${valueToEnqueue} at index ${insertIdx} maintaining priority order.`,
    operation: "Priority Enqueue",
    actionType: "enqueue",
    dataState: structuredClone(currentState),
    highlights: { inserted: [newElem.id], active: [newElem.id] },
    codeLine: 4,
    pseudocodeLine: 4,
    variables: { "Inserted Position": insertIdx, Value: valueToEnqueue },
  });

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Priority Enqueue Complete",
    description: `Priority queue updated: [${elements.map((e) => e.value).join(", ")}].`,
    operation: "Priority Enqueue",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { sorted: [newElem.id] },
    codeLine: 5,
    pseudocodeLine: 5,
    variables: { "Total Elements": elements.length },
  });

  return steps;
}

export function generatePriorityQueueDequeueSteps(
  initialData: number[] = [50, 40, 30, 20, 10],
  maxCapacity: number = 8
): VisualStep[] {
  const steps: VisualStep[] = [];
  const sortedInitial = [...initialData].sort((a, b) => b - a);
  const elements: QueueElement[] = sortedInitial.map((val) => ({ id: uuidv4(), value: val }));
  let currentState: QueueVisualState = { elements: [...elements], maxCapacity };

  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Priority Dequeue",
    description: "Preparing to dequeue highest priority element from the front of the queue.",
    operation: "Priority Dequeue",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { "Current Highest Priority": elements[0]?.value ?? "None" },
  });

  if (elements.length === 0) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Priority Queue Underflow",
      description: "Priority queue is empty. Cannot dequeue.",
      operation: "Priority Dequeue",
      actionType: "error",
      dataState: structuredClone(currentState),
      highlights: { active: [] },
      codeLine: 2,
      pseudocodeLine: 2,
      variables: {},
    });
    return steps;
  }

  const highestPriorityElem = elements[0];

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Identify Highest Priority Element (${highestPriorityElem.value})`,
    description: `Front element ${highestPriorityElem.value} has the highest priority.`,
    operation: "Priority Dequeue",
    actionType: "access",
    dataState: structuredClone(currentState),
    highlights: { active: [highestPriorityElem.id] },
    codeLine: 3,
    pseudocodeLine: 3,
    variables: { Value: highestPriorityElem.value },
  });

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Remove Element (${highestPriorityElem.value})`,
    description: `Extracting element ${highestPriorityElem.value} with highest priority.`,
    operation: "Priority Dequeue",
    actionType: "dequeue",
    dataState: structuredClone(currentState),
    highlights: { deleted: [highestPriorityElem.id] },
    codeLine: 4,
    pseudocodeLine: 4,
    variables: { Extracted: highestPriorityElem.value },
  });

  elements.shift();
  currentState = { elements: [...elements], maxCapacity };

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Priority Dequeue Complete",
    description: `Successfully dequeued ${highestPriorityElem.value}. New highest priority is ${elements[0]?.value ?? "None"}.`,
    operation: "Priority Dequeue",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: {},
    codeLine: 5,
    pseudocodeLine: 5,
    variables: { "Extracted Value": highestPriorityElem.value, Remaining: elements.length },
  });

  return steps;
}
