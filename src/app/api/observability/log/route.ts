import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkRateLimit } from "@/lib/security/rate-limit";

const MAX_BODY_BYTES = 32 * 1024;
const MAX_CONTEXT_BYTES = 8 * 1024;

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rateLimit = await checkRateLimit(`error_log:${ip}`, 30, 60000);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many error reports." }, { status: 429 });
    }

    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Error report is too large." }, { status: 413 });
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Error report is too large." }, { status: 413 });
    }

    const body = JSON.parse(rawBody);
    const { error_name, error_message, error_stack, context, url, user_agent } = body || {};

    if (!error_name || !error_message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const safeContext = typeof context === "object" && context !== null ? context : {};
    if (JSON.stringify(safeContext).length > MAX_CONTEXT_BYTES) {
      return NextResponse.json({ error: "Error context is too large." }, { status: 413 });
    }

    const admin = createAdminClient();
    if (!admin) {
      return NextResponse.json({ error: "Error reporting is unavailable." }, { status: 503 });
    }

    const { error } = await admin.from("application_error_logs").insert({
      user_id: user?.id ?? null,
      error_name: String(error_name).slice(0, 100),
      error_message: String(error_message).slice(0, 1000),
      error_stack: error_stack ? String(error_stack).slice(0, 5000) : null,
      context: safeContext,
      url: url ? String(url).slice(0, 500) : null,
      user_agent: user_agent ? String(user_agent).slice(0, 500) : null,
    });
    if (error) {
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    // Fail safely without crashing
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
