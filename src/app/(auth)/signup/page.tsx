import Link from "next/link";
import type { Metadata } from "next";
import { MailCheck, ShieldAlert } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { FloatingField } from "@/components/auth/FloatingField";
import { PasswordField } from "@/components/auth/PasswordField";
import { SubmitButton } from "@/components/ui/submit-button";
import { buttonVariants } from "@/components/ui/button";
import {
  ACCOUNT_REGISTRATION_AVAILABLE,
  PRIVACY_VERSION,
  REGISTRATION_BLOCK_REASON,
  TERMS_VERSION,
} from "@/lib/legal/policy-versions";
import { createClient } from "@/lib/supabase/server";
import { signup } from "../login/actions";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an Algo Flow account to save DSA progress, sessions, and bookmarks.",
};

export default async function SignupPage({
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
      activeTab="signup"
      eyebrow={params.success ? "One more step" : "Account eligibility"}
      title={params.success ? "Check your inbox" : "Create your Algo Flow account"}
      description={
        params.success
          ? "Use the verification link we sent, then return to log in."
          : "Public visualizers need no account. Account features are restricted to people aged 18 or older."
      }
    >
      {!ACCOUNT_REGISTRATION_AVAILABLE ? (
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning-muted text-warning shadow-[var(--shadow-inset)]">
            <ShieldAlert className="h-8 w-8" aria-hidden="true" />
          </span>
          <div role="status" className="mt-6 rounded-xl border border-warning/25 bg-warning-muted px-4 py-3 text-sm leading-6 text-text-secondary">
            {REGISTRATION_BLOCK_REASON}
          </div>
          <Link href="/visualizers" className={buttonVariants({ size: "lg", className: "mt-7 w-full" })}>
            Explore visualizers
          </Link>
        </div>
      ) : params.success ? (
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-muted text-success shadow-[var(--shadow-inset)]">
            <MailCheck className="h-8 w-8" aria-hidden="true" />
          </span>
          <p aria-live="polite" className="mt-6 text-sm leading-6 text-text-secondary">
            {params.success}
          </p>
          <Link href="/login" className={buttonVariants({ size: "lg", className: "mt-7 w-full" })}>
            Return to log in
          </Link>
        </div>
      ) : (
        <>
          {params.error ? (
            <div
              role="alert"
              className="mb-6 rounded-xl border border-error/20 bg-error-muted px-4 py-3 text-sm font-medium text-error"
            >
              {params.error}
            </div>
          ) : null}

          <form action={signup} className="space-y-5">
            {params.next ? <input type="hidden" name="next" value={params.next} /> : null}
            <input type="hidden" name="terms_version" value={TERMS_VERSION} />
            <input type="hidden" name="privacy_version" value={PRIVACY_VERSION} />

            <FloatingField
              id="signup-email"
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              required
            />

            <PasswordField
              id="signup-password"
              label="Password"
              hint="Use at least 12 characters. Long passphrases, password managers, and paste are supported."
              name="password"
              autoComplete="new-password"
              minLength={12}
              required
            />
            <PasswordField
              id="signup-password-confirm"
              label="Confirm password"
              name="password_confirm"
              autoComplete="new-password"
              minLength={12}
              required
            />

            <label className="flex items-start gap-3 rounded-xl border border-border bg-surface-light px-4 py-3 text-sm leading-6 text-text-secondary">
              <input
                type="checkbox"
                name="age_confirmed"
                value="yes"
                required
                className="mt-1 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary"
              />
              <span>I confirm that I am 18 years of age or older.</span>
            </label>

            <label className="flex items-start gap-3 rounded-xl border border-border bg-surface-light px-4 py-3 text-sm leading-6 text-text-secondary">
              <input
                type="checkbox"
                name="legal_accepted"
                value="yes"
                required
                className="mt-1 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary"
              />
              <span>
                I agree to the{" "}
                <Link href="/terms" className="font-semibold text-primary-active hover:underline">
                  Terms ({TERMS_VERSION})
                </Link>{" "}
                and acknowledge the{" "}
                <Link href="/privacy" className="font-semibold text-primary-active hover:underline">
                  Privacy Policy ({PRIVACY_VERSION})
                </Link>
                .
              </span>
            </label>

            <SubmitButton size="lg" className="w-full">
              Create account
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already have an account?{" "}
            <Link
              href={params.next ? `/login?next=${encodeURIComponent(params.next)}` : "/login"}
              className="font-bold text-primary-active hover:underline"
            >
              Log in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
