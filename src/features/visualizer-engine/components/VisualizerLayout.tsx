"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, BookmarkPlus, Maximize2, Settings, Share2, ZapOff } from "lucide-react";
import { Algorithm, CodeExample } from "@/types";
import { cn } from "@/lib/utils";
import { PlaybackControls } from "./PlaybackControls";
import { SpeedSlider } from "./SpeedSlider";
import { StepTimeline } from "./StepTimeline";
import { StepExplanation } from "./StepExplanation";
import { StepLog } from "./StepLog";
import { CodePanel } from "./CodePanel";
import { PseudocodePanel } from "./PseudocodePanel";
import { usePlaybackStore } from "../playback-store";
import { getBookmarks, toggleBookmark } from "@/features/bookmarks/api";
import { markCompleted } from "@/features/progress/api";
import { saveSession } from "@/features/sessions/api";
import { Bookmark, Save } from "lucide-react";

interface VisualizerLayoutProps {
  algorithm: Algorithm;
  codeExamples: CodeExample[];
  children: ReactNode;
  controls?: ReactNode;
}

export function VisualizerLayout({ algorithm, codeExamples, children, controls }: VisualizerLayoutProps) {
  const { currentStepIndex, totalSteps, reducedMotion, setReducedMotion, isPlaying, pause, steps } = usePlaybackStore();
  const [activeRightTab, setActiveRightTab] = useState<"pseudocode" | "code">("pseudocode");
  const [activeLowerTab, setActiveLowerTab] = useState<"explanation" | "log">("explanation");
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [showPracticePrompt, setShowPracticePrompt] = useState(false);
  const [practiceOptions, setPracticeOptions] = useState<string[]>([]);
  const [practiceAnswer, setPracticeAnswer] = useState<string>("");
  const [practiceSelected, setPracticeSelected] = useState<string | null>(null);
  const [practiceFeedback, setPracticeFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const statusTimerRef = useRef<number | null>(null);
  const canvasRegionRef = useRef<HTMLDivElement>(null);

  // Check initial bookmark state
  useEffect(() => {
    getBookmarks().then(bookmarks => {
      if (bookmarks.includes(algorithm.id)) {
        setIsBookmarked(true);
      }
    });
  }, [algorithm.id]);

  // Handle auto-completion when reaching the end
  useEffect(() => {
    if (totalSteps > 0 && currentStepIndex === totalSteps - 1 && !hasCompleted) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHasCompleted(true);
      markCompleted(algorithm.id).catch(console.error);
    }
  }, [currentStepIndex, totalSteps, hasCompleted, algorithm.id]);

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
      
      const dummyOptions = ["Compare elements", "Swap elements", "Update a value", "Highlight an element", "Continue operation"].filter(o => o !== answerText);
      // Pick 3 random dummy options
      const options = [answerText, ...dummyOptions.sort(() => 0.5 - Math.random()).slice(0, 3)].sort(() => 0.5 - Math.random());
      
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPracticeOptions(options);
      setPracticeAnswer(answerText);
      setPracticeSelected(null);
      setPracticeFeedback(null);
      setShowPracticePrompt(true);
    }
  }, [currentStepIndex, isPracticeMode, isPlaying, totalSteps, steps, pause]);

  const showStatus = (message: string) => {
    setStatusMessage(message);
    if (statusTimerRef.current) window.clearTimeout(statusTimerRef.current);
    statusTimerRef.current = window.setTimeout(() => setStatusMessage(null), 2400);
  };

  useEffect(() => {
    return () => {
      if (statusTimerRef.current) window.clearTimeout(statusTimerRef.current);
    };
  }, []);
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

  const handleToggleBookmark = async () => {
    const previousState = isBookmarked;
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    try {
      const result = await toggleBookmark(algorithm.id, nextState);
      if (!result.ok) setIsBookmarked(previousState);
      showStatus(result.message);
    } catch {
      setIsBookmarked(previousState);
      showStatus("Bookmark could not be updated.");
    }
  };

  const handleSaveSession = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const name = `${algorithm.name} - Step ${currentStepIndex + 1}`;
      const result = await saveSession(algorithm.id, name, {}, currentStepIndex, steps[currentStepIndex]?.dataState || {}, "normal", "python");
      showStatus(result.message);
    } catch {
      showStatus("Session could not be saved.");
    } finally {
      setIsSaving(false);
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
    <div data-reduced-motion={reducedMotion} className="flex min-h-screen lg:h-screen flex-col lg:overflow-hidden bg-background text-foreground">
      <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-3 py-3 sm:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
          <Link
            href={`/visualizers/${algorithm.dataStructureId.replace("ds_", "").replace("_", "-")}`}
            className="-ml-2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface-light hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="truncate text-base font-bold leading-tight sm:text-lg">{algorithm.name}</h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className={cn(
                "rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                algorithm.difficulty === "easy" ? "bg-success-muted text-success border-success/20" :
                algorithm.difficulty === "medium" ? "bg-warning-muted text-warning border-warning/20" :
                "bg-error-muted text-error border-error/20"
              )}>
                {algorithm.difficulty}
              </span>
              <span>{algorithm.priority}</span>
              <span>Time: {algorithm.timeComplexityAverage}</span>
              <span>Space: {algorithm.spaceComplexity}</span>
            </div>
          </div>
        </div>

        <div className="flex max-w-full flex-wrap items-center justify-end gap-1 sm:gap-2">
          <Link
            href={`/quizzes/${algorithm.id}`}
            className="rounded-lg border border-primary px-2.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white sm:px-3"
            title="Take Final Quiz"
          >
            Take Quiz
          </Link>
          <button
            onClick={() => setIsPracticeMode(!isPracticeMode)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors border",
              isPracticeMode ? "bg-primary text-white border-primary" : "text-muted-foreground hover:bg-surface hover:text-foreground border-transparent"
            )}
            title="Toggle Practice Mode"
          >
            Practice Mode
          </button>
          
          <div className="mx-1 h-6 w-px bg-border" />
          <button 
            onClick={handleToggleBookmark}
            className={cn(
              "rounded-lg p-2 transition-colors hover:bg-surface-light",
              isBookmarked ? "text-orange-500" : "text-muted-foreground hover:text-primary"
            )} 
            title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
            aria-label={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
          >
            {isBookmarked ? <Bookmark className="h-5 w-5 fill-current" /> : <BookmarkPlus className="h-5 w-5" />}
          </button>
          
          <button 
            onClick={handleSaveSession}
            disabled={isSaving}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface-light hover:text-primary disabled:opacity-50" 
            title="Save Session"
            aria-label="Save Session"
          >
            <Save className="h-5 w-5" />
          </button>

          <button onClick={handleShare} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface-light hover:text-primary" title="Share" aria-label="Share">
            <Share2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={cn(
              "rounded-lg p-2 transition-colors hover:bg-surface-light",
              reducedMotion ? "text-primary" : "text-muted-foreground hover:text-primary"
            )}
            title="Reduced Motion"
            aria-label="Reduced Motion"
            aria-pressed={reducedMotion}
          >
            <ZapOff className="h-5 w-5" />
          </button>
          <div className="mx-1 h-6 w-px bg-border" />
          <button onClick={() => showStatus("Playback settings are in the control bar")} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface-light hover:text-primary" title="Settings" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </header>

      {statusMessage && (
        <div aria-live="polite" className="fixed right-4 top-20 z-[70] rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-xl">
          {statusMessage}
        </div>
      )}

      <div className="flex flex-col lg:flex-row flex-1 overflow-y-auto lg:overflow-hidden">
        <div className="flex min-w-0 w-full lg:flex-1 flex-col h-[60vh] min-h-[500px] lg:h-auto shrink-0">
          <div className="relative flex flex-1 flex-col overflow-hidden bg-background">
            {controls && <div className="w-full shrink-0 border-b border-border bg-surface/50 p-3">{controls}</div>}
            <div ref={canvasRegionRef} className="relative flex-1 overflow-hidden">
              {children}
              
              {showPracticePrompt && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="w-full max-w-md rounded-xl border border-border bg-surface p-6 shadow-xl animate-in zoom-in-95">
                    <h3 className="mb-4 text-lg font-bold text-foreground">Predict Next Step</h3>
                    <p className="mb-6 text-sm text-secondary-foreground">What type of operation will happen next?</p>
                    
                    <div className="space-y-3 mb-6">
                      {practiceOptions.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => setPracticeSelected(opt)}
                          className={cn(
                            "w-full rounded-lg border p-3 text-left text-sm font-medium transition-colors",
                            practiceSelected === opt ? "border-primary bg-primary/10" : "border-border hover:border-primary/50",
                            practiceFeedback === "correct" && opt === practiceAnswer && "border-success bg-success/10 text-success",
                            practiceFeedback === "incorrect" && practiceSelected === opt && "border-error bg-error/10 text-error"
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
                Step {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
              </div>
              <button onClick={handleFullscreen} className="absolute bottom-4 right-4 rounded-lg border border-border bg-surface/80 p-2 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground" title="Fullscreen Canvas" aria-label="Fullscreen Canvas">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:h-20 h-auto py-4 md:py-0 shrink-0 items-center justify-between gap-4 md:gap-6 border-t border-border bg-surface px-6">
            <div className="w-full md:flex-1 order-1 md:order-2">
              <StepTimeline />
            </div>
            <div className="flex w-full flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between md:order-1 md:w-auto md:justify-start md:gap-4 order-2">
              <PlaybackControls />
              <div className="md:hidden">
                <SpeedSlider />
              </div>
            </div>
            <div className="hidden md:block order-3">
              <SpeedSlider />
            </div>
          </div>
        </div>

        <div className="flex w-full lg:w-96 lg:shrink-0 flex-col border-t lg:border-t-0 lg:border-l border-border bg-background h-[500px] lg:h-full shrink-0">
          <div className="flex h-1/2 flex-col p-4 pb-2">
            <div className="mb-2 flex items-center gap-2 px-1">
              <button
                onClick={() => setActiveRightTab("pseudocode")}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors", activeRightTab === "pseudocode" ? "border border-border bg-surface-light text-primary" : "text-muted-foreground hover:bg-surface hover:text-foreground")}
              >
                Pseudocode
              </button>
              <button
                onClick={() => setActiveRightTab("code")}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors", activeRightTab === "code" ? "border border-border bg-surface-light text-primary" : "text-muted-foreground hover:bg-surface hover:text-foreground")}
              >
                Code
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {activeRightTab === "pseudocode" ? <PseudocodePanel slug={algorithm.slug} /> : <CodePanel examples={codeExamples} />}
            </div>
          </div>

          <div className="flex h-1/2 flex-col p-4 pt-2">
            <div className="mb-2 flex items-center gap-2 px-1">
              <button
                onClick={() => setActiveLowerTab("explanation")}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors", activeLowerTab === "explanation" ? "border border-border bg-surface-light text-primary" : "text-muted-foreground hover:bg-surface hover:text-foreground")}
              >
                Explanation
              </button>
              <button
                onClick={() => setActiveLowerTab("log")}
                className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors", activeLowerTab === "log" ? "border border-border bg-surface-light text-primary" : "text-muted-foreground hover:bg-surface hover:text-foreground")}
              >
                Step Log
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              {activeLowerTab === "explanation" ? <StepExplanation /> : <StepLog />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
