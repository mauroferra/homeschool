import { useTranslation } from 'react-i18next';
import { WEEKDAY_SHORT } from '../../utils/constants';
import { getMonthGrid, dateOnlyISO, isSameDay, isSameMonth, addDays, parseISO, sortInstancesByTime } from '../../utils/dateHelpers';
import { useLocalized } from '../../utils/localize';

export default function MonthGrid({ anchorDate, instances = [], weeks = [], onOpenInstance, onAdd, onOpenDay }) {
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

  const openDayHandler = (e, date) => {
    if (!onOpenDay || e.target.closest('button')) return;
    onOpenDay(date);
  };

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
              <div
                key={iso}
                className={`month-cell ${inMonth ? '' : 'out-month'} ${isToday ? 'is-today' : ''} ${onOpenDay ? 'day-nav' : ''}`}
                data-iso={iso}
                onClick={(e) => openDayHandler(e, date)}
              >
                <div className="month-cell-head">
                  {onOpenDay ? (
                    <button type="button" className="month-day-number day-nav-btn" onClick={() => onOpenDay(date)}>
                      {date.getDate()}
                    </button>
                  ) : (
                    <span className="month-day-number">{date.getDate()}</span>
                  )}
                  <button
                    type="button"
                    className="btn-icon block-add month-cell-add"
                    aria-label={t('week.addActivity')}
                    onClick={() => onAdd(date)}
                  >
                    +
                  </button>
                </div>
                <div className="month-instances">
{sortInstancesByTime(dayInstances).map((inst) => (
                    <button key={inst.id} type="button" className={`month-instance ${inst.is_external ? 'month-external' : `type-${kebab(inst.block_type)}`}`} title={t(`domain.block.${inst.block_type}`)} onClick={() => onOpenInstance(inst)}>
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
