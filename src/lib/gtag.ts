/**
 * Google Analytics 4 — Event tracking utilities.
 *
 * Usage:
 *   import { trackEvent } from "@/lib/gtag";
 *   trackEvent("run_algorithm", "visualizer", "bubble-sort");
 *
 * The helpers are safe to call server-side or when GA is not loaded —
 * they silently no-op when `window` or `gtag` is unavailable.
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// ---------- gtag type shim ----------
// The global `gtag` function is injected by the Google Analytics script.
// We declare it here so TypeScript doesn't complain.
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// ---------- helpers ----------

/** Send a custom GA4 event. */
export function trackEvent(action: string, category: string, label?: string, value?: number): void {
  if (typeof window === "undefined" || !window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
}

/** Track a page view manually (useful for SPA-style navigations if needed). */
export function trackPageView(url: string): void {
  if (typeof window === "undefined" || !window.gtag || !GA_MEASUREMENT_ID) return;

  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
}
