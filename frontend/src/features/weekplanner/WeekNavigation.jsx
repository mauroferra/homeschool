import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';

export default function WeekNavigation({ label, todayLabel, onPrev, onNext, onToday, isToday = false }) {
  const { t } = useTranslation();
  return (
    <div className="week-nav">
      <Button variant="secondary" icon="chevronLeft" aria-label={t('week.prev')} onClick={onPrev} />
      <div className="week-nav-center">
        <strong className="week-label">{label}</strong>
        {isToday && <span className="week-today">{todayLabel}</span>}
      </div>
      <Button variant="secondary" icon="chevronRight" aria-label={t('week.next')} onClick={onNext} />
      <Button variant="ghost" size="sm" onClick={onToday}>
        <Icon name="home" size={16} /> {t('week.today')}
      </Button>
    </div>
  );
}