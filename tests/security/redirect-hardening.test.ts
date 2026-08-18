import { safeInternalPath } from "@/lib/auth/redirects";

describe("redirect hardening", () => {
  test.each([
    "https://evil.com",
    "http://evil.com",
    "//evil.com",
    "/\\evil.com",
    "/\tevil.com",
    "/\nevil.com",
    "/\revil.com",
    "/ evil.com",
    "/path\\with\\backslash",
    "/path\0nullbyte",
  ])("rejects adversarial path %j and returns fallback", (path) => {
    expect(safeInternalPath(path)).toBe("/dashboard");
  });

  test("accepts valid internal paths with query parameters and hash", () => {
    expect(safeInternalPath("/visualizer/binary-search")).toBe("/visualizer/binary-search");
    expect(safeInternalPath("/visualizer/dijkstra?speed=2#code")).toBe(
      "/visualizer/dijkstra?speed=2#code"
    );
  });
});
