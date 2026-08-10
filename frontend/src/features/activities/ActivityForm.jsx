import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import { Input, Select, TextArea } from '../../components/ui/Input';
import FileUploader from '../../components/ui/FileUploader';
import { CATEGORIES } from '../../utils/constants';
import { validateRequired } from '../../utils/validationHelpers';
import { useLocalized } from '../../utils/localize';

export default function ActivityForm({ initial = {}, themes = [], onSubmit, onCancel, submitLabel = 'Save', extraFields }) {
  const { t } = useTranslation();
  const L = useLocalized();
  const [form, setForm] = useState({
    title: initial.title || '',
    category: initial.category || CATEGORIES[0],
    description: initial.description || '',
    estimated_duration: initial.estimated_duration ?? '',
    start_time: initial.start_time || '',
    end_time: initial.end_time || '',
    links: initial.links || [],
    theme_id: initial.theme_id ?? '',
  });
  const [linkInput, setLinkInput] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const addLink = () => {
    const v = linkInput.trim();
    if (!v) return;
    setForm((f) => ({ ...f, links: [...(f.links || []), v] }));
    setLinkInput('');
  };

  const removeLink = (idx) => setForm((f) => ({ ...f, links: f.links.filter((_, i) => i !== idx) }));

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!validateRequired(form.title)) next.title = t('activityForm.titleRequired');
    if (!validateRequired(form.category)) next.category = t('activityForm.categoryRequired');
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setError('');
    try {
      await onSubmit({
        title: form.title.trim(),
        category: form.category,
        description: form.description || null,
        estimated_duration: form.estimated_duration ? Number(form.estimated_duration) : null,
        start_time: form.start_time || null,
        end_time: form.end_time || null,
        links: form.links.filter(Boolean),
        theme_id: form.theme_id || null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="form-stack" onSubmit={submit} noValidate>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      <Input name="title" label={t('activityForm.title')} value={form.title} onChange={set('title')} error={errors.title} />
      <div className="form-row">
        <Select
          label={t('activityForm.category')}
          name="category"
          value={form.category}
          onChange={set('category')}
          options={CATEGORIES.map((c) => ({ value: c, label: t(`domain.category.${c}`) }))}
        />
        <Input name="estimated_duration" label={t('activityForm.durationMin')} type="number" min="1" value={form.estimated_duration} onChange={set('estimated_duration')} />
      </div>
      <div className="form-row">
        <Input name="start_time" label={t('activityForm.startTime')} type="time" value={form.start_time} onChange={set('start_time')} />
        <Input name="end_time" label={t('activityForm.endTime')} type="time" value={form.end_time} onChange={set('end_time')} />
      </div>
      {extraFields}
      {themes.length > 0 && (
        <Select
          label={t('activityForm.theme')}
          name="theme_id"
          placeholder={t('activityForm.noTheme')}
          value={form.theme_id}
          onChange={set('theme_id')}
          options={themes.map((t) => ({ value: t.id, label: L(t, 'name') }))}
        />
      )}
      <TextArea name="description" label={t('activityForm.description')} rows={3} value={form.description} onChange={set('description')} />

      <div className="field">
        <label className="field-label">{t('activityForm.links')}</label>
        <div className="link-input-row">
          <Input name="link" type="url" placeholder="https://…" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} />
          <Button type="button" variant="secondary" onClick={addLink}>{t('week.add')}</Button>
        </div>
        {form.links.length > 0 && (
          <ul className="link-list">
            {form.links.map((link, idx) => (
              <li key={`${link}-${idx}`}>
                <a href={link} target="_blank" rel="noreferrer">{link}</a>
                <button type="button" className="btn-icon" onClick={() => removeLink(idx)} aria-label={t('activityForm.removeLink')}>×</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <FileUploader files={form.attachments || []} onChange={(files) => setForm((f) => ({ ...f, attachments: files }))} />

      <div className="form-actions">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>{t('activityForm.cancel')}</Button>}
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  );
}