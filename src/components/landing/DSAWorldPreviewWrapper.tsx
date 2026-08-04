"use client";

import dynamic from "next/dynamic";

const DSAWorldPreview = dynamic(
  () => import("./DSAWorldPreview").then((mod) => mod.DSAWorldPreview),
  { ssr: false }
);

export function DSAWorldPreviewWrapper() {
  return <DSAWorldPreview />;
}
