import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Verify Email",
  description: "Check your email to verify your Algo Flow account.",
};

export default function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-deep text-text-primary">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-28 sm:px-6 lg:px-8">
        <section className="w-full max-w-md rounded-xl border border-border bg-bg-surface/90 backdrop-blur-sm p-8 shadow-xl text-center flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
            <MailCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-3">Check your email</h1>
          <p className="text-sm leading-6 text-text-secondary mb-8">
            We have sent a verification link to your email address. Please click the link to verify your account and continue.
          </p>

          <Link href="/login" className="w-full">
            <Button size="lg" className="w-full" variant="outline">
              Return to Login
            </Button>
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
