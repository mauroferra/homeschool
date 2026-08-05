import { forwardRef } from 'react';

export const Input = forwardRef(function Input({ label, error, hint, id, className = '', ...rest }, ref) {
  const inputId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && <label className="field-label" htmlFor={inputId}>{label}</label>}
      <input id={inputId} ref={ref} className={`input ${error ? 'input-error' : ''}`} {...rest} />
      {hint && !error && <p className="field-hint">{hint}</p>}
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
});

export const Select = forwardRef(function Select({ label, error, options, placeholder, id, className = '', children, ...rest }, ref) {
  const inputId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && <label className="field-label" htmlFor={inputId}>{label}</label>}
      <select id={inputId} ref={ref} className={`input select ${error ? 'input-error' : ''}`} {...rest}>
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options
          ? options.map((opt) => {
              const value = typeof opt === 'object' ? opt.value : opt;
              const text = typeof opt === 'object' ? opt.label : opt;
              return <option key={value} value={value}>{text}</option>;
            })
          : children}
      </select>
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
});

export const TextArea = forwardRef(function TextArea({ label, error, id, className = '', ...rest }, ref) {
  const inputId = id || rest.name;
  return (
    <div className={`field ${className}`}>
      {label && <label className="field-label" htmlFor={inputId}>{label}</label>}
      <textarea id={inputId} ref={ref} className={`input textarea ${error ? 'input-error' : ''}`} {...rest} />
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  );
});