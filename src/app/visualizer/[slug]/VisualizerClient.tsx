"use client";

import { useEffect, useMemo, useState } from "react";
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

export function VisualizerClient({
  algorithm,
  legend,
}: {
  algorithm: Algorithm;
  legend: ReadonlyArray<StepLegendItem>;
}) {
  const slug = algorithm.slug;
  const { loadSteps, reset } = usePlaybackStore();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [visualizerData, setVisualizerData] = useState<any>([15, 23, 4, 8, 42, 16]);
  const [options, setOptions] = useState<VisualizerInputOptions>(defaultVisualizerInputOptions);

  const definition = algorithmRegistry[slug];
  const dataStructureDefinition = dsRegistry[algorithm.dataStructureId];
  const clampedOptions = useMemo(
    () => clampOperationOptions(options, visualizerData?.length ?? 0, slug),
    [visualizerData?.length, options, slug]
  );
  const steps = useMemo(
    () => definition?.generateSteps(visualizerData, clampedOptions) ?? [],
    [visualizerData, clampedOptions, definition]
  );

  useEffect(() => {
    loadSteps(steps);
    return () => reset();
  }, [loadSteps, reset, steps]);

  const codeExamples = useMemo(
    () => definition?.getCodeExamples(slug, algorithm.id) ?? [],
    [algorithm.id, definition, slug]
  );

  const isImplemented = Boolean(definition && steps.length > 0);
  const Renderer = dataStructureDefinition?.Renderer;
  const Controls = dataStructureDefinition?.InputControls;
  const defaultSize =
    algorithm.dataStructureId === "ds_hash_table" || algorithm.dataStructureId === "ds_hash_set"
      ? 7
      : (visualizerData?.length ?? 6);

  const controls =
    Controls && isImplemented ? (
      <Controls
        slug={slug}
        options={options}
        onOptionsChange={setOptions}
        onGenerate={setVisualizerData}
        dataLength={visualizerData?.length ?? 0}
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
      {isImplemented && Renderer ? <Renderer /> : <UnavailableCanvas name={algorithm.name} />}
    </VisualizerLayout>
  );
}
