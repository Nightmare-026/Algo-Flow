"use client";

import { useEffect, useRef } from "react";
import { usePlaybackStore } from "@/stores/playback-store";
import { getVisualizerPseudocode } from "@/visualizers/registry/pseudocode";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    const line = activeLineRef.current;
    const container = scrollContainerRef.current;
    if (!line || !container) return;
    const top =
      container.scrollTop +
      line.getBoundingClientRect().top -
      container.getBoundingClientRect().top -
      container.clientHeight / 2 +
      line.offsetHeight / 2;
    container.scrollTo({
      top: Math.max(0, top),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [activeLineNum, reducedMotion]);

  return (
    <section
      className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-surface-light"
      aria-label="Pseudocode"
    >
      <div className="flex min-h-[46px] shrink-0 items-center border-b border-border bg-bg-surface px-4">
        <h3 className="text-sm font-semibold text-text-primary">Pseudocode</h3>
      </div>
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto bg-[#173126] p-4 font-mono text-sm text-emerald-50/82"
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
                    "grid grid-cols-[2rem_1fr] rounded border-l-4 py-1 pr-2 transition-[background-color,border-color,box-shadow,color]",
                    isActive
                      ? "border-primary bg-emerald-300/16 text-emerald-50 shadow-[inset_4px_0_0_rgba(34,197,94,0.16)]"
                      : "border-transparent"
                  )}
                >
                  <span
                    className={cn(
                      "select-none pr-3 text-right text-emerald-100/38",
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
          <div className="flex h-full items-center justify-center p-5 text-center text-sm text-emerald-50/70">
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
