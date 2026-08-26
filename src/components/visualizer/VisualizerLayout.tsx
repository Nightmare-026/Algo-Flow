"use client";

import { ReactNode, useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BookmarkPlus,
  Maximize2,
  Share2,
  Bookmark,
  Save,
  Trophy,
  X,
  LayoutDashboard,
} from "lucide-react";
import { Algorithm, CodeExample } from "@/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { PlaybackControls } from "./PlaybackControls";
import { SpeedSlider, SpeedDisplay } from "./SpeedSlider";
import { StepTimeline } from "./StepTimeline";
import { StepLegend, type StepLegendItem } from "./StepLegend";
import { InspectorPanel } from "./InspectorPanel";
import { usePlaybackStore } from "@/stores/playback-store";
import {
  useStatusToast,
  useVisualizerBookmark,
  useVisualizerCompletion,
  useVisualizerSaveSession,
} from "./useVisualizerActions";
import type { CodeLineMapping } from "@/visualizers/registry/types";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface VisualizerLayoutProps {
  algorithm: Algorithm;
  codeExamples: CodeExample[];
  codeLineMapping?: ReadonlyArray<CodeLineMapping>;
  legend?: ReadonlyArray<StepLegendItem>;
  children: ReactNode;
  controls?: ReactNode;
}

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function VisualizerLayout({
  algorithm,
  codeExamples,
  codeLineMapping,
  legend,
  children,
  controls,
}: VisualizerLayoutProps) {
  const pathname = usePathname();
  const { currentStepIndex, totalSteps, reducedMotion, isPlaying, pause, steps } =
    usePlaybackStore();
  const [activeRightTab, setActiveRightTab] = useState<"pseudocode" | "code">("pseudocode");
  const [activeLowerTab, setActiveLowerTab] = useState<"explanation" | "log">("explanation");
  const [activeLanguage, setActiveLanguage] = useState<string>("python");
  // activeLanguage is used in InspectorPanel via prop drilling
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showPracticePrompt, setShowPracticePrompt] = useState(false);
  const [practiceOptions, setPracticeOptions] = useState<string[]>([]);
  const [practiceAnswer, setPracticeAnswer] = useState<string>("");
  const [practiceSelected, setPracticeSelected] = useState<string | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [tourStep, setTourStep] = useState(0);
  const canvasRegionRef = useRef<HTMLDivElement>(null);
  const tourInitializedRef = useRef(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const { statusMessage, showStatus } = useStatusToast();
  const { isBookmarked, handleToggleBookmark } = useVisualizerBookmark(algorithm.id, showStatus);
  useVisualizerCompletion(algorithm.id, showStatus);
  const { isSaving, handleSaveSession } = useVisualizerSaveSession(
    algorithm.id,
    algorithm.name,
    activeLanguage,
    showStatus
  );

  const handleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        showStatus("Fullscreen closed");
      } else {
        await canvasRegionRef.current?.requestFullscreen();
        showStatus("Canvas opened fullscreen");
      }
    } catch {
      showStatus("Fullscreen is not available");
    }
  }, [showStatus]);

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

  // Custom event handlers for keyboard shortcuts
  useEffect(() => {
    const handlePracticeToggle = () => setIsPracticeMode((prev) => !prev);
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
  }, [handleFullscreen, handleToggleBookmark, handleSaveSession]);

  // Onboarding tour for first-time visitors
  useEffect(() => {
    if (tourInitializedRef.current) return;
    tourInitializedRef.current = true;
    // Use setTimeout to defer state update until after render
    setTimeout(() => {
      // Skip tour in test environments (Playwright sets navigator.webdriver)
      if (typeof window !== "undefined" && window.navigator.webdriver) {
        return;
      }
      // Also skip if a test flag is present in localStorage
      if (localStorage.getItem("playwright-test-mode") === "true") {
        return;
      }
      const hasSeenTour = localStorage.getItem(`visualizer-tour-${algorithm.slug}`);
      if (!hasSeenTour) {
        setShowTour(true);
        localStorage.setItem(`visualizer-tour-${algorithm.slug}`, "true");
      }
    }, 0);
  }, [algorithm.slug]);

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

  const handlePracticeSubmit = () => {
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
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showStatus("Visualizer link copied");
    } catch {
      showStatus("Could not copy link");
    }
  };

  return (
    <main
      id="main-content"
      data-reduced-motion={reducedMotion}
      className="flex min-h-screen lg:h-dvh flex-col lg:overflow-hidden bg-background text-text-primary"
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:left-4 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white"
      >
        Skip to main content
      </a>
      {/* Top Workstation Header - Compact */}
      <header className="flex min-h-[48px] shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border bg-surface/80 backdrop-blur-md px-4 py-2 shadow-[var(--shadow-raised-sm)] z-30">
        <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:flex-1 sm:gap-3">
          <Link
            href={`/visualizers/${algorithm.dataStructureId.replace("ds_", "").replace("_", "-")}`}
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-all hover:border-primary/40 hover:text-primary active:scale-95 shadow-[var(--shadow-raised-sm)]"
            aria-label="Back to category"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>

          <div className="min-w-0">
            <h1 className="truncate text-sm sm:text-base font-bold font-display leading-tight text-text-primary">
              {algorithm.name}
            </h1>
            <div className="mt-0 flex flex-wrap items-center gap-1.5 text-[10px] text-text-muted">
              <span
                className={cn(
                  "rounded-md border px-1.5 py-0.2 text-[10px] font-mono font-bold uppercase tracking-wider",
                  algorithm.difficulty === "easy"
                    ? "bg-success-muted text-success border-success/30"
                    : algorithm.difficulty === "medium"
                      ? "bg-warning-muted text-warning border-warning/30"
                      : "bg-error-muted text-error border-error/30"
                )}
              >
                {algorithm.difficulty}
              </span>
              <span className="font-mono text-[11px]">Time: {algorithm.timeComplexityAverage}</span>
              <span className="font-mono text-[11px]">Space: {algorithm.spaceComplexity}</span>
            </div>
          </div>
        </div>

        {/* Action Suite */}
        <div className="flex w-full max-w-full flex-wrap items-center justify-start gap-1.5 sm:w-auto sm:justify-end">
          <Link
            href={`/quizzes/${algorithm.id}`}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-primary/40 bg-primary-muted px-3 text-xs font-bold text-primary shadow-[var(--shadow-raised-sm)] hover:bg-primary hover:text-white transition-all active:scale-95"
            title="Take Knowledge Quiz"
          >
            <Trophy className="h-3.5 w-3.5" />
            Take Quiz
          </Link>

          <button
            onClick={() => setIsPracticeMode(!isPracticeMode)}
            className={cn(
              "min-h-9 rounded-xl px-3 text-xs font-bold transition-all shadow-[var(--shadow-raised-sm)] border active:scale-95 cursor-pointer",
              isPracticeMode
                ? "bg-primary text-white border-primary"
                : "border-border bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover"
            )}
            title="Toggle Interactive Practice Mode"
          >
            Practice Mode
          </button>

          <div className="mx-1 h-5 w-px bg-border" />

          <button
            onClick={handleToggleBookmark}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface transition-all shadow-[var(--shadow-raised-sm)] hover:border-primary/40 active:scale-95 cursor-pointer",
              isBookmarked ? "text-warning border-warning/40" : "text-text-muted hover:text-primary"
            )}
            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
            aria-label={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
          >
            {isBookmarked ? (
              <Bookmark className="h-4 w-4 fill-current" />
            ) : (
              <BookmarkPlus className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={handleSaveSession}
            disabled={isSaving}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-muted shadow-[var(--shadow-raised-sm)] transition-all hover:border-primary/40 hover:text-primary active:scale-95 disabled:opacity-40 cursor-pointer"
            title="Save Session State"
            aria-label="Save Session"
          >
            <Save className="h-4 w-4" />
          </button>

          <button
            onClick={handleShare}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-muted shadow-[var(--shadow-raised-sm)] transition-all hover:border-primary/40 hover:text-primary active:scale-95 cursor-pointer"
            title="Share Visualizer Link"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
          </button>

          {/* Inspector Toggle (Mobile) */}
          <button
            onClick={() => setShowInspector(!showInspector)}
            className={cn(
              "inline-flex lg:hidden h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface transition-all shadow-[var(--shadow-raised-sm)] hover:border-primary/40 active:scale-95 cursor-pointer",
              showInspector
                ? "text-primary border-primary/40"
                : "text-text-muted hover:text-primary"
            )}
            title={showInspector ? "Hide Inspector" : "Show Inspector"}
            aria-label={showInspector ? "Hide Inspector" : "Show Inspector"}
            aria-expanded={showInspector}
          >
            {showInspector ? <X className="h-4 w-4" /> : <LayoutDashboard className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 450, damping: 30 }}
            aria-live="polite"
            className="fixed right-4 top-16 z-[70] flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-xs font-bold text-text-primary shadow-[var(--shadow-float)] backdrop-blur-md"
          >
            <span>{statusMessage}</span>
            {statusMessage.toLowerCase().includes("log in") && (
              <Link
                href={`/login?next=${encodeURIComponent(pathname)}`}
                className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm hover:bg-primary-hover"
              >
                Log in
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Split */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">
        {/* Left Column: Canvas, Legend, Input Controls, and Playback Footer */}
        <div className="flex min-w-0 w-full shrink-0 flex-col h-auto min-h-[360px] sm:min-h-[480px] lg:min-h-0 lg:h-auto lg:w-0 lg:flex-1 lg:shrink">
          <div className="relative flex flex-1 flex-col overflow-hidden bg-background min-h-0">
            {controls && (
              <div className="w-full shrink-0 border-b border-border bg-surface/50 p-2.5 shadow-[var(--shadow-raised-sm)]">
                {controls}
              </div>
            )}
            {legend && legend.length > 0 ? <StepLegend items={legend} /> : null}

            <div ref={canvasRegionRef} className="relative flex-1 overflow-hidden min-h-0">
              {children}

              {/* Practice Prompt Modal */}
              <AnimatePresence>
                {showPracticePrompt && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
                  >
                    <motion.div
                      initial={{ scale: 0.92, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.92, opacity: 0, y: 10 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="neu-float w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-float)]"
                    >
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                        Interactive Challenge
                      </span>
                      <h3 className="mt-1 text-xl font-bold font-display text-text-primary">
                        Predict Next Step
                      </h3>
                      <p className="mt-2 text-xs text-text-secondary">
                        What operation will the algorithm perform in the next transition?
                      </p>

                      <div className="space-y-2.5 mt-5 mb-6">
                        {practiceOptions.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => setPracticeSelected(opt)}
                            className={cn(
                              "w-full rounded-xl border p-3.5 text-left text-xs font-bold transition-all cursor-pointer select-none",
                              practiceSelected === opt
                                ? "border-primary bg-primary-muted text-primary shadow-[var(--shadow-inset)]"
                                : "border-border bg-surface text-text-secondary hover:border-border-hover hover:text-text-primary",
                              practiceFeedback === "correct" &&
                                opt === practiceAnswer &&
                                "border-success bg-success-muted text-success font-bold",
                              practiceFeedback === "incorrect" &&
                                practiceSelected === opt &&
                                "border-error bg-error-muted text-error font-bold"
                            )}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-border pt-4">
                        <button
                          onClick={() => {
                            setShowPracticePrompt(false);
                            const { play } = usePlaybackStore.getState();
                            play();
                          }}
                          className="text-xs font-bold text-text-muted hover:text-text-primary cursor-pointer"
                        >
                          Skip
                        </button>
                        <button
                          onClick={handlePracticeSubmit}
                          disabled={!practiceSelected || practiceFeedback === "correct"}
                          className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover disabled:opacity-40 cursor-pointer"
                        >
                          Submit Answer
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Floating Step Badge */}
              <div className="neu-inset absolute right-4 top-4 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-text-primary border border-border shadow-[var(--shadow-inset)] backdrop-blur-md">
                {totalSteps > 0 ? (
                  `Step ${currentStepIndex + 1} / ${totalSteps}`
                ) : (
                  <span className="inline-block h-4 w-16 animate-pulse rounded bg-muted" />
                )}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={handleFullscreen}
                className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-muted shadow-[var(--shadow-raised-sm)] transition-all hover:border-primary/40 hover:text-primary active:scale-95 cursor-pointer"
                title="Toggle Fullscreen Canvas"
                aria-label="Fullscreen Canvas"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Keyboard Shortcuts Modal */}
          <AnimatePresence>
            {showShortcuts && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
                role="dialog"
                aria-modal="true"
                aria-labelledby="shortcuts-title"
              >
                <motion.div
                  initial={{ scale: 0.92, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.92, opacity: 0, y: 10 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className="neu-float w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-float)] max-h-[85vh] overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2
                      id="shortcuts-title"
                      className="text-xl font-bold font-display text-text-primary"
                    >
                      Keyboard Shortcuts
                    </h2>
                    <button
                      onClick={() => setShowShortcuts(false)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
                      aria-label="Close shortcuts"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                      Playback
                    </div>
                    <dl className="grid grid-cols-[auto_1fr] gap-2">
                      <dt className="font-mono font-bold text-text-secondary kbd-style">Space</dt>
                      <dd className="text-text-secondary">Play / Pause</dd>
                      <dt className="font-mono font-bold text-text-secondary kbd-style">← / J</dt>
                      <dd className="text-text-secondary">Previous Step</dd>
                      <dt className="font-mono font-bold text-text-secondary kbd-style">→ / L</dt>
                      <dd className="text-text-secondary">Next Step</dd>
                      <dt className="font-mono font-bold text-text-secondary kbd-style">R</dt>
                      <dd className="text-text-secondary">Restart</dd>
                      <dt className="font-mono font-bold text-text-secondary kbd-style">Shift + →</dt>
                      <dd className="text-text-secondary">Jump to End</dd>
                    </dl>
                    <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary mt-4">
                      Navigation
                    </div>
                    <dl className="grid grid-cols-[auto_1fr] gap-2">
                      <dt className="font-mono font-bold text-text-secondary kbd-style">?</dt>
                      <dd className="text-text-secondary">Show this help</dd>
                      <dt className="font-mono font-bold text-text-secondary kbd-style">P</dt>
                      <dd className="text-text-secondary">Toggle Practice Mode</dd>
                      <dt className="font-mono font-bold text-text-secondary kbd-style">F</dt>
                      <dd className="text-text-secondary">Fullscreen Canvas</dd>
                      <dt className="font-mono font-bold text-text-secondary kbd-style">B</dt>
                      <dd className="text-text-secondary">Toggle Bookmark</dd>
                      <dt className="font-mono font-bold text-text-secondary kbd-style">S</dt>
                      <dd className="text-text-secondary">Save Session</dd>
                    </dl>
                    <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary mt-4">
                      Panels
                    </div>
                    <dl className="grid grid-cols-[auto_1fr] gap-2">
                      <dt className="font-mono font-bold text-text-secondary kbd-style">1</dt>
                      <dd className="text-text-secondary">Pseudocode Tab</dd>
                      <dt className="font-mono font-bold text-text-secondary kbd-style">2</dt>
                      <dd className="text-text-secondary">Code Tab</dd>
                      <dt className="font-mono font-bold text-text-secondary kbd-style">E</dt>
                      <dd className="text-text-secondary">Explanation Tab</dd>
                      <dt className="font-mono font-bold text-text-secondary kbd-style">L</dt>
                      <dd className="text-text-secondary">Step Log Tab</dd>
                    </dl>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* VCR Playback Controls & Timeline Bar - Compact */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-2 border-t border-border bg-surface px-3 py-2 z-20 shadow-[var(--shadow-raised-sm)] shrink-0">
            <div className="flex items-center gap-2">
              <PlaybackControls />
            </div>
            <div className="flex-1 w-full flex items-center gap-2">
              <StepTimeline />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <SpeedSlider />
              <SpeedDisplay />
            </div>
          </div>
        </div>

        {/* Right Column: Dual-Split Inspector Panels (Pseudocode/Code & Explanation/Log) */}
        {/* Mobile: Bottom Sheet Inspector */}
        <div
          className={cn(
            "fixed inset-x-0 bottom-0 z-40 transform transition-transform duration-300 ease-out lg:hidden",
            showInspector ? "translate-y-0" : "translate-y-full"
          )}
          role="dialog"
          aria-modal="true"
          aria-label="Inspector panels"
        >
          {showInspector && (
            <div
              className="absolute inset-0 bg-background/50 backdrop-blur-sm"
              onClick={() => setShowInspector(false)}
              aria-hidden="true"
            />
          )}
          <aside className="relative flex max-h-[75vh] w-full shrink-0 flex-col border-t border-border bg-surface shadow-[var(--shadow-float)] rounded-t-2xl">
            {/* Drag Handle */}
            <div className="mx-auto mt-2 h-1.5 w-10 rounded-full bg-border" aria-hidden="true" />
            {/* Mobile Inspector (only one CodePanel instance) */}
            {isMobile && (
              <InspectorPanel
                activeRightTab={activeRightTab}
                setActiveRightTab={setActiveRightTab}
                activeLowerTab={activeLowerTab}
                setActiveLowerTab={setActiveLowerTab}
                setActiveLanguage={setActiveLanguage}
                algorithm={algorithm}
                codeExamples={codeExamples}
                codeLineMapping={codeLineMapping}
              />
            )}
          </aside>
        </div>

        {/* Desktop: Right Column Inspector */}
        {!isMobile && (
          <aside className="lg:flex h-full flex-col border-l border-border bg-surface-hover/40 lg:w-[26rem]">
            <InspectorPanel
              activeRightTab={activeRightTab}
              setActiveRightTab={setActiveRightTab}
              activeLowerTab={activeLowerTab}
              setActiveLowerTab={setActiveLowerTab}
              setActiveLanguage={setActiveLanguage}
              algorithm={algorithm}
              codeExamples={codeExamples}
              codeLineMapping={codeLineMapping}
            />
          </aside>
        )}
      </div>

      {/* Onboarding Tour Modal */}
      <AnimatePresence>
        {showTour && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tour-title"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="neu-float w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-float)]"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="tour-title" className="text-xl font-bold font-display text-text-primary">
                  Welcome to {algorithm.name}
                </h2>
                <button
                  onClick={() => setShowTour(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
                  aria-label="Close tour"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {(() => {
                const tourSteps = [
                  {
                    title: "Canvas & Visualization",
                    description:
                      "Watch the algorithm animate step-by-step. Use the timeline or keyboard shortcuts (←/→) to navigate.",
                  },
                  {
                    title: "Playback Controls",
                    description:
                      "Play, pause, restart, or jump to any step. Adjust speed with the slider.",
                  },
                  {
                    title: "Step Legend",
                    description:
                      "Color-coded indicators show what each visual state means (e.g., compared, current, found).",
                  },
                  {
                    title: "Inspector Panels",
                    description:
                      "View synchronized pseudocode, source code (4 languages), step-by-step explanation, and execution log.",
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
                const step = tourSteps[tourStep];
                return (
                  <>
                    <div className="mb-6">
                      <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary mb-2">
                        Step {tourStep + 1} of {tourSteps.length}
                      </div>
                      <h3 className="text-lg font-bold font-display text-text-primary">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm text-text-secondary">{step.description}</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      {tourStep > 0 && (
                        <button
                          onClick={() => setTourStep((s) => s - 1)}
                          className="text-xs font-bold text-text-muted hover:text-text-primary cursor-pointer"
                        >
                          Previous
                        </button>
                      )}
                      <div className="flex items-center gap-2">
                        {tourSteps.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setTourStep(i)}
                            className={cn(
                              "h-1.5 w-8 rounded-full transition-colors",
                              i === tourStep ? "bg-primary" : "bg-border"
                            )}
                            aria-label={`Go to step ${i + 1}`}
                          />
                        ))}
                      </div>
                      {tourStep < tourSteps.length - 1 ? (
                        <button
                          onClick={() => setTourStep((s) => s + 1)}
                          className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover cursor-pointer"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowTour(false)}
                          className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover cursor-pointer"
                        >
                          Get Started
                        </button>
                      )}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
