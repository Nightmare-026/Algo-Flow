import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import { TERMS_VERSION } from "@/lib/legal/policy-versions";

export const metadata: Metadata = {
  title: "Terms Status",
  description: "Current terms and launch-readiness status for Algo Flow.",
  alternates: { canonical: "/terms" },
};

const sections = [
  [
    "1. Draft status",
    "These are implementation-stage terms, not final launch terms. The legal operator, postal address, governing law and venue, monitored legal/contact channels, liability language, and other owner decisions are not verified. Account registration is disabled until approved terms are supplied and reviewed by qualified counsel.",
  ],
  [
    "2. Public educational use",
    "Public Algo Flow visualizers are available without an account for personal educational exploration. Visual traces and explanations are learning aids and may not replace authoritative course material, professional advice, or independent verification.",
  ],
  [
    "3. Eligibility and accounts",
    "Future account features are intended only for people aged 18 or older unless a verified guardian-consent program and specialist legal review are implemented. Users are responsible for protecting their credentials and reporting suspected unauthorized access through a verified channel once one is published.",
  ],
  [
    "4. Acceptable use",
    "Users must not attempt unauthorized access, disrupt the service, evade security or rate controls, upload malicious or unlawful material, probe other users' data, automate abusive account activity, infringe rights, or use the service in violation of applicable law.",
  ],
  [
    "5. User inputs and saved learning data",
    "Visualizer inputs should contain only data needed for the learning exercise and must not contain secrets or third-party personal data. If account saving is later enabled, users will control the learning inputs they choose to store, subject to published retention and deletion rules.",
  ],
  [
    "6. Intellectual property and open-source software",
    "Algo Flow branding and original service content remain subject to the rights of their verified owner. Third-party and open-source software remains governed by its own licenses. Final ownership, license, copyright-complaint, and content-reuse terms require owner verification before launch.",
  ],
  [
    "7. Third-party services",
    "The implementation uses Supabase and is audited at a Vercel-hosted address. Final terms must identify the actual services and explain that their availability and separate terms may affect the service. Social sign-in is currently disabled.",
  ],
  [
    "8. Availability, changes, suspension, and termination",
    "The service is under active development and may change or be unavailable. Any future suspension or termination rules, notice, appeal, account deletion, and data-retrieval periods must match real operational capability and applicable law before account registration opens.",
  ],
  [
    "9. Accuracy, disclaimers, and liability",
    "No final warranty disclaimer, liability cap, indemnity, consumer-rights treatment, or dispute clause is published because those provisions require verified ownership, jurisdiction, business model, and legal review. Nothing on this draft page should be read as excluding rights that cannot lawfully be excluded.",
  ],
  [
    "10. Contact and changes",
    "No verified legal, support, copyright, or postal contact has been supplied, so no placeholder or unmonitored address is published. Approved terms must carry an immutable version and effective date, describe prospective changes and notice, and identify a real monitored contact before registration is enabled.",
  ],
] as const;

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
        className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-36 sm:px-6 lg:px-8"
      >
        <p className="section-kicker">Draft terms</p>
        <h1 className="mt-3 text-4xl font-extrabold text-text-primary">Terms and launch status</h1>
        <p className="mt-4 text-sm text-text-secondary">
          Draft version: {TERMS_VERSION} ? Repository evidence checked 24 July 2026
        </p>
        <div
          role="status"
          className="mt-6 rounded-2xl border border-warning/25 bg-warning-muted p-5 text-sm leading-6 text-text-secondary"
        >
          These terms are not ready to govern new account creation. Registration remains closed
          until the missing owner and legal decisions are resolved.
        </div>
        <article className="neu-raised mt-8 max-w-none rounded-3xl p-6 text-text-secondary sm:p-10">
          {sections.map(([title, body]) => (
            <section key={title}>
              <h2 className="mb-4 mt-8 text-2xl font-semibold text-text-primary first:mt-0">
                {title}
              </h2>
              <p className="mb-4 leading-7">{body}</p>
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </div>
  );
}
