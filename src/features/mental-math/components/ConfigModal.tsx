"use client";

import React, { useState } from "react";
import { DifficultyTier, MathOperation, SessionConfig } from "../core/types";
import { cn } from "@/lib/utils";
import { ArrowRight, Sparkles, SlidersHorizontal, Clock, Hash, Zap, CheckCircle2 } from "lucide-react";

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
    preview: string;
    accentClass: string;
    badgeBg: string;
  }> = [
    {
      id: "addition",
      label: "Addition",
      symbol: "+",
      preview: "48 + 76",
      accentClass: "text-emerald-500",
      badgeBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "subtraction",
      label: "Subtraction",
      symbol: "−",
      preview: "94 − 38",
      accentClass: "text-cyan-500",
      badgeBg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      id: "multiplication",
      label: "Multiplication",
      symbol: "×",
      preview: "24 × 7",
      accentClass: "text-amber-500",
      badgeBg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "division",
      label: "Division",
      symbol: "÷",
      preview: "168 ÷ 4",
      accentClass: "text-purple-500",
      badgeBg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      id: "squares",
      label: "Squares",
      symbol: "x²",
      preview: "15² = 225",
      accentClass: "text-rose-500",
      badgeBg: "bg-rose-500/10 border-rose-500/20",
    },
    {
      id: "roots",
      label: "Square Roots",
      symbol: "√x",
      preview: "√144 = 12",
      accentClass: "text-indigo-500",
      badgeBg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      id: "percentages",
      label: "Percentages",
      symbol: "%",
      preview: "15% of 80",
      accentClass: "text-blue-500",
      badgeBg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "mixed",
      label: "Mixed Ops",
      symbol: "±×÷",
      preview: "Random Ops",
      accentClass: "text-primary",
      badgeBg: "bg-primary-muted/20 border-primary/20",
    },
  ];

  const difficulties: Array<{ id: DifficultyTier; label: string; desc: string; carries: string }> = [
    { id: "easy", label: "Easy", desc: "No carries / borrows", carries: "0 carry steps • Friendly numbers" },
    { id: "medium", label: "Medium", desc: "Moderate carrying", carries: "1-2 carries • Standard mental splits" },
    { id: "hard", label: "Hard", desc: "Complex multi-carry", carries: "Full carries/borrows • High focus" },
    { id: "expert", label: "Expert", desc: "Mastery speed tier", carries: "Challenging digits & non-round multipliers" },
  ];

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

  const getFormulaPreview = () => {
    const opObj = operations.find((o) => o.id === operation);
    const leftText = `${digitCountLeft}-digit (${digitCountLeft === 1 ? "1-9" : digitCountLeft === 2 ? "10-99" : digitCountLeft === 3 ? "100-999" : "1000-9999"})`;
    const rightText = `${digitCountRight}-digit (${digitCountRight === 1 ? "1-9" : digitCountRight === 2 ? "10-99" : digitCountRight === 3 ? "100-999" : "1000-9999"})`;

    if (isUnaryOp) {
      return `${operation === "squares" ? "Squaring" : "Square root of"} ${leftText} • ${difficulty.toUpperCase()}`;
    }
    if (operation === "percentages") {
      return `Percentages of ${rightText} • ${difficulty.toUpperCase()}`;
    }
    return `${leftText} ${opObj?.symbol || "+"} ${rightText} • ${difficulty.toUpperCase()}`;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="neu-float w-full max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl border border-border flex flex-col gap-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="inline-flex min-h-7 items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-[11px] font-bold font-display uppercase tracking-wider text-primary shadow-[var(--shadow-raised-sm)] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Drill Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">{subtitle}</p>
        </div>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold font-display text-text-muted hover:text-text-primary px-3 py-1.5 rounded-xl border border-border bg-surface shadow-sm cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      {/* 1. Operation Selection (8 Distinct Tiles) */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center justify-between">
          <span>1. Select Operation</span>
          <span className="text-[11px] font-normal text-text-secondary">
            Selected: <strong className="text-text-primary capitalize">{operation}</strong>
          </span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {operations.map((op) => {
            const isSelected = operation === op.id;
            return (
              <button
                key={op.id}
                type="button"
                onClick={() => setOperation(op.id)}
                className={cn(
                  "neu-raised p-3 sm:p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-2 transition-all active:scale-95 cursor-pointer relative overflow-hidden",
                  isSelected
                    ? "border-primary bg-primary-muted/30 text-primary shadow-[var(--shadow-inset)] ring-2 ring-primary/30"
                    : "border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <span
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-xl font-mono text-base font-extrabold border shadow-sm",
                      op.badgeBg,
                      op.accentClass
                    )}
                  >
                    {op.symbol}
                  </span>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold font-display text-text-primary">{op.label}</p>
                  <p className="text-[10px] font-mono text-text-muted mt-0.5">{op.preview}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Operand Digit Range Selectors */}
      <div className="p-4 rounded-2xl border border-border/80 bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-primary" />
            <span>2. Operand Digit Counts (User-Controlled)</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary-muted border border-primary/20">
            Strict Digits
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Left Operand Digits */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-text-secondary">
              {isUnaryOp ? "Base Number Digits" : "Left Operand (Number of Digits)"}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDigitCountLeft(d)}
                  className={cn(
                    "neu-raised py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer",
                    digitCountLeft === d
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                  )}
                >
                  {d} {d === 1 ? "Digit" : "Digits"}
                </button>
              ))}
            </div>
            <p className="text-[10px] font-mono text-text-muted">
              Range: {digitCountLeft === 1 ? "1 to 9" : digitCountLeft === 2 ? "10 to 99" : digitCountLeft === 3 ? "100 to 999" : "1,000 to 9,999"}
            </p>
          </div>

          {/* Right Operand Digits */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-bold text-text-secondary">
              {isUnaryOp ? "Unary Operator" : "Right Operand (Number of Digits)"}
            </label>
            {isUnaryOp ? (
              <div className="flex items-center justify-center h-10 px-3 rounded-xl border border-border/60 bg-surface text-[11px] font-mono text-text-muted text-center">
                {operation === "squares"
                  ? "Squaring single base (x²)"
                  : "Extracting integer root (√x)"}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-1.5">
                  {[1, 2, 3, 4].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDigitCountRight(d)}
                      className={cn(
                        "neu-raised py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer",
                        digitCountRight === d
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                      )}
                    >
                      {d} {d === 1 ? "Digit" : "Digits"}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] font-mono text-text-muted">
                  Range: {digitCountRight === 1 ? "1 to 9" : digitCountRight === 2 ? "10 to 99" : digitCountRight === 3 ? "100 to 999" : "1,000 to 9,999"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3. Difficulty Modifier Within Digits */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>3. Difficulty Modifier</span>
          </span>
          <span className="text-[11px] font-normal text-text-secondary">
            Carrying & Borrowing Intensity
          </span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {difficulties.map((diff) => {
            const isSelected = difficulty === diff.id;
            return (
              <button
                key={diff.id}
                type="button"
                onClick={() => setDifficulty(diff.id)}
                className={cn(
                  "neu-raised p-3 rounded-2xl border text-left transition-all active:scale-95 cursor-pointer flex flex-col justify-between",
                  isSelected
                    ? "border-primary bg-primary-muted/40 text-primary shadow-[var(--shadow-inset)] ring-1 ring-primary/20"
                    : "border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                )}
              >
                <div>
                  <span className="text-xs font-bold font-display">{diff.label}</span>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    {diff.desc}
                  </p>
                </div>
                <span className="text-[9px] font-mono font-semibold text-primary mt-2">
                  {diff.carries}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Live Configuration Pill Preview */}
      <div className="neu-inset p-3 rounded-2xl border border-border bg-surface-inset text-center shadow-[var(--shadow-inset)]">
        <span className="text-[11px] font-mono text-text-secondary">
          Target Configuration: <strong className="text-primary font-bold">{getFormulaPreview()}</strong>
        </span>
      </div>

      {/* 4. Problem Volume & Input Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Problem Volume */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-warning" />
            <span>Problem Count</span>
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[5, 10, 20, 30].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuestionCount(q)}
                className={cn(
                  "neu-raised py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer",
                  questionCount === q
                    ? "border-primary bg-primary-muted text-primary shadow-[var(--shadow-inset)]"
                    : "border-border text-text-secondary hover:bg-surface-hover"
                )}
              >
                {q} Qs
              </button>
            ))}
          </div>
        </div>

        {/* Input Mode */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
            Input Format
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setHintsEnabled(false)}
              className={cn(
                "neu-raised py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                !hintsEnabled
                  ? "border-primary bg-primary-muted text-primary shadow-[var(--shadow-inset)]"
                  : "border-border text-text-secondary hover:bg-surface-hover"
              )}
            >
              ⌨️ Keypad Input
            </button>
            <button
              type="button"
              onClick={() => setHintsEnabled(true)}
              className={cn(
                "neu-raised py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer",
                hintsEnabled
                  ? "border-primary bg-primary-muted text-primary shadow-[var(--shadow-inset)]"
                  : "border-border text-text-secondary hover:bg-surface-hover"
              )}
            >
              🃏 4 Choices
            </button>
          </div>
        </div>
      </div>

      {/* 5. Timer Pacing */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-text-muted" />
          <span>Timer Pacing</span>
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: "Untimed", val: undefined },
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
                  "neu-raised py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer",
                  isSelected
                    ? "border-primary bg-primary-muted text-primary shadow-[var(--shadow-inset)]"
                    : "border-border text-text-secondary hover:bg-surface-hover"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Start Button */}
      <button
        type="submit"
        className="mt-2 w-full py-4 rounded-2xl bg-primary hover:bg-primary-hover text-white font-display font-extrabold text-sm uppercase tracking-wider shadow-[var(--shadow-raised-sm)] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Launch Practice Drill</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </form>
  );
}

export { ConfigModal as DrillSetupStudio };
