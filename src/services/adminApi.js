import { loadConfig } from './config'
export async function adminRequest(payload) {
  const config = await loadConfig()
  if (!config?.adminApiUrl) throw new Error('El panell encara no està connectat. Cal completar la configuració de l’accés.')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 45000)
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
      error.confirmedRejection = true
      throw error
    }
    return result
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Google no ha confirmat la resposta. Recarrega les dades abans de repetir un canvi.')
    throw error
  } finally { clearTimeout(timer) }
}

// Never repeat a write after an uncertain response: read the saved record instead.
export async function saveAdminRecord(payload, request = adminRequest) {
  try {
    return await request(payload)
  } catch (error) {
    if (error.confirmedRejection) throw error
    let current
    try { current = await request({ action: 'read', token: payload.token }) }
    catch { throw new Error('No hem pogut confirmar el desament. Conservem els textos: comprova les dades abans de tornar a desar.') }
    const record = current.snapshot?.data?.[payload.table]?.find(row => row.id === payload.id)
    const matches = record && Object.entries(payload.values).every(([key, value]) => {
      const saved = record[key]
      if (key === 'actiu') return (saved === true || saved === 'CERT') === (value === 'CERT')
      return String(saved ?? '') === String(value ?? '')
    })
    if (matches) return current
    const conflict = new Error('No s’ha confirmat el canvi. Les dades s’han tornat a llegir; conservem els teus textos perquè els revisis abans de desar.')
    conflict.snapshot = current.snapshot
    throw conflict
  }
}
