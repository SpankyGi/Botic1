import { useState, useEffect, useMemo } from 'react'
import { useLang } from '../i18n/LangContext'
import { getCachedMenus, setCachedMenus } from '../services/menusCache'
import { loadConfig } from '../services/config'
import fallback from '../data/generated/menus.json'

// Module-level flag: prevents React 18 StrictMode from firing two concurrent fetches
let fetchInProgress = false

function validateApiData(data) {
  if (!data || typeof data !== 'object') throw new Error('Resposta no és un objecte')
  if (!Array.isArray(data.menus))  throw new Error('menus no és un array')
  if (!Array.isArray(data.groups)) throw new Error('groups no és un array')
  if (!Array.isArray(data.dishes)) throw new Error('dishes no és un array')
  // sections és opcional (APIs antigues poden no tenir-lo)
  if (data.sections !== undefined && !Array.isArray(data.sections)) {
    throw new Error('sections no és un array')
  }
  for (const m of data.menus) {
    if (!m.id || typeof m.id !== 'string') throw new Error('Menú sense id vàlid')
  }
  const uniqueIds = (arr, nom) => {
    const ids = arr.map(r => r.id).filter(Boolean)
    if (new Set(ids).size !== ids.length) throw new Error(`IDs duplicats a ${nom}`)
  }
  uniqueIds(data.menus,  'menus')
  uniqueIds(data.groups, 'groups')
  uniqueIds(data.dishes, 'dishes')
  if (data.sections) uniqueIds(data.sections, 'sections')
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const _ok   = v => v !== false && String(v).toUpperCase() !== 'FALSE'
const _name = (item, lang) => item[`name_${lang}`] || item.name_ca || ''
const _sort = (a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)

function _mapDish(d, lang) {
  return {
    name:        d[`name_${lang}`]        || d.name_ca        || '',
    description: d[`description_${lang}`] || d.description_ca || '',
    allergens:   d.allergens  || '',
    supplement:  d.supplement || '',
  }
}

function _mapGroup(group, menuId, lang, dishes) {
  return {
    id:    group.id,
    title: _name(group, lang),
    items: dishes
      .filter(d => d.menu_id === menuId && d.group_id === group.id && _ok(d.active))
      .sort(_sort)
      .map(d => _mapDish(d, lang)),
  }
}

// ─── normalizeMenus ────────────────────────────────────────────────────────────
//
// Retorna: [ { id, price, sections: [ { id, title, groups, flat } ] } ]
//
// Amb sections a l'API: 3 nivells → secció → grup → plats
// Sense sections (API antiga): 2 nivells → els grups actuen de seccions (flat: true)
//
// flat: true → el grup i la secció tenen el mateix títol,
//              la UI mostra els plats directament (sense accordion de grup)

export function normalizeMenus(data, lang) {
  if (!data?.menus) return []
  const { menus = [], sections = [], groups = [], dishes = [] } = data

  return menus
    .filter(m => _ok(m.active))
    .sort(_sort)
    .map(menu => {
      const mGroups   = groups  .filter(g => g.menu_id === menu.id && _ok(g.active)).sort(_sort)
      const mSections = sections.filter(s => s.menu_id === menu.id && _ok(s.active)).sort(_sort)

      let resolvedSections

      if (mSections.length > 0) {
        // ── 3 nivells: secció → grup → plats ──────────────────────────────
        resolvedSections = mSections.map(sec => {
          const title     = _name(sec, lang)
          const secGroups = mGroups
            .filter(g => (g.section_id || g.seccio_id) === sec.id)
            .sort(_sort)
            .map(g => _mapGroup(g, menu.id, lang, dishes))
          // flat: la secció conté un sol grup amb el mateix títol → UI col·lapsa el nivell del grup
          const flat = secGroups.length === 1 && secGroups[0].title === title
          return { id: sec.id, title, groups: secGroups, flat }
        })
      } else {
        // ── 2 nivells fallback: cada grup es converteix en secció plana ───
        resolvedSections = mGroups.map(g => {
          const grp = _mapGroup(g, menu.id, lang, dishes)
          return { id: g.id, title: grp.title, groups: [grp], flat: true }
        })
      }

      return { id: menu.id, price: menu.price || '', sections: resolvedSections }
    })
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useMenusData() {
  const lang = useLang()

  const [rawData, setRawData] = useState(() => getCachedMenus() || fallback)

  useEffect(() => {
    if (getCachedMenus()) return   // cache vàlida — no cal fetch
    if (fetchInProgress)  return   // StrictMode guard

    fetchInProgress = true
    let cancelled = false
    const ctrl  = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 8000)

    loadConfig()
      .then(cfg => {
        if (cancelled || !cfg?.menusApiUrl) return
        return fetch(cfg.menusApiUrl, { signal: ctrl.signal, cache: 'no-store' })
          .then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`)
            const ct = r.headers.get('content-type') || ''
            if (ct.includes('text/html')) throw new Error("Resposta HTML rebuda de l'API")
            return r.json()
          })
          .then(data => {
            if (cancelled) return
            if (data?.error === true) throw new Error(data.message || "Error a l'API de menús")
            validateApiData(data)
            setCachedMenus(data)
            setRawData(data)
          })
      })
      .catch(err => {
        if (import.meta.env.DEV && !ctrl.signal.aborted) {
          console.warn('[useMenusData] No s\'ha pogut carregar l\'API de menús:', err.message)
        }
        // Manté rawData (cache o fallback) — mai pantalla buida
      })
      .finally(() => {
        clearTimeout(timer)
        fetchInProgress = false
      })

    return () => {
      cancelled = true
      ctrl.abort()
      clearTimeout(timer)
      fetchInProgress = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return useMemo(() => normalizeMenus(rawData, lang), [rawData, lang])
}
