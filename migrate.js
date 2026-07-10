async function main() {
  const fs = await import("node:fs");
  const path = await import("node:path");

  const projectRoot = process.cwd();
  const srcFile = path.join(projectRoot, "src/features/algorithms/missing-visualizers.ts");
  const content = fs.readFileSync(srcFile, "utf8");

  const helpers = `import { v4 as uuidv4 } from "uuid";
import { VisualStep } from "@/types";

const clone = <T>(value: T): T => structuredClone(value);

function visualStep(input: Omit<VisualStep, "id">): VisualStep {
  return { id: uuidv4(), ...input };
}
`;

  function extractFunction(name) {
    const regex = new RegExp(`export function ${name}\\b[\\s\\S]*?\\n}\\n`, "m");
    const match = content.match(regex);
    return match ? match[0] : "";
  }

  function extractHelper(name) {
    const regex = new RegExp(`function ${name}\\b[\\s\\S]*?\\n}\\n`, "m");
    const match = content.match(regex);
    return match ? match[0] : "";
  }

  const mappings = {
    "array/access.ts": {
      funcs: ["generateAccessElementSteps"],
      imports: `import { createElements } from "./types";\n`,
    },
    "linked-list/additional.ts": {
      funcs: ["generateLinkedListTypesSteps", "generateSLLInsertPositionSteps", "generateSLLDeleteHeadSteps", "generateSLLReverseSteps", "generateSLLDetectCycleSteps"],
      imports: `import { createLinkedListNodes, LinkedListNode, LinkedListVisualState } from "./types";\n`,
    },
    "stack/status.ts": {
      funcs: ["generateArrayStackSteps"],
      imports: `import { createStackElements, StackVisualState } from "./types";\n`,
    },
    "queue/additional.ts": {
      funcs: ["generateSimpleQueueSteps", "generateCircularQueueSteps"],
      imports: `import { createQueueElements, QueueVisualState } from "./types";\n`,
    },
    "tree/additional.ts": {
      funcs: ["generateHeapInsertSteps", "generateTrieInsertWordSteps", "generateSegmentTreeBuildSteps"],
      helpers: ["pathTreeFromValues", "buildSegmentTree"],
      imports: `import { createCompleteTreeFromArr, TreeNodeData, TreeVisualState } from "./types";\n`,
    },
    "hash-table/additional.ts": {
      funcs: ["generateDivisionHashSteps", "generateRehashingSteps"],
      helpers: ["initializeHashTable"],
      imports: `import { createInitialHashTableState, HashEntry, HashTableVisualState } from "./types";\n`,
    },
    "hash-set/additional.ts": {
      funcs: ["generateHashSetUnionSteps", "generateHashSetIntersectionSteps"],
      helpers: ["initializeHashSet"],
      imports: `import { createInitialHashSetState, HashSetEntry, HashSetVisualState } from "./types";\n`,
    },
  };

  const baseDir = path.join(projectRoot, "src/features/algorithms");

  for (const [targetFile, data] of Object.entries(mappings)) {
    const targetPath = path.join(baseDir, targetFile);
    let fileContent = "";

    if (fs.existsSync(targetPath)) {
      fileContent = `${fs.readFileSync(targetPath, "utf8")}\n\n`;
      if (!fileContent.includes("const clone =")) {
        fileContent += `\nconst clone = <T>(value: T): T => structuredClone(value);\n\nfunction visualStep(input: Omit<VisualStep, "id">): VisualStep {\n  return { id: uuidv4(), ...input };\n}\n\n`;
      }
    } else {
      fileContent = `${helpers}\n${data.imports}\n`;
    }

    if (data.helpers) {
      for (const helper of data.helpers) {
        fileContent += `${extractHelper(helper)}\n`;
      }
    }

    for (const func of data.funcs) {
      fileContent += `${extractFunction(func)}\n`;
    }

    if (fs.existsSync(targetPath) && !fileContent.includes("import { v4 as uuidv4 }")) {
      fileContent = `import { v4 as uuidv4 } from "uuid";\n${fileContent}`;
    }

    fs.writeFileSync(targetPath, fileContent);
  }

  const pageFile = path.join(projectRoot, "src/app/visualizer/[slug]/page.tsx");
  let pageContent = fs.readFileSync(pageFile, "utf8");

  const newImports = `
import { generateAccessElementSteps } from "@/features/algorithms/array/access";
import { generateLinkedListTypesSteps, generateSLLInsertPositionSteps, generateSLLDeleteHeadSteps, generateSLLReverseSteps, generateSLLDetectCycleSteps } from "@/features/algorithms/linked-list/additional";
import { generateArrayStackSteps } from "@/features/algorithms/stack/status";
import { generateSimpleQueueSteps, generateCircularQueueSteps } from "@/features/algorithms/queue/additional";
import { generateHeapInsertSteps, generateTrieInsertWordSteps, generateSegmentTreeBuildSteps } from "@/features/algorithms/tree/additional";
import { generateDivisionHashSteps, generateRehashingSteps } from "@/features/algorithms/hash-table/additional";
import { generateHashSetUnionSteps, generateHashSetIntersectionSteps } from "@/features/algorithms/hash-set/additional";
`;

  pageContent = pageContent.replace(/import\s*\{[^}]*\}\s*from\s*"@\/features\/algorithms\/missing-visualizers";/g, newImports);
  fs.writeFileSync(pageFile, pageContent);

  if (fs.existsSync(srcFile)) {
    fs.unlinkSync(srcFile);
  }

  console.log("Migration complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});