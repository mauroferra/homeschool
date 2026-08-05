import Icon from './Icon';

export default function Button({ variant = 'primary', size = 'md', icon, loading, children, className = '', type = 'button', disabled, ...rest }) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <span className="btn-spinner" aria-hidden="true" /> : null}
      {icon && !loading ? <Icon name={icon} size={size === 'sm' ? 16 : 20} /> : null}
      {children != null ? <span>{children}</span> : null}
    </button>
  );
}