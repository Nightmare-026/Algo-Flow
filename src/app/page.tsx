import type { Metadata } from "next";
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
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Algo Flow - Interactive Data Structures & Algorithms Visualizer",
  description:
    "Master Data Structures and Algorithms visually. Interactive step-by-step animations for arrays, trees, graphs, sorting, searching, linked lists, stacks, and queues with multi-language code traces.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Algo Flow - Interactive Data Structures & Algorithms Visualizer",
    description:
      "Master Data Structures and Algorithms visually. Interactive step-by-step animations with multi-language code traces.",
    url: "/",
    siteName: "Algo Flow",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Algo Flow Visualizer" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Algo Flow - Interactive Data Structures & Algorithms Visualizer",
    description: "Master Data Structures and Algorithms visually with step-by-step animations.",
    images: ["/opengraph-image"],
  },
};

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const publishedAlgos = algorithms.filter((algorithm) => algorithm.isPublished);
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar initialUser={user} />
      <main id="main-content">
        <HeroSection
          visualizerCount={publishedAlgos.length}
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
