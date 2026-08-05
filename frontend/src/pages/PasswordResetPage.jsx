import { useEffect, useState } from 'react';
import AuthLayout from '../layouts/AuthLayout';
import PasswordResetForm from '../features/auth/PasswordResetForm';

export default function PasswordResetPage() {
  return (
    <AuthLayout>
      <PasswordResetForm />
    </AuthLayout>
  );
}