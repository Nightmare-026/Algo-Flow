"use client";

import { useState } from "react";
import { AlertCircle, FileEdit, Type, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
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
    <div className="flex flex-col gap-2.5 text-sm lg:flex-row lg:items-center lg:gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <form onSubmit={handleCustomSubmit} className="flex flex-wrap items-center gap-1.5">
          <label className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 bg-bg-surface/50">
            <Type className="h-3.5 w-3.5 text-primary" />
            <span className="text-text-muted font-medium text-xs">Text:</span>
            <Input
              type="text"
              className="w-28 h-7 border-border bg-bg-base px-2 py-0 font-mono text-xs"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Text…"
              aria-invalid={Boolean(error)}
              aria-describedby={error ? "string-input-error" : undefined}
            />
          </label>

          {needsPattern(slug) && (
            <label className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 bg-bg-surface/50">
              <Target className="h-3.5 w-3.5 text-primary" />
              <span className="text-text-muted font-medium text-xs">Pattern:</span>
              <Input
                type="text"
                className="w-18 h-7 border-border bg-bg-base px-2 py-0 font-mono text-xs"
                value={patternInput}
                onChange={(e) => setPatternInput(e.target.value)}
                placeholder="Pattern…"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "string-input-error" : undefined}
              />
            </label>
          )}

          <Button type="submit" variant="secondary" size="sm" className="h-7 px-3 text-xs">
            <FileEdit className="h-3.5 w-3.5" />
            Set
          </Button>
        </form>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2.5 text-xs"
            onClick={generateRandom}
          >
            Random
          </Button>
          {!needsPattern(slug) && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={generatePalindrome}
            >
              Palindrome
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div
          id="string-input-error"
          role="alert"
          aria-live="polite"
          className="flex items-center gap-1.5 text-xs font-medium text-error animate-in fade-in slide-in-from-top-1 lg:ml-auto"
        >
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}
