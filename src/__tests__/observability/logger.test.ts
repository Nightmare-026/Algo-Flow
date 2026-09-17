import { describe, it, expect, vi } from "vitest";
import { logger } from "@/lib/observability/logger";

describe("Observability Logger (In-House Structured Telemetry)", () => {
  it("formats and logs info messages without crashing", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    logger.info("Application started", { env: "test" });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("formats and logs warn messages", () => {
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    logger.warn("Cache miss warning", { cacheKey: "session_123" });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it("formats and logs errors from Error instances and string messages", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    logger.error(new Error("Database connection timed out"), { query: "SELECT 1" });
    expect(consoleSpy).toHaveBeenCalled();

    logger.error("Raw string error message", { attempt: 2 });
    expect(consoleSpy).toHaveBeenCalledTimes(2);
    consoleSpy.mockRestore();
  });

  it("handles circular objects in context safely", () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});
    const circular: Record<string, unknown> = { key: "value" };
    circular.loop = circular;

    expect(() => {
      logger.info("Circular context test", circular);
    }).not.toThrow();

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
