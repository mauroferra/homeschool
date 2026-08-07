import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';

export default function WeekNavigation({ label, onPrev, onNext, onToday, todayLabel, active = false }) {
  const { t } = useTranslation();
  return (
    <div className="week-nav-wrap">
      <div className="week-nav">
        <Button variant="secondary" icon="chevronLeft" aria-label={t('week.prev')} onClick={onPrev} />
        <div className="week-nav-center">
          <strong className="week-label">{label}</strong>
        </div>
        <Button variant="secondary" icon="chevronRight" aria-label={t('week.next')} onClick={onNext} />
        <Button
          variant="secondary"
          size="sm"
          icon="home"
          className={active ? 'week-now active' : 'week-now'}
          onClick={onToday}
        >
          {todayLabel}
        </Button>
      </div>
    </div>
  );
}