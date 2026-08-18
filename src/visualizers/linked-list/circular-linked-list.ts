import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import {
  CircularLinkedListVisualState,
  LinkedListNode,
  createCircularLinkedListNodes,
} from "./types";

const clone = <T>(v: T): T => structuredClone(v);

function step(input: Omit<VisualStep, "id">): VisualStep {
  return {
    id: uuidv4(),
    ...input,
    codeLine: input.codeLine ?? input.pseudocodeLine,
  };
}

// ----------------------------------------------------------------
// 1. CLL Traversal
// ----------------------------------------------------------------
export function generateCLLTraversalSteps(initialData: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = createCircularLinkedListNodes(initialData);

  steps.push(
    step({
      stepNumber: 1,
      title: "Initialize Circular Traversal",
      description:
        "Start traversing circular list from HEAD. Traversal stops when we return to HEAD.",
      operation: "CLL Traversal",
      actionType: "initialize",
      dataState: clone(state),
      highlights: {},
      pseudocodeLine: 1,
      variables: {
        Head: state.headId ? state.headId.substring(0, 4) : "null",
      },
    })
  );

  if (!state.headId) {
    steps.push(
      step({
        stepNumber: 2,
        title: "List Empty",
        description: "Circular list is empty.",
        operation: "CLL Traversal",
        actionType: "complete",
        dataState: clone(state),
        highlights: {},
        pseudocodeLine: 2,
      })
    );
    return steps;
  }

  let stepNum = 2;
  const visitedIds: string[] = [];
  let currId: string | null = state.headId;
  let isFirst = true;

  while (currId && (isFirst || currId !== state.headId)) {
    isFirst = false;
    const node = state.nodes.find((n) => n.id === currId);
    if (!node) break;

    visitedIds.push(currId);

    steps.push(
      step({
        stepNumber: stepNum++,
        title: `Visit Node (${node.value})`,
        description: `Visiting circular node ${node.value}. Next pointer points to ${node.nextId === state.headId ? "HEAD (circular loop)" : "next node"}.`,
        operation: "CLL Traversal",
        actionType: "visit",
        dataState: clone(state),
        highlights: { active: [currId], visited: [...visitedIds] },
        pseudocodeLine: 3,
        variables: {
          Current: node.value,
          NextIsHead: node.nextId === state.headId,
        },
      })
    );

    currId = node.nextId;
    if (currId === state.headId) {
      steps.push(
        step({
          stepNumber: stepNum++,
          title: "Loop Detected Back to HEAD",
          description: "Reached pointer back to HEAD. Loop completed full cycle.",
          operation: "CLL Traversal",
          actionType: "highlight",
          dataState: clone(state),
          highlights: { pointer: [state.headId], visited: [...visitedIds] },
          pseudocodeLine: 4,
          variables: { CycleFinished: true },
        })
      );
      break;
    } else if (currId) {
      steps.push(
        step({
          stepNumber: stepNum++,
          title: "Advance Pointer",
          description: "Advancing to next node in the circular list.",
          operation: "CLL Traversal",
          actionType: "move-pointer",
          dataState: clone(state),
          highlights: { pointer: [currId], visited: [...visitedIds] },
          pseudocodeLine: 4,
        })
      );
    }
  }

  steps.push(
    step({
      stepNumber: stepNum,
      title: "CLL Traversal Complete",
      description:
        "Full circular traversal finished. Visited all nodes exactly once without infinite loop.",
      operation: "CLL Traversal",
      actionType: "complete",
      dataState: clone(state),
      highlights: { sorted: visitedIds },
      pseudocodeLine: 5,
    })
  );

  return steps;
}

// ----------------------------------------------------------------
// 2. CLL Insert Head
// ----------------------------------------------------------------
export function generateCLLInsertHeadSteps(initialData: number[], val: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = createCircularLinkedListNodes(initialData);
  const newNode: LinkedListNode = {
    id: uuidv4(),
    value: val,
    nextId: null,
  };

  steps.push(
    step({
      stepNumber: 1,
      title: "Create New Node",
      description: `Allocated new node with value ${val}.`,
      operation: "CLL Insert Head",
      actionType: "initialize",
      dataState: clone(state),
      highlights: {},
      pseudocodeLine: 1,
      variables: { Value: val },
    })
  );

  if (!state.headId) {
    newNode.nextId = newNode.id; // Self-loop
    state.nodes.push(newNode);
    state.headId = newNode.id;
    state.tailId = newNode.id;

    steps.push(
      step({
        stepNumber: 2,
        title: "Single Node Self-Loop",
        description: `List was empty: newNode.next points to itself, forming a single-node circular list.`,
        operation: "CLL Insert Head",
        actionType: "link",
        dataState: clone(state),
        highlights: { inserted: [newNode.id], active: [newNode.id] },
        pseudocodeLine: 2,
        variables: { Head: val, Next: "self" },
      })
    );
  } else {
    const oldHeadId = state.headId;
    const tailNode = state.nodes.find((n) => n.id === state.tailId)!;

    newNode.nextId = oldHeadId;
    tailNode.nextId = newNode.id; // Tail now wraps to newNode
    state.nodes.unshift(newNode);
    state.headId = newNode.id;

    steps.push(
      step({
        stepNumber: 2,
        title: "Rewire Tail to New Head",
        description: `Set newNode.next = oldHead, and update TAIL.next = newNode to maintain circularity.`,
        operation: "CLL Insert Head",
        actionType: "link",
        dataState: clone(state),
        highlights: { inserted: [newNode.id], active: [tailNode.id] },
        pseudocodeLine: 2,
        variables: { NewHead: val, TailNext: val },
      })
    );
  }

  steps.push(
    step({
      stepNumber: 3,
      title: "Head Insertion Complete",
      description: `Node ${val} is now the new HEAD. Tail continues to point to HEAD in O(1) time.`,
      operation: "CLL Insert Head",
      actionType: "insert",
      dataState: clone(state),
      highlights: { inserted: [newNode.id], success: [newNode.id] },
      pseudocodeLine: 3,
      variables: { Head: val },
    })
  );

  return steps;
}

// ----------------------------------------------------------------
// 3. CLL Insert Tail
// ----------------------------------------------------------------
export function generateCLLInsertTailSteps(initialData: number[], val: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = createCircularLinkedListNodes(initialData);
  const newNode: LinkedListNode = {
    id: uuidv4(),
    value: val,
    nextId: null,
  };

  steps.push(
    step({
      stepNumber: 1,
      title: "Create New Node",
      description: `Allocated new node with value ${val} to append at TAIL.`,
      operation: "CLL Insert Tail",
      actionType: "initialize",
      dataState: clone(state),
      highlights: {},
      pseudocodeLine: 1,
      variables: { Value: val },
    })
  );

  if (!state.headId) {
    newNode.nextId = newNode.id;
    state.nodes.push(newNode);
    state.headId = newNode.id;
    state.tailId = newNode.id;

    steps.push(
      step({
        stepNumber: 2,
        title: "Single Node Self-Loop",
        description: `List was empty: newNode becomes HEAD and TAIL with self-referencing next pointer.`,
        operation: "CLL Insert Tail",
        actionType: "link",
        dataState: clone(state),
        highlights: { inserted: [newNode.id] },
        pseudocodeLine: 2,
      })
    );
  } else {
    const headId = state.headId;
    const oldTailNode = state.nodes.find((n) => n.id === state.tailId)!;

    newNode.nextId = headId;
    oldTailNode.nextId = newNode.id;
    state.nodes.push(newNode);
    state.tailId = newNode.id;

    steps.push(
      step({
        stepNumber: 2,
        title: "Link Old Tail to New Node & Wrap to HEAD",
        description: `Set oldTail.next = newNode and newNode.next = HEAD.`,
        operation: "CLL Insert Tail",
        actionType: "link",
        dataState: clone(state),
        highlights: { inserted: [newNode.id], active: [oldTailNode.id] },
        pseudocodeLine: 2,
        variables: { NewTail: val, WrapToHead: true },
      })
    );
  }

  steps.push(
    step({
      stepNumber: 3,
      title: "Tail Insertion Complete",
      description: `Node ${val} is now TAIL. Next pointer loops back to HEAD. O(1) time.`,
      operation: "CLL Insert Tail",
      actionType: "insert",
      dataState: clone(state),
      highlights: { inserted: [newNode.id], success: [newNode.id] },
      pseudocodeLine: 3,
      variables: { Tail: val },
    })
  );

  return steps;
}

// ----------------------------------------------------------------
// 4. CLL Delete Head
// ----------------------------------------------------------------
export function generateCLLDeleteHeadSteps(initialData: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = createCircularLinkedListNodes(initialData);

  steps.push(
    step({
      stepNumber: 1,
      title: "Target Head for Deletion",
      description: state.headId
        ? `Targeting HEAD node for deletion in circular list.`
        : "List is empty.",
      operation: "CLL Delete Head",
      actionType: "initialize",
      dataState: clone(state),
      highlights: { active: state.headId ? [state.headId] : [] },
      pseudocodeLine: 1,
    })
  );

  if (!state.headId) return steps;

  const oldHeadId = state.headId;
  const oldHead = state.nodes.find((n) => n.id === oldHeadId)!;

  if (state.nodes.length === 1) {
    steps.push(
      step({
        stepNumber: 2,
        title: "Delete Only Node",
        description: `Removing single node ${oldHead.value}. List becomes empty.`,
        operation: "CLL Delete Head",
        actionType: "delete",
        dataState: clone(state),
        highlights: { deleted: [oldHeadId] },
        pseudocodeLine: 2,
      })
    );
    state.nodes = [];
    state.headId = null;
    state.tailId = null;
  } else {
    const newHeadId = oldHead.nextId!;
    const tailNode = state.nodes.find((n) => n.id === state.tailId)!;

    steps.push(
      step({
        stepNumber: 2,
        title: "Rewire Tail to New Head",
        description: `Unlinking HEAD (${oldHead.value}). Setting TAIL.next = head.next (${state.nodes[1].value}).`,
        operation: "CLL Delete Head",
        actionType: "delete",
        dataState: clone(state),
        highlights: { deleted: [oldHeadId], active: [tailNode.id] },
        pseudocodeLine: 2,
        variables: { NewHead: state.nodes[1].value },
      })
    );

    tailNode.nextId = newHeadId;
    state.nodes = state.nodes.filter((n) => n.id !== oldHeadId);
    state.headId = newHeadId;
  }

  steps.push(
    step({
      stepNumber: 3,
      title: "Head Deletion Complete",
      description: state.headId
        ? `New HEAD is active and TAIL successfully maintains circular reference.`
        : "List is now empty.",
      operation: "CLL Delete Head",
      actionType: "complete",
      dataState: clone(state),
      highlights: { active: state.headId ? [state.headId] : [] },
      pseudocodeLine: 3,
    })
  );

  return steps;
}
