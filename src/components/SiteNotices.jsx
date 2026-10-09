import { useEffect, useState, useRef } from 'react'
import { useLang } from '../i18n/LangContext'
import { loadConfig } from '../services/config'
import { activeNotices } from '../services/notices'
import './SiteNotices.css'
export default function SiteNotices() {
  const lang = useLang()
  const [notices, setNotices] = useState([])
  const bannerRef = useRef(null)
  const spacerRef = useRef(null)
  const visible = activeNotices(notices)
  const hasNotice = visible.length > 0
  useEffect(() => {
    if (!hasNotice) return
    const header = document.querySelector('.nav-header')
    const banner = bannerRef.current
    const spacer = spacerRef.current
    if (!header || !banner || !spacer) return
    const initialHeaderHeight = header.getBoundingClientRect().height
    const update = () => {
      const headerHeight = header.getBoundingClientRect().height
      const noticeHeight = banner.getBoundingClientRect().height
      banner.style.top = `${headerHeight}px`
      spacer.style.height = `${initialHeaderHeight + noticeHeight}px`
      document.documentElement.style.setProperty('--site-notice-height', `${noticeHeight}px`)
    }
    const observer = new ResizeObserver(update)
    observer.observe(header)
    observer.observe(banner)
    update()
    return () => { observer.disconnect(); document.documentElement.style.removeProperty('--site-notice-height') }
  }, [hasNotice])
  useEffect(() => {
    let stopped = false
    let controller
    let retry
    const cacheKey = 'botic_notices_v1'
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey) || 'null')
      if (cached && Date.now() - cached.savedAt < 10 * 60 * 1000 && Array.isArray(cached.notices)) setNotices(cached.notices)
    } catch { /* Storage may be unavailable. */ }
    const refresh = async () => {
      controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 30000)
      let delay = 60000
      try {
        const cfg = await loadConfig()
        if (stopped || !cfg?.menusApiUrl) return
        const response = await fetch(cfg.menusApiUrl, { signal: controller.signal, cache: 'no-store' })
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
  if (!visible.length) return null
  return <><div ref={spacerRef} className="site-notices-space" aria-hidden="true" /><aside ref={bannerRef} className="site-notices" aria-label={{ca:'Avisos',es:'Avisos',en:'Notices',fr:'Informations'}[lang]}>{visible.map(n => <p key={n.id}>{n[`nom_${lang}`] || n.nom_ca}</p>)}</aside></>
}
