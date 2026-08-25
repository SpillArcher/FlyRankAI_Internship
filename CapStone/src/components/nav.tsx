"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useWishlist } from "@/context/wishlist-context";

const links = [
  { href: "/", label: "Home" },
  { href: "/men", label: "Men" },
  { href: "/women", label: "Women" },
  { href: "/about", label: "About" },
];

function CountBadge({ count }: { count: number }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 font-mono text-xs text-white"
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const { itemCount, openDrawer } = useCart();
  const { items: wishlistItems } = useWishlist();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-paper/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="font-display text-lg font-semibold text-ink hover:text-signal"
        >
          Stylist
        </Link>

        <ul className="hidden gap-6 font-mono text-sm uppercase tracking-wide md:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-ink/70 hover:text-signal">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishlistItems.length} item${wishlistItems.length === 1 ? "" : "s"}`}
            className="relative rounded-md border border-border p-2 text-ink hover:border-signal hover:text-signal"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
            <CountBadge count={wishlistItems.length} />
          </Link>

          <button
            type="button"
            onClick={openDrawer}
            suppressHydrationWarning 
            aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
            className="relative rounded-md border border-border p-2 text-ink hover:border-signal hover:text-signal"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <CountBadge count={itemCount} />
          </button>

          <button
            type="button"
            className="text-ink hover:text-signal md:hidden"
            aria-expanded={open}
            aria-controls="primary-nav"
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {open && (
        <ul
          id="primary-nav"
          className="flex flex-col gap-1 border-t border-border px-6 pb-4 font-mono text-sm uppercase tracking-wide md:hidden"
        >
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block py-2 text-ink/70 hover:text-signal"
                onClick={() => setOpen(false)}
                suppressHydrationWarning
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
