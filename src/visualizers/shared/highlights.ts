/**
 * Phase 3 â€” Highlights helpers.
 *
 * These helpers return strictly canonical `VisualStepHighlights` shapes
 * (bucket â†’ ids[]). Algorithm files call them instead of building
 * inverted-shape literals â€” which were the source of A-03 / RR-01.
 */

import type { VisualStepHighlights } from "@/types";

/** Combine arbitrary bucket lists into a canonical highlights object. */
export function makeHighlights(parts: Partial<VisualStepHighlights>): VisualStepHighlights {
  const out: VisualStepHighlights = {};
  for (const [k, v] of Object.entries(parts)) {
    if (Array.isArray(v)) {
      const ids = Array.from(new Set(v));
      if (ids.length > 0) {
        (out as Record<string, string[]>)[k] = ids;
      }
    }
  }
  return out;
}

/** `compared` is for elements participating in the current comparison. */
export function compare(ids: ReadonlyArray<string>): VisualStepHighlights {
  const arr = Array.from(new Set(ids));
  return arr.length > 0 ? { compared: arr } : {};
}

/** `swapped` for two elements that just exchanged values. */
export function swap(ids: ReadonlyArray<string>): VisualStepHighlights {
  const arr = Array.from(new Set(ids));
  return arr.length > 0 ? { swapped: arr } : {};
}

/** `sorted` for elements locked in their final position. */
export function sortedHighlight(ids: ReadonlyArray<string>): VisualStepHighlights {
  const arr = Array.from(new Set(ids));
  return arr.length > 0 ? { sorted: arr } : {};
}

/** `visited` for nodes already traversed. */
export function visited(ids: ReadonlyArray<string>): VisualStepHighlights {
  const arr = Array.from(new Set(ids));
  return arr.length > 0 ? { visited: arr } : {};
}

/** `found` for search-target hits. */
export function found(ids: ReadonlyArray<string>): VisualStepHighlights {
  const arr = Array.from(new Set(ids));
  return arr.length > 0 ? { found: arr } : {};
}

/** `inserted` for elements added by an insertion operation. */
export function inserted(ids: ReadonlyArray<string>): VisualStepHighlights {
  const arr = Array.from(new Set(ids));
  return arr.length > 0 ? { inserted: arr } : {};
}

/** `deleted` for elements removed by a deletion operation. */
export function deleted(ids: ReadonlyArray<string>): VisualStepHighlights {
  const arr = Array.from(new Set(ids));
  return arr.length > 0 ? { deleted: arr } : {};
}

/** `current` for the search-window focus. */
export function currentTarget(ids: ReadonlyArray<string>): VisualStepHighlights {
  const arr = Array.from(new Set(ids));
  return arr.length > 0 ? { current: arr } : {};
}

/** `pointer` for hash probes, linked-list head pointers, etc. */
export function pointerOn(ids: ReadonlyArray<string>): VisualStepHighlights {
  const arr = Array.from(new Set(ids));
  return arr.length > 0 ? { pointer: arr } : {};
}

/** `error` for invalid states (overflow, underflow, collisions not resolved). */
export function errorOn(ids: ReadonlyArray<string>): VisualStepHighlights {
  const arr = Array.from(new Set(ids));
  return arr.length > 0 ? { error: arr } : {};
}

/** `success` for the final state of a successful run. */
export function succeeded(ids: ReadonlyArray<string>): VisualStepHighlights {
  const arr = Array.from(new Set(ids));
  return arr.length > 0 ? { success: arr } : {};
}

/** Merge multiple highlight buckets (e.g., when a step has both active+visited). */
export function conjunct(parts: VisualStepHighlights[]): VisualStepHighlights {
  const out: Record<string, string[]> = {};
  for (const part of parts) {
    for (const [k, v] of Object.entries(part)) {
      if (!Array.isArray(v)) continue;
      out[k] = out[k] ? Array.from(new Set([...out[k], ...(v as string[])])) : Array.from(v);
    }
  }
  return out as VisualStepHighlights;
}

/** Generic "mark all of these in a chosen bucket". */
export function markBucket(
  ids: ReadonlyArray<string>,
  bucket: keyof VisualStepHighlights
): VisualStepHighlights {
  const arr = Array.from(new Set(ids));
  return arr.length > 0 ? ({ [bucket]: arr } as VisualStepHighlights) : {};
}
