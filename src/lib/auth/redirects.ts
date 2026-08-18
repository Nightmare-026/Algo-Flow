type AuthEnvironment = Record<string, string | undefined>;

function normalizeOrigin(value: string | undefined) {
  if (!value) return null;

  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.origin : null;
  } catch {
    return null;
  }
}

export function safeInternalPath(
  value: FormDataEntryValue | string | null,
  fallback = "/dashboard"
) {
  if (
    typeof value !== "string" ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\r\n\t\0\s\\]/.test(value)
  ) {
    return fallback;
  }

  try {
    const parsed = new URL(value, "https://algo-flow.local");
    if (parsed.origin !== "https://algo-flow.local") return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function resolveAuthOrigin(environment: AuthEnvironment, requestOrigin?: string | null) {
  const configuredOrigin = normalizeOrigin(environment.NEXT_PUBLIC_SITE_URL);
  if (
    configuredOrigin &&
    (environment.NODE_ENV !== "production" || new URL(configuredOrigin).protocol === "https:")
  ) {
    return configuredOrigin;
  }

  const vercelHost =
    environment.VERCEL_ENV === "production"
      ? (environment.VERCEL_PROJECT_PRODUCTION_URL ?? environment.VERCEL_URL)
      : (environment.VERCEL_URL ?? environment.VERCEL_PROJECT_PRODUCTION_URL);
  const vercelOrigin = normalizeOrigin(vercelHost);
  if (vercelOrigin) return vercelOrigin;

  const normalizedRequestOrigin = normalizeOrigin(requestOrigin ?? undefined);
  if (environment.NODE_ENV !== "production" && normalizedRequestOrigin) {
    const hostname = new URL(normalizedRequestOrigin).hostname;
    if (["localhost", "127.0.0.1"].includes(hostname)) return normalizedRequestOrigin;
  }

  return environment.NODE_ENV === "production" ? null : "http://localhost:3000";
}
