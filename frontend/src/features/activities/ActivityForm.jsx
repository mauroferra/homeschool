import { useState } from 'react';
import Button from '../../components/ui/Button';
import { Input, Select, TextArea } from '../../components/ui/Input';
import FileUploader from '../../components/ui/FileUploader';
import { CATEGORIES } from '../../utils/constants';
import { validateRequired } from '../../utils/validationHelpers';

export default function ActivityForm({ initial = {}, themes = [], onSubmit, onCancel, submitLabel = 'Save', extraFields }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    category: initial.category || CATEGORIES[0],
    description: initial.description || '',
    estimated_duration: initial.estimated_duration ?? '',
    links: initial.links || [],
    theme_id: initial.theme_id ?? '',
    home_tag: initial.home_tag || 'Home A',
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
    if (!validateRequired(form.title)) next.title = 'Title is required';
    if (!validateRequired(form.category)) next.category = 'Category is required';
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
        links: form.links.filter(Boolean),
        theme_id: form.theme_id || null,
        home_tag: form.home_tag,
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
      <Input name="title" label="Title" value={form.title} onChange={set('title')} error={errors.title} />
      <div className="form-row">
        <Select
          label="Category"
          name="category"
          value={form.category}
          onChange={set('category')}
          options={CATEGORIES}
        />
        <Input name="estimated_duration" label="Duration (min)" type="number" min="1" value={form.estimated_duration} onChange={set('estimated_duration')} />
      </div>
      {extraFields}
      {themes.length > 0 && (
        <Select
          label="Theme"
          name="theme_id"
          placeholder="No theme"
          value={form.theme_id}
          onChange={set('theme_id')}
          options={themes.map((t) => ({ value: t.id, label: t.name }))}
        />
      )}
      <TextArea name="description" label="Description" rows={3} value={form.description} onChange={set('description')} />

      <div className="field">
        <label className="field-label">Links</label>
        <div className="link-input-row">
          <Input name="link" type="url" placeholder="https://…" value={linkInput} onChange={(e) => setLinkInput(e.target.value)} />
          <Button type="button" variant="secondary" onClick={addLink}>Add</Button>
        </div>
        {form.links.length > 0 && (
          <ul className="link-list">
            {form.links.map((link, idx) => (
              <li key={`${link}-${idx}`}>
                <a href={link} target="_blank" rel="noreferrer">{link}</a>
                <button type="button" className="btn-icon" onClick={() => removeLink(idx)} aria-label="Remove link">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <FileUploader files={form.attachments || []} onChange={(files) => setForm((f) => ({ ...f, attachments: files }))} />

      <div className="form-actions">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>}
        <Button type="submit" loading={loading}>{submitLabel}</Button>
      </div>
    </form>
  );
}