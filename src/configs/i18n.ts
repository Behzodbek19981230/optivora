import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// LocalStorage key used across the app to persist selected language
const LS_LANG_KEY = 'allGoodLanguage'

// Provide a safe default language on both server and client
const getDefaultLanguage = (): 'ru' | 'uz' => 'ru'

// Initialize i18n once (avoid re-initialization during HMR in dev)
if (!i18n.isInitialized) {
  i18n
    // Backend to load translation files
    .use(Backend)

    // Browser language detector; will read from localStorage, navigator, etc.
    .use(LanguageDetector)

    // React bindings
    .use(initReactI18next)
    .init({
      // Let the detector resolve the current language; keep a stable fallback
      fallbackLng: getDefaultLanguage(),
      supportedLngs: ['ru', 'uz'],
      nonExplicitSupportedLngs: true,
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: LS_LANG_KEY
      },
      backend: {
        // translation file path served from Next.js public folder
        loadPath: '/locales/{{lng}}.json'
      },
      debug: false,
      keySeparator: false,
      react: {
        useSuspense: false
      },
      interpolation: {
        escapeValue: false,
        formatSeparator: ','
      }
    })
}

export default i18n
