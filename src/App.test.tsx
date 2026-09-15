import { act } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  beforeEach(() => localStorage.clear());

  it("shows the title and a start button", () => {
    render(<App />);
    expect(screen.getByText("Puffer Panic")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
  });

  it("starts a round with the battle scene and three word cards", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    expect(
      screen.getByRole("img", { name: /shark swimming toward a puffer fish/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Round 1 \/ 5/)).toBeInTheDocument();

    const cards = screen
      .getAllByRole("button", { name: /choose the word/i })
      .filter((el) => el.classList.contains("card"));
    expect(cards).toHaveLength(3);
  });

  it("disables Start until at least 3 words are chosen", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /choose words/i }));
    fireEvent.click(screen.getByRole("button", { name: "None" }));

    expect(screen.getByRole("button", { name: /start/i })).toBeDisabled();
    expect(screen.getByText(/pick at least 3 words/i)).toBeInTheDocument();
  });

  it("shows a spelling input instead of three cards in Hard Mode", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("radio", { name: "Hard" }));
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    expect(screen.getByLabelText(/spell the word/i)).toBeInTheDocument();
    expect(
      screen.queryAllByRole("button", { name: /choose the word/i }),
    ).toHaveLength(0);
  });
});

describe("App - predator escalation", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function answerAllRounds() {
    for (let round = 0; round < 5; round++) {
      const cards = screen
        .getAllByRole("button", { name: /choose the word/i })
        .filter((el) => el.classList.contains("card"));
      fireEvent.click(cards[0]);
      act(() => {
        vi.advanceTimersByTime(1600);
      });
    }
  }

  it("shows one shark the first time and two the second time", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(document.querySelectorAll(".shark")).toHaveLength(1);

    answerAllRounds();
    fireEvent.click(screen.getByRole("button", { name: /play again/i }));
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    expect(document.querySelectorAll(".shark")).toHaveLength(2);
  });

  function playThroughOneGame() {
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    // Some levels (Megalodon, Bloop, Amargasaurus, Kraken) show a boss
    // intro before the round cards exist -- advance past it (long enough
    // to cover the longest of the four, the Bloop's ~4.9s; a no-op if
    // there's no intro showing, since a longer wait than a since-fired
    // timer needs is harmless) before assuming the battle scene has
    // started.
    act(() => {
      vi.advanceTimersByTime(5100);
    });
    answerAllRounds();
    fireEvent.click(screen.getByRole("button", { name: /play again/i }));
  }

  it("shows a dramatic intro before the Kraken (level 12) begins", () => {
    render(<App />);

    for (let i = 0; i < 11; i++) playThroughOneGame();

    // 12th start -> level 12, the Kraken. The intro plays first; the round
    // itself hasn't started yet.
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(screen.getByText(/release the kraken/i)).toBeInTheDocument();
    expect(document.querySelector(".kraken-intro__icon")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /kraken/i })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2200);
    });

    expect(screen.queryByText(/release the kraken/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /kraken swimming toward a puffer fish/i }),
    ).toBeInTheDocument();
  });

  it("keeps Start disabled through the Kraken intro so a repeat activation can't double-start the game", () => {
    render(<App />);

    for (let i = 0; i < 11; i++) playThroughOneGame();

    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    const startButton = screen.getByRole("button", { name: /start/i });
    expect(startButton).toBeDisabled();

    // A stray extra activation during the intro must be a no-op. Disabled
    // buttons don't dispatch click handlers in the first place, but this
    // also guards handleStart's own re-entrancy check if that ever changes.
    fireEvent.click(startButton);
    fireEvent.click(startButton);

    act(() => {
      vi.advanceTimersByTime(2200);
    });

    // Exactly one game began: round 1, not reset past it by a stray restart.
    expect(screen.getByText(/Round 1 \/ 5/)).toBeInTheDocument();
    expect(document.querySelectorAll(".kraken")).toHaveLength(1);
  });

  it("shows a dramatic intro before the Megalodon (level 5) begins", () => {
    render(<App />);

    for (let i = 0; i < 4; i++) playThroughOneGame();

    // 5th start -> level 5, the Megalodon. The intro plays first; the
    // round itself hasn't started yet.
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(screen.getByText(/bigger boat/i)).toBeInTheDocument();
    expect(document.querySelector(".megalodon-intro__icon")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /megalodon/i })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2500);
    });

    expect(screen.queryByText(/bigger boat/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /megalodon swimming toward a puffer fish/i }),
    ).toBeInTheDocument();
  });

  it("shows a dramatic intro before the Bloop (level 10) begins", () => {
    render(<App />);

    for (let i = 0; i < 9; i++) playThroughOneGame();

    // 10th start -> level 10, the Bloop. No spoken voice line for this one
    // (see BOSS_INTROS.bloop in App.tsx) -- just its own intro card; the
    // round itself hasn't started yet.
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(screen.getByText(/loudest sound/i)).toBeInTheDocument();
    expect(document.querySelector(".bloop-intro__spectrogram")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /bloop/i })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.queryByText(/loudest sound/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /bloop swimming toward a puffer fish/i }),
    ).toBeInTheDocument();
  });

  it("shows a dramatic intro before the Amargasaurus (level 11) begins", () => {
    render(<App />);

    for (let i = 0; i < 10; i++) playThroughOneGame();

    // 11th start -> level 11, the Amargasaurus. The intro plays first; the
    // round itself hasn't started yet.
    fireEvent.click(screen.getByRole("button", { name: /start/i }));
    expect(screen.getByText(/move in herds/i)).toBeInTheDocument();
    expect(document.querySelector(".amargasaurus-intro__icon")).toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /amargasaurus/i })).not.toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2800);
    });

    expect(screen.queryByText(/move in herds/i)).not.toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /amargasaurus swimming toward a puffer fish/i }),
    ).toBeInTheDocument();
  });
});

describe("App - Hard Mode full playthrough", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("wins a full game by spelling each round's actual target word", () => {
    // The target word isn't shown anywhere in the DOM in Hard Mode (no
    // cards to give it away) -- recover it from the prompt audio's own URL
    // (/audio/prompt-<word>.mp3) instead. Spying on window.Audio's
    // constructor (as useGame.test.ts does) doesn't work reliably here:
    // audio/player.ts caches Audio elements by src, and this suite's own
    // predator-escalation tests above already play through the full
    // default word bank many times over, so most/all prompt clips are
    // already cached before this test even starts -- their constructor
    // never fires again. HTMLMediaElement.prototype.play() runs every
    // time regardless of whether the element was newly constructed or
    // reused from cache, so spy on that instead and read the element's
    // own `src` off of it.
    const playedSrcs: string[] = [];
    vi.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(function (
      this: HTMLMediaElement,
    ) {
      playedSrcs.push(this.src);
      return Promise.resolve();
    });

    render(<App />);

    fireEvent.click(screen.getByRole("radio", { name: "Hard" }));
    fireEvent.click(screen.getByRole("button", { name: /start/i }));

    for (let round = 0; round < 5; round++) {
      const promptSrc = [...playedSrcs].reverse().find((src) => src.includes("/audio/prompt-"))!;
      const word = promptSrc.match(/prompt-([a-z]+)\.mp3$/i)![1];

      const input = screen.getByLabelText(/spell the word/i);
      fireEvent.change(input, { target: { value: word } });
      fireEvent.click(screen.getByRole("button", { name: /check/i }));

      act(() => {
        vi.advanceTimersByTime(1600);
      });
    }

    expect(screen.getByText(/PUFFER POWER/i)).toBeInTheDocument();
  });
});
