import type { MetadataRoute } from "next";
import { algorithms } from "@/data/seed/algorithms";
import { dataStructures } from "@/data/seed/data-structures";
import { LEARNING_MODULES } from "@/lib/learnings/registry";
import { getSiteUrl } from "@/lib/site";

const lastModified = new Date(process.env.BUILD_TIME || "2026-03-01T00:00:00.000Z");

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const staticRoutes = [
    "",
    "/visualizers",
    "/learnings",
    "/privacy",
    "/terms",
    "/license",
    "/cookies",
    "/feedback",
    "/mental-math",
    "/mental-math/practice",
    "/mental-math/speed",
    "/mental-math/test",
    "/mental-math/daily",
    "/mental-math/leaderboard",
    "/mental-math/progress",
  ];
  const structureRoutes = dataStructures
    .filter((structure) => structure.isPublished)
    .map((structure) => `/visualizers/${structure.slug}`);
  const algorithmRoutes = Array.from(
    new Set(
      algorithms
        .filter((algorithm) => algorithm.isPublished)
        .map((algorithm) => `/visualizer/${algorithm.slug}`)
    )
  );
  const curriculumRoutes = LEARNING_MODULES.flatMap((mod) => [
    `/learnings/${mod.slug}`,
    ...mod.chapters.map((ch) => `/learnings/${mod.slug}/${ch.slug}`),
  ]);

  return [...staticRoutes, ...structureRoutes, ...algorithmRoutes, ...curriculumRoutes].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified,
      changeFrequency:
        path.startsWith("/visualizer/") || path.startsWith("/learnings/") ? "monthly" : "weekly",
      priority:
        path === ""
          ? 1
          : path === "/visualizers" || path === "/learnings"
            ? 0.9
            : path.startsWith("/learnings/")
              ? 0.8
              : 0.7,
    })
  );
}
