import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { FloatingField } from "@/components/auth/FloatingField";
import { PasswordField } from "@/components/auth/PasswordField";
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
          className="mb-6 rounded-xl border border-error/20 bg-error-muted px-4 py-3 text-sm font-medium text-error"
        >
          {params.error}
        </div>
      ) : null}
      {params.success ? (
        <div
          aria-live="polite"
          className="mb-6 rounded-xl border border-success/20 bg-success-muted px-4 py-3 text-sm font-medium text-success"
        >
          {params.success}
        </div>
      ) : null}

      <form action={login} className="space-y-5">
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
        <PasswordField
          id="login-password"
          label="Password"
          name="password"
          autoComplete="current-password"
          required
        />
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="min-h-8 text-sm font-semibold text-primary-active hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <SubmitButton size="lg" className="w-full">
          Log in
        </SubmitButton>
      </form>

      <p className="mt-7 text-center text-sm text-text-secondary">
        New to Algo Flow?{" "}
        <Link
          href={params.next ? `/signup?next=${encodeURIComponent(params.next)}` : "/signup"}
          className="font-bold text-primary-active hover:underline"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
