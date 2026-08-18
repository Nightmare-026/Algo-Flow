"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { FastForward, Pause, Play, RotateCcw, Settings, SkipBack, SkipForward } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePlaybackStore, getActiveSpeedMs } from "@/stores/playback-store";

const controlClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-surface neu-btn text-text-secondary transition-colors hover:text-primary-active focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-35";

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
    speed,
    customSpeedMs,
    reducedMotion,
    setReducedMotion,
  } = usePlaybackStore();
  const pathname = usePathname();

  const isFirstStep = currentStepIndex === 0;
  const activeSpeedMs = getActiveSpeedMs(speed, customSpeedMs);

  useEffect(() => {
    if (!isPlaying) return;

    // If speed is set to exactly 0, play through immediately (instant playback mode)
    if (activeSpeedMs === 0) {
      skipToEnd();
      return;
    }

    const interval = window.setInterval(() => {
      nextStep();
    }, activeSpeedMs);

    return () => window.clearInterval(interval);
  }, [activeSpeedMs, isPlaying, nextStep, skipToEnd]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        usePlaybackStore.getState().pause();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (usePlaybackStore.getState().isPlaying) {
      usePlaybackStore.getState().pause();
    }
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.tagName === "SELECT" ||
          (activeElement as HTMLElement).isContentEditable)
      ) {
        return;
      }

      if (event.key === " " || event.key === "k") {
        event.preventDefault();
        if (totalSteps > 0) {
          if (isPlaying) pause();
          else play();
        }
      } else if (event.key === "ArrowLeft" || event.key === "j") {
        event.preventDefault();
        previousStep();
      } else if (event.key === "ArrowRight" || event.key === "l") {
        event.preventDefault();
        nextStep();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, nextStep, pause, play, previousStep, totalSteps]);

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
        className="mx-1 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary neu-btn text-white transition-transform hover:bg-primary-hover hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45"
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
