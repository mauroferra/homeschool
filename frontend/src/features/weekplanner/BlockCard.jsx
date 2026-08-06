import { useTranslation } from 'react-i18next';
import ActivityInstanceCard from './ActivityInstanceCard';

export default function BlockCard({ blockType, instances = [], onOpenInstance, onAdd }) {
  const { t } = useTranslation();
  return (
    <div className={`block-card block-${kebab(blockType)}`} data-block={blockType}>
      <div className="block-header">
        <span className="block-title">{t(`domain.block.${blockType}`)}</span>
        <button type="button" className="btn-icon block-add" onClick={() => onAdd(blockType)} aria-label={t('week.addTo', { block: t(`domain.block.${blockType}`) })}>
          +
        </button>
      </div>
      <div className="block-body">
        {instances.length === 0 && <p className="block-empty">{t('week.noActivity')}</p>}
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
