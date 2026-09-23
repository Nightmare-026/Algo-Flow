import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { FloatingField } from "@/components/auth/FloatingField";
import { PasswordField } from "@/components/auth/PasswordField";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { SubmitButton } from "@/components/ui/submit-button";
import { Callout } from "@/components/ui/callout";
import { createClient } from "@/lib/supabase/server";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to AlgoFlow to save bookmarks, sessions, streaks, and progress.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    success?: string;
    next?: string;
    oauth_hint?: string;
    email?: string;
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AuthShell
      user={user}
      activeTab="login"
      eyebrow="Welcome back"
      title="Sign in to AlgoFlow"
      description="Log in to return to saved algorithms, sessions, and learning progress."
    >
      {process.env.NODE_ENV === "development" && process.env.DEV_MOCK_AUTH === "true" ? (
        <div className="mb-6 rounded-2xl border border-primary/30 bg-primary-muted/25 p-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-primary flex items-center gap-1.5">
                <span>ðŸ› ï¸</span> Local Dev Mode Active
              </p>
              <p className="text-text-secondary mt-0.5">
                You can bypass login and explore the dashboard directly with a mock developer
                profile.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="inline-flex min-h-9 items-center justify-center rounded-xl bg-primary px-4 text-xs font-bold text-white shadow-(--shadow-raised-sm) hover:bg-primary-hover active:scale-95 transition-all shrink-0"
            >
              Open Dashboard →
            </Link>
          </div>
        </div>
      ) : null}

      {params.oauth_hint === "google" ? (
        <Callout variant="info" title="Google Sign-In Detected" dismissible className="mb-6">
          <p>
            An account for <strong>{params.email || "this email"}</strong> was created using{" "}
            <strong>Continue with Google</strong>.
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            Please click the highlighted <strong>Continue with Google</strong> button below to sign
            in instantly.
          </p>
        </Callout>
      ) : params.error ? (
        <Callout variant="error" title="Sign in failed" dismissible className="mb-6">
          <p>{params.error}</p>
          <p className="mt-0.5 text-[11px] text-error/80">
            Check your credentials and try again, or reset your password. If you originally signed
            up with Google or GitHub, use the social sign-in options below.
          </p>
        </Callout>
      ) : null}

      {params.success ? (
        <Callout variant="success" title="Success" dismissible className="mb-6">
          <p>{params.success}</p>
        </Callout>
      ) : null}

      {/* Primary Email/Password Form */}
      <form action={login} className="space-y-4">
        {params.next ? <input type="hidden" name="next" value={params.next} /> : null}

        <FloatingField
          id="login-email"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          spellCheck={false}
          required
        />

        <div className="space-y-1.5">
          <PasswordField
            id="login-password"
            label="Password"
            name="password"
            autoComplete="current-password"
            required
          />
          <div className="flex justify-end pt-1">
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-text-muted transition-colors hover:text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <SubmitButton size="lg" className="w-full">
          Sign in
        </SubmitButton>
      </form>

      {/* Social Authentication */}
      <OAuthButtons
        next={params.next}
        highlightProvider={params.oauth_hint === "google" ? "google" : undefined}
        className="mt-6"
      />

      {/* Switch to Sign Up */}
      <p className="mt-7 text-center text-xs text-text-secondary">
        New to AlgoFlow?{" "}
        <Link
          href={params.next ? `/signup?next=${encodeURIComponent(params.next)}` : "/signup"}
          className="font-bold text-primary hover:underline transition-colors"
        >
          Sign up
        </Link>
      </p>
    </AuthShell>
  );
}
