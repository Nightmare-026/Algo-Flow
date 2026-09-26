import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import { PRIVACY_VERSION } from "@/lib/legal/policy-versions";
import {
  ShieldCheck,
  Lock,
  Eye,
  Database,
  Globe,
  UserCheck,
  Server,
  AlertCircle,
  KeyRound,
  Mail,
  Scale,
} from "lucide-react";
import Link from "next/link";
import { LegalNav } from "@/components/legal/LegalNav";
import { catalogStats } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "AlgoFlow Privacy Policy and data governance. Learn how we collect, store, and protect your personal information, practice telemetry, and account data.",
  alternates: { canonical: "/privacy" },
};

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
        {/* Header Section */}
        <div className="text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-muted px-3.5 py-1 text-xs font-bold font-mono uppercase tracking-wider text-primary shadow-xs">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Data Protection & Privacy Standards</span>
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-primary tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-text-muted">
            Version {PRIVACY_VERSION} • Effective Date: September 5, 2026
          </p>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-text-secondary max-w-3xl">
            At AlgoFlow (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we believe that
            interactive education should be transparent, respectful of your privacy, and built on
            robust security foundations. This Privacy Policy details the exact types of information
            we collect, how your data is protected, and your statutory rights under global data
            protection frameworks including GDPR, CCPA/CPRA, and COPPA.
          </p>
          <LegalNav currentPath="/privacy" />
        </div>

        {/* Privacy at a Glance (Executive Summary) */}
        <div className="mt-10 p-6 sm:p-8 rounded-[8px] border border-border bg-surface shadow-card">
          <h2 className="font-bold uppercase tracking-wider text-xs font-mono text-primary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Privacy Principles at a Glance</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" />
                Zero Commercial Ad Monetization
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                We never sell, rent, license, or monetize your personal data or activity telemetry
                with third-party advertising networks. We use Google Analytics 4 solely for
                pseudonymous, aggregate traffic insights to improve the platform.
              </p>
            </div>

            <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" />
                Anonymous Public Exploration
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                All {catalogStats.visualizerCount} algorithm visualizers, code execution workspaces,
                and training sandboxes can be explored anonymously without an account.
              </p>
            </div>

            <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" />
                Minimalist OAuth (Google &amp; GitHub)
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                When using Sign in with Google or GitHub, we only request standard identity scopes
                (email and public profile). We never touch your private repositories or Google
                assets.
              </p>
            </div>

            <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-success" />
                PostgreSQL Row-Level Security
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Your database records (streaks, session telemetry, bookmarks) are strictly isolated
                with cryptographic user ID policies in Supabase.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Legal Sections */}
        <div className="mt-10 rounded-[8px] border border-border bg-surface p-6 sm:p-10 shadow-elevated divide-y divide-border/60">
          {/* Section 1: Overview & Public Mode */}
          <section className="py-8 first:pt-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Eye className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                1. Scope & Public Exploration Mode
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                AlgoFlow operates as an interactive Computer Science laboratory and educational
                workstation dedicated to algorithm visualization, data structure modeling, and
                computational mental arithmetic. This Privacy Policy operates in conjunction with
                our{" "}
                <Link href="/terms" className="text-primary hover:underline font-bold">
                  Terms of Service
                </Link>
                , our{" "}
                <Link href="/license" className="text-primary hover:underline font-bold">
                  License Agreement
                </Link>
                , and our dedicated{" "}
                <Link href="/cookies" className="text-primary hover:underline font-bold">
                  Cookie Policy
                </Link>
                .
              </p>
              <p>
                <strong>Guest & Public Access:</strong> You can access all visualizer simulations,
                tree and graph canvases, code editors, and calculation sandboxes without providing
                any personal identifying information. In guest mode, all execution states, timeline
                steps, array inputs, and scratch data remain exclusively within your client browser
                memory and are never transmitted to our persistent database servers.
              </p>
            </div>
          </section>

          {/* Section 2: Information We Collect */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Database className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                2. Information We Collect
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                When you create an account or authenticate on AlgoFlow, we collect only the minimum
                information necessary to maintain your student identity and provide personalized
                educational progress tracking:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
                <li>
                  <strong>Authentication Profile Data:</strong> When authenticating via OAuth 2.0
                  (Google or GitHub), we receive and store your primary email address, your public
                  display name, and your avatar profile URL. We do not store, view, or manage
                  plaintext passwords.
                </li>
                <li>
                  <strong>Practice & Telemetry Data:</strong> When authenticated, your learning
                  streaks, daily problem solves, mental math calculation scores, and bookmarked
                  algorithms are stored in your encrypted profile database row to synchronize
                  progress across sessions.
                </li>
                <li>
                  <strong>Anonymous Performance Aggregates:</strong> For mental math practice
                  challenges, completed rounds generate aggregate time and accuracy percentiles.
                  These records are stored without exposing personal identity to other students.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Third-Party Authentication (Google & GitHub OAuth) */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <KeyRound className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                3. Third-Party Authentication (Sign in with Google &amp; GitHub)
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                AlgoFlow offers seamless, secure single sign-on authentication through trusted OAuth
                2.0 identity providers (Google and GitHub). When you choose to authenticate via
                OAuth:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
                <li>
                  We request access strictly to{" "}
                  <strong>non-sensitive standard identity scopes</strong>:{" "}
                  <code className="font-mono text-xs bg-surface-inset px-1.5 py-0.5 rounded border border-border">
                    email
                  </code>
                  ,{" "}
                  <code className="font-mono text-xs bg-surface-inset px-1.5 py-0.5 rounded border border-border">
                    profile
                  </code>
                  , and{" "}
                  <code className="font-mono text-xs bg-surface-inset px-1.5 py-0.5 rounded border border-border">
                    openid
                  </code>
                  .
                </li>
                <li>
                  We receive and store only your email address, chosen public display name, and
                  avatar profile picture provided by the identity provider to instantiate your
                  authenticated student profile.
                </li>
                <li>
                  We <strong>never request, access, read, or store</strong> any private external
                  account assets, such as your private GitHub source code repositories, Google Drive
                  files, Gmail messages, or contacts.
                </li>
                <li>
                  Authentication tokens are securely exchanged directly via Supabase Auth and
                  encrypted over HTTPS TLS 1.3.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Purpose & Legal Bases for Processing */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Scale className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                4. Legal Bases & How We Use Your Information
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                Under the EU General Data Protection Regulation (GDPR), we process your data on the
                following lawful grounds:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
                <li>
                  <strong>Contractual Necessity:</strong> To deliver the core AlgoFlow platform
                  services you request, including maintaining your study account, authenticating
                  your sessions, saving your bookmarks, and rendering your Student Dashboard.
                </li>
                <li>
                  <strong>Legitimate Interests:</strong> To protect platform integrity, enforce rate
                  limits against automated scraping, prevent cheating on public daily challenge
                  leaderboards, and ensure high availability across global edge regions.
                </li>
                <li>
                  <strong>User Consent:</strong> For client-side optional preferences, such as
                  retaining customized visualizer layout settings in your browser storage.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5: Data Security & Row-Level Security */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Lock className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                5. Security Architecture & Row-Level Security (RLS)
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                We implement industry-grade defense-in-depth security measures to protect your
                information from unauthorized access, alteration, or disclosure:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
                <li>
                  <strong>PostgreSQL Row-Level Security (RLS):</strong> Every database table storing
                  personal user data (
                  <code className="font-mono text-xs bg-surface-inset px-1 py-0.5 rounded border border-border">
                    profiles
                  </code>
                  ,{" "}
                  <code className="font-mono text-xs bg-surface-inset px-1 py-0.5 rounded border border-border">
                    bookmarks
                  </code>
                  ,{" "}
                  <code className="font-mono text-xs bg-surface-inset px-1 py-0.5 rounded border border-border">
                    streaks
                  </code>
                  ,{" "}
                  <code className="font-mono text-xs bg-surface-inset px-1 py-0.5 rounded border border-border">
                    mental_math_sessions
                  </code>
                  ) is fortified with Postgres RLS policies. Your personal data is cryptographically
                  tied to your authenticated user ID and cannot be accessed or modified by other
                  users.
                </li>
                <li>
                  <strong>Public Educational Content Isolation:</strong> All{" "}
                  {catalogStats.visualizerCount} algorithm visualizer specifications, step
                  generators, and code templates are statically compiled and completely segregated
                  from user database records, requiring zero authentication or data-collection
                  overhead to run.
                </li>
                <li>
                  <strong>End-to-End Transport Encryption:</strong> All communications between your
                  client device, Vercel edge servers, and Supabase database endpoints are strictly
                  encrypted using TLS 1.3.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 6: Cookies & Local Storage */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Globe className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                6. Cookies & Client-Side Local Storage
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                AlgoFlow maintains a strict <strong>Zero-Ad-Tracker</strong> policy. We do not use
                third-party advertising cookies or cross-site tracking beacons.
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
                <li>
                  <strong>Essential Authentication Cookies:</strong> Used strictly to verify your
                  logged-in state across Next.js server components and API routes.
                </li>
                <li>
                  <strong>Analytics Cookies (Google Analytics 4):</strong> GA4 sets two cookies (
                  <code className="font-mono text-xs bg-surface-inset px-1 py-0.5 rounded border border-border">
                    _ga
                  </code>{" "}
                  and{" "}
                  <code className="font-mono text-xs bg-surface-inset px-1 py-0.5 rounded border border-border">
                    _ga_&lt;container-id&gt;
                  </code>
                  ) to collect pseudonymous, aggregate traffic metrics using random client
                  identifiers. GA4 advertising features are disabled; analytics data is never linked
                  to your account identity.
                </li>
                <li>
                  <strong>Browser Local Storage:</strong> Used to store your UI preferences
                  (Light/Dark theme, sound toggle, practice session settings) directly on your
                  device without sending unnecessary telemetry to external servers.
                </li>
              </ul>
              <p className="pt-2 text-xs">
                For a complete, itemized inventory of all storage keys, session cookies, expiration
                windows, and security attributes, please read our dedicated{" "}
                <Link href="/cookies" className="text-primary hover:underline font-bold">
                  Cookie Policy & Storage Inventory
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Section 7: Third-Party Subprocessors */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Server className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                7. Trusted Infrastructure Subprocessors
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                To provide high-performance, low-latency educational simulations globally, we
                partner with world-class cloud infrastructure providers:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-border rounded-xl overflow-hidden mt-2">
                  <thead className="bg-surface-inset border-b border-border text-text-primary font-mono uppercase">
                    <tr>
                      <th className="p-3">Subprocessor</th>
                      <th className="p-3">Service Role</th>
                      <th className="p-3">Security & Compliance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-text-secondary">
                    <tr>
                      <td className="p-3 font-bold text-text-primary">Supabase Inc.</td>
                      <td className="p-3">Postgres Database, Auth Engine, RLS Storage</td>
                      <td className="p-3">
                        SOC 2 Type II, ISO 27001 (HIPAA support available via Enterprise BAA)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-text-primary">Vercel Inc.</td>
                      <td className="p-3">
                        Global Edge CDN, Serverless Hosting &amp; Privacy-First Web Analytics
                      </td>
                      <td className="p-3">SOC 2 Type II, ISO 27001, Cookie-less Telemetry</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-text-primary">Google LLC</td>
                      <td className="p-3">
                        Google OAuth 2.0 Identity Provider (Optional SSO); Google Analytics 4
                        (aggregate traffic analytics)
                      </td>
                      <td className="p-3">
                        SOC 2, ISO 27001, EU-U.S. Data Privacy Framework (DPF) / Standard
                        Contractual Clauses (SCCs)
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-text-primary">GitHub Inc. / Microsoft</td>
                      <td className="p-3">GitHub OAuth 2.0 Identity Provider (Optional SSO)</td>
                      <td className="p-3">SOC 2, ISO 27001, Microsoft Enterprise DPA</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 8: Your Data Rights (GDPR & CCPA) */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <UserCheck className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                8. Your Legal Rights & Data Portability
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                Regardless of your geographic jurisdiction, we grant all learners universal privacy
                controls:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
                <li>
                  <strong>Right to Access & Inspect:</strong> You can view all saved sessions,
                  bookmarks, and practice telemetry directly from your{" "}
                  <Link href="/dashboard" className="text-primary hover:underline font-bold">
                    Student Dashboard
                  </Link>{" "}
                  or request a full data export.
                </li>
                <li>
                  <strong>Right to Rectification:</strong> You can update your display name, email,
                  and preferences at any time.
                </li>
                <li>
                  <strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> You have
                  the absolute right to delete your account and all associated practice history
                  permanently. Deletion removes your records from our live database immediately.
                </li>
                <li>
                  <strong>Right to Restrict or Object:</strong> You can opt out of any non-essential
                  processing by browsing in guest mode.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 9: Children's Privacy */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <AlertCircle className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                9. Protection of Children&apos;s Privacy (COPPA)
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                AlgoFlow is designed for computer science learners, students, and professionals. We
                do not knowingly collect or solicit personal information from children under the age
                of 13 (or under 16 in the European Economic Area) without parental or educational
                institution consent.
              </p>
              <p>
                If we discover that personal data of a minor under 13 has been collected without
                verifiable parental consent, we will take immediate steps to delete that account and
                associated records from our database.
              </p>
            </div>
          </section>

          {/* Section 10: Changes & Contact */}
          <section className="py-8 last:pb-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Mail className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                10. Policy Amendments & Contact Information
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                We may periodically update this Privacy Policy to reflect platform improvements, new
                educational features, or evolving regulatory standards. When material modifications
                occur, we will update the version number and effective date at the top of this
                document.
              </p>
              <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70 mt-4">
                <p className="font-bold text-text-primary text-xs">
                  Official Privacy & Legal Contact:
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  For privacy inquiries, data subject requests, or security disclosures, please
                  contact the AlgoFlow team directly at:
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
