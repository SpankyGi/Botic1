import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import { getOfficialMenus } from '../src/data/officialMenus.js'
import { activeNotices } from '../src/services/notices.js'
const source = await readFile('src/hooks/useMenusData.js', 'utf8')
const helpers = source.slice(source.indexOf('const _ok'), source.indexOf('// ─── Hook')).replace('export function', 'function')
const ctx = vm.createContext({})
vm.runInContext(helpers, ctx)
const data = JSON.parse(await readFile('src/data/generated/menus.json', 'utf8'))
const live = process.argv[2] ? JSON.parse(await readFile(process.argv[2], 'utf8')) : null
const content = menus => menus.map(m => ({id:m.id,price:String(m.price),sections:m.sections.map(s=>({title:s.title,groups:s.groups.map(g=>({title:g.title,items:g.items.map(i=>({name:i.name,description:i.description || ''}))}))}))}))
for (const lang of ['ca','es','fr','en']) {
  assert.deepEqual(JSON.parse(JSON.stringify(content(ctx.normalizeMenus(data,lang)))), content(getOfficialMenus(lang)), lang)
  if (live) assert.deepEqual(JSON.parse(JSON.stringify(content(ctx.normalizeMenus(live,lang)))), content(getOfficialMenus(lang)), `Live Sheets: ${lang}`)
}
const n = {actiu:'CERT',nom_ca:'Avís',inici:'2026-10-10',fi:'2026-10-10'}
assert.equal(activeNotices([n],new Date('2026-10-09T21:59:00Z')).length,0)
assert.equal(activeNotices([n],new Date('2026-10-09T22:00:00Z')).length,1)
assert.equal(activeNotices([n],new Date('2026-10-10T22:00:00Z')).length,0)
assert.equal(activeNotices([{...n,actiu:'FALS'}],new Date('2026-10-10T10:00:00Z')).length,0)
new vm.Script(await readFile('docs/bo-tic-admin.gs','utf8'))
assert.match(await readFile('dist/admin/index.html','utf8'), /noindex, nofollow/)
assert.doesNotMatch(await readFile('dist/sitemap.xml','utf8'), /\/admin/)
console.log('PASS: menus match current code in 4 languages; notice date boundaries; admin syntax and noindex.')
