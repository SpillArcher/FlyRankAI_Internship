# Deployment Checklist - Stylist

## Pre-Deploy

- [x] `npm run build` completes locally with no errors
- [x] `npm run lint` passes with no errors
- [x] Tested a real quiz submission locally against the live Gemini API (not just a mocked response)
- [x] `.env.local` is in `.gitignore` and was **not** committed
- [x] `.env.example` exists and lists `GEMINI_API_KEY` with no real value
- [x] No API keys, secrets, or credentials anywhere in the committed code
- [x] README setup instructions followed from a clean clone to confirm they actually work - **not personally re-verified after the latest README rewrite; do this once before final submission**

## Deploy

- [x] Repo pushed to GitHub: [FlyRankAI_Internship/CapStone](https://github.com/SpillArcher/FlyRankAI_Internship/tree/main/CapStone)
- [x] Project imported into Vercel
- [x] `GEMINI_API_KEY` added in Vercel → Project Settings → Environment Variables for **both** Production and Preview
- [x] Deployment succeeded with no build errors on the host
- [x] Live URL loads: [Stylist](https://fly-rank-ai-internship.vercel.app/)

## Post-Deploy Verification

- [x] Submitted a real quiz on the **live** URL after the most recent catalog change (static local products) and got back real picks - **re-verify after pushing the local-catalog migration; the last confirmed live test predates it**
- [x] Checked the browser console on the live site for errors
- [x] Confirmed images load correctly - now via `images.unoptimized: true`, so any image URL renders regardless of host
- [x] Tested what happens with an invalid/empty quiz submission - the submit button stays disabled until at least one interest and a mood/occasion are entered, so an empty submission can't be sent at all
- [x] Tested what happens if the Gemini API call fails or times out - see "How This Fails Safely" below
- [x] Ran Lighthouse against the live URL - mobile and desktop
- [x] Ran an accessibility audit (WAVE or axe) against the live URL

## Error Handling - How This Fails Safely

- **If the Gemini API key is missing or invalid:** the server returns a 500 with `"Server is missing GEMINI_API_KEY."` before any external call is attempted - checked immediately, no wasted request.
- **If the Gemini API call times out or errors:** a `503` (model overloaded) triggers one automatic retry after a short delay before surfacing anything to the user. If it still fails, or returns a different error code, the person sees a specific message (rate limit vs. generic service error) rather than a blank page or a raw stack trace - mapped explicitly in `/api/style/route.ts`.
- **If the catalog can't be loaded:** no longer a real failure mode - the catalog is a static local array with no network dependency, so this can only fail if the code itself has a bug, not due to any external service being down.
- **If the model returns malformed/unparseable JSON:** caught in a try/catch around `JSON.parse`, returns a clear "could not parse the AI's response" error rather than crashing the route. Separately, if the model returns a product `id` that doesn't exist in the real catalog, that pick is silently dropped rather than shown with fabricated data.

## Rollback Plan

- **Method:** Revert the last commit on `main` and push - Vercel auto-deploys `main`, so a revert redeploys the previous working version in roughly 1–2 minutes. Alternatively, use Vercel's dashboard to instantly re-promote any previous "Ready" deployment to Production without needing a new commit at all.
- **Monitoring:** None set up yet - checked manually via Vercel's Runtime Logs when something breaks. Future improvement: Vercel's built-in Analytics/Observability, or a simple external uptime check.

## Sign-off

- **Deployed by:** Anthony Joseph
- **Date:** 25 August 2026
- **Live URL:** https://fly-rank-ai-internship.vercel.app/
- **Repo:** https://github.com/SpillArcher/FlyRankAI_Internship/tree/main/CapStone
