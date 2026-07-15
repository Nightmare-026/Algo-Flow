/**
 * Phase 3 — Highlights helpers smoke test.
 *
 * Every helper must return a strict bucket→ids[] shape. This guards the
 * A-03/RR-01 fix.
 */

import {
  compare,
  swap,
  sortedHighlight,
  visited,
  found,
  inserted,
  deleted,
  currentTarget,
  pointerOn,
  errorOn,
  succeeded,
  conjunct,
  markBucket,
  makeHighlights,
} from "@/features/visualizer-engine/highlights";

describe("Phase 3 — highlights helpers", () => {
  it("compare returns a strict shape with active bucket", () => {
    const h = compare(["a", "b"]);
    expect(h.active).toEqual(["a", "b"]);
    expect(Object.keys(h)).toEqual(["active"]);
  });

  it("swap returns swapped bucket", () => {
    expect(swap(["a"]).swapped).toEqual(["a"]);
  });

  it("sortedHighlight returns sorted bucket", () => {
    expect(sortedHighlight(["a", "b", "c"]).sorted).toEqual(["a", "b", "c"]);
  });

  it("visited returns visited bucket", () => {
    expect(visited(["a"]).visited).toEqual(["a"]);
  });

  it("found returns found bucket", () => {
    expect(found(["n"]).found).toEqual(["n"]);
  });

  it("inserted returns inserted bucket", () => {
    expect(inserted(["n", "n"]).inserted).toEqual(["n"]);
  });

  it("deleted returns deleted bucket", () => {
    expect(deleted(["n", "n"]).deleted).toEqual(["n"]);
  });

  it("currentTarget returns current bucket", () => {
    expect(currentTarget(["n"]).current).toEqual(["n"]);
  });

  it("pointerOn returns pointer bucket", () => {
    expect(pointerOn(["p"]).pointer).toEqual(["p"]);
  });

  it("errorOn returns error bucket", () => {
    expect(errorOn(["e"]).error).toEqual(["e"]);
  });

  it("succeeded returns success bucket", () => {
    expect(succeeded(["s"]).success).toEqual(["s"]);
  });

  it("dedupes input", () => {
    expect(compare(["a", "a", "b"]).active).toEqual(["a", "b"]);
  });

  it("returns empty object when no ids", () => {
    expect(compare([])).toEqual({});
  });

  it("conjunct merges matching buckets without dupes", () => {
    const a = compare(["1", "2"]);
    const b = visited(["2", "3"]);
    const merged = conjunct([a, b]);
    expect(merged.active).toEqual(["1", "2"]);
    expect(merged.visited).toEqual(["2", "3"]);
  });

  it("markBucket routes through arbitrary bucket key", () => {
    expect(markBucket(["x"], "found").found).toEqual(["x"]);
    expect(markBucket(["x"], "compared").compared).toEqual(["x"]);
  });

  it("makeHighlights builds canonical shape", () => {
    const h = makeHighlights({
      active: ["a", "a"],
      sorted: ["b", "c"],
      visited: [],
    });
    expect(h).toEqual({ active: ["a"], sorted: ["b", "c"] });
  });
});
