import type { VisualStep } from "@/types";
import {
  defaultVisualizerInputOptions,
  type VisualizerInputOptions,
} from "@/lib/validation/visualizer-input";
import { linkedListCodeLineMappings } from "@/visualizers/linked-list/code-line-mappings";
import { treeCodeLineMappings } from "@/visualizers/tree/code-line-mappings";
import { graphCodeLineMappings } from "@/visualizers/graph/code-line-mappings";
import { createBSTFromArr, createCompleteTreeFromArr } from "@/visualizers/tree/types";
import { createDefaultGraph } from "@/visualizers/graph/types";
import type { AuthoredPublicationArtifacts } from "../publication-registry";

const isNodeInput = (input: unknown): input is number[] =>
  Array.isArray(input) &&
  input.length > 0 &&
  input.length <= 20 &&
  input.every((value) => Number.isInteger(value));

function validateNodeInput(input: number[]) {
  return isNodeInput(input) ? [] : ["Input must contain 1 to 20 whole numbers."];
}

function validateLinkedInput(input: number[], options: VisualizerInputOptions) {
  const errors = [...validateNodeInput(input)];
  if (!Number.isInteger(options.index) || options.index < 0 || options.index > input.length) {
    errors.push(`Index must be between 0 and ${input.length}.`);
  }
  return errors;
}

function validateGraphInput(input: number[], options: VisualizerInputOptions) {
  const errors = [...validateNodeInput(input)];
  const graph = options.graphState;
  if (!graph || graph.nodes.length === 0) {
    errors.push("Graph input must include at least one node.");
  }
  return errors;
}

const inputGenerators = [
  { id: "balanced", label: "Balanced values", generate: () => [4, 2, 6, 1, 3, 5, 7] },
  { id: "short", label: "Short values", generate: () => [4, 8, 15] },
] as const;

const linkedLegend = [
  {
    bucketKey: "active",
    label: "Current node",
    description: "The linked-list node currently inspected.",
    tone: "primary",
  },
  {
    bucketKey: "visited",
    label: "Visited node",
    description: "A node already traversed.",
    tone: "muted",
  },
  {
    bucketKey: "compared",
    label: "Compared node",
    description: "A node whose value is compared with the target.",
    tone: "info",
  },
  {
    bucketKey: "found",
    label: "Found node",
    description: "The first node matching the target.",
    tone: "success",
  },
  {
    bucketKey: "pointer",
    label: "Link pointer",
    description: "A head, tail, previous, next, slow, or fast pointer.",
    tone: "info",
  },
  {
    bucketKey: "inserted",
    label: "Inserted node",
    description: "A newly allocated node linked into the list.",
    tone: "success",
  },
  {
    bucketKey: "deleted",
    label: "Deleted node",
    description: "A node unlinked from the list.",
    tone: "error",
  },
  {
    bucketKey: "sorted",
    label: "Link complete",
    description: "A node in its completed linked-list position.",
    tone: "success",
  },
  {
    bucketKey: "swapped",
    label: "Swapped pointers",
    description: "Pointers or nodes exchanged during reversal.",
    tone: "warning",
  },
  {
    bucketKey: "success",
    label: "Operation successful",
    description: "The newly inserted or configured node in the list.",
    tone: "success",
  },
] as const;

const treeLegend = [
  {
    bucketKey: "active",
    label: "Current tree node",
    description: "The tree node currently compared or visited.",
    tone: "primary",
  },
  {
    bucketKey: "visited",
    label: "Visited tree node",
    description: "A node already emitted in the traversal output.",
    tone: "info",
  },
  {
    bucketKey: "success",
    label: "Traversal complete",
    description: "A node retained in the completed traversal output.",
    tone: "success",
  },
  {
    bucketKey: "sorted",
    label: "Rebalanced tree node",
    description: "A node completed or balanced in the tree structure.",
    tone: "success",
  },
  {
    bucketKey: "inserted",
    label: "Inserted tree node",
    description: "The new node attached to the tree.",
    tone: "success",
  },
  {
    bucketKey: "swapped",
    label: "Rewired / rotated node",
    description: "Nodes exchanged or rewired during rotation or heap adjustment.",
    tone: "warning",
  },
  {
    bucketKey: "compared",
    label: "Compared tree node",
    description: "A child or subtree node compared against key.",
    tone: "info",
  },
  {
    bucketKey: "deleted",
    label: "Deleted tree node",
    description: "The node targeted for removal from the tree.",
    tone: "error",
  },
] as const;

const graphLegend = [
  {
    bucketKey: "active",
    label: "Frontier node",
    description: "The graph node currently expanded from the frontier.",
    tone: "primary",
  },
  {
    bucketKey: "visited",
    label: "Visited node",
    description: "A node already reached by the traversal or included in MST/distances.",
    tone: "success",
  },
  {
    bucketKey: "compared",
    label: "Compared neighbor",
    description: "A neighboring node or edge currently inspected.",
    tone: "info",
  },
  {
    bucketKey: "swapped",
    label: "Cycle path",
    description: "Nodes forming a detected cycle in the graph.",
    tone: "warning",
  },
] as const;

function options(overrides: Partial<VisualizerInputOptions> = {}) {
  return { ...structuredClone(defaultVisualizerInputOptions), ...overrides };
}

type LinkedState = {
  nodes: ReadonlyArray<{ id: string; value: number; nextId: string | null }>;
  headId: string | null;
};

function linkedValues(state: LinkedState | undefined) {
  if (!state) return undefined;
  const nodes = new Map(state.nodes.map((node) => [node.id, node]));
  const seen = new Set<string>();
  const values: number[] = [];
  let currentId = state.headId;
  while (currentId && !seen.has(currentId)) {
    seen.add(currentId);
    const node = nodes.get(currentId);
    if (!node) break;
    values.push(node.value);
    currentId = node.nextId;
  }
  return values;
}

function verifyLinked(expected: number[], actions: ReadonlyArray<VisualStep["actionType"]>) {
  return (steps: ReadonlyArray<VisualStep>) => {
    const failures: string[] = [];
    const values = linkedValues(steps.at(-1)?.dataState as LinkedState | undefined);
    if (JSON.stringify(values) !== JSON.stringify(expected)) {
      failures.push(`Final linked-list values must be [${expected.join(", ")}].`);
    }
    for (const action of actions) {
      if (!steps.some((step) => step.actionType === action))
        failures.push(`Steps must include the ${action} action.`);
    }
    if (steps.at(-1)?.actionType === "error")
      failures.push("Valid linked-list input must not finish with an error.");
    return failures;
  };
}

type TreeNode = { value: number; left: TreeNode | null; right: TreeNode | null };
type TreeState = { root: TreeNode | null };

function treeValues(root: TreeNode | null): number[] {
  return root ? [root.value, ...treeValues(root.left), ...treeValues(root.right)] : [];
}

function verifyTree(actions: ReadonlyArray<VisualStep["actionType"]>, expectedValue?: number) {
  return (steps: ReadonlyArray<VisualStep>) => {
    const failures: string[] = [];
    for (const action of actions) {
      if (!steps.some((step) => step.actionType === action))
        failures.push(`Steps must include the ${action} action.`);
    }
    const root = (steps.at(-1)?.dataState as TreeState | undefined)?.root ?? null;
    if (expectedValue !== undefined && !treeValues(root).includes(expectedValue)) {
      failures.push(`Final tree must contain ${expectedValue}.`);
    }
    if (steps.at(-1)?.actionType === "error")
      failures.push("Valid tree input must not finish with an error.");
    return failures;
  };
}

function verifyGraph(steps: ReadonlyArray<VisualStep>) {
  const failures: string[] = [];
  if (
    !steps.some(
      (step) =>
        step.actionType === "visit" ||
        step.actionType === "compare" ||
        step.actionType === "initialize" ||
        step.actionType === "enqueue"
    )
  )
    failures.push("Graph algorithm must process at least one node or edge.");
  if (steps.at(-1)?.actionType !== "complete")
    failures.push("Graph algorithm must finish with a complete step.");
  return failures;
}

function artifacts(
  codeLineMapping: AuthoredPublicationArtifacts["codeLineMapping"],
  input: number[],
  testOptions: VisualizerInputOptions,
  verify: AuthoredPublicationArtifacts["testCases"][number]["verify"],
  legend: AuthoredPublicationArtifacts["legend"],
  validateInput: AuthoredPublicationArtifacts["validateInput"] = validateNodeInput
): AuthoredPublicationArtifacts {
  return {
    inputSchema: isNodeInput,
    inputGenerators,
    validateInput,
    testCases: [
      {
        name: "satisfies the authored node-structure outcome",
        input,
        options: testOptions,
        verify,
      },
    ],
    codeLineMapping,
    legend,
  };
}

const list = [4, 8, 15];
const treeState = { root: createCompleteTreeFromArr([4, 2, 6, 1, 3, 5, 7]) };
const bstState = { root: createBSTFromArr([4, 2, 6, 1, 3, 5, 7]) };

export const linkedListPublicationArtifacts: Record<
  keyof typeof linkedListCodeLineMappings,
  AuthoredPublicationArtifacts
> = {
  "linked-list-types": artifacts(
    linkedListCodeLineMappings["linked-list-types"],
    list,
    options(),
    verifyLinked(list, ["highlight", "link"]),
    linkedLegend
  ),
  "sll-traversal": artifacts(
    linkedListCodeLineMappings["sll-traversal"],
    list,
    options(),
    verifyLinked(list, ["visit", "complete"]),
    linkedLegend
  ),
  "sll-search": artifacts(
    linkedListCodeLineMappings["sll-search"],
    list,
    options({ target: 8 }),
    verifyLinked(list, ["found"]),
    linkedLegend
  ),
  "sll-insert-head": artifacts(
    linkedListCodeLineMappings["sll-insert-head"],
    list,
    options({ value: 23 }),
    verifyLinked([23, 4, 8, 15], ["link", "complete"]),
    linkedLegend
  ),
  "sll-insert-tail": artifacts(
    linkedListCodeLineMappings["sll-insert-tail"],
    list,
    options({ value: 23 }),
    verifyLinked([4, 8, 15, 23], ["link", "complete"]),
    linkedLegend
  ),
  "sll-insert-position": artifacts(
    linkedListCodeLineMappings["sll-insert-position"],
    list,
    options({ value: 23, index: 1 }),
    verifyLinked([4, 23, 8, 15], ["build", "complete"]),
    linkedLegend,
    validateLinkedInput
  ),
  "sll-delete": artifacts(
    linkedListCodeLineMappings["sll-delete"],
    list,
    options({ target: 8 }),
    verifyLinked([4, 15], ["delete", "complete"]),
    linkedLegend
  ),
  "sll-delete-head": artifacts(
    linkedListCodeLineMappings["sll-delete-head"],
    list,
    options(),
    verifyLinked([8, 15], ["delete", "complete"]),
    linkedLegend
  ),
  "sll-reverse": artifacts(
    linkedListCodeLineMappings["sll-reverse"],
    list,
    options(),
    verifyLinked([15, 8, 4], ["set-pointer", "complete"]),
    linkedLegend
  ),
  "sll-detect-cycle": artifacts(
    linkedListCodeLineMappings["sll-detect-cycle"],
    [4, 8, 15, 16],
    options(),
    verifyLinked([4, 8, 15, 16], ["move-pointer", "found"]),
    linkedLegend
  ),
  "sll-delete-tail": artifacts(
    linkedListCodeLineMappings["sll-delete-tail"],
    list,
    options(),
    verifyLinked([4, 8], ["delete", "complete"]),
    linkedLegend
  ),
  "sll-find-middle": artifacts(
    linkedListCodeLineMappings["sll-find-middle"],
    list,
    options(),
    verifyLinked(list, ["move-pointer", "complete"]),
    linkedLegend
  ),
  "sll-remove-duplicates": artifacts(
    linkedListCodeLineMappings["sll-remove-duplicates"],
    [4, 8, 8, 15],
    options(),
    verifyLinked([4, 8, 15], ["delete", "complete"]),
    linkedLegend
  ),

  // Doubly Linked List
  "dll-traversal": artifacts(
    linkedListCodeLineMappings["dll-traversal"],
    list,
    options(),
    verifyLinked(list, ["visit", "complete"]),
    linkedLegend
  ),
  "dll-insert-head": artifacts(
    linkedListCodeLineMappings["dll-insert-head"],
    list,
    options({ value: 23 }),
    verifyLinked([23, 4, 8, 15], ["link", "insert"]),
    linkedLegend
  ),
  "dll-insert-tail": artifacts(
    linkedListCodeLineMappings["dll-insert-tail"],
    list,
    options({ value: 23 }),
    verifyLinked([4, 8, 15, 23], ["link", "insert"]),
    linkedLegend
  ),
  "dll-delete-head": artifacts(
    linkedListCodeLineMappings["dll-delete-head"],
    list,
    options(),
    verifyLinked([8, 15], ["delete", "complete"]),
    linkedLegend
  ),
  "dll-delete-tail": artifacts(
    linkedListCodeLineMappings["dll-delete-tail"],
    list,
    options(),
    verifyLinked([4, 8], ["delete", "complete"]),
    linkedLegend
  ),
  "dll-reverse": artifacts(
    linkedListCodeLineMappings["dll-reverse"],
    list,
    options(),
    verifyLinked([15, 8, 4], ["swap", "complete"]),
    linkedLegend
  ),

  // Circular Linked List
  "cll-traversal": artifacts(
    linkedListCodeLineMappings["cll-traversal"],
    list,
    options(),
    verifyLinked(list, ["visit", "complete"]),
    linkedLegend
  ),
  "cll-insert-head": artifacts(
    linkedListCodeLineMappings["cll-insert-head"],
    list,
    options({ value: 23 }),
    verifyLinked([23, 4, 8, 15], ["link", "insert"]),
    linkedLegend
  ),
  "cll-insert-tail": artifacts(
    linkedListCodeLineMappings["cll-insert-tail"],
    list,
    options({ value: 23 }),
    verifyLinked([4, 8, 15, 23], ["link", "insert"]),
    linkedLegend
  ),
  "cll-delete-head": artifacts(
    linkedListCodeLineMappings["cll-delete-head"],
    list,
    options(),
    verifyLinked([8, 15], ["delete", "complete"]),
    linkedLegend
  ),
};

export const treePublicationArtifacts: Record<
  keyof typeof treeCodeLineMappings,
  AuthoredPublicationArtifacts
> = {
  "inorder-traversal": artifacts(
    treeCodeLineMappings["inorder-traversal"],
    list,
    options({ treeState }),
    verifyTree(["visit", "complete"]),
    treeLegend
  ),
  "preorder-traversal": artifacts(
    treeCodeLineMappings["preorder-traversal"],
    list,
    options({ treeState }),
    verifyTree(["visit", "complete"]),
    treeLegend
  ),
  "postorder-traversal": artifacts(
    treeCodeLineMappings["postorder-traversal"],
    list,
    options({ treeState }),
    verifyTree(["visit", "complete"]),
    treeLegend
  ),
  "level-order-traversal": artifacts(
    treeCodeLineMappings["level-order-traversal"],
    list,
    options({ treeState }),
    verifyTree(["visit", "complete"]),
    treeLegend
  ),
  "bst-insertion": artifacts(
    treeCodeLineMappings["bst-insertion"],
    list,
    options({ treeState: bstState, value: 8 }),
    verifyTree(["compare", "complete"], 8),
    treeLegend
  ),
  "bst-search": artifacts(
    treeCodeLineMappings["bst-search"],
    list,
    options({ treeState: bstState, target: 5 }),
    verifyTree(["compare", "complete"], 5),
    treeLegend
  ),
  "heap-insert": artifacts(
    treeCodeLineMappings["heap-insert"],
    list,
    options({ value: 2 }),
    verifyTree(["insert", "complete"], 2),
    treeLegend
  ),
  "trie-insert-word": artifacts(
    treeCodeLineMappings["trie-insert-word"],
    list,
    options(),
    verifyTree(["insert", "complete"], 69),
    treeLegend
  ),
  "build-segment-tree": artifacts(
    treeCodeLineMappings["build-segment-tree"],
    list,
    options(),
    verifyTree(["build"], 27),
    treeLegend
  ),
  "bst-deletion": artifacts(
    treeCodeLineMappings["bst-deletion"],
    list,
    options({ treeState: bstState, target: 2 }),
    verifyTree(["visit", "complete"]),
    treeLegend
  ),
  "avl-rotations": artifacts(
    treeCodeLineMappings["avl-rotations"],
    list,
    options(),
    verifyTree(["compare", "complete"]),
    treeLegend
  ),
  "heap-extract-max": artifacts(
    treeCodeLineMappings["heap-extract-max"],
    list,
    options(),
    verifyTree(["delete", "complete"]),
    treeLegend
  ),
  heapify: artifacts(
    treeCodeLineMappings["heapify"],
    list,
    options(),
    verifyTree(["visit", "complete"]),
    treeLegend
  ),
  "trie-search": artifacts(
    treeCodeLineMappings["trie-search"],
    list,
    options({ text: "CODE" }),
    verifyTree(["compare", "complete"]),
    treeLegend
  ),
};

const graphOptions = options({ text: "A", graphState: createDefaultGraph(), isDirected: false });
export const graphPublicationArtifacts: Record<
  keyof typeof graphCodeLineMappings,
  AuthoredPublicationArtifacts
> = {
  bfs: artifacts(
    graphCodeLineMappings.bfs,
    list,
    graphOptions,
    verifyGraph,
    graphLegend,
    validateGraphInput
  ),
  dfs: artifacts(
    graphCodeLineMappings.dfs,
    list,
    graphOptions,
    verifyGraph,
    graphLegend,
    validateGraphInput
  ),
  dijkstra: artifacts(
    graphCodeLineMappings.dijkstra,
    list,
    graphOptions,
    verifyGraph,
    graphLegend,
    validateGraphInput
  ),
  "bellman-ford": artifacts(
    graphCodeLineMappings["bellman-ford"],
    list,
    graphOptions,
    verifyGraph,
    graphLegend,
    validateGraphInput
  ),
  kruskal: artifacts(
    graphCodeLineMappings.kruskal,
    list,
    graphOptions,
    verifyGraph,
    graphLegend,
    validateGraphInput
  ),
  prim: artifacts(
    graphCodeLineMappings.prim,
    list,
    graphOptions,
    verifyGraph,
    graphLegend,
    validateGraphInput
  ),
  "topological-sort": artifacts(
    graphCodeLineMappings["topological-sort"],
    list,
    graphOptions,
    verifyGraph,
    graphLegend,
    validateGraphInput
  ),
  "detect-cycle-graph": artifacts(
    graphCodeLineMappings["detect-cycle-graph"],
    list,
    graphOptions,
    verifyGraph,
    graphLegend,
    validateGraphInput
  ),
  "connected-components": artifacts(
    graphCodeLineMappings["connected-components"],
    list,
    graphOptions,
    verifyGraph,
    graphLegend,
    validateGraphInput
  ),
};
