import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";
import { PRIVACY_VERSION } from "@/lib/legal/policy-versions";

export const metadata: Metadata = {
  title: "Privacy Policy Status",
  description: "Current privacy and data-flow status for Algo Flow.",
  alternates: { canonical: "/privacy" },
};

const sections = [
  ["1. Status and scope", "This is a technical disclosure draft, not a final launch policy. The operator identity, postal address, jurisdiction, monitored privacy contact, retention schedule, and hosted-service facts have not been verified. Account registration is disabled until those facts are supplied and the policy receives qualified legal review."],
  ["2. Public visualizers", "Public visualizers can be used without an account. Numbers, strings, matrices, trees, and graph files entered into a visualizer are processed in browser state unless an authenticated user explicitly saves a session. Graph JSON is parsed as data, size-limited, and schema-validated; it is not executed."],
  ["3. Existing account data", "The code supports email authentication, profiles, interface preferences, progress, streaks, bookmarks, saved visualizer sessions, quiz attempts, and activity history through Supabase. Legacy profile schemas include nullable name and gender fields, but the disabled future signup flow no longer requests them."],
  ["4. Eligibility and future registration", "If registration is enabled after legal review, it is intended to be limited to people aged 18 or older. The minimized flow will request email and password plus an 18+ assertion and exact Terms/Privacy version acceptance. Algo Flow does not currently implement a guardian-consent flow and must not request personal data from users under 18."],
  ["5. Purposes", "Account data is used to authenticate users, secure sessions, restore preferences, save learning progress and sessions, show bookmarks and streaks, record quiz results, and support account recovery. No advertising or marketing purpose is implemented in the repository."],
  ["6. Cookies and local storage", "Supabase session cookies keep existing users signed in. Browser local storage stores the selected theme and preferred code language. No application analytics, advertising, or marketing SDK was found, although platform-level logging or analytics still requires dashboard verification."],
  ["7. Service providers and transfers", "Supabase is used for Auth and Postgres access, and the audited site uses a Vercel domain. The exact production projects, regions, subprocessors, email provider, logs, backups, contractual terms, and cross-border safeguards are not verified. Google and GitHub social sign-in code exists but is disabled while onboarding is closed."],
  ["8. Security", "Local controls include server-side session checks, owner-scoped row-level security definitions, minimized signup fields, non-enumerating auth errors, a 12-character password minimum, secure password-change settings, request limits, and strict graph-import validation. Hosted configuration, leaked-password protection, CAPTCHA, advisories, incident monitoring, and recovery remain unverified."],
  ["9. Retention, deletion, export, and rights", "No approved retention schedule or complete account export/deletion workflow exists. Individual bookmarks and saved sessions have deletion operations, but account-wide deletion, backup deletion, access/export, correction, objection, withdrawal, and grievance workflows are release blockers."],
  ["10. Breach response and contact", "A breach-response owner, notification process, monitored privacy/grievance mailbox, and postal contact have not been supplied. No unverified email address is published. Registration and production-readiness approval remain blocked until these operational contacts and procedures are real and tested."],
] as const;

export default async function PrivacyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar initialUser={user} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        <p className="section-kicker">Draft disclosure</p>
        <h1 className="mt-3 text-4xl font-extrabold text-text-primary">Privacy and data-flow status</h1>
        <p className="mt-4 text-sm text-text-secondary">Draft version: {PRIVACY_VERSION} ? Repository evidence checked 24 July 2026</p>
        <div role="status" className="mt-6 rounded-2xl border border-warning/25 bg-warning-muted p-5 text-sm leading-6 text-text-secondary">
          This draft is intentionally not presented as a complete legal policy. Account registration is closed while operator and processing facts are verified.
        </div>
        <article className="neu-raised mt-8 max-w-none rounded-3xl p-6 text-text-secondary sm:p-10">
          {sections.map(([title, body]) => (
            <section key={title}>
              <h2 className="mb-4 mt-8 text-2xl font-semibold text-text-primary first:mt-0">{title}</h2>
              <p className="mb-4 leading-7">{body}</p>
            </section>
          ))}
        </article>
      </main>
      <Footer />
    </div>
  );
}
