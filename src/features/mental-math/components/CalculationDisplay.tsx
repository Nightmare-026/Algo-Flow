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
      : signature.operation === "cubes"
        ? `Calculate ${op1} cubed`
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
        className={cn(
          "w-full h-full min-h-[220px] sm:min-h-[280px] lg:min-h-[380px] flex flex-col justify-between items-center rounded-[8px] border transition-all duration-300 bg-surface p-4 sm:p-6 lg:p-8 shadow-card relative overflow-hidden select-none",
          isAnswered
            ? isCorrect
              ? "border-success/50 bg-success-muted/10 shadow-[0_0_40px_rgba(15,138,95,0.15)]"
              : "border-error/50 bg-error-muted/10 shadow-[0_0_40px_rgba(186,26,26,0.15)]"
            : "border-border/80 bg-surface"
        )}
        role="region"
        aria-label={screenReaderText}
      >
        <span className="sr-only">{screenReaderText}</span>

        {/* Card Header */}
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] font-bold font-display uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <span className="capitalize">{signature.operation} Drill</span>
          </span>

          <div>
            {isAnswered ? (
              isCorrect ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider bg-success-muted text-success border border-success/30">
                  Correct ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider bg-error-muted text-error border border-error/30">
                  Incorrect ✗
                </span>
              )
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[10px] font-mono font-bold text-text-muted bg-surface-secondary border border-border">
                Solve
              </span>
            )}
          </div>
        </div>

        {/* Vertical Calculation Rule Box */}
        <div className="flex-1 flex items-center justify-center my-2 sm:my-4">
          <div
            className="relative inline-flex flex-col items-end px-6 sm:px-10 py-4 sm:py-6 rounded-[8px] border border-border bg-surface-secondary/70 shadow-xs"
            style={{ minWidth: `${Math.max(160, maxLen * 32)}px` }}
          >
            {/* Top Operand */}
            <div className="font-mono tabular-nums text-3xl sm:text-5xl font-extrabold text-text-primary tracking-wider select-none">
              {op1.toLocaleString()}
            </div>

            {/* Bottom Operand with Operator */}
            <div className="flex items-center justify-between w-full font-mono tabular-nums text-3xl sm:text-5xl font-extrabold text-text-primary tracking-wider select-none mt-2">
              <span
                className={cn(
                  "inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-[4px] border text-lg sm:text-xl font-bold font-display shadow-xs mr-4",
                  getOpBadgeClass()
                )}
              >
                {symbol}
              </span>
              <span>{op2?.toLocaleString()}</span>
            </div>

            {/* Horizontal Calculation Rule */}
            <div className="w-full h-1 bg-border-active/60 rounded-full my-2 sm:my-3 shadow-sm" />

            {/* Answer Preview */}
            <div
              className={cn(
                "font-mono tabular-nums text-3xl sm:text-5xl font-extrabold tracking-wider min-h-11 sm:min-h-[3.25rem] flex items-center justify-end w-full",
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
                  <span className="inline-block w-0.5 h-7 sm:h-8 bg-primary ml-1 animate-pulse" />
                </span>
              ) : isAnswered ? (
                question.correctAnswer
              ) : (
                <span className="opacity-40">?</span>
              )}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-between w-full text-[11px] font-mono text-text-muted border-t border-border/60 pt-3">
          <div className="flex items-center gap-1.5">
            <span>Tier:</span>
            <span className="capitalize font-bold text-text-secondary">
              {expression.metadata?.calculatedTier || "Normal"}
            </span>
          </div>
          <div className="hidden sm:block text-text-muted text-[10px]">
            Calculate without pen & paper
          </div>
        </div>
      </div>
    );
  }

  // Inline Math Display (Squares, Roots, Percentages, and standard operations)
  return (
    <div
      className={cn(
        "w-full h-full min-h-[220px] sm:min-h-[280px] lg:min-h-[380px] flex flex-col justify-between items-center rounded-[8px] border transition-all duration-300 bg-surface p-4 sm:p-6 lg:p-8 shadow-card relative overflow-hidden select-none",
        isAnswered
          ? isCorrect
            ? "border-success/50 bg-success-muted/10 shadow-[0_0_40px_rgba(15,138,95,0.15)]"
            : "border-error/50 bg-error-muted/10 shadow-[0_0_40px_rgba(186,26,26,0.15)]"
          : "border-border/80 bg-surface"
      )}
      role="region"
      aria-label={screenReaderText}
    >
      <span className="sr-only">{screenReaderText}</span>

      {/* Card Header */}
      <div className="flex items-center justify-between w-full">
        <span className="text-[11px] font-bold font-display uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="capitalize">{signature.operation} Drill</span>
        </span>

        <div>
          {isAnswered ? (
            isCorrect ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider bg-success-muted text-success border border-success/30">
                Correct ✓
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider bg-error-muted text-error border border-error/30">
                Incorrect ✗
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] text-[10px] font-mono font-bold text-text-muted bg-surface-secondary border border-border">
              Solve
            </span>
          )}
        </div>
      </div>

      {/* Main Calculation Stage */}
      <div className="flex-1 flex items-center justify-center w-full my-2 sm:my-4">
        <div className="relative inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 px-5 sm:px-8 py-4 sm:py-6 rounded-[8px] border border-border bg-surface-secondary/70 transition-all duration-300 select-none shadow-xs max-w-full">
          {signature.operation === "squares" ? (
            <div className="flex items-center">
              <span className="font-mono tabular-nums text-3xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight">
                {op1}
              </span>
              <span className="font-mono text-xl sm:text-3xl font-bold text-primary -mt-4 sm:-mt-6 ml-0.5">
                ²
              </span>
            </div>
          ) : signature.operation === "cubes" ? (
            <div className="flex items-center">
              <span className="font-mono tabular-nums text-3xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight">
                {op1}
              </span>
              <span className="font-mono text-xl sm:text-3xl font-bold text-primary -mt-4 sm:-mt-6 ml-0.5">
                ³
              </span>
            </div>
          ) : signature.operation === "roots" ? (
            <div className="flex items-center gap-1">
              <span className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-primary">
                √
              </span>
              <span className="font-mono tabular-nums text-3xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight">
                {op1}
              </span>
            </div>
          ) : signature.operation === "percentages" ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="font-mono tabular-nums text-3xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight">
                {op1}%
              </span>
              <span className="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-text-muted">
                of
              </span>
              <span className="font-mono tabular-nums text-3xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight">
                {op2}
              </span>
            </div>
          ) : (
            <>
              <span className="font-mono tabular-nums text-3xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight">
                {op1}
              </span>
              <span
                className={cn(
                  "inline-flex items-center justify-center min-w-9 h-9 sm:min-w-12 sm:h-12 lg:min-w-14 lg:h-14 px-2 rounded-[4px] border text-xl sm:text-2xl lg:text-3xl font-extrabold font-display shadow-xs",
                  getOpBadgeClass()
                )}
              >
                {symbol}
              </span>
              <span className="font-mono tabular-nums text-3xl sm:text-5xl lg:text-6xl font-extrabold text-text-primary tracking-tight">
                {op2}
              </span>
            </>
          )}

          <span className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-text-muted/60 px-1">
            =
          </span>

          <span
            className={cn(
              "font-mono tabular-nums text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight min-w-[2.5ch] inline-flex items-center text-left",
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
                <span className="inline-block w-0.5 sm:w-1 h-8 sm:h-12 bg-primary ml-1 animate-pulse" />
              </span>
            ) : isAnswered ? (
              question.correctAnswer
            ) : (
              <span className="opacity-40">?</span>
            )}
          </span>
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex items-center justify-between w-full text-[11px] font-mono text-text-muted border-t border-border/60 pt-3">
        <div className="flex items-center gap-1.5">
          <span>Tier:</span>
          <span className="capitalize font-bold text-text-secondary">
            {expression.metadata?.calculatedTier || "Normal"}
          </span>
        </div>
        <div className="hidden sm:block text-text-muted text-[10px]">
          Calculate without pen & paper
        </div>
      </div>
    </div>
  );
}
