import { notFound } from "next/navigation";
import { algorithms } from "@/data/seed/algorithms";
import { VisualizerClient } from "./VisualizerClient";

export default async function VisualizerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const algorithm = algorithms.find((item) => item.slug === slug && item.isPublished);

  if (!algorithm) notFound();

  return <VisualizerClient algorithm={algorithm} />;
}
