const SUPPORTED = ['en', 'cs', 'it'];

export function localized(record, field, lang = '') {
  if (!record) return '';
  const code = SUPPORTED.includes(lang) ? lang : '';
  const value = code && record[`${field}_${code}`];
  return value || record[field] || '';
}