"use client";

import { ReactNode, useState, useRef, useCallback } from "react";
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
import { SpeedSlider } from "./SpeedSlider";
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
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { usePracticeMode } from "./hooks/usePracticeMode";
import { useVisualizerKeyboard } from "./hooks/useVisualizerKeyboard";
import { useVisualizerTour } from "./hooks/useVisualizerTour";

interface VisualizerLayoutProps {
  algorithm: Algorithm;
  codeExamples: CodeExample[];
  codeLineMapping?: ReadonlyArray<CodeLineMapping>;
  legend?: ReadonlyArray<StepLegendItem>;
  children: ReactNode;
  controls?: ReactNode;
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
  const { currentStepIndex, totalSteps, reducedMotion } = usePlaybackStore();
  const [activeRightTab, setActiveRightTab] = useState<"pseudocode" | "code">("pseudocode");
  const [activeLowerTab, setActiveLowerTab] = useState<"explanation" | "log">("explanation");
  const [activeLanguage, setActiveLanguage] = useState<string>("python");
  const [showInspector, setShowInspector] = useState(false);
  const canvasRegionRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 1023px)");

  // Extracted hooks
  const {
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
  } = usePracticeMode();

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

  const {
    showTour,
    closeTour,
    tourStep,
    nextTourStep,
    prevTourStep,
    goToTourStep,
    tourModalRef,
    tourSteps,
  } = useVisualizerTour({
    algorithmSlug: algorithm.slug,
    algorithmName: algorithm.name,
  });

  const { showShortcuts, closeShortcuts } = useVisualizerKeyboard({
    togglePracticeMode,
    handleFullscreen,
    handleToggleBookmark,
    handleSaveSession,
    setActiveRightTab,
    setActiveLowerTab,
  });

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
      className="flex h-dvh min-h-dvh flex-col overflow-hidden bg-background text-text-primary"
    >
      <div aria-hidden={showTour} className="flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Top Workstation Header */}
        <header className="flex shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border bg-surface/80 backdrop-blur-md px-3 sm:px-4 py-2 shadow-(--shadow-raised-sm) z-30">
          <div className="flex items-center justify-between gap-2 w-full sm:w-auto sm:flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Link
                href={`/visualizers/${algorithm.dataStructureId.replace("ds_", "").replace("_", "-")}`}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-text-muted transition-all hover:border-primary/40 hover:text-primary active:scale-95 shadow-(--shadow-raised-sm)"
                aria-label="Back to category"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="truncate text-sm sm:text-base font-bold font-display leading-tight text-text-primary">
                    {algorithm.name}
                  </h1>
                  <span
                    className={cn(
                      "shrink-0 rounded-md border px-1.5 py-0.2 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider",
                      algorithm.difficulty === "easy"
                        ? "bg-success-muted text-success border-success/30"
                        : algorithm.difficulty === "medium"
                          ? "bg-warning-muted text-warning border-warning/30"
                          : "bg-error-muted text-error border-error/30"
                    )}
                  >
                    {algorithm.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-text-muted font-mono">
                  <span>T: {algorithm.timeComplexityAverage}</span>
                  <span>S: {algorithm.spaceComplexity}</span>
                </div>
              </div>
            </div>

            {/* Mobile & Tablet top-right shortcuts: Inspector toggle + Theme toggle */}
            <div className="flex items-center gap-1.5 lg:hidden shrink-0">
              <button
                onClick={() => setShowInspector(!showInspector)}
                className={cn(
                  "inline-flex h-8 items-center gap-1 px-2.5 rounded-xl border text-xs font-bold transition-all shadow-(--shadow-raised-sm) active:scale-95 cursor-pointer",
                  showInspector
                    ? "bg-primary text-white border-primary"
                    : "border-primary/40 bg-primary-muted text-primary hover:bg-primary hover:text-white"
                )}
                title={showInspector ? "Close Inspector" : "Open Code & Explanation"}
                aria-label={showInspector ? "Close Inspector" : "Open Code & Explanation"}
                aria-expanded={showInspector}
              >
                {showInspector ? (
                  <X className="h-3.5 w-3.5" />
                ) : (
                  <LayoutDashboard className="h-3.5 w-3.5" />
                )}
                <span>{showInspector ? "Close" : "Inspect"}</span>
              </button>
              <div className="sm:hidden">
                <ThemeToggle />
              </div>
            </div>
          </div>

          {/* Action Suite */}
          <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-1.5 overflow-x-auto no-scrollbar py-0.5 sm:py-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href={`/quizzes/${algorithm.id}`}
                className="inline-flex min-h-8 sm:min-h-9 items-center gap-1.5 rounded-xl border border-primary/40 bg-primary-muted px-2.5 sm:px-3 text-xs font-bold text-primary shadow-(--shadow-raised-sm) hover:bg-primary hover:text-white transition-all active:scale-95"
                title="Take Knowledge Quiz"
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>Quiz</span>
              </Link>

              <button
                onClick={() => setIsPracticeMode(!isPracticeMode)}
                className={cn(
                  "min-h-8 sm:min-h-9 rounded-xl px-2.5 sm:px-3 text-xs font-bold transition-all shadow-(--shadow-raised-sm) border active:scale-95 cursor-pointer",
                  isPracticeMode
                    ? "bg-primary text-white border-primary"
                    : "border-border bg-surface text-text-secondary hover:text-text-primary hover:border-border-hover"
                )}
                title="Toggle Interactive Practice Mode"
              >
                Practice
              </button>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={handleToggleBookmark}
                className={cn(
                  "inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-border bg-surface transition-all shadow-(--shadow-raised-sm) hover:border-primary/40 active:scale-95 cursor-pointer",
                  isBookmarked
                    ? "text-warning border-warning/40"
                    : "text-text-muted hover:text-primary"
                )}
                title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                aria-label={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
              >
                {isBookmarked ? (
                  <Bookmark className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current" />
                ) : (
                  <BookmarkPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                )}
              </button>

              <button
                onClick={handleSaveSession}
                disabled={isSaving}
                className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-muted shadow-(--shadow-raised-sm) transition-all hover:border-primary/40 hover:text-primary active:scale-95 disabled:opacity-40 cursor-pointer"
                title="Save Session State"
                aria-label="Save Session"
              >
                <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              <button
                onClick={handleShare}
                className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-muted shadow-(--shadow-raised-sm) transition-all hover:border-primary/40 hover:text-primary active:scale-95 cursor-pointer"
                title="Share Visualizer Link"
                aria-label="Share"
              >
                <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              <div className="hidden sm:block">
                <ThemeToggle />
              </div>
            </div>
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
              className="fixed right-4 top-16 z-[70] flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-xs font-bold text-text-primary shadow-(--shadow-float) backdrop-blur-md"
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
        <div className="flex flex-1 min-h-0 flex-col lg:flex-row overflow-hidden">
          {/* Left Column: Canvas, Legend, Input Controls, and Playback Footer */}
          <div className="flex min-w-0 w-full flex-1 flex-col h-full min-h-0 lg:w-0 lg:flex-1">
            <div className="relative flex flex-1 flex-col overflow-hidden bg-background min-h-0">
              {controls && (
                <div className="w-full shrink-0 border-b border-border bg-surface/50 p-2 sm:p-2.5 shadow-(--shadow-raised-sm)">
                  {controls}
                </div>
              )}
              {legend && legend.length > 0 ? <StepLegend items={legend} /> : null}

              <div
                ref={canvasRegionRef}
                className="relative flex-1 overflow-hidden min-h-0 flex flex-col justify-center"
              >
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
                        className="neu-float w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-(--shadow-float)"
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
                                  ? "border-primary bg-primary-muted text-primary shadow-(--shadow-inset)"
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
                            onClick={handlePracticeSkip}
                            className="text-xs font-bold text-text-muted hover:text-text-primary cursor-pointer"
                          >
                            Skip
                          </button>
                          <button
                            onClick={handlePracticeSubmit}
                            disabled={!practiceSelected || practiceFeedback === "correct"}
                            className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-(--shadow-raised-sm) hover:bg-primary-hover disabled:opacity-40 cursor-pointer"
                          >
                            Submit Answer
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating Step Badge */}
                <div className="neu-inset absolute right-4 top-4 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-text-primary border border-border shadow-(--shadow-inset) backdrop-blur-md">
                  {totalSteps > 0 ? (
                    `Step ${currentStepIndex + 1} / ${totalSteps}`
                  ) : (
                    <span className="inline-block h-4 w-16 animate-pulse rounded bg-muted" />
                  )}
                </div>

                {/* Fullscreen Button */}
                <button
                  onClick={handleFullscreen}
                  className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-muted shadow-(--shadow-raised-sm) transition-all hover:border-primary/40 hover:text-primary active:scale-95 cursor-pointer"
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
                    className="neu-float w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-(--shadow-float) max-h-[85vh] overflow-y-auto"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h2
                        id="shortcuts-title"
                        className="text-xl font-bold font-display text-text-primary"
                      >
                        Keyboard Shortcuts
                      </h2>
                      <button
                        onClick={closeShortcuts}
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
                        <dt className="font-mono font-bold text-text-secondary kbd-style">â† / J</dt>
                        <dd className="text-text-secondary">Previous Step</dd>
                        <dt className="font-mono font-bold text-text-secondary kbd-style">â†’ / L</dt>
                        <dd className="text-text-secondary">Next Step</dd>
                        <dt className="font-mono font-bold text-text-secondary kbd-style">R</dt>
                        <dd className="text-text-secondary">Restart</dd>
                        <dt className="font-mono font-bold text-text-secondary kbd-style">
                          Shift + â†’
                        </dt>
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

            {/* VCR Playback Controls & Timeline Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border bg-surface px-3 py-2 pb-safe z-20 shadow-(--shadow-raised-sm) shrink-0 w-full min-w-0">
              <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2 shrink-0">
                <PlaybackControls />
                <div className="sm:hidden">
                  <SpeedSlider />
                </div>
              </div>
              <div className="flex-1 w-full min-w-0 flex items-center gap-2">
                <StepTimeline />
              </div>
              <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                <SpeedSlider />
              </div>
            </div>
          </div>

          {/* Right Column: Dual-Split Inspector Panels (Pseudocode/Code & Explanation/Log) */}
          {/* Mobile / Tablet Drawer Inspector */}
          <AnimatePresence>
            {showInspector && (
              <div
                className="fixed inset-0 z-50 lg:hidden"
                role="dialog"
                aria-modal="true"
                aria-label="Inspector panels"
              >
                {/* Full-screen Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-background/60 backdrop-blur-sm"
                  onClick={() => setShowInspector(false)}
                  aria-hidden="true"
                />

                {/* Bottom Sheet Drawer */}
                <motion.aside
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 350 }}
                  className="fixed inset-x-0 bottom-0 z-10 flex h-[80vh] max-h-[85vh] w-full flex-col rounded-t-3xl border-t border-border bg-surface shadow-(--shadow-float) pb-safe overflow-hidden"
                >
                  {/* Header with Title and Close Button */}
                  <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2.5 bg-surface/95 backdrop-blur-md">
                    <div className="flex items-center gap-2">
                      <div className="h-1 w-8 rounded-full bg-border mr-1" aria-hidden="true" />
                      <span className="text-xs font-bold font-display text-text-primary">
                        {algorithm.name} Inspector
                      </span>
                      <span className="rounded-md border border-border bg-surface-hover px-1.5 py-0.5 text-[10px] font-mono text-text-muted">
                        Step {currentStepIndex + 1}/{totalSteps}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowInspector(false)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary transition-all active:scale-95 cursor-pointer"
                      aria-label="Close inspector"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-h-0 overflow-y-auto">
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
                  </div>
                </motion.aside>
              </div>
            )}
          </AnimatePresence>

          {/* Desktop: Right Column Inspector */}
          {!isMobile && (
            <aside className="lg:flex h-full flex-col border-l border-border bg-surface-hover/40 lg:w-[26rem] shrink-0">
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
              ref={tourModalRef}
              tabIndex={-1}
              initial={{ scale: 0.92, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="neu-float w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-(--shadow-float) focus:outline-none"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="tour-title" className="text-xl font-bold font-display text-text-primary">
                  Welcome to {algorithm.name}
                </h2>
                <button
                  onClick={closeTour}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
                  aria-label="Close tour"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              {(() => {
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
                          onClick={prevTourStep}
                          className="text-xs font-bold text-text-muted hover:text-text-primary cursor-pointer"
                        >
                          Previous
                        </button>
                      )}
                      <div className="flex items-center gap-2">
                        {tourSteps.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => goToTourStep(i)}
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
                          onClick={nextTourStep}
                          className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-(--shadow-raised-sm) hover:bg-primary-hover cursor-pointer"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          onClick={closeTour}
                          className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-(--shadow-raised-sm) hover:bg-primary-hover cursor-pointer"
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
