"use client";

import Link from "next/link";
import Image from "next/image";
import { localImage } from "@/lib/local-image";
import { AnimatePresence, motion } from "framer-motion";
import { useWishlist } from "@/context/wishlist-context";
import AddToCartButton from "@/components/add-to-cart-button";

export default function WishlistPage() {
  const { items, remove } = useWishlist();

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold text-ink">
        Your wishlist
      </h1>

      {items.length === 0 ? (
        <div className="mt-10">
          <p className="text-ink/70">Nothing saved yet.</p>
          <Link
            href="/men"
            className="mt-4 inline-block rounded-md border border-border px-4 py-2 font-mono text-sm uppercase tracking-wide text-ink/70 hover:border-signal hover:text-signal"
          >
            Start browsing
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 sm:grid-cols-2">
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-4 rounded-lg border border-border p-3"
              >
                <Link
                  href={`/product/${item.id}`}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-white"
                >
                  <Image
                    src={localImage(item.image)}
                    alt={item.title}
                    fill
                    sizes="96px"
                    className="object-contain p-2"
                  />
                </Link>
                <div className="flex flex-1 flex-col gap-2">
                  <Link href={`/product/${item.id}`} className="hover:text-signal">
                    <p className="line-clamp-2 text-sm text-ink">
                      {item.title}
                    </p>
                  </Link>
                  <p className="font-mono text-sm text-price">
                    ${item.price}
                  </p>
                  <div className="mt-auto flex items-center gap-3">
                    <AddToCartButton product={item} />
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="font-mono text-xs uppercase text-ink/50 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </section>
  );
}
