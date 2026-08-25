# Stylist

An AI-powered style quiz that recommends real clothing and shoe picks from a live product catalog based on your interests, color preferences, season, and mood.

**Live demo:** [[Stylist](https://fly-rank-ai-internship.vercel.app/)]
**Repo:** [[Stylist-repo](https://github.com/SpillArcher/FlyRankAI_Internship/tree/main/CapStone)]

---

## Project Brief

Style Stylist is a styling quiz for anyone who finds a full clothing catalog overwhelming rather than helpful - someone who knows roughly what they like (a few interests, a favorite color palette, the season, a general mood) but doesn’t want to scroll through hundreds of unrelated listings to find it. Instead of a keyword search, the user answers a few short quiz questions and the app feeds that context - plus a real, live-fetched product catalog filtered to clothing and shoes - into an LLM, which spits out 4–6 specific picks with a one-line reason for each, not generic advice and not items invented out of thin air, since every recommendation is checked against the real catalog before it’s shown. I picked this idea because it’s a real test of whether an LLM can be trusted to reason over a constrained, factual dataset and explain itself, rather than a chat window bolted onto an app for its own sake: the core design challenge was letting the model choose and justify, never letting it fabricate price, image, or title and this is exactly the sort of problem worth building to learn from.

---

## Setup & Run

```bash
git clone https://github.com/SpillArcher/FlyRankAI_Internship.git
cd FlyRankAI_Internship/Capstone
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
| `src/lib/platzi.ts` | Fetches Platzi's live categories, keeps only Clothes + Shoes, then fetches products filtered to those categories (capped at 40 items so the prompt stays a reasonable size). Filters by category *name* rather than a hardcoded ID so it keeps working if Platzi's IDs change. |
| `src/lib/catalog.ts` | Supplementary product entries added to round out the catalog beyond what Platzi returns. |
| `src/app/api/style/route.ts` | Server route that sends the compact catalog plus the user's quiz answers (interests, colors, season, mood) to Gemini and asks for a `stylistNote` and 4–6 picks (`id` + one-line `reason`) in a fixed JSON shape. |
| Frontend (hero + quiz form + results) | Collects quiz answers, calls `/api/style`, and renders the returned picks with real product data. |

**Season detection:** the current season is auto-detected from today's date, with a manual override available, so the user doesn't have to type it.

**Images:** rendered through `next/image` with `i.imgur.com` allow-listed in `next.config.ts` for proper optimization rather than raw `<img>` tags.

---

## AI Integration

**Model:** Gemini (`gemini-flash-latest` - Google's alias for their current recommended Flash model, so the app doesn't go stale as they ship new versions).

**Why an LLM here specifically:** the task - matching a short, unstructured set of stated preferences against a catalog and explaining the reasoning - is a genuine fit for a language model, not a rules engine. A keyword filter can't weigh "moody, neutral colors, into hiking" against a mixed clothing catalog the way a model can.

**Prompt design:** the request sends the compact catalog (id, title, category, price, description for up to 40 items) together with the user's quiz answers, and constrains the response with Gemini's `responseSchema` feature to exactly `{ stylistNote: string, picks: [{ id, reason }] }`. Schema-constrained output was chosen over prompt-only JSON because it removes an entire class of "model wrapped the JSON in prose" parsing failures.

**Anti-hallucination design (the important part):** the model is only ever trusted for *which* product id to pick and *why*. It never supplies price, image, or title. Every returned id is looked up against the real, server-fetched catalog data; any id the model might hallucinate is silently dropped rather than breaking the response or showing fabricated product info.

---

## Known Limitations & Future Improvements

- Confirm test coverage meets the ≥50% bar - see `TESTING.md` / test output for current numbers.
- Some catalog entries use placeholder image URLs (`PASTE_IMAGE_URL_HERE_N`) added as templates - replace with real image URLs before considering the catalog complete.
- No caching on the Platzi fetch - every quiz submission re-fetches categories and products; worth caching with revalidation if this goes to real traffic.
- No rate limiting on `/api/style` - a public deployment calling a paid/metered LLM API without rate limiting is a cost risk.
- Accessibility audit (WAVE/axe) not yet run against the live deployment - see the audit section of the submission.
- Only tested against Gemini; the original Claude integration path is not currently wired up or verified.

---

## Tech Stack

Next.js, TypeScript, Tailwind CSS, Vercel (deployment), Gemini API (`gemini-flash-latest`), Platzi Fake Store API (product catalog).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Key from [aistudio.google.com/apikey](https://aistudio.google.com/apikey), used server-side only in `/api/style/route.ts`. Never exposed to the client. |
