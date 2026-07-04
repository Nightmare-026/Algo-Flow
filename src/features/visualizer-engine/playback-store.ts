/* ================================================================
   ALGO FLOW — Playback Store (Zustand)
   ================================================================
   Controls algorithm visualization playback state:
   play/pause, step navigation, speed, and step data.
   ================================================================ */

import { create } from "zustand";
import type { PlaybackSpeed, VisualStep } from "@/types";
import { SPEED_DURATIONS } from "@/lib/animation/spring-config";

interface PlaybackStore {
  // State
  steps: VisualStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: PlaybackSpeed;
  customSpeedMs: number;
  isComplete: boolean;

  // Computed
  totalSteps: number;
  currentStep: VisualStep | null;
  progress: number; // 0-100

  // Actions
  setSteps: (steps: VisualStep[]) => void;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (index: number) => void;
  restart: () => void;
  reset: () => void;
  skipToEnd: () => void;
  setSpeed: (speed: PlaybackSpeed) => void;
  setCustomSpeed: (ms: number) => void;
  getSpeedMs: () => number;
}

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  // Initial state
  steps: [],
  currentStepIndex: -1,
  isPlaying: false,
  speed: "normal",
  customSpeedMs: 600,
  isComplete: false,

  // Computed getters
  get totalSteps() {
    return get().steps.length;
  },
  get currentStep() {
    const { steps, currentStepIndex } = get();
    return currentStepIndex >= 0 && currentStepIndex < steps.length
      ? steps[currentStepIndex]
      : null;
  },
  get progress() {
    const { steps, currentStepIndex } = get();
    if (steps.length === 0) return 0;
    return Math.round(((currentStepIndex + 1) / steps.length) * 100);
  },

  // Actions
  setSteps: (steps) =>
    set({
      steps,
      currentStepIndex: steps.length > 0 ? 0 : -1,
      isPlaying: false,
      isComplete: false,
    }),

  play: () => {
    const { steps, currentStepIndex, isComplete } = get();
    if (steps.length === 0) return;
    if (isComplete) {
      // Restart from beginning if complete
      set({ currentStepIndex: 0, isPlaying: true, isComplete: false });
    } else {
      set({
        isPlaying: true,
        currentStepIndex: currentStepIndex < 0 ? 0 : currentStepIndex,
      });
    }
  },

  pause: () => set({ isPlaying: false }),

  togglePlay: () => {
    const { isPlaying } = get();
    if (isPlaying) {
      get().pause();
    } else {
      get().play();
    }
  },

  nextStep: () => {
    const { steps, currentStepIndex } = get();
    if (currentStepIndex < steps.length - 1) {
      set({ currentStepIndex: currentStepIndex + 1 });
    } else {
      set({ isPlaying: false, isComplete: true });
    }
  },

  previousStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      set({
        currentStepIndex: currentStepIndex - 1,
        isComplete: false,
      });
    }
  },

  goToStep: (index) => {
    const { steps } = get();
    if (index >= 0 && index < steps.length) {
      set({
        currentStepIndex: index,
        isComplete: index === steps.length - 1,
      });
    }
  },

  restart: () =>
    set({
      currentStepIndex: 0,
      isPlaying: false,
      isComplete: false,
    }),

  reset: () =>
    set({
      steps: [],
      currentStepIndex: -1,
      isPlaying: false,
      isComplete: false,
    }),

  skipToEnd: () => {
    const { steps } = get();
    if (steps.length > 0) {
      set({
        currentStepIndex: steps.length - 1,
        isPlaying: false,
        isComplete: true,
      });
    }
  },

  setSpeed: (speed) => set({ speed }),

  setCustomSpeed: (ms) => set({ customSpeedMs: ms, speed: "custom" }),

  getSpeedMs: () => {
    const { speed, customSpeedMs } = get();
    return speed === "custom" ? customSpeedMs : SPEED_DURATIONS[speed];
  },
}));
