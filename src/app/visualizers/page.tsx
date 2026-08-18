import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CatalogExplorer } from "./CatalogExplorer";
import { getSiteUrl } from "@/lib/site";
import { catalogStats, publishedAlgorithms, publishedDataStructures } from "@/lib/catalog";
import { safeJsonLd } from "@/lib/security/safe-json";

export const metadata: Metadata = {
  title: "Visualizer Library",
  description: `Explore ${catalogStats.visualizerCount} interactive data structure and algorithm visualizers. Step-by-step traces for arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and dynamic programming.`,
  alternates: { canonical: "/visualizers" },
  openGraph: {
    title: "Visualizer Library | Algo Flow",
    description: `Explore ${catalogStats.visualizerCount} interactive data structure and algorithm visualizers with step-by-step code execution traces.`,
    url: "/visualizers",
    siteName: "Algo Flow",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: "Algo Flow Visualizer Library" },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visualizer Library | Algo Flow",
    description: `Explore ${catalogStats.visualizerCount} interactive data structure and algorithm visualizers.`,
    images: ["/opengraph-image"],
  },
};

export default function VisualizersPage() {
  const siteUrl = getSiteUrl();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/visualizers/#webpage`,
        url: `${siteUrl}/visualizers`,
        name: "Visualizer Library | Algo Flow",
        description:
          "Explore interactive data structure and algorithm visualizers with step-by-step traces.",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Visualizer Library",
            item: `${siteUrl}/visualizers`,
          },
        ],
      },
    ],
  };

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(structuredData) }}
      />
      <Navbar />
      <main id="main-content" className="flex-1 px-4 pb-24 pt-32 sm:px-6 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="section-kicker">Visualizer library</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Pick a structure. <span className="text-gradient-primary">Trace the behavior.</span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-text-secondary">
              Search {publishedAlgorithms.length} working visualizers across{" "}
              {publishedDataStructures.length} data structures. Every result opens a real
              step-by-step workspace.
            </p>
          </div>

          <CatalogExplorer
            dataStructures={publishedDataStructures}
            publishedAlgorithms={publishedAlgorithms}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
