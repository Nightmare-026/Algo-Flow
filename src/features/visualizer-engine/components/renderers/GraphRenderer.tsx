"use client";

import { usePlaybackStore } from "../../playback-store";
import { GraphVisualState } from "../../../algorithms/graph/types";
import { VisualStepHighlights } from "@/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function GraphRenderer() {
  const { steps, currentStepIndex } = usePlaybackStore();
  const currentStep = steps[currentStepIndex];
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Simple responsive scaling for the static graph layout
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const width = entry.contentRect.width;
          const height = entry.contentRect.height;
          
          // Provide some padding so edges don't touch the container bounds
          const padding = 20; 
          const scaleX = width < 500 + padding ? width / (500 + padding) : 1;
          const scaleY = height < 400 + padding ? height / (400 + padding) : 1;
          
          // Use the smallest scale to fit both dimensions
          setScale(Math.min(scaleX, scaleY, 1));
        }
      });
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  if (!currentStep || !currentStep.dataState) {
    return (
      <div className="flex items-center justify-center w-full h-full text-text-muted">
        Graph data not available.
      </div>
    );
  }

  const dataState = currentStep.dataState as GraphVisualState;
  const highlights: VisualStepHighlights = currentStep.highlights || {};

  const getElementColor = (id: string) => {
    if (highlights.error?.includes(id)) return "bg-error border-error-muted text-error-foreground";
    if (highlights.active?.includes(id)) return "bg-primary border-primary-muted text-primary-foreground";
    if (highlights.inserted?.includes(id)) return "bg-info border-info-muted text-info-foreground";
    if (highlights.deleted?.includes(id)) return "bg-error/20 border-error/40 text-error-muted opacity-50";
    if (highlights.sorted?.includes(id)) return "bg-success/20 border-success/40 text-success glow-success";
    if (highlights.visited?.includes(id)) return "bg-success border-success-muted text-success-foreground";
    
    // Default style
    return "bg-bg-surface border-border text-text-primary";
  };
  
  const getEdgeColor = (source: string, target: string) => {
    // Check if both nodes are visited or active (basic highlighting for edges)
    const isSourceActive = highlights.active?.includes(source) || highlights.visited?.includes(source);
    const isTargetActive = highlights.active?.includes(target) || highlights.visited?.includes(target);
    
    if (isSourceActive && isTargetActive) return "text-primary stroke-current";
    return "text-border stroke-current";
  };

  return (
    <div ref={containerRef} className="flex items-center justify-center w-full h-full relative overflow-hidden bg-bg-surface-light/30 rounded-xl">
      <div 
        className="relative w-[500px] h-[400px]"
        style={{ transform: `scale(${scale})`, transformOrigin: "center center" }}
      >
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {dataState.edges.map((edge, i) => {
            const sourceNode = dataState.nodes.find(n => n.id === edge.source);
            const targetNode = dataState.nodes.find(n => n.id === edge.target);
            
            if (!sourceNode || !targetNode) return null;
            
            return (
              <motion.line
                key={`edge-${edge.source}-${edge.target}-${i}`}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                strokeWidth="3"
                className={cn("transition-colors duration-300", getEdgeColor(edge.source, edge.target))}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
            );
          })}
        </svg>

        {dataState.nodes.map((node) => (
          <motion.div
            key={node.id}
            layoutId={node.id}
            className={cn(
              "absolute flex items-center justify-center w-14 h-14 rounded-full border-[3px] font-bold text-xl font-mono shadow-md z-10 transition-colors duration-200",
              getElementColor(node.id)
            )}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ 
              left: node.x - 28, // Offset by half width/height to center
              top: node.y - 28
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {node.value}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
