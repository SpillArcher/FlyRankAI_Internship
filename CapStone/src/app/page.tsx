import Link from "next/link";
import StyleQuiz from "@/components/style-quiz";
import ScrollReveal from "@/components/scroll-reveal";

export default function HomePage() {
  return (
    <section className="relative mx-auto max-w-5xl overflow-hidden px-6 py-16">
      <div
        aria-hidden="true"
        className="ambient-blob pointer-events-none absolute -left-24 -top-24 -z-10 h-96 w-96 rounded-full opacity-20 blur-3xl"
        style={{
          backgroundImage:
            "linear-gradient(135deg, var(--color-accent), var(--color-signal))",
        }}
      />
      <p className="font-mono text-sm uppercase tracking-widest text-signal">
        AI Stylist
      </p>
      <h1
        className="mt-4 max-w-2xl bg-clip-text font-display text-5xl font-semibold text-transparent"
        style={{
          backgroundImage:
            "linear-gradient(90deg, var(--color-accent), var(--color-signal))",
        }}
      >
        Dressed for how you actually feel.
      </h1>
      <p className="mt-6 max-w-xl text-ink/70">
        Skip the filters. Tell us your interests, your colors, and what
        today feels like and the AI does the rest, picking from real items in
        the catalog and explaining why each one fits.
      </p>

      <ScrollReveal>
        <ol className="mt-10 grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
          <li>
            <p className="font-mono text-xs uppercase tracking-widest text-signal">
              01
            </p>
            <p className="mt-1 text-sm text-ink/80">
              Tell us your interests, colors, and how today feels.
            </p>
          </li>
          <li>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">
              02
            </p>
            <p className="mt-1 text-sm text-ink/80">
              The AI reads that context against the real catalog.
            </p>
          </li>
          <li>
            <p className="font-mono text-xs uppercase tracking-widest text-price">
              03
            </p>
            <p className="mt-1 text-sm text-ink/80">
              Get real picks, each with a reason it fits you.
            </p>
          </li>
        </ol>
      </ScrollReveal>

      <div className="mt-16">
        <StyleQuiz />
      </div>

      <ScrollReveal>
        <div className="mt-24 border-t border-border pt-10">
          <p className="font-mono text-sm uppercase tracking-widest text-signal">
            Prefer to browse?
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <Link
              href="/men"
              className="rounded-md border border-border px-5 py-2.5 font-mono text-sm uppercase tracking-wide text-ink/80 hover:border-signal hover:text-signal"
            >
              Shop Men&apos;s
            </Link>
            <Link
              href="/women"
              className="rounded-md border border-border px-5 py-2.5 font-mono text-sm uppercase tracking-wide text-ink/80 hover:border-signal hover:text-signal"
            >
              Shop Women&apos;s
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
