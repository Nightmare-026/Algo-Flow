"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BookmarkPlus,
  Share2,
  Bookmark,
  Save,
  Trophy,
  X,
  LayoutDashboard,
  MoreHorizontal,
} from "lucide-react";
import { Algorithm } from "@/types";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export interface VisualizerHeaderProps {
  algorithm: Algorithm;
  showInspector: boolean;
  setShowInspector: (show: boolean) => void;
  isPracticeMode: boolean;
  setIsPracticeMode: (practice: boolean) => void;
  isBookmarked: boolean;
  handleToggleBookmark: () => void;
  isSaving: boolean;
  handleSaveSession: () => void;
  handleShare: () => void;
}

export function VisualizerHeader({
  algorithm,
  showInspector,
  setShowInspector,
  isPracticeMode,
  setIsPracticeMode,
  isBookmarked,
  handleToggleBookmark,
  isSaving,
  handleSaveSession,
  handleShare,
}: VisualizerHeaderProps) {
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);

  return (
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
              isBookmarked ? "text-warning border-warning/40" : "text-text-muted hover:text-primary"
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
  );
}
