import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { login } from "./actions";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to Algo Flow to save bookmarks, sessions, streaks, and progress.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-screen flex-col bg-bg-deep text-text-primary">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-28 sm:px-6 lg:px-8">
        <section className="w-full max-w-md rounded-2xl border border-border bg-bg-surface p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">Welcome back</h1>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Log in to continue your DSA journey.
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

          <form action={login} className="space-y-5">
            {params?.next && <input type="hidden" name="next" value={params.next} />}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-secondary">Email address</label>
              <Input name="email" type="email" autoComplete="email" required placeholder="name@example.com" className="h-11" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-text-secondary">Password</label>
                <Link href="/forgot-password" className="text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                  Forgot password?
                </Link>
              </div>
              <Input name="password" type="password" autoComplete="current-password" required placeholder="********" className="h-11" />
            </div>

            <SubmitButton size="lg" className="w-full h-11 text-base font-semibold mt-2">
              Log in
            </SubmitButton>
          </form>

          <p className="mt-8 text-center text-sm text-text-secondary">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:text-primary-hover transition-colors">
              Sign up
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}