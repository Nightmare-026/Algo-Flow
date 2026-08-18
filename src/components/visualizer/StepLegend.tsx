"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import type { VisualStepHighlights } from "@/types";
import { cn } from "@/lib/utils";

export type StepLegendItem = {
  bucketKey: keyof VisualStepHighlights;
  label: string;
  description: string;
  tone: "info" | "warning" | "success" | "error" | "muted" | "primary";
};

const toneClasses: Record<StepLegendItem["tone"], string> = {
  primary: "border-primary/40 bg-primary-muted text-primary",
  info: "border-secondary/40 bg-secondary-muted text-secondary",
  warning: "border-warning/40 bg-warning-muted text-warning",
  success: "border-success/40 bg-success-muted text-success",
  error: "border-error/40 bg-error-muted text-error",
  muted: "border-border bg-surface text-text-secondary",
};

export function StepLegend({ items }: { items: ReadonlyArray<StepLegendItem> }) {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];
  const activeBuckets = new Set(
    Object.entries(currentStep?.highlights ?? {})
      .filter(([, ids]) => (ids?.length ?? 0) > 0)
      .map(([bucket]) => bucket)
  );

  return (
    <section
      aria-label="Step highlight legend"
      className="border-b border-border bg-surface/80 px-4 py-2.5 backdrop-blur-sm"
    >
      <div
        className="hide-scrollbar flex items-center gap-2 overflow-x-auto"
        role="list"
        tabIndex={0}
      >
        <span className="shrink-0 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">
          State Signals:
        </span>
        {items.map((item) => {
          const active = activeBuckets.has(item.bucketKey);
          return (
            <div
              key={item.bucketKey}
              role="listitem"
              data-highlight-bucket={item.bucketKey}
              data-active={active}
              title={item.description}
              className={cn(
                "inline-flex min-h-7 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition-all duration-200",
                active
                  ? cn(toneClasses[item.tone], "shadow-[var(--shadow-raised-sm)] opacity-100 font-bold")
                  : "border-border/60 bg-surface/50 text-text-muted opacity-40"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  active ? "bg-current shadow-[0_0_6px_currentColor]" : "bg-text-muted/40"
                )}
              />
              {item.label}
            </div>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        {activeBuckets.size > 0
          ? `Active visual states: ${items
              .filter((item) => activeBuckets.has(item.bucketKey))
              .map((item) => item.label)
              .join(", ")}.`
          : "No element state is highlighted for this setup step."}
      </p>
    </section>
  );
}
