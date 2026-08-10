import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Tabs from '../../components/ui/Tabs';
import Icon from '../../components/ui/Icon';
import { Select, TextArea } from '../../components/ui/Input';
import { STATUSES } from '../../utils/constants';
import { formatDuration, formatTimeRange } from '../../utils/formattingHelpers';
import { formatDate } from '../../utils/dateHelpers';
import { useLocalized } from '../../utils/localize';
import { useActivityDetail } from './useActivityDetail';

export default function ActivityDetailBody({ instanceId, onChanged, onRemoved, onBack }) {
  const { t } = useTranslation();
  const L = useLocalized();
  const {
    instance, status, reflection, saving, saved, error,
    setStatus, setReflection, save, remove,
  } = useActivityDetail(instanceId, { onChanged, onRemoved });

  if (error && !instance) {
    return (
      <>
        <div className="alert alert-error">{error}</div>
        <div className="form-actions">
          <Button variant="secondary" onClick={onBack}>{t('activity.back')}</Button>
        </div>
      </>
    );
  }

  if (!instance) return <div className="page-loading">{t('activity.loading')}</div>;

  const a = instance.activity;
  const isExternal = instance.is_external === true;
  const category = a?.category;
  const theme = a?.theme_name;

  return (
    <>
      <div className="detail-head">
        {category && <span className="pill pill-cat">{t(`domain.category.${category}`)}</span>}
        {isExternal && <span className="pill pill-external">{t('week.external')}</span>}
        <h1 className="detail-title">{L(a, 'title')}</h1>
        {theme && <span className="pill pill-theme">{theme}</span>}
      </div>

      <Card className="detail-info">
        <div className="detail-meta">
          {formatTimeRange(a?.start_time, a?.end_time) && <span><Icon name="clock" size={16} /> {formatTimeRange(a?.start_time, a?.end_time)}</span>}
          {a?.estimated_duration && <span><Icon name="clock" size={16} /> {formatDuration(a.estimated_duration)}</span>}
          <span>{t(`domain.block.${instance.block_type}`)}</span>
          <span>{t('activity.created', { date: formatDate(instance.created_at) })}</span>
        </div>
        {L(a, 'description') && <p className="detail-desc">{L(a, 'description')}</p>}
        {a?.links?.length > 0 && (
          <ul className="detail-links">
            {a.links.map((l) => (
              <li key={l}><Icon name="link" size={16} /><a href={l} target="_blank" rel="noreferrer">{l}</a></li>
            ))}
          </ul>
        )}
      </Card>

      {!isExternal && (
        <>
          <Tabs tabs={[{ label: t('activity.statusHeading') }]} active={0} onChange={() => {}} />

          <div className="form-stack">
            <Select label={t('activity.status')} name="status" value={status} onChange={(e) => setStatus(e.target.value)} options={STATUSES.map((s) => ({ value: s, label: t(`domain.status.${s}`) }))} />
            <TextArea label={t('activity.reflection')} name="reflection" rows={4} placeholder={t('activity.howDidItGo')} value={reflection} onChange={(e) => setReflection(e.target.value)} />
            {saved && <div className="alert alert-success">{t('activity.saved')}</div>}
            {error && <div className="alert alert-error">{error}</div>}
            <div className="form-actions">
              <Button variant="danger" icon="trash" onClick={remove}>{t('activity.remove')}</Button>
              <Button loading={saving} onClick={save}>{t('activity.saveChanges')}</Button>
            </div>
          </div>
        </>
      )}

      {isExternal && (
        <div className="form-stack">
          <p className="field-hint">{t('week.externalHint')}</p>
          <div className="form-actions">
            <Button variant="danger" icon="trash" onClick={remove}>{t('activity.remove')}</Button>
            <Button variant="secondary" onClick={onBack}>{t('activity.back')}</Button>
          </div>
        </div>
      )}
    </>
  );
}
