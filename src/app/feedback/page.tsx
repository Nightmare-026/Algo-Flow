import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";
import { MessageSquareHeart } from "lucide-react";

export const metadata: Metadata = {
  title: "Feedback",
  description:
    "Share your feedback with Algo Flow — report bugs, request new features, rate your experience, or send us a message. We read every submission.",
  alternates: { canonical: "/feedback" },
};

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
        className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-32 sm:px-6 lg:px-8"
      >
        {/* Header Section */}
        <div className="text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-muted px-3.5 py-1 text-xs font-bold font-mono uppercase tracking-wider text-primary shadow-xs">
            <MessageSquareHeart className="h-3.5 w-3.5" />
            <span>We Value Your Input</span>
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-primary tracking-tight">
            Send Us Feedback
          </h1>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-text-secondary max-w-2xl">
            Found a bug? Have an idea for a new feature? Want to share your experience? We read
            every piece of feedback and use it to make Algo Flow better for everyone.
          </p>
        </div>

        {/* Feedback Form */}
        <div className="mt-10">
          <FeedbackForm isAuthenticated={!!user} />
        </div>

        {/* Info Cards */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="neu-inset p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)]">
            <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" />
              Private & Secure
            </p>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              Your feedback is stored securely in our database with row-level security. Guest
              submissions remain anonymous.
            </p>
          </div>

          <div className="neu-inset p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)]">
            <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" />
              Every Submission Read
            </p>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              Our team reviews every piece of feedback. Bug reports are prioritized and feature
              requests shape our roadmap.
            </p>
          </div>

          <div className="neu-inset p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)]">
            <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-success" />
              No Account Required
            </p>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              You can submit feedback without signing in. Optionally provide your email if
              you&apos;d like us to follow up.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
