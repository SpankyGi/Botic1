import { useEffect, useState, useRef } from 'react'
import { useLang } from '../i18n/LangContext'
import { loadConfig } from '../services/config'
import { activeNotices } from '../services/notices'
import './SiteNotices.css'
const cacheKey = 'botic_notices_v1'
function cachedNotices() {
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null')
    if (cached && Date.now() - cached.savedAt < 10 * 60 * 1000 && Array.isArray(cached.notices)) return cached.notices
  } catch { /* Storage is unavailable during prerender or private browsing. */ }
  return []
}
export default function SiteNotices() {
  const lang = useLang()
  const [notices, setNotices] = useState(cachedNotices)
  const dialogRef = useRef(null)
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem('botic_notice_dismissed') || '' } catch { return '' }
  })
  const visible = activeNotices(notices)
  const signature = JSON.stringify(visible.map(n => [n.id, n.inici, n.fi, n.nom_ca, n.nom_es, n.nom_en, n.nom_fr]))
  const isOpen = visible.length > 0 && signature !== dismissed
  const copy = {
    ca: { title: 'Informació per a la vostra visita', close: 'Tancar', button: 'Entès' },
    es: { title: 'Información para vuestra visita', close: 'Cerrar', button: 'Entendido' },
    en: { title: 'Information for your visit', close: 'Close', button: 'Got it' },
    fr: { title: 'Informations pour votre visite', close: 'Fermer', button: 'Bien compris' },
  }[lang] || { title: 'Informació per a la vostra visita', close: 'Tancar', button: 'Entès' }
  const dismiss = () => {
    setDismissed(signature)
    try { sessionStorage.setItem('botic_notice_dismissed', signature) } catch { /* Optional session memory. */ }
  }
  useEffect(() => {
    const dialog = dialogRef.current
    if (!isOpen || !dialog) return
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])
  useEffect(() => {
    let stopped = false
    let controller
    let retry
    const refresh = async () => {
      controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 30000)
      let delay = 60000
      try {
        const cfg = await loadConfig()
        if (stopped || !cfg?.menusApiUrl) return
        const url = new URL(cfg.menusApiUrl)
        url.searchParams.set('resource', 'notices')
        const response = await fetch(url, { signal: controller.signal, cache: 'no-store' })
        if (!response.ok) throw new Error('No es poden carregar els avisos')
        const data = await response.json()
        if (!Array.isArray(data.notices)) throw new Error('Resposta d’avisos no vàlida')
        if (stopped) return
        setNotices(data.notices)
        try { localStorage.setItem(cacheKey, JSON.stringify({notices:data.notices,savedAt:Date.now()})) } catch { /* Optional cache. */ }
      } catch { delay = 15000 } finally {
        clearTimeout(timer)
        if (!stopped) retry = setTimeout(refresh, delay)
      }
    }
    refresh()
    return () => { stopped = true; controller?.abort(); clearTimeout(retry) }
  }, [])
  if (!isOpen) return null
  return (
    <dialog ref={dialogRef} className="site-notice-dialog" aria-labelledby="site-notice-title" onCancel={(event) => { event.preventDefault(); dismiss() }}>
      <button type="button" className="site-notice-close" aria-label={copy.close} onClick={dismiss} autoFocus>×</button>
      <span className="site-notice-brand">Bo·TiC</span>
      <h2 id="site-notice-title">{copy.title}</h2>
      <div className="site-notice-content">{visible.map(n => <p key={n.id}>{n[`nom_${lang}`] || n.nom_ca}</p>)}</div>
      <button type="button" className="site-notice-confirm" onClick={dismiss}>{copy.button}</button>
    </dialog>
  )
}
