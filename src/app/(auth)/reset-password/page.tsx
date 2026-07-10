import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { updatePassword } from "../login/actions";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Choose a new Algo Flow password.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-bg-deep text-text-primary">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-28 sm:px-6 lg:px-8">
        <section className="w-full max-w-md rounded-xl border border-border bg-bg-surface/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">Choose New Password</h1>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Enter a new password for your Algo Flow account.
            </p>
          </div>

          {params?.error && (
            <div className="mb-6 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
              {params.error}
            </div>
          )}

          <form action={updatePassword} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">New password</label>
              <Input name="password" type="password" autoComplete="new-password" required minLength={6} placeholder="At least 6 characters" className="h-11" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Confirm password</label>
              <Input name="password_confirm" type="password" autoComplete="new-password" required minLength={6} placeholder="Re-enter password" className="h-11" />
            </div>

            <SubmitButton size="lg" className="w-full h-11 text-base font-semibold">
              Update Password
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Already updated it?{" "}
            <Link href="/login" className="font-semibold text-primary hover:text-primary-hover">
              Log in
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}