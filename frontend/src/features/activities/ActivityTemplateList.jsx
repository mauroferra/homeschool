import { useTranslation } from 'react-i18next';
import ActivityTemplateCard from './ActivityTemplateCard';

export default function ActivityTemplateList({ activities, onEdit, onDelete }) {
  const { t } = useTranslation();
  if (activities.length === 0) {
    return <p className="empty-state">{t('templateList.empty')}</p>;
  }
  return (
    <div className="template-grid">
      {activities.map((a) => (
        <ActivityTemplateCard key={a.id} activity={a} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}