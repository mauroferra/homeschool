import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function AuthLayout({ children, authHint }) {
  const { t } = useTranslation();
  return (
    <div className="auth-layout">
      <div className="auth-bg" aria-hidden="true" />
      <div className="auth-deco" aria-hidden="true" />
      <div className="auth-content">
        <div className="auth-brand">
          <div className="auth-badge-wrap">
            <img src="/favicon.svg" alt="" className="auth-badge" />
          </div>
          <h1>{t('app.title')}</h1>
          <p className="auth-tagline">{t('app.tagline')}</p>
        </div>
        <div className="auth-card">{children}</div>
        {authHint && <p className="auth-hint">{authHint}</p>}
      </div>
    </div>
  );
}
