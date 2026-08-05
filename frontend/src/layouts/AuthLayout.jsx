export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-brand">
        <span className="auth-badge">C·I</span>
        <h1>Czech · Italian Curriculum</h1>
        <p className="auth-tagline">Bilingual learning, one calm planner.</p>
      </div>
      <div className="auth-card">{children}</div>
    </div>
  );
}