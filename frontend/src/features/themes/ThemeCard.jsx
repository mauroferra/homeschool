import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card';
import Icon from '../../components/ui/Icon';
import { formatDate } from '../../utils/dateHelpers';

export default function ThemeCard({ theme, onEdit, onDelete }) {
  const { t } = useTranslation();
  const active = theme.start_date && theme.end_date && new Date() >= new Date(theme.start_date) && new Date() <= new Date(theme.end_date);
  return (
    <Card className="theme-card">
      <div className="theme-card-body">
        <div className="theme-card-head">
          <h3 className="theme-card-title">{theme.name}</h3>
          {active && <span className="pill pill-active">{t('themeCard.current')}</span>}
          <span className={`pill ${active ? '' : 'pill-muted'}`}>
            {formatDate(theme.start_date ?? new Date(theme.start_date))} – {formatDate(theme.end_date ?? new Date())}
          </span>
        </div>
        {theme.description && <p className="theme-card-desc">{theme.description}</p>}
      </div>
      <div className="theme-card-actions">
        <button type="button" className="btn-icon" onClick={() => onEdit(theme)} aria-label={t('themeCard.edit', { name: theme.name })}>
          <Icon name="edit" size={18} />
        </button>
        <button type="button" className="btn-icon btn-danger" onClick={() => onDelete(theme)} aria-label={t('themeCard.delete', { name: theme.name })}>
          <Icon name="trash" size={18} />
        </button>
      </div>
    </Card>
  );
}
