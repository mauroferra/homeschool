import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import ThemeList from '../features/themes/ThemeList';
import ThemeForm from '../features/themes/ThemeForm';
import { useThemeStore } from '../store/themeStore';

export default function ThemeManagementPage() {
  const { t } = useTranslation();
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
    if (!window.confirm(t('themePage.deleteConfirm', { name: theme.name }))) return;
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
          <h1 className="page-title">{t('themePage.title')}</h1>
          <p className="page-sub">{t('themePage.subtitle')}</p>
        </div>
        <Button icon="plus" onClick={openCreate}>{t('themePage.newTheme')}</Button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {loading ? <div className="page-loading">{t('themePage.loading')}</div> : <ThemeList themes={themes} onEdit={openEdit} onDelete={handleDeleteBtn} />}

      <Modal open={modalOpen} title={editing ? t('themePage.editTitle') : t('themePage.newTitle')} onClose={close}>
        <ThemeForm
          initial={editing || {}}
          onSubmit={handleSubmit}
          onCancel={close}
          submitLabel={editing ? t('themePage.saveChanges') : t('themePage.createTheme')}
        />
      </Modal>
    </div>
  );
}