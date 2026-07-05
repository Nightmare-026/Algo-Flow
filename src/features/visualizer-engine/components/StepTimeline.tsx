"use client";

import { usePlaybackStore } from "../playback-store";
import { cn } from "@/lib/utils";

export function StepTimeline() {
  const { steps, currentStepIndex, goToStep, totalSteps } = usePlaybackStore();

  if (totalSteps === 0) return null;

  return (
    <div className="w-full flex items-center h-2 bg-bg-surface-light rounded-full overflow-hidden border border-border group relative">
      {steps.map((step, index) => {
        const isPassed = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <div
            key={step.id}
            className="h-full flex-1 relative group/segment cursor-pointer"
            onClick={() => goToStep(index)}
          >
            {/* The bar segment */}
            <div
              className={cn(
                "w-full h-full border-r border-bg-deep/20 transition-colors duration-300",
                isCurrent
                  ? "bg-primary"
                  : isPassed
                  ? "bg-primary-muted"
                  : "bg-transparent hover:bg-border"
              )}
            />

            {/* Tooltip on hover */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-bg-surface-elevated text-text-primary text-xs font-medium rounded shadow-lg opacity-0 group-hover/segment:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-10 border border-border">
              Step {index + 1}: {step.operation}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-bg-surface-elevated" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
