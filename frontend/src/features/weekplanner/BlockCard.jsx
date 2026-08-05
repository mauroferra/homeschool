import ActivityInstanceCard from './ActivityInstanceCard';

export default function BlockCard({ blockType, instances = [], onOpenInstance, onAdd }) {
  return (
    <div className={`block-card block-${kebab(blockType)}`} data-block={blockType}>
      <div className="block-header">
        <span className="block-title">{blockType}</span>
        <button type="button" className="btn-icon block-add" onClick={() => onAdd(blockType)} aria-label={`Add to ${blockType}`}>
          +
        </button>
      </div>
      <div className="block-body">
        {instances.length === 0 && <p className="block-empty">No activity</p>}
        {instances.map((inst) => (
          <ActivityInstanceCard key={inst.id} instance={inst} onOpen={onOpenInstance} />
        ))}
      </div>
    </div>
  );
}

function kebab(str = '') {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}