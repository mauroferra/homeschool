import ActivityTemplateCard from './ActivityTemplateCard';

export default function ActivityTemplateList({ activities, onEdit, onDelete }) {
  if (activities.length === 0) {
    return <p className="empty-state">No activity templates yet. Create one to reuse it across weeks.</p>;
  }
  return (
    <div className="template-grid">
      {activities.map((a) => (
        <ActivityTemplateCard key={a.id} activity={a} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}