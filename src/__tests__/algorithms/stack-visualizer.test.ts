import { describe, it, expect } from "vitest";
import { algorithmRegistry } from "@/visualizers/registry/algorithm-registry";
import { getStackPseudocode } from "@/visualizers/stack/pseudocode";
import { getVisualizerPseudocode } from "@/visualizers/registry/pseudocode";
import { generateStackPushSteps } from "@/visualizers/stack/push";
import { generateStackPopSteps } from "@/visualizers/stack/pop";
import {
  generateStackPeekSteps,
  generateStackIsEmptySteps,
  generateStackIsFullSteps,
  generateStackSizeSteps,
  generateArrayStackSteps,
} from "@/visualizers/stack/status";
import {
  generateBalancedParenthesesSteps,
  generateInfixToPostfixSteps,
  generatePostfixEvaluationSteps,
  generateMinStackSteps,
  generateNextGreaterElementSteps,
} from "@/visualizers/stack/applications";
import type { StackVisualState } from "@/visualizers/stack/types";

describe("Stack Visualizers - Comprehensive LIFO & Step Integrity Suite", () => {
  const stackSlugs = [
    "array-stack",
    "stack-push",
    "stack-pop",
    "stack-peek",
    "stack-is-empty",
    "stack-is-full",
    "stack-size",
    "balanced-parentheses",
    "infix-to-postfix",
    "postfix-evaluation",
    "min-stack",
    "next-greater-element",
  ];

  it("registers all 12 stack visualizers in algorithmRegistry", () => {
    stackSlugs.forEach((slug) => {
      const def = algorithmRegistry[slug];
      expect(def, `Visualizer ${slug} must be registered`).toBeDefined();
      expect(typeof def.generateSteps).toBe("function");
      expect(typeof def.getCodeExamples).toBe("function");
    });
  });

  it("provides valid non-empty pseudocode for all 12 stack algorithms", () => {
    stackSlugs.forEach((slug) => {
      const pseudocode = getStackPseudocode(slug);
      expect(pseudocode.length, `Pseudocode for ${slug} must not be empty`).toBeGreaterThan(0);

      const registryPseudocode = getVisualizerPseudocode(slug);
      expect(registryPseudocode.length).toBeGreaterThan(0);
      expect(registryPseudocode).toEqual(pseudocode);
    });
  });

  describe("stack-push operation", () => {
    it("pushes onto a non-empty stack according to LIFO rules", () => {
      const initial = [10, 20, 30];
      const valueToPush = 40;
      const capacity = 8;
      const steps = generateStackPushSteps(initial, valueToPush, capacity);

      expect(steps.length).toBe(5);

      // Step 1: Initialize
      expect(steps[0].actionType).toBe("initialize");
      expect(steps[0].pseudocodeLine).toBe(1);

      // Step 2: Check Overflow
      expect(steps[1].actionType).toBe("compare");
      expect(steps[1].pseudocodeLine).toBe(2);

      // Step 3: Increment Top
      expect(steps[2].actionType).toBe("move-pointer");
      expect(steps[2].pseudocodeLine).toBe(3);

      // Step 4: Write Element
      expect(steps[3].actionType).toBe("push");
      expect(steps[3].pseudocodeLine).toBe(4);
      const stateAfterPush = steps[3].dataState as StackVisualState;
      expect(stateAfterPush.elements.length).toBe(4);
      expect(stateAfterPush.elements.at(-1)?.value).toBe(40);

      // Step 5: Complete
      expect(steps[4].actionType).toBe("complete");
      expect(steps[4].pseudocodeLine).toBe(5);
    });

    it("detects Stack Overflow when initial stack has reached max capacity", () => {
      const fullStack = [10, 20, 30, 40, 50];
      const capacity = 5;
      const steps = generateStackPushSteps(fullStack, 99, capacity);

      expect(steps.length).toBe(3);
      const errorStep = steps[2];
      expect(errorStep.actionType).toBe("error");
      expect(errorStep.title).toContain("Overflow");
      expect(errorStep.pseudocodeLine).toBe(2);
      const state = errorStep.dataState as StackVisualState;
      expect(state.elements.length).toBe(5); // unchanged
    });

    it("pushes onto an empty stack correctly (top goes from -1 to 0)", () => {
      const steps = generateStackPushSteps([], 15, 5);
      expect(steps.length).toBe(5);
      const finalState = steps[4].dataState as StackVisualState;
      expect(finalState.elements.length).toBe(1);
      expect(finalState.elements[0].value).toBe(15);
    });
  });

  describe("stack-pop operation", () => {
    it("pops the top element according to LIFO rules", () => {
      const initial = [10, 20, 30];
      const steps = generateStackPopSteps(initial, 8);

      expect(steps.length).toBe(5);

      // Step 1: Initialize
      expect(steps[0].actionType).toBe("initialize");
      expect(steps[0].pseudocodeLine).toBe(1);

      // Step 2: Check Underflow
      expect(steps[1].actionType).toBe("compare");
      expect(steps[1].pseudocodeLine).toBe(2);

      // Step 3: Access Top
      expect(steps[2].actionType).toBe("access");
      expect(steps[2].pseudocodeLine).toBe(3);
      expect(steps[2].variables?.Value).toBe(30);

      // Step 4: Decrement & Remove
      expect(steps[3].actionType).toBe("pop");
      expect(steps[3].pseudocodeLine).toBe(4);

      // Step 5: Complete
      expect(steps[4].actionType).toBe("complete");
      expect(steps[4].pseudocodeLine).toBe(5);
      const finalState = steps[4].dataState as StackVisualState;
      expect(finalState.elements.length).toBe(2);
      expect(finalState.elements.at(-1)?.value).toBe(20);
    });

    it("detects Stack Underflow when pop is called on an empty stack", () => {
      const emptyStack: number[] = [];
      const steps = generateStackPopSteps(emptyStack, 8);

      expect(steps.length).toBe(3);
      const errorStep = steps[2];
      expect(errorStep.actionType).toBe("error");
      expect(errorStep.title).toContain("Underflow");
      expect(errorStep.pseudocodeLine).toBe(2);
      expect(errorStep.variables?.Error).toBe("Stack Underflow");
    });
  });

  describe("stack-peek operation", () => {
    it("reads top element without removing or modifying the stack", () => {
      const initial = [5, 15, 25];
      const steps = generateStackPeekSteps(initial, 8);

      expect(steps.length).toBe(4);
      expect(steps[2].actionType).toBe("access");
      expect(steps[2].variables?.Value).toBe(25);
      expect(steps[3].actionType).toBe("complete");

      // Verify stack remained unchanged
      const finalState = steps[3].dataState as StackVisualState;
      expect(finalState.elements.length).toBe(3);
      expect(finalState.elements.map((e) => e.value)).toEqual([5, 15, 25]);
    });

    it("detects underflow when peek is called on an empty stack", () => {
      const steps = generateStackPeekSteps([], 8);
      expect(steps.length).toBe(2);
      expect(steps[1].actionType).toBe("error");
      expect(steps[1].title).toContain("Underflow");
    });
  });

  describe("stack-is-empty operation", () => {
    it("identifies empty stack correctly", () => {
      const steps = generateStackIsEmptySteps([], 8);
      expect(steps.length).toBe(2);
      expect(steps[1].variables?.isEmpty).toBe(true);
      expect(steps[1].title).toContain("Empty (true)");
    });

    it("identifies non-empty stack correctly", () => {
      const steps = generateStackIsEmptySteps([100], 8);
      expect(steps.length).toBe(2);
      expect(steps[1].variables?.isEmpty).toBe(false);
      expect(steps[1].title).toContain("Not Empty (false)");
    });
  });

  describe("stack-is-full operation", () => {
    it("identifies full stack correctly", () => {
      const full = [1, 2, 3, 4];
      const capacity = 4;
      const steps = generateStackIsFullSteps(full, capacity);
      expect(steps.length).toBe(2);
      expect(steps[1].variables?.isFull).toBe(true);
      expect(steps[1].title).toContain("Full (true)");
    });

    it("identifies non-full stack correctly", () => {
      const notFull = [1, 2];
      const capacity = 4;
      const steps = generateStackIsFullSteps(notFull, capacity);
      expect(steps.length).toBe(2);
      expect(steps[1].variables?.isFull).toBe(false);
      expect(steps[1].title).toContain("Not Full (false)");
    });
  });

  describe("stack-size operation", () => {
    it("returns correct size for various stacks", () => {
      const steps0 = generateStackSizeSteps([], 8);
      expect(steps0[1].variables?.Size).toBe(0);

      const steps4 = generateStackSizeSteps([10, 20, 30, 40], 8);
      expect(steps4[1].variables?.Size).toBe(4);
    });
  });

  describe("array-stack implementation", () => {
    it("generates 4 educational steps with valid top tracking and mechanics", () => {
      const steps = generateArrayStackSteps([10, 20, 30], 8);
      expect(steps.length).toBe(4);
      expect(steps[0].pseudocodeLine).toBe(1);
      expect(steps[1].pseudocodeLine).toBe(2);
      expect(steps[2].pseudocodeLine).toBe(3);
      expect(steps[3].pseudocodeLine).toBe(4);

      expect(steps[0].title).toContain("Structure");
      expect(steps[1].title).toContain("Top Index");
      expect(steps[2].title).toContain("Push");
      expect(steps[3].title).toContain("Pop");
    });
  });

  describe("balanced-parentheses application", () => {
    it("validates a fully balanced bracket sequence correctly", () => {
      const expr = "{[()]}";
      const steps = generateBalancedParenthesesSteps(expr);
      expect(steps.length).toBeGreaterThan(5);

      const finalStep = steps[steps.length - 1];
      expect(finalStep.actionType).toBe("complete");
      expect(finalStep.variables?.Result).toBe("Balanced");
      const finalState = finalStep.dataState as StackVisualState;
      expect(finalState.elements.length).toBe(0);
      expect(finalState.statusMessage?.text).toContain("balanced");
    });

    it("detects mismatch between bracket types", () => {
      const expr = "(]";
      const steps = generateBalancedParenthesesSteps(expr);
      const errorStep = steps.find((s) => s.actionType === "error");
      expect(errorStep).toBeDefined();
      expect(errorStep?.title).toContain("Mismatch");
      expect(errorStep?.variables?.Error).toBe("Mismatched Brackets");
    });

    it("detects premature closing bracket (underflow)", () => {
      const expr = ")";
      const steps = generateBalancedParenthesesSteps(expr);
      const errorStep = steps.find((s) => s.actionType === "error");
      expect(errorStep).toBeDefined();
      expect(errorStep?.title).toContain("Premature Closing");
      expect(errorStep?.variables?.Error).toBe("Empty Stack on Closing");
    });

    it("detects unclosed open brackets remaining at expression end", () => {
      const expr = "((";
      const steps = generateBalancedParenthesesSteps(expr);
      const finalStep = steps[steps.length - 1];
      expect(finalStep.actionType).toBe("error");
      expect(finalStep.title).toContain("Remaining Open Brackets");
      expect(finalStep.variables?.Result).toBe("Unbalanced");
    });

    it("ignores non-bracket characters in balanced-parentheses", () => {
      const expr = "(A + B) * [C - D]";
      const steps = generateBalancedParenthesesSteps(expr);
      const finalStep = steps[steps.length - 1];
      expect(finalStep.actionType).toBe("complete");
      expect(finalStep.variables?.Result).toBe("Balanced");
    });
  });

  describe("infix-to-postfix application (Shunting-Yard)", () => {
    it("converts simple arithmetic expressions respecting precedence", () => {
      const expr = "A+B*C";
      const steps = generateInfixToPostfixSteps(expr);
      expect(steps.length).toBeGreaterThan(6);

      const finalStep = steps[steps.length - 1];
      expect(finalStep.actionType).toBe("complete");
      const finalState = finalStep.dataState as StackVisualState;
      expect(finalState.elements.length).toBe(0);
      expect(finalState.outputTokens?.map((t) => t.label).join("")).toBe("ABC*+");
      expect(finalStep.variables?.FinalPostfix).toBe("A B C * +");
    });

    it("handles grouped sub-expressions with parentheses", () => {
      const expr = "(A+B)*C";
      const steps = generateInfixToPostfixSteps(expr);
      const finalStep = steps[steps.length - 1];
      expect(finalStep.actionType).toBe("complete");
      const finalState = finalStep.dataState as StackVisualState;
      expect(finalState.outputTokens?.map((t) => t.label).join("")).toBe("AB+C*");
    });

    it("detects syntax error on mismatched closing ')'", () => {
      const expr = "A + B ) * C";
      const steps = generateInfixToPostfixSteps(expr);
      const errorStep = steps.find((s) => s.actionType === "error");
      expect(errorStep).toBeDefined();
      expect(errorStep?.title).toContain("Mismatched ')'");
    });

    it("detects syntax error on unclosed opening '('", () => {
      const expr = "( A + B";
      const steps = generateInfixToPostfixSteps(expr);
      const errorStep = steps.find((s) => s.actionType === "error");
      expect(errorStep).toBeDefined();
      expect(errorStep?.title).toContain("Unclosed '('");
    });
  });

  describe("postfix-evaluation application", () => {
    it("evaluates a standard arithmetic postfix expression", () => {
      const expr = "5 3 + 2 *";
      const steps = generatePostfixEvaluationSteps(expr);
      expect(steps.length).toBeGreaterThan(6);

      const finalStep = steps[steps.length - 1];
      expect(finalStep.actionType).toBe("complete");
      expect(finalStep.variables?.FinalResult).toBe(16);
      const finalState = finalStep.dataState as StackVisualState;
      expect(finalState.elements.length).toBe(1);
      expect(finalState.elements[0].value).toBe(16);
    });

    it("evaluates subtraction and division with correct operand order", () => {
      const expr = "10 2 / 3 +";
      const steps = generatePostfixEvaluationSteps(expr);
      const finalStep = steps[steps.length - 1];
      expect(finalStep.variables?.FinalResult).toBe(8); // (10 / 2) + 3 = 8
    });

    it("detects invalid expression with too few operands", () => {
      const expr = "+";
      const steps = generatePostfixEvaluationSteps(expr);
      const errorStep = steps.find((s) => s.actionType === "error");
      expect(errorStep).toBeDefined();
      expect(errorStep?.title).toContain("Evaluation Error");
      expect(errorStep?.variables?.Error).toBe("Insufficient Operands");
    });

    it("detects division by zero error in postfix expression", () => {
      const expr = "10 0 /";
      const steps = generatePostfixEvaluationSteps(expr);
      const errorStep = steps.find((s) => s.actionType === "error");
      expect(errorStep).toBeDefined();
      expect(errorStep?.title).toContain("Division by Zero");
      expect(errorStep?.variables?.Error).toBe("Division by Zero");
    });

    it("detects incomplete evaluation when leftover operands remain on stack", () => {
      const expr = "10 20 30 +";
      const steps = generatePostfixEvaluationSteps(expr);
      const errorStep = steps.find((s) => s.actionType === "error");
      expect(errorStep).toBeDefined();
      expect(errorStep?.title).toContain("Incomplete Evaluation");
    });
  });

  describe("min-stack application", () => {
    it("tracks minimum element in O(1) across pushes, getMin, and pop", () => {
      const input = [5, 3, 7, 2];
      const steps = generateMinStackSteps(input);
      // 1 init + 4 pushes + 1 getMin + 1 pop + 1 complete = 8 steps
      expect(steps.length).toBe(8);

      // Check after push 5 -> min is 5
      const step1State = steps[1].dataState as StackVisualState;
      expect(step1State.minElements?.at(-1)?.value).toBe(5);

      // Check after push 3 -> min is 3
      const step2State = steps[2].dataState as StackVisualState;
      expect(step2State.minElements?.at(-1)?.value).toBe(3);

      // Check after push 7 -> min remains 3
      const step3State = steps[3].dataState as StackVisualState;
      expect(step3State.minElements?.at(-1)?.value).toBe(3);

      // Check after push 2 -> min is 2
      const step4State = steps[4].dataState as StackVisualState;
      expect(step4State.minElements?.at(-1)?.value).toBe(2);

      // Check getMin step
      expect(steps[5].variables?.MinValue).toBe(2);

      // Check after pop -> popped 2, min is restored to 3
      const step6State = steps[6].dataState as StackVisualState;
      expect(step6State.minElements?.at(-1)?.value).toBe(3);
      expect(step6State.elements.map((e) => e.value)).toEqual([5, 3, 7]);
    });

    it("supports custom capacity", () => {
      const steps = generateMinStackSteps([10, 20], 10);
      const initStep = steps[0].dataState as StackVisualState;
      expect(initStep.maxCapacity).toBe(10);
    });
  });

  describe("next-greater-element application", () => {
    it("computes NGE for array using monotonic stack pattern", () => {
      const input = [4, 5, 2, 25];
      const steps = generateNextGreaterElementSteps(input);
      expect(steps.length).toBeGreaterThan(input.length);

      const finalStep = steps[steps.length - 1];
      expect(finalStep.actionType).toBe("complete");
      const finalState = finalStep.dataState as StackVisualState;
      expect(finalState.resultMapping).toBeDefined();

      // [4 -> 5, 5 -> 25, 2 -> 25, 25 -> -1]
      expect(finalState.resultMapping?.[0]?.result).toBe(5);
      expect(finalState.resultMapping?.[1]?.result).toBe(25);
      expect(finalState.resultMapping?.[2]?.result).toBe(25);
      expect(finalState.resultMapping?.[3]?.result).toBe(-1);
    });

    it("supports custom capacity", () => {
      const steps = generateNextGreaterElementSteps([1, 2, 3], 12);
      const initStep = steps[0].dataState as StackVisualState;
      expect(initStep.maxCapacity).toBe(12);
    });
  });
});
