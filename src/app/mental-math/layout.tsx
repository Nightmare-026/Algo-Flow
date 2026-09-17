import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { MentalMathShell } from "@/features/mental-math/components/MentalMathSubNav";

export const metadata: Metadata = {
  title: "Mental Math",
  description:
    "Master arithmetic speed and calculation fluency with structured mental math training, timed assessments, 60-second speed sprints, and official daily challenges.",
};

export default async function MentalMathLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="page-shell flex flex-col min-h-screen">
      <Navbar initialUser={user} />
      <MentalMathShell footer={<Footer />}>{children}</MentalMathShell>
    </div>
  );
}
