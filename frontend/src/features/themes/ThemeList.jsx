import ThemeCard from './ThemeCard';

export default function ThemeList({ themes, onEdit, onDelete }) {
  if (themes.length === 0) {
    return <p className="empty-state">No themes yet. Create a monthly theme to group activities.</p>;
  }
  return (
    <div className="theme-grid">
      {themes.map((t) => (
        <ThemeCard key={t.id} theme={t} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}