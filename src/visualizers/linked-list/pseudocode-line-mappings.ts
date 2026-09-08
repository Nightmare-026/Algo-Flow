import type { VisualStep } from "@/types";

type LineMap = Readonly<Record<string, number>>;

const mappings: Readonly<Record<string, LineMap>> = {
  "sll-search": { 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 6 },
  "sll-delete": {
    2: 1,
    3: 2,
    4: 3,
    5: 3,
    6: 6,
    7: 4,
    8: 4,
    9: 5,
    10: 5,
    11: 4,
    12: 6,
    13: 6,
  },
  "sll-insert-position": { 1: 1, 2: 5, 4: 1, 5: 4, 7: 7, 8: 7 },
  "sll-delete-head": { 1: 1, 2: 1, 4: 2, 5: 2 },
};

export function coordinateLinkedListSteps(slug: string, steps: VisualStep[]) {
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
