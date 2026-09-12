import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: {
    default: "DSA Curriculum & Learnings",
    template: "%s | Algo Flow",
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
      <div className="flex-1 pt-18 flex flex-col min-h-0">{children}</div>
    </div>
  );
}
