"use client";

import { useEffect } from "react";
import { FastForward, Pause, Play, RotateCcw, Settings, SkipBack, SkipForward } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePlaybackStore } from "@/stores/playback-store";

const controlClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface neu-btn text-text-secondary transition-colors hover:text-primary-active disabled:cursor-not-allowed disabled:opacity-35";

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
    customSpeedMs,
    reducedMotion,
    setReducedMotion,
  } = usePlaybackStore();

  const isFirstStep = currentStepIndex === 0;

  useEffect(() => {
    if (!isPlaying) return;
    
    // If speed is set to exactly 0, play through immediately (instant playback mode)
    if (customSpeedMs === 0) {
      skipToEnd();
      return;
    }
    
    const interval = window.setInterval(() => {
      nextStep();
    }, customSpeedMs);
    
    return () => window.clearInterval(interval);
  }, [customSpeedMs, isPlaying, nextStep, skipToEnd]);

  return (
    <div className="flex items-center gap-1" aria-label="Playback controls">
      <button
        type="button"
        onClick={restart}
        disabled={isFirstStep}
        className={controlClass}
        title="Restart"
        aria-label="Restart from the first step"
      >
        <RotateCcw className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={previousStep}
        disabled={isFirstStep}
        className={controlClass}
        title="Previous step"
        aria-label="Previous step"
      >
        <SkipBack className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={isPlaying ? pause : play}
        disabled={totalSteps === 0}
        className="mx-1 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary neu-btn text-white transition-transform hover:bg-primary-hover hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45"
        title={isPlaying ? "Pause" : "Play"}
        aria-label={isPlaying ? "Pause playback" : "Play visualization"}
      >
        {isPlaying ? (
          <Pause className="h-5 w-5 fill-current" />
        ) : (
          <Play className="ml-0.5 h-5 w-5 fill-current" />
        )}
      </button>

      <button
        type="button"
        onClick={nextStep}
        disabled={isComplete || totalSteps === 0}
        className={controlClass}
        title="Next step"
        aria-label="Next step"
      >
        <SkipForward className="h-5 w-5" />
      </button>

      <button
        type="button"
        onClick={skipToEnd}
        disabled={isComplete || totalSteps === 0}
        className={controlClass}
        title="Jump to end"
        aria-label="Jump to final step"
      >
        <FastForward className="h-5 w-5" />
      </button>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={controlClass}
            title="Playback settings"
            aria-label="Playback settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-64 border-white/75 bg-surface-light p-4 text-text-primary shadow-[var(--shadow-float)]"
          align="end"
        >
          <div className="space-y-4">
            <h2 className="text-sm font-bold">Playback settings</h2>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="reduced-motion" className="cursor-pointer text-sm">
                Reduced motion
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
