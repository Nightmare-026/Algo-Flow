import { AlgorithmVisualizerDefinition } from "./types";
import { arrayRegistry } from "../../algorithms/array/registry";
import { stackRegistry } from "../../algorithms/stack/registry";
import { queueRegistry } from "../../algorithms/queue/registry";
import { linkedListRegistry } from "../../algorithms/linked-list/registry";
import { treeRegistry } from "../../algorithms/tree/registry";
import { graphRegistry } from "../../algorithms/graph/registry";
import { hashTableRegistry } from "../../algorithms/hash-table/registry";
import { hashSetRegistry } from "../../algorithms/hash-set/registry";
import { matrixRegistry } from "../../algorithms/matrix/registry";
import { stringRegistry } from "../../algorithms/string/registry";

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
