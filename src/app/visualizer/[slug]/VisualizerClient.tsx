"use client";

import { useEffect, useMemo, useState } from "react";
import type { Algorithm, CodeExample } from "@/types";
import {
  clampOperationOptions,
  defaultVisualizerInputOptions,
  type VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { VisualizerLayout } from "@/features/visualizer-engine/components/VisualizerLayout";
import { usePlaybackStore } from "@/features/visualizer-engine/playback-store";
import { algorithmRegistry } from "@/features/visualizer-engine/registry/algorithm-registry";
import { dsRegistry } from "@/features/visualizer-engine/registry/ds-registry";

function createFallbackCodeExamples(
  slug: string,
  algorithmId: string,
  algorithmName: string,
): CodeExample[] {
  const functionName = slug
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char: string) => char.toUpperCase())
    .replace(/^[^a-zA-Z_]+/, "visualize");

  return [
    {
      id: `${algorithmId}-fallback-js`,
      algorithmId,
      language: "javascript",
      code: `function ${functionName || "visualizeAlgorithm"}(input, options = {}) {\n  const steps = [];\n\n  steps.push({ action: "initialize", input });\n  // Follow the visualizer panels for the exact comparisons, pointer moves,\n  // and state transitions used by ${algorithmName}.\n  steps.push({ action: "complete" });\n\n  return steps;\n}`,
      explanation:
        "Compact JavaScript scaffold generated when a curated code example is not available yet.",
      isPrimary: true,
    },
  ];
}

function ComingSoonCanvas({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-8 text-center">
      <div className="max-w-md rounded-lg border border-dashed border-border bg-bg-surface p-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary-muted text-2xl font-bold text-primary">
          AF
        </div>
        <h2 className="mb-2 text-2xl font-bold text-text-primary">
          {name} Structural Properties
        </h2>
        <p className="text-sm leading-6 text-text-secondary">
          Review the characteristics and complexity parameters for this topic.
        </p>
      </div>
    </div>
  );
}

export function VisualizerClient({ algorithm }: { algorithm: Algorithm }) {
  const slug = algorithm.slug;
  const { loadSteps, reset } = usePlaybackStore();
  const [arrayData, setArrayData] = useState<number[]>([15, 23, 4, 8, 42, 16]);
  const [options, setOptions] = useState<VisualizerInputOptions>(defaultVisualizerInputOptions);

  const definition = algorithmRegistry[slug];
  const dataStructureDefinition = dsRegistry[algorithm.dataStructureId];
  const clampedOptions = useMemo(
    () => clampOperationOptions(options, arrayData.length, slug),
    [arrayData.length, options, slug],
  );
  const steps = useMemo(
    () => definition?.generateSteps(arrayData, clampedOptions) ?? [],
    [arrayData, clampedOptions, definition],
  );

  useEffect(() => {
    loadSteps(steps);
    return () => reset();
  }, [loadSteps, reset, steps]);

  const codeExamples = useMemo(() => {
    const examples = definition?.getCodeExamples(slug, algorithm.id) ?? [];
    return examples.length > 0
      ? examples
      : createFallbackCodeExamples(slug, algorithm.id, algorithm.name);
  }, [algorithm.id, algorithm.name, definition, slug]);

  const isImplemented = Boolean(definition && steps.length > 0);
  const Renderer = dataStructureDefinition?.Renderer;
  const Controls = dataStructureDefinition?.InputControls;
  const defaultSize =
    algorithm.dataStructureId === "ds_hash_table" || algorithm.dataStructureId === "ds_hash_set"
      ? 7
      : arrayData.length;

  const controls =
    Controls && isImplemented ? (
      <Controls
        slug={slug}
        options={options}
        onOptionsChange={setOptions}
        onGenerate={setArrayData}
        dataLength={arrayData.length}
        defaultSize={defaultSize}
        defaultRows={4}
        defaultCols={4}
      />
    ) : null;

  return (
    <VisualizerLayout
      algorithm={algorithm}
      codeExamples={codeExamples}
      codeLineMapping={definition?.codeLineMapping}
      controls={controls}
    >
      {isImplemented && Renderer ? <Renderer /> : <ComingSoonCanvas name={algorithm.name} />}
    </VisualizerLayout>
  );
}
