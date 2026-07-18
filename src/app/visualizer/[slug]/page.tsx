import { notFound } from "next/navigation";
import { algorithms } from "@/data/seed/algorithms";
import { VisualizerClient } from "./VisualizerClient";
import { publicationRegistry } from "@/visualizers/registry/publication-registry";

export default async function VisualizerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const algorithm = algorithms.find((item) => item.slug === slug && item.isPublished);

  if (!algorithm) notFound();

  const legend = publicationRegistry[slug]?.authoredArtifacts?.legend ?? [];

  return <VisualizerClient algorithm={algorithm} legend={legend} />;
}
