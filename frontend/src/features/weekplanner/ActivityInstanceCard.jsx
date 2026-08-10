import { useTranslation } from 'react-i18next';
import Icon from '../../components/ui/Icon';
import { useLocalized } from '../../utils/localize';
import { formatTimeRange } from '../../utils/formattingHelpers';

const statusClassFrom = (status = '') => `status-dot status-${status.toLowerCase().replace(/\s+/g, '-')}`;

export default function ActivityInstanceCard({ instance, onOpen }) {
  const { t } = useTranslation();
  const L = useLocalized();
  const { activity, status } = instance;
  const isExternal = instance.is_external === true;
const typeClass = isExternal ? '' : `inst-type-${kebab(instance.block_type)}`;
  const time = formatTimeRange(activity?.start_time, activity?.end_time);
  return (
    <button type="button" className={`instance-card ${typeClass} ${isExternal ? 'instance-external' : ''}`} onClick={() => onOpen(instance)}>
      <div className="instance-main">
        <span className="instance-type">{t(`domain.block.${instance.block_type}`)}</span>
        <span className="instance-title">{L(activity, 'title')}</span>
{time && <span className="instance-time">{time}</span>}
      </div>
      <div className="instance-meta">
        {isExternal ? (
          <span className="external-badge">{t('week.external')}</span>
        ) : (
          <>
            <span className={statusClassFrom(status)} title={t(`domain.status.${status}`)} />
            <span className="instance-status">{t(`domain.status.${status}`)}</span>
            {instance.reflection_text && <Icon name="edit" size={14} className="instance-reflect-icon" />}
            <span className="instance-cat">{t(`domain.category.${activity.category}`)}</span>
          </>
        )}
      </div>
    </button>
  );
}

function kebab(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
