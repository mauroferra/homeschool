import { useTranslation } from 'react-i18next';
import Icon from '../../components/ui/Icon';
import { useLocalized } from '../../utils/localize';

const statusClassFrom = (status = '') => `status-dot status-${status.toLowerCase().replace(/\s+/g, '-')}`;

export default function ActivityInstanceCard({ instance, onOpen }) {
  const { t } = useTranslation();
  const L = useLocalized();
  const { activity, status } = instance;
  return (
    <button type="button" className="instance-card" onClick={() => onOpen(instance)}>
      <div className="instance-main">
        <span className="instance-title">{L(activity, 'title')}</span>
        {instance.home_tag !== 'Home A' && (
          <span className="home-chip">{instance.home_tag === 'Both' ? 'A+B' : 'B'}</span>
        )}
      </div>
      <div className="instance-meta">
        <span className={statusClassFrom(status)} title={t(`domain.status.${status}`)} />
        <span className="instance-status">{t(`domain.status.${status}`)}</span>
        {instance.reflection_text && <Icon name="edit" size={14} className="instance-reflect-icon" />}
        <span className="instance-cat">{t(`domain.category.${activity.category}`)}</span>
      </div>
    </button>
  );
}
