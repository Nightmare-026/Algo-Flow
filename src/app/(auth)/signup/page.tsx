import Link from "next/link";
import type { Metadata } from "next";
import { MailCheck, ShieldAlert } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { FloatingField } from "@/components/auth/FloatingField";
import { PasswordField } from "@/components/auth/PasswordField";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { SubmitButton } from "@/components/ui/submit-button";
import { buttonVariants } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
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
  description: "Sign up for an AlgoFlow account to save DSA progress, sessions, and bookmarks.",
  robots: { index: false, follow: false },
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
      eyebrow={params.success ? "Verification Required" : "Get started"}
      title={params.success ? "Check your inbox" : "Sign up for AlgoFlow"}
      description={
        params.success
          ? "Use the verification link we sent, then return to log in."
          : "Save visualizer progress, resume practice traces, and master algorithms with deep visual memory."
      }
    >
      {!ACCOUNT_REGISTRATION_AVAILABLE ? (
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-warning-muted text-warning shadow-card">
            <ShieldAlert className="h-8 w-8" aria-hidden="true" />
          </span>
          <div
            role="status"
            className="mt-6 rounded-lg border border-warning/30 bg-warning-muted p-4 text-xs font-semibold leading-relaxed text-text-secondary"
          >
            {REGISTRATION_BLOCK_REASON}
          </div>
          <Link
            href="/visualizers"
            className={buttonVariants({ size: "lg", className: "mt-6 w-full" })}
          >
            Explore visualizers
          </Link>
        </div>
      ) : params.success ? (
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-success-muted text-success shadow-card">
            <MailCheck className="h-8 w-8" aria-hidden="true" />
          </span>
          <Callout variant="success" title="Verification email sent" dismissible className="mt-6">
            <p>{params.success}</p>
          </Callout>
          <Link href="/login" className={buttonVariants({ size: "lg", className: "mt-6 w-full" })}>
            Return to sign in
          </Link>
        </div>
      ) : (
        <>
          {params.error ? (
            <Callout variant="error" title="Sign up failed" dismissible className="mb-6">
              <p>{params.error}</p>
              <p className="mt-0.5 text-[11px] text-error/80">
                Please review the fields below and correct any highlighted issues.
              </p>
            </Callout>
          ) : null}

          {/* Registration Form */}
          <form action={signup} className="space-y-4">
            {params.next ? <input type="hidden" name="next" value={params.next} /> : null}
            <input type="hidden" name="terms_version" value={TERMS_VERSION} />
            <input type="hidden" name="privacy_version" value={PRIVACY_VERSION} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FloatingField
                id="signup-first-name"
                label="First name"
                name="first_name"
                autoComplete="given-name"
                required
              />
              <FloatingField
                id="signup-last-name"
                label="Last name"
                name="last_name"
                autoComplete="family-name"
                required
              />
            </div>

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
              hint="Use at least 8 characters. A mix of letters, numbers, and symbols is recommended."
              name="password"
              autoComplete="new-password"
              minLength={8}
              required
            />

            <PasswordField
              id="signup-password-confirm"
              label="Confirm password"
              name="password_confirm"
              autoComplete="new-password"
              minLength={8}
              required
            />

            <label className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3.5 text-xs leading-relaxed text-text-secondary cursor-pointer shadow-card transition-colors hover:border-primary/40">
              <input
                type="checkbox"
                name="legal_accepted"
                value="yes"
                required
                className="mt-0.5 h-4 w-4 shrink-0 rounded-xs border-border text-primary focus:ring-primary accent-primary cursor-pointer"
              />
              <span>
                I confirm I am 18 years of age or older (or have parental consent), agree to the{" "}
                <Link href="/terms" className="font-bold text-primary hover:underline">
                  Terms of Service
                </Link>
                , and acknowledge the{" "}
                <Link href="/privacy" className="font-bold text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <SubmitButton size="lg" className="w-full">
              Sign up
            </SubmitButton>
          </form>

          {/* Social Authentication */}
          <OAuthButtons next={params.next} className="mt-6" />

          {/* Switch to Sign In */}
          <p className="mt-7 text-center text-xs text-text-secondary">
            Already have an account?{" "}
            <Link
              href={params.next ? `/login?next=${encodeURIComponent(params.next)}` : "/login"}
              className="font-bold text-primary hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
