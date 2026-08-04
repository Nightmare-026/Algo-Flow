import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { makeHighlights } from "@/visualizers/shared/highlights";

const clone = <T>(value: T): T => structuredClone(value);

function visualStep(input: Omit<VisualStep, "id">): VisualStep {
  return { id: uuidv4(), ...input, codeLine: input.codeLine ?? input.pseudocodeLine };
}

import { createLinkedListNodes, LinkedListNode, LinkedListVisualState } from "./types";

export function generateLinkedListTypesSteps(data: number[]): VisualStep[] {
  const state = createLinkedListNodes(data);
  const first = state.headId ? [state.headId] : [];
  const second = state.nodes[1] ? [state.nodes[1].id] : [];
  return [
    visualStep({
      stepNumber: 1,
      title: "Singly Linked List",
      description:
        "Each node stores a value and one next pointer. Traversal moves only forward from head.",
      operation: "Types",
      actionType: "initialize",
      dataState: clone(state),
      highlights: { active: first },
      variables: { pointersPerNode: 1 },
      pseudocodeLine: 1,
    }),
    visualStep({
      stepNumber: 2,
      title: "Doubly Linked List",
      description:
        "A doubly linked list adds a previous pointer, making backward traversal possible at the cost of more memory.",
      operation: "Types",
      actionType: "highlight",
      dataState: clone(state),
      highlights: { active: second, pointer: first },
      variables: { pointersPerNode: 2 },
      pseudocodeLine: 2,
    }),
    visualStep({
      stepNumber: 3,
      title: "Circular Linked List",
      description:
        "A circular list points the tail back to the head, so traversal wraps instead of ending at null.",
      operation: "Types",
      actionType: "link",
      dataState: clone(state),
      highlights: { active: state.nodes.at(-1) ? [state.nodes.at(-1)!.id] : [], pointer: first },
      variables: { tailNext: "head" },
      pseudocodeLine: 3,
    }),
  ];
}

export function generateSLLInsertPositionSteps(
  data: number[],
  value: number,
  index: number
): VisualStep[] {
  const initial = createLinkedListNodes(data);
  const state: LinkedListVisualState = { nodes: [...initial.nodes], headId: initial.headId };
  const steps: VisualStep[] = [];
  if (!Number.isInteger(index) || index < 0 || index > state.nodes.length) {
    throw new RangeError(`Position must be an integer between 0 and ${state.nodes.length}.`);
  }
  const targetIndex = index;
  let stepNumber = 1;

  steps.push(
    visualStep({
      stepNumber: stepNumber++,
      title: "Choose Insert Position",
      description: `Insert ${value} at valid position ${targetIndex}.`,
      operation: "Insert Position",
      actionType: "initialize",
      dataState: clone(state),
      highlights: {},
      variables: { requestedIndex: index, insertIndex: targetIndex, value },
      pseudocodeLine: 1,
    })
  );

  const newNode: LinkedListNode = { id: uuidv4(), value, nextId: null };
  state.nodes.push(newNode);
  steps.push(
    visualStep({
      stepNumber: stepNumber++,
      title: "Create New Node",
      description: `Create a detached node containing ${value}.`,
      operation: "Insert Position",
      actionType: "build",
      dataState: clone(state),
      highlights: { inserted: [newNode.id], active: [newNode.id] },
      variables: { value },
      pseudocodeLine: 2,
    })
  );

  if (targetIndex === 0) {
    newNode.nextId = state.headId;
    state.headId = newNode.id;
    steps.push(
      visualStep({
        stepNumber: stepNumber++,
        title: "Insert Before Head",
        description: "New node points to the old head, then head moves to the new node.",
        operation: "Insert Position",
        actionType: "set-pointer",
        dataState: clone(state),
        highlights: { active: [newNode.id], pointer: newNode.nextId ? [newNode.nextId] : [] },
        variables: { head: value },
        pseudocodeLine: 4,
      })
    );
  } else {
    let previousId = state.headId;
    for (let i = 0; i < targetIndex - 1 && previousId; i++) {
      const previous = state.nodes.find((node) => node.id === previousId);
      steps.push(
        visualStep({
          stepNumber: stepNumber++,
          title: `Traverse to Node ${i}`,
          description: `Move through node ${previous?.value} while searching for the node before the insertion point.`,
          operation: "Insert Position",
          actionType: "visit",
          dataState: clone(state),
          highlights: { active: previousId ? [previousId] : [] },
          variables: { i, insertIndex: targetIndex },
          pseudocodeLine: 5,
        })
      );
      previousId = previous?.nextId ?? null;
    }

    const previous = state.nodes.find((node) => node.id === previousId);
    if (previous) {
      newNode.nextId = previous.nextId;
      previous.nextId = newNode.id;
      steps.push(
        visualStep({
          stepNumber: stepNumber++,
          title: "Reconnect Pointers",
          description:
            "Previous node now points to the new node, and the new node points to the old next node.",
          operation: "Insert Position",
          actionType: "link",
          dataState: clone(state),
          highlights: { active: [newNode.id], pointer: [previous.id] },
          variables: { previous: previous.value, inserted: value },
          pseudocodeLine: 7,
        })
      );
    }
  }

  steps.push(
    visualStep({
      stepNumber: stepNumber,
      title: "Insertion Complete",
      description: `${value} is now part of the linked list at position ${targetIndex}.`,
      operation: "Insert Position",
      actionType: "complete",
      dataState: clone(state),
      highlights: { sorted: [newNode.id] },
      pseudocodeLine: 8,
    })
  );

  return steps;
}

export function generateSLLDeleteHeadSteps(data: number[]): VisualStep[] {
  const state = createLinkedListNodes(data);
  const steps: VisualStep[] = [
    visualStep({
      stepNumber: 1,
      title: "Check Head",
      description: "Deleting the head starts by checking whether the list is empty.",
      operation: "Delete Head",
      actionType: "initialize",
      dataState: clone(state),
      highlights: { active: state.headId ? [state.headId] : [] },
      variables: { head: state.headId ? "set" : "null" },
      pseudocodeLine: 1,
    }),
  ];

  if (!state.headId) {
    steps.push(
      visualStep({
        stepNumber: 2,
        title: "List Empty",
        description: "There is no head node to remove.",
        operation: "Delete Head",
        actionType: "underflow",
        dataState: clone(state),
        highlights: {},
        pseudocodeLine: 2,
      })
    );
    return steps;
  }

  const oldHead = state.nodes.find((node) => node.id === state.headId)!;
  state.headId = oldHead.nextId;
  const removalState = clone(state);
  state.nodes = state.nodes.filter((node) => node.id !== oldHead.id);
  steps.push(
    visualStep({
      stepNumber: 2,
      title: "Move Head Pointer",
      description: `Head moves from ${oldHead.value} to the next node, removing the old head from the chain.`,
      operation: "Delete Head",
      actionType: "delete",
      dataState: removalState,
      highlights: { deleted: [oldHead.id], active: state.headId ? [state.headId] : [] },
      variables: { removed: oldHead.value, newHead: state.headId ? "next" : "null" },
      pseudocodeLine: 4,
    })
  );
  steps.push(
    visualStep({
      stepNumber: 3,
      title: "Deletion Complete",
      description: "The old head is no longer reachable from the list.",
      operation: "Delete Head",
      actionType: "complete",
      dataState: clone(state),
      highlights: {},
      pseudocodeLine: 5,
    })
  );
  return steps;
}

export function generateSLLReverseSteps(data: number[]): VisualStep[] {
  const initial = createLinkedListNodes(data);
  const state: LinkedListVisualState = { nodes: [...initial.nodes], headId: initial.headId };
  const steps: VisualStep[] = [];
  let prevId: string | null = null;
  let currentId = state.headId;
  let stepNumber = 1;

  steps.push(
    visualStep({
      stepNumber: stepNumber++,
      title: "Initialize Three Pointers",
      description: "Use previous, current, and next pointers to reverse links one at a time.",
      operation: "Reverse",
      actionType: "initialize",
      dataState: clone(state),
      highlights: { active: currentId ? [currentId] : [] },
      variables: { prev: "null", current: currentId ? "head" : "null" },
      pseudocodeLine: 1,
    })
  );

  while (currentId) {
    const current = state.nodes.find((node) => node.id === currentId)!;
    const nextId = current.nextId;
    steps.push(
      visualStep({
        stepNumber: stepNumber++,
        title: `Reverse Link at ${current.value}`,
        description: `Store next, then point ${current.value}'s next pointer back to previous.`,
        operation: "Reverse",
        actionType: "set-pointer",
        dataState: clone(state),
        highlights: { active: [current.id], pointer: prevId ? [prevId] : [] },
        variables: {
          current: current.value,
          next: nextId ? "node" : "null",
          prev: prevId ? "node" : "null",
        },
        pseudocodeLine: 4,
      })
    );
    current.nextId = prevId;
    steps.push(
      visualStep({
        stepNumber: stepNumber++,
        title: "Move Pointers Forward",
        description: "Previous becomes current, and current advances to the saved next node.",
        operation: "Reverse",
        actionType: "move-pointer",
        dataState: clone(state),
        highlights: { active: [current.id], sorted: prevId ? [prevId] : [] },
        variables: { prev: current.value, current: nextId ? "next" : "null" },
        pseudocodeLine: 5,
      })
    );
    prevId = current.id;
    currentId = nextId;
  }

  state.headId = prevId;
  steps.push(
    visualStep({
      stepNumber: stepNumber,
      title: "Update Head",
      description: "When current becomes null, previous is the new head of the reversed list.",
      operation: "Reverse",
      actionType: "complete",
      dataState: clone(state),
      highlights: { active: state.headId ? [state.headId] : [] },
      variables: { newHead: state.headId ? "previous" : "null" },
      pseudocodeLine: 7,
    })
  );
  return steps;
}

export function generateSLLDetectCycleSteps(data: number[]): VisualStep[] {
  const state = createLinkedListNodes(data);
  if (state.nodes.length > 3) {
    state.nodes[state.nodes.length - 1].nextId = state.nodes[1].id;
  }
  const steps: VisualStep[] = [];
  let slow = state.headId;
  let fast = state.headId;
  let stepNumber = 1;
  const hasCycle = state.nodes.length > 3;

  steps.push(
    visualStep({
      stepNumber: stepNumber++,
      title: "Start Slow and Fast Pointers",
      description: hasCycle
        ? "This sample links the tail back into the list so Floyd's cycle detection can meet."
        : "The list is too short for the sample cycle, so traversal will end.",
      operation: "Detect Cycle",
      actionType: "initialize",
      dataState: clone(state),
      highlights: { active: slow ? [slow] : [] },
      variables: { slow: "head", fast: "head" },
      pseudocodeLine: 1,
    })
  );

  for (let guard = 0; guard < state.nodes.length + 2 && fast; guard++) {
    const slowNode = slow ? state.nodes.find((node) => node.id === slow) : null;
    const fastNode = fast ? state.nodes.find((node) => node.id === fast) : null;
    const nextFast = fastNode?.nextId
      ? (state.nodes.find((node) => node.id === fastNode.nextId)?.nextId ?? null)
      : null;
    slow = slowNode?.nextId ?? null;
    fast = nextFast;
    const pointerIds = [slow, fast].filter(Boolean) as string[];

    steps.push(
      visualStep({
        stepNumber: stepNumber++,
        title: "Move Slow and Fast",
        description: "Slow moves one node; fast moves two nodes. If they meet, a cycle exists.",
        operation: "Detect Cycle",
        actionType: "move-pointer",
        dataState: clone(state),
        highlights: makeHighlights({
          active: pointerIds,
          compared: pointerIds,
        }),
        variables: { slow: slow ? "node" : "null", fast: fast ? "node" : "null" },
        pseudocodeLine: 4,
      })
    );

    if (slow && fast && slow === fast) {
      steps.push(
        visualStep({
          stepNumber: stepNumber,
          title: "Cycle Detected",
          description: "Slow and fast pointers met at the same node, proving a cycle exists.",
          operation: "Detect Cycle",
          actionType: "found",
          dataState: clone(state),
          highlights: { found: [slow] },
          variables: { cycle: true },
          pseudocodeLine: 5,
        })
      );
      return steps;
    }
  }

  steps.push(
    visualStep({
      stepNumber,
      title: "No Cycle",
      description: "Fast reached null, so the list has no cycle.",
      operation: "Detect Cycle",
      actionType: "not-found",
      dataState: clone(state),
      highlights: {},
      variables: { cycle: false },
      pseudocodeLine: 7,
    })
  );
  return steps;
}
