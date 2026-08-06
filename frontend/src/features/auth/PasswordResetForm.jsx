import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { authService } from '../../services/authService';
import { validateEmail, validateRequired } from '../../utils/validationHelpers';

export default function PasswordResetForm() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setApiError('');
    const next = {};
    if (!validateRequired(email)) next.email = t('reset.emailRequired');
    else if (!validateEmail(email)) next.email = t('reset.emailInvalid');
    setErrors(next);
    if (Object.keys(next).length) return;
    setLoading(true);
    try {
      const res = await authService.resetPassword(email);
      setMessage(res.resetLink ? t('reset.devLink', { link: res.resetLink }) : t('reset.sent'));
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2>{t('reset.title')}</h2>
      {message && <div className="alert alert-success" role="alert">{message}</div>}
      {apiError && <div className="alert alert-error" role="alert">{apiError}</div>}
      <Input
        name="email"
        type="email"
        label={t('reset.email')}
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Button type="submit" loading={loading} className="btn-block">{t('reset.submit')}</Button>
      <p className="auth-link"><Link to="/login">{t('reset.backToLogin')}</Link></p>
    </form>
  );
}