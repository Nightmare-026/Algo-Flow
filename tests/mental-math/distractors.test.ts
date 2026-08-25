import { generateDistractors } from "@/features/mental-math/core/distractors";

describe("Distractor Engine", () => {
  it("should generate exactly 3 unique plausible distractors and 4 options total", () => {
    const result = generateDistractors(45, 38, "addition", 83);

    expect(result.correctAnswer).toBe(83);
    expect(result.distractors.length).toBe(3);
    expect(result.options.length).toBe(4);

    // All options must be unique
    const uniqueOptions = new Set(result.options);
    expect(uniqueOptions.size).toBe(4);

    // Correct answer must be in options
    expect(result.options).toContain(83);

    // No distractor should be equal to correct answer
    for (const d of result.distractors) {
      expect(d).not.toBe(83);
    }
  });

  it("should generate context-aware distractors for multiplication", () => {
    const result = generateDistractors(7, 8, "multiplication", 56);
    expect(result.options).toContain(56);
    expect(new Set(result.options).size).toBe(4);
  });
});
