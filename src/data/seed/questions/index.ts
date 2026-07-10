import questionsData from "./questions.json";

export type QuestionData = {
  ds: string;
  topic: string;
  subtopic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  q: string;
  options: string[];
  correct: "A" | "B" | "C" | "D";
  explanation: string;
};

export const allQuestions = questionsData as QuestionData[];

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "by",
  "in",
  "is",
  "of",
  "the",
  "to",
  "with",
]);

const normalizeTokens = (value: string): string[] =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));

const shuffle = <T>(items: T[]): T[] => [...items].sort(() => 0.5 - Math.random());

function mapDataStructure(algorithmId: string): string {
  if (algorithmId.includes("arr")) return "Array";
  if (algorithmId.includes("stack")) return "Stack";
  if (algorithmId.includes("queue")) return "Queue";
  if (algorithmId.includes("ll")) return "Linked List";
  if (algorithmId.includes("tree")) return "Tree";
  if (algorithmId.includes("graph")) return "Graph";
  if (algorithmId.includes("hset")) return "Hash Set";
  if (algorithmId.includes("hash")) return "Hash Table";
  if (algorithmId.includes("string")) return "String";
  if (algorithmId.includes("matrix")) return "Matrix";
  return "";
}

function questionKey(question: QuestionData): string {
  return `${question.ds}|${question.subtopic}|${question.q}`;
}

function scoreSubtopic(question: QuestionData, searchWeights: Map<string, number>): number {
  return normalizeTokens(question.subtopic).reduce(
    (score, token) => score + (searchWeights.get(token) ?? 0),
    0
  );
}

/**
 * Prefer questions for the exact algorithm subtopic, then fill with same-DS
 * questions so every quiz can still render five items when a subtopic has less coverage.
 */
export function getQuestionsForAlgorithm(
  algorithmId: string,
  limit: number = 5,
  algorithmName: string = "",
  algorithmSlug: string = ""
): QuestionData[] {
  const mappedDS = mapDataStructure(algorithmId);
  const dsQuestions = mappedDS
    ? allQuestions.filter((question) => question.ds === mappedDS)
    : allQuestions;

  const searchWeights = new Map<string, number>();
  for (const token of normalizeTokens(algorithmName)) {
    searchWeights.set(token, Math.max(searchWeights.get(token) ?? 0, 1));
  }
  for (const token of normalizeTokens(algorithmSlug.replace(/-/g, " "))) {
    searchWeights.set(token, Math.max(searchWeights.get(token) ?? 0, 3));
  }

  const scoredQuestions = dsQuestions
    .map((question) => ({ question, score: scoreSubtopic(question, searchWeights) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ question }) => question);

  const picked: QuestionData[] = [];
  const seen = new Set<string>();

  for (const question of scoredQuestions) {
    if (picked.length >= limit) break;
    const key = questionKey(question);
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(question);
  }

  for (const question of shuffle(dsQuestions)) {
    if (picked.length >= limit) break;
    const key = questionKey(question);
    if (seen.has(key)) continue;
    seen.add(key);
    picked.push(question);
  }

  return picked;
}