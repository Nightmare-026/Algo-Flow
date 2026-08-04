import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { dataStructures } from "@/data/seed/data-structures";
import { algorithms } from "@/data/seed/algorithms";
import { operations } from "@/data/seed/operations";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { buttonVariants } from "@/components/ui/button";
import { CategoryExplorer } from "./CategoryExplorer";
import { getSiteUrl } from "@/lib/site";

export function generateStaticParams() {
  return dataStructures
    .filter((structure) => structure.isPublished)
    .map((structure) => ({ category: structure.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const structure = dataStructures.find((item) => item.slug === category && item.isPublished);
  if (!structure) return {};

  const title = `${structure.name} Visualizers | Algo Flow`;
  const description = `${structure.description} Explore interactive step-by-step traces and visualizers for ${structure.name} algorithms.`;
  return {
    title,
    description,
    alternates: { canonical: `/visualizers/${structure.slug}` },
    openGraph: {
      title,
      description,
      url: `/visualizers/${structure.slug}`,
      siteName: "Algo Flow",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${structure.name} Visualizers` }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const structure = dataStructures.find((item) => item.slug === category && item.isPublished);

  if (!structure) {
    return (
      <div className="page-shell flex min-h-screen flex-col">
        <Navbar />
        <main id="main-content" className="flex flex-1 items-center justify-center px-4 pb-20 pt-32">
          <div className="neu-raised max-w-lg rounded-3xl p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-error" aria-hidden="true" />
            <h1 className="mt-5 text-3xl font-extrabold">Category not found</h1>
            <p className="mt-3 text-text-secondary">
              The requested data structure is not in the published library.
            </p>
            <Link href="/visualizers" className={buttonVariants({ className: "mt-7" })}>
              Return to the library
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const structureAlgorithms = algorithms
    .filter((algorithm) => algorithm.isPublished && algorithm.dataStructureId === structure.id)
    .sort((left, right) =>
      left.priority === right.priority
        ? left.name.localeCompare(right.name)
        : left.priority.localeCompare(right.priority)
    );

  const operationCounts = new Map<string, number>();
  for (const algorithm of structureAlgorithms) {
    operationCounts.set(algorithm.operationId, (operationCounts.get(algorithm.operationId) ?? 0) + 1);
  }

  const structureOperations = operations
    .filter(
      (operation) =>
        operation.dataStructureId === structure.id &&
        operation.isPublished &&
        (operationCounts.get(operation.id) ?? 0) > 0
    )
    .sort((left, right) => left.displayOrder - right.displayOrder);

  const siteUrl = getSiteUrl();
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${siteUrl}/visualizers/${structure.slug}/#webpage`,
        url: `${siteUrl}/visualizers/${structure.slug}`,
        name: `${structure.name} Visualizers | Algo Flow`,
        description: structure.description,
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
          {
            "@type": "ListItem",
            position: 3,
            name: `${structure.name} Visualizers`,
            item: `${siteUrl}/visualizers/${structure.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="page-shell flex min-h-screen flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main id="main-content" className="flex-1 px-4 pb-24 pt-32 sm:px-6 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/visualizers"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary-active"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Visualizer library
          </Link>

          <div className="mt-5 max-w-3xl">
            <p className="section-kicker">{structure.category.replace("-", " ")} structure</p>
            <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">
              {structure.name} <span className="text-gradient-primary">algorithms</span>
            </h1>
            <p className="mt-5 text-lg leading-8 text-text-secondary">
              {structure.description} Choose a trace, set its input, and step through the state
              changes.
            </p>
          </div>

          <CategoryExplorer
            structure={structure}
            structureAlgorithms={structureAlgorithms}
            structureOperations={structureOperations}
            operationCounts={operationCounts}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
