import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { createLinkedListNodes } from "./types";

const clone = <T>(v: T): T => structuredClone(v);

function step(input: Omit<VisualStep, "id">): VisualStep {
  return {
    id: uuidv4(),
    ...input,
    codeLine: input.codeLine ?? input.pseudocodeLine,
  };
}

// ----------------------------------------------------------------
// 1. SLL Delete Tail
// ----------------------------------------------------------------
export function generateSLLDeleteTailSteps(initialData: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = createLinkedListNodes(initialData);

  steps.push(
    step({
      stepNumber: 1,
      title: "Initialize Delete Tail",
      description: "Traverse list to find second-to-last node and unlink tail.",
      operation: "SLL Delete Tail",
      actionType: "initialize",
      dataState: clone(state),
      highlights: {},
      pseudocodeLine: 1,
    })
  );

  if (!state.headId) {
    steps.push(
      step({
        stepNumber: 2,
        title: "List Empty",
        description: "List is empty, nothing to delete.",
        operation: "SLL Delete Tail",
        actionType: "complete",
        dataState: clone(state),
        highlights: {},
        pseudocodeLine: 2,
      })
    );
    return steps;
  }

  if (state.nodes.length === 1) {
    const onlyNodeId = state.headId;
    steps.push(
      step({
        stepNumber: 2,
        title: "Delete Only Node",
        description: `Removing single node ${state.nodes[0].value}.`,
        operation: "SLL Delete Tail",
        actionType: "delete",
        dataState: clone(state),
        highlights: { deleted: [onlyNodeId] },
        pseudocodeLine: 3,
      })
    );
    state.nodes = [];
    state.headId = null;
    steps.push(
      step({
        stepNumber: 3,
        title: "List Now Empty",
        description: "Tail removed. List is now empty.",
        operation: "SLL Delete Tail",
        actionType: "complete",
        dataState: clone(state),
        highlights: {},
        pseudocodeLine: 4,
      })
    );
    return steps;
  }

  let stepNum = 2;
  let currId: string = state.headId;
  const visited: string[] = [];

  while (currId) {
    const currNode = state.nodes.find((n) => n.id === currId)!;
    visited.push(currId);

    const nextNode = state.nodes.find((n) => n.id === currNode.nextId);
    if (nextNode && nextNode.nextId === null) {
      // currNode is second to last!
      steps.push(
        step({
          stepNumber: stepNum++,
          title: `Found Second-to-Last Node (${currNode.value})`,
          description: `Node ${currNode.value} precedes tail node ${nextNode.value}. Setting curr.next = null.`,
          operation: "SLL Delete Tail",
          actionType: "visit",
          dataState: clone(state),
          highlights: { active: [currId], pointer: [nextNode.id], visited: [...visited] },
          pseudocodeLine: 5,
          variables: { PrevToTail: currNode.value, Tail: nextNode.value },
        })
      );

      steps.push(
        step({
          stepNumber: stepNum++,
          title: `Unlink Tail (${nextNode.value})`,
          description: `Unlinked node ${nextNode.value} by setting node ${currNode.value}.next = null.`,
          operation: "SLL Delete Tail",
          actionType: "delete",
          dataState: clone(state),
          highlights: { deleted: [nextNode.id] },
          pseudocodeLine: 6,
        })
      );

      currNode.nextId = null;
      state.nodes = state.nodes.filter((n) => n.id !== nextNode.id);
      break;
    }

    steps.push(
      step({
        stepNumber: stepNum++,
        title: `Traverse Node (${currNode.value})`,
        description: `Inspecting node ${currNode.value}...`,
        operation: "SLL Delete Tail",
        actionType: "move-pointer",
        dataState: clone(state),
        highlights: { active: [currId], visited: [...visited] },
        pseudocodeLine: 7,
      })
    );

    currId = currNode.nextId!;
  }

  steps.push(
    step({
      stepNumber: stepNum,
      title: "Tail Deletion Complete",
      description: "Successfully removed tail node. Operation completed in O(N) time.",
      operation: "SLL Delete Tail",
      actionType: "complete",
      dataState: clone(state),
      highlights: {
        active: state.nodes.length > 0 ? [state.nodes[state.nodes.length - 1].id] : [],
      },
      pseudocodeLine: 7,
    })
  );

  return steps;
}

// ----------------------------------------------------------------
// 2. SLL Find Middle (Tortoise & Hare)
// ----------------------------------------------------------------
export function generateSLLFindMiddleSteps(initialData: number[]): VisualStep[] {
  const steps: VisualStep[] = [];
  const state = createLinkedListNodes(initialData);

  steps.push(
    step({
      stepNumber: 1,
      title: "Initialize Two Pointers",
      description:
        "Initialize Slow pointer (moves 1 step) and Fast pointer (moves 2 steps) at HEAD.",
      operation: "Find Middle",
      actionType: "initialize",
      dataState: clone(state),
      highlights: {},
      pseudocodeLine: 1,
      variables: {
        Slow: state.headId ? state.nodes[0].value : "null",
        Fast: state.headId ? state.nodes[0].value : "null",
      },
    })
  );

  if (!state.headId) {
    steps.push(
      step({
        stepNumber: 2,
        title: "List Empty",
        description: "Empty list has no middle element.",
        operation: "Find Middle",
        actionType: "complete",
        dataState: clone(state),
        highlights: {},
        pseudocodeLine: 2,
      })
    );
    return steps;
  }

  let slowId: string | null = state.headId;
  let fastId: string | null = state.headId;
  let stepNum = 2;

  while (fastId) {
    const fastNode = state.nodes.find((n) => n.id === fastId);
    if (!fastNode || !fastNode.nextId) break;

    const slowNode = state.nodes.find((n) => n.id === slowId)!;

    steps.push(
      step({
        stepNumber: stepNum++,
        title: "Pointer Positions",
        description: `Slow is at node ${slowNode.value}, Fast is at node ${fastNode.value}. Fast can advance 2 steps.`,
        operation: "Find Middle",
        actionType: "visit",
        dataState: clone(state),
        highlights: { active: [slowId!], pointer: [fastId] },
        pseudocodeLine: 3,
        variables: { Slow: slowNode.value, Fast: fastNode.value },
      })
    );

    // Advance slow by 1
    slowId = slowNode.nextId!;
    // Advance fast by 2
    const fastNextNode = state.nodes.find((n) => n.id === fastNode.nextId)!;
    fastId = fastNextNode.nextId;

    const newSlowNode = state.nodes.find((n) => n.id === slowId)!;
    const newFastVal = fastId
      ? (state.nodes.find((n) => n.id === fastId)?.value ?? "null")
      : "null";

    steps.push(
      step({
        stepNumber: stepNum++,
        title: "Advance Slow by 1 and Fast by 2",
        description: `Advanced Slow to ${newSlowNode.value}, Fast to ${newFastVal}.`,
        operation: "Find Middle",
        actionType: "move-pointer",
        dataState: clone(state),
        highlights: { active: [slowId], pointer: fastId ? [fastId] : [] },
        pseudocodeLine: 4,
        variables: { Slow: newSlowNode.value, Fast: newFastVal },
      })
    );
  }

  const middleNode = state.nodes.find((n) => n.id === slowId)!;

  steps.push(
    step({
      stepNumber: stepNum,
      title: `Middle Found: ${middleNode.value}`,
      description: `Fast reached the end of the list. Slow is at the middle node with value ${middleNode.value}. Finished in O(N) time with O(1) space.`,
      operation: "Find Middle",
      actionType: "complete",
      dataState: clone(state),
      highlights: { found: [middleNode.id] },
      pseudocodeLine: 5,
      variables: { Middle: middleNode.value },
    })
  );

  return steps;
}

// ----------------------------------------------------------------
// 3. SLL Remove Duplicates (from sorted list)
// ----------------------------------------------------------------
export function generateSLLRemoveDuplicatesSteps(initialData: number[]): VisualStep[] {
  // Sort input first to represent sorted linked list
  const sorted = [...initialData].sort((a, b) => a - b);
  const steps: VisualStep[] = [];
  const state = createLinkedListNodes(sorted);

  steps.push(
    step({
      stepNumber: 1,
      title: "Initialize Remove Duplicates",
      description: "Traverse sorted linked list and compare each node with its next neighbor.",
      operation: "Remove Duplicates",
      actionType: "initialize",
      dataState: clone(state),
      highlights: {},
      pseudocodeLine: 1,
    })
  );

  if (!state.headId || state.nodes.length <= 1) {
    steps.push(
      step({
        stepNumber: 2,
        title: "No Duplicates Possible",
        description: "List has 0 or 1 element: no duplicates exist.",
        operation: "Remove Duplicates",
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

  while (currId) {
    const currNode = state.nodes.find((n) => n.id === currId);
    if (!currNode || !currNode.nextId) break;

    const nextNode = state.nodes.find((n) => n.id === currNode.nextId);
    if (!nextNode) break;

    steps.push(
      step({
        stepNumber: stepNum++,
        title: `Compare Nodes (${currNode.value} vs ${nextNode.value})`,
        description: `Comparing current node (${currNode.value}) with next node (${nextNode.value}).`,
        operation: "Remove Duplicates",
        actionType: "compare",
        dataState: clone(state),
        highlights: { compared: [currNode.id, nextNode.id], active: [currNode.id] },
        pseudocodeLine: 3,
        variables: { Current: currNode.value, Next: nextNode.value },
      })
    );

    if (currNode.value === nextNode.value) {
      // Duplicate found!
      steps.push(
        step({
          stepNumber: stepNum++,
          title: `Duplicate Detected: ${nextNode.value}`,
          description: `Duplicate value ${nextNode.value} detected. Unlinking next node.`,
          operation: "Remove Duplicates",
          actionType: "delete",
          dataState: clone(state),
          highlights: { deleted: [nextNode.id], active: [currNode.id] },
          pseudocodeLine: 4,
        })
      );

      currNode.nextId = nextNode.nextId;
      state.nodes = state.nodes.filter((n) => n.id !== nextNode.id);
      // Stay on currNode to check if next is also a duplicate
    } else {
      currId = currNode.nextId;
      if (currId) {
        steps.push(
          step({
            stepNumber: stepNum++,
            title: "Move to Next Unique Node",
            description: `Values differ. Moving current pointer to node ${state.nodes.find((n) => n.id === currId)?.value}.`,
            operation: "Remove Duplicates",
            actionType: "move-pointer",
            dataState: clone(state),
            highlights: { active: [currId] },
            pseudocodeLine: 5,
          })
        );
      }
    }
  }

  steps.push(
    step({
      stepNumber: stepNum,
      title: "All Duplicates Removed",
      description:
        "All consecutive duplicate values have been purged in O(N) time with O(1) auxiliary space.",
      operation: "Remove Duplicates",
      actionType: "complete",
      dataState: clone(state),
      highlights: { sorted: state.nodes.map((n) => n.id) },
      pseudocodeLine: 6,
    })
  );

  return steps;
}
