import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import cs from './locales/cs/translation.json';
import it from './locales/it/translation.json';

export const LANGUAGES = [
  { code: 'en', labelKey: 'language.en' },
  { code: 'cs', labelKey: 'language.cs' },
  { code: 'it', labelKey: 'language.it' },
];

const STORAGE_KEY = 'hs-lang';

export function getStoredLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && LANGUAGES.some((l) => l.code === saved)) return saved;
  } catch {
    // ignore
  }
  const nav = navigator.language?.slice(0, 2);
  if (nav === 'cs' || nav === 'it') return nav;
  return 'en';
}

export function setLanguage(code) {
  i18n.changeLanguage(code);
  try {
    localStorage.setItem(STORAGE_KEY, code);
  } catch {
    // ignore
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    cs: { translation: cs },
    it: { translation: it },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  supportedLngs: ['en', 'cs', 'it'],
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

export function toLocaleTag(code) {
  const map = { en: 'en-GB', cs: 'cs-CZ', it: 'it-IT' };
  return map[code] || 'en-GB';
}

export function t(key, options) {
  return i18n.t(key, options);
}

export default i18n;
