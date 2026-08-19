import { usePlaybackStore, getActiveSpeedMs } from "@/stores/playback-store";
import type { PlaybackSpeed } from "@/types";

describe("Speed Control System Tests", () => {
  beforeEach(() => {
    usePlaybackStore.setState({
      speed: "normal",
      customSpeedMs: 600,
      isPlaying: false,
    });
  });

  it("calculates exact timing for all standard speeds", () => {
    expect(getActiveSpeedMs("0.25x", 600)).toBe(2400);
    expect(getActiveSpeedMs("0.5x", 600)).toBe(1200);
    expect(getActiveSpeedMs("slow", 600)).toBe(1200);
    expect(getActiveSpeedMs("0.75x", 600)).toBe(800);
    expect(getActiveSpeedMs("1x", 600)).toBe(600);
    expect(getActiveSpeedMs("normal", 600)).toBe(600);
    expect(getActiveSpeedMs("2x", 600)).toBe(300);
    expect(getActiveSpeedMs("fast", 600)).toBe(300);
    expect(getActiveSpeedMs("custom", 450)).toBe(450);
  });

  it("updates store state when changing speed", () => {
    const speeds: PlaybackSpeed[] = ["0.25x", "0.5x", "0.75x", "1x", "2x"];
    for (const s of speeds) {
      usePlaybackStore.getState().setSpeed(s);
      expect(usePlaybackStore.getState().speed).toBe(s);
    }
  });

  it("handles custom speed ms parameter correctly", () => {
    usePlaybackStore.getState().setSpeed("custom", 1500);
    const state = usePlaybackStore.getState();
    expect(state.speed).toBe("custom");
    expect(state.customSpeedMs).toBe(1500);
    expect(getActiveSpeedMs(state.speed, state.customSpeedMs)).toBe(1500);
  });
});
