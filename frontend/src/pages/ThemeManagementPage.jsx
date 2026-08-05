import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ThemeList from '../features/themes/ThemeList';
import ThemeForm from '../features/themes/ThemeForm';
import { useThemeStore } from '../store/themeStore';

export default function ThemeManagementPage() {
  const { themes, loading, error, loadThemes, createTheme, updateTheme, deleteTheme } = useThemeStore();
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    loadThemes().catch(() => {});
  }, []);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (theme) => { setEditing(theme); setModalOpen(true); };
  const close = () => { setModalOpen(false); setEditing(null); };

  const handleSubmit = async (payload) => {
    if (editing) await updateTheme(editing.id, payload);
    else await createTheme(payload);
    close();
  };

  const handleDelete = async (theme) => {
    if (!window.confirm(`Delete theme "${theme.name}"? Activities linked to it will keep their template.`)) return;
    await deleteTheme(theme.id);
  };

  const handleDeleteBtn = (theme) => {
    void confirm;
    setConfirm(theme);
    handleDelete(theme);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Themes</h1>
          <p className="page-sub">Monthly themes give each week a focus.</p>
        </div>
        <Button icon="plus" onClick={openCreate}>New theme</Button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? <div className="page-loading">Loading themes…</div> : <ThemeList themes={themes} onEdit={openEdit} onDelete={handleDeleteBtn} />}

      <Modal open={modalOpen} title={editing ? 'Edit theme' : 'New theme'} onClose={close}>
        <ThemeForm
          initial={editing || {}}
          onSubmit={handleSubmit}
          onCancel={close}
          submitLabel={editing ? 'Save changes' : 'Create theme'}
        />
      </Modal>
    </div>
  );
}