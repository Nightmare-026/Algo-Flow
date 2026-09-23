import type { VisualStepHighlights } from "@/types";

export type VisualElementState =
  | "default"
  | "current"
  | "compared"
  | "swapped"
  | "inserted"
  | "deleted"
  | "found"
  | "error"
  | "sorted"
  | "visited";

const stateClasses: Record<VisualElementState, string> = {
  default: "border-border bg-bg-surface text-text-primary",
  current:
    "border-vis-current bg-primary-muted text-vis-current-text ring-2 ring-vis-current/25 shadow-[0_0_0_4px_rgba(34,197,94,0.15)] font-bold",
  compared:
    "border-vis-compared bg-warning-muted text-vis-compared-text ring-2 ring-vis-compared/25 shadow-[0_0_0_4px_rgba(180,83,9,0.12)] font-bold",
  swapped:
    "border-vis-swapped bg-secondary-muted text-vis-swapped-text ring-2 ring-vis-swapped/25 shadow-[0_0_0_4px_rgba(15,118,110,0.14)] font-bold",
  inserted:
    "border-vis-current bg-primary-muted text-vis-current-text ring-2 ring-vis-current/30 shadow-[0_0_0_5px_rgba(34,197,94,0.18)] font-bold",
  deleted:
    "border-vis-error/70 bg-error-muted text-vis-error-text opacity-60 ring-2 ring-vis-error/15 font-bold",
  found:
    "border-vis-found bg-success-muted text-vis-found-text ring-2 ring-vis-found/30 shadow-[0_0_0_5px_rgba(21,128,61,0.18)] font-bold",
  error:
    "border-vis-error bg-error-muted text-vis-error-text ring-2 ring-vis-error/30 shadow-[0_0_0_5px_rgba(185,28,28,0.15)] font-bold",
  sorted: "border-vis-sorted/70 bg-success-muted text-vis-sorted-text font-bold",
  visited: "border-vis-visited/70 bg-primary-muted/60 text-vis-visited-text font-bold",
};

export function getVisualElementState(
  highlights: VisualStepHighlights,
  id: string
): VisualElementState {
  if (highlights.error?.includes(id)) return "error";
  if (highlights.deleted?.includes(id)) return "deleted";
  if (highlights.found?.includes(id) || highlights.success?.includes(id)) return "found";
  if (highlights.swapped?.includes(id)) return "swapped";
  if (highlights.compared?.includes(id) || highlights.target?.includes(id)) return "compared";
  if (highlights.inserted?.includes(id)) return "inserted";
  if (highlights.current?.includes(id) || highlights.active?.includes(id)) return "current";
  if (highlights.sorted?.includes(id)) return "sorted";
  if (highlights.visited?.includes(id) || highlights.path?.includes(id)) return "visited";
  return "default";
}

export function getVisualStateClassName(state: VisualElementState): string {
  return stateClasses[state];
}

export function getVisualElementClassName(highlights: VisualStepHighlights, id: string) {
  return stateClasses[getVisualElementState(highlights, id)];
}

export function getVisualElementMotion(state: VisualElementState, reducedMotion: boolean) {
  if (reducedMotion) {
    return {
      initial: false as const,
      animate: { opacity: state === "deleted" ? 0.55 : 1, scale: 1, x: 0, y: 0 },
      exit: { opacity: 0 },
      transition: { duration: 0.01 },
    };
  }

  if (state === "swapped") {
    return {
      initial: { opacity: 0, scale: 0.92 },
      animate: { opacity: 1, scale: [1, 1.1, 1], y: [0, -12, 0] },
      exit: { opacity: 0, scale: 0.9, y: 18 },
      transition: { duration: 0.44, ease: [0.16, 1, 0.3, 1] as const },
    };
  }

  if (state === "inserted") {
    return {
      initial: { opacity: 0, scale: 0.72, y: -24 },
      animate: { opacity: 1, scale: [0.72, 1.08, 1], y: 0 },
      exit: { opacity: 0, scale: 0.82, y: 18 },
      transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
    };
  }

  if (state === "deleted") {
    return {
      initial: { opacity: 1, scale: 1 },
      animate: { opacity: 0.55, scale: 0.94, y: 8 },
      exit: { opacity: 0, scale: 0.72, y: 24 },
      transition: { duration: 0.32, ease: [0.4, 0, 1, 1] as const },
    };
  }

  if (state === "found") {
    return {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: [1, 1.14, 1.04], y: 0 },
      exit: { opacity: 0, scale: 0.9 },
      transition: { duration: 0.46, ease: [0.34, 1.35, 0.64, 1] as const },
    };
  }

  return {
    initial: { opacity: 0, scale: 0.84, y: -18 },
    animate: { opacity: 1, scale: state === "compared" ? 1.05 : 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 20 },
    transition: { duration: 0.28, ease: [0.2, 0.8, 0.2, 1] as const },
  };
}
