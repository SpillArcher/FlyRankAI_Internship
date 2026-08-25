# Deployment Checklist - Style Stylist

Fill this out as you actually complete each step, then sign off at the bottom. Don't check something you haven't verified.

## Pre-Deploy

-  `npm run build` completes locally with no errors
-  `npm run lint` passes with no errors
-  Tested a real quiz submission locally against the live Gemini API (not just a mocked response)
-  `.env.local` is in `.gitignore` and was **not** committed
-  `.env.example` exists and lists `GEMINI_API_KEY` with no real value
-  No API keys, secrets, or credentials anywhere in the committed code
-  README setup instructions followed from a clean clone to confirm they actually work

## Deploy

-  Repo pushed to GitHub: [[CAPSTONE](https://github.com/SpillArcher/FlyRankAI_Internship/tree/main/CapStone)]
-  Project imported into Vercel (or your chosen host)
-  `GEMINI_API_KEY` added in Vercel → Project Settings → Environment Variables for **both** Production and Preview
-  Deployment succeeded with no build errors on the host
-  Live URL loads: [[Stylist](https://github.com/SpillArcher/FlyRankAI_Internship/tree/main/CapStone)]

## Post-Deploy Verification

-  Submitted a real quiz on the **live** URL (not just localhost) and got back real picks
-  Checked the browser console on the live site for errors
-  Confirmed images load correctly (next/image + imgur allow-list working in production)
-  Tested what happens with an invalid/empty quiz submission- does it fail visibly and safely, or silently break?
-  Tested what happens if the Gemini API call fails or times out- does the user see an error state, or a blank/broken page?
-  Ran Lighthouse against the live URL (not localhost)- mobile and desktop
-  Ran an accessibility audit (WAVE or axe) against the live URL

## Error Handling - How This Fails Safely

Document what actually happens, don't guess:

- If the Gemini API key is missing or invalid: [describe actual behavior]
- If the Gemini API call times out or errors: [describe actual behavior]
- If Platzi's API is unreachable: [describe actual behavior]
- If the model returns malformed/unparseable JSON: [describe actual behavior]

## Rollback Plan

- **Method:** [e.g., "Revert the last commit on `main` and push- Vercel auto-deploys `main`, so a revert redeploys the previous working version in ~1–2 minutes."]
- **Monitoring:** [e.g., "None set up yet - checking manually. Future improvement: Vercel's built-in error/analytics dashboard, or a simple uptime check."]

## Sign-off

- **Deployed by:** Anthony Joseph
- **Date:** 25 August 2026
- **Live URL:** [https://fly-rank-ai-internship.vercel.app/]
- **Repo commit deployed:** [[commit hash](https://github.com/SpillArcher/FlyRankAI_Internship/tree/main/CapStone)]
