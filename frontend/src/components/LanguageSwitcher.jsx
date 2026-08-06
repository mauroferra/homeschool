import { useTranslation } from 'react-i18next';
import { LANGUAGES, setLanguage } from '../i18n';

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  return (
    <label className="lang-switcher">
      <span className="lang-label">{t('language.label')}</span>
      <select
        className="lang-select"
        value={i18n.language}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label={t('language.label')}
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{t(l.labelKey)}</option>
        ))}
      </select>
    </label>
  );
}
