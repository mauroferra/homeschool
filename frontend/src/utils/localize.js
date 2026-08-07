import { useTranslation } from 'react-i18next';

const SUPPORTED = ['en', 'cs', 'it'];

export function localize(record, field, lang = '') {
  if (!record) return '';
  const code = SUPPORTED.includes(lang) ? lang : '';
  const value = code && record[`${field}_${code}`];
  return value || record[field] || '';
}

export function useLocalized() {
  const { i18n } = useTranslation();
  const lang = i18n.language ? i18n.language.slice(0, 2) : 'en';
  return (record, field) => localize(record, field, lang);
}

export default localize;