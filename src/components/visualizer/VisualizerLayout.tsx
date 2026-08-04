"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, BookmarkPlus, Maximize2, Share2 } from "lucide-react";
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
import { Bookmark, Save } from "lucide-react";
import type { CodeLineMapping } from "@/visualizers/registry/types";

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

  // Practice mode logic: randomly pause and ask predict-next-step
  useEffect(() => {
    if (!isPracticeMode || !isPlaying || currentStepIndex >= totalSteps - 1) return;

    // 10% chance to pause at any step, but not too frequently
    const shouldPause = Math.random() < 0.1;
    if (shouldPause) {
      pause();

      const nextStep = steps[currentStepIndex + 1];
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
      // Pick three alternate operation labels
      const options = [
        answerText,
        ...distractorOptions.sort(() => 0.5 - Math.random()).slice(0, 3),
      ].sort(() => 0.5 - Math.random());

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPracticeOptions(options);
      setPracticeAnswer(answerText);
      setPracticeSelected(null);
      setPracticeFeedback(null);
      setShowPracticePrompt(true);
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
    <div
      data-reduced-motion={reducedMotion}
      className="flex min-h-screen lg:h-screen flex-col lg:overflow-hidden bg-background text-foreground"
    >
      <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-3 py-3 sm:px-4">
        <div className="flex w-full min-w-0 items-center gap-3 sm:w-auto sm:flex-1 sm:gap-4">
          <Link
            href={`/visualizers/${algorithm.dataStructureId.replace("ds_", "").replace("_", "-")}`}
            className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-primary-muted hover:text-primary-active"
            aria-label="Back to category"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="truncate text-base font-bold leading-tight sm:text-lg">
              {algorithm.name}
            </h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span
                className={cn(
                  "rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  algorithm.difficulty === "easy"
                    ? "bg-success-muted text-success border-success/20"
                    : algorithm.difficulty === "medium"
                      ? "bg-warning-muted text-warning border-warning/20"
                      : "bg-error-muted text-error border-error/20"
                )}
              >
                {algorithm.difficulty}
              </span>
              <span>{algorithm.priority}</span>
              <span>Time: {algorithm.timeComplexityAverage}</span>
              <span>Space: {algorithm.spaceComplexity}</span>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-full flex-wrap items-center justify-start gap-1 sm:w-auto sm:justify-end sm:gap-2">
          <Link
            href={`/quizzes/${algorithm.id}`}
            className="inline-flex min-h-11 items-center rounded-xl border border-primary px-3 text-xs font-semibold text-primary-active transition-colors hover:bg-primary hover:text-white"
            title="Take Final Quiz"
          >
            Take Quiz
          </Link>
          <button
            onClick={() => setIsPracticeMode(!isPracticeMode)}
            className={cn(
              "min-h-11 rounded-xl px-3 text-xs font-semibold transition-colors border",
              isPracticeMode
                ? "bg-primary text-white border-primary"
                : "text-muted-foreground hover:bg-surface hover:text-foreground border-transparent"
            )}
            title="Toggle Practice Mode"
          >
            Practice Mode
          </button>

          <div className="mx-1 h-6 w-px bg-border" />
          <button
            onClick={handleToggleBookmark}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors hover:bg-primary-muted",
              isBookmarked ? "text-warning" : "text-muted-foreground hover:text-primary"
            )}
            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
            aria-label={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
          >
            {isBookmarked ? (
              <Bookmark className="h-5 w-5 fill-current" />
            ) : (
              <BookmarkPlus className="h-5 w-5" />
            )}
          </button>

          <button
            onClick={handleSaveSession}
            disabled={isSaving}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-primary-muted hover:text-primary-active disabled:opacity-50"
            title="Save Session"
            aria-label="Save Session"
          >
            <Save className="h-5 w-5" />
          </button>

          <button
            onClick={handleShare}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-primary-muted hover:text-primary-active"
            title="Share"
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </header>

      {statusMessage && (
        <div
          aria-live="polite"
          className="fixed right-4 top-20 z-[70] flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-foreground shadow-2xl backdrop-blur"
        >
          <span>{statusMessage}</span>
          {statusMessage.toLowerCase().includes("log in") && (
            <Link
              href={`/login?next=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "")}`}
              className="rounded-lg bg-primary px-3 py-1 text-xs font-bold text-white shadow-sm hover:bg-primary-hover"
            >
              Log in
            </Link>
          )}
        </div>
      )}

      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">
        <div className="flex min-w-0 w-full shrink-0 flex-col h-auto min-h-[380px] sm:min-h-[500px] lg:min-h-0 lg:h-auto lg:w-0 lg:flex-1 lg:shrink">
          <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
            {controls && (
              <div className="w-full shrink-0 border-b border-border bg-surface/50 p-3">
                {controls}
              </div>
            )}
            {legend && legend.length > 0 ? <StepLegend items={legend} /> : null}
            <div ref={canvasRegionRef} className="relative flex-1 overflow-hidden">
              {children}

              {showPracticePrompt && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl animate-in zoom-in-95">
                    <h3 className="mb-4 text-lg font-bold text-foreground">Predict Next Step</h3>
                    <p className="mb-6 text-sm text-secondary-foreground">
                      What type of operation will happen next?
                    </p>

                    <div className="space-y-3 mb-6">
                      {practiceOptions.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setPracticeSelected(opt)}
                          className={cn(
                            "w-full rounded-lg border p-3 text-left text-sm font-medium transition-colors",
                            practiceSelected === opt
                              ? "border-primary bg-primary/10"
                              : "border-border hover:border-primary/50",
                            practiceFeedback === "correct" &&
                              opt === practiceAnswer &&
                              "border-success bg-success/10 text-success",
                            practiceFeedback === "incorrect" &&
                              practiceSelected === opt &&
                              "border-error bg-error/10 text-error"
                          )}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        onClick={handlePracticeSubmit}
                        disabled={!practiceSelected || practiceFeedback === "correct"}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
                      >
                        Check
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute right-4 top-4 rounded-lg border border-border bg-surface/80 px-3 py-1.5 text-sm font-medium text-secondary-foreground shadow-sm backdrop-blur">
                {totalSteps > 0 ? (
                  <>Step {currentStepIndex + 1} / {totalSteps}</>
                ) : (
                  <span className="inline-block h-4 w-20 animate-pulse rounded bg-muted-foreground/20" />
                )}
              </div>
              <button
                onClick={handleFullscreen}
                className="absolute bottom-4 right-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-surface/90 text-muted-foreground shadow-[var(--shadow-raised-sm)] transition-colors hover:text-primary-active"
                title="Fullscreen Canvas"
                aria-label="Fullscreen Canvas"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-8 border-t border-border bg-surface px-4 py-4 md:px-6 md:py-3 z-20 shadow-[var(--shadow-raised-sm)] shrink-0">
            <div className="flex items-center gap-4">
              <PlaybackControls />
            </div>
            <div className="flex-1 w-full flex items-center gap-4">
              <StepTimeline />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <SpeedSlider />
            </div>
          </div>
        </div>

        <aside className="flex h-[520px] w-full shrink-0 flex-col border-t border-border bg-background sm:h-[600px] lg:h-full lg:w-[25rem] lg:border-l lg:border-t-0">
          <div className="flex h-1/2 flex-col p-4 pb-2">
            <div
              className="mb-2 flex items-center gap-2 px-1"
              role="tablist"
              aria-label="Algorithm representation"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeRightTab === "pseudocode"}
                onClick={() => setActiveRightTab("pseudocode")}
                className={cn(
                  "min-h-11 rounded-xl px-3 text-xs font-semibold transition-colors",
                  activeRightTab === "pseudocode"
                    ? "border border-border bg-surface-light text-primary"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                )}
              >
                Pseudocode
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeRightTab === "code"}
                onClick={() => setActiveRightTab("code")}
                className={cn(
                  "min-h-11 rounded-xl px-3 text-xs font-semibold transition-colors",
                  activeRightTab === "code"
                    ? "border border-border bg-surface-light text-primary"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                )}
              >
                Code
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
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

          <div className="flex h-1/2 flex-col p-4 pt-2">
            <div
              className="mb-2 flex items-center gap-2 px-1"
              role="tablist"
              aria-label="Step details"
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeLowerTab === "explanation"}
                onClick={() => setActiveLowerTab("explanation")}
                className={cn(
                  "min-h-11 rounded-xl px-3 text-xs font-semibold transition-colors",
                  activeLowerTab === "explanation"
                    ? "border border-border bg-surface-light text-primary"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                )}
              >
                Explanation
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeLowerTab === "log"}
                onClick={() => setActiveLowerTab("log")}
                className={cn(
                  "min-h-11 rounded-xl px-3 text-xs font-semibold transition-colors",
                  activeLowerTab === "log"
                    ? "border border-border bg-surface-light text-primary"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                )}
              >
                Step Log
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {activeLowerTab === "explanation" ? <StepExplanation /> : <StepLog />}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
