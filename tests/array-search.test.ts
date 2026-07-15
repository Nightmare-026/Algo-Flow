import {
  generateInterpolationSearchSteps,
  generateJumpSearchSteps,
} from "@/features/algorithms/array/search";

type ArrayState = {
  elements: ReadonlyArray<{ id: string; value: number }>;
};

function foundValue(
  steps: ReturnType<typeof generateJumpSearchSteps>,
) {
  const finalStep = steps.at(-1);
  const foundId = finalStep?.highlights.found?.[0];
  return (finalStep?.dataState as ArrayState | undefined)?.elements.find(
    (element) => element.id === foundId,
  )?.value;
}

describe("array search edge cases", () => {
  it("jump search sorts unsorted input and finds the target", () => {
    const steps = generateJumpSearchSteps([9, 1, 5, 3], 5);
    expect(steps.at(-1)?.actionType).toBe("success");
    expect(foundValue(steps)).toBe(5);
  });

  it("jump search terminates when the target exceeds the maximum", () => {
    const steps = generateJumpSearchSteps([9, 1, 5, 3], 99);
    expect(steps.at(-1)?.actionType).toBe("error");
    expect(steps.length).toBeLessThan(10);
  });

  it("interpolation search handles equal values without dividing by zero", () => {
    const steps = generateInterpolationSearchSteps([7, 7, 7], 7);
    expect(steps.at(-1)?.actionType).toBe("success");
    expect(foundValue(steps)).toBe(7);
    expect(
      steps.some((step) => step.description.includes("NaN")),
    ).toBe(false);
  });

  it("interpolation search sorts unsorted input and finds the target", () => {
    const steps = generateInterpolationSearchSteps([9, 1, 5, 3], 5);
    expect(steps.at(-1)?.actionType).toBe("success");
    expect(foundValue(steps)).toBe(5);
  });
});
