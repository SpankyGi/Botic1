import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { LANGS, ROUTE_SLUGS } from '../src/i18n/routes.js'

// Check actual built HTML, not just the React source or client-side metadata.
const base = 'https://bo-tic.com'
const pages = ['home', 'chefTable', 'videos', 'identity', 'restaurant', 'gastronomia', 'menus', 'experiencia', 'reserves', 'legal', 'privacy', 'cookies', 'preferences']
const titles = new Set()
const sitemap = await readFile('dist/sitemap.xml', 'utf8')
const attrs = tag => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]))
const links = html => [...html.matchAll(/<link\b[^>]*>/g)].map(m => attrs(m[0]))
const metas = html => [...html.matchAll(/<meta\b[^>]*>/g)].map(m => attrs(m[0]))
const exists = async path => { try { await access(path); return true } catch { return false } }
let count = 0
for (const lang of LANGS) {
  for (const key of pages) {
    const path = `/${lang}/${key === 'home' ? '' : `${ROUTE_SLUGS[lang][key]}/`}`
    const html = await readFile(`dist${path}index.html`, 'utf8')
    const meta = metas(html)
    const title = html.match(/<title>(.*?)<\/title>/s)?.[1]
    assert(title, `${path}: missing title`)
    if (key !== 'preferences') {
      assert(!titles.has(`${lang}:${title}`), `${path}: duplicate title`)
      titles.add(`${lang}:${title}`)
    }
    assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: H1 count`)
    assert(html.includes(`<html lang="${lang}">`), `${path}: language`)
    assert.equal(meta.filter(m => m.name === 'description').length, 1, `${path}: description count`)
    assert(meta.find(m => m.name === 'description').content, `${path}: empty description`)
    const canonicalKey = key === 'preferences' ? 'cookies' : key
    const canonical = `${base}/${lang}/${canonicalKey === 'home' ? '' : `${ROUTE_SLUGS[lang][canonicalKey]}/`}`
    assert.deepEqual(links(html).filter(l => l.rel === 'canonical').map(l => l.href), [canonical], `${path}: canonical`)
    const alternates = links(html).filter(l => l.hreflang)
    assert.equal(alternates.length, 5, `${path}: alternates count`)
    for (const alternate of alternates) {
      assert.equal(new URL(alternate.href).origin, base)
      assert(await exists(`dist${new URL(alternate.href).pathname}index.html`), `${path}: missing alternate`)
    }
    const noindex = ['legal', 'privacy', 'preferences'].includes(key)
    assert.equal(meta.find(m => m.name === 'robots')?.content, noindex ? 'noindex, follow' : 'index, follow', `${path}: robots`)
    assert.equal(sitemap.includes(`<loc>${base}${path}</loc>`), !noindex, `${path}: sitemap eligibility`)
    for (const image of [...html.matchAll(/<img\b[^>]*>/g)].map(m => attrs(m[0]))) {
      assert('alt' in image, `${path}: image missing alt`)
    }
    for (const tag of html.matchAll(/<(?:img|source|script|a)\b[^>]*>/g)) {
      const a = attrs(tag[0])
      for (const value of [a.src, a.href, ...((a.srcSet || a.srcset || '').split(',').map(v => v.trim().split(' ')[0]))].filter(Boolean)) {
        if (!value.startsWith('/') || value.startsWith('//')) continue
        const asset = decodeURI(new URL(value, base).pathname)
        assert(await exists(`dist${asset}`) || await exists(`dist${asset}/index.html`), `${path}: missing ${asset}`)
      }
    }
    for (const socialImage of meta.filter(m => m.property === 'og:image' || m.name === 'twitter:image')) {
      assert(await exists(`dist${new URL(socialImage.content).pathname}`), `${path}: social image`)
    }
    const schemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(m => JSON.parse(m[1]))
    if (key === 'restaurant') {
      const restaurant = schemas.flatMap(s => s['@graph'] || []).find(s => s['@type'] === 'Restaurant')
      assert.equal(restaurant?.address.streetAddress, 'Av. Costa Brava, 6', `${path}: restaurant schema`)
    }
    if (key === 'menus') assert.equal(schemas.find(s => s['@type'] === 'FAQPage')?.mainEntity.length, 9, `${path}: FAQ schema`)
    count++
  }
}
const notFound = await readFile('dist/404.html', 'utf8')
assert(metas(notFound).some(m => m.name === 'robots' && m.content.startsWith('noindex')))
assert(!links(notFound).some(l => l.rel === 'canonical' || l.hreflang))
assert.equal((sitemap.match(/<loc>/g) || []).length, pages.filter(key => !['legal', 'privacy', 'preferences'].includes(key)).length * LANGS.length)
console.log(`SEO checks passed: ${count} localized pages, ${(sitemap.match(/<loc>/g) || []).length} sitemap URLs, 404, assets, links and JSON-LD.`)
