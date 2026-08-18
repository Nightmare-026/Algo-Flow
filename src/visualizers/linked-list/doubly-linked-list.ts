import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import {
  DoublyLinkedListNode,
  createDoublyLinkedListNodes,
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
// 1. DLL Traversal (Forward & Backward)
// ----------------------------------------------------------------
export function generateDLLTraversalSteps(initialData: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = createDoublyLinkedListNodes(initialData);

  steps.push(
    step({
      stepNumber: 1,
      title: "Initialize Doubly Linked List Traversal",
      description: "Start forward traversal from HEAD towards TAIL using next pointers.",
      operation: "DLL Traversal",
      actionType: "initialize",
      dataState: clone(state),
      highlights: {},
      pseudocodeLine: 1,
      variables: {
        Direction: "Forward",
        Head: state.headId ? state.headId.substring(0, 4) : "null",
      },
    })
  );

  if (!state.headId) {
    steps.push(
      step({
        stepNumber: 2,
        title: "List Empty",
        description: "The doubly linked list is empty. Nothing to traverse.",
        operation: "DLL Traversal",
        actionType: "complete",
        dataState: clone(state),
        highlights: {},
        pseudocodeLine: 2,
      })
    );
    return steps;
  }

  let stepNum = 2;
  const visitedForward: string[] = [];
  let currId: string | null = state.headId;

  // Forward pass
  while (currId) {
    const node = state.nodes.find((n) => n.id === currId);
    if (!node) break;
    visitedForward.push(currId);

    steps.push(
      step({
        stepNumber: stepNum++,
        title: `Forward: Visit Node (${node.value})`,
        description: `Visiting node with value ${node.value} (prev: ${node.prevId ? "Node" : "null"}, next: ${node.nextId ? "Node" : "null"}).`,
        operation: "DLL Traversal",
        actionType: "visit",
        dataState: clone(state),
        highlights: { active: [currId], visited: [...visitedForward] },
        pseudocodeLine: 3,
        variables: {
          Current: node.value,
          Direction: "Forward",
        },
      })
    );

    currId = node.nextId;
    if (currId) {
      steps.push(
        step({
          stepNumber: stepNum++,
          title: "Follow Next Pointer",
          description: "Moving current pointer to next node using next reference.",
          operation: "DLL Traversal",
          actionType: "move-pointer",
          dataState: clone(state),
          highlights: { pointer: [currId], visited: [...visitedForward] },
          pseudocodeLine: 4,
          variables: { Direction: "Forward" },
        })
      );
    }
  }

  // Backward pass from TAIL
  let backId: string | null = state.tailId;
  const visitedBackward: string[] = [];

  steps.push(
    step({
      stepNumber: stepNum++,
      title: "Begin Backward Traversal",
      description: "Now traverse backward from TAIL towards HEAD using prev pointers.",
      operation: "DLL Traversal",
      actionType: "highlight",
      dataState: clone(state),
      highlights: { active: backId ? [backId] : [] },
      pseudocodeLine: 5,
      variables: {
        Direction: "Backward",
        Tail: backId ? backId.substring(0, 4) : "null",
      },
    })
  );

  while (backId) {
    const node = state.nodes.find((n) => n.id === backId);
    if (!node) break;
    visitedBackward.push(backId);

    steps.push(
      step({
        stepNumber: stepNum++,
        title: `Backward: Visit Node (${node.value})`,
        description: `Inspecting node ${node.value} using prev reference.`,
        operation: "DLL Traversal",
        actionType: "visit",
        dataState: clone(state),
        highlights: { active: [backId], visited: [...visitedBackward] },
        pseudocodeLine: 6,
        variables: {
          Current: node.value,
          Direction: "Backward",
        },
      })
    );

    backId = node.prevId;
    if (backId) {
      steps.push(
        step({
          stepNumber: stepNum++,
          title: "Follow Prev Pointer",
          description: "Moving backward to previous node using prev reference.",
          operation: "DLL Traversal",
          actionType: "move-pointer",
          dataState: clone(state),
          highlights: { pointer: [backId], visited: [...visitedBackward] },
          pseudocodeLine: 7,
          variables: { Direction: "Backward" },
        })
      );
    }
  }

  steps.push(
    step({
      stepNumber: stepNum,
      title: "DLL Traversal Complete",
      description: "Bidirectional traversal completed in O(N) time with O(1) auxiliary space.",
      operation: "DLL Traversal",
      actionType: "complete",
      dataState: clone(state),
      highlights: { active: [] },
      pseudocodeLine: 8,
    })
  );

  return steps;
}

// ----------------------------------------------------------------
// 2. DLL Insert Head
// ----------------------------------------------------------------
export function generateDLLInsertHeadSteps(initialData: number[], val: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = createDoublyLinkedListNodes(initialData);
  const newNode: DoublyLinkedListNode = {
    id: uuidv4(),
    value: val,
    prevId: null,
    nextId: null,
  };

  steps.push(
    step({
      stepNumber: 1,
      title: "Create New Node",
      description: `Allocated new node with value ${val} (prev=null, next=null).`,
      operation: "DLL Insert Head",
      actionType: "initialize",
      dataState: clone(state),
      highlights: {},
      pseudocodeLine: 1,
      variables: { Value: val },
    })
  );

  const oldHeadId = state.headId;
  newNode.nextId = oldHeadId;
  state.nodes.unshift(newNode);
  state.headId = newNode.id;

  if (oldHeadId) {
    const oldHead = state.nodes.find((n) => n.id === oldHeadId);
    if (oldHead) oldHead.prevId = newNode.id;
  } else {
    state.tailId = newNode.id;
  }

  steps.push(
    step({
      stepNumber: 2,
      title: "Link Pointers",
      description: oldHeadId
        ? `Set newNode.next = oldHead and oldHead.prev = newNode.`
        : `List was empty: newNode becomes both HEAD and TAIL.`,
      operation: "DLL Insert Head",
      actionType: "link",
      dataState: clone(state),
      highlights: { inserted: [newNode.id], active: oldHeadId ? [oldHeadId] : [] },
      pseudocodeLine: 2,
      variables: {
        Head: newNode.value,
        Tail: state.nodes.find((n) => n.id === state.tailId)?.value ?? val,
      },
    })
  );

  steps.push(
    step({
      stepNumber: 3,
      title: "Update Head Pointer",
      description: `Set HEAD = newNode. New node ${val} is now the first element.`,
      operation: "DLL Insert Head",
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
// 3. DLL Insert Tail
// ----------------------------------------------------------------
export function generateDLLInsertTailSteps(initialData: number[], val: number): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = createDoublyLinkedListNodes(initialData);
  const newNode: DoublyLinkedListNode = {
    id: uuidv4(),
    value: val,
    prevId: null,
    nextId: null,
  };

  steps.push(
    step({
      stepNumber: 1,
      title: "Create New Node",
      description: `Created new node with value ${val}.`,
      operation: "DLL Insert Tail",
      actionType: "initialize",
      dataState: clone(state),
      highlights: {},
      pseudocodeLine: 1,
      variables: { Value: val },
    })
  );

  const oldTailId = state.tailId;
  if (!oldTailId) {
    state.nodes.push(newNode);
    state.headId = newNode.id;
    state.tailId = newNode.id;
  } else {
    newNode.prevId = oldTailId;
    const oldTail = state.nodes.find((n) => n.id === oldTailId);
    if (oldTail) oldTail.nextId = newNode.id;
    state.nodes.push(newNode);
    state.tailId = newNode.id;
  }

  steps.push(
    step({
      stepNumber: 2,
      title: "Link Tail References",
      description: oldTailId
        ? `Set oldTail.next = newNode and newNode.prev = oldTail.`
        : `List was empty: newNode becomes HEAD and TAIL.`,
      operation: "DLL Insert Tail",
      actionType: "link",
      dataState: clone(state),
      highlights: { inserted: [newNode.id], active: oldTailId ? [oldTailId] : [] },
      pseudocodeLine: 2,
      variables: { NewTail: val },
    })
  );

  steps.push(
    step({
      stepNumber: 3,
      title: "Update TAIL Pointer",
      description: `Set TAIL = newNode. Node ${val} is now successfully appended in O(1) time.`,
      operation: "DLL Insert Tail",
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
// 4. DLL Delete Head
// ----------------------------------------------------------------
export function generateDLLDeleteHeadSteps(initialData: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = createDoublyLinkedListNodes(initialData);

  steps.push(
    step({
      stepNumber: 1,
      title: "Identify Head Node",
      description: state.headId
        ? `Targeting HEAD node for deletion.`
        : `List is empty: nothing to delete.`,
      operation: "DLL Delete Head",
      actionType: "initialize",
      dataState: clone(state),
      highlights: { active: state.headId ? [state.headId] : [] },
      pseudocodeLine: 1,
    })
  );

  if (!state.headId) return steps;

  const oldHeadId = state.headId;
  const oldHead = state.nodes.find((n) => n.id === oldHeadId)!;
  const newHeadId = oldHead.nextId;

  steps.push(
    step({
      stepNumber: 2,
      title: `Unlink Head (${oldHead.value})`,
      description: `Unlinking HEAD node ${oldHead.value}. Updating new head prev to null.`,
      operation: "DLL Delete Head",
      actionType: "delete",
      dataState: clone(state),
      highlights: { deleted: [oldHeadId] },
      pseudocodeLine: 2,
      variables: { Removing: oldHead.value },
    })
  );

  state.nodes = state.nodes.filter((n) => n.id !== oldHeadId);
  state.headId = newHeadId;

  if (newHeadId) {
    const newHead = state.nodes.find((n) => n.id === newHeadId);
    if (newHead) newHead.prevId = null;
  } else {
    state.tailId = null;
  }

  steps.push(
    step({
      stepNumber: 3,
      title: "Head Deletion Complete",
      description: newHeadId
        ? `New HEAD is node ${state.nodes[0].value}. Operation finished in O(1).`
        : `List is now empty.`,
      operation: "DLL Delete Head",
      actionType: "complete",
      dataState: clone(state),
      highlights: { active: state.headId ? [state.headId] : [] },
      pseudocodeLine: 3,
    })
  );

  return steps;
}

// ----------------------------------------------------------------
// 5. DLL Delete Tail
// ----------------------------------------------------------------
export function generateDLLDeleteTailSteps(initialData: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = createDoublyLinkedListNodes(initialData);

  steps.push(
    step({
      stepNumber: 1,
      title: "Identify Tail Node",
      description: state.tailId
        ? `Targeting TAIL node for deletion in O(1) using tail reference.`
        : `List is empty.`,
      operation: "DLL Delete Tail",
      actionType: "initialize",
      dataState: clone(state),
      highlights: { active: state.tailId ? [state.tailId] : [] },
      pseudocodeLine: 1,
    })
  );

  if (!state.tailId) return steps;

  const oldTailId = state.tailId;
  const oldTail = state.nodes.find((n) => n.id === oldTailId)!;
  const newTailId = oldTail.prevId;

  steps.push(
    step({
      stepNumber: 2,
      title: `Unlink Tail (${oldTail.value})`,
      description: `Unlinking TAIL node ${oldTail.value} and setting newTail.next = null.`,
      operation: "DLL Delete Tail",
      actionType: "delete",
      dataState: clone(state),
      highlights: { deleted: [oldTailId] },
      pseudocodeLine: 2,
      variables: { Removing: oldTail.value },
    })
  );

  state.nodes = state.nodes.filter((n) => n.id !== oldTailId);
  state.tailId = newTailId;

  if (newTailId) {
    const newTail = state.nodes.find((n) => n.id === newTailId);
    if (newTail) newTail.nextId = null;
  } else {
    state.headId = null;
  }

  steps.push(
    step({
      stepNumber: 3,
      title: "Tail Deletion Complete",
      description: newTailId
        ? `New TAIL is node ${state.nodes[state.nodes.length - 1].value}. O(1) time.`
        : `List is now empty.`,
      operation: "DLL Delete Tail",
      actionType: "complete",
      dataState: clone(state),
      highlights: { active: state.tailId ? [state.tailId] : [] },
      pseudocodeLine: 3,
    })
  );

  return steps;
}

// ----------------------------------------------------------------
// 6. DLL Reverse
// ----------------------------------------------------------------
export function generateDLLReverseSteps(initialData: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = createDoublyLinkedListNodes(initialData);

  steps.push(
    step({
      stepNumber: 1,
      title: "Initialize DLL Reversal",
      description: "Reversing a DLL requires swapping prev and next pointers of every node.",
      operation: "DLL Reverse",
      actionType: "initialize",
      dataState: clone(state),
      highlights: {},
      pseudocodeLine: 1,
      variables: { Pointers: "Swap prev and next" },
    })
  );

  if (state.nodes.length <= 1) {
    steps.push(
      step({
        stepNumber: 2,
        title: "Reversal Complete",
        description: "List has 0 or 1 element: already reversed.",
        operation: "DLL Reverse",
        actionType: "complete",
        dataState: clone(state),
        highlights: {},
        pseudocodeLine: 2,
      })
    );
    return steps;
  }

  let stepNum = 2;
  let currId: string | null = state.headId;
  const oldHeadId = state.headId;
  const oldTailId = state.tailId;

  while (currId) {
    const node = state.nodes.find((n) => n.id === currId);
    if (!node) break;

    const origPrev = node.prevId;
    const origNext = node.nextId;

    // Swap pointers
    node.prevId = origNext;
    node.nextId = origPrev;

    steps.push(
      step({
        stepNumber: stepNum++,
        title: `Swap Pointers for Node (${node.value})`,
        description: `Swapped prev and next pointers for node ${node.value}.`,
        operation: "DLL Reverse",
        actionType: "swap",
        dataState: clone(state),
        highlights: { swapped: [node.id], active: [node.id] },
        pseudocodeLine: 3,
        variables: {
          Current: node.value,
          NewNext: origPrev ? "PrevNode" : "null",
          NewPrev: origNext ? "NextNode" : "null",
        },
      })
    );

    currId = origNext;
  }

  // Swap head and tail pointers
  state.headId = oldTailId;
  state.tailId = oldHeadId;

  steps.push(
    step({
      stepNumber: stepNum,
      title: "Swap HEAD and TAIL",
      description:
        "HEAD and TAIL pointers are swapped. The doubly linked list is now completely reversed in O(N) time.",
      operation: "DLL Reverse",
      actionType: "complete",
      dataState: clone(state),
      highlights: { sorted: state.nodes.map((n) => n.id) },
      pseudocodeLine: 4,
      variables: {
        NewHead: state.nodes.find((n) => n.id === state.headId)?.value ?? "null",
        NewTail: state.nodes.find((n) => n.id === state.tailId)?.value ?? "null",
      },
    })
  );

  return steps;
}
