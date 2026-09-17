import type { Json } from "@/types/database";

/**
 * Safely serializes data to JSON for embedding inside HTML `<script>` tags (e.g. JSON-LD).
 * Escapes `<` to unicode `\u003c` to prevent premature script tag termination (XSS/script breakout).
 */
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const MAX_SESSION_PAYLOAD_BYTES = 65536; // 64 KB cap per payload

export function safeSerializeJson(
  value: unknown
): { ok: true; data: Json } | { ok: false; error: string } {
  if (value === undefined) {
    return { ok: true, data: null };
  }

  try {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) {
      return { ok: false, error: "Session state is not JSON serializable." };
    }

    if (new TextEncoder().encode(serialized).length > MAX_SESSION_PAYLOAD_BYTES) {
      return {
        ok: false,
        error: "Session state payload exceeds the 64KB limit.",
      };
    }

    return { ok: true, data: JSON.parse(serialized) as Json };
  } catch {
    return {
      ok: false,
      error: "Session state payload contains circular references or is malformed.",
    };
  }
}
