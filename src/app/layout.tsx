import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: {
    default: "Algo Flow - Master DSA Through Visual Journeys",
    template: "%s | Algo Flow",
  },
  description:
    "Explore arrays, stacks, queues, trees, graphs, and algorithms with step-by-step animated explanations. Learn DSA visually with 105+ interactive visualizers.",
  keywords: [
    "DSA",
    "data structures",
    "algorithms",
    "visualizer",
    "sorting",
    "searching",
    "graph",
    "tree",
    "stack",
    "queue",
    "linked list",
    "hash table",
    "interactive learning",
  ],
  authors: [{ name: "Algo Flow" }],
  openGraph: {
    type: "website",
    title: "Algo Flow - Master DSA Through Visual Journeys",
    description:
      "Interactive DSA visualizer with 105+ visualizers. Step-by-step animations for arrays, trees, graphs, sorting, searching, and more.",
    siteName: "Algo Flow",
  },
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-background text-foreground antialiased font-sans overflow-x-hidden">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
