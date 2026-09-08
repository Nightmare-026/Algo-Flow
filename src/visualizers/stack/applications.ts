import { v4 as uuidv4 } from "uuid";
import type { VisualStep } from "@/types";
import type { InputToken, OutputToken, StackElement, StackVisualState } from "./types";

const clone = <T>(val: T): T => structuredClone(val);

// Helper to create step objects
function makeStep(
  stepNumber: number,
  title: string,
  description: string,
  operation: string,
  actionType: VisualStep["actionType"],
  dataState: StackVisualState,
  options: {
    highlights?: VisualStep["highlights"];
    variables?: VisualStep["variables"];
    pseudocodeLine?: number;
    codeLine?: number;
  } = {}
): VisualStep {
  return {
    id: uuidv4(),
    stepNumber,
    title,
    description,
    operation,
    actionType,
    dataState: clone(dataState),
    highlights: options.highlights ?? {},
    variables: options.variables ?? {},
    pseudocodeLine: options.pseudocodeLine,
    codeLine: options.codeLine ?? options.pseudocodeLine,
  };
}

/* ================================================================
   1. BALANCED PARENTHESES
   ================================================================ */
export function generateBalancedParenthesesSteps(rawInput?: string | number[]): VisualStep[] {
  let exprStr = "{[()]}";
  if (typeof rawInput === "string" && rawInput.trim().length > 0) {
    exprStr = rawInput.trim();
  } else if (Array.isArray(rawInput) && rawInput.length > 0) {
    exprStr = "{[()]}";
  }

  const chars = exprStr.replace(/\s+/g, "").split("");
  const inputTokens: InputToken[] = chars.map((char) => ({
    id: uuidv4(),
    label: char,
    status: "pending",
  }));

  const stack: StackElement[] = [];
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  const pairs: Record<string, string> = {
    ")": "(",
    "}": "{",
    "]": "[",
  };

  const isOpening = (ch: string) => ch === "(" || ch === "{" || ch === "[";
  const isClosing = (ch: string) => ch === ")" || ch === "}" || ch === "]";

  const state: StackVisualState = {
    elements: stack,
    inputTokens,
    activeTokenIndex: -1,
    maxCapacity: 10,
    statusMessage: { text: "Scanning expression for balanced brackets...", type: "info" },
  };

  // Step 1: Initialize
  steps.push(
    makeStep(
      stepNumber++,
      "Initialize Scanner",
      `Checking expression "${chars.join("")}" with an empty stack.`,
      "BalancedParentheses",
      "initialize",
      state,
      {
        variables: { Expression: chars.join(""), StackSize: 0 },
        pseudocodeLine: 1,
      }
    )
  );

  let isBalanced = true;

  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    state.activeTokenIndex = i;
    inputTokens[i].status = "current";

    if (isOpening(char)) {
      const newElem: StackElement = { id: uuidv4(), value: char };
      stack.push(newElem);
      inputTokens[i].status = "scanned";

      state.statusMessage = {
        text: `Opening bracket '${char}' pushed to stack.`,
        type: "info",
      };

      steps.push(
        makeStep(
          stepNumber++,
          `Push Opening Bracket '${char}'`,
          `Encountered opening bracket '${char}'. Pushed onto the stack.`,
          "BalancedParentheses",
          "push",
          state,
          {
            highlights: { inserted: [newElem.id], active: [newElem.id] },
            variables: { CurrentChar: char, Top: stack.length - 1, StackSize: stack.length },
            pseudocodeLine: 2,
          }
        )
      );
    } else if (isClosing(char)) {
      const expectedOpening = pairs[char];

      if (stack.length === 0) {
        inputTokens[i].status = "error";
        isBalanced = false;
        state.statusMessage = {
          text: `Unbalanced! Closing bracket '${char}' encountered with an empty stack.`,
          type: "error",
        };

        steps.push(
          makeStep(
            stepNumber++,
            `Unbalanced: Premature Closing '${char}'`,
            `Encountered closing bracket '${char}', but the stack is empty (underflow).`,
            "BalancedParentheses",
            "error",
            state,
            {
              highlights: { error: [] },
              variables: { CurrentChar: char, Error: "Empty Stack on Closing" },
              pseudocodeLine: 3,
            }
          )
        );
        return steps;
      }

      const topElem = stack[stack.length - 1];
      if (topElem.value === expectedOpening) {
        inputTokens[i].status = "matched";
        const popped = stack.pop()!;

        state.statusMessage = {
          text: `Matched '${char}' with top '${expectedOpening}'! Popped from stack.`,
          type: "success",
        };

        steps.push(
          makeStep(
            stepNumber++,
            `Match Found: '${topElem.value}' and '${char}'`,
            `Closing '${char}' correctly matches stack top '${topElem.value}'. Popped from stack.`,
            "BalancedParentheses",
            "pop",
            state,
            {
              highlights: { deleted: [popped.id] },
              variables: { MatchedPair: `${topElem.value} ... ${char}`, StackSize: stack.length },
              pseudocodeLine: 4,
            }
          )
        );
      } else {
        inputTokens[i].status = "error";
        isBalanced = false;
        state.statusMessage = {
          text: `Mismatch! Closing '${char}' does not match stack top '${topElem.value}'.`,
          type: "error",
        };

        steps.push(
          makeStep(
            stepNumber++,
            `Mismatch Error: '${char}' vs '${topElem.value}'`,
            `Closing bracket '${char}' expected opening '${expectedOpening}', but found '${topElem.value}'.`,
            "BalancedParentheses",
            "error",
            state,
            {
              highlights: { error: [topElem.id] },
              variables: {
                Expected: expectedOpening,
                Found: topElem.value,
                Error: "Mismatched Brackets",
              },
              pseudocodeLine: 3,
            }
          )
        );
        return steps;
      }
    } else {
      // Non-bracket characters (numbers, variables, operators) are skipped
      inputTokens[i].status = "scanned";
    }
  }

  // End of scan check
  state.activeTokenIndex = chars.length;
  if (stack.length === 0 && isBalanced) {
    state.statusMessage = {
      text: "Success! All brackets are perfectly balanced.",
      type: "success",
    };
    steps.push(
      makeStep(
        stepNumber++,
        "Balanced Expression (Valid)",
        "Scan complete and stack is empty. All opened brackets were closed in the correct LIFO order.",
        "BalancedParentheses",
        "complete",
        state,
        {
          variables: { Result: "Balanced", TotalBrackets: chars.length },
          pseudocodeLine: 5,
        }
      )
    );
  } else {
    state.statusMessage = {
      text: `Unbalanced! Scan ended with ${stack.length} unclosed bracket(s) remaining in stack.`,
      type: "error",
    };
    steps.push(
      makeStep(
        stepNumber++,
        "Unbalanced: Remaining Open Brackets",
        `Scan completed, but ${stack.length} bracket(s) were never closed. Expression is invalid.`,
        "BalancedParentheses",
        "error",
        state,
        {
          highlights: { error: stack.map((e) => e.id) },
          variables: { UnclosedCount: stack.length, Result: "Unbalanced" },
          pseudocodeLine: 5,
        }
      )
    );
  }

  return steps;
}

/* ================================================================
   2. INFIX TO POSTFIX CONVERSION (Shunting-Yard)
   ================================================================ */
export function generateInfixToPostfixSteps(rawInput?: string | number[]): VisualStep[] {
  let exprStr = "A + B * C";
  if (typeof rawInput === "string" && rawInput.trim().length > 0) {
    exprStr = rawInput.trim();
  }

  // Tokenize while preserving operators and parentheses
  const rawTokens = exprStr
    .replace(/\s+/g, "")
    .split(/([+\-*/^()])/g)
    .filter((t) => t.length > 0);

  const tokens = rawTokens.length > 0 ? rawTokens : ["A", "+", "B", "*", "C"];

  const inputTokens: InputToken[] = tokens.map((label) => ({
    id: uuidv4(),
    label,
    status: "pending",
  }));

  const stack: StackElement[] = [];
  const outputTokens: OutputToken[] = [];
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  const precedence: Record<string, number> = {
    "^": 3,
    "*": 2,
    "/": 2,
    "+": 1,
    "-": 1,
    "(": 0,
  };

  const isOperator = (t: string) => ["+", "-", "*", "/", "^"].includes(t);
  const isOperand = (t: string) => !isOperator(t) && t !== "(" && t !== ")";

  const state: StackVisualState = {
    elements: stack,
    inputTokens,
    outputTokens,
    activeTokenIndex: -1,
    maxCapacity: 10,
    statusMessage: { text: "Starting Infix to Postfix conversion...", type: "info" },
  };

  steps.push(
    makeStep(
      stepNumber++,
      "Initialize Shunting-Yard",
      `Converting infix expression "${tokens.join(" ")}" to postfix notation.`,
      "InfixToPostfix",
      "initialize",
      state,
      {
        variables: { Infix: tokens.join(" "), Output: "" },
        pseudocodeLine: 1,
      }
    )
  );

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    state.activeTokenIndex = i;
    inputTokens[i].status = "current";

    if (isOperand(token)) {
      const outElem: OutputToken = { id: uuidv4(), label: token };
      outputTokens.push(outElem);
      inputTokens[i].status = "scanned";
      state.statusMessage = { text: `Operand '${token}' appended to output stream.`, type: "info" };

      steps.push(
        makeStep(
          stepNumber++,
          `Output Operand '${token}'`,
          `Token '${token}' is an operand. Append directly to postfix output stream.`,
          "InfixToPostfix",
          "access",
          state,
          {
            highlights: { active: [outElem.id] },
            variables: {
              Token: token,
              PostfixOutput: outputTokens.map((o) => o.label).join(" "),
            },
            pseudocodeLine: 2,
          }
        )
      );
    } else if (token === "(") {
      const newElem: StackElement = { id: uuidv4(), value: "(" };
      stack.push(newElem);
      inputTokens[i].status = "scanned";
      state.statusMessage = {
        text: "Left parenthesis '(' pushed to operator stack.",
        type: "info",
      };

      steps.push(
        makeStep(
          stepNumber++,
          "Push '(' to Stack",
          "Left parenthesis '(' marks the start of a nested sub-expression. Push to operator stack.",
          "InfixToPostfix",
          "push",
          state,
          {
            highlights: { inserted: [newElem.id] },
            variables: { Token: "(", StackTop: "(" },
            pseudocodeLine: 3,
          }
        )
      );
    } else if (token === ")") {
      inputTokens[i].status = "scanned";
      state.statusMessage = {
        text: "Right parenthesis ')' encountered. Unwinding operators until '('.",
        type: "info",
      };

      while (stack.length > 0 && stack[stack.length - 1].value !== "(") {
        const popped = stack.pop()!;
        outputTokens.push({ id: uuidv4(), label: String(popped.value) });

        steps.push(
          makeStep(
            stepNumber++,
            `Unwind Operator '${popped.value}'`,
            `Popped '${popped.value}' from stack to output until matching '(' is reached.`,
            "InfixToPostfix",
            "pop",
            state,
            {
              highlights: { deleted: [popped.id] },
              variables: {
                Popped: popped.value,
                PostfixOutput: outputTokens.map((o) => o.label).join(" "),
              },
              pseudocodeLine: 4,
            }
          )
        );
      }

      if (stack.length > 0 && stack[stack.length - 1].value === "(") {
        const discarded = stack.pop()!;
        steps.push(
          makeStep(
            stepNumber++,
            "Discard '('",
            "Matched pair closed. Discarding left parenthesis '(' from stack.",
            "InfixToPostfix",
            "delete",
            state,
            {
              highlights: { deleted: [discarded.id] },
              variables: { Discarded: "(" },
              pseudocodeLine: 4,
            }
          )
        );
      } else {
        inputTokens[i].status = "error";
        state.statusMessage = {
          text: "Syntax Error! Mismatched closing parenthesis ')' without opening '('.",
          type: "error",
        };
        steps.push(
          makeStep(
            stepNumber++,
            "Mismatched ')'",
            "Encountered ')' without a matching '(' on the stack.",
            "InfixToPostfix",
            "error",
            state,
            {
              highlights: { error: [] },
              variables: { Token: ")", Error: "Mismatched Closing Parenthesis" },
              pseudocodeLine: 4,
            }
          )
        );
        return steps;
      }
    } else if (isOperator(token)) {
      inputTokens[i].status = "scanned";
      const currPrec = precedence[token] || 0;

      while (
        stack.length > 0 &&
        stack[stack.length - 1].value !== "(" &&
        (precedence[String(stack[stack.length - 1].value)] || 0) >= currPrec
      ) {
        const popped = stack.pop()!;
        outputTokens.push({ id: uuidv4(), label: String(popped.value) });

        steps.push(
          makeStep(
            stepNumber++,
            `Precedence Pop: '${popped.value}' >= '${token}'`,
            `Operator '${popped.value}' on top of stack has greater/equal precedence than incoming '${token}'. Pop to output.`,
            "InfixToPostfix",
            "pop",
            state,
            {
              highlights: { deleted: [popped.id] },
              variables: {
                IncomingOperator: token,
                PoppedOperator: popped.value,
                PostfixOutput: outputTokens.map((o) => o.label).join(" "),
              },
              pseudocodeLine: 5,
              codeLine: 5,
            }
          )
        );
      }

      const newElem: StackElement = { id: uuidv4(), value: token };
      stack.push(newElem);
      state.statusMessage = { text: `Pushed operator '${token}' onto stack.`, type: "info" };

      steps.push(
        makeStep(
          stepNumber++,
          `Push Operator '${token}'`,
          `Pushed operator '${token}' onto operator stack.`,
          "InfixToPostfix",
          "push",
          state,
          {
            highlights: { inserted: [newElem.id] },
            variables: { Operator: token, Precedence: currPrec },
            pseudocodeLine: 5,
            codeLine: 5,
          }
        )
      );
    }
  }

  // Pop any remaining operators
  let hasUnclosedParen = false;
  state.activeTokenIndex = tokens.length;
  while (stack.length > 0) {
    const popped = stack.pop()!;
    if (popped.value === "(") {
      hasUnclosedParen = true;
    } else {
      outputTokens.push({ id: uuidv4(), label: String(popped.value) });
      steps.push(
        makeStep(
          stepNumber++,
          `Empty Remaining: '${popped.value}'`,
          `Scan completed. Popping remaining operator '${popped.value}' to output stream.`,
          "InfixToPostfix",
          "pop",
          state,
          {
            highlights: { deleted: [popped.id] },
            variables: {
              RemainingPopped: popped.value,
              PostfixOutput: outputTokens.map((o) => o.label).join(" "),
            },
            pseudocodeLine: 6,
            codeLine: 6,
          }
        )
      );
    }
  }

  if (hasUnclosedParen) {
    state.statusMessage = {
      text: "Syntax Error! Infix expression has unclosed '(' parenthesis.",
      type: "error",
    };
    steps.push(
      makeStep(
        stepNumber++,
        "Unclosed '(' Error",
        "Expression ended with unclosed '(' parenthesis on the stack.",
        "InfixToPostfix",
        "error",
        state,
        {
          highlights: { error: [] },
          variables: { Error: "Unclosed '('" },
          pseudocodeLine: 6,
          codeLine: 6,
        }
      )
    );
    return steps;
  }

  // Complete
  state.statusMessage = {
    text: `Conversion Complete! Postfix: ${outputTokens.map((o) => o.label).join(" ")}`,
    type: "success",
  };
  steps.push(
    makeStep(
      stepNumber++,
      "Conversion Complete",
      `Infix expression successfully converted to postfix: "${outputTokens.map((o) => o.label).join(" ")}".`,
      "InfixToPostfix",
      "complete",
      state,
      {
        variables: {
          FinalPostfix: outputTokens.map((o) => o.label).join(" "),
        },
        pseudocodeLine: 6,
        codeLine: 6,
      }
    )
  );

  return steps;
}

/* ================================================================
   3. POSTFIX EXPRESSION EVALUATION
   ================================================================ */
export function generatePostfixEvaluationSteps(rawInput?: string | number[]): VisualStep[] {
  let exprStr = "5 3 + 2 *";
  if (typeof rawInput === "string" && rawInput.trim().length > 0) {
    exprStr = rawInput.trim();
  } else if (Array.isArray(rawInput) && rawInput.length > 0) {
    if (rawInput.length === 1) {
      exprStr = String(rawInput[0]);
    } else {
      exprStr = `${rawInput[0]} ${rawInput[1]} +`;
      for (let k = 2; k < rawInput.length; k++) {
        exprStr += ` ${rawInput[k]} +`;
      }
    }
  }

  const tokens = exprStr.split(/\s+/).filter((t) => t.length > 0);
  const inputTokens: InputToken[] = tokens.map((label) => ({
    id: uuidv4(),
    label,
    status: "pending",
  }));

  const stack: StackElement[] = [];
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  const isOperator = (t: string) => ["+", "-", "*", "/", "^"].includes(t);

  const state: StackVisualState = {
    elements: stack,
    inputTokens,
    activeTokenIndex: -1,
    maxCapacity: 8,
    statusMessage: { text: "Starting Postfix Expression Evaluation...", type: "info" },
  };

  steps.push(
    makeStep(
      stepNumber++,
      "Initialize Postfix Evaluation",
      `Evaluating postfix expression "${tokens.join(" ")}" using an operand stack.`,
      "PostfixEvaluation",
      "initialize",
      state,
      {
        variables: { Expression: tokens.join(" "), StackSize: 0 },
        pseudocodeLine: 1,
      }
    )
  );

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    state.activeTokenIndex = i;
    inputTokens[i].status = "current";

    if (!isOperator(token)) {
      const numVal = Number(token);
      const val = isNaN(numVal) ? token : numVal;
      const newElem: StackElement = { id: uuidv4(), value: val };
      stack.push(newElem);
      inputTokens[i].status = "scanned";

      state.statusMessage = { text: `Operand '${token}' pushed onto operand stack.`, type: "info" };
      state.computation = undefined;

      steps.push(
        makeStep(
          stepNumber++,
          `Push Operand '${token}'`,
          `Token '${token}' is an operand. Push onto operand stack.`,
          "PostfixEvaluation",
          "push",
          state,
          {
            highlights: { inserted: [newElem.id] },
            variables: { Operand: val, Top: stack.length - 1, StackSize: stack.length },
            pseudocodeLine: 2,
          }
        )
      );
    } else {
      inputTokens[i].status = "scanned";

      if (stack.length < 2) {
        inputTokens[i].status = "error";
        state.statusMessage = {
          text: `Invalid Expression! Operator '${token}' requires 2 operands.`,
          type: "error",
        };

        steps.push(
          makeStep(
            stepNumber++,
            "Evaluation Error",
            `Insufficient operands on stack for operator '${token}'.`,
            "PostfixEvaluation",
            "error",
            state,
            {
              highlights: { error: stack.map((e) => e.id) },
              variables: { Operator: token, Error: "Insufficient Operands" },
              pseudocodeLine: 3,
            }
          )
        );
        return steps;
      }

      const opB = stack.pop()!;
      const opA = stack.pop()!;

      const numA = Number(opA.value);
      const numB = Number(opB.value);
      let res = 0;

      if (token === "/" && numB === 0) {
        inputTokens[i].status = "error";
        state.statusMessage = {
          text: `Division by Zero! Cannot divide ${numA} by 0.`,
          type: "error",
        };
        steps.push(
          makeStep(
            stepNumber++,
            "Division by Zero",
            `Encountered '${numA} / 0'. Division by zero is undefined in mathematics.`,
            "PostfixEvaluation",
            "error",
            state,
            {
              highlights: { error: [] },
              variables: { OperandA: numA, OperandB: 0, Error: "Division by Zero" },
              pseudocodeLine: 3,
            }
          )
        );
        return steps;
      }

      if (token === "+") res = numA + numB;
      else if (token === "-") res = numA - numB;
      else if (token === "*") res = numA * numB;
      else if (token === "/") res = Math.floor(numA / numB);
      else if (token === "^") res = Math.pow(numA, numB);

      const formula = `${numA} ${token} ${numB} = ${res}`;
      state.computation = { formula, result: res };
      state.statusMessage = { text: `Computed: ${formula}`, type: "success" };

      const resElem: StackElement = { id: uuidv4(), value: res };
      stack.push(resElem);

      steps.push(
        makeStep(
          stepNumber++,
          `Compute: ${formula}`,
          `Popped ${numB} and ${numA}. Applied '${token}': ${formula}. Pushed result ${res} to stack.`,
          "PostfixEvaluation",
          "compare",
          state,
          {
            highlights: { inserted: [resElem.id], active: [resElem.id] },
            variables: {
              Operation: formula,
              OperandA: numA,
              OperandB: numB,
              Result: res,
            },
            pseudocodeLine: 3,
          }
        )
      );
    }
  }

  // Final result
  state.activeTokenIndex = tokens.length;
  if (stack.length === 1) {
    const finalVal = stack[0].value;
    state.statusMessage = { text: `Final Evaluation Result = ${finalVal}`, type: "success" };

    steps.push(
      makeStep(
        stepNumber++,
        `Evaluation Complete: ${finalVal}`,
        `Expression successfully evaluated. The final value on top of the stack is ${finalVal}.`,
        "PostfixEvaluation",
        "complete",
        state,
        {
          highlights: { found: [stack[0].id] },
          variables: { FinalResult: finalVal },
          pseudocodeLine: 4,
        }
      )
    );
  } else if (stack.length > 1) {
    state.statusMessage = {
      text: `Incomplete Expression! ${stack.length} operands remain on stack without operators.`,
      type: "error",
    };
    steps.push(
      makeStep(
        stepNumber++,
        "Incomplete Evaluation",
        `Scan complete, but ${stack.length} operands remain on stack. Expression lacks sufficient operators.`,
        "PostfixEvaluation",
        "error",
        state,
        {
          highlights: { error: stack.map((e) => e.id) },
          variables: { RemainingOperands: stack.map((e) => e.value).join(", ") },
          pseudocodeLine: 4,
        }
      )
    );
  }

  return steps;
}

/* ================================================================
   4. MIN STACK (O(1) Minimum Element Retrieval)
   ================================================================ */
export function generateMinStackSteps(rawInput?: number[], capacity: number = 8): VisualStep[] {
  const maxCap = Math.min(15, Math.max(4, capacity));
  const data =
    Array.isArray(rawInput) && rawInput.length > 0
      ? rawInput.slice(0, maxCap)
      : [18, 19, 29, 15, 16];

  const mainStack: StackElement[] = [];
  const minStack: StackElement[] = [];
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  const state: StackVisualState = {
    elements: mainStack,
    minElements: minStack,
    maxCapacity: maxCap,
    statusMessage: {
      text: "MinStack tracks the current minimum element in O(1) time.",
      type: "info",
    },
  };

  steps.push(
    makeStep(
      stepNumber++,
      "Initialize MinStack",
      "Using two stacks: Main Stack (holds all values) and Min Tracker Stack (tracks minimum at each depth).",
      "MinStack",
      "initialize",
      state,
      {
        variables: { ElementsToPush: data.join(", "), CurrentMin: "None" },
        pseudocodeLine: 1,
      }
    )
  );

  // Push values
  for (let i = 0; i < data.length; i++) {
    const val = data[i];
    const prevMin = minStack.length > 0 ? Number(minStack[minStack.length - 1].value) : val;
    const newMin = minStack.length === 0 ? val : Math.min(val, prevMin);

    const mainElem: StackElement = { id: uuidv4(), value: val };
    const minElem: StackElement = { id: uuidv4(), value: newMin };

    mainStack.push(mainElem);
    minStack.push(minElem);

    state.statusMessage = {
      text: `Pushed ${val}. Current Minimum: min(${val}, ${prevMin}) = ${newMin}`,
      type: "info",
    };

    steps.push(
      makeStep(
        stepNumber++,
        `Push(${val}) -> Min is ${newMin}`,
        `Pushed ${val} onto Main Stack. Min Stack updates to ${newMin}.`,
        "MinStack",
        "push",
        state,
        {
          highlights: { inserted: [mainElem.id], active: [minElem.id] },
          variables: { PushedValue: val, CurrentMin: newMin, StackDepth: mainStack.length },
          pseudocodeLine: 2,
        }
      )
    );
  }

  // Demonstrate getMin O(1)
  const currentMin = minStack[minStack.length - 1].value;
  state.statusMessage = {
    text: `getMin() returns ${currentMin} in O(1) from top of Min Stack.`,
    type: "success",
  };

  steps.push(
    makeStep(
      stepNumber++,
      `getMin() = ${currentMin}`,
      `getMin() directly inspects the top of Min Stack in O(1) time without searching: ${currentMin}.`,
      "MinStack",
      "access",
      state,
      {
        highlights: { found: [minStack[minStack.length - 1].id] },
        variables: { MinValue: currentMin, TimeComplexity: "O(1)" },
        pseudocodeLine: 4,
      }
    )
  );

  // Demonstrate Pop restoring previous minimum
  if (mainStack.length > 1) {
    const poppedMain = mainStack.pop()!;
    minStack.pop();
    const restoredMin = minStack[minStack.length - 1].value;

    state.statusMessage = {
      text: `Popped ${poppedMain.value}. Minimum restored to ${restoredMin} in O(1).`,
      type: "warning",
    };

    steps.push(
      makeStep(
        stepNumber++,
        `Pop() -> Minimum Restores to ${restoredMin}`,
        `Popped top element ${poppedMain.value} from both Main Stack and Min Stack. Prior minimum ${restoredMin} automatically restored.`,
        "MinStack",
        "pop",
        state,
        {
          highlights: { deleted: [poppedMain.id] },
          variables: {
            PoppedValue: poppedMain.value,
            NewCurrentMin: restoredMin,
            StackDepth: mainStack.length,
          },
          pseudocodeLine: 3,
        }
      )
    );
  }

  // Complete
  steps.push(
    makeStep(
      stepNumber++,
      "MinStack Operations Complete",
      "Both stacks maintain synchronous depth. Push, Pop, and getMin all operate in O(1) time.",
      "MinStack",
      "complete",
      state,
      {
        variables: { FinalMin: minStack[minStack.length - 1]?.value, Size: mainStack.length },
        pseudocodeLine: 4,
      }
    )
  );

  return steps;
}

/* ================================================================
   5. NEXT GREATER ELEMENT (Monotonic Stack)
   ================================================================ */
export function generateNextGreaterElementSteps(
  rawInput?: number[],
  capacity: number = 8
): VisualStep[] {
  const maxCap = Math.min(15, Math.max(4, capacity));
  const arr =
    Array.isArray(rawInput) && rawInput.length > 0 ? rawInput.slice(0, maxCap) : [4, 5, 2, 25];

  const stack: StackElement[] = []; // holds indices
  const results: Array<number | string> = new Array(arr.length).fill("-");
  const steps: VisualStep[] = [];
  let stepNumber = 1;

  const buildResultMapping = () =>
    arr.map((val, idx) => ({
      id: uuidv4(),
      index: idx,
      value: val,
      result: results[idx],
    }));

  const state: StackVisualState = {
    elements: stack,
    maxCapacity: maxCap,
    resultMapping: buildResultMapping(),
    statusMessage: {
      text: "Monotonic Stack finds the Next Greater Element for each position in O(n).",
      type: "info",
    },
  };

  steps.push(
    makeStep(
      stepNumber++,
      "Initialize Monotonic Stack",
      `Finding Next Greater Element for array [${arr.join(", ")}]. Stack will maintain decreasing indices.`,
      "NextGreaterElement",
      "initialize",
      state,
      {
        variables: { Array: arr.join(", "), StackSize: 0 },
        pseudocodeLine: 1,
      }
    )
  );

  for (let i = 0; i < arr.length; i++) {
    const currentVal = arr[i];

    state.statusMessage = {
      text: `Inspecting arr[${i}] = ${currentVal}. Comparing with stack top elements.`,
      type: "info",
    };

    // Pop all elements smaller than currentVal
    while (stack.length > 0) {
      const topIndex = Number(stack[stack.length - 1].value);
      const topVal = arr[topIndex];

      if (topVal < currentVal) {
        const popped = stack.pop()!;
        results[topIndex] = currentVal;
        state.resultMapping = buildResultMapping();

        state.statusMessage = {
          text: `Found Next Greater Element for arr[${topIndex}] (${topVal}) -> ${currentVal}!`,
          type: "success",
        };

        steps.push(
          makeStep(
            stepNumber++,
            `NGE Found: arr[${topIndex}]=${topVal} -> ${currentVal}`,
            `Current element ${currentVal} is greater than stack top arr[${topIndex}]=${topVal}. Pop index ${topIndex} and set NGE = ${currentVal}.`,
            "NextGreaterElement",
            "compare",
            state,
            {
              highlights: { deleted: [popped.id], active: [popped.id] },
              variables: {
                TargetIndex: topIndex,
                TargetValue: topVal,
                NextGreater: currentVal,
              },
              pseudocodeLine: 3,
            }
          )
        );
      } else {
        break;
      }
    }

    // Push current index
    const indexElem: StackElement = { id: uuidv4(), value: i };
    stack.push(indexElem);

    state.statusMessage = {
      text: `Pushed index ${i} (value ${currentVal}) to monotonic stack.`,
      type: "info",
    };

    steps.push(
      makeStep(
        stepNumber++,
        `Push Index ${i} (arr[${i}]=${currentVal})`,
        `Pushed index ${i} to stack. Waiting for a future element greater than ${currentVal}.`,
        "NextGreaterElement",
        "push",
        state,
        {
          highlights: { inserted: [indexElem.id] },
          variables: { PushedIndex: i, PushedValue: currentVal, StackSize: stack.length },
          pseudocodeLine: 4,
        }
      )
    );
  }

  // Any remaining indices have no greater element (-1)
  while (stack.length > 0) {
    const remaining = stack.pop()!;
    const remIndex = Number(remaining.value);
    results[remIndex] = -1;
    state.resultMapping = buildResultMapping();

    steps.push(
      makeStep(
        stepNumber++,
        `No Greater Element for arr[${remIndex}]=${arr[remIndex]}`,
        `No greater element exists to the right of arr[${remIndex}]=${arr[remIndex]}. Set NGE = -1.`,
        "NextGreaterElement",
        "pop",
        state,
        {
          highlights: { deleted: [remaining.id] },
          variables: { Index: remIndex, Value: arr[remIndex], NGE: -1 },
          pseudocodeLine: 5,
        }
      )
    );
  }

  state.statusMessage = {
    text: `Completed! Next Greater Elements: [${results.join(", ")}]`,
    type: "success",
  };

  steps.push(
    makeStep(
      stepNumber++,
      "Monotonic Scan Complete",
      `All next greater elements resolved: [${results.join(", ")}] in single-pass O(n) time.`,
      "NextGreaterElement",
      "complete",
      state,
      {
        variables: { ResultArray: results.join(", ") },
        pseudocodeLine: 5,
      }
    )
  );

  return steps;
}
