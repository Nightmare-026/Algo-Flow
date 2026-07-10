"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { algorithms } from "@/data/seed/algorithms";
import { CodeExample, VisualStep } from "@/types";
import { defaultVisualizerInputOptions, VisualizerInputOptions } from "@/lib/validation/visualizer-input";
import { VisualizerLayout } from "@/features/visualizer-engine/components/VisualizerLayout";
import { ArrayInputControls } from "@/features/visualizer-engine/components/controls/ArrayInputControls";
import { ArrayRenderer } from "@/features/visualizer-engine/components/renderers/ArrayRenderer";
import { StackRenderer } from "@/features/visualizer-engine/components/renderers/StackRenderer";
import { QueueRenderer } from "@/features/visualizer-engine/components/renderers/QueueRenderer";
import { LinkedListRenderer } from "@/features/visualizer-engine/components/renderers/LinkedListRenderer";
import { usePlaybackStore } from "@/features/visualizer-engine/playback-store";
import { generateAccessByIndexSteps } from "@/features/algorithms/array/access";
import { generateForwardTraversalSteps, generateRangeTraversalSteps, generateReverseTraversalSteps } from "@/features/algorithms/array/traversal";
import { generateBinarySearchSteps, generateLinearSearchSteps, generateJumpSearchSteps, generateInterpolationSearchSteps } from "@/features/algorithms/array/search";
import { generateBubbleSortSteps, generateInsertionSortSteps, generateMergeSortSteps, generateQuickSortSteps, generateSelectionSortSteps, generateHeapSortSteps, generateCountingSortSteps, generateRadixSortSteps } from "@/features/algorithms/array/sort";
import { generateInsertBeginningSteps, generateInsertEndSteps, generateInsertIndexSteps } from "@/features/algorithms/array/insertion";
import { generateDeleteBeginningSteps, generateDeleteEndSteps, generateDeleteIndexSteps, generateDeleteValueSteps } from "@/features/algorithms/array/deletion";
import { generateUpdateByIndexSteps, generateUpdateByValueSteps, generateMergeSortedArraysSteps, generateReverseArraySteps, generateLeftRotationSteps, generateRightRotationSteps } from "@/features/algorithms/array/operations";
import { getArrayCodeExamples } from "@/features/algorithms/array/code-examples";
import { generateStackPushSteps } from "@/features/algorithms/stack/push";
import { generateStackPopSteps } from "@/features/algorithms/stack/pop";
import { generateStackIsEmptySteps, generateStackIsFullSteps, generateStackPeekSteps, generateStackSizeSteps } from "@/features/algorithms/stack/status";
import { getStackCodeExamples } from "@/features/algorithms/stack/code-examples";
import { generateQueueEnqueueSteps } from "@/features/algorithms/queue/enqueue";
import { generateQueueDequeueSteps } from "@/features/algorithms/queue/dequeue";
import { generateQueueFrontRearSteps, generateQueuePeekSteps } from "@/features/algorithms/queue/peek";
import { getQueueCodeExamples } from "@/features/algorithms/queue/code-examples";
import { QueueInputControls } from "@/features/visualizer-engine/components/controls/QueueInputControls";
import { LinkedListInputControls } from "@/features/visualizer-engine/components/controls/LinkedListInputControls";
import { TreeInputControls } from "@/features/visualizer-engine/components/controls/TreeInputControls";
import { GraphInputControls } from "@/features/visualizer-engine/components/controls/GraphInputControls";
import { generateSLLTraversalSteps } from "@/features/algorithms/linked-list/traversal";
import { generateSLLSearchSteps } from "@/features/algorithms/linked-list/search";
import { generateSLLInsertHeadSteps, generateSLLInsertTailSteps } from "@/features/algorithms/linked-list/insertion";
import { generateSLLDeleteSteps } from "@/features/algorithms/linked-list/deletion";
import { getLinkedListCodeExamples } from "@/features/algorithms/linked-list/code-examples";
import { TreeRenderer } from "@/features/visualizer-engine/components/renderers/TreeRenderer";
import { generateTreeInorderSteps, generateTreePreorderSteps, generateTreePostorderSteps, generateTreeLevelOrderSteps } from "@/features/algorithms/tree/traversal";
import { generateBSTSearchSteps, generateBSTInsertSteps } from "@/features/algorithms/tree/bst-operations";
import { getTreeCodeExamples } from "@/features/algorithms/tree/code-examples";
import { GraphRenderer } from "@/features/visualizer-engine/components/renderers/GraphRenderer";
import { generateGraphBFSSteps } from "@/features/algorithms/graph/bfs";
import { generateGraphDFSSteps } from "@/features/algorithms/graph/dfs";
import { getGraphCodeExamples } from "@/features/algorithms/graph/code-examples";
import { HashTableRenderer } from "@/features/visualizer-engine/components/renderers/HashTableRenderer";
import { HashTableInputControls } from "@/features/visualizer-engine/components/controls/HashTableInputControls";
import { generateLinearProbingInsertSteps, generateLinearProbingSearchSteps, generateLinearProbingDeleteSteps } from "@/features/algorithms/hash-table/linear-probing";
import { generateChainingInsertSteps, generateChainingSearchSteps, generateChainingDeleteSteps } from "@/features/algorithms/hash-table/chaining";
import { getHashTableCodeExamples } from "@/features/algorithms/hash-table/code-examples";
import { MatrixRenderer } from "@/features/visualizer-engine/components/renderers/MatrixRenderer";
import { MatrixInputControls } from "@/features/visualizer-engine/components/controls/MatrixInputControls";
import { generateRowWiseTraversalSteps, generateColWiseTraversalSteps, generateSpiralTraversalSteps } from "@/features/algorithms/matrix/traversal";
import { generateMatrixSearchSteps, generateSortedMatrixSearchSteps } from "@/features/algorithms/matrix/search";
import { generateTransposeMatrixSteps, generateRotateMatrixSteps, generateMatrixMultiplicationSteps } from "@/features/algorithms/matrix/math";
import { getMatrixCodeExamples } from "@/features/algorithms/matrix/code-examples";
import { StringRenderer } from "@/features/visualizer-engine/components/renderers/StringRenderer";
import { StringInputControls } from "@/features/visualizer-engine/components/controls/StringInputControls";
import { generateStringForwardTraversalSteps, generateStringReverseTraversalSteps } from "@/features/algorithms/string/traversal";
import { generateNaiveSearchSteps, generateKMPSearchSteps, generateRabinKarpSteps } from "@/features/algorithms/string/search";
import { generatePalindromeCheckSteps } from "@/features/algorithms/string/palindrome";
import { generateReverseStringSteps } from "@/features/algorithms/string/transform";
import { getStringCodeExamples } from "@/features/algorithms/string/code-examples";
import { getHashSetCodeExamples } from "@/features/algorithms/hash-set/code-examples";
import { StackInputControls } from "@/features/visualizer-engine/components/controls/StackInputControls";
import { generateHashSetInsertSteps } from "@/features/algorithms/hash-set/insert";
import { generateHashSetSearchSteps } from "@/features/algorithms/hash-set/search";
import { generateHashSetDeleteSteps } from "@/features/algorithms/hash-set/delete";
import { HashSetRenderer } from "@/features/visualizer-engine/components/renderers/HashSetRenderer";
import { HashSetInputControls } from "@/features/visualizer-engine/components/controls/HashSetInputControls";

import { generateAccessElementSteps } from "@/features/algorithms/array/access";
import { generateLinkedListTypesSteps, generateSLLInsertPositionSteps, generateSLLDeleteHeadSteps, generateSLLReverseSteps, generateSLLDetectCycleSteps } from "@/features/algorithms/linked-list/additional";
import { generateArrayStackSteps } from "@/features/algorithms/stack/status";
import { generateSimpleQueueSteps, generateCircularQueueSteps } from "@/features/algorithms/queue/additional";
import { generateHeapInsertSteps, generateTrieInsertWordSteps, generateSegmentTreeBuildSteps } from "@/features/algorithms/tree/additional";
import { generateDivisionHashSteps, generateRehashingSteps } from "@/features/algorithms/hash-table/additional";
import { generateHashSetUnionSteps, generateHashSetIntersectionSteps } from "@/features/algorithms/hash-set/additional";


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

function getCodeExamples(dataStructureId: string, slug: string, algorithmId: string, algorithmName: string): CodeExample[] {
  let examples: CodeExample[] = [];

  if (dataStructureId === "ds_array") examples = getArrayCodeExamples(slug, algorithmId);
  else if (dataStructureId === "ds_stack") examples = getStackCodeExamples(slug, algorithmId);
  else if (dataStructureId === "ds_queue") examples = getQueueCodeExamples(slug, algorithmId);
  else if (dataStructureId === "ds_linked_list") examples = getLinkedListCodeExamples(slug, algorithmId);
  else if (dataStructureId === "ds_tree") examples = getTreeCodeExamples(slug, algorithmId);
  else if (dataStructureId === "ds_graph") examples = getGraphCodeExamples(slug, algorithmId);
  else if (dataStructureId === "ds_hash_table") {
    const baseSlug = slug.includes("chaining") ? "separate-chaining" : "linear-probing";
    examples = getHashTableCodeExamples(baseSlug, algorithmId);
  } else if (dataStructureId === "ds_matrix") examples = getMatrixCodeExamples(slug, algorithmId);
  else if (dataStructureId === "ds_string") examples = getStringCodeExamples(slug, algorithmId);
  else if (dataStructureId === "ds_hash_set") examples = getHashSetCodeExamples(slug, algorithmId);

  return examples.length > 0 ? examples : createFallbackCodeExamples(slug, algorithmId, algorithmName);
}

function getGraphStartNode(value: string): string {
  return ["A", "B", "C", "D", "E", "F"].includes(value) ? value : "A";
}

function buildSteps(slug: string, arrayData: number[], options: VisualizerInputOptions): VisualStep[] {
  const rows = options.rows || 3;
  const cols = options.cols || 3;
  const graphStart = getGraphStartNode(options.text);

  switch (slug) {
    case "access":
      return generateAccessElementSteps(arrayData, options.index);
    case "access-by-index":
    case "random-access":
      return generateAccessByIndexSteps(arrayData, options.index);
    case "forward-traversal":
      return generateForwardTraversalSteps(arrayData);
    case "reverse-traversal":
      return generateReverseTraversalSteps(arrayData);
    case "range-traversal":
      return generateRangeTraversalSteps(arrayData, Math.min(options.index, arrayData.length - 1), arrayData.length - 1);
    case "linear-search":
      return generateLinearSearchSteps(arrayData, options.target);
    case "binary-search":
      return generateBinarySearchSteps(arrayData, options.target);
    case "jump-search":
      return generateJumpSearchSteps(arrayData, options.target);
    case "interpolation-search":
      return generateInterpolationSearchSteps(arrayData, options.target);
    case "bubble-sort":
      return generateBubbleSortSteps(arrayData);
    case "selection-sort":
      return generateSelectionSortSteps(arrayData);
    case "insertion-sort":
      return generateInsertionSortSteps(arrayData);
    case "merge-sort":
      return generateMergeSortSteps(arrayData);
    case "quick-sort":
      return generateQuickSortSteps(arrayData);
    case "heap-sort":
      return generateHeapSortSteps(arrayData);
    case "counting-sort":
      return generateCountingSortSteps(arrayData);
    case "radix-sort":
      return generateRadixSortSteps(arrayData);
    case "insert-beginning":
      return generateInsertBeginningSteps(arrayData, options.value);
    case "insert-end":
      return generateInsertEndSteps(arrayData, options.value);
    case "insert-index":
      return generateInsertIndexSteps(arrayData, options.value, options.index);
    case "delete-beginning":
      return generateDeleteBeginningSteps(arrayData);
    case "delete-end":
      return generateDeleteEndSteps(arrayData);
    case "delete-index":
      return generateDeleteIndexSteps(arrayData, options.index);
    case "delete-value":
      return generateDeleteValueSteps(arrayData, options.value);
    case "update-by-index":
      return generateUpdateByIndexSteps(arrayData, options.value, options.index);
    case "update-by-value":
      return generateUpdateByValueSteps(arrayData, options.target, options.value);
    case "merge-sorted-arrays":
      return generateMergeSortedArraysSteps(arrayData);
    case "reverse-array":
      return generateReverseArraySteps(arrayData);
    case "left-rotation":
      return generateLeftRotationSteps(arrayData);
    case "right-rotation":
      return generateRightRotationSteps(arrayData);
    case "array-stack":
      return generateArrayStackSteps(arrayData, options.capacity);
    case "stack-push":
      return generateStackPushSteps(arrayData, options.value, options.capacity);
    case "stack-pop":
      return generateStackPopSteps(arrayData, options.capacity);
    case "stack-peek":
      return generateStackPeekSteps(arrayData, options.capacity);
    case "stack-is-empty":
      return generateStackIsEmptySteps(arrayData, options.capacity);
    case "stack-is-full":
      return generateStackIsFullSteps(arrayData, options.capacity);
    case "stack-size":
      return generateStackSizeSteps(arrayData, options.capacity);
    case "simple-queue":
      return generateSimpleQueueSteps(arrayData, options.capacity);
    case "circular-queue":
      return generateCircularQueueSteps(arrayData, options.value, options.capacity);
    case "queue-enqueue":
      return generateQueueEnqueueSteps(arrayData, options.value, options.capacity);
    case "queue-dequeue":
      return generateQueueDequeueSteps(arrayData, options.capacity);
    case "queue-peek":
      return generateQueuePeekSteps(arrayData, options.capacity);
    case "queue-front-rear":
      return generateQueueFrontRearSteps(arrayData, options.capacity);
    case "linked-list-types":
      return generateLinkedListTypesSteps(arrayData);
    case "sll-traversal":
      return generateSLLTraversalSteps(arrayData);
    case "sll-search":
      return generateSLLSearchSteps(arrayData, options.target);
    case "sll-insert-head":
      return generateSLLInsertHeadSteps(arrayData, options.value);
    case "sll-insert-tail":
      return generateSLLInsertTailSteps(arrayData, options.value);
    case "sll-insert-position":
      return generateSLLInsertPositionSteps(arrayData, options.value, options.index);
    case "sll-delete":
      return generateSLLDeleteSteps(arrayData, options.target);
    case "sll-delete-head":
      return generateSLLDeleteHeadSteps(arrayData);
    case "sll-reverse":
      return generateSLLReverseSteps(arrayData);
    case "sll-detect-cycle":
      return generateSLLDetectCycleSteps(arrayData);
    case "inorder-traversal":
      return generateTreeInorderSteps(arrayData);
    case "preorder-traversal":
      return generateTreePreorderSteps(arrayData);
    case "postorder-traversal":
      return generateTreePostorderSteps(arrayData);
    case "level-order-traversal":
      return generateTreeLevelOrderSteps(arrayData);
    case "bst-search":
      return generateBSTSearchSteps(arrayData, options.target);
    case "bst-insertion":
      return generateBSTInsertSteps(arrayData, options.value);
    case "heap-insert":
      return generateHeapInsertSteps(arrayData, options.value);
    case "trie-insert-word":
      return generateTrieInsertWordSteps();
    case "build-segment-tree":
      return generateSegmentTreeBuildSteps(arrayData);
    case "bfs":
      return generateGraphBFSSteps(graphStart);
    case "dfs":
      return generateGraphDFSSteps(graphStart);
    case "division-hash-method":
      return generateDivisionHashSteps(options.value, options.capacity);
    case "hash-insert":
    case "linear-probing":
    case "probing-insert":
      return generateLinearProbingInsertSteps(arrayData, options.value, options.capacity);
    case "hash-search":
    case "probing-search":
      return generateLinearProbingSearchSteps(arrayData, options.target, options.capacity);
    case "hash-delete":
    case "probing-delete":
      return generateLinearProbingDeleteSteps(arrayData, options.target, options.capacity);
    case "rehashing":
      return generateRehashingSteps(arrayData, options.capacity);
    case "chaining-insert":
      return generateChainingInsertSteps(arrayData, options.value, options.capacity);
    case "chaining-search":
      return generateChainingSearchSteps(arrayData, options.target, options.capacity);
    case "chaining-delete":
      return generateChainingDeleteSteps(arrayData, options.target, options.capacity);
    case "row-wise-traversal":
    case "matrix-row-traversal":
      return generateRowWiseTraversalSteps(arrayData, rows, cols);
    case "col-wise-traversal":
    case "matrix-col-traversal":
      return generateColWiseTraversalSteps(arrayData, rows, cols);
    case "spiral-traversal":
      return generateSpiralTraversalSteps(arrayData, rows, cols);
    case "matrix-search":
      return generateMatrixSearchSteps(arrayData, rows, cols, options.target);
    case "row-column-sorted-search":
      return generateSortedMatrixSearchSteps(arrayData, rows, cols, options.target);
    case "transpose-matrix":
      return generateTransposeMatrixSteps(arrayData, rows, cols);
    case "rotate-matrix-90":
      return generateRotateMatrixSteps(arrayData, rows, cols);
    case "matrix-multiplication":
      return generateMatrixMultiplicationSteps(arrayData, rows, cols);
    case "string-forward-traversal":
      return generateStringForwardTraversalSteps(options.text);
    case "string-reverse-traversal":
      return generateStringReverseTraversalSteps(options.text);
    case "string-palindrome":
      return generatePalindromeCheckSteps(options.text);
    case "string-naive-search":
      return generateNaiveSearchSteps(options.text, options.pattern);
    case "string-kmp-search":
      return generateKMPSearchSteps(options.text, options.pattern);
    case "string-rabin-karp":
      return generateRabinKarpSteps(options.text, options.pattern);
    case "reverse-string":
      return generateReverseStringSteps(options.text);
    case "hash-set-insert":
      return generateHashSetInsertSteps(arrayData, options.value, options.capacity);
    case "hash-set-search":
      return generateHashSetSearchSteps(arrayData, options.target, options.capacity);
    case "hash-set-delete":
      return generateHashSetDeleteSteps(arrayData, options.target, options.capacity);
    case "set-union":
      return generateHashSetUnionSteps(arrayData, options.value, options.capacity);
    case "set-intersection":
      return generateHashSetIntersectionSteps(arrayData, options.value, options.capacity);
    default:
      return [];
  }
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
    loadSteps(buildSteps(slug, arrayData, options));
    return () => reset();
  }, [algorithm, arrayData, loadSteps, options, reset, slug]);

  if (!algorithm) notFound();

  const codeExamples = getCodeExamples(algorithm.dataStructureId, slug, algorithm.id, algorithm.name);
  const isImplemented = buildSteps(slug, arrayData, options).length > 0;

  const renderCanvas = () => {
    if (!isImplemented) return <ComingSoonCanvas name={algorithm.name} />;
    if (algorithm.dataStructureId === "ds_array") return <ArrayRenderer />;
    if (algorithm.dataStructureId === "ds_stack") return <StackRenderer />;
    if (algorithm.dataStructureId === "ds_queue") return <QueueRenderer />;
    if (algorithm.dataStructureId === "ds_linked_list") return <LinkedListRenderer />;
    if (algorithm.dataStructureId === "ds_tree") return <TreeRenderer />;
    if (algorithm.dataStructureId === "ds_graph") return <GraphRenderer />;
    if (algorithm.dataStructureId === "ds_hash_table") return <HashTableRenderer />;
    if (algorithm.dataStructureId === "ds_matrix") return <MatrixRenderer />;
    if (algorithm.dataStructureId === "ds_string") return <StringRenderer />;
    if (algorithm.dataStructureId === "ds_hash_set") return <HashSetRenderer />;
    return <ComingSoonCanvas name={algorithm.name} />;
  };

  const showControls = ["ds_array", "ds_stack", "ds_queue", "ds_linked_list", "ds_tree", "ds_graph", "ds_hash_table", "ds_matrix", "ds_string", "ds_hash_set"].includes(algorithm.dataStructureId) && isImplemented;

  return (
    <VisualizerLayout
      algorithm={algorithm}
      codeExamples={codeExamples}
      controls={showControls ? (
        algorithm.dataStructureId === "ds_hash_table" ? (
          <HashTableInputControls
            slug={slug}
            dataLength={arrayData.length}
            options={options}
            onOptionsChange={setOptions}
            onGenerate={setArrayData}
            defaultSize={7}
          />
        ) : algorithm.dataStructureId === "ds_hash_set" ? (
          <HashSetInputControls
            slug={slug}
            dataLength={arrayData.length}
            options={options}
            onOptionsChange={setOptions}
            onGenerate={setArrayData}
            defaultSize={7}
          />
        ) : algorithm.dataStructureId === "ds_matrix" ? (
          <MatrixInputControls
            slug={slug}
            dataLength={arrayData.length}
            options={options}
            onOptionsChange={setOptions}
            onGenerate={setArrayData}
            defaultRows={4}
            defaultCols={4}
          />
        ) : algorithm.dataStructureId === "ds_string" ? (
          <StringInputControls
            slug={slug}
            options={options}
            onOptionsChange={setOptions}
          />
        ) : algorithm.dataStructureId === "ds_stack" ? (
          <StackInputControls
            slug={slug}
            options={options}
            onOptionsChange={setOptions}
          />
        ) : algorithm.dataStructureId === "ds_queue" ? (
          <QueueInputControls
            slug={slug}
            options={options}
            onOptionsChange={setOptions}
          />
        ) : algorithm.dataStructureId === "ds_linked_list" ? (
          <LinkedListInputControls
            slug={slug}
            options={options}
            onOptionsChange={setOptions}
          />
        ) : algorithm.dataStructureId === "ds_tree" ? (
          <TreeInputControls
            slug={slug}
            options={options}
            onOptionsChange={setOptions}
          />
        ) : algorithm.dataStructureId === "ds_graph" ? (
          <GraphInputControls
            slug={slug}
            options={options}
            onOptionsChange={setOptions}
          />
        ) : (
          <ArrayInputControls
            slug={slug}
            dataLength={arrayData.length}
            options={options}
            onOptionsChange={setOptions}
            onGenerate={setArrayData}
            defaultSize={arrayData.length}
          />
        )
      ) : null}
    >
      {renderCanvas()}
    </VisualizerLayout>
  );
}
