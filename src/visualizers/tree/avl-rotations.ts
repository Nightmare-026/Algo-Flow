import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { TreeVisualState, TreeNodeData } from "./types";

export function generateAVLRotationsSteps(initialData: number[] = [30, 20, 10]): VisualStep[] {
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  // Build an unbalanced LL tree: Root 30, Left 20, Left-Left 10
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

  // Step 2: Detach node20.right (null in this case) and attach to node30.left
  // node20.right = node30
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
