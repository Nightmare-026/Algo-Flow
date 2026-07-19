import { resolveAuthOrigin, safeInternalPath } from "@/lib/auth/redirects";

describe("authentication redirects", () => {
  test("prefers the explicitly configured canonical origin", () => {
    expect(
      resolveAuthOrigin({
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "https://algo-flow-night-sigma.vercel.app/path",
        VERCEL_PROJECT_PRODUCTION_URL: "other.vercel.app",
      })
    ).toBe("https://algo-flow-night-sigma.vercel.app");
  });

  test("rejects an insecure explicit production origin and uses Vercel instead", () => {
    expect(
      resolveAuthOrigin({
        NODE_ENV: "production",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "algo-flow-night-sigma.vercel.app",
      })
    ).toBe("https://algo-flow-night-sigma.vercel.app");
  });

  test("uses Vercel's system URL when the explicit site URL is absent", () => {
    expect(
      resolveAuthOrigin({
        NODE_ENV: "production",
        VERCEL_ENV: "production",
        VERCEL_PROJECT_PRODUCTION_URL: "algo-flow-night-sigma.vercel.app",
      })
    ).toBe("https://algo-flow-night-sigma.vercel.app");
  });

  test("uses the branch deployment URL for a preview", () => {
    expect(
      resolveAuthOrigin({
        NODE_ENV: "production",
        VERCEL_ENV: "preview",
        VERCEL_URL: "algo-flow-git-fix.example.vercel.app",
        VERCEL_PROJECT_PRODUCTION_URL: "algo-flow-night-sigma.vercel.app",
      })
    ).toBe("https://algo-flow-git-fix.example.vercel.app");
  });

  test("fails closed in production without an approved origin", () => {
    expect(resolveAuthOrigin({ NODE_ENV: "production" }, "https://attacker.example")).toBeNull();
  });

  test.each(["https://attacker.example", "//attacker.example", "/\\attacker.example"])(
    "rejects unsafe internal destination %s",
    (value) => {
      expect(safeInternalPath(value)).toBe("/dashboard");
    }
  );

  test("preserves a safe internal path, query, and hash", () => {
    expect(safeInternalPath("/visualizer/bfs?step=2#code")).toBe("/visualizer/bfs?step=2#code");
  });
});
