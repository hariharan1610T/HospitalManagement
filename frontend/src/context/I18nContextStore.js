import { createContext } from 'react';
import { defaultLang } from '../i18n/dictionaries';

export const I18nContext = createContext({
  lang: defaultLang,
  setLang: () => {},
  t: (key) => key,
});
