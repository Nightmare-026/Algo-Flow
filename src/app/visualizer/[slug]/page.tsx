"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { algorithms } from "@/data/seed/algorithms";
import { CodeExample } from "@/types";
import { defaultVisualizerInputOptions, VisualizerInputOptions } from "@/lib/validation/visualizer-input";
import { VisualizerLayout } from "@/features/visualizer-engine/components/VisualizerLayout";
import { usePlaybackStore } from "@/features/visualizer-engine/playback-store";
import { algorithmRegistry } from "@/features/visualizer-engine/registry/algorithm-registry";
import { dsRegistry } from "@/features/visualizer-engine/registry/ds-registry";

function createFallbackCodeExamples(slug: string, algorithmId: string, algorithmName: string): CodeExample[] {
  const functionName = slug.replace(/[^a-zA-Z0-9]+(.)/g, (_, char: string) => char.toUpperCase()).replace(/^[^a-zA-Z_]+/, "visualize");

  return [
    {
      id: `${algorithmId}-fallback-js`,
      algorithmId,
      language: "javascript",
      code: `function ${functionName || "visualizeAlgorithm"}(input, options = {}) {\n  const steps = [];\n\n  steps.push({ action: "initialize", input });\n  // Follow the visualizer panels for the exact comparisons, pointer moves,\n  // and state transitions used by ${algorithmName}.\n  steps.push({ action: "complete" });\n\n  return steps;\n}`,
      explanation: "Compact JavaScript scaffold generated when a curated code example is not available yet.",
      isPrimary: true,
    },
  ];
}

function ComingSoonCanvas({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center p-8 text-center">
      <div className="max-w-md rounded-lg border border-dashed border-border bg-bg-surface p-8">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-lg bg-primary-muted text-2xl font-bold text-primary">AF</div>
        <h2 className="mb-2 text-2xl font-bold text-text-primary">{name} Structural Properties</h2>
        <p className="text-sm leading-6 text-text-secondary">
          Review the characteristics and complexity parameters for this topic.
        </p>
      </div>
    </div>
  );
}

export default function VisualizerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { loadSteps, reset } = usePlaybackStore();
  const [arrayData, setArrayData] = useState<number[]>([15, 23, 4, 8, 42, 16]);
  const [options, setOptions] = useState<VisualizerInputOptions>(defaultVisualizerInputOptions);
  
  const algorithm = algorithms.find((item) => item.slug === slug);
  
  useEffect(() => {
    if (!algorithm) return;
    const def = algorithmRegistry[slug];
    const steps = def ? def.generateSteps(arrayData, options) : [];
    loadSteps(steps);
    return () => reset();
  }, [algorithm, arrayData, loadSteps, options, reset, slug]);

  if (!algorithm) notFound();

  const def = algorithmRegistry[slug];
  const dsDef = dsRegistry[algorithm.dataStructureId];
  
  const isImplemented = !!def && def.generateSteps(arrayData, options).length > 0;
  
  let codeExamples: CodeExample[] = [];
  if (def && def.getCodeExamples) {
    codeExamples = def.getCodeExamples(algorithm.id, algorithm.name);
  }
  if (codeExamples.length === 0) {
    codeExamples = createFallbackCodeExamples(slug, algorithm.id, algorithm.name);
  }

  const renderCanvas = () => {
    if (!isImplemented || !dsDef?.Renderer) return <ComingSoonCanvas name={algorithm.name} />;
    const RendererComponent = dsDef.Renderer;
    return <RendererComponent />;
  };

  const showControls = !!dsDef && isImplemented;
  
  const renderControls = () => {
    if (!showControls || !dsDef.InputControls) return null;
    const ControlsComponent = dsDef.InputControls;
    
    // Some controls need specific default defaults based on data structure
    const defaultSize = (algorithm.dataStructureId === 'ds_hash_table' || algorithm.dataStructureId === 'ds_hash_set') ? 7 : arrayData.length;
    
    return (
      <ControlsComponent 
        slug={slug}
        options={options}
        onOptionsChange={setOptions}
        onGenerate={setArrayData}
        dataLength={arrayData.length}
        defaultSize={defaultSize}
        defaultRows={4}
        defaultCols={4}
      />
    );
  };

  return (
    <VisualizerLayout
      algorithm={algorithm}
      codeExamples={codeExamples}
      controls={renderControls()}
    >
      {renderCanvas()}
    </VisualizerLayout>
  );
}
