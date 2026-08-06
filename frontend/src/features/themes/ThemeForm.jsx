import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import { dateOnlyISO, addDays } from '../../utils/dateHelpers';

export default function ThemeForm({ initial = {}, onSubmit, onCancel, submitLabel = 'Save' }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: initial.name || '',
    description: initial.description || '',
    start_date: initial.start_date || dateOnlyISO(new Date()),
    end_date: initial.end_date || dateOnlyISO(addDays(new Date(), 30)),
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = t('themeForm.nameRequired');
    if (form.start_date && form.end_date && form.start_date > form.end_date) next.end_date = t('themeForm.endAfterStart');
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    setError('');
    try {
      await onSubmit({
        name: form.name.trim(),
        description: form.description,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
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
      <Input name="name" label={t('themeForm.themeName')} value={form.name} onChange={set('name')} error={errors.name} />
      <TextArea name="description" label={t('themeForm.description')} rows={3} value={form.description} onChange={set('description')} />
      <div className="form-row">
        <Input name="start_date" label={t('themeForm.startDate')} type="date" value={form.start_date} onChange={set('start_date')} />
        <Input name="end_date" label={t('themeForm.endDate')} type="date" value={form.end_date} onChange={set('end_date')} error={errors.end_date} />
      </div>
      <div className="form-actions">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>{t('themeForm.cancel')}</Button>}
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  );
}