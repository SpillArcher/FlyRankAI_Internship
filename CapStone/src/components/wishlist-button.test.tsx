import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WishlistButton from "./wishlist-button";
import { WishlistProvider } from "@/context/wishlist-context";

const product = { id: 1, title: "Test Jacket", price: 50, image: "/img.jpg" };

function renderButton() {
  return render(
    <WishlistProvider>
      <WishlistButton product={product} />
    </WishlistProvider>
  );
}

describe("WishlistButton", () => {
  it("starts unpressed", () => {
    renderButton();
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("toggles to pressed on click, and back on a second click", async () => {
    const user = userEvent.setup();
    renderButton();
    const button = screen.getByRole("button");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("updates its accessible label to match state", async () => {
    const user = userEvent.setup();
    renderButton();

    expect(
      screen.getByRole("button", { name: /add to wishlist/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button"));

    expect(
      screen.getByRole("button", { name: /remove from wishlist/i })
    ).toBeInTheDocument();
  });
});
