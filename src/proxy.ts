import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that should only be accessible if the user is authenticated.
const PROTECTED_ROUTES = ["/dashboard"];

// Routes that should only be accessible if the user is NOT authenticated.
const AUTH_ROUTES = ["/login", "/signup", "/forgot-password", "/reset-password"];

export async function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID());
  const isDev = process.env.NODE_ENV === "development";

  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${isDev ? "'unsafe-eval'" : ""} https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https:;
    font-src 'self' data: https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    connect-src 'self' https://*.supabase.co https://accounts.google.com https://github.com https://va.vercel-scripts.com;
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
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
    url.pathname = "/login";
    url.searchParams.set("next", path);
    // Important: we create a new response but must preserve cookies set by updateSession
    const redirectResponse = NextResponse.redirect(url);
    redirectResponse.headers.set("Content-Security-Policy", cspHeader);
    // Copy cookies from supabaseResponse
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
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
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}

// Alias middleware for compatibility
export const middleware = proxy;

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
