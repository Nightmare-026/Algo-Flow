"use client";

import React, { useEffect, useRef } from "react";
import { Delete, CornerDownLeft, Keyboard, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnswerPadProps {
  hintsEnabled: boolean;
  options: number[];
  selectedOptionIndex: number | null;
  currentInput: string;
  isAnswered: boolean;
  correctAnswer?: number;
  onInputChange: (val: string) => void;
  onOptionSelect: (index: number) => void;
  onSubmit: () => void;
  onToggleHints?: () => void;
}

export function AnswerPad({
  hintsEnabled,
  options,
  selectedOptionIndex,
  currentInput,
  isAnswered,
  correctAnswer,
  onInputChange,
  onOptionSelect,
  onSubmit,
  onToggleHints,
}: AnswerPadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Guarantee continuous auto-focus on mount and every question change
  useEffect(() => {
    if (!hintsEnabled && !isAnswered) {
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
      }, 10);
      return () => clearTimeout(focusTimer);
    }
  }, [hintsEnabled, isAnswered]);

  // Global keyboard listener for numbers & shortcuts
  useEffect(() => {
    if (isAnswered) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // If hints mode is active: 1, 2, 3, 4 selects option
      if (hintsEnabled) {
        if (["1", "2", "3", "4"].includes(e.key)) {
          e.preventDefault();
          const idx = parseInt(e.key, 10) - 1;
          if (idx < options.length) {
            onOptionSelect(idx);
          }
        }
      } else {
        // Typing mode: Enter submits
        if (e.key === "Enter") {
          e.preventDefault();
          if (currentInput.trim() !== "") {
            onSubmit();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hintsEnabled, isAnswered, options, currentInput, onOptionSelect, onSubmit]);

  const handleKeypadDigit = (digit: string) => {
    if (isAnswered) return;
    if (currentInput.length >= 10) return;
    onInputChange(currentInput + digit);
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleKeypadBackspace = () => {
    if (isAnswered) return;
    onInputChange(currentInput.slice(0, -1));
    inputRef.current?.focus({ preventScroll: true });
  };

  const handleKeypadClear = () => {
    if (isAnswered) return;
    onInputChange("");
    inputRef.current?.focus({ preventScroll: true });
  };

  const renderModeSwitcher = () => {
    if (!onToggleHints) return null;
    return (
      <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-surface-inset border border-border text-[11px] font-display font-bold shadow-(--shadow-inset) mb-1">
        <button
          type="button"
          onClick={() => hintsEnabled && onToggleHints()}
          className={cn(
            "px-3.5 py-1.5 rounded-xl transition-all select-none cursor-pointer flex items-center gap-1.5",
            !hintsEnabled
              ? "bg-primary text-white shadow-(--shadow-raised-sm)"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>Direct Keypad</span>
        </button>
        <button
          type="button"
          onClick={() => !hintsEnabled && onToggleHints()}
          className={cn(
            "px-3.5 py-1.5 rounded-xl transition-all select-none cursor-pointer flex items-center gap-1.5",
            hintsEnabled
              ? "bg-primary text-white shadow-(--shadow-raised-sm)"
              : "text-text-secondary hover:text-text-primary"
          )}
        >
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>4 Choices</span>
        </button>
      </div>
    );
  };

  const renderKeyboardHints = () => (
    <div className="flex items-center justify-center gap-3 text-[10px] font-mono text-text-muted select-none mt-2">
      <span className="flex items-center gap-1">
        <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[9px] font-bold shadow-xs">
          Enter
        </kbd>
        <span>Submit</span>
      </span>
      <span>â€¢</span>
      {hintsEnabled ? (
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[9px] font-bold shadow-xs">
            1-4
          </kbd>
          <span>Pick Choice</span>
        </span>
      ) : (
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 rounded bg-surface border border-border text-[9px] font-bold shadow-xs">
            0-9
          </kbd>
          <span>Type Digits</span>
        </span>
      )}
    </div>
  );

  if (hintsEnabled) {
    return (
      <div className="w-full h-full min-h-[300px] sm:min-h-[360px] lg:min-h-[380px] flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-xl p-4 sm:p-5 lg:p-6 shadow-(--shadow-raised-sm) neu-raised transition-all">
        {onToggleHints && (
          <div className="flex items-center justify-between w-full border-b border-border/60 pb-2.5 mb-2">
            <span className="text-[11px] font-bold font-display uppercase tracking-wider text-text-muted">
              Input Mode
            </span>
            {renderModeSwitcher()}
          </div>
        )}

        <div
          className="w-full grid grid-cols-2 gap-2.5 sm:gap-3.5 my-auto"
          role="group"
          aria-label="Answer choices"
        >
          {options.map((option, idx) => {
            const isSelected = selectedOptionIndex === idx;
            const isCorrectOption = isAnswered && option === correctAnswer;
            const isWrongSelection = isAnswered && isSelected && option !== correctAnswer;

            return (
              <button
                key={`${idx}-${option}`}
                onClick={() => onOptionSelect(idx)}
                disabled={isAnswered}
                className={cn(
                  "neu-raised group relative flex items-center justify-between p-3.5 sm:p-5 rounded-2xl border transition-all duration-150 text-left font-mono font-extrabold text-xl sm:text-2xl shadow-(--shadow-raised-sm) active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer min-h-[64px] sm:min-h-[80px]",
                  isSelected &&
                    !isAnswered &&
                    "border-primary bg-primary-muted/20 ring-2 ring-primary/20",
                  isCorrectOption &&
                    "border-success bg-success text-white font-black shadow-[0_0_24px_rgba(34,197,94,0.3)] scale-[1.02]",
                  isWrongSelection &&
                    "border-error bg-error text-white shadow-[0_0_24px_rgba(239,68,68,0.3)]",
                  !isAnswered && "hover:border-primary/50 hover:bg-surface-hover text-text-primary"
                )}
                aria-label={`Option ${idx + 1}: ${option}`}
                type="button"
              >
                <span className="truncate tabular-nums">{option.toLocaleString()}</span>
                <span className="flex h-6 w-6 items-center justify-center rounded-lg border border-border bg-surface text-[11px] font-mono font-bold text-text-muted group-hover:text-primary group-hover:border-primary/40 transition-colors shadow-sm">
                  {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
        {renderKeyboardHints()}
      </div>
    );
  }

  // Direct Input & Tactile Keypad Mode
  return (
    <div className="w-full h-full min-h-[300px] sm:min-h-[360px] lg:min-h-[380px] flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-xl p-4 sm:p-5 lg:p-6 shadow-(--shadow-raised-sm) neu-raised transition-all">
      {onToggleHints && (
        <div className="flex items-center justify-between w-full border-b border-border/60 pb-2.5 mb-2">
          <span className="text-[11px] font-bold font-display uppercase tracking-wider text-text-muted">
            Input Mode
          </span>
          {renderModeSwitcher()}
        </div>
      )}

      {/* Input Row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (currentInput.trim() !== "" && !isAnswered) onSubmit();
        }}
        className="flex w-full items-center gap-2 mb-2"
      >
        <div className="relative flex-1">
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="-?[0-9]*"
            value={currentInput}
            onChange={(e) => onInputChange(e.target.value)}
            disabled={isAnswered}
            autoFocus
            placeholder="Type answer..."
            className="neu-inset w-full h-12 sm:h-13 rounded-xl sm:rounded-2xl px-4 text-center font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-text-primary placeholder:text-text-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-(--shadow-inset)"
            aria-label="Enter calculation answer"
          />
        </div>

        <button
          type="submit"
          disabled={isAnswered || currentInput.trim() === ""}
          className={cn(
            "flex h-12 sm:h-13 px-5 sm:px-6 items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl font-display font-bold text-xs uppercase tracking-wider text-white shadow-(--shadow-raised-sm) transition-all active:scale-95",
            currentInput.trim() !== "" && !isAnswered
              ? "bg-primary hover:bg-primary-hover cursor-pointer"
              : "bg-surface-inset border border-border text-text-muted cursor-not-allowed opacity-60"
          )}
          aria-label="Submit answer"
        >
          <span>Submit</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* On-Screen Keypad for Mobile & Touchscreens */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full my-auto">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            onClick={() => handleKeypadDigit(digit)}
            disabled={isAnswered}
            type="button"
            className="neu-raised h-10 sm:h-11 lg:h-12 rounded-xl flex items-center justify-center font-mono text-lg sm:text-xl font-bold text-text-primary hover:bg-surface-hover hover:border-primary/40 active:scale-95 transition-all shadow-(--shadow-raised-sm) select-none cursor-pointer border border-border/70"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={handleKeypadClear}
          disabled={isAnswered || currentInput === ""}
          type="button"
          className="neu-raised h-10 sm:h-11 lg:h-12 rounded-xl flex items-center justify-center text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted hover:text-error hover:border-error/40 hover:bg-surface-hover active:scale-95 transition-all shadow-(--shadow-raised-sm) select-none cursor-pointer border border-border/70 disabled:opacity-40"
          aria-label="Clear input"
        >
          Clear
        </button>
        <button
          onClick={() => handleKeypadDigit("0")}
          disabled={isAnswered}
          type="button"
          className="neu-raised h-10 sm:h-11 lg:h-12 rounded-xl flex items-center justify-center font-mono text-lg sm:text-xl font-bold text-text-primary hover:bg-surface-hover hover:border-primary/40 active:scale-95 transition-all shadow-(--shadow-raised-sm) select-none cursor-pointer border border-border/70"
        >
          0
        </button>
        <button
          onClick={handleKeypadBackspace}
          disabled={isAnswered || currentInput === ""}
          type="button"
          className="neu-raised h-10 sm:h-11 lg:h-12 rounded-xl flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/40 hover:bg-surface-hover active:scale-95 transition-all shadow-(--shadow-raised-sm) select-none cursor-pointer border border-border/70 disabled:opacity-40"
          aria-label="Backspace"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {renderKeyboardHints()}
    </div>
  );
}
