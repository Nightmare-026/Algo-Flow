import { AlgorithmVisualizerDefinition } from "@/visualizers/registry/types";
import { getGraphCodeExamples } from "./code-examples";
import { graphCodeLineMappings } from "./code-line-mappings";
import { generateGraphBFSSteps } from "./bfs";
import { generateGraphDFSSteps } from "./dfs";

export const graphRegistry: AlgorithmVisualizerDefinition[] = [
  {
    slug: "bfs",
    generateSteps: (_, opts) =>
      generateGraphBFSSteps(opts.text!, opts.graphState!, opts.isDirected!),
    getCodeExamples: getGraphCodeExamples,
    codeLineMapping: graphCodeLineMappings["bfs"],
  },
  {
    slug: "dfs",
    generateSteps: (_, opts) =>
      generateGraphDFSSteps(opts.text!, opts.graphState!, opts.isDirected!),
    getCodeExamples: getGraphCodeExamples,
    codeLineMapping: graphCodeLineMappings["dfs"],
  },
];
