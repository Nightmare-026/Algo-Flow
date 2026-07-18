import type { CodeLanguage } from "@/types";
import { REQUIRED_CODE_LANGUAGES, type CodeLineMapping, type RequiredCodeLanguage } from "./types";

const requiredLanguages = new Set<CodeLanguage>(REQUIRED_CODE_LANGUAGES);

function isRequiredCodeLanguage(language: CodeLanguage): language is RequiredCodeLanguage {
  return requiredLanguages.has(language);
}

/**
 * Resolves a generator's stable logical line to the selected language's
 * physical code-example line. Unmigrated definitions retain their existing
 * direct-line behavior until their authored mapping passes readiness.
 */
export function resolvePhysicalCodeLine(
  mappings: ReadonlyArray<CodeLineMapping> | undefined,
  logicalLine: number | undefined,
  language: CodeLanguage
) {
  if (!logicalLine) return undefined;
  if (!mappings) return logicalLine;
  if (!isRequiredCodeLanguage(language)) return undefined;
  return mappings.find((mapping) => mapping.logicalLine === logicalLine)?.lines[language];
}
