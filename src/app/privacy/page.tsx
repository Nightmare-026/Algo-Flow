import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Algo Flow Privacy Policy — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen py-16 px-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-text-muted mb-4">
        Effective Date: [Enter Date]
      </p>
      <p className="text-text-secondary leading-relaxed">
        Full privacy policy content will be added in Phase 12/13. This page will
        cover data collection, usage, rights, retention, and contact information
        as specified in SRS Section 24.
      </p>
    </main>
  );
}
