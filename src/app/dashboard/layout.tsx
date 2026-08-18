import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function SectionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="page-shell flex min-h-screen flex-col">
      <Navbar />
      <main id="main-content" className="flex-1 pt-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
