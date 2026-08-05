import { Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import LoginForm from '../features/auth/LoginForm';
import { useAuthStore } from '../store/authStore';

export default function LoginPage() {
  const token = useAuthStore((s) => s.token);
  if (token) return <Navigate to="/week" replace />;
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}