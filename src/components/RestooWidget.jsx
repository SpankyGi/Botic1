import { useEffect, useId, useRef, useState } from 'react'

let loader
function loadWidget() {
  if (window.Restoo) return Promise.resolve()
  if (!loader) loader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = 'https://bo-tic.myrestoo.net/js/restoo-widget'
    script.onload = () => window.Restoo ? resolve() : reject(new Error('Restoo unavailable'))
    script.onerror = () => { script.remove(); loader = null; reject(new Error('Restoo load failed')) }
    document.head.appendChild(script)
  })
  return loader
}

export default function RestooWidget({ lang, title, onReady }) {
  const id = `botic-restoo-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const host = useRef(null)
  const ready = useRef(onReady)
  ready.current = onReady
  const [events, setEvents] = useState([])
  const preview = typeof window !== 'undefined' && !['bo-tic.com', 'www.bo-tic.com'].includes(window.location.hostname)
  useEffect(() => {
    let disposed = false
    let widget
    const node = host.current
    const consent = () => {
      let choice = {}
      try { choice = JSON.parse(localStorage.getItem('botic-cookie-consent-v1')) || {} } catch { /* denied by default */ }
      widget?.setConsent({
        analytics_storage: !preview && choice.analytics === true ? 'granted' : 'denied',
        ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
        functionality_storage: 'granted', personalization_storage: 'denied', security_storage: 'granted',
      })
    }
    const message = (event) => {
      const frame = node?.querySelector('iframe')
      if (event.origin !== 'https://bo-tic.myrestoo.net' || event.source !== frame?.contentWindow || event.data?.type !== 'restoo:event') return
      const name = event.data.detail?.eventName
      if (typeof name !== 'string') return
      ready.current()
      // Preview diagnostics contain event names only, never customer details.
      if (preview) setEvents(previous => [...previous.slice(-9), name])
    }
    window.addEventListener('message', message)
    window.addEventListener('botic:consent-changed', consent)
    loadWidget().then(() => {
      if (disposed) return
      widget = window.Restoo('bo-tic', { widgetId: id }).create({
        options: { view: 'reservation', language: lang },
        connect: { gtm: false, googleAds: false, metaPixel: false, tiktokPixel: false, openaiPixel: false, ...(preview ? { ga4: false } : {}) },
      })
      consent()
      widget.mount(id)
      const frame = node.querySelector('iframe')
      if (frame) frame.title = title
    }).catch(() => { if (!disposed) ready.current() })
    return () => {
      disposed = true
      window.removeEventListener('message', message)
      window.removeEventListener('botic:consent-changed', consent)
      node?.replaceChildren()
    }
  }, [id, lang, preview, title])
  return <>
    <div className="restoo-booking-host" id={id} ref={host} />
    {preview && <details style={{ padding: 16, fontSize: 12 }}><summary>Prova Restoo · enviament a Analytics desactivat</summary><p>{events.length ? events.join(' → ') : 'Esperant esdeveniments del widget…'}</p></details>}
  </>
}
