"use client";

import { useEffect } from "react";
import { FastForward, Pause, Play, RotateCcw, SkipBack, SkipForward, Square, Settings } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { usePlaybackStore } from "../playback-store";

export function PlaybackControls() {
  const {
    isPlaying,
    play,
    pause,
    nextStep,
    previousStep,
    restart,
    skipToEnd,
    reset,
    isComplete,
    currentStepIndex,
    totalSteps,
    customSpeedMs,
    reducedMotion,
    setReducedMotion,
  } = usePlaybackStore();

  const isFirstStep = currentStepIndex === 0;

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
        className={cn("p-2 rounded-lg transition-colors", isFirstStep ? "text-text-muted cursor-not-allowed" : "text-text-secondary hover:text-primary hover:bg-primary-muted")}
        title="Restart"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      <button
        onClick={previousStep}
        disabled={isFirstStep}
        className={cn("p-2 rounded-lg transition-colors", isFirstStep ? "text-text-muted cursor-not-allowed" : "text-text-secondary hover:text-primary hover:bg-primary-muted")}
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
        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
      </button>

      <button
        onClick={nextStep}
        disabled={isComplete}
        className={cn("p-2 rounded-lg transition-colors", isComplete ? "text-text-muted cursor-not-allowed" : "text-text-secondary hover:text-primary hover:bg-primary-muted")}
        title="Next Step"
      >
        <SkipForward className="w-5 h-5" />
      </button>

      <button
        onClick={skipToEnd}
        disabled={isComplete}
        className={cn("p-2 rounded-lg transition-colors", isComplete ? "text-text-muted cursor-not-allowed" : "text-text-secondary hover:text-primary hover:bg-primary-muted")}
        title="Skip to End"
      >
        <FastForward className="w-5 h-5" />
      </button>

      <button
        onClick={reset}
        disabled={totalSteps === 0}
        className={cn("p-2 rounded-lg transition-colors", totalSteps === 0 ? "text-text-muted cursor-not-allowed" : "text-text-secondary hover:text-error hover:bg-error-muted")}
        title="Reset"
      >
        <Square className="w-4 h-4" />
      </button>

      {/* Settings Popover */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="p-2 text-text-secondary hover:text-primary hover:bg-primary-muted rounded-lg transition-colors" title="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-60 bg-surface-light border-border text-text-primary p-4" align="end">
          <div className="space-y-4">
            <h4 className="font-medium text-sm text-text-muted uppercase tracking-wider">Visualizer Settings</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="reduced-motion" className="text-sm cursor-pointer">
                Reduced Motion
              </Label>
              <Switch 
                id="reduced-motion" 
                checked={reducedMotion} 
                onCheckedChange={setReducedMotion} 
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
