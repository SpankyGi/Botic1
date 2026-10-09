import { useEffect, useState } from 'react'
import { adminRequest } from '../services/adminApi'
import { clearMenusCache } from '../services/menusCache'
import './Admin.css'

const languages = { ca: 'Català', es: 'Castellà', fr: 'Francès', en: 'Anglès' }
const isActive = value => value === true || value === 'CERT'

function EditRecord({ record, table, onSave, busy, onCancel }) {
  const [draft, setDraft] = useState({ ...record })
  const change = (key, value) => setDraft(d => ({ ...d, [key]: value }))
  const save = e => {
    e.preventDefault()
    const keys = ['ordre', 'actiu', ...Object.keys(languages).map(l => `nom_${l}`)]
    if (table === 'menus') keys.push('preu')
    if (table === 'plats') keys.push(...Object.keys(languages).map(l => `descripcio_${l}`), 'allergens', 'suplement')
    if (table === 'avisos') keys.push('inici', 'fi')
    onSave(table, record.id, Object.fromEntries(keys.map(k => [k, k === 'actiu' ? (isActive(draft[k]) ? 'CERT' : 'FALS') : ['ordre', 'preu', 'suplement'].includes(k) ? (k === 'suplement' && !draft[k] ? '' : Number(draft[k])) : String(draft[k] ?? '')])))
  }
  return <form className="admin-editor" onSubmit={save}>
    <h2>{record.nom_ca || 'Editar contingut'}</h2>
    <div className="admin-options">
      <label className="admin-check"><input type="checkbox" checked={isActive(draft.actiu)} onChange={e => change('actiu', e.target.checked ? 'CERT' : 'FALS')} /> Visible a la web</label>
      <label>Ordre<input type="number" min="1" required value={draft.ordre} onChange={e => change('ordre', e.target.value)} /></label>
      {table === 'menus' && <label>Preu (€)<input type="number" min="0.01" step="0.01" required value={draft.preu} onChange={e => change('preu', e.target.value)} /></label>}
    </div>
    <div className="admin-languages">{Object.entries(languages).map(([lang, name]) => <fieldset key={lang}>
      <legend>{name}</legend>
      <label>{table === 'avisos' ? 'Text de l’avís' : 'Nom / text'}<textarea rows={3} value={draft[`nom_${lang}`] ?? ''} onChange={e => change(`nom_${lang}`, e.target.value)} /></label>
      {table === 'plats' && <label>Descripció (opcional)<textarea rows={2} value={draft[`descripcio_${lang}`] ?? ''} onChange={e => change(`descripcio_${lang}`, e.target.value)} /></label>}
    </fieldset>)}</div>
    {table === 'avisos' && <div className="admin-options"><label>Des del dia<input type="date" value={draft.inici || ''} onChange={e => change('inici', e.target.value)} /></label><label>Fins al dia (inclòs)<input type="date" value={draft.fi || ''} onChange={e => change('fi', e.target.value)} /></label><p>Horari de l’Empordà. Deixa les dates buides si no té límit.</p></div>}
    {table === 'plats' && <div className="admin-options"><label>Al·lèrgens<input value={draft.allergens || ''} onChange={e => change('allergens', e.target.value)} /></label><label>Suplement (€)<input type="number" min="0" step="0.01" value={draft.suplement ?? ''} onChange={e => change('suplement', e.target.value)} /></label></div>}
    <div className="admin-actions"><button type="submit" disabled={busy}>{busy ? 'Desant…' : 'Desar canvis'}</button><button className="secondary" type="button" disabled={busy} onClick={onCancel}>Cancel·lar</button></div>
    <p className="admin-help">En desar, el canvi s’aplica al web quan es renova la memòria cau (fins a 10 minuts). Els camps buits d’un idioma es mantenen buits.</p>
  </form>
}

export default function Admin() {
  const [session, setSession] = useState(null)
  const [snapshot, setSnapshot] = useState(null)
  const [menu, setMenu] = useState('degustacio')
  const [edit, setEdit] = useState(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  useEffect(() => {
    document.title = 'Administració · Bo.TiC'
    let meta = document.querySelector('meta[name="robots"]')
    const previous = meta?.content
    if (!meta) { meta = document.createElement('meta'); meta.name = 'robots'; document.head.appendChild(meta) }
    meta.content = 'noindex, nofollow'
    return () => { if (previous != null) meta.content = previous; else meta.remove() }
  }, [])
  useEffect(() => {
    if (!edit) return
    const warn = e => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [edit])
  const run = async task => { setBusy(true); setError(''); setMessage(''); try { await task() } catch (e) { setError(e.message) } finally { setBusy(false) } }
  const login = e => {
    e.preventDefault()
    const form = e.currentTarget, fields = new FormData(form)
    run(async () => { const result = await adminRequest({ action: 'login', user: fields.get('user'), password: fields.get('password') }); form.reset(); setSession(result.token); setSnapshot(result.snapshot) })
  }
  const save = (table, id, values) => run(async () => {
    const result = await adminRequest({ action: 'save', token: session, revision: snapshot.revision, table, id, values })
    setSnapshot(result.snapshot); setEdit(null); clearMenusCache(); setMessage('Canvis desats i confirmats a Google Sheets.')
  })
  const choose = (table, record) => { setEdit({ table, record }); setError(''); setMessage('') }
  const row = (table, record) => <li key={record.id}><span>{record.nom_ca || record.nom_es || record.nom_en || 'Línia sense text en català'}{!isActive(record.actiu) && <small> Ocult</small>}</span><button className="secondary" onClick={() => choose(table, record)}>Editar</button></li>
  return <main className="botic-admin">
    <header><a href="/ca/" aria-label="Tornar a Bo.TiC">Bo·TiC</a><span>Menús i avisos</span>{session && <button className="secondary" onClick={() => run(async () => { await adminRequest({ action: 'logout', token: session }); setSession(null); setSnapshot(null); setEdit(null) })}>Sortir</button>}</header>
    {error && <p className="admin-error" role="alert">{error}</p>}{message && <p className="admin-success" role="status">{message}</p>}
    {!session ? <form className="admin-login" onSubmit={login}><p className="admin-kicker">ESPAI PRIVAT</p><h1>La vostra carta,<br />al vostre ritme.</h1><p>Editeu els menús i els avisos de Bo.TiC.</p><label>Usuari<input name="user" autoComplete="username" required /></label><label>Contrasenya<input name="password" type="password" autoComplete="current-password" required /></label><button disabled={busy}>{busy ? 'Entrant…' : 'Entrar'}</button></form> : edit ? <EditRecord key={`${edit.table}-${edit.record.id}`} {...edit} onSave={save} busy={busy} onCancel={() => setEdit(null)} /> : <>
      <div className="admin-heading"><div><p className="admin-kicker">CONTINGUTS DEL WEB</p><h1>Menús i avisos</h1></div><button className="secondary" disabled={busy} onClick={() => run(async () => { const r = await adminRequest({ action: 'read', token: session }); setSnapshot(r.snapshot) })}>Recarregar dades</button></div>
      <nav className="admin-tabs" aria-label="Contingut a editar">{snapshot.data.menus.map(m => <button key={m.id} aria-pressed={menu === m.id} onClick={() => setMenu(m.id)}>{m.nom_ca}</button>)}<button aria-pressed={menu === 'avisos'} onClick={() => setMenu('avisos')}>Avisos</button></nav>
      {menu === 'avisos' ? <section><h2>Avisos a la web</h2><p>Activa un avís i escull quan ha d’aparèixer. Les dates són opcionals.</p><ul className="admin-rows">{snapshot.data.avisos.map(r => row('avisos', r))}</ul></section> : <>
        <ul className="admin-rows">{snapshot.data.menus.filter(m => m.id === menu).map(m => <li key={m.id}><span>{m.nom_ca} · {m.preu} €</span><button className="secondary" onClick={() => choose('menus', m)}>Preu i nom del menú</button></li>)}</ul>
        {snapshot.data.seccions.filter(s => s.menu_id === menu).sort((a,b) => a.ordre - b.ordre).map(s => <section key={s.id} className="admin-section"><div className="admin-heading"><h2>{s.nom_ca}</h2><button className="secondary" onClick={() => choose('seccions', s)}>Editar secció</button></div>{snapshot.data.grups.filter(g => g.seccio_id === s.id && g.menu_id === menu).sort((a,b) => a.ordre - b.ordre).map(g => <details key={g.id}><summary>{g.nom_ca}{!isActive(g.actiu) && ' · Ocult'}</summary><button className="secondary" onClick={() => choose('grups', g)}>Editar títol del plat / grup</button><ul className="admin-rows">{snapshot.data.plats.filter(p => p.grup_id === g.id && p.menu_id === menu).sort((a,b) => a.ordre - b.ordre).map(p => row('plats', p))}</ul></details>)}</section>)}
      </>}
      <p className="admin-help">Aquest panell actualitza la web de Bo.TiC. Els productes, preus i reserves de Restoo es gestionen a Restoo.</p>
    </>}
  </main>
}
