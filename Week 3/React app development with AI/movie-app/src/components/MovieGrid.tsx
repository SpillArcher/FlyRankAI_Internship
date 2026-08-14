import { MovieCard } from './MovieCard';
import type { MovieSearchResult } from '../types/movie';
import './MovieGrid.css';

interface MovieGridProps {
  movies: MovieSearchResult[];
  isFavorite: (imdbID: string) => boolean;
  onToggleFavorite: (movie: MovieSearchResult) => void;
  onSelect: (imdbID: string) => void;
}

export function MovieGrid({ movies, isFavorite, onToggleFavorite, onSelect }: MovieGridProps) {
  return (
    <ul className="movie-grid">
      {movies.map((movie) => (
        <li key={movie.imdbID}>
          <MovieCard
            movie={movie}
            isFavorite={isFavorite(movie.imdbID)}
            onToggleFavorite={() => onToggleFavorite(movie)}
            onSelect={() => onSelect(movie.imdbID)}
          />
        </li>
      ))}
    </ul>
  );
}
