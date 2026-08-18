import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { QueueElement, QueueVisualState } from "./types";

export function generateDequePushFrontSteps(
  initialData: number[] = [20, 30, 40],
  valueToPush: number = 10,
  maxCapacity: number = 8
): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements: QueueElement[] = initialData.map((val) => ({ id: uuidv4(), value: val }));
  let currentState: QueueVisualState = { elements: [...elements], maxCapacity };

  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Deque Push Front",
    description: `Preparing to push value ${valueToPush} to the front of the double-ended queue.`,
    operation: "Push Front",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Value: valueToPush, Size: elements.length, Capacity: maxCapacity },
  });

  if (elements.length >= maxCapacity) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Deque Overflow",
      description: `Deque is at maximum capacity (${maxCapacity}). Cannot push front.`,
      operation: "Push Front",
      actionType: "error",
      dataState: structuredClone(currentState),
      highlights: { active: [] },
      codeLine: 2,
      pseudocodeLine: 2,
      variables: {},
    });
    return steps;
  }

  const newElem: QueueElement = { id: uuidv4(), value: valueToPush };
  elements.unshift(newElem);
  currentState = { elements: [...elements], maxCapacity };

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Inserted ${valueToPush} at Front`,
    description: `Successfully prepended ${valueToPush} as the new front element.`,
    operation: "Push Front",
    actionType: "enqueue",
    dataState: structuredClone(currentState),
    highlights: { inserted: [newElem.id], active: [newElem.id] },
    codeLine: 3,
    pseudocodeLine: 3,
    variables: { Front: valueToPush, Size: elements.length },
  });

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Push Front Complete",
    description: `Deque now contains [${elements.map((e) => e.value).join(", ")}].`,
    operation: "Push Front",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { sorted: [newElem.id] },
    codeLine: 4,
    pseudocodeLine: 4,
    variables: { Size: elements.length },
  });

  return steps;
}

export function generateDequePopRearSteps(
  initialData: number[] = [10, 20, 30, 40],
  maxCapacity: number = 8
): VisualStep[] {
  const steps: VisualStep[] = [];
  const elements: QueueElement[] = initialData.map((val) => ({ id: uuidv4(), value: val }));
  let currentState: QueueVisualState = { elements: [...elements], maxCapacity };

  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Deque Pop Rear",
    description: "Preparing to remove the rear element from the double-ended queue.",
    operation: "Pop Rear",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Size: elements.length },
  });

  if (elements.length === 0) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Deque Underflow",
      description: "Deque is empty. Cannot pop from rear.",
      operation: "Pop Rear",
      actionType: "error",
      dataState: structuredClone(currentState),
      highlights: { active: [] },
      codeLine: 2,
      pseudocodeLine: 2,
      variables: {},
    });
    return steps;
  }

  const popped = elements[elements.length - 1];

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Identify Rear Element (${popped.value})`,
    description: `Element ${popped.value} is located at the rear of the deque.`,
    operation: "Pop Rear",
    actionType: "access",
    dataState: structuredClone(currentState),
    highlights: { active: [popped.id] },
    codeLine: 3,
    pseudocodeLine: 3,
    variables: { Rear: popped.value },
  });

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Remove Rear Element (${popped.value})`,
    description: `Marking ${popped.value} for removal from the deque rear.`,
    operation: "Pop Rear",
    actionType: "dequeue",
    dataState: structuredClone(currentState),
    highlights: { deleted: [popped.id] },
    codeLine: 4,
    pseudocodeLine: 4,
    variables: { Removed: popped.value },
  });

  elements.pop();
  currentState = { elements: [...elements], maxCapacity };

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Pop Rear Complete",
    description: `Successfully popped ${popped.value} from rear. Deque size is now ${elements.length}.`,
    operation: "Pop Rear",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: {},
    codeLine: 5,
    pseudocodeLine: 5,
    variables: { "Popped Value": popped.value, Size: elements.length },
  });

  return steps;
}
