import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Tabs from '../components/ui/Tabs';
import Icon from '../components/ui/Icon';
import { Select, TextArea, Input } from '../components/ui/Input';
import HouseholdTagSelector from '../features/household/HouseholdTagSelector';
import { weekService } from '../services/weekService';
import { useWeekStore } from '../store/weekStore';
import { STATUSES } from '../utils/constants';
import { formatDuration } from '../utils/formattingHelpers';
import { formatDate } from '../utils/dateHelpers';

export default function ActivityDetailPage() {
  const { instanceId } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const refresh = useWeekStore((s) => s.loadWeek);
  const currentWeek = useWeekStore((s) => s.currentWeek);

  const [instance, setInstance] = useState(null);
  const [status, setStatus] = useState('');
  const [reflection, setReflection] = useState('');
  const [homeTag, setHomeTag] = useState('Home A');
  const [tab, setTab] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const found = await weekService.getInstance(instanceId);
        setInstance(found);
        setStatus(found.status);
        setReflection(found.reflection_text || '');
        setHomeTag(found.home_tag || 'Home A');
      } catch (err) {
        setError(err.message);
      }
    })();
  }, [instanceId]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      await weekService.updateInstance(instance.id, { status, reflection_text: reflection, home_tag: homeTag });
      setInstance({ ...instance, status, reflection_text: reflection, home_tag: homeTag });
      if (currentWeek) await refresh(currentWeek.id);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(t('activity.removeConfirm'))) return;
    await weekService.deleteInstance(instance.id);
    if (currentWeek) await refresh(currentWeek.id);
    navigate(`/week`);
  };

  if (error && !instance) {
    return (
      <div className="page">
        <div className="alert alert-error">{error}</div>
        <Button variant="secondary" onClick={() => navigate('/week')}>{t('activity.back')}</Button>
      </div>
    );
  }

  if (!instance) return <div className="page-loading">{t('activity.loading')}</div>;

  const a = instance.activity;

  return (
    <div className="page detail-page">
      <button type="button" className="btn btn-ghost btn-sm" onClick={() => navigate('/week')}>
        <Icon name="arrowBack" size={18} /> {t('activity.back')}
      </button>

      <div className="detail-head">
        <span className="pill pill-cat">{t(`domain.category.${a.category}`)}</span>
        <h1 className="detail-title">{a.title}</h1>
        {a.theme_name && <span className="pill pill-theme">{a.theme_name}</span>}
      </div>

      <Card className="detail-info">
        <div className="detail-meta">
          {a.estimated_duration && <span><Icon name="clock" size={16} /> {formatDuration(a.estimated_duration)}</span>}
          <span>{t(`domain.block.${instance.block_type}`)}</span>
          <span>{t('activity.created', { date: formatDate(instance.created_at) })}</span>
        </div>
        {a.description && <p className="detail-desc">{a.description}</p>}
        {a.links?.length > 0 && (
          <ul className="detail-links">
            {a.links.map((l) => (
              <li key={l}><Icon name="link" size={16} /><a href={l} target="_blank" rel="noreferrer">{l}</a></li>
            ))}
          </ul>
        )}
      </Card>

      <Tabs tabs={[{ label: t('activity.statusHeading') }]} active={0} onChange={() => {}} />

      <div className="form-stack">
        <Select label={t('activity.status')} name="status" value={status} onChange={(e) => setStatus(e.target.value)} options={STATUSES.map((s) => ({ value: s, label: t(`domain.status.${s}`) }))} />
        <HouseholdTagSelector value={homeTag} onChange={setHomeTag} />
        <TextArea label={t('activity.reflection')} name="reflection" rows={4} placeholder={t('activity.howDidItGo')} value={reflection} onChange={(e) => setReflection(e.target.value)} />
        {saved && <div className="alert alert-success">{t('activity.saved')}</div>}
        {error && <div className="alert alert-error">{error}</div>}
        <div className="form-actions">
          <Button variant="danger" icon="trash" onClick={remove}>{t('activity.remove')}</Button>
          <Button loading={saving} onClick={save}>{t('activity.saveChanges')}</Button>
        </div>
      </div>
    </div>
  );
}