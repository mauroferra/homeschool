import BlockCard from './BlockCard';
import { BLOCK_TYPES, WEEKDAY_SHORT } from '../../utils/constants';
import { dayOffset, formatDate } from '../../utils/dateHelpers';

export default function DayColumn({ startDate, dayIndex, instances, onOpenInstance, onAdd }) {
  const date = dayOffset(startDate, dayIndex);
  const isToday = formatDate(date) === formatDate(new Date());
  return (
    <div className={`day-column ${isToday ? 'is-today' : ''}`}>
      <div className="day-header">
        <span className="day-name">{WEEKDAY_SHORT[dayIndex]}</span>
        <span className="day-date">{formatDate(date)}</span>
      </div>
      <div className="day-blocks">
        {BLOCK_TYPES.map((block) => (
          <BlockCard
            key={block}
            blockType={block}
            instances={instances.filter((i) => i.day_of_week === dayIndex && i.block_type === block)}
            onOpenInstance={onOpenInstance}
            onAdd={(block) => onAdd(block, dayIndex)}
          />
        ))}
      </div>
    </div>
  );
}