// Shape returned by OMDb's search endpoint (s=...) — one entry per result.
export interface MovieSearchResult {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string; // "movie" | "series" | "episode"
  Poster: string; // image URL, or the literal string "N/A"
}

// Shape returned by OMDb's lookup endpoint (i=...) — full details for one title.
export interface MovieDetails extends MovieSearchResult {
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  imdbRating: string;
  imdbVotes: string;
}

export interface OmdbSearchResponse {
  Search?: MovieSearchResult[];
  totalResults?: string;
  Response: 'True' | 'False';
  Error?: string;
}

export type OmdbDetailsResponse =
  | (MovieDetails & { Response: 'True' })
  | { Response: 'False'; Error: string };
