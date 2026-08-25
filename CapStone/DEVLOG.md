# Development Log - Stylist

A record of how this project actually got built: the steps, the pivots, the improvements, and - the most useful part for anyone reading this - the real errors I hit and exactly how I fixed each one. Built with Claude assisting throughout (Next.js/React code, debugging, and architecture decisions), with me directing scope, testing everything against the real APIs, and making the final calls on trade-offs.

## Where it started

The original plan for this capstone was a different project entirely - an SEO/AEO tool for a fictional platform, with an AI-powered content grader as the first AI integration attempt. Partway through, I proposed a much more ambitious idea instead: an AI stylist that reads a person's mood, colors, and the occasion, and recommends real clothing based on that context instead of forcing rigid category filters.

Before building it, I got honest pushback on the architecture I'd first imagined (a full vector-database/RAG pipeline with on-device inference). The counter-argument: with a catalog this small, a vector database solves a scale problem I didn't have, and on-device inference is a serious project on its own with no real benefit for a demo. I agreed and went with a much simpler design - send the relevant catalog directly to the LLM in the prompt and let it reason over it. Same core idea, dramatically less infrastructure.

I decided to replace the original project entirely rather than bolt the stylist onto it, since the two ideas didn't share a brand or a purpose.

## Steps I took, roughly in order

1. **Scaffolded fresh** - Next.js 16 (App Router), TypeScript, Tailwind v4, ESLint. Verified lint and a production build passed before writing any feature code.
2. **Built the AI stylist as a single page** - a quiz (interests, favorite color, favorite/current season, mood or occasion) and a server route that sends that context plus the product catalog to an LLM, asking for a small set of picks with reasoning.
3. **Picked Claude API first**, then switched to Gemini once I had a working Gemini key to test with instead. Moved to Gemini's schema-constrained JSON output (`responseSchema`) rather than prompt-only JSON - the model is forced into the exact shape instead of just asked nicely.
4. **Sourced the catalog from a public demo API** (Platzi's `escuelajs` fake store) - this turned out to be the single biggest source of bugs, covered below.
5. **Deployed to Vercel**, connected to GitHub for automatic preview deployments on every push.
6. **Expanded from a single page into a full site** - Men's/Women's browse pages, product detail pages with related items, a cart, and a wishlist, once the core AI feature was solid.
7. **Added a visual and motion pass** - loading states, a reset flow, a bolder color system, page transitions, scroll reveals, and a branded About page.
8. **Wrote the test suite** - Vitest + React Testing Library, covering the cart and wishlist logic and the stylist's success/error paths.

## Improvements I made along the way

- **Anti-hallucination lookup**: the AI is only ever trusted for *which* product id to recommend and *why* - never for price, image, or title. Every pick gets looked up against the real catalog data server-side, and any id the model might invent gets silently dropped instead of breaking the response.
- **Cart and wishlist persistence**: rebuilt from a naive `useEffect` + `setState` pattern (which either flickers on load or trips a React lint rule) into a proper external store using `useSyncExternalStore` - the React-native way to sync with `localStorage` without hydration mismatches.
- **Image resilience**: swapped a strict image-host allowlist for an `unoptimized`, host-agnostic rendering approach plus a branded fallback graphic, after discovering the data source's image hosting was unpredictable (see below).
- **Retry logic on the AI call**: a transient "model overloaded" response gets one silent retry before the person using the app ever sees an error.
- **Accessibility touches built in as I went**: `aria-pressed` on toggle chips, `aria-live` status announcements for the loading/success states, visible focus rings site-wide, and semantic form labeling throughout - not a separate pass, but part of building each component.

## Errors I ran into, and how I solved them

**Vercel "Root Directory does not exist."** The path I'd set (`Week 3/flyrankai-capstone`, from the earlier project) actually existed in the repo - the problem was the Root Directory field literally contained `%20` instead of a real space character, from copy-pasting a URL-encoded path. Fixed by retyping it by hand.

**Vercel domain returning a bare `404: NOT_FOUND`.** A build showed "Ready," but the production domain served nothing. Root cause: the "Ready" deployment was tagged Preview, not Production - the clean project domain only resolves once something actually deploys to Production. Recreating the project (and, separately, moving the app out of a nested monorepo folder into its own repo) resolved it.

**Missing `.gitignore` in a fresh repo.** After creating a new repo without one, `node_modules` and any future `.env.local` would have been committed by default. Added a proper `.gitignore` and ran `git rm -r --cached .` to untrack anything that shouldn't have been there.

**Gemini quota errors (`429`, then `503`, then `404`).** In order: hit a 20-requests/day cap on `gemini-3.7-flash` (via the `flash-latest` alias) → switched to the Flash-Lite tier for a separate, more generous quota bucket → hit intermittent "model overloaded" `503`s → pinned to a specific stable version (`gemini-2.5-flash-lite`) to avoid whatever newest preview model the `-latest` alias currently pointed to → that exact model turned out to have been fully retired, returning a `404` with Google's own error message naming the correct replacement (`gemini-3.5-flash-lite`) → pinned to that instead, and added one automatic retry specifically for `503`s so a transient overload doesn't surface as a visible error.

**`Invalid src prop ... hostname not configured` / SVG-type crash.** `next/image` refused to render one of the catalog's image URLs - first because the host wasn't in the allowed `remotePatterns`, then because that host served an SVG and Next.js blocks SVG optimization by default (a real security default, not a bug). Rather than opening that up, the images turned out to be a symptom of a bigger issue below.

**"The catalog is empty right now."** After the AI stylist worked initially, this Platzi-sourced version of the catalog eventually returned zero usable products. Diagnosis via added logging showed the actual chain: the API only paginated the first 100 products (not filtered by category), and at that moment in time every single Clothes/Shoes item happened to have a placeholder image with no real photo. This exposed the real problem - Platzi's API is a shared, public, write-open sandbox that anyone can post test data into, and its contents (both size and image quality) shift unpredictably over time.

**The actual fix wasn't a patch - it was switching data sources.** Migrated the whole catalog from Platzi to `fakestoreapi.com`, whose write endpoints don't actually persist data, so its 20-product catalog stays fixed and clean. This single change eliminated an entire category of bugs (image-host guessing, junk test-data filtering, catalog size volatility) rather than continuing to patch around them.

**React error: "The result of getServerSnapshot should be cached to avoid an infinite loop."** The server-side snapshot function for the cart store returned a brand-new empty array (`[]`) on every call. React compares consecutive results by reference, so a fresh array every time looks like "changed every render" and loops forever. Fixed by returning one shared constant reference instead.

**ESLint `react-hooks/set-state-in-effect`.** The original cart-persistence code loaded from `localStorage` inside a `useEffect` and called `setState` with the result - a legitimate lint catch, not a false positive, since that pattern can cause a visible flicker and cascading renders. Rebuilt around `useSyncExternalStore`, React's actual mechanism for this exact case.

**TypeScript build error inside the Gemini retry logic.** A nested helper function closed over `apiKey` after it had already been null-checked, but TypeScript couldn't carry that narrowing into the closure. Fixed by passing `apiKey` in as an explicit parameter instead of relying on the outer scope.

**Invalid HTML caught before it shipped.** Adding a staggered entrance animation to the product grid wrapped each card in a `<motion.div>` inside a `<ul>`, which puts an invalid element between `<ul>` and `<li>`. Caught and fixed by using `<motion.li>` directly instead, before it ever reached a browser.

## Known limitations

- The catalog is genuinely small (20 products total, fixed by the data source) - real variety in recommendations is limited by that ceiling.
- Checkout is an intentional mock - clearly labeled as a demo, no real payment processing.
- No automated accessibility audit has been run yet (planned next).

## What I'd do differently

Pin AI model names to a specific, stable version from the start rather than an auto-updating `-latest` alias - three of the errors above trace back to chasing a moving target instead of a fixed one. And I'd pick the data source's stability as a first-class requirement before writing any code against it, not after debugging around its volatility for several rounds.
