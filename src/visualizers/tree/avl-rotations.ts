import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { TreeVisualState, TreeNodeData } from "./types";

export type AVLRotationType = "LL" | "RR" | "LR" | "RL";

function getHeight(node: TreeNodeData | null): number {
  if (!node) return 0;
  return 1 + Math.max(getHeight(node.left), getHeight(node.right));
}

function getBalance(node: TreeNodeData | null): number {
  if (!node) return 0;
  return getHeight(node.left) - getHeight(node.right);
}

function findParentOf(root: TreeNodeData | null, targetId: string): TreeNodeData | null {
  if (!root) return null;
  if (root.left?.id === targetId || root.right?.id === targetId) return root;
  const left = findParentOf(root.left, targetId);
  if (left) return left;
  return findParentOf(root.right, targetId);
}

export function generateAVLRotationsSteps(
  rotationType: string = "LL",
  customTree?: TreeVisualState | null
): VisualStep[] {
  const type = (rotationType.toUpperCase() as AVLRotationType) || "LL";

  // If a custom tree is provided, execute the selected rotation (LL, RR, LR, RL) on the custom tree
  if (customTree && customTree.root) {
    if (type === "RR") return applyRRRotation(customTree);
    if (type === "LR") return applyLRRotation(customTree);
    if (type === "RL") return applyRLRotation(customTree);
    return applyLLRotation(customTree);
  }

  const steps: VisualStep[] = [];
  let stepNumber = 1;

  if (type === "RR") {
    // RR Imbalance: Root 10, Right 20, Right-Right 30 -> Left Rotate
    const node30: TreeNodeData = { id: uuidv4(), value: 30, left: null, right: null };
    const node20: TreeNodeData = { id: uuidv4(), value: 20, left: null, right: node30 };
    const node10: TreeNodeData = { id: uuidv4(), value: 10, left: null, right: node20 };

    const currentState: TreeVisualState = { root: node10 };

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Initialize AVL Tree (RR Imbalance)",
      description: "Inserted [10, 20, 30] creating a Right-Heavy (RR) imbalance at node 10.",
      operation: "AVL Rotation",
      actionType: "initialize",
      dataState: structuredClone(currentState),
      highlights: { active: [node10.id] },
      codeLine: 8,
      pseudocodeLine: 1,
      variables: { "Imbalance Node": 10, "Balance Factor": "-2 (Right-Heavy)" },
    });

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Detect Right-Right (RR) Case",
      description:
        "Node 10 has height difference -2 with right child 20. Performing Left Rotation.",
      operation: "AVL Rotation",
      actionType: "compare",
      dataState: structuredClone(currentState),
      highlights: {
        active: [node10.id],
        compared: [node20.id, node30.id],
      },
      codeLine: 9,
      pseudocodeLine: 2,
      variables: { Rotation: "Left Rotation", Pivot: 20, Root: 10 },
    });

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Rewire Pointers for Left Rotation",
      description: "Make node 20 the new subtree root and set node 10 as its left child.",
      operation: "AVL Rotation",
      actionType: "update",
      dataState: structuredClone(currentState),
      highlights: {
        active: [node20.id],
        swapped: [node10.id],
      },
      codeLine: 11,
      pseudocodeLine: 3,
      variables: { "New Subtree Root": 20, "Left Child": 10, "Right Child": 30 },
    });

    node10.right = null;
    node20.left = node10;
    currentState.root = node20;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Left Rotation Applied",
      description: "Tree rebalanced: Node 20 is the root with left child 10 and right child 30.",
      operation: "AVL Rotation",
      actionType: "complete",
      dataState: structuredClone(currentState),
      highlights: {
        active: [node20.id],
        sorted: [node10.id, node20.id, node30.id],
      },
      codeLine: 13,
      pseudocodeLine: 4,
      variables: {
        "Root Balance Factor": "0",
        "Left Balance Factor": "0",
        "Right Balance Factor": "0",
      },
    });

    return steps;
  }

  if (type === "LR") {
    // LR Imbalance: Root 30, Left 10, Left-Right 20 -> Left Rotate child 10, then Right Rotate root 30
    const node20: TreeNodeData = { id: uuidv4(), value: 20, left: null, right: null };
    const node10: TreeNodeData = { id: uuidv4(), value: 10, left: null, right: node20 };
    const node30: TreeNodeData = { id: uuidv4(), value: 30, left: node10, right: null };

    const currentState: TreeVisualState = { root: node30 };

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Initialize AVL Tree (LR Imbalance)",
      description: "Node 30 has left child 10, and 10 has right child 20 (Zigzag LR imbalance).",
      operation: "AVL Rotation",
      actionType: "initialize",
      dataState: structuredClone(currentState),
      highlights: { active: [node30.id], compared: [node10.id, node20.id] },
      codeLine: 1,
      pseudocodeLine: 1,
      variables: { "Imbalance Node": 30, "Subtree Type": "Left-Right (LR)" },
    });

    // Step 1 of LR: Left rotate child node 10
    node10.right = null;
    node20.left = node10;
    node30.left = node20;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Step 1: Left Rotate Child (Node 10)",
      description:
        "Left rotate node 10 to align the subtree into a straight Left-Left (LL) imbalance.",
      operation: "AVL Rotation",
      actionType: "update",
      dataState: structuredClone(currentState),
      highlights: { active: [node20.id], swapped: [node10.id] },
      codeLine: 8,
      pseudocodeLine: 3,
      variables: { "Transformed Subtree": "LL Aligned [30 -> 20 -> 10]" },
    });

    // Step 2 of LR: Right rotate root node 30
    node30.left = null;
    node20.right = node30;
    currentState.root = node20;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Step 2: Right Rotate Root (Node 30)",
      description: "Right rotate node 30 around pivot 20 to complete the double rotation.",
      operation: "AVL Rotation",
      actionType: "update",
      dataState: structuredClone(currentState),
      highlights: { active: [node20.id], swapped: [node30.id] },
      codeLine: 5,
      pseudocodeLine: 3,
      variables: { "New Subtree Root": 20, "Right Child": 30 },
    });

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "LR Double Rotation Applied",
      description: "Tree rebalanced: Node 20 is the root with left child 10 and right child 30.",
      operation: "AVL Rotation",
      actionType: "complete",
      dataState: structuredClone(currentState),
      highlights: {
        active: [node20.id],
        sorted: [node10.id, node20.id, node30.id],
      },
      codeLine: 7,
      pseudocodeLine: 4,
      variables: {
        "Root Balance Factor": "0",
        "Left Balance Factor": "0",
        "Right Balance Factor": "0",
      },
    });

    return steps;
  }

  if (type === "RL") {
    // RL Imbalance: Root 10, Right 30, Right-Left 20 -> Right Rotate child 30, then Left Rotate root 10
    const node20: TreeNodeData = { id: uuidv4(), value: 20, left: null, right: null };
    const node30: TreeNodeData = { id: uuidv4(), value: 30, left: node20, right: null };
    const node10: TreeNodeData = { id: uuidv4(), value: 10, left: null, right: node30 };

    const currentState: TreeVisualState = { root: node10 };

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Initialize AVL Tree (RL Imbalance)",
      description: "Node 10 has right child 30, and 30 has left child 20 (Zigzag RL imbalance).",
      operation: "AVL Rotation",
      actionType: "initialize",
      dataState: structuredClone(currentState),
      highlights: { active: [node10.id], compared: [node30.id, node20.id] },
      codeLine: 8,
      pseudocodeLine: 1,
      variables: { "Imbalance Node": 10, "Subtree Type": "Right-Left (RL)" },
    });

    // Step 1 of RL: Right rotate child node 30
    node30.left = null;
    node20.right = node30;
    node10.right = node20;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Step 1: Right Rotate Child (Node 30)",
      description:
        "Right rotate node 30 to align the subtree into a straight Right-Right (RR) imbalance.",
      operation: "AVL Rotation",
      actionType: "update",
      dataState: structuredClone(currentState),
      highlights: { active: [node20.id], swapped: [node30.id] },
      codeLine: 1,
      pseudocodeLine: 3,
      variables: { "Transformed Subtree": "RR Aligned [10 -> 20 -> 30]" },
    });

    // Step 2 of RL: Left rotate root node 10
    node10.right = null;
    node20.left = node10;
    currentState.root = node20;

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Step 2: Left Rotate Root (Node 10)",
      description: "Left rotate node 10 around pivot 20 to complete the double rotation.",
      operation: "AVL Rotation",
      actionType: "update",
      dataState: structuredClone(currentState),
      highlights: { active: [node20.id], swapped: [node10.id] },
      codeLine: 11,
      pseudocodeLine: 3,
      variables: { "New Subtree Root": 20, "Left Child": 10 },
    });

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "RL Double Rotation Applied",
      description: "Tree rebalanced: Node 20 is the root with left child 10 and right child 30.",
      operation: "AVL Rotation",
      actionType: "complete",
      dataState: structuredClone(currentState),
      highlights: {
        active: [node20.id],
        sorted: [node10.id, node20.id, node30.id],
      },
      codeLine: 13,
      pseudocodeLine: 4,
      variables: {
        "Root Balance Factor": "0",
        "Left Balance Factor": "0",
        "Right Balance Factor": "0",
      },
    });

    return steps;
  }

  // Default: LL Case (Right Rotation)
  const node10: TreeNodeData = { id: uuidv4(), value: 10, left: null, right: null };
  const node20: TreeNodeData = { id: uuidv4(), value: 20, left: node10, right: null };
  const node30: TreeNodeData = { id: uuidv4(), value: 30, left: node20, right: null };

  const currentState: TreeVisualState = { root: node30 };

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Initialize AVL Tree Balancing",
    description: "Inserted [30, 20, 10] creating a Left-Heavy (LL) imbalance at node 30.",
    operation: "AVL Rotation",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [node30.id] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { "Imbalance Node": 30, "Balance Factor": "+2 (Left-Heavy)" },
  });

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Detect Left-Left (LL) Case",
    description: "Node 30 has height difference 2 with left child 20. Performing Right Rotation.",
    operation: "AVL Rotation",
    actionType: "compare",
    dataState: structuredClone(currentState),
    highlights: {
      active: [node30.id],
      compared: [node20.id, node10.id],
    },
    codeLine: 3,
    pseudocodeLine: 2,
    variables: { Rotation: "Right Rotation", Pivot: 20, Root: 30 },
  });

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Rewire Pointers for Right Rotation",
    description: "Make node 20 the new subtree root and set node 30 as its right child.",
    operation: "AVL Rotation",
    actionType: "update",
    dataState: structuredClone(currentState),
    highlights: {
      active: [node20.id],
      swapped: [node30.id],
    },
    codeLine: 5,
    pseudocodeLine: 3,
    variables: { "New Subtree Root": 20, "Right Child": 30, "Left Child": 10 },
  });

  node30.left = null;
  node20.right = node30;
  currentState.root = node20;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Right Rotation Applied",
    description: "Tree rebalanced: Node 20 is the root with left child 10 and right child 30.",
    operation: "AVL Rotation",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: {
      active: [node20.id],
      sorted: [node10.id, node20.id, node30.id],
    },
    codeLine: 7,
    pseudocodeLine: 4,
    variables: {
      "Root Balance Factor": "0",
      "Left Balance Factor": "0",
      "Right Balance Factor": "0",
    },
  });

  return steps;
}

// ---------------------------------------------------------------------------
// Custom Tree Rotation Executors (Applies LL, RR, LR, RL to user's tree)
// ---------------------------------------------------------------------------

function applyLLRotation(customTree: TreeVisualState): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const currentState: TreeVisualState = structuredClone(customTree);
  if (!currentState.root) return [];

  function findLLTarget(node: TreeNodeData | null): TreeNodeData | null {
    if (!node) return null;
    const bf = getBalance(node);
    if (bf > 1 && node.left && getBalance(node.left) >= 0) return node;
    const l = findLLTarget(node.left);
    if (l) return l;
    return findLLTarget(node.right);
  }

  function findAnyWithLeft(node: TreeNodeData | null): TreeNodeData | null {
    if (!node) return null;
    if (node.left) return node;
    const l = findAnyWithLeft(node.left);
    if (l) return l;
    return findAnyWithLeft(node.right);
  }

  const targetNode =
    findLLTarget(currentState.root) ||
    (currentState.root.left ? currentState.root : findAnyWithLeft(currentState.root));

  if (!targetNode || !targetNode.left) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "LL Rotation (Right Rotation) Unavailable",
      description:
        "Single Right Rotation (LL) requires a node with a left child to rotate around. None of the nodes in this tree currently have a left child. Use 'Edit Tree' to add a left child or choose RR rotation.",
      operation: "AVL Rotation",
      actionType: "initialize",
      dataState: structuredClone(currentState),
      highlights: { active: [currentState.root.id] },
      codeLine: 1,
      pseudocodeLine: 1,
      variables: { Status: "No Left Child Found", Requirement: "Node with left child" },
    });
    return steps;
  }

  const y = targetNode;
  const x = targetNode.left;
  const parent = findParentOf(currentState.root, y.id);
  const bf = getBalance(y);

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Initialize LL Rotation on Node ${y.value}`,
    description: `Target node ${y.value} (Balance Factor = ${bf}) has left child ${x.value}. Preparing to perform a single Right Rotation around left child ${x.value}.`,
    operation: "AVL Rotation",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [y.id], compared: [x.id] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: {
      "Target Node": y.value,
      "Left Child (Pivot)": x.value,
      "Balance Factor": bf,
      Rotation: "Right Rotation (LL)",
    },
  });

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Detect Left-Left (LL) Case on Node ${y.value}`,
    description: `Node ${y.value} has left child ${x.value}. Right rotation will pull pivot ${x.value} up to the subtree root and push ${y.value} down to the right.`,
    operation: "AVL Rotation",
    actionType: "compare",
    dataState: structuredClone(currentState),
    highlights: { active: [y.id], compared: [x.id, ...(x.left ? [x.left.id] : [])] },
    codeLine: 3,
    pseudocodeLine: 2,
    variables: { Pivot: x.value, Root: y.value, Case: "Left-Left (LL)" },
  });

  // Perform Right Rotate:
  const t2 = x.right;
  x.right = y;
  y.left = t2;

  if (parent) {
    if (parent.left?.id === y.id) parent.left = x;
    else parent.right = x;
  } else {
    currentState.root = x;
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Rewire Pointers for Right Rotation",
    description: `Node ${x.value} is now the new subtree root. ${y.value} is its right child, and ${x.value}'s original right child (${t2 ? t2.value : "null"}) is now ${y.value}'s left child.`,
    operation: "AVL Rotation",
    actionType: "update",
    dataState: structuredClone(currentState),
    highlights: { active: [x.id], swapped: [y.id] },
    codeLine: 5,
    pseudocodeLine: 3,
    variables: { "New Subtree Root": x.value, "Right Child": y.value },
  });

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "LL Right Rotation Applied",
    description: `Right rotation complete. Node ${x.value} elevated to subtree root. Subtree balance factor is now ${getBalance(x)}.`,
    operation: "AVL Rotation",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: {
      active: [x.id],
      sorted: [x.id, y.id, ...(x.left ? [x.left.id] : []), ...(y.right ? [y.right.id] : [])],
    },
    codeLine: 7,
    pseudocodeLine: 4,
    variables: {
      "New Subtree Root BF": getBalance(x),
      "Original Node BF": getBalance(y),
      Status: "Rotated & Balanced",
    },
  });

  return steps;
}

function applyRRRotation(customTree: TreeVisualState): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const currentState: TreeVisualState = structuredClone(customTree);
  if (!currentState.root) return [];

  function findRRTarget(node: TreeNodeData | null): TreeNodeData | null {
    if (!node) return null;
    const bf = getBalance(node);
    if (bf < -1 && node.right && getBalance(node.right) <= 0) return node;
    const l = findRRTarget(node.left);
    if (l) return l;
    return findRRTarget(node.right);
  }

  function findAnyWithRight(node: TreeNodeData | null): TreeNodeData | null {
    if (!node) return null;
    if (node.right) return node;
    const l = findAnyWithRight(node.left);
    if (l) return l;
    return findAnyWithRight(node.right);
  }

  const targetNode =
    findRRTarget(currentState.root) ||
    (currentState.root.right ? currentState.root : findAnyWithRight(currentState.root));

  if (!targetNode || !targetNode.right) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "RR Rotation (Left Rotation) Unavailable",
      description:
        "Single Left Rotation (RR) requires a node with a right child to rotate around. None of the nodes in this tree currently have a right child. Use 'Edit Tree' to add a right child or select LL rotation.",
      operation: "AVL Rotation",
      actionType: "initialize",
      dataState: structuredClone(currentState),
      highlights: { active: [currentState.root.id] },
      codeLine: 8,
      pseudocodeLine: 1,
      variables: { Status: "No Right Child Found", Requirement: "Node with right child" },
    });
    return steps;
  }

  const x = targetNode;
  const y = targetNode.right;
  const parent = findParentOf(currentState.root, x.id);
  const bf = getBalance(x);

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Initialize RR Rotation on Node ${x.value}`,
    description: `Target node ${x.value} (Balance Factor = ${bf}) has right child ${y.value}. Preparing to perform a single Left Rotation around right child ${y.value}.`,
    operation: "AVL Rotation",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [x.id], compared: [y.id] },
    codeLine: 8,
    pseudocodeLine: 1,
    variables: {
      "Target Node": x.value,
      "Right Child (Pivot)": y.value,
      "Balance Factor": bf,
      Rotation: "Left Rotation (RR)",
    },
  });

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Detect Right-Right (RR) Case on Node ${x.value}`,
    description: `Node ${x.value} has right child ${y.value}. Left rotation will pull pivot ${y.value} up to the subtree root and push ${x.value} down to the left.`,
    operation: "AVL Rotation",
    actionType: "compare",
    dataState: structuredClone(currentState),
    highlights: { active: [x.id], compared: [y.id, ...(y.right ? [y.right.id] : [])] },
    codeLine: 9,
    pseudocodeLine: 2,
    variables: { Pivot: y.value, Root: x.value, Case: "Right-Right (RR)" },
  });

  // Perform Left Rotate:
  const t2 = y.left;
  y.left = x;
  x.right = t2;

  if (parent) {
    if (parent.left?.id === x.id) parent.left = y;
    else parent.right = y;
  } else {
    currentState.root = y;
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Rewire Pointers for Left Rotation",
    description: `Node ${y.value} is now the new subtree root. ${x.value} is its left child, and ${y.value}'s original left child (${t2 ? t2.value : "null"}) is now ${x.value}'s right child.`,
    operation: "AVL Rotation",
    actionType: "update",
    dataState: structuredClone(currentState),
    highlights: { active: [y.id], swapped: [x.id] },
    codeLine: 11,
    pseudocodeLine: 3,
    variables: { "New Subtree Root": y.value, "Left Child": x.value },
  });

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "RR Left Rotation Applied",
    description: `Left rotation complete. Node ${y.value} elevated to subtree root. Subtree balance factor is now ${getBalance(y)}.`,
    operation: "AVL Rotation",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: {
      active: [y.id],
      sorted: [y.id, x.id, ...(y.right ? [y.right.id] : []), ...(x.left ? [x.left.id] : [])],
    },
    codeLine: 13,
    pseudocodeLine: 4,
    variables: {
      "New Subtree Root BF": getBalance(y),
      "Original Node BF": getBalance(x),
      Status: "Rotated & Balanced",
    },
  });

  return steps;
}

function applyLRRotation(customTree: TreeVisualState): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const currentState: TreeVisualState = structuredClone(customTree);
  if (!currentState.root) return [];

  function findLRTarget(
    node: TreeNodeData | null
  ): { z: TreeNodeData; y: TreeNodeData; x: TreeNodeData } | null {
    if (!node) return null;
    if (node.left && node.left.right) {
      return { z: node, y: node.left, x: node.left.right };
    }
    const l = findLRTarget(node.left);
    if (l) return l;
    return findLRTarget(node.right);
  }

  function findAnyLeftWithChild(
    node: TreeNodeData | null
  ): { z: TreeNodeData; y: TreeNodeData; x: TreeNodeData } | null {
    if (!node) return null;
    if (node.left) {
      if (node.left.right) return { z: node, y: node.left, x: node.left.right };
      if (node.left.left) return { z: node, y: node.left, x: node.left.left };
    }
    const l = findAnyLeftWithChild(node.left);
    if (l) return l;
    return findAnyLeftWithChild(node.right);
  }

  const found = findLRTarget(currentState.root) || findAnyLeftWithChild(currentState.root);

  if (!found) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "LR Double Rotation Unavailable",
      description:
        "A Left-Right (LR) Double Rotation requires a node with a left child that also has a child (zigzag). None of the nodes in this tree have this structure. Use 'Edit Tree' to add children or select LL rotation.",
      operation: "AVL Rotation",
      actionType: "initialize",
      dataState: structuredClone(currentState),
      highlights: { active: [currentState.root.id] },
      codeLine: 1,
      pseudocodeLine: 1,
      variables: { Status: "No LR Zigzag Structure Found" },
    });
    return steps;
  }

  const { z, y, x } = found;
  const parent = findParentOf(currentState.root, z.id);

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Initialize LR Double Rotation on Node ${z.value}`,
    description: `Node ${z.value} has left child ${y.value}, and ${y.value} has child ${x.value} (Zigzag Left-Right imbalance). Executing Left-Right Double Rotation.`,
    operation: "AVL Rotation",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [z.id], compared: [y.id, x.id] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: {
      "Imbalance Node": z.value,
      "Left Child": y.value,
      "Pivot (Grandchild)": x.value,
      Type: "LR (Left-Right)",
    },
  });

  // Step 1 of LR: Left rotate child y around x
  const t2 = x.left;
  x.left = y;
  y.right = t2;
  z.left = x;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Step 1: Left Rotate Child (${y.value})`,
    description: `Left rotate child node ${y.value} around ${x.value}. This straightens the zigzag subtree into a Left-Left (LL) alignment.`,
    operation: "AVL Rotation",
    actionType: "update",
    dataState: structuredClone(currentState),
    highlights: { active: [x.id], swapped: [y.id] },
    codeLine: 8,
    pseudocodeLine: 3,
    variables: {
      "Aligned Subtree": `${z.value} -> ${x.value} -> ${y.value}`,
      "Subtree Root": z.value,
    },
  });

  // Step 2 of LR: Right rotate root z around x
  const t3 = x.right;
  x.right = z;
  z.left = t3;

  if (parent) {
    if (parent.left?.id === z.id) parent.left = x;
    else parent.right = x;
  } else {
    currentState.root = x;
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Step 2: Right Rotate Root (${z.value})`,
    description: `Right rotate root node ${z.value} around ${x.value} to complete the double rotation.`,
    operation: "AVL Rotation",
    actionType: "update",
    dataState: structuredClone(currentState),
    highlights: { active: [x.id], swapped: [z.id] },
    codeLine: 5,
    pseudocodeLine: 3,
    variables: { "New Subtree Root": x.value, "Left Child": y.value, "Right Child": z.value },
  });

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "LR Double Rotation Applied",
    description: `Double rotation complete. Node ${x.value} is now the root of the subtree with left child ${y.value} and right child ${z.value}.`,
    operation: "AVL Rotation",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { active: [x.id], sorted: [x.id, y.id, z.id] },
    codeLine: 7,
    pseudocodeLine: 4,
    variables: {
      "Root BF": getBalance(x),
      "Left BF": getBalance(y),
      "Right BF": getBalance(z),
    },
  });

  return steps;
}

function applyRLRotation(customTree: TreeVisualState): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const currentState: TreeVisualState = structuredClone(customTree);
  if (!currentState.root) return [];

  function findRLTarget(
    node: TreeNodeData | null
  ): { z: TreeNodeData; y: TreeNodeData; x: TreeNodeData } | null {
    if (!node) return null;
    if (node.right && node.right.left) {
      return { z: node, y: node.right, x: node.right.left };
    }
    const l = findRLTarget(node.left);
    if (l) return l;
    return findRLTarget(node.right);
  }

  function findAnyRightWithChild(
    node: TreeNodeData | null
  ): { z: TreeNodeData; y: TreeNodeData; x: TreeNodeData } | null {
    if (!node) return null;
    if (node.right) {
      if (node.right.left) return { z: node, y: node.right, x: node.right.left };
      if (node.right.right) return { z: node, y: node.right, x: node.right.right };
    }
    const l = findAnyRightWithChild(node.left);
    if (l) return l;
    return findAnyRightWithChild(node.right);
  }

  const found = findRLTarget(currentState.root) || findAnyRightWithChild(currentState.root);

  if (!found) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "RL Double Rotation Unavailable",
      description:
        "A Right-Left (RL) Double Rotation requires a node with a right child that also has a child (zigzag). None of the nodes in this tree have this structure. Use 'Edit Tree' to add children or select RR rotation.",
      operation: "AVL Rotation",
      actionType: "initialize",
      dataState: structuredClone(currentState),
      highlights: { active: [currentState.root.id] },
      codeLine: 8,
      pseudocodeLine: 1,
      variables: { Status: "No RL Zigzag Structure Found" },
    });
    return steps;
  }

  const { z, y, x } = found;
  const parent = findParentOf(currentState.root, z.id);

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Initialize RL Double Rotation on Node ${z.value}`,
    description: `Node ${z.value} has right child ${y.value}, and ${y.value} has child ${x.value} (Zigzag Right-Left imbalance). Executing Right-Left Double Rotation.`,
    operation: "AVL Rotation",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [z.id], compared: [y.id, x.id] },
    codeLine: 8,
    pseudocodeLine: 1,
    variables: {
      "Imbalance Node": z.value,
      "Right Child": y.value,
      "Pivot (Grandchild)": x.value,
      Type: "RL (Right-Left)",
    },
  });

  // Step 1 of RL: Right rotate child y around x
  const t2 = x.right;
  x.right = y;
  y.left = t2;
  z.right = x;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Step 1: Right Rotate Child (${y.value})`,
    description: `Right rotate child node ${y.value} around ${x.value}. This straightens the zigzag subtree into a Right-Right (RR) alignment.`,
    operation: "AVL Rotation",
    actionType: "update",
    dataState: structuredClone(currentState),
    highlights: { active: [x.id], swapped: [y.id] },
    codeLine: 1,
    pseudocodeLine: 3,
    variables: {
      "Aligned Subtree": `${z.value} -> ${x.value} -> ${y.value}`,
      "Subtree Root": z.value,
    },
  });

  // Step 2 of RL: Left rotate root z around x
  const t3 = x.left;
  x.left = z;
  z.right = t3;

  if (parent) {
    if (parent.left?.id === z.id) parent.left = x;
    else parent.right = x;
  } else {
    currentState.root = x;
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Step 2: Left Rotate Root (${z.value})`,
    description: `Left rotate root node ${z.value} around ${x.value} to complete the double rotation.`,
    operation: "AVL Rotation",
    actionType: "update",
    dataState: structuredClone(currentState),
    highlights: { active: [x.id], swapped: [z.id] },
    codeLine: 11,
    pseudocodeLine: 3,
    variables: { "New Subtree Root": x.value, "Left Child": z.value, "Right Child": y.value },
  });

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "RL Double Rotation Applied",
    description: `Double rotation complete. Node ${x.value} is now the root of the subtree with left child ${z.value} and right child ${y.value}.`,
    operation: "AVL Rotation",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { active: [x.id], sorted: [x.id, z.id, y.id] },
    codeLine: 13,
    pseudocodeLine: 4,
    variables: {
      "New Root BF": getBalance(x),
      "Left BF": getBalance(z),
      "Right BF": getBalance(y),
    },
  });

  return steps;
}
