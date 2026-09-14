import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import i18n from './i18n/index.js'
import App from './App.jsx'
import { DEFAULT_LANG, LANGS, ROUTE_SLUGS, slugToKey } from './i18n/routes.js'

export const BASE_URL = 'https://www.bo-tic.com'
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/restaurant-botic-emporda-hero.webp`
const OG_IMAGES = {
  menus: `${BASE_URL}/images/plat-cenital-botic.webp`,
  restaurant: DEFAULT_OG_IMAGE,
}
const LEGAL_SEO = {
  ca: { legal: ['Avís legal · Bo.TiC', 'Informació legal de Bo.TiC.'], privacy: ['Política de privacitat · Bo.TiC', 'Informació sobre el tractament de dades personals a Bo.TiC.'], cookies: ['Política de cookies · Bo.TiC', 'Informació sobre les cookies i preferències de consentiment de Bo.TiC.'] },
  es: { legal: ['Aviso legal · Bo.TiC', 'Información legal de Bo.TiC.'], privacy: ['Política de privacidad · Bo.TiC', 'Información sobre el tratamiento de datos personales en Bo.TiC.'], cookies: ['Política de cookies · Bo.TiC', 'Información sobre cookies y preferencias de consentimiento de Bo.TiC.'] },
  en: { legal: ['Legal notice · Bo.TiC', 'Legal information for Bo.TiC.'], privacy: ['Privacy policy · Bo.TiC', 'Information about personal-data processing at Bo.TiC.'], cookies: ['Cookie policy · Bo.TiC', 'Information about cookies and consent preferences at Bo.TiC.'] },
  fr: { legal: ['Mentions légales · Bo.TiC', 'Informations légales de Bo.TiC.'], privacy: ['Politique de confidentialité · Bo.TiC', 'Informations sur le traitement des données personnelles chez Bo.TiC.'], cookies: ['Politique de cookies · Bo.TiC', 'Informations sur les cookies et préférences de consentement de Bo.TiC.'] },
}

function routeDetails(url) {
  const parts = url.split('?')[0].split('/').filter(Boolean)
  const lang = LANGS.includes(parts[0]) ? parts[0] : DEFAULT_LANG
  const pageKey = parts[1] ? slugToKey(lang, parts[1]) : 'home'
  return { lang, pageKey: pageKey || 'home' }
}

function pathFor(lang, pageKey) {
  const slug = pageKey === 'home' ? '' : ROUTE_SLUGS[lang][pageKey]
  return slug ? `/${lang}/${slug}/` : `/${lang}/`
}

export function getStaticSeo(url) {
  const { lang, pageKey } = routeDetails(url)
  const translation = i18n.getResourceBundle(lang, 'translation')
  const legal = LEGAL_SEO[lang]?.[pageKey]
  const content = legal ? { title: legal[0], description: legal[1] } : (translation?.seo?.[pageKey] || translation?.seo?.home)
  const canonical = `${BASE_URL}${pathFor(lang, pageKey)}`

  return {
    lang,
    pageKey,
    title: content.title,
    description: content.description,
    canonical,
    ogImage: OG_IMAGES[pageKey] || DEFAULT_OG_IMAGE,
    alternates: LANGS.map(locale => ({
      lang: locale,
      href: `${BASE_URL}${pathFor(locale, pageKey)}`,
    })),
  }
}

export async function render(url) {
  const { lang } = routeDetails(url)
  if (i18n.language !== lang) await i18n.changeLanguage(lang)

  return renderToString(
    <React.StrictMode>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </React.StrictMode>,
  )
}
