import { NextResponse } from "next/server";
import { resolveAuthOrigin, safeInternalPath } from "@/lib/auth/redirects";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = safeInternalPath(requestUrl.searchParams.get("next"));
  const redirectOrigin = resolveAuthOrigin(process.env, requestUrl.origin);

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
