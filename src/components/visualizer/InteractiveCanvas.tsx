"use client";

import React, { useState, useRef, useCallback, useEffect, useId, ReactNode } from "react";
import { Plus, Minus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface InteractiveCanvasProps {
  children: ReactNode;
  name?: string;
  className?: string;
  minZoom?: number;
  maxZoom?: number;
}

export function InteractiveCanvas({
  children,
  name = "Visualizer Canvas",
  className,
  minZoom = 0.4,
  maxZoom = 2.5,
}: InteractiveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const patternId = useId().replace(/:/g, "_");

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const initialPanRef = useRef({ x: 0, y: 0 });
  const touchesRef = useRef<{ dist: number; center: { x: number; y: number } } | null>(null);

  // Zoom helpers
  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(maxZoom, Number((prev + 0.15).toFixed(2))));
  }, [maxZoom]);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(minZoom, Number((prev - 0.15).toFixed(2))));
  }, [minZoom]);

  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  // Mouse pan handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only left click initiates drag
      if (e.button !== 0) return;

      // Ignore clicks on interactive controls inside the canvas
      const target = e.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest("a") ||
        target.closest("[data-no-pan]")
      ) {
        return;
      }

      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY };
      initialPanRef.current = { ...pan };
    },
    [pan]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPan({
        x: initialPanRef.current.x + dx,
        y: initialPanRef.current.y + dy,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Non-passive wheel listener for smooth zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      setZoom((prev) => {
        const next = prev * zoomFactor;
        return Math.min(maxZoom, Math.max(minZoom, Number(next.toFixed(2))));
      });
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [minZoom, maxZoom]);

  // Touch handlers for mobile & pinch-zoom
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("input") ||
        target.closest("select") ||
        target.closest("a") ||
        target.closest("[data-no-pan]")
      ) {
        return;
      }

      if (e.touches.length === 1) {
        setIsDragging(true);
        dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        initialPanRef.current = { ...pan };
      } else if (e.touches.length === 2) {
        setIsDragging(false);
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const dist = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
        touchesRef.current = {
          dist,
          center: {
            x: (touch1.clientX + touch2.clientX) / 2,
            y: (touch1.clientY + touch2.clientY) / 2,
          },
        };
      }
    },
    [pan]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 1 && isDragging) {
        const dx = e.touches[0].clientX - dragStartRef.current.x;
        const dy = e.touches[0].clientY - dragStartRef.current.y;
        setPan({
          x: initialPanRef.current.x + dx,
          y: initialPanRef.current.y + dy,
        });
      } else if (e.touches.length === 2 && touchesRef.current) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const newDist = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const scaleChange = newDist / touchesRef.current.dist;

        setZoom((prev) => {
          const next = prev * scaleChange;
          return Math.min(maxZoom, Math.max(minZoom, Number(next.toFixed(2))));
        });
        touchesRef.current.dist = newDist;
      }
    },
    [isDragging, maxZoom, minZoom]
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    touchesRef.current = null;
  }, []);

  const dotGap = 16 * zoom;
  const dotRadius = 1.2 * Math.min(zoom, 1.4);
  const patternX = ((pan.x % dotGap) + dotGap) % dotGap;
  const patternY = ((pan.y % dotGap) + dotGap) % dotGap;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={cn(
        "relative flex items-center justify-center w-full h-full overflow-hidden rounded-2xl border border-border/60 bg-surface shadow-xs select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab",
        className
      )}
      role="region"
      aria-label={`${name} interactive canvas. Drag to pan, scroll to zoom.`}
    >
      {/* 1. Dot Grid Canvas Background (Matches ReactFlow BackgroundVariant.Dots) */}
      <svg className="absolute inset-0 h-full w-full pointer-events-none" aria-hidden="true">
        <defs>
          <pattern
            id={patternId}
            x={patternX}
            y={patternY}
            width={dotGap}
            height={dotGap}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={dotRadius}
              cy={dotRadius}
              r={dotRadius}
              fill="var(--border)"
              className="opacity-40"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* 2. Interactive Pan & Zoom Viewport Layer */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "center center",
          transition: isDragging ? "none" : "transform 0.12s cubic-bezier(0.2, 0, 0, 1)",
        }}
        className="relative flex items-center justify-center w-full h-full pointer-events-auto"
      >
        {children}
      </div>

      {/* 3. Floating Canvas Navigation Controls (Bottom-Right HUD) */}
      <div
        data-no-pan="true"
        className="absolute bottom-3 right-3 z-40 flex items-center gap-1 rounded-xl border border-border/80 bg-surface/90 px-1.5 py-1 shadow-(--shadow-raised-sm) backdrop-blur-md select-none pointer-events-auto transition-opacity hover:opacity-100 opacity-80"
        aria-label="Canvas zoom controls"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomOut}
          disabled={zoom <= minZoom}
          className="h-7 w-7 min-h-0 p-0 text-text-secondary hover:text-primary active:scale-95 cursor-pointer disabled:opacity-40"
          title="Zoom out"
          aria-label="Zoom out"
        >
          <Minus className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetView}
          className="h-7 min-h-0 px-1.5 font-mono text-[10px] font-bold text-text-secondary hover:text-primary active:scale-95 cursor-pointer"
          title="Reset zoom & center (100%)"
          aria-label="Reset zoom to 100%"
        >
          <span>{Math.round(zoom * 100)}%</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={zoomIn}
          disabled={zoom >= maxZoom}
          className="h-7 w-7 min-h-0 p-0 text-text-secondary hover:text-primary active:scale-95 cursor-pointer disabled:opacity-40"
          title="Zoom in"
          aria-label="Zoom in"
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>

        {(zoom !== 1 || pan.x !== 0 || pan.y !== 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetView}
            className="h-7 w-7 min-h-0 p-0 text-text-muted hover:text-primary active:scale-95 cursor-pointer border-l border-border/60 pl-1"
            title="Reset position & zoom"
            aria-label="Reset position & zoom"
          >
            <RotateCcw className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
