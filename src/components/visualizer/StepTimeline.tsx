"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { cn } from "@/lib/utils";

const MAX_SEGMENTED_STEPS = 25;

export function StepTimeline() {
  const { steps, currentStepIndex, goToStep, totalSteps } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (totalSteps === 0 || !currentStep) return null;

  const isContinuous = totalSteps > MAX_SEGMENTED_STEPS;
  const progressPercent = totalSteps > 1 ? (currentStepIndex / (totalSteps - 1)) * 100 : 100;
  const clampedThumbPosition = Math.min(Math.max(progressPercent, 1.5), 98.5);

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

      {/* Mobile viewport: range scrubber with comfortable touch area */}
      <div
        className="group relative sm:hidden flex h-6 w-full min-w-0 items-center rounded-full bg-bg-surface-inset p-0.5 border border-border shadow-(--shadow-inset)"
        role="group"
        aria-label="Select execution step"
      >
        <div className="relative h-2 w-full overflow-hidden rounded-full">
          <div
            className="h-full bg-linear-to-r from-primary/80 to-primary rounded-full transition-[width] duration-75 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-primary border-2 border-surface shadow-(--shadow-raised-sm)"
          style={{ left: `${clampedThumbPosition}%` }}
          aria-hidden="true"
        />
        <input
          type="range"
          min={0}
          max={totalSteps - 1}
          value={currentStepIndex}
          onChange={(e) => goToStep(Number(e.target.value))}
          aria-label="Timeline step scrubber"
          aria-valuetext={`Step ${currentStepIndex + 1} of ${totalSteps}: ${currentStep.title}`}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10 touch-pan-x"
        />
      </div>

      {/* Desktop / Tablet viewports */}
      <div className="hidden sm:block w-full min-w-0">
        {isContinuous ? (
          <div
            className="group relative flex h-2.5 w-full min-w-0 items-center rounded-full bg-bg-surface-inset p-0.5 border border-border shadow-(--shadow-inset)"
            role="group"
            aria-label="Select execution step"
          >
            {/* Progress fill bar */}
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <div
                className="h-full bg-linear-to-r from-primary/80 to-primary rounded-full transition-[width] duration-75 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Glowing thumb indicator */}
            <div
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3.5 w-3.5 rounded-full bg-primary border-2 border-surface shadow-(--shadow-raised-sm) transition-transform duration-75 group-hover:scale-125"
              style={{ left: `${clampedThumbPosition}%` }}
              aria-hidden="true"
            />

            {/* Full-width accessible interactive range slider for scrub & keyboard control */}
            <input
              type="range"
              min={0}
              max={totalSteps - 1}
              value={currentStepIndex}
              onChange={(e) => goToStep(Number(e.target.value))}
              aria-label="Timeline step scrubber"
              aria-valuetext={`Step ${currentStepIndex + 1} of ${totalSteps}: ${currentStep.title}`}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0 z-10"
            />
          </div>
        ) : (
          <div
            className="flex h-2.5 w-full min-w-0 items-stretch gap-0.5 overflow-hidden rounded-full bg-bg-surface-inset p-0.5 border border-border shadow-(--shadow-inset)"
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
                  tabIndex={isCurrent ? 0 : -1}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                      e.preventDefault();
                      goToStep(Math.min(totalSteps - 1, currentStepIndex + 1));
                    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      e.preventDefault();
                      goToStep(Math.max(0, currentStepIndex - 1));
                    }
                  }}
                  onClick={() => goToStep(index)}
                  aria-current={isCurrent ? "step" : undefined}
                  aria-label={`Step ${index + 1}: ${step.title}. ${step.operation}`}
                  title={`Step ${index + 1}: ${step.title}`}
                  className={cn(
                    "relative min-w-0 flex-1 rounded-full transition-colors duration-150 cursor-pointer focus-visible:outline-none before:absolute before:-top-3 before:-bottom-3 before:left-0 before:right-0 before:content-['']",
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
        )}
      </div>
    </section>
  );
}
