import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { formatWeekLabel } from '../../utils/dateHelpers';

export default function WeekNavigation({ startDate, onPrev, onNext, onToday, today = false }) {
  return (
    <div className="week-nav">
      <Button variant="secondary" icon="chevronLeft" aria-label="Previous week" onClick={onPrev} />
      <div className="week-nav-center">
        <strong className="week-label">{formatWeekLabel(startDate)}</strong>
        {today && <span className="week-today">this week</span>}
      </div>
      <Button variant="secondary" icon="chevronRight" aria-label="Next week" onClick={onNext} />
      <Button variant="ghost" size="sm" onClick={onToday}>
        <Icon name="home" size={16} /> Today
      </Button>
    </div>
  );
}