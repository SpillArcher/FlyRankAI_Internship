import type { ChangeEvent } from 'react';
import './SearchBar.css';

type Status = 'idle' | 'loading' | 'error' | 'success';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  status: Status;
}

export function SearchBar({ value, onChange, status }: SearchBarProps) {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="search-bar">
      <label className="search-bar__eyebrow" htmlFor="movie-search">
        OMDb catalog search
      </label>
      <div className="search-bar__window">
        <svg
          className="search-bar__icon"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
          <line
            x1="16.5"
            y1="16.5"
            x2="21"
            y2="21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <input
          id="movie-search"
          type="search"
          className="search-bar__input"
          placeholder="Search for a movie title…"
          value={value}
          onChange={handleChange}
          autoComplete="off"
        />
        <span className="search-bar__status" role="status" aria-live="polite">
          {status === 'loading' ? 'Searching…' : ''}
        </span>
      </div>
    </div>
  );
}
