import { describe, it, expect } from "vitest";
import { safeSerializeJson, MAX_SESSION_PAYLOAD_BYTES } from "@/lib/security/safe-json";

describe("Session Storage (Input Validation & DoS Resilience)", () => {
  it("successfully serializes standard small JSON data", () => {
    const payload = { array: [1, 2, 3, 4, 5], target: 4, step: 2 };
    const result = safeSerializeJson(payload);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual(payload);
    }
  });

  it("handles undefined by returning null data", () => {
    const result = safeSerializeJson(undefined);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toBeNull();
    }
  });

  it("rejects circular object structures safely without throwing unhandled exceptions", () => {
    const circularObj: Record<string, unknown> = { name: "loop" };
    circularObj.self = circularObj;

    const result = safeSerializeJson(circularObj);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("circular references or is malformed");
    }
  });

  it("rejects payloads that exceed the 64KB byte threshold", () => {
    // Generate a payload that exceeds 64KB
    const largeArray = new Array(70000).fill("a").join("");
    const result = safeSerializeJson({ text: largeArray });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toContain("exceeds the 64KB limit");
    }
  });

  it("verifies constant threshold value is 64KB (65,536 bytes)", () => {
    expect(MAX_SESSION_PAYLOAD_BYTES).toBe(65536);
  });
});
