import { VisualStep } from "@/types";
import { createStringElements, StringVisualState } from "./types";

export function generatePalindromeCheckSteps(text: string): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createStringElements(text);
  const baseState: StringVisualState = { elements };

  if (text.length === 0) {
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Empty Input",
      description:
        "Palindrome check needs a non-empty string. Provide text to run the visualization.",
      operation: "Palindrome Check",
      actionType: "error",
      dataState: baseState,
      highlights: {},
      variables: { left: "-", right: "-" },
      pseudocodeLine: 1,
    });
    return steps;
  }

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Initialize Palindrome Check",
    description: `Checking if the string "${text}" is a palindrome using two pointers.`,
    operation: "Palindrome Check",
    actionType: "initialize",
    dataState: baseState,
    highlights: {},
    variables: { left: "-", right: "-" },
    pseudocodeLine: 1,
  });

  let left = 0;
  let right = text.length - 1;
  let isPalindrome = true;

  while (left < right) {
    stepNumber++;
    const lStr = left.toString();
    const rStr = right.toString();

    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Compare Characters",
      description: `Comparing character at index ${left} ('${text[left]}') with character at index ${right} ('${text[right]}').`,
      operation: "Palindrome Check",
      actionType: "compare",
      dataState: baseState,
      highlights: {
        compared: [lStr, rStr],
        pointer: [lStr, rStr],
      },
      variables: { left, right, leftChar: text[left], rightChar: text[right] },
      pseudocodeLine: 3,
    });

    if (text[left] !== text[right]) {
      isPalindrome = false;
      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: "Mismatch Found!",
        description: `'${text[left]}' is not equal to '${text[right]}'. Therefore, the string is not a palindrome.`,
        operation: "Palindrome Check",
        actionType: "error",
        dataState: baseState,
        highlights: {
          error: [lStr, rStr],
        },
        variables: { left, right },
        pseudocodeLine: 4,
      });
      break;
    }

    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Match, Move Pointers",
      description: `Characters match. Moving left pointer right, and right pointer left.`,
      operation: "Palindrome Check",
      actionType: "move-pointer",
      dataState: baseState,
      highlights: {
        success: [lStr, rStr],
        pointer: [(left + 1).toString(), (right - 1).toString()],
      },
      variables: { left: left + 1, right: right - 1 },
      pseudocodeLine: 6,
    });

    left++;
    right--;
  }

  stepNumber++;
  if (isPalindrome) {
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "It's a Palindrome!",
      description: `All corresponding characters matched. "${text}" is a valid palindrome.`,
      operation: "Palindrome Check",
      actionType: "success",
      dataState: baseState,
      highlights: {
        found: elements.map((e) => e.id), // Highlight the whole string as success
        sorted: elements.map((e) => e.id),
      },
      variables: { left: "-", right: "-" },
      pseudocodeLine: 8,
    });
  }

  return steps;
}
