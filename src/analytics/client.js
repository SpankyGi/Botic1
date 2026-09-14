import { createTracking } from './tracking'
let tracker
export function getTracking() {
  if (typeof window === 'undefined') return null
  if (!tracker) tracker = createTracking({
    win: window, doc: document,
    gtmId: import.meta.env.VITE_GTM_ID,
    gaId: import.meta.env.VITE_GA4_ID,
    enabled: import.meta.env.VITE_ANALYTICS_ENABLED === 'true'
      && (['bo-tic.com', 'www.bo-tic.com'].includes(window.location.hostname)
        || import.meta.env.VITE_ANALYTICS_DEBUG === 'true'),
  })
  return tracker
}

export function clearTrackingCookies() {
  const hostname = window.location.hostname
  const parts = hostname.split('.')
  const domains = ['', ...parts.map((_, i) => parts.slice(i).join('.')).filter(d => d.includes('.'))]
  const paths = ['/', ...window.location.pathname.split('/').filter(Boolean).map((_, i, all) => '/' + all.slice(0, i + 1).join('/'))]
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0]
    if (!/^(_ga($|_)|_gid$|_gat|_gcl_|_fbp$|_fbc$|_clck$|_clsk$)/.test(name)) continue
    for (const domain of domains) for (const path of paths) {
      document.cookie = `${name}=; Max-Age=0; path=${path}${domain ? `; domain=${domain}` : ''}`
    }
  }
}
