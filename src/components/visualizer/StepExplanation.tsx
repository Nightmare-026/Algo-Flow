"use client";

import { usePlaybackStore } from "@/stores/playback-store";
import { Info } from "lucide-react";

export function StepExplanation() {
  const { steps, currentStepIndex, reducedMotion } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep) {
    return (
      <div className="flex items-center justify-center h-full text-text-muted p-6 bg-bg-surface-light rounded-xl border border-border">
        <Info className="w-5 h-5 mr-2 opacity-50" />
        <span className="text-sm">Preparing the first explanation…</span>
      </div>
    );
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="flex flex-col h-full bg-bg-surface-light rounded-xl border border-border p-6 overflow-hidden relative"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 to-secondary/50" />

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-text-primary">Step {currentStep.stepNumber}</h2>
        <span className="px-2.5 py-1 text-xs font-medium bg-bg-surface border border-border rounded-md text-text-secondary uppercase tracking-wider">
          {currentStep.operation}
        </span>
      </div>

      <div
        key={currentStep.id}
        className="flex-1 overflow-auto"
        data-reduced-motion={reducedMotion ? "true" : "false"}
      >
        <h3 className="text-base font-semibold text-primary mb-2">{currentStep.title}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{currentStep.description}</p>

        {currentStep.complexityNote && (
          <div className="mt-4 p-3 bg-bg-surface rounded-lg border border-border flex items-start">
            <Info className="w-4 h-4 text-secondary mt-0.5 mr-2 shrink-0" />
            <p className="text-xs text-text-muted">{currentStep.complexityNote}</p>
          </div>
        )}

        {currentStep.variables && Object.keys(currentStep.variables).length > 0 && (
          <div className="mt-4 p-3 bg-bg-surface rounded-lg border border-border">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
              Variables
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(currentStep.variables).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center text-sm font-mono bg-bg-deep px-2 py-1 rounded border border-border"
                >
                  <span className="text-primary">{key}</span>
                  <span className="text-text-muted mx-1">=</span>
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
