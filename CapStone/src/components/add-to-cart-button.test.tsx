import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddToCartButton from "./add-to-cart-button";
import { CartProvider } from "@/context/cart-context";

const product = { id: 1, title: "Test Jacket", price: 50, image: "/img.jpg" };

function renderButton() {
  return render(
    <CartProvider>
      <AddToCartButton product={product} />
    </CartProvider>
  );
}

describe("AddToCartButton", () => {
  it("shows 'Add to cart' by default", () => {
    renderButton();
    expect(
      screen.getByRole("button", { name: /add to cart/i })
    ).toBeInTheDocument();
  });

  it("shows a confirmation after being clicked", async () => {
    const user = userEvent.setup();
    renderButton();

    await user.click(screen.getByRole("button", { name: /add to cart/i }));

    expect(screen.getByRole("button", { name: /added/i })).toBeInTheDocument();
  });
});
