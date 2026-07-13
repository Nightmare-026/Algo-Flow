import { algorithms } from "./src/data/seed/algorithms";
import { getArrayCodeExamples } from "./src/features/algorithms/array/code-examples";
import { getStackCodeExamples } from "./src/features/algorithms/stack/code-examples";
import { getQueueCodeExamples } from "./src/features/algorithms/queue/code-examples";
import { getLinkedListCodeExamples } from "./src/features/algorithms/linked-list/code-examples";
import { getTreeCodeExamples } from "./src/features/algorithms/tree/code-examples";
import { getGraphCodeExamples } from "./src/features/algorithms/graph/code-examples";
import { getHashTableCodeExamples } from "./src/features/algorithms/hash-table/code-examples";
import { getHashSetCodeExamples } from "./src/features/algorithms/hash-set/code-examples";
import { getMatrixCodeExamples } from "./src/features/algorithms/matrix/code-examples";
import { getStringCodeExamples } from "./src/features/algorithms/string/code-examples";

import { CodeExample } from "./src/types";

const dsMap: Record<string, (slug: string, id: string) => CodeExample[]> = {
  ds_array: getArrayCodeExamples,
  ds_stack: getStackCodeExamples,
  ds_queue: getQueueCodeExamples,
  ds_linked_list: getLinkedListCodeExamples,
  ds_tree: getTreeCodeExamples,
  ds_graph: getGraphCodeExamples,
  ds_hash_table: (slug: string, id: string) => getHashTableCodeExamples(slug.includes("chaining") ? "separate-chaining" : "linear-probing", id),
  ds_hash_set: getHashSetCodeExamples,
  ds_matrix: getMatrixCodeExamples,
  ds_string: getStringCodeExamples,
};

let missing = 0;
let total = 0;

for (const algo of algorithms) {
  if (algo.isPublished) {
    total++;
    const fn = dsMap[algo.dataStructureId];
    if (fn) {
      const examples = fn(algo.slug, algo.id);
      if (!examples || examples.length === 0) {
        console.log(`[Missing Examples] ${algo.slug} (${algo.name}) in ${algo.dataStructureId}`);
        missing++;
      }
    }
  }
}

console.log(`Total: ${total}, Missing Examples: ${missing}`);
