import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import ActivityTemplateList from '../features/activities/ActivityTemplateList';
import ActivityForm from '../features/activities/ActivityForm';
import Modal from '../components/ui/Modal';
import { useActivityStore } from '../store/activityStore';
import { useThemeStore } from '../store/themeStore';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';

export default function UserSettingsPage() {
  const { templates, loadTemplates, createTemplate, updateTemplate, deleteTemplate } = useActivityStore();
  const { themes, loadThemes } = useThemeStore();
  const user = useAuthStore((s) => s.user);
  const [editing, setEditing] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    loadTemplates().catch(() => {});
    loadThemes().catch(() => {});
  }, []);

  const openCreate = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (tpl) => { setEditing(tpl); setModalOpen(true); };
  const close = () => { setModalOpen(false); setEditing(null); };

  const handleSubmit = async (payload) => {
    if (editing) await updateTemplate(editing.id, payload);
    else await createTemplate(payload);
    close();
  };

  const handleDelete = async (tpl) => {
    if (!window.confirm(`Delete template "${tpl.title}"?`)) return;
    await deleteTemplate(tpl.id);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg(''); setPwErr('');
    if (newPassword.length < 8) { setPwErr('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setPwErr('Passwords do not match.'); return; }
    setPwLoading(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setPwMsg('Password updated.');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setPwErr(err.message);
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-sub">Profile, password and reusable activity templates.</p>
        </div>
      </div>

      <div className="settings-tabs">
        <button type="button" className={`settings-tab ${tab === 0 ? 'active' : ''}`} onClick={() => setTab(0)}>Account</button>
        <button type="button" className={`settings-tab ${tab === 1 ? 'active' : ''}`} onClick={() => setTab(1)}>Templates ({templates.length})</button>
      </div>

      {tab === 0 ? (
        <div className="settings-grid">
          <Card className="profile-card">
            <h2 className="card-title">Profile</h2>
            <p className="profile-email">Signed in as <strong>{user?.email}</strong></p>
            <p className="profile-role">Role: {user?.role}</p>
          </Card>

          <Card>
            <h2 className="card-title">Change password</h2>
            <form className="form-stack" onSubmit={changePassword} noValidate>
              {pwMsg && <div className="alert alert-success">{pwMsg}</div>}
              {pwErr && <div className="alert alert-error">{pwErr}</div>}
              <Input name="currentPassword" type="password" label="Current password" autoComplete="current-password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
              <Input name="newPassword" type="password" label="New password" autoComplete="new-password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              <Input name="confirmPassword" type="password" label="Confirm new password" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              <Button type="submit" loading={pwLoading}>Update password</Button>
            </form>
          </Card>
        </div>
      ) : (
        <div>
          <div className="page-header">
            <h2 className="card-title">Activity templates</h2>
            <Button icon="plus" onClick={openCreate}>New template</Button>
          </div>
          <ActivityTemplateList activities={templates} onEdit={openEdit} onDelete={handleDelete} />
        </div>
      )}

      <Modal open={modalOpen} title={editing ? 'Edit template' : 'New template'} onClose={close}>
        <ActivityForm
          initial={editing || {}}
          themes={themes}
          onSubmit={handleSubmit}
          onCancel={close}
          submitLabel={editing ? 'Save changes' : 'Create template'}
        />
      </Modal>
    </div>
  );
}