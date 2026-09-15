"use client";

import { useState, useEffect, useCallback } from "react";
import { usePlaybackStore } from "@/stores/playback-store";

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function usePracticeMode() {
  const { currentStepIndex, totalSteps, isPlaying, pause, steps } = usePlaybackStore();

  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showPracticePrompt, setShowPracticePrompt] = useState(false);
  const [practiceOptions, setPracticeOptions] = useState<string[]>([]);
  const [practiceAnswer, setPracticeAnswer] = useState<string>("");
  const [practiceSelected, setPracticeSelected] = useState<string | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<"correct" | "incorrect" | null>(null);

  useEffect(() => {
    if (!isPracticeMode || !isPlaying || currentStepIndex >= totalSteps - 1) return;

    const shouldPause = Math.random() < 0.1;
    if (shouldPause) {
      pause();

      const nextStep = steps[currentStepIndex + 1];
      if (!nextStep) return;

      const answerType = nextStep.actionType;

      let answerText = "Continue operation";
      if (answerType === "compare") answerText = "Compare elements";
      else if (answerType === "swap") answerText = "Swap elements";
      else if (answerType === "update") answerText = "Update a value";
      else if (answerType === "highlight") answerText = "Highlight an element";

      const distractorOptions = [
        "Compare elements",
        "Swap elements",
        "Update a value",
        "Highlight an element",
        "Continue operation",
      ].filter((o) => o !== answerText);

      const options = shuffleArray([answerText, ...shuffleArray(distractorOptions).slice(0, 3)]);

      const timer = setTimeout(() => {
        setPracticeOptions(options);
        setPracticeAnswer(answerText);
        setPracticeSelected(null);
        setPracticeFeedback(null);
        setShowPracticePrompt(true);
      }, 0);

      return () => clearTimeout(timer);
    }
  }, [currentStepIndex, isPracticeMode, isPlaying, totalSteps, steps, pause]);

  const handlePracticeSubmit = useCallback(() => {
    if (practiceSelected === practiceAnswer) {
      setPracticeFeedback("correct");
      setTimeout(() => {
        setShowPracticePrompt(false);
        const { play } = usePlaybackStore.getState();
        play();
      }, 1500);
    } else {
      setPracticeFeedback("incorrect");
    }
  }, [practiceSelected, practiceAnswer]);

  const handlePracticeSkip = useCallback(() => {
    setShowPracticePrompt(false);
    const { play } = usePlaybackStore.getState();
    play();
  }, []);

  const togglePracticeMode = useCallback(() => {
    setIsPracticeMode((prev) => !prev);
  }, []);

  return {
    isPracticeMode,
    setIsPracticeMode,
    togglePracticeMode,
    showPracticePrompt,
    practiceOptions,
    practiceAnswer,
    practiceSelected,
    setPracticeSelected,
    practiceFeedback,
    handlePracticeSubmit,
    handlePracticeSkip,
  };
}
