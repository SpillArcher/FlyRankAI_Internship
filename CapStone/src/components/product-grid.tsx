"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/product-card";
import type { Product } from "@/lib/catalog";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-sm text-ink/60">
        Nothing here right now — check back soon.
      </p>
    );
  }

  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
    >
      {products.map((product) => (
        <motion.li key={product.id} variants={item} className="list-none h-full">
          <ProductCard product={product} />
        </motion.li>
      ))}
    </motion.ul>
  );
}
