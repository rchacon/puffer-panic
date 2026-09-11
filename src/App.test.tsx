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
});
