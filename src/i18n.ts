import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import your translation files
import enTranslation from './locales/en/translation.json';
import arTranslation from './locales/ar/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: enTranslation
      },
      ar: {
        translation: arTranslation
      }
    },
    fallbackLng: 'en', // fallback language if user's language is not available
    debug: true, // set to false in production
    interpolation: {
      escapeValue: false, // react already escapes by default
    },
    detection: {
      order: ['navigator', 'localStorage', 'cookie', 'sessionStorage', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    }
  });

export default i18n;
