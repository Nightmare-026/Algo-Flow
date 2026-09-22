"use client";

import React, { useEffect } from "react";
import { CheckCircle2, XCircle, ArrowRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeedbackOverlayProps {
  isCorrect: boolean;
  correctAnswer: number;
  explanation?: string;
  isPracticeMode: boolean;
  onNext: () => void;
  onRetry: () => void;
}

export function FeedbackOverlay({
  isCorrect,
  correctAnswer,
  explanation,
  isPracticeMode,
  onNext,
  onRetry,
}: FeedbackOverlayProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onNext();
      } else if (e.key.toLowerCase() === "r" && isPracticeMode && !isCorrect) {
        e.preventDefault();
        onRetry();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onRetry, isPracticeMode, isCorrect]);

  return (
    <div
      className={cn(
        "neu-raised w-full max-w-lg mx-auto p-5 sm:p-6 rounded-3xl border flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-3 duration-200 mt-3",
        isCorrect
          ? "border-success/40 bg-success-muted/15 shadow-[0_4px_20px_rgba(34,197,94,0.08)]"
          : "border-error/40 bg-error-muted/15 shadow-[0_4px_20px_rgba(239,68,68,0.08)]"
      )}
      role="alert"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <span
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-2xl border shadow-sm shrink-0",
              isCorrect
                ? "border-success/30 bg-success text-white"
                : "border-error/30 bg-error text-white"
            )}
          >
            {isCorrect ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </span>
          <div>
            <h3
              className={cn(
                "text-base sm:text-lg font-extrabold font-display tracking-tight",
                isCorrect ? "text-success" : "text-error"
              )}
            >
              {isCorrect ? "Precision Hit! Accurate Solve." : "Not quite."}
            </h3>
            {!isCorrect && (
              <p className="text-xs font-semibold text-text-secondary mt-0.5">
                Target answer:{" "}
                <strong className="font-mono tabular-nums text-text-primary text-sm font-extrabold">
                  {correctAnswer.toLocaleString()}
                </strong>
              </p>
            )}
          </div>
        </div>
      </div>

      {explanation && !isCorrect && (
        <div className="neu-inset p-4 rounded-2xl border border-border bg-surface-inset text-xs font-mono text-text-secondary leading-relaxed shadow-(--shadow-inset)">
          <p className="font-bold text-text-primary mb-1 uppercase tracking-wider text-[10px]">
            Mental Strategy:
          </p>
          {explanation}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2.5 pt-1">
        {isPracticeMode && !isCorrect && (
          <button
            onClick={onRetry}
            type="button"
            className="neu-raised flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary border border-border active:scale-95 transition-all shadow-(--shadow-raised-sm) cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry Problem [R]</span>
          </button>
        )}

        <button
          onClick={onNext}
          type="button"
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-display text-white shadow-(--shadow-raised-sm) active:scale-95 transition-all cursor-pointer",
            isCorrect ? "bg-success hover:bg-success/90" : "bg-primary hover:bg-primary-hover"
          )}
        >
          <span>Next Problem</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
