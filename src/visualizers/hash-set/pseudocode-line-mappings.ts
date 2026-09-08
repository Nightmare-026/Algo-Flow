import type { VisualStep } from "@/types";

type LineMap = Readonly<Record<string, number>>;

const mappings: Readonly<Record<string, LineMap>> = {
  "hash-set-insert": { 1: 1, 2: 1, 4: 2, 5: 4, 7: 3, 8: 3, 10: 5 },
  "hash-set-search": { 1: 1, 2: 2, 4: 3, 5: 4, 7: 3, 10: 5 },
  "hash-set-delete": { 1: 1, 2: 2, 4: 3, 5: 5, 7: 3, 10: 7 },
  "set-union": { 1: 1, 3: 3 },
  "set-intersection": { 1: 1, 3: 3 },
};

export function coordinateHashSetSteps(slug: string, steps: VisualStep[]) {
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
