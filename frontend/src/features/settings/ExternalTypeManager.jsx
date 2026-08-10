import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function ExternalTypeManager({ types, onAdd, onRename, onDelete }) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const add = async () => {
    const value = name.trim();
    if (!value) return;
    await onAdd(value);
    setName('');
  };

  const saveEdit = async (id) => {
    const value = editingName.trim();
    if (!value) { setEditingId(null); return; }
    await onRename(id, value);
    setEditingId(null);
  };

  return (
    <div className="form-stack">
      <div className="link-input-row">
        <Input
          name="new-external-type"
          placeholder={t('settingsPage.externalTypePlaceholder')}
          label={t('settingsPage.externalTypeName')}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button icon="plus" onClick={add}>{t('settingsPage.newExternalType')}</Button>
      </div>

      {types.length === 0 && <p className="block-empty">{t('settingsPage.noExternalTypes')}</p>}

      <ul className="chip-list">
        {types.map((type) => (
          <li key={type.id} className="chip-list-item">
            {editingId === type.id ? (
              <div className="link-input-row">
                <Input name={`edit-type-${type.id}`} value={editingName} onChange={(e) => setEditingName(e.target.value)} />
                <Button variant="secondary" onClick={() => saveEdit(type.id)}>{t('settingsPage.saveChanges')}</Button>
              </div>
            ) : (
              <>
                <span className="chip-chip">{type.name}</span>
                <span className="chip-actions">
                  <button
                    type="button"
                    className="btn-icon"
                    aria-label={t('settingsPage.renameExternalType')}
                    onClick={() => { setEditingId(type.id); setEditingName(type.name); }}
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    className="btn-icon"
                    aria-label={t('settingsPage.deleteExternalType')}
                    onClick={() => {
                      if (window.confirm(t('settingsPage.deleteExternalTypeConfirm', { name: type.name }))) onDelete(type.id);
                    }}
                  >
                    ×
                  </button>
                </span>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}