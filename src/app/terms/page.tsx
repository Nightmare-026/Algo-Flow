import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import { TERMS_VERSION } from "@/lib/legal/policy-versions";
import { FileText, BookOpen, ShieldAlert, CheckCircle, Award, Terminal } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Algo Flow",
  description: "Terms and Conditions of use for the Algo Flow CS learning platform.",
  alternates: { canonical: "/terms" },
};

const termsSections = [
  {
    icon: BookOpen,
    title: "1. Acceptance of Terms & Educational Purpose",
    content:
      "By accessing or creating an account on Algo Flow, you agree to comply with these Terms of Service. Algo Flow is an interactive educational workstation providing step-by-step visualizations, synchronized multi-language source code, quizzes, and mental arithmetic training for computer science learners and software engineers.",
  },
  {
    icon: Terminal,
    title: "2. User Accounts & Security",
    content:
      "You are responsible for maintaining the confidentiality of your account login credentials and for all activities that occur under your account. You agree to provide accurate information and notify us immediately of any unauthorized access or security breach.",
  },
  {
    icon: ShieldAlert,
    title: "3. Acceptable Use Policy",
    content:
      "You agree not to engage in any activity that interferes with or disrupts Algo Flow services, servers, or networks. You may not attempt to reverse engineer backend infrastructure, bypass rate limiting, submit malicious graph JSON payloads, or utilize automated scraping tools that degrade platform performance for other learners.",
  },
  {
    icon: Award,
    title: "4. Intellectual Property Rights",
    content:
      "All original content, visualizer architectures, animations, brand logos, problem sets, and pedagogical materials on Algo Flow are protected by copyright and intellectual property laws. Open-source algorithm implementations and sample code snippets provided in the workstations remain subject to standard permissive open-source licenses.",
  },
  {
    icon: CheckCircle,
    title: "5. Service Availability & Modifications",
    content:
      "We continually improve Algo Flow with new algorithm visualizations, features, and performance enhancements. We reserve the right to modify, suspend, or discontinue any aspect of the service with reasonable notice. The service is provided on an 'as is' and 'as available' basis.",
  },
  {
    icon: FileText,
    title: "6. Termination & Contact",
    content:
      "You may terminate your account at any time via your Dashboard settings. We reserve the right to suspend or terminate accounts that violate our Acceptable Use Policy. If you have questions regarding these terms, contact us at legal@algoflow.dev.",
  },
];

export default async function TermsPage() {
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
            <FileText className="h-3.5 w-3.5" />
            <span>Platform Agreement</span>
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-primary tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-text-muted">
            Version {TERMS_VERSION} • Last updated August 2026
          </p>
        </div>

        <div className="neu-float mt-10 rounded-3xl border border-border p-6 sm:p-10 shadow-xl divide-y divide-border/60">
          {termsSections.map((section) => {
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
