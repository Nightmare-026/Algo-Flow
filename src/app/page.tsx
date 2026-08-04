import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { algorithms } from "@/data/seed/algorithms";
import { dataStructures } from "@/data/seed/data-structures";
import { HeroSection } from "@/components/landing/HeroSection";
import { DSAWorldPreviewWrapper as DSAWorldPreview } from "@/components/landing/DSAWorldPreviewWrapper";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LearningFeatures } from "@/components/landing/LearningFeatures";
import { CodeLanguages } from "@/components/landing/CodeLanguages";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="page-shell flex flex-col">
      <Navbar initialUser={user} />
      <main id="main-content">
        <HeroSection
          visualizerCount={algorithms.filter((algorithm) => algorithm.isPublished).length}
          structureCount={dataStructures.filter((structure) => structure.isPublished).length}
        />
        <DSAWorldPreview />
        <HowItWorks />
        <LearningFeatures />
        <CodeLanguages />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
