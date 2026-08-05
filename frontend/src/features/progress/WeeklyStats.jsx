import { CATEGORIES } from '../../utils/constants';

export default function WeeklyStats({ stats }) {
  if (!stats) return null;
  const maxCategory = Math.max(1, ...Object.values(stats.by_category || {}));
  return (
    <div className="stats-card">
      <div className="stats-head">
        <div className="stats-total">
          <strong>{stats.completed}</strong>
          <span>completed</span>
        </div>
        <div className="stats-sub">
          <span>{stats.total} scheduled</span>
          <span>{stats.pending} pending</span>
          <span>{stats.skipped} skipped</span>
        </div>
      </div>
      <div className="stats-categories">
        {CATEGORIES.filter((c) => (stats.by_category[c] ?? 0) > 0).map((c) => (
          <div className="stat-row" key={c}>
            <span className="stat-name">{c}</span>
            <div className="stat-bar"><div className="stat-fill" style={{ width: `${((stats.by_category[c] || 0) / maxCategory) * 100}%` }} /></div>
            <span className="stat-value">{stats.by_category[c]}</span>
          </div>
        ))}
        {CATEGORIES.every((c) => (stats.by_category[c] ?? 0) === 0) && <p className="empty-state">Nothing completed in this category set yet.</p>}
      </div>
    </div>
  );
}