export const LANGS = ['ca', 'es', 'en', 'fr']

export const DEFAULT_LANG = 'ca'

// Page keys → slug per language
export const ROUTE_SLUGS = {
  ca: {
    restaurant:  'restaurant',
    gastronomia: 'gastronomia',
    menus:       'menus',
    experiencia: 'experiencia',
    reserves:    'reserves',
    horaris:     'horaris',
  },
  es: {
    restaurant:  'restaurante',
    gastronomia: 'gastronomia',
    menus:       'menus',
    experiencia: 'experiencia',
    reserves:    'reservas',
    horaris:     'horarios',
  },
  fr: {
    restaurant:  'restaurant',
    gastronomia: 'gastronomie',
    menus:       'menus',
    experiencia: 'experience',
    reserves:    'reservations',
    horaris:     'horaires',
  },
  en: {
    restaurant:  'restaurant',
    gastronomia: 'gastronomy',
    menus:       'menus',
    experiencia: 'experience',
    reserves:    'reservations',
    horaris:     'hours',
  },
}

// Reverse lookup: given a lang and a URL slug, return the page key
export function slugToKey(lang, slug) {
  const map = ROUTE_SLUGS[lang] || {}
  return Object.keys(map).find((k) => map[k] === slug) || null
}

// Get the equivalent URL for the current page in another language
export function switchLangUrl(currentPath, fromLang, toLang) {
  // currentPath e.g. "/ca/restaurant" or "/ca"
  const parts = currentPath.split('/').filter(Boolean) // ['ca', 'restaurant']
  if (parts.length === 0) return `/${toLang}`
  const slugPart = parts[1] // 'restaurant'
  if (!slugPart) return `/${toLang}`
  const pageKey = slugToKey(fromLang, slugPart)
  if (!pageKey) return `/${toLang}`
  const newSlug = ROUTE_SLUGS[toLang][pageKey]
  return `/${toLang}/${newSlug}`
}
