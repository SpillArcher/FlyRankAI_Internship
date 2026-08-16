# AI-Assisted Development Log

This app was built in a conversation with Claude (Anthropic), acting as a
development assistant. This document covers what was asked, how the AI
contributed, and what was manually reviewed and changed afterward — per
the assignment requirements.

## Prompts used

In the order they were given:

1. **Assignment brief**, pasted directly from the internship task:
   > Build a similar React application independently using AI as a
   > development assistant. The submission should include: the completed
   > application, the prompts used during development, a short explanation
   > of how AI assisted throughout the implementation, examples of manual
   > improvements/corrections/refactoring performed after reviewing
   > AI-generated code.
   >
   > (Referenced a mentor session recording as the source of what to build.)

2. **Follow-up, describing the target app**, since the mentor video itself
   wasn't accessible to the AI:
   > He built a movie application using the OMDBI API key.

   >Then used the knowlegde from the mentors session and sent the notes that i have written to AI
   > Then asked it to generate me a prompt, which resulted in:

```
Build a movie search web app called "[APP_NAME]" using Vite + React + TypeScript,
consuming the OMDb API (http://www.omdbapi.com/).

TECH & STRUCTURE
- Vite + React + TypeScript, functional components + hooks only.
- Store the OMDb API key in an environment variable (VITE_OMDB_API_KEY), never hard-coded.
- Organize as:
  - src/services/omdbApi.ts — all fetch logic, typed request/response functions
  - src/types/movie.ts — TypeScript interfaces for OMDb search results and full movie details
  - src/hooks/useDebounce.ts — generic debounce hook
  - src/hooks/useFavorites.ts — localStorage-backed favorites/watchlist (get/add/remove/isFavorite)
  - src/components/ — SearchBar, MovieGrid, MovieCard, Tabs, MovieDetailsModal, EmptyState
  - src/data/sampleMovies.ts — a small hardcoded fallback list used if the API/network fails

FEATURES
1. Home tab: show a broad set of movies on load (OMDb has no "trending" endpoint, so
   search a generic term and sort by year descending, OR use the bundled sample data
   as a fallback — don't leave Home blank).
2. Search tab: debounced search input (500ms). Reset pagination to page 1 in the SAME
   state update as the query change (not in a separate effect keyed off the debounced
   value) — doing it in a separate effect fires one extra throwaway API call per new
   search that follows a paginated one.
3. Pagination: OMDb returns 10 results per page and a totalResults count — compute
   totalPages from that and disable Prev/Next at the bounds.
4. Movie details modal: fetch full details by imdbID (?i=) when a card is clicked.
5. Favorites/watchlist tab: persisted in localStorage, toggle from both the grid and
   the details modal, empty state when there are none yet.
6. Every movie card must render the poster image using the OMDb "Poster" field —
   handle the case where OMDb returns the literal string "N/A" instead of omitting
   the field, and show a fallback placeholder image in that case. Use loading="lazy".

STATE & ERROR HANDLING
- Model request state explicitly as 'idle' | 'loading' | 'error' | 'success' — don't
  infer loading/error from data shape.
- Every fetch call must check response.ok explicitly and throw/handle non-2xx before
  parsing JSON; OMDb also returns 200 with { Response: "False", Error: "..." } on
  no-results/bad-key, so check that field too, separately from HTTP status.
- Cancel in-flight requests on unmount/query-change (AbortController or a `cancelled`
  flag) so a slow stale request can't overwrite a newer result.
- Distinct EmptyState messaging for: no query yet, no results for this query,
  network/API error, and empty favorites — don't reuse one generic empty state for all four.

STYLING CONVENTIONS (required, not optional)
- Semantic HTML only: header/main/footer/nav, no div/span where a semantic tag fits.
- CSS: flexbox for one-dimensional layouts, CSS grid for the movie grid (two-dimensional).
- box-sizing: border-box globally.
- Real :hover AND :focus-visible states on every interactive element — never
  outline: none without a replacement focus style.
- Buttons/inputs get :disabled styling and are actually disabled during in-flight
  async calls (search input, favorite toggle, pagination buttons).
- Use ES6+ throughout: destructuring, template literals, arrow functions, async/await.
- Prefer map/filter/reduce over manual loops for list transforms.

DELIVERABLE
- The app must be fully responsive (mobile/tablet/desktop) and keyboard-navigable.
- After generating, list any assumptions you made (e.g. which generic search term
  approximates "latest movies" on Home) so I can review and adjust them.
```
3. **Scope answers**, given through a quick set of clarifying options
   rather than free text:
   - Already have an OMDb API key: **Yes**
   - Features to include: **Search + results grid, Favorites/watchlist
     (saved locally), Movie details view**
   - Project setup: **Vite + React + TypeScript**

From there, the build itself (scaffolding, components, styling, and the
review pass below) was carried out by the AI in the same session, with no
further prompting needed beyond the initial scope. '

## How AI assisted

- **Scaffolding** — generated the project with `npm create vite@latest --
  --template react-ts`, then set up the folder structure
  (`components/`, `hooks/`, `services/`, `types/`).
- **Architecture decisions** — split state into a single source of truth
  in `App.tsx` (query, pagination, active tab, selected movie) with
  presentational components underneath; put all OMDb networking behind one
  `services/omdbApi.ts` module so components never call `fetch` directly.
- **TypeScript types** — modeled OMDb's two response shapes (`s=` search
  results vs. `i=` full details) as separate interfaces, since the search
  endpoint returns far less data than the details endpoint.
- **Visual design** — proposed and built a "movie-theatre" visual identity
  (Spilled gold / curtain-red palette, condensed display type for headers,
  a film-strip perforation detail on poster cards) rather than a generic
  Bootstrap-style layout, and implemented it as CSS custom properties.
- **Accessibility & conventions** — semantic elements (`header`/`main`/
  `footer`/`nav`), `:focus-visible` states, `aria-live` search status,
  `aria-pressed` on favorite toggles, `prefers-reduced-motion` handling,
  and explicit `response.ok` checks on every fetch call.
- **Verification** — ran `tsc --noEmit`, `oxlint`, and a production
  `vite build` after each major change to catch type errors and dead code
  before they reached the codebase.

## Manual improvements after review

Two issues were caught by reviewing the AI-generated code critically
rather than accepting it as-is:

### 1. Duplicate network request when starting a new search after paginating

**Original approach:** page-reset lived in its own `useEffect` keyed on
the debounced query:

```tsx
useEffect(() => {
  setPage(1);
}, [debouncedQuery]);

useEffect(() => {
  // ...fetch using [debouncedQuery, page]
}, [debouncedQuery, page]);
```

**Problem:** if a user was on, say, page 3 of one search and then searched
a new title, the fetch effect ran once with the *stale* `page = 3` (since
both effects react to `debouncedQuery` independently and React doesn't
guarantee the reset lands first), firing a throwaway request for page 3 of
the new query, before the reset effect fired and triggered a second,
correct fetch for page 1. Easy to miss in a quick read-through, but
visible once you trace the render order.

**Fix:** reset the page in the same event handler that updates the query,
so there's exactly one state update per keystroke instead of a
cross-effect chain:

```tsx
const handleQueryChange = (value: string) => {
  setQuery(value);
  setPage(1);
};
```

### 2. Favorites stored more data than needed, and could go stale

**Original approach:** `toggleFavorite` accepted whatever object it was
given — either the lightweight search result from the grid, or the full
`MovieDetails` object (plot, cast, ratings, etc.) from the modal — and
stored it as-is.

**Problem:** favoriting from the details modal saved the entire plot,
cast list, and rating into `localStorage`. That's unnecessary storage for
data the app never reads back (the grid and watchlist only ever show
title/year/type/poster), and if that information changed on OMDb later,
the saved favorite would keep displaying the outdated copy indefinitely.

**Fix:** destructure down to the fields the app actually persists,
regardless of which shape was passed in:

```tsx
const { imdbID, Title, Year, Type, Poster } = movie;
const trimmed: MovieSearchResult = { imdbID, Title, Year, Type, Poster };
```

## Before submitting

- Copy `.env.example` to `.env.local` and add a real OMDb key, then
  confirm search, favoriting, and the details modal all work end to end.
- Try an empty/garbage search term to confirm the empty and error states
  render as expected.
- Resize the browser (or use dev tools' device toolbar) to check the grid
  and modal at a small mobile width.
