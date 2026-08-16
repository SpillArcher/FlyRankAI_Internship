import type {
  MovieDetails,
  OmdbDetailsResponse,
  OmdbSearchResponse,
} from '../types/movie';

const BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY as string | undefined;

export class OmdbApiError extends Error {}

function assertApiKey(): void {
  if (!API_KEY) {
    throw new OmdbApiError(
      'Missing OMDb API key. Add VITE_OMDB_API_KEY to a .env.local file and restart the dev server.'
    );
  }
}

/**
 * Searches OMDb by title. Returns a page of lightweight results
 * (10 per page — pagination is handled by OMDb itself via `page`).
 */
export async function searchMovies(
  query: string,
  page = 1
): Promise<OmdbSearchResponse> {
  assertApiKey();

  const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new OmdbApiError(`OMDb request failed with status ${response.status}.`);
  }

  const data: OmdbSearchResponse = await response.json();

  if (data.Response === 'False') {
    throw new OmdbApiError(data.Error ?? 'No results found.');
  }

  return data;
}

/** Fetches full details (plot, cast, ratings, ...) for a single title by imdbID. */
export async function getMovieDetails(imdbID: string): Promise<MovieDetails> {
  assertApiKey();

  const url = `${BASE_URL}?apikey=${API_KEY}&i=${encodeURIComponent(imdbID)}&plot=full`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new OmdbApiError(`OMDb request failed with status ${response.status}.`);
  }

  const data: OmdbDetailsResponse = await response.json();

  if (data.Response === 'False') {
    throw new OmdbApiError(data.Error ?? 'Movie details not found.');
  }

  return data;
}
