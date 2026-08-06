import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '../../utils/constants';

export default function WeeklyStats({ stats }) {
  const { t } = useTranslation();
  if (!stats) return null;
  const maxCategory = Math.max(1, ...Object.values(stats.by_category || {}));
  return (
    <div className="stats-card">
      <div className="stats-head">
        <div className="stats-total">
          <strong>{stats.completed}</strong>
          <span>{t('weeklyStats.completed')}</span>
        </div>
        <div className="stats-sub">
          <span>{stats.total} {t('weeklyStats.scheduled')}</span>
          <span>{stats.pending} {t('weeklyStats.pending')}</span>
          <span>{stats.skipped} {t('weeklyStats.skipped')}</span>
        </div>
      </div>
      <div className="stats-categories">
        {CATEGORIES.filter((c) => (stats.by_category[c] ?? 0) > 0).map((c) => (
          <div className="stat-row" key={c}>
            <span className="stat-name">{t(`domain.category.${c}`)}</span>
            <div className="stat-bar"><div className="stat-fill" style={{ width: `${((stats.by_category[c] || 0) / maxCategory) * 100}%` }} /></div>
            <span className="stat-value">{stats.by_category[c]}</span>
          </div>
        ))}
        {CATEGORIES.every((c) => (stats.by_category[c] ?? 0) === 0) && <p className="empty-state">{t('weeklyStats.empty')}</p>}
      </div>
    </div>
  );
}