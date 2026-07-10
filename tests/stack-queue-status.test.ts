import { describe, expect, it } from "@jest/globals";
import { generateStackIsEmptySteps, generateStackIsFullSteps, generateStackPeekSteps } from "@/features/algorithms/stack/status";
import { generateQueueFrontRearSteps, generateQueuePeekSteps } from "@/features/algorithms/queue/peek";

describe("stack status generators", () => {
  it("peeks without removing the top element", () => {
    const steps = generateStackPeekSteps([1, 2, 3], 5);
    const finalState = steps.at(-1)?.dataState as { elements: { value: number }[] };
    expect(steps.at(-1)?.actionType).toBe("complete");
    expect(finalState.elements.map((item) => item.value)).toEqual([1, 2, 3]);
  });

  it("reports empty and full states", () => {
    expect(generateStackIsEmptySteps([], 4).at(-1)?.actionType).toBe("found");
    expect(generateStackIsFullSteps([1, 2, 3], 3).at(-1)?.actionType).toBe("found");
  });
});

describe("queue peek generators", () => {
  it("peeks at the front without removing it", () => {
    const steps = generateQueuePeekSteps([4, 5], 5);
    const finalState = steps.at(-1)?.dataState as { elements: { value: number }[] };
    expect(steps.at(-1)?.actionType).toBe("complete");
    expect(finalState.elements.map((item) => item.value)).toEqual([4, 5]);
  });

  it("identifies front and rear values", () => {
    const steps = generateQueueFrontRearSteps([4, 5, 6], 5);
    expect(steps.at(-1)?.variables).toMatchObject({ FrontValue: 4, RearValue: 6 });
  });
});

