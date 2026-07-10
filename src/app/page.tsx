"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { DSAWorldPreview } from "@/components/landing/DSAWorldPreview";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LearningFeatures } from "@/components/landing/LearningFeatures";
import { CodeLanguages } from "@/components/landing/CodeLanguages";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function HomePage() {
  return (
    <div>
      <Navbar />

      <main>
        {/* Hero with animated background elements */}
        <HeroSection />

        {/* Product preview */}
        <DSAWorldPreview />

        {/* Learning workflow */}
        <HowItWorks />

        {/* Study tools */}
        <LearningFeatures />

        {/* Code panel preview */}
        <CodeLanguages />

        {/* Final Call to Action */}
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}



