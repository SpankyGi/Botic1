import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang, useLangRoutes } from '../i18n/LangContext'

const KEY = 'botic-cookie-consent-v1'
const ConsentContext = createContext({ openPreferences: () => {} })

const COPY = {
  ca: { intro: 'Utilitzem cookies necessàries per al funcionament del web i, amb el vostre consentiment, cookies d’analítica i màrqueting per entendre’n l’ús i millorar l’experiència.', link: 'Política de cookies', accept: 'Acceptar totes', reject: 'Rebutjar', rejectAll: 'Rebutjar totes', configure: 'Configurar', title: 'Preferències de cookies', save: 'Acceptar selecció', necessary: 'Necessàries', analytics: 'Analítica', marketing: 'Màrqueting', necessaryText: 'Funcionament tècnic, seguretat, idioma i record de la vostra decisió.', analyticsText: 'Google Analytics 4 i Microsoft Clarity per entendre l’ús del web.', marketingText: 'Meta Pixel per mesurar campanyes de màrqueting.', always: 'Sempre actives', close: 'Tancar preferències' },
  es: { intro: 'Utilizamos cookies necesarias para el funcionamiento de la web y, con su consentimiento, cookies de analítica y marketing para entender su uso y mejorar la experiencia.', link: 'Política de cookies', accept: 'Aceptar todas', reject: 'Rechazar', rejectAll: 'Rechazar todas', configure: 'Configurar', title: 'Preferencias de cookies', save: 'Aceptar selección', necessary: 'Necesarias', analytics: 'Analítica', marketing: 'Marketing', necessaryText: 'Funcionamiento técnico, seguridad, idioma y recuerdo de su decisión.', analyticsText: 'Google Analytics 4 y Microsoft Clarity para entender el uso de la web.', marketingText: 'Meta Pixel para medir campañas de marketing.', always: 'Siempre activas', close: 'Cerrar preferencias' },
  en: { intro: 'We use necessary cookies to operate this website and, with your consent, analytics and marketing cookies to understand its use and improve the experience.', link: 'Cookie policy', accept: 'Accept all', reject: 'Reject', rejectAll: 'Reject all', configure: 'Settings', title: 'Cookie preferences', save: 'Accept selection', necessary: 'Necessary', analytics: 'Analytics', marketing: 'Marketing', necessaryText: 'Technical operation, security, language and saving your choice.', analyticsText: 'Google Analytics 4 and Microsoft Clarity to understand website use.', marketingText: 'Meta Pixel to measure marketing campaigns.', always: 'Always active', close: 'Close preferences' },
  fr: { intro: 'Nous utilisons des cookies nécessaires au fonctionnement du site et, avec votre consentement, des cookies d’analyse et de marketing pour comprendre son utilisation et améliorer l’expérience.', link: 'Politique de cookies', accept: 'Tout accepter', reject: 'Refuser', rejectAll: 'Tout refuser', configure: 'Configurer', title: 'Préférences de cookies', save: 'Accepter la sélection', necessary: 'Nécessaires', analytics: 'Analyse', marketing: 'Marketing', necessaryText: 'Fonctionnement technique, sécurité, langue et mémorisation de votre choix.', analyticsText: 'Google Analytics 4 et Microsoft Clarity pour comprendre l’usage du site.', marketingText: 'Meta Pixel pour mesurer les campagnes marketing.', always: 'Toujours actives', close: 'Fermer les préférences' },
}

function updateGoogleConsent(consent) {
  window.dataLayer = window.dataLayer || []
  window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments) }
  window.gtag('consent', 'update', {
    analytics_storage: consent.analytics ? 'granted' : 'denied',
    ad_storage: consent.marketing ? 'granted' : 'denied',
    ad_user_data: consent.marketing ? 'granted' : 'denied',
    ad_personalization: consent.marketing ? 'granted' : 'denied',
  })
}

function addScript(id, src) {
  if (!src || document.getElementById(id)) return
  const script = document.createElement('script')
  script.id = id
  script.async = true
  script.src = src
  document.head.appendChild(script)
}

function loadOptionalServices(consent) {
  updateGoogleConsent(consent)
  const gaId = import.meta.env.VITE_GA4_ID
  const clarityId = import.meta.env.VITE_CLARITY_ID
  const metaId = import.meta.env.VITE_META_PIXEL_ID
  if (consent.analytics && gaId) {
    addScript('botic-ga4', `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`)
    window.gtag('js', new Date())
    window.gtag('config', gaId, { anonymize_ip: true })
  }
  if (consent.analytics && clarityId && !window.clarity) {
    window.clarity = (...args) => { (window.clarity.q = window.clarity.q || []).push(args) }
    addScript('botic-clarity', `https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`)
  }
  if (consent.marketing && metaId && !window.fbq) {
    window.fbq = (...args) => { (window.fbq.q = window.fbq.q || []).push(args) }
    window.fbq('init', metaId)
    window.fbq('track', 'PageView')
    addScript('botic-meta-pixel', 'https://connect.facebook.net/en_US/fbevents.js')
  }
}

export function useCookiePreferences() { return useContext(ConsentContext) }

export default function CookieConsent() {
  const lang = useLang()
  const routes = useLangRoutes()
  const copy = COPY[lang] || COPY.ca
  const [stored, setStored] = useState(() => { try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null } })
  const [open, setOpen] = useState(false)
  const [choices, setChoices] = useState(() => stored || { analytics: false, marketing: false })
  const panelRef = useRef(null)

  useEffect(() => {
    window.dataLayer = window.dataLayer || []
    window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments) }
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
    if (stored) loadOptionalServices(stored)
  }, []) // initial default must precede every optional integration

  useEffect(() => {
    const show = () => setOpen(true)
    window.addEventListener('botic:cookie-preferences', show)
    return () => window.removeEventListener('botic:cookie-preferences', show)
  }, [])
  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    panelRef.current?.querySelector('button')?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const save = (value) => {
    const next = { analytics: Boolean(value.analytics), marketing: Boolean(value.marketing), updatedAt: new Date().toISOString() }
    localStorage.setItem(KEY, JSON.stringify(next))
    setStored(next); setChoices(next); setOpen(false); loadOptionalServices(next)
  }
  const context = { openPreferences: () => { setChoices(stored || { analytics: false, marketing: false }); setOpen(true) } }

  return <ConsentContext.Provider value={context}>
    {!stored && !open && <aside className="cookie-banner" aria-label={copy.title}>
      <p>{copy.intro} <Link to={routes.cookies}>{copy.link}</Link></p>
      <div><button onClick={() => save({ analytics: true, marketing: true })}>{copy.accept}</button><button onClick={() => save({ analytics: false, marketing: false })}>{copy.reject}</button><button onClick={() => setOpen(true)}>{copy.configure}</button></div>
    </aside>}
    {open && <div className="cookie-panel-backdrop" role="presentation"><section className="cookie-panel" ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="cookie-preferences-title">
      <button className="cookie-close" onClick={() => setOpen(false)} aria-label={copy.close}>×</button><h2 id="cookie-preferences-title">{copy.title}</h2>
      <CookieRow title={copy.necessary} text={copy.necessaryText} checked disabled label={copy.always} />
      <CookieRow title={copy.analytics} text={copy.analyticsText} checked={choices.analytics} onChange={(analytics) => setChoices({ ...choices, analytics })} />
      <CookieRow title={copy.marketing} text={copy.marketingText} checked={choices.marketing} onChange={(marketing) => setChoices({ ...choices, marketing })} />
      <div className="cookie-panel-actions"><button onClick={() => save(choices)}>{copy.save}</button><button onClick={() => save({ analytics: false, marketing: false })}>{copy.rejectAll}</button><button onClick={() => save({ analytics: true, marketing: true })}>{copy.accept}</button></div>
    </section></div>}
  </ConsentContext.Provider>
}

function CookieRow({ title, text, checked, disabled, label, onChange }) {
  return <div className="cookie-row"><div><h3>{title}</h3><p>{text}</p></div><label className="cookie-switch"><input type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange?.(event.target.checked)} /><span /><b>{label}</b></label></div>
}
