"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle } from "lucide-react";
import { Algorithm } from "@/types";
import { QuestionData } from "@/data/seed/questions";
import { submitQuizAttempt } from "@/lib/api/quizzes";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
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
      <div className="flex h-screen flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-4">No questions available for {algorithm.name} yet.</h2>
        <Link href="/dashboard" className={buttonVariants()}>
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const correctOptionIndex = currentQ.correct.charCodeAt(0) - 65; // 'A' -> 0, 'B' -> 1, etc.

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleCheck = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    if (selectedOption === correctOptionIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Finish quiz
      setIsSubmitting(true);
      await submitQuizAttempt(
        algorithm.id,
        score + (selectedOption === correctOptionIndex ? 1 : 0),
        questions.length
      );
      setIsFinished(true);
      setIsSubmitting(false);
    }
  };

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="mx-auto flex h-full max-w-2xl flex-col justify-center p-4 space-y-8">
        <Card className="text-center p-8 bg-bg-surface border-border">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="my-8 flex items-center justify-center">
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-8 border-primary/20 bg-primary/10">
                <span className="text-4xl font-bold text-primary">{percentage}%</span>
                <span className="text-sm text-text-muted">
                  {score} / {questions.length}
                </span>
              </div>
            </div>
            <p className="text-lg text-text-secondary">
              {percentage >= 60
                ? "Great job! You've successfully passed this quiz."
                : "Keep practicing to improve your score!"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Link
              href={`/visualizer/${algorithm.slug}`}
              className={buttonVariants({ variant: "outline" })}
            >
              Review Visualizer
            </Link>
            <Link href="/dashboard" className={buttonVariants()}>
              Back to Dashboard
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col p-4 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <Link
          href={`/visualizer/${algorithm.slug}`}
          className={buttonVariants({
            variant: "ghost",
            size: "sm",
            className: "-ml-2 text-text-muted hover:text-text-primary",
          })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Visualizer
        </Link>
        <div className="text-sm font-medium text-text-secondary">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </header>

      <div className="flex-1 space-y-8">
        <div>
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">
            {currentQ.topic} â€¢ {currentQ.subtopic}
          </h2>
          <h1 className="text-xl md:text-2xl font-bold leading-relaxed text-text-primary">
            {currentQ.q}
          </h1>
        </div>

        <div className="grid gap-3">
          {currentQ.options.map((opt, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === correctOptionIndex;
            const showCorrect = isAnswered && isCorrect;
            const showIncorrect = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
                className={cn(
                  "relative flex items-start gap-4 rounded-xl border p-4 text-left transition-[transform,box-shadow,border-color,background-color,color]",
                  !isAnswered &&
                    !isSelected &&
                    "border-border bg-bg-surface hover:border-primary/50 hover:bg-bg-surface-hover",
                  !isAnswered && isSelected && "border-primary bg-primary/10 ring-1 ring-primary",
                  showCorrect && "border-success bg-success/10",
                  showIncorrect && "border-error bg-error/10",
                  isAnswered &&
                    !isSelected &&
                    !isCorrect &&
                    "border-border bg-bg-surface opacity-50"
                )}
              >
                <div
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                    !isAnswered && !isSelected && "border-border text-text-muted",
                    !isAnswered && isSelected && "border-primary bg-primary text-white",
                    showCorrect && "border-success bg-success text-white",
                    showIncorrect && "border-error bg-error text-white"
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </div>
                <span
                  className={cn(
                    "flex-1 text-sm md:text-base",
                    showCorrect || (isSelected && !isAnswered)
                      ? "text-text-primary font-medium"
                      : "text-text-secondary"
                  )}
                >
                  {opt}
                </span>

                {showCorrect && (
                  <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-success" />
                )}
                {showIncorrect && <XCircle className="absolute right-4 top-4 h-5 w-5 text-error" />}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="rounded-xl bg-bg-surface-light p-6 border border-border mt-8 animate-in slide-in-from-bottom-2 fade-in">
            <h3 className="mb-2 font-bold text-text-primary">Explanation</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{currentQ.explanation}</p>
          </div>
        )}
      </div>

      <footer className="mt-8 flex justify-end">
        {!isAnswered ? (
          <Button onClick={handleCheck} disabled={selectedOption === null} size="lg">
            Check Answer
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={isSubmitting}
            size="lg"
            className="w-full sm:w-auto"
          >
            {currentIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}{" "}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </footer>
    </div>
  );
}
