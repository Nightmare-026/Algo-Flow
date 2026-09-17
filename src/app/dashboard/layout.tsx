import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export default async function SectionLayout({ children }: { children: ReactNode }) {
  const isDev = process.env.NODE_ENV === "development";
  const isDevMockAuth = isDev && process.env.DEV_MOCK_AUTH === "true";

  let user: User | null = null;
  try {
    const supabase = await createClient();
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch {
    // ignore
  }

  if (!user && isDevMockAuth) {
    user = {
      id: "dev-mock-user-id",
      email: "developer@algoflow.local",
      app_metadata: { provider: "dev", providers: ["google", "dev"] },
      user_metadata: { full_name: "Local Developer", first_name: "Dev" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
      role: "authenticated",
    } as unknown as User;
  }

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar initialUser={user} />
      <main id="main-content" className="flex-1 pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
