"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/cart-context";

export default function CartDrawer() {
  const { items, subtotal, isDrawerOpen, closeDrawer, setQuantity, removeItem } =
    useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeDrawer}
            className="fixed inset-0 z-40 bg-ink/40"
            aria-hidden="true"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            role="dialog"
            aria-label="Shopping cart"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-paper shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <p className="font-display text-lg font-semibold text-ink">
                Your cart
              </p>
              <button
                type="button"
                onClick={closeDrawer}
                aria-label="Close cart"
                className="text-ink/70 hover:text-signal"
              >
                Close
              </button>
            </div>

            {items.length === 0 ? (
              <p className="px-6 py-8 text-sm text-ink/60">
                Your cart is empty.
              </p>
            ) : (
              <ul className="flex-1 overflow-y-auto px-6 py-4">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="flex gap-3 border-b border-border py-4 last:border-none"
                  >
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="line-clamp-1 text-sm text-ink">
                        {item.title}
                      </p>
                      <p className="font-mono text-sm text-price">
                        ${item.price}
                      </p>
                      <div className="flex items-center gap-2">
                        <label className="sr-only" htmlFor={`qty-${item.id}`}>
                          Quantity for {item.title}
                        </label>
                        <select
                          id={`qty-${item.id}`}
                          value={item.quantity}
                          onChange={(e) =>
                            setQuantity(item.id, Number(e.target.value))
                          }
                          className="rounded-md border border-border bg-paper px-2 py-1 text-sm"
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 1).map(
                            (n) => (
                              <option key={n} value={n}>
                                {n}
                              </option>
                            )
                          )}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="font-mono text-xs uppercase text-ink/50 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {items.length > 0 && (
              <div className="border-t border-border px-6 py-4">
                <div className="flex items-center justify-between font-mono text-sm">
                  <span>Subtotal</span>
                  <span className="text-price">${subtotal.toFixed(2)}</span>
                </div>
                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="mt-4 block rounded-md bg-accent px-4 py-2.5 text-center font-mono text-sm uppercase tracking-wide text-white hover:bg-accent/90"
                >
                  View cart
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
