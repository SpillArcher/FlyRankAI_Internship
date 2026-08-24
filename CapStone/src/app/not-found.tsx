import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col items-start px-6 py-24">
      <p className="font-mono text-sm uppercase tracking-widest text-signal">
        404
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-ink">
        We couldn&apos;t find that page.
      </h1>
      <p className="mt-4 text-ink/70">
        The item or page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-accent px-4 py-2 font-mono text-sm uppercase tracking-wide text-white hover:bg-accent/90"
      >
        Back home
      </Link>
    </section>
  );
}
