import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card';
import { formatDate } from '../../utils/dateHelpers';
import { useLocalized } from '../../utils/localize';

export default function ReflectionList({ reflections = [] }) {
  const { t } = useTranslation();
  const L = useLocalized();
  if (!reflections.length) {
    return <p className="empty-state">{t('reflectionList.empty')}</p>;
  }
  return (
    <div className="reflection-list">
      {reflections.map((r) => (
        <Card key={`${r.type}-${r.week_id}-${r.instance_id || r.text}`} className="reflection-card">
          {r.type === 'weekly' ? (
            <span className="pill pill-weekly">{t('reflectionList.weekly')}</span>
          ) : (
            <span className="pill pill-activity">{t('reflectionList.activity')}</span>
          )}
          <div className="reflection-meta">
            <span className="reflection-date">{t('reflectionList.weekOf', { date: formatDate(r.start_date) })}</span>
            {r.title && <span className="reflection-title"> · {L(r, 'title')}</span>}
          </div>
          <p className="reflection-text">“{r.text}”</p>
        </Card>
      ))}
    </div>
  );
}