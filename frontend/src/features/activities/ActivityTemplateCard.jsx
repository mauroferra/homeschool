import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card';
import Icon from '../../components/ui/Icon';
import { formatDuration } from '../../utils/formattingHelpers';
import { useLocalized } from '../../utils/localize';

export default function ActivityTemplateCard({ activity, onEdit, onDelete }) {
  const { t } = useTranslation();
  const L = useLocalized();
  const title = L(activity, 'title');
  const description = L(activity, 'description');
  return (
    <Card className="activity-card">
      <div className="activity-card-body">
        <div className="activity-card-head">
          <span className="pill pill-cat">{t(`domain.category.${activity.category}`)}</span>
          {activity.theme_name && <span className="pill pill-theme">{activity.theme_name}</span>}
        </div>
        <h3 className="activity-card-title">{title}</h3>
        {description && <p className="activity-card-desc">{description}</p>}
        <div className="activity-card-meta">
          {activity.estimated_duration && (
            <span className="meta-item"><Icon name="clock" size={16} /> {formatDuration(activity.estimated_duration)}</span>
          )}
          {activity.links?.length > 0 && <span className="meta-item"><Icon name="link" size={16} /> {t('templateCard.linksCount', { count: activity.links.length })}</span>}
        </div>
      </div>
      <div className="activity-card-actions">
        <button type="button" className="btn-icon" onClick={() => onEdit(activity)} aria-label={t('templateCard.edit', { title })}>
          <Icon name="edit" size={18} />
        </button>
        <button type="button" className="btn-icon btn-danger" onClick={() => onDelete(activity)} aria-label={t('templateCard.delete', { title })}>
          <Icon name="trash" size={18} />
        </button>
      </div>
    </Card>
  );
}
