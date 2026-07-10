import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { sendPasswordReset } from "../login/actions";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your Algo Flow password.",
};

export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-bg-deep text-text-primary">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-28 sm:px-6 lg:px-8">
        <section className="w-full max-w-md rounded-xl border border-border bg-bg-surface/90 p-6 shadow-xl backdrop-blur-sm sm:p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">Reset Password</h1>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Enter your email address and we will send you a link to reset your password.
            </p>
          </div>

          {params?.error && (
            <div className="mb-6 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
              {params.error}
            </div>
          )}

          {params?.success && (
            <div className="mb-6 rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
              {params.success}
            </div>
          )}

          <form action={sendPasswordReset} className="space-y-4">
            <label className="block text-sm font-medium text-text-secondary">
              Email
              <Input className="mt-2" name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
            </label>

            <SubmitButton size="lg" className="w-full">
              Send Reset Link
            </SubmitButton>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Remember your password?{" "}
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