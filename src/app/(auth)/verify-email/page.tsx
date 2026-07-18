import Link from "next/link";
import type { Metadata } from "next";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Check your email to verify your Algo Flow account.",
};

export default async function VerifyEmailPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <AuthShell
      user={user}
      eyebrow="Verify your email"
      title="Check your inbox"
      description="Open the verification message from Algo Flow to finish creating your account."
    >
      <div className="text-center">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-muted text-primary-active shadow-[var(--shadow-inset)]">
          <MailCheck className="h-8 w-8" />
        </span>
        <p className="mt-6 text-sm leading-6 text-text-secondary">
          The verification link confirms that the email belongs to you. If you do not see it, check
          your spam folder before trying again.
        </p>
        <Link
          href="/login"
          className={buttonVariants({ variant: "outline", size: "lg", className: "mt-7 w-full" })}
        >
          Return to log in
        </Link>
      </div>
    </AuthShell>
  );
}
