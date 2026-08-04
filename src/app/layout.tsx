import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Script from "next/script";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Algo Flow - Master DSA Through Visual Journeys",
    template: "%s | Algo Flow",
  },
  description:
    "Explore arrays, stacks, queues, trees, graphs, and algorithms with step-by-step animated explanations. Learn DSA visually across the published visualizer library.",
  keywords: [
    "DSA",
    "data structures",
    "algorithms",
    "visualizer",
    "data structures visualizer",
    "algorithm visualizer online",
    "sorting algorithm visualizer",
    "binary tree visualization",
    "graph algorithm visualizer",
    "dsa animation tool",
    "learn dsa visually",
    "coding interview dsa preparation",
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
      "Interactive DSA visualizers with step-by-step traces for arrays, trees, graphs, sorting, searching, and more.",
    siteName: "Algo Flow",
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Algo Flow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Algo Flow - Master DSA Through Visual Journeys",
    description: "Trace data structures and algorithms step by step.",
    images: ["/opengraph-image"],
  },
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.png", apple: "/icon.png" },
  robots: { index: true, follow: true },
  verification: {
    google: "anEruVcNExQOy-TfI47qMfHCcdMZJh-VVWqkZaYC1qE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light-edu" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable} min-h-screen overflow-x-hidden bg-background font-sans text-foreground antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white focus:shadow-xl"
        >
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        {process.env.NODE_ENV === "development" && (
          <Script src="/agent-inspector.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
