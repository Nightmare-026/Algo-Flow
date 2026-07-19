import Link from "next/link";
import type { Metadata } from "next";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { FloatingField } from "@/components/auth/FloatingField";
import { PasswordField } from "@/components/auth/PasswordField";
import { OAuthButtons } from "@/components/auth/OAuthButtons";
import { SubmitButton } from "@/components/ui/submit-button";
import { buttonVariants } from "@/components/ui/button";
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
      eyebrow={params.success ? "One more step" : "Create your account"}
      title={params.success ? "Check your inbox" : "Create your AlgoFlow account"}
      description={
        params.success
          ? "Use the verification link we sent, then return to log in."
          : "Save useful visualizers, resume sessions, and build a real record of what you have practised."
      }
    >
      {params.success ? (
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success-muted text-success shadow-[var(--shadow-inset)]">
            <MailCheck className="h-8 w-8" />
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
            <div className="grid gap-4 sm:grid-cols-2">
              <FloatingField
                id="first-name"
                label="First name"
                name="first_name"
                autoComplete="given-name"
                required
              />
              <FloatingField
                id="last-name"
                label="Last name"
                name="last_name"
                autoComplete="family-name"
                required
              />
            </div>

            <div className="relative">
              <select
                id="gender"
                name="gender"
                required
                defaultValue=""
                className="auth-select form-select peer h-14 pb-1 pt-5"
              >
                <option value="" disabled hidden aria-label="No gender selected" />
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <label
                htmlFor="gender"
                className="pointer-events-none absolute left-4 top-2.5 origin-left text-[11px] font-semibold text-text-muted transition-[color,transform,top,font-size] duration-200 peer-invalid:top-1/2 peer-invalid:-translate-y-1/2 peer-invalid:text-sm peer-invalid:font-medium peer-focus-visible:top-2.5 peer-focus-visible:translate-y-0 peer-focus-visible:text-[11px] peer-focus-visible:font-semibold peer-focus-visible:text-primary-active"
              >
                Gender
              </label>
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
              hint="Use at least 6 characters. A longer, unique passphrase is safer."
              name="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
            <PasswordField
              id="signup-password-confirm"
              label="Confirm password"
              name="password_confirm"
              autoComplete="new-password"
              minLength={6}
              required
            />

            <SubmitButton size="lg" className="w-full">
              Create account
            </SubmitButton>
          </form>

          <div className="mt-6">
            <OAuthButtons />
          </div>

          <p className="mt-5 text-xs leading-5 text-muted-foreground">
            By creating an account, you agree to the{" "}
            <Link href="/terms" className="font-semibold text-primary-active hover:underline">
              terms
            </Link>{" "}
            and acknowledge the{" "}
            <Link href="/privacy" className="font-semibold text-primary-active hover:underline">
              privacy policy
            </Link>
            .
          </p>
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
