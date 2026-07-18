import { algorithms } from "@/data/seed/algorithms";
import { operations } from "@/data/seed/operations";
import type { CodeExample, DifficultyLevel, PriorityLevel } from "@/types";
import {
  defaultVisualizerInputOptions,
  type VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { algorithmRegistry } from "./algorithm-registry";
import { dataStructureCapabilities } from "./ds-capabilities";
import {
  DATA_STRUCTURE_IDS,
  REQUIRED_CODE_LANGUAGES,
  type AlgorithmVisualizerDefinition,
  type DataStructureId,
  type RequiredCodeLanguage,
} from "./types";
import type { VisualizerDefinition } from "./VisualizerDefinition";
import { getVisualizerPseudocode } from "./pseudocode";
import { arrayAccessPublicationArtifacts } from "./publication-artifacts/array-access";
import { arrayTraversalPublicationArtifacts } from "./publication-artifacts/array-traversal";
import { arraySearchPublicationArtifacts } from "./publication-artifacts/array-search";
import { arraySortPublicationArtifacts } from "./publication-artifacts/array-sort";
import { arrayMutationPublicationArtifacts } from "./publication-artifacts/array-mutations";
import {
  stackPublicationArtifacts,
  queuePublicationArtifacts,
} from "./publication-artifacts/linear-structures";
import {
  linkedListPublicationArtifacts,
  treePublicationArtifacts,
  graphPublicationArtifacts,
} from "./publication-artifacts/node-structures";
import {
  hashTablePublicationArtifacts,
  hashSetPublicationArtifacts,
} from "./publication-artifacts/hash-structures";
import {
  matrixPublicationArtifacts,
  stringPublicationArtifacts,
} from "./publication-artifacts/text-grid-structures";

export type AuthoredPublicationArtifacts = Pick<
  VisualizerDefinition<number[]>,
  "inputSchema" | "inputGenerators" | "validateInput" | "testCases" | "codeLineMapping" | "legend"
>;

/**
 * Intentionally empty until artifacts are genuinely authored. Missing entries
 * are readiness failures, not a signal to synthesize generic placeholders.
 */
export const authoredPublicationArtifacts: Partial<Record<string, AuthoredPublicationArtifacts>> = {
  ...arrayAccessPublicationArtifacts,
  ...arrayTraversalPublicationArtifacts,
  ...arraySearchPublicationArtifacts,
  ...arraySortPublicationArtifacts,
  ...arrayMutationPublicationArtifacts,
  ...stackPublicationArtifacts,
  ...queuePublicationArtifacts,
  ...linkedListPublicationArtifacts,
  ...treePublicationArtifacts,
  ...graphPublicationArtifacts,
  ...hashTablePublicationArtifacts,
  ...hashSetPublicationArtifacts,
  ...matrixPublicationArtifacts,
  ...stringPublicationArtifacts,
};

export interface ComposedPublicationDefinition {
  id: string;
  slug: string;
  title: string;
  description: string;
  dataStructureId: DataStructureId;
  operation: string;
  difficulty: DifficultyLevel;
  priority: PriorityLevel;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  tags: ReadonlyArray<string>;
  defaultInput: number[];
  defaultOptions: VisualizerInputOptions;
  generateSteps: AlgorithmVisualizerDefinition["generateSteps"];
  codeExamples: Partial<Record<RequiredCodeLanguage, CodeExample>>;
  pseudocode: ReadonlyArray<{ line: number; text: string }>;
  renderer: string;
  inputControls: string;
  authoredArtifacts?: AuthoredPublicationArtifacts;
}

const supportedDataStructureIds = new Set<string>(DATA_STRUCTURE_IDS);
const operationById = new Map(operations.map((operation) => [operation.id, operation]));

function isDataStructureId(value: string): value is DataStructureId {
  return supportedDataStructureIds.has(value);
}

function indexCodeExamples(examples: CodeExample[]) {
  const indexed: Partial<Record<RequiredCodeLanguage, CodeExample>> = {};
  for (const language of REQUIRED_CODE_LANGUAGES) {
    const example = examples.find((candidate) => candidate.language === language);
    if (example) indexed[language] = example;
  }
  return indexed;
}

function composeDefinition(algorithm: (typeof algorithms)[number]): ComposedPublicationDefinition {
  if (!isDataStructureId(algorithm.dataStructureId)) {
    throw new Error(
      `Cannot compose ${algorithm.slug}: unsupported data structure ${algorithm.dataStructureId}`
    );
  }

  const implementation = algorithmRegistry[algorithm.slug];
  if (!implementation) {
    throw new Error(`Cannot compose ${algorithm.slug}: implementation is missing`);
  }

  const dataStructure = dataStructureCapabilities[algorithm.dataStructureId];
  if (!dataStructure) {
    throw new Error(`Cannot compose ${algorithm.slug}: renderer/controls are missing`);
  }

  const operation = operationById.get(algorithm.operationId);
  if (!operation) {
    throw new Error(
      `Cannot compose ${algorithm.slug}: operation ${algorithm.operationId} is missing`
    );
  }

  return {
    id: algorithm.id,
    slug: algorithm.slug,
    title: algorithm.name,
    description: algorithm.shortDescription,
    dataStructureId: algorithm.dataStructureId,
    operation: operation.name,
    difficulty: algorithm.difficulty,
    priority: algorithm.priority,
    timeComplexity: {
      best: algorithm.timeComplexityBest,
      average: algorithm.timeComplexityAverage,
      worst: algorithm.timeComplexityWorst,
    },
    spaceComplexity: algorithm.spaceComplexity,
    tags: algorithm.tags,
    defaultInput: [15, 23, 4, 8, 42, 16],
    defaultOptions: structuredClone(defaultVisualizerInputOptions),
    generateSteps: implementation.generateSteps,
    codeExamples: indexCodeExamples(implementation.getCodeExamples(algorithm.slug, algorithm.id)),
    pseudocode: getVisualizerPseudocode(
      algorithm.slug,
      implementation.pseudocode ?? algorithm.pseudocode
    ).map((text, index) => ({ line: index + 1, text })),
    renderer: dataStructure.renderer,
    inputControls: dataStructure.inputControls,
    authoredArtifacts: authoredPublicationArtifacts[algorithm.slug],
  };
}

export const publicationRegistry: Record<string, ComposedPublicationDefinition> =
  Object.fromEntries(
    algorithms
      .filter((algorithm) => algorithm.isPublished)
      .map((algorithm) => [algorithm.slug, composeDefinition(algorithm)])
  );
