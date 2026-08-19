import Link from "next/link";
import type { Metadata } from "next";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { FloatingField } from "@/components/auth/FloatingField";
import { PasswordField } from "@/components/auth/PasswordField";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { SubmitButton } from "@/components/ui/submit-button";
import { createClient } from "@/lib/supabase/server";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to Algo Flow to save bookmarks, sessions, streaks, and progress.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; next?: string }>;
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
      title="Sign in to Algo Flow"
      description="Log in to return to saved algorithms, sessions, and learning progress."
    >
      {params.error ? (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-error/30 bg-error-muted p-4 text-xs font-semibold leading-relaxed text-error shadow-[var(--shadow-inset)]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-bold text-error">{params.error}</p>
            <p className="mt-0.5 text-[11px] text-error/80">
              Check your credentials and try again, or reset your password if you forgot it.
            </p>
          </div>
        </div>
      ) : null}

      {params.success ? (
        <div
          aria-live="polite"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-success/30 bg-success-muted p-4 text-xs font-semibold leading-relaxed text-success shadow-[var(--shadow-inset)]"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <div>
            <p className="font-bold text-success">{params.success}</p>
          </div>
        </div>
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
      <OAuthButtons next={params.next} className="mt-6" />

      {/* Switch to Sign Up */}
      <p className="mt-7 text-center text-xs text-text-secondary">
        New to Algo Flow?{" "}
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
