import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from '../../components/ui/Icon';
import ActivityDetailBody from './ActivityDetailBody';

export default function ActivityDetailModal({ instanceId, onClose, onChanged }) {
  const { t } = useTranslation();

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="modal-overlay detail-modal-overlay"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div className="modal modal-lg activity-detail-modal" role="dialog" aria-modal="true" aria-label={t('activity.detail')}>
        <div className="modal-header">
          <span className="modal-title">{t('activity.detail')}</span>
          <button type="button" className="btn-icon" onClick={onClose} aria-label={t('modal.close')}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="modal-body">
          <ActivityDetailBody instanceId={instanceId} onChanged={onChanged} onRemoved={onClose} onBack={onClose} />
        </div>
      </div>
    </div>
  );
}
