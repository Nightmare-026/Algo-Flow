import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

if (typeof globalThis.structuredClone !== "function") {
  Object.defineProperty(globalThis, "structuredClone", {
    configurable: true,
    value: <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T,
  });
}

let mockUuidSequence = 0;

Object.defineProperty(globalThis, "resetTestUuidSequence", {
  configurable: true,
  value: () => {
    mockUuidSequence = 0;
  },
});

jest.mock("uuid", () => ({
  v4: () => `test-id-${mockUuidSequence++}`,
}));
