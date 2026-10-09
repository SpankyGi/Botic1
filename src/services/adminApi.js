import { loadConfig } from './config'
export async function adminRequest(payload) {
  const config = await loadConfig()
  if (!config?.adminApiUrl) throw new Error('El panell encara no està connectat. Cal completar la configuració de l’accés.')
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 30000)
  try {
    const response = await fetch(config.adminApiUrl, {
      method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload), signal: controller.signal, redirect: 'follow',
    })
    if (!response.ok) throw new Error('No s’ha pogut comunicar amb Google Sheets.')
    const result = await response.json()
    if (!result.ok) throw new Error(result.error || 'No s’ha pogut completar l’operació.')
    return result
  } catch (error) {
    if (error.name === 'AbortError') throw new Error('Google no ha confirmat la resposta. Recarrega les dades abans de repetir un canvi.')
    throw error
  } finally { clearTimeout(timer) }
}
