import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/landing/HeroSection";
import { DSAWorldPreviewWrapper as DSAWorldPreview } from "@/components/landing/DSAWorldPreviewWrapper";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LearningFeatures } from "@/components/landing/LearningFeatures";
import { CodeLanguages } from "@/components/landing/CodeLanguages";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { getSiteUrl } from "@/lib/site";
import { catalogStats, publishedAlgorithms, publishedDataStructures } from "@/lib/catalog";
import { safeJsonLd } from "@/lib/security/safe-json";

export const metadata: Metadata = {
  title: "Algo Flow - Interactive Data Structures & Algorithms Visualizer",
  description:
    "Master Data Structures & Algorithms visually with interactive step-by-step visualizers, multi-language code execution, and practice quizzes.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Algo Flow - Interactive Data Structures & Algorithms Visualizer",
    description:
      "Master Data Structures & Algorithms visually with interactive step-by-step visualizers and multi-language code traces.",
    url: "/",
    siteName: "Algo Flow",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Algo Flow - Interactive Data Structures & Algorithms Visualizer",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Algo Flow - Interactive Data Structures & Algorithms Visualizer",
    description:
      "Master Data Structures & Algorithms visually with interactive step-by-step visualizers and multi-language code traces.",
    images: ["/opengraph-image"],
  },
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const siteUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Algo Flow",
        description: "Interactive Data Structures & Algorithms Visualizer",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/visualizers?search={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${siteUrl}/#organization`,
        name: "Algo Flow",
        url: siteUrl,
        logo: `${siteUrl}/icon.png`,
      },
    ],
  };

  return (
    <div className="page-shell flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
      />
      <Navbar initialUser={user} />
      <main id="main-content">
        <HeroSection
          visualizerCount={publishedAlgorithms.length}
          structureCount={publishedDataStructures.length}
          languageCount={catalogStats.languageCount}
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
