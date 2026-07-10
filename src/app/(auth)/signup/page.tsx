import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { signup } from "../login/actions";
import { MailCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create an Algo Flow account to save DSA progress, sessions, and bookmarks.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-bg-deep text-text-primary">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-28 sm:px-6 lg:px-8">
        <section className="w-full max-w-lg rounded-2xl border border-border bg-bg-surface p-8 shadow-2xl">
          {params?.success ? (
            <div className="text-center py-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success mb-6">
                <MailCheck className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-bold text-text-primary mb-3">Check your email</h2>
              <p className="text-text-secondary mb-8">{params.success}</p>
              <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary-hover transition-colors">
                Return to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-text-primary">Create an account</h1>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  Join Algo Flow to track your progress and bookmark visualizers.
                </p>
              </div>

              {params?.error && (
                <div className="mb-6 rounded-lg border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
                  {params.error}
                </div>
              )}

              <form action={signup} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">First name</label>
                    <Input name="first_name" type="text" required placeholder="John" className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Last name</label>
                    <Input name="last_name" type="text" required placeholder="Doe" className="h-11" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Gender</label>
                  <select name="gender" required defaultValue="" className="flex h-11 w-full rounded-md border border-border bg-bg-surface px-3 py-2 text-sm text-text-primary ring-offset-bg-deep file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                    <option value="" disabled>Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Email address</label>
                  <Input name="email" type="email" autoComplete="email" required placeholder="name@example.com" className="h-11" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Password</label>
                  <Input name="password" type="password" autoComplete="new-password" required minLength={6} placeholder="At least 6 characters" className="h-11" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-secondary">Confirm Password</label>
                  <Input name="password_confirm" type="password" autoComplete="new-password" required minLength={6} placeholder="Re-enter password" className="h-11" />
                </div>

                <SubmitButton size="lg" className="w-full h-11 text-base font-semibold mt-2">
                  Create account
                </SubmitButton>
              </form>

              <p className="mt-8 text-center text-sm text-text-secondary">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                  Log in
                </Link>
              </p>
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}