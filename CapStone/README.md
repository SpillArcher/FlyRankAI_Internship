# Stylist

An AI-powered style quiz that recommends real clothing picks from a product catalog based on your interests, color preferences, season, and mood.

**Live demo:** [Stylist](https://fly-rank-ai-internship.vercel.app/)
**Repo:** [FlyRankAI_Internship/CapStone](https://github.com/SpillArcher/FlyRankAI_Internship/tree/main/CapStone)

---

## Project Brief

Stylist is a styling quiz for anyone who finds a full clothing catalog overwhelming rather than helpful - someone who knows roughly what they like (a few interests, a favorite color palette, the season, a general mood) but doesn't want to scroll through unrelated listings to find it. Instead of a keyword search, the user answers a few short quiz questions and the app feeds that context - plus the product catalog, filtered to clothing - into an LLM, which returns 4–6 specific picks with a one-line reason for each, not generic advice and not items invented out of thin air, since every recommendation is checked against the real catalog before it's shown. I picked this idea because it's a real test of whether an LLM can be trusted to reason over a constrained, factual dataset and explain itself, rather than a chat window bolted onto an app for its own sake - the core design challenge was letting the model choose and justify, never letting it fabricate price, image, or title.

---

## Setup & Run

```bash
git clone https://github.com/SpillArcher/FlyRankAI_Internship.git
cd FlyRankAI_Internship/CapStone
npm install
```

Create a `.env.local` file in the project root:

```
GEMINI_API_KEY=your_key_here
```

Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), fill out the quiz, and submit. You should see picks pulled from the catalog with a one-line reason for each.

---

## Architecture Overview

| Part | What it does |
|---|---|
| `src/lib/catalog.ts` | The product catalog - a static, local array of clothing items (id, title, price, description, image, category). No external API call: this was deliberately migrated away from a live third-party demo API after it proved unreliable (see Known Limitations and the dev log for why). |
| `src/app/api/style/route.ts` | Server route that sends the catalog plus the user's quiz answers (interests, colors, season, mood) to Gemini and asks for a `stylistNote` and 4–6 picks (`id` + one-line `reason`) in a fixed JSON shape. Retries once automatically if the model reports itself temporarily overloaded. |
| `src/context/cart-context.tsx`, `src/lib/cart-store.ts` | Cart state, persisted to `localStorage` via `useSyncExternalStore` rather than a plain `useEffect`, to avoid hydration mismatches. |
| `src/context/wishlist-context.tsx`, `src/lib/wishlist-store.ts` | Same pattern, for the wishlist. |
| `src/app/men/`, `src/app/women/`, `src/app/product/[id]/` | Server-rendered browse and detail pages, reading from the same static catalog. |
| Frontend (hero + quiz form + results) | Collects quiz answers, calls `/api/style`, and renders the returned picks with real product data. |

**Season detection:** the current season is auto-detected from today's date, with a manual override available, so the user doesn't have to type it.

**Images:** rendered through `next/image` with `images.unoptimized: true` set in `next.config.ts`, so any image URL works regardless of which host it's hosted on - no per-domain allowlist to maintain.

---

## AI Integration

**Model:** `gemini-3.5-flash-lite`, pinned to a specific version rather than an auto-updating `-latest` alias, after repeated quota and deprecation issues with aliases that silently pointed at newer, less-provisioned preview models (see the dev log for the full story).

**Why an LLM here specifically:** the task - matching a short, unstructured set of stated preferences against a catalog and explaining the reasoning - is a genuine fit for a language model, not a rules engine. A keyword filter can't weigh "confident, neutral colors, going to dinner" against a mixed clothing catalog the way a model can.

**Prompt design:** the request sends the compact catalog (id, title, category, price, description) together with the user's quiz answers, and constrains the response with Gemini's `responseSchema` feature to exactly `{ stylistNote: string, picks: [{ id, reason }] }`. Schema-constrained output was chosen over prompt-only JSON because it removes an entire class of "model wrapped the JSON in prose" parsing failures.

**Anti-hallucination design (the important part):** the model is only ever trusted for *which* product id to pick and *why*. It never supplies price, image, or title. Every returned id is looked up against the real catalog data server-side; any id the model might hallucinate is silently dropped rather than breaking the response or showing fabricated product info.

---

## Known Limitations & Future Improvements

- Test coverage is at 5 test files covering the cart, wishlist, and stylist quiz logic (24 passing tests) - see `TESTING_GUIDE.md` for the actual output.
- The catalog is static - adding a new product means editing `catalog.ts` directly rather than through an admin interface.
- No rate limiting on `/api/style` - a public deployment calling a metered LLM API without rate limiting is a cost risk if traffic grows.
- Accessibility audit (WAVE/axe) and Lighthouse - see `AUDIT_GUIDE.md` for status.
- Checkout is an intentional mock, clearly labeled as a demo - no real payment processing.
- Only tested against Gemini; the original Claude integration path is not currently wired up.

---

## Tech Stack

Next.js (App Router), TypeScript, Tailwind CSS, Vercel (deployment), Gemini API (`gemini-3.5-flash-lite`), Vitest + React Testing Library.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey), used server-side only in `/api/style/route.ts`. Never exposed to the client. |
