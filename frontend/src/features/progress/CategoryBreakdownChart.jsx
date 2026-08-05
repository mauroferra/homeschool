import { CATEGORIES } from '../../utils/constants';

export default function CategoryBreakdownChart({ history = [] }) {
  if (!history.length) {
    return <p className="empty-state">No completed weeks to chart yet.</p>;
  }
  const colors = ['#e07a5f', '#3d8b99', '#5a7d3a', '#b58bd6', '#d19a3d', '#8a6f5c'];
  const series = history.map((w) => ({
    label: w.start_date.slice(8, 10) + '/' + w.start_date.slice(5, 7),
    values: CATEGORIES.map((c) => w.by_category[c] || 0),
  }));
  const max = Math.max(1, ...series.flatMap((s) => s.values));
  return (
    <div className="chart-wrap">
      <div className="chart-bars">
        {series.map((s, i) => (
          <div className="chart-col" key={i}>
            <div className="chart-stack">
              {CATEGORIES.map((c, ci) => {
                const v = s.values[ci];
                if (!v) return null;
                return (
                  <div
                    key={c}
                    className="chart-seg"
                    style={{ height: `${(v / max) * 100}%`, background: colors[ci] }}
                    title={`${c}: ${v}`}
                  />
                );
              })}
            </div>
            <span className="chart-label">{s.label}</span>
          </div>
        ))}
      </div>
      <div className="chart-legend">
        {CATEGORIES.map((c, i) => (
          <span key={c} className="legend-item">
            <i style={{ background: colors[i] }} /> {c}
          </span>
        ))}
      </div>
    </div>
  );
}