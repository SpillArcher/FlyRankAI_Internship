import './EmptyState.css';

interface EmptyStateProps {
  title: string;
  message: string;
  tone?: 'default' | 'error';
}

export function EmptyState({ title, message, tone = 'default' }: EmptyStateProps) {
  return (
    <div className={`empty-state${tone === 'error' ? ' empty-state--error' : ''}`}>
      <h2 className="empty-state__title">{title}</h2>
      <p className="empty-state__message">{message}</p>
    </div>
  );
}
