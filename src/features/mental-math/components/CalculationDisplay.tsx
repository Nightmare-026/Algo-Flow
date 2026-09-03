"use client";

import React from "react";
import { MentalMathQuestion } from "../core/types";
import { getOperatorSymbol } from "../core/generator";
import { cn } from "@/lib/utils";

interface CalculationDisplayProps {
  question: MentalMathQuestion;
  userAnswer?: string;
  isAnswered?: boolean;
  isCorrect?: boolean;
}

export function CalculationDisplay({
  question,
  userAnswer,
  isAnswered,
  isCorrect,
}: CalculationDisplayProps) {
  const { expression, signature } = question;
  const op1 = expression.operands[0];
  const op2 = expression.operands[1];
  const symbol = getOperatorSymbol(signature.operation);

  const getOpBadgeClass = () => {
    return "text-primary bg-surface-inset border-border shadow-inner";
  };

  const screenReaderText =
    signature.operation === "squares"
      ? `Calculate ${op1} squared`
      : signature.operation === "roots"
        ? `Calculate square root of ${op1}`
        : signature.operation === "percentages"
          ? `Calculate ${op1} percent of ${op2}`
          : `Calculate ${op1} ${
              signature.operation === "addition"
                ? "plus"
                : signature.operation === "subtraction"
                  ? "minus"
                  : signature.operation === "multiplication"
                    ? "multiplied by"
                    : "divided by"
            } ${op2}`;

  if (expression.displayLayout === "vertical") {
    const maxLen = Math.max(op1.toString().length, (op2 ?? 0).toString().length) + 2;

    return (
      <div
        className="flex flex-col items-center justify-center my-4 sm:my-6"
        role="region"
        aria-label={screenReaderText}
      >
        <span className="sr-only">{screenReaderText}</span>
        <div
          className={cn(
            "neu-inset relative inline-flex flex-col items-end px-8 sm:px-12 py-6 sm:py-7 rounded-3xl border transition-all duration-300",
            isAnswered
              ? isCorrect
                ? "border-success/50 bg-success-muted/15 shadow-[0_0_30px_rgba(34,197,94,0.18)]"
                : "border-error/50 bg-error-muted/15 shadow-[0_0_30px_rgba(239,68,68,0.18)]"
              : "border-border bg-surface-inset shadow-[var(--shadow-inset)]"
          )}
          style={{ minWidth: `${Math.max(180, maxLen * 34)}px` }}
        >
          {/* Top Operand */}
          <div className="font-mono tabular-nums text-4xl sm:text-5xl font-extrabold text-text-primary tracking-wider select-none">
            {op1.toLocaleString()}
          </div>

          {/* Bottom Operand with Operator */}
          <div className="flex items-center justify-between w-full font-mono tabular-nums text-4xl sm:text-5xl font-extrabold text-text-primary tracking-wider select-none mt-2">
            <span
              className={cn(
                "inline-flex items-center justify-center w-9 h-9 rounded-xl border text-xl font-bold font-display shadow-sm mr-4",
                getOpBadgeClass()
              )}
            >
              {symbol}
            </span>
            <span>{op2?.toLocaleString()}</span>
          </div>

          {/* Horizontal Calculation Rule */}
          <div className="w-full h-1 bg-border-active/60 rounded-full my-3 shadow-sm" />

          {/* Answer Preview */}
          <div
            className={cn(
              "font-mono tabular-nums text-4xl sm:text-5xl font-extrabold tracking-wider min-h-[3.25rem] flex items-center justify-end w-full",
              isAnswered
                ? isCorrect
                  ? "text-success"
                  : "text-error"
                : userAnswer
                  ? "text-primary"
                  : "text-text-muted/40"
            )}
          >
            {userAnswer ? (
              <span className="flex items-center">
                {userAnswer}
                <span className="inline-block w-0.5 h-8 bg-primary ml-1 animate-pulse" />
              </span>
            ) : isAnswered ? (
              question.correctAnswer
            ) : (
              <span className="opacity-40">?</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Inline Math Display (Squares, Roots, Percentages, and standard operations)
  return (
    <div
      className="flex flex-col items-center justify-center my-4 sm:my-6 text-center w-full max-w-2xl px-2"
      role="region"
      aria-label={screenReaderText}
    >
      <span className="sr-only">{screenReaderText}</span>
      <div
        className={cn(
          "neu-inset relative inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-6 sm:px-10 py-5 sm:py-7 rounded-3xl border transition-all duration-300 select-none shadow-[var(--shadow-inset)] max-w-full",
          isAnswered
            ? isCorrect
              ? "border-success/50 bg-success-muted/15 shadow-[0_0_35px_rgba(34,197,94,0.18)]"
              : "border-error/50 bg-error-muted/15 shadow-[0_0_35px_rgba(239,68,68,0.18)]"
            : "border-border bg-surface-inset"
        )}
      >
        {signature.operation === "squares" ? (
          <div className="flex items-center">
            <span className="font-mono tabular-nums text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
              {op1}
            </span>
            <span className="font-mono text-xl sm:text-2xl font-bold text-primary -mt-4 ml-0.5">
              ²
            </span>
          </div>
        ) : signature.operation === "roots" ? (
          <div className="flex items-center gap-1">
            <span className="font-display text-2xl sm:text-4xl font-extrabold text-primary">
              √
            </span>
            <span className="font-mono tabular-nums text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
              {op1}
            </span>
          </div>
        ) : signature.operation === "percentages" ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-mono tabular-nums text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
              {op1}%
            </span>
            <span className="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-text-muted">
              of
            </span>
            <span className="font-mono tabular-nums text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
              {op2}
            </span>
          </div>
        ) : (
          <>
            <span className="font-mono tabular-nums text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
              {op1}
            </span>
            <span
              className={cn(
                "inline-flex items-center justify-center min-w-9 h-9 sm:min-w-11 sm:h-11 px-2 rounded-xl border text-xl sm:text-2xl font-extrabold font-display shadow-sm",
                getOpBadgeClass()
              )}
            >
              {symbol}
            </span>
            <span className="font-mono tabular-nums text-3xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
              {op2}
            </span>
          </>
        )}

        <span className="font-display text-2xl sm:text-4xl font-extrabold text-text-muted/60 px-1">
          =
        </span>

        <span
          className={cn(
            "font-mono tabular-nums text-3xl sm:text-5xl font-extrabold tracking-tight min-w-[2.5ch] inline-flex items-center text-left",
            isAnswered
              ? isCorrect
                ? "text-success"
                : "text-error"
              : userAnswer
                ? "text-primary"
                : "text-text-muted/40"
          )}
        >
          {userAnswer ? (
            <span className="flex items-center">
              {userAnswer}
              <span className="inline-block w-0.5 h-8 sm:h-10 bg-primary ml-1 animate-pulse" />
            </span>
          ) : isAnswered ? (
            question.correctAnswer
          ) : (
            <span className="opacity-40">?</span>
          )}
        </span>
      </div>
    </div>
  );
}
