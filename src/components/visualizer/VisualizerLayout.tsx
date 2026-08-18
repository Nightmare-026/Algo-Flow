"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, BookmarkPlus, Maximize2, Share2, Bookmark, Save, Trophy, Sparkles } from "lucide-react";
import { Algorithm, CodeExample } from "@/types";
import { cn } from "@/lib/utils";
import { PlaybackControls } from "./PlaybackControls";
import { SpeedSlider } from "./SpeedSlider";
import { StepTimeline } from "./StepTimeline";
import { StepExplanation } from "./StepExplanation";
import { StepLog } from "./StepLog";
import { CodePanel } from "./CodePanel";
import { PseudocodePanel } from "./PseudocodePanel";
import { StepLegend, type StepLegendItem } from "./StepLegend";
import { usePlaybackStore } from "@/stores/playback-store";
import {
  useStatusToast,
  useVisualizerBookmark,
  useVisualizerCompletion,
  useVisualizerSaveSession,
} from "./useVisualizerActions";
import type { CodeLineMapping } from "@/visualizers/registry/types";

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
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showPracticePrompt, setShowPracticePrompt] = useState(false);
  const [practiceOptions, setPracticeOptions] = useState<string[]>([]);
  const [practiceAnswer, setPracticeAnswer] = useState<string>("");
  const [practiceSelected, setPracticeSelected] = useState<string | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<"correct" | "incorrect" | null>(null);
  const canvasRegionRef = useRef<HTMLDivElement>(null);

  const { statusMessage, showStatus } = useStatusToast();
  const { isBookmarked, handleToggleBookmark } = useVisualizerBookmark(algorithm.id, showStatus);
  useVisualizerCompletion(algorithm.id, showStatus);
  const { isSaving, handleSaveSession } = useVisualizerSaveSession(
    algorithm.id,
    algorithm.name,
    activeLanguage,
    showStatus
  );

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

  const handleFullscreen = async () => {
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
  };

  return (
    <main
      id="main-content"
      data-reduced-motion={reducedMotion}
      className="flex min-h-screen lg:h-screen flex-col lg:overflow-hidden bg-background text-text-primary"
    >
      {/* Top Workstation Header */}
      <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-2.5 shadow-[var(--shadow-raised-sm)] z-30">
        <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto sm:flex-1 sm:gap-4">
          <Link
            href={`/visualizers/${algorithm.dataStructureId.replace("ds_", "").replace("_", "-")}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-muted transition-all hover:border-primary/40 hover:text-primary active:scale-95 shadow-[var(--shadow-raised-sm)]"
            aria-label="Back to category"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="min-w-0">
            <h1 className="truncate text-base sm:text-lg font-bold font-display leading-tight text-text-primary">
              {algorithm.name}
            </h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-text-muted">
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
            <Sparkles className="inline-block mr-1 h-3 w-3" />
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
        </div>
      </header>

      {/* Toast Notification */}
      {statusMessage && (
        <div
          aria-live="polite"
          className="fixed right-4 top-20 z-[70] flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-xs font-bold text-text-primary shadow-[var(--shadow-float)] backdrop-blur-md animate-in slide-in-from-top-2 duration-200"
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
        </div>
      )}

      {/* Main Workspace Split */}
      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">
        {/* Left Column: Canvas, Legend, Input Controls, and Playback Footer */}
        <div className="flex min-w-0 w-full shrink-0 flex-col h-auto min-h-[420px] sm:min-h-[540px] lg:min-h-0 lg:h-auto lg:w-0 lg:flex-1 lg:shrink">
          <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
            {controls && (
              <div className="w-full shrink-0 border-b border-border bg-surface/60 p-3 shadow-[var(--shadow-raised-sm)]">
                {controls}
              </div>
            )}
            {legend && legend.length > 0 ? <StepLegend items={legend} /> : null}

            <div ref={canvasRegionRef} className="relative flex-1 overflow-hidden">
              {children}

              {/* Practice Prompt Modal */}
              {showPracticePrompt && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4">
                  <div className="neu-float w-full max-w-md rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-float)] animate-in zoom-in-95">
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
                        className="text-xs font-bold text-text-muted hover:text-text-primary"
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
                  </div>
                </div>
              )}

              {/* Floating Step Badge */}
              <div className="neu-inset absolute right-4 top-4 rounded-xl px-3 py-1.5 text-xs font-mono font-bold text-text-primary border border-border shadow-[var(--shadow-inset)] backdrop-blur-md">
                {totalSteps > 0 ? (
                  <>
                    Step {currentStepIndex + 1} / {totalSteps}
                  </>
                ) : (
                  <span className="inline-block h-4 w-16 animate-pulse rounded bg-muted" />
                )}
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={handleFullscreen}
                className="absolute bottom-4 right-4 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-muted shadow-[var(--shadow-raised-sm)] transition-all hover:border-primary/40 hover:text-primary active:scale-95"
                title="Toggle Fullscreen Canvas"
                aria-label="Fullscreen Canvas"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* VCR Playback Controls & Timeline Bar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 border-t border-border bg-surface px-4 py-3 z-20 shadow-[var(--shadow-raised-sm)] shrink-0">
            <div className="flex items-center gap-3">
              <PlaybackControls />
            </div>
            <div className="flex-1 w-full flex items-center gap-3">
              <StepTimeline />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <SpeedSlider />
            </div>
          </div>
        </div>

        {/* Right Column: Dual-Split Inspector Panels (Pseudocode/Code & Explanation/Log) */}
        <aside className="flex h-[560px] w-full shrink-0 flex-col border-t border-border bg-surface-hover/40 sm:h-[620px] lg:h-full lg:w-[26rem] lg:border-l lg:border-t-0">
          {/* Upper Inspector Panel */}
          <div className="flex h-1/2 flex-col p-3 pb-1.5">
            <div
              className="mb-2 flex items-center gap-1.5 px-1"
              role="tablist"
              aria-label="Algorithm representation"
            >
              <button
                type="button"
                id="tab-pseudocode"
                role="tab"
                aria-selected={activeRightTab === "pseudocode"}
                aria-controls="panel-pseudocode-or-code"
                onClick={() => setActiveRightTab("pseudocode")}
                className={cn(
                  "min-h-8 rounded-lg px-3 text-xs font-bold transition-all cursor-pointer select-none",
                  activeRightTab === "pseudocode"
                    ? "bg-primary text-white shadow-[var(--shadow-raised-sm)]"
                    : "text-text-muted hover:bg-surface hover:text-text-primary"
                )}
              >
                Pseudocode
              </button>
              <button
                type="button"
                id="tab-code"
                role="tab"
                aria-selected={activeRightTab === "code"}
                aria-controls="panel-pseudocode-or-code"
                onClick={() => setActiveRightTab("code")}
                className={cn(
                  "min-h-8 rounded-lg px-3 text-xs font-bold transition-all cursor-pointer select-none",
                  activeRightTab === "code"
                    ? "bg-primary text-white shadow-[var(--shadow-raised-sm)]"
                    : "text-text-muted hover:bg-surface hover:text-text-primary"
                )}
              >
                Code (5 Langs)
              </button>
            </div>
            <div
              id="panel-pseudocode-or-code"
              role="tabpanel"
              aria-labelledby={activeRightTab === "pseudocode" ? "tab-pseudocode" : "tab-code"}
              className="flex-1 overflow-hidden"
            >
              {activeRightTab === "pseudocode" ? (
                <PseudocodePanel slug={algorithm.slug} fallback={algorithm.pseudocode} />
              ) : (
                <CodePanel
                  examples={codeExamples}
                  codeLineMapping={codeLineMapping}
                  onLanguageChange={setActiveLanguage}
                />
              )}
            </div>
          </div>

          {/* Lower Inspector Panel */}
          <div className="flex h-1/2 flex-col p-3 pt-1.5">
            <div
              className="mb-2 flex items-center gap-1.5 px-1"
              role="tablist"
              aria-label="Step details"
            >
              <button
                type="button"
                id="tab-explanation"
                role="tab"
                aria-selected={activeLowerTab === "explanation"}
                aria-controls="panel-explanation-or-log"
                onClick={() => setActiveLowerTab("explanation")}
                className={cn(
                  "min-h-8 rounded-lg px-3 text-xs font-bold transition-all cursor-pointer select-none",
                  activeLowerTab === "explanation"
                    ? "bg-primary text-white shadow-[var(--shadow-raised-sm)]"
                    : "text-text-muted hover:bg-surface hover:text-text-primary"
                )}
              >
                Step Explanation
              </button>
              <button
                type="button"
                id="tab-log"
                role="tab"
                aria-selected={activeLowerTab === "log"}
                aria-controls="panel-explanation-or-log"
                onClick={() => setActiveLowerTab("log")}
                className={cn(
                  "min-h-8 rounded-lg px-3 text-xs font-bold transition-all cursor-pointer select-none",
                  activeLowerTab === "log"
                    ? "bg-primary text-white shadow-[var(--shadow-raised-sm)]"
                    : "text-text-muted hover:bg-surface hover:text-text-primary"
                )}
              >
                Execution Log
              </button>
            </div>
            <div
              id="panel-explanation-or-log"
              role="tabpanel"
              aria-labelledby={activeLowerTab === "explanation" ? "tab-explanation" : "tab-log"}
              className="flex-1 overflow-hidden"
            >
              {activeLowerTab === "explanation" ? <StepExplanation /> : <StepLog />}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
