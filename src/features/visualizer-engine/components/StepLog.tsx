"use client";

import { ListChecks } from "lucide-react";
import { usePlaybackStore } from "../playback-store";
import { cn } from "@/lib/utils";

export function StepLog() {
  const { steps, currentStepIndex, goToStep } = usePlaybackStore();

  if (steps.length === 0) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-border bg-bg-surface-light p-6 text-sm text-text-muted">
        <ListChecks className="mr-2 h-4 w-4" />
        Generate steps to inspect the execution log.
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto rounded-xl border border-border bg-bg-surface-light p-3">
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={step.id}>
            <button
              onClick={() => goToStep(index)}
              className={cn(
                "w-full rounded-lg border p-3 text-left transition-colors",
                index === currentStepIndex
                  ? "border-primary bg-primary-muted text-primary"
                  : "border-border bg-bg-surface text-text-secondary hover:border-border-hover hover:text-text-primary"
              )}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-mono font-bold uppercase tracking-wider">Step {step.stepNumber}</span>
                <span className="rounded bg-bg-surface-light px-2 py-0.5 text-[10px] uppercase text-text-muted">{step.actionType}</span>
              </div>
              <p className="mt-1 text-sm font-medium">{step.title}</p>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
