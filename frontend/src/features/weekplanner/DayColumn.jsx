import { useTranslation } from 'react-i18next';
import ActivityInstanceCard from './ActivityInstanceCard';
import { WEEKDAYS } from '../../utils/constants';
import { formatDate, isSameDay } from '../../utils/dateHelpers';

export default function DayColumn({ date, dayIndex, instances, onOpenInstance, onAdd }) {
  const { t } = useTranslation();
  const isToday = isSameDay(date, new Date());
  const dayInstances = instances.filter((i) => i.day_of_week === dayIndex);
  return (
    <div className={`day-column ${isToday ? 'is-today' : ''}`}>
      <div className="day-header">
        <div className="day-header-meta">
          <span className="day-name">{t(`domain.weekday.${WEEKDAYS[dayIndex]}`)}</span>
          <span className="day-date">{formatDate(date)}</span>
        </div>
        <button type="button" className="btn-icon block-add" onClick={() => onAdd(date)} aria-label={t('week.addActivity')}>
          +
        </button>
      </div>
      <div className="day-blocks">
        {dayInstances.length === 0 && <p className="block-empty">{t('week.noActivity')}</p>}
        {dayInstances.map((inst) => (
          <ActivityInstanceCard key={inst.id} instance={inst} onOpen={onOpenInstance} />
        ))}
      </div>
    </div>
  );
}
