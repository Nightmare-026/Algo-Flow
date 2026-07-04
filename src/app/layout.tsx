import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Algo Flow — Master DSA Through Visual Journeys",
    template: "%s | Algo Flow",
  },
  description:
    "Explore arrays, stacks, queues, trees, graphs, and algorithms with step-by-step animated explanations. Learn DSA visually with 200+ interactive visualizers.",
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
    title: "Algo Flow — Master DSA Through Visual Journeys",
    description:
      "Interactive DSA visualizer with 200+ algorithms. Step-by-step animations for arrays, trees, graphs, sorting, searching, and more.",
    siteName: "Algo Flow",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
