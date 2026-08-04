"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Algorithm } from "@/types";
import type { StepLegendItem } from "@/components/visualizer/StepLegend";
import {
  clampOperationOptions,
  defaultVisualizerInputOptions,
  type VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { VisualizerLayout } from "@/components/visualizer/VisualizerLayout";
import { usePlaybackStore } from "@/stores/playback-store";
import { algorithmRegistry } from "@/visualizers/registry/algorithm-registry";
import { dsRegistry } from "@/visualizers/registry/ds-registry";

function UnavailableCanvas({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-8 text-center">
      <div className="max-w-md rounded-lg border border-dashed border-border bg-bg-surface p-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary-muted text-2xl font-bold text-primary">
          AF
        </div>
        <h2 className="mb-2 text-2xl font-bold text-text-primary">{name} could not be loaded</h2>
        <p className="text-sm leading-6 text-text-secondary">
          Return to the library and choose another visualizer while this route is checked.
        </p>
      </div>
    </div>
  );
}

type VisualizerInputData = number[] | string | Record<string, unknown>;

export function VisualizerClient({
  algorithm,
  legend,
}: {
  algorithm: Algorithm;
  legend: ReadonlyArray<StepLegendItem>;
}) {
  const slug = algorithm.slug;
  const { loadSteps, reset } = usePlaybackStore();
  const [visualizerData, setVisualizerData] = useState<VisualizerInputData>(() =>
    algorithm.dataStructureId === "ds_matrix"
      ? [15, 23, 4, 8, 42, 16, 9, 31, 7, 18, 27, 12, 36, 2, 21, 11]
      : [15, 23, 4, 8, 42, 16]
  );
  const [options, setOptions] = useState<VisualizerInputOptions>(defaultVisualizerInputOptions);

  const definition = algorithmRegistry[slug];
  const dataStructureDefinition = dsRegistry[algorithm.dataStructureId];
  const dataLength = Array.isArray(visualizerData)
    ? visualizerData.length
    : typeof visualizerData === "string"
      ? visualizerData.length
      : 0;

  const clampedOptions = useMemo(
    () => clampOperationOptions(options, dataLength, slug),
    [dataLength, options, slug]
  );
  const steps = useMemo(
    () => definition?.generateSteps(visualizerData as never, clampedOptions) ?? [],
    [visualizerData, clampedOptions, definition]
  );

  const [isReady, setIsReady] = useState(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    loadSteps(steps);
    if (isFirstMount.current) {
      isFirstMount.current = false;
      setIsReady(true);
    }
  }, [loadSteps, steps]);

  useEffect(() => reset, [reset]);

  const codeExamples = useMemo(
    () => definition?.getCodeExamples(slug, algorithm.id) ?? [],
    [algorithm.id, definition, slug]
  );

  const isImplemented = Boolean(definition && steps.length > 0);
  const Renderer = dataStructureDefinition?.Renderer;
  const Controls = dataStructureDefinition?.InputControls;

  const canvasContent = !isReady ? (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
        <span className="text-sm text-muted-foreground">Loading visualizer…</span>
      </div>
    </div>
  ) : isImplemented && Renderer ? (
    <Renderer />
  ) : (
    <UnavailableCanvas name={algorithm.name} />
  );
  const defaultSize =
    algorithm.dataStructureId === "ds_hash_table" || algorithm.dataStructureId === "ds_hash_set"
      ? 7
      : (dataLength || 6);

  const controls =
    Controls && isImplemented ? (
      <Controls
        slug={slug}
        options={options}
        onOptionsChange={setOptions}
        onGenerate={setVisualizerData}
        dataLength={dataLength}
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
      legend={legend}
      controls={controls}
    >
      {canvasContent}
    </VisualizerLayout>
  );
}
