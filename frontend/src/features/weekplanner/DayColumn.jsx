import { useTranslation } from 'react-i18next';
import BlockCard from './BlockCard';
import { BLOCK_TYPES, WEEKDAYS } from '../../utils/constants';
import { formatDate, isSameDay, sortInstancesByTime } from '../../utils/dateHelpers';

export default function DayColumn({ date, dayIndex, instances, onOpenInstance, onAdd, onOpenDay }) {
  const { t } = useTranslation();
  const isToday = isSameDay(date, new Date());
  const openDayHandler = (e) => {
    if (!onOpenDay || e.target.closest('button')) return;
    onOpenDay(date);
  };
  return (
    <div
      className={`day-column ${isToday ? 'is-today' : ''} ${onOpenDay ? 'day-nav' : ''}`}
      onClick={openDayHandler}
    >
      <div className="day-header">
        {onOpenDay ? (
          <button type="button" className="day-nav-btn" onClick={() => onOpenDay(date)}>
            <span className="day-name">{t(`domain.weekday.${WEEKDAYS[dayIndex]}`)}</span>
            <span className="day-date">{formatDate(date)}</span>
          </button>
        ) : (
          <>
            <span className="day-name">{t(`domain.weekday.${WEEKDAYS[dayIndex]}`)}</span>
            <span className="day-date">{formatDate(date)}</span>
          </>
        )}
      </div>
      <div className="day-blocks">
        {BLOCK_TYPES.map((block) => (
          <BlockCard
            key={block}
            blockType={block}
            instances={sortInstancesByTime(instances.filter((i) => i.day_of_week === dayIndex && i.block_type === block))}
            onOpenInstance={onOpenInstance}
            onAdd={(blk) => onAdd(blk, date)}
          />
        ))}
      </div>
    </div>
  );
}
