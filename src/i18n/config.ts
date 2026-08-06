import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import urTranslations from './locales/ur.json';
import hiTranslations from './locales/hi.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  ur: {
    translation: urTranslations,
  },
  hi: {
    translation: hiTranslations,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false, // زبان چینج ہوتے ہی انسٹنٹ ری رینڈر کرے گا
    },
  });

// RTL layout اور Font Management
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ur' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
  document.dir = dir;

  if (lng === 'ur') {
    document.body.style.fontFamily = "'Noto Nastaliq Urdu', serif, system-ui";
  } else {
    document.body.style.fontFamily = '';
  }
});

export default i18n;