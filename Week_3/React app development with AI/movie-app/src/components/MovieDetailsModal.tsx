import { useEffect, useState } from 'react';
import { getMovieDetails } from '../services/omdbApi';
import type { MovieDetails } from '../types/movie';
import './MovieDetailsModal.css';

interface MovieDetailsModalProps {
  imdbID: string;
  isFavorite: boolean;
  onToggleFavorite: (movie: MovieDetails) => void;
  onClose: () => void;
}

type Status = 'loading' | 'error' | 'success';

export function MovieDetailsModal({
  imdbID,
  isFavorite,
  onToggleFavorite,
  onClose,
}: MovieDetailsModalProps) {
  const [status, setStatus] = useState<Status>('loading');
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    getMovieDetails(imdbID)
      .then((data) => {
        if (cancelled) return;
        setMovie(data);
        setStatus('success');
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setErrorMessage(error.message);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [imdbID]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={movie ? `${movie.Title} details` : 'Movie details'}
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal__close" onClick={onClose} aria-label="Close details">
          ✕
        </button>

        {status === 'loading' && <p className="modal__status">Loading details…</p>}
        {status === 'error' && (
          <p className="modal__status modal__status--error">{errorMessage}</p>
        )}

        {status === 'success' && movie && (
          <div className="modal__content">
            {movie.Poster !== 'N/A' && (
              <img className="modal__poster" src={movie.Poster} alt={`${movie.Title} poster`} />
            )}
            <div className="modal__details">
              <h2 className="modal__title">{movie.Title}</h2>
              <p className="modal__meta">
                <span>{movie.Year}</span>
                <span>{movie.Runtime}</span>
                <span>{movie.Rated}</span>
              </p>

              {movie.imdbRating && movie.imdbRating !== 'N/A' && (
                <p className="modal__rating">
                  <span className="modal__rating-badge">★ {movie.imdbRating}</span>
                  <span className="modal__rating-votes">{movie.imdbVotes} votes</span>
                </p>
              )}

              <p className="modal__plot">{movie.Plot}</p>

              <dl className="modal__facts">
                <div>
                  <dt>Genre</dt>
                  <dd>{movie.Genre}</dd>
                </div>
                <div>
                  <dt>Director</dt>
                  <dd>{movie.Director}</dd>
                </div>
                <div>
                  <dt>Cast</dt>
                  <dd>{movie.Actors}</dd>
                </div>
              </dl>

              <button
                type="button"
                className={`modal__favorite${isFavorite ? ' modal__favorite--active' : ''}`}
                onClick={() => onToggleFavorite(movie)}
                aria-pressed={isFavorite}
              >
                {isFavorite ? '★ On your watchlist' : '☆ Add to watchlist'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
