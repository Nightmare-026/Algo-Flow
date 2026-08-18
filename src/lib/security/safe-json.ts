/**
 * Safely serializes data to JSON for embedding inside HTML `<script>` tags (e.g. JSON-LD).
 * Escapes `<` to unicode `\u003c` to prevent premature script tag termination (XSS/script breakout).
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
