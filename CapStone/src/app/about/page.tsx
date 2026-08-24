import AboutGallery from "@/components/about-gallery";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-sm uppercase tracking-widest text-signal">
        About
      </p>
      <h1 className="mt-2 font-display text-4xl font-semibold text-ink">
        Most stores make you do the filtering.
      </h1>

      <div className="mt-10">
        <AboutGallery />
      </div>

      <div className="mt-10 flex flex-col gap-4 text-ink/70">
        <p>
          Stylist started from a simple annoyance: rigid filters — color,
          size, category — force you to translate a feeling into checkboxes
          before a store will show you anything useful. But nobody actually
          shops by checkbox. They shop by mood, by occasion, by what the
          weather&apos;s doing outside.
        </p>
        <p>
          So the AI stylist on the home page skips that step. Tell it your
          interests, your favorite colors, and what today feels like, and it
          reads that context directly against the real catalog — no filters
          in between.
        </p>
        <p>
          You can still browse the traditional way too, through{" "}
          <a href="/men" className="text-signal hover:underline">
            Men&apos;s
          </a>{" "}
          and{" "}
          <a href="/women" className="text-signal hover:underline">
            Women&apos;s
          </a>{" "}
          — both are here. But the stylist is the part actually worth
          trying.
        </p>
      </div>
    </section>
  );
}
