import './Tabs.css';

export type TabKey = 'search' | 'favorites';

interface TabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  favoritesCount: number;
}

export function Tabs({ active, onChange, favoritesCount }: TabsProps) {
  return (
    <nav className="tabs" aria-label="Movie views">
      <button
        type="button"
        className={`tabs__item${active === 'search' ? ' tabs__item--active' : ''}`}
        onClick={() => onChange('search')}
        aria-current={active === 'search' ? 'page' : undefined}
      >
        Search results
      </button>
      <button
        type="button"
        className={`tabs__item${active === 'favorites' ? ' tabs__item--active' : ''}`}
        onClick={() => onChange('favorites')}
        aria-current={active === 'favorites' ? 'page' : undefined}
      >
        My watchlist{favoritesCount > 0 ? ` (${favoritesCount})` : ''}
      </button>
    </nav>
  );
}
