"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { catalogStats } from "@/lib/catalog";

interface UseVisualizerTourOptions {
  algorithmSlug: string;
  algorithmName: string;
}

const TOUR_STEPS = [
  {
    title: "Canvas & Visualization",
    description:
      "Watch the algorithm animate step-by-step. Use the timeline or keyboard shortcuts (←/→) to navigate.",
  },
  {
    title: "Playback Controls",
    description: "Play, pause, restart, or jump to any step. Adjust speed with the slider.",
  },
  {
    title: "Step Legend",
    description:
      "Color-coded indicators show what each visual state means (e.g., compared, current, found).",
  },
  {
    title: "Inspector Panels",
    description: `View synchronized pseudocode, source code (${catalogStats.languageCount} languages), step-by-step explanation, and execution log.`,
  },
  {
    title: "Interactive Practice Mode",
    description:
      "Toggle on to get quizzed at random steps — predict the next operation to reinforce learning.",
  },
  {
    title: "Keyboard Shortcuts",
    description:
      "Press ? or Shift+/ anytime to see all shortcuts. Space = play/pause, 1/2 = pseudocode/code, E/L = explanation/log.",
  },
];

export function useVisualizerTour({ algorithmSlug, algorithmName }: UseVisualizerTourOptions) {
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const tourInitializedRef = useRef(false);
  const tourModalRef = useRef<HTMLDivElement>(null);
  const tourTriggerRef = useRef<HTMLElement | null>(null);

  // Initialize tour on first visit
  useEffect(() => {
    if (tourInitializedRef.current) return;
    tourInitializedRef.current = true;

    const timer = setTimeout(() => {
      // Skip tour in test environments (Playwright sets navigator.webdriver)
      if (typeof window !== "undefined" && window.navigator.webdriver) {
        return;
      }
      // Also skip if a test flag is present in localStorage
      if (localStorage.getItem("playwright-test-mode") === "true") {
        return;
      }
      const hasSeenTour = localStorage.getItem(`visualizer-tour-${algorithmSlug}`);
      if (!hasSeenTour) {
        setShowTour(true);
        localStorage.setItem(`visualizer-tour-${algorithmSlug}`, "true");
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [algorithmSlug]);

  // Focus management and keyboard trap for tour modal
  useEffect(() => {
    if (!showTour) return;

    tourTriggerRef.current = (document.activeElement as HTMLElement) || null;

    const timer = setTimeout(() => {
      const focusable = tourModalRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusable && focusable.length > 0) {
        focusable[0].focus();
      }
    }, 50);

    const handleModalKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setShowTour(false);
        return;
      }

      if (e.key === "Tab") {
        const focusable = tourModalRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleModalKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleModalKeyDown);
      tourTriggerRef.current?.focus?.();
    };
  }, [showTour]);

  const closeTour = useCallback(() => setShowTour(false), []);
  const nextTourStep = useCallback(() => setTourStep((s) => s + 1), []);
  const prevTourStep = useCallback(() => setTourStep((s) => s - 1), []);
  const goToTourStep = useCallback((i: number) => setTourStep(i), []);

  return {
    showTour,
    setShowTour,
    closeTour,
    tourStep,
    nextTourStep,
    prevTourStep,
    goToTourStep,
    tourModalRef,
    tourSteps: TOUR_STEPS,
    algorithmName,
  };
}
