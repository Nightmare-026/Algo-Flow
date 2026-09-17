import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { ShieldCheck, CheckCircle2, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Share your feedback with AlgoFlow — report bugs, request new features, rate your experience, or send us a message. We read every submission.",
  alternates: { canonical: "/feedback" },
};

const TRUST_ITEMS = [
  {
    title: "Private & Secure",
    description:
      "Your feedback is stored securely in our database with row-level security. Guest submissions remain anonymous.",
    icon: ShieldCheck,
  },
  {
    title: "Every Submission Read",
    description:
      "Our engineering team reviews every submission. Bug reports are prioritized and feature requests shape our roadmap.",
    icon: CheckCircle2,
  },
  {
    title: "No Account Required",
    description:
      "You can submit feedback without signing in. Optionally provide your email if you'd like us to follow up.",
    icon: UserCheck,
  },
];

export default async function FeedbackPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar initialUser={user} />
      <main
        id="main-content"
        className="mx-auto w-full max-w-7xl flex-1 px-4 pb-24 pt-32 sm:px-6 lg:px-8"
      >
        {/* Header Section */}
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-primary tracking-tight">
            Send Us Feedback
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-text-secondary max-w-2xl">
            Found a bug? Have an idea for a new feature? Want to share your experience? We read
            every piece of feedback and use it to make AlgoFlow better for everyone.
          </p>
        </div>

        {/* Feedback Form */}
        <div className="mt-10">
          <FeedbackForm isAuthenticated={!!user} />
        </div>

        {/* Trust Block — Shared Card Component */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="neu-raised group rounded-2xl border border-border bg-surface p-5 hover:border-primary/40 hover:-translate-y-1 transition-all duration-200"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-inset text-primary shadow-[var(--shadow-inset)] group-hover:scale-105 transition-transform">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 text-sm font-bold font-display text-text-primary group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed text-text-secondary">{item.description}</p>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
