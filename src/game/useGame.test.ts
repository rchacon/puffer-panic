import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGame } from "./useGame";

describe("useGame outcome audio", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("plays the level-specific victory cue on a perfect game", () => {
    const audioSpy = vi.spyOn(window, "Audio");
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.start(["cat", "dog", "run", "big", "red"], 7);
    });

    for (let i = 0; i < 5; i++) {
      const round = result.current.state.rounds[result.current.state.roundIndex];
      act(() => {
        result.current.answer(round.correctIndex);
        vi.advanceTimersByTime(1600);
      });
    }

    expect(result.current.state.phase).toBe("result");
    const srcs = audioSpy.mock.calls.map((args) => String(args[0]));
    expect(srcs.some((s) => s.endsWith("/audio/victory-7.mp3"))).toBe(true);
    expect(srcs.some((s) => /\/audio\/defeat-\d+\.mp3$/.test(s))).toBe(false);
  });

  it("plays the level-specific defeat cue on a shutout, and defaults to level 1 without one", () => {
    const audioSpy = vi.spyOn(window, "Audio");
    const { result } = renderHook(() => useGame());

    act(() => {
      // no level passed -> defaults to 1
      result.current.start(["cat", "dog", "run", "big", "red"]);
    });

    for (let i = 0; i < 5; i++) {
      const round = result.current.state.rounds[result.current.state.roundIndex];
      const wrongIndex = (round.correctIndex + 1) % round.options.length;
      act(() => {
        result.current.answer(wrongIndex);
        vi.advanceTimersByTime(1600);
      });
    }

    expect(result.current.state.phase).toBe("result");
    const srcs = audioSpy.mock.calls.map((args) => String(args[0]));
    expect(srcs.some((s) => s.endsWith("/audio/defeat-1.mp3"))).toBe(true);
  });

  it("debugOutcome uses the level from the most recent start()", () => {
    const audioSpy = vi.spyOn(window, "Audio");
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.start(["cat", "dog", "run"], 4);
      result.current.debugOutcome(5);
    });

    const srcs = audioSpy.mock.calls.map((args) => String(args[0]));
    expect(srcs.some((s) => s.endsWith("/audio/victory-4.mp3"))).toBe(true);
  });
});
