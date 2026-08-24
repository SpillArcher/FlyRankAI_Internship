"use client";

import { useWishlist } from "@/context/wishlist-context";

interface Props {
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
  className?: string;
}

export default function WishlistButton({ product, className = "" }: Props) {
  const { isWishlisted, toggle } = useWishlist();
  const active = isWishlisted(product.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault(); // don't trigger a wrapping <Link> to the product page
        toggle(product);
      }}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={`rounded-full border border-border bg-paper/90 p-1.5 backdrop-blur transition-transform hover:scale-110 hover:border-signal ${className}`}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        className={active ? "text-accent" : "text-ink/60"}
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
      </svg>
    </button>
  );
}
