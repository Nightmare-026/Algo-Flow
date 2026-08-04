import type { Metadata } from "next";
import { dataStructures } from "@/data/seed/data-structures";
import { algorithms } from "@/data/seed/algorithms";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CatalogExplorer } from "./CatalogExplorer";

export const metadata: Metadata = {
  title: "Visualizer Library | Algo Flow",
  description:
    "Search interactive data structure and algorithm visualizers. Explore step-by-step traces for arrays, linked lists, stacks, queues, trees, graphs, and hash tables.",
};

export default function VisualizersPage() {
  const publishedAlgorithms = algorithms.filter((algorithm) => algorithm.isPublished);

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" className="flex-1 px-4 pb-24 pt-32 sm:px-6 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="section-kicker">Visualizer library</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Pick a structure. <span className="text-gradient-primary">Trace the behavior.</span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-text-secondary">
              Search {publishedAlgorithms.length} working visualizers across {dataStructures.length}{" "}
              data structures. Every result opens a real step-by-step workspace.
            </p>
          </div>

          <CatalogExplorer
            dataStructures={dataStructures}
            publishedAlgorithms={publishedAlgorithms}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
