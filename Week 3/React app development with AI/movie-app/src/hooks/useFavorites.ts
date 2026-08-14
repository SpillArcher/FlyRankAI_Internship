import { useCallback, useEffect, useState } from 'react';
import type { MovieSearchResult } from '../types/movie';

const STORAGE_KEY = 'spilled:favorites';

function loadFavorites(): MovieSearchResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MovieSearchResult[]) : [];
  } catch {
    // Corrupt or inaccessible storage shouldn't crash the app.
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<MovieSearchResult[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (imdbID: string) => favorites.some((movie) => movie.imdbID === imdbID),
    [favorites]
  );

  const toggleFavorite = useCallback((movie: MovieSearchResult) => {
    // The modal passes a full MovieDetails object (plot, cast, ratings, ...).
    // Only keep the card-level fields here — storing the rest would bloat
    // localStorage for no benefit, and if a title's OMDb data ever changes,
    // a saved favorite would keep showing the stale plot/rating forever
    // instead of the fresh copy fetched when it's reopened.
    const { imdbID, Title, Year, Type, Poster } = movie;
    const trimmed: MovieSearchResult = { imdbID, Title, Year, Type, Poster };

    setFavorites((current) =>
      current.some((m) => m.imdbID === trimmed.imdbID)
        ? current.filter((m) => m.imdbID !== trimmed.imdbID)
        : [...current, trimmed]
    );
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
