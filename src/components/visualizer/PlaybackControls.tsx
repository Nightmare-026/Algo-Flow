"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { FastForward, Pause, Play, RotateCcw, Settings, SkipBack, SkipForward } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { usePlaybackStore, getActiveSpeedMs } from "@/stores/playback-store";

const controlClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface text-text-secondary shadow-[var(--shadow-raised-sm)] transition-all hover:border-primary/40 hover:text-primary active:scale-95 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-35";

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
    <div className="flex items-center gap-1.5" aria-label="Playback controls">
      <button
        type="button"
        onClick={restart}
        disabled={isFirstStep}
        className={controlClass}
        title="Restart"
        aria-label="Restart from the first step"
      >
        <RotateCcw className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={previousStep}
        disabled={isFirstStep}
        className={controlClass}
        title="Previous step"
        aria-label="Previous step"
      >
        <SkipBack className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={isPlaying ? pause : play}
        disabled={totalSteps === 0}
        className="mx-0.5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-white shadow-[var(--shadow-raised-sm)] transition-all hover:bg-primary-hover active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
        title={isPlaying ? "Pause" : "Play"}
        aria-label={isPlaying ? "Pause playback" : "Play visualization"}
      >
        {isPlaying ? (
          <Pause className="h-4.5 w-4.5 fill-current" />
        ) : (
          <Play className="ml-0.5 h-4.5 w-4.5 fill-current" />
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
        <SkipForward className="h-4 w-4" />
      </button>

      <button
        type="button"
        onClick={skipToEnd}
        disabled={isComplete || totalSteps === 0}
        className={controlClass}
        title="Jump to end"
        aria-label="Jump to final step"
      >
        <FastForward className="h-4 w-4" />
      </button>

      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={controlClass}
            title="Playback settings"
            aria-label="Playback settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          className="w-64 rounded-2xl border border-border bg-surface p-4 text-text-primary shadow-[var(--shadow-float)]"
          align="end"
        >
          <div className="space-y-4">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
              Playback settings
            </h2>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="reduced-motion" className="cursor-pointer text-xs font-semibold text-text-primary">
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
