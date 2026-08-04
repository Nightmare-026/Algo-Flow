import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algorithm Visualizer Library",
  description:
    "Browse Algo Flow's published array, linked-list, stack, queue, tree, graph, hash, matrix, and string visualizers.",
  alternates: { canonical: "/visualizers" },
};

export default function VisualizersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
