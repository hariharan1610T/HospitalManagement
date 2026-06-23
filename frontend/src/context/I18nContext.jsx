import { useEffect, useMemo, useState } from 'react';
import { defaultLang, dictionaries, supportedLanguages } from '../i18n/dictionaries';
import { I18nContext } from './I18nContextStore';

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const stored = localStorage.getItem('lang');
    const supported = supportedLanguages.some((language) => language.code === stored);
    return supported ? stored : defaultLang;
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = useMemo(() => {
    return (key) =>
      dictionaries[lang]?.[key] ??
      dictionaries[defaultLang]?.[key] ??
      key;
  }, [lang]);

  return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
}
