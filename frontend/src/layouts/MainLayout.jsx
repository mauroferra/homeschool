import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import Icon from '../components/ui/Icon';
import { useAuthStore } from '../store/authStore';

const links = [
  { to: '/week', label: 'Week', icon: 'week', match: ['/week', '/activity'] },
  { to: '/themes', label: 'Themes', icon: 'palette', match: ['/themes'] },
  { to: '/progress', label: 'Progress', icon: 'progress', match: ['/progress'] },
  { to: '/settings', label: 'Settings', icon: 'settings', match: ['/settings'] },
];

export function MobileNav() {
  const { pathname } = useLocation();
  return (
    <nav className="mobile-nav" aria-label="Primary">
      {links.map((l) => {
        const active = l.match.some((p) => pathname.startsWith(p));
        return (
          <NavLink key={l.to} to={l.to} className={`mobile-nav-link ${active ? 'active' : ''}`} aria-current={active ? 'page' : undefined}>
            <Icon name={l.icon} size={22} />
            <span>{l.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default function MainLayout({ children }) {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
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
          <span className="brand-badge">C·I</span>
          <span className="brand-name">Curriculum</span>
        </NavLink>
        <nav className="desktop-nav" aria-label="Main">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `desk-nav-link ${isActive ? 'active' : ''}`}>
              <Icon name={l.icon} size={18} />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-right">
          {token && (
            <button type="button" className="btn-icon logout-btn" onClick={handleLogout} aria-label="Log out" title="Log out">
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