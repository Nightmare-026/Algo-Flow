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
  primary: "border-primary/35 bg-primary-muted text-primary-active",
  info: "border-secondary/30 bg-secondary-muted text-secondary",
  warning: "border-warning/30 bg-warning-muted text-warning",
  success: "border-success/30 bg-success-muted text-success",
  error: "border-error/30 bg-error-muted text-error",
  muted: "border-border bg-bg-surface text-text-secondary",
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
      className="border-b border-border bg-bg-surface/70 px-3 py-2"
    >
      <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto" role="list">
        <span className="shrink-0 text-[11px] font-bold uppercase tracking-[0.14em] text-text-muted">
          Visual state
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
                "inline-flex min-h-8 shrink-0 items-center gap-2 rounded-full border px-3 text-xs font-semibold transition-[background-color,border-color,box-shadow,color,opacity]",
                active
                  ? cn(toneClasses[item.tone], "shadow-[var(--shadow-raised-sm)] opacity-100")
                  : "border-border/75 bg-bg-surface-light text-text-muted opacity-55"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "h-2 w-2 rounded-full",
                  active ? "bg-current shadow-[0_0_0_3px_currentColor]" : "bg-text-muted/40"
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
