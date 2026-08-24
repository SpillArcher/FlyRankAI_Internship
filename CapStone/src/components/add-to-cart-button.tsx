"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";

interface Props {
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
  className?: string;
}

export default function AddToCartButton({ product, className = "" }: Props) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleClick() {
    addItem(product);
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`rounded-md bg-accent px-4 py-2 font-mono text-sm uppercase tracking-wide text-white transition-transform hover:bg-accent/90 active:scale-95 ${className}`}
    >
      {justAdded ? "Added ✓" : "Add to cart"}
    </button>
  );
}
