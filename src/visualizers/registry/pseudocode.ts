import { getAlgorithmPseudocode } from "@/visualizers/array/pseudocode";
import { getGraphPseudocode } from "@/visualizers/graph/pseudocode";
import { getHashSetPseudocode } from "@/visualizers/hash-set/pseudocode";
import { getHashTablePseudocode } from "@/visualizers/hash-table/pseudocode";
import { getLinkedListPseudocode } from "@/visualizers/linked-list/pseudocode";
import { getMatrixPseudocode } from "@/visualizers/matrix/pseudocode";
import { getQueuePseudocode } from "@/visualizers/queue/pseudocode";
import { getStackPseudocode } from "@/visualizers/stack/pseudocode";
import { getStringPseudocode } from "@/visualizers/string/pseudocode";
import { getTreePseudocode } from "@/visualizers/tree/pseudocode";

const providers = [
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
] as const;

function parse(source: string | undefined) {
  return (source ?? "")
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter((line) => line.trim().length > 0);
}

/**
 * One authoritative pseudocode source for the runtime panel, publication
 * registry, and coordination validator.
 */
export function getVisualizerPseudocode(slug: string, fallback?: string) {
  for (const provider of providers) {
    const lines = provider(slug);
    if (lines.length > 0) return lines;
  }
  return parse(fallback);
}
