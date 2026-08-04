import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { TreeVisualState, TreeNodeData, createCompleteTreeFromArr } from "./types";
function findPathToNode(root: TreeNodeData | null, targetId: string): number[] {
  if (!root) return [];
  if (root.id === targetId) return [root.value];

  const leftPath = findPathToNode(root.left, targetId);
  if (leftPath.length > 0) return [root.value, ...leftPath];

  const rightPath = findPathToNode(root.right, targetId);
  return rightPath.length > 0 ? [root.value, ...rightPath] : [];
}

function decorateTraversalSteps(
  steps: VisualStep[],
  root: TreeNodeData | null,
  traversalName: string,
  traversalMode: "recursive" | "queue"
): VisualStep[] {
  const completeLine = traversalMode === "recursive" ? 6 : 9;
  const completedSteps =
    steps.at(-1)?.actionType === "complete"
      ? steps
      : [
          ...steps,
          {
            id: uuidv4(),
            stepNumber: steps.length + 1,
            title: "Traversal Complete",
            description: `${traversalName} traversal is complete.`,
            operation: "Traversal",
            actionType: "complete" as const,
            dataState: { root: structuredClone(root) },
            highlights: {},
            codeLine: 8,
            pseudocodeLine: completeLine,
          },
        ];

  const output: number[] = [];
  const visitedIds: string[] = [];

  return completedSteps.map((step) => {
    const currentId = step.highlights.active?.[0];
    const currentValue =
      typeof step.variables?.Current === "number" ? step.variables.Current : undefined;

    if (step.actionType === "visit" && currentValue !== undefined && currentId) {
      output.push(currentValue);
      if (!visitedIds.includes(currentId)) visitedIds.push(currentId);
    }

    const isComplete = step.actionType === "complete";
    const callStack =
      traversalMode === "recursive" && currentId && !isComplete
        ? findPathToNode(root, currentId)
        : [];
    const committedOutput = [...output];

    return {
      ...step,
      description: isComplete
        ? `${traversalName} traversal is complete: ${committedOutput.join(" ? ") || "empty"}.`
        : step.description,
      dataState: {
        root: structuredClone(root),
        traversalOutput: committedOutput,
        callStack,
        traversalMode,
      } satisfies TreeVisualState,
      highlights: {
        ...step.highlights,
        visited: [...visitedIds],
        ...(isComplete ? { success: [...visitedIds] } : {}),
      },
      variables: {
        ...step.variables,
        output: committedOutput.join(", ") || "empty",
        ...(traversalMode === "recursive"
          ? { callStack: callStack.join(" ? ") || "empty" }
          : {}),
      },
      output: committedOutput,
      pseudocodeLine: isComplete ? completeLine : step.pseudocodeLine,
    };
  });
}

export function generateTreeInorderSteps(
  initialData: number[],
  customTree?: TreeVisualState
): VisualStep[] {
  const steps: VisualStep[] = [];
  const root = customTree
    ? structuredClone(customTree.root)
    : createCompleteTreeFromArr(initialData);
  const currentState: TreeVisualState = { root: structuredClone(root) };

  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Inorder Traversal",
    description: "Starting inorder traversal (Left, Root, Right).",
    operation: "Traversal",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: {},
  });

  if (!root) return decorateTraversalSteps(steps, root, "Inorder", "recursive");

  function traverse(node: TreeNodeData) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Visit Node ${node.value}`,
      description: `Current node is ${node.value}. Checking left child.`,
      operation: "Traversal",
      actionType: "compare",
      dataState: structuredClone(currentState),
      highlights: { active: [node.id] },
      codeLine: 2,
      pseudocodeLine: 2,
      variables: { Current: node.value },
    });

    if (node.left) {
      traverse(node.left);
    } else {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Left Child Null",
        description: `Node ${node.value} has no left child.`,
        operation: "Traversal",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: { active: [node.id] },
        codeLine: 3,
        pseudocodeLine: 3,
        variables: { Current: node.value },
      });
    }

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Process Node ${node.value}`,
      description: `Processing node ${node.value}.`,
      operation: "Traversal",
      actionType: "visit",
      dataState: structuredClone(currentState),
      highlights: { active: [node.id], sorted: [node.id] },
      codeLine: 5,
      pseudocodeLine: 4,
      variables: { Current: node.value },
    });

    if (node.right) {
      traverse(node.right);
    } else {
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Right Child Null",
        description: `Node ${node.value} has no right child.`,
        operation: "Traversal",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: { active: [node.id] },
        codeLine: 6,
        pseudocodeLine: 5,
        variables: { Current: node.value },
      });
    }
  }

  traverse(root);

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Traversal Complete",
    description: "Inorder traversal of the tree is complete.",
    operation: "Traversal",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 8,
    pseudocodeLine: 6,
    variables: {},
  });

  return decorateTraversalSteps(steps, root, "Inorder", "recursive");
}

export function generateTreePreorderSteps(
  initialData: number[],
  customTree?: TreeVisualState
): VisualStep[] {
  const steps: VisualStep[] = [];
  const root = customTree
    ? structuredClone(customTree.root)
    : createCompleteTreeFromArr(initialData);
  const currentState: TreeVisualState = { root: structuredClone(root) };

  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Preorder Traversal",
    description: "Starting preorder traversal (Root, Left, Right).",
    operation: "Traversal",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: {},
  });

  if (!root) return decorateTraversalSteps(steps, root, "Preorder", "recursive");

  function traverse(node: TreeNodeData) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Process Node ${node.value}`,
      description: `Processing node ${node.value}.`,
      operation: "Traversal",
      actionType: "visit",
      dataState: structuredClone(currentState),
      highlights: { active: [node.id], sorted: [node.id] },
      codeLine: 2,
      pseudocodeLine: 2,
      variables: { Current: node.value },
    });

    if (node.left) {
      traverse(node.left);
    }

    if (node.right) {
      traverse(node.right);
    }
  }

  traverse(root);

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Traversal Complete",
    description: "Preorder traversal of the tree is complete.",
    operation: "Traversal",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 8,
    pseudocodeLine: 6,
    variables: {},
  });

  return decorateTraversalSteps(steps, root, "Preorder", "recursive");
}

export function generateTreePostorderSteps(
  initialData: number[],
  customTree?: TreeVisualState
): VisualStep[] {
  const steps: VisualStep[] = [];
  const root = customTree
    ? structuredClone(customTree.root)
    : createCompleteTreeFromArr(initialData);
  const currentState: TreeVisualState = { root: structuredClone(root) };

  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Postorder Traversal",
    description: "Starting postorder traversal (Left, Right, Root).",
    operation: "Traversal",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: {},
  });

  if (!root) return decorateTraversalSteps(steps, root, "Postorder", "recursive");

  function traverse(node: TreeNodeData) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Visit Node ${node.value}`,
      description: `Current node is ${node.value}.`,
      operation: "Traversal",
      actionType: "compare",
      dataState: structuredClone(currentState),
      highlights: { active: [node.id] },
      codeLine: 2,
      pseudocodeLine: 2,
      variables: { Current: node.value },
    });

    if (node.left) {
      traverse(node.left);
    }

    if (node.right) {
      traverse(node.right);
    }

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Process Node ${node.value}`,
      description: `Processing node ${node.value}.`,
      operation: "Traversal",
      actionType: "visit",
      dataState: structuredClone(currentState),
      highlights: { active: [node.id], sorted: [node.id] },
      codeLine: 6,
      pseudocodeLine: 5,
      variables: { Current: node.value },
    });
  }

  traverse(root);

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Traversal Complete",
    description: "Postorder traversal of the tree is complete.",
    operation: "Traversal",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 8,
    pseudocodeLine: 6,
    variables: {},
  });

  return decorateTraversalSteps(steps, root, "Postorder", "recursive");
}

export function generateTreeLevelOrderSteps(
  initialData: number[],
  customTree?: TreeVisualState
): VisualStep[] {
  const steps: VisualStep[] = [];
  const root = customTree
    ? structuredClone(customTree.root)
    : createCompleteTreeFromArr(initialData);
  const currentState: TreeVisualState = { root: structuredClone(root) };

  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize Level Order Traversal",
    description: "Starting level-order traversal using a queue.",
    operation: "Traversal",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: {},
  });

  if (!root) return decorateTraversalSteps(steps, root, "Level-order", "queue");

  const queue: TreeNodeData[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Process Node ${node.value}`,
      description: `Processing node ${node.value}. Enqueuing children if they exist.`,
      operation: "Traversal",
      actionType: "visit",
      dataState: structuredClone(currentState),
      highlights: { active: [node.id], sorted: [node.id] },
      codeLine: 4,
      pseudocodeLine: 3,
      variables: { Current: node.value, QueueSize: queue.length },
    });

    if (node.left) {
      queue.push(node.left);
    }
    if (node.right) {
      queue.push(node.right);
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Traversal Complete",
    description: "Level order traversal of the tree is complete.",
    operation: "Traversal",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { active: [] },
    codeLine: 8,
    pseudocodeLine: 6,
    variables: {},
  });

  return decorateTraversalSteps(steps, root, "Level-order", "queue");
}
