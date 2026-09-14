import { createContext, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ROUTE_SLUGS, LANGS, DEFAULT_LANG, switchLangUrl } from './routes'

const LangContext = createContext(DEFAULT_LANG)

export function useLang() {
  return useContext(LangContext)
}

export function useLangRoutes() {
  const lang = useLang()
  const slugs = ROUTE_SLUGS[lang] || ROUTE_SLUGS[DEFAULT_LANG]
  return {
    home:        `/${lang}`,
    restaurant:  `/${lang}/${slugs.restaurant}`,
    gastronomia: `/${lang}/${slugs.gastronomia}`,
    menus:       `/${lang}/${slugs.menus}`,
    experiencia: `/${lang}/${slugs.experiencia}`,
    reserves:    `/${lang}/${slugs.reserves}`,
    horaris:     `/${lang}/${slugs.horaris}`,
    legal:       `/${lang}/${slugs.legal}`,
    privacy:     `/${lang}/${slugs.privacy}`,
    cookies:     `/${lang}/${slugs.cookies}`,
    preferences: `/${lang}/${slugs.preferences}`,
  }
}

export function useSwitchLang() {
  const lang = useLang()
  return (toLang, currentPath) => switchLangUrl(currentPath, lang, toLang)
}

export function LangProvider({ lang, children }) {
  const { i18n } = useTranslation()

  useEffect(() => {
    if (LANGS.includes(lang) && i18n.language !== lang) {
      i18n.changeLanguage(lang)
    }
    document.documentElement.lang = lang
  }, [lang, i18n])

  return (
    <LangContext.Provider value={lang}>
      {children}
    </LangContext.Provider>
  )
}
