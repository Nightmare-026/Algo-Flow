import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { middleware } from "@/middleware";

// Mock updateSession
vi.mock("@/lib/supabase/middleware", () => ({
  updateSession: vi.fn(),
}));

import { updateSession } from "@/lib/supabase/middleware";

describe("Edge Middleware (src/middleware.ts)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    process.env = originalEnv;
  });

  it("redirects unauthenticated user accessing /dashboard to /login with next param", async () => {
    const mockResponse = NextResponse.next();
    vi.mocked(updateSession).mockResolvedValueOnce({
      supabaseResponse: mockResponse,
      user: null,
    });

    const request = new NextRequest("https://algoflow.dev/dashboard");
    const response = await middleware(request);

    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toContain("/login");
    expect(location).toContain("next=%2Fdashboard");
    expect(response.headers.get("Content-Security-Policy")).toBeDefined();
  });

  it("redirects authenticated user accessing /login to /dashboard", async () => {
    const mockResponse = NextResponse.next();
    vi.mocked(updateSession).mockResolvedValueOnce({
      supabaseResponse: mockResponse,
      user: { id: "test-user-id" } as unknown as import("@supabase/supabase-js").User,
    });

    const request = new NextRequest("https://algoflow.dev/login");
    const response = await middleware(request);

    expect(response.status).toBe(307);
    const location = response.headers.get("location");
    expect(location).toBe("https://algoflow.dev/dashboard");
  });

  it("allows access to public pages while injecting strict CSP headers", async () => {
    const mockResponse = NextResponse.next();
    vi.mocked(updateSession).mockResolvedValueOnce({
      supabaseResponse: mockResponse,
      user: null,
    });

    const request = new NextRequest("https://algoflow.dev/");
    const response = await middleware(request);

    expect(response.status).toBe(200);
    const csp = response.headers.get("Content-Security-Policy");
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("https://www.googletagmanager.com");
  });

  it("permits local dev mock auth bypass when DEV_MOCK_AUTH is enabled", async () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("DEV_MOCK_AUTH", "true");

    const mockResponse = NextResponse.next();
    vi.mocked(updateSession).mockResolvedValueOnce({
      supabaseResponse: mockResponse,
      user: null,
    });

    const request = new NextRequest("https://localhost:3000/dashboard");
    const response = await middleware(request);

    // Bypasses redirect, returns 200
    expect(response.status).toBe(200);
  });
});
