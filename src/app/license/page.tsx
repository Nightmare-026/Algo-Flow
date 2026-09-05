import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import { LICENSE_VERSION } from "@/lib/legal/policy-versions";
import {
  FileCode2,
  Award,
  BookOpen,
  Ban,
  ShieldCheck,
  CheckCircle2,
  Mail,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { LegalNav } from "@/components/legal/LegalNav";

export const metadata: Metadata = {
  title: "License Agreement | Algo Flow",
  description:
    "Official Proprietary Software License & Educational Study Agreement for Algo Flow. Read about permitted educational uses, commercial restrictions, and copyright rights.",
  alternates: { canonical: "/license" },
};

export default async function LicensePage() {
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
            <FileCode2 className="h-3.5 w-3.5" />
            <span>Official Intellectual Property & Software License</span>
          </span>
          <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-text-primary tracking-tight">
            License Agreement
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-text-muted">
            Version {LICENSE_VERSION} • Copyright © 2026 Nightmare. All Rights Reserved.
          </p>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-text-secondary max-w-3xl">
            This agreement governs the intellectual property rights, source code, interactive
            visualizers, simulation workflows, design tokens, and educational materials of Algo
            Flow. Please review what is permitted for personal study and the strict prohibitions
            regarding commercial duplication and distribution.
          </p>
          <LegalNav currentPath="/license" />
        </div>

        {/* License Principles at a Glance */}
        <div className="mt-10 neu-raised p-6 sm:p-8 rounded-3xl border border-border bg-surface shadow-[var(--shadow-raised-sm)]">
          <h2 className="text-base font-bold font-display text-text-primary uppercase tracking-wider text-xs font-mono text-primary flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            <span>Licensing Permissions at a Glance</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
            <div className="neu-inset p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)]">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Permitted: Personal Study & Learning
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                You are encouraged to explore, interact with, and learn from all 133 published
                algorithm visualizers across 12 data structure categories, code panels, and mental
                calculation drills for your personal education.
              </p>
            </div>

            <div className="neu-inset p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)]">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-success" />
                Permitted: Classroom & Academic Use
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Educators and professors are welcome to project Algo Flow in live academic
                classrooms or workshops to demonstrate computer science principles.
              </p>
            </div>

            <div className="neu-inset p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)]">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <Ban className="w-4 h-4 text-error" />
                Prohibited: Commercial Cloning & SaaS
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                Copying the platform, hosting unauthorized mirrors, reselling access, or repackaging
                our animations and workflows into competing commercial tools is strictly forbidden.
              </p>
            </div>

            <div className="neu-inset p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)]">
              <p className="text-xs font-bold font-display text-text-primary flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Proprietary Architecture & Assets
              </p>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                All bespoke Next.js layout structures, timeline scrubbers, multi-language code
                synchronization engines, and design assets are exclusive proprietary works.
              </p>
            </div>
          </div>
        </div>

        {/* Detailed License Sections */}
        <div className="neu-float mt-10 rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-xl divide-y divide-border/60">
          {/* Section 1: Proprietary Notice */}
          <section className="py-8 first:pt-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Award className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                1. Proprietary Software Notice & Ownership
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                Algo Flow, its source code, object code, TypeScript interfaces, Next.js
                architecture, component libraries, visual designs, animation state synchronization
                engines, mental math calculation studios, and associated documentation
                (collectively, the &quot;Software&quot;) are the exclusive intellectual property and
                proprietary assets of <strong>Nightmare</strong> (the &quot;Copyright Holder&quot;).
              </p>
              <p>
                All rights, title, and interest in and to the Software—including all worldwide
                copyrights, trade secrets, trademarks, patents, and moral rights—are retained
                exclusively by the Copyright Holder. No title, ownership, or intellectual property
                rights are conveyed or transferred under this Agreement.
              </p>
            </div>
          </section>

          {/* Section 2: Educational Study License */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <BookOpen className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                2. Grant of Limited Educational License
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                Subject to your ongoing compliance with this Agreement and our{" "}
                <Link href="/terms" className="text-primary hover:underline font-bold">
                  Terms of Service
                </Link>
                , the Copyright Holder grants you a personal, non-exclusive, non-transferable,
                revocable license to access, view, and interact with the Software solely for:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
                <li>
                  <strong>Personal Learning & Self-Study:</strong> Interactive study of computer
                  science data structures, algorithms, runtime complexities, and code logic.
                </li>
                <li>
                  <strong>Classroom & Teaching Demonstration:</strong> Displaying simulations during
                  live educational lectures, university seminars, or coding bootcamps
                  (non-commercial).
                </li>
                <li>
                  <strong>Interview Preparation:</strong> Practicing algorithmic tracing and mental
                  calculation drills for technical interview readiness.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 3: Prohibitions & Restrictions */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Ban className="h-4 w-4 text-warning" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                3. Express Prohibitions & Usage Restrictions
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                Except as explicitly authorized in writing by the Copyright Holder, you shall NOT
                under any circumstances:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
                <li>
                  <strong>Commercial Distribution or Reselling:</strong> Sell, rent, lease,
                  sublicense, bundle, distribute, or commercially exploit any part of the Software
                  or its interactive visualizer outputs.
                </li>
                <li>
                  <strong>Cloning & Derivative Platforms:</strong> Re-host, mirror, create
                  software-as-a-service (SaaS) products, or launch derivative websites that
                  replicate Algo Flow&apos;s features, user interface, or timeline scrubbing
                  workflows.
                </li>
                <li>
                  <strong>Reverse Engineering & Extraction:</strong> Decompile, disassemble, or
                  extract proprietary layout projection formulas, animation timing algorithms, or
                  source code for unauthorized deployment.
                </li>
                <li>
                  <strong>Removing Attribution:</strong> Remove, conceal, or alter any copyright
                  notices, watermarks, trademark logos, or legal disclaimers embedded within the
                  Software.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 4: Public Algorithmic Concepts */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Sparkles className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                4. Mathematical & Algorithmic Concepts
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                The fundamental theoretical concepts, asymptotic Big-O notations, and standard
                mathematical algorithms (such as Dijkstra&apos;s Algorithm, Breadth-First Search,
                Binary Search, AVL Rotations, and Quick Sort) represent universal computer science
                domain knowledge.
              </p>
              <p>
                This license does not claim ownership over universal mathematical facts. Rather,
                protection extends to the bespoke visualizer codebases, React/Next.js interactive
                components, state scrubbing pipelines, styling token systems, mental math test
                engines, and original pedagogical diagrams created for Algo Flow.
              </p>
            </div>
          </section>

          {/* Section 5: Warranty Disclaimer */}
          <section className="py-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <AlertTriangle className="h-4 w-4 text-warning" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                5. Disclaimer of Warranties
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p className="uppercase text-xs font-mono font-bold tracking-wider text-text-muted">
                Statutory Disclaimer:
              </p>
              <p>
                THE SOFTWARE IS PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR
                A PARTICULAR PURPOSE, TITLE, ACCURACY, AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
                COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
                SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES ARISING IN ANY WAY OUT OF THE USE OR
                EVALUATION OF THIS SOFTWARE.
              </p>
            </div>
          </section>

          {/* Section 6: Licensing Inquiries */}
          <section className="py-8 last:pb-0">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-muted text-primary border border-primary/20 shadow-xs">
                <Mail className="h-4 w-4" />
              </span>
              <h2 className="text-xl font-bold font-display text-text-primary tracking-tight">
                6. Licensing Inquiries & Enterprise Partnerships
              </h2>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-text-secondary pl-0 sm:pl-12">
              <p>
                For institutional academic licensing, commercial integration permissions, or bespoke
                educational partnerships, please contact the author directly:
              </p>
              <div className="neu-inset p-4 rounded-2xl border border-border bg-surface-inset shadow-[var(--shadow-inset)] mt-4">
                <p className="font-bold text-text-primary text-xs">Licensing Representative:</p>
                <p className="text-xs text-text-secondary mt-1">
                  Nightmare / Algo Flow Licensing Office
                </p>
                <p className="font-mono text-xs font-bold text-primary mt-2">
                  <a href="mailto:ganeshsharma7114@gmail.com" className="hover:underline">
                    ganeshsharma7114@gmail.com
                  </a>
                </p>
              </div>
              <p className="text-xs text-text-muted mt-3">
                Platform access and user accounts remain subject to our{" "}
                <Link href="/terms" className="text-primary hover:underline font-bold">
                  Terms of Service
                </Link>
                ,{" "}
                <Link href="/privacy" className="text-primary hover:underline font-bold">
                  Privacy Policy
                </Link>
                , and{" "}
                <Link href="/cookies" className="text-primary hover:underline font-bold">
                  Cookie Policy
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
