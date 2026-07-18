import { create } from "zustand";
import { VisualStep, PlaybackState, PlaybackSpeed } from "@/types";

interface PlaybackActions {
  loadSteps: (steps: VisualStep[]) => void;
  play: () => void;
  pause: () => void;
  nextStep: () => void;
  previousStep: () => void;
  goToStep: (index: number) => void;
  setSpeed: (speed: PlaybackSpeed, customMs?: number) => void;
  setReducedMotion: (enabled: boolean) => void;
  restart: () => void;
  skipToEnd: () => void;
  reset: () => void;
}

type PlaybackStore = PlaybackState & { reducedMotion: boolean } & PlaybackActions;

const getSpeedMs = (speed: PlaybackSpeed, customMs: number) => {
  switch (speed) {
    case "fast":
      return 300;
    case "slow":
      return 1000;
    case "custom":
      return customMs;
    case "normal":
    default:
      return 600;
  }
};

const initialState: PlaybackState & { reducedMotion: boolean } = {
  steps: [],
  currentStepIndex: 0,
  isPlaying: false,
  speed: "normal",
  customSpeedMs: 600,
  isComplete: false,
  totalSteps: 0,
  reducedMotion: false,
};

export const usePlaybackStore = create<PlaybackStore>((set, get) => ({
  ...initialState,

  loadSteps: (steps) =>
    set({
      steps,
      totalSteps: steps.length,
      currentStepIndex: 0,
      isComplete: steps.length === 0,
      isPlaying: false,
    }),

  play: () => {
    const { currentStepIndex, totalSteps } = get();
    if (totalSteps === 0) return;

    if (currentStepIndex >= totalSteps - 1) {
      set({ currentStepIndex: 0, isPlaying: true, isComplete: false });
    } else {
      set({ isPlaying: true, isComplete: false });
    }
  },

  pause: () => set({ isPlaying: false }),

  nextStep: () => {
    const { currentStepIndex, totalSteps } = get();
    if (currentStepIndex < totalSteps - 1) {
      set({
        currentStepIndex: currentStepIndex + 1,
        isComplete: currentStepIndex + 1 === totalSteps - 1,
      });
    } else {
      set({ isComplete: true, isPlaying: false });
    }
  },

  previousStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) set({ currentStepIndex: currentStepIndex - 1, isComplete: false });
  },

  goToStep: (index) => {
    const { totalSteps } = get();
    if (index >= 0 && index < totalSteps)
      set({ currentStepIndex: index, isComplete: index === totalSteps - 1 });
  },

  setSpeed: (speed, customMs = 600) =>
    set({ speed, customSpeedMs: speed === "custom" ? customMs : getSpeedMs(speed, customMs) }),

  setReducedMotion: (enabled) => set({ reducedMotion: enabled }),

  restart: () => set({ currentStepIndex: 0, isComplete: false, isPlaying: false }),

  skipToEnd: () => {
    const { totalSteps } = get();
    if (totalSteps > 0)
      set({ currentStepIndex: totalSteps - 1, isComplete: true, isPlaying: false });
  },

  reset: () => {
    const { totalSteps } = get();
    if (totalSteps > 0) {
      set({ currentStepIndex: 0, isComplete: false, isPlaying: false });
    }
  },
}));
