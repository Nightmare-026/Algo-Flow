import type { VisualStep } from "@/types";

type LineMap = Readonly<Record<string, number>>;

const mappings: Readonly<Record<string, LineMap>> = {
  "spiral-traversal": { 1: 1, 3: 4, 4: 5 },
  "row-column-sorted-search": {
    1: 1,
    3: 4,
    "4:Target Found": 4,
    "4:Move Left": 5,
    "4:Move Down": 6,
    6: 7,
  },
  "transpose-matrix": { 1: 1, 4: 4 },
  "rotate-matrix-90": {
    1: 1,
    "3:Transpose": 2,
    "4:Swapped": 4,
    "3:Reverse Row": 3,
    6: 4,
  },
  "matrix-multiplication": { 1: 1, 4: 4, 6: 4 },
  "matrix-addition": { 1: 1, 4: 4, 6: 4 },
  "matrix-subtraction": { 1: 1, 4: 4, 6: 4 },
};

export function coordinateMatrixSteps(slug: string, steps: VisualStep[]) {
  const mapping = mappings[slug];
  if (!mapping) return steps;
  return steps.map((step) => {
    if (step.codeLine == null) return step;
    const line =
      mapping[`${step.codeLine}:${step.title}`] ??
      mapping[`${step.codeLine}:${step.actionType}`] ??
      mapping[String(step.codeLine)];
    return line ? { ...step, pseudocodeLine: line } : step;
  });
}
