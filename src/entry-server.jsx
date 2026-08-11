import React from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import i18n from './i18n/index.js'
import App from './App.jsx'
import { DEFAULT_LANG, LANGS, ROUTE_SLUGS, slugToKey } from './i18n/routes.js'

export const BASE_URL = 'https://www.bo-tic.com'
const DEFAULT_OG_IMAGE = `${BASE_URL}/images/restaurant-botic-emporda-hero.webp`
const OG_IMAGES = {
  menus: `${BASE_URL}/images/plat-cenital-botic.jpg`,
  restaurant: DEFAULT_OG_IMAGE,
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
  const content = translation?.seo?.[pageKey] || translation?.seo?.home
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
