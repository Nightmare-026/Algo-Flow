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
