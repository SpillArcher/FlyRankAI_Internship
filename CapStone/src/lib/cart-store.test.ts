import { describe, it, expect, beforeEach } from "vitest";
import * as cart from "./cart-store";

const product = { id: 1, title: "Test Jacket", price: 50, image: "/img.jpg" };
const product2 = { id: 2, title: "Test Shirt", price: 20, image: "/img2.jpg" };

describe("cart-store", () => {
  beforeEach(() => {
    cart.clearCart();
  });

  it("starts empty", () => {
    expect(cart.getSnapshot()).toEqual([]);
  });

  it("adds a new item with quantity 1", () => {
    cart.addItem(product);
    expect(cart.getSnapshot()).toEqual([{ ...product, quantity: 1 }]);
  });

  it("increments quantity when the same item is added again", () => {
    cart.addItem(product);
    cart.addItem(product);
    const items = cart.getSnapshot();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it("keeps separate entries for different items", () => {
    cart.addItem(product);
    cart.addItem(product2);
    expect(cart.getSnapshot()).toHaveLength(2);
  });

  it("removes an item entirely", () => {
    cart.addItem(product);
    cart.removeItem(product.id);
    expect(cart.getSnapshot()).toEqual([]);
  });

  it("updates quantity directly", () => {
    cart.addItem(product);
    cart.setQuantity(product.id, 5);
    expect(cart.getSnapshot()[0].quantity).toBe(5);
  });

  it("removes the item when quantity is set to 0 or less", () => {
    cart.addItem(product);
    cart.setQuantity(product.id, 0);
    expect(cart.getSnapshot()).toEqual([]);
  });

  it("clears the whole cart", () => {
    cart.addItem(product);
    cart.addItem(product2);
    cart.clearCart();
    expect(cart.getSnapshot()).toEqual([]);
  });

  it("persists to localStorage on every mutation", () => {
    cart.addItem(product);
    const stored = JSON.parse(window.localStorage.getItem("stylist-cart")!);
    expect(stored).toEqual([{ ...product, quantity: 1 }]);
  });

  it("notifies subscribers when the cart changes", () => {
    let calls = 0;
    const unsubscribe = cart.subscribe(() => {
      calls++;
    });
    cart.addItem(product);
    expect(calls).toBe(1);
    unsubscribe();
  });
});
