import { VisualStep } from "@/types";
import { createStringElements } from "./types";

export function generateReverseStringSteps(text: string): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createStringElements(text);
  

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Initialize String Reverse",
    description: `Reversing the string "${text}" using two pointers.`,
    operation: "Reverse String",
    actionType: "initialize",
    dataState: { elements: [...elements] },
    highlights: {},
    variables: { left: "-", right: "-" },
    pseudocodeLine: 1,
  });

  let left = 0;
  let right = elements.length - 1;

  while (left < right) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Compare Pointers",
      description: `Pointers are at index ${left} ('${elements[left].char}') and index ${right} ('${elements[right].char}').`,
      operation: "Reverse String",
      actionType: "compare",
      dataState: { elements: [...elements] },
      highlights: {
        active: [left.toString(), right.toString()],
        pointer: [left.toString(), right.toString()],
      },
      variables: { left, right },
      pseudocodeLine: 3,
    });

    const temp = elements[left];
    elements[left] = elements[right];
    elements[right] = temp;

    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Swap Characters",
      description: `Swapped characters at index ${left} and index ${right}.`,
      operation: "Reverse String",
      actionType: "swap",
      dataState: { elements: [...elements] },
      highlights: {
        swapped: [left.toString(), right.toString()],
      },
      variables: { left, right },
      pseudocodeLine: 4,
    });

    left++;
    right--;
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Reverse Complete",
    description: `The string has been successfully reversed to "${elements.map(e => e.char).join('')}".`,
    operation: "Reverse String",
    actionType: "complete",
    dataState: { elements: [...elements] },
    highlights: {},
    variables: { left, right },
  });

  return steps;
}

export function generateStringInsertSteps(text: string, indexStr?: string, char?: string): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createStringElements(text);
  const insertIndex = parseInt(indexStr || "0", 10);
  const insertChar = char || "X";

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Start Insert",
    description: `Inserting character '${insertChar}' at index ${insertIndex}.`,
    operation: "Insert",
    actionType: "initialize",
    dataState: { elements: [...elements] },
    highlights: {},
    variables: { i: insertIndex, char: insertChar },
  });

  if (insertIndex < 0 || insertIndex > elements.length) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Error",
      description: `Index out of bounds.`,
      operation: "Insert",
      actionType: "error",
      dataState: { elements: [...elements] },
      highlights: { error: [] },
      variables: {},
    });
    return steps;
  }

  // Visualization of shifting isn't perfectly represented without complex array shifting steps,
  // but we can simulate the result.
  const newElements = [
    ...elements.slice(0, insertIndex),
    { id: `new-${Date.now()}`, char: insertChar },
    ...elements.slice(insertIndex)
  ];

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Inserted",
    description: `Shifted elements to the right and inserted '${insertChar}'.`,
    operation: "Insert",
    actionType: "success",
    dataState: { elements: newElements },
    highlights: { active: [insertIndex.toString()] },
    variables: { i: insertIndex },
  });

  return steps;
}

export function generateStringDeleteSteps(text: string, indexStr?: string): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createStringElements(text);
  const deleteIndex = parseInt(indexStr || "0", 10);

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Start Delete",
    description: `Deleting character at index ${deleteIndex}.`,
    operation: "Delete",
    actionType: "initialize",
    dataState: { elements: [...elements] },
    highlights: {},
    variables: { i: deleteIndex },
  });

  if (deleteIndex < 0 || deleteIndex >= elements.length) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Error",
      description: `Index out of bounds.`,
      operation: "Delete",
      actionType: "error",
      dataState: { elements: [...elements] },
      highlights: { error: [] },
      variables: {},
    });
    return steps;
  }

  const newElements = [
    ...elements.slice(0, deleteIndex),
    ...elements.slice(deleteIndex + 1)
  ];

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Deleted",
    description: `Removed character and shifted remaining elements left.`,
    operation: "Delete",
    actionType: "success",
    dataState: { elements: newElements },
    highlights: {},
    variables: { i: deleteIndex },
  });

  return steps;
}

export function generateStringReplaceSteps(text: string, indexStr?: string, char?: string): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createStringElements(text);
  const replaceIndex = parseInt(indexStr || "0", 10);
  const replaceChar = char || "Y";

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Start Replace",
    description: `Replacing character at index ${replaceIndex} with '${replaceChar}'.`,
    operation: "Replace",
    actionType: "initialize",
    dataState: { elements: [...elements] },
    highlights: {},
    variables: { i: replaceIndex, char: replaceChar },
  });

  if (replaceIndex < 0 || replaceIndex >= elements.length) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Error",
      description: `Index out of bounds.`,
      operation: "Replace",
      actionType: "error",
      dataState: { elements: [...elements] },
      highlights: { error: [] },
      variables: {},
    });
    return steps;
  }

  const newElements = [...elements];
  newElements[replaceIndex] = { ...newElements[replaceIndex], char: replaceChar };

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Replaced",
    description: `Character at index ${replaceIndex} replaced.`,
    operation: "Replace",
    actionType: "success",
    dataState: { elements: newElements },
    highlights: { active: [replaceIndex.toString()] },
    variables: { i: replaceIndex },
  });

  return steps;
}

export function generateStringChangeCaseSteps(text: string): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createStringElements(text);

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Start Change Case",
    description: `Inverting the case of all characters.`,
    operation: "Change Case",
    actionType: "initialize",
    dataState: { elements: [...elements] },
    highlights: {},
    variables: { i: "-" },
  });

  const newElements = [...elements];

  for (let i = 0; i < newElements.length; i++) {
    const char = newElements[i].char;
    const isUpper = char === char.toUpperCase();
    newElements[i] = { ...newElements[i], char: isUpper ? char.toLowerCase() : char.toUpperCase() };

    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Invert Case",
      description: `Inverted '${char}' to '${newElements[i].char}'.`,
      operation: "Change Case",
      actionType: "update",
      dataState: { elements: structuredClone(newElements) },
      highlights: { active: [i.toString()] },
      variables: { i },
    });
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Complete",
    description: `All characters inverted.`,
    operation: "Change Case",
    actionType: "success",
    dataState: { elements: newElements },
    highlights: {},
    variables: { i: "-" },
  });

  return steps;
}
