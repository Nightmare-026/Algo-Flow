import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";
import { TreeNodeData, TreeVisualState } from "./types";

function pathTreeFromValues(values: number[]): TreeNodeData | null {
  if (values.length === 0) return null;
  const root: TreeNodeData = { id: uuidv4(), value: values[0], left: null, right: null };
  let current = root;
  for (const value of values.slice(1)) {
    current.left = { id: uuidv4(), value, left: null, right: null };
    current = current.left;
  }
  return root;
}

export function generateTrieSearchSteps(word = "CODE"): VisualStep[] {
  const chars = word.split("").map((c) => c.charCodeAt(0));
  const labels = word.split("");
  const steps: VisualStep[] = [];
  const root = pathTreeFromValues(chars);

  let stepNumber = 1;

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Initialize Trie Search for '${word}'`,
    description: `Searching for word '${word}' character-by-character from the root of the Trie.`,
    operation: "Trie Search",
    actionType: "initialize",
    dataState: { root: structuredClone(root) } satisfies TreeVisualState,
    highlights: { active: root ? [root.id] : [] },
    codeLine: 1,
    pseudocodeLine: 1,
    variables: { Target: word, Length: word.length },
  });

  let currentNode = root;
  for (let i = 0; i < chars.length; i++) {
    steps.push({
      id: uuidv4(),
      stepNumber: stepNumber++,
      title: `Match Character '${labels[i]}'`,
      description: `Character '${labels[i]}' (ASCII ${chars[i]}) found at Trie depth ${i + 1}.`,
      operation: "Trie Search",
      actionType: "compare",
      dataState: { root: structuredClone(root) } satisfies TreeVisualState,
      highlights: {
        active: currentNode ? [currentNode.id] : [],
        sorted: currentNode ? [currentNode.id] : [],
      },
      codeLine: 3,
      pseudocodeLine: 2,
      variables: { Char: labels[i], Code: chars[i], Index: i },
    });

    if (currentNode?.left) {
      currentNode = currentNode.left;
    }
  }

  steps.push({
    id: uuidv4(),
    stepNumber: stepNumber++,
    title: `Word '${word}' Found`,
    description: `All characters matched and terminal node reached with isEndOfWord = true.`,
    operation: "Trie Search",
    actionType: "complete",
    dataState: { root: structuredClone(root) } satisfies TreeVisualState,
    highlights: { active: currentNode ? [currentNode.id] : [] },
    codeLine: 5,
    pseudocodeLine: 3,
    variables: { Word: word, Found: true, IsEndOfWord: true },
  });

  return steps;
}
