import { AlgorithmVisualizerDefinition } from "@/features/visualizer-engine/registry/types";
import { getGraphCodeExamples } from "./code-examples";
import { generateGraphBFSSteps } from "./bfs";
import { generateGraphDFSSteps } from "./dfs";

export const graphRegistry: AlgorithmVisualizerDefinition[] = [
  { slug: "bfs", generateSteps: (_, opts) => generateGraphBFSSteps(opts.text!, opts.graphState!, opts.isDirected!), getCodeExamples: getGraphCodeExamples },
  { slug: "dfs", generateSteps: (_, opts) => generateGraphDFSSteps(opts.text!, opts.graphState!, opts.isDirected!), getCodeExamples: getGraphCodeExamples },
];
