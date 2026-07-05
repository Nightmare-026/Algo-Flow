"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Maximize2, Share2, BookmarkPlus } from "lucide-react";
import { Algorithm, CodeExample } from "@/types";
import { PlaybackControls } from "./PlaybackControls";
import { SpeedSlider } from "./SpeedSlider";
import { StepTimeline } from "./StepTimeline";
import { StepExplanation } from "./StepExplanation";
import { CodePanel } from "./CodePanel";
import { usePlaybackStore } from "../playback-store";
import { cn } from "@/lib/utils";

interface VisualizerLayoutProps {
  algorithm: Algorithm;
  codeExamples: CodeExample[];
  children: ReactNode;
}

export function VisualizerLayout({ algorithm, codeExamples, children }: VisualizerLayoutProps) {
  const { currentStepIndex, totalSteps } = usePlaybackStore();

  return (
    <div className="flex flex-col h-screen bg-bg-deep text-text-primary overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 border-b border-border bg-bg-surface flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link 
            href={`/visualizers/${algorithm.dataStructureId.replace('ds_', '').replace('_', '-')}`}
            className="p-2 -ml-2 text-text-muted hover:text-text-primary transition-colors rounded-lg hover:bg-bg-surface-light"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          
          <div>
            <h1 className="font-bold text-lg leading-tight">{algorithm.name}</h1>
            <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide border",
                algorithm.difficulty === "easy" ? "bg-success-muted text-success border-success/20" :
                algorithm.difficulty === "medium" ? "bg-warning-muted text-warning border-warning/20" :
                "bg-error-muted text-error border-error/20"
              )}>
                {algorithm.difficulty}
              </span>
              <span>Time: {algorithm.timeComplexityAverage}</span>
              <span>•</span>
              <span>Space: {algorithm.spaceComplexity}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-bg-surface-light" title="Save Bookmark">
            <BookmarkPlus className="w-5 h-5" />
          </button>
          <button className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-bg-surface-light" title="Share">
            <Share2 className="w-5 h-5" />
          </button>
          <div className="w-px h-6 bg-border mx-1" />
          <button className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-bg-surface-light" title="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Canvas & Controls */}
        <div className="flex-1 flex flex-col min-w-0">
          
          {/* Canvas Area */}
          <div className="flex-1 relative bg-bg-deep overflow-hidden">
            {children}
            
            {/* Step Counter Overlay */}
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-bg-surface/80 backdrop-blur border border-border rounded-lg text-sm font-medium text-text-secondary shadow-sm">
              Step {totalSteps > 0 ? currentStepIndex + 1 : 0} / {totalSteps}
            </div>
            
            <button className="absolute bottom-4 right-4 p-2 bg-bg-surface/80 backdrop-blur border border-border rounded-lg text-text-muted hover:text-text-primary transition-colors shadow-sm" title="Fullscreen Canvas">
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Control Bar */}
          <div className="h-20 bg-bg-surface border-t border-border flex items-center justify-between px-6 shrink-0 gap-6">
            <PlaybackControls />
            <div className="flex-1">
              <StepTimeline />
            </div>
            <SpeedSlider />
          </div>
        </div>

        {/* Right Side: Panels */}
        <div className="w-96 border-l border-border bg-bg-deep flex flex-col shrink-0">
          <div className="h-1/2 p-4 pb-2">
            <CodePanel examples={codeExamples} />
          </div>
          <div className="h-1/2 p-4 pt-2">
            <StepExplanation />
          </div>
        </div>

      </div>
    </div>
  );
}
