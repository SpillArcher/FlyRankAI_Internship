import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StyleQuiz from "./style-quiz";

describe("StyleQuiz", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("disables the submit button until an interest and a mood are given", async () => {
    const user = userEvent.setup();
    render(<StyleQuiz />);

    const submit = screen.getByRole("button", { name: /style me/i });
    expect(submit).toBeDisabled();

    await user.click(screen.getByRole("button", { name: /streetwear/i }));
    expect(submit).toBeDisabled(); // still needs the mood/occasion text

    await user.type(
      screen.getByPlaceholderText(/going to a fancy dinner/i),
      "confident"
    );
    expect(submit).toBeEnabled();
  });

  it("toggles an interest chip on and off via aria-pressed", async () => {
    const user = userEvent.setup();
    render(<StyleQuiz />);

    const chip = screen.getByRole("button", { name: /minimalist/i });
    expect(chip).toHaveAttribute("aria-pressed", "false");

    await user.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "true");

    await user.click(chip);
    expect(chip).toHaveAttribute("aria-pressed", "false");
  });

  it("shows an error message when the API call fails", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: "Something went wrong." }),
      })
    );

    render(<StyleQuiz />);
    await user.click(screen.getByRole("button", { name: /streetwear/i }));
    await user.type(
      screen.getByPlaceholderText(/going to a fancy dinner/i),
      "confident"
    );
    await user.click(screen.getByRole("button", { name: /style me/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Something went wrong."
    );
  });

  it("renders picks after a successful API call", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve({
            stylistNote: "A confident night out.",
            picks: [
              {
                product: {
                  id: 1,
                  title: "Test Jacket",
                  price: 50,
                  image: "/img.jpg",
                  category: "men's clothing",
                },
                reason: "Bold but classic.",
              },
            ],
          }),
      })
    );

    render(<StyleQuiz />);
    await user.click(screen.getByRole("button", { name: /streetwear/i }));
    await user.type(
      screen.getByPlaceholderText(/going to a fancy dinner/i),
      "confident"
    );
    await user.click(screen.getByRole("button", { name: /style me/i }));

    expect(await screen.findByText("A confident night out.")).toBeInTheDocument();
    expect(screen.getByText("Test Jacket")).toBeInTheDocument();
  });
});
