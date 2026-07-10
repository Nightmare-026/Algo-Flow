"use client";

import { useState } from "react";
import Link from "next/link";
import { dataStructures } from "@/data/seed/data-structures";
import { algorithms } from "@/data/seed/algorithms";
import { Search, ChevronRight, SquareSquare, Link as LinkIcon, Layers, AlignRight, Network, Share2, Hash, CircleDashed, Grid3X3, Type } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animation/spring-config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

// Map string icons from seed data to actual Lucide components
const iconMap: Record<string, React.ElementType> = {
  SquareSquare,
  Link: LinkIcon,
  Layers,
  AlignRight,
  Network,
  Share2,
  Hash,
  CircleDashed,
  Grid3X3,
  Type,
};

export default function VisualizersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const categories = [
    { id: "all", label: "All Structures" },
    { id: "linear", label: "Linear" },
    { id: "non-linear", label: "Non-Linear" },
    { id: "hash-based", label: "Hash-Based" },
  ];

  const filteredDS = dataStructures.filter((ds) => {
    const matchesSearch = ds.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ds.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || ds.category === activeCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => a.displayOrder - b.displayOrder);

  // Get algorithm count for each DS
  const getAlgoCount = (dsId: string) => algorithms.filter(a => a.dataStructureId === dsId).length;

  return (
    <div className="min-h-screen flex flex-col bg-bg-deep text-text-primary">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Header Section */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Visualizer <span className="text-primary">Library</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mb-8">
              Explore 98 algorithm visualizers across 10 core data structures. 
              Step-by-step animations to master computer science fundamentals.
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input 
                  type="text"
                  placeholder="Search data structures..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-bg-surface border border-border rounded-lg py-3 pl-10 pr-4 text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
                      activeCategory === cat.id
                        ? "bg-primary-muted border-primary text-primary"
                        : "bg-bg-surface border-border text-text-secondary hover:border-border-hover hover:text-text-primary"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid Section */}
          {filteredDS.length > 0 ? (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredDS.map((ds) => {
                const Icon = ds.icon && iconMap[ds.icon] ? iconMap[ds.icon] : SquareSquare;
                const algoCount = getAlgoCount(ds.id);
                
                return (
                  <motion.div key={ds.id} variants={fadeInUp}>
                    <Link href={`/visualizers/${ds.slug}`} className="block h-full">
                      <div className="group bg-bg-surface border border-border rounded-2xl p-6 h-full transition-all duration-300 hover:border-primary hover:shadow-glow-primary flex flex-col relative overflow-hidden">
                        
                        {/* Background glow effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-primary opacity-0 group-hover:opacity-5 blur-3xl rounded-full transition-opacity duration-500 pointer-events-none" />

                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-xl bg-primary-muted text-primary flex items-center justify-center">
                            <Icon className="w-6 h-6" />
                          </div>
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border",
                            ds.difficulty === "easy" ? "bg-success-muted text-success border-success/20" :
                            ds.difficulty === "medium" ? "bg-warning-muted text-warning border-warning/20" :
                            "bg-error-muted text-error border-error/20"
                          )}>
                            {ds.difficulty.charAt(0).toUpperCase() + ds.difficulty.slice(1)}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                          {ds.name}
                        </h3>
                        
                        <p className="text-text-secondary text-sm mb-6 flex-1">
                          {ds.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                          <span className="text-sm font-medium text-text-muted">
                            {algoCount} {algoCount === 1 ? 'Algorithm' : 'Algorithms'}
                          </span>
                          <div className="w-8 h-8 rounded-full bg-bg-surface-light flex items-center justify-center group-hover:bg-primary group-hover:text-bg-deep transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-bg-surface rounded-2xl border border-border">
              <Search className="w-12 h-12 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-bold text-text-primary mb-2">No structures found</h3>
              <p className="text-text-secondary">Try adjusting your search or filters.</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveCategory("all"); }}
                className="mt-6 px-6 py-2 bg-primary-muted text-primary rounded-lg font-medium hover:bg-primary hover:text-bg-deep transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
