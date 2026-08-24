"use client";

import { useState } from "react";
import Image from "next/image";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
}

interface Pick {
  product: Product;
  reason: string;
}

interface StyleResult {
  stylistNote: string;
  picks: Pick[];
}

const INTEREST_OPTIONS = [
  "Streetwear",
  "Minimalist",
  "Athletic",
  "Formal",
  "Outdoors",
  "Vintage",
];

const COLOR_OPTIONS: { label: string; swatch: string }[] = [
  { label: "Black", swatch: "#17131f" },
  { label: "White", swatch: "#ffffff" },
  { label: "Navy", swatch: "#1e3a8a" },
  { label: "Red", swatch: "#dc2626" },
  { label: "Green", swatch: "#16a34a" },
  { label: "Earth tones", swatch: "#a16207" },
];

const SEASONS = ["Spring", "Summer", "Fall", "Winter"];

function detectCurrentSeason(): string {
  const month = new Date().getMonth(); // 0 = Jan
  if (month >= 2 && month <= 4) return "Spring";
  if (month >= 5 && month <= 7) return "Summer";
  if (month >= 8 && month <= 10) return "Fall";
  return "Winter";
}

// fakestoreapi.com's images are stable and always real, but keep a
// defensive fallback in case a URL is ever malformed rather than let
// next/image throw.
function getDisplayImage(url: string): string {
  try {
    new URL(url);
    return url;
  } catch {
    return "/no-photo.svg";
  }
}

export default function StyleQuiz() {
  const [interests, setInterests] = useState<string[]>([]);
  const [favoriteColor, setFavoriteColor] = useState("");
  const [favoriteSeason, setFavoriteSeason] = useState("");
  const [currentSeason, setCurrentSeason] = useState(detectCurrentSeason());
  const [moodOccasion, setMoodOccasion] = useState("");

  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<StyleResult | null>(null);

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  }

  function handleReset() {
    setInterests([]);
    setFavoriteColor("");
    setFavoriteSeason("");
    setMoodOccasion("");
    setResult(null);
    setError(null);
    setStatus("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/style", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          interests,
          favoriteColor,
          favoriteSeason,
          currentSeason,
          moodOccasion,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setResult(data);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  const isLoading = status === "loading";
  const canSubmit = interests.length > 0 && moodOccasion.trim().length > 0;

  return (
    <div className="flex flex-col gap-12">
      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <fieldset>
          <legend className="font-mono text-sm uppercase tracking-widest text-signal">
            Interests
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                aria-pressed={interests.includes(interest)}
                className={`rounded-full border px-4 py-1.5 text-sm ${
                  interests.includes(interest)
                    ? "border-accent bg-accent text-white"
                    : "border-border text-ink/70 hover:border-signal"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="font-mono text-sm uppercase tracking-widest text-signal">
            Favorite color
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {COLOR_OPTIONS.map(({ label, swatch }) => (
              <button
                key={label}
                type="button"
                onClick={() => setFavoriteColor(label)}
                aria-pressed={favoriteColor === label}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${
                  favoriteColor === label
                    ? "border-ink bg-ink text-white"
                    : "border-border text-ink/70 hover:border-signal"
                }`}
              >
                <span
                  aria-hidden="true"
                  className="h-3.5 w-3.5 rounded-full border border-border/60"
                  style={{ backgroundColor: swatch }}
                />
                {label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid gap-6 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-sm uppercase tracking-widest text-signal">
              Favorite season
            </span>
            <select
              value={favoriteSeason}
              onChange={(e) => setFavoriteSeason(e.target.value)}
              className="rounded-md border border-border bg-paper p-2 text-sm text-ink"
            >
              <option value="">Pick one</option>
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="font-mono text-sm uppercase tracking-widest text-signal">
              Current season
            </span>
            <select
              value={currentSeason}
              onChange={(e) => setCurrentSeason(e.target.value)}
              className="rounded-md border border-border bg-paper p-2 text-sm text-ink"
            >
              {SEASONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-sm uppercase tracking-widest text-signal">
            What do you feel like today?
          </span>
          <input
            type="text"
            value={moodOccasion}
            onChange={(e) => setMoodOccasion(e.target.value)}
            placeholder="e.g. confident, going to a fancy dinner"
            className="rounded-md border border-border bg-paper p-3 text-sm text-ink"
            disabled={isLoading}
          />
        </label>

        <button
          type="submit"
          disabled={isLoading || !canSubmit}
          className="self-start rounded-md bg-accent px-6 py-2.5 font-mono text-sm uppercase tracking-wide text-white hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Styling…" : "Style me"}
        </button>

        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}
      </form>

      {/* Visually hidden status announcements for screen readers — the
          results/skeleton below are also visible, but this gives a single
          clear announcement point independent of layout. */}
      <p className="sr-only" role="status">
        {isLoading
          ? "Finding your picks…"
          : result
            ? "Recommendations ready."
            : ""}
      </p>

      {isLoading && (
        <div
          aria-hidden="true"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-border p-3"
            >
              <div className="aspect-square w-full rounded-md bg-border/60" />
              <div className="mt-3 h-4 w-2/3 rounded bg-border/60" />
              <div className="mt-2 h-3 w-1/3 rounded bg-border/60" />
            </div>
          ))}
        </div>
      )}

      <div>
        {result && (
          <div className="fade-in-up flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <p className="font-display text-2xl text-ink">
                {result.stylistNote}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="shrink-0 rounded-md border border-border px-4 py-1.5 font-mono text-sm uppercase tracking-wide text-ink/70 hover:border-signal hover:text-signal"
              >
                Start over
              </button>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {result.picks.map((pick) => (
                <li
                  key={pick.product.id}
                  className="group flex flex-col gap-2 rounded-lg border border-border p-3 transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-md bg-white">
                    <Image
                      src={getDisplayImage(pick.product.image)}
                      alt={pick.product.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <p className="font-display text-base text-ink">
                    {pick.product.title}
                  </p>
                  <p className="font-mono text-sm text-price">
                    ${pick.product.price}
                  </p>
                  <p className="text-sm text-ink/70">{pick.reason}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
