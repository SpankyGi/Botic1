import { useEffect, useRef, useState } from 'react'

const COPY = {
  ca: ['Carregant les reserves…', 'Si el formulari no es carrega, podeu reservar directament a Restoo.', 'Obrir les reserves'],
  es: ['Cargando las reservas…', 'Si el formulario no se carga, puede reservar directamente en Restoo.', 'Abrir las reservas'],
  en: ['Loading reservations…', 'If the form does not load, you can book directly with Restoo.', 'Open reservations'],
  fr: ['Chargement des réservations…', 'Si le formulaire ne se charge pas, vous pouvez réserver directement sur Restoo.', 'Ouvrir les réservations'],
}
let loader
function loadRestoo() {
  if (window.Restoo) return Promise.resolve()
  if (!loader) loader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const finish = (error) => {
      clearTimeout(timeout)
      window.removeEventListener('restoo:loaded', ready)
      script.onerror = null
      if (error) { script.remove(); loader = undefined; reject(error) } else resolve()
    }
    const ready = () => finish()
    const timeout = setTimeout(() => finish(new Error('Restoo timeout')), 20000)
    window.addEventListener('restoo:loaded', ready, { once: true })
    script.type = 'module'
    script.src = 'https://bo-tic.myrestoo.net/js/restoo-widget'
    script.onerror = () => finish(new Error('Restoo unavailable'))
    document.head.appendChild(script)
  })
  return loader
}

export default function RestooBooking({ lang }) {
  const host = useRef(null)
  const [loading, setLoading] = useState(true)
  const copy = COPY[lang] || COPY.ca
  useEffect(() => {
    let cancelled = false
    let widget
    const container = host.current
    setLoading(true)
    const loadingTimeout = setTimeout(() => { if (!cancelled) setLoading(false) }, 25000)
    const consent = (event) => {
      let choice = event?.detail
      if (!choice) { try { choice = JSON.parse(localStorage.getItem('botic-cookie-consent-v1')) } catch { /* Deny optional storage. */ } }
      widget?.setConsent({
        analytics_storage: choice?.analytics === true ? 'granted' : 'denied',
        ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
        functionality_storage: 'denied', personalization_storage: 'denied', security_storage: 'granted',
      })
    }
    window.addEventListener('botic:consent-changed', consent)
    loadRestoo().then(() => {
      if (cancelled) return
      const production = ['bo-tic.com', 'www.bo-tic.com'].includes(window.location.hostname)
      widget = window.Restoo('bo-tic', { widgetId: 'botic-reservations' }).create({
        options: { language: lang, view: 'reservation' },
        connect: { googleAds: false, metaPixel: false, tiktokPixel: false, ...(!production ? { ga4: false, gtm: false } : {}) },
      })
      consent()
      widget.mount(container.id)
      const frame = container.querySelector('iframe')
      if (frame) {
        frame.loading = 'eager'
        frame.title = copy[2]
        frame.addEventListener('load', () => { if (!cancelled) setLoading(false) }, { once: true })
      }
    }).catch(() => { if (!cancelled) setLoading(false) })
    return () => {
      cancelled = true
      clearTimeout(loadingTimeout)
      window.removeEventListener('botic:consent-changed', consent)
      // Restoo removes disconnected instances on the next mount.
      container.replaceChildren()
    }
  }, [lang])
  return <div className="restoo-booking">
    {loading && <p role="status">{copy[0]}</p>}
    <div id="botic-reservations" className="restoo-booking-host" ref={host} />
    <p className="restoo-booking-fallback">{copy[1]} <a href={`https://bo-tic.myrestoo.net/${lang}/reservar`}>{copy[2]} ↗</a></p>
  </div>
}
