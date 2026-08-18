"use client";

import { useRef } from "react";
import { usePlaybackStore } from "@/stores/playback-store";
import { getVisualizerPseudocode } from "@/visualizers/registry/pseudocode";
import { cn } from "@/lib/utils";
import { useAutoScrollToActive } from "./useAutoScrollToActive";

interface PseudocodePanelProps {
  slug: string;
  fallback?: string;
}

export function PseudocodePanel({ slug, fallback }: PseudocodePanelProps) {
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
    trigger: activeLineNum,
  });

  return (
    <section
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-[var(--shadow-raised-sm)]"
      aria-label="Pseudocode"
    >
      <div className="flex min-h-[44px] shrink-0 items-center justify-between border-b border-border bg-surface px-4">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary">
          Algorithm Pseudocode
        </h2>
        {activeLineNum ? (
          <span className="font-mono text-[10px] font-bold text-primary bg-primary-muted px-2 py-0.5 rounded border border-primary/20">
            Line {activeLineNum}
          </span>
        ) : null}
      </div>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto bg-pseudocode-panel-bg p-4 font-mono text-xs leading-6 text-emerald-100/90 shadow-[var(--shadow-inset)]"
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
                  key={`${line}-${index}`}
                  data-pseudocode-line={lineNum}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "grid grid-cols-[2.5rem_1fr] rounded-lg border-l-2 py-1 pr-2 transition-all duration-150",
                    isActive
                      ? "border-primary bg-emerald-500/20 text-emerald-200 font-bold shadow-[inset_4px_0_0_rgba(34,197,94,0.3)]"
                      : "border-transparent text-emerald-100/60"
                  )}
                >
                  <span
                    className={cn(
                      "select-none pr-3 text-right text-emerald-500/40 text-[11px]",
                      isActive && "font-bold text-emerald-300"
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
          <div className="flex h-full items-center justify-center p-5 text-center text-xs text-emerald-100/50">
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
