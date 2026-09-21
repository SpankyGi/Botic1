import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'

for (const lang of ['ca', 'es', 'en', 'fr']) {
  const html = await readFile(`dist/${lang}/index.html`, 'utf8')
  const schemas = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].flatMap(m => JSON.parse(m[1])['@graph'] || [])
  const restaurant = schemas.find(s => s['@type'] === 'Restaurant')
  assert.equal(restaurant?.address.streetAddress, 'Av. Costa Brava, 6')
  assert.equal(restaurant.geo.latitude, 41.987884)
  assert(restaurant.sameAs.includes('https://www.instagram.com/restaurantbo.tic/'))
  assert(restaurant.menu.endsWith('/'))
  assert(schemas.some(s => s['@type'] === 'WebSite'))
  assert.equal((html.match(/class="hero-gallery-image"/g) || []).length, 1, 'Only one initial hero image')
  assert(!html.includes('id="preloader"'))
  assert(html.includes('class="skip-link"'))
  assert(!/fonts\.(googleapis|gstatic)\.com/.test(html))
  assert(!/masia|masía|farmhouse|ferme réhabilitée/.test(html))
}
let pages = 0
async function inspect(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${e.name}`
    if (e.isDirectory()) await inspect(path)
    else if (e.name === 'index.html' && path !== 'dist/index.html') {
      const html = await readFile(path, 'utf8')
      for (const [, href] of html.matchAll(/href="(\/(?:ca|es|en|fr)(?:\/[^"?#]*)?)(?:[?#][^"]*)?"/g)) {
        assert(href.endsWith('/'), `${path}: noncanonical internal link ${href}`)
        assert(!href.includes('//'), `${path}: double slash ${href}`)
      }
      pages++
    }
  }
}
await inspect('dist')
console.log(`Launch audit checks passed: four home schemas, immediate single-image hero, local fonts, corrected history, canonical links across ${pages} pages.`)
