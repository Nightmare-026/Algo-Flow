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
      <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-surface-inset border border-border text-[11px] font-display font-bold shadow-[var(--shadow-inset)] mb-1">
        <button
          type="button"
          onClick={() => hintsEnabled && onToggleHints()}
          className={cn(
            "px-3.5 py-1.5 rounded-xl transition-all select-none cursor-pointer flex items-center gap-1.5",
            !hintsEnabled
              ? "bg-primary text-white shadow-[var(--shadow-raised-sm)]"
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
              ? "bg-primary text-white shadow-[var(--shadow-raised-sm)]"
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
      <span>•</span>
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
      <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-3 my-2">
        {renderModeSwitcher()}
        <div
          className="w-full grid grid-cols-2 gap-3 sm:gap-4"
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
                  "neu-raised group relative flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-150 text-left font-mono font-extrabold text-xl sm:text-2xl shadow-[var(--shadow-raised-sm)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer",
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
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-3.5 my-2">
      {renderModeSwitcher()}

      {/* Input Row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (currentInput.trim() !== "" && !isAnswered) onSubmit();
        }}
        className="flex w-full items-center gap-2.5"
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
            className="neu-inset w-full h-14 rounded-2xl px-5 text-center font-mono tabular-nums text-2xl sm:text-3xl font-extrabold text-text-primary placeholder:text-text-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all shadow-[var(--shadow-inset)]"
            aria-label="Enter calculation answer"
          />
        </div>

        <button
          type="submit"
          disabled={isAnswered || currentInput.trim() === ""}
          className={cn(
            "flex h-14 px-6 items-center justify-center gap-2 rounded-2xl font-display font-bold text-xs uppercase tracking-wider text-white shadow-[var(--shadow-raised-sm)] transition-all active:scale-95",
            currentInput.trim() !== "" && !isAnswered
              ? "bg-primary hover:bg-primary-hover cursor-pointer"
              : "bg-surface-inset border border-border text-text-muted cursor-not-allowed opacity-60"
          )}
          aria-label="Submit answer"
        >
          <span>Submit</span>
          <CornerDownLeft className="w-4 h-4" />
        </button>
      </form>

      {/* On-Screen Keypad for Mobile & Touchscreens */}
      <div className="grid grid-cols-3 gap-2 w-full pt-1">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            onClick={() => handleKeypadDigit(digit)}
            disabled={isAnswered}
            type="button"
            className="neu-raised h-12 rounded-xl flex items-center justify-center font-mono text-xl font-bold text-text-primary hover:bg-surface-hover active:scale-95 transition-all shadow-[var(--shadow-raised-sm)] select-none cursor-pointer"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={handleKeypadClear}
          disabled={isAnswered || currentInput === ""}
          type="button"
          className="neu-raised h-12 rounded-xl flex items-center justify-center text-[11px] font-mono font-bold uppercase tracking-wider text-text-muted hover:text-error hover:bg-surface-hover active:scale-95 transition-all shadow-[var(--shadow-raised-sm)] select-none cursor-pointer"
          aria-label="Clear input"
        >
          Clear
        </button>
        <button
          onClick={() => handleKeypadDigit("0")}
          disabled={isAnswered}
          type="button"
          className="neu-raised h-12 rounded-xl flex items-center justify-center font-mono text-xl font-bold text-text-primary hover:bg-surface-hover active:scale-95 transition-all shadow-[var(--shadow-raised-sm)] select-none cursor-pointer"
        >
          0
        </button>
        <button
          onClick={handleKeypadBackspace}
          disabled={isAnswered || currentInput === ""}
          type="button"
          className="neu-raised h-12 rounded-xl flex items-center justify-center text-text-muted hover:text-primary hover:bg-surface-hover active:scale-95 transition-all shadow-[var(--shadow-raised-sm)] select-none cursor-pointer"
          aria-label="Backspace"
        >
          <Delete className="w-4 h-4" />
        </button>
      </div>

      {renderKeyboardHints()}
    </div>
  );
}
