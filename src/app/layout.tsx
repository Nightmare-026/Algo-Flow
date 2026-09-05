import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Script from "next/script";
import { getSiteUrl } from "@/lib/site";
import { catalogStats } from "@/lib/catalog";
import { safeJsonLd } from "@/lib/security/safe-json";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f6f4" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f13" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: "Algo Flow",
  appleWebApp: {
    title: "Algo Flow",
    statusBarStyle: "default",
    capable: true,
  },
  other: {
    site_name: "Algo Flow",
  },
  title: {
    default: "Algo Flow - Interactive Data Structures & Algorithms Visualizer",
    template: "%s | Algo Flow",
  },
  description: `Master Data Structures & Algorithms visually. ${catalogStats.visualizerCount} interactive step-by-step visualizers, multi-language code execution (Python, C++, Java, JS), and practice quizzes.`,
  keywords: [
    "Algo Flow",
    "AlgoFlow",
    "algo flow",
    "algoflow",
    "algo-flow",
    "ALGO FLOW",
    "ALGOFLOW",
    "dsa visualizer",
    "DSA Visualizer",
    "dsa visualizer online",
    "free dsa visualizer",
    "data structures visualizer",
    "data structures and algorithms visualizer",
    "algorithm visualizer online",
    "sorting algorithm visualizer",
    "binary tree visualization",
    "graph algorithm visualizer",
    "data structure animation",
    "dsa animation tool",
    "learn dsa visually",
    "leetcode visualizer",
    "algorithm tracer",
    "visualgo alternative",
    "visual algo",
    "dsa learning tool",
    "interactive algorithm visualizer",
    "data structures step by step",
    "coding interview dsa preparation",
  ],
  authors: [{ name: "Algo Flow" }],
  openGraph: {
    type: "website",
    title: "Algo Flow - Interactive Data Structures & Algorithms Visualizer",
    description: `Master Data Structures & Algorithms visually with ${catalogStats.visualizerCount} interactive step-by-step visualizers and multi-language code traces.`,
    siteName: "Algo Flow",
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Algo Flow" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Algo Flow - Interactive Data Structures & Algorithms Visualizer",
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
  const siteUrl = getSiteUrl();
  const globalSiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Algo Flow",
    alternateName: ["AlgoFlow", "Algo Flow Visualizer", "AlgoFlow DSA"],
    description: "Interactive Data Structures & Algorithms Visualizer",
  };

  return (
    <html lang="en" data-theme="light-edu" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(globalSiteSchema) }}
        />
      </head>
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
        <Analytics />
        {process.env.NODE_ENV === "development" && (
          <Script src="/agent-inspector.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
