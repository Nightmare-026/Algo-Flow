import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";
import { Footer } from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Algo Flow",
};

export default async function PrivacyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar initialUser={user} />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-24 pt-36 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-text-primary">Privacy Policy</h1>

        <div className="neu-raised mt-8 max-w-none rounded-3xl p-6 text-text-secondary sm:p-10 [&_h2]:text-text-primary [&_p]:leading-7">
          <p>Last updated: July 17, 2026</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-text-primary">
            1. Information We Collect
          </h2>
          <p className="mb-4">
            We collect information you provide directly to us, such as when you create or modify
            your account, use our interactive visualizers, save your progress, or communicate with
            us. This includes your email address, profile information, and usage data within the
            application.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-text-primary">
            2. How We Use Your Information
          </h2>
          <p className="mb-4">
            We use the information we collect to provide, maintain, and improve our services. This
            includes securely storing your learning progress, bookmarks, and visualizer sessions so
            you can seamlessly resume your learning journey across devices.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-text-primary">3. Data Security</h2>
          <p className="mb-4">
            We implement appropriate technical and organizational measures to protect your personal
            data against unauthorized or unlawful processing, accidental loss, destruction, or
            damage. We utilize industry-standard authentication (Supabase) to securely manage your
            credentials.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-text-primary">
            4. Cookies and Local Storage
          </h2>
          <p className="mb-4">
            We use cookies and local storage to keep you logged in, save your local preferences
            (such as theme and animation speeds), and analyze site traffic to optimize the user
            experience.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4 text-text-primary">5. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact us at
            support@algoflow.dev.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
