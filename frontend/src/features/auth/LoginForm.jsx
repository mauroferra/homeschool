import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuthStore } from '../../store/authStore';
import { validateEmail, validateRequired } from '../../utils/validationHelpers';

export default function LoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!validateRequired(email)) next.email = t('login.emailRequired');
    else if (!validateEmail(email)) next.email = t('login.emailInvalid');
    if (!validateRequired(password)) next.password = t('login.passwordRequired');
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      navigate('/week', { replace: true });
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={onSubmit} noValidate>
      <h2>{t('login.welcome')}</h2>
      {apiError && <div className="alert alert-error" role="alert">{apiError}</div>}
      <Input
        name="email"
        type="email"
        label={t('login.email')}
        autoComplete="email"
        placeholder={t('login.emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Input
        name="password"
        type={showPassword ? 'text' : 'password'}
        label={t('login.password')}
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <div className="field-switch">
        <label className="switch">
          <input
            type="checkbox"
            checked={showPassword}
            onChange={(e) => setShowPassword(e.target.checked)}
          />
          <span className="switch-slider" />
          <span className="switch-label">{t('login.showPassword')}</span>
        </label>
      </div>
      <Button type="submit" loading={loading} className="btn-block">{t('login.submit')}</Button>
      <p className="auth-link">
        <Link to="/reset">{t('login.forgot')}</Link>
      </p>
    </form>
  );
}
