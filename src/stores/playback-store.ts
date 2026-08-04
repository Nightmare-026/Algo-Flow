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
  committedStepId: null,
  phase: "idle",
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
      committedStepId: steps[0]?.id ?? null,
      phase: steps.length > 0 ? "committed" : "idle",
      isComplete: steps.length === 0,
      isPlaying: false,
    }),

  play: () => {
    const { currentStepIndex, totalSteps } = get();
    if (totalSteps === 0) return;

    if (currentStepIndex >= totalSteps - 1) {
      const firstStep = get().steps[0];
      set({
        currentStepIndex: 0,
        committedStepId: firstStep?.id ?? null,
        phase: "playing",
        isPlaying: true,
        isComplete: false,
      });
    } else {
      set({ phase: "playing", isPlaying: true, isComplete: false });
    }
  },

  pause: () => set({ phase: "paused", isPlaying: false }),

  nextStep: () => {
    const { currentStepIndex, totalSteps } = get();
    if (currentStepIndex < totalSteps - 1) {
      const nextIndex = currentStepIndex + 1;
      set({
        currentStepIndex: nextIndex,
        committedStepId: get().steps[nextIndex]?.id ?? null,
        phase: get().isPlaying ? "playing" : "committed",
        isComplete: nextIndex === totalSteps - 1,
      });
    } else {
      set({ phase: "committed", isComplete: true, isPlaying: false });
    }
  },

  previousStep: () => {
    const { currentStepIndex } = get();
    if (currentStepIndex > 0) {
      const previousIndex = currentStepIndex - 1;
      set({
        currentStepIndex: previousIndex,
        committedStepId: get().steps[previousIndex]?.id ?? null,
        phase: "committed",
        isComplete: false,
        isPlaying: false,
      });
    }
  },

  goToStep: (index) => {
    const { totalSteps } = get();
    if (index >= 0 && index < totalSteps) {
      set({
        currentStepIndex: index,
        committedStepId: get().steps[index]?.id ?? null,
        phase: "committed",
        isComplete: index === totalSteps - 1,
        isPlaying: false,
      });
    }
  },

  setSpeed: (speed, customMs = 600) =>
    set({ speed, customSpeedMs: speed === "custom" ? customMs : getSpeedMs(speed, customMs) }),

  setReducedMotion: (enabled) => set({ reducedMotion: enabled }),

  restart: () =>
    set({
      currentStepIndex: 0,
      committedStepId: get().steps[0]?.id ?? null,
      phase: get().totalSteps > 0 ? "committed" : "idle",
      isComplete: false,
      isPlaying: false,
    }),

  skipToEnd: () => {
    const { totalSteps } = get();
    if (totalSteps > 0)
      set({
        currentStepIndex: totalSteps - 1,
        committedStepId: get().steps[totalSteps - 1]?.id ?? null,
        phase: "committed",
        isComplete: true,
        isPlaying: false,
      });
  },

  reset: () => {
    const { totalSteps } = get();
    if (totalSteps > 0) {
      set({
        currentStepIndex: 0,
        committedStepId: get().steps[0]?.id ?? null,
        phase: "committed",
        isComplete: false,
        isPlaying: false,
      });
    }
  },
}));
