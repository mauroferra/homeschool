import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../features/auth/LoginForm';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const { t } = useTranslation();
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/week" replace />;
  return (
    <AuthLayout authHint={t('login.hint')}>
      <LoginForm />
    </AuthLayout>
  );
}