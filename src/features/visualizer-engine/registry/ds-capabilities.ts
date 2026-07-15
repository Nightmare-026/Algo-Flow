import type { DataStructureId } from "./types";

/**
 * CSS-free capability manifest for build scripts and audits. The browser
 * registry imports the actual components; this manifest lets Node validators
 * inspect the same registration surface without executing UI/CSS modules.
 */
export const dataStructureCapabilities: Record<
  DataStructureId,
  { renderer: string; inputControls: string }
> = {
  ds_array: {
    renderer: "ArrayRenderer",
    inputControls: "ArrayInputControls",
  },
  ds_stack: {
    renderer: "StackRenderer",
    inputControls: "StackInputControls",
  },
  ds_queue: {
    renderer: "QueueRenderer",
    inputControls: "QueueInputControls",
  },
  ds_linked_list: {
    renderer: "LinkedListRenderer",
    inputControls: "LinkedListInputControls",
  },
  ds_tree: {
    renderer: "TreeRenderer",
    inputControls: "TreeInputControls",
  },
  ds_graph: {
    renderer: "GraphRenderer",
    inputControls: "GraphInputControls",
  },
  ds_hash_table: {
    renderer: "HashTableRenderer",
    inputControls: "HashTableInputControls",
  },
  ds_hash_set: {
    renderer: "HashSetRenderer",
    inputControls: "HashSetInputControls",
  },
  ds_matrix: {
    renderer: "MatrixRenderer",
    inputControls: "MatrixInputControls",
  },
  ds_string: {
    renderer: "StringRenderer",
    inputControls: "StringInputControls",
  },
};
