import { useTranslation } from 'react-i18next';
import DayColumn from './DayColumn';
import { WEEKDAY_SHORT } from '../../utils/constants';
import { dayOffset, formatDate } from '../../utils/dateHelpers';

const BLOCK_TYPES = [
  'Italian Micro-Immersion',
  'Czech School Alignment',
  'Italian Cultural Activity',
  'Bonding Ritual',
];

export default function WeekGrid({ startDate, instances, onOpenInstance, onAdd }) {
  const { t } = useTranslation();
  return (
    <div className="week-grid">
      {Array.from({ length: 7 }).map((_, i) => {
        const date = dayOffset(startDate, i);
        const isToday = formatDate(date) === formatDate(new Date());
        return (
          <div key={i} className={`grid-col ${isToday ? 'is-today' : ''}`}>
            <div className="day-header">
              <span className="day-name">{t(`domain.weekdayShort.${WEEKDAY_SHORT[i]}`)}</span>
              <span className="day-date">{formatDate(date)}</span>
            </div>
            <div className="grid-blocks">
              {BLOCK_TYPES.map((block) => (
                <div key={block} className={`grid-block block-${kebab(block)}`}>
                  <div className="block-header">
                    <span className="block-title">{t(`domain.blockShort.${block}`)}</span>
                    <button type="button" className="btn-icon block-add" onClick={() => onAdd(block, i)} aria-label={t('week.addTo', { block: t(`domain.blockShort.${block}`) })}>
                      +
                    </button>
                  </div>
                  <div className="block-body">
                    {instances
                      .filter((inst) => inst.day_of_week === i && inst.block_type === block)
                      .map((inst) => (
                        <button key={inst.id} type="button" className="instance-chip" onClick={() => onOpenInstance(inst)}>
                          <span className={`status-dot status-${inst.status.toLowerCase().replace(/\s+/g, '-')}`} />
                          {inst.activity.title}
                          {inst.home_tag !== 'Home A' && <span className="home-chip">{inst.home_tag === 'Both' ? 'A+B' : 'B'}</span>}
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
