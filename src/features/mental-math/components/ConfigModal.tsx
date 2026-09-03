"use client";

import React, { useState, useEffect } from "react";
import { DifficultyTier, MathOperation, SessionConfig } from "../core/types";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Clock,
  Zap,
  CheckCircle2,
  RotateCcw,
  Keyboard,
  LayoutGrid,
  X,
  Sparkles,
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
  subtitle = "Configure your calculation parameters and session rules.",
}: ConfigModalProps) {
  const [operation, setOperation] = useState<MathOperation>(
    initialConfig?.operation ?? "addition"
  );
  const [difficulty, setDifficulty] = useState<DifficultyTier>(
    initialConfig?.difficulty ?? "easy"
  );
  const [digitCountLeft, setDigitCountLeft] = useState<number>(
    initialConfig?.digitCountLeft ?? 2
  );
  const [digitCountRight, setDigitCountRight] = useState<number>(
    initialConfig?.digitCountRight ?? 2
  );
  const [questionCount, setQuestionCount] = useState<number>(
    initialConfig?.questionCount ?? 10
  );
  const [hintsEnabled, setHintsEnabled] = useState<boolean>(
    initialConfig?.hintsEnabled ?? false
  );
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number | undefined>(
    initialConfig?.timeLimitSeconds ?? undefined
  );

  const isUnaryOp = operation === "squares" || operation === "roots";

  // Escape key handler to cancel/close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onCancel) {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const getOpSymbol = (op: MathOperation) => {
    switch (op) {
      case "addition":
        return "+";
      case "subtraction":
        return "−";
      case "multiplication":
        return "×";
      case "division":
        return "÷";
      case "squares":
        return "²";
      case "roots":
        return "√";
      case "percentages":
        return "%";
      case "mixed":
        return "±×÷";
    }
  };

  const operations: Array<{
    id: MathOperation;
    label: string;
    symbol: string;
    shortDesc: string;
  }> = [
    { id: "addition", label: "Addition", symbol: "+", shortDesc: "Summation & partial adds" },
    { id: "subtraction", label: "Subtraction", symbol: "−", shortDesc: "Difference & borrows" },
    { id: "multiplication", label: "Multiplication", symbol: "×", shortDesc: "Cross-products & tables" },
    { id: "division", label: "Division", symbol: "÷", shortDesc: "Integer quotient splits" },
    { id: "squares", label: "Squares", symbol: "x²", shortDesc: "Base powers & identities" },
    { id: "roots", label: "Square Roots", symbol: "√x", shortDesc: "Perfect square extraction" },
    { id: "percentages", label: "Percentages", symbol: "%", shortDesc: "Benchmark proportions" },
    { id: "mixed", label: "Mixed Ops", symbol: "±×÷", shortDesc: "Interleaved arithmetic" },
  ];

  const difficulties: Array<{
    id: DifficultyTier;
    label: string;
    desc: string;
    tag: string;
  }> = [
    { id: "easy", label: "Easy", desc: "No carries / friendly factors", tag: "0 Carries" },
    { id: "medium", label: "Medium", desc: "Single carry / borrow steps", tag: "1–2 Carries" },
    { id: "hard", label: "Hard", desc: "Complex regrouping & borrows", tag: "Multi-Carry" },
    { id: "expert", label: "Expert", desc: "Maximum focus & non-round numbers", tag: "Max Regrouping" },
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

  // Dynamic live math formula preview
  const getLivePreview = () => {
    let sampleLeft =
      digitCountLeft === 1 ? 8 : digitCountLeft === 2 ? 48 : digitCountLeft === 3 ? 348 : 2848;
    let sampleRight =
      digitCountRight === 1 ? 6 : digitCountRight === 2 ? 37 : digitCountRight === 3 ? 245 : 1245;

    if (operation === "squares") {
      sampleLeft = digitCountLeft === 1 ? 7 : digitCountLeft === 2 ? 25 : 125;
      return {
        formula: `${sampleLeft}² = ${sampleLeft * sampleLeft}`,
        desc: `Squaring ${digitCountLeft}-digit integers (${digitCountLeft === 1 ? "1–9" : digitCountLeft === 2 ? "10–99" : "100–999"})`,
      };
    }
    if (operation === "roots") {
      const rootBase = digitCountLeft === 1 ? 6 : digitCountLeft === 2 ? 14 : 45;
      return {
        formula: `√${rootBase * rootBase} = ${rootBase}`,
        desc: `Extracting square root for a ${digitCountLeft}-digit answer`,
      };
    }
    if (operation === "percentages") {
      const base = digitCountRight === 1 ? 80 : digitCountRight === 2 ? 240 : 1200;
      return {
        formula: `15% of ${base} = ${(0.15 * base).toFixed(0)}`,
        desc: `Benchmark percentages of ${digitCountRight}-digit base values`,
      };
    }
    if (operation === "subtraction") {
      if (sampleLeft < sampleRight) {
        [sampleLeft, sampleRight] = [sampleRight, sampleLeft];
      }
      return {
        formula: `${sampleLeft} − ${sampleRight} = ${sampleLeft - sampleRight}`,
        desc: `${digitCountLeft}-digit minuend minus ${digitCountRight}-digit subtrahend`,
      };
    }
    if (operation === "division") {
      const divisor = digitCountRight === 1 ? 4 : 12;
      const dividend = divisor * (digitCountLeft === 1 ? 6 : digitCountLeft === 2 ? 28 : 142);
      return {
        formula: `${dividend} ÷ ${divisor} = ${dividend / divisor}`,
        desc: `${digitCountLeft}-digit dividend divided by ${digitCountRight}-digit divisor`,
      };
    }
    if (operation === "multiplication") {
      return {
        formula: `${sampleLeft} × ${sampleRight} = ${(sampleLeft * sampleRight).toLocaleString()}`,
        desc: `${digitCountLeft}-digit number multiplied by ${digitCountRight}-digit factor`,
      };
    }
    return {
      formula: `${sampleLeft} + ${sampleRight} = ${(sampleLeft + sampleRight).toLocaleString()}`,
      desc: `${digitCountLeft}-digit number plus ${digitCountRight}-digit number`,
    };
  };

  const liveSample = getLivePreview();
  const estimatedSeconds =
    questionCount * (difficulty === "easy" ? 3 : difficulty === "medium" ? 5 : 8);

  return (
    <form
      onSubmit={handleSubmit}
      className="neu-float w-full max-w-5xl mx-auto p-6 sm:p-8 rounded-3xl border border-border bg-surface/95 shadow-[var(--shadow-raised)] backdrop-blur-md flex flex-col gap-6"
    >
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border/80">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-text-primary tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-0.5">{subtitle}</p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleResetDefaults}
            title="Reset to default settings"
            className="flex items-center gap-1.5 text-xs font-bold font-display text-text-muted hover:text-text-primary px-3 py-2 rounded-xl border border-border bg-surface shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Defaults</span>
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              title="Cancel (Esc)"
              className="flex items-center gap-1.5 text-xs font-bold font-display text-text-muted hover:text-text-primary px-3 py-2 rounded-xl border border-border bg-surface shadow-[var(--shadow-raised-sm)] active:scale-95 transition-all cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Cancel</span>
              <kbd className="hidden sm:inline px-1 py-0.2 rounded bg-surface-inset border border-border text-[9px] font-mono font-bold text-text-muted">
                Esc
              </kbd>
            </button>
          )}
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* 1. Arithmetic Operation Grid */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-white text-[10px] font-extrabold">
                  1
                </span>
                <span>Arithmetic Operation</span>
              </label>
              <span className="text-[11px] font-mono text-text-secondary">
                Selected: <strong className="text-primary capitalize">{operation}</strong>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {operations.map((op) => {
                const isSelected = operation === op.id;
                return (
                  <button
                    key={op.id}
                    type="button"
                    onClick={() => setOperation(op.id)}
                    className={cn(
                      "neu-raised p-2.5 sm:p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all duration-150 active:scale-95 cursor-pointer relative overflow-hidden",
                      isSelected
                        ? "border-primary bg-primary-muted/30 text-primary shadow-[var(--shadow-inset)] ring-2 ring-primary/40"
                        : "border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                    )}
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-extrabold border border-border bg-surface-inset text-primary shadow-inner">
                      {op.symbol}
                    </span>
                    <div className="truncate min-w-0">
                      <p className="text-xs font-bold font-display text-text-primary truncate">
                        {op.label}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Operand Digit Length Controls */}
          <div className="neu-raised p-4 sm:p-5 rounded-2xl border border-border bg-surface flex flex-col gap-3.5 shadow-[var(--shadow-raised-sm)]">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-white text-[10px] font-extrabold">
                  2
                </span>
                <span>Digit Range Controls</span>
              </label>
              <span className="text-[10px] font-mono font-bold text-primary px-2 py-0.5 rounded-full bg-primary-muted border border-primary/20">
                Range Bounds
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Left Operand Digits */}
              <div className="neu-inset p-3 rounded-xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-text-primary">
                    {isUnaryOp ? "Base Number" : "Left Number"}
                  </span>
                  <span className="font-mono font-bold text-primary text-[10px]">
                    {digitCountLeft === 1
                      ? "1–9 (1d)"
                      : digitCountLeft === 2
                        ? "10–99 (2d)"
                        : digitCountLeft === 3
                          ? "100–999 (3d)"
                          : "1k–9.9k (4d)"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[1, 2, 3, 4].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDigitCountLeft(d)}
                      className={cn(
                        "py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer text-center",
                        digitCountLeft === d
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                      )}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Operand Digits */}
              <div className="neu-inset p-3 rounded-xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-text-primary">
                    {isUnaryOp ? "Operand Mode" : "Right Number"}
                  </span>
                  <span className="font-mono font-bold text-primary text-[10px]">
                    {isUnaryOp
                      ? "Single Operand"
                      : digitCountRight === 1
                        ? "1–9 (1d)"
                        : digitCountRight === 2
                          ? "10–99 (2d)"
                          : digitCountRight === 3
                            ? "100–999 (3d)"
                            : "1k–9.9k (4d)"}
                  </span>
                </div>

                {isUnaryOp ? (
                  <div className="flex items-center justify-center h-8 px-2 rounded-lg border border-border/60 bg-surface text-[10px] font-mono text-text-muted text-center">
                    Single base {operation === "squares" ? "power (x²)" : "root (√x)"}
                  </div>
                ) : (
                  <div className="grid grid-cols-4 gap-1">
                    {[1, 2, 3, 4].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDigitCountRight(d)}
                        className={cn(
                          "py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer text-center",
                          digitCountRight === d
                            ? "border-primary bg-primary text-white shadow-sm"
                            : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                        )}
                      >
                        {d}d
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 3. Difficulty Modifier & Regrouping Intensity */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-md bg-primary text-white text-[10px] font-extrabold">
                  3
                </span>
                <span>Difficulty & Regrouping</span>
              </label>
              <span className="text-[11px] font-mono text-text-secondary">
                Modifies carry & borrow complexity
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {difficulties.map((diff) => {
                const isSelected = difficulty === diff.id;
                return (
                  <button
                    key={diff.id}
                    type="button"
                    onClick={() => setDifficulty(diff.id)}
                    className={cn(
                      "neu-raised p-3 rounded-2xl border text-left transition-all duration-150 active:scale-95 cursor-pointer flex flex-col justify-between gap-1.5",
                      isSelected
                        ? "border-primary bg-primary-muted/40 text-primary shadow-[var(--shadow-inset)] ring-2 ring-primary/30"
                        : "border-border text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-bold font-display text-text-primary">
                        {diff.label}
                      </span>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-primary" />}
                    </div>
                    <p className="text-[10px] font-sans text-text-muted leading-tight line-clamp-1">
                      {diff.desc}
                    </p>
                    <span
                      className={cn(
                        "text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border text-center mt-1",
                        isSelected
                          ? "border-primary/30 bg-primary-muted text-primary shadow-inner"
                          : "border-border bg-surface-inset text-text-muted shadow-inner"
                      )}
                    >
                      {diff.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Session Rules: Problem Count, Format & Timer */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Problem Volume */}
            <div className="neu-raised p-3 rounded-2xl border border-border bg-surface flex flex-col justify-between gap-2 shadow-[var(--shadow-raised-sm)]">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-primary" />
                <span>Problem Count</span>
              </label>
              <div className="grid grid-cols-4 gap-1">
                {[5, 10, 20, 30].map((count) => {
                  const isSelected = questionCount === count;
                  return (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={cn(
                        "py-1.5 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer text-center",
                        isSelected
                          ? "border-primary bg-primary text-white shadow-sm"
                          : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                      )}
                    >
                      {count}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Input Mode */}
            <div className="neu-raised p-3 rounded-2xl border border-border bg-surface flex flex-col justify-between gap-2 shadow-[var(--shadow-raised-sm)]">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Keyboard className="w-3 h-3 text-primary" />
                <span>Input Format</span>
              </label>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setHintsEnabled(false)}
                  className={cn(
                    "py-1.5 px-1 rounded-lg border text-[11px] font-bold font-display transition-all cursor-pointer text-center flex items-center justify-center gap-1",
                    !hintsEnabled
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                  )}
                >
                  <Keyboard className="w-3 h-3" />
                  <span>Keypad</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHintsEnabled(true)}
                  className={cn(
                    "py-1.5 px-1 rounded-lg border text-[11px] font-bold font-display transition-all cursor-pointer text-center flex items-center justify-center gap-1",
                    hintsEnabled
                      ? "border-primary bg-primary text-white shadow-sm"
                      : "border-border bg-surface text-text-secondary hover:bg-surface-hover"
                  )}
                >
                  <LayoutGrid className="w-3 h-3" />
                  <span>Choices</span>
                </button>
              </div>
            </div>

            {/* Timer Pacing */}
            <div className="neu-raised p-3 rounded-2xl border border-border bg-surface flex flex-col justify-between gap-2 shadow-[var(--shadow-raised-sm)]">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-primary" />
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
                        "py-1.5 rounded-lg border text-[11px] font-mono font-bold transition-all cursor-pointer text-center",
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
        </div>

        {/* RIGHT COLUMN: Live Problem Inspector & Launch Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-6">
          <div className="neu-raised p-6 rounded-3xl border border-border bg-surface flex flex-col justify-between gap-6 shadow-[var(--shadow-raised-sm)]">
            <div>
              <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/80">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Problem Preview</span>
                </span>
                <div className="flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-surface-inset border border-border text-primary shadow-inner">
                    {isUnaryOp
                      ? `${digitCountLeft}d Base`
                      : `${digitCountLeft}d ${getOpSymbol(operation)} ${digitCountRight}d`}
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-primary-muted text-primary border border-primary/20">
                    {difficulty}
                  </span>
                </div>
              </div>

              {/* Big Math Preview */}
              <div className="neu-inset p-5 rounded-2xl border border-primary/30 bg-surface-inset shadow-[var(--shadow-inset)] text-center my-4">
                <div className="font-mono text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                  {liveSample.formula}
                </div>
                <p className="text-xs font-sans text-text-secondary mt-1.5 leading-relaxed">
                  {liveSample.desc}
                </p>
              </div>

              {/* Parameter Recap */}
              <div className="space-y-2 text-xs font-mono text-text-secondary pt-2">
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-text-muted">Target Operation</span>
                  <span className="font-bold text-text-primary capitalize">{operation}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-text-muted">Total Drill Questions</span>
                  <span className="font-bold text-text-primary">{questionCount} Questions</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-text-muted">Answering Mode</span>
                  <span className="font-bold text-text-primary">
                    {hintsEnabled ? "4 Multiple Choices" : "Direct Numeric Keypad"}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border/60">
                  <span className="text-text-muted">Estimated Duration</span>
                  <span className="font-bold text-primary">~{estimatedSeconds}s</span>
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="submit"
                className="w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-xs font-bold font-display text-white shadow-[var(--shadow-raised-sm)] hover:bg-primary-hover active:scale-95 transition-all cursor-pointer"
              >
                <span>Launch Practice Drill</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] font-mono text-text-muted text-center">
                Press <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-[9px] font-bold text-text-primary">Enter ↵</kbd> to launch drill
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
