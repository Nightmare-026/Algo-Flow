import { describe, it, expect } from "vitest";
import { generateGraphBFSSteps } from "@/visualizers/graph/bfs";
import { generateGraphDFSSteps } from "@/visualizers/graph/dfs";
import { generateGraphDijkstraSteps } from "@/visualizers/graph/dijkstra";
import { generateBSTSearchSteps, generateBSTInsertSteps } from "@/visualizers/tree/bst-operations";
import { TreeNodeData, TreeVisualState } from "@/visualizers/tree/types";

describe("Graph & Tree Algorithm Invariants", () => {
  describe("Graph BFS (Breadth-First Search)", () => {
    it("generates valid step sequence starting from requested node", () => {
      const steps = generateGraphBFSSteps("A");
      expect(steps.length).toBeGreaterThan(0);

      const firstStep = steps[0];
      expect(firstStep.operation).toBe("BFS");
      expect(firstStep.actionType).toBe("initialize");

      const lastStep = steps[steps.length - 1];
      expect(lastStep.title).toContain("Complete");
    });

    it("falls back safely if requested start node is not in graph", () => {
      const steps = generateGraphBFSSteps("NON_EXISTENT_NODE");
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].actionType).toBe("initialize");
    });
  });

  describe("Graph DFS (Depth-First Search)", () => {
    it("generates valid step sequence and visits graph depth-first", () => {
      const steps = generateGraphDFSSteps("A");
      expect(steps.length).toBeGreaterThan(0);

      const firstStep = steps[0];
      expect(firstStep.operation).toBe("DFS");

      const lastStep = steps[steps.length - 1];
      expect(lastStep.title).toContain("Complete");
    });
  });

  describe("Graph Dijkstra (Shortest Path)", () => {
    it("calculates shortest path step sequence on weighted graph", () => {
      const steps = generateGraphDijkstraSteps("A");
      expect(steps.length).toBeGreaterThan(0);

      const firstStep = steps[0];
      expect(firstStep.operation).toBe("Dijkstra");

      const lastStep = steps[steps.length - 1];
      expect(lastStep.title).toContain("Complete");
      expect(lastStep.variables).toBeDefined();
    });
  });

  describe("Tree BST Operations", () => {
    const initialValues = [50, 30, 70, 20, 40, 60, 80];

    it("successfully finds existing target node in BST", () => {
      const steps = generateBSTSearchSteps(initialValues, 40);
      expect(steps.length).toBeGreaterThan(0);

      const lastStep = steps[steps.length - 1];
      expect(lastStep.title).toBe("Target Found");
      expect(lastStep.actionType).toBe("complete");
    });

    it("correctly identifies absent target in BST", () => {
      const steps = generateBSTSearchSteps(initialValues, 99);
      expect(steps.length).toBeGreaterThan(0);

      const lastStep = steps[steps.length - 1];
      expect(lastStep.title).toBe("Target Not Found");
      expect(lastStep.actionType).toBe("complete");
    });

    it("inserts a new node and preserves BST property", () => {
      const steps = generateBSTInsertSteps(initialValues, 25);
      expect(steps.length).toBeGreaterThan(0);

      const lastStep = steps[steps.length - 1];
      expect(lastStep.title).toMatch(/Insert (Left|Right) Child/);
      expect(lastStep.actionType).toBe("complete");
      expect(lastStep.highlights.inserted).toBeDefined();

      const root = (lastStep.dataState as TreeVisualState).root;
      expect(root).not.toBeNull();

      // Verify BST property recursively
      const checkBST = (node: TreeNodeData | null, min: number, max: number): boolean => {
        if (!node) return true;
        if (node.value <= min || node.value >= max) return false;
        return (
          checkBST(node.left ?? null, min, node.value) &&
          checkBST(node.right ?? null, node.value, max)
        );
      };

      expect(checkBST(root, -Infinity, Infinity)).toBe(true);
    });
  });
});
