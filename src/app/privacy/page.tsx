import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import { PRIVACY_VERSION } from "@/lib/legal/policy-versions";
import { ShieldCheck, Lock, Eye, Database, Globe, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Algo Flow",
  description: "Privacy Policy and data protection practices for Algo Flow.",
  alternates: { canonical: "/privacy" },
};

const privacySections = [
  {
    icon: Eye,
    title: "1. Overview & Public Exploration",
    content:
      "Algo Flow is an interactive Computer Science learning platform designed for understanding data structures, algorithms, and mental arithmetic. You can freely explore all 133 algorithm visualizers, multi-language code editors, and practice drills without creating an account. In public mode, all visual traces and algorithm input data remain strictly within your browser state.",
  },
  {
    icon: Database,
    title: "2. Information We Collect",
    content:
      "When you choose to register for an Algo Flow account, we collect minimal information necessary to deliver authenticated features: your email address, securely hashed credentials, display name, user preferences (such as selected theme and preferred programming language), saved visualizer sessions, bookmarks, quiz attempts, and practice telemetry.",
  },
  {
    icon: Lock,
    title: "3. How We Protect Your Data",
    content:
      "We use Supabase with Postgres Row-Level Security (RLS) policies to ensure your personal data, saved sessions, and bookmarks are accessible only by you. All transmissions are encrypted in transit via TLS 1.3. We enforce secure authentication practices, non-enumerating error responses, and strict password security standards.",
  },
  {
    icon: Globe,
    title: "4. Cookies & Local Storage",
    content:
      "Algo Flow uses essential browser cookies to maintain secure authentication sessions. We utilize browser local storage to preserve your client-side preferences (such as Light/Dark mode, volume settings, and mental math practice state) across visits without transmitting unnecessary tracking telemetry.",
  },
  {
    icon: ShieldCheck,
    title: "5. Third-Party Subprocessors",
    content:
      "To provide our services reliably, we partner with industry-standard cloud infrastructure providers: Supabase (managed Postgres authentication and database) and Vercel (application edge hosting and CDN). We do not sell, rent, or monetize your personal information with third-party advertisers.",
  },
  {
    icon: UserCheck,
    title: "6. Your Rights & Data Controls",
    content:
      "You have full control over your personal data. You can inspect your activity history, delete saved visualizer bookmarks and practice sessions directly from your Dashboard, or request full account deletion at any time. For questions or privacy inquiries, contact support at support@algoflow.dev.",
  },
];

export default async function PrivacyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar initialUser={user} />
      <main
        id="main-content"
        className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-32 sm:px-6 lg:px-8"
      >
        <div className="text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-muted px-3.5 py-1 text-xs font-bold font-mono uppercase tracking-wider text-primary shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Transparency & Trust</span>
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-primary tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-text-muted">
            Version {PRIVACY_VERSION} • Last updated August 2026
          </p>
        </div>

        <div className="neu-float mt-10 rounded-3xl border border-border p-6 sm:p-10 shadow-xl divide-y divide-border/60">
          {privacySections.map((section) => {
            const Icon = section.icon;
            return (
              <section key={section.title} className="py-8 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                    <Icon className="h-4 w-4" />
                  </span>
                  <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-text-secondary pl-12">
                  {section.content}
                </p>
              </section>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}
