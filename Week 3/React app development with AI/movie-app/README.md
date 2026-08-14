# Spilled - Movie Search

A small React + TypeScript app for searching the OMDb movie catalog and
saving titles to a personal watchlist. Built as a capstone-track exercise:
"build a similar app to the one demoed in the OMDb mentor session,"
using AI as a development assistant throughout.

## Features

- **Search** - debounced, live search against the OMDb API with loading,
  error, and empty-result states.
- **Movie details** - click any poster to open a modal with plot, genre,
  director, cast, and IMDb rating (fetched on demand, since the search
  endpoint only returns lightweight results).
- **Watchlist** - add/remove favorites from either the grid or the details
  modal; persisted to `localStorage` so it survives a refresh.
- **Pagination** - steps through OMDb's paginated search results.
- Responsive layout, keyboard-focus styles, and `prefers-reduced-motion`
  support.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add your OMDb API key. Copy `.env.example` to `.env.local` and fill it
   in (get a free key at https://www.omdbapi.com/apikey.aspx):

   ```bash
   cp .env.example .env.local
   ```

   ```
   VITE_OMDB_API_KEY=your_key_here
   ```

3. Run the dev server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

## Project structure

```
src/
  components/     UI components (SearchBar, MovieCard, MovieGrid, Tabs,
                   MovieDetailsModal, EmptyState) — each with its own CSS
  hooks/          useDebounce, useFavorites
  services/       omdbApi.ts — the only file that talks to the network
  types/          shared TypeScript types for OMDb's search/details shapes
  App.tsx         page state: query, pagination, active tab, selected movie
```

See `AI_ASSISTANCE.md` for the development log: the prompts used, what AI
contributed at each stage, and the manual fixes made after reviewing its
output.
