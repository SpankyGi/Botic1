const CACHE_KEY    = 'botic_menus_v1'
const CACHE_TTL_MS = 10 * 60 * 1000  // 10 minutes

export function getCachedMenus() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, savedAt } = JSON.parse(raw)
    if (!data || Date.now() - savedAt > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    return data
  } catch {
    return null
  }
}

export function setCachedMenus(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, savedAt: Date.now() }))
  } catch {
    // localStorage unavailable (private browsing, quota exceeded) — silently ignore
  }
}

export function clearMenusCache() {
  try { localStorage.removeItem(CACHE_KEY) } catch {}
}
