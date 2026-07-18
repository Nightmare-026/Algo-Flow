import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { StackElement, StackVisualState } from "./types";

const createState = (initialData: number[], maxCapacity: number): StackVisualState => ({
  elements: initialData.map((value) => ({ id: uuidv4(), value })),
  maxCapacity,
});

const step = (
  stepNumber: number,
  title: string,
  description: string,
  operation: string,
  actionType: VisualStep["actionType"],
  dataState: StackVisualState,
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

export function generateStackPeekSteps(
  initialData: number[],
  maxCapacity: number = 8
): VisualStep[] {
  const state = createState(initialData, maxCapacity);
  const top = state.elements[state.elements.length - 1] as StackElement | undefined;
  const steps: VisualStep[] = [
    step(
      1,
      "Start Peek",
      "Prepare to read the top stack element without removing it.",
      "Peek",
      "initialize",
      state,
      {},
      { Top: state.elements.length - 1 },
      1
    ),
    step(
      2,
      "Check Underflow",
      top
        ? "Stack is not empty, so the top value can be read."
        : "Stack is empty, so peek cannot return a value.",
      "Peek",
      top ? "compare" : "error",
      state,
      top ? { active: [top.id] } : { error: [] },
      { isEmpty: !top },
      2
    ),
  ];

  if (!top) return steps;

  steps.push(
    step(
      3,
      "Read Top",
      `Top points to value ${top.value}. The stack is unchanged.`,
      "Peek",
      "access",
      state,
      { active: [top.id], pointer: [top.id] },
      { Top: state.elements.length - 1, Value: top.value },
      3
    ),
    step(
      4,
      "Peek Complete",
      `Returned ${top.value} without popping it from the stack.`,
      "Peek",
      "complete",
      state,
      { found: [top.id] },
      { Value: top.value },
      4
    )
  );
  return steps;
}

export function generateStackIsEmptySteps(
  initialData: number[],
  maxCapacity: number = 8
): VisualStep[] {
  const state = createState(initialData, maxCapacity);
  const isEmpty = state.elements.length === 0;
  return [
    step(
      1,
      "Check Stack Size",
      "Read the current stack size.",
      "isEmpty",
      "initialize",
      state,
      {},
      { Size: state.elements.length },
      1
    ),
    step(
      2,
      "Compare With Zero",
      isEmpty
        ? "Size is 0, so the stack is empty."
        : "Size is greater than 0, so the stack is not empty.",
      "isEmpty",
      isEmpty ? "found" : "not-found",
      state,
      {},
      { isEmpty },
      2
    ),
  ];
}

export function generateStackIsFullSteps(
  initialData: number[],
  maxCapacity: number = 8
): VisualStep[] {
  const state = createState(initialData, maxCapacity);
  const isFull = state.elements.length >= maxCapacity;
  return [
    step(
      1,
      "Read Capacity",
      "Compare the current stack size with the configured capacity.",
      "isFull",
      "initialize",
      state,
      {},
      { Size: state.elements.length, Capacity: maxCapacity },
      1
    ),
    step(
      2,
      "Compare Size and Capacity",
      isFull
        ? "Size has reached capacity, so the stack is full."
        : "There is still room for more elements.",
      "isFull",
      isFull ? "found" : "not-found",
      state,
      isFull ? { error: [] } : {},
      { isFull },
      2
    ),
  ];
}

export function generateStackSizeSteps(
  initialData: number[],
  maxCapacity: number = 8
): VisualStep[] {
  const state = createState(initialData, maxCapacity);
  return [
    step(
      1,
      "Read Top Pointer",
      "The top pointer tells us how many elements are currently stored.",
      "Size",
      "initialize",
      state,
      {},
      { Top: state.elements.length - 1 },
      1
    ),
    step(
      2,
      "Return Size",
      `The stack contains ${state.elements.length} element(s).`,
      "Size",
      "complete",
      state,
      {},
      { Size: state.elements.length },
      2
    ),
  ];
}

const clone = <T>(value: T): T => structuredClone(value);

function visualStep(input: Omit<VisualStep, "id">): VisualStep {
  return { id: uuidv4(), ...input };
}

export function generateArrayStackSteps(data: number[], capacity = 8): VisualStep[] {
  const stack: StackVisualState = {
    elements: data.slice(0, capacity).map((value) => ({ id: uuidv4(), value })),
    maxCapacity: capacity,
  };
  const top = stack.elements.at(-1);
  return [
    visualStep({
      stepNumber: 1,
      title: "Array-backed Stack",
      description:
        "A stack can be implemented with an array and a top index pointing at the latest element.",
      operation: "Implementation",
      actionType: "initialize",
      dataState: clone(stack),
      highlights: { active: top ? [top.id] : [] },
      variables: { topIndex: stack.elements.length - 1, capacity },
      pseudocodeLine: 1,
      codeLine: 1,
    }),
    visualStep({
      stepNumber: 2,
      title: "Push and Pop Use Top",
      description: "Push increments top and writes the value; pop reads and decrements top.",
      operation: "Implementation",
      actionType: "highlight",
      dataState: clone(stack),
      highlights: { pointer: top ? [top.id] : [] },
      variables: { size: stack.elements.length },
      pseudocodeLine: 2,
      codeLine: 2,
    }),
  ];
}
