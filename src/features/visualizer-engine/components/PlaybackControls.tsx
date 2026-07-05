"use client";

import { usePlaybackStore } from "../playback-store";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function PlaybackControls() {
  const { 
    isPlaying, 
    play, 
    pause, 
    nextStep, 
    previousStep, 
    restart, 
    skipToEnd,
    isComplete,
    currentStepIndex,
    totalSteps,
    customSpeedMs
  } = usePlaybackStore();

  const isFirstStep = currentStepIndex === 0;

  // Global playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (currentStepIndex >= totalSteps - 1) {
        pause();
      } else {
        nextStep();
      }
    }, customSpeedMs);

    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, totalSteps, customSpeedMs, nextStep, pause]);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={restart}
        disabled={isFirstStep}
        className={cn(
          "p-2 rounded-lg transition-colors",
          isFirstStep ? "text-text-muted cursor-not-allowed" : "text-text-secondary hover:text-primary hover:bg-primary-muted"
        )}
        title="Restart"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      <button
        onClick={previousStep}
        disabled={isFirstStep}
        className={cn(
          "p-2 rounded-lg transition-colors",
          isFirstStep ? "text-text-muted cursor-not-allowed" : "text-text-secondary hover:text-primary hover:bg-primary-muted"
        )}
        title="Previous Step"
      >
        <SkipBack className="w-5 h-5" />
      </button>

      <button
        onClick={isPlaying ? pause : play}
        disabled={totalSteps === 0}
        className="p-3 mx-1 bg-primary text-bg-deep rounded-full hover:bg-primary-hover hover:scale-105 active:scale-95 transition-all shadow-glow-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <Pause className="w-6 h-6 fill-current" />
        ) : (
          <Play className="w-6 h-6 fill-current ml-0.5" />
        )}
      </button>

      <button
        onClick={nextStep}
        disabled={isComplete}
        className={cn(
          "p-2 rounded-lg transition-colors",
          isComplete ? "text-text-muted cursor-not-allowed" : "text-text-secondary hover:text-primary hover:bg-primary-muted"
        )}
        title="Next Step"
      >
        <SkipForward className="w-5 h-5" />
      </button>

      <button
        onClick={skipToEnd}
        disabled={isComplete}
        className={cn(
          "p-2 rounded-lg transition-colors",
          isComplete ? "text-text-muted cursor-not-allowed" : "text-text-secondary hover:text-primary hover:bg-primary-muted"
        )}
        title="Skip to End"
      >
        <FastForward className="w-5 h-5" />
      </button>
    </div>
  );
}
