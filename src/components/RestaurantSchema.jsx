import { useLangRoutes } from '../i18n/LangContext'

export const MAP_URL = 'https://www.google.com/maps?cid=12708467331371854168'

export function restaurantEntity(routes) {
  const base = 'https://bo-tic.com'
  return {
    '@type': 'Restaurant', '@id': `${base}/#restaurant`,
    name: 'Bo.TiC', legalName: 'Bo.TiC Alta Gastronomia S.L.',
    url: `${base}${routes.home}`, telephone: '+34972630869',
    email: 'restaurant@bo-tic.com', priceRange: '€€€€',
    image: `${base}/images/restaurant-botic-corca-emporda-facana-nit.webp`,
    logo: `${base}/images/botic-logo-original.webp`,
    menu: `${base}${routes.menus}`, acceptsReservations: `${base}${routes.reserves}`,
    servesCuisine: ['Catalan', 'Creative'], award: '2 Michelin stars',
    address: { '@type': 'PostalAddress', streetAddress: 'Av. Costa Brava, 6',
      addressLocality: 'Corçà', postalCode: '17121', addressRegion: 'Girona', addressCountry: 'ES' },
    geo: { '@type': 'GeoCoordinates', latitude: 41.987884, longitude: 3.0159912 },
    hasMap: MAP_URL,
    sameAs: ['https://www.instagram.com/restaurantbo.tic/',
      'https://www.facebook.com/RestaurantBo.TiC', 'https://x.com/restaurantBoTiC',
      'https://guide.michelin.com/es/es/catalunya/corca/restaurante/bo-tic',
      'https://www.guiarepsol.com/es/fichas/restaurante/botic-9041/'],
    employee: { '@type': 'Person', name: 'Albert Sastregener', jobTitle: 'Chef' },
  }
}

export default function RestaurantSchema() {
  const routes = useLangRoutes()
  const data = { '@context': 'https://schema.org', '@graph': [restaurantEntity(routes),
    { '@type': 'WebSite', '@id': 'https://bo-tic.com/#website', url: 'https://bo-tic.com/',
      name: 'Bo.TiC', inLanguage: ['ca', 'es', 'en', 'fr'], publisher: { '@id': 'https://bo-tic.com/#restaurant' } },
  ] }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
}
