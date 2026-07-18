import { generateInsertionSortSteps } from "@/visualizers/array/sort";
import type { ArrayVisualState } from "@/visualizers/array/types";

function valuesAt(step: ReturnType<typeof generateInsertionSortSteps>[number]) {
  return (step.dataState as ArrayVisualState).elements.map(
    (element) => element.value,
  );
}

describe("insertion-sort step generation", () => {
  it.each([
    [[23, 4]],
    [[3, 2, 1]],
    [[2, 2, -1]],
    [[1]],
    [[]],
  ])(
    "sorts %j without losing values or producing invalid references",
    (input: number[]) => {
      const steps = generateInsertionSortSteps(input);
      const finalValues = valuesAt(steps.at(-1)!);

      expect(finalValues).toEqual([...input].sort((a, b) => a - b));
      expect(finalValues).toHaveLength(input.length);
      expect(steps.map((step) => step.stepNumber)).toEqual(
        steps.map((_, index) => index + 1),
      );

      for (const step of steps) {
        const state = step.dataState as ArrayVisualState;
        const elementIds = new Set(state.elements.map((element) => element.id));
        const highlightedIds = Object.values(step.highlights).flatMap(
          (ids) => ids ?? [],
        );

        expect(step.description).not.toContain("undefined");
        expect(highlightedIds.every((id) => elementIds.has(id))).toBe(true);
      }
    },
  );

  it("describes the compared values captured before a swap", () => {
    const swapStep = generateInsertionSortSteps([23, 4]).find(
      (step) => step.title === "Swap Elements",
    );

    expect(swapStep?.description).toBe(
      "4 < 23. Swapping them to shift 23 right.",
    );
  });
});
