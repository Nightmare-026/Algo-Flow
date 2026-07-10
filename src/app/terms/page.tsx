import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Algo Flow",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-deep text-text-primary">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-28 sm:px-6 lg:px-8 flex-1">
        <h1 className="text-4xl font-bold mb-8 text-text-primary">Terms of Service</h1>
        
        <div className="prose prose-invert max-w-none text-text-secondary">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-text-primary">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using Algo Flow, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access our service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-text-primary">2. Use License</h2>
          <p className="mb-4">
            Permission is granted to temporarily use the materials and visualizers on Algo Flow for personal, non-commercial educational viewing only. This is the grant of a license, not a transfer of title.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-text-primary">3. User Accounts</h2>
          <p className="mb-4">
            When you create an account with us, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-text-primary">4. Educational Purpose</h2>
          <p className="mb-4">
            Algo Flow is designed for educational purposes. While we strive to ensure the accuracy of the algorithms and data structures presented, we do not warrant that all materials are complete, accurate, or current.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-text-primary">5. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
