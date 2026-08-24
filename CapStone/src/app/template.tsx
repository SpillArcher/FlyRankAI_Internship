"use client";

import { motion } from "framer-motion";

// Next.js re-mounts template.tsx on every navigation (unlike layout.tsx,
// which persists) — that's what makes this fire on every single route
// change site-wide, without touching any individual page.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
