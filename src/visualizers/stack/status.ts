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
  const isUnderflow = !top;

  const steps: VisualStep[] = [
    step(
      1,
      "Start Peek",
      "Prepare to read the top stack element without removing it.",
      "Peek",
      "initialize",
      state,
      {},
      { Top: state.elements.length - 1, Size: state.elements.length },
      1
    ),
    step(
      2,
      "Check Underflow",
      isUnderflow
        ? "Stack is empty (top = -1). Underflow condition detected."
        : `Stack is not empty (top = ${state.elements.length - 1}). The top element can be inspected.`,
      "Peek",
      isUnderflow ? "error" : "compare",
      state,
      isUnderflow ? { error: [] } : { active: [top.id] },
      { Top: state.elements.length - 1, isEmpty: isUnderflow },
      2
    ),
  ];

  if (isUnderflow) {
    return steps;
  }

  steps.push(
    step(
      3,
      "Read Top Element",
      `Top pointer is at index ${state.elements.length - 1}, holding value ${top.value}.`,
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
      `Returned value ${top.value}. The stack remains unchanged.`,
      "Peek",
      "complete",
      state,
      { found: [top.id], pointer: [top.id] },
      { Value: top.value, Top: state.elements.length - 1 },
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
  const top = state.elements.at(-1);

  return [
    step(
      1,
      "Inspect Stack Top",
      "Read the top index and current element count to check emptiness.",
      "isEmpty",
      "initialize",
      state,
      {},
      { Top: state.elements.length - 1, Size: state.elements.length },
      1
    ),
    step(
      2,
      isEmpty ? "Stack Is Empty (true)" : "Stack Is Not Empty (false)",
      isEmpty
        ? "Top index is -1 (size is 0). The stack is empty."
        : `Top index is ${state.elements.length - 1} (size is ${state.elements.length}). The stack is not empty.`,
      "isEmpty",
      isEmpty ? "found" : "not-found",
      state,
      isEmpty ? {} : (top ? { active: [top.id], pointer: [top.id] } : {}),
      { Top: state.elements.length - 1, isEmpty, Size: state.elements.length },
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
  const top = state.elements.at(-1);

  return [
    step(
      1,
      "Inspect Size & Capacity",
      `Compare current stack size (${state.elements.length}) with maximum capacity (${maxCapacity}).`,
      "isFull",
      "initialize",
      state,
      {},
      { Size: state.elements.length, Capacity: maxCapacity },
      1
    ),
    step(
      2,
      isFull ? "Stack Is Full (true)" : "Stack Is Not Full (false)",
      isFull
        ? `Stack has reached maximum capacity (${maxCapacity}/${maxCapacity}). No more elements can be pushed.`
        : `Stack has space available (${state.elements.length}/${maxCapacity}). Space for ${maxCapacity - state.elements.length} more element(s).`,
      "isFull",
      isFull ? "error" : "not-found",
      state,
      isFull ? { error: state.elements.map((e) => e.id) } : (top ? { active: [top.id] } : {}),
      { Size: state.elements.length, Capacity: maxCapacity, isFull },
      2
    ),
  ];
}

export function generateStackSizeSteps(
  initialData: number[],
  maxCapacity: number = 8
): VisualStep[] {
  const state = createState(initialData, maxCapacity);
  const top = state.elements.at(-1);

  return [
    step(
      1,
      "Inspect Top Pointer",
      `Top pointer is at index ${state.elements.length - 1}. In a 0-indexed stack, size is top + 1.`,
      "Size",
      "initialize",
      state,
      {},
      { Top: state.elements.length - 1 },
      1
    ),
    step(
      2,
      "Return Stack Size",
      `The stack currently contains ${state.elements.length} element(s).`,
      "Size",
      "complete",
      state,
      top ? { found: [top.id], pointer: [top.id] } : {},
      { Size: state.elements.length, Top: state.elements.length - 1 },
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
      title: "ArrayStack Structure",
      description:
        "An array-based stack uses a contiguous array with fixed capacity and a top index pointing to the latest element.",
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
      title: "Top Index Tracking",
      description: top
        ? `Top index is at position ${stack.elements.length - 1}, referencing top element ${top.value}.`
        : "Top index is initialized to -1, indicating an empty stack.",
      operation: "Implementation",
      actionType: "highlight",
      dataState: clone(stack),
      highlights: { pointer: top ? [top.id] : [], active: top ? [top.id] : [] },
      variables: { topIndex: stack.elements.length - 1, size: stack.elements.length, capacity },
      pseudocodeLine: 2,
      codeLine: 2,
    }),
    visualStep({
      stepNumber: 3,
      title: "Push Mechanism (LIFO)",
      description:
        "Push verifies space available (top < capacity - 1), pre-increments top (++top), and writes value to arr[top].",
      operation: "Implementation",
      actionType: "push",
      dataState: clone(stack),
      highlights: { inserted: top ? [top.id] : [] },
      variables: { topIndex: stack.elements.length - 1, capacity },
      pseudocodeLine: 3,
      codeLine: 3,
    }),
    visualStep({
      stepNumber: 4,
      title: "Pop Mechanism (LIFO)",
      description:
        "Pop verifies stack has elements (top >= 0), returns arr[top], and post-decrements top (top--).",
      operation: "Implementation",
      actionType: "complete",
      dataState: clone(stack),
      highlights: { active: top ? [top.id] : [] },
      variables: { topIndex: stack.elements.length - 1, size: stack.elements.length },
      pseudocodeLine: 4,
      codeLine: 4,
    }),
  ];
}
