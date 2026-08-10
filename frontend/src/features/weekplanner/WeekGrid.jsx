import { useTranslation } from 'react-i18next';
import { WEEKDAYS } from '../../utils/constants';
import { dayOffset, formatDate, isSameDay, sortInstancesByTime } from '../../utils/dateHelpers';
import { useLocalized } from '../../utils/localize';

const BLOCK_TYPES = [
  'Italian Micro-Immersion',
  'Czech School Alignment',
  'Italian Cultural Activity',
  'Bonding Ritual',
  'External Activity',
];

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
                <>
                  <span className="day-name">{t(`domain.weekday.${WEEKDAYS[i]}`)}</span>
                  <span className="day-date">{formatDate(date)}</span>
                </>
              )}
            </div>
            <div className="grid-blocks">
              {BLOCK_TYPES.map((block) => (
                <div key={block} className={`grid-block block-${kebab(block)}`}>
                  <div className="block-header">
                    <span className="block-title">{t(`domain.blockShort.${block}`)}</span>
                    <button type="button" className="btn-icon block-add" onClick={() => onAdd(block, date)} aria-label={t('week.addTo', { block: t(`domain.blockShort.${block}`) })}>
                      +
                    </button>
                  </div>
                  <div className="block-body">
                    {sortInstancesByTime(instances
                      .filter((inst) => inst.day_of_week === i && inst.block_type === block))
                      .map((inst) => (
                        <button key={inst.id} type="button" className={`instance-chip ${inst.is_external ? 'chip-external' : ''}`} onClick={() => onOpenInstance(inst)}>
                          {!inst.is_external && <span className={`status-dot status-${inst.status.toLowerCase().replace(/\s+/g, '-')}`} />}
                          {L(inst.activity, 'title')}
                        </button>
                      ))}
                  </div>
                </div>
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
