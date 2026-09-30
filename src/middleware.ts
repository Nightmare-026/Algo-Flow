import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that should only be accessible if the user is authenticated.
const PROTECTED_ROUTES = ["/dashboard"];

// Routes that should only be accessible if the user is NOT authenticated.
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const isDev = process.env.NODE_ENV === "development";

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://va.vercel-scripts.com https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https: https://www.google-analytics.com https://*.googletagmanager.com;
    font-src 'self' data: https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' ${isDev ? "ws: wss: http://localhost:* http://127.0.0.1:*" : ""} https://*.supabase.co https://accounts.google.com https://github.com https://va.vercel-scripts.com https://*.upstash.io https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com;
    ${isDev ? "" : "upgrade-insecure-requests;"}
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  // Update the Supabase session with modified request headers
  const { supabaseResponse, user } = await updateSession(request, requestHeaders);
  supabaseResponse.headers.set("Content-Security-Policy", cspHeader);

  const url = request.nextUrl.clone();
  const path = url.pathname;

  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => path === route || path.startsWith(`${route}/`)
  );
  // Specifically check for saved sessions route for visualizers
  const isSavedSessionRoute = path.startsWith("/visualizer/") && path.endsWith("/saved");
  const requiresAuth = isProtectedRoute || isSavedSessionRoute;

  const isAuthRoute = AUTH_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));

  // If the user is not authenticated and trying to access a protected route
  if (!user && requiresAuth) {
    // Dev Mode Auth Bypass (Strictly local dev only, zero risk to production)
    if (isDev && process.env.DEV_MOCK_AUTH === "true") {
      return supabaseResponse;
    }

    url.pathname = "/login";
    url.searchParams.set("next", path);
    // Important: we create a new response but must preserve cookies set by updateSession
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.headers.set("Content-Security-Policy", cspHeader);
    // Copy cookies with full security attributes (httpOnly, secure, sameSite, maxAge)
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  // If the user is authenticated and trying to access an auth route
  if (user && isAuthRoute) {
    url.pathname = "/dashboard";
    url.search = ""; // clear query params
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.headers.set("Content-Security-Policy", cspHeader);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}

// Keep proxy export for backwards compatibility
export const proxy = middleware;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
