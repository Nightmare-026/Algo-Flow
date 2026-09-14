import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { FloatingField } from "@/components/auth/FloatingField";
import { SubmitButton } from "@/components/ui/submit-button";
import { createClient } from "@/lib/supabase/server";
import { sendPasswordReset } from "../login/actions";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your AlgoFlow password.",
  robots: { index: false, follow: false },
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AuthShell
      user={user}
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter the email address on your account. We will send a secure link to choose a new password."
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
      <form action={sendPasswordReset} className="space-y-5">
        <FloatingField
          id="recovery-email"
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <SubmitButton size="lg" className="w-full">
          Send reset link
        </SubmitButton>
      </form>
      <p className="mt-7 text-center text-sm text-text-secondary">
        Remembered it?{" "}
        <Link href="/login" className="font-bold text-primary-active hover:underline">
          Return to log in
        </Link>
      </p>
    </AuthShell>
  );
}
