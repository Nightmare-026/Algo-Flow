import { VisualStep } from "@/types";
import { createStringElements, StringVisualState } from "./types";

export function generateNaiveSearchSteps(text: string, pattern: string): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createStringElements(text);
  const patternElements = createStringElements(pattern);
  const baseState: StringVisualState = { elements, patternElements };

  if (pattern.length === 0 || text.length === 0) {
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Empty Input",
      description:
        "Naive search needs a non-empty text and pattern. Provide both to run the visualization.",
      operation: "Naive Search",
      actionType: "error",
      dataState: baseState,
      highlights: {},
      variables: { i: "-", j: "-" },
      pseudocodeLine: 1,
    });
    return steps;
  }

  if (pattern.length > text.length) {
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
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Pattern Longer Than Text",
      description: `Pattern length ${pattern.length} exceeds text length ${text.length}, so no match is possible.`,
      operation: "Naive Search",
      actionType: "not-found",
      dataState: baseState,
      highlights: {},
      variables: { i: "-", j: "-" },
      pseudocodeLine: 5,
    });
    return steps;
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

      const foundIndices = Array.from({ length: m }, (_, idx) => (i + idx).toString());
      const patIndices = Array.from({ length: m }, (_, idx) => `p-${idx}`);

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
        error: elements.map((e) => e.originalIndex.toString()),
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
  const lps = new Array(pattern.length).fill(0);
  const matches: number[] = [];

  const state = (phase: StringVisualState["phase"]): StringVisualState => ({
    elements,
    patternElements,
    lps: [...lps],
    phase,
    matches: [...matches],
  });

  const pushStep = (
    input: Omit<VisualStep, "id" | "stepNumber" | "operation" | "dataState"> & {
      dataState?: StringVisualState;
    }
  ) => {
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber: stepNumber++,
      operation: "KMP Search",
      dataState: input.dataState ?? state("preprocessing"),
      ...input,
    });
  };

  pushStep({
    title: "Initialize KMP Search",
    description:
      "Build the LPS table one character at a time, then use it to search without repeating known comparisons.",
    actionType: "initialize",
    highlights: {},
    variables: { i: pattern.length > 1 ? 1 : 0, len: 0, lps: `[${lps.join(", ")}]` },
    pseudocodeLine: 1,
  });

  if (pattern.length === 0) {
    matches.push(0);
    pushStep({
      title: "Empty Pattern Matches at Start",
      description: "By convention, an empty pattern matches at index 0.",
      actionType: "complete",
      dataState: state("complete"),
      highlights: {},
      variables: { matches: "0", lps: "[]" },
      output: [...matches],
      pseudocodeLine: 19,
    });
    return steps;
  }

  pushStep({
    title: "Initialize LPS Table",
    description: "Set lps[0] = 0, i = 1, and len = 0.",
    actionType: "build",
    highlights: { active: ["p-0"] },
    variables: { i: pattern.length > 1 ? 1 : 0, len: 0, lps: `[${lps.join(", ")}]` },
    pseudocodeLine: 2,
  });

  let len = 0;
  let i = 1;

  while (i < pattern.length) {
    const match = pattern[i] === pattern[len];
    pushStep({
      title: "Compare Pattern Characters",
      description: `Compare pattern[${i}] '${pattern[i]}' with pattern[${len}] '${pattern[len]}'.`,
      actionType: "compare",
      highlights: {
        compared: [`p-${i}`, `p-${len}`],
        success: match ? [`p-${i}`, `p-${len}`] : [],
        error: match ? [] : [`p-${i}`, `p-${len}`],
      },
      variables: { i, len, left: pattern[i], right: pattern[len], lps: `[${lps.join(", ")}]` },
      predicate: {
        operator: "===",
        left: pattern[i],
        right: pattern[len],
        result: match,
      },
      pseudocodeLine: 5,
    });

    if (match) {
      len++;
      lps[i] = len;
      pushStep({
        title: "Extend Prefix-Suffix Match",
        description: `Characters match, so set lps[${i}] = ${len} and advance i.`,
        actionType: "update",
        dataState: state("preprocessing"),
        highlights: { success: [`p-${i}`], active: [`lps-${i}`] },
        variables: { i, len, assigned: len, lps: `[${lps.join(", ")}]` },
        pseudocodeLine: 6,
      });
      i++;
    } else if (len > 0) {
      const previousLen = len;
      len = lps[len - 1];
      pushStep({
        title: "Fallback Within LPS",
        description: `Mismatch with len ${previousLen}; set len = lps[${previousLen - 1}] = ${len} without advancing i.`,
        actionType: "move-pointer",
        dataState: state("preprocessing"),
        highlights: { active: [`p-${i}`, `p-${len}`] },
        variables: { i, previousLen, len, lps: `[${lps.join(", ")}]` },
        pseudocodeLine: 7,
      });
    } else {
      lps[i] = 0;
      pushStep({
        title: "Record Zero LPS",
        description: `No proper prefix matches at index ${i}; keep lps[${i}] = 0 and advance i.`,
        actionType: "update",
        dataState: state("preprocessing"),
        highlights: { active: [`lps-${i}`] },
        variables: { i, len, assigned: 0, lps: `[${lps.join(", ")}]` },
        pseudocodeLine: 8,
      });
      i++;
    }
  }

  pushStep({
    title: "LPS Preprocessing Complete",
    description: `LPS table for "${pattern}" is [${lps.join(", ")}].`,
    actionType: "success",
    dataState: state("search"),
    highlights: { success: patternElements.map((_, index) => `p-${index}`) },
    variables: { lps: `[${lps.join(", ")}]` },
    output: [...lps],
    pseudocodeLine: 9,
  });

  if (text.length === 0 || pattern.length > text.length) {
    pushStep({
      title: "Pattern Not Found",
      description:
        text.length === 0
          ? "A non-empty pattern cannot match an empty text."
          : "The pattern is longer than the text, so no match is possible.",
      actionType: "complete",
      dataState: state("complete"),
      highlights: { error: elements.map((_, index) => index.toString()) },
      variables: { matches: "none", lps: `[${lps.join(", ")}]` },
      output: [],
      pseudocodeLine: 19,
    });
    return steps;
  }

  i = 0;
  let j = 0;
  pushStep({
    title: "Initialize Text Search",
    description: "Set text pointer i = 0 and pattern pointer j = 0.",
    actionType: "initialize",
    dataState: state("search"),
    highlights: { pointer: ["0", "p-0"] },
    variables: { i, j, lps: `[${lps.join(", ")}]` },
    pseudocodeLine: 10,
  });

  while (i < text.length) {
    const match = text[i] === pattern[j];
    pushStep({
      title: "Compare Text and Pattern",
      description: `Compare text[${i}] '${text[i]}' with pattern[${j}] '${pattern[j]}'.`,
      actionType: "compare",
      dataState: state("search"),
      highlights: {
        compared: [i.toString(), `p-${j}`],
        success: match ? [i.toString(), `p-${j}`] : [],
        error: match ? [] : [i.toString(), `p-${j}`],
        pointer: [i.toString(), `p-${j}`],
      },
      variables: { i, j, textChar: text[i], patternChar: pattern[j] },
      predicate: {
        operator: "===",
        left: text[i],
        right: pattern[j],
        result: match,
      },
      pseudocodeLine: 12,
    });

    if (match) {
      i++;
      j++;
      pushStep({
        title: "Advance Both Pointers",
        description: `Characters match; advance to i = ${i}, j = ${j}.`,
        actionType: "move-pointer",
        dataState: state("search"),
        highlights: { success: [(i - 1).toString(), `p-${j - 1}`], pointer: [(i - 1).toString()] },
        variables: { i, j },
        pseudocodeLine: 13,
      });

      if (j === pattern.length) {
        const foundAt = i - j;
        matches.push(foundAt);
        pushStep({
          title: "Pattern Match Found",
          description: `Pattern matches at index ${foundAt}. Record it and continue to detect overlaps.`,
          actionType: "found",
          dataState: state("search"),
          highlights: {
            found: [
              ...Array.from({ length: pattern.length }, (_, index) => (foundAt + index).toString()),
              ...patternElements.map((_, index) => `p-${index}`),
            ],
          },
          variables: { i, j, foundAt, matches: matches.join(", ") },
          output: [...matches],
          pseudocodeLine: 14,
        });

        const previousJ = j;
        j = lps[j - 1];
        pushStep({
          title: "Fallback After Match",
          description: `Set j = lps[${previousJ - 1}] = ${j} so overlapping matches remain possible.`,
          actionType: "move-pointer",
          dataState: state("search"),
          highlights: {
            pointer: [Math.min(i, text.length - 1).toString()],
            active: j < pattern.length ? [`p-${j}`] : [],
          },
          variables: { i, previousJ, j },
          pseudocodeLine: 15,
        });
      }
      continue;
    }

    if (j > 0) {
      const previousJ = j;
      j = lps[j - 1];
      pushStep({
        title: "Fallback After Mismatch",
        description: `Mismatch with j = ${previousJ}; set j = lps[${previousJ - 1}] = ${j} without advancing i.`,
        actionType: "move-pointer",
        dataState: state("search"),
        highlights: { active: [i.toString(), `p-${j}`] },
        variables: { i, previousJ, j },
        pseudocodeLine: 17,
      });
    } else {
      i++;
      pushStep({
        title: "Advance Text Pointer",
        description: `Mismatch at j = 0; advance text pointer to i = ${i}.`,
        actionType: "move-pointer",
        dataState: state("search"),
        highlights: { pointer: [Math.min(i, text.length - 1).toString()] },
        variables: { i, j },
        pseudocodeLine: 18,
      });
    }
  }

  pushStep({
    title: matches.length > 0 ? "KMP Search Complete" : "Pattern Not Found",
    description:
      matches.length > 0
        ? `KMP found ${matches.length} match${matches.length === 1 ? "" : "es"} at ${matches.join(
            ", "
          )}.`
        : "The pattern was not found in the text.",
    actionType: "complete",
    dataState: state("complete"),
    highlights:
      matches.length > 0
        ? {
            success: matches.flatMap((start) =>
              Array.from({ length: pattern.length }, (_, index) => (start + index).toString())
            ),
          }
        : { error: elements.map((_, index) => index.toString()) },
    variables: { matches: matches.join(", ") || "none", lps: `[${lps.join(", ")}]` },
    output: [...matches],
    pseudocodeLine: 19,
  });

  return steps;
}
export function generateRabinKarpSteps(text: string, pattern: string): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const elements = createStringElements(text);
  const patternElements = createStringElements(pattern);
  const baseState: StringVisualState = { elements, patternElements };

  if (pattern.length === 0 || text.length === 0) {
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Empty Input",
      description:
        "Rabin-Karp needs a non-empty text and pattern. Provide both to run the visualization.",
      operation: "Rabin-Karp Search",
      actionType: "error",
      dataState: baseState,
      highlights: {},
      variables: { i: "-", pHash: "-", tHash: "-" },
      pseudocodeLine: 1,
    });
    return steps;
  }

  if (pattern.length > text.length) {
    stepNumber++;
    steps.push({
      id: `step-${stepNumber}`,
      stepNumber,
      title: "Pattern Longer Than Text",
      description: `Pattern length ${pattern.length} exceeds text length ${text.length}, so no match is possible.`,
      operation: "Rabin-Karp Search",
      actionType: "not-found",
      dataState: baseState,
      highlights: {},
      variables: { i: "-", pHash: "-", tHash: "-" },
      pseudocodeLine: 5,
    });
    return steps;
  }

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
      active: Array.from({ length: m }, (_, idx) => idx.toString()),
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
        active: Array.from({ length: m }, (_, idx) => (i + idx).toString()),
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
        const foundIndices = Array.from({ length: m }, (_, idx) => (i + idx).toString());
        const patIndices = Array.from({ length: m }, (_, idx) => `p-${idx}`);

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
            error: Array.from({ length: m }, (_, idx) => (i + idx).toString()),
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
        highlights: {
          pointer: [(i + 1).toString()],
          active: Array.from({ length: m }, (_, index) => (i + 1 + index).toString()),
        },
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
        error: elements.map((e) => e.originalIndex.toString()),
      },
      variables: { i: "-", pHash: "-", tHash: "-" },
      pseudocodeLine: 12,
    });
  }

  return steps;
}
