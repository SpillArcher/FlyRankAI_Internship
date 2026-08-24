import { describe, it, expect, beforeEach } from "vitest";
import * as wishlist from "./wishlist-store";

const product = { id: 1, title: "Test Jacket", price: 50, image: "/img.jpg" };

describe("wishlist-store", () => {
  beforeEach(() => {
    wishlist.getSnapshot().forEach((i) => wishlist.remove(i.id));
  });

  it("starts empty", () => {
    expect(wishlist.getSnapshot()).toEqual([]);
  });

  it("adds an item on first toggle", () => {
    wishlist.toggle(product);
    expect(wishlist.getSnapshot()).toEqual([product]);
    expect(wishlist.isWishlisted(product.id)).toBe(true);
  });

  it("removes the item on second toggle", () => {
    wishlist.toggle(product);
    wishlist.toggle(product);
    expect(wishlist.getSnapshot()).toEqual([]);
    expect(wishlist.isWishlisted(product.id)).toBe(false);
  });

  it("removes an item directly", () => {
    wishlist.toggle(product);
    wishlist.remove(product.id);
    expect(wishlist.getSnapshot()).toEqual([]);
  });

  it("persists to localStorage", () => {
    wishlist.toggle(product);
    const stored = JSON.parse(
      window.localStorage.getItem("stylist-wishlist")!
    );
    expect(stored).toEqual([product]);
  });
});
