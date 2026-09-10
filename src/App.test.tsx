import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
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
});
