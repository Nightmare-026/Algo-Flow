import { AlgorithmVisualizerDefinition } from "@/features/visualizer-engine/registry/types";
import { getStringCodeExamples } from "./code-examples";
import { generateStringForwardTraversalSteps, generateStringReverseTraversalSteps } from "./traversal";
import { generateNaiveSearchSteps, generateKMPSearchSteps, generateRabinKarpSteps } from "./search";
import { generatePalindromeCheckSteps } from "./palindrome";
import { generateReverseStringSteps, generateStringInsertSteps, generateStringDeleteSteps, generateStringReplaceSteps, generateStringChangeCaseSteps } from "./transform";

export const stringRegistry: AlgorithmVisualizerDefinition[] = [
  { slug: "string-forward-traversal", generateSteps: (_, opts) => generateStringForwardTraversalSteps(opts.text!), getCodeExamples: getStringCodeExamples },
  { slug: "string-reverse-traversal", generateSteps: (_, opts) => generateStringReverseTraversalSteps(opts.text!), getCodeExamples: getStringCodeExamples },
  { slug: "string-palindrome", generateSteps: (_, opts) => generatePalindromeCheckSteps(opts.text!), getCodeExamples: getStringCodeExamples },
  { slug: "string-naive-search", generateSteps: (_, opts) => generateNaiveSearchSteps(opts.text!, opts.pattern!), getCodeExamples: getStringCodeExamples },
  { slug: "string-kmp-search", generateSteps: (_, opts) => generateKMPSearchSteps(opts.text!, opts.pattern!), getCodeExamples: getStringCodeExamples },
  { slug: "string-rabin-karp", generateSteps: (_, opts) => generateRabinKarpSteps(opts.text!, opts.pattern!), getCodeExamples: getStringCodeExamples },
  { slug: "reverse-string", generateSteps: (_, opts) => generateReverseStringSteps(opts.text!), getCodeExamples: getStringCodeExamples },
  { slug: "string-insert", generateSteps: (_, opts) => generateStringInsertSteps(opts.text!, String(opts.target!), "X"), getCodeExamples: getStringCodeExamples },
  { slug: "string-delete", generateSteps: (_, opts) => generateStringDeleteSteps(opts.text!, String(opts.target!)), getCodeExamples: getStringCodeExamples },
  { slug: "string-replace", generateSteps: (_, opts) => generateStringReplaceSteps(opts.text!, String(opts.target!), "Y"), getCodeExamples: getStringCodeExamples },
  { slug: "string-change-case", generateSteps: (_, opts) => generateStringChangeCaseSteps(opts.text!), getCodeExamples: getStringCodeExamples },
];
