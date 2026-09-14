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
  win.dataLayer = win.dataLayer || []
  const gtag = (...args) => win.dataLayer.push(args)
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
    if (!consent.analytics) lastPage = ''
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
    const previous = lastPage
    lastPage = pathname
    event('page_view', {
      page_location: win.location.origin + pathname,
      page_path: pathname,
      page_referrer: previous ? win.location.origin + previous : '',
      language: pathname.split('/')[1] || 'ca',
    })
  }
  return { applyConsent, event, page, get started() { return started } }
}
