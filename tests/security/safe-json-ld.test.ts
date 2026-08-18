import { safeJsonLd } from "@/lib/security/safe-json";

describe("safeJsonLd security utility", () => {
  test("escapes '<' characters to prevent script tag breakout", () => {
    const maliciousPayload = {
      title: "Test </script><script>alert(1)</script>",
      description: "Sample <img src=x onerror=alert(1)>",
    };

    const serialized = safeJsonLd(maliciousPayload);

    expect(serialized).not.toContain("<");
    expect(serialized).toContain("\\u003c/script>");
    expect(serialized).toContain("\\u003cscript>");
    expect(serialized).toContain("\\u003cimg");
  });

  test("correctly round-trips through JSON.parse", () => {
    const original = { name: "Algo Flow", score: 100, tags: ["tree", "graph", "<dsa>"] };
    const serialized = safeJsonLd(original);
    const parsed = JSON.parse(serialized);
    expect(parsed).toEqual(original);
  });
});
