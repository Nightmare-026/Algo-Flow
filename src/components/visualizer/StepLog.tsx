"use client";

import { useRef } from "react";
import { ListChecks } from "lucide-react";
import { usePlaybackStore } from "@/stores/playback-store";
import { cn } from "@/lib/utils";
import { useAutoScrollToActive } from "./useAutoScrollToActive";

export function StepLog() {
  const { steps, currentStepIndex, goToStep, reducedMotion } = usePlaybackStore();
  const activeItemRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useAutoScrollToActive({
    containerRef,
    activeElementRef: activeItemRef,
    reducedMotion,
    trigger: currentStepIndex,
  });

  if (steps.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-border bg-surface p-6 text-sm text-text-muted">
        <ListChecks className="mr-2 h-4 w-4" />
        Generate steps to inspect the execution log.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto rounded-2xl border border-border bg-surface p-3"
    >
      <ol className="space-y-2">
        {steps.map((step, index) => {
          const isCurrent = index === currentStepIndex;
          return (
            <li key={step.id}>
              <button
                ref={isCurrent ? activeItemRef : undefined}
                type="button"
                onClick={() => goToStep(index)}
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "w-full rounded-xl border p-3 text-left transition-all duration-150 cursor-pointer select-none",
                  isCurrent
                    ? "border-primary/40 bg-primary-muted text-primary shadow-[var(--shadow-inset)]"
                    : "border-border bg-surface text-text-secondary hover:border-border-hover hover:text-text-primary"
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
                    Step {step.stepNumber}
                  </span>
                  <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-text-muted">
                    {step.actionType}
                  </span>
                </div>
                <p className="mt-1 text-xs font-semibold leading-snug line-clamp-1">{step.title}</p>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
