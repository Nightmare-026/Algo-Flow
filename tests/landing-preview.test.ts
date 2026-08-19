import { generateBubbleSortSteps } from "@/visualizers/array/sort";

describe("Landing Workbench Preview Regression Tests", () => {
  const PREVIEW_INPUT = [12, 5, 9, 3, 16];
  const steps = generateBubbleSortSteps(PREVIEW_INPUT);

  it("generates a complete multi-pass trace rather than stopping after Pass 1", () => {
    expect(steps.length).toBeGreaterThan(15);
    // Find all 'Element Sorted' steps representing each pass completion
    const sortedSteps = steps.filter((s) => s.title === "Element Sorted");
    expect(sortedSteps.length).toBeGreaterThanOrEqual(4); // 4 passes for 5 elements
  });

  it("reaches a final sorted state on completion", () => {
    const finalStep = steps[steps.length - 1];
    expect(finalStep.title).toBe("Sort Complete");
    expect(finalStep.actionType).toBe("success");

    const finalState = finalStep.dataState as { elements: Array<{ value: number }> };
    const values = finalState.elements.map((e) => e.value);
    expect(values).toEqual([3, 5, 9, 12, 16]);
  });

  it("correctly identifies all pass boundaries without freezing or resetting", () => {
    let completedPasses = 0;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step.title === "Element Sorted") {
        completedPasses++;
      }
      expect(step.stepNumber).toBe(i + 1);
      expect(step.title).toBeDefined();
      expect(step.description).toBeDefined();
    }
    expect(completedPasses).toBe(4);
  });

  it("handles alternative reverse-sorted input with full multi-pass execution", () => {
    const reverseInput = [5, 4, 3, 2, 1];
    const reverseSteps = generateBubbleSortSteps(reverseInput);
    const finalStep = reverseSteps[reverseSteps.length - 1];
    expect(finalStep.title).toBe("Sort Complete");

    const finalState = finalStep.dataState as { elements: Array<{ value: number }> };
    expect(finalState.elements.map((e) => e.value)).toEqual([1, 2, 3, 4, 5]);
  });
});
