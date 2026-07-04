"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { DSAWorldPreview } from "@/components/landing/DSAWorldPreview";
import { VisualizerCategories } from "@/components/landing/VisualizerCategories";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LearningFeatures } from "@/components/landing/LearningFeatures";
import { CodeLanguages } from "@/components/landing/CodeLanguages";
import { TrustStats } from "@/components/landing/TrustStats";
import { FinalCTA } from "@/components/landing/FinalCTA";

export default function HomePage() {
  return (
    <div data-theme="nature-cinematic">
      <Navbar />

      <main>
        {/* Hero with animated background elements */}
        <HeroSection />

        {/* Scroll-storytelling DSA World */}
        <DSAWorldPreview />

        {/* 10 Data Structure Categories */}
        <VisualizerCategories />

        {/* 5-Step Learning Flow */}
        <HowItWorks />

        {/* 9 Platform Features */}
        <LearningFeatures />

        {/* 4-Language Code Preview */}
        <CodeLanguages />

        {/* Animated Stats */}
        <TrustStats />

        {/* Final Call to Action */}
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}
