export function activeNotices(notices, now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year:'numeric',month:'2-digit',day:'2-digit' }).formatToParts(now)
  const p = Object.fromEntries(parts.map(v => [v.type, v.value]))
  const today = `${p.year}-${p.month}-${p.day}`
  return (Array.isArray(notices) ? notices : []).filter(n => {
    const start = n.inici || '', end = n.fi || ''
    return (n.actiu === true || n.actiu === 'CERT') && n.nom_ca &&
      (!start || /^\d{4}-\d{2}-\d{2}$/.test(start) && start <= today) &&
      (!end || /^\d{4}-\d{2}-\d{2}$/.test(end) && end >= today)
  }).sort((a,b) => Number(a.ordre) - Number(b.ordre))
}
