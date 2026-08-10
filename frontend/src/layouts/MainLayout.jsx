import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Icon from '../components/ui/Icon';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useAuthStore } from '../store/authStore';

const links = [
  { to: '/week', label: 'nav.week', icon: 'week', match: ['/week', '/activity'] },
  { to: '/themes', label: 'nav.themes', icon: 'palette', match: ['/themes'] },
  { to: '/progress', label: 'nav.progress', icon: 'progress', match: ['/progress'] },
  { to: '/settings', label: 'nav.settings', icon: 'settings', match: ['/settings'] },
];

export function MobileNav() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  return (
    <nav className="mobile-nav" aria-label={t('nav.ariaPrimary')}>
      {links.map((l) => {
        const active = l.match.some((p) => pathname.startsWith(p));
        return (
          <NavLink key={l.to} to={l.to} className={`mobile-nav-link ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined}>
            <Icon name={l.icon} size={22} />
            <span>{t(l.label)}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default function MainLayout({ children }) {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleClick = (e, to) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    if (to === '/week') navigate(`/week`); 
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/week" className="brand" onClick={(e) => handleClick(e, '/week')}>
          <img src="/favicon.svg" alt="" className="brand-badge" />
          <span className="brand-name">{t('app.name')}</span>
        </NavLink>
        <nav className="desktop-nav" aria-label={t('nav.ariaMain')}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `desk-nav-link ${isActive ? 'active' : ''}`}>
              <Icon name={l.icon} size={18} />
              {t(l.label)}
            </NavLink>
          ))}
        </nav>
        <div className="header-right">
          <LanguageSwitcher />
          {token && (
            <button type="button" className="btn-icon logout-btn" onClick={handleLogout} aria-label={t('nav.logout')} title={t('nav.logout')}>
              <Icon name="logout" size={20} />
            </button>
          )}
        </div>
      </header>
      <main className="main-content">{children}</main>
      <MobileNav />
    </div>
  );
}
