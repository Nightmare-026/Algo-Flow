import { AlgorithmVisualizerDefinition } from "./types";
import { arrayRegistry } from "../array/registry";
import { stackRegistry } from "../stack/registry";
import { queueRegistry } from "../queue/registry";
import { linkedListRegistry } from "../linked-list/registry";
import { treeRegistry } from "../tree/registry";
import { graphRegistry } from "../graph/registry";
import { hashTableRegistry } from "../hash-table/registry";
import { hashSetRegistry } from "../hash-set/registry";
import { matrixRegistry } from "../matrix/registry";
import { stringRegistry } from "../string/registry";

const allDefinitions: AlgorithmVisualizerDefinition[] = [
  ...arrayRegistry,
  ...stackRegistry,
  ...queueRegistry,
  ...linkedListRegistry,
  ...treeRegistry,
  ...graphRegistry,
  ...hashTableRegistry,
  ...hashSetRegistry,
  ...matrixRegistry,
  ...stringRegistry,
];

// Export as a lookup map by slug
export const algorithmRegistry: Record<string, AlgorithmVisualizerDefinition> =
  allDefinitions.reduce(
    (acc, definition) => {
      if (acc[definition.slug]) {
        throw new Error(`Duplicate visualizer registry slug: ${definition.slug}`);
      }

      acc[definition.slug] = definition;
      return acc;
    },
    {} as Record<string, AlgorithmVisualizerDefinition>
  );
