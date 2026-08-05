import DayColumn from './DayColumn';
import { WEEKDAY_SHORT } from '../../utils/constants';
import { dayOffset, formatDate } from '../../utils/dateHelpers';

export default function WeekGrid({ startDate, instances, onOpenInstance, onAdd }) {
  return (
    <div className="week-grid">
      {Array.from({ length: 7 }).map((_, i) => {
        const date = dayOffset(startDate, i);
        const isToday = formatDate(date) === formatDate(new Date());
        return (
          <div key={i} className={`grid-col ${isToday ? 'is-today' : ''}`}>
            <div className="day-header">
              <span className="day-name">{WEEKDAY_SHORT[i]}</span>
              <span className="day-date">{formatDate(date)}</span>
            </div>
            <div className="grid-blocks">
              {['Italian Micro-Immersion', 'Czech School Alignment', 'Italian Cultural Activity', 'Bonding Ritual'].map((block) => (
                <div key={block} className={`grid-block block-${block.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}>
                  <div className="block-header">
                    <span className="block-title">{shortBlock(block)}</span>
                    <button type="button" className="btn-icon block-add" onClick={() => onAdd(block, i)} aria-label={`Add to ${shortBlock(block)}`}>
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

function shortBlock(block) {
  const map = {
    'Italian Micro-Immersion': 'IMI',
    'Czech School Alignment': 'CSA',
    'Italian Cultural Activity': 'ICA',
    'Bonding Ritual': 'BR',
  };
  return map[block] || block;
}