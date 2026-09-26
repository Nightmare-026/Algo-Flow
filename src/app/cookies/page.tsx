import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import { COOKIE_VERSION } from "@/lib/legal/policy-versions";
import {
  Cookie,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Database,
  Globe,
  Sliders,
  Mail,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";
import { LegalNav } from "@/components/legal/LegalNav";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Cookie Policy and local storage transparency for AlgoFlow. Learn about our zero-ad-tracker approach, essential cookies, and client-side preferences.",
  alternates: { canonical: "/cookies" },
};

export default async function CookiesPage() {
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
            <Cookie className="h-3.5 w-3.5" />
            <span>Cookie & Storage Transparency Standards</span>
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-primary tracking-tight">
            Cookie Policy
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-text-muted">
            Version {COOKIE_VERSION} • Effective Date: September 5, 2026
          </p>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-text-secondary max-w-3xl">
            At AlgoFlow, we believe in radical transparency. We operate a strict{" "}
            <strong>Zero-Ad-Tracker</strong> policy: we never deploy commercial advertising cookies,
            cross-site tracking beacons, or behavioral monitoring scripts. We use Google Analytics 4
            (GA4) solely for anonymous, aggregate traffic insights to improve the platform. This
            document details the cookies and browser storage tokens used to operate the platform.
          </p>
          <LegalNav currentPath="/cookies" />
        </div>

        {/* Cookie Principles at a Glance */}
        <div className="mt-10 p-6 sm:p-8 rounded-[8px] border border-border bg-surface shadow-card">
          <h2 className="font-bold uppercase tracking-wider text-xs font-mono text-primary flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Cookie Principles at a Glance</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Zero Commercial Ad Tracking
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                No third-party ad networks, no retargeting pixels, and no data harvesting brokers
                ever operate on our domains.
              </p>
            </div>

            <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Privacy-Focused Analytics
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                We use Google Analytics 4 solely for anonymous, aggregate traffic insights. GA4 is
                never used for advertising, remarketing, or profiling.
              </p>
            </div>

            <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-primary" />
                Secure HttpOnly Attributes
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Authentication tokens are protected by `HttpOnly`, `SameSite=Lax`, and `Secure`
                flags to prevent XSS credential theft.
              </p>
            </div>

            <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-primary" />
                Local Storage for Preferences
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Your theme (Dark/Light) and visualizer layout preferences remain strictly stored on
                your local browser device.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="mt-10 rounded-[8px] border border-border bg-surface p-6 sm:p-10 shadow-elevated divide-y divide-border/60">
          {/* Section 1: What Are Cookies */}
          <section className="py-8 first:pt-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <HelpCircle className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                1. What Are Cookies & Local Storage?
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                Cookies are small text files placed on your computer or mobile device by websites
                that you visit. They are widely used to make web applications work efficiently and
                provide secure authentication states.
              </p>
              <p>
                In addition to standard HTTP cookies, modern web applications utilize{" "}
                <strong>HTML5 Local Storage</strong>—a client-side persistent storage mechanism that
                allows non-sensitive preferences (such as your chosen visual theme) to persist on
                your device without sending redundant network traffic to external servers with every
                page request. Local storage is never used for authentication credentials or
                sensitive cryptographic keys.
              </p>
            </div>
          </section>

          {/* Section 2: Exact Cookies Used */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Lock className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                2. Inventory of Cookies Used on AlgoFlow
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                We maintain an exhaustive and minimal list of cookies. Authentication cookies on
                AlgoFlow are classified as <strong>Strictly Necessary</strong>, and analytics
                cookies are classified as <strong>Performance / Analytics</strong>:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-border rounded-xl overflow-hidden mt-2">
                  <thead className="bg-surface-inset border-b border-border text-text-primary font-mono uppercase">
                    <tr>
                      <th className="p-3">Cookie Name</th>
                      <th className="p-3">Purpose & Function</th>
                      <th className="p-3">Type & Security</th>
                      <th className="p-3">Lifespan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-text-secondary">
                    <tr>
                      <td className="p-3 font-mono font-bold text-text-primary">sb-*-auth-token</td>
                      <td className="p-3">
                        Maintains authenticated session state via Supabase Auth
                      </td>
                      <td className="p-3 font-mono">
                        Strictly Necessary &bull; HttpOnly, Secure, SameSite
                      </td>
                      <td className="p-3">Session / 1 Year</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-text-primary">
                        sb-*-refresh-token
                      </td>
                      <td className="p-3">
                        Allows automatic cryptographic renewal of expired session tokens
                      </td>
                      <td className="p-3 font-mono">Strictly Necessary &bull; HttpOnly, Secure</td>
                      <td className="p-3">Session / 1 Year</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-text-primary">_ga</td>
                      <td className="p-3">
                        Distinguishes unique visitors using a randomly generated pseudonymous client
                        identifier (Google Analytics 4)
                      </td>
                      <td className="p-3 font-mono">
                        Performance / Analytics &bull; SameSite=Lax, Secure
                      </td>
                      <td className="p-3">2 Years</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-text-primary">
                        _ga_&lt;container-id&gt;
                      </td>
                      <td className="p-3">
                        Persists session state (e.g., page view count within a session) for Google
                        Analytics 4
                      </td>
                      <td className="p-3 font-mono">
                        Performance / Analytics &bull; SameSite=Lax, Secure
                      </td>
                      <td className="p-3">2 Years</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-text-muted mt-3">
                <em>Privacy-First Web Telemetry:</em> In addition to GA4, AlgoFlow uses Vercel Web
                Analytics to monitor platform health and Core Web Vitals. Vercel Web Analytics
                operates completely
                <strong> cookie-less</strong>—it does not use cookies, does not persist identifiers
                across sites, and does not store personal data.
              </p>
              <p className="text-xs text-text-muted mt-2">
                <em>GA4 restrictions on AlgoFlow:</em> Google Analytics advertising features,
                remarketing, and user-level profiling are <strong>disabled</strong>. Analytics data
                is never linked to your AlgoFlow account identity or shared with third-party
                advertisers.
              </p>
            </div>
          </section>

          {/* Section 3: Local Storage Inventory */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Database className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                3. Browser Local Storage Inventory
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                We use browser local storage exclusively for your convenience, ensuring your
                interactive workspace preserves your preferences across visits:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-border rounded-xl overflow-hidden mt-2">
                  <thead className="bg-surface-inset border-b border-border text-text-primary font-mono uppercase">
                    <tr>
                      <th className="p-3">Storage Key</th>
                      <th className="p-3">Data Stored</th>
                      <th className="p-3">Privacy Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60 text-text-secondary">
                    <tr>
                      <td className="p-3 font-mono font-bold text-text-primary">algo-flow-theme</td>
                      <td className="p-3">
                        Stores active UI color theme (&quot;dark&quot; or &quot;light&quot;)
                      </td>
                      <td className="p-3">Zero tracking; strictly local client presentation</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-text-primary">algo-flow-lang</td>
                      <td className="p-3">
                        Persists preferred programming language for code panel
                        (&quot;javascript&quot;, &quot;python&quot;, &quot;cpp&quot;,
                        &quot;java&quot;)
                      </td>
                      <td className="p-3">Zero tracking; strictly client editor utility</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-text-primary">
                        algo_flow_sound_muted
                      </td>
                      <td className="p-3">
                        Persists audio sound effects toggle for mental math exercises
                      </td>
                      <td className="p-3">Zero tracking; strictly client audio utility</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-text-primary">
                        visualizer-tour-[slug]
                      </td>
                      <td className="p-3">
                        Records whether the interactive tour has been completed for a specific
                        algorithm
                      </td>
                      <td className="p-3">Zero tracking; prevents repetitive tour popups</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-text-primary">
                        algo_flow_mental_math_stats_v1
                      </td>
                      <td className="p-3">
                        Caches local calculation statistics, operation mastery radar, and practice
                        session history
                      </td>
                      <td className="p-3">
                        Zero tracking; enables seamless offline-friendly practice tracking
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-text-primary">
                        algoflow_completed_chapters
                      </td>
                      <td className="p-3">
                        Tracks completed DSA curriculum chapters for guest and offline study
                        progress
                      </td>
                      <td className="p-3">
                        Zero tracking; strictly client-side educational progress state
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Section 4: How to Manage and Disable Cookies */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Globe className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                4. Managing & Disabling Cookies
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                You have the full right to decide whether to accept or reject cookies. You can
                exercise your cookie preferences by adjusting your browser settings:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
                <li>
                  <strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and
                  other site data.
                </li>
                <li>
                  <strong>Mozilla Firefox:</strong> Options → Privacy &amp; Security → Cookies and
                  Site Data.
                </li>
                <li>
                  <strong>Apple Safari:</strong> Preferences → Privacy → Manage Website Data.
                </li>
                <li>
                  <strong>Microsoft Edge:</strong> Settings → Cookies and site permissions → Manage
                  and delete cookies and site data.
                </li>
              </ul>
              <p className="text-xs text-text-muted mt-2">
                <em>Note:</em> If you choose to block all cookies, public visualizers will continue
                to function fully in guest mode, but persistent account authentication (Sign in)
                will be unavailable.
              </p>
            </div>
          </section>

          {/* Section 5: Contact & Inquiries */}
          <section className="py-8 last:pb-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Mail className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                5. Cookie Policy Inquiries
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                If you have questions about our use of cookies, local storage, or data protection
                standards, please contact our team:
              </p>
              <div className="p-4 rounded-[6px] border border-border bg-surface-secondary/70 mt-4">
                <p className="font-bold text-text-primary text-xs">Official Privacy Office:</p>
                <p className="text-xs text-text-secondary mt-1">
                  AlgoFlow Data Protection Representative
                </p>
                <p className="font-mono text-xs font-bold text-primary mt-2">
                  <a href="mailto:ganeshsharma7114@gmail.com" className="hover:underline">
                    ganeshsharma7114@gmail.com
                  </a>
                </p>
              </div>
              <p className="text-xs text-text-muted mt-3">
                For additional details regarding our data governance, please consult our{" "}
                <Link href="/privacy" className="text-primary hover:underline font-bold">
                  Privacy Policy
                </Link>
                ,{" "}
                <Link href="/terms" className="text-primary hover:underline font-bold">
                  Terms of Service
                </Link>
                , and{" "}
                <Link href="/license" className="text-primary hover:underline font-bold">
                  License Agreement
                </Link>
                .
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
