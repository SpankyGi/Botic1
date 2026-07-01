import { useState, useEffect, useMemo } from 'react'
import { useLang } from '../i18n/LangContext'
import { getCachedMenus, setCachedMenus } from '../services/menusCache'
import fallback from '../data/generated/menus.json'

const API_URL = import.meta.env.VITE_MENUS_API_URL || ''

// Module-level flag: prevents React 18 StrictMode from firing two concurrent fetches
let fetchInProgress = false

function validateApiData(data) {
  if (!data || typeof data !== 'object') throw new Error('Resposta no és un objecte')
  if (!Array.isArray(data.menus))  throw new Error('menus no és un array')
  if (!Array.isArray(data.groups)) throw new Error('groups no és un array')
  if (!Array.isArray(data.dishes)) throw new Error('dishes no és un array')
  for (const m of data.menus) {
    if (!m.id || typeof m.id !== 'string') throw new Error('Menú sense id vàlid')
  }
  const uniqueIds = (arr, name) => {
    const ids = arr.map(r => r.id).filter(Boolean)
    if (new Set(ids).size !== ids.length) throw new Error(`IDs duplicats a ${name}`)
  }
  uniqueIds(data.menus,  'menus')
  uniqueIds(data.groups, 'groups')
  uniqueIds(data.dishes, 'dishes')
}

export function normalizeMenus(data, lang) {
  if (!data?.menus) return []
  const { menus = [], groups = [], dishes = [] } = data

  return menus
    .filter(m => m.active !== false && String(m.active).toUpperCase() !== 'FALSE')
    .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
    .map(menu => {
      const menuGroups = groups
        .filter(g => g.menu_id === menu.id && g.active !== false && String(g.active).toUpperCase() !== 'FALSE')
        .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))

      const sections = menuGroups.map(group => {
        const items = dishes
          .filter(d =>
            d.menu_id === menu.id &&
            d.group_id === group.id &&
            d.active !== false &&
            String(d.active).toUpperCase() !== 'FALSE'
          )
          .sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0))
          .map(d => ({
            name: d[`name_${lang}`] || d.name_ca || '',
            description: d[`description_${lang}`] || d.description_ca || '',
            allergens: d.allergens || '',
            supplement: d.supplement || '',
          }))

        return {
          title: group[`name_${lang}`] || group.name_ca || '',
          items,
        }
      })

      return {
        id:    menu.id,
        price: menu.price || '',
        sections,
      }
    })
}

export function useMenusData() {
  const lang = useLang()

  const [rawData, setRawData] = useState(() => getCachedMenus() || fallback)

  useEffect(() => {
    if (!API_URL) return
    if (getCachedMenus()) return   // cache fresh — skip fetch entirely
    if (fetchInProgress) return    // StrictMode guard — only one fetch at a time

    fetchInProgress = true
    const ctrl  = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)

    fetch(API_URL, { signal: ctrl.signal, cache: 'no-store' })
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        // Reject HTML error pages (Apps Script redirects / auth errors return text/html)
        const ct = r.headers.get('content-type') || ''
        if (ct.includes('text/html')) throw new Error(`Resposta HTML rebuda de l'API`)
        return r.json()
      })
      .then(data => {
        // Apps Script may return {error:true, message:"..."} with HTTP 200 + JSON
        if (data?.error === true) throw new Error(data.message || 'Error a l\'API de menús')
        validateApiData(data)
        setCachedMenus(data)
        setRawData(data)
      })
      .catch(err => {
        if (import.meta.env.DEV) {
          console.warn('[useMenusData] No s\'ha pogut carregar l\'API de menús:', err.message)
        }
        // Keep current rawData (cache or fallback) — no UI error shown
      })
      .finally(() => {
        clearTimeout(timer)
        fetchInProgress = false
      })

    return () => {
      ctrl.abort()
      clearTimeout(timer)
      fetchInProgress = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return useMemo(() => normalizeMenus(rawData, lang), [rawData, lang])
}
