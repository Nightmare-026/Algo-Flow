import { DataStructureId, DataStructureVisualizerDefinition } from "./types";

// Renderers
import { ArrayRenderer } from "../components/renderers/ArrayRenderer";
import { StackRenderer } from "../components/renderers/StackRenderer";
import { QueueRenderer } from "../components/renderers/QueueRenderer";
import { LinkedListRenderer } from "../components/renderers/LinkedListRenderer";
import { TreeRenderer } from "../components/renderers/TreeRenderer";
import { GraphRenderer } from "../components/renderers/GraphRenderer";
import { HashTableRenderer } from "../components/renderers/HashTableRenderer";
import { HashSetRenderer } from "../components/renderers/HashSetRenderer";
import { MatrixRenderer } from "../components/renderers/MatrixRenderer";
import { StringRenderer } from "../components/renderers/StringRenderer";

// Controls
import { ArrayInputControls } from "../components/controls/ArrayInputControls";
import { StackInputControls } from "../components/controls/StackInputControls";
import { QueueInputControls } from "../components/controls/QueueInputControls";
import { LinkedListInputControls } from "../components/controls/LinkedListInputControls";
import { TreeInputControls } from "../components/controls/TreeInputControls";
import { GraphInputControls } from "../components/controls/GraphInputControls";
import { HashTableInputControls } from "../components/controls/HashTableInputControls";
import { HashSetInputControls } from "../components/controls/HashSetInputControls";
import { MatrixInputControls } from "../components/controls/MatrixInputControls";
import { StringInputControls } from "../components/controls/StringInputControls";

export const dsRegistry: Record<DataStructureId, DataStructureVisualizerDefinition> &
  Partial<Record<string, DataStructureVisualizerDefinition>> = {
  ds_array: {
    dataStructureId: "ds_array",
    Renderer: ArrayRenderer,
    InputControls: ArrayInputControls,
  },
  ds_stack: {
    dataStructureId: "ds_stack",
    Renderer: StackRenderer,
    InputControls: StackInputControls,
  },
  ds_queue: {
    dataStructureId: "ds_queue",
    Renderer: QueueRenderer,
    InputControls: QueueInputControls,
  },
  ds_linked_list: {
    dataStructureId: "ds_linked_list",
    Renderer: LinkedListRenderer,
    InputControls: LinkedListInputControls,
  },
  ds_tree: { dataStructureId: "ds_tree", Renderer: TreeRenderer, InputControls: TreeInputControls },
  ds_graph: {
    dataStructureId: "ds_graph",
    Renderer: GraphRenderer,
    InputControls: GraphInputControls,
  },
  ds_hash_table: {
    dataStructureId: "ds_hash_table",
    Renderer: HashTableRenderer,
    InputControls: HashTableInputControls,
  },
  ds_hash_set: {
    dataStructureId: "ds_hash_set",
    Renderer: HashSetRenderer,
    InputControls: HashSetInputControls,
  },
  ds_matrix: {
    dataStructureId: "ds_matrix",
    Renderer: MatrixRenderer,
    InputControls: MatrixInputControls,
  },
  ds_string: {
    dataStructureId: "ds_string",
    Renderer: StringRenderer,
    InputControls: StringInputControls,
  },
};
