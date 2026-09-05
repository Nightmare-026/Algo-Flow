import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { algorithms } from "@/data/seed/algorithms";
import { VisualizerClient } from "./VisualizerClient";
import { publicationRegistry } from "@/visualizers/registry/publication-registry";
import { getSiteUrl } from "@/lib/site";
import { safeJsonLd } from "@/lib/security/safe-json";

export function generateStaticParams() {
  return algorithms
    .filter((algorithm) => algorithm.isPublished)
    .map((algorithm) => ({ slug: algorithm.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const algorithm = algorithms.find((item) => item.slug === slug && item.isPublished);
  if (!algorithm) return {};

  const title = `${algorithm.name} Visualizer`;
  const rawDesc = `${algorithm.shortDescription} Interactive step-by-step visualizer with code traces.`;
  const description = rawDesc.length > 155 ? `${rawDesc.slice(0, 152)}...` : rawDesc;
  return {
    title,
    description,
    alternates: { canonical: `/visualizer/${algorithm.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/visualizer/${algorithm.slug}`,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${algorithm.name} Visualizer - Algo Flow`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function VisualizerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const algorithm = algorithms.find((item) => item.slug === slug && item.isPublished);

  if (!algorithm) notFound();

  const legend = publicationRegistry[slug]?.authoredArtifacts?.legend ?? [];
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        "@id": `${siteUrl}/visualizer/${algorithm.slug}#learning-resource`,
        name: `${algorithm.name} Interactive Visualizer`,
        description: algorithm.shortDescription,
        educationalUse: "Demonstration",
        learningResourceType: "Interactive Simulation",
        educationalLevel: algorithm.difficulty,
        inLanguage: "en",
        url: `${siteUrl}/visualizer/${algorithm.slug}`,
        provider: {
          "@type": "Organization",
          name: "Algo Flow",
          url: siteUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteUrl}/visualizer/${algorithm.slug}#breadcrumb`,
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
            name: "Visualizers",
            item: `${siteUrl}/visualizers`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: algorithm.name,
            item: `${siteUrl}/visualizer/${algorithm.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }} />
      <VisualizerClient algorithm={algorithm} legend={legend} />
    </>
  );
}
