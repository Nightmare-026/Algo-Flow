"use client";

import { useEffect, useCallback, useState } from "react";

interface UseVisualizerKeyboardOptions {
  togglePracticeMode: () => void;
  handleFullscreen: () => void;
  handleToggleBookmark: () => void;
  handleSaveSession: () => void;
  setActiveRightTab: (tab: "pseudocode" | "code") => void;
  setActiveLowerTab: (tab: "explanation" | "log") => void;
}

export function useVisualizerKeyboard({
  togglePracticeMode,
  handleFullscreen,
  handleToggleBookmark,
  handleSaveSession,
  setActiveRightTab,
  setActiveLowerTab,
}: UseVisualizerKeyboardOptions) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  // ? key to toggle shortcuts modal
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

      if (event.key === "?" || (event.key === "/" && event.shiftKey)) {
        event.preventDefault();
        setShowShortcuts((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Custom event handlers for keyboard shortcuts dispatched by PlaybackControls
  useEffect(() => {
    const handlePracticeToggle = () => togglePracticeMode();
    const handleFullscreenToggle = () => handleFullscreen();
    const handleBookmarkToggle = () => handleToggleBookmark();
    const handleSaveSessionTrigger = () => handleSaveSession();
    const handleTabPseudocode = () => setActiveRightTab("pseudocode");
    const handleTabCode = () => setActiveRightTab("code");
    const handleTabExplanation = () => setActiveLowerTab("explanation");
    const handleTabLog = () => setActiveLowerTab("log");

    window.addEventListener("toggle-practice-mode", handlePracticeToggle);
    window.addEventListener("toggle-fullscreen", handleFullscreenToggle);
    window.addEventListener("toggle-bookmark", handleBookmarkToggle);
    window.addEventListener("save-session", handleSaveSessionTrigger);
    window.addEventListener("tab-pseudocode", handleTabPseudocode);
    window.addEventListener("tab-code", handleTabCode);
    window.addEventListener("tab-explanation", handleTabExplanation);
    window.addEventListener("tab-log", handleTabLog);

    return () => {
      window.removeEventListener("toggle-practice-mode", handlePracticeToggle);
      window.removeEventListener("toggle-fullscreen", handleFullscreenToggle);
      window.removeEventListener("toggle-bookmark", handleBookmarkToggle);
      window.removeEventListener("save-session", handleSaveSessionTrigger);
      window.removeEventListener("tab-pseudocode", handleTabPseudocode);
      window.removeEventListener("tab-code", handleTabCode);
      window.removeEventListener("tab-explanation", handleTabExplanation);
      window.removeEventListener("tab-log", handleTabLog);
    };
  }, [
    togglePracticeMode,
    handleFullscreen,
    handleToggleBookmark,
    handleSaveSession,
    setActiveRightTab,
    setActiveLowerTab,
  ]);

  const closeShortcuts = useCallback(() => setShowShortcuts(false), []);

  return {
    showShortcuts,
    setShowShortcuts,
    closeShortcuts,
  };
}
