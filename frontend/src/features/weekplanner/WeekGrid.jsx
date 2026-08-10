import { useTranslation } from 'react-i18next';
import { WEEKDAYS } from '../../utils/constants';
import { dayOffset, formatDate, isSameDay } from '../../utils/dateHelpers';
import { useLocalized } from '../../utils/localize';

export default function WeekGrid({ startDate, instances, onOpenInstance, onAdd, onOpenDay }) {
  const { t } = useTranslation();
  const L = useLocalized();
  const openDayHandler = (e, date) => {
    if (!onOpenDay || e.target.closest('button')) return;
    onOpenDay(date);
  };
  return (
    <div className="week-grid">
      {Array.from({ length: 7 }).map((_, i) => {
        const date = dayOffset(startDate, i);
        const isToday = isSameDay(date, new Date());
        const dayInstances = instances.filter((inst) => inst.day_of_week === i);
        return (
          <div
            key={i}
            className={`grid-col ${isToday ? 'is-today' : ''} ${onOpenDay ? 'day-nav' : ''}`}
            onClick={(e) => openDayHandler(e, date)}
          >
            <div className="day-header">
              {onOpenDay ? (
                <button type="button" className="day-nav-btn" onClick={() => onOpenDay(date)}>
                  <span className="day-name">{t(`domain.weekday.${WEEKDAYS[i]}`)}</span>
                  <span className="day-date">{formatDate(date)}</span>
                </button>
              ) : (
                <div className="day-header-meta">
                  <span className="day-name">{t(`domain.weekday.${WEEKDAYS[i]}`)}</span>
                  <span className="day-date">{formatDate(date)}</span>
                </div>
              )}
              <button type="button" className="btn-icon block-add" onClick={() => onAdd(date)} aria-label={t('week.addActivity')}>
                +
              </button>
            </div>
            <div className="grid-blocks">
              {dayInstances.length === 0 && <p className="block-empty">{t('week.noActivity')}</p>}
              {dayInstances.map((inst) => (
                <button key={inst.id} type="button" className={`instance-chip ${inst.is_external ? 'chip-external' : `chip-type-${kebab(inst.block_type)}`}`} onClick={() => onOpenInstance(inst)}>
                  {!inst.is_external && <span className={`status-dot status-${inst.status.toLowerCase().replace(/\s+/g, '-')}`} />}
                  {L(inst.activity, 'title')}
                  <span className="instance-type">{t(`domain.blockShort.${inst.block_type}`)}</span>
                  {inst.home_tag !== 'Home A' && <span className="home-chip">{inst.home_tag === 'Both' ? 'A+B' : 'B'}</span>}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function kebab(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
