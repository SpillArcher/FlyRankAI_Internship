import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/add-to-cart-button";
import WishlistButton from "@/components/wishlist-button";
import type { Product } from "@/lib/catalog";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group flex h-full flex-col gap-2 rounded-lg border border-border p-3 transition-shadow hover:shadow-md">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-square w-full overflow-hidden rounded-md bg-white"
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
        />
        <WishlistButton product={product} className="absolute right-2 top-2" />
      </Link>
      <Link href={`/product/${product.id}`} className="hover:text-signal">
        <p className="line-clamp-2 font-display text-base text-ink">
          {product.title}
        </p>
      </Link>
      <p className="font-mono text-sm text-price">${product.price}</p>
      <AddToCartButton product={product} className="mt-auto self-start" />
    </div>
  );
}
