export function classifyLink(href, origin) {
  let url
  try { url = new URL(href, origin) } catch { return null }
  if (url.protocol === 'tel:') return { event: 'phone_click' }
  if (url.protocol === 'mailto:') return { event: 'email_click' }
  if (!['http:', 'https:'].includes(url.protocol)) return null
  if (url.hostname === 'bo-tic.myrestoo.net') {
    return { event: /\/(tienda|shop|store)(\/|$)/.test(url.pathname) ? 'gift_click' : 'reservation_click', destination: 'myrestoo' }
  }
  if (['maps.google.com', 'www.google.com', 'google.com'].includes(url.hostname) && (url.hostname === 'maps.google.com' || url.pathname.startsWith('/maps'))) return { event: 'directions_click' }
  if (url.origin === origin && (/\/(reserves|reservas|reservations)\/?$/.test(url.pathname) || url.hash === '#reserva')) return { event: 'reservation_click', destination: url.hash === '#reserva' ? 'booking_section' : 'booking_page' }
  return null
}

export function createTracking({ win, doc, gtmId = '', gaId = '', enabled = false }) {
  const gtm = /^GTM-[A-Z0-9]+$/.test(gtmId) ? gtmId : ''
  const ga = /^G-[A-Z0-9]+$/.test(gaId) ? gaId : ''
  let consent = { analytics: false, marketing: false }
  let started = false
  let lastPage = ''
  let lastLocation = ''
  // Keep campaign attribution without forwarding arbitrary query parameters
  // (booking details, email addresses, tokens) to Analytics.
  const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_id', 'utm_term', 'utm_content', 'gclid', 'dclid', 'gbraid', 'wbraid']
  const landingSearch = new URLSearchParams(win.location.search || '')
  function safeLocation(pathname, search) {
    const url = new URL(pathname, win.location.origin)
    url.search = ''
    url.hash = ''
    for (const key of campaignKeys) {
      const value = search.get(key)
      if (value) url.searchParams.set(key, value)
    }
    return url.href
  }
  let landingReferrer = ''
  try {
    const ref = new URL(doc.referrer)
    if (['https:', 'http:'].includes(ref.protocol)) landingReferrer = ref.origin + ref.pathname
  } catch { /* Direct visits have no referrer. */ }
  win.dataLayer = win.dataLayer || []
  function gtag() { win.dataLayer.push(arguments) }
  win.gtag = gtag
  const states = (choice) => ({
    analytics_storage: choice.analytics ? 'granted' : 'denied',
    ad_storage: choice.marketing ? 'granted' : 'denied',
    ad_user_data: choice.marketing ? 'granted' : 'denied',
    ad_personalization: choice.marketing ? 'granted' : 'denied',
  })
  gtag('consent', 'default', states(consent))
  function applyConsent(choice) {
    consent = { analytics: choice.analytics === true, marketing: choice.marketing === true }
    gtag('consent', 'update', states(consent))
    if (!consent.analytics) { lastPage = ''; lastLocation = '' }
    if (!enabled || (!gtm && !ga)) return
    win.dataLayer.push({ event: 'botic_consent', botic_analytics: consent.analytics, botic_marketing: consent.marketing })
    if (started || (!consent.analytics && !(gtm && consent.marketing))) return
    started = true
    const script = doc.createElement('script')
    script.async = true
    if (gtm) {
      win.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' })
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtm)}`
    } else {
      gtag('js', new Date())
      gtag('config', ga, { send_page_view: false })
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga)}`
    }
    doc.head.appendChild(script)
  }
  function event(name, params = {}) {
    if (!enabled || !started || !consent.analytics) return
    if (gtm) win.dataLayer.push({ event: `botic_${name}`, ...params })
    else gtag('event', name, params)
  }
  function page(pathname) {
    if (!consent.analytics || !started || pathname === lastPage) return
    const previous = lastLocation
    const location = safeLocation(pathname, lastPage ? new URLSearchParams(win.location.search || '') : landingSearch)
    lastPage = pathname
    lastLocation = location
    event('page_view', {
      page_location: location,
      page_path: pathname,
      page_referrer: previous || landingReferrer,
      language: pathname.split('/')[1] || 'ca',
    })
  }
  return { applyConsent, event, page, get started() { return started } }
}
