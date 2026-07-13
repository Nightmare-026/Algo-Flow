import React from 'react';
import { VisualStep, CodeExample } from '@/types';
import { VisualizerInputOptions } from '@/lib/validation/visualizer-input';

export interface AlgorithmVisualizerDefinition {
  slug: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  generateSteps: (data: any, options: VisualizerInputOptions) => VisualStep[];
  getCodeExamples?: (slug: string, algorithmId: string) => CodeExample[];
  pseudocode?: string;
}

export interface InputControlsProps {
  slug: string;
  options: VisualizerInputOptions;
  onOptionsChange: (options: VisualizerInputOptions) => void;
  onGenerate?: (data: number[]) => void;
  dataLength?: number;
  defaultSize?: number;
  defaultRows?: number;
  defaultCols?: number;
}

export interface DataStructureVisualizerDefinition {
  dataStructureId: string;
  Renderer: React.ComponentType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  InputControls?: React.ComponentType<any>;
}
