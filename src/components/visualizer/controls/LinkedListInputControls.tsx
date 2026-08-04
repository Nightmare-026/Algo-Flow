"use client";

import { useState } from "react";
import { AlertCircle, Target, HardDriveDownload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  defaultVisualizerInputOptions,
  validateIndex,
  VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";

interface LinkedListInputControlsProps {
  slug?: string;
  options?: VisualizerInputOptions;
  onOptionsChange?: (options: VisualizerInputOptions) => void;
  dataLength?: number;
}

export function LinkedListInputControls({
  slug = "sll-traversal",
  options = defaultVisualizerInputOptions,
  onOptionsChange,
  dataLength = 0,
}: LinkedListInputControlsProps) {
  const [valInput, setValInput] = useState(options.value.toString());
  const [targetInput, setTargetInput] = useState(options.target.toString());
  const [positionInput, setPositionInput] = useState(options.index.toString());
  const [error, setError] = useState<string | null>(null);

  const updateOption = (key: keyof VisualizerInputOptions, value: number) => {
    onOptionsChange?.({ ...options, [key]: value } as VisualizerInputOptions);
  };

  const handleValueSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const val = Number(valInput.trim());
    if (!Number.isInteger(val)) {
      setError("Value must be a whole number.");
      return;
    }
    if (slug === "sll-insert-position") {
      const position = Number(positionInput.trim());
      const positionError = validateIndex(position, dataLength, true);
      if (positionError) {
        setError(positionError.replace("Index", "Position"));
        return;
      }
      setError(null);
      onOptionsChange?.({ ...options, value: val, index: position });
      return;
    }
    setError(null);
    updateOption("value", val);
  };

  const handleTargetSubmit = (event?: React.FormEvent) => {
    if (event) event.preventDefault();
    const target = parseInt(targetInput);
    if (isNaN(target)) {
      setError("Target must be a valid number.");
      return;
    }
    setError(null);
    updateOption("target", target);
  };

  const showTarget = slug.includes("search") || slug.includes("delete");
  const showValue = slug.includes("insert");
  const showPosition = slug === "sll-insert-position";
  const errorId = "linked-list-control-error";

  return (
    <div className="flex flex-col gap-3 text-sm lg:flex-row lg:items-start">
      <div className="flex flex-wrap items-center gap-3">
        {showTarget && (
          <form onSubmit={handleTargetSubmit} className="flex flex-wrap items-end gap-2">
            <div className="grid gap-1">
              <Label htmlFor="linked-list-target" className="text-text-muted">
                Target
              </Label>
              <Input
                id="linked-list-target"
                name="target"
                type="number"
                inputMode="numeric"
                className="h-11 w-24 border-border bg-bg-base px-3"
                value={targetInput}
                onChange={(event) => setTargetInput(event.target.value)}
              />
            </div>
            <Button type="submit" className="h-11" variant="secondary" size="sm">
              <Target className="mr-1 h-4 w-4" />
              Set Target
            </Button>
          </form>
        )}

        {showValue && (
          <form onSubmit={handleValueSubmit} className="flex flex-wrap items-end gap-2">
            {showPosition && (
              <div className="grid gap-1">
                <Label htmlFor="linked-list-position" className="text-text-muted">
                  Position
                </Label>
                <Input
                  id="linked-list-position"
                  name="position"
                  type="number"
                  min={0}
                  max={dataLength}
                  step={1}
                  inputMode="numeric"
                  className="h-11 w-24 border-border bg-bg-base px-3"
                  value={positionInput}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? errorId : undefined}
                  onChange={(event) => setPositionInput(event.target.value)}
                />
              </div>
            )}
            <div className="grid gap-1">
              <Label htmlFor="linked-list-value" className="text-text-muted">
                Value
              </Label>
              <Input
                id="linked-list-value"
                name="value"
                type="number"
                step={1}
                inputMode="numeric"
                className="h-11 w-24 border-border bg-bg-base px-3"
                value={valInput}
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                onChange={(event) => setValInput(event.target.value)}
              />
            </div>

            <Button type="submit" className="h-11" variant="secondary" size="sm">
              <HardDriveDownload className="mr-1 h-4 w-4" />
              {showPosition ? "Build Trace" : "Set Value"}
            </Button>
          </form>
        )}
      </div>

      {error && (
        <div
          id={errorId}
          role="alert"
          className="ml-auto flex animate-in items-center gap-2 text-sm font-medium text-error fade-in slide-in-from-top-1"
        >
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}
    </div>
  );
}
