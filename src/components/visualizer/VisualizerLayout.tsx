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
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  MoreHorizontal,
} from "lucide-react";
import { Algorithm, CodeExample } from "@/types";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PlaybackControls } from "./PlaybackControls";
import { SpeedSlider, MobileSpeedSelector } from "./SpeedSlider";
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
import { useVisualizerUrlSync } from "./hooks/useVisualizerUrlSync";

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
  const { currentStepIndex, totalSteps, reducedMotion, steps } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];
  const [activeRightTab, setActiveRightTab] = useState<"pseudocode" | "code">("pseudocode");
  const [activeLowerTab, setActiveLowerTab] = useState<"explanation" | "log">("explanation");
  const [activeLanguage, setActiveLanguage] = useState<string>("python");
  const [showInspector, setShowInspector] = useState(false);
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
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
  useVisualizerUrlSync();
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
        <header className="flex shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border bg-surface/80 backdrop-blur-md px-3 sm:px-4 py-2 visualizer-compact-header shadow-card z-30">
          <div className="flex items-center justify-between gap-2 w-full sm:w-auto sm:flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <Link
                href={`/visualizers/${algorithm.dataStructureId.replace("ds_", "").replace("_", "-")}`}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-border bg-surface text-text-muted transition-all hover:border-primary/40 hover:text-primary active:scale-95 shadow-card"
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
                      "shrink-0 rounded-sm border px-1.5 py-0.2 text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider",
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

            {/* Mobile & Tablet top-right shortcuts: Inspector toggle + Overflow More menu */}
            <div className="flex items-center gap-1.5 lg:hidden shrink-0">
              <button
                type="button"
                onClick={() => setShowInspector(!showInspector)}
                className={cn(
                  "inline-flex h-8 items-center gap-1 px-2.5 rounded-sm border text-xs font-bold transition-all shadow-card active:scale-95 cursor-pointer touch-manipulation",
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

              {/* Mobile Overflow Menu */}
              <Popover open={mobileActionsOpen} onOpenChange={setMobileActionsOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary active:scale-95 transition-all shadow-card cursor-pointer touch-manipulation"
                    aria-label="More visualizer options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  side="bottom"
                  sideOffset={6}
                  className="w-56 rounded-xl border border-border bg-surface p-2 shadow-elevated z-60"
                >
                  <div className="flex flex-col gap-1 text-xs">
                    <Link
                      href={`/quizzes/${algorithm.id}`}
                      onClick={() => setMobileActionsOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-semibold text-text-primary hover:bg-primary-muted hover:text-primary transition-colors"
                    >
                      <Trophy className="h-4 w-4 text-primary" />
                      <span>Take Quiz</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsPracticeMode(!isPracticeMode);
                        setMobileActionsOpen(false);
                      }}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-semibold text-text-primary hover:bg-primary-muted hover:text-primary transition-colors text-left cursor-pointer"
                    >
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          isPracticeMode ? "bg-primary" : "bg-border"
                        )}
                      />
                      <span>{isPracticeMode ? "Exit Practice Mode" : "Practice Mode"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleToggleBookmark();
                        setMobileActionsOpen(false);
                      }}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-semibold text-text-primary hover:bg-primary-muted hover:text-primary transition-colors text-left cursor-pointer"
                    >
                      <Bookmark
                        className={cn(
                          "h-4 w-4",
                          isBookmarked ? "text-warning fill-current" : "text-text-muted"
                        )}
                      />
                      <span>{isBookmarked ? "Remove Bookmark" : "Save Bookmark"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleSaveSession();
                        setMobileActionsOpen(false);
                      }}
                      disabled={isSaving}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-semibold text-text-primary hover:bg-primary-muted hover:text-primary transition-colors text-left cursor-pointer disabled:opacity-40"
                    >
                      <Save className="h-4 w-4 text-text-muted" />
                      <span>Save Session</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleShare();
                        setMobileActionsOpen(false);
                      }}
                      className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 font-semibold text-text-primary hover:bg-primary-muted hover:text-primary transition-colors text-left cursor-pointer"
                    >
                      <Share2 className="h-4 w-4 text-text-muted" />
                      <span>Share Visualizer</span>
                    </button>

                    <div className="border-t border-border/80 my-1 pt-1 flex items-center justify-between px-2.5 py-1">
                      <span className="text-text-muted font-medium">Theme</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Desktop Action Suite */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href={`/quizzes/${algorithm.id}`}
                className="inline-flex min-h-8 sm:min-h-9 items-center gap-1.5 rounded-sm border border-primary/40 bg-primary-muted px-2.5 sm:px-3 text-xs font-bold text-primary shadow-card hover:bg-primary hover:text-white transition-all active:scale-95"
                title="Take Knowledge Quiz"
              >
                <Trophy className="h-3.5 w-3.5" />
                <span>Quiz</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsPracticeMode(!isPracticeMode)}
                className={cn(
                  "min-h-8 sm:min-h-9 rounded-sm px-2.5 sm:px-3 text-xs font-bold transition-all shadow-card border active:scale-95 cursor-pointer",
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
                type="button"
                onClick={handleToggleBookmark}
                className={cn(
                  "inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-sm border border-border bg-surface transition-all shadow-card hover:border-primary/40 active:scale-95 cursor-pointer",
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
                type="button"
                onClick={handleSaveSession}
                disabled={isSaving}
                className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-sm border border-border bg-surface text-text-muted shadow-card transition-all hover:border-primary/40 hover:text-primary active:scale-95 disabled:opacity-40 cursor-pointer"
                title="Save Session State"
                aria-label="Save Session"
              >
                <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-sm border border-border bg-surface text-text-muted shadow-card transition-all hover:border-primary/40 hover:text-primary active:scale-95 cursor-pointer"
                title="Share Visualizer Link"
                aria-label="Share"
              >
                <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              <ThemeToggle />
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
              className="fixed right-4 top-16 z-70 flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-3 text-xs font-bold text-text-primary shadow-elevated backdrop-blur-md"
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
              {/* Desktop Controls: Always Visible */}
              {controls && (
                <div className="hidden lg:block w-full shrink-0 border-b border-border bg-surface/50 p-2 sm:p-2.5 shadow-card">
                  {controls}
                </div>
              )}

              {/* Mobile / Tablet Collapsible Controls Tray */}
              {controls && (
                <div className="lg:hidden shrink-0 border-b border-border bg-surface/90 shadow-card">
                  <div className="flex items-center justify-between px-3 py-1.5">
                    <button
                      type="button"
                      onClick={() => setMobileControlsOpen(!mobileControlsOpen)}
                      className="flex items-center gap-1.5 text-xs font-bold text-text-primary hover:text-primary transition-colors cursor-pointer touch-manipulation"
                      aria-expanded={mobileControlsOpen}
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5 text-primary" />
                      <span>Data &amp; Operations</span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 text-text-muted transition-transform duration-200",
                          mobileControlsOpen && "rotate-180"
                        )}
                      />
                    </button>
                    <span className="text-[10px] font-mono font-medium text-text-muted">
                      {mobileControlsOpen ? "Tap to collapse" : "Custom inputs & size"}
                    </span>
                  </div>
                  {mobileControlsOpen && (
                    <div className="border-t border-border/60 p-2 bg-surface-secondary/40 animate-in fade-in duration-150 overflow-x-auto momentum-scroll">
                      {controls}
                    </div>
                  )}
                </div>
              )}
              {legend && legend.length > 0 ? <StepLegend items={legend} /> : null}

              <div
                ref={canvasRegionRef}
                className="relative flex-1 overflow-hidden min-h-0 flex flex-col justify-center visualizer-canvas-container"
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
                        className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-elevated"
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
                                "w-full rounded-sm border p-3.5 text-left text-xs font-bold transition-all cursor-pointer select-none",
                                practiceSelected === opt
                                  ? "border-primary bg-primary-muted text-primary shadow-xs"
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
                            className="rounded-sm bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-card hover:bg-primary-hover disabled:opacity-40 cursor-pointer"
                          >
                            Submit Answer
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Floating Step Badge */}
                <div className="absolute right-4 top-4 rounded-sm px-3 py-1.5 text-xs font-mono font-bold text-text-primary border border-border bg-surface/90 shadow-card backdrop-blur-md">
                  {totalSteps > 0 ? (
                    `Step ${currentStepIndex + 1} / ${totalSteps}`
                  ) : (
                    <span className="inline-block h-4 w-16 animate-pulse rounded bg-muted" />
                  )}
                </div>

                {/* Fullscreen Button (Top-left HUD to avoid collision with bottom-right canvas zoom controls) */}
                <button
                  type="button"
                  onClick={handleFullscreen}
                  className="absolute left-3 top-3 z-30 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-sm border border-border bg-surface/90 text-text-muted shadow-card transition-all hover:border-primary/40 hover:text-primary active:scale-95 cursor-pointer backdrop-blur-md touch-manipulation"
                  title="Toggle Fullscreen Canvas"
                  aria-label="Fullscreen Canvas"
                >
                  <Maximize2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
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
                  className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="shortcuts-title"
                >
                  <motion.div
                    initial={{ scale: 0.92, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.92, opacity: 0, y: 10 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-elevated max-h-[85vh] overflow-y-auto"
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
                        className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
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
                        <dt className="font-mono font-bold text-text-secondary kbd-style">
                          Shift + →
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

            {/* Mobile Peek Step Bar (Glanceable current step with one-tap code expand) */}
            <div className="lg:hidden border-t border-border bg-surface/95 backdrop-blur-md px-3 py-1.5 visualizer-compact-strip flex items-center justify-between shrink-0 shadow-xs select-none">
              <button
                type="button"
                onClick={() => setShowInspector(true)}
                className="flex items-center gap-2 min-w-0 text-left cursor-pointer flex-1 touch-manipulation"
                aria-label="Open step explanation and code inspector"
              >
                <span className="shrink-0 font-mono text-[10px] font-bold text-primary bg-primary-muted px-1.5 py-0.5 rounded border border-primary/20">
                  Step {currentStepIndex + 1}/{totalSteps}
                </span>
                <span className="text-xs font-semibold text-text-primary truncate">
                  {currentStep?.title || "View step explanation & code"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setShowInspector(true)}
                className="inline-flex items-center gap-1 rounded-sm bg-primary/10 px-2 py-1 text-[11px] font-bold text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer shrink-0 ml-2 touch-manipulation"
              >
                <span>Code</span>
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* VCR Playback Controls & Timeline Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-border bg-surface px-3 py-2 pb-safe visualizer-compact-dock z-20 shadow-card shrink-0 w-full min-w-0">
              <div className="flex items-center justify-between sm:justify-start w-full sm:w-auto gap-2 shrink-0">
                <PlaybackControls />
                <div className="sm:hidden">
                  <MobileSpeedSelector />
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
                  className="fixed inset-x-0 bottom-0 z-10 flex h-[82vh] max-h-[88vh] w-full flex-col rounded-t-2xl border-t border-border bg-surface shadow-elevated pb-safe overflow-hidden"
                >
                  {/* Header with Drag Handle, Title and Close Button */}
                  <div className="flex shrink-0 flex-col border-b border-border bg-surface/95 backdrop-blur-md px-4 pt-2.5 pb-2">
                    <div className="drag-handle mb-2" aria-hidden="true" />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold font-display text-text-primary truncate">
                          {algorithm.name} Inspector
                        </span>
                        <span className="rounded-md border border-border bg-surface-hover px-1.5 py-0.5 text-[10px] font-mono text-text-muted shrink-0">
                          Step {currentStepIndex + 1}/{totalSteps}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowInspector(false)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary transition-all active:scale-95 cursor-pointer touch-manipulation"
                        aria-label="Close inspector"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-h-0 overflow-y-auto momentum-scroll">
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
            <aside className="lg:flex h-full flex-col border-l border-border bg-surface-hover/40 lg:w-104 shrink-0">
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
            className="fixed inset-0 z-100 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
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
              className="w-full max-w-md rounded-lg border border-border bg-surface p-6 shadow-elevated focus:outline-none"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 id="tour-title" className="text-xl font-bold font-display text-text-primary">
                  Welcome to {algorithm.name}
                </h2>
                <button
                  onClick={closeTour}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-border bg-surface text-text-muted hover:border-primary/40 hover:text-primary transition-colors cursor-pointer"
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
                          className="rounded-sm bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-card hover:bg-primary-hover cursor-pointer"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          onClick={closeTour}
                          className="rounded-sm bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-card hover:bg-primary-hover cursor-pointer"
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
