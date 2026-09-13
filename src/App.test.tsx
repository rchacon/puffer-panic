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
    // Some levels (Kraken, Megalodon) show a boss intro before the round
    // cards exist -- advance past it (long enough to cover either's
    // duration; a no-op if there's no intro showing, since a longer wait
    // than a since-fired timer needs is harmless) before assuming the
    // battle scene has started.
    act(() => {
      vi.advanceTimersByTime(2500);
    });
    answerAllRounds();
    fireEvent.click(screen.getByRole("button", { name: /play again/i }));
  }

  it("shows a dramatic intro before the Kraken (level 10) begins", () => {
    render(<App />);

    for (let i = 0; i < 9; i++) playThroughOneGame();

    // 10th start -> level 10, the Kraken. The intro plays first; the round
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

    for (let i = 0; i < 9; i++) playThroughOneGame();

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
});
