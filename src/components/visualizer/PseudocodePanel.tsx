"use client";

import { useRef } from "react";
import { usePlaybackStore } from "@/stores/playback-store";
import { getVisualizerPseudocode } from "@/visualizers/registry/pseudocode";
import { cn } from "@/lib/utils";
import { useAutoScrollToActive } from "./useAutoScrollToActive";

interface PseudocodePanelProps {
  slug: string;
  fallback?: string;
  isVisible?: boolean;
}

export function PseudocodePanel({ slug, fallback, isVisible = true }: PseudocodePanelProps) {
  const { steps, currentStepIndex, reducedMotion } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];
  const activeLineRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lines = getVisualizerPseudocode(slug, fallback);
  const activeLineNum = currentStep?.pseudocodeLine;

  useAutoScrollToActive({
    containerRef: scrollContainerRef,
    activeElementRef: activeLineRef,
    reducedMotion,
    trigger: `${activeLineNum}:${isVisible}`,
  });

  return (
    <section
      className="flex h-full flex-col overflow-hidden rounded-none border border-border bg-surface shadow-(--shadow-raised-sm)"
      aria-label="Pseudocode"
    >
      <div className="flex min-h-9.5 shrink-0 items-center justify-between border-b border-border bg-surface px-3">
        <h2 className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-primary">
          Pseudocode
        </h2>
        {activeLineNum ? (
          <span className="font-mono text-[9px] font-bold text-primary bg-primary-muted px-2 py-0.5 rounded-md border border-primary/30 shadow-[0_0_8px_rgba(34,197,94,0.15)]">
            Line {activeLineNum}
          </span>
        ) : null}
      </div>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto bg-pseudocode-panel-bg p-3 font-mono text-[11px] leading-5 text-emerald-100/90 shadow-(--shadow-inset) rounded-none"
        role="region"
        aria-label="Pseudocode lines"
        tabIndex={0}
      >
        {lines.length > 0 ? (
          <div className="flex min-w-max flex-col">
            {lines.map((line, index) => {
              const lineNum = index + 1;
              const isActive = activeLineNum === lineNum;
              return (
                <div
                  ref={isActive ? activeLineRef : undefined}
                  key={`${slug}-${index}`}
                  data-pseudocode-line={lineNum}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "grid grid-cols-[2rem_1fr] rounded border-l-2 py-0.75 pr-1.5 transition-all duration-150",
                    isActive
                      ? "border-primary bg-emerald-500/25 text-emerald-50 font-bold shadow-[inset_4px_0_0_var(--primary),0_0_12px_rgba(34,197,94,0.15)]"
                      : "border-transparent text-emerald-100/90 hover:bg-emerald-500/10 hover:text-emerald-50"
                  )}
                >
                  <span
                    className={cn(
                      "select-none pr-2 text-right text-[10px] tabular-nums transition-colors",
                      isActive
                        ? "font-extrabold text-emerald-300 drop-shadow-[0_0_4px_rgba(110,231,183,0.5)]"
                        : "text-emerald-400/80 font-medium"
                    )}
                  >
                    {lineNum}
                  </span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center p-4 text-center text-xs text-emerald-100/50">
            Pseudocode is not available for this visualizer.
          </div>
        )}
      </div>
      <p className="sr-only" aria-live="polite">
        {activeLineNum
          ? `Pseudocode line ${activeLineNum} selected.`
          : "No pseudocode line selected."}
      </p>
    </section>
  );
}
