import { useTranslation } from 'react-i18next';
import ThemeCard from './ThemeCard';

export default function ThemeList({ themes, onEdit, onDelete }) {
  const { t } = useTranslation();
  if (themes.length === 0) {
    return <p className="empty-state">{t('themeList.empty')}</p>;
  }
  return (
    <div className="theme-grid">
      {themes.map((t) => (
        <ThemeCard key={t.id} theme={t} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}