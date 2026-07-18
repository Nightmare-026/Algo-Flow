"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { cn } from "@/lib/utils";

export function StepTimeline() {
  const { steps, currentStepIndex, goToStep, totalSteps } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (totalSteps === 0 || !currentStep) return null;

  return (
    <section className="min-w-0 w-full" aria-label="Execution progress">
      <div className="mb-2 flex min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 font-mono text-[11px] font-bold tabular-nums text-primary-active">
            {currentStepIndex + 1}/{totalSteps}
          </span>
          <span className="truncate text-xs font-semibold text-text-primary">
            {currentStep.title}
          </span>
        </div>
        <span className="shrink-0 rounded-full border border-primary/20 bg-primary-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-primary-active">
          {currentStep.actionType}
        </span>
      </div>

      <div
        className="neu-inset flex h-4 w-full items-stretch gap-0.5 overflow-hidden rounded-full p-1"
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
                "relative min-w-1 flex-1 rounded-full transition-[background-color,box-shadow,transform] focus-visible:z-10 focus-visible:outline-none",
                isCurrent
                  ? "bg-primary shadow-[0_0_0_2px_rgba(255,255,255,0.95),0_0_0_4px_rgba(34,197,94,0.30)]"
                  : isPassed
                    ? "bg-primary/45 hover:bg-primary/65"
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
