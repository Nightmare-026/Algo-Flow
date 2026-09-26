"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { Info, Variable } from "lucide-react";

export function StepExplanation() {
  const { steps, currentStepIndex, reducedMotion } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep) {
    return (
      <div className="flex h-full items-center justify-center rounded-none border border-border bg-surface p-6 text-sm text-text-muted">
        <Info className="mr-2 h-4 w-4 opacity-50" />
        <span>Preparing step explanation…</span>
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="flex h-full flex-col overflow-hidden rounded-none border border-border bg-surface p-3"
    >
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-1.5">
          <h2 className="text-xs font-bold font-mono text-text-primary uppercase tracking-wider">
            Step {currentStep.stepNumber}
          </h2>
        </div>
        <span className="rounded-sm border border-border bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          {currentStep.operation}
        </span>
      </div>

      <div
        key={currentStep.id}
        className="flex-1 overflow-auto pt-3 space-y-3"
        data-reduced-motion={reducedMotion ? "true" : "false"}
      >
        <div>
          <h3 className="text-sm font-bold font-display text-text-primary">{currentStep.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-text-secondary">
            {currentStep.description}
          </p>
        </div>

        {currentStep.complexityNote && (
          <div className="flex items-start gap-2 rounded-md border border-secondary/20 bg-secondary-muted p-2.5">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
            <p className="text-xs leading-relaxed text-text-secondary">
              {currentStep.complexityNote}
            </p>
          </div>
        )}

        {currentStep.variables && Object.keys(currentStep.variables).length > 0 && (
          <div className="rounded-md border border-border bg-surface-secondary p-2.5 shadow-card">
            <div className="flex items-center gap-1 mb-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
              <Variable className="h-3 w-3 text-primary" />
              Active Variable State
            </div>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(currentStep.variables).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center rounded-sm border border-border bg-surface px-2 py-0.5 text-xs font-mono font-bold shadow-xs"
                >
                  <span className="text-primary">{key}</span>
                  <span className="mx-1 text-text-muted">=</span>
                  <span className="text-secondary">{value !== null ? String(value) : "null"}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
