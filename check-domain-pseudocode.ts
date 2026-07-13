import { algorithms } from "./src/data/seed/algorithms";
import { getAlgorithmPseudocode } from "./src/features/algorithms/array/pseudocode";
import { getStackPseudocode } from "./src/features/algorithms/stack/pseudocode";
import { getQueuePseudocode } from "./src/features/algorithms/queue/pseudocode";
import { getLinkedListPseudocode } from "./src/features/algorithms/linked-list/pseudocode";
import { getTreePseudocode } from "./src/features/algorithms/tree/pseudocode";
import { getGraphPseudocode } from "./src/features/algorithms/graph/pseudocode";
import { getHashTablePseudocode } from "./src/features/algorithms/hash-table/pseudocode";
import { getHashSetPseudocode } from "./src/features/algorithms/hash-set/pseudocode";
import { getMatrixPseudocode } from "./src/features/algorithms/matrix/pseudocode";
import { getStringPseudocode } from "./src/features/algorithms/string/pseudocode";

let missing = 0;
let total = 0;

for (const algo of algorithms) {
  if (algo.isPublished) {
    total++;
    const matchedLines = [
      getAlgorithmPseudocode,
      getStackPseudocode,
      getQueuePseudocode,
      getLinkedListPseudocode,
      getTreePseudocode,
      getGraphPseudocode,
      getHashTablePseudocode,
      getHashSetPseudocode,
      getMatrixPseudocode,
      getStringPseudocode,
    ]
      .map((getLines) => getLines(algo.slug))
      .find((candidate) => candidate.length > 0) ?? [];
      
    if (matchedLines.length === 0) {
      console.log(`[Missing Domain Pseudocode] ${algo.slug} (${algo.name})`);
      missing++;
    }
  }
}

console.log(`Total: ${total}, Missing Domain Pseudocode: ${missing}`);
