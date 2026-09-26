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
      <div className="flex h-full items-center justify-center rounded-none border border-border bg-surface p-4 text-sm text-text-muted">
        <ListChecks className="mr-2 h-3.5 w-3.5" />
        Generate steps to inspect the execution log.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-full overflow-auto rounded-none border border-border bg-surface p-2"
    >
      <ol className="space-y-1">
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
                  "w-full rounded-[4px] border p-2 text-left transition-all duration-150 cursor-pointer select-none",
                  isCurrent
                    ? "border-primary bg-primary/10 text-primary border-l-4 font-semibold shadow-xs"
                    : "border-border bg-surface text-text-secondary hover:border-border-hover hover:text-text-primary"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                    Step {step.stepNumber}
                  </span>
                  <span className="rounded-[4px] border border-border bg-surface px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-text-muted">
                    {step.actionType}
                  </span>
                </div>
                <p className="mt-0.5 text-xs font-semibold leading-snug line-clamp-1">
                  {step.title}
                </p>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
