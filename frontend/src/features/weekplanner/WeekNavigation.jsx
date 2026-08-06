import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import { formatWeekLabel } from '../../utils/dateHelpers';

export default function WeekNavigation({ startDate, onPrev, onNext, onToday, today = false }) {
  const { t } = useTranslation();
  return (
    <div className="week-nav">
      <Button variant="secondary" icon="chevronLeft" aria-label={t('week.prevWeek')} onClick={onPrev} />
      <div className="week-nav-center">
        <strong className="week-label">{formatWeekLabel(startDate)}</strong>
        {today && <span className="week-today">{t('week.thisWeek')}</span>}
      </div>
      <Button variant="secondary" icon="chevronRight" aria-label={t('week.nextWeek')} onClick={onNext} />
      <Button variant="ghost" size="sm" onClick={onToday}>
        <Icon name="home" size={16} /> {t('week.today')}
      </Button>
    </div>
  );
}