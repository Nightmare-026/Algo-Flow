"use client";

import { use } from "react";
import { useEffect } from "react";
import { notFound } from "next/navigation";
import { algorithms } from "@/data/seed/algorithms";
import { VisualizerLayout } from "@/features/visualizer-engine/components/VisualizerLayout";
import { usePlaybackStore } from "@/features/visualizer-engine/playback-store";
import { CodeExample } from "@/types";

export default function VisualizerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { loadSteps, reset } = usePlaybackStore();

  const algorithm = algorithms.find(a => a.slug === slug);

  // Mock code examples for now
  const mockCodeExamples: CodeExample[] = [
    {
      id: "ex1",
      algorithmId: algorithm?.id || "",
      language: "javascript",
      isPrimary: true,
      explanation: "",
      code: `function bubbleSort(arr) {
  let n = arr.length;
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i] > arr[i + 1]) {
        // Swap elements
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
    n--;
  } while (swapped);
  return arr;
}`
    },
    {
      id: "ex2",
      algorithmId: algorithm?.id || "",
      language: "python",
      isPrimary: false,
      explanation: "",
      code: `def bubble_sort(arr):
    n = len(arr)
    swapped = True
    while swapped:
        swapped = False
        for i in range(n - 1):
            if arr[i] > arr[i + 1]:
                # Swap elements
                arr[i], arr[i + 1] = arr[i + 1], arr[i]
                swapped = True
        n -= 1
    return arr`
    }
  ];

  useEffect(() => {
    // Load some dummy steps to test the engine
    const dummySteps = Array.from({ length: 10 }).map((_, i) => ({
      id: `step-${i}`,
      stepNumber: i + 1,
      title: `Execution Step ${i + 1}`,
      description: `This is a mocked step description for testing the visualizer engine layout. We are currently at step ${i + 1}.`,
      operation: "Test Operation",
      actionType: "compare" as const,
      dataState: null,
      highlights: {},
      codeLine: (i % 12) + 2 // random line to highlight
    }));

    loadSteps(dummySteps);

    return () => reset();
  }, [loadSteps, reset]);

  if (!algorithm) {
    notFound();
  }

  return (
    <VisualizerLayout algorithm={algorithm} codeExamples={mockCodeExamples}>
      <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center border-4 border-dashed border-border m-8 rounded-2xl">
        <div className="w-20 h-20 bg-primary-muted text-primary flex items-center justify-center rounded-2xl mb-6">
          <span className="text-3xl font-bold">VS</span>
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Canvas Placeholder</h2>
        <p className="text-text-secondary max-w-md">
          The rendering logic for <strong>{algorithm.name}</strong> will be implemented here in Phase 4. The playback controls below and side panels are fully functional.
        </p>
      </div>
    </VisualizerLayout>
  );
}
