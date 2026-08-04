import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Algo Flow",
    short_name: "Algo Flow",
    description: "Step-by-step data-structure and algorithm visualizers.",
    start_url: "/",
    display: "standalone",
    background_color: "#f2f7f3",
    theme_color: "#15803d",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
