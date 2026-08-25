import { MathOperation } from "./types";

export interface DistractorOptionsResult {
  correctAnswer: number;
  distractors: number[]; // 3 unique wrong answers
  options: number[]; // 4 randomized options
}

/**
 * Generates plausible distractors using cognitive error models.
 */
export function generateDistractors(
  a: number,
  b: number,
  operation: MathOperation,
  correctAnswer: number,
  randomFn: () => number = Math.random
): DistractorOptionsResult {
  const distractorCandidates = new Set<number>();

  const addCandidate = (val: number) => {
    const rounded = Math.round(val);
    if (rounded !== correctAnswer && Number.isFinite(rounded) && rounded >= 0) {
      distractorCandidates.add(rounded);
    }
  };

  // 1. Off-by-1, Off-by-2, Off-by-10 (arithmetic neighbors)
  addCandidate(correctAnswer + 1);
  addCandidate(correctAnswer - 1);
  addCandidate(correctAnswer + 2);
  addCandidate(correctAnswer - 2);
  addCandidate(correctAnswer + 10);
  addCandidate(correctAnswer - 10);

  // 2. Operator Confusion
  if (operation === "multiplication" && a < 15 && b < 15) {
    addCandidate(a + b);
  } else if (operation === "addition" && a < 10 && b < 10) {
    addCandidate(a * b);
  } else if (operation === "subtraction" && a < 20 && b < 20) {
    addCandidate(a + b);
  }

  // 3. Digit Swap / Transposition
  if (Math.abs(correctAnswer) >= 10) {
    const str = Math.abs(correctAnswer).toString();
    if (str.length === 2) {
      const swapped = parseInt(str[1] + str[0], 10);
      addCandidate(swapped);
    } else if (str.length === 3) {
      addCandidate(parseInt(str[0] + str[2] + str[1], 10));
      addCandidate(parseInt(str[1] + str[0] + str[2], 10));
    }
  }

  // 4. Carry / Borrow Specific Distractors
  if (operation === "addition") {
    // Missing carry or double carry
    addCandidate(correctAnswer - 10);
    addCandidate(correctAnswer + 10);
    addCandidate(correctAnswer - 9);
    addCandidate(correctAnswer + 11);
  } else if (operation === "subtraction") {
    // Missing borrow or extra borrow
    addCandidate(correctAnswer + 10);
    addCandidate(correctAnswer - 10);
    addCandidate(correctAnswer + 8);
  } else if (operation === "division") {
    addCandidate(correctAnswer + 1);
    addCandidate(correctAnswer - 1);
    if (correctAnswer > 2) {
      addCandidate(correctAnswer + 2);
      addCandidate(correctAnswer - 2);
    }
  } else if (operation === "squares") {
    addCandidate(a * 2);
    addCandidate(a * 10);
    addCandidate((a - 1) * (a - 1));
    addCandidate((a + 1) * (a + 1));
  } else if (operation === "roots") {
    addCandidate(Math.round(a / 2));
    addCandidate(correctAnswer + 1);
    addCandidate(correctAnswer - 1);
    addCandidate(correctAnswer + 2);
  } else if (operation === "percentages") {
    addCandidate(Math.round((a * b) / 10));
    addCandidate(correctAnswer + 5);
    addCandidate(correctAnswer - 5);
    addCandidate(correctAnswer * 2);
  }

  // 5. Fallback generators if candidate set is still small
  let delta = 3;
  while (distractorCandidates.size < 6) {
    addCandidate(correctAnswer + delta);
    addCandidate(correctAnswer - delta);
    delta += 2;
  }

  // Select 3 unique distractors randomly
  const candidateArray = Array.from(distractorCandidates);
  // Shuffle candidates
  for (let i = candidateArray.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [candidateArray[i], candidateArray[j]] = [candidateArray[j], candidateArray[i]];
  }

  const selectedDistractors = candidateArray.slice(0, 3);

  // Combine with correct answer and shuffle options
  const allOptions = [correctAnswer, ...selectedDistractors];
  for (let i = allOptions.length - 1; i > 0; i--) {
    const j = Math.floor(randomFn() * (i + 1));
    [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
  }

  return {
    correctAnswer,
    distractors: selectedDistractors,
    options: allOptions,
  };
}
