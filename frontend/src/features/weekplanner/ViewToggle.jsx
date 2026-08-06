import { useTranslation } from 'react-i18next';

const VIEWS = [
  { id: 'day', key: 'viewDay' },
  { id: 'week', key: 'viewWeek' },
  { id: 'month', key: 'viewMonth' },
];

export default function ViewToggle({ value = 'week', onChange }) {
  const { t } = useTranslation();
  return (
    <div className="view-toggle" role="tablist" aria-label={t('week.viewLabel')}>
      {VIEWS.map((view) => (
        <button
          key={view.id}
          type="button"
          role="tab"
          aria-selected={value === view.id}
          className={`view-toggle-btn ${value === view.id ? 'active' : ''}`}
          onClick={() => onChange(view.id)}
        >
          {t(`week.${view.key}`)}
        </button>
      ))}
    </div>
  );
}