import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function AuthLayout({ children }) {
  const { t } = useTranslation();
  return (
    <div className="auth-layout">
      <div className="auth-brand">
        <span className="auth-badge">C·I</span>
        <h1>{t('app.title')}</h1>
        <p className="auth-tagline">{t('app.tagline')}</p>
        <LanguageSwitcher />
      </div>
      <div className="auth-card">{children}</div>
    </div>
  );
}
