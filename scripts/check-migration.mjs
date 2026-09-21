import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'

const map = JSON.parse(await readFile('docs/migration-url-map.json', 'utf8'))
const apache = await readFile('public/.htaccess', 'utf8')
const redirects = apache.split('\n').filter(line => /^RewriteRule .*\[R=301,L(?:,QSD)?\]/.test(line))
  .map(line => { const [, pattern, target] = line.split(/\s+/); return { pattern: new RegExp(pattern), target } })
let checked = 0
for (const entry of map) {
  if (entry.status === 'DECISION_REQUIRED') continue
  if (entry.status === '410') {
    const gone = apache.split('\n').filter(line => line.trim().endsWith('[G,L]'))
      .some(line => new RegExp(line.split(/\s+/)[1]).test(entry.source.slice(1)))
    assert(gone, `Missing retirement rule: ${entry.source}`)
    checked++
    continue
  }
  if (entry.status === '301') {
    for (const path of new Set([entry.source, entry.source.replace(/\/$/, '') || '/'])) {
      const rule = redirects.find(rule => !rule.target.includes('%{') && rule.pattern.test(path.slice(1)))
      assert.equal(rule?.target, entry.target, `Missing redirect: ${path}`)
    }
    const loop = redirects.find(rule => !rule.target.includes('%{') && rule.pattern.test(entry.target.slice(1)))
    assert(!loop, `Redirect chain or loop: ${entry.source}`)
  }
  if (!entry.target.startsWith('https://')) await access(`dist${entry.target}${entry.target.endsWith('/') ? 'index.html' : ''}`)
  checked++
}
for (const lang of ['ca', 'es', 'en', 'fr']) {
  const slug = { ca: 'reserves', es: 'reservas', en: 'reservations', fr: 'reservations' }[lang]
  const html = await readFile(`dist/${lang}/${slug}/index.html`, 'utf8')
  assert(html.includes(`https://bo-tic.myrestoo.net/${lang}/reservar`))
  assert(html.includes(`https://bo-tic.myrestoo.net/${lang}/tienda`))
  assert(!html.includes('data-netlify'), 'Nonfunctional reservation form must not be published')
}
console.log(`Migration checks passed: ${checked} public URLs. ${map.filter(row => row.status === 'DECISION_REQUIRED').length} commerce/account URLs require a decision before launch. Live HTTP redirect checks still required.`)
const imageMap = JSON.parse(await readFile('docs/migration-image-map.json', 'utf8'))
for (const entry of imageMap) {
  const rule = redirects.find(rule => !rule.target.includes('%{') && rule.pattern.test(entry.source.slice(1)))
  assert.equal(rule?.target, entry.target, `Missing legacy image redirect: ${entry.source}`)
  assert(entry.target.endsWith('.webp'))
  await access(`dist${entry.target}`)
}
console.log(`Legacy image redirects checked: ${imageMap.length} original images preserved as WebP.`)
