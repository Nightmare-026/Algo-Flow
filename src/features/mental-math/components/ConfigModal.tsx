"use client";

import React, { useState } from "react";
import { DifficultyTier, MathOperation, SessionConfig } from "../core/types";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Clock,
  Zap,
  CheckCircle2,
  Plus,
  Minus,
  RotateCcw,
  Keyboard,
  Calculator,
} from "lucide-react";

interface ConfigModalProps {
  initialConfig?: Partial<SessionConfig>;
  onStart: (config: SessionConfig) => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export function ConfigModal({
  initialConfig,
  onStart,
  onCancel,
  title = "Practice Studio Setup",
  subtitle = "Customize your operation, operand digit ranges, and difficulty modifiers.",
}: ConfigModalProps) {
  const [operation, setOperation] = useState<MathOperation>(initialConfig?.operation ?? "addition");
  const [difficulty, setDifficulty] = useState<DifficultyTier>(initialConfig?.difficulty ?? "easy");
  const [digitCountLeft, setDigitCountLeft] = useState(initialConfig?.digitCountLeft ?? 2);
  const [digitCountRight, setDigitCountRight] = useState(initialConfig?.digitCountRight ?? 2);
  const [questionCount, setQuestionCount] = useState(initialConfig?.questionCount ?? 10);
  const [hintsEnabled, setHintsEnabled] = useState(initialConfig?.hintsEnabled ?? false);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number | undefined>(
    initialConfig?.timeLimitSeconds ?? undefined
  );

  const isUnaryOp = operation === "squares" || operation === "roots";

  const operations: Array<{
    id: MathOperation;
    label: string;
    symbol: string;
    sampleFormula: string;
    accentClass: string;
    badgeBg: string;
    description: string;
  }> = [
    {
      id: "addition",
      label: "Addition",
      symbol: "+",
      sampleFormula: "48 + 76",
      accentClass: "text-emerald-500",
      badgeBg: "bg-emerald-500/10 border-emerald-500/20",
      description: "Summation & partial adds",
    },
    {
      id: "subtraction",
      label: "Subtraction",
      symbol: "−",
      sampleFormula: "94 − 38",
      accentClass: "text-cyan-500",
      badgeBg: "bg-cyan-500/10 border-cyan-500/20",
      description: "Differences & borrow steps",
    },
    {
      id: "multiplication",
      label: "Multiplication",
      symbol: "×",
      sampleFormula: "24 × 7",
      accentClass: "text-amber-500",
      badgeBg: "bg-amber-500/10 border-amber-500/20",
      description: "Distributive products",
    },
    {
      id: "division",
      label: "Division",
      symbol: "÷",
      sampleFormula: "168 ÷ 4",
      accentClass: "text-purple-500",
      badgeBg: "bg-purple-500/10 border-purple-500/20",
      description: "Integer quotient splits",
    },
    {
      id: "squares",
      label: "Squares",
      symbol: "x²",
      sampleFormula: "15² = 225",
      accentClass: "text-rose-500",
      badgeBg: "bg-rose-500/10 border-rose-500/20",
      description: "Base powers & tricks",
    },
    {
      id: "roots",
      label: "Square Roots",
      symbol: "√x",
      sampleFormula: "√144 = 12",
      accentClass: "text-indigo-500",
      badgeBg: "bg-indigo-500/10 border-indigo-500/20",
      description: "Perfect square extraction",
    },
    {
      id: "percentages",
      label: "Percentages",
      symbol: "%",
      sampleFormula: "15% of 80",
      accentClass: "text-blue-500",
      badgeBg: "bg-blue-500/10 border-blue-500/20",
      description: "Benchmark proportions",
    },
    {
      id: "mixed",
      label: "Mixed Ops",
      symbol: "±×÷",
      sampleFormula: "Random Ops",
      accentClass: "text-primary",
      badgeBg: "bg-primary-muted/20 border-primary/20",
      description: "Dynamic arithmetic flow",
    },
  ];

  const difficulties: Array<{
    id: DifficultyTier;
    label: string;
    desc: string;
    carriesDetail: string;
    badgeColor: string;
  }> = [
    {
      id: "easy",
      label: "Easy",
      desc: "Zero carries / zero borrows",
      carriesDetail: "0 Carry Steps • Friendly Multipliers",
      badgeColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "medium",
      label: "Medium",
      desc: "Moderate single-carry steps",
      carriesDetail: "1–2 Carries • Standard Splits",
      badgeColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "hard",
      label: "Hard",
      desc: "Complex carrying & borrowing",
      carriesDetail: "Multi-Carry • Non-Round Numbers",
      badgeColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
    {
      id: "expert",
      label: "Expert",
      desc: "High-intensity calculation",
      carriesDetail: "Maximum Focus • Multi-Step",
      badgeColor: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
  ];

  const handleResetDefaults = () => {
    setOperation("addition");
    setDifficulty("easy");
    setDigitCountLeft(2);
    setDigitCountRight(2);
    setQuestionCount(10);
    setHintsEnabled(false);
    setTimeLimitSeconds(undefined);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      mode: initialConfig?.mode ?? "practice",
      operation,
      difficulty,
      digitCountLeft,
      digitCountRight: isUnaryOp ? digitCountLeft : digitCountRight,
      questionCount,
      hintsEnabled,
      soundEnabled: true,
      timeLimitSeconds: timeLimitSeconds || undefined,
      seed: initialConfig?.seed,
    });
  };

  // Generate dynamic live math sample for preview
  const getLivePreview = () => {
    let sampleLeft = digitCountLeft === 1 ? 8 : digitCountLeft === 2 ? 48 : digitCountLeft === 3 ? 348 : 2848;
    let sampleRight = digitCountRight === 1 ? 6 : digitCountRight === 2 ? 37 : digitCountRight === 3 ? 245 : 1245;

    if (operation === "squares") {
      sampleLeft = digitCountLeft === 1 ? 7 : digitCountLeft === 2 ? 25 : 125;
      return {
        formula: `${sampleLeft}² = ${sampleLeft * sampleLeft}`,
        desc: `Squaring a ${digitCountLeft}-digit integer (${digitCountLeft === 1 ? "1–9" : digitCountLeft === 2 ? "10–99" : "100–999"})`,
      };
    }
    if (operation === "roots") {
      const rootBase = digitCountLeft === 1 ? 6 : digitCountLeft === 2 ? 14 : 45;
      return {
        formula: `√${rootBase * rootBase} = ${rootBase}`,
        desc: `Extracting whole square roots (${digitCountLeft}-digit target)`,
      };
    }
    if (operation === "percentages") {
      return {
        formula: `15% of ${digitCountRight === 1 ? 80 : digitCountRight === 2 ? 240 : 1200} = ?`,
        desc: `Percentages calculated on ${digitCountRight}-digit base values`,
      };
    }
    if (operation === "subtraction") {
      if (sampleLeft < sampleRight) {
        [sampleLeft, sampleRight] = [sampleRight, sampleLeft];
      }
      return {
        formula: `${sampleLeft} − ${sampleRight} = ${sampleLeft - sampleRight}`,
        desc: `${digitCountLeft}-digit Left Operand minus ${digitCountRight}-digit Right Operand`,
      };
    }
    if (operation === "division") {
      const divisor = digitCountRight === 1 ? 4 : 12;
      const dividend = divisor * (digitCountLeft === 1 ? 6 : digitCountLeft === 2 ? 28 : 142);
      return {
        formula: `${dividend} ÷ ${divisor} = ${dividend / divisor}`,
        desc: `Exact integer division (${digitCountLeft}-digit dividend ÷ ${digitCountRight}-digit divisor)`,
      };
    }
    if (operation === "multiplication") {
      return {
        formula: `${sampleLeft} × ${sampleRight} = ${(sampleLeft * sampleRight).toLocaleString()}`,
        desc: `${digitCountLeft}-digit Left Operand multiplied by ${digitCountRight}-digit Right Operand`,
      };
    }
    return {
      formula: `${sampleLeft} + ${sampleRight} = ${(sampleLeft + sampleRight).toLocaleString()}`,
      desc: `${digitCountLeft}-digit Left Operand plus ${digitCountRight}-digit Right Operand`,
    };
  };

  const liveSample = getLivePreview();
  const estimatedSeconds = questionCount * (difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 8);

  return (
    <form
      onSubmit={handleSubmit}
      className="neu-float w-full max-w-3xl mx-auto p-5 sm:p-8 rounded-3xl border border-border flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 backdrop-blur-md"
    >
      {/* 1. Header with Title and Quick Reset */}
      <div className="flex justify-between items-start">
        <div>
          <div className="inline-flex min-h-7 items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-[11px] font-bold font-display uppercase tracking-wider text-primary shadow-[var(--shadow-raised-sm)] mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Drill Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            title="Reset to defaults"
            className="flex items-center gap-1.5 text-xs font-bold font-display text-text-muted hover:text-text-primary px-3 py-2 rounded-xl border border-border bg-surface shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Defaults</span>
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-xs font-bold font-display text-text-muted hover:text-text-primary px-3 py-2 rounded-xl border border-border bg-surface shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* 2. Live Calculation Simulator Hero Banner */}
      <div className="neu-inset relative overflow-hidden rounded-2xl p-4 sm:p-5 border border-primary/30 bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-muted">
            Live Math Problem Preview
          </span>
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            {liveSample.formula}
          </div>
          <p className="text-[11px] font-sans font-medium text-text-secondary">
            {liveSample.desc}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-1.5 shrink-0">
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase bg-surface border border-border text-text-primary shadow-xs">
            {digitCountLeft}d {isUnaryOp ? "Base" : `× ${digitCountRight}d`}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase bg-primary-muted text-primary border border-primary/20 shadow-xs">
            {difficulty}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase bg-surface border border-border text-text-muted shadow-xs">
            {questionCount} Qs
          </span>
        </div>
      </div>

      {/* 3. Section 1: Operation Selection (8 Distinct Neumorphic Cards) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-white text-[10px] font-extrabold">
              1
            </span>
            <span>Select Arithmetic Operation</span>
          </label>
          <span className="text-[11px] font-mono text-text-secondary">
            Active: <strong className="text-primary capitalize">{operation}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {operations.map((op) => {
            const isSelected = operation === op.id;
            return (
              <button
                key={op.id}
                type="button"
                onClick={() => setOperation(op.id)}
                className={cn(
                  "neu-raised p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition-all duration-200 active:scale-95 cursor-pointer relative overflow-hidden",
                  isSelected
                    ? "border-primary bg-primary-muted/30 text-primary shadow-[var(--shadow-inset)] ring-2 ring-primary/40"
                    : "border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary hover:border-border-hover"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl font-mono text-base font-extrabold border shadow-sm",
                      op.badgeBg,
                      op.accentClass
                    )}
                  >
                    {op.symbol}
                  </span>
                  {isSelected ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shadow-sm">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-text-muted font-bold">
                      {op.sampleFormula}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold font-display text-text-primary tracking-tight">
                    {op.label}
                  </p>
                  <p className="text-[10px] font-sans text-text-muted mt-0.5 line-clamp-1">
                    {op.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Section 2: Operand Digits Interactive Studio */}
      <div className="neu-raised p-4 sm:p-5 rounded-3xl border border-border flex flex-col gap-4 shadow-[var(--shadow-raised-sm)]">
        <div className="flex justify-between items-center">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-white text-[10px] font-extrabold">
              2
            </span>
            <span>Operand Digit Length Controls</span>
          </label>
          <span className="text-[10px] font-mono font-bold text-primary px-2.5 py-0.5 rounded-full bg-primary-muted border border-primary/20">
            Strict Range Bounds
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left Operand Digit Control */}
          <div className="neu-inset p-3.5 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-text-primary">
                {isUnaryOp ? "Base Number Digits" : "Left Number (Digits)"}
              </span>
              <span className="text-[10px] font-mono font-bold text-primary">
                {digitCountLeft === 1
                  ? "1 to 9 (1d)"
                  : digitCountLeft === 2
                  ? "10 to 99 (2d)"
                  : digitCountLeft === 3
                  ? "100 to 999 (3d)"
                  : "1,000 to 9,999 (4d)"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setDigitCountLeft((prev) => Math.max(1, prev - 1))}
                disabled={digitCountLeft <= 1}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-primary hover:bg-surface-hover disabled:opacity-40 shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
                aria-label="Decrease left operand digits"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>

              <div className="grid grid-cols-4 gap-1.5 flex-1">
                {[1, 2, 3, 4].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDigitCountLeft(d)}
                    className={cn(
                      "py-2 rounded-xl border text-xs font-mono font-bold transition-all duration-150 cursor-pointer text-center",
                      digitCountLeft === d
                        ? "border-primary bg-primary text-white shadow-sm"
                        : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                    )}
                  >
                    {d}d
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setDigitCountLeft((prev) => Math.min(4, prev + 1))}
                disabled={digitCountLeft >= 4}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-primary hover:bg-surface-hover disabled:opacity-40 shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
                aria-label="Increase left operand digits"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Right Operand Digit Control */}
          <div className="neu-inset p-3.5 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold text-text-primary">
                {isUnaryOp ? "Operation Type" : "Right Number (Digits)"}
              </span>
              <span className="text-[10px] font-mono font-bold text-primary">
                {isUnaryOp
                  ? "Single Operand"
                  : digitCountRight === 1
                  ? "1 to 9 (1d)"
                  : digitCountRight === 2
                  ? "10 to 99 (2d)"
                  : digitCountRight === 3
                  ? "100 to 999 (3d)"
                  : "1,000 to 9,999 (4d)"}
              </span>
            </div>

            {isUnaryOp ? (
              <div className="flex items-center justify-center h-10 px-3 rounded-xl border border-border/60 bg-surface text-[11px] font-mono text-text-muted text-center">
                {operation === "squares"
                  ? "Single base squaring (x²)"
                  : "Single radical extraction (√x)"}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setDigitCountRight((prev) => Math.max(1, prev - 1))}
                  disabled={digitCountRight <= 1}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-primary hover:bg-surface-hover disabled:opacity-40 shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
                  aria-label="Decrease right operand digits"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <div className="grid grid-cols-4 gap-1.5 flex-1">
                  {[1, 2, 3, 4].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDigitCountRight(d)}
                      className={cn(
                        "py-2 rounded-xl border text-xs font-mono font-bold transition-all duration-150 cursor-pointer text-center",
                        digitCountRight === d
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                      )}
                    >
                      {d}d
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setDigitCountRight((prev) => Math.min(4, prev + 1))}
                  disabled={digitCountRight >= 4}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface text-text-primary hover:bg-surface-hover disabled:opacity-40 shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
                  aria-label="Increase right operand digits"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. Section 3: Difficulty Modifier (Carrying & Borrowing Intensity) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-white text-[10px] font-extrabold">
              3
            </span>
            <span>Difficulty Modifier & Carrying Intensity</span>
          </label>
          <span className="text-[11px] font-mono text-text-secondary">
            Modifies internal complexity within selected digits
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {difficulties.map((diff) => {
            const isSelected = difficulty === diff.id;
            return (
              <button
                key={diff.id}
                type="button"
                onClick={() => setDifficulty(diff.id)}
                className={cn(
                  "neu-raised p-3.5 rounded-2xl border text-left transition-all duration-200 active:scale-95 cursor-pointer flex flex-col justify-between gap-3",
                  isSelected
                    ? "border-primary bg-primary-muted/40 text-primary shadow-[var(--shadow-inset)] ring-2 ring-primary/30"
                    : "border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary hover:border-border-hover"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-display text-text-primary">{diff.label}</span>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    )}
                  </div>
                  <p className="text-[11px] font-sans text-text-secondary mt-1 leading-snug">
                    {diff.desc}
                  </p>
                </div>
                <span className={cn("text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border text-center", diff.badgeColor)}>
                  {diff.carriesDetail}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Section 4: Problem Volume, Input Format, and Timer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Problem Volume */}
        <div className="neu-raised p-3.5 rounded-2xl border border-border flex flex-col justify-between gap-2.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Problem Count</span>
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[5, 10, 20, 30].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuestionCount(q)}
                className={cn(
                  "py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer text-center",
                  questionCount === q
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                )}
              >
                {q} Qs
              </button>
            ))}
          </div>
        </div>

        {/* Input Mode */}
        <div className="neu-raised p-3.5 rounded-2xl border border-border flex flex-col justify-between gap-2.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Keyboard className="w-3.5 h-3.5 text-primary" />
            <span>Input Format</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setHintsEnabled(false)}
              className={cn(
                "py-2 px-2 rounded-xl border text-xs font-bold font-display transition-all cursor-pointer text-center flex items-center justify-center gap-1",
                !hintsEnabled
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
              )}
            >
              <span>⌨️ Keypad</span>
            </button>
            <button
              type="button"
              onClick={() => setHintsEnabled(true)}
              className={cn(
                "py-2 px-2 rounded-xl border text-xs font-bold font-display transition-all cursor-pointer text-center flex items-center justify-center gap-1",
                hintsEnabled
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
              )}
            >
              <span>🃏 4 Choices</span>
            </button>
          </div>
        </div>

        {/* Timer Pacing */}
        <div className="neu-raised p-3.5 rounded-2xl border border-border flex flex-col justify-between gap-2.5">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-500" />
            <span>Timer Pacing</span>
          </label>
          <div className="grid grid-cols-4 gap-1">
            {[
              { label: "None", val: undefined },
              { label: "30s", val: 30 },
              { label: "60s", val: 60 },
              { label: "120s", val: 120 },
            ].map((t) => {
              const isSelected = timeLimitSeconds === t.val;
              return (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setTimeLimitSeconds(t.val)}
                  className={cn(
                    "py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer text-center",
                    isSelected
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7. Action Footer */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/80">
        <div className="text-xs font-mono text-text-muted flex items-center gap-2">
          <span>Est. Session Time: <strong className="text-text-primary">~{estimatedSeconds}s</strong></span>
          <span>•</span>
          <span>Press <strong className="text-text-primary">Enter ↵</strong> to launch</span>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto min-h-12 px-8 rounded-2xl bg-primary hover:bg-primary-hover text-white font-display font-extrabold text-xs uppercase tracking-wider shadow-[var(--shadow-raised)] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Launch Practice Drill</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

export { ConfigModal as DrillSetupStudio };
