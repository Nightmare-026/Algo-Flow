"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Trophy,
  RotateCcw,
  Compass,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Algorithm } from "@/types";
import { QuestionData } from "@/data/seed/questions";
import { submitQuizAttempt } from "@/lib/api/quizzes";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuizClientProps {
  algorithm: Algorithm;
  questions: QuestionData[];
}

export function QuizClient({ algorithm, questions }: QuizClientProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-4 text-center">
        <div className="neu-float max-w-md rounded-3xl p-8 border border-border">
          <h2 className="text-xl font-bold font-display text-text-primary mb-3">
            No Quiz Questions Yet
          </h2>
          <p className="text-sm text-text-secondary mb-6">
            Practice questions for {algorithm.name} are currently being authored.
          </p>
          <Link href="/dashboard" className={buttonVariants()}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const correctOptionIndex = currentQ.correct.charCodeAt(0) - 65; // 'A' -> 0, 'B' -> 1, etc.

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === correctOptionIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsSubmitting(true);
      try {
        await submitQuizAttempt(algorithm.id, score, questions.length);
      } catch {
        // Continue to finished screen even if remote recording fails
      } finally {
        setIsFinished(true);
        setIsSubmitting(false);
      }
    }
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 60;
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center p-4">
        <div className="neu-float rounded-3xl p-8 sm:p-10 text-center border border-border">
          <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] text-primary">
            <Trophy className="h-8 w-8 text-primary" />
          </span>
          <p className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            Quiz Results
          </p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold font-display text-text-primary">
            {algorithm.name} Quiz Complete!
          </h1>

          <div className="my-8 flex items-center justify-center">
            <div
              className={cn(
                "flex h-32 w-32 flex-col items-center justify-center rounded-full border-4 shadow-[var(--shadow-raised-sm)]",
                passed
                  ? "border-primary bg-primary-muted text-primary"
                  : "border-warning bg-warning-muted text-warning"
              )}
            >
              <span className="text-3xl font-extrabold font-display">{percentage}%</span>
              <span className="text-xs font-mono font-bold text-text-muted mt-0.5">
                {score} / {questions.length} Correct
              </span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-text-secondary max-w-sm mx-auto mb-8">
            {passed
              ? "Outstanding! You demonstrated solid algorithmic comprehension."
              : "Good effort! Review the step-by-step visualizer and try again to master this algorithm."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href={`/visualizer/${algorithm.slug}`}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              <RotateCcw className="h-4 w-4" />
              Review Visualizer
            </Link>
            <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
              <Compass className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-4 py-8">
      {/* Header */}
      <header className="mb-8 flex items-center justify-between">
        <Link
          href={`/visualizer/${algorithm.slug}`}
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "text-text-muted hover:text-text-primary",
          })}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to Visualizer
        </Link>
        <div className="neu-inset px-3 py-1 rounded-full font-mono text-xs font-bold text-primary border border-border shadow-[var(--shadow-inset)]">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </header>

      {/* Main Question Card */}
      <div className="neu-float rounded-3xl p-6 sm:p-8 border border-border">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-md border border-primary/25 bg-primary-muted px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-primary">
              {currentQ.topic || "Algorithm Theory"}
            </span>
            {currentQ.subtopic && (
              <span className="text-xs text-text-muted font-medium">• {currentQ.subtopic}</span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-display leading-snug text-text-primary">
            {currentQ.q}
          </h1>
        </div>

        {/* Options List */}
        <div className="grid gap-3 mt-6">
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === correctOptionIndex;
            const showCorrect = isAnswered && isCorrect;
            const showIncorrect = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
                className={cn(
                  "relative flex items-start gap-4 rounded-2xl border p-4 text-left transition-all duration-150 cursor-pointer select-none",
                  !isAnswered &&
                    !isSelected &&
                    "border-border bg-surface shadow-[var(--shadow-raised-sm)] hover:border-primary/40 hover:bg-surface-hover",
                  !isAnswered &&
                    isSelected &&
                    "border-primary bg-primary-muted shadow-[var(--shadow-inset)] text-primary",
                  showCorrect &&
                    "border-success bg-success-muted shadow-[var(--shadow-inset)] text-success font-bold",
                  showIncorrect &&
                    "border-error bg-error-muted shadow-[var(--shadow-inset)] text-error font-bold",
                  isAnswered && !isSelected && !isCorrect && "border-border bg-surface opacity-40"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border text-xs font-mono font-bold shadow-[var(--shadow-raised-sm)]",
                    !isAnswered && !isSelected && "border-border bg-surface text-text-muted",
                    !isAnswered && isSelected && "border-primary bg-primary text-white",
                    showCorrect && "border-success bg-success text-white",
                    showIncorrect && "border-error bg-error text-white"
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <span
                  className={cn(
                    "flex-1 text-sm leading-relaxed mt-0.5",
                    showCorrect || (isSelected && !isAnswered)
                      ? "text-text-primary font-semibold"
                      : "text-text-secondary"
                  )}
                >
                  {opt}
                </span>

                {showCorrect && <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" />}
                {showIncorrect && <XCircle className="h-5 w-5 text-error shrink-0 mt-0.5" />}
              </button>
            );
          })}
        </div>

        {/* Explanation Callout */}
        {isAnswered && (
          <div className="rounded-2xl bg-bg-surface-inset p-5 border border-border mt-6 shadow-[var(--shadow-inset)] animate-in slide-in-from-bottom-2 duration-200">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary mb-1.5">
              Explanation
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}

        {/* Action Button Footer */}
        <footer className="mt-8 flex justify-end border-t border-border pt-4">
          <Button
            onClick={handleNext}
            disabled={isSubmitting || !isAnswered}
            size="lg"
            className="w-full sm:w-auto"
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </footer>
      </div>
    </div>
  );
}
