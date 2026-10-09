import { useEffect, useState } from 'react'
import { useLang } from '../i18n/LangContext'
import { loadConfig } from '../services/config'
import { activeNotices } from '../services/notices'
export default function SiteNotices() {
  const lang = useLang()
  const [notices, setNotices] = useState([])
  useEffect(() => {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 8000)
    loadConfig().then(cfg => cfg?.menusApiUrl ? fetch(cfg.menusApiUrl, { signal: controller.signal, cache: 'no-store' }) : null)
      .then(r => r?.ok ? r.json() : null).then(data => { if (!controller.signal.aborted) setNotices(data?.notices || []) }).catch(() => {}).finally(() => clearTimeout(timer))
    return () => { controller.abort(); clearTimeout(timer) }
  }, [])
  const visible = activeNotices(notices)
  if (!visible.length) return null
  return <aside className="site-notices" aria-label={{ca:'Avisos',es:'Avisos',en:'Notices',fr:'Informations'}[lang]}>{visible.map(n => <p key={n.id}>{n[`nom_${lang}`] || n.nom_ca}</p>)}</aside>
}
