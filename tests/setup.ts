import "@testing-library/jest-dom";
import { jest } from "@jest/globals";

jest.mock("uuid", () => ({
  v4: () => "test-id",
}));
