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
      } else if (event.key === "p" || event.key === "P") {
        event.preventDefault();
        togglePracticeMode();
      } else if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        handleFullscreen();
      } else if (event.key === "b" || event.key === "B") {
        event.preventDefault();
        handleToggleBookmark();
      } else if (event.key === "s" || event.key === "S") {
        event.preventDefault();
        handleSaveSession();
      } else if (event.key === "1") {
        event.preventDefault();
        setActiveRightTab("pseudocode");
      } else if (event.key === "2") {
        event.preventDefault();
        setActiveRightTab("code");
      } else if (event.key === "e" || event.key === "E") {
        event.preventDefault();
        setActiveLowerTab("explanation");
      } else if (event.key === "l" || event.key === "L") {
        event.preventDefault();
        setActiveLowerTab("log");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
