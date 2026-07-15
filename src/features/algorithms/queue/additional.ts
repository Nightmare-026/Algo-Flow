import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";

const clone = <T>(value: T): T => structuredClone(value);

function visualStep(input: Omit<VisualStep, "id">): VisualStep {
  return { id: uuidv4(), ...input };
}

import { createQueueElements, QueueVisualState } from "./types";

export function generateSimpleQueueSteps(data: number[], capacity = 8): VisualStep[] {
  const queue: QueueVisualState = { elements: createQueueElements(data.slice(0, capacity)), maxCapacity: capacity };
  return [
    visualStep({
      stepNumber: 1,
      title: "Simple FIFO Queue",
      description: "A simple queue inserts at the rear and removes from the front.",
      operation: "Queue Type",
      actionType: "initialize",
      dataState: clone(queue),
      highlights: { active: queue.elements[0] ? [queue.elements[0].id] : [] },
      variables: { front: 0, rear: Math.max(queue.elements.length - 1, 0) },
      pseudocodeLine: 1,
    }),
    visualStep({
      stepNumber: 2,
      title: "FIFO Order",
      description: "The first value inserted is the first one removed.",
      operation: "Queue Type",
      actionType: "highlight",
      dataState: clone(queue),
      highlights: { sorted: queue.elements.map((item) => item.id) },
      variables: { policy: "FIFO" },
      pseudocodeLine: 2,
    }),
  ];
}

export function generateCircularQueueSteps(data: number[], value: number, capacity = 8): VisualStep[] {
  const queue: QueueVisualState = { elements: createQueueElements(data.slice(0, Math.max(1, capacity - 1))), maxCapacity: capacity };
  const steps: VisualStep[] = [];
  steps.push(visualStep({
    stepNumber: 1,
    title: "Initialize Circular Queue",
    description: "Circular queues reuse freed slots by moving front and rear with modulo arithmetic.",
    operation: "Circular Queue",
    actionType: "initialize",
    dataState: clone(queue),
    highlights: {},
    variables: { front: 0, rear: queue.elements.length - 1, capacity },
    pseudocodeLine: 1,
  }));
  const removed = queue.elements[0];
  const removalState = clone(queue);
  queue.elements.shift();
  steps.push(visualStep({
    stepNumber: 2,
    title: "Dequeue Frees a Slot",
    description: removed ? `Remove front value ${removed.value}; the front pointer wraps forward.` : "Queue is empty, so no slot is freed.",
    operation: "Circular Queue",
    actionType: "dequeue",
    dataState: removalState,
    highlights: removed ? { deleted: [removed.id] } : {},
    variables: { front: queue.elements.length > 0 ? 1 : 0 },
    pseudocodeLine: 3,
  }));
  const newElement = createQueueElements([value])[0];
  queue.elements.push(newElement);
  steps.push(visualStep({
    stepNumber: 3,
    title: "Rear Wrap-around Insert",
    description: `Insert ${value} into the reusable rear slot using (rear + 1) % capacity.`,
    operation: "Circular Queue",
    actionType: "enqueue",
    dataState: clone(queue),
    highlights: { inserted: [newElement.id], active: [newElement.id] },
    variables: { rear: "(rear + 1) % capacity" },
    pseudocodeLine: 5,
  }));
  return steps;
}
