import type { StepPredicate } from "@/types";

export function formatPredicate(predicate: StepPredicate): string {
  return `${predicate.left} ${predicate.operator} ${predicate.right}`;
}

export function formatPredicateDecision(
  predicate: StepPredicate,
  trueMessage: string,
  falseMessage: string
): string {
  return `${predicate.result ? "Yes" : "No"}, ${formatPredicate(predicate)}. ${
    predicate.result ? trueMessage : falseMessage
  }`;
}
