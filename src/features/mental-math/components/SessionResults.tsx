"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  RotateCcw,
  Sparkles,
  Zap,
  TrendingUp,
  Target,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { SessionSummary } from "../core/types";
import { cn } from "@/lib/utils";

interface SessionResultsProps {
  summary: SessionSummary;
  onRestart: () => void;
  onDrillWeakness?: () => void;
}

export function SessionResults({ summary, onRestart, onDrillWeakness }: SessionResultsProps) {
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const isPerfect = summary.accuracyPercentage === 100;
  const isHighAccuracy = summary.accuracyPercentage >= 80;

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 py-4 animate-in fade-in zoom-in-95 duration-300 pb-16">
      {/* Hero Banner */}
      <div className="neu-float relative overflow-hidden rounded-3xl p-6 sm:p-8 border border-border text-center flex flex-col items-center shadow-xl">
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <span
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl border shadow-(--shadow-raised-sm) mb-3 transition-transform duration-300 hover:scale-105",
            isPerfect
              ? "border-warning/40 bg-warning-muted/40 text-warning"
              : isHighAccuracy
                ? "border-primary/40 bg-primary-muted/40 text-primary"
                : "border-border bg-surface-inset text-text-primary"
          )}
        >
          {isPerfect ? (
            <Sparkles className="w-8 h-8 fill-current" />
          ) : (
            <Trophy className="w-8 h-8" />
          )}
        </span>

        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-primary">
          Session Summary
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary mt-1 tracking-tight">
          {isPerfect
            ? "Flawless Performance!"
            : isHighAccuracy
              ? "High-Velocity Solving!"
              : "Session Finished â€” Keep Drilling!"}
        </h1>

        <div className="flex items-baseline gap-2 mt-4">
          <span className="text-5xl sm:text-6xl font-extrabold font-display text-primary tracking-tight tabular-nums">
            {summary.finalScore.toLocaleString()}
          </span>
          <span className="text-xs font-mono font-bold uppercase text-text-muted">
            Verified PTS
          </span>
        </div>
      </div>

      {/* 4 Performance Metric Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="neu-raised p-4 sm:p-5 rounded-2xl border border-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              Accuracy
            </span>
            <Target className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tabular-nums">
              {summary.accuracyPercentage}%
            </div>
            <p className="text-[11px] font-semibold text-text-secondary mt-0.5 tabular-nums">
              {summary.correctCount} of {summary.totalQuestions} correct
            </p>
          </div>
        </div>

        <div className="neu-raised p-4 sm:p-5 rounded-2xl border border-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              Avg Speed
            </span>
            <Zap className="w-3.5 h-3.5 text-warning" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tabular-nums">
              {(summary.averageSolveTimeMs / 1000).toFixed(1)}s
            </div>
            <p className="text-[11px] font-semibold text-text-secondary mt-0.5 tabular-nums">
              Fastest: {(summary.fastestSolveTimeMs / 1000).toFixed(1)}s
            </p>
          </div>
        </div>

        <div className="neu-raised p-4 sm:p-5 rounded-2xl border border-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              Max Streak
            </span>
            <Flame className="w-3.5 h-3.5 text-warning fill-current" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tabular-nums">
              {summary.maxComboStreak}x
            </div>
            <p className="text-[11px] font-semibold text-text-secondary mt-0.5">
              Continuous streak
            </p>
          </div>
        </div>

        <div className="neu-raised p-4 sm:p-5 rounded-2xl border border-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
              Cadence
            </span>
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tabular-nums">
              {summary.questionsPerMinute}
            </div>
            <p className="text-[11px] font-semibold text-text-secondary mt-0.5">Questions / min</p>
          </div>
        </div>
      </div>

      {/* Action Suite */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <Link
          href="/mental-math"
          className="w-full sm:w-auto neu-raised px-5 py-3 rounded-2xl text-xs font-bold font-display text-text-secondary hover:text-text-primary border border-border text-center transition-all shadow-(--shadow-raised-sm) active:scale-95"
        >
          â† Return to Hub
        </Link>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {summary.incorrectCount > 0 && onDrillWeakness && (
            <button
              onClick={onDrillWeakness}
              type="button"
              className="neu-raised flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold font-display text-warning border border-warning/30 bg-warning-muted/10 hover:bg-warning-muted/20 active:scale-95 transition-all shadow-(--shadow-raised-sm) cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Drill Mistakes</span>
            </button>
          )}

          <button
            onClick={onRestart}
            type="button"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold font-display bg-primary text-white hover:bg-primary-hover shadow-(--shadow-raised-sm) active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Again</span>
            <ArrowRight className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>
      </div>

      {/* End-of-Session Strategy & Mistake Breakdown */}
      {summary.answers && summary.answers.length > 0 && (
        <section className="neu-raised p-6 sm:p-8 rounded-3xl border border-border flex flex-col gap-4 mt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-display text-text-primary flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary" />
                <span>Question Breakdown & Strategies</span>
              </h2>
              <p className="text-xs text-text-secondary mt-0.5">
                {summary.incorrectCount === 0
                  ? "All problems solved with 100% precision."
                  : `${summary.incorrectCount} missed calculation${summary.incorrectCount > 1 ? "s" : ""} with step-by-step strategies.`}
              </p>
            </div>

            {summary.answers.length > 3 && (
              <button
                type="button"
                onClick={() => setShowAllQuestions(!showAllQuestions)}
                className="text-xs font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer select-none"
              >
                <span>
                  {showAllQuestions ? "Show Fewer" : `View All (${summary.answers.length})`}
                </span>
                {showAllQuestions ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>

          <div className="divide-y divide-border/60">
            {(showAllQuestions ? summary.answers : summary.answers.slice(0, 5)).map((ans, idx) => {
              const isCorrect = ans.isCorrect;
              return (
                <div key={`${ans.questionId}-${idx}`} className="py-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-xl font-bold shadow-xs shrink-0",
                          isCorrect
                            ? "bg-success/15 text-success border border-success/30"
                            : "bg-error/15 text-error border border-error/30"
                        )}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </span>
                      <div>
                        <p className="font-mono font-extrabold text-text-primary text-base">
                          {ans.formattedExpression || ans.questionSignature.replace(/:/g, " â€¢ ")}{" "}
                          ={" "}
                          {ans.correctAnswer !== undefined
                            ? ans.correctAnswer.toLocaleString()
                            : ""}
                        </p>
                        <p className="text-[11px] font-mono text-text-secondary mt-0.5">
                          Your answer:{" "}
                          <strong
                            className={cn("font-bold", isCorrect ? "text-success" : "text-error")}
                          >
                            {ans.userAnswer !== null ? ans.userAnswer.toLocaleString() : "None"}
                          </strong>
                          {!isCorrect && (
                            <span className="text-error font-bold ml-2">
                              (Target: {ans.correctAnswer?.toLocaleString()})
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="font-mono text-xs font-bold text-text-muted tabular-nums">
                      {(ans.solveTimeMs / 1000).toFixed(1)}s
                    </div>
                  </div>

                  {ans.explanation && (
                    <div className="neu-inset ml-11 p-3 rounded-xl border border-border bg-surface-inset text-xs font-mono text-text-secondary leading-relaxed shadow-(--shadow-inset)">
                      <span className="font-bold text-primary mr-1.5">ðŸ’¡ Strategy:</span>
                      <span>{ans.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
