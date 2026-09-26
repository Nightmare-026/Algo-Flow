import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import { TERMS_VERSION } from "@/lib/legal/policy-versions";
import {
  FileText,
  BookOpen,
  ShieldAlert,
  Award,
  Terminal,
  Scale,
  Ban,
  UserCheck,
  AlertTriangle,
  Mail,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import { LegalNav } from "@/components/legal/LegalNav";
import { catalogStats } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service and user agreement for AlgoFlow. Review permitted educational uses, user conduct, intellectual property rights, and platform disclaimers.",
  alternates: { canonical: "/terms" },
};

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
        {/* Header Section */}
        <div className="text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-muted px-3.5 py-1 text-xs font-bold font-mono uppercase tracking-wider text-primary shadow-xs">
            <FileText className="h-3.5 w-3.5" />
            <span>Official Platform Terms & User Agreement</span>
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-primary tracking-tight">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-text-muted">
            Version {TERMS_VERSION} • Effective Date: September 5, 2026
          </p>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-text-secondary max-w-3xl">
            Welcome to AlgoFlow (&quot;AlgoFlow&quot;, &quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;). These Terms of Service constitute a legally binding agreement between
            you and AlgoFlow governing your access to and use of our computer science visualizer
            library, interactive execution engines, mental calculation studios, and associated web
            services.
          </p>
          <LegalNav currentPath="/terms" />
        </div>

        {/* Terms at a Glance (Executive Summary) */}
        <div className="mt-10 p-6 sm:p-8 rounded-[8px] border border-border bg-surface shadow-card">
          <h2 className="font-bold uppercase tracking-wider text-xs font-mono text-primary flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            <span>Key User Obligations at a Glance</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Educational Study License
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                AlgoFlow is provided for personal, academic, classroom, and interview preparation.
                Visualizer algorithms and simulations are for educational purposes.
              </p>
            </div>

            <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Academic & Leaderboard Integrity
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Automated bots, headless scrapers, script injectors, or anti-cheat tampering on
                mental math competitions and quizzes are strictly prohibited.
              </p>
            </div>

            <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Intellectual Property Protection
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                All bespoke visualizer architectures, state synchronization pipelines, visual
                assets, and brand trademarks are proprietary assets of AlgoFlow.
              </p>
            </div>

            <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Account Confidentiality
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                You are solely responsible for maintaining the confidentiality of your credentials
                and Google OAuth sessions, and all actions under your profile.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Legal Sections */}
        <div className="mt-10 rounded-[8px] border border-border bg-surface p-6 sm:p-10 shadow-elevated divide-y divide-border/60">
          {/* Section 1: Agreement & Eligibility */}
          <section className="py-8 first:pt-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <BookOpen className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                1. Acceptance of Agreement & Eligibility
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                By accessing, browsing, registering for, or using AlgoFlow, you confirm that you
                have read, understood, and agreed to be bound by these Terms of Service, our{" "}
                <Link href="/privacy" className="text-primary hover:underline font-bold">
                  Privacy Policy
                </Link>
                , our{" "}
                <Link href="/license" className="text-primary hover:underline font-bold">
                  License Agreement
                </Link>
                , and our{" "}
                <Link href="/cookies" className="text-primary hover:underline font-bold">
                  Cookie Policy
                </Link>
                . If you do not agree to these terms, you must not access or use the platform.
              </p>
              <p>
                <strong>Age & Capacity Requirements:</strong> You must be at least 13 years of age
                (or at least 16 years of age in the European Economic Area) to create an account. If
                you are under the legal age of majority in your jurisdiction, you represent that
                your parent or legal guardian has reviewed and agreed to these Terms on your behalf.
              </p>
            </div>
          </section>

          {/* Section 2: Educational Services & Workstation Scope */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Cpu className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                2. Educational Services & Workstation Scope
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>AlgoFlow provides interactive Computer Science education tools, including:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
                <li>
                  <strong>{catalogStats.visualizerCount} Visualizer Workstations:</strong> Dynamic,
                  deterministic execution traces across 12 data structure categories (Arrays, Linked
                  Lists, Doubly Linked Lists, Circular Linked Lists, Stacks, Queues, Hash Tables,
                  Hash Sets, Trees, Graphs, Matrices, and Strings).
                </li>
                <li>
                  <strong>Synchronized Multi-Language Source Code:</strong> Interactive code panels
                  supporting JavaScript, Python, C++, and Java with step-by-step line-by-line
                  pointer synchronization.
                </li>
                <li>
                  <strong>Mental Math Calculation Studio:</strong> 2-column zero-scroll workstation
                  matching navbar width with Dual Input modes (Direct Tactile Keypad and 4-Choices
                  Multiple Choice Grid), structured calculation drills, 60s speed sprints, timed
                  assessment tests, and verified daily global challenges.
                </li>
                <li>
                  <strong>Diagnostic Telemetry &amp; Student Dashboard:</strong> Study streaks,
                  algorithm completion tracking, bookmarked topics, interactive quiz scores, and
                  arithmetic fluency analytics.
                </li>
              </ul>
              <p>
                We reserve the right to modify, enhance, update, or deprecate any specific
                visualization, algorithm, or training format at any time to preserve pedagogical
                accuracy and platform performance.
              </p>
            </div>
          </section>

          {/* Section 3: User Accounts & Authentication */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <UserCheck className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                3. User Accounts, Authentication &amp; Security
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                While public exploration mode requires no registration, accessing persistent
                features (such as bookmarks, algorithm progress tracking, and verified daily
                challenge ranks) requires creating an account via email or third-party OAuth (Sign
                in with Google or GitHub).
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
                <li>
                  You agree to provide accurate, truthful, and complete registration information and
                  keep your credentials up to date.
                </li>
                <li>
                  You are solely responsible for all activities occurring under your account. You
                  must immediately notify us at{" "}
                  <a
                    href="mailto:ganeshsharma7114@gmail.com"
                    className="text-primary hover:underline font-bold"
                  >
                    ganeshsharma7114@gmail.com
                  </a>{" "}
                  if you discover or suspect any unauthorized access or breach of security.
                </li>
                <li>
                  Accounts are strictly personal and non-transferable. You may not sell, lease, or
                  share your account credentials with third parties.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Acceptable Use Policy */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Ban className="h-4 w-4 text-warning" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                4. Acceptable Use Policy & Anti-Abuse Standards
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                To safeguard the learning experience for all students, you agree that you will NOT:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
                <li>
                  <strong>Automated Scraping & Denial of Service:</strong> Deploy automated bots,
                  crawlers, spiders, or load-testing scripts that burden our servers, edge network,
                  or database infrastructure.
                </li>
                <li>
                  <strong>Competition & Anti-Cheat Tampering:</strong> Submit falsified,
                  pre-computed, or mechanically scripted solve times to the Mental Math Daily
                  Challenge, speed sprints, or global leaderboards. Our engine enforces anti-cheat
                  verification; flagged fraudulent submissions are purged automatically.
                </li>
                <li>
                  <strong>Malicious Payloads:</strong> Inject malicious JavaScript, cross-site
                  scripting (XSS) vectors, malformed JSON structures, or oversized input vectors
                  intended to crash visualizer rendering canvases.
                </li>
                <li>
                  <strong>Circumventing Security:</strong> Probe, scan, or test the vulnerability of
                  our authentication systems, Supabase Row-Level Security policies, or rate-limiting
                  safeguards without express authorization.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Intellectual Property */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Award className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                5. Intellectual Property Rights & Content Ownership
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                <strong>AlgoFlow Proprietary Assets:</strong> All original software code, user
                interface designs, visualizer animation engines, step synchronization algorithms,
                design tokens, trademarks, logos, and pedagogical diagrams on AlgoFlow are the
                exclusive intellectual property of AlgoFlow and its licensors.
              </p>
              <p>
                <strong>Limited Educational License:</strong> Subject to compliance with these
                Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to
                access, view, and interact with the visualizers and curriculum strictly for your
                personal, non-commercial educational study.
              </p>
              <p>
                <strong>Open-Source Code Implementations:</strong> Standard algorithmic
                implementations and code syntax provided within the code inspection panels for study
                (e.g. standard AVL rotation routines, Dijkstra implementations) remain subject to
                standard open-source educational conventions.
              </p>
            </div>
          </section>

          {/* Section 6: User Inputs & Custom Canvases */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Terminal className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                6. Custom Inputs & User-Generated Data
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                When you input custom arrays, graphs, trees, or math parameters into our interactive
                visualizer canvases, you retain full ownership of your input data. You grant Algo
                Flow a worldwide, royalty-free license to parse, execute, and render that input
                dynamically within your active browser session.
              </p>
              <p>
                We do not claim ownership over any computer algorithms, solutions, or code that you
                write or develop independently outside of our platform.
              </p>
            </div>
          </section>

          {/* Section 7: Disclaimers & Warranty */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                7. Warranty Disclaimer (&quot;As Is&quot; &amp; &quot;As Available&quot;)
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p className="uppercase text-xs font-mono font-bold tracking-wider text-text-muted">
                Academic & Educational Notice:
              </p>
              <p>
                ALGO FLOW AND ALL ASSOCIATED VISUALIZERS, SIMULATIONS, SOURCE CODE TRACES, AND
                PRACTICE MATERIALS ARE PROVIDED ON AN &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
                BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT
                LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                ACCURACY OF COMPLEXITY RUNTIMES, OR UNINTERRUPTED OPERATION.
              </p>
              <p>
                While we strive for rigorous pedagogical precision, computational models and Big-O
                estimations are provided as educational approximations. We do not guarantee that
                platform materials will guarantee employment, interview success, or academic grades.
              </p>
            </div>
          </section>

          {/* Section 8: Limitation of Liability */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <ShieldAlert className="h-4 w-4 text-warning" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                8. Limitation of Liability
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL ALGO FLOW, ITS
                CREATORS, DIRECTORS, EMPLOYEES, OR INFRASTRUCTURE PARTNERS BE LIABLE FOR ANY
                INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT
                LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES
                RESULTING FROM:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
                <li>Your access to, use of, or inability to access or use the platform;</li>
                <li>
                  Any third-party conduct or content, including unauthorized database access or edge
                  network downtime;
                </li>
                <li>
                  Any bugs, errors, or inaccuracies in algorithmic visualizations or score
                  calculations.
                </li>
              </ul>
              <p>
                IN NO EVENT SHALL OUR AGGREGATE LIABILITY EXCEED THE GREATER OF ONE HUNDRED UNITED
                STATES DOLLARS ($100.00 USD) OR THE AMOUNT YOU PAID TO ALGO FLOW IN THE PAST TWELVE
                MONTHS.
              </p>
            </div>
          </section>

          {/* Section 9: Termination */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Scale className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                9. Account Termination & Suspension
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                You may discontinue your use of AlgoFlow at any time and may request deletion of
                your account and personal history from your Student Dashboard settings or by
                contacting support.
              </p>
              <p>
                We reserve the right, without prior notice, to suspend, limit, or terminate access
                to any account that engages in abusive conduct, automated scraping, competition
                cheating, or material violation of these Terms.
              </p>
            </div>
          </section>

          {/* Section 10: Amendments & Inquiries */}
          <section className="py-8 last:pb-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Mail className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                10. Amendments, Governing Law & Contact
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                We may revise these Terms from time to time to accommodate platform advancements,
                new visualizer features, or legal updates. When modifications are made, the revised
                version will be published here with an updated Effective Date. Continued use of Algo
                Flow following the posting of modifications indicates your binding acceptance.
              </p>
              <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70 mt-4">
                <p className="font-bold text-text-primary text-xs">
                  Official Legal Contact & Notices:
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  If you have questions, feedback, or legal inquiries regarding these Terms of
                  Service, please contact us at:
                </p>
                <p className="font-mono text-xs font-bold text-primary mt-2">
                  <a href="mailto:ganeshsharma7114@gmail.com" className="hover:underline">
                    ganeshsharma7114@gmail.com
                  </a>
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
