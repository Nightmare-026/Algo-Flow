"use client";

import { useState } from "react";
import {
  AlertCircle,
  CircleOff,
  FileEdit,
  HardDriveDownload,
  Layers,
  Shuffle,
  Info,
  CheckCircle,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  parseNumberList,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface StackInputControlsProps {
  onGenerate?: (arr: number[]) => void;
  defaultSize?: number;
  slug?: string;
  dataLength?: number;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

export function StackInputControls({
  onGenerate,
  defaultSize = 5,
  slug = "stack-push",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: StackInputControlsProps) {
  const [customInput, setCustomInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isPush = slug === "stack-push";
  const isParentheses = slug === "balanced-parentheses";
  const isInfix = slug === "infix-to-postfix";
  const isPostfix = slug === "postfix-evaluation";
  const isMinStack = slug === "min-stack";
  const isNGE = slug === "next-greater-element";
  const isStringBased = isParentheses || isInfix || isPostfix;

  const capacity = options.capacity || 8;

  const updateOption = (key: keyof VisualizerInputOptions, value: unknown) => {
    onOptionsChange?.({ ...options, [key]: value });
  };

  const setExpression = (text: string) => {
    setError(null);
    updateOption("text", text);
  };

  const generateRandom = () => {
    setError(null);
    const count = Math.min(Math.max(defaultSize, 3), Math.min(capacity, 6));
    const randomArr = Array.from({ length: count }, () => Math.floor(Math.random() * 90) + 10);
    onGenerate?.(randomArr);
  };

  const generateEmpty = () => {
    setError(null);
    onGenerate?.([]);
  };

  const generateFull = () => {
    setError(null);
    const fullArr = Array.from({ length: capacity }, (_, i) => (i + 1) * 10);
    onGenerate?.(fullArr);
  };

  const handleCustomSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isStringBased) {
      if (!customInput.trim()) {
        setError("Please enter a valid expression.");
        return;
      }
      setError(null);
      updateOption("text", customInput.trim());
      return;
    }

    if (!customInput.trim()) {
      generateEmpty();
      return;
    }
    const result = parseNumberList(customInput, capacity);
    if (result.error) {
      setError(result.error);
      return;
    }
    setError(null);
    onGenerate?.(result.values);
  };

  const getOperationHint = () => {
    switch (slug) {
      case "stack-push":
        return "LIFO • Inserts at top • O(1)";
      case "stack-pop":
        return "LIFO • Removes from top • O(1)";
      case "stack-peek":
        return "Reads top element without removal • O(1)";
      case "stack-is-empty":
        return "Checks if top == -1 (size == 0) • O(1)";
      case "stack-is-full":
        return "Checks if size == capacity • O(1)";
      case "stack-size":
        return "Returns top + 1 • O(1)";
      case "array-stack":
        return "Array implementation with top index pointer • O(1)";
      case "balanced-parentheses":
        return "Validates reverse-matching of (), {}, [] brackets • O(n)";
      case "infix-to-postfix":
        return "Shunting-Yard conversion using operator precedence • O(n)";
      case "postfix-evaluation":
        return "Arithmetic evaluation using operand stack • O(n)";
      case "min-stack":
        return "Dual-stack architecture supporting getMin() • O(1)";
      case "next-greater-element":
        return "Monotonic decreasing stack interview pattern • O(n)";
      default:
        return "Stack LIFO Data Structure • O(1)";
    }
  };

  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Presets for String-Based Applications */}
          {isParentheses && (
            <div className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-1.5 shadow-[var(--shadow-raised-sm)]">
              <span className="font-mono text-[9px] font-semibold text-text-muted px-1">Presets:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpression("{[()]}")}
                className="h-7 sm:h-6 min-h-0 px-2 text-[10px] font-semibold text-text-secondary hover:text-success hover:bg-surface-hover active:scale-95"
              >
                <CheckCircle className="h-3 w-3 text-success mr-1" />
                <span>Balanced</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpression("{[(])}")}
                className="h-7 sm:h-6 min-h-0 px-2 text-[10px] font-semibold text-text-secondary hover:text-error hover:bg-surface-hover active:scale-95"
              >
                <AlertCircle className="h-3 w-3 text-error mr-1" />
                <span>Mismatch</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpression("((()")}
                className="h-7 sm:h-6 min-h-0 px-2 text-[10px] font-semibold text-text-secondary hover:text-warning hover:bg-surface-hover active:scale-95"
              >
                <CircleOff className="h-3 w-3 text-warning mr-1" />
                <span>Unclosed</span>
              </Button>
            </div>
          )}

          {isInfix && (
            <div className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-1.5 shadow-[var(--shadow-raised-sm)]">
              <span className="font-mono text-[9px] font-semibold text-text-muted px-1">Presets:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpression("A + B * C")}
                className="h-7 sm:h-6 min-h-0 px-2 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
              >
                <span>A + B * C</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpression("(A + B) * C")}
                className="h-7 sm:h-6 min-h-0 px-2 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
              >
                <span>(A + B) * C</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpression("A + B * (C ^ D - E)")}
                className="h-7 sm:h-6 min-h-0 px-2 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
              >
                <span>Precedence & ^</span>
              </Button>
            </div>
          )}

          {isPostfix && (
            <div className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-1.5 shadow-[var(--shadow-raised-sm)]">
              <span className="font-mono text-[9px] font-semibold text-text-muted px-1">Presets:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpression("5 3 + 2 *")}
                className="h-7 sm:h-6 min-h-0 px-2 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
              >
                <span>5 3 + 2 * (16)</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpression("10 2 8 * + 3 -")}
                className="h-7 sm:h-6 min-h-0 px-2 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
              >
                <span>10 2 8 * + 3 - (23)</span>
              </Button>
            </div>
          )}

          {/* Presets for NGE and MinStack */}
          {isNGE && onGenerate && (
            <div className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-1.5 shadow-[var(--shadow-raised-sm)]">
              <span className="font-mono text-[9px] font-semibold text-text-muted px-1">Presets:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onGenerate([4, 5, 2, 25])}
                className="h-7 sm:h-6 min-h-0 px-2 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
              >
                <span>[4, 5, 2, 25]</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onGenerate([13, 7, 6, 12])}
                className="h-7 sm:h-6 min-h-0 px-2 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
              >
                <span>[13, 7, 6, 12]</span>
              </Button>
            </div>
          )}

          {isMinStack && onGenerate && (
            <div className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-1.5 shadow-[var(--shadow-raised-sm)]">
              <span className="font-mono text-[9px] font-semibold text-text-muted px-1">Presets:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onGenerate([18, 19, 29, 15, 16])}
                className="h-7 sm:h-6 min-h-0 px-2 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
              >
                <span>[18, 19, 29, 15, 16]</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onGenerate([5, 1, 8, 3, 0])}
                className="h-7 sm:h-6 min-h-0 px-2 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
              >
                <span>[5, 1, 8, 3, 0]</span>
              </Button>
            </div>
          )}

          {/* Presets for standard stack operations */}
          {!isStringBased && !isNGE && !isMinStack && onGenerate && (
            <div className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-1.5 shadow-[var(--shadow-raised-sm)]">
              <Button
                variant="ghost"
                size="sm"
                onClick={generateRandom}
                className="h-7 sm:h-6 min-h-0 px-2 sm:px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
                title="Generate random initial stack"
              >
                <Shuffle className="h-3 w-3 text-primary mr-1" />
                <span>Random</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={generateEmpty}
                className="h-7 sm:h-6 min-h-0 px-2 sm:px-1.5 text-[10px] font-semibold text-text-secondary hover:text-warning hover:bg-surface-hover active:scale-95"
                title="Test Underflow / Empty condition"
              >
                <CircleOff className="h-3 w-3 text-warning mr-1" />
                <span>Empty</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={generateFull}
                className="h-7 sm:h-6 min-h-0 px-2 sm:px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95"
                title="Test Overflow / Full condition"
              >
                <Layers className="h-3 w-3 text-primary mr-1" />
                <span>Full</span>
              </Button>
            </div>
          )}

          {/* Custom Input (String for expression algorithms, Numbers for standard stack) */}
          <form
            onSubmit={handleCustomSubmit}
            className="flex h-9 sm:h-8 items-center gap-1 rounded-xl border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]"
          >
            {isStringBased ? (
              <Code2 className="h-3 w-3 text-text-muted shrink-0" aria-hidden="true" />
            ) : (
              <FileEdit className="h-3 w-3 text-text-muted shrink-0" aria-hidden="true" />
            )}
            <input
              type="text"
              placeholder={
                isParentheses
                  ? "e.g. {[()]}"
                  : isInfix
                    ? "e.g. A + B * C"
                    : isPostfix
                      ? "e.g. 5 3 + 2 *"
                      : "e.g. 10, 20, 30"
              }
              value={customInput}
              onChange={(event) => {
                setCustomInput(event.target.value);
                if (error) setError(null);
              }}
              className="h-6 w-28 sm:w-36 rounded-md border border-border bg-bg-surface-inset px-2 font-mono text-[10px] text-text-primary shadow-[var(--shadow-inset)] placeholder:text-text-muted/60 focus-visible:border-primary focus-visible:outline-none"
              aria-label="Custom input value"
            />
            <Button
              type="submit"
              size="sm"
              className="h-6 min-h-0 rounded-md bg-surface-hover px-2 text-[10px] font-semibold text-text-secondary hover:text-primary active:scale-95 shrink-0"
            >
              Set
            </Button>
          </form>

          {/* Capacity Pod (Hidden on expression algorithms where capacity is managed internally) */}
          {!isStringBased && (
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]">
              <Layers className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold text-text-secondary">
                Capacity:
              </span>
              <input
                type="number"
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                value={capacity}
                min={1}
                max={15}
                onChange={(e) => updateOption("capacity", Number(e.target.value))}
                aria-label="Stack capacity"
              />
            </div>
          )}

          {/* Value to Push (ONLY shown on stack-push) */}
          {isPush && (
            <div className="flex h-9 sm:h-8 items-center gap-1.5 rounded-xl border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)] animate-in fade-in">
              <HardDriveDownload className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
              <span className="font-mono text-[10px] font-semibold text-text-secondary">
                Push Value:
              </span>
              <input
                type="number"
                className="h-6 w-14 rounded-md border border-border bg-bg-surface-inset px-1.5 text-center font-mono text-[10px] font-bold text-text-primary shadow-[var(--shadow-inset)] focus-visible:border-primary focus-visible:outline-none"
                value={options.value ?? 50}
                onChange={(e) => updateOption("value", Number(e.target.value))}
                aria-label="Value to push"
              />
            </div>
          )}
        </div>

        {/* LIFO Rule Info Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface border border-border text-[10px] font-medium text-text-muted">
          <Info className="h-3 w-3 text-primary shrink-0" />
          <span>{getOperationHint()}</span>
        </div>
      </div>

      {error && (
        <div className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 bg-error-muted px-2.5 py-1 text-[10px] font-semibold text-error animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

