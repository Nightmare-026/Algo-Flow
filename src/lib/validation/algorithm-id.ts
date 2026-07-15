const MAX_ALGORITHM_ID_LENGTH = 200;

export function normalizeAlgorithmId(value: string): string | null {
  const normalized = value.trim();
  if (!normalized || normalized.length > MAX_ALGORITHM_ID_LENGTH) return null;
  return normalized;
}
