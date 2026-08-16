import type { MovieSearchResult } from '../types/movie';
import './MovieCard.css';

interface MovieCardProps {
  movie: MovieSearchResult;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onSelect: () => void;
}

const FALLBACK_POSTER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="445"%3E%3Crect width="100%25" height="100%25" fill="%23241513"/%3E%3C/svg%3E';

export function MovieCard({ movie, isFavorite, onToggleFavorite, onSelect }: MovieCardProps) {
  const posterSrc = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : FALLBACK_POSTER;

  return (
    <article className="movie-card">
      <button type="button" className="movie-card__poster-button" onClick={onSelect}>
        <span className="movie-card__sprockets" aria-hidden="true" />
        <img
          className="movie-card__poster"
          src={posterSrc}
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (img.src !== FALLBACK_POSTER) img.src = FALLBACK_POSTER;
          }}
          alt={`${movie.Title} poster`}
          loading="lazy"
        />
      </button>
      <button
        type="button"
        className={`movie-card__favorite${isFavorite ? ' movie-card__favorite--active' : ''}`}
        onClick={onToggleFavorite}
        aria-pressed={isFavorite}
        aria-label={
          isFavorite ? `Remove ${movie.Title} from watchlist` : `Add ${movie.Title} to watchlist`
        }
      >
        ★
      </button>
      <div className="movie-card__body">
        <h3 className="movie-card__title">{movie.Title}</h3>
        <p className="movie-card__meta">
          <span className="movie-card__year">{movie.Year}</span>
          <span className="movie-card__type">{movie.Type}</span>
        </p>
      </div>
    </article>
  );
}
