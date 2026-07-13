"use client";

import { usePlaybackStore } from "../playback-store";
import { getAlgorithmPseudocode } from "@/features/algorithms/array/pseudocode";
import { getStackPseudocode } from "@/features/algorithms/stack/pseudocode";
import { getQueuePseudocode } from "@/features/algorithms/queue/pseudocode";
import { getLinkedListPseudocode } from "@/features/algorithms/linked-list/pseudocode";
import { getTreePseudocode } from "@/features/algorithms/tree/pseudocode";
import { getGraphPseudocode } from "@/features/algorithms/graph/pseudocode";
import { getHashTablePseudocode } from "@/features/algorithms/hash-table/pseudocode";
import { getHashSetPseudocode } from "@/features/algorithms/hash-set/pseudocode";
import { getMatrixPseudocode } from "@/features/algorithms/matrix/pseudocode";
import { getStringPseudocode } from "@/features/algorithms/string/pseudocode";
import { algorithmRegistry } from "@/features/visualizer-engine/registry";
import { cn } from "@/lib/utils";

interface PseudocodePanelProps {
  slug: string;
}

export function PseudocodePanel({ slug }: PseudocodePanelProps) {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];
  const matchedLines = [
    getAlgorithmPseudocode,
    getStackPseudocode,
    getQueuePseudocode,
    getLinkedListPseudocode,
    getTreePseudocode,
    getGraphPseudocode,
    getHashTablePseudocode,
    getHashSetPseudocode,
    getMatrixPseudocode,
    getStringPseudocode,
  ]
    .map((getLines) => getLines(slug))
    .find((candidate) => candidate.length > 0) ?? [];
    
  const algo = algorithmRegistry[slug];
  const globalLines = algo?.pseudocode ? algo.pseudocode.split('\n') : [];

  const fallbackLines = steps.length > 0
    ? ["visualize():", ...steps.map((step) => `    ${step.stepNumber}. ${step.title}`)]
    : [];

  const isFallback = matchedLines.length === 0 && globalLines.length === 0 && fallbackLines.length > 0;
  const lines = matchedLines.length > 0 ? matchedLines : (globalLines.length > 0 ? globalLines : fallbackLines);
  
  let activeLineNum: number | undefined;
  if (isFallback) {
    activeLineNum = currentStepIndex + 2;
  } else if (matchedLines.length > 0) {
    activeLineNum = currentStep?.pseudocodeLine;
  } else {
    activeLineNum = currentStep?.pseudocodeLine ?? currentStep?.codeLine;
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-bg-surface-light">
      <div className="flex h-[46px] shrink-0 items-center border-b border-border bg-bg-surface px-4">
        <h3 className="text-sm font-medium text-text-primary">Pseudocode</h3>
      </div>
      <div className="flex-1 overflow-auto bg-[#121212] p-4 font-mono text-sm text-text-secondary">
        {lines.length > 0 ? (
          <div className="flex flex-col">
            {lines.map((line, index) => {
              const lineNum = index + 1;
              const isActive = activeLineNum === lineNum;
              return (
                <div
                  key={`${line}-${index}`}
                  className={cn(
                    "-mx-2 whitespace-pre rounded border-l-2 px-2 py-0.5 transition-colors",
                    isActive ? "border-primary bg-primary/20 text-primary-light" : "border-transparent"
                  )}
                >
                  {line || " "}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-text-muted">
            Select a step to view algorithm execution details.
          </div>
        )}
      </div>
    </div>
  );
}
