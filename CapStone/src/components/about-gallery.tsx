"use client";

import { motion } from "framer-motion";

const PANELS = [
  {
    label: "The Idea",
    caption: "Context over checkboxes",
    gradient: "linear-gradient(135deg, var(--color-accent), var(--color-signal))",
  },
  {
    label: "The Catalog",
    caption: "Real items, real prices",
    gradient: "linear-gradient(135deg, var(--color-signal), var(--color-price))",
  },
  {
    label: "The Fit",
    caption: "Picked for your mood",
    gradient: "linear-gradient(135deg, var(--color-price), var(--color-success))",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function AboutGallery() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="grid gap-4 sm:grid-cols-3"
    >
      {PANELS.map((panel) => (
        <motion.div
          key={panel.label}
          variants={item}
          className="group relative aspect-[4/5] overflow-hidden rounded-lg"
        >
          <div
            className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
            style={{ backgroundImage: panel.gradient }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/0 to-ink/0" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-display text-lg font-semibold text-white">
              {panel.label}
            </p>
            <p className="mt-0.5 font-mono text-xs uppercase tracking-wide text-white/80">
              {panel.caption}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
