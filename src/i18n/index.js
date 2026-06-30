import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import ca from './locales/ca.json'
import es from './locales/es.json'
import fr from './locales/fr.json'
import en from './locales/en.json'

i18n
  .use(initReactI18next)
  .init({
    lng: 'ca',
    fallbackLng: 'ca',
    resources: {
      ca: { translation: ca },
      es: { translation: es },
      fr: { translation: fr },
      en: { translation: en },
    },
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  })

export default i18n
