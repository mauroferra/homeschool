import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { useExternalTypeStore } from '../../store/externalTypeStore';

export default function ExternalActivityForm({ onSubmit, onCancel, submitLabel }) {
  const { t } = useTranslation();
  const { types, createType } = useExternalTypeStore();
  const [typeId, setTypeId] = useState('');
  const [customOpen, setCustomOpen] = useState(false);
  const [customName, setCustomName] = useState('');
  const [busy, setBusy] = useState(false);

  const addCustomType = async () => {
    const name = customName.trim();
    if (!name) return;
    setBusy(true);
    try {
      const created = await createType(name);
      setTypeId(String(created.id));
      setCustomName('');
      setCustomOpen(false);
    } finally {
      setBusy(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!typeId) return;
    onSubmit({ external_type_id: Number(typeId) });
  };

  const invalid = !typeId;

  return (
    <form className="form-stack" onSubmit={submit} noValidate>
      <p className="field-hint external-hint">{t('week.externalHint')}</p>
      <Select
        label={t('week.externalType')}
        name="external-type"
        value={typeId}
        onChange={(e) => setTypeId(e.target.value)}
        options={types.map((tp) => ({ value: tp.id, label: tp.name }))}
        placeholder={t('week.chooseType')}
      />
      <button type="button" className="btn-link" onClick={() => setCustomOpen((o) => !o)}>
        {customOpen ? t('week.hideCustomType') : t('week.defineType')}
      </button>
      {customOpen && (
        <div className="link-input-row">
          <Input
            name="external-type-name"
            placeholder={t('week.externalTypeCustomPlaceholder')}
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
          />
          <Button type="button" variant="secondary" loading={busy} onClick={addCustomType}>{t('week.add')}</Button>
        </div>
      )}
      <div className="form-actions">
        {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>{t('week.cancel')}</Button>}
        <Button type="submit" disabled={invalid || busy}>{submitLabel || t('week.add')}</Button>
      </div>
    </form>
  );
}