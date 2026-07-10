import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { QueueElement, QueueVisualState } from "./types";

const createState = (initialData: number[], maxCapacity: number): QueueVisualState => ({
  elements: initialData.map((value) => ({ id: uuidv4(), value })),
  maxCapacity,
});

const step = (
  stepNumber: number,
  title: string,
  description: string,
  operation: string,
  actionType: VisualStep["actionType"],
  dataState: QueueVisualState,
  highlights: VisualStep["highlights"] = {},
  variables: VisualStep["variables"] = {},
  pseudocodeLine?: number
): VisualStep => ({
  id: uuidv4(),
  stepNumber,
  title,
  description,
  operation,
  actionType,
  dataState,
  highlights,
  variables,
  pseudocodeLine,
  codeLine: pseudocodeLine,
});

export function generateQueuePeekSteps(initialData: number[], maxCapacity: number = 8): VisualStep[] {
  const state = createState(initialData, maxCapacity);
  const front = state.elements[0] as QueueElement | undefined;
  const steps: VisualStep[] = [
    step(1, "Start Peek", "Prepare to read the front queue element without removing it.", "Peek", "initialize", state, {}, { Front: front ? 0 : -1 }, 1),
    step(2, "Check Underflow", front ? "Queue is not empty, so the front value can be read." : "Queue is empty, so peek cannot return a value.", "Peek", front ? "compare" : "error", state, front ? {} : { error: [] }, { isEmpty: !front }, 2),
  ];

  if (!front) return steps;

  steps.push(
    step(3, "Read Front", `Front points to value ${front.value}. The queue remains unchanged.`, "Peek", "access", state, { active: [front.id], pointer: [front.id] }, { Front: 0, Value: front.value }, 3),
    step(4, "Peek Complete", `Returned ${front.value} without dequeueing it.`, "Peek", "complete", state, { found: [front.id] }, { Value: front.value }, 4)
  );
  return steps;
}

export function generateQueueFrontRearSteps(initialData: number[], maxCapacity: number = 8): VisualStep[] {
  const state = createState(initialData, maxCapacity);
  const front = state.elements[0] as QueueElement | undefined;
  const rear = state.elements[state.elements.length - 1] as QueueElement | undefined;
  const steps: VisualStep[] = [
    step(1, "Read Queue Ends", "Inspect the front and rear pointers of the queue.", "Front/Rear", "initialize", state, {}, { Front: front ? 0 : -1, Rear: rear ? state.elements.length - 1 : -1 }, 1),
  ];

  if (!front || !rear) {
    steps.push(step(2, "Queue Empty", "Both front and rear are -1 because the queue has no elements.", "Front/Rear", "error", state, { error: [] }, { Front: -1, Rear: -1 }, 2));
    return steps;
  }

  steps.push(
    step(2, "Highlight Front", `The front element is ${front.value}.`, "Front/Rear", "access", state, { active: [front.id], pointer: [front.id] }, { Front: 0, FrontValue: front.value }, 2),
    step(3, "Highlight Rear", `The rear element is ${rear.value}.`, "Front/Rear", "access", state, { active: [rear.id], pointer: [rear.id] }, { Rear: state.elements.length - 1, RearValue: rear.value }, 3),
    step(4, "Ends Identified", "Front and rear positions are available without changing the queue.", "Front/Rear", "complete", state, { found: [front.id, rear.id] }, { FrontValue: front.value, RearValue: rear.value }, 4)
  );
  return steps;
}
