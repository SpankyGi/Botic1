// Runtime config loaded from /config.json — no build-time env vars needed.
// The file is served as a static asset from dist/ and can be edited on
// the server (Hostinger) without recompiling the app.

const CONFIG_URL = '/config.json'
const TIMEOUT_MS = 4000

// Singleton promise — the file is only fetched once per page session.
let configPromise = null

export function loadConfig() {
  if (configPromise) return configPromise

  configPromise = (async () => {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
    try {
      const r = await fetch(CONFIG_URL, { signal: ctrl.signal, cache: 'no-store' })
      if (!r.ok) return null
      const ct = r.headers.get('content-type') || ''
      if (ct.includes('text/html')) return null
      const cfg = await r.json()
      const url = (cfg?.menusApiUrl ?? '').trim()
      if (!url.startsWith('https://')) return null
      return { menusApiUrl: url }
    } catch {
      return null
    } finally {
      clearTimeout(timer)
    }
  })()

  return configPromise
}
