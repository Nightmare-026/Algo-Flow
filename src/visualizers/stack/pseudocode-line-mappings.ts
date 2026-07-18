import type { VisualStep } from "@/types";

const popLines: Readonly<Record<string, number>> = {
  2: 1,
  3: 2,
  4: 2,
  5: 3,
  6: 4,
  7: 5,
};

export function coordinateStackSteps(slug: string, steps: VisualStep[]) {
  if (slug !== "stack-pop") return steps;
  return steps.map((step) => {
    if (!step.codeLine) return step;
    const line = popLines[String(step.codeLine)];
    return line ? { ...step, pseudocodeLine: line } : step;
  });
}
