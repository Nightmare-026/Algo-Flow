import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeInternalPath(value: string | null, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;

  try {
    const parsed = new URL(value, "https://algo-flow.local");
    if (parsed.origin !== "https://algo-flow.local") return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

function configuredSiteOrigin(requestOrigin: string) {
  const candidate = process.env.NEXT_PUBLIC_SITE_URL;
  if (candidate) {
    try {
      const configured = new URL(candidate);
      if (configured.protocol === "https:" || configured.protocol === "http:") {
        return configured.origin;
      }
    } catch {
      // Production authentication redirects fail closed below.
    }
  }

  return process.env.NODE_ENV === "development" ? requestOrigin : null;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeInternalPath(requestUrl.searchParams.get("next"));
  const redirectOrigin = configuredSiteOrigin(requestUrl.origin);

  if (!redirectOrigin) {
    return NextResponse.json(
      { error: "Authentication redirect origin is not configured." },
      { status: 500 }
    );
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(new URL(next, redirectOrigin));
    }
  }

  const loginUrl = new URL("/login", redirectOrigin);
  loginUrl.searchParams.set("error", "Could not verify account");
  return NextResponse.redirect(loginUrl);
}
