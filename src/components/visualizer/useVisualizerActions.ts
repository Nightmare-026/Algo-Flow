import { useState, useEffect, useRef, useCallback } from "react";
import { getBookmarks, toggleBookmark } from "@/features/bookmarks/api";
import { saveSession } from "@/features/sessions/api";
import { markCompleted } from "@/features/progress/api";
import { usePlaybackStore } from "@/stores/playback-store";

export function useVisualizerBookmark(algorithmId: string, onStatus: (msg: string) => void) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getBookmarks()
      .then((bookmarks) => {
        if (isMounted && bookmarks.includes(algorithmId)) setIsBookmarked(true);
      })
      .catch(() => {
        if (isMounted) onStatus("Bookmarks could not be loaded.");
      });
    return () => {
      isMounted = false;
    };
  }, [algorithmId, onStatus]);

  const handleToggleBookmark = async () => {
    const previousState = isBookmarked;
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      const result = await toggleBookmark(algorithmId, nextState);
      if (!result.ok) setIsBookmarked(previousState);
      onStatus(result.message);
    } catch {
      setIsBookmarked(previousState);
      onStatus("Bookmark could not be updated.");
    }
  };

  return { isBookmarked, handleToggleBookmark };
}

export function useVisualizerCompletion(algorithmId: string, onStatus: (msg: string) => void) {
  const { currentStepIndex, totalSteps } = usePlaybackStore();
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (totalSteps > 0 && currentStepIndex === totalSteps - 1 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      markCompleted(algorithmId)
        .then((result) => {
          if (!result.ok) onStatus(result.message);
        })
        .catch(() => {
          onStatus("Progress could not be saved.");
        });
    }
  }, [currentStepIndex, totalSteps, algorithmId, onStatus]);
}

export function useVisualizerSaveSession(
  algorithmId: string,
  algorithmName: string,
  activeLanguage: string,
  onStatus: (msg: string) => void
) {
  const [isSaving, setIsSaving] = useState(false);
  const { currentStepIndex, steps, customSpeedMs } = usePlaybackStore();

  const handleSaveSession = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const name = `${algorithmName} - Step ${currentStepIndex + 1}`;
      const speedLabel = customSpeedMs <= 400 ? "fast" : customSpeedMs >= 1500 ? "slow" : "normal";
      const result = await saveSession(
        algorithmId,
        name,
        {},
        currentStepIndex,
        steps[currentStepIndex]?.dataState || {},
        speedLabel,
        activeLanguage
      );
      onStatus(result.message);
    } catch {
      onStatus("Session could not be saved.");
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, handleSaveSession };
}

export function useStatusToast() {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const statusTimerRef = useRef<number | null>(null);

  const showStatus = useCallback((message: string) => {
    setStatusMessage(message);
    if (statusTimerRef.current) window.clearTimeout(statusTimerRef.current);
    statusTimerRef.current = window.setTimeout(() => setStatusMessage(null), 2400);
  }, []);

  useEffect(() => {
    return () => {
      if (statusTimerRef.current) window.clearTimeout(statusTimerRef.current);
    };
  }, []);

  return { statusMessage, showStatus };
}
