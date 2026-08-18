import Link from "next/link";
import type { Metadata } from "next";
import { MailCheck, ShieldAlert } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Input } from "@/components/ui/input";
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
import { signup, loginWithOAuth } from "../login/actions";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an Algo Flow account to save DSA progress, sessions, and bookmarks.",
};

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

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
      eyebrow={params.success ? "One more step" : "CREATE YOUR ACCOUNT"}
      title={params.success ? "Check your inbox" : "Create your Algo Flow account"}
      description={
        params.success
          ? "Use the verification link we sent, then return to log in."
          : "Save useful visualizers, resume sessions, and build a real record of what you have practised."
      }
    >
      {!ACCOUNT_REGISTRATION_AVAILABLE ? (
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-warning-muted text-warning shadow-[var(--shadow-inset)]">
            <ShieldAlert className="h-8 w-8" aria-hidden="true" />
          </span>
          <div
            role="status"
            className="mt-6 rounded-xl border border-warning/25 bg-warning-muted px-4 py-3 text-sm leading-6 text-text-secondary"
          >
            {REGISTRATION_BLOCK_REASON}
          </div>
          <Link
            href="/visualizers"
            className={buttonVariants({ size: "lg", className: "mt-7 w-full" })}
          >
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

          <form action={signup} className="space-y-4">
            {params.next ? <input type="hidden" name="next" value={params.next} /> : null}
            <input type="hidden" name="terms_version" value={TERMS_VERSION} />
            <input type="hidden" name="privacy_version" value={PRIVACY_VERSION} />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="signup-first-name" className="sr-only">
                  First Name
                </label>
                <Input
                  id="signup-first-name"
                  name="first_name"
                  placeholder="First name"
                  autoComplete="given-name"
                  required
                  className="bg-surface-light h-12"
                />
              </div>
              <div>
                <label htmlFor="signup-last-name" className="sr-only">
                  Last Name
                </label>
                <Input
                  id="signup-last-name"
                  name="last_name"
                  placeholder="Last name"
                  autoComplete="family-name"
                  required
                  className="bg-surface-light h-12"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-gender" className="sr-only">
                Gender
              </label>
              <select
                id="signup-gender"
                name="gender"
                required
                className="flex h-12 w-full rounded-xl border border-border bg-surface-light px-3 text-sm text-foreground shadow-[var(--shadow-inset)] transition-[border-color,box-shadow] duration-200 focus-visible:border-primary focus-visible:outline-none focus-visible:shadow-[var(--shadow-inset),0_0_0_3px_rgba(34,197,94,0.14)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled selected hidden>
                  Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label htmlFor="signup-email" className="sr-only">
                Email address
              </label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder="Email address"
                autoComplete="email"
                spellCheck={false}
                required
                className="bg-surface-light h-12"
              />
            </div>

            <PasswordField
              id="signup-password"
              label="Password"
              hint="Use at least 8 characters. A longer, unique passphrase is safer."
              name="password"
              autoComplete="new-password"
              minLength={8}
              required
              className="bg-surface-light"
            />

            <PasswordField
              id="signup-password-confirm"
              label="Confirm password"
              name="password_confirm"
              autoComplete="new-password"
              minLength={8}
              required
              className="bg-surface-light"
            />

            <label className="flex items-start gap-3 rounded-xl border border-border bg-surface-light px-4 py-3 text-sm leading-6 text-text-secondary">
              <input
                type="checkbox"
                name="legal_accepted"
                value="yes"
                required
                className="mt-1 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary"
              />
              <span>
                I am 18 years of age or older and agree to the{" "}
                <Link href="/terms" className="font-semibold text-primary-active hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-semibold text-primary-active hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>

            <SubmitButton size="lg" className="w-full">
              Create account
            </SubmitButton>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm font-medium leading-6">
              <span className="bg-white/78 px-4 text-text-muted">or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <form action={loginWithOAuth.bind(null, "google")}>
              <SubmitButton variant="outline" className="w-full bg-surface-light">
                <GoogleIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">Google</span>
              </SubmitButton>
            </form>

            <form action={loginWithOAuth.bind(null, "github")}>
              <SubmitButton variant="outline" className="w-full bg-surface-light">
                <GithubIcon className="mr-2 h-5 w-5" aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">GitHub</span>
              </SubmitButton>
            </form>
          </div>

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
