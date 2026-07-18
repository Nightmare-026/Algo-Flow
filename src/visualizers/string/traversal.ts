import { VisualStep } from "@/types";
import { createStringElements, StringVisualState } from "./types";

export function generateStringForwardTraversalSteps(text: string): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createStringElements(text);
  const baseState: StringVisualState = { elements };

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Initialize Traversal",
    description: `Starting forward traversal on string of length ${text.length}.`,
    operation: "Forward Traversal",
    actionType: "initialize",
    dataState: baseState,
    highlights: {},
    variables: { i: "-" },
    pseudocodeLine: 1,
  });

  const visited: string[] = [];

  for (let i = 0; i < text.length; i++) {
    stepNumber++;
    const idStr = i.toString();

    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: `Visit Character '${text[i]}'`,
      description: `Accessing character at index ${i}.`,
      operation: "Forward Traversal",
      actionType: "visit",
      dataState: baseState,
      highlights: {
        active: [idStr],
        visited: [...visited],
        pointer: [idStr],
      },
      variables: { i, char: text[i] },
      pseudocodeLine: 3,
    });

    visited.push(idStr);
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Traversal Complete",
    description: "All characters have been visited.",
    operation: "Forward Traversal",
    actionType: "complete",
    dataState: baseState,
    highlights: {
      visited: [...visited],
    },
    variables: { i: "-" },
    pseudocodeLine: 4,
  });

  return steps;
}

export function generateStringReverseTraversalSteps(text: string): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createStringElements(text);
  const baseState: StringVisualState = { elements };

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Initialize Reverse Traversal",
    description: `Starting reverse traversal on string of length ${text.length}.`,
    operation: "Reverse Traversal",
    actionType: "initialize",
    dataState: baseState,
    highlights: {},
    variables: { i: "-" },
    pseudocodeLine: 1,
  });

  const visited: string[] = [];

  for (let i = text.length - 1; i >= 0; i--) {
    stepNumber++;
    const idStr = i.toString();

    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: `Visit Character '${text[i]}'`,
      description: `Accessing character at index ${i}.`,
      operation: "Reverse Traversal",
      actionType: "visit",
      dataState: baseState,
      highlights: {
        active: [idStr],
        visited: [...visited],
        pointer: [idStr],
      },
      variables: { i, char: text[i] },
      pseudocodeLine: 3,
    });

    visited.push(idStr);
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Traversal Complete",
    description: "All characters have been visited in reverse order.",
    operation: "Reverse Traversal",
    actionType: "complete",
    dataState: baseState,
    highlights: {
      visited: [...visited],
    },
    variables: { i: "-" },
    pseudocodeLine: 4,
  });

  return steps;
}
