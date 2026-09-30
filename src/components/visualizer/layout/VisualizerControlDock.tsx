"use client";

import { ChevronUp } from "lucide-react";
import { PlaybackControls } from "../PlaybackControls";
import { SpeedSlider, MobileSpeedSelector } from "../SpeedSlider";
import { StepTimeline } from "../StepTimeline";

export interface VisualizerControlDockProps {
  currentStepIndex: number;
  totalSteps: number;
  currentStepTitle?: string;
  onOpenInspector: () => void;
}

export function VisualizerControlDock({
  currentStepIndex,
  totalSteps,
  currentStepTitle,
  onOpenInspector,
}: VisualizerControlDockProps) {
  return (
    <>
      {/* Mobile Peek Step Bar (Glanceable current step with one-tap code expand) */}
      <div className="lg:hidden border-t border-border bg-surface/95 backdrop-blur-md px-3 py-1.5 visualizer-compact-strip flex items-center justify-between shrink-0 shadow-xs select-none">
        <button
          type="button"
          onClick={onOpenInspector}
          className="flex items-center gap-2 min-w-0 text-left cursor-pointer flex-1 touch-manipulation"
          aria-label="Open step explanation and code inspector"
        >
          <span className="shrink-0 font-mono text-[10px] font-bold text-primary bg-primary-muted px-1.5 py-0.5 rounded border border-primary/20">
            Step {currentStepIndex + 1}/{totalSteps}
          </span>
          <span className="text-xs font-semibold text-text-primary truncate">
            {currentStepTitle || "View step explanation & code"}
          </span>
        </button>
        <button
          type="button"
          onClick={onOpenInspector}
          className="inline-flex items-center gap-1 rounded-sm bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer shrink-0 ml-2 touch-manipulation"
        >
          <span>Code</span>
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* VCR Playback Controls & Timeline Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border bg-surface px-3 py-2 pb-safe visualizer-compact-dock z-20 shadow-card shrink-0 w-full min-w-0">
        <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2 shrink-0">
          <PlaybackControls />
          <div className="sm:hidden">
            <MobileSpeedSelector />
          </div>
        </div>
        <div className="flex-1 w-full min-w-0 flex items-center gap-2">
          <StepTimeline />
        </div>
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          <SpeedSlider />
        </div>
      </div>
    </>
  );
}
