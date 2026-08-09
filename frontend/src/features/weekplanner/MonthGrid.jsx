import { useTranslation } from 'react-i18next';
import { WEEKDAY_SHORT, BLOCK_TYPES } from '../../utils/constants';
import { getMonthGrid, dateOnlyISO, isSameDay, isSameMonth, addDays, parseISO } from '../../utils/dateHelpers';
import { useLocalized } from '../../utils/localize';

export default function MonthGrid({ anchorDate, instances = [], weeks = [], onOpenInstance, onAdd }) {
  const { t } = useTranslation();
  const L = useLocalized();
  const grid = getMonthGrid(anchorDate);
  const weekById = weeks.reduce((map, w) => { map[w.id] = w; return map; }, {});
  const byDate = {};
  instances.forEach((inst) => {
    const week = weekById[inst.week_id];
    if (!week) return;
    const iso = dateOnlyISO(addDays(parseISO(week.start_date), inst.day_of_week));
    (byDate[iso] ||= []).push(inst);
  });

  return (
    <div className="month-view">
      <div className="month-weekdays">
        {WEEKDAY_SHORT.map((d) => (
          <span key={d} className="month-weekday">{t(`domain.weekdayShort.${d}`)}</span>
        ))}
      </div>
      {grid.map((week, wi) => (
        <div className="month-row" key={wi}>
          {week.map((date) => {
            const iso = dateOnlyISO(date);
            const dayInstances = byDate[iso] || [];
            const isToday = isSameDay(date, new Date());
            const inMonth = isSameMonth(date, anchorDate);
            return (
              <div key={iso} className={`month-cell ${inMonth ? '' : 'out-month'} ${isToday ? 'is-today' : ''}`} data-iso={iso}>
                <div className="month-cell-head">
                  <span className="month-day-number">{date.getDate()}</span>
                  <button
                    type="button"
                    className="btn-icon block-add month-cell-add"
                    aria-label={t('week.addActivity')}
                    onClick={() => onAdd(BLOCK_TYPES[0], date)}
                  >
                    +
                  </button>
                </div>
                <div className="month-instances">
                  {dayInstances.map((inst) => (
                    <button key={inst.id} type="button" className={`month-instance cat-${kebab(inst.activity?.category)}`} onClick={() => onOpenInstance(inst)}>
                      {L(inst.activity, 'title')}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function kebab(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}