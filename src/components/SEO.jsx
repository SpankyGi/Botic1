import { useEffect } from 'react'
import { useLang } from '../i18n/LangContext'
import { ROUTE_SLUGS, LANGS } from '../i18n/routes'

const BASE_URL = 'https://www.bo-tic.com'

// Map page key to canonical path segment per language
const PAGE_SLUGS = {
  home:        { ca: '', es: '', fr: '', en: '' },
  restaurant:  ROUTE_SLUGS,
  gastronomia: ROUTE_SLUGS,
  menus:       ROUTE_SLUGS,
  experiencia: ROUTE_SLUGS,
  reserves:    ROUTE_SLUGS,
  horaris:     ROUTE_SLUGS,
}

function buildCanonical(lang, pageKey) {
  const slug = pageKey === 'home' ? '' : (ROUTE_SLUGS[lang]?.[pageKey] ?? '')
  return slug ? `${BASE_URL}/${lang}/${slug}` : `${BASE_URL}/${lang}`
}

export default function SEO({ title, description, pageKey, ogImage }) {
  const lang = useLang()

  useEffect(() => {
    if (title) document.title = title

    const setMeta = (key, value, isProperty = false) => {
      if (!value) return
      const attr = isProperty ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${key}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, key)
        document.head.appendChild(el)
      }
      el.setAttribute('content', value)
    }

    setMeta('description', description)
    setMeta('og:title', title, true)
    setMeta('og:description', description, true)
    if (ogImage) setMeta('og:image', ogImage, true)

    // Canonical
    const canonical = pageKey ? buildCanonical(lang, pageKey) : null
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]')
      if (!link) {
        link = document.createElement('link')
        link.setAttribute('rel', 'canonical')
        document.head.appendChild(link)
      }
      link.setAttribute('href', canonical)
    }

    // hreflang alternates
    if (pageKey) {
      // Remove existing hreflang links
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => el.remove())

      LANGS.forEach(l => {
        const href = buildCanonical(l, pageKey)
        const el = document.createElement('link')
        el.setAttribute('rel', 'alternate')
        el.setAttribute('hreflang', l)
        el.setAttribute('href', href)
        document.head.appendChild(el)
      })

      // x-default → CA
      const xdef = document.createElement('link')
      xdef.setAttribute('rel', 'alternate')
      xdef.setAttribute('hreflang', 'x-default')
      xdef.setAttribute('href', buildCanonical('ca', pageKey))
      document.head.appendChild(xdef)
    }
  }, [title, description, pageKey, lang, ogImage])

  return null
}
