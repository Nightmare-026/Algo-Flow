"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { cn } from "@/lib/utils";

export function StepTimeline() {
  const { steps, currentStepIndex, goToStep, totalSteps } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (totalSteps === 0 || !currentStep) return null;

  return (
    <section className="min-w-0 w-full" aria-label="Execution progress">
      <div className="mb-1.5 flex min-w-0 items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="shrink-0 font-mono text-[10px] font-bold tabular-nums text-primary bg-primary-muted px-1.5 py-0.5 rounded border border-primary/20">
            {currentStepIndex + 1}/{totalSteps}
          </span>
          <span className="truncate text-[11px] font-semibold text-text-primary">
            {currentStep.title}
          </span>
        </div>
        <span className="shrink-0 rounded border border-border bg-surface px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-text-muted">
          {currentStep.actionType}
        </span>
      </div>

      <div
        className="flex h-2.5 w-full items-stretch gap-0.5 overflow-hidden rounded-full bg-bg-surface-inset p-0.5 border border-border shadow-[var(--shadow-inset)]"
        role="group"
        aria-label="Select execution step"
      >
        {steps.map((step, index) => {
          const isPassed = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(index)}
              aria-current={isCurrent ? "step" : undefined}
              aria-label={`Step ${index + 1}: ${step.title}. ${step.operation}`}
              title={`Step ${index + 1}: ${step.title}`}
              className={cn(
                "relative min-w-1 flex-1 rounded-full transition-all duration-150 cursor-pointer focus-visible:outline-none",
                isCurrent
                  ? "bg-primary shadow-[0_0_0_2px_var(--color-primary)]"
                  : isPassed
                    ? "bg-primary/50 hover:bg-primary/70"
                    : "bg-border hover:bg-border-hover"
              )}
            >
              <span className="sr-only">{step.title}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
