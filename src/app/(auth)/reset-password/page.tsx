import Link from "next/link";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { PasswordField } from "@/components/auth/PasswordField";
import { SubmitButton } from "@/components/ui/submit-button";
import { createClient } from "@/lib/supabase/server";
import { updatePassword } from "../login/actions";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Choose a new AlgoFlow password.",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AuthShell
      user={user}
      eyebrow="Choose a new password"
      title="Secure your account"
      description="Create a new password for your AlgoFlow account and enter it twice to confirm."
    >
      {params.error ? (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-error/20 bg-error-muted px-4 py-3 text-sm font-medium text-error"
        >
          {params.error}
        </div>
      ) : null}
      <form action={updatePassword} className="space-y-5">
        <PasswordField
          id="new-password"
          label="New password"
          hint="Use at least 12 characters. Long passphrases and password-manager paste are supported."
          name="password"
          autoComplete="new-password"
          minLength={12}
          required
        />
        <PasswordField
          id="new-password-confirm"
          label="Confirm new password"
          name="password_confirm"
          autoComplete="new-password"
          minLength={12}
          required
        />
        <SubmitButton size="lg" className="w-full">
          Update password
        </SubmitButton>
      </form>
      <p className="mt-7 text-center text-sm text-text-secondary">
        Already updated it?{" "}
        <Link href="/login" className="font-bold text-primary-active hover:underline">
          Log in
        </Link>
      </p>
    </AuthShell>
  );
}
