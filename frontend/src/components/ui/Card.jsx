export default function Card({ as: Tag = 'div', className = '', children, onClick, ...rest }) {
  return (
    <Tag className={`card ${onClick ? 'card-clickable' : ''} ${className}`} onClick={onClick} {...rest}>
      {children}
    </Tag>
  );
}