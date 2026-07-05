"use client";

import { use } from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import { dataStructures } from "@/data/seed/data-structures";
import { algorithms } from "@/data/seed/algorithms";
import { operations } from "@/data/seed/operations";
import { Search, ChevronRight, ArrowLeft, Clock, HardDrive, BarChart3, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "@/lib/animation/spring-config";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  
  const ds = dataStructures.find(d => d.slug === category);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("all");
  const [activeOperation, setActiveOperation] = useState<string>("all");

  const dsAlgorithms = useMemo(() => {
    if (!ds) return [];
    return algorithms.filter(a => a.dataStructureId === ds.id).sort((a, b) => {
      // Sort P0 first, then P1, etc.
      if (a.priority !== b.priority) {
        return a.priority.localeCompare(b.priority);
      }
      return a.name.localeCompare(b.name);
    });
  }, [ds]);

  const dsOperations = useMemo(() => {
    if (!ds) return [];
    return operations.filter(op => op.dataStructureId === ds.id).sort((a, b) => a.displayOrder - b.displayOrder);
  }, [ds]);

  const filteredAlgorithms = useMemo(() => {
    return dsAlgorithms.filter(algo => {
      const matchesSearch = algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            algo.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = activeDifficulty === "all" || algo.difficulty === activeDifficulty;
      const matchesOperation = activeOperation === "all" || algo.operationId === activeOperation;
      return matchesSearch && matchesDifficulty && matchesOperation;
    });
  }, [dsAlgorithms, searchQuery, activeDifficulty, activeOperation]);

  if (!ds) {
    return (
      <div className="min-h-screen flex flex-col bg-bg-deep text-text-primary">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-error mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
            <p className="text-text-secondary mb-8">The data structure "{category}" does not exist.</p>
            <Link href="/visualizers" className="px-6 py-3 bg-primary text-bg-deep font-medium rounded-lg">
              Return to Library
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg-deep text-text-primary">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-7xl">
          
          {/* Breadcrumb & Header */}
          <div className="mb-12">
            <Link href="/visualizers" className="inline-flex items-center text-sm font-medium text-text-muted hover:text-primary transition-colors mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Library
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {ds.name} <span className="text-primary">Algorithms</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mb-8">
              {ds.description} Choose an algorithm below to start visualizing its step-by-step execution.
            </p>

            {/* Filters */}
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row gap-4 items-start md:items-center justify-between p-4 rounded-xl bg-bg-surface border border-border">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input 
                  type="text"
                  placeholder="Search algorithms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-bg-surface-light border border-border rounded-lg py-2.5 pl-10 pr-4 text-text-primary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>

              <div className="flex flex-wrap gap-4 w-full md:w-auto">
                {/* Operation Filter */}
                <select 
                  className="bg-bg-surface-light border border-border rounded-lg py-2.5 px-4 text-text-primary focus:outline-none focus:border-primary w-full md:w-auto"
                  value={activeOperation}
                  onChange={(e) => setActiveOperation(e.target.value)}
                >
                  <option value="all">All Operations</option>
                  {dsOperations.map(op => (
                    <option key={op.id} value={op.id}>{op.name}</option>
                  ))}
                </select>

                {/* Difficulty Filter */}
                <select 
                  className="bg-bg-surface-light border border-border rounded-lg py-2.5 px-4 text-text-primary focus:outline-none focus:border-primary w-full md:w-auto"
                  value={activeDifficulty}
                  onChange={(e) => setActiveDifficulty(e.target.value)}
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid Section */}
          {filteredAlgorithms.length > 0 ? (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAlgorithms.map((algo) => {
                const op = dsOperations.find(o => o.id === algo.operationId);
                
                return (
                  <motion.div key={algo.id} variants={fadeInUp}>
                    <Link href={`/visualizer/${algo.slug}`} className="block h-full">
                      <div className="group bg-bg-surface border border-border rounded-2xl p-6 h-full transition-all duration-300 hover:border-primary hover:shadow-glow-primary flex flex-col relative overflow-hidden">
                        
                        {/* Status/Priority Ribbon */}
                        {algo.priority === "P0" && (
                          <div className="absolute top-0 right-0 bg-primary text-bg-deep text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                            Essential
                          </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-3 mt-2">
                          <span className={cn(
                            "px-2.5 py-1 rounded-md text-xs font-semibold border uppercase tracking-wider",
                            algo.difficulty === "easy" ? "bg-success-muted text-success border-success/20" :
                            algo.difficulty === "medium" ? "bg-warning-muted text-warning border-warning/20" :
                            "bg-error-muted text-error border-error/20"
                          )}>
                            {algo.difficulty}
                          </span>
                          
                          {op && (
                            <span className="text-xs font-medium text-text-muted bg-bg-surface-light px-2.5 py-1 rounded-md border border-border">
                              {op.name}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-1">
                          {algo.name}
                        </h3>
                        
                        <p className="text-text-secondary text-sm mb-6 flex-1 line-clamp-2">
                          {algo.shortDescription}
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-bg-surface-light rounded-xl border border-border">
                          <div className="flex items-center text-xs">
                            <Clock className="w-3.5 h-3.5 text-secondary mr-1.5" />
                            <span className="text-text-secondary truncate" title={algo.timeComplexityAverage}>
                              {algo.timeComplexityAverage}
                            </span>
                          </div>
                          <div className="flex items-center text-xs">
                            <HardDrive className="w-3.5 h-3.5 text-primary mr-1.5" />
                            <span className="text-text-secondary truncate" title={algo.spaceComplexity}>
                              {algo.spaceComplexity}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2 mt-auto">
                          <div className="flex items-center gap-1.5">
                            <BarChart3 className="w-4 h-4 text-text-muted" />
                            <span className="text-xs font-medium text-text-muted">
                              Interactive
                            </span>
                          </div>
                          <div className="flex items-center text-primary text-sm font-medium group-hover:translate-x-1 transition-transform">
                            Visualize <ChevronRight className="w-4 h-4 ml-1" />
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
              <h3 className="text-xl font-bold text-text-primary mb-2">No algorithms found</h3>
              <p className="text-text-secondary">Try adjusting your search or filters.</p>
              <button 
                onClick={() => { setSearchQuery(""); setActiveDifficulty("all"); setActiveOperation("all"); }}
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
