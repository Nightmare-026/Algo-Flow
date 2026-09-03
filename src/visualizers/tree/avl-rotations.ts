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

function findLowestUnbalancedNode(root: TreeNodeData | null): {
  node: TreeNodeData;
  balance: number;
} | null {
  if (!root) return null;

  // Post-order: check children first
  const leftUnbalanced = findLowestUnbalancedNode(root.left);
  if (leftUnbalanced) return leftUnbalanced;

  const rightUnbalanced = findLowestUnbalancedNode(root.right);
  if (rightUnbalanced) return rightUnbalanced;

  const bf = getBalance(root);
  if (bf > 1 || bf < -1) {
    return { node: root, balance: bf };
  }

  return null;
}

export function generateAVLRotationsSteps(
  rotationType: string = "LL",
  customTree?: TreeVisualState | null
): VisualStep[] {
  // If custom tree mode is active, balance the user's custom tree
  if (rotationType === "custom") {
    if (!customTree || !customTree.root) {
      return [
        {
          id: uuidv4(),
          stepNumber: 1,
          title: "Empty Tree",
          description: "The custom tree has no nodes to balance. Use 'Edit Tree' to add nodes.",
          operation: "AVL Rotation",
          actionType: "complete",
          dataState: { root: null },
          highlights: {},
          codeLine: 1,
          pseudocodeLine: 1,
        },
      ];
    }
    return generateCustomTreeAVLSteps(customTree);
  }

  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const type = (rotationType.toUpperCase() as AVLRotationType) || "LL";

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
      description: "Node 10 has height difference -2 with right child 20. Performing Left Rotation.",
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
      description: "Left rotate node 10 to align the subtree into a straight Left-Left (LL) imbalance.",
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
      description: "Right rotate node 30 to align the subtree into a straight Right-Right (RR) imbalance.",
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

function generateCustomTreeAVLSteps(customTree: TreeVisualState): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;
  const currentState: TreeVisualState = structuredClone(customTree);

  if (!currentState.root) {
    return [
      {
        id: uuidv4(),
        stepNumber: 1,
        title: "Empty Tree",
        description: "The tree has no nodes to balance.",
        operation: "AVL Rotation",
        actionType: "complete",
        dataState: currentState,
        highlights: {},
        codeLine: 1,
        pseudocodeLine: 1,
      },
    ];
  }

  const unbalanced = findLowestUnbalancedNode(currentState.root);

  if (!unbalanced) {
    // Tree is already balanced
    const rootBf = getBalance(currentState.root);
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Inspect Tree Balance",
      description: "Traversed custom tree: all nodes have balance factors within [-1, +1].",
      operation: "AVL Rotation",
      actionType: "initialize",
      dataState: structuredClone(currentState),
      highlights: { active: [currentState.root.id] },
      codeLine: 1,
      pseudocodeLine: 1,
      variables: { "Root Balance Factor": rootBf, Status: "Balanced" },
    });

    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: "Tree is Already Balanced",
      description: "Every subtree satisfies the AVL balance property (|balance factor| <= 1). No rotations needed.",
      operation: "AVL Rotation",
      actionType: "complete",
      dataState: structuredClone(currentState),
      highlights: { sorted: [currentState.root.id] },
      codeLine: 7,
      pseudocodeLine: 4,
      variables: { "AVL Status": "Valid Balanced Tree" },
    });

    return steps;
  }

  const y = unbalanced.node;
  const bf = unbalanced.balance;
  const parent = findParentOf(currentState.root, y.id);

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "Detect Imbalance in Custom Tree",
    description: `Node ${y.value} is unbalanced with balance factor ${bf} (outside [-1, +1]).`,
    operation: "AVL Rotation",
    actionType: "initialize",
    dataState: structuredClone(currentState),
    highlights: { active: [y.id] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { "Imbalance Node": y.value, "Balance Factor": bf },
  });

  if (bf > 1) {
    // Left-Heavy: either LL or LR
    const x = y.left!;
    const childBf = getBalance(x);

    if (childBf >= 0) {
      // LL Case: Right Rotate on y
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Detect Left-Left (LL) Case",
        description: `Node ${y.value} (BF=${bf}) has left child ${x.value} (BF=${childBf}). Executing Right Rotation.`,
        operation: "AVL Rotation",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: { active: [y.id], compared: [x.id] },
        codeLine: 3,
        pseudocodeLine: 2,
        variables: { Case: "Left-Left (LL)", Pivot: x.value, Root: y.value },
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
        title: "Rewire Pointers (Right Rotate)",
        description: `Rotated node ${y.value} right: ${x.value} becomes the new subtree root.`,
        operation: "AVL Rotation",
        actionType: "update",
        dataState: structuredClone(currentState),
        highlights: { active: [x.id], swapped: [y.id] },
        codeLine: 5,
        pseudocodeLine: 3,
        variables: { "New Subtree Root": x.value },
      });
    } else {
      // LR Case: Left rotate x, then Right rotate y
      const z = x.right!;
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Detect Left-Right (LR) Case",
        description: `Node ${y.value} (BF=${bf}) has left child ${x.value} with right-heavy child ${z.value}. Executing Left-Right Double Rotation.`,
        operation: "AVL Rotation",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: { active: [y.id], compared: [x.id, z.id] },
        codeLine: 3,
        pseudocodeLine: 2,
        variables: { Case: "Left-Right (LR)", Child: x.value, Grandchild: z.value },
      });

      // Step 1: Left rotate child x
      const t2 = z.left;
      z.left = x;
      x.right = t2;
      y.left = z;

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Step 1: Left Rotate Child (${x.value})`,
        description: `Left rotated child node ${x.value} around ${z.value} to align into a straight LL imbalance.`,
        operation: "AVL Rotation",
        actionType: "update",
        dataState: structuredClone(currentState),
        highlights: { active: [z.id], swapped: [x.id] },
        codeLine: 8,
        pseudocodeLine: 3,
        variables: { "Aligned Subtree": `${y.value} -> ${z.value} -> ${x.value}` },
      });

      // Step 2: Right rotate root y
      const t3 = z.right;
      z.right = y;
      y.left = t3;

      if (parent) {
        if (parent.left?.id === y.id) parent.left = z;
        else parent.right = z;
      } else {
        currentState.root = z;
      }

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Step 2: Right Rotate Root (${y.value})`,
        description: `Right rotated root node ${y.value} around ${z.value} to complete the double rotation.`,
        operation: "AVL Rotation",
        actionType: "update",
        dataState: structuredClone(currentState),
        highlights: { active: [z.id], swapped: [y.id] },
        codeLine: 5,
        pseudocodeLine: 3,
        variables: { "New Subtree Root": z.value },
      });
    }
  } else {
    // Right-Heavy: either RR or RL
    const x = y.right!;
    const childBf = getBalance(x);

    if (childBf <= 0) {
      // RR Case: Left Rotate on y
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Detect Right-Right (RR) Case",
        description: `Node ${y.value} (BF=${bf}) has right child ${x.value} (BF=${childBf}). Executing Left Rotation.`,
        operation: "AVL Rotation",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: { active: [y.id], compared: [x.id] },
        codeLine: 9,
        pseudocodeLine: 2,
        variables: { Case: "Right-Right (RR)", Pivot: x.value, Root: y.value },
      });

      // Perform Left Rotate:
      const t2 = x.left;
      x.left = y;
      y.right = t2;

      if (parent) {
        if (parent.left?.id === y.id) parent.left = x;
        else parent.right = x;
      } else {
        currentState.root = x;
      }

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Rewire Pointers (Left Rotate)",
        description: `Rotated node ${y.value} left: ${x.value} becomes the new subtree root.`,
        operation: "AVL Rotation",
        actionType: "update",
        dataState: structuredClone(currentState),
        highlights: { active: [x.id], swapped: [y.id] },
        codeLine: 11,
        pseudocodeLine: 3,
        variables: { "New Subtree Root": x.value },
      });
    } else {
      // RL Case: Right rotate x, then Left rotate y
      const z = x.left!;
      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: "Detect Right-Left (RL) Case",
        description: `Node ${y.value} (BF=${bf}) has right child ${x.value} with left-heavy child ${z.value}. Executing Right-Left Double Rotation.`,
        operation: "AVL Rotation",
        actionType: "compare",
        dataState: structuredClone(currentState),
        highlights: { active: [y.id], compared: [x.id, z.id] },
        codeLine: 9,
        pseudocodeLine: 2,
        variables: { Case: "Right-Left (RL)", Child: x.value, Grandchild: z.value },
      });

      // Step 1: Right rotate child x
      const t2 = z.right;
      z.right = x;
      x.left = t2;
      y.right = z;

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Step 1: Right Rotate Child (${x.value})`,
        description: `Right rotated child node ${x.value} around ${z.value} to align into a straight RR imbalance.`,
        operation: "AVL Rotation",
        actionType: "update",
        dataState: structuredClone(currentState),
        highlights: { active: [z.id], swapped: [x.id] },
        codeLine: 1,
        pseudocodeLine: 3,
        variables: { "Aligned Subtree": `${y.value} -> ${z.value} -> ${x.value}` },
      });

      // Step 2: Left rotate root y
      const t3 = z.left;
      z.left = y;
      y.right = t3;

      if (parent) {
        if (parent.left?.id === y.id) parent.left = z;
        else parent.right = z;
      } else {
        currentState.root = z;
      }

      steps.push({
        id: uuidv4(),
        stepNumber: stepNumber++,
        title: `Step 2: Left Rotate Root (${y.value})`,
        description: `Left rotated root node ${y.value} around ${z.value} to complete the double rotation.`,
        operation: "AVL Rotation",
        actionType: "update",
        dataState: structuredClone(currentState),
        highlights: { active: [z.id], swapped: [y.id] },
        codeLine: 11,
        pseudocodeLine: 3,
        variables: { "New Subtree Root": z.value },
      });
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: "AVL Rotation Applied to Custom Tree",
    description: "Custom tree rebalanced successfully. Subtree now satisfies the AVL height-balance condition.",
    operation: "AVL Rotation",
    actionType: "complete",
    dataState: structuredClone(currentState),
    highlights: { sorted: [currentState.root?.id || ""] },
    codeLine: 7,
    pseudocodeLine: 4,
    variables: { "New Root BF": getBalance(currentState.root) },
  });

  return steps;
}
