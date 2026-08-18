import { AlgorithmVisualizerDefinition } from "@/visualizers/registry/types";
import { getGraphCodeExamples } from "./code-examples";
import { graphCodeLineMappings } from "./code-line-mappings";
import { generateGraphBFSSteps } from "./bfs";
import { generateGraphDFSSteps } from "./dfs";
import { generateGraphDijkstraSteps } from "./dijkstra";
import { generateGraphBellmanFordSteps } from "./bellman-ford";
import { generateGraphKruskalSteps } from "./kruskal";
import { generateGraphPrimSteps } from "./prim";
import { generateGraphTopologicalSortSteps } from "./topological-sort";
import { generateGraphCycleDetectionSteps } from "./cycle-detection";
import { generateGraphConnectedComponentsSteps } from "./connected-components";

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
  {
    slug: "dijkstra",
    generateSteps: (_, opts) => generateGraphDijkstraSteps(opts.text || "A", opts.graphState),
    getCodeExamples: getGraphCodeExamples,
    codeLineMapping: graphCodeLineMappings["dijkstra"],
  },
  {
    slug: "bellman-ford",
    generateSteps: (_, opts) => generateGraphBellmanFordSteps(opts.text || "A", opts.graphState),
    getCodeExamples: getGraphCodeExamples,
    codeLineMapping: graphCodeLineMappings["bellman-ford"],
  },
  {
    slug: "kruskal",
    generateSteps: (_, opts) => generateGraphKruskalSteps(opts.graphState),
    getCodeExamples: getGraphCodeExamples,
    codeLineMapping: graphCodeLineMappings["kruskal"],
  },
  {
    slug: "prim",
    generateSteps: (_, opts) => generateGraphPrimSteps(opts.text || "A", opts.graphState),
    getCodeExamples: getGraphCodeExamples,
    codeLineMapping: graphCodeLineMappings["prim"],
  },
  {
    slug: "topological-sort",
    generateSteps: (_, opts) => generateGraphTopologicalSortSteps(opts.graphState),
    getCodeExamples: getGraphCodeExamples,
    codeLineMapping: graphCodeLineMappings["topological-sort"],
  },
  {
    slug: "detect-cycle-graph",
    generateSteps: (_, opts) => generateGraphCycleDetectionSteps(opts.graphState),
    getCodeExamples: getGraphCodeExamples,
    codeLineMapping: graphCodeLineMappings["detect-cycle-graph"],
  },
  {
    slug: "connected-components",
    generateSteps: (_, opts) => generateGraphConnectedComponentsSteps(opts.graphState),
    getCodeExamples: getGraphCodeExamples,
    codeLineMapping: graphCodeLineMappings["connected-components"],
  },
];
