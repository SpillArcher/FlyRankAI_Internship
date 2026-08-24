"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";

export default function CartPage() {
  const { items, subtotal, setQuantity, removeItem, clearCart } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);

  if (checkedOut) {
    return (
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="font-mono text-sm uppercase tracking-widest text-success">
          Order placed
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">
          Thanks for shopping.
        </h1>
        <p className="mt-4 text-ink/70">
          This is a portfolio demo, so nothing was actually charged or
          shipped — but that&apos;s exactly how a real checkout would end.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-md bg-accent px-6 py-2.5 font-mono text-sm uppercase tracking-wide text-white hover:bg-accent/90"
        >
          Back home
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-4xl font-semibold text-ink">
        Your cart
      </h1>

      {items.length === 0 ? (
        <div className="mt-10">
          <p className="text-ink/70">Your cart is empty.</p>
          <Link
            href="/men"
            className="mt-4 inline-block rounded-md border border-border px-4 py-2 font-mono text-sm uppercase tracking-wide text-ink/70 hover:border-signal hover:text-signal"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-10 lg:grid-cols-3">
          <ul className="flex flex-col gap-4 lg:col-span-2">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.li
                  key={item.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4 overflow-hidden border-b border-border pb-4"
                >
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-white">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-sm text-ink">{item.title}</p>
                    <p className="font-mono text-sm text-price">
                      ${item.price}
                    </p>
                    <div className="mt-1 flex items-center gap-3">
                      <label
                        className="font-mono text-xs uppercase text-ink/60"
                        htmlFor={`cart-qty-${item.id}`}
                      >
                        Qty
                      </label>
                      <select
                        id={`cart-qty-${item.id}`}
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
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <div className="h-fit rounded-lg border border-border p-6">
            <div className="flex items-center justify-between font-mono text-sm">
              <span>Subtotal</span>
              <span className="text-price">${subtotal.toFixed(2)}</span>
            </div>
            <p className="mt-1 text-xs text-ink/50">
              Shipping and tax calculated at checkout.
            </p>
            <button
              type="button"
              onClick={() => {
                setCheckedOut(true);
                clearCart();
              }}
              className="mt-6 w-full rounded-md bg-accent px-4 py-2.5 font-mono text-sm uppercase tracking-wide text-white hover:bg-accent/90"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
