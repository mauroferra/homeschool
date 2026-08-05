import Card from '../../components/ui/Card';
import Icon from '../../components/ui/Icon';
import { formatDuration } from '../../utils/formattingHelpers';

export default function ActivityTemplateCard({ activity, onEdit, onDelete }) {
  return (
    <Card className="activity-card">
      <div className="activity-card-body">
        <div className="activity-card-head">
          <span className="pill pill-cat">{activity.category}</span>
          {activity.theme_name && <span className="pill pill-theme">{activity.theme_name}</span>}
        </div>
        <h3 className="activity-card-title">{activity.title}</h3>
        {activity.description && <p className="activity-card-desc">{activity.description}</p>}
        <div className="activity-card-meta">
          {activity.estimated_duration && (
            <span className="meta-item"><Icon name="clock" size={16} /> {formatDuration(activity.estimated_duration)}</span>
          )}
          {activity.links?.length > 0 && <span className="meta-item"><Icon name="link" size={16} /> {activity.links.length} link{activity.links.length > 1 ? 's' : ''}</span>}
        </div>
      </div>
      <div className="activity-card-actions">
        <button type="button" className="btn-icon" onClick={() => onEdit(activity)} aria-label={`Edit ${activity.title}`}>
          <Icon name="edit" size={18} />
        </button>
        <button type="button" className="btn-icon btn-danger" onClick={() => onDelete(activity)} aria-label={`Delete ${activity.title}`}>
          <Icon name="trash" size={18} />
        </button>
      </div>
    </Card>
  );
}