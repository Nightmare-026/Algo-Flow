import { DataStructureId, DataStructureVisualizerDefinition } from "./types";

// Renderers
import { ArrayRenderer } from "@/components/visualizer/renderers/ArrayRenderer";
import { StackRenderer } from "@/components/visualizer/renderers/StackRenderer";
import { QueueRenderer } from "@/components/visualizer/renderers/QueueRenderer";
import { LinkedListRenderer } from "@/components/visualizer/renderers/LinkedListRenderer";
import { DoublyLinkedListRenderer } from "@/components/visualizer/renderers/DoublyLinkedListRenderer";
import { CircularLinkedListRenderer } from "@/components/visualizer/renderers/CircularLinkedListRenderer";
import { TreeRenderer } from "@/components/visualizer/renderers/TreeRenderer";
import { GraphRenderer } from "@/components/visualizer/renderers/GraphRenderer";
import { HashTableRenderer } from "@/components/visualizer/renderers/HashTableRenderer";
import { HashSetRenderer } from "@/components/visualizer/renderers/HashSetRenderer";
import { MatrixRenderer } from "@/components/visualizer/renderers/MatrixRenderer";
import { StringRenderer } from "@/components/visualizer/renderers/StringRenderer";

// Controls
import { ArrayInputControls } from "@/components/visualizer/controls/ArrayInputControls";
import { StackInputControls } from "@/components/visualizer/controls/StackInputControls";
import { QueueInputControls } from "@/components/visualizer/controls/QueueInputControls";
import { LinkedListInputControls } from "@/components/visualizer/controls/LinkedListInputControls";
import { DoublyLinkedListInputControls } from "@/components/visualizer/controls/DoublyLinkedListInputControls";
import { CircularLinkedListInputControls } from "@/components/visualizer/controls/CircularLinkedListInputControls";
import { TreeInputControls } from "@/components/visualizer/controls/TreeInputControls";
import { GraphInputControls } from "@/components/visualizer/controls/GraphInputControls";
import { HashTableInputControls } from "@/components/visualizer/controls/HashTableInputControls";
import { HashSetInputControls } from "@/components/visualizer/controls/HashSetInputControls";
import { MatrixInputControls } from "@/components/visualizer/controls/MatrixInputControls";
import { StringInputControls } from "@/components/visualizer/controls/StringInputControls";

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
  ds_doubly_linked_list: {
    dataStructureId: "ds_doubly_linked_list",
    Renderer: DoublyLinkedListRenderer,
    InputControls: DoublyLinkedListInputControls,
  },
  ds_circular_linked_list: {
    dataStructureId: "ds_circular_linked_list",
    Renderer: CircularLinkedListRenderer,
    InputControls: CircularLinkedListInputControls,
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
