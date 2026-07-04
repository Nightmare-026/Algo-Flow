import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Algo Flow Terms and Conditions — rules for using the platform.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen py-16 px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Terms and Conditions</h1>
      <p className="text-text-muted mb-4">
        Effective Date: [Enter Date]
      </p>
      <p className="text-text-secondary leading-relaxed">
        Full terms and conditions will be added in Phase 12/13. This page will
        cover educational use, accounts, user inputs, bookmarks, sessions,
        acceptable use, IP, code examples, and service availability
        as specified in SRS Section 25.
      </p>
    </main>
  );
}
