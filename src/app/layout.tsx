import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Source_Sans_3 } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Script from "next/script";
import {
  getSiteUrl,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  SITE_TITLE_TEMPLATE,
} from "@/lib/site";
import { safeJsonLd } from "@/lib/security/safe-json";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});
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
    { media: "(prefers-color-scheme: light)", color: "#fcf9f8" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1128" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  applicationName: SITE_NAME,
  appleWebApp: {
    title: SITE_NAME,
    statusBarStyle: "default",
    capable: true,
  },
  other: {
    site_name: SITE_NAME,
  },
  title: {
    default: `${SITE_NAME} - ${SITE_TAGLINE}`,
    template: SITE_TITLE_TEMPLATE,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "AlgoFlow",
    "Algo Flow",
    "algoflow",
    "algo flow",
    "algo-flow",
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
  authors: [{ name: SITE_NAME }],
  openGraph: {
    type: "website",
    title: `${SITE_NAME} - ${SITE_TAGLINE}`,
    description:
      "Master Data Structures & Algorithms visually with interactive step-by-step visualizers and multi-language code traces.",
    siteName: SITE_NAME,
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} - ${SITE_TAGLINE}`,
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
    name: SITE_NAME,
    alternateName: ["Algo Flow", "AlgoFlow Visualizer", "AlgoFlow DSA"],
    description: SITE_TAGLINE,
  };

  return (
    <html lang="en" data-theme="light-edu" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='algo-flow-theme';var s=localStorage.getItem(k);var p=(s==='dark'||s==='dark-neon')?'dark':(s==='light'||s==='light-edu')?'light':(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',p);}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(globalSiteSchema) }}
        />
      </head>
      <body
        className={`${sourceSans3.variable} ${jetbrainsMono.variable} min-h-screen overflow-x-hidden bg-background font-sans text-foreground antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-xl focus:bg-primary focus:px-4 focus:py-2.5 focus:text-sm focus:font-bold focus:text-white focus:shadow-xl"
        >
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
        {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID} />
        )}
        {process.env.NODE_ENV === "development" && (
          <Script src="/agent-inspector.js" strategy="afterInteractive" />
        )}
      </body>
    </html>
  );
}
