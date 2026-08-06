import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Icon from './Icon';

export default function FileUploader({ files = [], onChange, label, disabled, api }) {
  const { t } = useTranslation();
  const displayLabel = label || t('fileUploader.attachments');
  const inputRef = useRef(null);
  const [localFiles, setLocalFiles] = useState([]);
  const current = localFiles.length ? localFiles : files;

  const handleFiles = (fileList) => {
    const arr = Array.from(fileList || []);
    setLocalFiles([...localFiles, ...arr]);
    onChange?.([...current, ...arr]);
    if (inputRef.current) inputRef.current.value = '';
  };

  const remove = (idx) => {
    const next = current.filter((_, i) => i !== idx);
    setLocalFiles(next.filter((f) => typeof f === 'object' && f.name));
    onChange?.(next);
  };

  return (
    <div className="field">
      <label className="field-label">{displayLabel}</label>
      <div className="file-list">
        {current.length === 0 && <p className="file-empty">{t('fileUploader.empty')}</p>}
        {current.map((f, idx) => {
          const name = typeof f === 'string' ? f.split('/').pop() : f.name;
          return (
            <div className="file-item" key={`${name}-${idx}`}>
              <Icon name="file" size={18} />
              <span className="file-name">{name}</span>
              <button type="button" className="btn-icon" onClick={() => remove(idx)} aria-label={t('fileUploader.remove')}>
                <Icon name="close" size={16} />
              </button>
            </div>
          );
        })}
      </div>
      <button type="button" className="btn btn-secondary btn-sm file-trigger" disabled={disabled} onClick={() => inputRef.current?.click()}>
        <Icon name="plus" size={18} /> {t('fileUploader.addFile')}
      </button>
      <input ref={inputRef} type="file" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
    </div>
  );
}