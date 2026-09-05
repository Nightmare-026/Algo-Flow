"use client";

import { useState } from "react";
import { AlertCircle, Type, Target, Shuffle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  defaultVisualizerInputOptions,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface StringInputControlsProps {
  slug?: string;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
}

const needsPattern = (slug: string) =>
  slug.includes("search") || slug.includes("kmp") || slug.includes("rabin");

export function StringInputControls({
  slug = "string",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
}: StringInputControlsProps) {
  const [textInput, setTextInput] = useState(options.text || "ALGO FLOW");
  const [patternInput, setPatternInput] = useState(options.pattern || "FLOW");
  const [error, setError] = useState<string | null>(null);

  const updateOption = (key: keyof VisualizerInputOptions, value: string) => {
    onOptionsChange?.({ ...options, [key]: value } as VisualizerInputOptions);
  };

  const handleCustomSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (textInput.length === 0) {
      setError("Text cannot be empty.");
      return;
    }
    if (textInput.length > 25) {
      setError("Please keep text under 25 characters for clear visualization.");
      return;
    }
    if (needsPattern(slug) && patternInput.length === 0) {
      setError("Pattern cannot be empty.");
      return;
    }
    if (needsPattern(slug) && patternInput.length > textInput.length) {
      setError("Pattern cannot be longer than the text.");
      return;
    }

    setError(null);
    onOptionsChange?.({
      ...options,
      text: textInput.toUpperCase(),
      ...(needsPattern(slug) ? { pattern: patternInput.toUpperCase() } : {}),
    });
  };

  const generateRandom = () => {
    setError(null);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let rand = "";
    for (let i = 0; i < 10; i++) rand += chars.charAt(Math.floor(Math.random() * chars.length));
    setTextInput(rand);
    updateOption("text", rand);
  };

  const generatePalindrome = () => {
    setError(null);
    const p = "RACECAR";
    setTextInput(p);
    updateOption("text", p);
  };

  return (
    <div className="flex flex-col gap-2 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Presets Pod */}
          <div className="flex h-8 items-center gap-1 rounded-lg border border-border bg-surface px-1.5 shadow-[var(--shadow-raised-sm)]">
            <Button
              type="button"
              size="sm"
              className="h-6 min-h-0 rounded-md px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95 cursor-pointer"
              onClick={generateRandom}
              title="Generate random text"
            >
              <Shuffle className="h-3 w-3 text-primary mr-1" aria-hidden="true" />
              Random
            </Button>
            {!needsPattern(slug) && (
              <>
                <span className="h-3.5 w-px bg-border mx-0.5" />
                <Button
                  type="button"
                  size="sm"
                  className="h-6 min-h-0 rounded-md px-1.5 text-[10px] font-semibold text-text-secondary hover:text-primary hover:bg-surface-hover active:scale-95 cursor-pointer"
                  onClick={generatePalindrome}
                  title="Generate palindrome"
                >
                  <Sparkles className="h-3 w-3 text-primary mr-1" aria-hidden="true" />
                  Palindrome
                </Button>
              </>
            )}
          </div>

          {/* Custom String Input Form Pod */}
          <form
            onSubmit={handleCustomSubmit}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-2 shadow-[var(--shadow-raised-sm)]"
          >
            <Type className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
            <span className="font-mono text-[10px] font-semibold text-text-secondary">Text:</span>
            <input
              type="text"
              className="h-6 w-24 sm:w-28 border-none bg-transparent px-1.5 py-0 font-mono text-[10px] text-text-primary shadow-none focus-visible:outline-none placeholder:text-text-muted uppercase"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="TEXT…"
              aria-label="Custom text"
            />

            {needsPattern(slug) && (
              <>
                <span className="h-3.5 w-px bg-border mx-0.5" />
                <Target className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
                <span className="font-mono text-[10px] font-semibold text-text-secondary">
                  Pat:
                </span>
                <input
                  type="text"
                  className="h-6 w-16 sm:w-20 border-none bg-transparent px-1.5 py-0 font-mono text-[10px] text-text-primary shadow-none focus-visible:outline-none placeholder:text-text-muted uppercase"
                  value={patternInput}
                  onChange={(e) => setPatternInput(e.target.value)}
                  placeholder="PAT…"
                  aria-label="Pattern to match"
                />
              </>
            )}

            <Button
              type="submit"
              size="sm"
              className="h-6 min-h-0 rounded-md bg-primary px-2.5 text-[10px] font-bold text-white shadow-sm hover:bg-primary-hover active:scale-95 shrink-0 cursor-pointer"
            >
              Set
            </Button>
          </form>
        </div>
      </div>

      {error && (
        <div
          id="string-input-error"
          role="alert"
          aria-live="polite"
          className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 bg-error-muted px-2.5 py-1 text-[10px] font-semibold text-error animate-in fade-in slide-in-from-top-1"
        >
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
