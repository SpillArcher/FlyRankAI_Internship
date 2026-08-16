import { useEffect, useMemo, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { MovieGrid } from './components/MovieGrid';
import { Tabs, type TabKey } from './components/Tabs';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { EmptyState } from './components/EmptyState';
import { useDebounce } from './hooks/useDebounce';
import { useFavorites } from './hooks/useFavorites';
import { searchMovies } from './services/omdbApi';
import type { MovieSearchResult } from './types/movie';
import './App.css';

type Status = 'idle' | 'loading' | 'error' | 'success';
const RESULTS_PER_PAGE = 10;

function App() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query.trim(), 500);

  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [activeTab, setActiveTab] = useState<TabKey>('search');
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);

  const { favorites, isFavorite, toggleFavorite } = useFavorites();


  // Reset to page 1 as soon as the user edits the query, in the same
  // update as setQuery — not in a separate effect keyed off the debounced
  // value. That earlier version fired an effect that set page back to 1
  // *after* the search effect had already re-run once with the stale page
  // number, firing an extra, throwaway OMDb request on every new search
  // that followed a paginated one.
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setTotalResults(0);
      setStatus('idle');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setErrorMessage('');

    searchMovies(debouncedQuery, page)
      .then((data) => {
        if (cancelled) return;
        setResults(data.Search ?? []);
        setTotalResults(Number(data.totalResults ?? 0));
        setStatus('success');
      })
      .catch((error: Error) => {
        if (cancelled) return;
        setResults([]);
        setTotalResults(0);
        setErrorMessage(error.message);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, page]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalResults / RESULTS_PER_PAGE)),
    [totalResults]
  );

  const moviesToShow = activeTab === 'favorites' ? favorites : results;

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <h1 className="site-title">
            Spilled<span className="site-title__accent">.</span>
          </h1>
          <p className="site-tagline">A space for the latest films — search &amp; save</p>
        </div>
      </header>

      <main className="main">
        <SearchBar value={query} onChange={handleQueryChange} status={status} />

        <Tabs active={activeTab} onChange={setActiveTab} favoritesCount={favorites.length} />

        {activeTab === 'search' && status === 'idle' && (
          <EmptyState
            title="Start your search"
            message="Type a movie title above to browse the OMDb catalog."
          />
        )}

        {activeTab === 'search' && status === 'error' && (
          <EmptyState title="Something went wrong" message={errorMessage} tone="error" />
        )}


        {activeTab === 'search' && status === 'success' && results.length === 0 && (
          <EmptyState
            title="No screenings found"
            message={`No results for "${debouncedQuery}". Try another title.`}
          />
        )}

        {activeTab === 'favorites' && favorites.length === 0 && (
          <EmptyState
            title="Your watchlist is empty"
            message="Add movies to your watchlist while you search."
          />
        )}

        {moviesToShow.length > 0 && (
          <MovieGrid
            movies={moviesToShow}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            onSelect={setSelectedMovieId}
          />
        )}

        {activeTab === 'search' && status === 'success' && totalPages > 1 && (
          <nav className="pagination" aria-label="Search results pages">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="pagination__status">
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </nav>
        )}
      </main>

      <footer className="site-footer">
        <p>Movie data provided by the OMDb API.</p>
      </footer>

      {selectedMovieId && (
        <MovieDetailsModal
          imdbID={selectedMovieId}
          isFavorite={isFavorite(selectedMovieId)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
    </>
  );
}

export default App;
