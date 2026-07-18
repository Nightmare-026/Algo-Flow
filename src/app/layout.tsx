import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
