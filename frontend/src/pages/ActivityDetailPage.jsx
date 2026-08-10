import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../components/ui/Icon';
import ActivityDetailBody from '../features/activities/ActivityDetailBody';

export default function ActivityDetailPage() {
  const { instanceId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="page detail-page">
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/week')}>
        <Icon name="arrowBack" size={18} /> {t('activity.back')}
      </button>
      <ActivityDetailBody instanceId={instanceId} onBack={() => navigate('/week')} onRemoved={() => navigate('/week')} />
    </div>
  );
}
