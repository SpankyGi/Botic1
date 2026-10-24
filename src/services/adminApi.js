import { loadConfig } from './config'
async function requestOnce(payload) {
  const config = await loadConfig()
  if (!config?.adminApiUrl) throw new Error('El panell encara no està connectat. Cal completar la configuració de l’accés.')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), payload.action === 'save' ? 45000 : 20000)
  try {
    // The public GET feed and admin POST share an Apps Script deployment.
    // Give each admin operation its own URL so redirected responses cannot be reused.
    const url = new URL(config.adminApiUrl)
    url.searchParams.set('admin_request', crypto.randomUUID())
    const response = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload), signal: controller.signal, redirect: 'follow', cache: 'no-store',
    })
    if (!response.ok) throw new Error('No s’ha pogut comunicar amb Google Sheets.')
    const result = await response.json()
    if (!result || typeof result.ok !== 'boolean') throw new Error('La resposta de Google no conté la confirmació de l’operació.')
    if (!result.ok) {
      const error = new Error(typeof result.error === 'string' ? result.error : result.message || 'Google ha rebutjat l’operació.')
      error.confirmedRejection = !result.uncertain
      error.code = result.code
      if (result.code === 'CONFLICT') error.snapshot = result.snapshot
      throw error
    }
    if (['login', 'read', 'save'].includes(payload.action) && (!result.snapshot?.revision || !['menus', 'seccions', 'grups', 'plats', 'avisos'].every(table => Array.isArray(result.snapshot?.data?.[table])))) throw new Error('Google ha retornat unes dades incompletes. No s’ha confirmat l’operació.')
    if (payload.action === 'login' && (typeof result.token !== 'string' || !result.token)) throw new Error('Google no ha confirmat l’accés.')
    return result
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Google no ha confirmat la resposta. Recarrega les dades abans de repetir un canvi.')
    throw error
  } finally { clearTimeout(timer) }
}

// ContentService can lose its response redirect and return the public GET feed.
// Saves may be retried only with the v2 durable receipt protocol and the SAME ID.
export async function adminRequest(payload, request = requestOnce, pause = ms => new Promise(resolve => setTimeout(resolve, ms))) {
  const attempts = ['login', 'read'].includes(payload.action) || (payload.action === 'save' && payload.requestId && payload.recordRevision) ? 3 : 1
  for (let attempt = 0; attempt < attempts; attempt++) {
    try { return await request(payload) }
    catch (error) {
      if (error.confirmedRejection || attempt === attempts - 1) throw error
      await pause(500 * (attempt + 1))
    }
  }
}

// Never repeat a write after an uncertain response: read the saved record instead.
export async function saveAdminRecord(payload, request = adminRequest) {
  try {
    const result = await request(payload)
    if (payload.requestId && result.requestId !== payload.requestId) throw new Error('No s’ha rebut el comprovant del desament.')
    if (!recordMatches(result, payload)) throw Object.assign(new Error('El desament consta registrat, però el contingut actual és diferent. Conservem els teus textos perquè puguis revisar-los.'), { confirmedRejection: true })
    return result
  } catch (error) {
    if (error.confirmedRejection) throw error
    let current
    try { current = await request({ action: 'read', token: payload.token, ...(payload.requestId ? {requestId: payload.requestId} : {}) }) }
    catch (readError) {
      if (readError.code === 'SESSION_EXPIRED') throw readError
      throw new Error('No hem pogut confirmar el desament. Conservem els textos i el mateix identificador per comprovar-lo quan tornis a desar.')
    }
    if (recordMatches(current, payload) && (!payload.requestId || (current.receipt?.requestId === payload.requestId && current.receipt.state === 'done'))) return current
    throw new Error('No s’ha confirmat el canvi. Conservem els teus textos i el comprovant per tornar-ho a comprovar sense duplicar el desament.')
  }
}
function recordMatches(result, payload) {
    const record = result.snapshot?.data?.[payload.table]?.find(row => row.id === payload.id)
    return record && Object.entries(payload.values).every(([key, value]) => {
      const saved = record[key]
      if (key === 'actiu') return (saved === true || saved === 'CERT') === (value === 'CERT')
      return String(saved ?? '') === String(value ?? '')
    })
}
