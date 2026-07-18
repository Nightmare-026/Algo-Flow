import {
  getVisualElementClassName,
  getVisualElementMotion,
  getVisualElementState,
} from "@/components/visualizer/visual-state";

describe("visual element states", () => {
  it("uses a stable semantic priority when an element appears in multiple buckets", () => {
    expect(
      getVisualElementState(
        {
          error: ["node"],
          deleted: ["node"],
          found: ["node"],
          current: ["node"],
        },
        "node"
      )
    ).toBe("error");
    expect(getVisualElementState({ deleted: ["node"], found: ["node"] }, "node")).toBe("deleted");
    expect(getVisualElementState({ swapped: ["node"], compared: ["node"] }, "node")).toBe(
      "swapped"
    );
  });

  it.each([
    ["success", "found"],
    ["target", "compared"],
    ["active", "current"],
    ["path", "visited"],
  ] as const)("maps the %s alias to %s", (bucket, state) => {
    expect(getVisualElementState({ [bucket]: ["node"] }, "node")).toBe(state);
  });

  it("returns classes for every state and never falls back to undefined styling", () => {
    expect(getVisualElementClassName({}, "node")).toContain("border-border");
    expect(getVisualElementClassName({ inserted: ["node"] }, "node")).toContain(
      "border-vis-current"
    );
    expect(getVisualElementClassName({ deleted: ["node"] }, "node")).toContain("opacity-55");
  });

  it("collapses state motion when reduced motion is enabled", () => {
    const motion = getVisualElementMotion("swapped", true);
    expect(motion.initial).toBe(false);
    expect(motion.transition.duration).toBe(0.01);
    expect(motion.animate).toMatchObject({ scale: 1, x: 0, y: 0 });
  });

  it("gives insertion, deletion, and swap distinct motion signatures", () => {
    expect(getVisualElementMotion("inserted", false).animate).not.toEqual(
      getVisualElementMotion("deleted", false).animate
    );
    expect(getVisualElementMotion("swapped", false).animate).not.toEqual(
      getVisualElementMotion("inserted", false).animate
    );
  });
});
