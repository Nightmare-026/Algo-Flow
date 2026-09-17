import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";

import { SITE_NAME } from "@/lib/constants/site";

export const metadata: Metadata = {
  title: {
    default: `DSA Curriculum & Learnings | ${SITE_NAME}`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Master Data Structures & Algorithms with 12 comprehensive modules, 62 in-depth chapters, memory layout diagrams, and interactive visualizers.",
};

export default async function LearningsLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar initialUser={user} />
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 pt-18 flex flex-col min-h-0 outline-none"
      >
        {children}
      </main>
    </div>
  );
}
