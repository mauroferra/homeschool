import Card from '../../components/ui/Card';
import { formatDate } from '../../utils/dateHelpers';

export default function ReflectionList({ reflections = [] }) {
  if (!reflections.length) {
    return <p className="empty-state">No reflections recorded yet.</p>;
  }
  return (
    <div className="reflection-list">
      {reflections.map((r) => (
        <Card key={`${r.type}-${r.week_id}-${r.instance_id || r.text}`} className="reflection-card">
          {r.type === 'weekly' ? (
            <span className="pill pill-weekly">weekly</span>
          ) : (
            <span className="pill pill-activity">activity</span>
          )}
          <div className="reflection-meta">
            <span className="reflection-date">Week of {formatDate(r.start_date)}</span>
            {r.title && <span className="reflection-title"> · {r.title}</span>}
          </div>
          <p className="reflection-text">“{r.text}”</p>
        </Card>
      ))}
    </div>
  );
}