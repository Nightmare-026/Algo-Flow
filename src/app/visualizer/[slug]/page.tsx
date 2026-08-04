import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { algorithms } from "@/data/seed/algorithms";
import { VisualizerClient } from "./VisualizerClient";
import { publicationRegistry } from "@/visualizers/registry/publication-registry";

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
  const description = `${algorithm.shortDescription} Trace each committed step with synchronized state, explanation, pseudocode, and source code.`;
  return {
    title,
    description,
    alternates: { canonical: `/visualizer/${algorithm.slug}` },
    openGraph: {
      type: "website",
      title,
      description,
      url: `/visualizer/${algorithm.slug}`,
    },
  };
}

export default async function VisualizerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const algorithm = algorithms.find((item) => item.slug === slug && item.isPublished);

  if (!algorithm) notFound();

  const legend = publicationRegistry[slug]?.authoredArtifacts?.legend ?? [];

  return <VisualizerClient algorithm={algorithm} legend={legend} />;
}
