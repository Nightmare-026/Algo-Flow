import { VisualStep } from "@/types";
import { createStringElements, StringVisualState } from "./types";

export function generateNaiveSearchSteps(text: string, pattern: string): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createStringElements(text);
  const patternElements = createStringElements(pattern);
  const baseState: StringVisualState = { elements, patternElements };

  if (pattern.length === 0 || text.length === 0) {
      return [];
  }

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Initialize Naive Search",
    description: `Searching for pattern "${pattern}" in text "${text}".`,
    operation: "Naive Search",
    actionType: "initialize",
    dataState: baseState,
    highlights: {},
    variables: { i: "-", j: "-" },
    pseudocodeLine: 1,
  });

  const n = text.length;
  const m = pattern.length;
  let found = false;

  for (let i = 0; i <= n - m; i++) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Align Pattern",
      description: `Aligning pattern at index ${i}.`,
      operation: "Naive Search",
      actionType: "move-pointer",
      dataState: baseState,
      highlights: {
        pointer: [i.toString()],
      },
      variables: { i, j: 0 },
      pseudocodeLine: 3,
    });

    let j = 0;
    for (j = 0; j < m; j++) {
      const textIdx = i + j;
      const tStr = textIdx.toString();
      const pStr = `p-${j}`;
      
      stepNumber++;
      const match = text[textIdx] === pattern[j];
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: `Compare Characters`,
        description: `Comparing text['${text[textIdx]}'] with pattern['${pattern[j]}'].`,
        operation: "Naive Search",
        actionType: "compare",
        dataState: baseState,
        highlights: {
          compared: [tStr, pStr],
          error: match ? [] : [tStr, pStr],
          success: match ? [tStr, pStr] : [],
          pointer: [textIdx.toString()],
        },
        variables: { i, j, textChar: text[textIdx], patChar: pattern[j] },
        pseudocodeLine: 4,
      });

      if (!match) {
        break;
      }
    }

    if (j === m) {
      found = true;
      stepNumber++;
      
      const foundIndices = Array.from({length: m}, (_, idx) => (i + idx).toString());
      const patIndices = Array.from({length: m}, (_, idx) => `p-${idx}`);

      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: "Pattern Found!",
        description: `Pattern matched completely starting at index ${i}.`,
        operation: "Naive Search",
        actionType: "found",
        dataState: baseState,
        highlights: {
          found: [...foundIndices, ...patIndices],
        },
        variables: { i, j },
        pseudocodeLine: 6,
      });
      break;
    }
  }

  if (!found) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Pattern Not Found",
      description: `The pattern was not found in the text.`,
      operation: "Naive Search",
      actionType: "not-found",
      dataState: baseState,
      highlights: {
        error: elements.map(e => e.originalIndex.toString()),
      },
      variables: { i: "-", j: "-" },
      pseudocodeLine: 8,
    });
  }

  return steps;
}

export function generateKMPSearchSteps(text: string, pattern: string): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createStringElements(text);
  const patternElements = createStringElements(pattern);
  const baseState: StringVisualState = { elements, patternElements };

  if (pattern.length === 0 || text.length === 0) return [];

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Initialize KMP Search",
    description: `KMP precomputes an LPS (Longest Prefix Suffix) array to avoid redundant comparisons.`,
    operation: "KMP Search",
    actionType: "initialize",
    dataState: baseState,
    highlights: {},
    variables: { i: "-", j: "-" },
    pseudocodeLine: 1,
  });

  // LPS Array generation
  const lps = new Array(pattern.length).fill(0);
  let len = 0;
  let i = 1;

  while (i < pattern.length) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "LPS Array Computed",
    description: `LPS Array for "${pattern}": [${lps.join(", ")}].`,
    operation: "KMP Search",
    actionType: "highlight",
    dataState: baseState,
    highlights: {},
    variables: { lps: `[${lps.join(", ")}]` },
    pseudocodeLine: 2,
  });

  let j = 0;
  i = 0;
  let found = false;

  while (i < text.length) {
    const tStr = i.toString();
    const pStr = `p-${j}`;
    
    stepNumber++;
    const match = pattern[j] === text[i];
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Compare Characters",
      description: `Comparing text['${text[i]}'] with pattern['${pattern[j]}'].`,
      operation: "KMP Search",
      actionType: "compare",
      dataState: baseState,
      highlights: {
        compared: [tStr, pStr],
        error: match ? [] : [tStr, pStr],
        pointer: [tStr],
      },
      variables: { i, j },
      pseudocodeLine: 4,
    });

    if (match) {
      i++;
      j++;
    }

    if (j === pattern.length) {
      found = true;
      stepNumber++;
      const foundStart = i - j;
      const foundIndices = Array.from({length: pattern.length}, (_, idx) => (foundStart + idx).toString());
      const patIndices = Array.from({length: pattern.length}, (_, idx) => `p-${idx}`);

      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: "Pattern Found!",
        description: `Pattern matched completely starting at index ${foundStart}.`,
        operation: "KMP Search",
        actionType: "found",
        dataState: baseState,
        highlights: {
          found: [...foundIndices, ...patIndices],
        },
        variables: { i, j, foundAt: foundStart },
        pseudocodeLine: 6,
      });
      break; // For visualization simplicity, stop at first match
    } else if (i < text.length && pattern[j] !== text[i]) {
      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: "Mismatch Detected",
        description: j !== 0 ? `Mismatch. Using LPS array to shift pattern by ${j - lps[j - 1]} positions.` : `Mismatch. Moving to next character in text.`,
        operation: "KMP Search",
        actionType: "move-pointer",
        dataState: baseState,
        highlights: {
          error: [tStr, pStr]
        },
        variables: { i, j, next_j: j !== 0 ? lps[j - 1] : 0 },
        pseudocodeLine: 8,
      });

      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  if (!found) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Pattern Not Found",
      description: `The pattern was not found in the text.`,
      operation: "KMP Search",
      actionType: "not-found",
      dataState: baseState,
      highlights: {
        error: elements.map(e => e.originalIndex.toString()),
      },
      variables: { i: "-", j: "-" },
      pseudocodeLine: 12,
    });
  }

  return steps;
}

export function generateRabinKarpSteps(text: string, pattern: string): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createStringElements(text);
  const patternElements = createStringElements(pattern);
  const baseState: StringVisualState = { elements, patternElements };

  if (pattern.length === 0 || text.length === 0) return [];

  const n = text.length;
  const m = pattern.length;
  const q = 101; // A prime number
  const d = 256;

  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Initialize Rabin-Karp",
    description: `Rabin-Karp uses a rolling hash to quickly filter out invalid match positions.`,
    operation: "Rabin-Karp Search",
    actionType: "initialize",
    dataState: baseState,
    highlights: {},
    variables: { i: "-", pHash: "-", tHash: "-" },
    pseudocodeLine: 1,
  });

  let p = 0; 
  let t = 0; 
  let h = 1;

  for (let i = 0; i < m - 1; i++) {
    h = (h * d) % q;
  }

  for (let i = 0; i < m; i++) {
    p = (d * p + pattern.charCodeAt(i)) % q;
    t = (d * t + text.charCodeAt(i)) % q;
  }

  stepNumber++;
  steps.push({
    id: `step-${stepNumber}`,
    stepNumber,
    title: "Initial Hashes Computed",
    description: `Pattern hash: ${p}, Initial Text Window hash: ${t}.`,
    operation: "Rabin-Karp Search",
    actionType: "highlight",
    dataState: baseState,
    highlights: {
      active: Array.from({length: m}, (_, idx) => idx.toString()),
    },
    variables: { pHash: p, tHash: t },
    pseudocodeLine: 2,
  });

  let found = false;

  for (let i = 0; i <= n - m; i++) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Compare Hashes",
      description: `Comparing Pattern Hash (${p}) with Window Hash (${t}) at index ${i}.`,
      operation: "Rabin-Karp Search",
      actionType: "compare",
      dataState: baseState,
      highlights: {
        pointer: [i.toString()],
        active: Array.from({length: m}, (_, idx) => (i + idx).toString()),
      },
      variables: { i, pHash: p, tHash: t },
      pseudocodeLine: 4,
    });

    if (p === t) {
      let match = true;
      for (let j = 0; j < m; j++) {
        if (text[i + j] !== pattern[j]) {
          match = false;
          break;
        }
      }

      stepNumber++;
      if (match) {
        found = true;
        const foundIndices = Array.from({length: m}, (_, idx) => (i + idx).toString());
        const patIndices = Array.from({length: m}, (_, idx) => `p-${idx}`);
        
        steps.push({
          id: `step-${stepNumber}`,
          stepNumber,
          title: "Hash Match Confirmed!",
          description: `The hashes matched, and a character-by-character check confirmed the pattern.`,
          operation: "Rabin-Karp Search",
          actionType: "found",
          dataState: baseState,
          highlights: {
            found: [...foundIndices, ...patIndices],
          },
          variables: { i, pHash: p, tHash: t },
          pseudocodeLine: 6,
        });
        break;
      } else {
        steps.push({
          id: `step-${stepNumber}`,
          stepNumber,
          title: "Spurious Hit",
          description: `The hashes matched, but a character check failed (hash collision).`,
          operation: "Rabin-Karp Search",
          actionType: "error",
          dataState: baseState,
          highlights: {
            error: Array.from({length: m}, (_, idx) => (i + idx).toString()),
          },
          variables: { i, pHash: p, tHash: t },
          pseudocodeLine: 8,
        });
      }
    }

    if (i < n - m) {
      t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
      if (t < 0) t = t + q;
      
      stepNumber++;
      steps.push({
        id: `step-${stepNumber}`,
        stepNumber,
        title: "Slide Window",
        description: `Updating rolling hash for the next window: new hash is ${t}.`,
        operation: "Rabin-Karp Search",
        actionType: "move-pointer",
        dataState: baseState,
        highlights: {},
        variables: { i: i + 1, pHash: p, tHash: t },
        pseudocodeLine: 10,
      });
    }
  }

  if (!found) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Pattern Not Found",
      description: `The pattern was not found in the text.`,
      operation: "Rabin-Karp Search",
      actionType: "not-found",
      dataState: baseState,
      highlights: {
        error: elements.map(e => e.originalIndex.toString()),
      },
      variables: { i: "-", pHash: "-", tHash: "-" },
      pseudocodeLine: 12,
    });
  }

  return steps;
}
