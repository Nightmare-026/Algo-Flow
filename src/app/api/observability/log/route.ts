import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const rateLimit = await checkRateLimit(`error_log:${ip}`, 30, 60000);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many error reports." }, { status: 429 });
    }

    const body = await request.json();
    const { error_name, error_message, error_stack, context, url, user_agent } = body || {};

    if (!error_name || !error_message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("application_error_logs").insert({
      user_id: user?.id ?? null,
      error_name: String(error_name).slice(0, 100),
      error_message: String(error_message).slice(0, 1000),
      error_stack: error_stack ? String(error_stack).slice(0, 5000) : null,
      context: typeof context === "object" && context !== null ? context : {},
      url: url ? String(url).slice(0, 500) : null,
      user_agent: user_agent ? String(user_agent).slice(0, 500) : null,
    });

    return NextResponse.json({ success: true });
  } catch {
    // Fail safely without crashing
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
