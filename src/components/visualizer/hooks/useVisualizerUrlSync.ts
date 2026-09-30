"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { usePlaybackStore } from "@/stores/playback-store";
import type { PlaybackSpeed } from "@/types";

const VALID_SPEEDS = new Set(["0.25x", "0.5x", "0.75x", "1x", "2x", "slow", "normal", "fast"]);

export function useVisualizerUrlSync() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentStepIndex = usePlaybackStore((s) => s.currentStepIndex);
  const totalSteps = usePlaybackStore((s) => s.totalSteps);
  const speed = usePlaybackStore((s) => s.speed);
  const goToStep = usePlaybackStore((s) => s.goToStep);
  const setSpeed = usePlaybackStore((s) => s.setSpeed);

  // 1. Initial URL param hydration on mount
  useEffect(() => {
    if (!searchParams) return;

    const stepParam = searchParams.get("step");
    if (stepParam && totalSteps > 0) {
      const stepNum = parseInt(stepParam, 10);
      if (!isNaN(stepNum) && stepNum >= 0 && stepNum < totalSteps) {
        goToStep(stepNum);
      }
    }

    const speedParam = searchParams.get("speed");
    if (speedParam && VALID_SPEEDS.has(speedParam)) {
      setSpeed(speedParam as PlaybackSpeed);
    }
  }, [searchParams, totalSteps, goToStep, setSpeed]);

  // 2. Helper to construct shareable link reflecting current step and playback speed
  const getShareableUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    const url = new URL(window.location.href);
    url.searchParams.set("step", currentStepIndex.toString());
    url.searchParams.set("speed", speed);
    return url.toString();
  }, [currentStepIndex, speed]);

  // 3. Sync URL query without page reloads
  const updateUrlParams = useCallback(
    (step: number, currentSpeed: PlaybackSpeed) => {
      if (!pathname) return;
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("step", step.toString());
      params.set("speed", currentSpeed);
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    },
    [pathname, searchParams]
  );

  return {
    getShareableUrl,
    updateUrlParams,
  };
}
